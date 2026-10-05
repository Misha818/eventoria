Installs all you need to run your flask app
pip install -r requirements.txt

==========================================

MULTILINGUAL SITE WITH FLASK BABEL
https://python-babel.github.io/flask-babel/

# Install Flask Babel
pip install Flask-Babel

# Directories
# Create /translations directory at the root of the project

# Create /lg directory for each supported language (e.g. /en, /hy,…)

# Create /LC_MESSAGES folder under each supported language add & configure babel.cfg file at the root of the project
[jinja2: templates/**.html]
[python: **.py]

# Extract text strings from our HTML templates and .py files
# It creates a messages.pot file
pybabel extract -F babel.cfg -o messages.pot . 

# Then initialize language translation files, it will create a .po file, here for Armenian (hy)
pybabel init -i messages.pot -d translations -l hy

# Note: if you want to later update the .po file after creating a new messages.pot file
pybabel update -d translations -i messages.pot -l fr

# Translate the strings
# Then translate all the msgid entries in the .po file as msgstr


# Finally, compile the .po file to a .mo file
pybabel compile -d translations

# Don't forget to import babel as shown in our boilerplate
# from flask_babel import Babel, _,lazy_gettext as _l, gettext

============================================================
DATABASE INSTALATION

Restore the database from the dump. Open the CMD in current folder and run the following command
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS eventoria_db"
mysql -u root -p eventoria_db < Dump.sql

==============================================================
Ngnx image dir permissions.

# recursively hand ownership to your service user
sudo chown -R www-data:www-data /var/www/eventoria/static/images

# directories need `+x` so they can be entered
sudo find /var/www/eventoria/static/images -type d -exec chmod 755 {} \;

# files only need read/write
sudo find /var/www/eventoria/static/images -type f -exec chmod 644 {} \;


-------------------

# Make www-data own the folder (and everything inside)
sudo chown -R www-data:www-data /var/www/eventoria/static/images

# Give owner (www-data) and group (www-data) read/write/execute,
# others read/execute only:
sudo chmod -R 775 /var/www/eventoria/static/images


======================

# 1. Update your remote‐tracking branch
<!-- git fetch origin -->
sudo -u eventoria git fetch origin

# 2. Discard any staged changes in templates/ and reset them to origin/main
sudo -u eventoria git restore --source=origin/main --staged -- templates/
sudo -u eventoria git restore --source=origin/main --staged -- static/css/styles.css
<!-- sudo -u eventoria git restore --source=origin/main --staged --worktree -- templates/ -->

# 3. Discard any unstaged (working‐tree) changes in templates/
git restore --source=origin/main -- templates/

======================

# Instal and run redis server

sudo apt update
sudo apt install redis-server

sudo systemctl enable redis-server
sudo systemctl start  redis-server
======================

# Content-Security-Policy (templates and JavaScript rules)

The app sends a strict CSP header (see CSP_POLICY in app.py). The browser only runs
scripts that carry this request's nonce, so:

- Every <script> tag needs the nonce, inline or external:
  <script nonce="{{ csp_nonce() }}">...</script>
  <script nonce="{{ csp_nonce() }}" src="..."></script>

- Inline event handlers (onclick="...", onchange="...") do not run. Use addEventListener,
  or the declarative attributes handled by static/JS/security.js:
  <i data-onclick='["sortTable", "$this", 0, "up"]'></i>
  <select data-onchange='["navigate", "/setlang?lang=", "$value"]'>
  A function called this way must be a global function AND be listed in
  ALLOWED_ACTIONS in static/JS/security.js.

- Server data placed into innerHTML / HTML template strings goes through
  escapeHtml(value); server answers (response.answer) through safeMessage(answer).
  Plain text is better set with element.textContent.

- Server data embedded in a script: JSON.parse({{ jsonString | tojson }}),
  never JSON.parse(`{{ jsonString|safe }}`).

- New external CSS/fonts/APIs must be added to the matching directive in CSP_POLICY.

To find violations without blocking anything, set CSP_REPORT_ONLY=1 in .env:
the browser console then lists what would have been blocked.

======================

# Database connection pool (eventoria_db.py)

Each gunicorn worker is a separate process with its own pool, so the server opens up to

    workers x MYSQL_POOL_SIZE   database connections

and that must stay below MySQL's max_connections (151 by default; check with
SHOW VARIABLES LIKE 'max_connections';). Leave some room for admin tools and cron jobs.

Optional .env settings:
- MYSQL_POOL_SIZE    (default 5)  connections per process. A sync gunicorn worker handles
                                  one request at a time and a request uses one connection,
                                  so 5 workers x 5 = 25 connections is plenty.
- MYSQL_POOL_TIMEOUT (default 10) seconds a request waits for a free connection; after that
                                  the visitor gets "server busy" (HTTP 503) instead of the
                                  worker hanging. Errors are logged as
                                  "No free database connection after ...".

If you add more workers or switch to threaded workers (--threads N), raise the pool size
so that pool size >= threads per worker, and keep workers x pool size under max_connections.

======================

# Rate limiting (login) and the visitor's real IP

Login limits (LOGIN_ATTEMPTS_PER_IP / LOGIN_FAILURES_PER_ACCOUNT in app.py; viewing the
login page is not counted):
- 5 login attempts per minute per visitor IP.
- 10 failed passwords per account per 15 minutes, whatever IP they come from. After that
  every login to that account is refused until the 15 minutes pass (even with the right
  password), which stops password guessing spread over many IPs. Only attempts that passed
  the Turnstile human check and then had a wrong password count, so an account cannot be
  locked just by sending junk requests. To unlock an account early, delete its counter in
  Redis (keys containing "login-user:<username>") or wait.

Production .env settings:

- RATELIMIT_STORAGE_URI=redis://localhost:6379/1
  Counters are stored in Redis so all gunicorn workers share them. Without it (default
  "memory://") each worker counts on its own and "5 per minute" becomes 5 per worker.
  If Redis goes down, the app keeps working and falls back to per-worker counting.
  (Redis install steps are above.)

- PROXY_COUNT=<number of proxies in front of the app>
  Behind nginx, every request seems to come from 127.0.0.1, so all visitors would share
  one limit (and Turnstile would get the wrong IP). The app reads the real IP from
  X-Forwarded-For when this is set:
    0  app reached directly (local development, default)
    1  nginx only
    2  Cloudflare -> nginx (current production setup)
  Never set it higher than the real number of proxies: visitors could then fake their IP.
  With 2, also make sure the server only accepts web traffic from Cloudflare's IP ranges
  (firewall), otherwise someone hitting the server IP directly can fake X-Forwarded-For.

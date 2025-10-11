# from datetime import datetime, timezone, timedelta
# session = {}
# session['started_at'] = '2025-10-11 11:05:27.673365+00:00'


# # later in your code
# def is_session_expired(session):
#     now = datetime.now(timezone.utc)
#     elapsed = now - session['started_at']
#     return elapsed > timedelta(minutes=15)


# # return (datetime.now(timezone.utc) - session['started_at']) > timedelta(minutes=15)
# print(datetime.now(timezone.utc) - session['started_at']) > timedelta(minutes=15)


# from datetime import datetime, timezone, timedelta

# session = {}
# session['started_at'] = '2025-10-11 11:05:27.673365+00:00'

# def is_session_expired(session):
#     started_at = datetime.fromisoformat(session['started_at'])
#     now = datetime.now(timezone.utc)
#     elapsed = now - started_at
#     return elapsed > timedelta(minutes=1)

# print(is_session_expired(session))


session_expired is False
New Date is 2025-10-11 11:31:41.100856+00:00

session_expired is False
Old Date is 2025-10-11 11:31:41+00:00
New Date is 2025-10-11 11:33:19.609270+00:00




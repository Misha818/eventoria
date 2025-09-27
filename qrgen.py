from PIL import Image, ImageDraw, ImageFont
from PIL import Image as _PIL_Image
import hashlib
import os

# --- canvas ---
W, H = 900, 1200
img = Image.new("RGB", (W, H), (255,255,255))
draw = ImageDraw.Draw(img)

def rr(xy, radius=18, outline=(210,210,210), width=2, fill=(255,255,255)):
    draw.rounded_rectangle(xy, radius, outline=outline, width=width, fill=fill)

def load_font(size, bold=False):
    for name in ["DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf",
                 "Arial Bold.ttf" if bold else "Arial.ttf",
                 "LiberationSans-Bold.ttf" if bold else "LiberationSans-Regular.ttf"]:
        try:
            return ImageFont.truetype(name, size)
        except:
            pass
    return ImageFont.load_default()

F_LABEL = load_font(52)
F_TEXT  = load_font(52)
F_BOLD  = load_font(56, bold=True)
F_CAP   = load_font(48)

# --- card 1: details ---
pad = 36
card1 = (pad, 80, W-pad, 560)
rr(card1, radius=22, outline=(205,205,205))
draw.line((card1[0], card1[1]+88, card1[2], card1[1]+88), fill=(230,230,230), width=2)

xL = card1[0] + 24
xV = xL + 130
y  = card1[1] + 20
draw.text((xL, y), "Order", font=F_LABEL, fill=(75,75,75))
draw.text((xL, y+36), "ID:", font=F_LABEL, fill=(75,75,75))
draw.text((xV, y+18), "35-T75JIZV", font=F_BOLD, fill=(50,50,50))

rows = [
    ("Resort:", "Demo Ski!"),
    ("Date:", "06/04/2018 11:15:08 (+02:00 GMT)"),
    ("Amount:", "260.00 SEK"),
    ("Status:", "Completed"),
    ("System:", "Skiperformance E-commerce platform"),
    ("Notes:", "Add note"),
]
y = card1[1] + 110
for label, value in rows:
    draw.text((xL, y), label, font=F_LABEL, fill=(75,75,75))
    if label == "Status:":
        draw.text((xV, y), value, font=F_BOLD, fill=(28,136,55))
    elif label == "Notes:":
        draw.text((xV, y), value, font=F_TEXT, fill=(45,86,160))
    else:
        draw.text((xV, y), value, font=F_TEXT, fill=(55,55,55))
    y += 54

# --- card 2: QR ---
card2 = (pad, 600, W-pad, H-60)
rr(card2, radius=22, outline=(225,225,225))

qr_size = 280
try:
    import qrcode
    qr = qrcode.QRCode(box_size=6, border=1)
    qr.add_data("https://demo.example.com/ticket/35-T75JIZV")
    qr.make(fit=True)
    qri = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    qri = qri.resize((qr_size, qr_size), _PIL_Image.Resampling.NEAREST)
except Exception:
    grid, scale = 29, qr_size//29
    qri = Image.new("RGB", (grid*scale, grid*scale), "white")
    qd = ImageDraw.Draw(qri)
    data = hashlib.sha1(b"https://demo.example.com/ticket/35-T75JIZV").digest()*20
    bits, k = ''.join(f"{b:08b}" for b in data), 0
    for gy in range(grid):
        for gx in range(grid):
            if (gx<7 and gy<7) or (gx>grid-8 and gy<7) or (gx<7 and gy>grid-8):
                fill = "black"
            else:
                fill = "black" if bits[k]=='1' else "white"; k += 1
            x0, y0 = gx*scale, gy*scale
            qd.rectangle((x0, y0, x0+scale-1, y0+scale-1), fill=fill)

qr_x = card2[0] + (card2[2]-card2[0]-qri.width)//2
qr_y = card2[1] + 40
img.paste(qri, (qr_x, qr_y))

cap = "Scan this code to enter!"
bbox = draw.textbbox((0,0), cap, font=F_CAP)
draw.text(((W - (bbox[2]-bbox[0]))//2, qr_y + qri.height + 30), cap, font=F_CAP, fill=(95,95,95))

basedir = os.path.abspath(os.path.dirname(__file__))
filename = "ticket2.jpg"
imgPath = os.path.join(basedir, 'static', 'images', 'qr_ticets', filename)

img.save(imgPath, "JPEG", quality=92)
print(f"Saved {filename}")

from PIL import Image, ImageDraw, ImageFont
import os
import sys

# --- Canvas setup ---
W, H = 900, 1200
img = Image.new("RGB", (W, H), (255, 255, 255))
draw = ImageDraw.Draw(img)
basedir = os.path.abspath(os.path.dirname(__file__))

def draw_rounded_rect(xy, radius=18, outline=(210, 210, 210), width=2, fill=(255, 255, 255)):
    """Helper function to draw rounded rectangle"""
    draw.rounded_rectangle(xy, radius, outline=outline, width=width, fill=fill)

def load_font(size, bold=False):
    """Load font with multiple fallback options and better error handling"""
    
    # List of font paths to try (add your system's font paths here)
    font_paths = [
        # Windows fonts
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/Arial.ttf",
        "C:/Windows/Fonts/ArialBold.ttf" if bold else "C:/Windows/Fonts/Arial.ttf",
        "C:/Windows/Fonts/calibri.ttf",
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf",
        
        # Mac fonts
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Avenir.ttc",
        
        # Linux fonts
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        
        # Generic names (might work with PIL's font finder)
        "arial.ttf",
        "Arial.ttf",
        "helvetica.ttf",
        "DejaVuSans.ttf",
    ]
    
    # Try each font path
    for font_path in font_paths:
        try:
            font = ImageFont.truetype(font_path, size)
            print(f"✓ Loaded font: {font_path} at size {size}")
            return font
        except:
            continue
    
    # If no TrueType fonts work, try to use default and scale it
    try:
        # Try PIL's default font with size hint
        default = ImageFont.load_default()
        print(f"⚠ Using default font (size may not scale properly)")
        
        # Try to create a bitmap font at larger size
        if size > 20:
            # This is a workaround - we'll just use the default
            # but warn the user
            print(f"⚠ WARNING: Default font doesn't scale well. Text may appear small.")
            print(f"  To fix this, install TrueType fonts or specify font path.")
        return default
    except:
        print(f"⚠ Failed to load any font, using basic default")
        return ImageFont.load_default()

# ========================================
# FONT SIZE CONFIGURATION - VERY LARGE SIZES
# ========================================
print("\n" + "="*60)
print("LOADING FONTS...")
print("="*60)

F_LABEL = load_font(26)           # Labels (Order:, Resort:, etc.)
F_TEXT = load_font(28)            # Regular text values  
F_BOLD = load_font(30, bold=True) # Bold text (amounts, status)
F_TITLE = load_font(34, bold=True)# Title text (Order ID)
F_CAP = load_font(28)             # Caption under QR
F_URL = load_font(24)             # URL text

print("="*60 + "\n")

# --- CARD 1: Order Details ---
pad = 36
card1_coords = (pad, 60, W - pad, 720)  # Increased height for larger text
draw_rounded_rect(card1_coords, radius=20, outline=(180, 180, 180), width=3, fill=(255, 255, 255))

# Draw separator line
sep_y = card1_coords[1] + 130  # More space for header
draw.line((card1_coords[0] + 20, sep_y, card1_coords[2] - 20, sep_y), 
          fill=(220, 220, 220), width=3)

# Column positions - adjusted for larger text
label_x = card1_coords[0] + 40
value_x = label_x + 200  # More space between columns

# Draw Logo and Company Name Header
basedir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else os.getcwd()
y_pos = card1_coords[1] + 20

# Load and paste logo on the left
logo_loaded = False
logo_size = 80  # Height of logo
try:
    # Try to load the logo
    logo_path = os.path.join('static', 'images', 'logo.png')
    logo = Image.open(logo_path)
    
    # Resize logo to fit nicely while maintaining aspect ratio
    logo_aspect = logo.width / logo.height
    logo = logo.resize((int(logo_size * logo_aspect), logo_size), Image.Resampling.LANCZOS)
    
    # Paste logo
    logo_x = card1_coords[0] + 40
    logo_y = y_pos + 10
    
    # If logo has transparency, paste with mask
    if logo.mode in ('RGBA', 'LA'):
        img.paste(logo, (logo_x, logo_y), logo)
    else:
        img.paste(logo, (logo_x, logo_y))
    
    logo_loaded = True
    logo_width = logo.width
    print(f"✓ Logo loaded successfully from {logo_path}")
    
except Exception as e:
    print(f"⚠ Could not load logo: {e}")
    logo_x = card1_coords[0] + 40
    logo_width = 80
    
    # Draw the actual spiral logo design as placeholder
    center_x = logo_x + 40
    center_y = y_pos + 10 + 40
    
    # Draw spiral pattern similar to your logo
    for i in range(12):
        angle = i * 30  # 30 degrees apart
        radius_start = 20
        radius_end = 38
        import math
        # Calculate arc coordinates
        start_angle = angle - 15
        end_angle = angle + 15
        
        # Draw arc
        arc_box = (center_x - radius_end, center_y - radius_end,
                   center_x + radius_end, center_y + radius_end)
        draw.arc(arc_box, start=start_angle, end=end_angle, 
                fill=(20, 20, 20), width=3)
    
    # Draw center circle
    draw.ellipse((center_x - 15, center_y - 15, 
                  center_x + 15, center_y + 15), 
                 fill=(255, 255, 255), outline=(20, 20, 20), width=2)

# Draw Company Name - EVENTORIA (only once, properly aligned)
company_name = "EVENTORIA"
company_font = load_font(60, bold=True)  # Adjusted size to fit better

# Position company name to the right of logo
if logo_loaded:
    company_x = logo_x + logo_width + 40  # Right of logo with spacing
else:
    company_x = logo_x + 80 + 40  # Right of placeholder with spacing

# Vertically center the text with the logo
company_y = y_pos + 10 + (logo_size - 60) // 2 + 10  # Centered with logo

# Draw company name only once
draw.text((company_x, company_y), company_name, font=company_font, fill=(20, 20, 20))
# # Draw Order ID header
# # y_pos = card1_coords[1] + 30
# # draw.text((label_x, y_pos), "Order", font=F_LABEL, fill=(80, 80, 80))
# # draw.text((label_x, y_pos + 55), "ID:", font=F_LABEL, fill=(80, 80, 80))
# # draw.text((value_x, y_pos + 28), "35-T75JIZV", font=F_TITLE, fill=(10, 10, 10))

# # Draw Logo and Company Name Header
# y_pos = card1_coords[1] + 20

# # Load and paste logo on the left
# try:
#     # Try to load the logo
#     logo_path = os.path.join(basedir, 'static', 'images', 'logo.jpg')
#     logo = Image.open(logo_path)
    
#     # Resize logo to fit nicely (adjust size as needed)
#     logo_size = 80  # Height of logo
#     logo_aspect = logo.width / logo.height
#     logo = logo.resize((int(logo_size * logo_aspect), logo_size), Image.Resampling.LANCZOS)
    
#     # Paste logo
#     logo_x = card1_coords[0] + 40
#     logo_y = y_pos + 10
#     img.paste(logo, (logo_x, logo_y))
    
#     # Position for company name (to the right of logo)
#     company_x = logo_x + logo.width + 30
    
# except Exception as e:
#     print(f"⚠ Could not load logo: {e}")
#     # If logo fails, start company name from the left
#     company_x = card1_coords[0] + 40
    
#     # Draw a placeholder circle for logo
#     draw.ellipse((card1_coords[0] + 40, y_pos + 10, 
#                   card1_coords[0] + 120, y_pos + 90), 
#                  outline=(200, 200, 200), width=2)

# # Draw Company Name - EVENTORIA
# # Use larger font for company name
# company_name = "EVENTORIA"
# # company_font = load_font(72, bold=True)
# # draw.text((company_x, y_pos + 25), company_name, font=company_font, fill=(20, 20, 20))
# # For centered company name (alternative):
# company_font = load_font(72, bold=True)
# company_bbox = draw.textbbox((0, 0), company_name, font=company_font)
# company_width = company_bbox[2] - company_bbox[0]
# company_x = (W - company_width) // 2  # Center it
# draw.text((company_x, y_pos + 25), company_name, font=company_font, fill=(20, 20, 20))

# # To align logo and text on the same horizontal line:
# logo_y = y_pos + 10
# company_y = logo_y + (logo_size - 72) // 2  # Center text vertically with logo
# draw.text((company_x, company_y), company_name, font=company_font, fill=(20, 20, 20))

# Order details
details = [
    ("Resort:", "Demo Ski!"),
    ("Date:", "06/04/2018 11:15:08"),
    ("Amount:", "260.00 SEK"),
    ("Status:", "Completed"),
    ("System:", "Skiperformance"),
    ("Notes:", "Add note"),
]

y_pos = sep_y + 45  # Start below separator
line_height = 80    # Large spacing for big text

for label, value in details:
    # Draw label
    draw.text((label_x, y_pos), label, font=F_LABEL, fill=(80, 80, 80))
    
    # Draw value with appropriate styling
    if label == "Status:":
        # Green for completed
        draw.text((value_x, y_pos), value, font=F_BOLD, fill=(0, 150, 0))
    elif label == "Notes:":
        # Blue for link
        draw.text((value_x, y_pos), value, font=F_TEXT, fill=(0, 100, 200))
        # Underline
        bbox = draw.textbbox((value_x, y_pos), value, font=F_TEXT)
        draw.line((bbox[0], bbox[3] + 3, bbox[2], bbox[3] + 3), fill=(0, 100, 200), width=2)
    elif label == "Amount:":
        # Bold for amount
        draw.text((value_x, y_pos), value, font=F_BOLD, fill=(10, 10, 10))
    else:
        # Regular text
        draw.text((value_x, y_pos), value, font=F_TEXT, fill=(40, 40, 40))
    
    y_pos += line_height

# --- CARD 2: QR Code ---
card2_coords = (pad, 770, W - pad, H - 50)
draw_rounded_rect(card2_coords, radius=20, outline=(180, 180, 180), width=3, fill=(255, 255, 255))

# Generate QR Code
qr_size = 260  # QR code size
qr_url = "www.eventoria.am/ticket/paramkjdfhkjdsbjkhj2"
footer_text = "www.eventoria.am"

# Try to use qrcode library
qr_generated = False
try:
    import qrcode
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,  
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=3,
    )
    qr.add_data(qr_url)
    qr.make(fit=True)
    
    # Generate image
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_img = qr_img.convert("RGB")
    
    # Resize if needed
    if qr_img.size[0] != qr_size:
        qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    
    qr_generated = True
    print("✓ QR code generated successfully")
    
except ImportError:
    print("⚠ qrcode library not installed.")
    print("  To get a scannable QR code, run: pip install qrcode[pil]")
    
    # Create placeholder QR pattern
    qr_img = Image.new("RGB", (qr_size, qr_size), "white")
    qr_draw = ImageDraw.Draw(qr_img)
    
    # Basic QR structure
    block = qr_size // 21
    
    # Finder patterns
    def draw_finder(x, y):
        # Outer square
        qr_draw.rectangle((x, y, x + 7*block, y + 7*block), fill="black")
        # Inner white
        qr_draw.rectangle((x + block, y + block, x + 6*block, y + 6*block), fill="white")
        # Center black
        qr_draw.rectangle((x + 2*block, y + 2*block, x + 5*block, y + 5*block), fill="black")
    
    draw_finder(0, 0)
    draw_finder((21-7)*block, 0)
    draw_finder(0, (21-7)*block)
    
    # Timing patterns
    for i in range(8, 13):
        if i % 2 == 0:
            qr_draw.rectangle((i*block, 6*block, (i+1)*block, 7*block), fill="black")
            qr_draw.rectangle((6*block, i*block, 7*block, (i+1)*block), fill="black")
    
    # Random data for appearance
    import random
    random.seed(42)
    for x in range(8, 13):
        for y in range(8, 13):
            if random.random() > 0.5:
                qr_draw.rectangle((x*block, y*block, (x+1)*block, (y+1)*block), fill="black")

# Center QR code
qr_x = (W - qr_size) // 2
qr_y = card2_coords[1] + 35
img.paste(qr_img, (qr_x, qr_y))

# Caption below QR
caption = "Scan this code to enter!"
caption_bbox = draw.textbbox((0, 0), caption, font=F_CAP)
caption_x = (W - (caption_bbox[2] - caption_bbox[0])) // 2
caption_y = qr_y + qr_size + 20
draw.text((caption_x, caption_y), caption, font=F_CAP, fill=(50, 50, 50))

# URL below caption
url_bbox = draw.textbbox((0, 0), qr_url, font=F_URL)
url_bbox_footer = draw.textbbox((0, 0), footer_text, font=F_URL)
url_x = (W - (url_bbox[2] - url_bbox[0])) // 2
footer_x = (W - (url_bbox_footer[2] - url_bbox_footer[0])) // 2
draw.text((footer_x, caption_y + 80), footer_text, font=F_URL, fill=(100, 100, 100))

# Save image
basedir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else os.getcwd()
output_dir = os.path.join(basedir, 'static', 'images', 'qr_tickets')
os.makedirs(output_dir, exist_ok=True)

# Save files
filename_jpg = "ticket_enhanced.jpg"
filename_png = "ticket_enhanced.png"

jpg_path = os.path.join(output_dir, filename_jpg)
png_path = os.path.join(output_dir, filename_png)

img.save(jpg_path, "JPEG", quality=98)
img.save(png_path, "PNG")

# Also save in current directory
img.save("ticket_output.png", "PNG")
img.save("ticket_output.jpg", "JPEG", quality=98)

print("\n" + "="*60)
print("TICKET GENERATED SUCCESSFULLY!")
print("="*60)
print(f"✓ Saved to: {jpg_path}")
print(f"✓ Also saved as: ticket_output.png in current directory")
print("="*60)

# Font debugging info
print("\nFONT TROUBLESHOOTING:")
print("-"*60)
print("If text appears small, it means TrueType fonts couldn't be loaded.")
print("\nSOLUTIONS:")
print("1. Install Pillow with full font support:")
print("   pip install --upgrade Pillow")
print("\n2. On Linux/Mac, install fonts:")
print("   Ubuntu/Debian: sudo apt-get install fonts-liberation fonts-dejavu")
print("   Mac: Fonts should be available in /System/Library/Fonts/")
print("\n3. On Windows, specify exact font path:")
print('   Example: ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 60)')
print("\n4. Download and use a specific TTF file:")
print("   Place a .ttf file in your project folder and reference it directly")
print("="*60)
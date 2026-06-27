import os
import base64
from io import BytesIO
from PIL import Image, ImageEnhance, ImageDraw

def generate_all():
    portrait_path = "../email-signature-zuzanna/assets/portrait_orig.jpg"
    if not os.path.exists(portrait_path):
        print("Error: portrait_orig.jpg not found")
        return

    orig = Image.open(portrait_path).convert("RGB")

    # 1. Base square crop around face (900x900 from x=153, y=50)
    crop_box = (153, 50, 153 + 900, 50 + 900)
    cropped = orig.crop(crop_box)
    base_512 = cropped.resize((512, 512), Image.Resampling.LANCZOS)

    # Enhancement
    sepia_color = Image.new("RGB", (512, 512), (220, 200, 170))
    base_512 = Image.blend(base_512, sepia_color, 0.08)
    enhancer = ImageEnhance.Contrast(base_512)
    base_512 = enhancer.enhance(1.05)

    # Circle mask for circular icons
    mask_hr = Image.new("L", (2048, 2048), 0)
    draw_hr = ImageDraw.Draw(mask_hr)
    draw_hr.ellipse((0, 0, 2047, 2047), fill=255)
    mask_512 = mask_hr.resize((512, 512), Image.Resampling.LANCZOS)

    circle_512 = base_512.convert("RGBA")
    circle_512.putalpha(mask_512)

    # --- Save favicon.ico ---
    circle_48 = circle_512.resize((48, 48), Image.Resampling.LANCZOS)
    circle_48.save("favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Created favicon.ico")

    # --- Save favicon-48x48.png ---
    circle_48.save("favicon-48x48.png", "PNG")
    print("Created favicon-48x48.png")

    # --- Save apple-touch-icon.png (180x180 full bleed square) ---
    base_180 = base_512.resize((180, 180), Image.Resampling.LANCZOS)
    base_180.save("apple-touch-icon.png", "PNG")
    print("Created apple-touch-icon.png")

    # --- Save web-app-icon-192x192.png ---
    circle_192 = circle_512.resize((192, 192), Image.Resampling.LANCZOS)
    circle_192.save("web-app-icon-192x192.png", "PNG")
    print("Created web-app-icon-192x192.png")

    # --- Save web-app-icon-512x512.png ---
    circle_512.save("web-app-icon-512x512.png", "PNG")
    print("Created web-app-icon-512x512.png")

    # --- Save web-app-icon-512x512-maskable.png ---
    # For maskable icons, the safe zone is inner 80% circle (radius 204px).
    # Since base_512 is full bleed square, it fills the entire 512x512 square without any transparent gaps!
    # Let's save base_512 as web-app-icon-512x512-maskable.png
    base_512.save("web-app-icon-512x512-maskable.png", "PNG")
    print("Created web-app-icon-512x512-maskable.png")

    # --- Save favicon.svg ---
    # Convert PNG to base64 and embed in SVG with circular clipPath
    buffer = BytesIO()
    circle_512.save(buffer, format="PNG")
    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <clipPath id="circle">
      <circle cx="256" cy="256" r="256" />
    </clipPath>
  </defs>
  <image href="data:image/png;base64,{b64_str}" width="512" height="512" clip-path="url(#circle)" />
</svg>'''
    with open("favicon.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Created favicon.svg")

if __name__ == "__main__":
    generate_all()

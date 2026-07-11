import glob
import os
from PIL import Image

# Target gold color #C5A065 -> RGB (197, 160, 101)
GOLD_R, GOLD_G, GOLD_B = 197, 160, 101

# Mapping of original files to new clean names
mapping = {
    "ChatGPT Image 11 lip 2026, 23_52_12 (3).png": "postulat-users.png",
    "ChatGPT Image 11 lip 2026, 23_52_11 (2).png": "postulat-leaf.png",
    "ChatGPT Image 11 lip 2026, 23_52_12 (4).png": "postulat-cap.png",
    "ChatGPT Image 11 lip 2026, 23_52_11 (1).png": "postulat-bee.png",
    "ChatGPT Image 11 lip 2026, 23_52_12 (5).png": "postulat-landmark.png"
}

for src, dest in mapping.items():
    if not os.path.exists(src):
        print(f"Source file {src} not found!")
        continue
    
    img = Image.open(src).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        r, g, b, a = item
        
        # Calculate brightness / check if it is background (white/gray/checkered)
        # Background is white/light-gray (r > 200, g > 200, b > 200)
        # Also check if it's part of the checkered background (gray squares like 230-240)
        if r > 195 and g > 195 and b > 195:
            # Make it fully transparent
            newData.append((0, 0, 0, 0))
        else:
            # It's part of the line art. Map it to the exact gold color #C5A065.
            # We can preserve the original anti-aliasing (opacity) based on how dark the line is.
            # Brightness of the original pixel: lower means darker line (more opaque), higher means lighter.
            brightness = (r + g + b) / 3
            # Map brightness [0, 195] to alpha [255, 0]
            alpha = int(255 * (1.0 - (brightness / 195.0)))
            alpha = max(0, min(255, alpha))
            
            # Apply target gold color with calculated alpha for smooth anti-aliased borders
            newData.append((GOLD_R, GOLD_G, GOLD_B, alpha))
            
    img.putdata(newData)
    img.save(dest, "PNG")
    print(f"Processed {src} -> {dest}")

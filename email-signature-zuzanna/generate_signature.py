#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

# Set up paths relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(SCRIPT_DIR, "assets")
FONTS_DIR = os.path.join(ASSETS_DIR, "fonts")
ICONS_DIR = os.path.join(ASSETS_DIR, "icons")
UPLOAD_DIR = os.path.join(SCRIPT_DIR, "upload", "email-signature")

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Design Constants
BG_COLOR = (249, 248, 246)  # #F9F8F6 (warm paper background)
BG_HEX = "#F9F8F6"
COLOR_PRIMARY = (26, 46, 40)  # #1A2E28 (deep forest green)
COLOR_SECONDARY = (92, 107, 102)  # #5C6B66 (sage-ish dark green/grey)
COLOR_LIGHT = (115, 130, 125)  # #73827D (darker sage/gray for better contrast and elegance)
COLOR_GOLD = (197, 160, 101)  # #C5A065 (brand gold)

# Animation Settings
TOTAL_FRAMES = 50
FRAME_DELAY = 30  # 30 ms per frame (approx 33 fps)

# Load fonts
FONT_NAME_REG = os.path.join(FONTS_DIR, "CormorantGaramond.ttf")
FONT_NAME_ITALIC = os.path.join(FONTS_DIR, "CormorantGaramond-Italic.ttf")
FONT_SANS = os.path.join(FONTS_DIR, "PlusJakartaSans-Medium.ttf")

# Helper: Draw tracked text
def draw_text_tracked(draw, text, x, y, font, fill, tracking):
    cursor_x = x
    for char in text:
        draw.text((cursor_x, y), char, font=font, fill=fill)
        cursor_x += font.getlength(char) + tracking
    return cursor_x

# Helper: Easing function (ease-out-cubic)
def ease_out_cubic(t):
    return 1.0 - math.pow(1.0 - t, 3.0)

# Main GIF Generation Class
class SignatureAssetGenerator:
    def __init__(self):
        # Load fonts at 3x scale
        self.font_slogan = ImageFont.truetype(FONT_SANS, int(8.5 * 3))
        self.font_name_reg = ImageFont.truetype(FONT_NAME_REG, int(27 * 3))
        self.font_name_italic = ImageFont.truetype(FONT_NAME_ITALIC, int(27 * 3))
        self.font_role = ImageFont.truetype(FONT_NAME_ITALIC, int(14 * 3))
        self.font_links = ImageFont.truetype(FONT_SANS, int(11.5 * 3))
        self.font_quote = ImageFont.truetype(FONT_NAME_ITALIC, int(12 * 3))

    def create_element_frames_v2(self, name, width, height, start_frame, end_frame, draw_callback, slide_dist=12):
        w3x, h3x = width * 3, height * 3
        slide_dist_3x = slide_dist * 3
        frames = []

        # Frame 0: Complete final state
        frame_0_3x = Image.new("RGBA", (w3x, h3x), BG_COLOR + (255,))
        draw_0 = ImageDraw.Draw(frame_0_3x)
        draw_callback(frame_0_3x, draw_0, w3x, h3x)
        
        # Convert to RGB by alpha blending with BG_COLOR
        frame_0_rgb = Image.new("RGB", (w3x, h3x), BG_COLOR)
        frame_0_rgb.paste(frame_0_3x, (0, 0), mask=frame_0_3x.split()[3])
        frame_0 = frame_0_rgb.resize((width, height), Image.Resampling.LANCZOS)
        frames.append(frame_0)

        # Frame 1: Hidden state
        frame_1 = Image.new("RGB", (width, height), BG_COLOR)
        frames.append(frame_1)

        # Frames 2 to 49
        for frame_idx in range(2, TOTAL_FRAMES):
            anim_frame = frame_idx - 2
            
            if anim_frame < start_frame:
                frames.append(frame_1)
            elif anim_frame >= end_frame:
                frames.append(frame_0)
            else:
                t = (anim_frame - start_frame) / (end_frame - start_frame)
                ease_t = ease_out_cubic(t)
                
                # Render content layer with transparent bg
                content_layer = Image.new("RGBA", (w3x, h3x), (0, 0, 0, 0))
                draw_content = ImageDraw.Draw(content_layer)
                draw_callback(content_layer, draw_content, w3x, h3x)
                
                # Apply opacity and vertical offset
                offset_y = int(slide_dist_3x * (1.0 - ease_t))
                
                # Create final 3x canvas
                canvas_3x = Image.new("RGB", (w3x, h3x), BG_COLOR)
                
                # Fade alpha channel
                r, g, b, a = content_layer.split()
                a_faded = a.point(lambda p: int(p * ease_t))
                content_faded = Image.merge("RGBA", (r, g, b, a_faded))
                
                canvas_3x.paste(content_faded, (0, -offset_y), mask=content_faded)
                
                # Downsample
                frame = canvas_3x.resize((width, height), Image.Resampling.LANCZOS)
                frames.append(frame)

        # Quantize all frames to P mode using frame_0's palette for size optimization
        frame_0_p = frames[0].convert("P", palette=Image.Palette.ADAPTIVE, colors=128)
        frames_p = [frame_0_p]
        for f in frames[1:]:
            frames_p.append(f.quantize(palette=frame_0_p))

        # Save
        gif_path = os.path.join(UPLOAD_DIR, f"{name}.gif")
        frames_p[0].save(
            gif_path,
            save_all=True,
            append_images=frames_p[1:],
            duration=FRAME_DELAY,
            loop=1,
            optimize=True,
            disposal=2
        )
        
        png_path = os.path.join(UPLOAD_DIR, f"{name}.png")
        frames[0].save(png_path)
        print(f"Generated {name}.gif and {name}.png")
        return frames

    def generate_all_v2(self):
        # 1. Slogan (KOBIETA · AKTYWISTKA · LIDERKA)
        def draw_slogan(img, draw, w, h):
            text = "KOBIETA  ·  AKTYWISTKA  ·  LIDERKA"
            draw_text_tracked(draw, text, 0, 8, self.font_slogan, COLOR_GOLD, 8)
        slogan_frames = self.create_element_frames_v2("slogan", 320, 16, 2, 12, draw_slogan, slide_dist=8)

        # 2. Name
        def draw_name(img, draw, w, h):
            text_first = "Zuzanna Maria "
            text_last = "Czupryńska"
            draw.text((0, 2), text_first, font=self.font_name_reg, fill=COLOR_PRIMARY)
            w_first = self.font_name_reg.getlength(text_first)
            draw.text((w_first, 2), text_last, font=self.font_name_italic, fill=COLOR_GOLD)
        name_frames = self.create_element_frames_v2("name", 320, 36, 5, 17, draw_name, slide_dist=10)

        # 3. Role
        def draw_role(img, draw, w, h):
            text1 = "Fundatorka i Prezes "
            text2 = "Beehouses Foundation"
            draw.text((0, 4), text1, font=self.font_role, fill=COLOR_SECONDARY)
            w1 = self.font_role.getlength(text1)
            draw.text((w1, 4), text2, font=self.font_role, fill=COLOR_PRIMARY)
        role_frames = self.create_element_frames_v2("role", 320, 22, 9, 21, draw_role, slide_dist=8)

        # 4. Divider (growing line from left to right)
        divider_frames = self.create_divider_frames()

        # 5. Contact row: email on line 1, www on line 2 — single combined GIF
        mail_icon_path = os.path.join(ICONS_DIR, "mail.png")
        mail_icon = Image.open(mail_icon_path).convert("RGBA")
        globe_icon_path = os.path.join(ICONS_DIR, "globe.png")
        globe_icon = Image.open(globe_icon_path).convert("RGBA")

        # Bigger font for contact data
        font_contact = ImageFont.truetype(FONT_SANS, int(11 * 3))

        def draw_contact_row(img, draw, w, h):
            # Line 1: mail icon + email address
            icon_size = 48
            line_h = h // 2  # 75px per line (at 3x)
            y1 = 8
            y2 = h // 2 + 8

            # Row 1: mail
            ic1 = mail_icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
            img.paste(ic1, (0, y1 + (line_h - icon_size)//2 - 4), mask=ic1)
            draw.text((icon_size + 18, y1 + 4), "kontakt@zuzanna-czuprynska.pl",
                      font=font_contact, fill=COLOR_PRIMARY)

            # Thin separator between rows
            draw.line([(0, h // 2), (w, h // 2)], fill=COLOR_GOLD + (60,), width=1)

            # Row 2: globe
            ic2 = globe_icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
            img.paste(ic2, (0, y2 + (line_h - icon_size)//2 - 4), mask=ic2)
            draw.text((icon_size + 18, y2 + 4), "zuzanna-czuprynska.pl",
                      font=font_contact, fill=COLOR_PRIMARY)

        contact_frames = self.create_element_frames_v2("contact", 420, 50, 13, 29, draw_contact_row, slide_dist=10)

        # Keep email/globe as empty stubs (not used in layout anymore, but kept for backward compat)
        email_frames = contact_frames   # alias
        globe_frames = contact_frames   # alias (not pasted separately)

        # 7. Social bar — all three icons in one wide GIF (28px each, 12px gap)
        insta_icon_path = os.path.join(ICONS_DIR, "instagram.png")
        insta_icon = Image.open(insta_icon_path).convert("RGBA")
        fb_icon_path = os.path.join(ICONS_DIR, "facebook.png")
        fb_icon = Image.open(fb_icon_path).convert("RGBA")
        li_icon_path = os.path.join(ICONS_DIR, "linkedin.png")
        li_icon = Image.open(li_icon_path).convert("RGBA")

        ICON_PX = 28       # final size at 1x
        ICON_PX_3X = ICON_PX * 3   # 84px at 3x
        GAP_3X = 14 * 3   # 42px at 3x
        SOCIAL_W = ICON_PX * 3 + 2 * GAP_3X // 3   # ~100px — will be downsampled
        # We render at 3x
        SOCIAL_W_3X = ICON_PX_3X * 3 + 2 * GAP_3X
        SOCIAL_H_3X = ICON_PX_3X

        def draw_social_bar(img, draw, w, h):
            # Three icons side by side
            icons = [insta_icon, fb_icon, li_icon]
            x = 0
            for ico in icons:
                resized = ico.resize((ICON_PX_3X, ICON_PX_3X), Image.Resampling.LANCZOS)
                img.paste(resized, (x, 0), mask=resized)
                x += ICON_PX_3X + GAP_3X

        # We'll create the social bar as a single wider element
        social_bar_frames = self.create_social_bar(insta_icon, fb_icon, li_icon)

        instagram_frames = social_bar_frames  # alias
        facebook_frames = social_bar_frames   # alias
        linkedin_frames = social_bar_frames   # alias

        # 10. Quote — bigger, more prominent
        font_quote_lg = ImageFont.truetype(FONT_NAME_ITALIC, int(13 * 3))
        def draw_quote(img, draw, w, h):
            text = "\u201ePrzysz\u0142o\u015b\u0107 buduje si\u0119 od natury.\u201d"
            text_w = font_quote_lg.getlength(text)
            draw.text((w - text_w, 4), text, font=font_quote_lg, fill=COLOR_GOLD)
        quote_frames = self.create_element_frames_v2("quote", 310, 22, 23, 37, draw_quote, slide_dist=8)

        # 11. Portrait (Arch Frame with Gold Border)
        portrait_path = os.path.join(ASSETS_DIR, "portrait_orig.jpg")
        orig_portrait = Image.open(portrait_path).convert("RGB")
        
        # Crop her face (width=900, height=1177, aspect ratio 130:170)
        px, py = 153, 50
        pw, ph = 900, 1177
        cropped_portrait = orig_portrait.crop((px, py, px + pw, py + ph))
        
        # Outer arch mask (390x510)
        arch_mask_outer = Image.new("L", (390, 510), 0)
        draw_mask_outer = ImageDraw.Draw(arch_mask_outer)
        draw_mask_outer.ellipse((0, 0, 390, 390), fill=255)
        draw_mask_outer.rectangle((0, 195, 390, 510), fill=255)

        # Inner portrait (378x498 -> 6px border at 3x = 2px border at 1x)
        portrait_inner = cropped_portrait.resize((378, 498), Image.Resampling.LANCZOS)
        sepia_color = Image.new("RGB", (378, 498), (220, 200, 170))
        portrait_inner = Image.blend(portrait_inner, sepia_color, 0.08)
        enhancer = ImageEnhance.Contrast(portrait_inner)
        portrait_inner = enhancer.enhance(1.05)
        
        arch_mask_inner = Image.new("L", (378, 498), 0)
        draw_mask_inner = ImageDraw.Draw(arch_mask_inner)
        draw_mask_inner.ellipse((0, 0, 378, 378), fill=255)
        draw_mask_inner.rectangle((0, 189, 378, 498), fill=255)

        def draw_portrait(img, draw, w, h):
            portrait_layer = Image.new("RGBA", (390, 510), (0, 0, 0, 0))
            gold_bg = Image.new("RGB", (390, 510), COLOR_GOLD)
            portrait_layer.paste(gold_bg, (0, 0), mask=arch_mask_outer)
            portrait_layer.paste(portrait_inner, (6, 6), mask=arch_mask_inner)
            img.paste(portrait_layer, (0, 0), mask=portrait_layer)
            
        portrait_frames = self.create_element_frames_v2("portrait", 130, 170, 6, 38, draw_portrait, slide_dist=12)

        # 12. Combined Demo GIF & Static Full Preview
        self.generate_combined_assets(
            slogan_frames, name_frames, role_frames, divider_frames,
            contact_frames, contact_frames, social_bar_frames, social_bar_frames,
            social_bar_frames, quote_frames, portrait_frames
        )


    def create_divider_frames(self):
        width, height = 320, 6
        w3x, h3x = width * 3, height * 3
        frames = []
        
        def draw_grad_divider(canvas, w, h, current_w=None):
            if current_w is None:
                current_w = w
            
            line_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            draw_line = ImageDraw.Draw(line_layer)
            
            # Decorative golden diamond on the left
            if current_w >= 15:
                draw_line.polygon([(9, 3), (15, 9), (9, 15), (3, 9)], fill=COLOR_GOLD + (255,))
            
            # Horizontal line starting after the diamond
            start_x = 24
            if current_w > start_x:
                fade_len = 150
                for x in range(start_x, current_w):
                    if x > w - fade_len:
                        alpha = int(255 * ((w - x) / fade_len))
                    else:
                        alpha = 255
                    draw_line.rectangle([(x, 8), (x, 10)], fill=COLOR_GOLD + (alpha,))
                
            canvas.paste(line_layer, (0, 0), mask=line_layer)
        
        # Frame 0: Final state
        frame_0_3x = Image.new("RGBA", (w3x, h3x), BG_COLOR + (255,))
        draw_grad_divider(frame_0_3x, w3x, h3x)
        frame_0_rgb = Image.new("RGB", (w3x, h3x), BG_COLOR)
        frame_0_rgb.paste(frame_0_3x, (0, 0), mask=frame_0_3x.split()[3])
        frame_0 = frame_0_rgb.resize((width, height), Image.Resampling.LANCZOS)
        frames.append(frame_0)
        
        # Frame 1: Blank
        frame_1 = Image.new("RGB", (width, height), BG_COLOR)
        frames.append(frame_1)
        
        start_frame = 10
        end_frame = 23
        
        for frame_idx in range(2, TOTAL_FRAMES):
            anim_frame = frame_idx - 2
            
            if anim_frame < start_frame:
                frames.append(frame_1)
            elif anim_frame >= end_frame:
                frames.append(frame_0)
            else:
                t = (anim_frame - start_frame) / (end_frame - start_frame)
                ease_t = ease_out_cubic(t)
                
                canvas_3x = Image.new("RGBA", (w3x, h3x), BG_COLOR + (255,))
                current_w = int(w3x * ease_t)
                draw_grad_divider(canvas_3x, w3x, h3x, current_w)
                
                canvas_rgb = Image.new("RGB", (w3x, h3x), BG_COLOR)
                canvas_rgb.paste(canvas_3x, (0, 0), mask=canvas_3x.split()[3])
                
                frame = canvas_rgb.resize((width, height), Image.Resampling.LANCZOS)
                frames.append(frame)
                
        # Quantize frames to P mode for divider.gif
        frame_0_p = frames[0].convert("P", palette=Image.Palette.ADAPTIVE, colors=64)
        frames_p = [frame_0_p]
        for f in frames[1:]:
            frames_p.append(f.quantize(palette=frame_0_p))
            
        # Save
        frames_p[0].save(
            os.path.join(UPLOAD_DIR, "divider.gif"),
            save_all=True,
            append_images=frames_p[1:],
            duration=FRAME_DELAY,
            loop=1,
            optimize=True,
            disposal=2
        )
        frames[0].save(os.path.join(UPLOAD_DIR, "divider.png"))
        print("Generated divider.gif and divider.png")
        return frames

    def generate_combined_assets(self, slogan_f, name_f, role_f, div_f, email_f, globe_f, insta_f, fb_f, li_f, quote_f, portrait_f):
        card_w, card_h = 620, 236
        combined_frames = []

        # Coordinates layout (1x scale)
        # contact_f == email_f (combined contact row, 420x50)
        # social_f  == insta_f (combined social bar, 112x28)
        px, py = 24, 33     # Portrait centered vertically
        tx = 180            # Right text column start

        slogan_y = 18
        name_y   = 36
        role_y   = 76
        div_y    = 104

        contact_y = 118     # combined email+www block
        social_y  = 180     # combined social icons
        quote_y   = 180     # quote (right-aligned)
        quote_x   = card_w - 310 - 20  # right edge

        # Compile 50 frames
        for frame_idx in range(TOTAL_FRAMES):
            card = Image.new("RGB", (card_w, card_h), BG_COLOR)

            card.paste(portrait_f[frame_idx], (px, py))
            card.paste(slogan_f[frame_idx],   (tx, slogan_y))
            card.paste(name_f[frame_idx],     (tx, name_y))
            card.paste(role_f[frame_idx],     (tx, role_y))
            card.paste(div_f[frame_idx],      (tx, div_y))
            # Contact row spans full column width
            card.paste(email_f[frame_idx],   (tx, contact_y))
            # Social bar (insta_f is now the combined 3-icon bar)
            card.paste(insta_f[frame_idx],   (tx, social_y))
            # Quote on the right side of the social row
            card.paste(quote_f[frame_idx],   (quote_x, quote_y))

            combined_frames.append(card)

        # Save Demo GIF (infinite loop, loop=0)
        demo_path = os.path.join(SCRIPT_DIR, "zuzanna-signature-demo.gif")
        
        # Quantize demo frames to P mode using first frame's palette (256 colors for demo to preserve highest quality)
        demo_f0_p = combined_frames[0].convert("P", palette=Image.Palette.ADAPTIVE, colors=256)
        demo_frames_p = [demo_f0_p]
        for f in combined_frames[1:]:
            demo_frames_p.append(f.quantize(palette=demo_f0_p))

        demo_frames_p[0].save(
            demo_path,
            save_all=True,
            append_images=demo_frames_p[1:],
            duration=FRAME_DELAY,
            loop=0,
            optimize=True,
            disposal=2
        )
        print(f"Saved demo signature to {demo_path}")

        # Save Static Signature Preview PNG
        static_preview_path = os.path.join(SCRIPT_DIR, "zuzanna-signature-static.png")
        combined_frames[0].save(static_preview_path)
        print(f"Saved static signature preview to {static_preview_path}")

        # Generate Animation Contact Sheet
        indices = [1, 7, 14, 21, 27, 34, 41, 0]
        labels = ["0.0s", "0.2s", "0.4s", "0.6s", "0.8s", "1.0s", "1.2s", "Final"]
        
        col_count = 4
        row_count = 2
        
        spacing_x, spacing_y = 15, 30
        frame_w, frame_h = card_w, card_h
        
        label_height = 20
        grid_w = col_count * frame_w + (col_count + 1) * spacing_x
        grid_h = row_count * (frame_h + label_height) + (row_count + 1) * spacing_y

        sheet = Image.new("RGB", (grid_w, grid_h), (255, 255, 255))
        draw_sheet = ImageDraw.Draw(sheet)
        font_label = ImageFont.truetype(FONT_SANS, 14)

        for i, idx in enumerate(indices):
            col = i % col_count
            row = i // col_count
            
            x = spacing_x + col * (frame_w + spacing_x)
            y = spacing_y + row * (frame_h + label_height + spacing_y)
            
            label = labels[i]
            draw_sheet.text((x, y), label, font=font_label, fill=(26, 46, 40))
            
            frame_img = combined_frames[idx].copy()
            frame_draw = ImageDraw.Draw(frame_img)
            frame_draw.rectangle((0, 0, frame_w - 1, frame_h - 1), outline=(229, 223, 213))
            
            sheet.paste(frame_img, (x, y + label_height))

        sheet_path = os.path.join(SCRIPT_DIR, "animation-contact-sheet.png")
        sheet.save(sheet_path)
        print(f"Saved contact sheet to {sheet_path}")


    def create_social_bar(self, insta_icon, fb_icon, li_icon):
        """Render Instagram + Facebook + LinkedIn as a single wide GIF at 3x."""
        ICON_PX = 28        # 1x final
        GAP = 14            # 1x gap
        width = ICON_PX * 3 + GAP * 2   # 112px
        height = ICON_PX

        W3 = width * 3
        H3 = height * 3
        ICON3 = ICON_PX * 3
        GAP3 = GAP * 3

        icons = [insta_icon, fb_icon, li_icon]
        frame_list = []

        # Frame 0: final state
        canvas_3x = Image.new("RGBA", (W3, H3), (0, 0, 0, 0))
        x = 0
        for ico in icons:
            resized = ico.resize((ICON3, ICON3), Image.Resampling.LANCZOS)
            canvas_3x.paste(resized, (x, 0), mask=resized)
            x += ICON3 + GAP3
        bg = Image.new("RGB", (W3, H3), BG_COLOR)
        bg.paste(canvas_3x, (0, 0), mask=canvas_3x.split()[3])
        frame_0 = bg.resize((width, height), Image.Resampling.LANCZOS)
        frame_list.append(frame_0)

        # Frame 1: blank
        blank = Image.new("RGB", (width, height), BG_COLOR)
        frame_list.append(blank)

        start_f, end_f = 17, 33

        for fi in range(2, TOTAL_FRAMES):
            af = fi - 2
            if af < start_f:
                frame_list.append(blank)
            elif af >= end_f:
                frame_list.append(frame_0)
            else:
                t = (af - start_f) / (end_f - start_f)
                ease_t = ease_out_cubic(t)
                offset_y = int((1.0 - ease_t) * 10 * 3)

                layer = Image.new("RGBA", (W3, H3), (0, 0, 0, 0))
                x = 0
                for ico in icons:
                    resized = ico.resize((ICON3, ICON3), Image.Resampling.LANCZOS)
                    r, g, b, a = resized.split()
                    a_faded = a.point(lambda p: int(p * ease_t))
                    resized_faded = Image.merge("RGBA", (r, g, b, a_faded))
                    layer.paste(resized_faded, (x, -offset_y), mask=resized_faded)
                    x += ICON3 + GAP3

                canvas = Image.new("RGB", (W3, H3), BG_COLOR)
                canvas.paste(layer, (0, 0), mask=layer)
                frame = canvas.resize((width, height), Image.Resampling.LANCZOS)
                frame_list.append(frame)

        # Save combined social bar
        fp0 = frame_list[0].convert("P", palette=Image.Palette.ADAPTIVE, colors=128)
        fps = [fp0] + [f.quantize(palette=fp0) for f in frame_list[1:]]
        fps[0].save(
            os.path.join(UPLOAD_DIR, "social.gif"),
            save_all=True, append_images=fps[1:],
            duration=FRAME_DELAY, loop=1, optimize=True, disposal=2
        )
        frame_list[0].save(os.path.join(UPLOAD_DIR, "social.png"))
        print("Generated social.gif and social.png")
        return frame_list


if __name__ == "__main__":

    print("Starting email signature asset generation...")
    generator = SignatureAssetGenerator()
    generator.generate_all_v2()
    print("Asset generation complete!")

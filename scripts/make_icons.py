#!/usr/bin/env python3
"""Generate extension icons (16/48/128) and a 1280x800 promo screenshot.

Renders at high resolution then downsamples for crisp results at small sizes.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / "icons"
ICONS_DIR.mkdir(exist_ok=True)

BG = (31, 136, 61)        # GitHub green
FG = (255, 255, 255)
ACCENT = (255, 220, 90)   # filter highlight

def find_font(size):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNS.ttf",
        "/Library/Fonts/Arial Bold.ttf",
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

def render_icon(size_out: int) -> Image.Image:
    SCALE = 8
    S = size_out * SCALE
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Rounded square background
    radius = int(S * 0.22)
    d.rounded_rectangle((0, 0, S - 1, S - 1), radius=radius, fill=BG)

    # Draw a "PR" merge-arrow style: two circles + connecting branch + filter funnel
    # Branch dots
    r = int(S * 0.085)
    cx_left = int(S * 0.30)
    cx_right = int(S * 0.70)
    cy_top = int(S * 0.28)
    cy_bot = int(S * 0.72)

    line_w = int(S * 0.07)
    # vertical line on left
    d.line([(cx_left, cy_top), (cx_left, cy_bot)], fill=FG, width=line_w)
    # arrow from left-bottom across to right-top (the merge arrow)
    d.line([(cx_left, cy_bot), (cx_right, cy_bot)], fill=FG, width=line_w)
    d.line([(cx_right, cy_bot), (cx_right, cy_top + r)], fill=FG, width=line_w)

    # circles (commit dots)
    def dot(cx, cy, fill):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill, outline=FG, width=int(S * 0.022))
    dot(cx_left, cy_top, BG)
    dot(cx_left, cy_bot, BG)
    dot(cx_right, cy_top, ACCENT)

    # Funnel (filter) over the right circle to imply "filtered PR"
    fx = cx_right
    fy = cy_top
    fw = int(S * 0.18)
    fh = int(S * 0.10)
    # tiny funnel triangle pointing down from the top of right dot
    d.polygon([
        (fx - fw, fy - r - fh - int(S * 0.04)),
        (fx + fw, fy - r - fh - int(S * 0.04)),
        (fx + fw // 3, fy - r - int(S * 0.02)),
        (fx - fw // 3, fy - r - int(S * 0.02)),
    ], fill=ACCENT, outline=FG, width=int(S * 0.018))

    # Downsample
    return img.resize((size_out, size_out), Image.LANCZOS)

def render_promo() -> Image.Image:
    W, H = 1280, 800
    img = Image.new("RGB", (W, H), (246, 248, 250))
    d = ImageDraw.Draw(img)

    # Top bar resembling GitHub repo nav
    d.rectangle((0, 0, W, 120), fill=(36, 41, 47))
    title_font = find_font(40)
    d.text((40, 38), "amboss-mededu / amboss-design-system", fill=(255, 255, 255), font=title_font)

    # Tab strip
    d.rectangle((0, 120, W, 200), fill=(255, 255, 255))
    d.line((0, 200, W, 200), fill=(208, 215, 222), width=2)
    tab_font = find_font(26)
    tabs = ["Code", "Issues", "Pull requests", "Actions", "Projects", "Wiki"]
    x = 40
    for i, t in enumerate(tabs):
        color = (31, 136, 61) if t == "Pull requests" else (87, 96, 106)
        d.text((x, 150), t, fill=color, font=tab_font)
        if t == "Pull requests":
            tw = d.textlength(t, font=tab_font)
            d.rectangle((x, 192, x + tw, 198), fill=(31, 136, 61))
        x += int(d.textlength(t, font=tab_font)) + 50

    # Big icon centered below
    icon = render_icon(256)
    img.paste(icon, ((W - 256) // 2, 260), icon)

    # Headline
    h_font = find_font(54)
    msg = "GitHub PR Tab Rewriter"
    tw = d.textlength(msg, font=h_font)
    d.text(((W - tw) // 2, 540), msg, fill=(31, 136, 61), font=h_font)

    sub_font = find_font(28)
    sub = "Make the Pull requests tab open YOUR filtered view."
    sw = d.textlength(sub, font=sub_font)
    d.text(((W - sw) // 2, 620), sub, fill=(87, 96, 106), font=sub_font)

    sub2 = "Per-repo overrides. Saved in chrome.storage.sync."
    sw2 = d.textlength(sub2, font=sub_font)
    d.text(((W - sw2) // 2, 660), sub2, fill=(87, 96, 106), font=sub_font)

    return img


def main():
    for size in (16, 48, 128):
        render_icon(size).save(ICONS_DIR / f"{size}.png")
        print(f"wrote icons/{size}.png")
    render_promo().save(ROOT / "store-screenshot-1280x800.png")
    print("wrote store-screenshot-1280x800.png")

if __name__ == "__main__":
    main()

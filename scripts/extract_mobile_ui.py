import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import pymupdf
from PIL import Image

pdf_path = r'C:\Users\ADMIN\.gemini\antigravity-ide\brain\2d675aae-27f8-4941-a330-49e253aa6381\.user_uploaded\media_1788702111462.pdf'
doc = pymupdf.open(pdf_path)

out_dir = r'public\library-bus\mobile_screens'
os.makedirs(out_dir, exist_ok=True)

# 34 screen pages in order:
# Module 1: pages 3, 4, 5, 6 (indices 2, 3, 4, 5)
# Module 2: pages 8, 9, 10, 11, 12 (indices 7, 8, 9, 10, 11)
# Module 3: pages 14, 15, 16, 17, 18 (indices 13, 14, 15, 16, 17)
# Module 4: pages 20, 21, 22, 23, 24, 25 (indices 19, 20, 21, 22, 23, 24)
# Module 5: pages 27, 28, 29, 30, 31 (indices 26, 27, 28, 29, 30)
# Module 6: pages 33, 34, 35, 36, 37 (indices 32, 33, 34, 35, 36)
# Module 7: pages 39, 40, 41, 42 (indices 38, 39, 40, 41)

screen_indices = [
    2, 3, 4, 5,
    7, 8, 9, 10, 11,
    13, 14, 15, 16, 17,
    19, 20, 21, 22, 23, 24,
    26, 27, 28, 29, 30,
    32, 33, 34, 35, 36,
    38, 39, 40, 41
]

print(f"Total screens to process: {len(screen_indices)}")

screen_meta = []

for idx, p_idx in enumerate(screen_indices):
    page = doc[p_idx]
    page_num = p_idx + 1
    
    # Determine title
    lines = [l.strip() for l in page.get_text('text').split('\n') if l.strip()]
    title = ''
    module_header = ''
    for l in lines:
        if 'ĐỢT' in l:
            module_header = l
        if any(x in l for x in ['.html)', '.html']) and not title:
            title = l

    # Find the UI container rect
    # It starts at x0 ≈ 421.13, y0 ≈ 90.45
    # Width is either ~207.4 or ~357.2
    ui_rect = None
    for d in page.get_drawings():
        r = d['rect']
        if abs(r.x0 - 421.13) < 3 and abs(r.y0 - 90.45) < 3:
            if (200 < r.width < 215 or 350 < r.width < 365):
                if ui_rect is None or r.height > ui_rect.height:
                    ui_rect = r
                    
    if ui_rect is None:
        print(f"ERROR: Could not find UI rect for page {page_num} ({title})")
        continue

    is_wide = (ui_rect.width > 300)
    w_pt = ui_rect.width
    h_pt = ui_rect.height
    
    # Corresponding wireframe rect:
    wf_x0 = 63.95 if is_wide else 213.73
    wf_rect = pymupdf.Rect(wf_x0, ui_rect.y0, 421.13, ui_rect.y1)

    # Render high-res image of the UI container (scale = 2.0, e.g. 144 DPI)
    scale = 2.0
    mat = pymupdf.Matrix(scale, scale)
    pix = page.get_pixmap(matrix=mat, clip=ui_rect)
    
    screen_id = f"mob_{idx+1:02d}"
    ui_filename = f"ui_{screen_id}.png"
    ui_path = os.path.join(out_dir, ui_filename)
    pix.save(ui_path)
    
    # Also get actual pixel size
    img = Image.open(ui_path)
    w_px, h_px = img.size

    item = {
        "id": screen_id,
        "index": idx + 1,
        "page": page_num,
        "module": module_header,
        "title": title,
        "is_wide": is_wide,
        "ui_rect": [ui_rect.x0, ui_rect.y0, ui_rect.x1, ui_rect.y1],
        "wf_rect": [wf_rect.x0, wf_rect.y0, wf_rect.x1, wf_rect.y1],
        "w_pt": round(w_pt, 2),
        "h_pt": round(h_pt, 2),
        "w_px": w_px,
        "h_px": h_px,
        "ui_file": ui_filename,
        "wf_file": f"wf_{screen_id}.png"
    }
    screen_meta.append(item)
    print(f"[{screen_id}] P{page_num:02d} | {title:<40} | UI: {w_pt:.1f}x{h_pt:.1f}pt ({w_px}x{h_px}px) | Wide: {is_wide}")

import json
with open('scripts/mobile_screens_meta.json', 'w', encoding='utf-8') as f:
    json.dump(screen_meta, f, ensure_ascii=False, indent=2)

print(f"\nSuccessfully extracted all {len(screen_meta)} UI mobile screens!")

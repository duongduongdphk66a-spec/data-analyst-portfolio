import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import json
import pymupdf

pdf_in = r'C:\Users\ADMIN\.gemini\antigravity-ide\brain\2d675aae-27f8-4941-a330-49e253aa6381\.user_uploaded\media_1788702111462.pdf'
pdf_out = r'public\library-bus\tulsach-uxui-mobile-adjusted.pdf'
pdf_web = r'public\library-bus\website-mobile.pdf'

doc = pymupdf.open(pdf_in)

with open('scripts/mobile_screens_meta.json', 'r', encoding='utf-8') as f:
    screens = json.load(f)

bg_color = (0.93725, 0.90588, 0.85490) # Page background #EFE7DA

print(f"Updating all {len(screens)} screen pages in the mobile document...")

for s in screens:
    page_idx = s['page'] - 1
    page = doc[page_idx]
    is_wide = s['is_wide']
    
    # Target wireframe rect
    wf_x0 = 63.95 if is_wide else 213.73
    ui_y0 = s['ui_rect'][1]
    ui_y1 = s['ui_rect'][3]
    h_ui = s['h_pt']
    
    # 1. Cleanly cover the old wireframe area
    cover_x0 = 60.0 if is_wide else 210.0
    cover_rect = pymupdf.Rect(cover_x0, ui_y0, 421.13, 750.0)
    page.draw_rect(cover_rect, color=bg_color, fill=bg_color)
    
    # 2. Insert new matched wireframe image
    target_rect = pymupdf.Rect(wf_x0, ui_y0, 421.13, ui_y1)
    wf_img_path = os.path.join(r'public\library-bus\mobile_screens', s['wf_file'])
    
    page.insert_image(target_rect, filename=wf_img_path)
    print(f"[{s['id']}] P{s['page']:02d}: Matched WF placed at {target_rect.width:.1f}x{target_rect.height:.1f}pt")

doc.save(pdf_out)
doc.save(pdf_web)
print(f"\nSuccessfully generated adjusted mobile PDF at:\n - {pdf_out}\n - {pdf_web}")

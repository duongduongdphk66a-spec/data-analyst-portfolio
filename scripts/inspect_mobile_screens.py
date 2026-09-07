import sys
sys.stdout.reconfigure(encoding='utf-8')
import pymupdf
import json

pdf_path = r'C:\Users\ADMIN\.gemini\antigravity-ide\brain\2d675aae-27f8-4941-a330-49e253aa6381\.user_uploaded\media_1788702111462.pdf'
doc = pymupdf.open(pdf_path)

screens = []
for idx in range(len(doc)):
    page = doc[idx]
    text = page.get_text('text')
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    is_screen = any('pages/' in l or 'inventory/' in l or 'transactions/' in l or 'users/' in l or 'blog/' in l or 'analytics/' in l for l in lines)
    if not is_screen:
        continue
    
    title = ''
    module_name = ''
    for l in lines:
        if 'ĐỢT' in l:
            module_name = l
        if any(ext in l for ext in ['.html)', '.html']):
            title = l
            break
            
    ui_rect = None
    wf_rect = None
    
    for d in page.get_drawings():
        r = d['rect']
        if 200 < r.width < 215:
            if abs(r.x0 - 421.13) < 3 and abs(r.y0 - 90.45) < 3:
                if ui_rect is None or r.height > ui_rect.height:
                    ui_rect = r
            elif abs(r.x0 - 213.73) < 3 and abs(r.y0 - 90.45) < 3:
                if wf_rect is None or r.height > wf_rect.height:
                    wf_rect = r

    screens.append({
        'page': idx + 1,
        'module': module_name,
        'title': title,
        'ui_rect': [round(ui_rect.x0, 2), round(ui_rect.y0, 2), round(ui_rect.x1, 2), round(ui_rect.y1, 2)] if ui_rect else None,
        'ui_w': round(ui_rect.width, 2) if ui_rect else None,
        'ui_h': round(ui_rect.height, 2) if ui_rect else None,
        'wf_rect': [round(wf_rect.x0, 2), round(wf_rect.y0, 2), round(wf_rect.x1, 2), round(wf_rect.y1, 2)] if wf_rect else None,
        'wf_h': round(wf_rect.height, 2) if wf_rect else None,
    })

print(f'Total screens found: {len(screens)}')
for s in screens:
    t = s['title'][:45]
    print(f"P{s['page']:02d} | {t:<45} | UI: {s['ui_w']}x{s['ui_h']} | WF h: {s['wf_h']}")

with open('scripts/mobile_screens_info.json', 'w', encoding='utf-8') as f:
    json.dump(screens, f, ensure_ascii=False, indent=2)

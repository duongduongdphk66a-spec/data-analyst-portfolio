import os
from PIL import Image, ImageDraw, ImageFont

SCREENS_DIR = os.path.join('public', 'library-bus', 'screens')
OUTPUT_DIR = os.path.join('public', 'library-bus')

wf_files = sorted([f for f in os.listdir(SCREENS_DIR) if f.startswith('wf_')])
ui_files = sorted([f for f in os.listdir(SCREENS_DIR) if f.startswith('ui_')])

def get_screen_label(filename):
    # e.g. wf_01_trang_chu.png -> 01. TRANG CHU
    name = os.path.splitext(filename)[0]
    parts = name.split('_')[1:]
    num = parts[0] if parts else ''
    title = ' '.join(parts[1:]).upper() if len(parts) > 1 else ''
    return f"{num}. {title}"

# 1. Generate library_bus_wireframe_all_screens.png (1400 x 1833)
def generate_wireframe_board():
    W, H = 1400, 1833
    canvas = Image.new('RGB', (W, H), color='#0F172A')
    draw = ImageDraw.Draw(canvas)
    
    # Header banner
    draw.rectangle([0, 0, W, 100], fill='#090D16')
    draw.text((40, 24), "LIBRARY BUS — MASTER WIREFRAME ARCHITECTURE (20 SCREENS)", fill='#F8FAFC')
    draw.text((40, 58), "12-Column Grid Layout • Information Hierarchy • Systematic Structural Skeletons", fill='#94A3B8')
    
    cols = 4
    rows = 5
    pad_x = 32
    pad_top = 120
    gap_x = 24
    gap_y = 20
    
    cell_w = (W - 2 * pad_x - (cols - 1) * gap_x) // cols  # ~313 px
    cell_h = (H - pad_top - 32 - (rows - 1) * gap_y) // rows # ~324 px
    
    for idx, fname in enumerate(wf_files[:20]):
        c = idx % cols
        r = idx // cols
        x = pad_x + c * (cell_w + gap_x)
        y = pad_top + r * (cell_h + gap_y)
        
        # Cell border
        draw.rectangle([x, y, x + cell_w, y + cell_h], fill='#1E293B', outline='#334155', width=1)
        
        # Label bar
        draw.rectangle([x, y, x + cell_w, y + 26], fill='#0F172A')
        label = get_screen_label(fname)
        draw.text((x + 8, y + 6), label, fill='#94A3B8')
        
        # Load & fit screen image
        img_path = os.path.join(SCREENS_DIR, fname)
        with Image.open(img_path) as im:
            # im is 302 x 600
            avail_h = cell_h - 28
            avail_w = cell_w - 4
            im_ratio = im.width / im.height
            
            # fit inside
            target_h = avail_h
            target_w = int(target_h * im_ratio)
            if target_w > avail_w:
                target_w = avail_w
                target_h = int(target_w / im_ratio)
                
            resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
            offset_x = x + (cell_w - target_w) // 2
            offset_y = y + 27 + (avail_h - target_h) // 2
            canvas.paste(resized, (offset_x, offset_y))
            
    out_path = os.path.join(OUTPUT_DIR, 'library_bus_wireframe_all_screens.png')
    canvas.save(out_path, 'PNG', optimize=True)
    print("Saved:", out_path, canvas.size)

# 2. Generate library_bus_ui_design_all_screens.png (1290 x 3388)
def generate_ui_design_board():
    W, H = 1290, 3388
    canvas = Image.new('RGB', (W, H), color='#FAFDFE')
    draw = ImageDraw.Draw(canvas)
    
    # Header banner
    draw.rectangle([0, 0, W, 120], fill='#0D7287')
    draw.text((40, 30), "LIBRARY BUS — PRODUCTION UI DESIGN MASTER BOARD (20 SCREENS)", fill='#FFFFFF')
    draw.text((40, 70), "Official 4-Tone Design System: Deep Teal (#0D7287) • Soft Cyan (#9BE7FA) • Honey Gold (#FFD14C) • Snow (#FAFDFE)", fill='#C8EEF7')
    
    cols = 3
    rows = 7  # 3 * 7 = 21 (first 20 used)
    pad_x = 30
    pad_top = 150
    gap_x = 24
    gap_y = 24
    
    cell_w = (W - 2 * pad_x - (cols - 1) * gap_x) // cols # ~394 px
    cell_h = (H - pad_top - 40 - (rows - 1) * gap_y) // rows # ~437 px
    
    for idx, fname in enumerate(ui_files[:20]):
        c = idx % cols
        r = idx // cols
        x = pad_x + c * (cell_w + gap_x)
        y = pad_top + r * (cell_h + gap_y)
        
        # Cell border with card styling
        draw.rectangle([x, y, x + cell_w, y + cell_h], fill='#FFFFFF', outline='#E2E8F0', width=1)
        
        # Label bar
        draw.rectangle([x, y, x + cell_w, y + 30], fill='#F0F9FB')
        label = get_screen_label(fname)
        draw.text((x + 10, y + 8), label, fill='#0D7287')
        
        # Load & fit screen image
        img_path = os.path.join(SCREENS_DIR, fname)
        with Image.open(img_path) as im:
            avail_h = cell_h - 34
            avail_w = cell_w - 6
            im_ratio = im.width / im.height
            
            target_h = avail_h
            target_w = int(target_h * im_ratio)
            if target_w > avail_w:
                target_w = avail_w
                target_h = int(target_w / im_ratio)
                
            resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
            offset_x = x + (cell_w - target_w) // 2
            offset_y = y + 32 + (avail_h - target_h) // 2
            canvas.paste(resized, (offset_x, offset_y))
            
    out_path = os.path.join(OUTPUT_DIR, 'library_bus_ui_design_all_screens.png')
    canvas.save(out_path, 'PNG', optimize=True)
    print("Saved:", out_path, canvas.size)

# 3. Generate reference_wireframe_vs_ui.png (1600 x 900)
def generate_reference_comparison():
    W, H = 1600, 900
    canvas = Image.new('RGB', (W, H), color='#0F172A')
    draw = ImageDraw.Draw(canvas)
    
    # Header
    draw.rectangle([0, 0, W, 90], fill='#0B1120')
    draw.text((40, 24), "REFERENCE COMPARISON BENCHMARK: WIREFRAME VS UI DESIGN", fill='#FFFFFF')
    draw.text((40, 54), "Systematic Transformation: Left Half Skeletons (12-Col Grid) | Right Half Final Branded Interface", fill='#94A3B8')
    
    # Left Half: Wireframe
    half_w = W // 2
    draw.rectangle([20, 110, half_w - 10, H - 20], fill='#1E293B', outline='#334155', width=1)
    draw.rectangle([20, 110, half_w - 10, 150], fill='#0F172A')
    draw.text((40, 122), "WIREFRAME ARCHITECTURE (12-COLUMN STRUCTURAL SKELETON)", fill='#CBD5E1')
    
    # Right Half: UI Design
    draw.rectangle([half_w + 10, 110, W - 20, H - 20], fill='#FAFDFE', outline='#E2E8F0', width=1)
    draw.rectangle([half_w + 10, 110, W - 20, 150], fill='#0D7287')
    draw.text((half_w + 30, 122), "FINAL PRODUCTION UI (4-TONE CYAN & GOLD PALETTE)", fill='#FFFFFF')
    
    # Prominent screens to compare: Home (01), Book List (03), Bus Map (05), Analytics (18)
    sample_indices = [
        ('wf_01_trang_chu.png', 'ui_01_trang_chu.png'),
        ('wf_03_danh_sach_sach.png', 'ui_03_danh_sach_sach.png'),
        ('wf_05_danh_sach_xe_ban_do.png', 'ui_05_danh_sach_xe_ban_do.png'),
        ('wf_18_analytics_dashboard.png', 'ui_18_analytics_dashboard.png'),
    ]
    
    n_samples = len(sample_indices)
    col_w_left = (half_w - 30 - 20 - (n_samples - 1) * 12) // n_samples
    col_w_right = (half_w - 30 - 20 - (n_samples - 1) * 12) // n_samples
    
    for i, (wf_file, ui_file) in enumerate(sample_indices):
        # Left placement
        lx = 30 + i * (col_w_left + 12)
        ly = 165
        wf_path = os.path.join(SCREENS_DIR, wf_file)
        if os.path.exists(wf_path):
            with Image.open(wf_path) as im:
                avail_h = H - ly - 40
                ratio = im.width / im.height
                th = avail_h
                tw = int(th * ratio)
                if tw > col_w_left:
                    tw = col_w_left
                    th = int(tw / ratio)
                resized = im.resize((tw, th), Image.Resampling.LANCZOS)
                canvas.paste(resized, (lx + (col_w_left - tw) // 2, ly + (avail_h - th) // 2))
                
        # Right placement
        rx = half_w + 20 + i * (col_w_right + 12)
        ry = 165
        ui_path = os.path.join(SCREENS_DIR, ui_file)
        if os.path.exists(ui_path):
            with Image.open(ui_path) as im:
                avail_h = H - ry - 40
                ratio = im.width / im.height
                th = avail_h
                tw = int(th * ratio)
                if tw > col_w_right:
                    tw = col_w_right
                    th = int(tw / ratio)
                resized = im.resize((tw, th), Image.Resampling.LANCZOS)
                canvas.paste(resized, (rx + (col_w_right - tw) // 2, ry + (avail_h - th) // 2))

    out_path = os.path.join(OUTPUT_DIR, 'reference_wireframe_vs_ui.png')
    canvas.save(out_path, 'PNG', optimize=True)
    print("Saved:", out_path, canvas.size)

if __name__ == '__main__':
    generate_wireframe_board()
    generate_ui_design_board()
    generate_reference_comparison()

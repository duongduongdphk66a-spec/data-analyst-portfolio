import os
from PIL import Image, ImageDraw

out_dir = r'public\library-bus\screens'
os.makedirs(out_dir, exist_ok=True)

def get_canvas(slug, has_top_title=True):
    ui_path = os.path.join(out_dir, f'ui_{slug}.png')
    ui = Image.open(ui_path).convert('RGB')
    w, h = ui.size
    wf = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(wf)
    
    if has_top_title:
        title = ui.crop((0, 0, w, 28))
        wf.paste(title, (0, 0))
        draw.rectangle([0, 28, w-1, h-1], outline='#CBD5E1', width=1)
    else:
        draw.rectangle([0, 0, w-1, h-1], outline='#CBD5E1', width=1)
        
    return wf, draw, w, h, ui

def cross_box(draw, b, fill='#E2E8F0', outline='#CBD5E1', cross='#CBD5E1'):
    draw.rectangle(b, fill=fill, outline=outline, width=1)
    draw.line([b[0], b[1], b[2], b[3]], fill=cross, width=1)
    draw.line([b[0], b[3], b[2], b[1]], fill=cross, width=1)

def bar(draw, b, fill='#CBD5E1', r=2):
    draw.rounded_rectangle(b, radius=r, fill=fill)

def pill(draw, b, fill='#94A3B8'):
    r = max(1, (b[3] - b[1]) // 2)
    draw.rounded_rectangle(b, radius=r, fill=fill)

def navbar(draw, w, y0=28, y1=44):
    bar(draw, [12, y0+4, 25, y1-3], fill='#94A3B8', r=2) # Logo
    bar(draw, [32, y0+6, 60, y0+9], fill='#CBD5E1', r=1)
    bar(draw, [68, y0+6, 96, y0+9], fill='#CBD5E1', r=1)
    bar(draw, [104, y0+6, 132, y0+9], fill='#CBD5E1', r=1)
    pill(draw, [w-45, y0+4, w-12, y1-3], fill='#94A3B8')

def sidebar(draw, x0=6, y0=48, x1=48, y1=145, active_idx=0):
    draw.rectangle([x0, y0, x1, y1], fill='#FAF8F5', outline='#E2E8F0', width=1)
    draw.rectangle([x0, y0, x1, y0+14], fill='#631E05')
    bar(draw, [x0+4, y0+4, x1-4, y0+9], fill='#F1F5F9', r=1)
    for i in range(7):
        iy = y0 + 18 + i * 11
        if iy + 8 > y1: break
        if i == active_idx:
            draw.rectangle([x0, iy-1, x1, iy+9], fill='#BD5705')
            bar(draw, [x0+5, iy+2, x1-5, iy+6], fill='#FFFFFF', r=1)
        else:
            bar(draw, [x0+5, iy+2, x1-5, iy+6], fill='#94A3B8', r=1)

# =========================================================================
# 1. TRANG CHỦ (No Footer)
# =========================================================================
def gen_01():
    wf, draw, w, h, _ = get_canvas('01_trang_chu', has_top_title=True)
    navbar(draw, w, 28, 44)
    # Hero photo
    cross_box(draw, [2, 48, w-3, 215], fill='#CBD5E1', outline='#94A3B8')
    draw.rounded_rectangle([40, 80, w-40, 185], radius=8, fill='#64748B')
    bar(draw, [60, 95, w-60, 107], fill='#F1F5F9', r=2)
    bar(draw, [50, 115, w-50, 122], fill='#CBD5E1', r=1)
    bar(draw, [70, 126, w-70, 133], fill='#CBD5E1', r=1)
    pill(draw, [60, 150, 130, 168], fill='#FDE971')
    pill(draw, [140, 150, 210, 168], fill='#FFFFFF')

    # Sách Mới Cập Nhật (4 cards)
    bar(draw, [90, 235, 210, 245], fill='#64748B', r=2)
    bar(draw, [60, 252, 240, 257], fill='#CBD5E1', r=1)
    cw = (w - 30 - 15) // 4
    for c in range(4):
        cx = 15 + c * (cw + 5)
        draw.rounded_rectangle([cx, 270, cx + cw, 420], radius=5, fill='#FFFFFF', outline='#E2E8F0', width=1)
        cross_box(draw, [cx, 270, cx + cw, 340], fill='#E2E8F0', outline='#CBD5E1')
        bar(draw, [cx + 4, 348, cx + cw - 8, 355], fill='#64748B', r=1)
        bar(draw, [cx + 4, 360, cx + cw - 18, 364], fill='#94A3B8', r=1)
        bar(draw, [cx + 4, 370, cx + cw - 6, 373], fill='#CBD5E1', r=1)
        pill(draw, [cx + 4, 395, cx + 24, 407], fill='#CBD5E1')
        pill(draw, [cx + cw - 28, 395, cx + cw - 4, 407], fill='#94A3B8')

    draw.rounded_rectangle([95, 430, 205, 448], radius=9, fill='#FFFFFF', outline='#CBD5E1', width=1)
    bar(draw, [115, 437, 185, 441], fill='#94A3B8', r=1)

    # Tin tức (3 cards)
    bar(draw, [90, 470, 210, 480], fill='#64748B', r=2)
    bar(draw, [70, 487, 230, 492], fill='#CBD5E1', r=1)
    nw = (w - 30 - 10) // 3
    for c in range(3):
        nx = 15 + c * (nw + 5)
        draw.rounded_rectangle([nx, 505, nx + nw, min(h-5, 595)], radius=5, fill='#FFFFFF', outline='#E2E8F0', width=1)
        cross_box(draw, [nx, 505, nx + nw, 550], fill='#E2E8F0', outline='#CBD5E1')
        bar(draw, [nx + 5, 558, nx + nw - 10, 564], fill='#64748B', r=1)
        bar(draw, [nx + 5, 570, nx + nw - 20, 575], fill='#94A3B8', r=1)

    wf.save(os.path.join(out_dir, 'wf_01_trang_chu.png'))

# =========================================================================
# 2. GIỚI THIỆU (No Footer)
# =========================================================================
def gen_02():
    wf, draw, w, h, _ = get_canvas('02_gioi_thieu', has_top_title=True)
    navbar(draw, w, 28, 44)
    pill(draw, [110, 68, 190, 76], fill='#BD5705')
    bar(draw, [60, 84, w-60, 96], fill='#64748B', r=2)
    bar(draw, [50, 102, w-50, 109], fill='#CBD5E1', r=1)
    bar(draw, [70, 113, w-70, 118], fill='#CBD5E1', r=1)

    bar(draw, [90, 140, 210, 150], fill='#64748B', r=2)
    qw = (w - 30 - 10) // 2
    for c in range(2):
        qx = 15 + c * (qw + 10)
        draw.rounded_rectangle([qx, 168, qx + qw, 210], radius=5, fill='#FFFFFF', outline='#E2E8F0', width=1)
        bar(draw, [qx + 8, 178, qx + qw - 8, 183], fill='#CBD5E1', r=1)
        bar(draw, [qx + 8, 189, qx + qw - 20, 193], fill='#CBD5E1', r=1)
        bar(draw, [qx + 8, 199, qx + 60, 203], fill='#BD5705', r=1)

    bar(draw, [70, 235, 230, 245], fill='#64748B', r=2)
    cw = (w - 30 - 15) // 4
    for c in range(4):
        cx = 15 + c * (cw + 5)
        draw.rounded_rectangle([cx, 255, cx + cw, 300], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        draw.rounded_rectangle([cx + cw//2 - 7, 260, cx + cw//2 + 7, 274], radius=2, fill='#BD5705')
        bar(draw, [cx + 4, 280, cx + cw - 4, 285], fill='#64748B', r=1)
        bar(draw, [cx + 4, 290, cx + cw - 4, 294], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([15, 310, 15 + cw, 355], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.rounded_rectangle([15 + cw//2 - 7, 315, 15 + cw//2 + 7, 329], radius=2, fill='#BD5705')
    bar(draw, [19, 335, 15 + cw - 4, 340], fill='#64748B', r=1)

    bar(draw, [15, 375, 140, 384], fill='#64748B', r=2)
    bar(draw, [15, 390, 130, 395], fill='#CBD5E1', r=1)
    for r in range(3):
        by = 405 + r * 16
        draw.rectangle([15, by, 22, by + 7], fill='#BD5705')
        bar(draw, [26, by + 1, 140, by + 5], fill='#64748B', r=1)

    cross_box(draw, [155, 385, w-15, 445], fill='#E2E8F0', outline='#CBD5E1')
    draw.rectangle([0, 465, w-1, min(h-1, 505)], fill='#4E0705')
    bar(draw, [80, 478, w-80, 486], fill='#FFFFFF', r=2)
    bar(draw, [60, 492, w-60, 496], fill='#BD5705', r=1)

    wf.save(os.path.join(out_dir, 'wf_02_gioi_thieu.png'))

# =========================================================================
# 3. DANH SÁCH SÁCH (No Footer)
# =========================================================================
def gen_03():
    wf, draw, w, h, _ = get_canvas('03_danh_sach_sach', has_top_title=True)
    navbar(draw, w, 28, 44)
    # Left filter sidebar
    draw.rectangle([6, 50, 46, 210], fill='#FAF8F5', outline='#E2E8F0', width=1)
    bar(draw, [10, 54, 42, 60], fill='#64748B', r=1)
    draw.rounded_rectangle([8, 65, 44, 75], radius=2, fill='#BD5705')
    bar(draw, [12, 68, 40, 72], fill='#FFFFFF', r=1)
    for i in range(5):
        bar(draw, [10, 82 + i * 11, 40, 87 + i * 11], fill='#94A3B8', r=1)

    # Search + action buttons
    draw.rounded_rectangle([52, 50, 205, 62], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [60, 54, 110, 58], fill='#CBD5E1', r=1)
    pill(draw, [212, 50, 250, 62], fill='#631E05')
    pill(draw, [255, 50, 292, 62], fill='#BD5705')

    # 4 cols x 5 rows grid
    cw = (w - 55 - 15) // 4
    for r in range(5):
        for c in range(4):
            cx = 52 + c * (cw + 5)
            cy = 70 + r * 115
            if cy + 105 > h: break
            draw.rounded_rectangle([cx, cy, cx + cw, cy + 108], radius=3, fill='#FFFFFF', outline='#E2E8F0', width=1)
            cross_box(draw, [cx, cy, cx + cw, cy + 68], fill='#E2E8F0', outline='#CBD5E1')
            pill(draw, [cx + cw - 22, cy + 3, cx + cw - 3, cy + 10], fill='#059669')
            bar(draw, [cx + 3, cy + 73, cx + cw - 6, cy + 78], fill='#64748B', r=1)
            bar(draw, [cx + 3, cy + 81, cx + cw - 12, cy + 85], fill='#94A3B8', r=1)
            bar(draw, [cx + 3, cy + 88, cx + cw - 8, cy + 91], fill='#CBD5E1', r=1)
            draw.rounded_rectangle([cx + 3, cy + 96, cx + cw - 3, cy + 104], radius=2, fill='#FAF8F5', outline='#CBD5E1', width=1)

    wf.save(os.path.join(out_dir, 'wf_03_danh_sach_sach.png'))

# =========================================================================
# 4. CHI TIẾT SÁCH (No Footer)
# =========================================================================
def gen_04():
    wf, draw, w, h, _ = get_canvas('04_chi_tiet_sach', has_top_title=True)
    navbar(draw, w, 28, 44)
    # Left book cover
    cross_box(draw, [15, 52, 85, 215], fill='#4E0705', outline='#3B0503', cross='#812203')
    draw.rounded_rectangle([15, 222, 85, min(h-5, 255)], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [20, 228, 75, 233], fill='#64748B', r=1)
    bar(draw, [20, 238, 80, 243], fill='#CBD5E1', r=1)

    # Right specs
    bar(draw, [95, 55, 170, 67], fill='#64748B', r=2)
    bar(draw, [95, 72, 140, 77], fill='#BD5705', r=1)
    bar(draw, [95, 82, 160, 87], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([95, 95, w-15, 122], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
    bar(draw, [100, 100, 160, 105], fill='#64748B', r=1)
    bar(draw, [100, 110, w-25, 115], fill='#CBD5E1', r=1)

    sw = (w - 95 - 25) // 3
    for r in range(2):
        for c in range(3):
            sx = 95 + c * (sw + 5)
            sy = 128 + r * 20
            draw.rounded_rectangle([sx, sy, sx + sw, sy + 17], radius=3, fill='#F8FAFC', outline='#E2E8F0', width=1)
            bar(draw, [sx + 4, sy + 3, sx + sw - 6, sy + 7], fill='#64748B', r=1)
            bar(draw, [sx + 4, sy + 10, sx + sw - 12, sy + 14], fill='#CBD5E1', r=1)

    pill(draw, [95, 174, 165, 190], fill='#BD5705')
    draw.rounded_rectangle([172, 174, 240, 190], radius=8, fill='#FFFFFF', outline='#CBD5E1', width=1)
    bar(draw, [185, 180, 227, 184], fill='#94A3B8', r=1)

    bar(draw, [95, 200, 180, 206], fill='#64748B', r=1)
    cross_box(draw, [95, 212, 125, min(h-5, 255)], fill='#BD5705', outline='#812203', cross='#E2E8F0')
    cross_box(draw, [132, 212, 162, min(h-5, 255)], fill='#4E0705', outline='#3B0503', cross='#E2E8F0')

    wf.save(os.path.join(out_dir, 'wf_04_chi_tiet_sach.png'))

# =========================================================================
# 5. DANH SÁCH XE (BẢN ĐỒ) (No Footer)
# =========================================================================
def gen_05():
    wf, draw, w, h, _ = get_canvas('05_danh_sach_xe_ban_do', has_top_title=True)
    navbar(draw, w, 28, 44)
    # Map container
    draw.rectangle([5, 48, w-5, h-5], fill='#F1F5F9', outline='#CBD5E1', width=1)
    cross_box(draw, [5, 48, w-5, h-5], fill='#F1F5F9', outline='#E2E8F0', cross='#E2E8F0')
    draw.rounded_rectangle([15, 55, 95, 67], radius=3, fill='#FFFFFF', outline='#CBD5E1', width=1)
    bar(draw, [25, 60, 85, 62], fill='#CBD5E1', r=1)
    pins = [(75, 105), (150, 125), (205, 95), (230, 165)]
    for px, py in pins:
        if py < h - 8:
            draw.ellipse([px-4, py-4, px+4, py+4], fill='#BD5705', outline='#FFFFFF', width=1)

    wf.save(os.path.join(out_dir, 'wf_05_danh_sach_xe_ban_do.png'))

# =========================================================================
# 6. CHI TIẾT XE BUÝT (No Footer)
# =========================================================================
def gen_06():
    wf, draw, w, h, _ = get_canvas('06_chi_tiet_xe_buyt', has_top_title=True)
    navbar(draw, w, 28, 44)
    sidebar(draw, 6, 48, 46, 160, active_idx=1)

    bar(draw, [52, 50, 110, 55], fill='#CBD5E1', r=1)
    bar(draw, [52, 58, 120, 66], fill='#64748B', r=1)

    # Bus banner
    draw.rounded_rectangle([52, 72, w-8, 102], radius=4, fill='#4E0705')
    bar(draw, [62, 82, 135, 92], fill='#FFFFFF', r=2)
    pill(draw, [142, 83, 175, 91], fill='#BD5705')
    draw.rounded_rectangle([w-38, 80, w-14, 94], radius=3, fill='#BD5705')

    # Books table (left)
    draw.rounded_rectangle([52, 108, 210, min(h-5, 345)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [58, 114, 110, 122], fill='#64748B', r=1)
    draw.rectangle([56, 126, 206, 136], fill='#FAF4EC')
    bar(draw, [60, 129, 85, 133], fill='#812203', r=1)
    bar(draw, [110, 129, 135, 133], fill='#812203', r=1)
    bar(draw, [160, 129, 195, 133], fill='#812203', r=1)
    for r in range(11):
        ry = 140 + r * 18
        if ry + 12 > h - 8: break
        bar(draw, [60, ry + 3, 98, ry + 8], fill='#64748B', r=1)
        bar(draw, [110, ry + 3, 140, ry + 8], fill='#94A3B8', r=1)
        pill(draw, [165, ry + 2, 200, ry + 11], fill='#059669' if r % 2 == 0 else '#BD5705')

    # Right info cards
    draw.rounded_rectangle([215, 108, w-8, 185], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [220, 114, 265, 121], fill='#64748B', r=1)
    for r in range(5):
        iy = 126 + r * 11
        bar(draw, [220, iy, 245, iy + 4], fill='#94A3B8', r=1)
        bar(draw, [252, iy, w-14, iy + 4], fill='#64748B', r=1)

    draw.rounded_rectangle([215, 192, w-8, 235], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [220, 198, 255, 204], fill='#64748B', r=1)
    draw.ellipse([240, 212, 250, 222], fill='#059669')

    wf.save(os.path.join(out_dir, 'wf_06_chi_tiet_xe_buyt.png'))

# =========================================================================
# 7. DASHBOARD QUẢN LÝ THƯ VIỆN (No Footer)
# =========================================================================
def gen_07():
    wf, draw, w, h, _ = get_canvas('07_dashboard_quan_ly_thu_vien', has_top_title=True)
    navbar(draw, w, 28, 44)
    sidebar(draw, 6, 48, 46, 160, active_idx=0)

    bar(draw, [52, 50, 110, 55], fill='#CBD5E1', r=1)
    bar(draw, [52, 60, 150, 70], fill='#64748B', r=2)
    pill(draw, [w-42, 60, w-10, 70], fill='#BD5705')

    kw = (w - 52 - 10 - 12) // 4
    for c in range(4):
        kx = 52 + c * (kw + 4)
        draw.rounded_rectangle([kx, 76, kx + kw, 120], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        draw.ellipse([kx + kw//2 - 5, 82, kx + kw//2 + 5, 92], fill='#BD5705')
        bar(draw, [kx + 6, 96, kx + kw - 6, 105], fill='#64748B', r=2)
        bar(draw, [kx + 4, 110, kx + kw - 4, 114], fill='#94A3B8', r=1)

    draw.rounded_rectangle([52, 128, 210, 265], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [58, 134, 130, 142], fill='#64748B', r=1)
    for r in range(5):
        ry = 150 + r * 22
        bar(draw, [60, ry + 2, 105, ry + 8], fill='#64748B', r=1)
        bar(draw, [115, ry + 2, 145, ry + 8], fill='#94A3B8', r=1)
        bar(draw, [155, ry + 2, 200, ry + 8], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([215, 128, w-8, 265], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [220, 134, 265, 142], fill='#64748B', r=1)
    for r in range(5):
        ry = 150 + r * 22
        bar(draw, [220, ry + 2, 265, ry + 8], fill='#64748B', r=1)
        pill(draw, [w-25, ry + 2, w-12, ry + 9], fill='#FDE971')

    draw.rounded_rectangle([52, 272, 210, min(h-5, 335)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [58, 278, 145, 285], fill='#64748B', r=1)
    bar(draw, [60, 295, 190, 301], fill='#CBD5E1', r=2)
    bar(draw, [60, 315, 175, 321], fill='#CBD5E1', r=2)

    draw.rounded_rectangle([215, 272, w-8, min(h-5, 335)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [220, 278, 265, 285], fill='#64748B', r=1)

    wf.save(os.path.join(out_dir, 'wf_07_dashboard_quan_ly_thu_vien.png'))

# =========================================================================
# 8. DANH SÁCH QUYÊN GÓP SÁCH (No Footer)
# =========================================================================
def gen_08():
    wf, draw, w, h, _ = get_canvas('08_danh_sach_quyen_gop_sach', has_top_title=True)
    navbar(draw, w, 28, 44)
    sidebar(draw, 6, 48, 46, 140, active_idx=3)

    bar(draw, [52, 50, 140, 60], fill='#64748B', r=2)
    draw.rounded_rectangle([52, 66, 180, 78], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [60, 70, 120, 74], fill='#CBD5E1', r=1)
    pill(draw, [185, 66, 230, 78], fill='#BD5705')

    draw.rounded_rectangle([52, 86, w-8, min(h-5, 218)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.rectangle([54, 90, w-10, 102], fill='#FAF4EC')
    bar(draw, [60, 94, 95, 98], fill='#812203', r=1)
    bar(draw, [120, 94, 155, 98], fill='#812203', r=1)
    bar(draw, [180, 94, 220, 98], fill='#812203', r=1)
    bar(draw, [240, 94, 275, 98], fill='#812203', r=1)
    for r in range(5):
        ry = 108 + r * 21
        if ry + 12 > h - 5: break
        draw.ellipse([60, ry + 2, 70, ry + 12], fill='#CBD5E1')
        bar(draw, [75, ry + 4, 115, ry + 10], fill='#64748B', r=1)
        bar(draw, [125, ry + 4, 170, ry + 10], fill='#94A3B8', r=1)
        bar(draw, [185, ry + 4, 225, ry + 10], fill='#CBD5E1', r=1)
        pill(draw, [240, ry + 3, 280, ry + 12], fill='#059669' if r % 2 == 0 else '#BD5705')

    wf.save(os.path.join(out_dir, 'wf_08_danh_sach_quyen_gop_sach.png'))

# =========================================================================
# 9. TẠO PHIẾU MƯỢN SÁCH (No Footer)
# =========================================================================
def gen_09():
    wf, draw, w, h, _ = get_canvas('09_tao_phieu_muon_sach', has_top_title=False)
    navbar(draw, w, 0, 18)
    sidebar(draw, 8, 26, 48, 120, active_idx=1)

    bar(draw, [55, 28, 135, 38], fill='#64748B', r=2)
    draw.rounded_rectangle([55, 46, w-10, 72], radius=4, fill='#631E05')
    bar(draw, [80, 54, w-35, 64], fill='#FFFFFF', r=2)

    draw.rounded_rectangle([55, 78, w-10, 124], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [62, 84, 125, 90], fill='#64748B', r=1)
    draw.rounded_rectangle([62, 96, w-18, 114], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [70, 102, 130, 108], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([55, 130, w-10, 176], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [62, 136, 115, 142], fill='#64748B', r=1)
    draw.rounded_rectangle([62, 148, w-18, 166], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [70, 154, 130, 160], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([55, 182, w-10, 240], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [62, 188, 110, 194], fill='#64748B', r=1)
    bar(draw, [62, 204, w-18, 208], fill='#CBD5E1', r=1)
    draw.rounded_rectangle([62, 218, w-18, 234], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)

    draw.rounded_rectangle([55, 246, w-10, 310], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [62, 252, 95, 258], fill='#64748B', r=1)
    draw.rounded_rectangle([62, 264, w-18, 302], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)

    pill(draw, [115, 320, 180, 334], fill='#BD5705')
    pill(draw, [188, 320, 225, 334], fill='#94A3B8')

    wf.save(os.path.join(out_dir, 'wf_09_tao_phieu_muon_sach.png'))

# =========================================================================
# 10. TẠO ĐẶT TRƯỚC SÁCH (No Footer)
# =========================================================================
def gen_10():
    wf, draw, w, h, _ = get_canvas('10_tao_dat_truoc_sach', has_top_title=True)
    navbar(draw, w, 28, 44)
    sidebar(draw, 6, 48, 46, 130, active_idx=2)

    bar(draw, [52, 50, 130, 60], fill='#64748B', r=2)
    draw.rounded_rectangle([52, 68, w-8, 96], radius=4, fill='#631E05')
    bar(draw, [80, 78, w-35, 88], fill='#FFFFFF', r=2)

    draw.rounded_rectangle([52, 104, w-8, min(h-5, 208)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    for i in range(3):
        iy = 112 + i * 28
        bar(draw, [60, iy, 110, iy + 6], fill='#64748B', r=1)
        draw.rounded_rectangle([60, iy + 8, w-16, iy + 24], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)

    pill(draw, [110, 188, 180, 201], fill='#BD5705')

    wf.save(os.path.join(out_dir, 'wf_10_tao_dat_truoc_sach.png'))

# =========================================================================
# 11. DASHBOARD GIAO DỊCH (No Footer)
# =========================================================================
def gen_11():
    wf, draw, w, h, _ = get_canvas('11_dashboard_giao_dich', has_top_title=True)
    navbar(draw, w, 28, 44)
    sidebar(draw, 6, 48, 46, 160, active_idx=0)

    draw.rounded_rectangle([52, 50, w-8, 76], radius=4, fill='#631E05')
    bar(draw, [60, 58, 160, 68], fill='#FFFFFF', r=2)

    kw = (w - 52 - 10 - 8) // 3
    for c in range(3):
        kx = 52 + c * (kw + 4)
        draw.rounded_rectangle([kx, 84, kx + kw, 126], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        bar(draw, [kx + 6, 92, kx + kw - 6, 98], fill='#94A3B8', r=1)
        bar(draw, [kx + 8, 104, kx + kw - 8, 118], fill='#64748B', r=2)

    draw.rounded_rectangle([52, 134, w-8, 335], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [58, 140, 135, 148], fill='#64748B', r=1)
    for r in range(6):
        ry = 156 + r * 28
        bar(draw, [60, ry + 2, 110, ry + 8], fill='#64748B', r=1)
        bar(draw, [120, ry + 2, 165, ry + 8], fill='#94A3B8', r=1)
        pill(draw, [w-45, ry + 1, w-14, ry + 11], fill='#059669' if r % 2 == 0 else '#BD5705')

    for c in range(3):
        kx = 52 + c * (kw + 4)
        draw.rounded_rectangle([kx, 345, kx + kw, min(h-5, 430)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        bar(draw, [kx + 4, 352, kx + kw - 4, 358], fill='#64748B', r=1)
        draw.ellipse([kx + kw//2 - 10, 375, kx + kw//2 + 10, 395], fill='#BD5705')

    wf.save(os.path.join(out_dir, 'wf_11_dashboard_giao_dich.png'))

# =========================================================================
# 12. DASHBOARD NGƯỜI DÙNG (No Footer)
# =========================================================================
def gen_12():
    wf, draw, w, h, _ = get_canvas('12_dashboard_nguoi_dung', has_top_title=True)
    navbar(draw, w, 28, 44)
    sidebar(draw, 6, 48, 46, 160, active_idx=0)

    draw.rounded_rectangle([52, 50, w-8, 82], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.ellipse([60, 56, 80, 76], fill='#BD5705')
    bar(draw, [90, 58, 170, 68], fill='#64748B', r=2)
    bar(draw, [90, 72, 140, 76], fill='#CBD5E1', r=1)

    kw = (w - 52 - 10 - 8) // 3
    for c in range(3):
        kx = 52 + c * (kw + 4)
        draw.rounded_rectangle([kx, 88, kx + kw, 130], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        bar(draw, [kx + 4, 94, kx + kw - 4, 100], fill='#94A3B8', r=1)
        bar(draw, [kx + 8, 106, kx + kw - 8, 120], fill='#BD5705', r=2)

    draw.rounded_rectangle([52, 138, w-8, 335], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [58, 144, 150, 152], fill='#64748B', r=1)
    for r in range(5):
        ry = 160 + r * 32
        bar(draw, [60, ry + 4, 130, ry + 12], fill='#64748B', r=1)
        bar(draw, [60, ry + 16, 105, ry + 22], fill='#94A3B8', r=1)
        pill(draw, [w-50, ry + 8, w-14, ry + 20], fill='#BD5705')

    draw.rounded_rectangle([52, 345, w-8, min(h-5, 425)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [58, 350, 140, 356], fill='#64748B', r=1)
    bw = (w - 52 - 10 - 12) // 3
    for c in range(3):
        bx = 58 + c * (bw + 4)
        cross_box(draw, [bx, 362, bx + bw - 4, min(h-8, 415)], fill='#E2E8F0', outline='#CBD5E1')

    wf.save(os.path.join(out_dir, 'wf_12_dashboard_nguoi_dung.png'))

# =========================================================================
# 13. ĐĂNG NHẬP (No Footer)
# =========================================================================
def gen_13():
    wf, draw, w, h, _ = get_canvas('13_dang_nhap', has_top_title=False)
    navbar(draw, w, 0, 18)
    bar(draw, [110, 26, 190, 38], fill='#64748B', r=2)
    bar(draw, [80, 42, 220, 47], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([35, 55, 195, 208], radius=5, fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.rectangle([35, 55, 195, 88], fill='#631E05')
    draw.ellipse([105, 60, 125, 80], fill='#FFFFFF')
    bar(draw, [70, 96, 160, 102], fill='#64748B', r=1)

    draw.rounded_rectangle([45, 108, 185, 126], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [52, 114, 110, 120], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([45, 134, 185, 152], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [52, 140, 95, 146], fill='#CBD5E1', r=1)

    pill(draw, [45, 164, 185, 178], fill='#BD5705')
    bar(draw, [75, 188, 155, 194], fill='#CBD5E1', r=1)

    for i in range(3):
        iy = 72 + i * 36
        if iy + 14 > h - 5: break
        draw.ellipse([215, iy + 2, 227, iy + 14], fill='#BD5705')
        bar(draw, [233, iy + 4, w-15, iy + 8], fill='#64748B', r=1)
        bar(draw, [233, iy + 11, w-25, iy + 15], fill='#CBD5E1', r=1)

    wf.save(os.path.join(out_dir, 'wf_13_dang_nhap.png'))

# =========================================================================
# 14. ĐĂNG KÝ (No Footer)
# =========================================================================
def gen_14():
    wf, draw, w, h, _ = get_canvas('14_dang_ky', has_top_title=False)
    navbar(draw, w, 0, 18)
    bar(draw, [100, 26, 200, 38], fill='#64748B', r=2)

    draw.rounded_rectangle([35, 48, 195, min(h-5, 248)], radius=5, fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.rectangle([35, 48, 195, 78], fill='#631E05')
    bar(draw, [65, 58, 165, 68], fill='#FFFFFF', r=2)

    for i in range(5):
        iy = 86 + i * 23
        if iy + 20 > h - 25: break
        bar(draw, [45, iy, 95, iy + 5], fill='#64748B', r=1)
        draw.rounded_rectangle([45, iy + 7, 185, iy + 20], radius=2, fill='#F8FAFC', outline='#CBD5E1', width=1)

    pill(draw, [45, 215, 185, 230], fill='#BD5705')

    for i in range(3):
        iy = 65 + i * 40
        if iy + 14 > h - 5: break
        draw.ellipse([215, iy + 2, 227, iy + 14], fill='#BD5705')
        bar(draw, [233, iy + 4, w-15, iy + 8], fill='#64748B', r=1)
        bar(draw, [233, iy + 11, w-25, iy + 15], fill='#CBD5E1', r=1)

    wf.save(os.path.join(out_dir, 'wf_14_dang_ky.png'))

# =========================================================================
# 15. BLOG TRANG CHỦ (No Footer)
# =========================================================================
def gen_15():
    wf, draw, w, h, _ = get_canvas('15_blog_trang_chu', has_top_title=True)
    navbar(draw, w, 28, 44)

    draw.rounded_rectangle([2, 48, w-3, 130], radius=4, fill='#631E05')
    bar(draw, [60, 68, w-60, 84], fill='#FFFFFF', r=2)
    bar(draw, [80, 92, w-80, 98], fill='#BD5705', r=1)

    draw.rounded_rectangle([15, 138, 180, 154], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [25, 143, 90, 149], fill='#CBD5E1', r=1)
    pill(draw, [190, 138, 235, 154], fill='#BD5705')

    draw.rounded_rectangle([15, 162, w-15, 275], radius=5, fill='#FFFFFF', outline='#E2E8F0', width=1)
    cross_box(draw, [15, 162, 115, 275], fill='#E2E8F0', outline='#CBD5E1')
    pill(draw, [125, 172, 165, 182], fill='#BD5705')
    bar(draw, [125, 190, w-25, 200], fill='#64748B', r=2)
    bar(draw, [125, 208, w-25, 214], fill='#CBD5E1', r=1)
    bar(draw, [125, 220, w-35, 226], fill='#CBD5E1', r=1)
    draw.ellipse([125, 245, 138, 258], fill='#CBD5E1')
    bar(draw, [144, 248, 195, 254], fill='#94A3B8', r=1)

    cw = (w - 30 - 10) // 3
    for c in range(3):
        cx = 15 + c * (cw + 5)
        cy = 285
        draw.rounded_rectangle([cx, cy, cx + cw, cy + 160], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        cross_box(draw, [cx, cy, cx + cw, cy + 65], fill='#E2E8F0', outline='#CBD5E1')
        pill(draw, [cx + 4, cy + 72, cx + 32, cy + 80], fill='#FAF4EC')
        bar(draw, [cx + 4, cy + 86, cx + cw - 6, cy + 93], fill='#64748B', r=1)
        bar(draw, [cx + 4, cy + 98, cx + cw - 12, cy + 103], fill='#CBD5E1', r=1)
        draw.ellipse([cx + 4, cy + 135, cx + 16, cy + 147], fill='#CBD5E1')
        bar(draw, [cx + 20, cy + 138, cx + cw - 10, cy + 144], fill='#94A3B8', r=1)

    cx = 15
    cy = 465
    draw.rounded_rectangle([cx, cy, cx + cw, min(h-5, cy + 160)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    cross_box(draw, [cx, cy, cx + cw, cy + 65], fill='#E2E8F0', outline='#CBD5E1')
    pill(draw, [cx + 4, cy + 72, cx + 32, cy + 80], fill='#FAF4EC')
    bar(draw, [cx + 4, cy + 86, cx + cw - 6, cy + 93], fill='#64748B', r=1)
    bar(draw, [cx + 4, cy + 98, cx + cw - 12, cy + 103], fill='#CBD5E1', r=1)

    wf.save(os.path.join(out_dir, 'wf_15_blog_trang_chu.png'))

# =========================================================================
# 16. BLOG CHI TIẾT BÀI VIẾT (No Footer)
# =========================================================================
def gen_016():
    wf, draw, w, h, _ = get_canvas('16_blog_chi_tiet_bai_viet', has_top_title=True)
    navbar(draw, w, 28, 44)

    pill(draw, [15, 52, 65, 62], fill='#BD5705')
    bar(draw, [15, 68, w-30, 80], fill='#64748B', r=2)
    draw.ellipse([15, 86, 28, 99], fill='#CBD5E1')
    bar(draw, [34, 89, 100, 95], fill='#94A3B8', r=1)

    cross_box(draw, [15, 106, w-15, 215], fill='#E2E8F0', outline='#CBD5E1')

    for r in range(6):
        py = 228 + r * 14
        bar(draw, [15, py, w - 15 - (r % 3) * 20, py + 7], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([15, 335, w-15, 385], radius=4, fill='#FAF4EC', outline='#ED9040', width=1)
    draw.ellipse([25, 345, 45, 365], fill='#BD5705')
    bar(draw, [55, 348, 120, 355], fill='#64748B', r=1)
    bar(draw, [55, 360, w-30, 365], fill='#CBD5E1', r=1)

    bar(draw, [15, 400, 85, 408], fill='#64748B', r=1)
    draw.rounded_rectangle([15, 415, w-15, min(h-5, 455)], radius=3, fill='#F8FAFC', outline='#CBD5E1', width=1)

    wf.save(os.path.join(out_dir, 'wf_16_blog_chi_tiet_bai_viet.png'))

# =========================================================================
# 17. THÔNG BÁO (No Footer)
# =========================================================================
def gen_17():
    wf, draw, w, h, _ = get_canvas('17_thong_bao', has_top_title=False)
    navbar(draw, w, 0, 18)
    bar(draw, [15, 26, 95, 38], fill='#64748B', r=2)

    for c, tw in enumerate([32, 45, 42]):
        tx = 15 + c * 52
        pill(draw, [tx, 46, tx + tw, 58], fill='#BD5705' if c == 0 else '#F1F5F9')

    draw.rounded_rectangle([15, 66, w-15, min(h-5, 160)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(4):
        ry = 72 + r * 22
        if ry + 12 > h - 5: break
        draw.ellipse([22, ry + 2, 32, ry + 12], fill='#BD5705')
        bar(draw, [38, ry + 3, 140, ry + 8], fill='#64748B', r=1)
        bar(draw, [38, ry + 10, 95, ry + 14], fill='#CBD5E1', r=1)
        pill(draw, [w-38, ry + 3, w-22, ry + 11], fill='#FAF4EC')

    wf.save(os.path.join(out_dir, 'wf_17_thong_bao.png'))

# =========================================================================
# 18. ANALYTICS DASHBOARD (No Footer)
# =========================================================================
def gen_18():
    wf, draw, w, h, _ = get_canvas('18_analytics_dashboard', has_top_title=False)
    navbar(draw, w, 0, 18)
    draw.rectangle([0, 19, w-1, 30], fill='#631E05')
    bar(draw, [12, 22, 60, 27], fill='#FFFFFF', r=1)
    sidebar(draw, 6, 35, 46, 170, active_idx=0)

    draw.rounded_rectangle([52, 35, w-8, 72], radius=4, fill='#631E05')
    bar(draw, [60, 45, 150, 56], fill='#FFFFFF', r=2)

    kw4 = (w - 52 - 8 - 12) // 4
    for c in range(4):
        kx = 52 + c * (kw4 + 4)
        draw.rounded_rectangle([kx, 78, kx + kw4, 102], radius=3, fill='#FFFFFF', outline='#E2E8F0', width=1)
        draw.ellipse([kx + kw4//2 - 4, 82, kx + kw4//2 + 4, 90], fill='#BD5705')
        bar(draw, [kx + 3, 93, kx + kw4 - 3, 97], fill='#64748B', r=1)

    kw3 = (w - 52 - 8 - 8) // 3
    for c in range(3):
        kx = 52 + c * (kw3 + 4)
        draw.rounded_rectangle([kx, 108, kx + kw3, 148], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        bar(draw, [kx + 4, 114, kx + kw3 - 4, 120], fill='#94A3B8', r=1)
        bar(draw, [kx + 6, 126, kx + kw3 - 6, 140], fill='#BD5705', r=2)

    draw.rounded_rectangle([52, 154, 52 + kw3, 190], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [56, 160, 52 + kw3 - 4, 165], fill='#94A3B8', r=1)
    bar(draw, [58, 170, 52 + kw3 - 6, 182], fill='#64748B', r=2)

    draw.rounded_rectangle([52, 198, w-8, 268], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [58, 204, 130, 212], fill='#64748B', r=1)
    draw.ellipse([150, 226, 162, 238], fill='#CBD5E1')
    bar(draw, [110, 246, 200, 252], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([52, 276, w-8, min(h-5, 348)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    bar(draw, [58, 282, 130, 290], fill='#64748B', r=1)
    draw.ellipse([150, 305, 162, 317], fill='#CBD5E1')

    wf.save(os.path.join(out_dir, 'wf_18_analytics_dashboard.png'))

# =========================================================================
# 19. FAQ (No Footer)
# =========================================================================
def gen_19():
    wf, draw, w, h, _ = get_canvas('19_faq', has_top_title=False)
    navbar(draw, w, 0, 18)
    bar(draw, [90, 26, 210, 38], fill='#64748B', r=2)
    bar(draw, [70, 42, 230, 47], fill='#CBD5E1', r=1)

    draw.rounded_rectangle([25, 58, w-25, min(h-5, 138)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(4):
        ay = 64 + r * 18
        if ay + 10 > h - 5: break
        bar(draw, [35, ay + 3, w-55, ay + 9], fill='#64748B', r=1)
        draw.line([w-42, ay + 4, w-38, ay + 8], fill='#94A3B8', width=1)
        draw.line([w-38, ay + 8, w-34, ay + 4], fill='#94A3B8', width=1)

    wf.save(os.path.join(out_dir, 'wf_19_faq.png'))

# =========================================================================
# 20. LIÊN HỆ (No Footer)
# =========================================================================
def gen_20():
    wf, draw, w, h, _ = get_canvas('20_lien_he', has_top_title=False)
    navbar(draw, w, 0, 18)
    bar(draw, [100, 26, 200, 38], fill='#64748B', r=2)
    bar(draw, [80, 42, 220, 47], fill='#CBD5E1', r=1)

    cw = (w - 40 - 10) // 3
    for c in range(3):
        cx = 20 + c * (cw + 5)
        draw.rounded_rectangle([cx, 55, cx + cw, min(h-5, 96)], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        draw.ellipse([cx + cw//2 - 5, 60, cx + cw//2 + 5, 70], fill='#BD5705')
        bar(draw, [cx + 4, 76, cx + cw - 4, 82], fill='#64748B', r=1)
        bar(draw, [cx + 4, 86, cx + cw - 4, 90], fill='#CBD5E1', r=1)

    wf.save(os.path.join(out_dir, 'wf_20_lien_he.png'))

# RUN ALL
gen_01()
gen_02()
gen_03()
gen_04()
gen_05()
gen_06()
gen_07()
gen_08()
gen_09()
gen_10()
gen_11()
gen_12()
gen_13()
gen_14()
gen_15()
gen_016()
gen_17()
gen_18()
gen_19()
gen_20()

print('Successfully generated all 20 clean Wireframes without footer!')

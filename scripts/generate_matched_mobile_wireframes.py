import os
import json
from PIL import Image, ImageDraw

out_dir = r'public\library-bus\mobile_screens'
os.makedirs(out_dir, exist_ok=True)

with open('scripts/mobile_screens_meta.json', 'r', encoding='utf-8') as f:
    screens = json.load(f)

def get_canvas(screen_id):
    ui_path = os.path.join(out_dir, f'ui_{screen_id}.png')
    ui = Image.open(ui_path).convert('RGB')
    w, h = ui.size
    wf = Image.new('RGB', (w, h), '#FFFFFF')
    draw = ImageDraw.Draw(wf)
    # Subtle container border
    draw.rectangle([0, 0, w-1, h-1], outline='#CBD5E1', width=1)
    return wf, draw, w, h, ui

# Grayscale primitives
def cross_box(draw, b, fill='#F1F5F9', outline='#CBD5E1', cross='#CBD5E1'):
    draw.rectangle(b, fill=fill, outline=outline, width=1)
    draw.line([b[0], b[1], b[2], b[3]], fill=cross, width=1)
    draw.line([b[0], b[3], b[2], b[1]], fill=cross, width=1)

def bar(draw, b, fill='#CBD5E1', r=2):
    draw.rounded_rectangle(b, radius=r, fill=fill)

def pill(draw, b, fill='#94A3B8'):
    r = max(1, (b[3] - b[1]) // 2)
    draw.rounded_rectangle(b, radius=r, fill=fill)

def mob_nav(draw, w, title_w=120, right_w=60, has_burger=True):
    draw.rectangle([0, 0, w, 48], fill='#FAF8F5')
    draw.line([0, 48, w, 48], fill='#E2E8F0', width=1)
    if has_burger:
        draw.line([16, 20, 32, 20], fill='#64748B', width=2)
        draw.line([16, 25, 32, 25], fill='#64748B', width=2)
        draw.line([16, 30, 32, 30], fill='#64748B', width=2)
        bar(draw, [42, 18, 42 + title_w, 30], fill='#475569', r=2)
    else:
        bar(draw, [16, 18, 16 + title_w, 30], fill='#475569', r=2)
        
    if right_w > 0:
        bar(draw, [w - 16 - right_w, 20, w - 16, 28], fill='#94A3B8', r=1)

# -------------------------------------------------------------
# Screen Generators (34 screens)
# -------------------------------------------------------------

# mob_01: Trang chủ (416x730)
def gen_mob_01():
    wf, draw, w, h, _ = get_canvas('mob_01')
    mob_nav(draw, w, title_w=100, right_w=70)
    
    # Hero box
    cross_box(draw, [12, 58, w - 12, 195], fill='#E2E8F0', outline='#94A3B8')
    bar(draw, [28, 80, w - 50, 96], fill='#334155', r=3)
    bar(draw, [28, 106, w - 100, 116], fill='#64748B', r=2)
    pill(draw, [28, 140, 160, 168], fill='#94A3B8')
    
    # 3 Stats row
    sw = (w - 24 - 16) // 3
    for i in range(3):
        sx = 12 + i * (sw + 8)
        draw.rounded_rectangle([sx, 208, sx + sw, 258], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 10, 218, sx + sw - 10, 230], fill='#334155', r=2)
        bar(draw, [sx + 8, 238, sx + sw - 8, 246], fill='#94A3B8', r=1)

    # Sách mới cập nhật (2 books side by side)
    bar(draw, [12, 274, 150, 288], fill='#334155', r=2)
    bw = (w - 24 - 12) // 2
    for i in range(2):
        bx = 12 + i * (bw + 12)
        cross_box(draw, [bx, 298, bx + bw, 400], fill='#CBD5E1', outline='#94A3B8')
        bar(draw, [bx, 408, bx + bw - 20, 418], fill='#475569', r=1)
        bar(draw, [bx, 424, bx + bw - 40, 432], fill='#94A3B8', r=1)

    # Tin tức (2 news side by side)
    bar(draw, [12, 452, 140, 466], fill='#334155', r=2)
    for i in range(2):
        bx = 12 + i * (bw + 12)
        cross_box(draw, [bx, 476, bx + bw, 570], fill='#CBD5E1', outline='#94A3B8')
        bar(draw, [bx, 578, bx + bw - 10, 592], fill='#475569', r=1)
        bar(draw, [bx, 598, bx + bw - 30, 606], fill='#94A3B8', r=1)

    # Bottom CTA button
    pill(draw, [24, 630, w - 24, 666], fill='#64748B')
    wf.save(os.path.join(out_dir, 'wf_mob_01.png'))

# mob_02: Giới thiệu (416x462)
def gen_mob_02():
    wf, draw, w, h, _ = get_canvas('mob_02')
    mob_nav(draw, w, title_w=100, right_w=40)
    bar(draw, [16, 62, w - 60, 78], fill='#334155', r=2)
    bar(draw, [16, 88, w - 30, 98], fill='#64748B', r=1)
    bar(draw, [16, 104, w - 100, 114], fill='#64748B', r=1)
    cross_box(draw, [16, 126, w - 16, 230], fill='#CBD5E1', outline='#94A3B8')
    bar(draw, [16, 248, 180, 262], fill='#334155', r=2)
    
    # 3 numbered items
    for i in range(3):
        iy = 276 + i * 54
        draw.ellipse([16, iy + 2, 34, iy + 20], fill='#94A3B8')
        bar(draw, [42, iy, 160, iy + 12], fill='#475569', r=1)
        bar(draw, [42, iy + 18, w - 20, iy + 28], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_02.png'))

# mob_03: Liên hệ (416x550) - Refined with circular icons
def gen_mob_03():
    wf, draw, w, h, _ = get_canvas('mob_03')
    mob_nav(draw, w, title_w=100, right_w=40)
    bar(draw, [16, 62, 170, 80], fill='#334155', r=2)
    
    y = 96
    for i in range(2):
        bar(draw, [16, y, 90, y + 10], fill='#64748B', r=1)
        draw.rounded_rectangle([16, y + 16, w - 16, y + 54], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
        bar(draw, [28, y + 30, 130, y + 40], fill='#CBD5E1', r=1)
        y += 66
    
    bar(draw, [16, y, 80, y + 10], fill='#64748B', r=1)
    draw.rounded_rectangle([16, y + 16, w - 16, y + 90], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [28, y + 30, 160, y + 40], fill='#CBD5E1', r=1)
    y += 104
    
    pill(draw, [16, y, w - 16, y + 40], fill='#64748B')
    
    # 3 circular icon badges with info
    cy = y + 56
    for k in range(3):
        iy = cy + k * 34
        draw.ellipse([20, iy, 42, iy + 22], fill='#E2E8F0')
        bar(draw, [52, iy + 6, 200 + k * 20, iy + 16], fill='#64748B', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_03.png'))

# mob_04: Câu hỏi thường gặp (416x355)
def gen_mob_04():
    wf, draw, w, h, _ = get_canvas('mob_04')
    mob_nav(draw, w, title_w=100, right_w=40)
    bar(draw, [16, 62, 160, 80], fill='#334155', r=2)
    y = 96
    for i in range(5):
        draw.rounded_rectangle([16, y, w - 16, y + 38 if i != 1 else y + 68], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [28, y + 12, w - 50, y + 24], fill='#475569', r=1)
        bar(draw, [w - 36, y + 14, w - 26, y + 22], fill='#94A3B8', r=1)
        if i == 1:
            bar(draw, [28, y + 36, w - 40, y + 46], fill='#94A3B8', r=1)
            bar(draw, [28, y + 50, w - 80, y + 58], fill='#94A3B8', r=1)
            y += 74
        else:
            y += 44
    wf.save(os.path.join(out_dir, 'wf_mob_04.png'))

# mob_05: Dashboard tổng quan - Wide (715x377)
def gen_mob_05():
    wf, draw, w, h, _ = get_canvas('mob_05')
    draw.rectangle([0, 0, w, 48], fill='#FAF8F5')
    draw.line([0, 48, w, 48], fill='#E2E8F0', width=1)
    bar(draw, [16, 16, 170, 30], fill='#334155', r=2)
    pill(draw, [w - 110, 12, w - 16, 36], fill='#64748B')
    
    bar(draw, [16, 62, 220, 78], fill='#334155', r=2)
    sw = (w - 32 - 36) // 4
    for i in range(4):
        sx = 16 + i * (sw + 12)
        draw.rounded_rectangle([sx, 92, sx + sw, 156], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 14, 106, sx + sw - 20, 124], fill='#334155', r=2)
        bar(draw, [sx + 14, 132, sx + sw - 40, 142], fill='#94A3B8', r=1)

    col_w = (w - 32 - 16) // 2
    bar(draw, [16, 172, 170, 186], fill='#334155', r=2)
    draw.rectangle([16, 194, 16 + col_w, h - 16], fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(4):
        ry = 194 + r * 36
        draw.line([16, ry, 16 + col_w, ry], fill='#F1F5F9', width=1)
        bar(draw, [28, ry + 12, 120, ry + 22], fill='#475569', r=1)
        bar(draw, [140, ry + 12, 200, ry + 22], fill='#94A3B8', r=1)
        pill(draw, [16 + col_w - 70, ry + 8, 16 + col_w - 16, ry + 26], fill='#CBD5E1')

    rx = 16 + col_w + 16
    bar(draw, [rx, 172, rx + 120, 186], fill='#334155', r=2)
    bw = (col_w - 12) // 2
    for i in range(2):
        bx = rx + i * (bw + 12)
        cross_box(draw, [bx, 194, bx + bw, h - 40], fill='#CBD5E1', outline='#94A3B8')
        bar(draw, [bx, h - 30, bx + bw - 10, h - 20], fill='#475569', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_05.png'))

# mob_06: Danh sách sách (416x384)
def gen_mob_06():
    wf, draw, w, h, _ = get_canvas('mob_06')
    mob_nav(draw, w, title_w=100, right_w=40)
    bar(draw, [16, 60, 140, 76], fill='#334155', r=2)
    draw.rounded_rectangle([16, 84, w - 16, 114], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [26, 94, 150, 104], fill='#94A3B8', r=1)
    bar(draw, [190, 94, 260, 104], fill='#94A3B8', r=1)
    bar(draw, [300, 94, 380, 104], fill='#94A3B8', r=1)

    bw = (w - 32 - 25) // 6
    for i in range(6):
        bx = 16 + i * (bw + 5)
        cross_box(draw, [bx, 126, bx + bw, 220], fill='#CBD5E1', outline='#94A3B8')
        pill(draw, [bx, 226, bx + bw, 240], fill='#E2E8F0')
        bar(draw, [bx, 246, bx + bw - 6, 258], fill='#475569', r=1)
        bar(draw, [bx, 262, bx + bw - 12, 270], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_06.png'))

# mob_07: Chi tiết sách (416x599) - Refined with 6 stat boxes
def gen_mob_07():
    wf, draw, w, h, _ = get_canvas('mob_07')
    mob_nav(draw, w, title_w=100, right_w=30)
    cross_box(draw, [16, 58, w - 16, 210], fill='#CBD5E1', outline='#94A3B8')
    pill(draw, [28, 70, 78, 90], fill='#94A3B8')
    
    bar(draw, [16, 224, 150, 242], fill='#334155', r=2)
    bar(draw, [16, 248, 180, 258], fill='#64748B', r=1)
    
    # 6 stats grid (matching UI design exactly)
    sw = (w - 32 - 25) // 6
    for i in range(6):
        sx = 16 + i * (sw + 5)
        draw.rounded_rectangle([sx, 272, sx + sw, 320], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 2, 282, sx + sw - 2, 294], fill='#334155', r=1)
        bar(draw, [sx + 2, 302, sx + sw - 2, 310], fill='#94A3B8', r=1)

    bar(draw, [16, 336, 140, 350], fill='#334155', r=2)
    bar(draw, [16, 360, w - 20, 370], fill='#64748B', r=1)
    bar(draw, [16, 376, w - 50, 386], fill='#64748B', r=1)
    
    bar(draw, [16, 410, 160, 424], fill='#334155', r=2)
    bw = (w - 32 - 16) // 3
    for i in range(3):
        bx = 16 + i * (bw + 8)
        cross_box(draw, [bx, 436, bx + bw, 530], fill='#CBD5E1', outline='#94A3B8')
        bar(draw, [bx, 538, bx + bw - 10, 548], fill='#475569', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_07.png'))

# mob_08: Form thêm/sửa sách (416x707) - Refined with titles inside card containers
def gen_mob_08():
    wf, draw, w, h, _ = get_canvas('mob_08')
    mob_nav(draw, w, title_w=100, right_w=40)
    
    sections = [
        ("Thông tin cơ bản", ["Tên sách", "Tác giả"]),
        ("Thông tin xuất bản", ["ISBN", "Năm xuất bản"]),
        ("Trạng thái & cài đặt", ["Mô tả", "Tình trạng sách"])
    ]
    y = 66
    for sec_idx, (sec_title, fields) in enumerate(sections):
        card_h = 160 if sec_idx == 2 else 140
        draw.rounded_rectangle([16, y, w - 16, y + card_h], radius=6, fill='#FAF8F5', outline='#E2E8F0', width=1)
        bar(draw, [28, y + 14, 160, y + 28], fill='#334155', r=2) # Title inside card
        
        fy = y + 36
        for f in fields:
            bar(draw, [28, fy, 80, fy + 8], fill='#64748B', r=1)
            f_box_h = 46 if f == "Mô tả" else 30
            draw.rounded_rectangle([28, fy + 12, w - 28, fy + 12 + f_box_h], radius=4, fill='#FFFFFF', outline='#CBD5E1', width=1)
            bar(draw, [38, fy + 20, 140, fy + 28], fill='#CBD5E1', r=1)
            fy += 20 + f_box_h + 8
        y += card_h + 16

    pill(draw, [w - 180, h - 50, w - 100, h - 18], fill='#E2E8F0')
    pill(draw, [w - 90, h - 50, w - 16, h - 18], fill='#64748B')
    wf.save(os.path.join(out_dir, 'wf_mob_08.png'))

# mob_09: Danh mục sách (416x407)
def gen_mob_09():
    wf, draw, w, h, _ = get_canvas('mob_09')
    mob_nav(draw, w, title_w=100, right_w=40)
    bar(draw, [16, 58, 140, 74], fill='#334155', r=2)
    draw.rounded_rectangle([16, 80, 160, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [28, 88, 120, 98], fill='#94A3B8', r=1)
    draw.rounded_rectangle([170, 80, 310, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    bar(draw, [182, 88, 270, 98], fill='#94A3B8', r=1)
    
    sw = (w - 32 - 16) // 3
    for i in range(3):
        sx = 16 + i * (sw + 8)
        draw.rounded_rectangle([sx, 116, sx + sw, 166], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 10, 126, sx + sw - 10, 142], fill='#334155', r=2)
        bar(draw, [sx + 8, 148, sx + sw - 8, 156], fill='#94A3B8', r=1)

    cw = (w - 32 - 25) // 6
    for i in range(6):
        cx = 16 + i * (cw + 5)
        draw.ellipse([cx + 2, 180, cx + cw - 2, 180 + cw - 4], fill='#E2E8F0', outline='#CBD5E1')
        bar(draw, [cx, 230, cx + cw, 242], fill='#475569', r=1)
        bar(draw, [cx, 248, cx + cw, 256], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_09.png'))

# mob_10: Bản đồ vị trí xe bus (416x370) - Refined search inside map
def gen_mob_10():
    wf, draw, w, h, _ = get_canvas('mob_10')
    mob_nav(draw, w, title_w=100, right_w=30)
    bar(draw, [16, 58, 170, 74], fill='#334155', r=2)
    
    # Map container
    cross_box(draw, [16, 84, w - 16, h - 20], fill='#F1F5F9', outline='#CBD5E1')
    # Search input INSIDE map container
    draw.rounded_rectangle([28, 96, w - 28, 126], radius=15, fill='#FFFFFF', outline='#CBD5E1', width=1)
    bar(draw, [42, 106, 170, 116], fill='#94A3B8', r=1)

    # Simulated pins
    draw.ellipse([120, 160, 136, 176], fill='#64748B')
    draw.ellipse([260, 190, 276, 206], fill='#64748B')

    # Floating bottom bus card inside map
    draw.rounded_rectangle([28, h - 84, w - 28, h - 34], radius=6, fill='#FFFFFF', outline='#CBD5E1', width=1)
    bar(draw, [40, h - 74, 200, h - 62], fill='#334155', r=2)
    bar(draw, [40, h - 54, 160, h - 44], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_10.png'))

# mob_11: Chi tiết xe bus (416x385)
def gen_mob_11():
    wf, draw, w, h, _ = get_canvas('mob_11')
    mob_nav(draw, w, title_w=100, right_w=30)
    bar(draw, [16, 58, 190, 74], fill='#334155', r=2)
    pill(draw, [w - 90, 56, w - 16, 76], fill='#CBD5E1')
    
    col_w = (w - 32 - 12) // 2
    bar(draw, [16, 90, 110, 102], fill='#334155', r=1)
    draw.rectangle([16, 110, 16 + col_w, h - 16], fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(4):
        ry = 110 + r * 34
        draw.line([16, ry, 16 + col_w, ry], fill='#F1F5F9', width=1)
        bar(draw, [24, ry + 10, 100, ry + 20], fill='#475569', r=1)
        pill(draw, [16 + col_w - 50, ry + 8, 16 + col_w - 8, ry + 24], fill='#CBD5E1')

    rx = 16 + col_w + 12
    draw.rounded_rectangle([rx, 110, w - 16, 210], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
    bar(draw, [rx + 10, 120, rx + 100, 130], fill='#334155', r=1)
    for k in range(3):
        bar(draw, [rx + 10, 140 + k * 20, w - 24, 150 + k * 20], fill='#94A3B8', r=1)
        
    draw.rounded_rectangle([rx, 224, w - 16, h - 16], radius=4, fill='#FEF2F2', outline='#FECACA', width=1)
    bar(draw, [rx + 10, 236, rx + 80, 246], fill='#991B1B', r=1)
    bar(draw, [rx + 10, 254, w - 24, 264], fill='#64748B', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_11.png'))

# mob_12: Danh sách tuyến đường (416x377)
def gen_mob_12():
    wf, draw, w, h, _ = get_canvas('mob_12')
    mob_nav(draw, w, title_w=100, right_w=50)
    bar(draw, [16, 58, 170, 74], fill='#334155', r=2)
    draw.rounded_rectangle([16, 82, 140, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.rounded_rectangle([150, 82, 280, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    
    sw = (w - 32 - 18) // 4
    for i in range(4):
        sx = 16 + i * (sw + 6)
        draw.rounded_rectangle([sx, 116, sx + sw, 166], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 6, 126, sx + sw - 6, 142], fill='#334155', r=2)
        bar(draw, [sx + 4, 148, sx + sw - 4, 156], fill='#94A3B8', r=1)

    draw.rectangle([16, 178, w - 16, h - 16], fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(4):
        ry = 178 + r * 36
        draw.line([16, ry, w - 16, ry], fill='#F1F5F9', width=1)
        bar(draw, [28, ry + 12, 100, ry + 22], fill='#475569', r=1)
        bar(draw, [130, ry + 12, 200, ry + 22], fill='#94A3B8', r=1)
        bar(draw, [240, ry + 12, 280, ry + 22], fill='#94A3B8', r=1)
        pill(draw, [w - 80, ry + 8, w - 24, ry + 26], fill='#CBD5E1')
    wf.save(os.path.join(out_dir, 'wf_mob_12.png'))

# mob_13: Chi tiết tuyến đường (416x548)
def gen_mob_13():
    wf, draw, w, h, _ = get_canvas('mob_13')
    mob_nav(draw, w, title_w=100, right_w=50)
    bar(draw, [16, 58, 200, 74], fill='#334155', r=2)
    cross_box(draw, [16, 84, w - 16, 210], fill='#CBD5E1', outline='#94A3B8')
    sw = (w - 32 - 12) // 2
    draw.rounded_rectangle([16, 222, 16 + sw, 270], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
    bar(draw, [28, 232, 16 + sw - 12, 244], fill='#334155', r=1)
    bar(draw, [28, 250, 16 + sw - 20, 260], fill='#94A3B8', r=1)
    
    draw.rounded_rectangle([16 + sw + 12, 222, w - 16, 270], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
    bar(draw, [16 + sw + 24, 232, w - 28, 244], fill='#334155', r=1)
    bar(draw, [16 + sw + 24, 250, w - 40, 260], fill='#94A3B8', r=1)

    bar(draw, [16, 288, 140, 302], fill='#334155', r=2)
    stops = 4
    for s in range(stops):
        sy = 314 + s * 54
        draw.ellipse([20, sy + 4, 34, sy + 18], fill='#64748B')
        if s < stops - 1:
            draw.line([27, sy + 18, 27, sy + 54], fill='#CBD5E1', width=2)
        bar(draw, [46, sy + 2, w - 30, sy + 14], fill='#475569', r=1)
        bar(draw, [46, sy + 20, 180, sy + 30], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_13.png'))

# mob_14: Danh sách cảnh báo (416x302)
def gen_mob_14():
    wf, draw, w, h, _ = get_canvas('mob_14')
    mob_nav(draw, w, title_w=100, right_w=30)
    bar(draw, [16, 58, 160, 74], fill='#334155', r=2)
    draw.rounded_rectangle([16, 82, 140, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.rounded_rectangle([150, 82, 280, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    
    draw.rectangle([16, 118, w - 16, h - 16], fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(4):
        ry = 118 + r * 38
        draw.line([16, ry, w - 16, ry], fill='#F1F5F9', width=1)
        bar(draw, [28, ry + 12, 80, ry + 22], fill='#475569', r=1)
        bar(draw, [96, ry + 12, 220, ry + 22], fill='#64748B', r=1)
        bar(draw, [230, ry + 12, 290, ry + 22], fill='#94A3B8', r=1)
        pill(draw, [w - 76, ry + 8, w - 24, ry + 26], fill='#CBD5E1')
    wf.save(os.path.join(out_dir, 'wf_mob_14.png'))

# mob_15: Dashboard cá nhân - Wide (715x359)
def gen_mob_15():
    wf, draw, w, h, _ = get_canvas('mob_15')
    mob_nav(draw, w, title_w=120, right_w=60, has_burger=False)
    bar(draw, [16, 62, 240, 80], fill='#334155', r=2)
    bar(draw, [16, 90, 160, 102], fill='#64748B', r=1)
    
    sw = (w - 32 - 36) // 4
    for i in range(4):
        sx = 16 + i * (sw + 12)
        draw.rounded_rectangle([sx, 116, sx + sw, 180], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 14, 130, sx + sw - 20, 150], fill='#334155', r=2)
        bar(draw, [sx + 14, 158, sx + sw - 30, 168], fill='#94A3B8', r=1)

    bar(draw, [16, 198, 160, 212], fill='#334155', r=2)
    for i in range(2):
        ay = 224 + i * 50
        draw.rounded_rectangle([16, ay, w - 16, ay + 42], radius=4, fill='#FFFFFF', outline='#E2E8F0', width=1)
        bar(draw, [28, ay + 12, 200, ay + 22], fill='#475569', r=1)
        bar(draw, [28, ay + 26, 120, ay + 34], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_15.png'))

# mob_16: Danh sách mượn/trả (416x306)
def gen_mob_16():
    wf, draw, w, h, _ = get_canvas('mob_16')
    mob_nav(draw, w, title_w=100, right_w=50)
    bar(draw, [16, 58, 170, 74], fill='#334155', r=2)
    pill(draw, [w - 70, 56, w - 16, 76], fill='#CBD5E1')
    
    draw.rectangle([16, 88, w - 16, h - 16], fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(5):
        ry = 88 + r * 38
        draw.line([16, ry, w - 16, ry], fill='#F1F5F9', width=1)
        bar(draw, [28, ry + 12, 110, ry + 22], fill='#475569', r=1)
        bar(draw, [130, ry + 12, 190, ry + 22], fill='#94A3B8', r=1)
        bar(draw, [210, ry + 12, 270, ry + 22], fill='#94A3B8', r=1)
        pill(draw, [w - 80, ry + 8, w - 24, ry + 26], fill='#CBD5E1')
    wf.save(os.path.join(out_dir, 'wf_mob_16.png'))

# mob_17: Chi tiết mượn sách (416x300)
def gen_mob_17():
    wf, draw, w, h, _ = get_canvas('mob_17')
    mob_nav(draw, w, title_w=100, right_w=50)
    bar(draw, [16, 58, 160, 74], fill='#334155', r=2)
    pill(draw, [w - 100, 56, w - 16, 76], fill='#FECACA')
    
    sw = (w - 32 - 12) // 2
    fields = [("Sách", "Sapiens"), ("Người mượn", "Minh Anh"), ("Ngày mượn", "20/08"), ("Hạn trả", "03/09")]
    for i, (l, v) in enumerate(fields):
        r, c = divmod(i, 2)
        cx = 16 + c * (sw + 12)
        cy = 88 + r * 58
        draw.rounded_rectangle([cx, cy, cx + sw, cy + 50], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [cx + 10, cy + 10, cx + 60, cy + 20], fill='#94A3B8', r=1)
        bar(draw, [cx + 10, cy + 26, cx + sw - 14, cy + 38], fill='#334155', r=1)

    pill(draw, [16, h - 50, 160, h - 18], fill='#64748B')
    pill(draw, [172, h - 50, 260, h - 18], fill='#CBD5E1')
    wf.save(os.path.join(out_dir, 'wf_mob_17.png'))

# mob_18: Danh sách đặt trước (416x339)
def gen_mob_18():
    wf, draw, w, h, _ = get_canvas('mob_18')
    mob_nav(draw, w, title_w=100, right_w=50)
    bar(draw, [16, 58, 170, 74], fill='#334155', r=2)
    
    sw = (w - 32 - 16) // 3
    for i in range(3):
        sx = 16 + i * (sw + 8)
        draw.rounded_rectangle([sx, 86, sx + sw, 136], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 10, 96, sx + sw - 10, 112], fill='#334155', r=2)
        bar(draw, [sx + 8, 118, sx + sw - 8, 126], fill='#94A3B8', r=1)

    draw.rectangle([16, 150, w - 16, h - 16], fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(4):
        ry = 150 + r * 40
        draw.line([16, ry, w - 16, ry], fill='#F1F5F9', width=1)
        bar(draw, [28, ry + 14, 130, ry + 24], fill='#475569', r=1)
        bar(draw, [170, ry + 14, 210, ry + 24], fill='#94A3B8', r=1)
        pill(draw, [w - 90, ry + 10, w - 24, ry + 28], fill='#CBD5E1')
    wf.save(os.path.join(out_dir, 'wf_mob_18.png'))

# mob_19: Chi tiết đặt trước (416x332)
def gen_mob_19():
    wf, draw, w, h, _ = get_canvas('mob_19')
    mob_nav(draw, w, title_w=100, right_w=50)
    bar(draw, [16, 58, 160, 74], fill='#334155', r=2)
    pill(draw, [w - 80, 56, w - 16, 76], fill='#CBD5E1')
    
    draw.rounded_rectangle([16, 88, w - 16, 160], radius=6, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.ellipse([32, 102, 72, 142], fill='#64748B')
    bar(draw, [86, 106, 220, 120], fill='#334155', r=2)
    bar(draw, [86, 128, 180, 138], fill='#94A3B8', r=1)
    
    sw = (w - 32 - 12) // 2
    for i in range(4):
        r, c = divmod(i, 2)
        cx = 16 + c * (sw + 12)
        cy = 174 + r * 50
        draw.rounded_rectangle([cx, cy, cx + sw, cy + 42], radius=4, fill='#FAF8F5', outline='#E2E8F0', width=1)
        bar(draw, [cx + 8, cy + 8, cx + 50, cy + 16], fill='#94A3B8', r=1)
        bar(draw, [cx + 8, cy + 22, cx + sw - 10, cy + 32], fill='#475569', r=1)

    pill(draw, [16, h - 42, 130, h - 16], fill='#CBD5E1')
    wf.save(os.path.join(out_dir, 'wf_mob_19.png'))

# mob_20: Thống kê & phân tích (416x368)
def gen_mob_20():
    wf, draw, w, h, _ = get_canvas('mob_20')
    mob_nav(draw, w, title_w=100, right_w=50)
    bar(draw, [16, 58, 170, 74], fill='#334155', r=2)
    
    sw = (w - 32 - 16) // 3
    for i in range(3):
        sx = 16 + i * (sw + 8)
        draw.rounded_rectangle([sx, 86, sx + sw, 136], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 10, 96, sx + sw - 10, 112], fill='#334155', r=2)
        bar(draw, [sx + 8, 118, sx + sw - 8, 126], fill='#94A3B8', r=1)

    draw.rounded_rectangle([16, 150, w - 16, h - 16], radius=6, fill='#FAF8F5', outline='#E2E8F0', width=1)
    bar(draw, [28, 162, 160, 174], fill='#334155', r=1)
    
    chart_y = h - 40
    cw = 32
    gap = (w - 64 - cw * 5) // 4
    heights = [60, 90, 80, 120, 100]
    for i, bh in enumerate(heights):
        bx = 36 + i * (cw + gap)
        draw.rectangle([bx, chart_y - bh, bx + cw, chart_y], fill='#64748B')
        bar(draw, [bx + 4, chart_y + 8, bx + cw - 4, chart_y + 16], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_20.png'))

# mob_21: Đăng nhập (416x436) - Refined checkbox centering
def gen_mob_21():
    wf, draw, w, h, _ = get_canvas('mob_21')
    draw.ellipse([w // 2 - 32, 40, w // 2 + 32, 104], fill='#CBD5E1')
    bar(draw, [w // 2 - 80, 118, w // 2 + 80, 134], fill='#334155', r=2)
    
    y = 156
    for lbl in ["Tên đăng nhập / Email", "Mật khẩu"]:
        bar(draw, [32, y, 140, y + 10], fill='#64748B', r=1)
        draw.rounded_rectangle([32, y + 16, w - 32, y + 54], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
        bar(draw, [44, y + 30, 140, y + 40], fill='#CBD5E1', r=1)
        y += 66

    # Remember me centered
    cx = w // 2 - 60
    draw.rectangle([cx, y + 4, cx + 16, y + 20], outline='#94A3B8', width=1)
    bar(draw, [cx + 24, y + 6, cx + 130, y + 18], fill='#64748B', r=1)
    y += 36

    pill(draw, [32, y, w - 32, y + 42], fill='#64748B')
    y += 54
    bar(draw, [w // 2 - 90, y, w // 2 + 90, y + 10], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_21.png'))

# mob_22: Đăng ký tài khoản (416x437)
def gen_mob_22():
    wf, draw, w, h, _ = get_canvas('mob_22')
    bar(draw, [w // 2 - 80, 36, w // 2 + 80, 52], fill='#334155', r=2)
    y = 70
    fields = ["Họ và tên", "Email", "Mật khẩu", "Xác nhận mật khẩu"]
    for f in fields:
        bar(draw, [32, y, 100, y + 8], fill='#64748B', r=1)
        draw.rounded_rectangle([32, y + 12, w - 32, y + 46], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
        bar(draw, [44, y + 24, 120, y + 34], fill='#CBD5E1', r=1)
        y += 56

    pill(draw, [32, y + 8, w - 32, y + 48], fill='#64748B')
    bar(draw, [w // 2 - 80, y + 62, w // 2 + 80, y + 72], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_22.png'))

# mob_23: Hồ sơ chi tiết (416x345)
def gen_mob_23():
    wf, draw, w, h, _ = get_canvas('mob_23')
    mob_nav(draw, w, title_w=100, right_w=40)
    draw.ellipse([w // 2 - 28, 56, w // 2 + 28, 112], fill='#CBD5E1')
    bar(draw, [w // 2 - 70, 122, w // 2 + 70, 136], fill='#334155', r=2)
    bar(draw, [w // 2 - 90, 144, w // 2 + 90, 154], fill='#94A3B8', r=1)
    
    tw = 70
    tx = (w - tw * 3 - 16) // 2
    for i in range(3):
        pill(draw, [tx + i * (tw + 8), 166, tx + i * (tw + 8) + tw, 186], fill='#E2E8F0')

    sw = (w - 32 - 16) // 3
    for i in range(3):
        sx = 16 + i * (sw + 8)
        draw.rounded_rectangle([sx, 204, sx + sw, 264], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 10, 216, sx + sw - 10, 232], fill='#334155', r=2)
        bar(draw, [sx + 8, 242, sx + sw - 8, 252], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_23.png'))

# mob_24: Dashboard người dùng - Wide (715x303)
def gen_mob_24():
    wf, draw, w, h, _ = get_canvas('mob_24')
    mob_nav(draw, w, title_w=120, right_w=40, has_burger=False)
    bar(draw, [16, 62, 240, 80], fill='#334155', r=2)
    
    draw.rounded_rectangle([16, 96, 220, h - 16], radius=6, fill='#F8FAFC', outline='#E2E8F0', width=1)
    draw.ellipse([32, 110, 68, 146], fill='#CBD5E1')
    bar(draw, [80, 118, 180, 130], fill='#334155', r=1)
    pill(draw, [80, 136, 140, 148], fill='#CBD5E1')
    bar(draw, [32, 160, 200, 170], fill='#94A3B8', r=1)
    bar(draw, [32, 180, 180, 190], fill='#94A3B8', r=1)

    rx = 236
    sw = (w - rx - 16 - 36) // 4
    for i in range(4):
        sx = rx + i * (sw + 12)
        draw.rounded_rectangle([sx, 96, sx + sw, h - 16], radius=6, fill='#FAF8F5', outline='#E2E8F0', width=1)
        bar(draw, [sx + 10, 110, sx + sw - 10, 126], fill='#334155', r=2)
        bar(draw, [sx + 10, 136, sx + sw - 10, 146], fill='#64748B', r=1)
        bar(draw, [sx + 10, 154, sx + sw - 20, 164], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_24.png'))

# mob_25: Cài đặt hệ thống (416x300)
def gen_mob_25():
    wf, draw, w, h, _ = get_canvas('mob_25')
    mob_nav(draw, w, title_w=100, right_w=40)
    bar(draw, [16, 58, 160, 74], fill='#334155', r=2)
    sw = (w - 32 - 18) // 4
    for i in range(4):
        sx = 16 + i * (sw + 6)
        draw.rounded_rectangle([sx, 88, sx + sw, h - 20], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        draw.ellipse([sx + 8, 100, sx + 28, 120], fill='#CBD5E1')
        bar(draw, [sx + 6, 130, sx + sw - 6, 144], fill='#334155', r=1)
        bar(draw, [sx + 6, 154, sx + sw - 6, 164], fill='#94A3B8', r=1)
        bar(draw, [sx + 6, 172, sx + sw - 10, 182], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_25.png'))

# mob_26: Trang chủ blog (416x375)
def gen_mob_26():
    wf, draw, w, h, _ = get_canvas('mob_26')
    mob_nav(draw, w, title_w=100, right_w=30)
    cross_box(draw, [16, 58, w - 16, 180], fill='#CBD5E1', outline='#94A3B8')
    pill(draw, [28, 70, 76, 88], fill='#94A3B8')
    bar(draw, [16, 192, w - 40, 206], fill='#334155', r=2)
    bar(draw, [16, 214, 180, 224], fill='#94A3B8', r=1)
    
    bar(draw, [16, 244, 120, 258], fill='#334155', r=2)
    for i in range(3):
        pill(draw, [16 + i * 80, 268, 16 + i * 80 + 72, 290], fill='#E2E8F0')

    bar(draw, [16, 308, 110, 320], fill='#334155', r=1)
    for i in range(4):
        pill(draw, [16 + i * 72, 330, 16 + i * 72 + 64, 350], fill='#F1F5F9')
    wf.save(os.path.join(out_dir, 'wf_mob_26.png'))

# mob_27: Danh sách bài viết (416x413)
def gen_mob_27():
    wf, draw, w, h, _ = get_canvas('mob_27')
    mob_nav(draw, w, title_w=100, right_w=30)
    bar(draw, [16, 58, 150, 74], fill='#334155', r=2)
    cross_box(draw, [16, 84, w - 16, 180], fill='#CBD5E1', outline='#94A3B8')
    bar(draw, [16, 192, w - 40, 206], fill='#334155', r=2)
    bar(draw, [16, 214, 180, 224], fill='#94A3B8', r=1)
    
    bw = (w - 32 - 12) // 2
    for i in range(2):
        bx = 16 + i * (bw + 12)
        cross_box(draw, [bx, 244, bx + bw, 330], fill='#CBD5E1', outline='#94A3B8')
        bar(draw, [bx, 340, bx + bw - 10, 352], fill='#334155', r=1)
        bar(draw, [bx, 360, bx + bw - 30, 370], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_27.png'))

# mob_28: Chi tiết bài viết (416x645)
def gen_mob_28():
    wf, draw, w, h, _ = get_canvas('mob_28')
    mob_nav(draw, w, title_w=100, right_w=30)
    cross_box(draw, [16, 58, w - 16, 200], fill='#CBD5E1', outline='#94A3B8')
    bar(draw, [16, 214, w - 30, 232], fill='#334155', r=2)
    bar(draw, [16, 240, 200, 250], fill='#94A3B8', r=1)
    
    for i in range(3):
        bar(draw, [16, 268 + i * 16, w - 20 - i * 30, 278 + i * 16], fill='#64748B', r=1)
    
    pill(draw, [16, 330, 90, 348], fill='#E2E8F0')
    pill(draw, [100, 330, 160, 348], fill='#E2E8F0')
    
    bar(draw, [16, 372, 130, 388], fill='#334155', r=2)
    for c in range(2):
        cy = 404 + c * 58
        draw.ellipse([16, cy + 2, 36, cy + 22], fill='#CBD5E1')
        bar(draw, [46, cy, 120, cy + 12], fill='#334155', r=1)
        bar(draw, [46, cy + 18, w - 20, cy + 28], fill='#64748B', r=1)
        bar(draw, [46, cy + 32, w - 60, cy + 42], fill='#94A3B8', r=1)

    draw.rounded_rectangle([16, 530, w - 16, 566], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    pill(draw, [16, 580, 110, 610], fill='#64748B')
    wf.save(os.path.join(out_dir, 'wf_mob_28.png'))

# mob_29: Kiểm duyệt bài viết (416x270)
def gen_mob_29():
    wf, draw, w, h, _ = get_canvas('mob_29')
    mob_nav(draw, w, title_w=100, right_w=60)
    draw.rounded_rectangle([16, 64, w - 16, h - 20], radius=6, fill='#FAF8F5', outline='#E2E8F0', width=1)
    bar(draw, [32, 80, w - 100, 96], fill='#334155', r=2)
    pill(draw, [w - 90, 80, w - 32, 98], fill='#CBD5E1')
    
    bar(draw, [32, 112, w - 40, 124], fill='#64748B', r=1)
    bar(draw, [32, 132, w - 60, 144], fill='#64748B', r=1)
    
    pill(draw, [32, 170, 120, 206], fill='#64748B')
    pill(draw, [130, 170, 200, 206], fill='#CBD5E1')
    wf.save(os.path.join(out_dir, 'wf_mob_29.png'))

# mob_30: Dashboard tác giả (416x347)
def gen_mob_30():
    wf, draw, w, h, _ = get_canvas('mob_30')
    mob_nav(draw, w, title_w=100, right_w=30)
    bar(draw, [16, 58, 170, 74], fill='#334155', r=2)
    sw = (w - 32 - 18) // 4
    for i in range(4):
        sx = 16 + i * (sw + 6)
        draw.rounded_rectangle([sx, 86, sx + sw, 146], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 8, 98, sx + sw - 8, 116], fill='#334155', r=2)
        bar(draw, [sx + 6, 124, sx + sw - 6, 134], fill='#94A3B8', r=1)

    bar(draw, [16, 168, 150, 184], fill='#334155', r=2)
    bw = (w - 32 - 12) // 2
    for i in range(2):
        bx = 16 + i * (bw + 12)
        cross_box(draw, [bx, 196, bx + bw, 270], fill='#CBD5E1', outline='#94A3B8')
        bar(draw, [bx, 280, bx + bw - 10, 292], fill='#334155', r=1)
        pill(draw, [bx, 302, bx + 50, 318], fill='#E2E8F0')
    wf.save(os.path.join(out_dir, 'wf_mob_30.png'))

# mob_31: Admin dashboard - Wide (715x383) - Refined continuous histogram
def gen_mob_31():
    wf, draw, w, h, _ = get_canvas('mob_31')
    mob_nav(draw, w, title_w=160, right_w=80, has_burger=False)
    bar(draw, [16, 62, 220, 80], fill='#334155', r=2)
    
    sw = (w - 32 - 36) // 4
    for i in range(4):
        sx = 16 + i * (sw + 12)
        draw.rounded_rectangle([sx, 96, sx + sw, 166], radius=4, fill='#F8FAFC', outline='#E2E8F0', width=1)
        bar(draw, [sx + 14, 110, sx + sw - 20, 130], fill='#334155', r=2)
        bar(draw, [sx + 14, 138, sx + sw - 40, 148], fill='#94A3B8', r=1)
        pill(draw, [sx + sw - 54, 138, sx + sw - 14, 152], fill='#CBD5E1')

    bar(draw, [16, 184, 180, 198], fill='#334155', r=2)
    # Continuous stepped chart matching UI
    draw.rounded_rectangle([16, 210, w - 16, h - 16], radius=6, fill='#FAF8F5', outline='#E2E8F0', width=1)
    chart_y = h - 34
    chart_w = w - 32
    cw = chart_w // 5
    heights = [50, 85, 68, 115, 90]
    for i, bh in enumerate(heights):
        bx = 16 + i * cw
        draw.rectangle([bx, chart_y - bh, bx + cw, chart_y], fill='#64748B', outline='#475569', width=1)
        bar(draw, [bx + cw//2 - 12, chart_y + 6, bx + cw//2 + 12, chart_y + 14], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_31.png'))

# mob_32: Bảng xếp hạng độc giả (416x445)
def gen_mob_32():
    wf, draw, w, h, _ = get_canvas('mob_32')
    mob_nav(draw, w, title_w=100, right_w=40)
    bar(draw, [16, 58, 180, 74], fill='#334155', r=2)
    
    pw = 64
    ranks = [(2, 80, 60), (1, 100, 80), (3, 70, 50)]
    px_start = (w - pw * 3 - 24) // 2
    for idx, (rank, ph, off) in enumerate(ranks):
        px = px_start + idx * (pw + 12)
        base_y = 230
        draw.ellipse([px + 12, base_y - ph - 38, px + pw - 12, base_y - ph - 2], fill='#CBD5E1')
        draw.rectangle([px, base_y - ph, px + pw, base_y], fill='#E2E8F0', outline='#CBD5E1')
        bar(draw, [px + 16, base_y - ph + 10, px + pw - 16, base_y - ph + 24], fill='#334155', r=1)

    draw.rectangle([16, 246, w - 16, h - 16], fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(4):
        ry = 246 + r * 38
        draw.line([16, ry, w - 16, ry], fill='#F1F5F9', width=1)
        bar(draw, [28, ry + 12, 44, ry + 22], fill='#94A3B8', r=1)
        bar(draw, [60, ry + 12, 140, ry + 22], fill='#334155', r=1)
        bar(draw, [180, ry + 12, 230, ry + 22], fill='#94A3B8', r=1)
        pill(draw, [w - 76, ry + 8, w - 24, ry + 26], fill='#CBD5E1')
    wf.save(os.path.join(out_dir, 'wf_mob_32.png'))

# mob_33: Báo cáo thống kê (416x439)
def gen_mob_33():
    wf, draw, w, h, _ = get_canvas('mob_33')
    mob_nav(draw, w, title_w=100, right_w=40)
    bar(draw, [16, 58, 170, 74], fill='#334155', r=2)
    draw.rounded_rectangle([16, 82, 120, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.rounded_rectangle([130, 82, 234, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.rounded_rectangle([244, 82, w - 16, 106], radius=4, fill='#F8FAFC', outline='#CBD5E1', width=1)
    
    draw.rounded_rectangle([16, 118, w - 16, 250], radius=6, fill='#FAF8F5', outline='#E2E8F0', width=1)
    chart_y = 220
    cw = 36
    gap = (w - 64 - cw * 4) // 3
    heights = [60, 85, 75, 50]
    for i, bh in enumerate(heights):
        bx = 36 + i * (cw + gap)
        draw.rectangle([bx, chart_y - bh, bx + cw, chart_y], fill='#64748B')
        bar(draw, [bx + 4, chart_y + 8, bx + cw - 4, chart_y + 16], fill='#94A3B8', r=1)

    draw.rectangle([16, 264, w - 16, h - 16], fill='#FFFFFF', outline='#E2E8F0', width=1)
    for r in range(3):
        ry = 264 + r * 42
        draw.line([16, ry, w - 16, ry], fill='#F1F5F9', width=1)
        bar(draw, [28, ry + 14, 100, ry + 24], fill='#334155', r=1)
        bar(draw, [150, ry + 14, 220, ry + 24], fill='#94A3B8', r=1)
        bar(draw, [w - 70, ry + 14, w - 30, ry + 24], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_33.png'))

# mob_34: Gợi ý sách cá nhân hoá (416x263)
def gen_mob_34():
    wf, draw, w, h, _ = get_canvas('mob_34')
    mob_nav(draw, w, title_w=100, right_w=60)
    bar(draw, [16, 58, 160, 74], fill='#334155', r=2)
    bw = (w - 32 - 16) // 3
    for i in range(3):
        bx = 16 + i * (bw + 8)
        cross_box(draw, [bx, 86, bx + bw, 174], fill='#CBD5E1', outline='#94A3B8')
        bar(draw, [bx, 184, bx + bw - 6, 196], fill='#334155', r=1)
        bar(draw, [bx, 204, bx + bw - 14, 214], fill='#94A3B8', r=1)
    wf.save(os.path.join(out_dir, 'wf_mob_34.png'))

# -------------------------------------------------------------
# Main Runner
# -------------------------------------------------------------
all_funcs = [
    gen_mob_01, gen_mob_02, gen_mob_03, gen_mob_04, gen_mob_05,
    gen_mob_06, gen_mob_07, gen_mob_08, gen_mob_09, gen_mob_10,
    gen_mob_11, gen_mob_12, gen_mob_13, gen_mob_14, gen_mob_15,
    gen_mob_16, gen_mob_17, gen_mob_18, gen_mob_19, gen_mob_20,
    gen_mob_21, gen_mob_22, gen_mob_23, gen_mob_24, gen_mob_25,
    gen_mob_26, gen_mob_27, gen_mob_28, gen_mob_29, gen_mob_30,
    gen_mob_31, gen_mob_32, gen_mob_33, gen_mob_34
]

print(f"Generating all {len(all_funcs)} mobile wireframes...")
for f in all_funcs:
    f()

print("\nVerifying 1-to-1 dimension matches...")
matched = 0
for s in screens:
    sid = s['id']
    ui_p = os.path.join(out_dir, f"ui_{sid}.png")
    wf_p = os.path.join(out_dir, f"wf_{sid}.png")
    ui = Image.open(ui_p)
    wf = Image.open(wf_p)
    if ui.size == wf.size:
        matched += 1
    else:
        print(f"MISMATCH on {sid}: UI {ui.size} vs WF {wf.size}")

print(f"Result: {matched}/{len(screens)} screens matched EXACTLY 100% in dimensions!")

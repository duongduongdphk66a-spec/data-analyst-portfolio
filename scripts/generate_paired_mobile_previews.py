import os
from PIL import Image, ImageDraw, ImageFont

art_dir = r'C:\Users\ADMIN\.gemini\antigravity-ide\brain\2d675aae-27f8-4941-a330-49e253aa6381'
mob_dir = r'public\library-bus\mobile_screens'

selected_screens = [
    ('mob_01', 'Màn hình 01: Trang chủ Mobile'),
    ('mob_03', 'Màn hình 03: Liên hệ & Góp ý Mobile'),
    ('mob_05', 'Màn hình 05: Dashboard Kho sách (Ngang)'),
    ('mob_07', 'Màn hình 07: Chi tiết sách Mobile'),
    ('mob_08', 'Màn hình 08: Form Thêm/Sửa sách Mobile'),
    ('mob_10', 'Màn hình 10: Bản đồ vị trí xe bus Mobile'),
    ('mob_13', 'Màn hình 13: Chi tiết tuyến đường Mobile'),
    ('mob_20', 'Màn hình 20: Thống kê & Biểu đồ mượn trả'),
    ('mob_21', 'Màn hình 21: Đăng nhập tài khoản Mobile'),
    ('mob_24', 'Màn hình 24: Dashboard người dùng (Ngang)'),
    ('mob_28', 'Màn hình 28: Chi tiết bài viết Blog Mobile'),
    ('mob_31', 'Màn hình 31: Admin Dashboard hệ thống'),
    ('mob_32', 'Màn hình 32: Bảng xếp hạng độc giả Podium')
]

for sid, label in selected_screens:
    wf_path = os.path.join(mob_dir, f"wf_{sid}.png")
    ui_path = os.path.join(mob_dir, f"ui_{sid}.png")
    
    wf = Image.open(wf_path).convert('RGB')
    ui = Image.open(ui_path).convert('RGB')
    
    w, h = wf.size
    pad = 30
    header_h = 70
    
    canvas_w = w * 2 + pad * 3
    canvas_h = h + header_h + pad * 2
    
    comp = Image.new('RGB', (canvas_w, canvas_h), '#FDFBF7')
    draw = ImageDraw.Draw(comp)
    
    # Title bar
    draw.text((pad, 20), label, fill='#1E293B')
    
    # Column headers
    draw.text((pad, 48), "WIREFRAME (Đã khớp kích thước 1-to-1)", fill='#475569')
    draw.text((pad * 2 + w, 48), "UI DESIGN (Giao diện chuẩn)", fill='#9A3412')
    
    # Paste images
    comp.paste(wf, (pad, header_h))
    comp.paste(ui, (pad * 2 + w, header_h))
    
    # Draw border
    draw.rectangle([pad-1, header_h-1, pad + w, header_h + h], outline='#CBD5E1', width=1)
    draw.rectangle([pad*2 + w - 1, header_h-1, pad*2 + w * 2, header_h + h], outline='#CBD5E1', width=1)
    
    out_p = os.path.join(art_dir, f"preview_paired_{sid}.png")
    comp.save(out_p)
    print(f"Generated preview: {out_p} ({canvas_w}x{canvas_h})")

print("All paired mobile previews generated successfully!")

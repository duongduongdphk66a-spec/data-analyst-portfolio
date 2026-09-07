import sys
sys.stdout.reconfigure(encoding='utf-8')
import json

with open('scripts/mobile_screens_meta.json', 'r', encoding='utf-8') as f:
    screens = json.load(f)

modules_map = {
    'ĐỢT 1': ('brand', 'Trang thương hiệu', 'Brand & Marketing'),
    'ĐỢT 2': ('inventory', 'Kho sách (Inventory)', 'Book Inventory'),
    'ĐỢT 3': ('fleet', 'Xe bus & Tuyến đường', 'Bus Fleet & Routes'),
    'ĐỢT 4': ('transactions', 'Mượn/trả & Giao dịch', 'Transactions & Borrowing'),
    'ĐỢT 5': ('users', 'Người dùng', 'User Management'),
    'ĐỢT 6': ('community', 'Blog & Cộng đồng', 'Blog & Community'),
    'ĐỢT 7': ('analytics', 'Thống kê & Quản trị', 'Analytics & Admin'),
}

ts_lines = [
    "export const LIBRARY_BUS_MOBILE_SCREENS: LibraryBusScreenItem[] = ["
]

for s in screens:
    # Determine module
    mod_key = 'brand'
    mod_vi = 'Trang thương hiệu'
    mod_en = 'Brand & Marketing'
    for k, v in modules_map.items():
        if k in s['module']:
            mod_key, mod_vi, mod_en = v
            break
            
    # Title clean
    raw_title = s['title']
    # e.g. "1. Trang chủ (pages/index.html)"
    t_parts = raw_title.split('(')
    title_vi = t_parts[0].strip()
    tpl_path = t_parts[1].replace(')', '').strip() if len(t_parts) > 1 else ''
    
    # English title mapping
    title_en = title_vi
    if 'Trang chủ' in title_vi: title_en = '1. Homepage (Mobile)'
    elif 'Giới thiệu' in title_vi: title_en = '2. About Us (Mobile)'
    elif 'Liên hệ' in title_vi: title_en = '3. Contact Us (Mobile)'
    elif 'Câu hỏi' in title_vi: title_en = '4. FAQ (Mobile)'
    elif 'Dashboard tổng quan' in title_vi: title_en = '1. Inventory Overview (Mobile)'
    elif 'Danh sách sách' in title_vi: title_en = '2. Book Catalog (Mobile)'
    elif 'Chi tiết sách' in title_vi: title_en = '3. Book Detail (Mobile)'
    elif 'Form' in title_vi: title_en = '4. Book Form Add/Edit (Mobile)'
    elif 'Danh mục' in title_vi: title_en = '5. Book Categories (Mobile)'
    elif 'Bản đồ' in title_vi: title_en = '1. Live Bus Map (Mobile)'
    elif 'Chi tiết xe' in title_vi: title_en = '2. Bus Vehicle Detail (Mobile)'
    elif 'Danh sách tuyến' in title_vi: title_en = '3. Route List (Mobile)'
    elif 'Chi tiết tuyến' in title_vi: title_en = '4. Route Detail & Stops (Mobile)'
    elif 'cảnh báo' in title_vi: title_en = '5. Alert Log (Mobile)'
    elif 'Dashboard cá nhân' in title_vi: title_en = '1. Personal Dashboard (Mobile)'
    elif 'mượn/trả' in title_vi: title_en = '2. Borrow & Return List (Mobile)'
    elif 'Chi tiết mượn' in title_vi: title_en = '3. Borrow Detail (Mobile)'
    elif 'Danh sách đặt trước' in title_vi: title_en = '4. Reservation List (Mobile)'
    elif 'Chi tiết đặt trước' in title_vi: title_en = '5. Reservation Detail (Mobile)'
    elif 'Thống kê & phân tích' in title_vi: title_en = '6. Borrowing Statistics (Mobile)'
    elif 'Đăng nhập' in title_vi: title_en = '1. Member Login (Mobile)'
    elif 'Đăng ký' in title_vi: title_en = '2. Registration (Mobile)'
    elif 'Hồ sơ' in title_vi: title_en = '3. Profile Detail (Mobile)'
    elif 'Dashboard người dùng' in title_vi: title_en = '4. User Dashboard (Mobile)'
    elif 'Cài đặt' in title_vi: title_en = '5. Account Settings (Mobile)'
    elif 'Trang chủ blog' in title_vi: title_en = '1. Blog Home (Mobile)'
    elif 'Danh sách bài viết' in title_vi: title_en = '2. Blog Article List (Mobile)'
    elif 'Chi tiết bài viết' in title_vi: title_en = '3. Blog Post Detail (Mobile)'
    elif 'Kiểm duyệt' in title_vi: title_en = '4. Moderate Post (Mobile)'
    elif 'Dashboard tác giả' in title_vi: title_en = '5. Author Dashboard (Mobile)'
    elif 'Admin dashboard' in title_vi: title_en = '1. Admin Dashboard (Mobile)'
    elif 'xếp hạng' in title_vi: title_en = '2. Reader Leaderboard (Mobile)'
    elif 'Báo cáo' in title_vi: title_en = '3. Analytical Reports (Mobile)'
    elif 'Gợi ý' in title_vi: title_en = '4. Smart Recommendations (Mobile)'

    item_ts = f"""  {{
    id: '{s["id"]}',
    index: {s["index"]},
    titleVi: '{title_vi}',
    titleEn: '{title_en}',
    module: '{mod_key}',
    moduleNameVi: '{mod_vi}',
    moduleNameEn: '{mod_en}',
    templatePath: '{tpl_path}',
    routePath: '/{tpl_path}',
    role: 'Mobile Responsive',
    descVi: 'Giao diện điện thoại tối ưu trải nghiệm cầm tay, bố cục thẻ trực quan, thao tác nhanh O(1) và điều hướng tiện lợi.',
    descEn: 'Mobile interface optimized for handheld ergonomics, intuitive card layouts, rapid O(1) operations, and effortless navigation.',
    wireframeElements: ['Mobile Top Navbar', 'Compact Header & Status', 'Card Layout Container', 'Action Buttons & Badges'],
    uiFeatures: ['Molasses-Butter Color Palette', 'Font Lora + Outfit Typography', 'Khớp kích thước 1-to-1 Wireframe'],
    badge: '{'Wide Card' if s['is_wide'] else 'Mobile'}',
    wireframeSrc: '/library-bus/mobile_screens/{s["wf_file"]}',
    uiSrc: '/library-bus/mobile_screens/{s["ui_file"]}',
    uiFullSrc: '/library-bus/mobile_screens/{s["ui_file"]}'
  }},"""
    ts_lines.append(item_ts)

ts_lines.append("];\n")

with open('scripts/mobile_screens_ts.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_lines))

print("Generated mobile_screens_ts.txt successfully!")

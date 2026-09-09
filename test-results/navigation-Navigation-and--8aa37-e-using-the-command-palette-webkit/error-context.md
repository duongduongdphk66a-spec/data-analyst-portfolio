# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation and Core Interactions >> should toggle language using the command palette
- Location: tests\e2e\navigation.spec.ts:49:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="dialog"][aria-label="Command Palette"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('[role="dialog"][aria-label="Command Palette"]') with timeout 5000ms
  - waiting for locator('[role="dialog"][aria-label="Command Palette"]')

```

```yaml
- complementary "Thanh điều hướng chính":
  - link "Ma Văn Hùng Data Analyst":
    - /url: /
    - heading "Ma Văn Hùng" [level=2]
    - paragraph: Data Analyst
  - navigation:
    - link "Trang Chủ":
      - /url: /
    - link "Dự Án":
      - /url: /projects
    - link "Kinh Nghiệm":
      - /url: /experience
    - link "Giới Thiệu":
      - /url: /about
    - link "Thực Hành Lab":
      - /url: /lab
    - link "Tải CV":
      - /url: /Ma_Van_Hung_CV_Data_Analyst_2026.pdf
  - button "EN"
  - button "Đổi chế độ sáng / tối"
- main:
  - application
  - heading "Ma Văn Hùng" [level=2]
  - heading "Data Analyst" [level=3]
  - heading "Biến dữ liệu phức tạp thành quyết định kinh doanh rõ ràng." [level=1]
  - text: SQL • Python • Power BI • Statistics
  - button "Khám Phá Dự Án"
  - button "Tải CV PDF"
  - text: 3 Case Studies 93.7% latency ↓ 8.5B VND 5,700+ creators SELECTED CASE STUDIES
  - heading "Dự Án Phân Tích Dữ Liệu Nổi Bật" [level=2]
  - link "Xem toàn bộ dự án":
    - /url: /projects
  - 'link "TIKTOK SHOP · CREATOR ANALYTICS Kami Ely: Phân Tích TikTok Shop & Creator Telemetry 31.6 Tỷ VNĐ 52.7% GMV affiliate từ nano-creator Hệ thống phân tích hiệu suất bán hàng TikTok Shop và ma trận chuyển đổi 5.700 nhà sáng tạo nội dung. Đọc case study"':
    - /url: /projects/proj-kami-ely
    - text: TIKTOK SHOP · CREATOR ANALYTICS
    - 'heading "Kami Ely: Phân Tích TikTok Shop & Creator Telemetry" [level=3]'
    - text: 31.6 Tỷ VNĐ 52.7% GMV affiliate từ nano-creator
    - paragraph: Hệ thống phân tích hiệu suất bán hàng TikTok Shop và ma trận chuyển đổi 5.700 nhà sáng tạo nội dung.
    - text: Đọc case study
  - 'link "TIME-SERIES · MACRO ANALYTICS Phát Triển Du Lịch Di Sản Nhật Bản: Time-Series Analysis 4.81 Nghìn Tỷ Yên Tăng trưởng chi tiêu +318% Phân tích chuỗi thời gian chu kỳ phục hồi du lịch quốc tế và chi tiêu của du khách tại các trung tâm văn hóa Nhật Bản. Đọc case study"':
    - /url: /projects/proj-heritage-japan
    - text: TIME-SERIES · MACRO ANALYTICS
    - 'heading "Phát Triển Du Lịch Di Sản Nhật Bản: Time-Series Analysis" [level=3]'
    - text: 4.81 Nghìn Tỷ Yên Tăng trưởng chi tiêu +318%
    - paragraph: Phân tích chuỗi thời gian chu kỳ phục hồi du lịch quốc tế và chi tiêu của du khách tại các trung tâm văn hóa Nhật Bản.
    - text: Đọc case study
  - 'link "SYSTEM DESIGN · DATABASE ARCHITECTURE Library Bus: Tối Ưu Logistics & Truy Vấn Cơ Sở Dữ Liệu 450ms → 28ms Giảm 93.7% độ trễ truy vấn Kiến trúc cơ sở dữ liệu quan hệ và luồng xử lý bất đồng bộ phục vụ 50.000 độc giả với độ trễ thấp. Đọc case study"':
    - /url: /projects/proj-library-bus
    - text: SYSTEM DESIGN · DATABASE ARCHITECTURE
    - 'heading "Library Bus: Tối Ưu Logistics & Truy Vấn Cơ Sở Dữ Liệu" [level=3]'
    - text: 450ms → 28ms Giảm 93.7% độ trễ truy vấn
    - paragraph: Kiến trúc cơ sở dữ liệu quan hệ và luồng xử lý bất đồng bộ phục vụ 50.000 độc giả với độ trễ thấp.
    - text: Đọc case study
  - text: CAREER & RESEARCH PATH
  - heading "Học Vấn & Kinh Nghiệm Phân Tích" [level=2]
  - heading "Học vấn và lộ trình nghề nghiệp." [level=2]
  - heading "Học vấn" [level=3]
  - heading "Cử nhân Ngành Nhật Bản học (Khoa Đông Phương học)" [level=4]
  - text: Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN 2021 - 2025 Hà Nội, Việt Nam
  - list:
    - listitem: Chuyên sâu nghiên cứu kinh tế - xã hội Nhật Bản, phương pháp phân tích định lượng và xử lý dữ liệu nghiên cứu khoa học.
    - listitem: "Hoàn thành xuất sắc Niên luận Nghiên cứu định lượng: \"Sự phát triển của Du lịch Di sản tại Nhật Bản giai đoạn từ năm 2013 đến nay\" (GVHD: TS Võ Minh Vũ)."
  - heading "Kinh nghiệm thực tế" [level=3]
  - 'heading "Công trình Nghiên cứu Khoa học: Phân tích Du lịch Di sản tại Nhật Bản" [level=4]'
  - text: Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN 2023 - 2024 Hà Nội, Việt Nam
  - list:
    - listitem: Thu thập, trích xuất và chuẩn hóa 6 bộ dữ liệu chuỗi thời gian 20 năm từ MLIT, JNTO, Sở Du lịch Kyoto và Nara.
    - listitem: Ứng dụng các mô hình trực quan hóa số liệu định lượng, phân tích tỷ trọng đóng góp GDP (7.5%), việc làm (4M+) và đánh giá 5 chính sách giải quyết quá tải du lịch.
  - 'heading "Steve x Kami Company: Hỗ trợ Vận hành & Phân tích Dữ liệu E-Commerce" [level=4]'
  - text: Steve x Kami Company 2022 - 2023 Hà Nội, Việt Nam
  - list:
    - listitem: Xây dựng các báo cáo định kỳ theo dõi GMV, tỷ lệ chuyển đổi đơn hàng và chỉ số hoàn hàng trên sàn TikTok Shop.
    - listitem: Phân tích ma trận hiệu quả giữa kênh tự vận hành và mạng lưới 1,000+ creator affiliates nhằm tối ưu hóa chi phí hoa hồng.
  - 'heading "Library Bus: Tối ưu Hóa Cơ Sở Dữ Liệu & Vận Hành Logistics" [level=4]'
  - text: Dự án Hệ thống Thư viện Lưu động 2023 - 2024 Hà Nội, Việt Nam
  - list:
    - listitem: Thiết kế mô hình cơ sở dữ liệu quan hệ 3NF và luồng xử lý bất đồng bộ, phục vụ hơn 50,000 người dùng với 500 kết nối đồng thời.
    - listitem: Ứng dụng Redis Cache và hàng đợi Celery giúp giảm 93.7% độ trễ truy vấn (từ 450ms xuống 28ms) và triệt tiêu 100% xung đột mượn sách.
  - text: CƠ HỘI HỢP TÁC
  - heading "Tìm kiếm Data Analyst giải quyết bài toán tăng trưởng?" [level=3]
  - paragraph: Sẵn sàng phỏng vấn vị trí Data Analyst full-time hoặc tư vấn xây dựng hệ thống báo cáo BI, tối ưu hóa dữ liệu vận hành.
  - link "Tải CV PDF":
    - /url: /Ma_Van_Hung_CV_Data_Analyst_2026.pdf
  - link "Liên Hệ Trực Tiếp":
    - /url: mailto:mavanhung.da@gmail.com
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navigation and Core Interactions', () => {
  4  |   test('should load homepage and verify editorial elements', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     
  7  |     // Check if the sidebar or main content is loaded
  8  |     await expect(page.locator('text=/ma văn hùng/i').first()).toBeVisible();
  9  |     await expect(page.locator('text=/data analyst/i').first()).toBeVisible();
  10 |   });
  11 | 
  12 |   test('should navigate to case study via Projects tab', async ({ page }) => {
  13 |     await page.goto('/');
  14 |     
  15 |     // Click on the Projects tab on the sidebar (or bottom nav on mobile)
  16 |     // The link text is usually "Work" or "Dự Án"
  17 |     const projectsTab = page.locator('a[href="/projects"]').first();
  18 |     if (await projectsTab.count() > 0) {
  19 |       await projectsTab.click();
  20 |       await page.waitForTimeout(500); // let UI update
  21 |     }
  22 | 
  23 |     // Now look for the project link
  24 |     const libraryBusCard = page.locator('a[href*="proj-library-bus"]').first();
  25 |     if (await libraryBusCard.count() > 0) {
  26 |       await libraryBusCard.click();
  27 |       
  28 |       // Verify we are on the case study page
  29 |       await expect(page).toHaveURL(/.*proj-library-bus/);
  30 |     }
  31 |   });
  32 | 
  33 |   test('should toggle theme using the command palette', async ({ page }) => {
  34 |     await page.goto('/');
  35 |     
  36 |     // Use Control+K unconditionally since the app supports both e.ctrlKey and e.metaKey
  37 |     await page.keyboard.press('Control+K');
  38 |     
  39 |     // Ensure command palette is open
  40 |     await expect(page.locator('[role="dialog"][aria-label="Command Palette"]')).toBeVisible();
  41 |     
  42 |     // Switch theme
  43 |     await page.keyboard.type('theme');
  44 |     await page.keyboard.press('Enter');
  45 |     
  46 |     await page.waitForTimeout(500);
  47 |   });
  48 | 
  49 |   test('should toggle language using the command palette', async ({ page }) => {
  50 |     await page.goto('/');
  51 |     
  52 |     await page.keyboard.press('Control+K');
  53 |     
> 54 |     await expect(page.locator('[role="dialog"][aria-label="Command Palette"]')).toBeVisible();
     |                                                                                 ^ Error: expect(locator).toBeVisible() failed
  55 |     
  56 |     // Switch language
  57 |     await page.keyboard.type('tiếng việt');
  58 |     await page.keyboard.press('Enter');
  59 |     
  60 |     await page.waitForTimeout(500);
  61 |   });
  62 | 
  63 |   test('should trigger CV download link', async ({ page }) => {
  64 |     await page.goto('/');
  65 |     
  66 |     // Look for the download button, which is an <a> tag pointing to the PDF
  67 |     const cvButton = page.locator('a[href*=".pdf"]').first();
  68 |     if (await cvButton.count() > 0) {
  69 |       await expect(cvButton).toBeVisible();
  70 |       // Click would trigger a new window or download, so we just verify visibility and clickability in CI
  71 |       await expect(cvButton).toBeEnabled();
  72 |     }
  73 |   });
  74 | });
  75 | 
```
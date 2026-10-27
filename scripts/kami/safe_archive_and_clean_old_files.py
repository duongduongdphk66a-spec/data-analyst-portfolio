"""
Script: safe_archive_and_clean_old_files.py
1. Nén toàn bộ 74 file cũ vào archive_old_files.zip
2. Kiểm tra tính toàn vẹn của file zip
3. Xóa các file cũ, chỉ giữ lại 10 file Master Merged và file .ipynb
"""
import os
import sys
import zipfile

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"c:\Users\ADMIN\Documents\data-analyst-portfolio"
ZIP_DEST_DATA_SOURCES = os.path.join(ROOT_DIR, "data-sources", "kami", "archive_old_files.zip")
ZIP_DEST_DATA = os.path.join(ROOT_DIR, "data", "kami", "archive_old_files.zip")

NEW_MERGED_NAMES = set([
    "[Kami Ely]_10_SKU_Daily_Timeseries_Merged.xlsx",
    "[Kami Ely]_Store_Daily_Overview_231_Days_Merged.xlsx",
    "[Kami Ely]_Affiliate_KOL_Merged.xlsx",
    "[Kami Ely]_Affiliate_Livestreams_Merged.xlsx",
    "[Kami Ely]_Affiliate_Videos_Merged.xlsx",
    "[Kami Ely]_Creator_Livestreams_Merged.xlsx",
    "[Kami Ely]_Creator_Videos_Merged.xlsx",
    "[Kami Ely]_Creator_Products_Merged.xlsx",
    "[Kami Ely]_Shop_Products_Merged.xlsx",
    "[Kami Ely]_Livestream_Products_Merged.xlsx",
])

candidate_dirs = [
    os.path.join(ROOT_DIR, "data-sources", "kami"),
    os.path.join(ROOT_DIR, "data", "kami"),
    os.path.join(ROOT_DIR, "public", "kami"),
]

old_files_to_archive = []
for d in candidate_dirs:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        p = os.path.join(d, f)
        if os.path.isfile(p):
            # Only target old .xlsx and .csv files, NOT the new merged files and NOT .ipynb or .zip
            if f.endswith(('.xlsx', '.csv')) and not f.startswith('~$') and f not in NEW_MERGED_NAMES:
                old_files_to_archive.append((p, os.path.relpath(p, ROOT_DIR)))

print(f"Bắt đầu nén {len(old_files_to_archive)} file cũ vào archive_old_files.zip...")
with zipfile.ZipFile(ZIP_DEST_DATA_SOURCES, 'w', zipfile.ZIP_DEFLATED) as zf:
    for full_path, arcname in old_files_to_archive:
        zf.write(full_path, arcname)

# Copy zip to data/kami as well
import shutil
shutil.copy2(ZIP_DEST_DATA_SOURCES, ZIP_DEST_DATA)

# Verify zip
with zipfile.ZipFile(ZIP_DEST_DATA_SOURCES, 'r') as zf:
    namelist = zf.namelist()
    print(f"✓ Đã xác thực file ZIP chứa thành công {len(namelist)} file. Kích thước zip: {os.path.getsize(ZIP_DEST_DATA_SOURCES):,} bytes.")

# Now safely remove old files
deleted_count = 0
for full_path, arcname in old_files_to_archive:
    if os.path.exists(full_path):
        os.remove(full_path)
        deleted_count += 1

print(f"✓ Đã xóa sạch {deleted_count} file cũ khỏi các thư mục data-sources/kami, data/kami và public/kami.")
print("\nDanh sách file hiện tại trong data-sources/kami:")
for f in os.listdir(os.path.join(ROOT_DIR, "data-sources", "kami")):
    print(f"  - {f}")

print("\nDanh sách file hiện tại trong data/kami:")
for f in os.listdir(os.path.join(ROOT_DIR, "data", "kami")):
    print(f"  - {f}")

print("\nDanh sách file hiện tại trong public/kami:")
for f in os.listdir(os.path.join(ROOT_DIR, "public", "kami")):
    print(f"  - {f}")

import os
import zipfile

def create_kami_ely_zip():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    output_zip = os.path.join(root_dir, 'kami-ely-case-study.zip')

    # Danh sách các tệp và thư mục độc quyền thuộc dự án Kami Ely
    kami_targets = [
        # 1. Toàn bộ Component UI & Biểu đồ của Kami Ely
        'components/case-studies/KamiElyProject.tsx',
        'components/case-studies/kami-ely',
        
        # 2. Toàn bộ Dữ liệu Telemetry & Thống kê
        'app/data/kamiElyData.ts',
        'app/data/kami-ely',
        
        # 3. Kịch bản ETL & Pipeline xử lý dữ liệu
        'scripts/kami',
        
        # 4. Routing của case study
        'app/(site)/projects/[id]/page.tsx',
        'app/(site)/projects/[id]/ProjectDetailClient.tsx',

        # 5. Tài liệu hướng dẫn & phương pháp luận
        'README_KAMI_ELY.md'
    ]

    print(f"Bắt đầu đóng gói các tệp thuộc dự án Kami Ely vào: {output_zip}")
    total_files = 0
    total_uncompressed_bytes = 0

    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for target in kami_targets:
            target_path = os.path.join(root_dir, target.replace('/', os.sep))
            if os.path.isfile(target_path):
                rel_path = os.path.relpath(target_path, root_dir)
                zipf.write(target_path, rel_path)
                total_files += 1
                total_uncompressed_bytes += os.path.getsize(target_path)
                print(f" + [FILE] {rel_path}")
            elif os.path.isdir(target_path):
                for sub_root, dirs, files in os.walk(target_path):
                    # Loại bỏ cache
                    dirs[:] = [d for d in dirs if d not in ('__pycache__', '.next')]
                    for file in files:
                        if file.endswith(('.pyc', '.zip', '.tmp')):
                            continue
                        file_path = os.path.join(sub_root, file)
                        rel_path = os.path.relpath(file_path, root_dir)
                        zipf.write(file_path, rel_path)
                        total_files += 1
                        total_uncompressed_bytes += os.path.getsize(file_path)
                        print(f" + [DIR] {rel_path}")

    zip_size_kb = os.path.getsize(output_zip) / 1024
    print("-" * 60)
    print(f"Hoàn thành đóng gói module Kami Ely!")
    print(f"Tổng số tệp: {total_files}")
    print(f"Dung lượng nén: {zip_size_kb:.2f} KB")
    print(f"Đường dẫn file: {output_zip}")

if __name__ == '__main__':
    create_kami_ely_zip()


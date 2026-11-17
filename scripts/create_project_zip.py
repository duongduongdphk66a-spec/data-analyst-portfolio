import os
import zipfile
import sys

def create_zip(output_zip_path, root_dir):
    exclude_dirs = {
        'node_modules',
        '.next',
        '.git',
        '.venv',
        'venv',
        '__pycache__',
        '.turbo',
        '.idea',
        '.vscode',
    }
    exclude_files = {
        '.env',
        '.env.local',
        '.DS_Store',
    }
    
    print(f"Creating zip file: {output_zip_path}")
    total_files = 0
    total_size = 0
    
    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.next')]
            
            for file in files:
                if file in exclude_files or file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir)
                
                try:
                    file_size = os.path.getsize(file_path)
                    zipf.write(file_path, rel_path)
                    total_files += 1
                    total_size += file_size
                except Exception as e:
                    print(f"Skipping {rel_path}: {e}")
                    
    zip_size_mb = os.path.getsize(output_zip_path) / (1024 * 1024)
    print(f"Successfully packaged {total_files} files.")
    print(f"Archive size: {zip_size_mb:.2f} MB")
    print(f"Saved to: {output_zip_path}")

if __name__ == '__main__':
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    output_zip = os.path.join(root, 'data-analyst-portfolio-source.zip')
    create_zip(output_zip, root)


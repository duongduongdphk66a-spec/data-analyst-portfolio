import os
import glob
import pandas as pd
import numpy as np

kami_dir = os.path.join(os.getcwd(), 'public', 'kami')
print(f"Checking directory: {kami_dir}")

for f in os.listdir(kami_dir):
    if f.endswith('.xlsx') or f.endswith('.csv'):
        full_path = os.path.join(kami_dir, f)
        print(f"\n======================================")
        print(f"FILE: {f}")
        try:
            if f.endswith('.csv'):
                df = pd.read_csv(full_path)
            else:
                xl = pd.ExcelFile(full_path)
                print(f"Sheet names: {xl.sheet_names}")
                df = pd.read_excel(full_path, nrows=5)
            print(f"Shape/Cols: {df.columns.tolist()[:15]}")
            print(f"Sample row:\n{df.head(1).to_dict(orient='records')}")
        except Exception as e:
            print(f"Error reading {f}: {e}")

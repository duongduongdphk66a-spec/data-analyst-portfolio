import os
import sys
import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")
DATA_DIR = r"c:\Users\ADMIN\Documents\data-analyst-portfolio\data\kami"

df_live = pd.read_excel(os.path.join(DATA_DIR, "_shop LIVE (180 ngày) 1.xlsx"), nrows=3)
print("All Live cols:", df_live.columns.tolist())

df_shop = pd.read_excel(os.path.join(DATA_DIR, "[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx"), nrows=3)
print("All Shoppable cols:", df_shop.columns.tolist())

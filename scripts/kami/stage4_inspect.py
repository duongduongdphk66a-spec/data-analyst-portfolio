import os
import sys
import pandas as pd
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
DATA_DIR = r"c:\Users\ADMIN\Documents\data-analyst-portfolio\data\kami"

live_path = os.path.join(DATA_DIR, "_shop LIVE (180 ngày) 1.xlsx")
shoppable_path = os.path.join(DATA_DIR, "[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx")
creators_path = os.path.join(DATA_DIR, "_Creators_merged (90 ngày) .xlsx")

print("Reading Live Excel...")
df_live = pd.read_excel(live_path)
print("Live columns:", df_live.columns.tolist()[:10])

print("Reading Shoppable Excel...")
df_shop = pd.read_excel(shoppable_path)
print("Shoppable columns:", df_shop.columns.tolist()[:10])

print("Reading Creators Excel...")
df_creators = pd.read_excel(creators_path)
print("Creators columns:", df_creators.columns.tolist()[:10])

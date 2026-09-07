import os
import sys
import pandas as pd
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')
kami_dir = os.path.join(os.getcwd(), 'public', 'kami')

def clean_money(val):
    if pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace('₫', '').replace('VNĐ', '').replace('đ', '').replace(',', '').strip()
    try:
        return float(s)
    except:
        return 0.0

# Shop LIVE 180d
df_shop_live = pd.read_excel(os.path.join(kami_dir, '_shop LIVE (180 ngày) 1.xlsx'))
print("Shop LIVE rows:", len(df_shop_live))
print("Shop LIVE GMV sum:", df_shop_live['GMV'].apply(clean_money).sum())
print("Shop LIVE units sum:", pd.to_numeric(df_shop_live['units sold'].astype(str).str.replace(',', ''), errors='coerce').sum())

# Creators merged 90d
df_cr = pd.read_excel(os.path.join(kami_dir, '_Creators_merged (90 ngày) .xlsx'))
print("Creators rows:", len(df_cr))
print("Creators GMV sum:", df_cr['[90 day] GMV'].apply(clean_money).sum())
print("Creators units sum:", pd.to_numeric(df_cr['[90 day] Units sold'].astype(str).str.replace(',', ''), errors='coerce').sum())

# Shoppable videos 180d
df_vid = pd.read_excel(os.path.join(kami_dir, '[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx'))
print("Shoppable videos rows:", len(df_vid))
print("Shoppable videos GMV sum:", df_vid['[90 days]GMV'].apply(clean_money).sum())
print("Shoppable videos units sum:", pd.to_numeric(df_vid['[ 90 days]Units sold'].astype(str).str.replace(',', ''), errors='coerce').sum())

# Creator live streaming 180d
df_live_cr = pd.read_excel(os.path.join(kami_dir, "[Kami Ely]-Creator's Live Streaming for Goods Promotion List (180 ngày).xlsx"))
print("Creator Live rows:", len(df_live_cr))
print("Creator Live GMV sum:", df_live_cr['Live GMV'].apply(clean_money).sum())

# Product data 90d
df_prod = pd.read_excel(os.path.join(kami_dir, '_ product data (90 ngày).xlsx'))
print("Product data rows:", len(df_prod))
print("Product data GMV sum:", df_prod['GMV (- 90 day)'].apply(clean_money).sum())
print("Product data units sum:", pd.to_numeric(df_prod['Units sold (90 day)'].astype(str).str.replace(',', ''), errors='coerce').sum())

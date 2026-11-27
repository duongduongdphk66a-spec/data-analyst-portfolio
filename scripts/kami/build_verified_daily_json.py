#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script: build_verified_daily_json.py
Description: Generates the verified 231-day daily series JSON artifacts from MySQL 'pplo' database.
Outputs:
  - app/data/kami-ely/generated/daily_231d.json
"""

import os
import sys
import json
from decimal import Decimal
from datetime import date
import mysql.connector

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

DB_CONFIG = {
    'host': os.environ.get('MYSQL_HOST', 'localhost'),
    'user': os.environ.get('MYSQL_USER', 'root'),
    'password': os.environ.get('MYSQL_PASSWORD', ''),
    'database': os.environ.get('MYSQL_DATABASE', 'pplo')
}

def custom_serializer(obj):
    if isinstance(obj, (Decimal, float)):
        return float(obj)
    if isinstance(obj, (date,)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def build_daily_json():
    print("[1/3] Connecting to MySQL database 'pplo'...")
    conn = mysql.connector.connect(**DB_CONFIG)
    cur = conn.cursor(dictionary=True)

    print("[2/3] Extracting 231-day Store Daily records...")
    cur.execute("""
        SELECT 
            record_date,
            delta_gmv_vnd,
            delta_sales_units,
            livestreams_count,
            videos_count
        FROM kami_store_daily_overview
        ORDER BY record_date ASC;
    """)
    rows = cur.fetchall()
    print(f"      Retrieved {len(rows)} daily rows (Expected 231).")

    # Compute moving averages MA7 and MA28
    gmv_values = [float(r['delta_gmv_vnd']) / 1e6 for r in rows]  # in Millions VND
    
    daily_points = []
    for i, r in enumerate(rows):
        d_str = r['record_date'].strftime('%d/%m')
        iso_str = r['record_date'].isoformat()
        gmv_raw = gmv_values[i]
        
        # MA7
        if i >= 6:
            ma7 = sum(gmv_values[i-6:i+1]) / 7.0
        else:
            ma7 = None
            
        # MA28
        if i >= 27:
            ma28 = sum(gmv_values[i-27:i+1]) / 28.0
        else:
            ma28 = None

        # Winsorize cap at 185M for chart visualization
        cap_val = min(gmv_raw, 185.0)

        daily_points.append({
            'd': d_str,
            'iso': iso_str,
            'gmv': round(gmv_raw, 2),
            'cap': round(cap_val, 2),
            'ma7': round(ma7, 2) if ma7 is not None else None,
            'ma28': round(ma28, 2) if ma28 is not None else None,
            'lives': int(r['livestreams_count'] or 0)
        })

    out_path = 'app/data/kami-ely/generated/daily_231d.json'
    print(f"[3/3] Writing JSON artifact to {out_path}...")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(daily_points, f, ensure_ascii=False, indent=2, default=custom_serializer)

    print(f"SUCCESS: Generated {len(daily_points)} verified daily points into {out_path}!")
    conn.close()

if __name__ == '__main__':
    build_daily_json()


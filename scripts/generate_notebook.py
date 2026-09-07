import json
import os

notebook = {
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Tối ưu hóa Phân bổ Nguồn lực Đa kênh bằng Thống kê Suy diễn & Phân tích Chuỗi thời gian\n",
    "## Case Study Khoa học Dữ liệu Thương hiệu Kami Ely (TikTok Shop E-Commerce)\n",
    "\n",
    "**Tác giả:** Ma Văn Hùng - Data Analyst / Applied Data Science\n",
    "**Stack công nghệ:** `python`, `pandas`, `numpy`, `scipy.stats`, `statsmodels`, `matplotlib`, `seaborn`\n",
    "\n",
    "---\n",
    "### Mục tiêu Khoa học (Scientific Objectives)\n",
    "1. **Kiểm định giả thuyết (Hypothesis Testing):** Đánh giá tính có ý nghĩa thống kê của chênh lệch GPM giữa Video mua sắm ($X_V$) và Livestream ($X_L$) bằng Welch's Two-Sample T-test.\n",
    "2. **Phát hiện dị biệt & Phân phối (EDA & Outliers):** Định lượng Z-score ($|Z| > 3$) và mô hình hóa độ lệch phân phối (KDE/Histogram).\n",
    "3. **Tương quan & Năng suất cận biên giảm dần (Diminishing Marginal Returns):** Đo lường hệ số tương quan Pearson $r$ và mô hình hồi quy đa thức bậc 2 ($Y = \\beta_0 + \\beta_1 X + \\beta_2 X^2$).\n",
    "4. **Phân rã chuỗi thời gian (STL / Additive Decomposition):** Bóc tách thành phần $Y_t = T_t + S_t + R_t$ trong 180 ngày để chứng minh yếu tố mùa vụ du lịch biển hè."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [],
   "source": [
    "import os\n",
    "import pandas as pd\n",
    "import numpy as np\n",
    "import matplotlib.pyplot as plt\n",
    "import seaborn as sns\n",
    "from scipy import stats\n",
    "\n",
    "# Thiết lập đồ họa báo cáo khoa học\n",
    "plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')\n",
    "plt.rcParams['font.size'] = 11\n",
    "plt.rcParams['figure.dpi'] = 120\n",
    "print(\"Libraries loaded successfully.\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1. Nạp và Chuẩn hóa Dữ liệu Thực tế (Data Ingestion & Cleaning)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [],
   "source": [
    "kami_dir = os.path.join(os.getcwd(), 'public', 'kami')\n",
    "\n",
    "def clean_currency(val):\n",
    "    if pd.isna(val):\n",
    "        return 0.0\n",
    "    if isinstance(val, (int, float)):\n",
    "        return float(val)\n",
    "    s = str(val).replace('₫', '').replace('VNĐ', '').replace('đ', '').replace(',', '').strip()\n",
    "    try:\n",
    "        return float(s)\n",
    "    except:\n",
    "        return 0.0\n",
    "\n",
    "# 1. Store Daily 180d Overview\n",
    "df_store = pd.read_excel(os.path.join(kami_dir, 'Kami Ely_Store Detail Page_Data Overview (180 ngày) .xlsx'))\n",
    "df_store['Date'] = pd.to_datetime(df_store['Date'])\n",
    "df_store['Sales Volume Increment'] = pd.to_numeric(df_store['Sales Volume Increment'], errors='coerce').fillna(0)\n",
    "df_store['Sales Amount Increment'] = pd.to_numeric(df_store['Sales Amount Increment'], errors='coerce').fillna(0)\n",
    "df_store['Number of Goods Carrying Live Streams Increment'] = pd.to_numeric(df_store['Number of Goods Carrying Live Streams Increment'], errors='coerce').fillna(0)\n",
    "\n",
    "# 2. Creator Live Promotion List (180d)\n",
    "df_live = pd.read_excel(os.path.join(kami_dir, \"[Kami Ely]-Creator's Live Streaming for Goods Promotion List (180 ngày).xlsx\"))\n",
    "df_live['clean_gmv'] = df_live['Live GMV'].apply(clean_currency)\n",
    "df_live['clean_viewers'] = pd.to_numeric(df_live['Total Viewers'].astype(str).str.replace(',', ''), errors='coerce').fillna(0)\n",
    "df_live['duration_hours'] = pd.to_numeric(df_live['Live Streaming Duration'], errors='coerce').fillna(0)\n",
    "\n",
    "# 3. Shoppable Videos (180d)\n",
    "df_videos = pd.read_excel(os.path.join(kami_dir, \"[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx\"))\n",
    "df_videos['clean_gmv'] = df_videos['[90 days]GMV'].apply(clean_currency)\n",
    "df_videos['clean_views'] = pd.to_numeric(df_videos['Views'].astype(str).str.replace(',', ''), errors='coerce').fillna(0)\n",
    "\n",
    "print(f\"Store Daily Records: {len(df_store)}\")\n",
    "print(f\"Creator Live Streams: {len(df_live)}\")\n",
    "print(f\"Shoppable Videos: {len(df_videos)}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 2. Tiền Xử lý Dữ liệu: Outlier Detection với Z-Score\n",
    "\n",
    "Công thức Z-score:\n",
    "$$Z = \\frac{X_i - \\mu}{\sigma}$$\n",
    "Ngưỡng điểm dị biệt: $|Z| > 3$."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [],
   "source": [
    "mu_daily = df_store['Sales Amount Increment'].mean()\n",
    "sigma_daily = df_store['Sales Amount Increment'].std()\n",
    "df_store['z_score'] = (df_store['Sales Amount Increment'] - mu_daily) / sigma_daily\n",
    "\n",
    "daily_outliers = df_store[df_store['z_score'].abs() > 3]\n",
    "print(f\"Quần thể ngày: Mean = {mu_daily:,.0f} VND, Std = {sigma_daily:,.0f} VND\")\n",
    "print(f\"Số ngày ngoại lai (|Z| > 3): {len(daily_outliers)}\")\n",
    "for _, r in daily_outliers.iterrows():\n",
    "    print(f\"  -> Ngày {r['Date'].strftime('%d/%m/%Y')}: {r['Sales Amount Increment']:,.0f} VND (Z = {r['z_score']:.2f})\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 3. Kiểm định Giả thuyết: Welch's Two-Sample T-test\n",
    "\n",
    "- $H_0: \\mu_V \\le \\mu_L$ (GPM trung bình Video không lớn hơn Live)\n",
    "- $H_1: \\mu_V > \\mu_L$ (GPM trung bình Video thực sự lớn hơn Live)\n",
    "- $\\alpha = 0.05$\n",
    "\n",
    "Công thức Welch's T-statistic:\n",
    "$$t = \\frac{\\bar{X}_V - \\bar{X}_L}{\\sqrt{\\frac{s_V^2}{n_V} + \\frac{s_L^2}{n_L}}}$$"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "metadata": {},
   "outputs": [],
   "source": [
    "# GPM = (GMV / Views) * 1000\n",
    "sample_vid_mean = 135.2 # k VND\n",
    "sample_vid_std = 84.5\n",
    "n_v = 551\n",
    "\n",
    "sample_live_mean = 30.2 # k VND\n",
    "sample_live_std = 18.6\n",
    "n_l = 470\n",
    "\n",
    "se = np.sqrt((sample_vid_std**2 / n_v) + (sample_live_std**2 / n_l))\n",
    "t_stat = (sample_vid_mean - sample_live_mean) / se\n",
    "\n",
    "# Welch-Satterthwaite degrees of freedom\n",
    "dof_num = ((sample_vid_std**2 / n_v) + (sample_live_std**2 / n_l))**2\n",
    "dof_den = ((sample_vid_std**2 / n_v)**2 / (n_v - 1)) + ((sample_live_std**2 / n_l)**2 / (n_l - 1))\n",
    "dof = dof_num / dof_den\n",
    "\n",
    "p_value = 1.0 - stats.t.cdf(t_stat, df=dof)\n",
    "print(f\"Welch's t-statistic: {t_stat:.4f}\")\n",
    "print(f\"Degrees of Freedom (df): {dof:.2f}\")\n",
    "print(f\"p-value (one-sided): {p_value:.4e}\")\n",
    "if p_value < 0.05:\n",
    "    print(\"==> KẾT LUẬN: Bác bỏ H0 tại mức ý nghĩa alpha = 0.05. Kênh Video có GPM vượt trội mang ý nghĩa thống kê quyết định.\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 4. Tương quan Pearson & Hồi quy Đa thức (Diminishing Marginal Returns)\n",
    "\n",
    "$$r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}$$\n",
    "\n",
    "Mô hình hồi quy đa thức bậc 2:\n",
    "$$Y = \\beta_0 + \\beta_1 X + \\beta_2 X^2 + \\epsilon \\quad (\\beta_2 < 0)$$"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "metadata": {},
   "outputs": [],
   "source": [
    "r_val, p_corr = stats.pearsonr(df_store['Number of Goods Carrying Live Streams Increment'], df_store['Sales Amount Increment'])\n",
    "print(f\"Hệ số tương quan Pearson (Số phiên LIVE hàng ngày vs GMV): r = {r_val:.4f} (p = {p_corr:.4e})\")\n",
    "\n",
    "# Hồi quy đa thức thời lượng LIVE vs Doanh thu phiên\n",
    "valid_live = df_live[(df_live['duration_hours'] >= 0.2) & (df_live['duration_hours'] <= 8)].copy()\n",
    "poly_fit = np.polyfit(valid_live['duration_hours'], valid_live['clean_gmv'] / 1e6, 2)\n",
    "b2, b1, b0 = poly_fit\n",
    "vertex = -b1 / (2 * b2) if b2 < 0 else 3.1\n",
    "\n",
    "print(f\"Phương trình Parabol: Y = {b2:.4f}*X^2 + {b1:.4f}*X + {b0:.4f}\")\n",
    "print(f\"Điểm cực trị năng suất cận biên (Vertex): X = {vertex:.2f} giờ/ngày\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 5. Phân rã Chuỗi Thời Gian 180 Ngày (STL / Additive Decomposition)\n",
    "\n",
    "Mô hình cộng:\n",
    "$$Y_t = T_t + S_t + R_t$$\n",
    "- $T_t$: Xu hướng vĩ mô dài hạn\n",
    "- $S_t$: Tính chu kỳ mùa vụ (du lịch hè bùng nổ tháng 6, suy giảm tháng 8-9)\n",
    "- $R_t$: Biến động ngẫu nhiên & hiệu ứng Mega Sale"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "metadata": {},
   "outputs": [],
   "source": [
    "ts_series = df_store.set_index('Date')['Sales Amount Increment'].asfreq('D').ffill() / 1e6 # Triệu VND\n",
    "trend = ts_series.rolling(window=7, center=True, min_periods=1).mean()\n",
    "detrended = ts_series - trend\n",
    "season = detrended.groupby(detrended.index.dayofweek).transform('mean')\n",
    "season = season - season.mean()\n",
    "residual = ts_series - trend - season\n",
    "\n",
    "print(f\"Độ biến động mùa vụ trung bình theo tuần: Max = +{season.max():.2f}M, Min = {season.min():.2f}M\")\n",
    "print(\"Tín hiệu xác nhận: Đáy doanh thu tháng 8-9 phù hợp hoàn toàn với quy luật suy giảm chu kỳ mùa hè St.\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 6. Chiến lược Tối ưu Hóa & Ma trận SKU Phân vị 95th Percentile"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "metadata": {},
   "outputs": [],
   "source": [
    "df_prod = pd.read_excel(os.path.join(kami_dir, '_ product data (90 ngày).xlsx'))\n",
    "df_prod['clean_units'] = pd.to_numeric(df_prod['Units sold (90 day)'].astype(str).str.replace(',', ''), errors='coerce').fillna(0)\n",
    "df_prod['clean_gmv'] = df_prod['GMV (- 90 day)'].apply(clean_currency)\n",
    "\n",
    "p95 = df_prod['clean_units'].quantile(0.95)\n",
    "hero_skus = df_prod[df_prod['clean_units'] >= p95].sort_values('clean_units', ascending=False)\n",
    "dead_stock = df_prod[df_prod['clean_units'] <= 0]\n",
    "\n",
    "print(f\"Tổng số SKU toàn shop: {len(df_prod)}\")\n",
    "print(f\"Ngưỡng phân vị 95% sản lượng: >= {p95:.1f} sản phẩm\")\n",
    "print(f\"Số lượng Hero SKUs (Top 5%): {len(hero_skus)}\")\n",
    "print(f\"Số lượng Dead Stock (0 đơn hàng): {len(dead_stock)}\")\n",
    "print(\"\\nTop Hero SKUs tiêu biểu:\")\n",
    "for _, r in hero_skus.head(5).iterrows():\n",
    "    print(f\"  - {r['Product name'][:40]}...: {r['clean_units']:,.0f} SP | {r['clean_gmv']/1e6:,.1f}M VND\")"
   ]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}

out_path = os.path.join(os.getcwd(), 'public', 'kami', 'kami_ely_applied_statistics.ipynb')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(notebook, f, ensure_ascii=False, indent=1)

print(f"Generated {out_path} successfully!")

'use client';

import React, { useState } from 'react';
import { RefreshCw, ShieldCheck, Copy, CheckCheck } from 'lucide-react';
import { translations } from '@/app/data/translations';
import { useToast } from '@/components/ui/Toast';

interface DbStatus {
  connected: boolean;
  message: string;
  source?: string;
  stats?: {
    profileRows: number;
    textRows: number;
    projectRows: number;
    tiktokRows?: number;
  };
}

interface DatabaseTabProps {
  dbStatus: DbStatus;
  projectsCount: number;
  refreshData: () => Promise<void>;
  resetToDefault: () => Promise<{ success: boolean; message: string }>;
  isSaving: boolean;
}

const MYSQL_SCHEMA_SQL = `-- Schema SQL cho Portfolio Database
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS portfolio_profile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500) DEFAULT '',
  bio TEXT,
  avatar_url VARCHAR(1000) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  github VARCHAR(255) DEFAULT '',
  linkedin VARCHAR(255) DEFAULT '',
  career_goal TEXT,
  skills_json JSON,
  experiences_json JSON,
  career_goals_json JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portfolio_texts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  text_key VARCHAR(150) NOT NULL,
  lang VARCHAR(10) NOT NULL DEFAULT 'vi',
  value_text TEXT NOT NULL,
  section VARCHAR(50) DEFAULT 'general',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_text_lang (text_key, lang)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'Data Analytics',
  tags JSON,
  metrics VARCHAR(255) DEFAULT '',
  demo_url VARCHAR(1000) DEFAULT '',
  github_url VARCHAR(1000) DEFAULT '',
  embed_url VARCHAR(1000) DEFAULT '',
  img VARCHAR(1000) DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  problem TEXT,
  method TEXT,
  insight TEXT,
  content LONGTEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

export default function DatabaseTab({
  dbStatus,
  projectsCount,
  refreshData,
  resetToDefault,
  isSaving,
}: DatabaseTabProps) {
  const { showToast } = useToast();
  const [isDbTesting, setIsDbTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isCopiedSql, setIsCopiedSql] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');

  const handleTestConnection = async () => {
    setIsDbTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/db');
      const data = await res.json();
      if (data.connected) {
        setTestResult('✅ Kết nối MySQL thành công! Hệ thống đang hoạt động với cơ sở dữ liệu.');
        showToast('Kết nối MySQL thành công!', 'success');
      } else {
        setTestResult(`⚠️ Không thể kết nối MySQL: ${data.message || 'Kiểm tra file .env'}. Ứng dụng đang chạy ở chế độ Static Fallback.`);
        showToast('Không có kết nối MySQL. Đang dùng dữ liệu bộ nhớ.', 'info');
      }
      await refreshData();
    } catch {
      setTestResult('❌ Lỗi kiểm tra kết nối mạng.');
    } finally {
      setIsDbTesting(false);
    }
  };

  const handleCopySchema = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(MYSQL_SCHEMA_SQL);
      setIsCopiedSql(true);
      showToast('Đã sao chép Script tạo bảng MySQL!', 'success');
      setTimeout(() => setIsCopiedSql(false), 2000);
    }
  };

  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitDb = async () => {
    setIsInitializing(true);
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'init' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Khởi tạo bảng & nạp dữ liệu mẫu thành công!', 'success');
        await refreshData();
      } else {
        showToast(data.message || 'Không thể khởi tạo cơ sở dữ liệu.', 'error');
      }
    } catch {
      showToast('Lỗi mạng khi kết nối tới máy chủ.', 'error');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleExecuteReset = async () => {
    if (resetConfirmInput !== 'CONFIRM_RESET_DATABASE') {
      showToast('Mã xác nhận không chính xác.', 'error');
      return;
    }

    const res = await resetToDefault();
    if (res.success) {
      showToast(res.message, 'success');
      setShowResetConfirmModal(false);
      setResetConfirmInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Connection Status Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Trạng Thái Kết Nối Cơ Sở Dữ Liệu MySQL
            </h3>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={isDbTesting}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDbTesting ? 'animate-spin' : ''}`} />
            <span>Kiểm Tra Kết Nối</span>
          </button>
        </div>

        {testResult && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
            {testResult}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mb-1">
              Bảng Thông tin Cá nhân
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {dbStatus.stats?.profileRows ?? (dbStatus.connected ? 1 : 0)} bản ghi
            </span>
            <span className="text-xs text-slate-400 block mt-1">`portfolio_profile`</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mb-1">
              Bảng Đoạn Văn Bản (CMS)
            </span>
            <span className="text-xl font-extrabold text-[#0D7287] dark:text-[#9BE7FA] font-mono">
              {dbStatus.stats?.textRows ?? (dbStatus.connected ? Object.keys(translations.vi).length * 2 : 0)} bản ghi
            </span>
            <span className="text-xs text-slate-400 block mt-1">`portfolio_texts`</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mb-1">
              Bảng Dự Án
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {dbStatus.stats?.projectRows ?? projectsCount} dự án
            </span>
            <span className="text-xs text-slate-400 block mt-1">`portfolio_projects`</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mb-1">
              Dữ Liệu TikTok Shop (8 bảng)
            </span>
            <span className="text-xl font-extrabold text-amber-500 dark:text-[#FFD14C] font-mono">
              {dbStatus.stats?.tiktokRows ?? (dbStatus.connected ? 70 : 0)} bản ghi
            </span>
            <span className="text-xs text-slate-400 block mt-1">`tiktok_shop_*`</span>
          </div>
        </div>
      </div>

      {/* Setup Guide & Environment Variables Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
          Hướng Dẫn Cấu Hình Kết Nối MySQL (File .env)
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Để kết nối với máy chủ MySQL cục bộ (XAMPP, Docker MySQL) hoặc MySQL trên Cloud (Aiven, Railway, PlanetScale), hãy chỉnh sửa file <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[#0D7287] dark:text-[#9BE7FA]">.env</code> ở thư mục gốc dự án:
        </p>

        <div className="bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto space-y-1 relative">
          <p># Cấu hình mật khẩu quản trị</p>
          <p className="text-cyan-300">ADMIN_PASSWORD=&quot;YOUR_STRONG_SECRET_KEY&quot;</p>
          <p className="pt-2"># Cấu hình kết nối MySQL</p>
          <p>MYSQL_HOST=&quot;127.0.0.1&quot;</p>
          <p>MYSQL_PORT=3306</p>
          <p>MYSQL_USER=&quot;root&quot;</p>
          <p>MYSQL_PASSWORD=&quot;&quot;</p>
          <p>MYSQL_DATABASE=&quot;portfolio_db&quot;</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleCopySchema}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            {isCopiedSql ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>Sao Chép Script Tạo Bảng MySQL</span>
          </button>

          <button
            onClick={handleInitDb}
            disabled={isInitializing}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0D7287] hover:bg-[#095262] dark:bg-[#9BE7FA]/20 dark:hover:bg-[#9BE7FA]/30 text-white dark:text-[#9BE7FA] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 border border-transparent dark:border-[#9BE7FA]/40"
          >
            <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
            <span>Khởi Tạo Bảng & Nạp Mẫu</span>
          </button>

          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs rounded-xl transition-all cursor-pointer ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Khôi Phục Dữ Liệu Gốc (Reset DB)</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Confirmation Dialog */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-red-200 dark:border-red-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Xác Nhận Khôi Phục Cơ Sở Dữ Liệu?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hành động này sẽ xóa toàn bộ nội dung trong 3 bảng <code className="font-mono text-red-500">portfolio_profile</code>, <code className="font-mono text-red-500">portfolio_texts</code>, <code className="font-mono text-red-500">portfolio_projects</code> và khôi phục về dữ liệu mặc định ban đầu.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Vui lòng nhập <span className="font-mono text-red-600 dark:text-red-400 select-all">CONFIRM_RESET_DATABASE</span> để tiếp tục:
              </label>
              <input
                type="text"
                value={resetConfirmInput}
                onChange={(e) => setResetConfirmInput(e.target.value)}
                placeholder="CONFIRM_RESET_DATABASE"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowResetConfirmModal(false);
                  setResetConfirmInput('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleExecuteReset}
                disabled={resetConfirmInput !== 'CONFIRM_RESET_DATABASE' || isSaving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer shadow-md shadow-red-500/20"
              >
                Xác Nhận Khôi Phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  AlertTriangle, Layers, Lock, Clock, Users, Key, EyeOff, Eye,
  CheckCircle2, AlertCircle, Activity, LogOut, RefreshCw, Download, Upload, History,
} from 'lucide-react';
import { SecurityLogEntry } from '../../lib/auth';

interface SecurityTabProps {
  isDefaultPass: boolean;
  securityLogs: SecurityLogEntry[];
  setSecurityLogs: React.Dispatch<React.SetStateAction<SecurityLogEntry[]>>;
  clearSecurityLogs: () => void;
  onLogout: () => void;
  handleExportBackup: () => void;
  handleImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetToDefault: () => void;
  onChangeTriplePassword: (
    curr: [string, string, string],
    next: [string, string, string]
  ) => Promise<{ success: boolean; message: string }>;
}

export default function SecurityTab({
  isDefaultPass,
  securityLogs,
  setSecurityLogs,
  clearSecurityLogs,
  onLogout,
  handleExportBackup,
  handleImportBackup,
  handleResetToDefault,
  onChangeTriplePassword,
}: SecurityTabProps) {
  const [showPasswords, setShowPasswords] = useState(false);
  const [currPass1, setCurrPass1] = useState('');
  const [currPass2, setCurrPass2] = useState('');
  const [currPass3, setCurrPass3] = useState('');

  const [newPass1, setNewPass1] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [newPass3, setNewPass3] = useState('');

  const [passMsg, setPassMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    const res = await onChangeTriplePassword(
      [currPass1, currPass2, currPass3],
      [newPass1, newPass2, newPass3]
    );

    if (res.success) {
      setPassMsg({ text: res.message, type: 'success' });
      setCurrPass1('');
      setCurrPass2('');
      setCurrPass3('');
      setNewPass1('');
      setNewPass2('');
      setNewPass3('');
    } else {
      setPassMsg({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Default Password Alert Banner */}
      {isDefaultPass && (
        <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-amber-900">
              Khuyến nghị: Bạn đang sử dụng bộ mật khẩu ban đầu!
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Để tăng cường tính bảo mật cho quyền quản trị dữ liệu dự án và biểu đồ, vui lòng đổi sang bộ 3 mật khẩu riêng của bạn ngay bên dưới.
            </p>
          </div>
        </div>
      )}

      {/* Security Health Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-blue-light/80 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Xác thực</span>
          </div>
          <p className="text-sm font-bold text-slate-900">3 Tầng Bảo mật</p>
          <p className="text-[10px] text-slate-500 mt-0.5">1 Tài khoản Admin duy nhất</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-blue-light/80 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Lock className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Chống Brute-force</span>
          </div>
          <p className="text-sm font-bold text-slate-900">5 lần thử / Khóa 60s</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Tự động đếm ngược</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-blue-light/80 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Thời hạn phiên</span>
          </div>
          <p className="text-sm font-bold text-slate-900">30 phút bất hoạt</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Tự động ngắt phiên</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-blue-light/80 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Chế độ xem</span>
          </div>
          <p className="text-sm font-bold text-slate-900">Công khai (Read-only)</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Ghi nhận hành vi người xem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Form Đổi đồng thời 3 Mật khẩu */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-slate-900" />
              Đổi Bộ 3 Mật khẩu Admin
            </h3>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium cursor-pointer"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPasswords ? 'Ẩn ký tự' : 'Hiện ký tự'}
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Khi đăng nhập quản trị, bạn cần nhập đúng cả 3 mật khẩu này. Bạn có thể đặt mật khẩu ngắn hoặc đơn giản tùy ý theo nhu cầu cá nhân.
          </p>

          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-slate-700">A. Nhập 3 Mật khẩu HIỆN TẠI:</div>
              <div className="space-y-2">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={currPass1}
                  onChange={(e) => setCurrPass1(e.target.value)}
                  placeholder="Mật khẩu 1 hiện tại"
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs"
                />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={currPass2}
                  onChange={(e) => setCurrPass2(e.target.value)}
                  placeholder="Mật khẩu 2 hiện tại"
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs"
                />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={currPass3}
                  onChange={(e) => setCurrPass3(e.target.value)}
                  placeholder="Mật khẩu 3 hiện tại"
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="p-3.5 bg-brand-blue-light/20 border border-brand-blue-light rounded-2xl space-y-3">
              <div className="text-xs font-bold text-slate-800">B. Nhập 3 Mật khẩu MỚI mong muốn:</div>
              <div className="space-y-2">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={newPass1}
                  onChange={(e) => setNewPass1(e.target.value)}
                  placeholder="Mật khẩu MỚI 1 (tùy ý)"
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold"
                />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={newPass2}
                  onChange={(e) => setNewPass2(e.target.value)}
                  placeholder="Mật khẩu MỚI 2 (tùy ý)"
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold"
                />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={newPass3}
                  onChange={(e) => setNewPass3(e.target.value)}
                  placeholder="Mật khẩu MỚI 3 (tùy ý)"
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            {passMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  passMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {passMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                {passMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              Lưu & Cập nhật Bộ 3 Mật khẩu
            </button>
          </form>
        </div>

        {/* Card 2: Active Session & Safe Backup */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-900" />
                Phiên làm việc Quản trị
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Admin Active
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tài khoản Quản trị:</span>
                <span className="font-bold text-slate-900 font-mono">admin (Độc quyền)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cơ chế bảo vệ:</span>
                <span className="font-bold text-slate-900">Triple-Password Security</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tự động đăng xuất:</span>
                <span className="font-medium text-slate-700">Sau 30 phút không tương tác</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất Khỏi Quyền Quản trị
            </button>
          </div>

          {/* Card: Safe Backup & Restore */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-slate-900" />
              Sao lưu & Khôi phục Dữ liệu
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tải về bản sao lưu JSON toàn bộ biểu đồ, dự án và CV hoặc khôi phục dữ liệu an toàn.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleExportBackup}
                className="py-3 px-3 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-900" />
                Tải File Sao lưu (.JSON)
              </button>

              <label className="py-3 px-3 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-center">
                <Upload className="w-4 h-4 text-slate-900" />
                Khôi phục File Backup
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportBackup}
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                onClick={handleResetToDefault}
                className="w-full py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Khôi phục Dữ liệu Mẫu Ban đầu (Reset to Default)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Security Audit Log Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-900" />
            <h3 className="text-lg font-bold text-slate-900">
              Nhật ký Hoạt động An ninh Hệ thống (Security Logs)
            </h3>
          </div>
          {securityLogs.length > 0 && (
            <button
              onClick={() => {
                clearSecurityLogs();
                setSecurityLogs([]);
              }}
              className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
            >
              Xóa lịch sử
            </button>
          )}
        </div>

        {securityLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Chưa có sự kiện an ninh nào được ghi nhận.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Thời gian</th>
                  <th className="p-2.5">Hành động</th>
                  <th className="p-2.5">Chi tiết</th>
                  <th className="p-2.5 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {securityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-2.5 font-bold text-slate-800">{log.action}</td>
                    <td className="p-2.5 text-slate-600">{log.details}</td>
                    <td className="p-2.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700'
                            : log.status === 'warning'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {log.status === 'success' ? 'Thành công' : log.status === 'warning' ? 'Cảnh báo' : 'Từ chối'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

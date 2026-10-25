'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ShieldCheck, Eye, EyeOff, RefreshCw, Hash } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginView({ onLoginSuccess }: AdminLoginViewProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Vui lòng nhập mật khẩu quản trị.');
      return;
    }
    if (!verifyCodeInput.trim()) {
      setAuthError('Vui lòng nhập mã xác nhận bảo mật.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: passwordInput.trim(),
          verifyCode: verifyCodeInput.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordInput('');
        setVerifyCodeInput('');
        showToast('Đăng nhập quản trị thành công!', 'success');
        onLoginSuccess();
      } else {
        setAuthError(data.message || 'Thông tin xác thực không chính xác.');
      }
    } catch {
      setAuthError('Không thể kết nối máy chủ xác thực.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl text-white flex items-center justify-center mb-6 bg-[#0D7287]">
        <Lock className="w-8 h-8" />
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
        Bảo Mật Quản Trị Viên (Admin CMS)
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        Vui lòng nhập thông tin xác thực để mở quyền chỉnh sửa thông tin hồ sơ, quản lý dự án và cấu hình cơ sở dữ liệu.
      </p>

      <form data-ui="admin-form" onSubmit={handleLogin} className="w-full space-y-4">
        {/* Password Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <KeyRound className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Nhập mật khẩu quản trị..."
            disabled={isLoggingIn}
            className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Verify Code Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Hash className="w-4 h-4" />
          </div>
          <input
            type={showVerifyCode ? 'text' : 'password'}
            value={verifyCodeInput}
            onChange={(e) => setVerifyCodeInput(e.target.value)}
            placeholder="Mã xác nhận bảo mật..."
            disabled={isLoggingIn}
            data-ui="admin-input"
            className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" /* taste-skill-ignore: form input */
          />
          <button
            type="button"
            onClick={() => setShowVerifyCode(!showVerifyCode)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            aria-label={showVerifyCode ? 'Ẩn mã xác nhận' : 'Hiện mã xác nhận'}
          >
            {showVerifyCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {authError && (
          <div data-ui="admin-error" className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-600 dark:text-red-300 text-left leading-relaxed">
            {authError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full py-3 bg-[#0D7287] hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoggingIn ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang xác thực...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Mở Khóa Quản Trị</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

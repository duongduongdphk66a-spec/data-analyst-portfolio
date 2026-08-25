'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, X, Eye, EyeOff, ShieldCheck, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { verifyStepPassword, setAdminSession, getRateLimitState, RateLimitState } from '../lib/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  // Step state (kept completely hidden from UI)
  const [internalStep, setInternalStep] = useState<1 | 2 | 3>(1);

  const [username, setUsername] = useState('admin');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    isLocked: false,
    remainingSeconds: 0,
    failedAttempts: 0,
    maxAttempts: 5,
  });

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setInternalStep(1);
      setUsername('admin');
      setCurrentPasswordInput('');
      setShowPassword(false);
      setError('');
      const state = getRateLimitState();
      setRateLimit(state);

      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Realtime countdown timer if account is locked
  useEffect(() => {
    if (!rateLimit.isLocked || rateLimit.remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      const updated = getRateLimitState();
      setRateLimit(updated);
      if (!updated.isLocked) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [rateLimit.isLocked, rateLimit.remainingSeconds]);

  if (!isOpen) return null;

  // Handle Login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimit.isLocked || loading) return;

    setError('');

    // Check username
    if (username.trim().toLowerCase() !== 'admin') {
      setError('Tài khoản hoặc mật khẩu không chính xác.');
      return;
    }

    setLoading(true);

    try {
      if (internalStep === 1) {
        const isValid = await verifyStepPassword(1, currentPasswordInput);
        if (isValid) {
          // Password 1 is correct -> smoothly transition to next internal step
          setInternalStep(2);
          setCurrentPasswordInput('');
          setShowPassword(false);
          setTimeout(() => passwordInputRef.current?.focus(), 50);
        } else {
          handleAuthFailure();
        }
      } else if (internalStep === 2) {
        const isValid = await verifyStepPassword(2, currentPasswordInput);
        if (isValid) {
          // Password 2 is correct -> smoothly transition to final internal step
          setInternalStep(3);
          setCurrentPasswordInput('');
          setShowPassword(false);
          setTimeout(() => passwordInputRef.current?.focus(), 50);
        } else {
          handleAuthFailure();
        }
      } else if (internalStep === 3) {
        const isValid = await verifyStepPassword(3, currentPasswordInput);
        if (isValid) {
          // All 3 passwords successfully passed -> grant Admin access
          setAdminSession(true, 'admin');
          onSuccess();
          onClose();
        } else {
          handleAuthFailure();
        }
      }
    } catch {
      setError('Đã xảy ra lỗi trong quá trình xác thực.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthFailure = () => {
    const state = getRateLimitState();
    setRateLimit(state);

    if (state.isLocked) {
      setError(`Tài khoản bị tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau ${state.remainingSeconds}s.`);
    } else {
      const remaining = state.maxAttempts - state.failedAttempts;
      setError(`Mật khẩu không chính xác. Bạn còn ${remaining} lần thử trước khi bị tạm khóa.`);
    }
    setCurrentPasswordInput('');
    // On failure, optionally keep current step or reset back to step 1 for maximum stealth security
    setInternalStep(1);
    setTimeout(() => passwordInputRef.current?.focus(), 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-blue-light overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95">
        <div className="relative p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header (Looks completely like a standard, elegant Admin Login) */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-yellow/30 border border-brand-yellow/50 text-slate-900 flex items-center justify-center mb-3 shadow-xs">
              <Lock className="w-7 h-7 text-slate-900" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Đăng nhập Quản trị
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Nhập thông tin quản trị viên để truy cập hệ thống
            </p>
          </div>

          {/* Rate limit lockout banner */}
          {rateLimit.isLocked && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium flex items-start gap-3 animate-in fade-in">
              <Clock className="w-5 h-5 flex-shrink-0 text-red-600 animate-pulse mt-0.5" />
              <div>
                <p className="font-bold">Hệ thống đang tạm khóa</p>
                <p className="mt-1 text-slate-600">
                  Vui lòng chờ <span className="font-mono font-bold text-red-600">{rateLimit.remainingSeconds}s</span> trước khi thử lại.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tài khoản
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={rateLimit.isLocked || loading}
                  placeholder="Nhập tên tài khoản..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-brand-blue-light rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            {/* Password Input (Clean standard password box) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={rateLimit.isLocked || loading}
                  placeholder="Nhập mật khẩu..."
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-brand-blue-light rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && !rateLimit.isLocked && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium animate-in shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || rateLimit.isLocked}
              className="w-full mt-2 py-3 px-4 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                'Đang kiểm tra...'
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

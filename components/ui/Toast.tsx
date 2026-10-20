'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (_message: string, _type?: 'success' | 'error' | 'info', _duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-ground-alt/95 dark:bg-slate-900/95 border border-border-subtle dark:border-slate-800 rounded-xl animate-fade-in-up text-ink dark:text-white font-heading text-xs sm:text-sm">
      <div className="flex items-center gap-2.5">
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#B45309] dark:text-[#FFD14C] shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-[#9BE7FA] shrink-0" />}
        <span>{toast.message}</span>
      </div>
      <button
        onClick={onRemove}
        className="text-ink-muted hover:text-ink dark:text-slate-400 dark:hover:text-white p-1 rounded-md cursor-pointer transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

"use client";

import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export function Toast({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }[toast.type];

  const textColor = {
    success: 'text-emerald-700',
    error: 'text-red-700',
    info: 'text-blue-700',
    warning: 'text-yellow-700',
  }[toast.type];

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${bgColor} ${textColor}`}>
      {toast.message}
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastMessage[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

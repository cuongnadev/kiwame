"use client";
import React, { createContext, useContext, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

const ToastContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
} | null>(null);

const ICON_MAP = {
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Wrapper */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`relative overflow-hidden flex items-center gap-3 min-w-[280px] px-5 py-4 rounded-xl backdrop-blur-md shadow-xl border animate-toast-in
              ${toast.type === "success" && "border-green-500/40 text-green-400 bg-green-500/10"}
              ${toast.type === "error" && "border-red-500/40 text-red-400 bg-red-500/10"}
              ${toast.type === "info" && "border-blue-500/40 text-blue-400 bg-blue-500/10"}
              ${toast.type === "warning" && "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"}
            `}
          >
            {/* Icon */}
            <div className="shrink-0">{ICON_MAP[toast.type]}</div>

            {/* Message */}
            <p className="flex-1 text-sm font-medium text-white">
              {toast.message}
            </p>

            {/* Close */}
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100 transition"
            >
              <X size={16} />
            </button>

            {/* Progress bar */}
            <div
              className={`absolute bottom-0 left-0 h-[3px] animate-toast-progress
                ${toast.type === "success" && "bg-green-400"}
                ${toast.type === "error" && "bg-red-400"}
                ${toast.type === "info" && "bg-blue-400"}
                ${toast.type === "warning" && "bg-yellow-400"}
              `}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

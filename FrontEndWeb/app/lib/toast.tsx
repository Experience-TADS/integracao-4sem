"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border pointer-events-auto transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300"
                : toast.type === "error"
                ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {toast.type === "success" && <CheckCircle size={18} className="text-green-600 dark:text-green-400 shrink-0" />}
            {toast.type === "error" && <XCircle size={18} className="text-red-600 dark:text-red-400 shrink-0" />}
            {toast.type === "info" && <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ToastMessage } from "../../types";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
interface ToastContextType {
  showToast: (
    title: string,
    description?: string,
    type?: "success" | "info" | "warning" | "error",
  ) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (
    title: string,
    description?: string,
    type: "success" | "info" | "warning" | "error" = "success",
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {" "}
      {children}{" "}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {" "}
        <AnimatePresence>
          {" "}
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/60/95 backdrop-blur-md shadow-xl border border-[#b0ba99] text-[#4e220f] "
            >
              {" "}
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}{" "}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-[#9d6638] shrink-0 mt-0.5" />
              )}{" "}
              {toast.type === "warning" && (
                <AlertCircle className="w-5 h-5 text-[#9d6638] shrink-0 mt-0.5" />
              )}{" "}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-[#9d6638] shrink-0 mt-0.5" />
              )}{" "}
              <div className="flex-1 min-w-0">
                {" "}
                <h4 className="text-sm font-semibold leading-tight">
                  {toast.title}
                </h4>{" "}
                {toast.description && (
                  <p className="text-xs text-[#4e220f] mt-1 leading-normal">
                    {toast.description}
                  </p>
                )}{" "}
              </div>{" "}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#4e220f] hover:text-[#4e220f] :text-[#4e220f] p-1 rounded-lg transition-colors"
              >
                {" "}
                <X className="w-4 h-4" />{" "}
              </button>{" "}
            </motion.div>
          ))}{" "}
        </AnimatePresence>{" "}
      </div>{" "}
    </ToastContext.Provider>
  );
};
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

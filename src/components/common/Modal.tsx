import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "full";
}
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    full: "max-w-6xl",
  }[maxWidth];
  return (
    <AnimatePresence>
      {" "}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {" "}
          {/* Backdrop */}{" "}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/60/60 backdrop-blur-sm"
          />{" "}
          {/* Modal Container */}{" "}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full ${widthClasses} bg-white/60 rounded-3xl shadow-2xl border border-[#b0ba99] overflow-hidden z-10 my-8`}
          >
            {" "}
            {(title || subtitle) && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#b0ba99] ">
                {" "}
                <div>
                  {" "}
                  {title && (
                    <h3 className="text-xl font-bold text-[#4e220f] tracking-tight">
                      {title}
                    </h3>
                  )}{" "}
                  {subtitle && (
                    <p className="text-sm text-[#4e220f] mt-0.5">{subtitle}</p>
                  )}{" "}
                </div>{" "}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-[#4e220f] hover:text-[#4e220f] hover:bg-white/60/60 :bg-white/60/60 transition-colors"
                  aria-label="Close modal"
                >
                  {" "}
                  <X className="w-5 h-5" />{" "}
                </button>{" "}
              </div>
            )}{" "}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/60/60 text-[#4e220f] hover:text-[#4e220f] :text-white transition-colors"
                aria-label="Close modal"
              >
                {" "}
                <X className="w-5 h-5" />{" "}
              </button>
            )}{" "}
            <div className="p-6">{children}</div>{" "}
          </motion.div>{" "}
        </div>
      )}{" "}
    </AnimatePresence>
  );
};

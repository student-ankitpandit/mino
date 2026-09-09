import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const isDanger = variant === "danger";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-slate-900 p-6 shadow-2xl animate-scale-in">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                isDanger
                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
              }`}
            >
              {isDanger ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-slate-400 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg transition disabled:opacity-50 ${
              isDanger
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                : "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
            }`}
          >
            {loading && (
              <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

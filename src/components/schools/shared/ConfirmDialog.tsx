





"use client";

import { ReactNode, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  X,
} from "lucide-react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  closeOnBackdrop?: boolean;
};

const variantStyles = {
  danger: {
    icon: AlertTriangle,
    iconWrapper: "bg-red-100 text-red-600",
    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconWrapper: "bg-amber-100 text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
  },
  info: {
    icon: Info,
    iconWrapper: "bg-blue-100 text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
};

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
  closeOnBackdrop = true,
}: ConfirmDialogProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (
          closeOnBackdrop &&
          event.target === event.currentTarget &&
          !isLoading
        ) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl bg-white p-6 shadow-2xl duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${styles.iconWrapper}`}
            >
              <Icon size={24} />
            </div>

            <div className="pt-1">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>

              <div
                id="confirm-dialog-description"
                className="mt-2 text-sm leading-6 text-gray-500"
              >
                {description}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${styles.button}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

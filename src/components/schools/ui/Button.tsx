





"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-sm",

  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-400",

  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-blue-500",

  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-sm",

  link:
    "bg-transparent text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-xs",
  md: "min-h-10 px-4 py-2 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
  icon: "size-10 p-0",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={[
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2
            size={16}
            className="shrink-0 animate-spin"
            aria-hidden="true"
          />
          {loadingText || children || "Loading..."}
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="inline-flex shrink-0 items-center">
              {leftIcon}
            </span>
          )}

          {children && (
            <span>{children}</span>
          )}

          {rightIcon && (
            <span className="inline-flex shrink-0 items-center">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}


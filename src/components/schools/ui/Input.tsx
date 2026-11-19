




"use client";

import { useState } from "react";
import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";

import {
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange"
  > {
  label?: string;
  description?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: InputSize;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  showPasswordToggle?: boolean;

  // Returns the input value as a string.
  onChange?: (value: string) => void;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 text-xs px-3",
  md: "h-11 text-sm px-3.5",
  lg: "h-12 text-base px-4",
};

export default function Input({
  label,
  description,
  error,
  helperText,
  leftIcon,
  rightIcon,
  inputSize = "md",
  fullWidth = true,
  containerClassName = "",
  labelClassName = "",
  showPasswordToggle = true,
  className = "",
  type = "text",
  id,
  name,
  required,
  disabled,
  onChange,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || name || `school-input-${type}`;

  const isPassword = type === "password";

  const resolvedType =
    isPassword && showPassword ? "text" : type;

  const showToggle = isPassword && showPasswordToggle;

  const resolvedRightIcon = showToggle ? (
    <button
      type="button"
      onClick={() =>
        setShowPassword((previous) => !previous)
      }
      disabled={disabled}
      aria-label={
        showPassword ? "Hide password" : "Show password"
      }
      aria-pressed={showPassword}
      className="rounded p-1 text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
    >
      {showPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  ) : rightIcon ? (
    <span className="inline-flex items-center text-slate-400">
      {rightIcon}
    </span>
  ) : null;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onChange?.(event.currentTarget.value);
  };

  return (
    <div
      className={[
        "space-y-1.5",
        fullWidth ? "w-full" : "",
        containerClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={[
            "block text-sm font-medium text-slate-700",
            labelClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}

          {required && (
            <span
              className="ml-1 text-red-500"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <p className="text-xs text-slate-500">
          {description}
        </p>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {leftIcon}
          </span>
        )}

        <input
          {...props}
          id={inputId}
          name={name}
          type={resolvedType}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          onChange={handleInputChange}
          className={[
            "w-full rounded-lg border bg-white text-slate-900",
            "placeholder:text-slate-400",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
            "read-only:cursor-default read-only:bg-slate-50",
            sizeStyles[inputSize],
            leftIcon ? "pl-10" : "",
            resolvedRightIcon || error ? "pr-10" : "",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-300 focus:border-blue-500",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {error ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-red-500">
            <AlertCircle size={17} />
          </span>
        ) : (
          resolvedRightIcon && (
            <span className="absolute inset-y-0 right-3 flex items-center">
              {resolvedRightIcon}
            </span>
          )
        )}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-600"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={`${inputId}-helper`}
          className="text-xs text-slate-500"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

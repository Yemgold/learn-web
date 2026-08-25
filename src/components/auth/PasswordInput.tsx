




"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  useState,
} from "react";

import { Eye, EyeOff, Lock } from "lucide-react";

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      label = "Password",
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] =
      useState(false);

    return (
      <div className="space-y-2">
        {/* Label */}

        {label && (
          <label className="block text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}

        {/* Input */}

        <div className="relative">
          {/* Left Icon */}

          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Lock size={20} />
          </div>

          <input
            ref={ref}
            type={
              showPassword ? "text" : "password"
            }
            className={`
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-white
              py-3.5
              pl-12
              pr-14
              text-slate-900
              outline-none
              transition-all
              duration-300
              placeholder:text-slate-400
              focus:border-blue-600
              focus:ring-4
              focus:ring-blue-100
              ${error ? "border-red-500 focus:ring-red-100" : ""}
              ${className}
            `}
            {...props}
          />

          {/* Toggle */}

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-500
              transition
              hover:text-blue-600
            "
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {/* Error */}

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
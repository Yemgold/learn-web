



"use client";

import * as React from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { inputVariants } from "./input.variants"; 
import type { InputProps } from "./types";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      wrapperClassName,
      labelClassName,

      label,
      helperText,
      error,
      success,

      leftIcon,
      rightIcon,

      prefix,
      suffix,

      loading = false,

      fullWidth = true,

      rounded,

      size,

      required,

      showCount,

      maxLength,

      type = "text",

      disabled,

      value,

      id,

      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";

    const inputType =
      isPassword && showPassword ? "text" : type;

    const characterCount =
      typeof value === "string" ? value.length : 0;

    return (
      <div
        className={cn(
          "flex flex-col gap-1.5",
          fullWidth && "w-full",
          containerClassName
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-foreground",
              labelClassName
            )}
          >
            {label}

            {required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}

        <div
          className={cn(
            inputVariants({
              size,
              rounded,
              error: !!error,
              success: !!success,
            }),
            wrapperClassName
          )}
        >
          {prefix && (
            <span className="mr-2 text-muted-foreground">
              {prefix}
            </span>
          )}

          {leftIcon && (
            <span className="mr-2 text-muted-foreground">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled || loading}
            maxLength={maxLength}
            value={value}
            className={cn(
              "flex-1 bg-transparent outline-none",
              "placeholder:text-muted-foreground",
              className
            )}
            {...props}
          />

          {loading && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          )}

          {!loading && isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              className="ml-2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {!loading && !isPassword && rightIcon && (
            <span className="ml-2 text-muted-foreground">
              {rightIcon}
            </span>
          )}

          {suffix && (
            <span className="ml-2 text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {error ? (
              <p className="text-xs text-red-600">
                {error}
              </p>
            ) : success ? (
              <p className="text-xs text-green-600">
                {success}
              </p>
            ) : helperText ? (
              <p className="text-xs text-muted-foreground">
                {helperText}
              </p>
            ) : null}
          </div>

          {showCount && maxLength && (
            <span className="text-xs text-muted-foreground">
              {characterCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
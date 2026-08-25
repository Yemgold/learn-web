

"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { switchVariants } from "./switch.variants";
import type { SwitchProps } from "./types";

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,

      label,
      description,
      helperText,
      error,
      success,

      loading = false,

      size = "md",
      fullWidth = true,

      disabled,

      id,

      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const state = error
      ? "error"
      : success
      ? "success"
      : "default";

    return (
      <div
        className={cn(
          "flex flex-col gap-1.5",
          fullWidth && "w-full",
          containerClassName
        )}
      >
        <label
          htmlFor={inputId}
          className={cn(
            "flex cursor-pointer items-start justify-between gap-4",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <div className="flex flex-col">
            {label && (
              <span
                className={cn(
                  "text-sm font-medium text-foreground",
                  labelClassName
                )}
              >
                {label}
              </span>
            )}

            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>

          <div className="relative inline-flex">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              disabled={disabled || loading}
              className="peer sr-only"
              {...props}
            />

            <div
              className={cn(
                switchVariants({
                  size,
                  state,
                }),
                className
              )}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-current" />
              ) : (
                <span
                  className={cn(
                    "absolute left-0.5 top-0.5 rounded-full bg-white shadow transition-transform",
                    size === "sm" && "h-4 w-4 peer-checked:translate-x-4",
                    size === "md" && "h-5 w-5 peer-checked:translate-x-5",
                    size === "lg" && "h-6 w-6 peer-checked:translate-x-6"
                  )}
                />
              )}
            </div>
          </div>
        </label>

        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : success ? (
          <p className="text-xs text-green-600">{success}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
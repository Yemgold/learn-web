



"use client";

import * as React from "react";
import { Circle, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { radioVariants } from "./radio.variants"; 
import type { RadioProps } from "./types";

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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

      size,
      fullWidth,
      disabled,

      id,

      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div
        className={cn(
          "flex flex-col gap-1",
          fullWidth && "w-full",
          containerClassName
        )}
      >
        <label
          htmlFor={inputId}
          className={cn(
            "flex cursor-pointer items-start gap-3",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <div className="relative">
            <input
              ref={ref}
              id={inputId}
              type="radio"
              disabled={disabled || loading}
              className="peer sr-only"
              {...props}
            />

            <div
              className={cn(
                radioVariants({
                  size,
                  error: !!error,
                  success: !!success,
                }),
                className
              )}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Circle className="h-2.5 w-2.5 fill-current opacity-0 transition-opacity peer-checked:opacity-100" />
              )}
            </div>
          </div>

          {(label || description) && (
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
          )}
        </label>

        {helperText && !error && !success && (
          <p className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

        {success && !error && (
          <p className="text-xs text-green-600">
            {success}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export { Radio };
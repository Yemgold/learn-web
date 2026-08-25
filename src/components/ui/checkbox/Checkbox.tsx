


"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { checkboxVariants } from "./checkbox.variants";
import type { CheckboxProps } from "./types";

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      containerClassName,
      label,
      description,
      helperText,
      error,
      success,
      loading = false,
      indeterminate = false,
      size,
      fullWidth,
      disabled,
      id,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const internalRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current!);

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

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
              ref={internalRef}
              id={inputId}
              type="checkbox"
              disabled={disabled || loading}
              className="peer sr-only"
              {...props}
            />

            <div
              className={cn(
                checkboxVariants({
                  size,
                  error: !!error,
                  success: !!success,
                }),
                className
              )}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 opacity-0 transition peer-checked:opacity-100" />
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

Checkbox.displayName = "Checkbox";

export { Checkbox };
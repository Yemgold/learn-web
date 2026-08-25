



"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  progressIndicatorVariants,
  progressVariants,
} from "./progress.variants";

import type { ProgressProps } from "./types";

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,

      value,
      max = 100,

      size = "md",
      variant = "default",

      rounded = true,
      animated = false,

      showValue = false,
      percentage = true,

      label,
      helperText,

      indicatorClassName,
      labelClassName,
      helperTextClassName,

      ...props
    },
    ref
  ) => {
    const safeMax = Math.max(max, 1);

    const clampedValue = Math.min(
      Math.max(value, 0),
      safeMax
    );

    const progress = (clampedValue / safeMax) * 100;

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {(label || showValue) && (
          <div className="mb-2 flex items-center justify-between gap-2">
            {label && (
              <span
                className={cn(
                  "text-sm font-medium text-slate-700",
                  labelClassName
                )}
              >
                {label}
              </span>
            )}

            {showValue && (
              <span className="text-sm text-slate-600">
                {percentage
                  ? `${Math.round(progress)}%`
                  : `${clampedValue}/${safeMax}`}
              </span>
            )}
          </div>
        )}

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={clampedValue}
          aria-label={
            typeof label === "string"
              ? label
              : "Progress"
          }
          className={cn(
            progressVariants({
              size,
              rounded,
            })
          )}
        >
          <div
            className={cn(
              progressIndicatorVariants({
                variant,
                animated,
              }),
              indicatorClassName
            )}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {helperText && (
          <p
            className={cn(
              "mt-2 text-sm text-slate-500",
              helperTextClassName
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
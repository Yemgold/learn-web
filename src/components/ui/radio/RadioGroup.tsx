


"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Radio } from "./Radio";
import type { RadioGroupProps } from "./types";

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      name,
      disabled = false,
      error,
      helperText,
      success,
      loading = false,
      size = "md",
      orientation = "vertical",
      fullWidth = true,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3",
          fullWidth && "w-full",
          className
        )}
      >
        {label && (
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
        )}

        <div
          role="radiogroup"
          className={cn(
            orientation === "horizontal"
              ? "flex flex-wrap gap-4"
              : "flex flex-col gap-3"
          )}
        >
          {options.map((option) => (
            <Radio
              key={option.value}
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              label={option.label}
              description={option.description}
              disabled={disabled || option.disabled}
              loading={loading}
              size={size}
              error={error}
              success={success}
              fullWidth={orientation === "vertical"}
            />
          ))}
        </div>

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

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
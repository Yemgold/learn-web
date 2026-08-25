


"use client";

import * as React from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { selectVariants } from "./select.variants";
import type { SelectProps } from "./types";

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      wrapperClassName,
      labelClassName,

      label,
      placeholder,

      helperText,
      error,
      success,

      options = [],
      groups,

      leftIcon,
      rightIcon,

      loading = false,

      fullWidth = true,
      rounded,
      size,

      required,

      disabled,

      id,

      children,

      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

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
            htmlFor={selectId}
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
  selectVariants({
    size,
    rounded,
    state: error
      ? "error"
      : success
      ? "success"
      : "default",
  }),
  wrapperClassName
)}
        >
          {leftIcon && (
            <span className="mr-2 text-muted-foreground">
              {leftIcon}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            disabled={disabled || loading}
            className={cn(
              "flex-1 appearance-none bg-transparent outline-none",
              "text-foreground",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {groups
              ? groups.map((group) => (
                  <optgroup
                    key={group.label}
                    label={group.label}
                  >
                    {group.options.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))
              : options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}

            {children}
          </select>

          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : rightIcon ? (
            <span className="ml-2 text-muted-foreground">
              {rightIcon}
            </span>
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          )}
        </div>

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
    );
  }
);

Select.displayName = "Select";

export { Select };





"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { textareaVariants } from "./textarea.variants";
import type { TextareaProps } from "./types";

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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

      loading = false,

      fullWidth = true,
      rounded = false,
      size = "md",

      required,

      showCount = false,
      maxLength,

      resizable = true,
      autoResize = false,

      disabled,

      value,

      id,

      onChange,

      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    const textareaRef =
      React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!);

    const state = error
      ? "error"
      : success
      ? "success"
      : "default";

    const handleChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }

      onChange?.(event);
    };

    const characterCount =
      typeof value === "string"
        ? value.length
        : typeof props.defaultValue === "string"
        ? props.defaultValue.length
        : 0;

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
            htmlFor={textareaId}
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
            textareaVariants({
              size,
              rounded,
              state,
            }),
            wrapperClassName
          )}
        >
          <textarea
            ref={textareaRef}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            disabled={disabled || loading}
            onChange={handleChange}
            className={cn(
              "min-h-[120px] w-full bg-transparent outline-none",
              "placeholder:text-muted-foreground",
              !resizable && "resize-none",
              className
            )}
            {...props}
          />

          {loading && (
            <div className="absolute right-3 top-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
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

Textarea.displayName = "Textarea";

export { Textarea };
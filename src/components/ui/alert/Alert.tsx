




"use client";

import * as React from "react";
import { X, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { alertVariants } from "./alert.variants";
import type { AlertProps } from "./types";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,

      containerClassName,
      titleClassName,
      contentClassName,

      title,
      children,

      variant = "default",
      size = "md",

      icon,

      dismissible = false,
      onClose,

      duration,

      loading = false,

      fullWidth = true,

      ...props
    },
    ref
  ) => {
    const [visible, setVisible] =
      React.useState(true);

    React.useEffect(() => {
      if (!duration) return;

      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const handleClose = () => {
      setVisible(false);
      onClose?.();
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({
            variant,
            size,
            fullWidth,
          }),
          containerClassName,
          className
        )}
        {...props}
      >
        {/* Icon */}
        {loading ? (
          <Loader2
            className="mt-0.5 h-5 w-5 animate-spin shrink-0"
          />
        ) : icon ? (
          <span className="mt-0.5 shrink-0">
            {icon}
          </span>
        ) : null}

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h5
              className={cn(
                "font-semibold",
                titleClassName
              )}
            >
              {title}
            </h5>
          )}

          {children && (
            <div
              className={cn(
                title && "mt-1",
                contentClassName
              )}
            >
              {children}
            </div>
          )}
        </div>

        {/* Close */}
        {dismissible && (
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              "rounded-md",
              "opacity-70",
              "transition-opacity",
              "hover:opacity-100",
              "focus:outline-none"
            )}
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert };
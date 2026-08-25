




"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import type {
  EmptyStateAction,
  EmptyStateProps,
} from "./types";

function EmptyStateButton({
  label,
  icon,
  loading,
  variant = "default",
  className,
  disabled,
  ...props
}: EmptyStateAction) {
  return (
    <Button
      variant={variant}
      loading={loading}
      disabled={disabled || loading}
      leftIcon={!loading ? icon : undefined}
      className={className}
      {...props}
    >
      {label}
    </Button>
  );
}

const EmptyState = React.forwardRef<
  HTMLDivElement,
  EmptyStateProps
>(
  (
    {
      className,

      illustration,
      title,
      description,

      primaryAction,
      secondaryAction,

      size = "md",
      align = "center",

      fullWidth = true,
      loading = false,

      illustrationClassName,
      titleClassName,
      descriptionClassName,
      actionsClassName,

      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: {
        container: "py-8 gap-3",
        illustration: "text-4xl",
        title: "text-lg",
        description: "text-sm",
      },

      md: {
        container: "py-12 gap-4",
        illustration: "text-5xl",
        title: "text-xl",
        description: "text-sm",
      },

      lg: {
        container: "py-16 gap-5",
        illustration: "text-6xl",
        title: "text-2xl",
        description: "text-base",
      },
    };

    const styles = sizeStyles[size];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center",
          styles.container,

          align === "left" &&
            "items-start text-left",

          align === "center" &&
            "text-center",

          fullWidth && "w-full",

          className
        )}
        {...props}
      >
        {/* Illustration */}
        <div
          className={cn(
            "flex items-center justify-center text-muted-foreground",
            styles.illustration,
            illustrationClassName
          )}
        >
          {loading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : (
            illustration
          )}
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-semibold tracking-tight",
            styles.title,
            titleClassName
          )}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            className={cn(
              "max-w-md text-muted-foreground",
              styles.description,
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div
            className={cn(
              "mt-2 flex flex-wrap items-center gap-3",
              actionsClassName
            )}
          >
            {primaryAction && (
              <EmptyStateButton
                {...primaryAction}
              />
            )}

            {secondaryAction && (
              <EmptyStateButton
                {...secondaryAction}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
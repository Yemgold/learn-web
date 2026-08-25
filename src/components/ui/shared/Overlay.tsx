




"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface OverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the overlay is visible.
   */
  open?: boolean;

  /**
   * Called when the overlay is clicked.
   */
  onOverlayClick?: (
    event: React.MouseEvent<HTMLDivElement>
  ) => void;

  /**
   * Blur the background.
   */
  blur?: boolean;

  /**
   * Close interaction.
   */
  dismissible?: boolean;

  /**
   * Overlay color intensity.
   */
  opacity?: "light" | "medium" | "dark";

  /**
   * Fade animation.
   */
  animated?: boolean;
}

export const Overlay = React.forwardRef<
  HTMLDivElement,
  OverlayProps
>(
  (
    {
      className,
      open = true,
      blur = true,
      dismissible = true,
      opacity = "medium",
      animated = true,
      onOverlayClick,
      onClick,
      ...props
    },
    ref
  ) => {
    if (!open) {
      return null;
    }

    const opacityClass = {
      light: "bg-black/30",
      medium: "bg-black/50",
      dark: "bg-black/70",
    }[opacity];

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-50",
          opacityClass,
          blur && "backdrop-blur-sm",
          animated && [
            "animate-in",
            "fade-in-0",
            "duration-200",
          ],
          className
        )}
        onClick={(event) => {
          onClick?.(event);

          if (dismissible) {
            onOverlayClick?.(event);
          }
        }}
        {...props}
      />
    );
  }
);

Overlay.displayName = "Overlay";
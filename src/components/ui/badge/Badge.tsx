





"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { badgeVariants } from "./badge.variants";
import type { BadgeProps } from "./types";


const Badge = React.forwardRef<
  HTMLDivElement,
  BadgeProps
>(
  (
    {
      className,

      containerClassName,

      children,

      variant = "default",
      size = "md",

      icon,
      iconPosition = "left",

      rounded = true,

      loading = false,

      fullWidth = false,

      ...props
    },

    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({
            variant,
            size,
            rounded,
            loading,
            fullWidth,
          }),

          containerClassName,
          className
        )}
        {...props}
      >

        {loading ? (
          <Loader2
            className="h-3.5 w-3.5 animate-spin"
          />
        ) : (
          iconPosition === "left" && icon
        )}


        <span>
          {children}
        </span>


        {!loading &&
          iconPosition === "right" &&
          icon}

      </div>
    );
  }
);


Badge.displayName = "Badge";


export { Badge };






"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { cardVariants } from "./card.variants";

import type { CardProps } from "./types";


const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(
  (
    {
      className,

      children,

      header,
      footer,
      image,

      variant = "default",
      size = "md",

      clickable = false,
      hoverable = false,

      loading = false,

      noPadding = false,

      rounded = "lg",

      headerClassName,
      contentClassName,
      footerClassName,
      imageClassName,

      ...props
    },

    ref
  ) => {

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            size,

            clickable,
            hoverable,

            loading,

            noPadding,

            rounded,
          }),

          className
        )}
        {...props}
      >

        {/* Image */}
        {image && (
          <div
            className={cn(
              "overflow-hidden",
              imageClassName
            )}
          >
            {image}
          </div>
        )}


        {/* Header */}
        {header && (
          <div
            className={cn(
              "border-b border-slate-200",
              "font-semibold",

              !noPadding &&
                "px-5 py-4",

              headerClassName
            )}
          >
            {header}
          </div>
        )}


        {/* Content */}
        <div
          className={cn(
            !noPadding &&
              !header &&
              !footer &&
              "p-5",

            contentClassName
          )}
        >
          {loading ? (
            <div className="space-y-3">

              <div className="h-4 w-3/4 rounded bg-muted" />

              <div className="h-4 w-full rounded bg-muted" />

              <div className="h-4 w-1/2 rounded bg-muted" />

            </div>
          ) : (
            children
          )}
        </div>


        {/* Footer */}
        {footer && (
          <div
            className={cn(
              "border-t border-slate-200",

              !noPadding &&
                "px-5 py-4",

              footerClassName
            )}
          >
            {footer}
          </div>
        )}

      </div>
    );
  }
);


Card.displayName = "Card";


export { Card };
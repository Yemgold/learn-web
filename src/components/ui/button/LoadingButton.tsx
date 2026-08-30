


"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { Button } from "./Button";

export interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText = "Loading...",
  children,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={loading || disabled}
      className={`group relative flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 ${className}`}
    >
      {loading ? (
        <>
          {/* Subtle loading glow */}
          <span
            className="absolute inset-0 animate-pulse bg-white/5"
            aria-hidden="true"
          />

          {/* Spinner */}
          <span
            className="relative h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white"
            aria-hidden="true"
          />

          {/* Loading text */}
          <span className="relative font-semibold">
            {loadingText}
          </span>

          {/* Animated dots */}
          <span
            className="relative flex w-5 items-center gap-0.5"
            aria-hidden="true"
          >
            <span className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />

            <span className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />

            <span className="h-1 w-1 animate-bounce rounded-full bg-white" />
          </span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}

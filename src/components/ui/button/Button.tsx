



"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button.variants";
import type { ButtonProps } from "./types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      rounded,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            rounded,
          }),
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}

        {children}

        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
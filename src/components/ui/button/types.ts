


import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "./button.variants";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Shows a loading spinner and disables the button.
   */
  loading?: boolean;

  /**
   * Icon displayed before the button text.
   */
  leftIcon?: ReactNode;

  /**
   * Icon displayed after the button text.
   */
  rightIcon?: ReactNode;

  /**
   * Makes the button span the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * Makes the button pill-shaped.
   */
  rounded?: boolean;
}
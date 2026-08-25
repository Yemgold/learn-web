




import { cva } from "class-variance-authority";

/**
 * Progress track (background)
 */
export const progressVariants = cva(
  [
    "relative",
    "w-full",
    "overflow-hidden",
    "bg-slate-200",
  ],
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-4",
      },

      rounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
    },

    defaultVariants: {
      size: "md",
      rounded: true,
    },
  }
);

/**
 * Progress indicator (filled bar)
 */
export const progressIndicatorVariants = cva(
  [
    "h-full",
    "transition-all",
    "duration-300",
    "ease-in-out",
  ],
  {
    variants: {
      variant: {
        default: "bg-blue-600",

        success: "bg-green-600",

        warning: "bg-yellow-500",

        destructive: "bg-red-600",

        info: "bg-cyan-600",
      },

      animated: {
        true: "animate-pulse",

        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      animated: false,
    },
  }
);
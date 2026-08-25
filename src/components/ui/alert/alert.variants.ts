



import { cva } from "class-variance-authority";

export const alertVariants = cva(
  [
    "relative",
    "flex",
    "w-full",
    "items-start",
    "gap-3",
    "rounded-lg",
    "border",
    "transition-all",
    "duration-200",

    // Text
    "text-sm",

    // Accessibility
    "outline-none",
  ],
  {
    variants: {
      variant: {
        default:
          "border-slate-300 bg-slate-50 text-slate-900",

        success:
          "border-green-200 bg-green-50 text-green-800",

        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-800",

        destructive:
          "border-red-200 bg-red-50 text-red-800",

        info:
          "border-blue-200 bg-blue-50 text-blue-800",
      },

      size: {
        sm:
          "px-3 py-2 text-xs",

        md:
          "px-4 py-3 text-sm",

        lg:
          "px-5 py-4 text-base",
      },

      fullWidth: {
        true: "w-full",

        false: "w-fit",
      },
    },

    defaultVariants: {
      variant: "default",

      size: "md",

      fullWidth: true,
    },
  }
);
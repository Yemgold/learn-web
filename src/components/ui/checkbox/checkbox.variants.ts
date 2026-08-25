



import { cva } from "class-variance-authority";

export const checkboxVariants = cva(
  [
    "flex items-center justify-center",
    "border",
    "transition-all duration-200",
    "shrink-0",
    "rounded",
    "bg-background",
    "text-white",
    "border-slate-300",
    "peer-focus-visible:ring-2",
    "peer-focus-visible:ring-blue-500",
    "peer-focus-visible:ring-offset-2",
    "peer-disabled:cursor-not-allowed",
    "peer-disabled:opacity-50",
    "peer-checked:bg-blue-600",
    "peer-checked:border-blue-600",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },

      error: {
        true: "border-red-500 peer-focus-visible:ring-red-500",
        false: "",
      },

      success: {
        true: "border-green-500 peer-focus-visible:ring-green-500",
        false: "",
      },
    },

    defaultVariants: {
      size: "md",
      error: false,
      success: false,
    },
  }
);
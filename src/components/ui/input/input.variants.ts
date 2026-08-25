



import { cva } from "class-variance-authority";

export const inputVariants = cva(
  [
    "flex items-center",
    "w-full",
    "border",
    "bg-background",
    "text-foreground",
    "transition-all duration-200",
    "outline-none",
    "focus-within:ring-2",
    "focus-within:ring-blue-500",
    "focus-within:border-blue-500",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-12 px-5 text-base rounded-xl",
      },

      rounded: {
        true: "rounded-full",
        false: "",
      },

      error: {
        true: "border-red-500 focus-within:ring-red-500 focus-within:border-red-500",
        false: "border-slate-300",
      },

      success: {
        true: "border-green-500 focus-within:ring-green-500 focus-within:border-green-500",
        false: "",
      },
    },

    compoundVariants: [
      {
        error: true,
        success: true,
        className: "border-red-500",
      },
    ],

    defaultVariants: {
      size: "md",
      rounded: false,
      error: false,
      success: false,
    },
  }
);
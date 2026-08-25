




import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  [
    "relative",
    "flex",
    "w-full",
    "border",
    "bg-background",
    "text-foreground",
    "transition-all",
    "duration-200",
    "outline-none",

    // Focus
    "focus-within:ring-2",
    "focus-within:ring-primary",
    "focus-within:border-primary",

    // Disabled
    "has-[:disabled]:cursor-not-allowed",
    "has-[:disabled]:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "min-h-[90px] px-3 py-2 text-sm rounded-md",

        md: "min-h-[120px] px-4 py-3 text-sm rounded-lg",

        lg: "min-h-[160px] px-5 py-4 text-base rounded-xl",
      },

      rounded: {
        true: "rounded-full",

        false: "",
      },

      state: {
        default:
          "border-slate-300",

        error:
          "border-red-500 focus-within:border-red-500 focus-within:ring-red-500",

        success:
          "border-green-500 focus-within:border-green-500 focus-within:ring-green-500",
      },
    },

    defaultVariants: {
      size: "md",

      rounded: false,

      state: "default",
    },
  }
);
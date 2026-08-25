




import { cva } from "class-variance-authority";

export const switchVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center",
    "rounded-full",
    "transition-all duration-200 ease-in-out",
    "border-2 border-transparent",

    // Focus
    "peer-focus-visible:ring-2",
    "peer-focus-visible:ring-primary",
    "peer-focus-visible:ring-offset-2",

    // Disabled
    "peer-disabled:cursor-not-allowed",
    "peer-disabled:opacity-50",

    // Checked
    "peer-checked:bg-primary",

    // Unchecked
    "bg-slate-300",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },

      state: {
        default: "",

        error:
          "ring-red-500 peer-focus-visible:ring-red-500",

        success:
          "ring-green-500 peer-focus-visible:ring-green-500",
      },
    },

    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);
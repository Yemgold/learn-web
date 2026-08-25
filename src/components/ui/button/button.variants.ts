



import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "gap-2",
    "whitespace-nowrap",
    "font-medium",
    "transition-all duration-200",
    "outline-none",
    "select-none",
    "cursor-pointer",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",

        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",

        outline:
          "border border-slate-300 bg-transparent hover:bg-slate-100",

        ghost:
          "bg-transparent hover:bg-slate-100",

        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",

        success:
          "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",

        warning:
          "bg-yellow-500 text-black hover:bg-yellow-600 focus-visible:ring-yellow-500",

        link:
          "bg-transparent underline-offset-4 hover:underline p-0 h-auto",
      },

      size: {
        xs: "h-8 px-2 text-xs rounded-md",

        sm: "h-9 px-3 text-sm rounded-md",

        md: "h-10 px-4 text-sm rounded-lg",

        lg: "h-11 px-6 text-base rounded-lg",

        xl: "h-12 px-8 text-lg rounded-xl",

        icon: "h-10 w-10 p-0 rounded-lg",
      },

      fullWidth: {
        true: "w-full",
        false: "",
      },

      rounded: {
        true: "rounded-full",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
      rounded: false,
    },
  }
);



import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-1.5",
    "font-medium",
    "whitespace-nowrap",
    "transition-all",
    "duration-200",
    "select-none",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white",

        secondary:
          "bg-slate-100 text-slate-900",

        success:
          "bg-green-100 text-green-700",

        warning:
          "bg-yellow-100 text-yellow-700",

        destructive:
          "bg-red-100 text-red-700",

        info:
          "bg-blue-100 text-blue-700",

        outline:
          "border border-slate-300 bg-transparent text-slate-700",
      },

      size: {
        sm:
          "h-5 px-2 text-xs",

        md:
          "h-6 px-2.5 text-sm",

        lg:
          "h-8 px-3 text-base",
      },

      rounded: {
        true:
          "rounded-full",

        false:
          "rounded-md",
      },

      loading: {
        true:
          "opacity-70",

        false:
          "",
      },

      fullWidth: {
        true:
          "w-full",

        false:
          "",
      },
    },

    defaultVariants: {
      variant: "default",

      size: "md",

      rounded: true,

      loading: false,

      fullWidth: false,
    },
  }
);
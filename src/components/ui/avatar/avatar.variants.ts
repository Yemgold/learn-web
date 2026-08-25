





import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  [
    "relative",
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "overflow-hidden",
    "bg-muted",
    "text-muted-foreground",
    "font-medium",
    "select-none",
  ],
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",

        sm: "h-8 w-8 text-sm",

        md: "h-10 w-10 text-base",

        lg: "h-12 w-12 text-lg",

        xl: "h-16 w-16 text-xl",
      },

      rounded: {
        default: "rounded-lg",

        square: "rounded-none",

        full: "rounded-full",
      },

      status: {
        online: "",

        offline: "",

        busy: "",

        away: "",
      },

      loading: {
        true: "animate-pulse bg-muted",

        false: "",
      },
    },

    defaultVariants: {
      size: "md",

      rounded: "full",

      loading: false,
    },
  }
);


export const avatarStatusVariants = cva(
  [
    "absolute",
    "bottom-0",
    "right-0",
    "block",
    "rounded-full",
    "border-2",
    "border-background",
  ],
  {
    variants: {
      status: {
        online:
          "bg-green-500",

        offline:
          "bg-slate-400",

        busy:
          "bg-red-500",

        away:
          "bg-yellow-500",
      },

      size: {
        xs:
          "h-1.5 w-1.5",

        sm:
          "h-2 w-2",

        md:
          "h-2.5 w-2.5",

        lg:
          "h-3 w-3",

        xl:
          "h-3.5 w-3.5",
      },
    },

    defaultVariants: {
      status: "offline",

      size: "md",
    },
  }
);
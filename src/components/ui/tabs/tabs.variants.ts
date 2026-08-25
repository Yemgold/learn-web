




import { cva } from "class-variance-authority";

/**
 * Tabs root
 */
export const tabsVariants = cva([
  "flex",
], {
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row gap-6",
    },
  },

  defaultVariants: {
    orientation: "horizontal",
  },
});

/**
 * Tabs list
 */
export const tabsListVariants = cva(
  [
    "inline-flex",
    "items-center",
    "gap-1",
  ],
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col items-stretch",
      },

      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },

      variant: {
        default: [
          "rounded-lg",
          "bg-slate-100",
          "p-1",
        ],

        pills: [
          "gap-2",
        ],

        underline: [
          "border-b",
          "border-slate-200",
          "gap-0",
        ],
      },
    },

    defaultVariants: {
      orientation: "horizontal",
      fullWidth: false,
      variant: "default",
    },
  }
);

/**
 * Individual trigger
 */
export const tabTriggerVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "whitespace-nowrap",
    "font-medium",
    "transition-all",
    "duration-200",
    "outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-500",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-xs",

        md: "h-10 px-4 text-sm",

        lg: "h-12 px-5 text-base",
      },

      fullWidth: {
        true: "flex-1",
        false: "",
      },

      variant: {
        default: "",

        pills: "rounded-full",

        underline: "rounded-none border-b-2 border-transparent",
      },

      active: {
        true: "",

        false: "",
      },
    },

    compoundVariants: [
      {
        variant: "default",
        active: true,
        class:
          "rounded-md bg-white shadow-sm text-slate-900",
      },

      {
        variant: "default",
        active: false,
        class:
          "text-slate-600 hover:text-slate-900",
      },

      {
        variant: "pills",
        active: true,
        class:
          "bg-blue-600 text-white",
      },

      {
        variant: "pills",
        active: false,
        class:
          "hover:bg-slate-100 text-slate-700",
      },

      {
        variant: "underline",
        active: true,
        class:
          "border-blue-600 text-blue-600",
      },

      {
        variant: "underline",
        active: false,
        class:
          "hover:text-slate-900 text-slate-600",
      },
    ],

    defaultVariants: {
      size: "md",
      fullWidth: false,
      variant: "default",
      active: false,
    },
  }
);

/**
 * Content panel
 */
export const tabsContentVariants = cva(
  [
    "outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-500",
    "focus-visible:ring-offset-2",
  ],
  {
    variants: {
      orientation: {
        horizontal: "mt-4",

        vertical: "flex-1",
      },
    },

    defaultVariants: {
      orientation: "horizontal",
    },
  }
);
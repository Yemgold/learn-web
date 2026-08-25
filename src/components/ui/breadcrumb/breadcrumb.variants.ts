


import { cva } from "class-variance-authority";

/**
 * Breadcrumb container
 */
export const breadcrumbVariants = cva([
  "flex",
  "items-center",
  "flex-wrap",
  "gap-1",
  "text-sm",
  "text-slate-600",
]);

/**
 * Breadcrumb item
 */
export const breadcrumbItemVariants = cva(
  [
    "inline-flex",
    "items-center",
    "gap-1.5",
    "transition-colors",
    "duration-200",
    "rounded-md",
    "outline-none",
  ],
  {
    variants: {
      current: {
        true: [
          "font-semibold",
          "text-slate-900",
          "cursor-default",
        ],

        false: [
          "text-slate-600",
          "hover:text-blue-600",
        ],
      },

      disabled: {
        true: [
          "pointer-events-none",
          "opacity-50",
        ],

        false: "",
      },
    },

    defaultVariants: {
      current: false,
      disabled: false,
    },
  }
);

/**
 * Separator
 */
export const breadcrumbSeparatorVariants = cva([
  "mx-1",
  "select-none",
  "text-slate-400",
  "flex",
  "items-center",
]);
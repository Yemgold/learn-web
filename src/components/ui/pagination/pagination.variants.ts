



import { cva } from "class-variance-authority";

/**
 * Pagination container
 */
export const paginationVariants = cva([
  "flex",
  "flex-wrap",
  "items-center",
  "justify-center",
  "gap-2",
]);

/**
 * Pagination button
 */
export const paginationButtonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "font-medium",
    "transition-all",
    "duration-200",
    "outline-none",
    "select-none",
    "border",
    "border-slate-200",
    "bg-white",
    "text-slate-700",
    "hover:bg-slate-100",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-500",
    "focus-visible:ring-offset-2",
  ],
  {
    variants: {
      size: {
        sm: "h-8 min-w-8 px-2 text-xs",
        md: "h-10 min-w-10 px-3 text-sm",
        lg: "h-12 min-w-12 px-4 text-base",
      },

      active: {
        true: [
          "border-blue-600",
          "bg-blue-600",
          "text-white",
          "hover:bg-blue-700",
        ],
        false: "",
      },

      disabled: {
        true: [
          "pointer-events-none",
          "opacity-50",
        ],
        false: "",
      },

      rounded: {
        true: "rounded-full",
        false: "rounded-lg",
      },
    },

    defaultVariants: {
      size: "md",
      active: false,
      disabled: false,
      rounded: false,
    },
  }
);

/**
 * Ellipsis
 */
export const paginationEllipsisVariants = cva([
  "inline-flex",
  "items-center",
  "justify-center",
  "px-2",
  "text-slate-500",
  "select-none",
]);

/**
 * Page info
 */
export const paginationInfoVariants = cva([
  "text-sm",
  "text-slate-600",
]);
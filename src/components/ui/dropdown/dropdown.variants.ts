


import { cva } from "class-variance-authority";

/**
 * Dropdown container
 */
export const dropdownVariants = cva([
  "relative",
  "inline-block",
]);

/**
 * Dropdown menu
 */
export const dropdownMenuVariants = cva(
  [
    "absolute",
    "z-50",
    "min-w-[12rem]",
    "overflow-hidden",
    "rounded-lg",
    "border",
    "border-slate-200",
    "bg-white",
    "shadow-lg",
    "animate-in",
    "fade-in-0",
    "zoom-in-95",
    "duration-150",
  ],
  {
    variants: {
      placement: {
        "bottom-start": "top-full left-0 mt-2 origin-top-left",

        "bottom-end": "top-full right-0 mt-2 origin-top-right",

        "top-start": "bottom-full left-0 mb-2 origin-bottom-left",

        "top-end": "bottom-full right-0 mb-2 origin-bottom-right",
      },

      fullWidth: {
        true: "w-full",
        false: "",
      },
    },

    defaultVariants: {
      placement: "bottom-start",
      fullWidth: false,
    },
  }
);

/**
 * Dropdown menu item
 */
export const dropdownItemVariants = cva(
  [
    "flex",
    "w-full",
    "items-center",
    "justify-between",
    "gap-3",
    "px-4",
    "py-2.5",
    "text-sm",
    "transition-colors",
    "duration-150",
    "outline-none",
    "select-none",
  ],
  {
    variants: {
      destructive: {
        true: [
          "text-red-600",
          "hover:bg-red-50",
          "focus:bg-red-50",
        ],

        false: [
          "text-slate-700",
          "hover:bg-slate-100",
          "focus:bg-slate-100",
        ],
      },

      disabled: {
        true: [
          "pointer-events-none",
          "opacity-50",
        ],

        false: "cursor-pointer",
      },
    },

    defaultVariants: {
      destructive: false,
      disabled: false,
    },
  }
);

/**
 * Divider
 */
export const dropdownDividerVariants = cva([
  "my-1",
  "border-t",
  "border-slate-200",
]);

/**
 * Optional arrow
 */
export const dropdownArrowVariants = cva([
  "absolute",
  "h-3",
  "w-3",
  "rotate-45",
  "border-l",
  "border-t",
  "border-slate-200",
  "bg-white",
]);
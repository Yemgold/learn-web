





import { cva } from "class-variance-authority";

/**
 * Overlay
 */
export const dialogOverlayVariants = cva([
  "fixed",
  "inset-0",
  "z-50",
  "bg-black/50",
  "backdrop-blur-sm",
  "animate-in",
  "fade-in-0",
  "duration-200",
]);

/**
 * Wrapper
 */
export const dialogWrapperVariants = cva([
  "fixed",
  "inset-0",
  "z-50",
  "flex",
  "items-center",
  "justify-center",
  "p-4",
]);

/**
 * Content
 */
export const dialogContentVariants = cva(
  [
    "relative",
    "w-full",
    "overflow-hidden",
    "rounded-xl",
    "border",
    "border-slate-200",
    "bg-white",
    "shadow-2xl",
    "outline-none",
    "animate-in",
    "fade-in-0",
    "zoom-in-95",
    "duration-200",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",

        md: "max-w-lg",

        lg: "max-w-2xl",

        xl: "max-w-4xl",

        full: [
          "max-w-none",
          "w-[calc(100vw-2rem)]",
          "h-[calc(100vh-2rem)]",
          "rounded-2xl",
        ],
      },
    },

    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Header
 */
export const dialogHeaderVariants = cva([
  "flex",
  "items-start",
  "justify-between",
  "gap-4",
  "border-b",
  "border-slate-200",
  "px-6",
  "py-5",
]);

/**
 * Icon
 */
export const dialogIconVariants = cva([
  "flex",
  "h-10",
  "w-10",
  "items-center",
  "justify-center",
  "rounded-full",
  "bg-slate-100",
  "text-slate-700",
]);

/**
 * Title
 */
export const dialogTitleVariants = cva([
  "text-lg",
  "font-semibold",
  "leading-none",
  "tracking-tight",
  "text-slate-900",
]);

/**
 * Description
 */
export const dialogDescriptionVariants = cva([
  "mt-2",
  "text-sm",
  "leading-6",
  "text-slate-600",
]);

/**
 * Body
 */
export const dialogBodyVariants = cva([
  "px-6",
  "py-5",
]);

/**
 * Footer
 */
export const dialogFooterVariants = cva(
  [
    "flex",
    "gap-3",
    "border-t",
    "border-slate-200",
    "px-6",
    "py-5",
  ],
  {
    variants: {
      centered: {
        true: "justify-center",

        false: "justify-end",
      },

      stacked: {
        true: "flex-col",

        false: "flex-row",
      },
    },

    defaultVariants: {
      centered: false,
      stacked: false,
    },
  }
);

/**
 * Close button
 */
export const dialogCloseButtonVariants = cva([
  "inline-flex",
  "h-9",
  "w-9",
  "items-center",
  "justify-center",
  "rounded-md",
  "text-slate-500",
  "transition-colors",
  "duration-200",
  "hover:bg-slate-100",
  "hover:text-slate-900",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-blue-500",
  "focus-visible:ring-offset-2",
  "disabled:pointer-events-none",
  "disabled:opacity-50",
]);
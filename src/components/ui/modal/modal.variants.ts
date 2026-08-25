


import { cva } from "class-variance-authority";


/**
 * Modal overlay
 */
export const modalOverlayVariants = cva(
  [
    "fixed",
    "inset-0",
    "z-50",

    "bg-black/50",

    "backdrop-blur-sm",

    "animate-in",
    "fade-in-0",

    "duration-200",
  ]
);



/**
 * Modal wrapper
 */
export const modalWrapperVariants = cva(
  [
    "fixed",
    "inset-0",

    "z-50",

    "flex",

    "items-center",
    "justify-center",

    "p-4",

    "overflow-y-auto",
  ]
);



/**
 * Modal content
 */
export const modalContentVariants = cva(
  [
    "relative",

    "w-full",

    "rounded-2xl",

    "bg-white",

    "shadow-2xl",

    "border",

    "border-slate-200",

    "animate-in",

    "fade-in-0",

    "zoom-in-95",

    "duration-200",

    "ease-out",
  ],
  {
    variants: {

      size: {

        sm: [
          "max-w-sm",
        ],


        md: [
          "max-w-md",
        ],


        lg: [
          "max-w-lg",
        ],


        xl: [
          "max-w-xl",
        ],


        full: [
          "max-w-full",

          "min-h-[90vh]",
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
export const modalHeaderVariants = cva(
  [
    "flex",

    "items-start",

    "justify-between",

    "gap-4",

    "px-6",

    "pt-6",
  ]
);



/**
 * Title
 */
export const modalTitleVariants = cva(
  [
    "text-lg",

    "font-semibold",

    "text-slate-900",
  ]
);



/**
 * Description
 */
export const modalDescriptionVariants = cva(
  [
    "mt-1",

    "text-sm",

    "text-slate-500",
  ]
);



/**
 * Body
 */
export const modalBodyVariants = cva(
  [
    "px-6",

    "py-5",
  ]
);



/**
 * Footer
 */
export const modalFooterVariants = cva(
  [
    "flex",

    "items-center",

    "justify-end",

    "gap-3",

    "border-t",

    "border-slate-200",

    "px-6",

    "py-4",
  ]
);



/**
 * Close button
 */
export const modalCloseButtonVariants = cva(
  [
    "inline-flex",

    "items-center",

    "justify-center",

    "rounded-lg",

    "p-2",

    "text-slate-500",

    "transition",

    "hover:bg-slate-100",

    "hover:text-slate-900",

    "focus:outline-none",

    "focus:ring-2",

    "focus:ring-slate-400",
  ]
);



/**
 * Icon wrapper
 */
export const modalIconVariants = cva(
  [
    "mb-3",

    "flex",

    "h-10",

    "w-10",

    "items-center",

    "justify-center",

    "rounded-full",

    "bg-slate-100",

    "text-slate-700",
  ]
);



import { cva } from "class-variance-authority";

/**
 * Drawer wrapper
 */
export const drawerWrapperVariants = cva([
  "fixed",
  "inset-0",
  "z-50",
  "pointer-events-none",
]);

/**
 * Drawer panel
 */
export const drawerContentVariants = cva(
  [
    "pointer-events-auto",
    "fixed",
    "bg-white",
    "shadow-2xl",
    "border-slate-200",
    "outline-none",
    "flex",
    "flex-col",
    "overflow-hidden",
    "transition-transform",
    "duration-300",
    "ease-in-out",
  ],
  {
    variants: {
      placement: {
        left: [
          "left-0",
          "top-0",
          "h-full",
          "border-r",
        ],

        right: [
          "right-0",
          "top-0",
          "h-full",
          "border-l",
        ],

        top: [
          "top-0",
          "left-0",
          "w-full",
          "border-b",
        ],

        bottom: [
          "bottom-0",
          "left-0",
          "w-full",
          "border-t",
        ],
      },

      size: {
        xs: "",

        sm: "",

        md: "",

        lg: "",

        xl: "",

        full: "",
      },
    },

    compoundVariants: [
      // LEFT
      {
        placement: "left",
        size: "xs",
        class: "w-64",
      },
      {
        placement: "left",
        size: "sm",
        class: "w-80",
      },
      {
        placement: "left",
        size: "md",
        class: "w-96",
      },
      {
        placement: "left",
        size: "lg",
        class: "w-[32rem]",
      },
      {
        placement: "left",
        size: "xl",
        class: "w-[40rem]",
      },
      {
        placement: "left",
        size: "full",
        class: "w-screen",
      },

      // RIGHT
      {
        placement: "right",
        size: "xs",
        class: "w-64",
      },
      {
        placement: "right",
        size: "sm",
        class: "w-80",
      },
      {
        placement: "right",
        size: "md",
        class: "w-96",
      },
      {
        placement: "right",
        size: "lg",
        class: "w-[32rem]",
      },
      {
        placement: "right",
        size: "xl",
        class: "w-[40rem]",
      },
      {
        placement: "right",
        size: "full",
        class: "w-screen",
      },

      // TOP
      {
        placement: "top",
        size: "xs",
        class: "h-40",
      },
      {
        placement: "top",
        size: "sm",
        class: "h-64",
      },
      {
        placement: "top",
        size: "md",
        class: "h-80",
      },
      {
        placement: "top",
        size: "lg",
        class: "h-[28rem]",
      },
      {
        placement: "top",
        size: "xl",
        class: "h-[36rem]",
      },
      {
        placement: "top",
        size: "full",
        class: "h-screen",
      },

      // BOTTOM
      {
        placement: "bottom",
        size: "xs",
        class: "h-40",
      },
      {
        placement: "bottom",
        size: "sm",
        class: "h-64",
      },
      {
        placement: "bottom",
        size: "md",
        class: "h-80",
      },
      {
        placement: "bottom",
        size: "lg",
        class: "h-[28rem]",
      },
      {
        placement: "bottom",
        size: "xl",
        class: "h-[36rem]",
      },
      {
        placement: "bottom",
        size: "full",
        class: "h-screen",
      },
    ],

    defaultVariants: {
      placement: "right",
      size: "md",
    },
  }
);

/**
 * Header
 */
export const drawerHeaderVariants = cva([
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
export const drawerIconVariants = cva([
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
export const drawerTitleVariants = cva([
  "text-lg",
  "font-semibold",
  "leading-none",
  "tracking-tight",
  "text-slate-900",
]);

/**
 * Description
 */
export const drawerDescriptionVariants = cva([
  "mt-2",
  "text-sm",
  "leading-6",
  "text-slate-600",
]);

/**
 * Body
 */
export const drawerBodyVariants = cva([
  "flex-1",
  "overflow-y-auto",
  "px-6",
  "py-5",
]);

/**
 * Footer
 */
export const drawerFooterVariants = cva(
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
export const drawerCloseButtonVariants = cva([
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
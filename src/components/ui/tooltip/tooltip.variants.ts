



import { cva } from "class-variance-authority";



/**
 * Tooltip wrapper
 */
export const tooltipWrapperVariants = cva(
  [
    "relative",
    "inline-flex",
  ]
);




/**
 * Tooltip trigger
 */
export const tooltipTriggerVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
  ]
);




/**
 * Tooltip content
 */
export const tooltipContentVariants = cva(
  [
    "z-50",

    "rounded-lg",

    "bg-slate-900",

    "px-3",

    "py-1.5",

    "text-sm",

    "font-medium",

    "text-white",

    "shadow-lg",

    "pointer-events-none",

    "animate-in",

    "fade-in-0",

    "zoom-in-95",

    "duration-150",

    "ease-out",
  ],

  {
    variants: {


      placement: {


        top: [
          "slide-in-from-bottom-2",
        ],


        bottom: [
          "slide-in-from-top-2",
        ],


        left: [
          "slide-in-from-right-2",
        ],


        right: [
          "slide-in-from-left-2",
        ],


      },



      size: {


        sm: [
          "text-xs",
          "px-2",
          "py-1",
        ],



        md: [
          "text-sm",
          "px-3",
          "py-1.5",
        ],



        lg: [
          "text-base",
          "px-4",
          "py-2",
        ],


      },



      align: {


        start: [
          "origin-top-left",
        ],


        center: [
          "origin-center",
        ],


        end: [
          "origin-top-right",
        ],


      },


    },



    defaultVariants: {


      placement: "top",


      size: "md",


      align: "center",


    },

  }
);





/**
 * Tooltip arrow
 */
export const tooltipArrowVariants = cva(
  [
    "absolute",

    "h-2",

    "w-2",

    "rotate-45",

    "bg-slate-900",
  ],


  {

    variants: {


      placement: {


        top: [
          "bottom-[-4px]",
          "left-1/2",
          "-translate-x-1/2",
        ],



        bottom: [
          "top-[-4px]",
          "left-1/2",
          "-translate-x-1/2",
        ],



        left: [
          "right-[-4px]",
          "top-1/2",
          "-translate-y-1/2",
        ],



        right: [
          "left-[-4px]",
          "top-1/2",
          "-translate-y-1/2",
        ],


      },


    },


    defaultVariants: {

      placement: "top",

    },


  }
);
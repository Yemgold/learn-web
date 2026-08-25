



import { cva } from "class-variance-authority";



/**
 * Toast container
 */
export const toastContainerVariants = cva(
  [
    "fixed",

    "z-[100]",

    "flex",

    "w-full",

    "max-w-sm",

    "flex-col",

    "gap-3",
  ]
);





/**
 * Toast item
 */
export const toastVariants = cva(

  [

    "relative",

    "flex",

    "w-full",

    "items-start",

    "gap-3",

    "rounded-xl",

    "border",

    "p-4",

    "shadow-lg",

    "backdrop-blur-sm",

    "animate-in",

    "fade-in-0",

    "slide-in-from-top-2",

    "duration-200",

  ],


  {

    variants: {


      variant: {


        default: [

          "border-slate-200",

          "bg-white",

          "text-slate-900",

        ],



        success: [

          "border-green-200",

          "bg-green-50",

          "text-green-900",

        ],



        error: [

          "border-red-200",

          "bg-red-50",

          "text-red-900",

        ],



        warning: [

          "border-yellow-200",

          "bg-yellow-50",

          "text-yellow-900",

        ],



        info: [

          "border-blue-200",

          "bg-blue-50",

          "text-blue-900",

        ],


      },


    },


    defaultVariants: {


      variant:
        "default",


    },


  }

);







/**
 * Toast content
 */
export const toastContentVariants = cva(

  [

    "flex-1",

    "space-y-1",

  ]

);







/**
 * Toast title
 */
export const toastTitleVariants = cva(

  [

    "text-sm",

    "font-semibold",

    "leading-none",

  ]

);








/**
 * Toast description
 */
export const toastDescriptionVariants = cva(

  [

    "text-sm",

    "opacity-80",

  ]

);








/**
 * Toast close button
 */
export const toastCloseVariants = cva(

  [

    "absolute",

    "right-3",

    "top-3",

    "inline-flex",

    "h-6",

    "w-6",

    "items-center",

    "justify-center",

    "rounded-md",

    "text-sm",

    "opacity-60",

    "transition",

    "hover:bg-black/10",

    "hover:opacity-100",

  ]

);







/**
 * Toast action button
 */
export const toastActionVariants = cva(

  [

    "mt-2",

    "inline-flex",

    "items-center",

    "rounded-md",

    "px-3",

    "py-1.5",

    "text-sm",

    "font-medium",

    "transition",

    "hover:bg-black/10",

  ]

);
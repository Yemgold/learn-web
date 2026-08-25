


import { cva } from "class-variance-authority";



/**
 * Spinner element
 */
export const spinnerVariants = cva(

  [

    "inline-block",

    "rounded-full",

    "border-solid",

    "border-current",

    "border-r-transparent",

    "animate-spin",

  ],


  {

    variants: {


      size: {


        xs: [

          "h-3",

          "w-3",

          "border-2",

        ],



        sm: [

          "h-4",

          "w-4",

          "border-2",

        ],



        md: [

          "h-6",

          "w-6",

          "border-2",

        ],



        lg: [

          "h-8",

          "w-8",

          "border-4",

        ],



        xl: [

          "h-12",

          "w-12",

          "border-4",

        ],


      },





      variant: {


        default: [

          "text-slate-700",

        ],



        primary: [

          "text-blue-600",

        ],



        secondary: [

          "text-slate-500",

        ],



        success: [

          "text-green-600",

        ],



        danger: [

          "text-red-600",

        ],



        warning: [

          "text-yellow-500",

        ],


      },





      speed: {


        slow: [

          "[animation-duration:2s]",

        ],



        normal: [

          "[animation-duration:1s]",

        ],



        fast: [

          "[animation-duration:500ms]",

        ],


      },


    },



    defaultVariants: {


      size: "md",


      variant: "default",


      speed: "normal",


    },


  }

);








/**
 * Fullscreen wrapper
 */
export const spinnerFullscreenVariants = cva(

  [

    "fixed",

    "inset-0",

    "z-50",

    "flex",

    "items-center",

    "justify-center",

    "bg-white/70",

    "backdrop-blur-sm",

  ]

);
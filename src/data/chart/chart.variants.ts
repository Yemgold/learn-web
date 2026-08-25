


import { cva } from "class-variance-authority";



/**
 * Main chart wrapper
 */
export const chartWrapperVariants = cva(

  [

    "w-full",

    "rounded-xl",

    "border",

    "border-slate-200",

    "bg-white",

    "p-4",

    "shadow-sm",

  ],


  {

    variants: {


      size: {


        sm: [

          "min-h-[220px]",

        ],



        md: [

          "min-h-[320px]",

        ],



        lg: [

          "min-h-[420px]",

        ],



        xl: [

          "min-h-[520px]",

        ],


      },


    },



    defaultVariants: {


      size: "md",


    },


  }

);








/**
 * Chart header
 */
export const chartHeaderVariants = cva(

  [

    "mb-4",

    "flex",

    "flex-col",

    "gap-1",

  ]

);








/**
 * Chart title
 */
export const chartTitleVariants = cva(

  [

    "text-base",

    "font-semibold",

    "text-slate-900",

  ]

);








/**
 * Chart description
 */
export const chartDescriptionVariants = cva(

  [

    "text-sm",

    "text-slate-500",

  ]

);








/**
 * Chart content area
 */
export const chartContentVariants = cva(

  [

    "relative",

    "w-full",

    "flex-1",

  ]

);








/**
 * Loading overlay
 */
export const chartLoadingVariants = cva(

  [

    "absolute",

    "inset-0",

    "z-10",

    "flex",

    "items-center",

    "justify-center",

    "rounded-xl",

    "bg-white/70",

    "backdrop-blur-sm",

  ]

);








/**
 * Legend wrapper
 */
export const chartLegendVariants = cva(

  [

    "mt-3",

    "flex",

    "flex-wrap",

    "gap-4",

    "text-sm",

  ]

);
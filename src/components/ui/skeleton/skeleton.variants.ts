



import { cva } from "class-variance-authority";



/**
 * Skeleton element variants
 */
export const skeletonVariants = cva(

  [

    "relative",

    "overflow-hidden",

    "bg-slate-200",

    "dark:bg-slate-800",

  ],


  {

    variants: {


      variant: {


        default: [

          "rounded-md",

        ],



        rounded: [

          "rounded-xl",

        ],



        circle: [

          "rounded-full",

        ],



        text: [

          "h-4",

          "rounded",

        ],


      },






      animation: {


        pulse: [

          "animate-pulse",

        ],




        shimmer: [

          "before:absolute",

          "before:inset-0",

          "before:-translate-x-full",

          "before:animate-[shimmer_2s_infinite]",

          "before:bg-gradient-to-r",

          "before:from-transparent",

          "before:via-white/40",

          "before:to-transparent",

        ],




        none: [],


      },






      size: {


        xs: [

          "h-3",

          "w-3",

        ],



        sm: [

          "h-5",

          "w-5",

        ],



        md: [

          "h-8",

          "w-8",

        ],



        lg: [

          "h-12",

          "w-12",

        ],



        xl: [

          "h-16",

          "w-16",

        ],


      },


    },



    defaultVariants: {


      variant:
        "default",


      animation:
        "shimmer",


      size:
        "md",


    },

  }

);
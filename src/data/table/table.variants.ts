
import { cva } from "class-variance-authority";



/**
 * Main table wrapper
 */
export const tableWrapperVariants = cva(

  [

    "w-full",

    "overflow-hidden",

    "rounded-xl",

    "border",

    "border-slate-200",

    "bg-white",

  ]

);







/**
 * Scroll container
 */
export const tableContainerVariants = cva(

  [

    "w-full",

    "overflow-x-auto",

  ]

);







/**
 * Table element
 */
export const tableVariants = cva(

  [

    "w-full",

    "border-collapse",

    "text-sm",

  ]

);








/**
 * Table header
 */
export const tableHeaderVariants = cva(

  [

    "border-b",

    "bg-slate-50",

    "text-left",

    "text-xs",

    "font-semibold",

    "uppercase",

    "tracking-wide",

    "text-slate-600",

  ]

);







/**
 * Header cell
 */
export const tableHeaderCellVariants = cva(

  [

    "px-4",

    "py-3",

    "whitespace-nowrap",

  ],

  {

    variants: {


      sortable: {


        true: [

          "cursor-pointer",

          "select-none",

          "hover:text-slate-900",

        ],



        false: [],


      },


    },


    defaultVariants: {


      sortable:false,


    },


  }

);







/**
 * Table row
 */
export const tableRowVariants = cva(

  [

    "border-b",

    "transition-colors",

  ],


  {

    variants: {


      selected: {


        true: [

          "bg-blue-50",

        ],



        false: [

          "hover:bg-slate-50",

        ],


      },



      clickable: {


        true: [

          "cursor-pointer",

        ],



        false: [],


      },


    },



    defaultVariants: {


      selected:false,


      clickable:false,


    },


  }

);








/**
 * Table body cell
 */
export const tableCellVariants = cva(

  [

    "px-4",

    "py-3",

    "align-middle",

    "text-slate-700",

  ]

);








/**
 * Empty state
 */
export const tableEmptyVariants = cva(

  [

    "flex",

    "min-h-40",

    "items-center",

    "justify-center",

    "text-sm",

    "text-slate-500",

  ]

);








/**
 * Loading overlay
 */
export const tableLoadingVariants = cva(

  [

    "absolute",

    "inset-0",

    "flex",

    "items-center",

    "justify-center",

    "bg-white/60",

    "backdrop-blur-sm",

  ]

);
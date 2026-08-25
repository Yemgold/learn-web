




import { cva } from "class-variance-authority";


export const cardVariants = cva(
  [
    "relative",
    "overflow-hidden",
    "bg-white",
    "transition-all",
    "duration-200",
  ],
  {
    variants: {

      variant: {

        default:
          "border border-slate-200 rounded-lg",

        outlined:
          "border border-slate-300 bg-transparent rounded-lg",

        elevated:
          "rounded-xl shadow-md",

        ghost:
          "bg-transparent",
      },


      size: {

        sm:
          "p-3",

        md:
          "p-5",

        lg:
          "p-7",
      },


      rounded: {

        none:
          "rounded-none",

        md:
          "rounded-md",

        lg:
          "rounded-lg",

        xl:
          "rounded-xl",
      },


      clickable: {

        true:
          [
            "cursor-pointer",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-primary",
          ],

        false:
          "",
      },


      hoverable: {

        true:
          [
            "hover:-translate-y-1",
            "hover:shadow-lg",
          ],

        false:
          "",
      },


      loading: {

        true:
          [
            "animate-pulse",
            "pointer-events-none",
          ],

        false:
          "",
      },


      noPadding: {

        true:
          "p-0",

        false:
          "",
      },
    },


    defaultVariants: {

      variant:
        "default",

      size:
        "md",

      rounded:
        "lg",

      clickable:
        false,

      hoverable:
        false,

      loading:
        false,

      noPadding:
        false,
    },
  }
);
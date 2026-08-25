




import { cva } from "class-variance-authority";


/**
 * Popover content container
 */
export const popoverContentVariants = cva(
  [
    "z-50",
    "rounded-xl",
    "border",
    "border-slate-200",
    "bg-white",
    "p-4",
    "shadow-xl",
    "outline-none",

    "animate-in",
    "fade-in-0",
    "zoom-in-95",

    "duration-200",
    "ease-out",
  ],
  {
    variants: {

      placement: {

        top: [
          "origin-bottom",
            "mb-2",
        ],

        bottom: [
          "origin-top",
          "mt-2",
        ],

        left: [
          "origin-right",
          "mr-2",
        ],

        right: [
          "origin-left",
          "ml-2",
        ],

      },


      align: {

        start: "",

        center: "",

        end: "",

      },


      size: {

        sm: [
          "w-64",
        ],


        md: [
          "w-80",
        ],


        lg: [
          "w-96",
        ],


        xl: [
          "w-[32rem]",
        ],


        auto: [
          "w-auto",
        ],

      },

    },


    compoundVariants: [

      // TOP ALIGNMENTS

      {
        placement: "top",
        align: "start",
        class:
          "origin-bottom-left",
      },

      {
        placement: "top",
        align: "center",
        class:
          "origin-bottom",
      },

      {
        placement: "top",
        align: "end",
        class:
          "origin-bottom-right",
      },


      // BOTTOM ALIGNMENTS

      {
        placement: "bottom",
        align: "start",
        class:
          "origin-top-left",
      },

      {
        placement: "bottom",
        align: "center",
        class:
          "origin-top",
      },

      {
        placement: "bottom",
        align: "end",
        class:
          "origin-top-right",
      },


      // LEFT ALIGNMENTS

      {
        placement: "left",
        align: "start",
        class:
          "origin-top-right",
      },

      {
        placement: "left",
        align: "center",
        class:
          "origin-right",
      },

      {
        placement: "left",
        align: "end",
        class:
          "origin-bottom-right",
      },


      // RIGHT ALIGNMENTS

      {
        placement: "right",
        align: "start",
        class:
          "origin-top-left",
      },

      {
        placement: "right",
        align: "center",
        class:
          "origin-left",
      },

      {
        placement: "right",
        align: "end",
        class:
          "origin-bottom-left",
      },

    ],


    defaultVariants: {

      placement: "bottom",

      align: "center",

      size: "md",

    },

  }
);



/**
 * Popover wrapper
 */
export const popoverWrapperVariants = cva([
  "relative",
  "inline-flex",
]);



/**
 * Trigger
 */
export const popoverTriggerVariants = cva([
  "inline-flex",
  "cursor-pointer",
]);



/**
 * Arrow
 */
export const popoverArrowVariants = cva([
  "absolute",
  "h-3",
  "w-3",
  "rotate-45",
  "border",
  "border-slate-200",
  "bg-white",
]);
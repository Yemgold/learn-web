



"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  spinnerFullscreenVariants,
  spinnerVariants,
} from "./spinner.variants";


import type {
  SpinnerProps,
} from "./types";



const Spinner = React.forwardRef<
  HTMLDivElement,
  SpinnerProps
>((props, ref) => {


  const {

    className,


    size = "md",


    variant = "default",


    speed = "normal",


    label = "Loading",


    fullscreen = false,


    ...rest


  } = props;





  const spinner = (


    <div

      ref={ref}


      role="status"


      aria-label={label}


      className={cn(

        spinnerVariants({

          size,

          variant,

          speed,

        }),

        className

      )}



      {...rest}

    >

      <span
        className="sr-only"
      >

        {label}

      </span>


    </div>


  );






  if (fullscreen) {


    return (

      <div

        className={
          spinnerFullscreenVariants()
        }

      >

        {spinner}


      </div>

    );


  }






  return spinner;


});




Spinner.displayName =
  "Spinner";



export default Spinner;
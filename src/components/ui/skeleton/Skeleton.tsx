

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  skeletonVariants,
} from "./skeleton.variants";


import type {
  SkeletonProps,
} from "./types";



const Skeleton = React.forwardRef<
  HTMLDivElement,
  SkeletonProps
>((props, ref) => {


  const {


    className,


    variant = "default",


    animation = "shimmer",


    size = "md",


    width,


    height,


    style,


    ...rest


  } = props;






  return (

    <div


      ref={ref}


      aria-hidden="true"


      className={cn(

        skeletonVariants({

          variant,

          animation,

          size,

        }),

        className

      )}



      style={{

        width,

        height,

        ...style,

      }}



      {...rest}

    />

  );


});




Skeleton.displayName =
  "Skeleton";



export default Skeleton;
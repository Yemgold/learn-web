



"use client";

import * as React from "react";

import {
  cn,
} from "@/lib/utils";



interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {


  children:
    React.ReactNode;


  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "full";


}







const containerSizes = {


  sm:
    "max-w-3xl",


  md:
    "max-w-5xl",


  lg:
    "max-w-6xl",


  xl:
    "max-w-7xl",


  full:
    "max-w-full",


};







export default function Container({

  children,

  size = "xl",

  className,

  ...props

}: ContainerProps) {



  return (

    <div

      className={cn(

        "mx-auto",

        "w-full",

        "px-4",

        "sm:px-6",

        "lg:px-8",

        containerSizes[size],

        className

      )}

      {...props}

    >

      {children}

    </div>

  );

}
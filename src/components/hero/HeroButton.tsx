



"use client";

import Link from "next/link";

import {
  cn,
} from "@/lib/utils";


import {
  Button,
} from "@/components/ui/button";



interface HeroButtonProps {


  children:
    React.ReactNode;



  href:
    string;



  variant?:
    | "primary"
    | "secondary";



  className?:
    string;


}







export default function HeroButton({

  children,

  href,

  variant = "primary",

  className,

}: HeroButtonProps) {



  return (

    <Link

      href={href}

    >

      <Button

        className={cn(

          "rounded-xl",

          "px-6",

          "py-3",

          "font-semibold",

          variant === "primary" && [

            "bg-yellow-400",

            "text-slate-900",

            "hover:bg-yellow-300",

          ],



          variant === "secondary" && [

            "border",

            "border-white/40",

            "bg-transparent",

            "text-white",

            "hover:bg-white/10",

          ],



          className

        )}

      >

        {children}

      </Button>


    </Link>

  );

}
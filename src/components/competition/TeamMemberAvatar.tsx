



"use client";

import Image from "next/image";


import {
  cn,
} from "@/lib/utils";








export type TeamMemberAvatarSize =

  | "sm"

  | "md"

  | "lg";







interface TeamMemberAvatarProps {


  name:
    string;


  image?:
    string;


  size?:
    TeamMemberAvatarSize;


  className?:
    string;

}









const sizeStyles = {


  sm:
    "h-8 w-8 text-xs",


  md:
    "h-10 w-10 text-sm",


  lg:
    "h-14 w-14 text-lg",

};








export default function TeamMemberAvatar({

  name,

  image,

  size = "md",

  className,

}: TeamMemberAvatarProps) {


  const initials =

    name

      .split(" ")

      .map(

        (part) =>

          part.charAt(0)

      )

      .join("")

      .slice(0, 2)

      .toUpperCase();





  return (

    <div

      className={cn(

        "relative",

        "flex",

        "items-center",

        "justify-center",

        "overflow-hidden",

        "rounded-full",

        "bg-blue-100",

        "font-semibold",

        "text-blue-700",

        sizeStyles[size],

        className

      )}

    >



      {
        image ? (

          <Image

            src={image}

            alt={name}

            fill

            sizes="40px"

            className="object-cover"

          />

        ) : (


          <span>

            {initials}

          </span>


        )
      }



    </div>

  );

}
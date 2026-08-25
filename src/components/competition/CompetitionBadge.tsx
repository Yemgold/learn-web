


"use client";

import {
  cn,
} from "@/lib/utils";



export type CompetitionBadgeVariant =

  | "upcoming"

  | "active"

  | "completed"

  | "featured"

  | "team"

  | "subject";





interface CompetitionBadgeProps {


  children:
    React.ReactNode;


  variant?:
    CompetitionBadgeVariant;


  className?:
    string;

}







const variants = {

  upcoming:
    "bg-blue-100 text-blue-700",


  active:
    "bg-green-100 text-green-700",


  completed:
    "bg-slate-100 text-slate-700",


  featured:
    "bg-yellow-100 text-yellow-700",


  team:
    "bg-purple-100 text-purple-700",


  subject:
    "bg-orange-100 text-orange-700",

};








export default function CompetitionBadge({

  children,

  variant = "upcoming",

  className,

}: CompetitionBadgeProps) {


  return (

    <span

      className={cn(

        "inline-flex",

        "items-center",

        "rounded-full",

        "px-3",

        "py-1",

        "text-xs",

        "font-semibold",

        "capitalize",

        variants[variant],

        className

      )}

    >

      {children}

    </span>

  );

}
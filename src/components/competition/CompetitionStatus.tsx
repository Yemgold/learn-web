



"use client";

import {
  cn,
} from "@/lib/utils";

import {
  CalendarClock,
  PlayCircle,
  CheckCircle2,
  FileEdit,
} from "lucide-react";





export type CompetitionStatusType =

  | "upcoming"

  | "active"

  | "completed"

  | "draft";







interface CompetitionStatusProps {


  status:
    CompetitionStatusType;


  className?:
    string;


}








const statusConfig = {


  upcoming: {

    label: "Upcoming",

    icon: CalendarClock,

    className:
      "bg-blue-100 text-blue-700",

  },



  active: {

    label: "Live",

    icon: PlayCircle,

    className:
      "bg-green-100 text-green-700",

  },



  completed: {

    label: "Completed",

    icon: CheckCircle2,

    className:
      "bg-slate-100 text-slate-700",

  },



  draft: {

    label: "Draft",

    icon: FileEdit,

    className:
      "bg-yellow-100 text-yellow-700",

  },


};








export default function CompetitionStatus({

  status,

  className,

}: CompetitionStatusProps) {


  const config =
    statusConfig[status];


  const Icon =
    config.icon;




  return (

    <span

      className={cn(

        "inline-flex",

        "items-center",

        "gap-1.5",

        "rounded-full",

        "px-3",

        "py-1",

        "text-xs",

        "font-semibold",

        config.className,

        className

      )}

    >

      <Icon

        size={14}

      />


      {config.label}


    </span>

  );

}
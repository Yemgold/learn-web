



"use client";

import Link from "next/link";

import {
  Users,
  Trophy,
  Clock,
  ArrowRight,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";


import {
  Card,
} from "@/components/ui/card";



export interface CompetitionCardProps {


  id: string;


  title: string;


  description: string;


  category: string;


  participants?: number;


  duration?: string;


  status?:
    | "upcoming"
    | "active"
    | "completed";


  href?: string;


  className?: string;

}







const statusStyles = {

  upcoming:
    "bg-blue-100 text-blue-700",


  active:
    "bg-green-100 text-green-700",


  completed:
    "bg-slate-100 text-slate-700",

};








export default function CompetitionCard({

  title,

  description,

  category,

  participants = 0,

  duration = "30 mins",

  status = "upcoming",

  href = "#",

  className,

}: CompetitionCardProps) {


  return (

    <Card

      className={cn(

        "group",

        "overflow-hidden",

        "border",

        "transition-all",

        "hover:-translate-y-1",

        "hover:shadow-xl",

        className

      )}

    >



      <div

        className="p-6"

      >




        {/* Header */}

        <div

          className="mb-5 flex items-start justify-between"

        >


          <div

            className={cn(

              "flex",

              "h-12",

              "w-12",

              "items-center",

              "justify-center",

              "rounded-xl",

              "bg-blue-100",

              "text-blue-600"

            )}

          >

            <Trophy size={24}/>

          </div>





          <span

            className={cn(

              "rounded-full",

              "px-3",

              "py-1",

              "text-xs",

              "font-semibold",

              statusStyles[status]

            )}

          >

            {status}

          </span>


        </div>







        {/* Content */}

        <div

          className="space-y-3"

        >


          <p

            className="text-sm font-medium text-blue-600"

          >

            {category}

          </p>





          <h3

            className="text-xl font-bold text-slate-900"

          >

            {title}

          </h3>






          <p

            className="line-clamp-3 text-sm leading-6 text-slate-600"

          >

            {description}

          </p>



        </div>







        {/* Info */}

        <div

          className="mt-6 space-y-3 border-t pt-5"

        >



          <div

            className="flex items-center gap-2 text-sm text-slate-600"

          >

            <Users size={16}/>

            <span>

              {participants.toLocaleString()} Participants

            </span>

          </div>






          <div

            className="flex items-center gap-2 text-sm text-slate-600"

          >

            <Clock size={16}/>

            <span>

              {duration}

            </span>

          </div>



        </div>







        {/* Action */}

        <Link

          href={href}

          className={cn(

            "mt-6",

            "flex",

            "items-center",

            "justify-center",

            "gap-2",

            "rounded-xl",

            "bg-blue-600",

            "px-4",

            "py-3",

            "text-sm",

            "font-semibold",

            "text-white",

            "transition",

            "hover:bg-blue-700"

          )}

        >

          View Competition

          <ArrowRight

            size={16}

            className="transition-transform group-hover:translate-x-1"

          />

        </Link>




      </div>



    </Card>

  );

}
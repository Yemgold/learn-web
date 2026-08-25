


"use client";

import Link from "next/link";

import {
  Users,
  Clock,
  ArrowRight,
  Trophy,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";


import CompetitionBadge, {
  type CompetitionBadgeVariant,
} from "./CompetitionBadge";






interface CompetitionHeaderProps {


  title:
    string;


  description:
    string;


  category:
    string;


  status?:
    CompetitionBadgeVariant;


  participants?:
    number;


  duration?:
    string;


  registrationHref?:
    string;


  className?:
    string;

}








export default function CompetitionHeader({

  title,

  description,

  category,

  status = "upcoming",

  participants = 0,

  duration = "60 minutes",

  registrationHref = "/register",

  className,

}: CompetitionHeaderProps) {


  return (

    <section

      className={cn(

        "rounded-3xl",

        "border",

        "bg-white",

        "p-6",

        "shadow-sm",

        "sm:p-8",

        className

      )}

    >



      <div

        className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"

      >






        {/* Information */}

        <div

          className="space-y-5"

        >



          <div

            className="flex flex-wrap items-center gap-3"

          >


            <CompetitionBadge

              variant="subject"

            >

              {category}

            </CompetitionBadge>



            <CompetitionBadge

              variant={status}

            >

              {status}

            </CompetitionBadge>



          </div>







          <div

            className="flex items-start gap-4"

          >

            <div

              className={cn(

                "hidden",

                "h-14",

                "w-14",

                "items-center",

                "justify-center",

                "rounded-2xl",

                "bg-blue-100",

                "text-blue-600",

                "sm:flex"

              )}

            >

              <Trophy size={28}/>

            </div>






            <div>


              <h1

                className="text-3xl font-bold text-slate-900 sm:text-4xl"

              >

                {title}

              </h1>





              <p

                className="mt-3 max-w-2xl leading-7 text-slate-600"

              >

                {description}

              </p>


            </div>


          </div>







          {/* Stats */}

          <div

            className="flex flex-wrap gap-6"

          >



            <div

              className="flex items-center gap-2 text-sm text-slate-600"

            >

              <Users

                size={18}

                className="text-blue-600"

              />

              <span>

                {participants.toLocaleString()} Participants

              </span>

            </div>






            <div

              className="flex items-center gap-2 text-sm text-slate-600"

            >

              <Clock

                size={18}

                className="text-blue-600"

              />

              <span>

                {duration}

              </span>

            </div>



          </div>



        </div>









        {/* CTA */}

        <Link

          href={registrationHref}

          className={cn(

            "inline-flex",

            "items-center",

            "justify-center",

            "gap-2",

            "rounded-xl",

            "bg-blue-600",

            "px-6",

            "py-3",

            "font-semibold",

            "text-white",

            "transition",

            "hover:bg-blue-700"

          )}

        >

          Register Now

          <ArrowRight size={18}/>

        </Link>




      </div>



    </section>

  );

}
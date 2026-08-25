


"use client";

import Link from "next/link";

import {
  Users,
  Trophy,
  ArrowRight,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";

import {
  Card,
} from "@/components/ui/card";






export interface TeamMember {


  id:
    string;


  name:
    string;


  avatar?:
    string;


}







export interface TeamCardProps {


  id:
    string;


  name:
    string;


  school?:
    string;


  members:
    TeamMember[];


  points?:
    number;


  rank?:
    number;


  href?:
    string;


  className?:
    string;

}









export default function TeamCard({

  name,

  school,

  members,

  points = 0,

  rank,

  href = "#",

  className,

}: TeamCardProps) {


  return (

    <Card

      className={cn(

        "overflow-hidden",

        "border",

        "bg-white",

        "transition",

        "hover:-translate-y-1",

        "hover:shadow-lg",

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

            <Users size={24}/>

          </div>





          {
            rank && (

              <div

                className={cn(

                  "flex",

                  "items-center",

                  "gap-1",

                  "rounded-full",

                  "bg-yellow-100",

                  "px-3",

                  "py-1",

                  "text-xs",

                  "font-semibold",

                  "text-yellow-700"

                )}

              >

                <Trophy size={14}/>

                #{rank}

              </div>

            )
          }


        </div>








        {/* Team Info */}

        <h3

          className="text-xl font-bold text-slate-900"

        >

          {name}

        </h3>





        {
          school && (

            <p

              className="mt-1 text-sm text-slate-500"

            >

              {school}

            </p>

          )
        }








        {/* Members */}

        <div

          className="mt-5"

        >


          <p

            className="mb-3 text-sm font-medium text-slate-700"

          >

            Team Members

          </p>





          <div

            className="space-y-2"

          >


            {
              members.slice(0, 3).map(

                (member) => (


                  <div

                    key={member.id}

                    className="flex items-center gap-3"

                  >


                    <div

                      className={cn(

                        "flex",

                        "h-8",

                        "w-8",

                        "items-center",

                        "justify-center",

                        "rounded-full",

                        "bg-slate-200",

                        "text-xs",

                        "font-semibold",

                        "text-slate-700"

                      )}

                    >

                      {
                        member.name

                          .charAt(0)

                          .toUpperCase()

                      }

                    </div>





                    <span

                      className="text-sm text-slate-600"

                    >

                      {member.name}

                    </span>



                  </div>


                )

              )
            }


          </div>


        </div>








        {/* Score */}

        <div

          className="mt-6 flex items-center justify-between border-t pt-5"

        >


          <div>


            <p

              className="text-xs text-slate-500"

            >

              Total Points

            </p>


            <p

              className="text-xl font-bold text-blue-600"

            >

              {points}

            </p>


          </div>








          <Link

            href={href}

            className={cn(

              "flex",

              "items-center",

              "gap-2",

              "rounded-xl",

              "bg-blue-600",

              "px-4",

              "py-2",

              "text-sm",

              "font-semibold",

              "text-white",

              "transition",

              "hover:bg-blue-700"

            )}

          >

            View

            <ArrowRight size={15}/>

          </Link>



        </div>




      </div>



    </Card>

  );

}
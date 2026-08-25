


"use client";

import {
  cn,
} from "@/lib/utils";


import CompetitionCard, {
  type CompetitionCardProps,
} from "./CompetitionCard";






interface CompetitionGridProps {


  competitions:
    CompetitionCardProps[];


  className?:
    string;


}








export default function CompetitionGrid({

  competitions,

  className,

}: CompetitionGridProps) {


  if (!competitions.length) {

    return (

      <div

        className={cn(

          "rounded-2xl",

          "border",

          "bg-white",

          "p-10",

          "text-center",

          "text-slate-500"

        )}

      >

        No competitions available.

      </div>

    );

  }







  return (

    <div

      className={cn(

        "grid",

        "gap-6",

        "sm:grid-cols-2",

        "lg:grid-cols-3",

        className

      )}

    >

      {
        competitions.map(

          (competition) => (

            <CompetitionCard

              key={
                competition.id
              }

              {...competition}

            />

          )

        )
      }

    </div>

  );

}
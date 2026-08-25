



"use client";

import {
  Trophy,
  Medal,
  TrendingUp,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";





export interface ScoreBoardTeam {


  id:
    string;


  rank:
    number;


  name:
    string;


  score:
    number;


  answered:
    number;


  totalQuestions:
    number;

}







interface ScoreBoardProps {


  teams:
    ScoreBoardTeam[];


  title?:
    string;


  className?:
    string;

}








function RankIcon({

  rank,

}: {

  rank: number;

}) {


  if (rank === 1) {

    return (

      <Trophy

        size={20}

        className="text-yellow-500"

      />

    );

  }



  if (rank === 2 || rank === 3) {

    return (

      <Medal

        size={20}

        className="text-orange-500"

      />

    );

  }



  return (

    <span

      className="font-bold text-slate-500"

    >

      {rank}

    </span>

  );

}









export default function ScoreBoard({

  teams,

  title = "Live Scoreboard",

  className,

}: ScoreBoardProps) {


  return (

    <section

      className={cn(

        "rounded-2xl",

        "border",

        "bg-white",

        "p-6",

        className

      )}

    >




      {/* Header */}

      <div

        className="mb-6 flex items-center gap-3"

      >

        <div

          className={cn(

            "flex",

            "h-10",

            "w-10",

            "items-center",

            "justify-center",

            "rounded-xl",

            "bg-blue-100",

            "text-blue-600"

          )}

        >

          <TrendingUp size={20}/>

        </div>



        <h2

          className="text-xl font-bold text-slate-900"

        >

          {title}

        </h2>


      </div>







      {/* Teams */}

      <div

        className="space-y-3"

      >


        {
          teams.map(

            (team) => (

              <div

                key={team.id}

                className={cn(

                  "flex",

                  "items-center",

                  "justify-between",

                  "rounded-xl",

                  "border",

                  "p-4",

                  "transition",

                  "hover:bg-slate-50",

                  team.rank === 1 && [

                    "border-blue-500",

                    "bg-blue-50",

                  ]

                )}

              >





                {/* Rank */}

                <div

                  className="flex items-center gap-4"

                >


                  <div

                    className="flex w-8 justify-center"

                  >

                    <RankIcon

                      rank={team.rank}

                    />

                  </div>







                  <div>


                    <h3

                      className="font-semibold text-slate-900"

                    >

                      {team.name}

                    </h3>




                    <p

                      className="text-sm text-slate-500"

                    >

                      {team.answered}

                      /

                      {team.totalQuestions}

                      {" "}questions completed

                    </p>


                  </div>


                </div>







                {/* Score */}

                <div

                  className="text-right"

                >


                  <p

                    className="text-xl font-bold text-blue-600"

                  >

                    {team.score}

                  </p>



                  <p

                    className="text-xs text-slate-500"

                  >

                    Points

                  </p>



                </div>




              </div>

            )

          )
        }


      </div>



    </section>

  );

}
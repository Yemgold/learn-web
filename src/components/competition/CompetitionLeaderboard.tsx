

"use client";

import {
  Trophy,
  Medal,
  Crown,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";








export interface LeaderboardTeam {


  id:
    string;


  rank:
    number;


  name:
    string;


  score:
    number;


  members:
    number;


  completedQuestions:
    number;

}








interface CompetitionLeaderboardProps {


  teams:
    LeaderboardTeam[];


  title?:
    string;


  className?:
    string;

}








function RankBadge({

  rank,

}: {

  rank:number;

}) {


  if (rank === 1) {

    return (

      <Crown

        size={22}

        className="text-yellow-500"

      />

    );

  }



  if (rank === 2) {

    return (

      <Medal

        size={22}

        className="text-slate-400"

      />

    );

  }




  if (rank === 3) {

    return (

      <Medal

        size={22}

        className="text-orange-500"

      />

    );

  }





  return (

    <span

      className="font-bold text-slate-500"

    >

      #{rank}

    </span>

  );

}








export default function CompetitionLeaderboard({

  teams,

  title = "Competition Leaderboard",

  className,

}: CompetitionLeaderboardProps) {


  return (

    <section

      className={cn(

        "rounded-3xl",

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

            "h-12",

            "w-12",

            "items-center",

            "justify-center",

            "rounded-xl",

            "bg-yellow-100",

            "text-yellow-600"

          )}

        >

          <Trophy size={24}/>

        </div>





        <div>


          <h2

            className="text-xl font-bold text-slate-900"

          >

            {title}

          </h2>



          <p

            className="text-sm text-slate-500"

          >

            Top performing teams

          </p>


        </div>


      </div>









      {/* Ranking list */}

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

                  "rounded-2xl",

                  "border",

                  "p-4",

                  "transition",

                  "hover:bg-slate-50",

                  team.rank === 1 && [

                    "border-yellow-300",

                    "bg-yellow-50",

                  ]

                )}

              >





                {/* Left */}

                <div

                  className="flex items-center gap-4"

                >


                  <div

                    className="flex h-10 w-10 items-center justify-center"

                  >

                    <RankBadge

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

                      {team.members} students · {team.completedQuestions} questions completed

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

                    points

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
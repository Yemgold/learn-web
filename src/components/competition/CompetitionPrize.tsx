


"use client";

import {
  Trophy,
  Medal,
  Award,
  Gift,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";







interface PrizeItem {


  position:
    string;


  reward:
    string;


  description?:
    string;

}








interface CompetitionPrizeProps {


  title?:
    string;


  totalPrize?:
    string;


  prizes:
    PrizeItem[];


  className?:
    string;

}








const icons = [

  Trophy,

  Medal,

  Award,

];









export default function CompetitionPrize({

  title = "Competition Rewards",

  totalPrize,

  prizes,

  className,

}: CompetitionPrizeProps) {


  return (

    <section

      className={cn(

        "rounded-3xl",

        "border",

        "bg-white",

        "p-6",

        "shadow-sm",

        className

      )}

    >





      {/* Header */}

      <div

        className="mb-6 flex items-center justify-between"

      >


        <div

          className="flex items-center gap-3"

        >


          <div

            className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600"

          >

            <Gift size={24}/>

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

              Rewards for top performing teams

            </p>


          </div>


        </div>







        {
          totalPrize && (

            <div

              className="rounded-xl bg-blue-50 px-4 py-3 text-right"

            >

              <p

                className="text-xs text-slate-500"

              >

                Prize Pool

              </p>



              <p

                className="font-bold text-blue-600"

              >

                {totalPrize}

              </p>


            </div>

          )
        }



      </div>









      {/* Prize List */}

      <div

        className="space-y-4"

      >


        {
          prizes.map(

            (prize,index)=>(


              <div

                key={prize.position}

                className={cn(

                  "flex",

                  "items-center",

                  "gap-4",

                  "rounded-2xl",

                  "border",

                  "p-4",

                  index === 0 && [

                    "border-yellow-300",

                    "bg-yellow-50",

                  ]

                )}

              >




                <div

                  className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"

                >


                  {
                    (()=>{


                      const Icon =

                        icons[index]

                        ?? Award;


                      return (

                        <Icon

                          size={24}

                          className="text-blue-600"

                        />

                      );


                    })()
                  }


                </div>







                <div>


                  <h3

                    className="font-bold text-slate-900"

                  >

                    {prize.position}

                  </h3>



                  <p

                    className="font-semibold text-blue-600"

                  >

                    {prize.reward}

                  </p>



                  {
                    prize.description && (

                      <p

                        className="mt-1 text-sm text-slate-500"

                      >

                        {prize.description}

                      </p>

                    )
                  }



                </div>



              </div>


            )

          )
        }


      </div>



    </section>

  );

}
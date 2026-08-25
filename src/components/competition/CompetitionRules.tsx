



"use client";

import {
  CheckCircle2,
  Info,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";





export interface CompetitionRule {


  id:
    string;


  title:
    string;


  description:
    string;

}







interface CompetitionRulesProps {


  rules:
    CompetitionRule[];


  title?:
    string;


  className?:
    string;

}








export default function CompetitionRules({

  rules,

  title = "Competition Rules",

  className,

}: CompetitionRulesProps) {


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

          <Info size={20}/>

        </div>





        <h2

          className="text-xl font-bold text-slate-900"

        >

          {title}

        </h2>


      </div>









      {/* Rules */}

      <div

        className="space-y-4"

      >


        {
          rules.map(

            (rule) => (


              <div

                key={rule.id}

                className={cn(

                  "flex",

                  "gap-3"

                )}

              >


                <CheckCircle2

                  size={20}

                  className="mt-1 shrink-0 text-green-600"

                />





                <div>


                  <h3

                    className="font-semibold text-slate-900"

                  >

                    {rule.title}

                  </h3>





                  <p

                    className="mt-1 text-sm leading-6 text-slate-600"

                  >

                    {rule.description}

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
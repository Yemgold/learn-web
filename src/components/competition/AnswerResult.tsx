


"use client";

import {
  CheckCircle2,
  XCircle,
  Trophy,
  Lightbulb,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";







export type AnswerResultStatus =

  | "correct"

  | "incorrect";








interface AnswerResultProps {


  status:
    AnswerResultStatus;


  points?:
    number;


  correctAnswer?:
    string;


  explanation?:
    string;


  className?:
    string;

}








const config = {


  correct: {

    title: "Correct Answer!",

    icon: CheckCircle2,

    wrapper:
      "border-green-200 bg-green-50",

    iconColor:
      "text-green-600",

    titleColor:
      "text-green-700",

  },


  incorrect: {

    title: "Incorrect Answer",

    icon: XCircle,

    wrapper:
      "border-red-200 bg-red-50",

    iconColor:
      "text-red-600",

    titleColor:
      "text-red-700",

  },

};









export default function AnswerResult({

  status,

  points = 0,

  correctAnswer,

  explanation,

  className,

}: AnswerResultProps) {


  const result =

    config[status];


  const Icon =

    result.icon;







  return (

    <section

      className={cn(

        "rounded-2xl",

        "border",

        "p-6",

        result.wrapper,

        className

      )}

    >





      {/* Header */}

      <div

        className="flex items-center gap-3"

      >


        <Icon

          size={28}

          className={result.iconColor}

        />




        <div>


          <h3

            className={cn(

              "text-xl",

              "font-bold",

              result.titleColor

            )}

          >

            {result.title}

          </h3>



          {
            status === "correct" && (

              <div

                className="mt-1 flex items-center gap-1 text-sm text-green-700"

              >

                <Trophy size={15}/>

                +{points} points earned

              </div>

            )
          }



        </div>


      </div>








      {/* Incorrect answer */}

      {
        status === "incorrect" && correctAnswer && (

          <div

            className="mt-5 rounded-xl bg-white p-4"

          >

            <p

              className="text-sm text-slate-500"

            >

              Correct Answer

            </p>



            <p

              className="mt-1 font-semibold text-slate-900"

            >

              {correctAnswer}

            </p>


          </div>

        )
      }








      {/* Explanation */}

      {
        explanation && (

          <div

            className="mt-5 flex gap-3 rounded-xl bg-white p-4"

          >

            <Lightbulb

              size={20}

              className="mt-1 shrink-0 text-yellow-500"

            />


            <div>


              <p

                className="font-semibold text-slate-900"

              >

                Explanation

              </p>



              <p

                className="mt-1 text-sm leading-6 text-slate-600"

              >

                {explanation}

              </p>


            </div>


          </div>

        )
      }




    </section>

  );

}
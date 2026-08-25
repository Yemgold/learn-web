



"use client";

import {
  CheckCircle2,
  Circle,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";








export interface QuestionOption {


  id:
    string;


  label:
    string;


  value:
    string;

}








export interface QuestionCardProps {


  questionNumber:
    number;


  totalQuestions:
    number;


  subject:
    string;


  difficulty?:
    "easy"
    | "medium"
    | "hard";


  question:
    string;


  options:
    QuestionOption[];


  selectedAnswer?:
    string;


  onSelectAnswer?:
    (
      optionId: string
    ) => void;


  className?:
    string;

}








const difficultyStyles = {


  easy:
    "bg-green-100 text-green-700",


  medium:
    "bg-yellow-100 text-yellow-700",


  hard:
    "bg-red-100 text-red-700",

};








export default function QuestionCard({

  questionNumber,

  totalQuestions,

  subject,

  difficulty = "medium",

  question,

  options,

  selectedAnswer,

  onSelectAnswer,

  className,

}: QuestionCardProps) {


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

        className="mb-6 flex flex-wrap items-center justify-between gap-4"

      >


        <div>


          <p

            className="text-sm text-slate-500"

          >

            Question {questionNumber} of {totalQuestions}

          </p>



          <h2

            className="mt-1 font-semibold text-slate-900"

          >

            {subject}

          </h2>


        </div>







        <span

          className={cn(

            "rounded-full",

            "px-3",

            "py-1",

            "text-xs",

            "font-semibold",

            difficultyStyles[difficulty]

          )}

        >

          {difficulty}

        </span>



      </div>







      {/* Question */}

      <h3

        className="mb-8 text-xl font-semibold leading-8 text-slate-900"

      >

        {question}

      </h3>








      {/* Options */}

      <div

        className="space-y-3"

      >


        {
          options.map(

            (option) => {


              const isSelected =

                selectedAnswer === option.id;



              return (

                <button

                  key={option.id}

                  type="button"

                  onClick={() =>

                    onSelectAnswer?.(

                      option.id

                    )

                  }

                  className={cn(

                    "flex",

                    "w-full",

                    "items-center",

                    "justify-between",

                    "rounded-xl",

                    "border",

                    "px-5",

                    "py-4",

                    "text-left",

                    "transition",

                    "hover:bg-slate-50",

                    isSelected && [

                      "border-blue-600",

                      "bg-blue-50",

                    ]

                  )}

                >



                  <div

                    className="flex items-center gap-3"

                  >



                    <span

                      className="font-semibold text-slate-700"

                    >

                      {option.label}

                    </span>




                    <span

                      className="text-slate-600"

                    >

                      {option.value}

                    </span>


                  </div>






                  {
                    isSelected ? (

                      <CheckCircle2

                        size={20}

                        className="text-blue-600"

                      />

                    ) : (

                      <Circle

                        size={20}

                        className="text-slate-300"

                      />

                    )
                  }




                </button>

              );


            }

          )
        }


      </div>




    </section>

  );

}
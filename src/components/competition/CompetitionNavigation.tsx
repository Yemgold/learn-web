


"use client";

import {
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";







interface CompetitionNavigationProps {


  currentQuestion:
    number;


  totalQuestions:
    number;


  answeredQuestions?:
    number[];


  onPrevious?:
    () => void;


  onNext?:
    () => void;


  onQuestionSelect?:
    (question: number) => void;


  className?:
    string;

}








export default function CompetitionNavigation({

  currentQuestion,

  totalQuestions,

  answeredQuestions = [],

  onPrevious,

  onNext,

  onQuestionSelect,

  className,

}: CompetitionNavigationProps) {


  return (

    <div

      className={cn(

        "space-y-5",

        className

      )}

    >





      {/* Question Numbers */}

      <div

        className="flex flex-wrap gap-2"

      >


        {
          Array.from(

            {

              length: totalQuestions,

            }

          ).map(

            (_, index) => {


              const questionNumber =

                index + 1;



              const answered =

                answeredQuestions.includes(

                  questionNumber

                );



              const active =

                currentQuestion === questionNumber;




              return (

                <button

                  key={questionNumber}

                  type="button"

                  onClick={() =>

                    onQuestionSelect?.(

                      questionNumber

                    )

                  }

                  className={cn(

                    "relative",

                    "flex",

                    "h-9",

                    "w-9",

                    "items-center",

                    "justify-center",

                    "rounded-lg",

                    "text-sm",

                    "font-semibold",

                    "transition",

                    active && [

                      "bg-blue-600",

                      "text-white",

                    ],


                    !active && answered && [

                      "bg-green-100",

                      "text-green-700",

                    ],


                    !active && !answered && [

                      "bg-slate-100",

                      "text-slate-600",

                    ]

                  )}

                >

                  {
                    answered && !active ? (

                      <Check

                        size={14}

                      />

                    ) : (

                      questionNumber

                    )
                  }


                </button>

              );


            }

          )
        }


      </div>









      {/* Navigation Buttons */}

      <div

        className="flex items-center justify-between"

      >



        <button

          type="button"

          onClick={onPrevious}

          disabled={currentQuestion === 1}

          className={cn(

            "flex",

            "items-center",

            "gap-2",

            "rounded-xl",

            "border",

            "px-5",

            "py-3",

            "text-sm",

            "font-semibold",

            "transition",

            "disabled:cursor-not-allowed",

            "disabled:opacity-50"

          )}

        >

          <ChevronLeft size={18}/>

          Previous

        </button>







        <p

          className="text-sm text-slate-500"

        >

          Question {currentQuestion} of {totalQuestions}

        </p>







        <button

          type="button"

          onClick={onNext}

          disabled={currentQuestion === totalQuestions}

          className={cn(

            "flex",

            "items-center",

            "gap-2",

            "rounded-xl",

            "bg-blue-600",

            "px-5",

            "py-3",

            "text-sm",

            "font-semibold",

            "text-white",

            "transition",

            "hover:bg-blue-700",

            "disabled:cursor-not-allowed",

            "disabled:opacity-50"

          )}

        >

          Next

          <ChevronRight size={18}/>

        </button>



      </div>




    </div>

  );

}





"use client";

import {
  useState,
} from "react";


import {
  cn,
} from "@/lib/utils";


import CompetitionTimer from "./CompetitionTimer";

import QuestionCard from "./QuestionCard";

import CompetitionNavigation from "./CompetitionNavigation";

import ScoreBoard from "./ScoreBoard";

import AnswerResult from "./AnswerResult";







interface Question {


  id:
    string;


  subject:
    string;


  difficulty:
    "easy"
    | "medium"
    | "hard";


  question:
    string;


  options:
    {
      id:string;
      label:string;
      value:string;
    }[];

}








interface CompetitionRoomProps {


  competitionName:
    string;


  questions:
    Question[];


  duration:
    number;


  scores:
    any[];


  onFinish?:
    () => void;


  className?:
    string;

}









export default function CompetitionRoom({

  competitionName,

  questions,

  duration,

  scores,

  onFinish,

  className,

}: CompetitionRoomProps) {



  const [currentQuestion,setCurrentQuestion] =

    useState(0);



  const [answers,setAnswers] =

    useState<Record<string,string>>({});







  const [submitted,setSubmitted] =

    useState(false);








  const question =

    questions[currentQuestion];









  function handleAnswer(

    answer:string

  ) {


    setAnswers((previous)=>({

      ...previous,

      [question.id]:answer,

    }));


  }








  function nextQuestion(){

    if(

      currentQuestion < questions.length - 1

    ){

      setCurrentQuestion(

        currentQuestion + 1

      );


      setSubmitted(false);

    }


  }








  function previousQuestion(){


    if(currentQuestion > 0){


      setCurrentQuestion(

        currentQuestion - 1

      );


      setSubmitted(false);


    }


  }








  function submitAnswer(){


    setSubmitted(true);


  }








  return (

    <section

      className={cn(

        "min-h-screen",

        "bg-slate-50",

        "p-6",

        className

      )}

    >





      {/* Top */}

      <div

        className="mx-auto mb-6 flex max-w-7xl items-center justify-between"

      >



        <div>


          <h1

            className="text-2xl font-bold text-slate-900"

          >

            {competitionName}

          </h1>



          <p

            className="text-sm text-slate-500"

          >

            Live Competition Room

          </p>


        </div>






        <CompetitionTimer

          duration={duration}

          onComplete={onFinish}

        />


      </div>









      <div

        className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_320px]"

      >




        {/* Main */}

        <div

          className="space-y-6"

        >




          <QuestionCard

            questionNumber={currentQuestion + 1}

            totalQuestions={questions.length}

            subject={question.subject}

            difficulty={question.difficulty}

            question={question.question}

            options={question.options}

            selectedAnswer={

              answers[question.id]

            }

            onSelectAnswer={handleAnswer}

          />







          {
            submitted && (

              <AnswerResult

                status="correct"

                points={20}

                explanation="Review the solution and continue."

              />

            )
          }







          <button

            onClick={submitAnswer}

            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"

          >

            Submit Answer

          </button>








          <CompetitionNavigation

            currentQuestion={currentQuestion + 1}

            totalQuestions={questions.length}

            answeredQuestions={

              Object.keys(answers)

                .map(

                  (_,index)=>index + 1

                )

            }

            onPrevious={previousQuestion}

            onNext={nextQuestion}

            onQuestionSelect={(number)=>{

              setCurrentQuestion(number - 1);

            }}

          />


        </div>









        {/* Sidebar */}

        <aside>


          <ScoreBoard

            teams={scores}

          />


        </aside>



      </div>




    </section>

  );

}
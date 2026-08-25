


"use client";

import {
  useEffect,
  useState,
} from "react";


import {
  Clock3,
  AlertTriangle,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";








interface CompetitionTimerProps {


  duration:
    number;


  onComplete?:
    () => void;


  warningAt?:
    number;


  className?:
    string;

}








function formatTime(

  seconds: number

) {


  const minutes = Math.floor(

    seconds / 60

  );


  const remainingSeconds =

    seconds % 60;



  return {

    minutes:

      String(minutes)

        .padStart(2, "0"),


    seconds:

      String(remainingSeconds)

        .padStart(2, "0"),

  };

}








export default function CompetitionTimer({

  duration,

  onComplete,

  warningAt = 60,

  className,

}: CompetitionTimerProps) {


  const [timeLeft, setTimeLeft] =

    useState(duration);







  useEffect(() => {


    if (timeLeft <= 0) {

      onComplete?.();

      return;

    }






    const timer =

      setInterval(() => {


        setTimeLeft(

          (previous) =>

            previous - 1

        );


      }, 1000);






    return () =>

      clearInterval(timer);



  }, [

    timeLeft,

    onComplete,

  ]);








  const {

    minutes,

    seconds,

  } = formatTime(timeLeft);






  const isWarning =

    timeLeft <= warningAt;







  return (

    <div

      className={cn(

        "flex",

        "items-center",

        "gap-3",

        "rounded-2xl",

        "border",

        "bg-white",

        "px-5",

        "py-3",

        isWarning && [

          "border-red-300",

          "bg-red-50",

        ],

        className

      )}

    >




      {
        isWarning ? (

          <AlertTriangle

            size={22}

            className="text-red-600"

          />

        ) : (

          <Clock3

            size={22}

            className="text-blue-600"

          />

        )
      }







      <div>


        <p

          className="text-xs text-slate-500"

        >

          Time Remaining

        </p>



        <p

          className={cn(

            "text-xl",

            "font-bold",

            isWarning

              ? "text-red-600"

              : "text-slate-900"

          )}

        >

          {minutes}:{seconds}

        </p>



      </div>




    </div>

  );

}
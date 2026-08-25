


"use client";

import {
  useEffect,
  useState,
} from "react";


import {
  Clock3,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";






interface CompetitionCountdownProps {


  targetDate:
    string | Date;


  label?:
    string;


  className?:
    string;

}







interface TimeLeft {


  days:
    number;


  hours:
    number;


  minutes:
    number;


  seconds:
    number;

}








function calculateTimeLeft(

  targetDate: Date

): TimeLeft {


  const difference =

    targetDate.getTime()

    -

    new Date().getTime();





  if (difference <= 0) {

    return {

      days: 0,

      hours: 0,

      minutes: 0,

      seconds: 0,

    };

  }





  return {


    days:
      Math.floor(

        difference /

        (1000 * 60 * 60 * 24)

      ),



    hours:
      Math.floor(

        (difference /

          (1000 * 60 * 60))

          %

          24

      ),




    minutes:
      Math.floor(

        (difference /

          (1000 * 60))

          %

          60

      ),




    seconds:
      Math.floor(

        (difference /

          1000)

          %

          60

      ),


  };

}









export default function CompetitionCountdown({

  targetDate,

  label = "Competition starts in",

  className,

}: CompetitionCountdownProps) {


  const [timeLeft, setTimeLeft] =

    useState<TimeLeft>(() =>

      calculateTimeLeft(

        new Date(targetDate)

      )

    );







  useEffect(() => {


    const timer =

      setInterval(() => {


        setTimeLeft(

          calculateTimeLeft(

            new Date(targetDate)

          )

        );


      }, 1000);





    return () =>

      clearInterval(timer);



  }, [targetDate]);









  return (

    <div

      className={cn(

        "rounded-2xl",

        "border",

        "bg-white",

        "p-5",

        className

      )}

    >



      <div

        className="mb-4 flex items-center gap-2"

      >

        <Clock3

          size={18}

          className="text-blue-600"

        />


        <p

          className="text-sm font-medium text-slate-600"

        >

          {label}

        </p>


      </div>









      <div

        className="grid grid-cols-4 gap-3"

      >


        {
          [

            {
              label: "Days",

              value: timeLeft.days,

            },


            {
              label: "Hours",

              value: timeLeft.hours,

            },


            {
              label: "Min",

              value: timeLeft.minutes,

            },


            {
              label: "Sec",

              value: timeLeft.seconds,

            },

          ].map((item) => (


            <div

              key={item.label}

              className={cn(

                "rounded-xl",

                "bg-slate-100",

                "p-3",

                "text-center"

              )}

            >


              <p

                className="text-2xl font-bold text-slate-900"

              >

                {String(item.value).padStart(2, "0")}

              </p>



              <p

                className="text-xs text-slate-500"

              >

                {item.label}

              </p>


            </div>


          ))

        }


      </div>



    </div>

  );

}



"use client";

import Link from "next/link";

import {
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";







interface CompetitionResultProps {


  title?:
    string;


  score:
    number;


  rank:
    number;


  totalParticipants:
    number;


  correctAnswers:
    number;


  wrongAnswers:
    number;


  totalQuestions:
    number;


  timeTaken?:
    string;


  leaderboardHref?:
    string;


  className?:
    string;

}









export default function CompetitionResult({

  title = "Competition Completed",

  score,

  rank,

  totalParticipants,

  correctAnswers,

  wrongAnswers,

  totalQuestions,

  timeTaken = "45 minutes",

  leaderboardHref = "/student/competitions/leaderboard",

  className,

}: CompetitionResultProps) {


  const accuracy = Math.round(

    (correctAnswers / totalQuestions) * 100

  );







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

        className="text-center"

      >



        <div

          className={cn(

            "mx-auto",

            "mb-4",

            "flex",

            "h-16",

            "w-16",

            "items-center",

            "justify-center",

            "rounded-full",

            "bg-yellow-100",

            "text-yellow-600"

          )}

        >

          <Trophy size={32}/>

        </div>





        <h2

          className="text-2xl font-bold text-slate-900"

        >

          {title}

        </h2>





        <p

          className="mt-2 text-slate-500"

        >

          Great job! Here is your performance summary.

        </p>



      </div>









      {/* Score */}

      <div

        className="my-8 rounded-2xl bg-blue-50 p-6 text-center"

      >


        <p

          className="text-sm text-slate-500"

        >

          Final Score

        </p>



        <p

          className="mt-1 text-4xl font-bold text-blue-600"

        >

          {score}

        </p>



        <p

          className="mt-2 text-sm text-slate-600"

        >

          Rank #{rank} out of {totalParticipants}

        </p>


      </div>









      {/* Stats */}

      <div

        className="grid gap-4 sm:grid-cols-4"

      >



        <StatCard

          icon={<CheckCircle2 size={20}/>}

          label="Correct"

          value={correctAnswers}

          iconClass="text-green-600"

        />



        <StatCard

          icon={<XCircle size={20}/>}

          label="Wrong"

          value={wrongAnswers}

          iconClass="text-red-600"

        />



        <StatCard

          icon={<Target size={20}/>}

          label="Accuracy"

          value={`${accuracy}%`}

          iconClass="text-blue-600"

        />



        <StatCard

          icon={<Clock3 size={20}/>}

          label="Time"

          value={timeTaken}

          iconClass="text-purple-600"

        />



      </div>









      {/* Action */}

      <Link

        href={leaderboardHref}

        className={cn(

          "mt-8",

          "flex",

          "items-center",

          "justify-center",

          "gap-2",

          "rounded-xl",

          "bg-blue-600",

          "px-6",

          "py-3",

          "font-semibold",

          "text-white",

          "transition",

          "hover:bg-blue-700"

        )}

      >

        View Leaderboard

        <ArrowRight size={18}/>

      </Link>




    </section>

  );

}








function StatCard({

  icon,

  label,

  value,

  iconClass,

}: {

  icon: React.ReactNode;

  label: string;

  value: string | number;

  iconClass: string;

}) {


  return (

    <div

      className="rounded-xl border bg-slate-50 p-4"

    >

      <div

        className={cn(

          "mb-2",

          iconClass

        )}

      >

        {icon}

      </div>



      <p

        className="text-xs text-slate-500"

      >

        {label}

      </p>



      <p

        className="font-bold text-slate-900"

      >

        {value}

      </p>



    </div>

  );

}
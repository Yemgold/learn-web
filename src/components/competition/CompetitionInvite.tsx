


"use client";

import {
  useState,
} from "react";


import {
  Copy,
  Check,
  Users,
  Share2,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";







interface CompetitionInviteProps {


  competitionName:
    string;


  inviteCode:
    string;


  teamName?:
    string;


  inviteLink?:
    string;


  className?:
    string;

}









export default function CompetitionInvite({

  competitionName,

  inviteCode,

  teamName = "Your Team",

  inviteLink,

  className,

}: CompetitionInviteProps) {



  const [copied,setCopied] =

    useState(false);








  async function copyInviteCode(){


    await navigator.clipboard.writeText(

      inviteCode

    );


    setCopied(true);



    setTimeout(()=>{

      setCopied(false);

    },2000);


  }









  async function shareInvite(){


    if(

      navigator.share

    ){


      await navigator.share({

        title: competitionName,

        text:

          `Join ${teamName} for ${competitionName}. Invite Code: ${inviteCode}`,

        url: inviteLink,

      });


    } else {


      copyInviteCode();


    }


  }








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

          className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600"

        >

          <Users size={24}/>

        </div>



        <div>


          <h2

            className="text-xl font-bold text-slate-900"

          >

            Invite Teammates

          </h2>



          <p

            className="text-sm text-slate-500"

          >

            {competitionName}

          </p>


        </div>


      </div>









      {/* Team */}

      <div

        className="mb-5 rounded-xl bg-slate-50 p-4"

      >

        <p

          className="text-sm text-slate-500"

        >

          Team

        </p>



        <p

          className="font-semibold text-slate-900"

        >

          {teamName}

        </p>


      </div>









      {/* Code */}

      <div

        className="rounded-xl border p-4"

      >

        <p

          className="mb-2 text-sm text-slate-500"

        >

          Invitation Code

        </p>





        <div

          className="flex items-center justify-between gap-3"

        >

          <span

            className="text-2xl font-bold tracking-widest text-blue-600"

          >

            {inviteCode}

          </span>





          <button

            type="button"

            onClick={copyInviteCode}

            className="rounded-lg border p-2 transition hover:bg-slate-100"

          >

            {
              copied ? (

                <Check size={18}/>

              ) : (

                <Copy size={18}/>

              )
            }

          </button>


        </div>


      </div>









      {/* Share */}

      <button

        type="button"

        onClick={shareInvite}

        className={cn(

          "mt-5",

          "flex",

          "w-full",

          "items-center",

          "justify-center",

          "gap-2",

          "rounded-xl",

          "bg-blue-600",

          "py-3",

          "font-semibold",

          "text-white",

          "transition",

          "hover:bg-blue-700"

        )}

      >

        <Share2 size={18}/>

        Share Invite

      </button>




    </section>

  );

}
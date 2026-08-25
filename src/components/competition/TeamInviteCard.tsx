


"use client";

import {
  Mail,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  UserMinus,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";







export type InviteStatus =

  | "pending"

  | "accepted"

  | "declined";








interface TeamInviteCardProps {


  name:
    string;


  email:
    string;


  status:
    InviteStatus;


  onResend?:
    () => void;


  onRemove?:
    () => void;


  className?:
    string;

}








const statusConfig = {


  pending: {

    label: "Pending",

    icon: Clock3,

    style:
      "bg-yellow-100 text-yellow-700",

  },


  accepted: {

    label: "Accepted",

    icon: CheckCircle2,

    style:
      "bg-green-100 text-green-700",

  },


  declined: {

    label: "Declined",

    icon: XCircle,

    style:
      "bg-red-100 text-red-700",

  },

};








export default function TeamInviteCard({

  name,

  email,

  status,

  onResend,

  onRemove,

  className,

}: TeamInviteCardProps) {



  const config =

    statusConfig[status];



  const StatusIcon =

    config.icon;








  return (

    <div

      className={cn(

        "flex",

        "items-center",

        "justify-between",

        "rounded-2xl",

        "border",

        "bg-white",

        "p-4",

        className

      )}

    >





      {/* User info */}

      <div

        className="flex items-center gap-3"

      >

        <div

          className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600"

        >

          <Mail size={20}/>

        </div>






        <div>


          <h3

            className="font-semibold text-slate-900"

          >

            {name}

          </h3>




          <p

            className="text-sm text-slate-500"

          >

            {email}

          </p>


        </div>


      </div>









      {/* Actions */}

      <div

        className="flex items-center gap-3"

      >





        <span

          className={cn(

            "flex",

            "items-center",

            "gap-1",

            "rounded-full",

            "px-3",

            "py-1",

            "text-xs",

            "font-semibold",

            config.style

          )}

        >

          <StatusIcon size={14}/>

          {config.label}

        </span>







        {
          status === "pending" && (

            <button

              type="button"

              onClick={onResend}

              className="rounded-lg border p-2 hover:bg-slate-50"

              title="Resend invitation"

            >

              <RefreshCw size={16}/>

            </button>

          )
        }







        {
          status !== "accepted" && (

            <button

              type="button"

              onClick={onRemove}

              className="rounded-lg border p-2 text-red-600 hover:bg-red-50"

              title="Remove member"

            >

              <UserMinus size={16}/>

            </button>

          )
        }



      </div>



    </div>

  );

}
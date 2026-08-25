


"use client";

import * as React from "react";

import {
  cn,
} from "@/lib/utils";



interface ChartTooltipProps {


  active?: boolean;



  payload?: Array<{

    name?: string;

    value?: string | number;

    color?: string;

  }>;



  label?: string;



  className?: string;


}







export function ChartTooltip({

  active,

  payload,

  label,

  className,

}: ChartTooltipProps) {



  if (

    !active ||

    !payload ||

    payload.length === 0

  ) {

    return null;

  }







  return (

    <div

      className={cn(

        "rounded-lg",

        "border",

        "bg-white",

        "p-3",

        "shadow-lg",

        "text-sm",

        className

      )}

    >




      {
        label && (

          <p

            className="mb-2 font-medium text-slate-900"

          >

            {label}

          </p>

        )
      }








      <div

        className="space-y-1"

      >


        {
          payload.map(

            (item, index) => (


              <div

                key={
                  index
                }

                className="flex items-center justify-between gap-6"

              >



                <span

                  className="flex items-center gap-2 text-slate-600"

                >


                  <span

                    className="h-2 w-2 rounded-full"

                    style={{

                      backgroundColor:
                        item.color,

                    }}

                  />



                  {
                    item.name
                  }



                </span>







                <span

                  className="font-semibold text-slate-900"

                >

                  {
                    item.value
                  }

                </span>



              </div>


            )

          )
        }


      </div>



    </div>

  );

}
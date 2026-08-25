


"use client";

import * as React from "react";

import {
  Inbox,
} from "lucide-react";


import {
  cn,
} from "@/lib/utils";


import {
  tableEmptyVariants,
} from "./table.variants";



interface EmptyStateProps {


  message?: React.ReactNode;



  columnsCount?: number;



  title?: React.ReactNode;



  action?: React.ReactNode;



  className?: string;


}







export function EmptyState({

  message = "No data available",

  columnsCount = 1,

  title,

  action,

  className,

}: EmptyStateProps) {



  return (

    <tbody>


      <tr>

        <td

          colSpan={
            columnsCount
          }

        >

          <div

            className={cn(

              tableEmptyVariants(),

              "flex-col",

              "gap-3",

              className

            )}

          >


            <Inbox

              size={40}

              className="text-slate-400"

            />





            {
              title && (

                <h3

                  className="font-medium text-slate-700"

                >

                  {title}

                </h3>

              )
            }







            <p

              className="text-sm text-slate-500"

            >

              {message}

            </p>








            {
              action && (

                <div>

                  {action}

                </div>

              )
            }





          </div>


        </td>


      </tr>


    </tbody>

  );

}
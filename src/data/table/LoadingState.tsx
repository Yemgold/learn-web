



"use client";

import * as React from "react";

import {
  Skeleton,
} from "@/components/ui/skeleton";



import {
  cn,
} from "@/lib/utils";



interface LoadingStateProps {


  columnsCount?: number;



  rowsCount?: number;



  className?: string;


}







export function LoadingState({

  columnsCount = 5,

  rowsCount = 5,

  className,

}: LoadingStateProps) {



  return (

    <tbody

      className={cn(
        className
      )}

    >


      {
        Array.from({

          length: rowsCount,

        }).map((_, rowIndex) => (


          <tr

            key={
              rowIndex
            }

            className="border-b"

          >


            {
              Array.from({

                length:
                  columnsCount,

              }).map((_, columnIndex) => (


                <td

                  key={
                    columnIndex
                  }

                  className="px-4 py-3"

                >

                  <Skeleton

                    height={20}

                    width="100%"

                  />


                </td>


              ))

            }


          </tr>


        ))
      }


    </tbody>

  );

}
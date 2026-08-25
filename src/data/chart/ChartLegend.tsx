


"use client";

import * as React from "react";

import {
  cn,
} from "@/lib/utils";


import {
  chartLegendVariants,
} from "./chart.variants";


import type {
  ChartSeries,
} from "./types";



interface ChartLegendProps {


  series:
    ChartSeries[];



  className?: string;


}







export function ChartLegend({

  series,

  className,

}: ChartLegendProps) {



  return (

    <div

      className={cn(

        chartLegendVariants(),

        className

      )}

    >





      {
        series.map(

          (item) => (


            <div

              key={
                item.dataKey
              }


              className="flex items-center gap-2"

            >



              <span

                className="h-3 w-3 rounded-full"

                style={{

                  backgroundColor:
                    item.color
                    ??
                    "currentColor",

                }}

              />





              <span

                className="text-slate-600"

              >

                {
                  item.name
                  ??
                  item.dataKey
                }


              </span>



            </div>


          )

        )
      }





    </div>

  );

}
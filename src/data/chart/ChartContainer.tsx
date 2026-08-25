



"use client";

import * as React from "react";

import {
  cn,
} from "@/lib/utils";


import {
  chartWrapperVariants,
  chartHeaderVariants,
  chartTitleVariants,
  chartDescriptionVariants,
  chartContentVariants,
  chartLoadingVariants,
} from "./chart.variants";


import type {
  ChartSize,
} from "./types";



interface ChartContainerProps {


  children:
    React.ReactNode;



  title?:
    React.ReactNode;



  description?:
    React.ReactNode;



  size?:
    ChartSize;



  height?:
    number;



  loading?:
    boolean;



  className?:
    string;


}







export function ChartContainer({

  children,

  title,

  description,

  size = "md",

  height,

  loading = false,

  className,

}: ChartContainerProps) {



  return (

    <div

      className={cn(

        chartWrapperVariants({

          size,

        }),

        className

      )}

    >




      {
        (title || description) && (

          <div

            className={
              chartHeaderVariants()
            }

          >



            {
              title && (

                <h3

                  className={
                    chartTitleVariants()
                  }

                >

                  {title}

                </h3>

              )
            }






            {
              description && (

                <p

                  className={
                    chartDescriptionVariants()
                  }

                >

                  {description}

                </p>

              )
            }




          </div>

        )
      }







      <div

        className={
          chartContentVariants()
        }


        style={{

          height,

        }}

      >



        {
          loading && (

            <div

              className={
                chartLoadingVariants()
              }

            >

              <div

                className="text-sm text-slate-500"

              >

                Loading chart...

              </div>


            </div>

          )
        }






        {children}




      </div>



    </div>

  );

}
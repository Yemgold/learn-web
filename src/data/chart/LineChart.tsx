


"use client";

import * as React from "react";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";


import type {
  ChartData,
  ChartSeries,
} from "./types";



interface LineChartProps {


  data:
    ChartData[];



  series:
    ChartSeries[];



  height?: number;



  showGrid?: boolean;



  showLegend?: boolean;


}







export function LineChart({

  data,

  series,

  height = 320,

  showGrid = true,

  showLegend = true,

}: LineChartProps) {



  return (

    <ResponsiveContainer

      width="100%"

      height={height}

    >

      <RechartsLineChart

        data={data}

      >





        {
          showGrid && (

            <CartesianGrid

              strokeDasharray="3 3"

            />

          )
        }






        <XAxis

          dataKey="name"

        />






        <YAxis />






        <Tooltip />






        {
          showLegend && (

            <Legend />

          )
        }








        {
          series.map(

            (item) => (


              <Line


                key={
                  item.dataKey
                }


                type="monotone"


                dataKey={
                  item.dataKey
                }


                name={
                  item.name
                  ??
                  item.dataKey
                }


                stroke={
                  item.color
                  ??
                  "currentColor"
                }


                strokeWidth={2}


                dot={true}


                activeDot={{

                  r: 6,

                }}


              />


            )

          )
        }





      </RechartsLineChart>


    </ResponsiveContainer>

  );

}
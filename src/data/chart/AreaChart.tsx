


"use client";

import * as React from "react";

import {
  AreaChart as RechartsAreaChart,
  Area,
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



interface AreaChartProps {


  data:
    ChartData[];



  series:
    ChartSeries[];



  height?: number;



  showGrid?: boolean;



  showLegend?: boolean;


}







export function AreaChart({

  data,

  series,

  height = 320,

  showGrid = true,

  showLegend = true,

}: AreaChartProps) {



  return (

    <ResponsiveContainer

      width="100%"

      height={height}

    >

      <RechartsAreaChart

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


              <Area


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


                fill={
                  item.color
                  ??
                  "currentColor"
                }


                fillOpacity={0.25}


              />


            )

          )
        }





      </RechartsAreaChart>


    </ResponsiveContainer>

  );

}
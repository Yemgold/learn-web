



"use client";

import * as React from "react";

import {
  BarChart as RechartsBarChart,
  Bar,
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



interface BarChartProps {


  data:
    ChartData[];



  series:
    ChartSeries[];



  height?: number;



  showGrid?: boolean;



  showLegend?: boolean;


}







export function BarChart({

  data,

  series,

  height = 320,

  showGrid = true,

  showLegend = true,

}: BarChartProps) {



  return (

    <ResponsiveContainer

      width="100%"

      height={height}

    >

      <RechartsBarChart

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


              <Bar


                key={
                  item.dataKey
                }


                dataKey={
                  item.dataKey
                }


                name={
                  item.name
                  ??
                  item.dataKey
                }


                fill={
                  item.color
                  ??
                  "currentColor"
                }


                stackId={
                  item.stackId
                }


              />


            )

          )
        }





      </RechartsBarChart>


    </ResponsiveContainer>

  );

}
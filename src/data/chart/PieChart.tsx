


"use client";

import * as React from "react";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


import type {
  ChartData,
  ChartSeries,
} from "./types";



interface PieChartProps {


  data:
    ChartData[];



  series:
    ChartSeries[];



  height?: number;



  showLegend?: boolean;



  showTooltip?: boolean;


}







export function PieChart({

  data,

  series,

  height = 320,

  showLegend = true,

  showTooltip = true,

}: PieChartProps) {



  const dataKey =
    series[0]?.dataKey;






  return (

    <ResponsiveContainer

      width="100%"

      height={height}

    >


      <RechartsPieChart>





        {
          showTooltip && (

            <Tooltip />

          )
        }







        {
          showLegend && (

            <Legend />

          )
        }







        <Pie


          data={
            data
          }


          dataKey={
            dataKey
          }


          nameKey="name"


          cx="50%"


          cy="50%"


          outerRadius={110}


          label


        >



          {
            data.map(

              (_, index) => (


                <Cell


                  key={
                    index
                  }


                  fill={
                    series[0]?.color
                    ??
                    undefined
                  }


                />


              )

            )
          }



        </Pie>





      </RechartsPieChart>


    </ResponsiveContainer>

  );

}
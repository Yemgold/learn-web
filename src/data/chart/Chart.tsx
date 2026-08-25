



"use client";

import * as React from "react";

import {
  ChartContainer,
} from "./ChartContainer";


import {
  BarChart,
} from "./BarChart";


import {
  LineChart,
} from "./LineChart";


import {
  PieChart,
} from "./PieChart";


import {
  AreaChart,
} from "./AreaChart";


import type {
  ChartProps,
} from "./types";







const Chart = React.forwardRef<
  HTMLDivElement,
  ChartProps
>((props, ref) => {


  const {


    type = "bar",

    data,

    series,

    title,

    description,

    size = "md",

    height = 320,

    loading = false,

    className,


  } = props;






  const chartComponent = React.useMemo(() => {


    switch (type) {


      case "line":

        return (

          <LineChart

            data={data}

            series={series}

          />

        );




      case "pie":

        return (

          <PieChart

            data={data}

            series={series}

          />

        );




      case "area":

        return (

          <AreaChart

            data={data}

            series={series}

          />

        );




      case "bar":

      default:

        return (

          <BarChart

            data={data}

            series={series}

          />

        );


    }


  }, [

    type,

    data,

    series,

  ]);







  return (

    <div

      ref={ref}

    >

      <ChartContainer


        title={title}


        description={description}


        size={size}


        height={height}


        loading={loading}


        className={className}


      >

        {chartComponent}


      </ChartContainer>


    </div>

  );

});






Chart.displayName =
  "Chart";




export default Chart;
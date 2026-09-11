




"use client";

import { TrendingUp } from "lucide-react";

import { LineChart } from "@/data/chart";
import type { ChartData } from "@/data/chart/types";
import { cn } from "@/lib/utils";

export interface PerformanceChartProps {
  title?: string;
  subtitle?: string;
  data: ChartData[];
  className?: string;
}

export default function PerformanceChart({
  title = "Performance Overview",
  subtitle = "Your scores over recent practice sessions and competitions.",
  data,
  className,
}: PerformanceChartProps) {
  return (
    <section
      className={cn(
        `
          mx-2
          w-[calc(100%-1rem)]
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:mx-3
          sm:w-[calc(100%-1.5rem)]
          sm:p-5
        `,
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {subtitle}
          </p>
        </div>

        <div className="shrink-0 rounded-lg bg-blue-50 p-2 sm:rounded-xl sm:p-2.5">
          <TrendingUp className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full sm:h-72">
        <LineChart
          data={data}
          height={288}
          showGrid
          showLegend={false}
          series={[
            {
              dataKey: "score",
              name: "Score",
              color: "#2563EB",
            },
          ]}
        />
      </div>
    </section>
  );
}
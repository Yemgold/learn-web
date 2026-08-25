


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
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3">
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <div className="h-80">
  <LineChart
    data={data}
    height={320}
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
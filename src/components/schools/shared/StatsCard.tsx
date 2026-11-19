



import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  iconClassName?: string;
  className?: string;
};

export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  iconClassName = "bg-blue-50 text-blue-600",
  className = "",
}: StatsCardProps) {
  const trendStyles = {
    up: "bg-green-50 text-green-700",
    down: "bg-red-50 text-red-700",
    neutral: "bg-gray-100 text-gray-600",
  };

  const TrendIcon = trend
    ? {
        up: ArrowUpRight,
        down: ArrowDownRight,
        neutral: Minus,
      }[trend.direction]
    : null;

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {trend && TrendIcon && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${trendStyles[trend.direction]}`}
          >
            <TrendIcon size={14} />
            {trend.value}
          </span>
        )}

        {trend?.label && (
          <span className="text-xs text-gray-500">{trend.label}</span>
        )}

        {description && !trend?.label && (
          <span className="text-xs text-gray-500">{description}</span>
        )}
      </div>
    </div>
  );
}

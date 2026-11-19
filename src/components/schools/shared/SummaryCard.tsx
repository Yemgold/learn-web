





import type { SummaryCardProps } from "@/types/schools/enrollment.types"; 

export default function SummaryCard({
  title,
  value,
  icon,
  color,
  loading,
}: SummaryCardProps) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`rounded-xl p-2.5 ${styles[color]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-100" />
        ) : (
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

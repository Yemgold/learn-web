"use client";

import type { ReactNode } from "react";

import Card, {
  CardContent,
} from "@/components/schools/ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "blue" | "green" | "orange" | "purple";
}

export default function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          </div>

          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

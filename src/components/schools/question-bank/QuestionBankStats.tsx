


"use client";

import {
  Archive,
  BookOpen,
  FileEdit,
  Globe,
  Loader2,
} from "lucide-react";

import type {
  QuestionBankStatsProps,
} from "@/types/schools/question-bank.types";

export default function QuestionBankStats({
  summary,
  loading,
}: QuestionBankStatsProps) {
  const stats = [
    {
      label: "Total Questions",
      value: summary.total,
      description: "All questions in your bank",
      icon: BookOpen,
      iconStyle: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Published",
      value: summary.published,
      description: "Available for use",
      icon: Globe,
      iconStyle: "bg-green-100 text-green-600",
    },
    {
      label: "Drafts",
      value: summary.draft,
      description: "Not yet published",
      icon: FileEdit,
      iconStyle: "bg-amber-100 text-amber-600",
    },
    {
      label: "Archived",
      value: summary.archived,
      description: "Inactive questions",
      icon: Archive,
      iconStyle: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  ) : (
                    <p className="text-3xl font-bold tracking-tight text-gray-900">
                      {(stat.value ?? 0).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

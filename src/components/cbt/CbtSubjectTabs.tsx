


"use client";

import React from "react";

export interface CbtSubjectTab {
  id: string;
  name: string;
  answered: number;
  total: number;
  index: number;
}

export interface CbtSubjectTabsProps {
  subjects: CbtSubjectTab[];
  activeSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
}

export default function CbtSubjectTabs({
  subjects,
  activeSubjectId,
  onSelectSubject,
}: CbtSubjectTabsProps) {
  if (subjects.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {subjects.map((subject) => {
        const isActive =
          subject.id === activeSubjectId;

        return (
          <button
            key={subject.id}
            type="button"
            onClick={() =>
              onSelectSubject(subject.id)
            }
            className={[
              "min-w-[150px] rounded-xl border px-4 py-3 text-left transition",
              isActive
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-semibold">
                {subject.name}
              </span>

              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                {subject.index + 1}
              </span>
            </div>

            <div
              className={[
                "mt-1 text-xs",
                isActive
                  ? "text-blue-100"
                  : "text-slate-500",
              ].join(" ")}
            >
              {subject.answered} / {subject.total} answered
            </div>
          </button>
        );
      })}
    </div>
  );
}





// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\admin\quiz-competition\CompetitionSummary.tsx

"use client";

import { Card } from "@/components/ui/card";

type Props = {
  totalRounds: number;
  eliminationRounds: number;
  totalQuestions: number;
  remainingAfterExits: number;
};

export default function CompetitionSummary({
  totalRounds,
  eliminationRounds,
  totalQuestions,
  remainingAfterExits,
}: Props) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Competition Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of the competition
          structure.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryItem
          label="Total Rounds"
          value={totalRounds}
        />

        <SummaryItem
          label="Elimination Rounds"
          value={eliminationRounds}
        />

        <SummaryItem
          label="Total Questions"
          value={totalQuestions}
        />

        <SummaryItem
          label="Contestants Remaining"
          value={remainingAfterExits}
          danger={
            remainingAfterExits <= 0
          }
        />
      </div>
    </Card>
  );
}

function SummaryItem({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          danger
            ? "text-red-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
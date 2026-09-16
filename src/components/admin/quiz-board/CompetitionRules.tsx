




"use client";

import { Settings2 } from "lucide-react";

function RuleRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <span className="text-xs font-semibold text-slate-500">
        {label}
      </span>

      <span className="text-right text-xs font-black text-slate-800">
        {value}
      </span>
    </div>
  );
}

export default function CompetitionRules() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Settings2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-black text-slate-950">
            Competition Rules
          </h2>

          <p className="text-xs text-slate-500">
            Backend configuration
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <RuleRow
          label="Contestants"
          value="20"
        />

        <RuleRow
          label="Rounds"
          value="5"
        />

        <RuleRow
          label="Timing"
          value="Per question"
        />

        <RuleRow
          label="Difficulty"
          value="Easy / Medium / Hard"
        />

        <RuleRow
          label="Rewards"
          value="Position + Exit"
        />
      </div>
    </section>
  );
}
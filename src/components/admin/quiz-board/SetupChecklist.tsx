




"use client";

import {
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

function ChecklistItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <div>
        <p className="text-sm font-bold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function SetupChecklist() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FileCheck2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-black text-slate-950">
            Setup Checklist
          </h2>

          <p className="text-xs text-slate-500">
            Before starting a competition
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <ChecklistItem
          title="Competition configured"
          description="Title, subject and schedule"
        />

        <ChecklistItem
          title="Questions configured"
          description="Questions distributed by difficulty"
        />

        <ChecklistItem
          title="Rewards configured"
          description="First, second and exit rewards"
        />

        <ChecklistItem
          title="Rounds configured"
          description="Elimination and timing rules"
        />
      </div>
    </section>
  );
}
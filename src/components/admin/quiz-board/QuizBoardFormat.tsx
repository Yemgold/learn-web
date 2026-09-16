



"use client";

import { Zap } from "lucide-react";

export default function QuizBoardFormat() {
  const rounds = [
    ["Round 1", "20 contestants"],
    ["Round 2", "After Round 1"],
    ["Round 3", "After Round 2"],
    ["Round 4", "After Round 3"],
    ["Final", "Champion"],
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
          <Zap className="h-5 w-5 text-amber-600" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950">
            Quiz Board Format
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Contestants progress through multiple
            elimination stages and a final
            championship round.
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Competition configuration
            </p>

            <p className="mt-1 text-lg font-black text-slate-950">
              20 Contestants • 5 Rounds
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-2 text-sm font-black text-blue-700 shadow-sm">
            Final champion
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {rounds.map(
          ([round, description], index) => (
            <div
              key={round}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {round}
                </span>

                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-blue-600 shadow-sm">
                  {index + 1}
                </span>
              </div>

              <p className="mt-3 text-sm font-black text-slate-900">
                {description}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {index === 4
                  ? "Determine the champion"
                  : "Elimination stage"}
              </p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
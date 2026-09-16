




"use client";

import { Zap } from "lucide-react";

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function QuizBoardFooter() {
  return (
    <section className="mt-8 rounded-3xl bg-slate-950 p-6 sm:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <ShieldIcon />
          </div>

          <div>
            <p className="text-sm font-black text-white">
              Quiz Board administration
            </p>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
              Competition timing, answer order,
              qualification, elimination and final
              results should ultimately be controlled
              by the backend to ensure fair
              real-time competition.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Zap className="h-4 w-4" />
          Configure • Monitor • Compete
        </div>
      </div>
    </section>
  );
}
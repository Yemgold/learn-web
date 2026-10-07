





"use client";

import { Lightbulb } from "lucide-react";

interface ClueCardProps {
  clue: string;
  visible?: boolean;
  reducedPoints?: number;
}

export default function ClueCard({
  clue,
  visible = true,
  reducedPoints,
}: ClueCardProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] shadow-lg shadow-amber-500/5">
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
          <Lightbulb className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-extrabold tracking-wide text-amber-300">
              💡 YOU NEED A CLUE
            </p>

            {typeof reducedPoints === "number" && (
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-white/50">
                Reward: {reducedPoints} pts
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-white/75 sm:text-base">
            {clue}
          </p>
        </div>
      </div>

      <div className="h-px bg-amber-400/10" />

      <div className="px-4 py-2.5 sm:px-5">
        <p className="text-center text-[11px] font-medium uppercase tracking-wider text-white/35">
          Your reward has been reduced — solve it to win the points shown above
        </p>
      </div>
    </div>
  );
}

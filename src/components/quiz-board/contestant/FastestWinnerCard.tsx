







// src\components\quiz-board\contestant\FastestWinnerCard.tsx

"use client";

import {
  Crown,
  Trophy,
  Zap,
} from "lucide-react";

interface FastestWinnerCardProps {
  winnerName?: string | null;
  winnerEmail?: string | null;
  showEmail?: boolean;
  title?: string;
  message?: string;
  className?: string;
}

export function FastestWinnerCard({
  winnerName,
  winnerEmail,
  showEmail = false,
  title = "Fastest Correct Answer",
  message = "Answered correctly before everyone else.",
  className = "",
}: FastestWinnerCardProps) {
  /*
   * Do not display the card if there is no winner yet.
   */
  if (!winnerName && !winnerEmail) {
    return null;
  }

  const displayName =
    winnerName?.trim() ||
    winnerEmail?.trim() ||
    "Contestant";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-yellow-500/20",
        "bg-yellow-500/[0.06]",
        "p-4",
        "shadow-lg shadow-yellow-950/10",
        className,
      ].join(" ")}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-400/10 blur-2xl" />

      <div className="relative flex items-center gap-3">
        {/* Trophy */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10">
          <Trophy className="h-6 w-6 text-yellow-400" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 shrink-0 text-yellow-400" />

            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
              {title}
            </p>
          </div>

          <h3 className="mt-1 truncate text-base font-bold text-white">
            {displayName}
          </h3>

          {showEmail && winnerEmail ? (
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {winnerEmail}
            </p>
          ) : null}
        </div>

        {/* Fastest indicator */}
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1">
          <Zap className="h-3.5 w-3.5 text-yellow-400" />

          <span className="text-[11px] font-bold text-yellow-400">
            FASTEST
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="relative mt-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2">
        <p className="text-xs leading-5 text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}

export default FastestWinnerCard;







"use client";

import { Coins, TrendingDown, Zap } from "lucide-react";

interface PointsDisplayProps {
  currentPoints: number;
  startingPoints: number;
  clueUsed?: boolean;
  cluePenalty?: number;
  disabled?: boolean;
}

export default function PointsDisplay({
  currentPoints,
  startingPoints,
  clueUsed = false,
  cluePenalty,
  disabled = false,
}: PointsDisplayProps) {
  const safeStartingPoints = Math.max(0, startingPoints);
  const safeCurrentPoints = Math.max(0, currentPoints);

  const pointsLost = Math.max(
    0,
    safeStartingPoints - safeCurrentPoints,
  );

  const rewardPercentage =
    safeStartingPoints > 0
      ? Math.round(
          (safeCurrentPoints / safeStartingPoints) * 100,
        )
      : 0;

  return (
    <section
      aria-label="Current reward"
      className={[
        "relative w-full overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.045]",
        "shadow-lg shadow-black/10 backdrop-blur-md",
        disabled ? "opacity-60" : "",
      ].join(" ")}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl transition-all duration-500",
          clueUsed ? "bg-amber-400/10" : "bg-emerald-400/10",
        ].join(" ")}
      />

      <div className="relative p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          {/* Label */}
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                clueUsed
                  ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                  : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
              ].join(" ")}
            >
              {clueUsed ? (
                <TrendingDown className="h-5 w-5" />
              ) : (
                <Coins className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                {clueUsed ? "Reduced Reward" : "Current Reward"}
              </p>

              <p className="mt-0.5 truncate text-xs text-white/45">
                {clueUsed
                  ? "Clue used — keep going!"
                  : "Solve faster to earn more"}
              </p>
            </div>
          </div>

          {/* Points */}
          <div className="flex shrink-0 items-center gap-1.5">
            <Zap
              className={[
                "h-4 w-4",
                clueUsed
                  ? "text-amber-300"
                  : "text-emerald-300",
              ].join(" ")}
            />

            <span
              className={[
                "text-2xl font-black tabular-nums sm:text-3xl",
                clueUsed
                  ? "text-amber-300"
                  : "text-white",
              ].join(" ")}
            >
              {safeCurrentPoints}
            </span>

            <span className="text-xs font-bold text-white/35">
              pts
            </span>
          </div>
        </div>

        {/* Reward progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-medium text-white/30">
              Reward value
            </span>

            <span className="text-[10px] font-bold tabular-nums text-white/40">
              {rewardPercentage}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className={[
                "h-full rounded-full transition-all duration-500",
                clueUsed
                  ? "bg-amber-400"
                  : "bg-emerald-400",
              ].join(" ")}
              style={{
                width: `${rewardPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Points lost / clue information */}
        {(pointsLost > 0 || clueUsed) && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5 text-red-300/70" />

              <span className="text-[11px] font-medium text-white/40">
                {pointsLost > 0
                  ? `${pointsLost} pts lost`
                  : "Reward reduced"}
              </span>
            </div>

            {typeof cluePenalty === "number" && cluePenalty > 0 && (
              <span className="text-[11px] font-semibold text-amber-300/70">
                Clue: -{cluePenalty} pts
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}







"use client";

import { Clock3 } from "lucide-react";

interface CountdownProps {
  timeLeft: number;
  totalTime: number;
  clueThreshold?: number;
  disabled?: boolean;
}

export default function Countdown({
  timeLeft,
  totalTime,
  clueThreshold = 9,
  disabled = false,
}: CountdownProps) {
  const safeTotalTime = Math.max(totalTime, 1);
  const safeTimeLeft = Math.max(0, timeLeft);

  const progress = Math.min(
    100,
    Math.max(0, (safeTimeLeft / safeTotalTime) * 100),
  );

  const isExpired = safeTimeLeft <= 0;
  const isClueTime =
    safeTimeLeft <= clueThreshold && !isExpired;
  const isCritical =
    safeTimeLeft <= Math.max(3, Math.floor(clueThreshold / 2)) &&
    !isExpired;

  const minutes = Math.floor(safeTimeLeft / 60);
  const seconds = safeTimeLeft % 60;

  const formattedTime =
    minutes > 0
      ? `${minutes}:${seconds.toString().padStart(2, "0")}`
      : `${seconds}`;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={[
              "flex h-9 w-9 items-center justify-center rounded-xl",
              "border transition-all duration-300",
              isExpired
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : isCritical
                  ? "border-red-400/30 bg-red-400/10 text-red-300"
                  : isClueTime
                    ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                    : "border-white/10 bg-white/[0.05] text-white/70",
            ].join(" ")}
          >
            <Clock3
              className={[
                "h-4 w-4",
                isCritical && !disabled ? "animate-pulse" : "",
              ].join(" ")}
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">
              Time left
            </p>

            {isClueTime && !isExpired && (
              <p className="text-[10px] font-semibold text-amber-300">
                Clue approaching
              </p>
            )}
          </div>
        </div>

        <div
          className={[
            "font-mono text-2xl font-black tabular-nums transition-colors duration-300 sm:text-3xl",
            isExpired
              ? "text-red-400"
              : isCritical
                ? "text-red-300"
                : isClueTime
                  ? "text-amber-300"
                  : "text-white",
          ].join(" ")}
          aria-live="polite"
          aria-label={`${safeTimeLeft} seconds remaining`}
        >
          {formattedTime}
          {minutes === 0 && !isExpired && (
            <span className="ml-1 text-sm font-semibold text-white/40">
              sec
            </span>
          )}
        </div>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className={[
            "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-linear",
            isExpired
              ? "bg-red-500"
              : isCritical
                ? "bg-red-400"
                : isClueTime
                  ? "bg-amber-400"
                  : "bg-white",
          ].join(" ")}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] font-medium text-white/30">
          {isExpired
            ? "Time is up"
            : isClueTime
              ? "Clue stage"
              : "Solve quickly to earn more"}
        </span>

        <span className="text-[10px] font-medium text-white/30">
          {safeTotalTime}s round
        </span>
      </div>
    </div>
  );
}
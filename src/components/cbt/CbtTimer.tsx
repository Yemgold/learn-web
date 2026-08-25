





"use client";

import { useEffect } from "react";
import { Clock3 } from "lucide-react";

export interface CbtTimerProps {
  durationInMinutes: number;
  timeRemainingSeconds: number;
  onTimeUp: () => void;
}

export default function CbtTimer({
  durationInMinutes,
  timeRemainingSeconds,
  onTimeUp,
}: CbtTimerProps) {
  useEffect(() => {
    if (timeRemainingSeconds <= 0) {
      onTimeUp();
    }
  }, [timeRemainingSeconds, onTimeUp]);

  const safeSeconds = Math.max(
    0,
    timeRemainingSeconds,
  );

  const hours = Math.floor(
    safeSeconds / 3600,
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60,
  );

  const seconds = safeSeconds % 60;

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(
          minutes,
        ).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0",
        )}`
      : `${String(minutes).padStart(
          2,
          "0",
        )}:${String(seconds).padStart(2, "0")}`;

  const totalSeconds =
    Math.max(0, durationInMinutes) * 60;

  const percentage =
    totalSeconds > 0
      ? (safeSeconds / totalSeconds) * 100
      : 0;

  const isDanger =
    safeSeconds <= 60;

  const isWarning =
    safeSeconds <= 300 &&
    safeSeconds > 60;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-2 ${
        isDanger
          ? "border-red-200 bg-red-50 text-red-700"
          : isWarning
            ? "border-orange-200 bg-orange-50 text-orange-700"
            : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <Clock3 className="h-5 w-5" />

      <div>
        <p className="text-xs font-medium uppercase tracking-wide">
          Time Remaining
        </p>

        <p className="font-mono text-xl font-bold">
          {formattedTime}
        </p>
      </div>

      <div className="hidden h-2 w-20 overflow-hidden rounded-full bg-slate-200 sm:block">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(
              100,
              Math.max(0, percentage),
            )}%`,
          }}
        />
      </div>
    </div>
  );
}
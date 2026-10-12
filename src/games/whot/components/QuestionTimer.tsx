



"use client";

import { AlertTriangle, Clock3 } from "lucide-react";
import { memo, useEffect, useRef } from "react";

export interface QuestionTimerProps {
  timeRemaining: number | null;
  totalSeconds?: number;
  isActive?: boolean;
  warningThreshold?: number;
  showProgress?: boolean;
  showLabel?: boolean;
  onTimeout?: () => void;
  className?: string;
  compact?: boolean;
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function QuestionTimerComponent({
  timeRemaining,
  totalSeconds = 15,
  isActive = true,
  warningThreshold = 5,
  showProgress = true,
  showLabel = true,
  onTimeout,
  className = "",
  compact = false,
}: QuestionTimerProps) {
  const timeoutCalledRef = useRef(false);

  const remaining = timeRemaining === null
    ? null
    : Math.max(0, timeRemaining);

  const isExpired = remaining !== null && remaining <= 0;

  const isUrgent =
    remaining !== null &&
    remaining > 0 &&
    remaining <= warningThreshold;

  const progress =
    remaining === null || totalSeconds <= 0
      ? 100
      : Math.max(
          0,
          Math.min(100, (remaining / totalSeconds) * 100),
        );

  useEffect(() => {
    if (!isActive || !isExpired) {
      if (!isExpired) {
        timeoutCalledRef.current = false;
      }
      return;
    }

    if (timeoutCalledRef.current) return;

    timeoutCalledRef.current = true;
    onTimeout?.();
  }, [isActive, isExpired, onTimeout]);

  const toneClasses = isExpired
    ? "text-rose-400"
    : isUrgent
      ? "text-rose-400"
      : "text-cyan-300";

  const progressClasses = isExpired || isUrgent
    ? "bg-rose-500"
    : "bg-cyan-400";

  return (
    <div
      aria-label={
        remaining === null
          ? "Question timer not available"
          : `Time remaining: ${formatTime(remaining)}`
      }
      className={`w-full ${className}`}
      role="group"
    >
      <div
        className={`flex items-center justify-between gap-3 ${
          compact ? "mb-2" : "mb-3"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          {isUrgent || isExpired ? (
            <AlertTriangle
              aria-hidden="true"
              className={`shrink-0 ${toneClasses} ${
                compact ? "h-4 w-4" : "h-5 w-5"
              }`}
            />
          ) : (
            <Clock3
              aria-hidden="true"
              className={`shrink-0 ${toneClasses} ${
                compact ? "h-4 w-4" : "h-5 w-5"
              }`}
            />
          )}

          {showLabel && (
            <span className="truncate text-sm font-medium text-slate-300">
              {isExpired
                ? "Time is up"
                : isUrgent
                  ? "Hurry up!"
                  : "Time remaining"}
            </span>
          )}
        </div>

        <span
          aria-live="off"
          className={`shrink-0 font-mono font-black tabular-nums ${
            compact ? "text-lg" : "text-2xl"
          } ${toneClasses} ${
            isUrgent && isActive ? "animate-pulse" : ""
          }`}
        >
          {remaining === null ? "--:--" : formatTime(remaining)}
        </span>
      </div>

      {showProgress && (
        <div
          aria-label="Question time remaining"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progress)}
          className={`w-full overflow-hidden rounded-full bg-slate-800 ${
            compact ? "h-1.5" : "h-2.5"
          }`}
          role="progressbar"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-200 ease-linear ${progressClasses}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {isExpired && (
        <p
          aria-live="assertive"
          className="mt-2 text-xs font-semibold text-rose-300"
        >
          Your answering time has ended.
        </p>
      )}
    </div>
  );
}

const QuestionTimer = memo(QuestionTimerComponent);

QuestionTimer.displayName = "QuestionTimer";

export default QuestionTimer;

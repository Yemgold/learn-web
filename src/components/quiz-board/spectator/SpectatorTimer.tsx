





"use client";

import {
  Clock3,
  Lock,
  Radio,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

export interface SpectatorTimerProps {
  startedAt?: string | null;

  expiresAt?: string | null;

  timeLimit?: number | null;

  active?: boolean;

  locked?: boolean;

  onExpire?: () => void;

  title?: string;

  showProgress?: boolean;

  showState?: boolean;

  compact?: boolean;
}

function getRemainingSeconds(
  expiresAt?: string | null,
) {
  if (!expiresAt) {
    return null;
  }

  const expires =
    new Date(expiresAt).getTime();

  if (!Number.isFinite(expires)) {
    return null;
  }

  return Math.max(
    0,
    Math.ceil(
      (expires - Date.now()) / 1000,
    ),
  );
}

export default function SpectatorTimer({
  startedAt = null,

  expiresAt = null,

  timeLimit = null,

  active = false,

  locked = false,

  onExpire,

  title = "Question Timer",

  showProgress = true,

  showState = true,

  compact = false,
}: SpectatorTimerProps) {
  const [remaining, setRemaining] =
    useState<number | null>(() =>
      getRemainingSeconds(expiresAt),
    );

  useEffect(() => {
    setRemaining(
      getRemainingSeconds(expiresAt),
    );

    if (!expiresAt || !active || locked) {
      return;
    }

    const interval = window.setInterval(
      () => {
        const next =
          getRemainingSeconds(
            expiresAt,
          );

        setRemaining(next);

        if (
          next !== null &&
          next <= 0
        ) {
          window.clearInterval(
            interval,
          );

          onExpire?.();
        }
      },
      250,
    );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    expiresAt,
    active,
    locked,
    onExpire,
  ]);

  const calculatedRemaining =
    remaining ??
    (active && timeLimit !== null
      ? timeLimit
      : null);

  const safeRemaining =
    calculatedRemaining === null
      ? null
      : Math.max(
          0,
          calculatedRemaining,
        );

  const progress = useMemo(() => {
    if (
      !showProgress ||
      timeLimit === null ||
      timeLimit <= 0 ||
      safeRemaining === null
    ) {
      return null;
    }

    return Math.min(
      100,
      Math.max(
        0,
        (safeRemaining / timeLimit) *
          100,
      ),
    );
  }, [
    showProgress,
    timeLimit,
    safeRemaining,
  ]);

  const isExpired =
    safeRemaining !== null &&
    safeRemaining <= 0;

  const displayTime =
    safeRemaining === null
      ? "--"
      : safeRemaining.toString();

  return (
    <section
      className={[
        "rounded-2xl border border-white/10",
        "bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={[
              "flex h-10 w-10 items-center justify-center rounded-xl border",
              active && !locked
                ? "border-cyan-400/20 bg-cyan-400/10"
                : "border-white/10 bg-white/[0.03]",
            ].join(" ")}
          >
            {locked ? (
              <Lock className="h-5 w-5 text-orange-300" />
            ) : active ? (
              <Radio className="h-5 w-5 animate-pulse text-cyan-300" />
            ) : (
              <Clock3 className="h-5 w-5 text-slate-500" />
            )}
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              {title}
            </h2>

            {showState && (
              <p className="mt-0.5 text-[10px] text-slate-500">
                {locked
                  ? "Question locked"
                  : active
                    ? isExpired
                      ? "Time expired"
                      : "Question is live"
                    : "Waiting for question"}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <p
            className={[
              "font-mono font-bold tabular-nums",
              compact
                ? "text-xl"
                : "text-2xl",
              isExpired
                ? "text-red-300"
                : active
                  ? "text-cyan-300"
                  : "text-slate-500",
            ].join(" ")}
          >
            {displayTime}
          </p>

          {timeLimit !== null && (
            <p className="text-[9px] uppercase tracking-wider text-slate-700">
              seconds
            </p>
          )}
        </div>
      </div>

      {/* PROGRESS */}
      {progress !== null && (
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className={[
                "h-full rounded-full transition-[width] duration-200",
                isExpired
                  ? "bg-red-400"
                  : "bg-cyan-400",
              ].join(" ")}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* SPECTATOR NOTICE */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-700">
        <Radio className="h-3 w-3" />
        Spectator timer
      </div>

      {/* START TIME DEBUG CONTEXT */}
      {startedAt && (
        <span className="sr-only">
          Started at {startedAt}
        </span>
      )}
    </section>
  );
}






"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Lock,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ContestantTimerProps {
  startedAt?: string | null;
  expiresAt?: string | null;

  timeLimit?: number | null;

  active?: boolean;
  locked?: boolean;

  onExpire?: () => void;

  title?: string;

  compact?: boolean;
  showProgress?: boolean;
}

function parseTimestamp(
  value?: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}

export default function ContestantTimer({
  startedAt = null,
  expiresAt = null,

  timeLimit = null,

  active = false,
  locked = false,

  onExpire,

  title = "Time remaining",

  compact = false,
  showProgress = true,
}: ContestantTimerProps) {
  const startedTimestamp = useMemo(
    () => parseTimestamp(startedAt),
    [startedAt],
  );

  const expiresTimestamp = useMemo(
    () => parseTimestamp(expiresAt),
    [expiresAt],
  );

  const [now, setNow] = useState(() =>
    Date.now(),
  );

  useEffect(() => {
    if (!active || locked) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [active, locked]);

  const remainingMilliseconds = useMemo(() => {
    if (expiresTimestamp === null) {
      return null;
    }

    return Math.max(
      0,
      expiresTimestamp - now,
    );
  }, [expiresTimestamp, now]);

  const remainingSeconds =
    remainingMilliseconds === null
      ? null
      : Math.ceil(
          remainingMilliseconds / 1000,
        );

  const effectiveTimeLimit =
    timeLimit !== null &&
    timeLimit !== undefined &&
    timeLimit > 0
      ? timeLimit
      : startedTimestamp !== null &&
          expiresTimestamp !== null
        ? Math.max(
            1,
            Math.ceil(
              (expiresTimestamp -
                startedTimestamp) /
                1000,
            ),
          )
        : null;

  const progress =
    effectiveTimeLimit !== null &&
    remainingSeconds !== null
      ? Math.min(
          100,
          Math.max(
            0,
            (remainingSeconds /
              effectiveTimeLimit) *
              100,
          ),
        )
      : null;

  const expired =
    expiresTimestamp !== null &&
    remainingMilliseconds !== null &&
    remainingMilliseconds <= 0;

  useEffect(() => {
    if (!expired || !onExpire) {
      return;
    }

    onExpire();
  }, [expired, onExpire]);

  const urgent =
    remainingSeconds !== null &&
    remainingSeconds <= 5 &&
    remainingSeconds > 0;

  const warning =
    remainingSeconds !== null &&
    remainingSeconds <= 10 &&
    remainingSeconds > 5;

  let stateLabel = "Waiting";
  let StateIcon = Clock3;

  if (locked) {
    stateLabel = "Locked";
    StateIcon = Lock;
  } else if (expired) {
    stateLabel = "Time expired";
    StateIcon = AlertTriangle;
  } else if (active) {
    stateLabel = "Live";
    StateIcon = CheckCircle2;
  }

  const formattedTime =
    remainingSeconds === null
      ? "--"
      : `${Math.floor(
          remainingSeconds / 60,
        )
          .toString()
          .padStart(2, "0")}:${(
          remainingSeconds % 60
        )
          .toString()
          .padStart(2, "0")}`;

  return (
    <section
      className={[
        "rounded-2xl border",
        "bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5 sm:p-6",
        urgent
          ? "border-red-400/40"
          : warning
            ? "border-amber-400/30"
            : "border-white/10",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={[
              "rounded-xl p-2",
              urgent
                ? "bg-red-400/10"
                : warning
                  ? "bg-amber-400/10"
                  : "bg-cyan-400/10",
            ].join(" ")}
          >
            <StateIcon
              className={[
                "h-4 w-4",
                urgent
                  ? "text-red-300"
                  : warning
                    ? "text-amber-300"
                    : "text-cyan-300",
              ].join(" ")}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {title}
            </p>

            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
              {stateLabel}
            </p>
          </div>
        </div>

        <div
          className={[
            "font-mono text-2xl font-black tabular-nums",
            urgent
              ? "text-red-300"
              : warning
                ? "text-amber-300"
                : "text-white",
          ].join(" ")}
          aria-live="polite"
        >
          {formattedTime}
        </div>
      </div>

      {showProgress &&
        progress !== null && (
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className={[
                  "h-full rounded-full transition-[width] duration-300",
                  urgent
                    ? "bg-red-400"
                    : warning
                      ? "bg-amber-400"
                      : "bg-cyan-400",
                ].join(" ")}
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

      {!compact &&
        effectiveTimeLimit !== null && (
          <p className="mt-3 text-xs text-slate-500">
            The timer is synchronized with the quiz
            server.
          </p>
        )}

      {compact && (
        <p className="mt-2 text-[10px] text-slate-600">
          Server-authoritative timer
        </p>
      )}
    </section>
  );
}
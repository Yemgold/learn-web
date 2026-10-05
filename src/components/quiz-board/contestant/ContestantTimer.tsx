




"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Lock,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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

function getDurationSeconds(
  timeLimit: number | null | undefined,
  startedAt: string | null | undefined,
  expiresAt: string | null | undefined,
): number | null {
  if (
    timeLimit !== null &&
    timeLimit !== undefined &&
    Number.isFinite(timeLimit) &&
    timeLimit > 0
  ) {
    return Math.max(1, Math.ceil(timeLimit));
  }

  const startedTimestamp =
    parseTimestamp(startedAt);

  const expiresTimestamp =
    parseTimestamp(expiresAt);

  if (
    startedTimestamp !== null &&
    expiresTimestamp !== null &&
    expiresTimestamp > startedTimestamp
  ) {
    return Math.max(
      1,
      Math.ceil(
        (expiresTimestamp -
          startedTimestamp) /
          1000,
      ),
    );
  }

  return null;
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
  /*
   * ==========================================================
   * TIMER DURATION
   * ==========================================================
   *
   * The duration comes from the quiz configuration/server.
   *
   * For example:
   *
   * timeLimit = 10
   *
   * means the contestant sees:
   *
   * 00:10
   * 00:09
   * 00:08
   * ...
   * 00:00
   *
   * We do NOT calculate the visual countdown using:
   *
   * expiresAt - Date.now()
   *
   * because Date.now() depends on the computer's system clock.
   */
  const effectiveTimeLimit = useMemo(
    () =>
      getDurationSeconds(
        timeLimit,
        startedAt,
        expiresAt,
      ),
    [
      timeLimit,
      startedAt,
      expiresAt,
    ],
  );

  /*
   * ==========================================================
   * LOCAL MONOTONIC TIMER
   * ==========================================================
   *
   * performance.now() measures elapsed time on this page.
   *
   * Unlike Date.now(), it is not affected by:
   *
   * - Windows clock changes
   * - timezone
   * - incorrect system date
   * - daylight-saving changes
   *
   * The backend remains authoritative for answer validation.
   * This timer is only responsible for displaying the countdown.
   */
  const timerStartRef =
    useRef<number | null>(null);

  const durationRef =
    useRef<number | null>(null);

  const [elapsedMilliseconds, setElapsedMilliseconds] =
    useState(0);

  const [expired, setExpired] =
    useState(false);

  /*
   * Keep the latest expiration callback without
   * restarting the timer whenever the parent
   * recreates the callback.
   */
  const onExpireRef =
    useRef(onExpire);

  useEffect(() => {
    onExpireRef.current =
      onExpire;
  }, [onExpire]);

  /*
   * Reset the local timer whenever a new question
   * arrives.
   *
   * A question is identified primarily by its
   * startedAt / expiresAt / timeLimit combination.
   */
  const questionKey = useMemo(
    () =>
      [
        startedAt ?? "",
        expiresAt ?? "",
        effectiveTimeLimit ?? "",
      ].join("|"),
    [
      startedAt,
      expiresAt,
      effectiveTimeLimit,
    ],
  );

  const previousQuestionKeyRef =
    useRef<string | null>(null);

  useEffect(() => {
    if (
      previousQuestionKeyRef.current ===
      questionKey
    ) {
      return;
    }

    previousQuestionKeyRef.current =
      questionKey;

    timerStartRef.current =
      null;

    durationRef.current =
      effectiveTimeLimit;

    setElapsedMilliseconds(0);
    setExpired(false);
  }, [
    questionKey,
    effectiveTimeLimit,
  ]);

  /*
   * ==========================================================
   * START LOCAL COUNTDOWN
   * ==========================================================
   */
  useEffect(() => {
    if (
      !active ||
      locked ||
      effectiveTimeLimit === null
    ) {
      return;
    }

    /*
     * Start exactly when the active question
     * becomes active.
     */
    if (
      timerStartRef.current === null
    ) {
      timerStartRef.current =
        performance.now();

      durationRef.current =
        effectiveTimeLimit;

      setElapsedMilliseconds(0);
      setExpired(false);
    }

    const interval =
      window.setInterval(() => {
        if (
          timerStartRef.current ===
          null
        ) {
          return;
        }

        const elapsed =
          performance.now() -
          timerStartRef.current;

        const durationMilliseconds =
          effectiveTimeLimit * 1000;

        const clampedElapsed =
          Math.min(
            durationMilliseconds,
            Math.max(0, elapsed),
          );

        setElapsedMilliseconds(
          clampedElapsed,
        );

        if (
          clampedElapsed >=
          durationMilliseconds
        ) {
          setExpired(true);
        }
      }, 50);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    active,
    locked,
    effectiveTimeLimit,
  ]);

  /*
   * ==========================================================
   * REMAINING TIME
   * ==========================================================
   */
  const remainingMilliseconds =
    effectiveTimeLimit === null
      ? null
      : Math.max(
          0,
          effectiveTimeLimit * 1000 -
            elapsedMilliseconds,
        );

  /*
   * Ceil is intentional.
   *
   * Example:
   *
   * 9.8 seconds → 10
   * 9.1 seconds → 10
   * 8.9 seconds → 9
   *
   * This keeps the display as:
   *
   * 00:10
   * 00:09
   * 00:08
   */
  const remainingSeconds =
    remainingMilliseconds === null
      ? null
      : Math.ceil(
          remainingMilliseconds / 1000,
        );

  /*
   * ==========================================================
   * EXPIRE CALLBACK
   * ==========================================================
   */
  const expireHandledRef =
    useRef(false);

  useEffect(() => {
    if (!expired) {
      expireHandledRef.current =
        false;

      return;
    }

    if (
      expireHandledRef.current
    ) {
      return;
    }

    expireHandledRef.current =
      true;

    onExpireRef.current?.();
  }, [expired]);

  /*
   * ==========================================================
   * PROGRESS
   * ==========================================================
   */
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

  /*
   * ==========================================================
   * VISUAL STATE
   * ==========================================================
   */
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

  /*
   * ==========================================================
   * FORMAT
   * ==========================================================
   */
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
        compact
          ? "p-4"
          : "p-5 sm:p-6",
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
            The countdown runs locally while
            answer validation remains
            server-authoritative.
          </p>
        )}

      {compact && (
        <p className="mt-2 text-[10px] text-slate-600">
          Server-authoritative answer validation
        </p>
      )}
    </section>
  );
}

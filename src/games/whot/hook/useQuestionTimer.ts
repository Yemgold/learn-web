



"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================
   LEARNYFI WHOT — QUESTION TIMER
   ============================================================

   Responsibilities:
   - Count down from the configured time limit.
   - Expose remaining seconds and progress percentage.
   - Indicate when time is running low.
   - Fire onTimeout exactly once per timer run.
   - Support pause, resume, reset, and stop.
   - Clean up intervals when the component unmounts.

   The timer is a UI utility. The game engine remains responsible
   for applying timeout penalties and changing turns.
   ============================================================ */

export interface UseQuestionTimerOptions {
  /** Total duration in seconds. Defaults to 15 seconds. */
  duration?: number;

  /** Whether the countdown should start immediately. */
  autoStart?: boolean;

  /** Remaining seconds at which the timer becomes urgent. */
  warningThreshold?: number;

  /** Called once when the countdown reaches zero. */
  onTimeout?: () => void;

  /** Interval between UI updates, in milliseconds. */
  tickInterval?: number;
}

export interface UseQuestionTimerReturn {
  /** Seconds remaining, rounded up for display. */
  timeRemaining: number;

  /** Milliseconds remaining, useful for precise UI feedback. */
  millisecondsRemaining: number;

  /** Progress from 100 down to 0. */
  progress: number;

  /** True when the countdown has reached zero. */
  isExpired: boolean;

  /** True while the countdown is actively running. */
  isRunning: boolean;

  /** True when the remaining time is at or below warningThreshold. */
  isUrgent: boolean;

  /** Start or resume the countdown. */
  start: () => void;

  /** Pause the countdown without resetting the remaining time. */
  pause: () => void;

  /** Reset to the full duration and stop the countdown. */
  reset: (nextDuration?: number) => void;

  /** Stop the countdown and preserve the remaining time. */
  stop: () => void;
}

const DEFAULT_DURATION = 15;
const DEFAULT_WARNING_THRESHOLD = 5;
const DEFAULT_TICK_INTERVAL = 100;

function normalizeDuration(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      "[Learnyfi WHOT] Timer duration must be a non-negative number.",
    );
  }

  return value;
}

function normalizeInterval(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      "[Learnyfi WHOT] Tick interval must be greater than zero.",
    );
  }

  return value;
}

export function useQuestionTimer(
  options: UseQuestionTimerOptions = {},
): UseQuestionTimerReturn {
  const {
    duration = DEFAULT_DURATION,
    autoStart = false,
    warningThreshold = DEFAULT_WARNING_THRESHOLD,
    onTimeout,
    tickInterval = DEFAULT_TICK_INTERVAL,
  } = options;

  const initialDuration = normalizeDuration(duration);
  const interval = normalizeInterval(tickInterval);

  if (!Number.isFinite(warningThreshold) || warningThreshold < 0) {
    throw new Error(
      "[Learnyfi WHOT] Warning threshold must be non-negative.",
    );
  }

  const [totalDuration, setTotalDuration] = useState(initialDuration);
  const [millisecondsRemaining, setMillisecondsRemaining] =
    useState(initialDuration * 1000);

  const [isRunning, setIsRunning] = useState(
    autoStart && initialDuration > 0,
  );

  const [isExpired, setIsExpired] = useState(
    initialDuration === 0,
  );

  const deadlineRef = useRef<number | null>(null);
  const remainingRef = useRef(initialDuration * 1000);
  const timeoutFiredRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);

  /*
   * Keep the latest callback without restarting the interval
   * whenever a parent renders a new callback reference.
   */
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const publishRemaining = useCallback((remaining: number) => {
    const safeRemaining = Math.max(0, remaining);

    remainingRef.current = safeRemaining;
    setMillisecondsRemaining(safeRemaining);
  }, []);

  const expire = useCallback(() => {
    if (timeoutFiredRef.current) {
      return;
    }

    timeoutFiredRef.current = true;
    deadlineRef.current = null;
    remainingRef.current = 0;

    setMillisecondsRemaining(0);
    setIsRunning(false);
    setIsExpired(true);

    onTimeoutRef.current?.();
  }, []);

  const start = useCallback(() => {
    if (timeoutFiredRef.current || remainingRef.current <= 0) {
      return;
    }

    deadlineRef.current = Date.now() + remainingRef.current;
    setIsExpired(false);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (!deadlineRef.current) {
      setIsRunning(false);
      return;
    }

    const remaining = Math.max(
      0,
      deadlineRef.current - Date.now(),
    );

    deadlineRef.current = null;
    publishRemaining(remaining);
    setIsRunning(false);

    if (remaining <= 0) {
      expire();
    }
  }, [expire, publishRemaining]);

  const stop = useCallback(() => {
    deadlineRef.current = null;
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (nextDuration?: number) => {
      const next = normalizeDuration(
        nextDuration ?? totalDuration,
      );

      deadlineRef.current = null;
      timeoutFiredRef.current = false;
      remainingRef.current = next * 1000;

      setTotalDuration(next);
      setMillisecondsRemaining(next * 1000);
      setIsExpired(next === 0);
      setIsRunning(false);
    },
    [totalDuration],
  );

  /*
   * Countdown loop. The deadline is based on wall-clock time,
   * so delayed interval callbacks do not extend the timer.
   */
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (remainingRef.current <= 0) {
      expire();
      return;
    }

    if (deadlineRef.current === null) {
      deadlineRef.current = Date.now() + remainingRef.current;
    }

    const intervalId = window.setInterval(() => {
      const deadline = deadlineRef.current;

      if (deadline === null) {
        return;
      }

      const remaining = Math.max(0, deadline - Date.now());

      publishRemaining(remaining);

      if (remaining <= 0) {
        expire();
      }
    }, interval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning, interval, expire, publishRemaining]);

  /*
   * Reset when the configured duration changes externally.
   * Internal reset(nextDuration) updates the state directly.
   */
  const previousDurationRef = useRef(initialDuration);

  useEffect(() => {
    if (previousDurationRef.current === initialDuration) {
      return;
    }

    previousDurationRef.current = initialDuration;

    deadlineRef.current = null;
    timeoutFiredRef.current = false;
    remainingRef.current = initialDuration * 1000;

    setTotalDuration(initialDuration);
    setMillisecondsRemaining(initialDuration * 1000);
    setIsExpired(initialDuration === 0);
    setIsRunning(autoStart && initialDuration > 0);
  }, [initialDuration, autoStart]);

  /*
   * Ensure no interval survives unmount.
   */
  useEffect(() => {
    return () => {
      deadlineRef.current = null;
    };
  }, []);

  const timeRemaining = Math.ceil(
    millisecondsRemaining / 1000,
  );

  const progress =
    totalDuration <= 0
      ? 0
      : Math.min(
          100,
          Math.max(
            0,
            (millisecondsRemaining / (totalDuration * 1000)) * 100,
          ),
        );

  return {
    timeRemaining,
    millisecondsRemaining,
    progress,
    isExpired,
    isRunning,
    isUrgent:
      !isExpired && timeRemaining <= warningThreshold,

    start,
    pause,
    reset,
    stop,
  };
}

export default useQuestionTimer;

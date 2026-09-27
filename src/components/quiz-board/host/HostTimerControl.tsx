




"use client";

import {
  Check,
  Clock3,
  Info,
  Minus,
  Plus,
  ShieldCheck,
  TimerReset,
} from "lucide-react";

export interface HostTimerControlProps {
  /**
   * Current selected duration in seconds.
   */
  value: number;

  /**
   * Available preset durations.
   */
  options?: number[];

  /**
   * Called whenever the host selects a duration.
   */
  onChange: (seconds: number) => void;

  /**
   * Whether the timer/question has already started.
   */
  disabled?: boolean;

  /**
   * Optional label.
   */
  title?: string;

  /**
   * Optional helper text.
   */
  description?: string;

  /**
   * Minimum duration for custom +/- control.
   */
  min?: number;

  /**
   * Maximum duration for custom +/- control.
   */
  max?: number;

  /**
   * Increment used by +/-.
   */
  step?: number;

  /**
   * Whether to show custom +/- controls.
   */
  showCustomControls?: boolean;

  /**
   * Compact UI.
   */
  compact?: boolean;
}

const DEFAULT_OPTIONS = [15, 30, 45, 60];

function normalizeSeconds(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(Math.max(value, min), max);
}

function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

export default function HostTimerControl({
  value,

  options = DEFAULT_OPTIONS,

  onChange,

  disabled = false,

  title = "Time per Question",

  description = "Choose how long contestants have to answer each question.",

  min = 5,

  max = 300,

  step = 5,

  showCustomControls = true,

  compact = false,
}: HostTimerControlProps) {
  const safeValue = normalizeSeconds(
    Number.isFinite(value) ? value : options[0] ?? 30,
    min,
    max,
  );

  const canDecrease = safeValue > min;
  const canIncrease = safeValue < max;

  const decrease = () => {
    if (disabled || !canDecrease) {
      return;
    }

    onChange(
      normalizeSeconds(
        safeValue - step,
        min,
        max,
      ),
    );
  };

  const increase = () => {
    if (disabled || !canIncrease) {
      return;
    }

    onChange(
      normalizeSeconds(
        safeValue + step,
        min,
        max,
      ),
    );
  };

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
          <Clock3 className="h-5 w-5 text-cyan-300" />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {/* Current duration */}
      <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/70">
            Selected Duration
          </p>

          <p className="mt-2 text-4xl font-black tracking-tight text-white">
            {formatDuration(safeValue)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {safeValue} seconds
          </p>
        </div>

        {showCustomControls && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={decrease}
              disabled={disabled || !canDecrease}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Decrease question time"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="min-w-[110px] rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-center">
              <span className="text-xs font-semibold text-slate-400">
                Adjust
              </span>
            </div>

            <button
              type="button"
              onClick={increase}
              disabled={disabled || !canIncrease}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Increase question time"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-slate-300">
            Presets
          </p>

          <span className="text-[10px] text-slate-600">
            {min}s – {max}s
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {options.map((seconds) => {
            const selected = safeValue === seconds;

            return (
              <button
                key={seconds}
                type="button"
                onClick={() => onChange(seconds)}
                disabled={disabled}
                className={[
                  "relative min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition",
                  selected
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
                  disabled
                    ? "cursor-not-allowed opacity-40"
                    : "",
                ].join(" ")}
              >
                {selected && (
                  <span className="absolute right-2 top-2">
                    <Check className="h-3.5 w-3.5 text-cyan-300" />
                  </span>
                )}

                {formatDuration(seconds)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual timeline */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[10px]">
          <span className="text-slate-600">
            Duration
          </span>

          <span className="font-semibold text-slate-400">
            {formatDuration(safeValue)}
          </span>
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-cyan-400/70 transition-all"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  ((safeValue - min) /
                    Math.max(1, max - min)) *
                    100,
                ),
              )}%`,
            }}
          />
        </div>

        <div className="mt-1 flex justify-between text-[9px] text-slate-700">
          <span>{min}s</span>
          <span>{max}s</span>
        </div>
      </div>

      {/* Backend authority notice */}
      <div className="mt-5 rounded-xl border border-violet-400/15 bg-violet-400/[0.04] p-3">
        <div className="flex items-start gap-2">
          <TimerReset className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

          <div>
            <p className="text-[11px] font-semibold text-violet-200">
              Server-controlled timer
            </p>

            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              This value configures the question. The backend
              should create the authoritative start time and
              expiry time when the host starts the question.
            </p>
          </div>
        </div>
      </div>

      {/* Important information */}
      <div className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-slate-600">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/60" />

        <span>
          Contestants and spectators should calculate their
          countdown from the server-provided startedAt/expiresAt
          values rather than the host's local clock.
        </span>
      </div>

      {/* Disabled explanation */}
      {disabled && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

          <p className="text-[10px] leading-5 text-amber-200/70">
            The question timer cannot be changed while the
            current question is already active or locked.
          </p>
        </div>
      )}
    </section>
  );
}
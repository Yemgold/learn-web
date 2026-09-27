



"use client";

export interface QuizOption {
  label?: string;
  value: string;
}

export interface QuizOptionsProps {
  options: QuizOption[];

  selectedValue?: string | null;

  disabled?: boolean;
  locked?: boolean;

  showSelection?: boolean;
  showLockState?: boolean;

  onSelect?: (value: string) => void;

  columns?: 1 | 2;

  compact?: boolean;
}

export default function QuizOptions({
  options,
  selectedValue = null,
  disabled = false,
  locked = false,
  showSelection = true,
  showLockState = true,
  onSelect,
  columns = 1,
  compact = false,
}: QuizOptionsProps) {
  if (!options.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-center">
        <p className="text-sm text-slate-500">
          No answer options available.
        </p>
      </div>
    );
  }

  const isDisabled = disabled || locked;

  return (
    <div
      className={[
        "grid gap-3",
        columns === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1",
      ].join(" ")}
    >
      {options.map((option, index) => {
        const value = option.value;

        const isSelected =
          selectedValue === value;

        const label =
          option.label ||
          String.fromCharCode(65 + index);

        return (
          <button
            key={`${value}-${index}`}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) {
                onSelect?.(value);
              }
            }}
            className={[
              "group relative w-full rounded-2xl border text-left transition-all duration-200",
              compact
                ? "p-3"
                : "p-4 sm:p-5",

              isSelected && showSelection
                ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
                : "border-white/10 bg-slate-950/60 hover:border-white/20 hover:bg-white/[0.04]",

              isDisabled
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer",

              locked && showLockState
                ? "opacity-75"
                : "",
            ].join(" ")}
            aria-pressed={
              isSelected
            }
            aria-label={`Option ${label}: ${value}`}
          >
            <div className="flex items-start gap-3">
              {/* OPTION LETTER */}
              <span
                className={[
                  "flex shrink-0 items-center justify-center rounded-xl border font-bold transition-colors",
                  compact
                    ? "h-8 w-8 text-xs"
                    : "h-10 w-10 text-sm",

                  isSelected &&
                  showSelection
                    ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300"
                    : "border-white/10 bg-white/[0.03] text-slate-400",
                ].join(" ")}
              >
                {label}
              </span>

              {/* OPTION TEXT */}
              <span
                className={[
                  "min-w-0 flex-1 leading-6",
                  compact
                    ? "text-sm"
                    : "text-sm sm:text-base",

                  isSelected &&
                  showSelection
                    ? "font-medium text-white"
                    : "text-slate-300",
                ].join(" ")}
              >
                {value}
              </span>

              {/* SELECTED INDICATOR */}
              {isSelected &&
                showSelection && (
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-black text-slate-950">
                    ✓
                  </span>
                )}
            </div>

            {/* LOCKED LABEL */}
            {locked &&
              showLockState &&
              isSelected && (
                <div className="mt-2 pl-11 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Answer locked
                </div>
              )}
          </button>
        );
      })}
    </div>
  );
}
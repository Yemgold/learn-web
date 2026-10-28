




"use client";

import {
  ArrowLeft,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  Coins,
  GraduationCap,
  Info,
  Play,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import type {
  EduLudoColor,
  EduLudoDifficulty,
  EduLudoLevel,
  EduLudoMode,
  EduLudoSubject,
} from "./eduLudoTypes";

import {
  COLOR_STYLES,
  EDU_LUDO_DIFFICULTIES,
  EDU_LUDO_LEVELS,
  EDU_LUDO_SUBJECTS,
  INITIAL_CBT_POINTS,
  INITIAL_WALLET_BALANCE,
  QUESTION_COST,
} from "./eduLudoConstants";

interface EduLudoLobbyProps {
  mode?: EduLudoMode;
  subject?: EduLudoSubject;
  level?: EduLudoLevel;
  difficulty?: EduLudoDifficulty;
  playerColor?: EduLudoColor;

  balance?: number;
  cbtPoints?: number;

  onModeChange?: (mode: EduLudoMode) => void;
  onSubjectChange?: (subject: EduLudoSubject) => void;
  onLevelChange?: (level: EduLudoLevel) => void;
  onDifficultyChange?: (difficulty: EduLudoDifficulty) => void;
  onPlayerColorChange?: (color: EduLudoColor) => void;

  onStartGame: () => void;
  onBack?: () => void;
  onFundWallet?: () => void;
  onViewRules?: () => void;
  onViewRewards?: () => void;

  loading?: boolean;
  error?: string | null;
}

const MODES: {
  value: EduLudoMode;
  title: string;
  description: string;
  icon: typeof Bot;
  available: boolean;
}[] = [
  {
    value: "solo",
    title: "Solo vs Bot",
    description: "Practice against computer opponents.",
    icon: Bot,
    available: true,
  },
  {
    value: "friends",
    title: "Play with Friends",
    description: "Invite friends to a shared match.",
    icon: Users,
    available: false,
  },
  {
    value: "classroom",
    title: "Classroom",
    description: "Learn and compete with classmates.",
    icon: GraduationCap,
    available: false,
  },
  {
    value: "tournament",
    title: "Tournament",
    description: "Compete for tournament rewards.",
    icon: Trophy,
    available: false,
  },
];

const COLOR_OPTIONS: EduLudoColor[] = [
  "red",
  "green",
  "yellow",
  "blue",
];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>

      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="min-h-12 w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option === "easy" ||
              option === "medium" ||
              option === "hard"
                ? option.charAt(0).toUpperCase() + option.slice(1)
                : option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </span>
    </label>
  );
}

export default function EduLudoLobby({
  mode = "solo",
  subject = "All Subjects",
  level = "JAMB",
  difficulty = "medium",
  playerColor = "red",

  balance = INITIAL_WALLET_BALANCE,
  cbtPoints = INITIAL_CBT_POINTS,

  onModeChange,
  onSubjectChange,
  onLevelChange,
  onDifficultyChange,
  onPlayerColorChange,

  onStartGame,
  onBack,
  onFundWallet,
  onViewRules,
  onViewRewards,

  loading = false,
  error = null,
}: EduLudoLobbyProps) {
  const canAffordQuestion =
    Number.isFinite(balance) && balance >= QUESTION_COST;

  const selectedColorStyles = COLOR_STYLES[playerColor];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 bg-slate-950 pb-8 text-white">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:bg-slate-800"
            >
              <ArrowLeft size={19} />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <GraduationCap size={20} />
              </span>

              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Edu Ludo
              </h1>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Play smart. Answer questions. Move to victory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewRules && (
            <button
              type="button"
              onClick={onViewRules}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              <Info size={16} />
              <span className="hidden sm:inline">Rules</span>
            </button>
          )}

          {onViewRewards && (
            <button
              type="button"
              onClick={onViewRewards}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
            >
              <Trophy size={16} />
              <span className="hidden sm:inline">Rewards</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 p-5 shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-indigo-400/10" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-violet-400/10" />

        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-indigo-200">
              <Sparkles size={14} />
              Learn while you play
            </span>

            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Every move is a
              <span className="block text-amber-300">
                chance to learn.
              </span>
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100/80 sm:text-base">
              Choose your subject, answer questions, move your tokens,
              and earn CBT points as you progress.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-indigo-100">
                <BookOpen size={14} />
                Educational questions
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-indigo-100">
                <Shield size={14} />
                Safe squares
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-indigo-100">
                <Zap size={14} />
                CBT rewards
              </span>
            </div>
          </div>

          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/15 bg-white/5 shadow-inner md:mx-0 md:h-44 md:w-44">
            <div className="grid grid-cols-2 gap-3">
              {COLOR_OPTIONS.map((color) => (
                <span
                  key={color}
                  className={`h-12 w-12 rounded-2xl border-4 border-white/70 shadow-lg ${COLOR_STYLES[color].bg}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wallet and points */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
            <Wallet size={17} className="text-indigo-400" />
            Wallet balance
          </div>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <p className="text-2xl font-black tabular-nums text-white">
              {formatNaira(balance)}
            </p>

            {onFundWallet && (
              <button
                type="button"
                onClick={onFundWallet}
                className="rounded-lg bg-indigo-500/15 px-3 py-2 text-xs font-bold text-indigo-300 transition hover:bg-indigo-500/25"
              >
                Fund wallet
              </button>
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Each presented question costs {formatNaira(QUESTION_COST)}.
          </p>

          {!canAffordQuestion && (
            <p className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-xs font-semibold text-red-300">
              Your wallet balance is too low to start a question.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
            <Coins size={17} />
            CBT reward points
          </div>

          <p className="mt-2 text-2xl font-black tabular-nums text-white">
            {cbtPoints.toLocaleString("en-NG")} CBT
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-100/70">
            Reward points are separate from your naira wallet balance.
          </p>
        </div>
      </section>

      {/* Game setup */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-extrabold text-white">
            Choose your game
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Select a mode and customize your learning session.
          </p>
        </div>

        {/* Modes */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODES.map((item) => {
            const Icon = item.icon;
            const selected = mode === item.value;

            return (
              <button
                key={item.value}
                type="button"
                disabled={!item.available}
                onClick={() => onModeChange?.(item.value)}
                aria-pressed={selected}
                className={[
                  "relative rounded-2xl border p-4 text-left transition-all",
                  selected
                    ? "border-indigo-400 bg-indigo-500/10 ring-1 ring-indigo-400/30"
                    : "border-slate-700 bg-slate-950",
                  item.available
                    ? "cursor-pointer hover:border-indigo-400/60 hover:bg-slate-800"
                    : "cursor-not-allowed opacity-60",
                ].join(" ")}
              >
                {selected && (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <Check size={14} />
                  </span>
                )}

                <div
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    selected
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-800 text-slate-300",
                  ].join(" ")}
                >
                  <Icon size={21} />
                </div>

                <h3 className="mt-3 pr-5 text-sm font-extrabold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {item.description}
                </p>

                {!item.available && (
                  <span className="mt-3 inline-block rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Coming soon
                  </span>
                )}

                {item.available && (
                  <span className="mt-3 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                    Available
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Learning preferences */}
        <div className="mt-6 border-t border-slate-800 pt-6">
          <h3 className="text-base font-extrabold text-white">
            Learning preferences
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Choose what you want to study during the game.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectField
              label="Subject"
              value={subject}
              options={EDU_LUDO_SUBJECTS}
              onChange={(value) => onSubjectChange?.(value)}
            />

            <SelectField
              label="School level"
              value={level}
              options={EDU_LUDO_LEVELS}
              onChange={(value) => onLevelChange?.(value)}
            />

            <SelectField
              label="Bot difficulty"
              value={difficulty}
              options={EDU_LUDO_DIFFICULTIES}
              onChange={(value) => onDifficultyChange?.(value)}
            />
          </div>
        </div>

        {/* Token color */}
        <div className="mt-6 border-t border-slate-800 pt-6">
          <h3 className="text-base font-extrabold text-white">
            Choose your token color
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Pick the color you want to play with.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COLOR_OPTIONS.map((color) => {
              const colorStyle = COLOR_STYLES[color];
              const selected = playerColor === color;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onPlayerColorChange?.(color)}
                  aria-pressed={selected}
                  className={[
                    "flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 transition-all",
                    selected
                      ? `${colorStyle.border} bg-slate-800 ring-2 ring-indigo-400/30 ring-offset-2 ring-offset-slate-900`
                      : "border-slate-700 bg-slate-950 hover:border-slate-500",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full shadow-sm",
                      colorStyle.bg,
                      color === "yellow" ? "text-slate-900" : "text-white",
                    ].join(" ")}
                  >
                    {selected ? (
                      <Check size={19} />
                    ) : (
                      <span className="h-3 w-3 rounded-full border-2 border-white/80" />
                    )}
                  </span>

                  <span
                    className={[
                      "text-sm font-bold",
                      selected ? colorStyle.text : "text-slate-300",
                    ].join(" ")}
                  >
                    {colorStyle.name}
                  </span>

                  {selected && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-300">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-300"
          >
            {error}
          </div>
        )}

        {/* Information */}
        <div className="mt-6 rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.08] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <Info size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-indigo-200">
                Before you start
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-300">
                Solo mode is currently available. Friends, classroom,
                and tournament modes are upcoming features. Question
                charges and CBT rewards are handled by the game logic.
              </p>
            </div>
          </div>
        </div>

        {/* Start game */}
        <button
          type="button"
          onClick={onStartGame}
          disabled={loading || !canAffordQuestion || mode !== "solo"}
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Preparing your game...
            </>
          ) : (
            <>
              <Play size={20} className="fill-current" />
              Start Solo Game
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          Selected color: {selectedColorStyles.name} · {subject} · {level}
        </p>
      </section>
    </main>
  );
}

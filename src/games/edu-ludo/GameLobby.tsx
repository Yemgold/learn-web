





"use client";

import {
  BookOpen,
  Bot,
  Check,
  GraduationCap,
  Users,
  Trophy,
  Wallet,
  Coins,
  Dice5,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type EduLudoMode =
  | "solo"
  | "friends"
  | "classroom"
  | "tournament";

export type EduLudoSubject =
  | "All Subjects"
  | "Mathematics"
  | "English"
  | "Science"
  | "Biology"
  | "Chemistry"
  | "Physics";

export type EduLudoLevel =
  | "JSS"
  | "SSS"
  | "JAMB"
  | "WAEC"
  | "Custom";

export interface GameLobbyProps {
  balance?: number;
  mode?: EduLudoMode;
  subject?: EduLudoSubject;
  level?: EduLudoLevel;
  onModeChange?: (mode: EduLudoMode) => void;
  onSubjectChange?: (subject: EduLudoSubject) => void;
  onLevelChange?: (level: EduLudoLevel) => void;
  onStart?: () => void;
  onFundWallet?: () => void;
  loading?: boolean;
  error?: string;
}

const QUESTION_COST = 2;

const MODES: {
  id: EduLudoMode;
  title: string;
  description: string;
  icon: typeof Bot;
  tag?: string;
}[] = [
  {
    id: "solo",
    title: "Solo vs Bot",
    description: "Practise against computer opponents.",
    icon: Bot,
    tag: "Practice",
  },
  {
    id: "friends",
    title: "Play with Friends",
    description: "Challenge friends in a private game.",
    icon: Users,
  },
  {
    id: "classroom",
    title: "Classroom",
    description: "Play educational games with classmates.",
    icon: GraduationCap,
  },
  {
    id: "tournament",
    title: "Tournament",
    description: "Compete for leaderboard positions.",
    icon: Trophy,
    tag: "Competitive",
  },
];

const SUBJECTS: EduLudoSubject[] = [
  "All Subjects",
  "Mathematics",
  "English",
  "Science",
  "Biology",
  "Chemistry",
  "Physics",
];

const LEVELS: EduLudoLevel[] = [
  "JSS",
  "SSS",
  "JAMB",
  "WAEC",
  "Custom",
];

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function GameLobby({
  balance = 500,
  mode = "solo",
  subject = "All Subjects",
  level = "JAMB",
  onModeChange,
  onSubjectChange,
  onLevelChange,
  onStart,
  onFundWallet,
  loading = false,
  error,
}: GameLobbyProps) {
  const hasEnoughForQuestion = balance >= QUESTION_COST;
  const isBusy = loading;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-800 p-6 text-white shadow-xl sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide">
              <Sparkles size={14} />
              LEARN · PLAY · WIN
            </div>

            <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Welcome to{" "}
              <span className="text-yellow-300">Edu-Ludo</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Roll the dice, answer educational questions, move your tokens,
              and challenge other learners on the Learnyfi board.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                <Users size={16} />
                2–4 players
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                <BookOpen size={16} />
                Educational quizzes
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                <Dice5 size={16} />
                Classic Ludo
              </span>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/15 bg-slate-950/25 p-5 backdrop-blur sm:min-w-64">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                <Wallet size={23} />
              </div>
              <div>
                <p className="text-xs text-indigo-100">Available wallet balance</p>
                <p className="mt-1 text-2xl font-black">
                  {formatNaira(balance)}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-indigo-100">Cost per question</span>
                <span className="font-bold text-yellow-300">
                  {formatNaira(QUESTION_COST)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-indigo-100/80">
                A question charge applies whenever a question is presented,
                whether your answer is correct or incorrect.
              </p>
            </div>

            {!hasEnoughForQuestion && (
              <button
                type="button"
                onClick={onFundWallet}
                className="mt-4 w-full rounded-xl bg-yellow-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200"
              >
                Fund Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lobby controls */}
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-7">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Set up your game
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Select a game mode, choose your questions, and prepare to play.
            </p>
          </div>

          {/* Game modes */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white">Choose game mode</h3>
              <span className="text-xs text-slate-500">Select one</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {MODES.map((item) => {
                const Icon = item.icon;
                const selected = mode === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onModeChange?.(item.id)}
                    aria-pressed={selected}
                    className={`relative rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-violet-400 bg-violet-500/10 ring-1 ring-violet-400/30"
                        : "border-white/10 bg-slate-950 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-violet-500/20 text-violet-300"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        <Icon size={22} />
                      </div>

                      {selected && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                          <Check size={14} />
                        </span>
                      )}
                    </div>

                    <h4 className="mt-4 font-bold text-white">{item.title}</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {item.description}
                    </p>

                    {item.tag && (
                      <span className="mt-3 inline-flex rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                        {item.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="edu-ludo-subject"
              className="mb-2 block text-sm font-bold text-white"
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen size={17} className="text-violet-300" />
                Select subject
              </span>
            </label>

            <select
              id="edu-ludo-subject"
              value={subject}
              onChange={(event) =>
                onSubjectChange?.(event.target.value as EduLudoSubject)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            >
              {SUBJECTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              All Subjects lets the game select from the available question bank.
            </p>
          </div>

          {/* Academic level */}
          <div>
            <label
              htmlFor="edu-ludo-level"
              className="mb-2 block text-sm font-bold text-white"
            >
              <span className="inline-flex items-center gap-2">
                <GraduationCap size={18} className="text-violet-300" />
                Academic level
              </span>
            </label>

            <select
              id="edu-ludo-level"
              value={level}
              onChange={(event) =>
                onLevelChange?.(event.target.value as EduLudoLevel)
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            >
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item === "JSS"
                    ? "Junior Secondary School (JSS)"
                    : item === "SSS"
                      ? "Senior Secondary School (SSS)"
                      : item === "JAMB"
                        ? "JAMB / UTME"
                        : item === "WAEC"
                          ? "WAEC"
                          : "Custom level"}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          {/* Start */}
          <button
            type="button"
            onClick={onStart}
            disabled={isBusy || !hasEnoughForQuestion}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-4 font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Dice5 size={20} />
            {loading ? "Preparing game..." : "Start Edu-Ludo"}
            {!loading && <ArrowRight size={18} />}
          </button>

          {!hasEnoughForQuestion && (
            <p className="text-center text-sm text-amber-300">
              Your wallet balance is too low to present a question.
            </p>
          )}

          <p className="text-center text-xs leading-5 text-slate-500">
            Question charges are subject to wallet verification. This lobby
            does not deduct real money by itself.
          </p>
        </div>

        {/* Game information */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck size={19} className="text-emerald-400" />
              How it works
            </h3>

            <ol className="mt-5 space-y-4">
              {[
                ["01", "Roll the dice", "Take your turn on the Ludo board."],
                ["02", "Answer a question", "Choose the correct option within 15 seconds."],
                ["03", "Move your token", "Follow the rules of the game."],
                ["04", "Reach Home", "Compete to finish your tokens."],
              ].map(([number, title, description]) => (
                <li key={number} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-black text-violet-300">
                    {number}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <Coins size={19} className="text-yellow-400" />
              Question pricing
            </h3>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950 p-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Per question
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Correct or incorrect
                </p>
              </div>
              <p className="text-xl font-black text-yellow-300">₦2.00</p>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Your actual wallet balance must be verified by the backend
              before a question is presented and charged.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-400/20 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-violet-300" />
              <h3 className="font-bold text-white">Play to improve</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Practise subjects, improve your accuracy, and prepare to compete
              on the Learnyfi Edu-Ludo leaderboard.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}






"use client";

import { memo } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Layers3,
  Radio,
  Sparkles,
  Trophy,
  Wifi,
} from "lucide-react";

import type {
  WhotGameStatus,
  WhotPlayerId,
  WhotSubject,
} from "../types/whot";

export interface GameStatusProps {
  status: WhotGameStatus;
  currentTurn: WhotPlayerId;
  winner?: WhotPlayerId | null;
  message?: string;
  centerSubject?: WhotSubject;
  playerCardCount?: number;
  botCardCount?: number;
  drawPileCount?: number;
  timeRemaining?: number | null;
  isQuestionOpen?: boolean;
  isConnected?: boolean;
  compact?: boolean;
  className?: string;
}

const SUBJECT_STYLES: Record<
  WhotSubject,
  { border: string; background: string; text: string; dot: string }
> = {
  MATHS: {
    border: "border-blue-400/30",
    background: "bg-blue-400/10",
    text: "text-blue-200",
    dot: "bg-blue-400",
  },
  ENGLISH: {
    border: "border-fuchsia-400/30",
    background: "bg-fuchsia-400/10",
    text: "text-fuchsia-200",
    dot: "bg-fuchsia-400",
  },
  BIOLOGY: {
    border: "border-emerald-400/30",
    background: "bg-emerald-400/10",
    text: "text-emerald-200",
    dot: "bg-emerald-400",
  },
  CHEMISTRY: {
    border: "border-orange-400/30",
    background: "bg-orange-400/10",
    text: "text-orange-200",
    dot: "bg-orange-400",
  },
  PHYSICS: {
    border: "border-cyan-400/30",
    background: "bg-cyan-400/10",
    text: "text-cyan-200",
    dot: "bg-cyan-400",
  },
  HISTORY: {
    border: "border-amber-400/30",
    background: "bg-amber-400/10",
    text: "text-amber-200",
    dot: "bg-amber-400",
  },
  GENERAL: {
    border: "border-violet-400/30",
    background: "bg-violet-400/10",
    text: "text-violet-200",
    dot: "bg-violet-400",
  },
};

const SUBJECT_LABELS: Record<WhotSubject, string> = {
  MATHS: "Mathematics",
  ENGLISH: "English",
  BIOLOGY: "Biology",
  CHEMISTRY: "Chemistry",
  PHYSICS: "Physics",
  HISTORY: "History",
  GENERAL: "General Knowledge",
};

function getStatusLabel(status: WhotGameStatus): string {
  switch (status) {
    case "READY":
      return "Ready to play";
    case "PLAYING":
      return "Game in progress";
    case "FINISHED":
      return "Game completed";
    default:
      return "Game status";
  }
}

function getTurnLabel(
  status: WhotGameStatus,
  currentTurn: WhotPlayerId,
  winner?: WhotPlayerId | null,
): string {
  if (status === "READY") {
    return "Waiting to start";
  }

  if (status === "FINISHED") {
    if (winner === "player") return "You won the game!";
    if (winner === "bot") return "The bot won the game";
    return "Game finished";
  }

  return currentTurn === "player" ? "Your turn" : "Bot's turn";
}

function GameStatus({
  status,
  currentTurn,
  winner = null,
  message,
  centerSubject,
  playerCardCount,
  botCardCount,
  drawPileCount,
  timeRemaining = null,
  isQuestionOpen = false,
  isConnected = true,
  compact = false,
  className = "",
}: GameStatusProps) {
  const isPlaying = status === "PLAYING";
  const isFinished = status === "FINISHED";
  const isPlayerTurn = isPlaying && currentTurn === "player";
  const isBotTurn = isPlaying && currentTurn === "bot";

  const safeTime =
    timeRemaining !== null && Number.isFinite(timeRemaining)
      ? Math.max(0, Math.ceil(timeRemaining))
      : null;

  const turnTone = isFinished
    ? winner === "player"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : winner === "bot"
        ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
        : "border-slate-400/20 bg-slate-400/10 text-slate-200"
    : isPlayerTurn
      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
      : isBotTurn
        ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
        : "border-white/10 bg-slate-800 text-slate-300";

  const headingIconStyle = isFinished
    ? winner === "player"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : "border-rose-400/20 bg-rose-400/10 text-rose-300"
    : isPlaying
      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
      : "border-white/10 bg-slate-800 text-slate-300";

  return (
    <section
      aria-label="WHOT game status"
      className={`w-full min-w-0 space-y-2.5 sm:space-y-3 ${className}`}
    >
      {/* Main status and turn indicator */}
      <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11 ${headingIconStyle}`}
          >
            {isFinished ? (
              <Trophy size={20} aria-hidden="true" />
            ) : isPlaying ? (
              <Activity size={20} aria-hidden="true" />
            ) : (
              <Sparkles size={20} aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-extrabold text-white sm:text-base">
              {getStatusLabel(status)}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
              Learnyfi WHOT
              <span className="mx-1.5 text-slate-600">·</span>
              Learn as you play
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
          <span
            className={`inline-flex min-h-9 max-w-full items-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold ${turnTone}`}
            role="status"
            aria-live="polite"
          >
            {isPlaying && (
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  isPlayerTurn
                    ? "animate-pulse bg-cyan-300"
                    : "animate-pulse bg-amber-300"
                }`}
              />
            )}
            {getTurnLabel(status, currentTurn, winner)}
          </span>

          {isPlaying && (
            <span className="shrink-0 text-[10px] font-semibold text-slate-500 sm:hidden">
              {isPlayerTurn ? "YOU" : "BOT"}
            </span>
          )}
        </div>
      </div>

      {/* Card counts */}
      {!compact && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {playerCardCount !== undefined && (
            <CountCard
              label="Your cards"
              count={playerCardCount}
              accent="cyan"
              icon={<Layers3 size={16} aria-hidden="true" />}
            />
          )}

          {botCardCount !== undefined && (
            <CountCard
              label="Bot cards"
              count={botCardCount}
              accent="amber"
              icon={<Layers3 size={16} aria-hidden="true" />}
            />
          )}

          {drawPileCount !== undefined && (
            <CountCard
              label="Draw pile"
              count={drawPileCount}
              accent="violet"
              icon={<Radio size={16} aria-hidden="true" />}
            />
          )}
        </div>
      )}

      {/* Subject and timer */}
      {(centerSubject || (safeTime !== null && isQuestionOpen)) && (
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
          {centerSubject && (
            <div
              className={`flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 ${
                SUBJECT_STYLES[centerSubject].border
              } ${SUBJECT_STYLES[centerSubject].background}`}
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  SUBJECT_STYLES[centerSubject].dot
                }`}
              />

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Centre card subject
                </p>
                <p
                  className={`break-words text-sm font-extrabold ${
                    SUBJECT_STYLES[centerSubject].text
                  }`}
                >
                  {SUBJECT_LABELS[centerSubject]}
                </p>
              </div>
            </div>
          )}

          {safeTime !== null && isQuestionOpen && (
            <div
              className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 py-2 sm:min-w-[150px] sm:justify-start ${
                safeTime <= 5
                  ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
                  : "border-white/10 bg-slate-900 text-slate-200"
              }`}
              role="timer"
              aria-live={safeTime <= 5 ? "assertive" : "off"}
            >
              <span className="flex items-center gap-2">
                <Clock3
                  size={16}
                  className={safeTime <= 5 ? "text-rose-300" : "text-cyan-300"}
                  aria-hidden="true"
                />
                <span className="text-xs font-bold">Time remaining</span>
              </span>

              <span
                className={`text-lg font-black tabular-nums ${
                  safeTime <= 5 ? "text-rose-300" : "text-white"
                }`}
              >
                {safeTime}s
              </span>
            </div>
          )}
        </div>
      )}

      {/* Game message */}
      {message && (
        <div
          className={`flex min-w-0 items-start gap-2.5 rounded-xl border p-3 ${
            isFinished
              ? winner === "player"
                ? "border-emerald-400/20 bg-emerald-400/[0.05]"
                : "border-rose-400/20 bg-rose-400/[0.05]"
              : isPlayerTurn
                ? "border-cyan-400/20 bg-cyan-400/[0.05]"
                : "border-white/10 bg-slate-950/40"
          }`}
          role="status"
          aria-live="polite"
        >
          {isFinished && winner === "player" ? (
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-emerald-300"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              size={17}
              className={`mt-0.5 shrink-0 ${
                isFinished ? "text-rose-300" : "text-cyan-300"
              }`}
              aria-hidden="true"
            />
          )}

          <p className="min-w-0 break-words text-xs leading-5 text-slate-300 sm:text-sm">
            {message}
          </p>
        </div>
      )}

      {/* Local game indicator and turn guidance */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-1">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-[11px]">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              isConnected ? "bg-emerald-400" : "bg-slate-500"
            }`}
          />
          {isConnected ? "Game ready" : "Offline mode"}
        </div>

        {isPlaying && (
          <p
            className={`text-right text-[10px] font-semibold sm:text-[11px] ${
              isPlayerTurn ? "text-cyan-200/80" : "text-amber-200/80"
            }`}
          >
            {isQuestionOpen
              ? "Answer before time runs out"
              : isPlayerTurn
                ? "Play a matching card or draw"
                : "Waiting for the bot"}
          </p>
        )}
      </div>

      {!isConnected && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3 text-xs leading-5 text-amber-200">
          <Wifi size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            You are playing the local frontend version. A live server
            connection is not required for this game.
          </p>
        </div>
      )}
    </section>
  );
}

interface CountCardProps {
  label: string;
  count: number;
  accent: "cyan" | "amber" | "violet";
  icon: React.ReactNode;
}

const COUNT_STYLES: Record<
  CountCardProps["accent"],
  { border: string; icon: string; value: string }
> = {
  cyan: {
    border: "border-cyan-400/20 bg-cyan-400/[0.04]",
    icon: "bg-cyan-400/10 text-cyan-300",
    value: "text-cyan-200",
  },
  amber: {
    border: "border-amber-400/20 bg-amber-400/[0.04]",
    icon: "bg-amber-400/10 text-amber-300",
    value: "text-amber-200",
  },
  violet: {
    border: "border-violet-400/20 bg-violet-400/[0.04]",
    icon: "bg-violet-400/10 text-violet-300",
    value: "text-violet-200",
  },
};

function CountCard({ label, count, accent, icon }: CountCardProps) {
  const styles = COUNT_STYLES[accent];

  return (
    <div
      className={`flex min-w-0 items-center gap-2.5 rounded-xl border p-3 sm:gap-3 sm:p-3.5 ${styles.border}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[10px] font-semibold text-slate-400 sm:text-xs">
          {label}
        </p>
        <p className={`text-lg font-black tabular-nums ${styles.value}`}>
          {Math.max(0, count)}
        </p>
      </div>
    </div>
  );
}

export default memo(GameStatus);

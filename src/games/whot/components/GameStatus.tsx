





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

const SUBJECT_STYLES: Record<WhotSubject, string> = {
  MATHS: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  ENGLISH: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  BIOLOGY: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  CHEMISTRY: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  PHYSICS: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  HISTORY: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  GENERAL: "border-violet-400/30 bg-violet-400/10 text-violet-200",
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
    if (winner === "bot") return "The bot won this round";
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
      : "border-slate-400/20 bg-slate-400/10 text-slate-200"
    : isPlayerTurn
      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
      : isBotTurn
        ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
        : "border-white/10 bg-slate-800 text-slate-300";

  return (
    <section
      aria-label="WHOT game status"
      className={`w-full space-y-3 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 sm:p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              isFinished
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : isPlaying
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 bg-slate-800 text-slate-300"
            }`}
          >
            {isFinished ? (
              <Trophy size={20} aria-hidden="true" />
            ) : isPlaying ? (
              <Activity size={20} aria-hidden="true" />
            ) : (
              <Sparkles size={20} aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white">
              {getStatusLabel(status)}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Learnyfi WHOT · Learn as you play
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${turnTone}`}
          role="status"
          aria-live="polite"
        >
          {isPlaying && (
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPlayerTurn
                  ? "animate-pulse bg-cyan-300"
                  : "bg-amber-300"
              }`}
            />
          )}
          {getTurnLabel(status, currentTurn, winner)}
        </span>
      </div>

      {!compact && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {playerCardCount !== undefined && (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <Layers3 size={16} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">Your cards</p>
                <p className="text-lg font-extrabold tabular-nums text-white">
                  {Math.max(0, playerCardCount)}
                </p>
              </div>
            </div>
          )}

          {botCardCount !== undefined && (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
                <Layers3 size={16} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">Bot cards</p>
                <p className="text-lg font-extrabold tabular-nums text-white">
                  {Math.max(0, botCardCount)}
                </p>
              </div>
            </div>
          )}

          {drawPileCount !== undefined && (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                <Radio size={16} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400">Draw pile</p>
                <p className="text-lg font-extrabold tabular-nums text-white">
                  {Math.max(0, drawPileCount)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {(centerSubject || safeTime !== null || isQuestionOpen) && (
        <div className="flex flex-wrap items-center gap-2">
          {centerSubject && (
            <div
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${SUBJECT_STYLES[centerSubject]}`}
            >
              <span className="text-slate-400">Match subject:</span>
              {SUBJECT_LABELS[centerSubject]}
            </div>
          )}

          {safeTime !== null && isQuestionOpen && (
            <div
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${
                safeTime <= 5
                  ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                  : "border-white/10 bg-slate-900 text-slate-200"
              }`}
              role="timer"
              aria-live={safeTime <= 5 ? "assertive" : "off"}
            >
              <Clock3 size={14} aria-hidden="true" />
              {safeTime}s remaining
            </div>
          )}
        </div>
      )}

      {message && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-3 ${
            isFinished
              ? "border-emerald-400/20 bg-emerald-400/[0.05]"
              : "border-white/10 bg-slate-950/40"
          }`}
          role="status"
          aria-live="polite"
        >
          {isFinished ? (
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-emerald-300"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              size={17}
              className="mt-0.5 shrink-0 text-cyan-300"
              aria-hidden="true"
            />
          )}
          <p className="text-xs leading-5 text-slate-300">{message}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? "bg-emerald-400" : "bg-slate-500"
            }`}
          />
          {isConnected ? "Game ready" : "Offline mode"}
        </div>

        {isPlaying && (
          <p className="text-[11px] text-slate-500">
            {isQuestionOpen
              ? "Answer before time runs out"
              : isPlayerTurn
                ? "Choose a matching card or draw"
                : "The bot is taking its turn"}
          </p>
        )}
      </div>

      {!isConnected && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3 text-xs leading-5 text-amber-200">
          <Wifi size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            You are playing the local frontend version. No live server
            connection is required for this game.
          </p>
        </div>
      )}
    </section>
  );
}

export default memo(GameStatus);






// src/components/quiz-board/QuizBoardCard.tsx

"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Lock,
  Play,
  Radio,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  QuizBoard,
  QuizBoardAction,
} from "@/lib/quiz-board/types";

import {
  formatDate,
  getDifficultyClasses,
  getDifficultyLabel,
  getPlayerCountLabel,
  getPlayerAvailability,
  getRelativeTime,
  getStatusClasses,
  getStatusLabel,
} from "@/lib/quiz-board/helpers";

import {
  getQuizBoardPath,
  getQuizBoardWatchPath,
} from "@/lib/quiz-board/constants";

interface QuizBoardCardProps {
  board: QuizBoard;
  currentTime?: number;
  isJoined?: boolean;
}

function getStatusIcon(
  status: QuizBoard["status"],
) {
  switch (status) {
    case "LIVE":
      return <Radio className="h-3.5 w-3.5" />;

    case "COMPLETED":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "FULL":
      return <Lock className="h-3.5 w-3.5" />;

    case "UPCOMING":
      return <Clock3 className="h-3.5 w-3.5" />;

    case "OPEN":
    default:
      return <Zap className="h-3.5 w-3.5" />;
  }
}

function getBoardAction(
  board: QuizBoard,
  isJoined: boolean,
): QuizBoardAction {
  if (isJoined) {
    switch (board.status) {
      case "LIVE":
        return {
          label: "Enter Competition",
          href: getQuizBoardPath(board.id),
          variant: "success",
          icon: "play",
        };

      case "COMPLETED":
        return {
          label: "View Results",
          href: getQuizBoardWatchPath(board.id),
          variant: "outline",
          icon: "eye",
        };

      default:
        return {
          label: "View My Competition",
          href: getQuizBoardPath(board.id),
          variant: "secondary",
          icon: "eye",
        };
    }
  }

  switch (board.status) {
    case "OPEN":
      return {
        label: "Join Competition",
        href: getQuizBoardPath(board.id),
        variant: "primary",
        icon: "arrow-right",
      };

    case "UPCOMING":
      return {
        label: "View Competition",
        href: getQuizBoardPath(board.id),
        variant: "secondary",
        icon: "eye",
      };

    case "LIVE":
      return {
        label: "View Competition",
        href: getQuizBoardPath(board.id),
        variant: "secondary",
        icon: "eye",
      };

    case "FULL":
      return {
        label: "View Competition",
        href: getQuizBoardPath(board.id),
        variant: "outline",
        icon: "eye",
      };

    case "COMPLETED":
      return {
        label: "View Results",
        href: getQuizBoardWatchPath(board.id),
        variant: "outline",
        icon: "eye",
      };

    default:
      return {
        label: "View Competition",
        href: getQuizBoardPath(board.id),
        variant: "outline",
        icon: "eye",
      };
  }
}

function getActionIcon(
  icon: QuizBoardAction["icon"],
) {
  switch (icon) {
    case "play":
      return <Play className="h-4 w-4" />;

    case "eye":
      return <Eye className="h-4 w-4" />;

    case "users":
      return <Users className="h-4 w-4" />;

    case "arrow-right":
    default:
      return <ArrowRight className="h-4 w-4" />;
  }
}

export default function QuizBoardCard({
  board,
  currentTime = Date.now(),
  isJoined = false,
}: QuizBoardCardProps) {
  const action = getBoardAction(
    board,
    isJoined,
  );

  const availability =
    getPlayerAvailability(board);

  const isFull =
    availability.isFull ||
    board.status === "FULL";

  const isLive = board.status === "LIVE";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-slate-900/70 p-5 shadow-xl shadow-black/10 transition-all duration-300 ${
        isLive
          ? "border-red-500/20 hover:border-red-500/40"
          : "border-white/10 hover:border-violet-500/30"
      } hover:-translate-y-0.5 hover:bg-slate-900`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Background decoration                                               */}
      {/* ------------------------------------------------------------------ */}

      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl transition-all duration-500 ${
          isLive
            ? "bg-red-500/10 group-hover:bg-red-500/20"
            : "bg-violet-500/10 group-hover:bg-violet-500/20"
        }`}
      />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />

      {/* ------------------------------------------------------------------ */}
      {/* Card header                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {/* Status */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusClasses(
                board.status,
              )}`}
            >
              {getStatusIcon(board.status)}

              {getStatusLabel(board.status)}
            </span>

            {/* Difficulty */}
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getDifficultyClasses(
                board.difficulty,
              )}`}
            >
              {getDifficultyLabel(
                board.difficulty,
              )}
            </span>

            {/* Joined */}
            {isJoined && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Joined
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-lg font-bold leading-6 text-white transition-colors group-hover:text-violet-200">
            {board.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-400">
            {board.description}
          </p>
        </div>

        {/* Trophy icon */}
        <div
          className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border sm:flex ${
            isLive
              ? "border-red-500/20 bg-red-500/10"
              : "border-violet-500/20 bg-violet-500/10"
          }`}
        >
          <Trophy
            className={`h-5 w-5 ${
              isLive
                ? "text-red-400"
                : "text-violet-400"
            }`}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Subject                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative mt-4 flex items-center gap-2">
        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
          {board.subject}
        </span>

        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400">
          {board.examType}
        </span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
            Players
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-500" />

            <p className="truncate text-sm font-bold text-slate-200">
              {getPlayerCountLabel(board)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
            Questions
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {board.totalQuestions || "—"}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
            Rounds
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {board.numberOfRounds || "—"}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
          <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
            Time/Q
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {board.timePerQuestion > 0
              ? `${board.timePerQuestion}s`
              : "—"}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Player capacity                                                     */}
      {/* ------------------------------------------------------------------ */}

      {board.maxPlayers > 0 && (
        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[10px]">
            <span className="text-slate-500">
              Competition capacity
            </span>

            <span
              className={
                isFull
                  ? "font-semibold text-orange-400"
                  : "font-medium text-slate-400"
              }
            >
              {board.players}/{board.maxPlayers}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full transition-all ${
                isFull
                  ? "bg-orange-500"
                  : isLive
                    ? "bg-red-500"
                    : "bg-violet-500"
              }`}
              style={{
                width: `${Math.min(
                  (board.players /
                    board.maxPlayers) *
                    100,
                  100,
                )}%`,
              }}
            />
          </div>

          {!isFull &&
            availability.remaining > 0 && (
              <p className="mt-1.5 text-[10px] text-slate-500">
                {availability.remaining}{" "}
                {availability.remaining === 1
                  ? "spot"
                  : "spots"}{" "}
                remaining
              </p>
            )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Rewards                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
            1st Prize
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-400" />

            <span className="text-sm font-bold text-white">
              {board.winnerReward}
            </span>
          </div>
        </div>

        {board.secondReward > 0 && (
          <div>
            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
              2nd Prize
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-slate-400" />

              <span className="text-sm font-semibold text-slate-200">
                {board.secondReward}
              </span>
            </div>
          </div>
        )}

        <div className="text-right">
          <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
            Entry
          </p>

          <p className="mt-1 text-sm font-bold text-violet-300">
            {board.entryFee > 0
              ? `${board.entryFee} ${board.entryFeeType}`
              : "Free"}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Start / date information                                            */}
      {/* ------------------------------------------------------------------ */}

      {(board.startsAt || board.createdAt) && (
        <div className="relative mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" />

            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                {board.startsAt
                  ? "Starts"
                  : "Created"}
              </p>

              <p className="truncate text-xs font-medium text-slate-300">
                {formatDate(
                  board.startsAt ||
                    board.createdAt,
                )}
              </p>
            </div>
          </div>

          {board.startsAt && (
            <span
              className={`shrink-0 text-[11px] font-semibold ${
                isLive
                  ? "text-red-400"
                  : "text-violet-400"
              }`}
            >
              {getRelativeTime(
                board.startsAt,
                currentTime,
              )}
            </span>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Action                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative mt-5">
        <Link
          href={action.href}
          className="block"
        >
          <Button
            type="button"
            variant={
              action.variant === "outline"
                ? "outline"
                : "default"
            }
            className={`w-full gap-2 ${
              action.variant === "outline"
                ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                : action.variant === "secondary"
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : action.variant === "success"
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-violet-600 text-white hover:bg-violet-500"
            }`}
          >
            {getActionIcon(action.icon)}

            {action.label}
          </Button>
        </Link>
      </div>
    </article>
  );
}
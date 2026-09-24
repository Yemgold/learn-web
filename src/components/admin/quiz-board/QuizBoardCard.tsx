





"use client";

import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  DoorOpen,
  Eye,
  Layers3,
  ListChecks,
  Lock,
  Medal,
  Pencil,
  Play,
  Power,
  Radio,
  RefreshCw,
  Settings2,
  Square,
  Timer,
  Trash2,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { QuizBoard } from "@/lib/quiz-board/types";

interface QuizBoardCardProps {
  board: QuizBoard;
  onCreateRoom: () => void;
  onActivateRoom: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onManage?: () => void;
}

function normalizeStatus(status: unknown): string {
  return String(status ?? "")
    .trim()
    .toUpperCase();
}

function getBoardId(board: QuizBoard): string {
  return String(board.id ?? "").trim();
}

function getJoinedCount(board: QuizBoard): number {
  const value = Number(board.players ?? 0);

  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function getMaxPlayers(board: QuizBoard): number {
  const value = Number(board.maxPlayers ?? 0);

  return Number.isFinite(value) && value > 0 ? value : 0;
}

function isQuizFull(board: QuizBoard): boolean {
  const maxPlayers = getMaxPlayers(board);

  if (maxPlayers <= 0) {
    return false;
  }

  return getJoinedCount(board) >= maxPlayers;
}

function hasRoom(board: QuizBoard): boolean {
  return Boolean(String(board.roomId ?? "").trim());
}

function getStatusLabel(status: unknown): string {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "DRAFT":
      return "Draft";

    case "WAITING":
      return "Waiting";

    case "UPCOMING":
      return "Upcoming";

    case "OPEN":
      return "Open";

    case "FULL":
      return "Full";

    case "LIVE":
      return "Live";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    case "CLOSED":
      return "Closed";

    default:
      return normalized
        ? normalized
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase())
        : "Unknown";
  }
}

function getStatusClassName(status: unknown): string {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "DRAFT":
      return "border-slate-400/20 bg-slate-400/10 text-slate-300";

    case "WAITING":
    case "UPCOMING":
    case "OPEN":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";

    case "FULL":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "LIVE":
    case "IN_PROGRESS":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "COMPLETED":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";

    case "CANCELLED":
    case "CLOSED":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    default:
      return "border-slate-400/20 bg-slate-400/10 text-slate-300";
  }
}

function getStatusIcon(status: unknown) {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "LIVE":
    case "IN_PROGRESS":
      return <Radio className="h-3.5 w-3.5" />;

    case "COMPLETED":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "CANCELLED":
    case "CLOSED":
      return <Square className="h-3.5 w-3.5" />;

    case "FULL":
      return <Users className="h-3.5 w-3.5" />;

    case "DRAFT":
      return <Pencil className="h-3.5 w-3.5" />;

    default:
      return <CircleDot className="h-3.5 w-3.5" />;
  }
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-NG").format(
    Number.isFinite(value) ? value : 0,
  );
}

function formatPoints(value: number): string {
  return `${formatNumber(value)} CBT Points`;
}

function getSubjectLabel(subject: unknown): string {
  if (typeof subject === "string") {
    return subject.trim() || "General";
  }

  if (subject && typeof subject === "object") {
    const record = subject as Record<string, unknown>;

    const label =
      record.name ??
      record.subject_name ??
      record.title ??
      record.label;

    if (typeof label === "string" && label.trim()) {
      return label.trim();
    }
  }

  return "General";
}

function getDifficultyLabel(difficulty: unknown): string {
  const value = String(difficulty ?? "")
    .trim()
    .toLowerCase();

  if (!value) {
    return "Mixed";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getEntryFee(board: QuizBoard): number {
  const value = Number(board.entryFee ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function getWinnerReward(board: QuizBoard): number {
  const value = Number(board.winnerReward ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function getSecondReward(board: QuizBoard): number {
  const value = Number(board.secondReward ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function getQuestionCount(board: QuizBoard): number {
  const value = Number(board.totalQuestions ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function getRoundCount(board: QuizBoard): number {
  const value = Number(board.numberOfRounds ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function getTimePerQuestion(board: QuizBoard): number {
  const value = Number(board.timePerQuestion ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.025] px-3 py-3">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {icon}
        <span>{label}</span>
      </div>

      <div className="mt-1.5 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function StructurePill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.025] px-2.5 py-1 text-xs text-slate-400">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function QuizBoardCard({
  board,
  onCreateRoom,
  onActivateRoom,
  onCancel,
  onDelete,
  onManage,
}: QuizBoardCardProps) {
  const boardId = getBoardId(board);
  const status = normalizeStatus(board.status);

  const joinedCount = getJoinedCount(board);
  const maxPlayers = getMaxPlayers(board);

  const roomCreated = hasRoom(board);
  const quizFull = isQuizFull(board);

  const canCreateRoom =
    !roomCreated &&
    (status === "IN_PROGRESS" ||
      status === "FULL" ||
      status === "OPEN" ||
      status === "WAITING");

  const canActivateRoom =
    roomCreated &&
    status === "IN_PROGRESS";

  const canStartQuiz =
    status === "IN_PROGRESS" &&
    roomCreated;

  const showManageButton =
    typeof onManage === "function" &&
    status !== "IN_PROGRESS" &&
    status !== "COMPLETED" &&
    status !== "CANCELLED" &&
    status !== "CLOSED";

  const joinedPercentage =
    maxPlayers > 0
      ? Math.min((joinedCount / maxPlayers) * 100, 100)
      : 0;

  return (
    <Card className="group overflow-hidden border-white/10 bg-slate-900/70 shadow-xl shadow-black/10 transition-all duration-200 hover:border-cyan-400/20 hover:bg-slate-900">
      {/* Header */}
      <div className="border-b border-white/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClassName(
                  board.status,
                )}`}
              >
                {getStatusIcon(board.status)}
                {getStatusLabel(board.status)}
              </span>

              {roomCreated && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-xs font-semibold text-violet-300">
                  <DoorOpen className="h-3.5 w-3.5" />
                  Room Created
                </span>
              )}

              {quizFull && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                  <Users className="h-3.5 w-3.5" />
                  Full
                </span>
              )}
            </div>

            <h3 className="truncate text-lg font-bold text-white sm:text-xl">
              {board.title || "Untitled Quiz"}
            </h3>

            {board.description && (
              <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-400">
                {board.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StructurePill
                icon={<BookOpen className="h-3.5 w-3.5" />}
                label={getSubjectLabel(board.subject)}
              />

              <StructurePill
                icon={<Layers3 className="h-3.5 w-3.5" />}
                label={`${getRoundCount(board)} rounds`}
              />

              <StructurePill
                icon={<ListChecks className="h-3.5 w-3.5" />}
                label={`${getQuestionCount(board)} questions`}
              />

              <StructurePill
                icon={<Zap className="h-3.5 w-3.5" />}
                label={getDifficultyLabel(board.difficulty)}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {showManageButton && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onManage}
                leftIcon={<Settings2 className="h-4 w-4" />}
              >
                Manage
              </Button>
            )}

            {boardId && (
              <Link
                href={`/admin/secondary/quiz-board/quiz-competitions/${encodeURIComponent(
                  boardId,
                )}`}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Details
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Competition information */}
      <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={<Users className="h-3.5 w-3.5" />}
          label="Contestants"
          value={
            <span>
              {formatNumber(joinedCount)}
              {maxPlayers > 0 && (
                <span className="text-slate-500">
                  {" "}
                  / {formatNumber(maxPlayers)}
                </span>
              )}
            </span>
          }
        />

        <StatTile
          icon={<Timer className="h-3.5 w-3.5" />}
          label="Time / Question"
          value={`${formatNumber(getTimePerQuestion(board))} sec`}
        />

        <StatTile
          icon={<Trophy className="h-3.5 w-3.5" />}
          label="1st Reward"
          value={formatPoints(getWinnerReward(board))}
        />

        <StatTile
          icon={<Medal className="h-3.5 w-3.5" />}
          label="2nd Reward"
          value={formatPoints(getSecondReward(board))}
        />
      </div>

      {/* Contestant progress */}
      <div className="px-5 pb-5">
        <div className="rounded-xl border border-white/5 bg-black/10 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Users className="h-4 w-4 text-cyan-400" />
                Contestant Capacity
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {maxPlayers > 0
                  ? `${formatNumber(
                      Math.max(maxPlayers - joinedCount, 0),
                    )} slot${
                      Math.max(maxPlayers - joinedCount, 0) === 1
                        ? ""
                        : "s"
                    } remaining`
                  : "Contestant limit not configured"}
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-white">
                {formatNumber(joinedCount)}
                {maxPlayers > 0 && ` / ${formatNumber(maxPlayers)}`}
              </div>

              <div className="text-xs text-slate-500">
                {maxPlayers > 0
                  ? `${Math.round(joinedPercentage)}% filled`
                  : "No limit"}
              </div>
            </div>
          </div>

          {maxPlayers > 0 && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
                style={{
                  width: `${joinedPercentage}%`,
                }}
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {roomCreated ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300">
                <DoorOpen className="h-3.5 w-3.5" />
                Room ID:{" "}
                <span className="font-mono">
                  {board.roomId}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-400/10 bg-slate-400/5 px-2.5 py-1 text-xs font-medium text-slate-400">
                <Lock className="h-3.5 w-3.5" />
                Room not created
              </span>
            )}

            {quizFull && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300">
                <Check className="h-3.5 w-3.5" />
                Maximum contestants reached
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Schedule / entry information */}
      <div className="grid gap-3 border-t border-white/5 px-5 py-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
            <CalendarDays className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Scheduled Start
            </p>
            <p className="truncate text-sm font-medium text-slate-200">
              {formatDateTime(board.startsAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
            <Trophy className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Entry Fee
            </p>

            <p className="truncate text-sm font-medium text-slate-200">
              {getEntryFee(board) <= 0
                ? "Free"
                : formatPoints(getEntryFee(board))}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-white/5 bg-black/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {canCreateRoom && (
            <Button
              type="button"
              onClick={onCreateRoom}
              leftIcon={<DoorOpen className="h-4 w-4" />}
            >
              Create Room
            </Button>
          )}

          {canActivateRoom && (
            <Button
              type="button"
              onClick={onActivateRoom}
              leftIcon={<Power className="h-4 w-4" />}
            >
              Activate Room
            </Button>
          )}

          {canStartQuiz && (
            <Link
              href={`/admin/secondary/quiz-board/quiz-competitions/${encodeURIComponent(
                boardId,
              )}`}
            >
              <Button
                type="button"
                variant="outline"
                leftIcon={<Play className="h-4 w-4" />}
              >
                Quiz Controls
              </Button>
            </Link>
          )}

          {status === "COMPLETED" && (
            <Link
              href={`/admin/secondary/quiz-board/quiz-competitions/${encodeURIComponent(
                boardId,
              )}`}
            >
              <Button
                type="button"
                variant="outline"
                leftIcon={<Eye className="h-4 w-4" />}
              >
                View Results
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status !== "COMPLETED" &&
            status !== "CANCELLED" &&
            status !== "CLOSED" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                leftIcon={<Square className="h-3.5 w-3.5" />}
                className="text-slate-400 hover:text-amber-300"
              >
                Cancel
              </Button>
            )}

          {status !== "IN_PROGRESS" &&
            status !== "LIVE" &&
            status !== "COMPLETED" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDelete}
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                className="text-slate-400 hover:text-red-300"
              >
                Delete
              </Button>
            )}
        </div>
      </div>

      {/* Room activation hint */}
      {canActivateRoom && (
        <div className="border-t border-emerald-400/10 bg-emerald-400/[0.03] px-5 py-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

            <p className="text-xs leading-5 text-slate-400">
              The room has been created and contestants are ready. Activating
              the room will take the admin into the shared live Quiz Arena as
              the host.
            </p>
          </div>
        </div>
      )}

      {/* Refresh indicator */}
      {status === "IN_PROGRESS" && !roomCreated && (
        <div className="border-t border-white/5 px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw className="h-3.5 w-3.5" />
            Create the room before activating the competition.
          </div>
        </div>
      )}
    </Card>
  );
}

"use client";

import {
  AlertCircle,
  ChevronLeft,
  CircleDot,
  Clock3,
  Radio,
  ShieldCheck,
  Trophy,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useMemo, useState } from "react";

import HostLeaderboardPanel, {
  type HostLeaderboardEntry,
} from "./HostLeaderboardPanel";

import HostParticipantPanel, {
  type HostParticipant,
} from "./HostParticipantPanel";

import HostQuestionControls from "./HostQuestionControls";

import HostQuestionList, {
  type HostQuestionListItem,
} from "./HostQuestionList";

import HostQuestionPreview, {
  type HostQuestionPreviewQuestion,
} from "./HostQuestionPreview";

import type {
  TieBreakParticipant,
  TieBreakSelectionPayload,
} from "@/hooks/quiz-board/quizSocketTypes";

export interface HostQuizShowProps {
  quizId: string;
  roomId: string;

  quizTitle?: string;
  subject?: string;
  description?: string;

  currentRound: number;
  totalRounds: number;

  questions: HostQuestionListItem[];

  selectedQuestionNumber?: number | null;
  currentQuestionNumber?: number | null;

  totalQuestions?: number | null;

  selectedQuestion?: HostQuestionPreviewQuestion | null;

  questionStarted?: boolean;
  questionLocked?: boolean;

  timeLimit: number;

  connected?: boolean;
  roomActivated?: boolean;

  participants: HostParticipant[];
  leaderboard: HostLeaderboardEntry[];

  loading?: boolean;
  questionLoading?: boolean;
  actionLoading?: boolean;

  error?: string | null;

  canStartQuestion?: boolean;
  canLockQuestion?: boolean;
  canNextQuestion?: boolean;

  onBack?: () => void;

  onSelectQuestion: (
    question: HostQuestionListItem,
  ) => void;

  onStartQuestion: () => void;
  onLockQuestion: () => void;
  onNextQuestion: () => void;

  onResetQuestion?: () => void;
  onTimeLimitChange?: (seconds: number) => void;

  onParticipantClick?: (
    participant: HostParticipant,
  ) => void;

  onLeaderboardParticipantClick?: (
    participant: HostLeaderboardEntry,
  ) => void;

  onRefresh?: () => void;
  onBroadcastLeaderboard?: () => void;

  /**
   * The top winner ID supplied by the backend.
   * No manual ID entry is required.
   */
  topWinnerId?: string | null;

  /**
   * Tie-break participants received from the backend.
   */
  tieBreakPayload?: TieBreakSelectionPayload | null;

  tieBreakLoading?: boolean;

  /**
   * Emits enable_top_winner_to_solve_tie through the
   * existing socket hook using the backend-provided ID.
   */
  onEnableTieBreak?: (topWinnerId: string) => void;
}

const TIME_OPTIONS = [15, 30, 45, 60];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "—";
  }

  return `${seconds}s`;
}

function getTieBreakParticipants(
  payload: TieBreakSelectionPayload | null | undefined,
): TieBreakParticipant[] {
  if (!payload) {
    return [];
  }

  const participants = payload.participantsWithLeastTie;

  if (Array.isArray(participants)) {
    return participants;
  }

  return participants.entries ?? [];
}

export default function HostQuizShow({
  quizId,
  roomId,

  quizTitle = "Quiz Competition",
  subject = "Quiz Board",
  description = "",

  currentRound,
  totalRounds,

  questions,

  selectedQuestionNumber = null,
  currentQuestionNumber = null,
  totalQuestions = null,
  selectedQuestion = null,

  questionStarted = false,
  questionLocked = false,

  timeLimit,

  connected = false,
  roomActivated = false,

  participants,
  leaderboard,

  loading = false,
  questionLoading = false,
  actionLoading = false,

  error = null,

  canStartQuestion = true,
  canLockQuestion = true,
  canNextQuestion = true,

  onBack,

  onSelectQuestion,
  onStartQuestion,
  onLockQuestion,
  onNextQuestion,

  onResetQuestion,
  onTimeLimitChange,

  onParticipantClick,
  onLeaderboardParticipantClick,

  onRefresh,
  onBroadcastLeaderboard,

  topWinnerId = null,
  tieBreakPayload = null,
  tieBreakLoading = false,
  onEnableTieBreak,
}: HostQuizShowProps) {
  const [mobilePanel, setMobilePanel] = useState<
    "questions" | "preview" | "participants" | "leaderboard"
  >("preview");

  const [showQuestionBank, setShowQuestionBank] =
    useState(true);

  const participantCount = participants.length;

  const onlineParticipantCount = useMemo(
    () =>
      participants.filter(
        (participant) => participant.connected,
      ).length,
    [participants],
  );

  const currentQuestion = useMemo(() => {
    if (
      selectedQuestionNumber === null ||
      selectedQuestionNumber === undefined
    ) {
      return null;
    }

    return (
      questions.find(
        (question) =>
          question.questionNumber === selectedQuestionNumber,
      ) ?? null
    );
  }, [questions, selectedQuestionNumber]);

  const isLive = questionStarted && !questionLocked;

  const roomStatus = !connected
    ? "OFFLINE"
    : !roomActivated
      ? "WAITING"
      : isLive
        ? "LIVE"
        : questionLocked
          ? "LOCKED"
          : "READY";

  const roomStatusLabel =
    roomStatus === "OFFLINE"
      ? "Socket Offline"
      : roomStatus === "WAITING"
        ? "Waiting"
        : roomStatus === "LIVE"
          ? "Live"
          : roomStatus === "LOCKED"
            ? "Question Locked"
            : "Ready";

  const roomStatusClass =
    roomStatus === "LIVE"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : roomStatus === "LOCKED"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
        : roomStatus === "READY"
          ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
          : roomStatus === "WAITING"
            ? "border-violet-400/20 bg-violet-400/10 text-violet-300"
            : "border-red-400/20 bg-red-400/10 text-red-300";

  const canBroadcastLeaderboard =
    connected &&
    roomActivated &&
    Boolean(quizId) &&
    Boolean(roomId) &&
    Number.isInteger(currentRound) &&
    currentRound >= 1 &&
    Boolean(onBroadcastLeaderboard);

  const canEnableTieBreak =
    connected &&
    roomActivated &&
    Boolean(quizId) &&
    Boolean(roomId) &&
    Number.isInteger(currentRound) &&
    currentRound >= 1 &&
    Boolean(topWinnerId?.trim()) &&
    Boolean(onEnableTieBreak) &&
    !tieBreakLoading;

  const handleBroadcastLeaderboard = () => {
    if (!canBroadcastLeaderboard) {
      return;
    }

    onBroadcastLeaderboard?.();
  };

  const handleEnableTieBreak = () => {
    const winnerId = topWinnerId?.trim();

    if (!canEnableTieBreak || !winnerId) {
      return;
    }

    onEnableTieBreak?.(winnerId);
  };

  const tieBreakParticipants =
    getTieBreakParticipants(tieBreakPayload);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HOST HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[1800px] px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-sm font-bold text-white sm:text-base">
                    {quizTitle}
                  </h1>

                  <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-300">
                    HOST
                  </span>
                </div>

                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span>{subject}</span>

                  <span className="hidden sm:inline">
                    Room: {roomId}
                  </span>

                  <span>
                    Round {currentRound} of {totalRounds}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider",
                  roomStatusClass,
                ].join(" ")}
              >
                {roomStatus === "LIVE" ? (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                ) : roomStatus === "OFFLINE" ? (
                  <WifiOff className="h-3.5 w-3.5" />
                ) : (
                  <Wifi className="h-3.5 w-3.5" />
                )}

                {roomStatusLabel}
              </div>

              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ERROR */}
      {error && (
        <div className="mx-auto max-w-[1800px] px-4 pt-4 sm:px-6">
          <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-200">
                Host session error
              </p>

              <p className="mt-1 text-xs leading-5 text-red-200/70">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ROOM SUMMARY */}
      <div className="mx-auto max-w-[1800px] px-4 pt-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Radio className="h-4 w-4" />
              Room
            </div>

            <p className="mt-2 truncate text-sm font-semibold text-white">
              {roomId}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              {roomActivated
                ? "Room activated"
                : "Activation pending"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="h-4 w-4" />
              Participants
            </div>

            <p className="mt-2 text-xl font-bold text-white">
              {participantCount}
            </p>

            <p className="mt-1 text-[11px] text-emerald-300">
              {onlineParticipantCount} online
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CircleDot className="h-4 w-4" />
              Question
            </div>

            <p className="mt-2 text-xl font-bold text-white">
              {currentQuestionNumber ?? "—"}
              {totalQuestions ? ` / ${totalQuestions}` : ""}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              {questionStarted
                ? "Currently active"
                : "Not started"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock3 className="h-4 w-4" />
              Question Time
            </div>

            <p className="mt-2 text-xl font-bold text-white">
              {formatTime(timeLimit)}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Host configured
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE PANEL NAVIGATION */}
      <div className="mx-auto max-w-[1800px] px-4 pt-4 sm:px-6 lg:hidden">
        <div className="grid grid-cols-4 rounded-2xl border border-white/10 bg-white/[0.025] p-1">
          {[
            ["questions", "Questions"],
            ["preview", "Preview"],
            ["participants", "Players"],
            ["leaderboard", "Scores"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setMobilePanel(
                  value as
                    | "questions"
                    | "preview"
                    | "participants"
                    | "leaderboard",
                )
              }
              className={[
                "rounded-xl px-2 py-2 text-[11px] font-semibold transition",
                mobilePanel === value
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-slate-300",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 lg:py-6">
        <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)_320px] xl:grid-cols-[330px_minmax(0,1fr)_360px]">
          {/* LEFT: QUESTION BANK */}
          <aside
            className={[
              "min-w-0",
              mobilePanel === "questions"
                ? "block"
                : "hidden lg:block",
            ].join(" ")}
          >
            <div className="sticky top-[90px]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Question Bank
                  </h2>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Select a question to preview.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowQuestionBank((value) => !value)
                  }
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-white"
                >
                  {showQuestionBank ? "Hide" : "Show"}
                </button>
              </div>

              {showQuestionBank && (
                <HostQuestionList
                  questions={questions}
                  selectedQuestionNumber={selectedQuestionNumber}
                  currentQuestionNumber={currentQuestionNumber}
                  totalQuestions={totalQuestions}
                  loading={questionLoading || loading}
                  onSelectQuestion={(question) => {
                    onSelectQuestion(question);
                    setMobilePanel("preview");
                  }}
                  disabled={
                    actionLoading ||
                    questionStarted ||
                    questionLocked
                  }
                />
              )}
            </div>
          </aside>

          {/* CENTER: PREVIEW + CONTROLS */}
          <section
            className={[
              "min-w-0 space-y-4",
              mobilePanel === "preview"
                ? "block"
                : "hidden lg:block",
            ].join(" ")}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300" />

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-cyan-200">
                    Host Control Center
                  </p>

                  <p className="truncate text-[11px] text-slate-500">
                    Review the question, configure time, then
                    start it for everyone.
                  </p>
                </div>
              </div>

              <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Host only
              </div>
            </div>

            <HostQuestionPreview
              question={selectedQuestion}
              totalQuestions={totalQuestions}
              loading={questionLoading}
              questionStarted={questionStarted}
              questionLocked={questionLocked}
              showCorrectAnswer
              showExplanation
            />

            {/* TIME SELECTION */}
            {onTimeLimitChange && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Time per Question
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      The selected duration is sent when the host
                      starts the question.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map((seconds) => (
                      <button
                        key={seconds}
                        type="button"
                        onClick={() => onTimeLimitChange(seconds)}
                        disabled={
                          actionLoading ||
                          questionStarted ||
                          questionLocked
                        }
                        className={[
                          "rounded-xl border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40",
                          timeLimit === seconds
                            ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                            : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
                        ].join(" ")}
                      >
                        {seconds}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* QUESTION CONTROLS */}
            <HostQuestionControls
              questionNumber={
                selectedQuestionNumber ?? currentQuestionNumber
              }
              totalQuestions={totalQuestions}
              timeLimit={timeLimit}
              questionStarted={questionStarted}
              questionLocked={questionLocked}
              canStart={
                canStartQuestion && Boolean(selectedQuestion)
              }
              canLock={canLockQuestion}
              canNext={canNextQuestion}
              loading={actionLoading}
              onStartQuestion={onStartQuestion}
              onLockQuestion={onLockQuestion}
              onNextQuestion={onNextQuestion}
              onResetQuestion={onResetQuestion}
            />

            {description && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Competition
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  {description}
                </p>
              </div>
            )}
          </section>

          {/* RIGHT: PARTICIPANTS + LEADERBOARD */}
          <aside
            className={[
              "min-w-0 space-y-4",
              mobilePanel === "participants" ||
              mobilePanel === "leaderboard"
                ? "block"
                : "hidden lg:block",
            ].join(" ")}
          >
            {/* PARTICIPANTS */}
            <div
              className={
                mobilePanel === "leaderboard"
                  ? "hidden lg:block"
                  : "block"
              }
            >
              <HostParticipantPanel
                participants={participants}
                title="Participants"
                showSearch
                showScore
                showStats
                showConnectionStatus
                showEliminated
                onParticipantClick={onParticipantClick}
              />
            </div>

            {/* LEADERBOARD */}
            <div
              className={
                mobilePanel === "participants"
                  ? "hidden lg:block"
                  : "block"
              }
            >
              <button
                type="button"
                onClick={handleBroadcastLeaderboard}
                disabled={!canBroadcastLeaderboard}
                title={
                  !connected
                    ? "Connect to the quiz room first"
                    : !roomActivated
                      ? "Activate the quiz room first"
                      : !onBroadcastLeaderboard
                        ? "Connect the leaderboard callback in the parent component"
                        : currentRound < 1
                          ? "A valid round is required"
                          : `Request leaderboard for round ${currentRound}`
                }
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/15 px-4 py-3 text-sm font-bold text-violet-200 transition hover:border-violet-300/50 hover:bg-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trophy className="h-4 w-4" />
                Broadcast Round {currentRound} Leaderboard
              </button>

              <HostLeaderboardPanel
                entries={leaderboard}
                title="Live Leaderboard"
                currentQuestionNumber={currentQuestionNumber}
                totalQuestions={totalQuestions}
                showQuestionProgress
                showConnectionStatus
                showEliminated
                onParticipantClick={onLeaderboardParticipantClick}
              />
            </div>

            {/* TIE-BREAK CONTROL */}
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
              <div className="flex items-start gap-3">
                <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-amber-200">
                    Tie-Break Control
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    The winner ID comes from the backend. No manual
                    entry is required.
                  </p>
                </div>
              </div>

              {topWinnerId ? (
                <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/70 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Backend-designated winner
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-200">
                    {topWinnerId}
                  </p>
                </div>
              ) : (
                <p className="mt-3 rounded-xl border border-white/10 bg-slate-950/70 p-3 text-xs text-slate-500">
                  Waiting for the backend to provide the top winner ID.
                </p>
              )}

              {onEnableTieBreak && (
                <button
                  type="button"
                  onClick={handleEnableTieBreak}
                  disabled={!canEnableTieBreak}
                  title={
                    !topWinnerId
                      ? "Waiting for the backend-provided winner ID"
                      : !connected
                        ? "Connect to the quiz room first"
                        : !roomActivated
                          ? "Activate the quiz room first"
                          : tieBreakLoading
                            ? "Tie-break request in progress"
                            : "Enable the tie-break for the backend-designated winner"
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trophy className="h-4 w-4" />
                  {tieBreakLoading
                    ? "Enabling Tie-Break..."
                    : "Enable Tie-Break"}
                </button>
              )}

              {tieBreakPayload && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold text-white">
                    Tie-break participants received
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Round {tieBreakPayload.roundNumber}
                  </p>

                  {tieBreakParticipants.length === 0 ? (
                    <p className="mt-3 text-xs text-slate-500">
                      The backend sent no participants in this payload.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {tieBreakParticipants.map((participant) => (
                        <div
                          key={participant.userId}
                          className="rounded-xl border border-white/10 bg-slate-950/70 p-3"
                        >
                          <p className="break-all text-xs font-semibold text-slate-200">
                            {participant.userId}
                          </p>

                          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                            <span>
                              Round score: {participant.roundScore}
                            </span>
                            <span>
                              Total score: {participant.totalScore}
                            </span>
                            <span>
                              Correct answers: {participant.correctAnswers}
                            </span>
                            <span>
                              Time: {participant.timeTakenInSeconds}s
                            </span>
                          </div>

                          {participant.isEliminated && (
                            <p className="mt-2 text-[10px] font-bold uppercase text-red-300">
                              Eliminated
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* HOST REMINDER */}
            <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.04] p-4">
              <div className="flex items-start gap-3">
                <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />

                <div>
                  <p className="text-xs font-semibold text-violet-200">
                    Host authority
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    The server remains authoritative for question
                    state, timing, answer validation, scoring,
                    elimination, and leaderboard updates.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE QUICK STATUS */}
      <div className="mx-auto max-w-[1800px] px-4 pb-6 sm:px-6 lg:hidden">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-[10px] text-slate-500">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
              connected
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/20 bg-red-400/10 text-red-300",
            ].join(" ")}
          >
            {connected ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}

            {connected
              ? "Socket connected"
              : "Socket disconnected"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
            <Users className="h-3 w-3" />
            {participantCount} participants
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
            <Clock3 className="h-3 w-3" />
            {formatTime(timeLimit)}
          </span>
        </div>
      </div>

      {/* HOST ROLE FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
            You are controlling this quiz as the host.
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <span>Quiz ID:</span>
            <span className="max-w-[220px] truncate font-mono text-slate-500">
              {quizId}
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}


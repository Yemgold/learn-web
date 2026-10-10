
"use client";

import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CircleDot,
  Radio,
  Wifi,
  WifiOff,
  CheckCircle2,
} from "lucide-react";

import ContestantAnswerStatus, {
  type ContestantAnswerStatusType,
} from "./ContestantAnswerStatus";

import ContestantEliminationStatus, {
  type ContestantEliminationState,
} from "./ContestantEliminationStatus";

import ContestantQuestion, {
  type ContestantQuestionData,
} from "./ContestantQuestion";

import ContestantScore from "./ContestantScore";

import ContestantTimer from "./ContestantTimer";

import FastestWinnerCard from "./FastestWinnerCard";

import type {
  QuizFastestWinner,
  TieBreakParticipant,
  TieBreakSelectionPayload,
} from "@/hooks/quiz-board/quizSocketTypes";

/* ============================================================
   PROPS
   ============================================================ */

export interface ContestantQuizShowProps {
  quizId: string;
  roomId: string;

  quizTitle?: string;
  subject?: string;
  description?: string;

  currentRound: number;
  totalRounds: number;

  question: ContestantQuestionData | null;

  selectedAnswer?: string | null;
  submittedAnswer?: string | null;

  answerSubmitted?: boolean;
  questionStarted?: boolean;
  questionLocked?: boolean;

  connected?: boolean;
  roomJoined?: boolean;

  timerStartedAt?: string | null;
  timerExpiresAt?: string | null;
  timeLimit?: number | null;

  score?: number;
  correctAnswers?: number;
  answeredQuestions?: number;

  rank?: number | null;

  totalParticipants?: number | null;
  activeParticipantCount?: number | null;
  targetParticipantCount?: number | null;

  answerStatus?: ContestantAnswerStatusType;
  answerStatusMessage?: string | null;
  pointsEarned?: number | null;

  eliminationStatus?: ContestantEliminationState;

  eliminated?: boolean;
  finalist?: boolean;
  winner?: boolean;

  /**
   * Fastest contestant to answer the current question correctly.
   */
  fastestWinner?: QuizFastestWinner | null;

  /**
   * Sent by the socket layer when the backend delivers
   * select_participants_to_be_removed to this contestant.
   *
   * The backend should send this event only to the designated winner.
   */
  tieBreakPayload?: TieBreakSelectionPayload | null;

  /**
   * Indicates that a tie-break selection is being submitted.
   */
  tieBreakLoading?: boolean;

  /**
   * The parent/socket layer must implement the actual backend event.
   * Receives the selected contestant user IDs.
   */
  onSubmitTieBreak?: (selectedUserIds: string[]) => void;

  error?: string | null;
  loading?: boolean;

  onBack?: () => void;

  /**
   * Called immediately when the contestant selects an answer.
   *
   * The parent/socket layer handles:
   * participant_selected_answer
   */
  onSelectAnswer: (value: string) => void;
}

/* ============================================================
   HELPERS
   ============================================================ */

function getTieBreakParticipants(
  payload: TieBreakSelectionPayload | null | undefined,
): TieBreakParticipant[] {
  const participants = payload?.participantsWithLeastTie;

  if (Array.isArray(participants)) {
    return participants;
  }

  if (
    participants &&
    Array.isArray(participants.entries)
  ) {
    return participants.entries;
  }

  return [];
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function ContestantQuizShow({
  quizId,
  roomId,

  quizTitle = "Quiz Competition",
  subject,
  description,

  currentRound,
  totalRounds,

  question,

  selectedAnswer = null,
  submittedAnswer = null,

  answerSubmitted = false,
  questionStarted = false,
  questionLocked = false,

  connected = false,
  roomJoined = false,

  timerStartedAt = null,
  timerExpiresAt = null,
  timeLimit = null,

  score = 0,
  correctAnswers = 0,
  answeredQuestions = 0,

  rank = null,

  totalParticipants = null,
  activeParticipantCount = null,
  targetParticipantCount = null,

  answerStatus = "IDLE",
  answerStatusMessage = null,
  pointsEarned = null,

  eliminationStatus = "ACTIVE",

  eliminated = false,
  finalist = false,
  winner = false,

  fastestWinner = null,

  tieBreakPayload = null,
  tieBreakLoading = false,
  onSubmitTieBreak,

  error = null,
  loading = false,

  onBack,
  onSelectAnswer,
}: ContestantQuizShowProps) {
  /* ============================================================
     TIE-BREAK STATE
     ============================================================ */

  const [selectedTieBreakUserIds, setSelectedTieBreakUserIds] =
    useState<string[]>([]);

  const tieBreakParticipants =
    getTieBreakParticipants(tieBreakPayload);

  /*
   * Reset the selection whenever a new tie-break payload arrives.
   */
  useEffect(() => {
    setSelectedTieBreakUserIds([]);
  }, [tieBreakPayload]);

  const toggleTieBreakParticipant = (userId: string) => {
    setSelectedTieBreakUserIds((previous) => {
      if (previous.includes(userId)) {
        return previous.filter((id) => id !== userId);
      }

      return [...previous, userId];
    });
  };

  const handleSubmitTieBreak = () => {
    if (
      !tieBreakPayload ||
      tieBreakLoading ||
      !onSubmitTieBreak ||
      selectedTieBreakUserIds.length === 0
    ) {
      return;
    }

    const eligibleIds = new Set(
      tieBreakParticipants
        .filter((participant) => !participant.isEliminated)
        .map((participant) => participant.userId),
    );

    const validSelectedIds = selectedTieBreakUserIds.filter(
      (userId) => eligibleIds.has(userId),
    );

    if (validSelectedIds.length === 0) {
      return;
    }

    console.log(
      "[ContestantQuizShow] Submitting tie-break selection:",
      {
        quizId,
        roomId,
        roundNumber: tieBreakPayload.roundNumber,
        selectedUserIds: validSelectedIds,
      },
    );

    onSubmitTieBreak(validSelectedIds);
  };

  /* ============================================================
     EFFECTIVE ELIMINATION STATUS
     ============================================================ */

  const effectiveEliminationStatus: ContestantEliminationState =
    winner
      ? "WINNER"
      : finalist
        ? "FINALIST"
        : eliminated
          ? "ELIMINATED"
          : eliminationStatus;

  /* ============================================================
     QUESTION STATE
     ============================================================ */

  const hasQuestion = Boolean(question);

  /* ============================================================
     CAN ANSWER
     ============================================================ */

  const canAnswer =
    connected &&
    roomJoined &&
    hasQuestion &&
    questionStarted &&
    !questionLocked &&
    !answerSubmitted &&
    !eliminated;

  const questionDisabled = !canAnswer;

  /* ============================================================
     DEBUG
     ============================================================ */

  console.log("[ContestantQuizShow] RENDER STATE", {
    quizId,
    roomId,
    loading,
    hasQuestion,
    questionId: question?.id ?? null,
    questionText: question?.question ?? null,
    questionNumber: question?.questionNumber ?? null,
    optionCount: question?.options?.length ?? 0,
    questionStarted,
    questionLocked,
    connected,
    roomJoined,
    selectedAnswer,
    submittedAnswer,
    answerSubmitted,
    canAnswer,
    questionDisabled,
    timerStartedAt,
    timerExpiresAt,
    timeLimit,
    fastestWinner,
    tieBreakActive: Boolean(tieBreakPayload),
    tieBreakParticipantCount: tieBreakParticipants.length,
    selectedTieBreakUserIds,
  });

  /* ============================================================
     ANSWER SELECTION
     ============================================================ */

  const handleSelectAnswer = (value: string) => {
    if (!canAnswer) {
      console.log(
        "[ContestantQuizShow] ANSWER SELECTION BLOCKED",
        {
          value,
          connected,
          roomJoined,
          hasQuestion,
          questionStarted,
          questionLocked,
          answerSubmitted,
          eliminated,
        },
      );

      return;
    }

    if (!question?.id) {
      console.warn(
        "[ContestantQuizShow] Cannot select answer: missing question ID",
      );

      return;
    }

    console.log("[ContestantQuizShow] ANSWER SELECTED", {
      quizId,
      roomId,
      questionId: question.id,
      questionNumber: question.questionNumber ?? null,
      answer: value,
    });

    onSelectAnswer(value);
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <header className="sticky top-0 z-30 mb-4 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                  aria-label="Leave quiz"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {quizTitle}
                </p>

                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {subject && <span>{subject}</span>}

                  {subject && (
                    <span className="text-slate-700">•</span>
                  )}

                  <span>
                    Round {currentRound} / {totalRounds}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div
                className={[
                  "hidden items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium sm:flex",
                  connected
                    ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                    : "border-red-400/20 bg-red-400/5 text-red-300",
                ].join(" ")}
              >
                {connected ? (
                  <Wifi className="h-3.5 w-3.5" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" />
                )}

                {connected ? "Live" : "Disconnected"}
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400">
                <Radio className="h-3.5 w-3.5 text-cyan-300" />

                <span className="hidden sm:inline">Room</span>

                <span className="font-mono text-slate-300">
                  {roomId}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* CONNECTION WARNING */}

        {!connected && (
          <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 shrink-0 text-amber-300" />

              <div>
                <p className="text-sm font-semibold text-amber-100">
                  Connection interrupted
                </p>

                <p className="mt-0.5 text-xs text-amber-200/60">
                  Reconnecting to the live quiz server.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3">
            <p className="text-sm font-medium text-red-200">
              {error}
            </p>
          </div>
        )}

        {/* TIE-BREAK SELECTION */}

        {tieBreakPayload && (
          <section className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Tie-break round
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Select contestants for elimination
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Select the contestants to remove from the competition.
                  Review their scores before submitting your selection.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
                Round {tieBreakPayload.roundNumber}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {tieBreakParticipants.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
                  The tie-break event was received, but its payload
                  contains no valid participants.
                </div>
              ) : (
                tieBreakParticipants.map((participant) => {
                  const selected = selectedTieBreakUserIds.includes(
                    participant.userId,
                  );

                  const disabled =
                    participant.isEliminated || tieBreakLoading;

                  return (
                    <label
                      key={participant.userId}
                      className={[
                        "flex items-center gap-3 rounded-xl border p-4 transition",
                        disabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer",
                        selected
                          ? "border-amber-300/50 bg-amber-300/[0.08]"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={disabled}
                        onChange={() =>
                          toggleTieBreakParticipant(participant.userId)
                        }
                        className="h-4 w-4 shrink-0 accent-amber-400"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="break-all text-sm font-semibold text-white">
                          Contestant {participant.userId}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span>
                            Rank: {participant.rank}
                          </span>

                          <span>
                            Round score: {participant.roundScore}
                          </span>

                          <span>
                            Total score: {participant.totalScore}
                          </span>

                          <span>
                            Correct: {participant.correctAnswers}
                          </span>

                          <span>
                            Answered: {participant.answeredQuestions}
                          </span>

                          <span>
                            Time: {participant.timeTakenInSeconds}s
                          </span>
                        </div>

                        {participant.isTied && (
                          <span className="mt-2 inline-flex rounded-full border border-amber-300/20 bg-amber-300/5 px-2 py-1 text-[11px] text-amber-200">
                            Tied
                          </span>
                        )}

                        {participant.isEliminated && (
                          <p className="mt-2 text-xs text-red-300">
                            Already eliminated
                          </p>
                        )}
                      </div>

                      {selected && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-300" />
                      )}
                    </label>
                  );
                })
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                {selectedTieBreakUserIds.length} contestant
                {selectedTieBreakUserIds.length === 1 ? "" : "s"} selected
              </p>

              <button
                type="button"
                onClick={handleSubmitTieBreak}
                disabled={
                  tieBreakLoading ||
                  selectedTieBreakUserIds.length === 0 ||
                  tieBreakParticipants.length === 0 ||
                  !onSubmitTieBreak
                }
                className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {tieBreakLoading
                  ? "Submitting selection..."
                  : "Submit Selection"}
              </button>
            </div>

            {!onSubmitTieBreak && (
              <p className="mt-3 text-xs leading-5 text-amber-200/70">
                The selection interface is ready, but the backend
                submission callback has not been connected yet.
              </p>
            )}
          </section>
        )}

        {/* TOP STATUS */}

        <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <ContestantEliminationStatus
            status={effectiveEliminationStatus}
            currentRound={currentRound}
            totalRounds={totalRounds}
            rank={rank}
            activeParticipantCount={activeParticipantCount}
            targetParticipantCount={targetParticipantCount}
            score={score}
          />

          <ContestantTimer
            startedAt={timerStartedAt}
            expiresAt={timerExpiresAt}
            timeLimit={timeLimit}
            active={
              hasQuestion &&
              questionStarted &&
              !questionLocked &&
              !answerSubmitted &&
              !eliminated
            }
            locked={questionLocked}
            compact
          />
        </div>

        {/* FASTEST WINNER */}

        {fastestWinner && (
          <div className="mb-4">
            <FastestWinnerCard
              winnerName={fastestWinner.name}
              winnerEmail={fastestWinner.email}
              showEmail={false}
            />
          </div>
        )}

        {/* MAIN */}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0">
            {/* QUESTION */}

            {loading && !hasQuestion ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-32 rounded-lg bg-white/10" />
                  <div className="h-20 w-full rounded-xl bg-white/10" />
                  <div className="h-14 w-full rounded-xl bg-white/10" />
                  <div className="h-14 w-full rounded-xl bg-white/10" />
                  <div className="h-14 w-full rounded-xl bg-white/10" />
                </div>
              </div>
            ) : eliminated ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
                <h2 className="text-xl font-bold text-red-100">
                  You have been eliminated
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-200/60">
                  You can continue watching the competition, but you
                  can no longer select answers.
                </p>
              </div>
            ) : (
              <ContestantQuestion
                question={question}
                selectedAnswer={selectedAnswer}
                submittedAnswer={submittedAnswer}
                answerSubmitted={answerSubmitted}
                questionLocked={questionLocked}
                disabled={questionDisabled}
                onSelectAnswer={handleSelectAnswer}
              />
            )}

            {/* ANSWER STATUS */}

            <div className="mt-4">
              <ContestantAnswerStatus
                status={answerStatus}
                selectedAnswer={selectedAnswer}
                submittedAnswer={submittedAnswer}
                pointsEarned={pointsEarned}
                message={answerStatusMessage}
              />
            </div>
          </section>

          {/* SCORE SIDEBAR */}

          <aside className="space-y-4">
            <ContestantScore
              score={score}
              rank={rank}
              correctAnswers={correctAnswers}
              answeredQuestions={answeredQuestions}
              totalQuestions={question?.totalQuestions ?? null}
              totalParticipants={totalParticipants}
              compact
            />

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center gap-2">
                <CircleDot className="h-4 w-4 text-cyan-300" />

                <h3 className="text-sm font-semibold text-white">
                  Competition status
                </h3>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {description ||
                  "Select each answer before the timer expires. The server determines validation, scores and qualification."}
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Room</span>

                  <span className="font-mono text-slate-300">
                    {roomId}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Connection</span>

                  <span
                    className={
                      connected
                        ? "text-emerald-300"
                        : "text-red-300"
                    }
                  >
                    {connected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Room joined</span>

                  <span
                    className={
                      roomJoined
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }
                  >
                    {roomJoined ? "Yes" : "Waiting"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Question</span>

                  <span
                    className={
                      hasQuestion
                        ? "text-cyan-300"
                        : "text-slate-500"
                    }
                  >
                    {hasQuestion ? "Displayed" : "Waiting"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Answering</span>

                  <span
                    className={
                      canAnswer
                        ? "text-emerald-300"
                        : "text-slate-500"
                    }
                  >
                    {canAnswer
                      ? "Open"
                      : hasQuestion
                        ? "Waiting"
                        : "Closed"}
                  </span>
                </div>

                {tieBreakPayload && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-500">Tie-break</span>

                    <span className="text-amber-300">
                      Selection required
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER */}

        <footer className="mt-6 rounded-2xl border border-white/5 bg-white/[0.015] px-4 py-3 text-center text-[11px] leading-5 text-slate-600">
          The quiz server is authoritative for question timing, answer
          validation, scoring, leaderboard position and elimination.
        </footer>
      </div>
    </main>
  );
}


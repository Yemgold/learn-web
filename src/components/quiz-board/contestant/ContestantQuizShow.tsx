



"use client";

import {
  ArrowLeft,
  CircleDot,
  Radio,
  Wifi,
  WifiOff,
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

  error?: string | null;
  loading?: boolean;

  onBack?: () => void;

  /**
   * Called immediately when the contestant selects
   * an answer option.
   *
   * The parent/socket layer is responsible for emitting:
   *
   * participant_selected_answer
   */
  onSelectAnswer: (value: string) => void;
}

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

  error = null,
  loading = false,

  onBack,
  onSelectAnswer,
}: ContestantQuizShowProps) {
  /*
   * ============================================================
   * EFFECTIVE ELIMINATION STATUS
   * ============================================================
   */
  const effectiveEliminationStatus: ContestantEliminationState =
    winner
      ? "WINNER"
      : finalist
        ? "FINALIST"
        : eliminated
          ? "ELIMINATED"
          : eliminationStatus;

  /*
   * ============================================================
   * QUESTION STATE
   * ============================================================
   *
   * The question object is the source of truth for whether
   * a question is currently available to display.
   */
  const hasQuestion = Boolean(question);

  /*
   * ============================================================
   * CAN ANSWER
   * ============================================================
   *
   * A contestant can select an answer only when:
   *
   * 1. Socket is connected
   * 2. Room has been joined
   * 3. Question exists
   * 4. Question has started
   * 5. Question isn't locked
   * 6. Answer hasn't already been submitted
   * 7. Contestant isn't eliminated
   */
  const canAnswer =
    connected &&
    roomJoined &&
    hasQuestion &&
    questionStarted &&
    !questionLocked &&
    !answerSubmitted &&
    !eliminated;

  /*
   * ============================================================
   * QUESTION DISABLED STATE
   * ============================================================
   */
  const questionDisabled = !canAnswer;

  /*
   * ============================================================
   * DEBUG
   * ============================================================
   */
  console.log(
    "[ContestantQuizShow] RENDER STATE",
    {
      quizId,
      roomId,

      loading,

      hasQuestion,

      questionId:
        question?.id ?? null,

      questionText:
        question?.question ?? null,

      questionNumber:
        question?.questionNumber ?? null,

      optionCount:
        question?.options?.length ?? 0,

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
    },
  );

  /*
   * ============================================================
   * DEBUG: ANSWER SELECTION
   * ============================================================
   *
   * ContestantQuestion -> ContestantAnswerOptions
   *
   * Selecting an option calls onSelectAnswer(value).
   *
   * The parent/socket layer should emit:
   *
   * participant_selected_answer
   *
   * ============================================================
   */
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

    console.log(
      "[ContestantQuizShow] ANSWER SELECTED",
      {
        quizId,
        roomId,
        questionId: question.id,
        questionNumber:
          question.questionNumber ?? null,
        answer: value,
      },
    );

    /*
     * IMPORTANT:
     *
     * Do not emit the socket event here.
     *
     * onSelectAnswer is supplied by the parent controller/
     * socket layer.
     *
     * That keeps this UI component independent from Socket.IO.
     */
    onSelectAnswer(value);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

        {/* ======================================================
            HEADER
            ====================================================== */}
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

                  {subject && (
                    <span>
                      {subject}
                    </span>
                  )}

                  {subject && (
                    <span className="text-slate-700">
                      •
                    </span>
                  )}

                  <span>
                    Round {currentRound} / {totalRounds}
                  </span>

                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">

              {/* CONNECTION */}
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

                {connected
                  ? "Live"
                  : "Disconnected"}
              </div>

              {/* ROOM */}
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400">

                <Radio className="h-3.5 w-3.5 text-cyan-300" />

                <span className="hidden sm:inline">
                  Room
                </span>

                <span className="font-mono text-slate-300">
                  {roomId}
                </span>

              </div>
            </div>
          </div>
        </header>

        {/* ======================================================
            CONNECTION WARNING
            ====================================================== */}
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

        {/* ======================================================
            ERROR
            ====================================================== */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3">
            <p className="text-sm font-medium text-red-200">
              {error}
            </p>
          </div>
        )}

        {/* ======================================================
            TOP STATUS
            ====================================================== */}
        <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto]">

          <ContestantEliminationStatus
            status={effectiveEliminationStatus}
            currentRound={currentRound}
            totalRounds={totalRounds}
            rank={rank}
            activeParticipantCount={
              activeParticipantCount
            }
            targetParticipantCount={
              targetParticipantCount
            }
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

        {/* ======================================================
            MAIN
            ====================================================== */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">

          <section className="min-w-0">

            {/* ==================================================
                QUESTION
                ================================================== */}

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
                  You can continue watching the competition,
                  but you can no longer select answers.
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

            {/* ==================================================
                ANSWER STATUS
                ================================================== */}

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

          {/* ====================================================
              SCORE SIDEBAR
              ==================================================== */}

          <aside className="space-y-4">

            <ContestantScore
              score={score}
              rank={rank}
              correctAnswers={correctAnswers}
              answeredQuestions={answeredQuestions}
              totalQuestions={
                question?.totalQuestions ?? null
              }
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

                {/* ROOM */}
                <div className="flex items-center justify-between gap-3">

                  <span className="text-slate-500">
                    Room
                  </span>

                  <span className="font-mono text-slate-300">
                    {roomId}
                  </span>

                </div>

                {/* CONNECTION */}
                <div className="flex items-center justify-between gap-3">

                  <span className="text-slate-500">
                    Connection
                  </span>

                  <span
                    className={
                      connected
                        ? "text-emerald-300"
                        : "text-red-300"
                    }
                  >
                    {connected
                      ? "Connected"
                      : "Disconnected"}
                  </span>

                </div>

                {/* ROOM JOINED */}
                <div className="flex items-center justify-between gap-3">

                  <span className="text-slate-500">
                    Room joined
                  </span>

                  <span
                    className={
                      roomJoined
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }
                  >
                    {roomJoined
                      ? "Yes"
                      : "Waiting"}
                  </span>

                </div>

                {/* QUESTION */}
                <div className="flex items-center justify-between gap-3">

                  <span className="text-slate-500">
                    Question
                  </span>

                  <span
                    className={
                      hasQuestion
                        ? "text-cyan-300"
                        : "text-slate-500"
                    }
                  >
                    {hasQuestion
                      ? "Displayed"
                      : "Waiting"}
                  </span>

                </div>

                {/* ANSWERING */}
                <div className="flex items-center justify-between gap-3">

                  <span className="text-slate-500">
                    Answering
                  </span>

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

              </div>
            </div>
          </aside>
        </div>

        {/* ======================================================
            FOOTER
            ====================================================== */}

        <footer className="mt-6 rounded-2xl border border-white/5 bg-white/[0.015] px-4 py-3 text-center text-[11px] leading-5 text-slate-600">
          The quiz server is authoritative for question timing,
          answer validation, scoring, leaderboard position and
          elimination.
        </footer>

      </div>
    </main>
  );
}
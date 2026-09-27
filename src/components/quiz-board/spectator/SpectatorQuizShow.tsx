




"use client";

import {
  Eye,
  RefreshCw,
  Radio,
} from "lucide-react";

import QuizRoomHeader from "../shared/QuizRoomHeader";
import QuizRoundStatus from "../shared/QuizRoundStatus";

import SpectatorLeaderboard, {
  type SpectatorLeaderboardEntry,
} from "./SpectatorLeaderboard";

import SpectatorLiveFeed, {
  type SpectatorFeedEvent,
} from "./SpectatorLiveFeed";

import SpectatorParticipantPanel, {
  type SpectatorParticipant,
} from "./SpectatorParticipantPanel";

import SpectatorQuestion from "./SpectatorQuestion";

import SpectatorTimer from "./SpectatorTimer";

export interface SpectatorQuizShowProps {
  quizId: string;
  roomId: string;

  quizTitle?: string;
  subject?: string;
  description?: string;

  currentRound: number;
  totalRounds: number;

  currentQuestionNumber?: number | null;
  totalQuestions?: number | null;

  question?: {
    id: string;
    question: string;
    options: Array<{
      label?: string;
      value: string;
    }>;
    questionNumber?: number | null;
    totalQuestions?: number | null;
    timeLimit?: number | null;
    startedAt?: string | null;
    expiresAt?: string | null;
  } | null;

  questionStarted?: boolean;
  questionLocked?: boolean;

  timeLimit?: number | null;
  startedAt?: string | null;
  expiresAt?: string | null;

  connected?: boolean;
  connectionStatus?:
    | "CONNECTED"
    | "CONNECTING"
    | "DISCONNECTED"
    | "ERROR";

  roomActivated?: boolean;

  participants: SpectatorParticipant[];

  leaderboard: SpectatorLeaderboardEntry[];

  feedEvents?: SpectatorFeedEvent[];

  loading?: boolean;
  questionLoading?: boolean;

  error?: string | null;

  onBack?: () => void;
  onRefresh?: () => void;

  onParticipantClick?: (
    participant: SpectatorParticipant,
  ) => void;

  onLeaderboardParticipantClick?: (
    participant: SpectatorLeaderboardEntry,
  ) => void;
}

export default function SpectatorQuizShow({
  quizId,
  roomId,

  quizTitle = "Live Quiz Competition",
  subject = "Quiz Board",
  description,

  currentRound,
  totalRounds,

  currentQuestionNumber = null,
  totalQuestions = null,

  question = null,

  questionStarted = false,
  questionLocked = false,

  timeLimit = null,
  startedAt = null,
  expiresAt = null,

  connected = false,
  connectionStatus,

  roomActivated = false,

  participants,
  leaderboard,

  feedEvents = [],

  loading = false,
  questionLoading = false,

  error = null,

  onBack,
  onRefresh,

  onParticipantClick,
  onLeaderboardParticipantClick,
}: SpectatorQuizShowProps) {
  const normalizedStartedAt =
    question?.startedAt ?? startedAt;

  const normalizedExpiresAt =
    question?.expiresAt ?? expiresAt;

  const normalizedTimeLimit =
    question?.timeLimit ?? timeLimit;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <QuizRoomHeader
        quizTitle={quizTitle}
        roomId={roomId}
        subject={subject}
        currentRound={currentRound}
        totalRounds={totalRounds}
        participantCount={
          participants.length
        }
        connected={connected}
        connectionStatus={connectionStatus}
        live={questionStarted}
        onBack={onBack}
      />

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* TOP STATUS */}
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.04] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
                <Eye className="h-5 w-5 text-violet-300" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white">
                  Spectator View
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  {description ||
                    "Watch the competition live without participating in the quiz."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={[
                    "h-3.5 w-3.5",
                    loading
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                />

                Refresh
              </button>
            )}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ROOM STATUS */}
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-600">
              <Radio className="h-3.5 w-3.5" />
              Connection
            </div>

            <p className="mt-2 text-sm font-semibold text-white">
              {connected
                ? "Connected"
                : "Disconnected"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-600">
              Room
            </div>

            <p className="mt-2 text-sm font-semibold text-white">
              {roomActivated
                ? "Active"
                : "Waiting"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-600">
              Participants
            </div>

            <p className="mt-2 text-sm font-semibold text-white">
              {participants.length}
            </p>
          </div>
        </div>

        {/* ROUND */}
        <div className="mb-5">
          <QuizRoundStatus
            currentRound={currentRound}
            totalRounds={totalRounds}
            status={
              questionLocked
                ? "COMPLETED"
                : questionStarted
                  ? "IN_PROGRESS"
                  : "READY"
            }
            currentQuestionNumber={
              currentQuestionNumber
            }
            totalQuestions={
              totalQuestions
            }
            activeParticipantCount={
              participants.filter(
                (participant) =>
                  participant.isActive !==
                    false &&
                  !participant.isEliminated,
              ).length
            }
          />
        </div>

        {/* MAIN GAME AREA */}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}
          <div className="space-y-5">
            <SpectatorQuestion
              question={question}
              currentQuestionNumber={
                currentQuestionNumber
              }
              totalQuestions={
                totalQuestions
              }
              timeLimit={
                normalizedTimeLimit
              }
              startedAt={
                normalizedStartedAt
              }
              expiresAt={
                normalizedExpiresAt
              }
              questionLive={
                questionStarted
              }
              questionLocked={
                questionLocked
              }
              loading={questionLoading}
            />

            <SpectatorTimer
              startedAt={
                normalizedStartedAt
              }
              expiresAt={
                normalizedExpiresAt
              }
              timeLimit={
                normalizedTimeLimit
              }
              active={questionStarted}
              locked={questionLocked}
            />

            <SpectatorLiveFeed
              events={feedEvents}
              autoScroll
              maxVisible={15}
            />
          </div>

          {/* RIGHT */}
          <aside className="space-y-5">
            <SpectatorLeaderboard
              entries={leaderboard}
              currentQuestionNumber={
                currentQuestionNumber
              }
              totalQuestions={
                totalQuestions
              }
              maxVisible={10}
              onParticipantClick={
                onLeaderboardParticipantClick
              }
            />

            <SpectatorParticipantPanel
              participants={participants}
              maxVisible={15}
              onParticipantClick={
                onParticipantClick
              }
            />
          </aside>
        </div>
      </div>

      {/* QUIZ ID FOR DEBUG/INTEGRATION */}
      <div className="mx-auto max-w-7xl px-4 pb-6 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-[9px] text-slate-800">
          Quiz: {quizId}
        </p>
      </div>
    </main>
  );
}
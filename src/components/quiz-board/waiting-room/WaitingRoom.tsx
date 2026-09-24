













"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import ContestantAccessCard from "@/components/quiz-board/waiting-room/ContestantAccessCard";
import ContestantStats from "@/components/quiz-board/waiting-room/ContestantStats";
import ContestantsGrid from "@/components/quiz-board/waiting-room/ContestantsGrid";
import CompetitionDetails from "@/components/quiz-board/waiting-room/CompetitionDetails";
import FinalRewards from "@/components/quiz-board/waiting-room/FinalRewards";
import LiveQuizCard from "@/components/quiz-board/waiting-room/LiveQuizCard";
import QualificationJourney from "@/components/quiz-board/waiting-room/QualificationJourney";
import SocketStatus from "@/components/quiz-board/waiting-room/SocketStatus";
import WaitingForHostCard from "@/components/quiz-board/waiting-room/WaitingForHostCard";
import WaitingRoomFooter from "@/components/quiz-board/waiting-room/WaitingRoomFooter";
import WaitingRoomHeader from "@/components/quiz-board/waiting-room/WaitingRoomHeader";
import WaitingRoomStatus from "@/components/quiz-board/waiting-room/WaitingRoomStatus";

import useQuizRoom from "@/hooks/quiz-board/useQuizRoom";
import useQuizRoomSocket from "@/hooks/quiz-board/useQuizRoomSocket";

import {
  getApiErrorMessage,
  getContestantCapacity,
  getCurrentRound,
  getJoinedCount,
  getNumberOfRounds,
  getQuizRoomId,
  getRemainingPlayers,
  getRoomContestantCount,
  getRoomCurrentRound,
  getRoomId,
  getRoomMaxContestants,
  getSubjectLabel,
  getTimePerQuestion,
} from "@/lib/quiz-board/waiting-room/helpers";

import {
  isRoomActivated,
  isRoomCompleted,
  isRoomInProgress,
} from "@/lib/quiz-board/waiting-room/status";

import {
  createPlaySession,
  savePlaySession,
} from "@/lib/quiz-board/waiting-room/play-session";

import type {
  QuizCompetition,
  QuizRoom,
} from "@/lib/quiz-board/waiting-room/types";

interface WaitingRoomProps {
  quizId: string;
  contestantId?: string | null;

  /**
   * IMPORTANT:
   * The My Competitions page should pass the quiz returned by
   * get-all-my-quizzes/{userId}.
   *
   * This avoids calling get-quiz-by-quizId/{quizId}.
   */
  initialQuiz?: QuizCompetition | null;
}

export default function WaitingRoom({
  quizId,
  contestantId,
  initialQuiz = null,
}: WaitingRoomProps) {
  const router = useRouter();

  /*
   * ---------------------------------------------------------
   * Quiz / room state
   *
   * useQuizRoom no longer fetches the quiz by quizId.
   * Therefore the quiz comes from initialQuiz.
   * ---------------------------------------------------------
   */
 const {
  quiz,
  room,
  loading,
  refreshing,
  error,
  roomId,
  refresh,
} = useQuizRoom(quizId, {
  
});

  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [navigating, setNavigating] = useState(false);

  /*
   * ---------------------------------------------------------
   * Contestant ID
   * ---------------------------------------------------------
   */
  const resolvedContestantId = useMemo(() => {
    if (
      typeof contestantId === "string" &&
      contestantId.trim().length > 0
    ) {
      return contestantId.trim();
    }

    return null;
  }, [contestantId]);

  /*
   * ---------------------------------------------------------
   * Room ID
   *
   * The room ID can already exist before the Admin activates
   * the room.
   *
   * That is expected.
   * ---------------------------------------------------------
   */
  const resolvedRoomId = useMemo(() => {
    return (
      roomId ??
      getQuizRoomId(quiz) ??
      getRoomId(room)
    );
  }, [roomId, quiz, room]);

  /*
   * ---------------------------------------------------------
   * Contestant count
   * ---------------------------------------------------------
   */
  const contestantCount = useMemo(() => {
    const roomCount = getRoomContestantCount(room);

    if (
      typeof roomCount === "number" &&
      Number.isFinite(roomCount) &&
      roomCount > 0
    ) {
      return roomCount;
    }

    const quizCount = getJoinedCount(quiz);

    if (
      typeof quizCount === "number" &&
      Number.isFinite(quizCount) &&
      quizCount > 0
    ) {
      return quizCount;
    }

    return 0;
  }, [room, quiz]);

  /*
   * ---------------------------------------------------------
   * Maximum contestants
   * ---------------------------------------------------------
   */
  const maxContestants = useMemo(() => {
    const roomCapacity = getRoomMaxContestants(room);

    if (
      typeof roomCapacity === "number" &&
      Number.isFinite(roomCapacity) &&
      roomCapacity > 0
    ) {
      return roomCapacity;
    }

    const quizCapacity = getContestantCapacity(quiz);

    if (
      typeof quizCapacity === "number" &&
      Number.isFinite(quizCapacity) &&
      quizCapacity > 0
    ) {
      return quizCapacity;
    }

    return 0;
  }, [room, quiz]);

  /*
   * ---------------------------------------------------------
   * Current round
   * ---------------------------------------------------------
   */
  const currentRound = useMemo(() => {
    const roomRound = getRoomCurrentRound(room);

    if (
      typeof roomRound === "number" &&
      Number.isFinite(roomRound) &&
      roomRound > 0
    ) {
      return roomRound;
    }

    const quizRound = getCurrentRound(quiz);

    if (
      typeof quizRound === "number" &&
      Number.isFinite(quizRound) &&
      quizRound > 0
    ) {
      return quizRound;
    }

    return 0;
  }, [room, quiz]);

  /*
   * ---------------------------------------------------------
   * Total rounds
   * ---------------------------------------------------------
   */
  const totalRounds = useMemo(() => {
    const rounds = getNumberOfRounds(quiz);

    if (
      typeof rounds === "number" &&
      Number.isFinite(rounds) &&
      rounds > 0
    ) {
      return rounds;
    }

    return 0;
  }, [quiz]);

  /*
   * ---------------------------------------------------------
   * Time per question
   * ---------------------------------------------------------
   */
  const timePerQuestion = useMemo(() => {
    const time = getTimePerQuestion(quiz);

    if (
      typeof time === "number" &&
      Number.isFinite(time) &&
      time > 0
    ) {
      return time;
    }

    return 30;
  }, [quiz]);

  /*
   * ---------------------------------------------------------
   * Status
   * ---------------------------------------------------------
   */
  const roomStatus = useMemo(() => {
    if (
      room &&
      typeof room.status === "string"
    ) {
      return room.status;
    }

    return null;
  }, [room]);

  const quizStatus = useMemo(() => {
    if (
      quiz &&
      typeof quiz.status === "string"
    ) {
      return quiz.status;
    }

    return null;
  }, [quiz]);

  /*
   * ---------------------------------------------------------
   * Room state
   *
   * IMPORTANT:
   *
   * roomActivated === false does NOT mean the waiting room
   * should be hidden.
   *
   * It only means the Admin has not activated the room yet.
   * ---------------------------------------------------------
   */
  const roomActivated = useMemo(() => {
    return isRoomActivated(room);
  }, [room]);

  const roomInProgress = useMemo(() => {
    return (
      isRoomInProgress(room) ||
      currentRound > 0
    );
  }, [room, currentRound]);

  const roomCompleted = useMemo(() => {
    return isRoomCompleted(room);
  }, [room]);

  /*
   * ---------------------------------------------------------
   * Socket.IO
   * ---------------------------------------------------------
   */
  const socket = useQuizRoomSocket({
    roomId: resolvedRoomId,
    quizId,
    contestantId: resolvedContestantId,
    role: "CONTESTANT",
  });

  const {
    socketConnected,
    socketRoomJoined,
    socketParticipantCount,
    socketError,
    connect,
    joinRoom,
  } = socket;

  /*
   * ---------------------------------------------------------
   * Connect as soon as we know the room ID.
   *
   * The room does NOT need to be activated first.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!resolvedRoomId) {
      return;
    }

    connect();
  }, [
    resolvedRoomId,
    connect,
  ]);

  /*
   * ---------------------------------------------------------
   * Automatically join the Socket.IO room.
   *
   * IMPORTANT:
   *
   * DO NOT require roomActivated here.
   *
   * The contestant joins the waiting room BEFORE the Admin
   * activates it.
   *
   * Later:
   *
   * room_activated
   *      ↓
   * round_started
   *      ↓
   * /play
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (
      !resolvedRoomId ||
      !resolvedContestantId
    ) {
      return;
    }

    if (socketRoomJoined) {
      return;
    }

    if (!socketConnected) {
      return;
    }

    joinRoom();
  }, [
    resolvedRoomId,
    resolvedContestantId,
    socketConnected,
    socketRoomJoined,
    joinRoom,
  ]);

  /*
   * ---------------------------------------------------------
   * Refresh local state once a round is in progress.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!roomInProgress) {
      return;
    }

    void refresh();
  }, [
    roomInProgress,
    refresh,
  ]);

  /*
   * ---------------------------------------------------------
   * Manual join
   * ---------------------------------------------------------
   */
  const handleJoinRoom = useCallback(async () => {
    if (
      joining ||
      !resolvedRoomId ||
      !resolvedContestantId
    ) {
      return;
    }

    setJoining(true);
    setJoinError(null);

    try {
      /*
       * Manual joining also does NOT require activation.
       */
      joinRoom();

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 350);
      });

      await refresh();
    } catch (error) {
      setJoinError(
        getApiErrorMessage(
          error,
          "Unable to join the quiz room.",
        ),
      );
    } finally {
      setJoining(false);
    }
  }, [
    joining,
    resolvedRoomId,
    resolvedContestantId,
    joinRoom,
    refresh,
  ]);

  /*
   * ---------------------------------------------------------
   * Reconnect
   * ---------------------------------------------------------
   */
  const handleReconnect = useCallback(() => {
    setJoinError(null);

    connect();

    if (
      resolvedRoomId &&
      resolvedContestantId
    ) {
      window.setTimeout(() => {
        joinRoom();
      }, 250);
    }
  }, [
    connect,
    joinRoom,
    resolvedRoomId,
    resolvedContestantId,
  ]);

  /*
   * ---------------------------------------------------------
   * Open live quiz
   * ---------------------------------------------------------
   */
  const createSessionAndOpenQuiz = useCallback(() => {
    if (!quiz) {
      return;
    }

    const effectiveCurrentRound = Math.max(
      currentRound,
      1,
    );

    const session = createPlaySession({
      quizId,
      quizTitle:
        typeof quiz.quiz_title === "string"
          ? quiz.quiz_title
          : "Quiz Competition",

      subject: getSubjectLabel(quiz),

      description:
        typeof quiz.description === "string"
          ? quiz.description
          : "",

      currentRound: effectiveCurrentRound,

      numberOfRounds: totalRounds,

      timePerQuestion,

      contestantCapacity: maxContestants,

      joinedCount: contestantCount,

      roomId: resolvedRoomId ?? null,

      startDate:
        typeof quiz.start_date === "string"
          ? quiz.start_date
          : "",
    });

    savePlaySession(session);

    setNavigating(true);

    router.push(
      `/student/quiz-board/${encodeURIComponent(
        quizId,
      )}/play`,
    );
  }, [
    quiz,
    quizId,
    currentRound,
    totalRounds,
    timePerQuestion,
    maxContestants,
    contestantCount,
    resolvedRoomId,
    router,
  ]);

  /*
   * ---------------------------------------------------------
   * Leave waiting room
   * ---------------------------------------------------------
   */
  const handleLeave = useCallback(() => {
    if (leaving) {
      return;
    }

    setLeaving(true);

    router.push(
      "/student/quiz-board/my-competitions",
    );
  }, [
    leaving,
    router,
  ]);

  /*
   * ---------------------------------------------------------
   * Joined count
   * ---------------------------------------------------------
   */
  const joinedCount = Math.max(
    contestantCount,
    typeof socketParticipantCount === "number"
      ? socketParticipantCount
      : 0,
  );

  /*
   * ---------------------------------------------------------
   * Remaining players
   * ---------------------------------------------------------
   */
  const remainingPlayers = useMemo(() => {
    if (quiz) {
      const result = getRemainingPlayers(quiz);

      if (
        typeof result === "number" &&
        Number.isFinite(result)
      ) {
        return result;
      }
    }

    return Math.max(
      maxContestants - joinedCount,
      0,
    );
  }, [
    quiz,
    joinedCount,
    maxContestants,
  ]);

  /*
   * ---------------------------------------------------------
   * Rewards
   * ---------------------------------------------------------
   */
  const finalRoundInformation =
    quiz?.final_round_information;

  const firstPositionReward =
    typeof finalRoundInformation?.first_position_reward ===
    "number"
      ? finalRoundInformation.first_position_reward
      : null;

  const secondPositionReward =
    typeof finalRoundInformation?.second_position_reward ===
    "number"
      ? finalRoundInformation.second_position_reward
      : null;

  /*
   * ---------------------------------------------------------
   * Completion
   * ---------------------------------------------------------
   */
  const normalizedQuizStatus =
    typeof quizStatus === "string"
      ? quizStatus.trim().toUpperCase()
      : "";

  const completed =
    roomCompleted ||
    normalizedQuizStatus === "COMPLETED" ||
    normalizedQuizStatus === "FINISHED";

  const eliminatedInRound: number | null = null;

  /*
   * ---------------------------------------------------------
   * Loading
   *
   * Only show the loading screen when there is genuinely
   * no quiz data yet.
   * ---------------------------------------------------------
   */
  if (loading && !quiz) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-5">
            <div className="h-64 rounded-3xl bg-white/[0.04]" />

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="h-72 rounded-2xl bg-white/[0.04]" />
              <div className="h-72 rounded-2xl bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * Error
   * ---------------------------------------------------------
   */
  if (!quiz && error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-6 text-center">
          <h1 className="text-xl font-bold text-white">
            Unable to Load Waiting Room
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * Main waiting room
   * ---------------------------------------------------------
   */
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">

        <WaitingRoomHeader
          quizId={quizId}
          title={
            typeof quiz?.quiz_title === "string"
              ? quiz.quiz_title
              : "Quiz Competition"
          }
          description={
            typeof quiz?.description === "string"
              ? quiz.description
              : undefined
          }
          subject={getSubjectLabel(quiz)}
          status={quizStatus}
          currentRound={currentRound}
          totalRounds={totalRounds}
          contestantCount={joinedCount}
          maxContestants={maxContestants}
          startDate={
            typeof quiz?.start_date === "string"
              ? quiz.start_date
              : null
          }
        />

        <WaitingRoomStatus
          roomActivated={roomActivated}
          roomJoined={socketRoomJoined}
          socketConnected={socketConnected}
          socketError={socketError}
          contestantCount={joinedCount}
          maxContestants={maxContestants}
          currentRound={currentRound}
          totalRounds={totalRounds}
          roomStatus={roomStatus}
          quizStatus={quizStatus}
          loading={loading}
          error={error ?? joinError}
          onReconnect={handleReconnect}
          reconnecting={refreshing}
        />

        <ContestantStats
          contestantCount={joinedCount}
          maxContestants={maxContestants}
          currentRound={currentRound}
          totalRounds={totalRounds}
          socketConnected={socketConnected}
          socketRoomJoined={socketRoomJoined}
          roomActivated={roomActivated}
          remainingPlayers={remainingPlayers}
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">

          <CompetitionDetails
            quiz={quiz as QuizCompetition | null}
            room={room as QuizRoom | null}
            contestantCount={joinedCount}
            maxContestants={maxContestants}
            currentRound={currentRound}
          />

          <ContestantAccessCard
            contestantId={resolvedContestantId}
            contestantCount={joinedCount}
            maxContestants={maxContestants}
            roomActivated={roomActivated}
            roomJoined={socketRoomJoined}
            joining={joining}
            error={
              joinError ??
              undefined
            }
            /*
             * The contestant can join before activation.
             *
             * If your ContestantAccessCard uses this callback
             * as the "Join Room" button, it must NOT be gated
             * by roomActivated.
             */
            onJoinRoom={
              resolvedContestantId &&
              resolvedRoomId
                ? handleJoinRoom
                : undefined
            }
          />

        </div>

        <ContestantsGrid
          quiz={quiz as QuizCompetition | null}
          contestantCount={joinedCount}
          maxContestants={maxContestants}
          currentContestantId={
            resolvedContestantId
          }
          connectedContestantIds={[]}
          loading={loading}
        />

        <SocketStatus
          socketConnected={socketConnected}
          socketRoomJoined={socketRoomJoined}
          socketError={socketError}
          roomId={resolvedRoomId}
          onReconnect={handleReconnect}
          reconnecting={refreshing}
        />

        {roomInProgress ? (
          <LiveQuizCard
            currentRound={currentRound}
            totalRounds={totalRounds}
            contestantCount={joinedCount}
            maxContestants={maxContestants}
            timePerQuestion={timePerQuestion}
            socketConnected={socketConnected}
            socketRoomJoined={socketRoomJoined}
            navigating={navigating}
            onEnterQuiz={
              socketRoomJoined
                ? createSessionAndOpenQuiz
                : undefined
            }
          />
        ) : (
          <WaitingForHostCard
            roomActivated={roomActivated}
            roomJoined={socketRoomJoined}
            socketConnected={socketConnected}
            currentRound={currentRound}
            totalRounds={totalRounds}
          />
        )}

        <QualificationJourney
          currentRound={currentRound}
          totalRounds={totalRounds}
          contestantCount={joinedCount}
          maxContestants={maxContestants}
          eliminatedInRound={eliminatedInRound}
          completed={completed}
        />

        <FinalRewards
          firstPositionReward={
            firstPositionReward
          }
          secondPositionReward={
            secondPositionReward
          }
          currencyLabel="CBT Points"
          showEmptyState
        />

        <WaitingRoomFooter
          quizId={quizId}
          refreshing={refreshing}
          leaving={leaving}
          onRefresh={() => void refresh()}
          onLeave={handleLeave}
        />

      </div>
    </main>
  );
}
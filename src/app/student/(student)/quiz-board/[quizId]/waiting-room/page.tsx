



"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Crown,
  Loader2,
  LogOut,
  Medal,
  MessageCircle,
  Radio,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getQuizById } from "@/lib/api/quizCompetition";

import {
  getQuizSocket,
  disconnectQuizSocket,
} from "@/lib/socket/quizSocket";

/* =========================================================
   CONSTANTS
========================================================= */

const POLLING_INTERVAL = 60_000;

/* =========================================================
   TYPES
========================================================= */

type DifficultyBreakdown = {
  easy?: number;
  medium?: number;
  hard?: number;
};

type QuizRound = {
  round?: number;
  round_number?: number;
  no_of_questions?: number;
  difficultyBreakdown?: DifficultyBreakdown;
  exit_number?: number;
  exit_reward?: number;
};

type FinalRoundInformation = {
  no_of_questions?: number;
  difficultyBreakdown?: DifficultyBreakdown;
  first_position_reward?: number;
  second_position_reward?: number;
};

type JoinedUser =
  | string
  | {
      _id?: string;
      id?: string;
      userId?: string;
      name?: string;
      username?: string;
      fullName?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };

type QuizCompetition = {
  _id: string;
  quiz_title?: string;
  description?: string;
  status?: string;

  subject?:
    | string
    | {
        _id?: string;
        name?: string;
      }
    | null;

  time_per_question?: number;
  start_date?: string;

  no_of_contestants?: number;
  number_of_rounds?: number;

  round_information?: QuizRound[];

  final_round_information?: FinalRoundInformation;

  current_round?: number;

  room_id?: string | null;

  joined_users?: JoinedUser[];
};

type QuizApiResponse = {
  success?: boolean;
  message?: string;
  data?:
    | QuizCompetition
    | {
        quiz?: QuizCompetition;
      };
};

type LobbyStatus =
  | "loading"
  | "waiting_for_players"
  | "waiting_for_room"
  | "waiting_for_start"
  | "live"
  | "completed"
  | "error";

/* =========================================================
   SOCKET EVENT TYPES
========================================================= */

/*
 * These payloads are intentionally flexible because the
 * exact backend Socket.IO payload can vary.
 *
 * The important thing is that the event names match the
 * backend:
 *
 * join_room
 * joined_room_ack
 * participant_joined_room
 * round_started
 */

type SocketRoundStartedPayload = {
  quizId?: string;
  quiz_id?: string;
  roomId?: string;
  room_id?: string;
  currentRound?: number;
  current_round?: number;
  round?: number;
  round_number?: number;
};

type SocketJoinedRoomAckPayload = {
  success?: boolean;
  message?: string;
  roomId?: string;
  room_id?: string;
  quizId?: string;
  quiz_id?: string;
};

type SocketParticipantJoinedPayload = {
  userId?: string;
  user_id?: string;
  participantId?: string;
  participant_id?: string;
  roomId?: string;
  room_id?: string;
  joinedCount?: number;
  joined_count?: number;
  participantCount?: number;
  participant_count?: number;
};

/* =========================================================
   HELPERS
========================================================= */

function extractQuiz(
  response: QuizApiResponse,
): QuizCompetition | null {
  if (!response) {
    return null;
  }

  const rootData = response.data;

  if (!rootData) {
    return null;
  }

  if (
    typeof rootData === "object" &&
    "_id" in rootData
  ) {
    return rootData as QuizCompetition;
  }

  if (
    typeof rootData === "object" &&
    "quiz" in rootData &&
    rootData.quiz
  ) {
    return rootData.quiz;
  }

  return null;
}

/* =========================================================
   USER HELPERS
========================================================= */

function getUserName(
  user: JoinedUser,
  index: number,
): string {
  if (typeof user === "string") {
    return `Contestant ${index + 1}`;
  }

  if (user.fullName?.trim()) {
    return user.fullName.trim();
  }

  if (
    user.firstName?.trim() ||
    user.lastName?.trim()
  ) {
    return [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  if (user.name?.trim()) {
    return user.name.trim();
  }

  if (user.username?.trim()) {
    return user.username.trim();
  }

  if (user.email?.trim()) {
    return user.email.split("@")[0];
  }

  return `Contestant ${index + 1}`;
}

function getUserInitials(
  name: string,
): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${
    parts[parts.length - 1][0]
  }`.toUpperCase();
}

function getEntityId(
  user: JoinedUser,
): string {
  if (typeof user === "string") {
    return user;
  }

  return (
    user._id ||
    user.id ||
    user.userId ||
    user.email ||
    ""
  );
}

/* =========================================================
   QUIZ HELPERS
========================================================= */

function getSubjectName(
  quiz: QuizCompetition,
): string {
  if (!quiz.subject) {
    return "";
  }

  if (typeof quiz.subject === "string") {
    return "";
  }

  return quiz.subject.name || "";
}

function getTotalQuestions(
  quiz: QuizCompetition,
): number {
  const eliminationQuestions = (
    quiz.round_information || []
  ).reduce(
    (total, round) =>
      total +
      Number(round.no_of_questions ?? 0),
    0,
  );

  const finalQuestions = Number(
    quiz.final_round_information
      ?.no_of_questions ?? 0,
  );

  return (
    eliminationQuestions +
    finalQuestions
  );
}

function getQualificationSequence(
  quiz: QuizCompetition,
): number[] {
  const contestants = Math.max(
    Number(
      quiz.no_of_contestants ?? 0,
    ),
    1,
  );

  const sequence: number[] = [
    contestants,
  ];

  let remaining = contestants;

  const rounds =
    quiz.round_information || [];

  for (const round of rounds) {
    const exitNumber = Math.max(
      Number(round.exit_number ?? 0),
      0,
    );

    if (exitNumber > 0) {
      remaining = Math.max(
        1,
        remaining - exitNumber,
      );

      if (
        remaining <
        sequence[sequence.length - 1]
      ) {
        sequence.push(remaining);
      }
    }
  }

  if (
    remaining > 1 &&
    !sequence.includes(2)
  ) {
    sequence.push(2);
  }

  if (!sequence.includes(1)) {
    sequence.push(1);
  }

  return sequence;
}

function getRoundLabel(
  currentRound: number,
  quiz: QuizCompetition,
): string {
  const totalRounds = Number(
    quiz.number_of_rounds ?? 0,
  );

  if (currentRound <= 0) {
    return "Waiting Room";
  }

  if (
    totalRounds > 0 &&
    currentRound >= totalRounds
  ) {
    return "Final Round";
  }

  return `Round ${currentRound}`;
}

function formatStartDate(
  value?: string,
): string {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function formatStatus(
  value?: string,
): string {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function QuizWaitingRoomPage() {
  const router = useRouter();
  const params = useParams();

  const quizId =
    typeof params?.quizId === "string"
      ? params.quizId
      : Array.isArray(params?.quizId)
        ? params.quizId[0]
        : "";

  /* =======================================================
     STATE
  ======================================================= */

  const [quiz, setQuiz] =
    useState<QuizCompetition | null>(
      null,
    );

  const [status, setStatus] =
    useState<LobbyStatus>("loading");

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  const [lastUpdated, setLastUpdated] =
    useState<number>(() => Date.now());

  /*
   * Socket connection state.
   *
   * This tells the UI whether the browser is
   * actually connected to the Socket.IO server.
   */
  const [socketConnected, setSocketConnected] =
    useState(false);

  /*
   * This tells us that the backend acknowledged
   * the student's join_room event.
   *
   * This is different from joined_users.
   */
  const [socketRoomJoined, setSocketRoomJoined] =
    useState(false);

  /*
   * Number of participants reported by Socket.IO.
   *
   * This is informational only.
   */
  const [socketParticipantCount, setSocketParticipantCount] =
    useState<number | null>(null);

  /*
   * Prevent duplicate API requests.
   */
  const requestInFlightRef =
    useRef(false);

  /*
   * Polling timeout.
   */
  const pollingTimeoutRef =
    useRef<number | null>(null);

  /*
   * Prevent multiple navigation attempts
   * when both REST polling and Socket.IO
   * detect the competition start.
   */
  const navigatingToPlayRef =
    useRef(false);

  /*
   * Store the room ID currently joined through
   * Socket.IO.
   */
  const joinedSocketRoomRef =
    useRef<string | null>(null);

  /* =======================================================
     NAVIGATE TO PLAY
  ======================================================= */

  const enterPlayPage =
    useCallback(() => {
      if (!quizId) {
        return;
      }

      if (navigatingToPlayRef.current) {
        return;
      }

      navigatingToPlayRef.current = true;

      router.push(
        `/student/quiz-board/${quizId}/play`,
      );
    }, [quizId, router]);

  /* =======================================================
     UPDATE LOBBY STATE
  ======================================================= */

  const updateLobbyStatus =
    useCallback(
      (nextQuiz: QuizCompetition) => {
        const competitionStatus =
          String(
            nextQuiz.status ?? "",
          ).toUpperCase();

        const currentRound = Number(
          nextQuiz.current_round ?? 0,
        );

        const joinedCount =
          Array.isArray(
            nextQuiz.joined_users,
          )
            ? nextQuiz.joined_users.length
            : 0;

        const maxPlayers = Math.max(
          Number(
            nextQuiz.no_of_contestants ??
              0,
          ),
          0,
        );

        const isFull =
          maxPlayers > 0 &&
          joinedCount >= maxPlayers;

        const hasRoom = Boolean(
          nextQuiz.room_id?.trim(),
        );

        /* -----------------------------------------------
           COMPLETED
        ------------------------------------------------ */

        if (
          competitionStatus ===
            "COMPLETED" ||
          competitionStatus === "FINISHED"
        ) {
          setStatus("completed");
          return;
        }

        /* -----------------------------------------------
           STARTED
           
           REST fallback:
           current_round > 0.
           
           We don't depend on a LIVE status because
           your backend may not use one.
        ------------------------------------------------ */

        if (currentRound > 0) {
          setStatus("live");
          return;
        }

        /* -----------------------------------------------
           CONTESTANTS NOT FULL
        ------------------------------------------------ */

        if (!isFull) {
          setStatus(
            "waiting_for_players",
          );
          return;
        }

        /* -----------------------------------------------
           FULL BUT ROOM NOT CREATED
        ------------------------------------------------ */

        if (!hasRoom) {
          setStatus(
            "waiting_for_room",
          );
          return;
        }

        /* -----------------------------------------------
           ROOM CREATED
           
           Socket.IO should now be used to wait for
           the backend round_started event.
        ------------------------------------------------ */

        setStatus("waiting_for_start");
      },
      [],
    );

  /* =======================================================
     LOAD QUIZ
  ======================================================= */

  const loadQuiz = useCallback(
    async (silent = false) => {
      if (!quizId) {
        setError(
          "Competition ID is missing.",
        );
        setStatus("error");
        return;
      }

      if (requestInFlightRef.current) {
        return;
      }

      requestInFlightRef.current = true;

      if (silent) {
        setRefreshing(true);
      } else {
        setStatus("loading");
      }

      if (!silent) {
        setError("");
      }

      try {
        const response =
          (await getQuizById(
            quizId,
          )) as QuizApiResponse;

        const nextQuiz =
          extractQuiz(response);

        if (!nextQuiz) {
          throw new Error(
            response?.message ||
              "Unable to load this competition.",
          );
        }

        setQuiz(nextQuiz);

        updateLobbyStatus(
          nextQuiz,
        );

        setLastUpdated(
          Date.now(),
        );

        if (silent) {
          setError("");
        }
      } catch (err: any) {
        console.error(
          "Unable to load Quiz Board competition:",
          err,
        );

        const message =
          err?.response?.data
            ?.message ||
          err?.message ||
          "Unable to load the competition.";

        if (!silent) {
          setError(message);
          setStatus("error");
        } else {
          console.warn(
            "Quiz Board automatic refresh failed:",
            message,
          );
        }
      } finally {
        requestInFlightRef.current =
          false;

        setRefreshing(false);
      }
    },
    [
      quizId,
      updateLobbyStatus,
    ],
  );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  /* =======================================================
     SOCKET.IO CONNECTION
     
     FLOW:
     
     1. REST API returns room_id.
     2. Browser connects to Socket.IO server.
     3. Browser emits join_room.
     4. Backend puts this socket into the room.
     5. Backend sends joined_room_ack.
     6. Backend sends participant_joined_room
        when another contestant joins.
     7. Admin starts the competition.
     8. Backend emits round_started.
     9. Student enters /play.
  ======================================================= */

  useEffect(() => {
    if (!quizId) {
      return;
    }

    const roomId =
      quiz?.room_id?.trim();

    /*
     * No room_id means there is no Socket.IO room
     * to join yet.
     */
    if (!roomId) {
      setSocketConnected(false);
      setSocketRoomJoined(false);
      setSocketParticipantCount(null);
      joinedSocketRoomRef.current = null;

      return;
    }

    let cancelled = false;

    const socket =
      getQuizSocket();

    /*
     * Connection established.
     */
    const handleConnect =
      () => {
        if (cancelled) {
          return;
        }

        console.log(
          "[Quiz Socket] Connected:",
          socket.id,
        );

        setSocketConnected(true);

        /*
         * Prevent emitting duplicate join_room
         * for the same room.
         */
        if (
          joinedSocketRoomRef.current !==
          roomId
        ) {
          console.log(
            "[Quiz Socket] Joining room:",
            roomId,
          );

          /*
           * IMPORTANT:
           * This payload must match the backend.
           *
           * We are using room_id because that is
           * the naming used by your quiz API.
           */
          socket.emit(
            "join_room",
            {
              room_id: roomId,
            },
          );

          joinedSocketRoomRef.current =
            roomId;
        }
      };

    /*
     * Connection lost.
     */
    const handleDisconnect =
      (reason: string) => {
        if (cancelled) {
          return;
        }

        console.warn(
          "[Quiz Socket] Disconnected:",
          reason,
        );

        setSocketConnected(false);
        setSocketRoomJoined(false);
      };

    /*
     * Backend confirms the student joined
     * the Socket.IO room.
     */
    const handleJoinedRoomAck =
      (
        payload: SocketJoinedRoomAckPayload,
      ) => {
        if (cancelled) {
          return;
        }

        console.log(
          "[Quiz Socket] joined_room_ack:",
          payload,
        );

        /*
         * If backend explicitly says success:false,
         * don't mark the room as joined.
         */
        if (
          payload &&
          payload.success === false
        ) {
          console.warn(
            "[Quiz Socket] Room join rejected:",
            payload.message,
          );

          setSocketRoomJoined(false);
          return;
        }

        setSocketRoomJoined(true);
      };

    /*
     * Another participant joined the Socket.IO room.
     */
    const handleParticipantJoined =
      (
        payload: SocketParticipantJoinedPayload,
      ) => {
        if (cancelled) {
          return;
        }

        console.log(
          "[Quiz Socket] participant_joined_room:",
          payload,
        );

        const count = Number(
          payload?.joinedCount ??
            payload?.joined_count ??
            payload?.participantCount ??
            payload?.participant_count ??
            NaN,
        );

        if (
          Number.isFinite(count)
        ) {
          setSocketParticipantCount(
            count,
          );
        }

        /*
         * Refresh the REST quiz data so the
         * player grid stays synchronized.
         *
         * This does NOT wait for the 60-second
         * polling interval.
         */
        void loadQuiz(true);
      };

    /*
     * Backend has started a round.
     */
    const handleRoundStarted =
      (
        payload: SocketRoundStartedPayload,
      ) => {
        if (cancelled) {
          return;
        }

        console.log(
          "[Quiz Socket] round_started:",
          payload,
        );

        /*
         * We don't require the payload to contain
         * quizId because the student is already
         * connected to the correct room.
         */
        setStatus("live");

        /*
         * Enter the gameplay page immediately.
         */
        enterPlayPage();
      };

    /*
     * Register listeners.
     */
    socket.on(
      "connect",
      handleConnect,
    );

    socket.on(
      "disconnect",
      handleDisconnect,
    );

    socket.on(
      "joined_room_ack",
      handleJoinedRoomAck,
    );

    socket.on(
      "participant_joined_room",
      handleParticipantJoined,
    );

    socket.on(
      "round_started",
      handleRoundStarted,
    );

    /*
     * If the socket is already connected
     * before these listeners were registered,
     * join the room immediately.
     */
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      cancelled = true;

      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "disconnect",
        handleDisconnect,
      );

      socket.off(
        "joined_room_ack",
        handleJoinedRoomAck,
      );

      socket.off(
        "participant_joined_room",
        handleParticipantJoined,
      );

      socket.off(
        "round_started",
        handleRoundStarted,
      );

      /*
       * We only disconnect this shared socket
       * when this waiting-room page is removed.
       */
      disconnectQuizSocket();

      joinedSocketRoomRef.current =
        null;

      setSocketConnected(false);
      setSocketRoomJoined(false);
    };
  }, [
    quiz?.room_id,
    quizId,
    loadQuiz,
    enterPlayPage,
  ]);

  /* =======================================================
     60-SECOND REST FALLBACK
     
     Socket.IO is now the primary mechanism for
     round_started.
     
     REST polling remains as a fallback in case:
     
     - Socket.IO disconnects.
     - Backend doesn't emit the event.
     - The page was opened after the round started.
     
     It still only polls after the contestant
     count is full.
  ======================================================= */

  useEffect(() => {
    if (!quizId || !quiz) {
      return;
    }

    const joinedCount =
      Array.isArray(
        quiz.joined_users,
      )
        ? quiz.joined_users.length
        : 0;

    const maxPlayers = Math.max(
      Number(
        quiz.no_of_contestants ?? 0,
      ),
      0,
    );

    const isContestantsFull =
      maxPlayers > 0 &&
      joinedCount >= maxPlayers;

    const currentRound = Number(
      quiz.current_round ?? 0,
    );

    const competitionStatus =
      String(
        quiz.status ?? "",
      ).toUpperCase();

    const isCompleted =
      competitionStatus ===
        "COMPLETED" ||
      competitionStatus ===
        "FINISHED";

    const isLive =
      currentRound > 0;

    /*
     * Cancel an existing timeout.
     */
    if (
      pollingTimeoutRef.current !==
      null
    ) {
      window.clearTimeout(
        pollingTimeoutRef.current,
      );

      pollingTimeoutRef.current =
        null;
    }

    /*
     * Don't poll until the lobby is full.
     */
    if (!isContestantsFull) {
      return;
    }

    /*
     * Stop polling when completed.
     */
    if (isCompleted) {
      return;
    }

    /*
     * Stop polling after the REST API confirms
     * that a round has started.
     */
    if (isLive) {
      return;
    }

    let cancelled = false;

    const scheduleNextPoll =
      () => {
        if (cancelled) {
          return;
        }

        pollingTimeoutRef.current =
          window.setTimeout(
            async () => {
              if (cancelled) {
                return;
              }

              await loadQuiz(true);

              if (!cancelled) {
                scheduleNextPoll();
              }
            },
            POLLING_INTERVAL,
          );
      };

    scheduleNextPoll();

    return () => {
      cancelled = true;

      if (
        pollingTimeoutRef.current !==
        null
      ) {
        window.clearTimeout(
          pollingTimeoutRef.current,
        );

        pollingTimeoutRef.current =
          null;
      }
    };
  }, [
    quiz,
    quizId,
    loadQuiz,
  ]);

  /* =======================================================
     AUTO-ENTER PLAY WHEN REST DETECTS START
     
     Socket.IO normally handles this faster.
     This is the fallback for:
     
     current_round > 0
  ======================================================= */

  useEffect(() => {
    if (!quiz) {
      return;
    }

    const currentRound = Number(
      quiz.current_round ?? 0,
    );

    if (currentRound > 0) {
      enterPlayPage();
    }
  }, [
    quiz,
    enterPlayPage,
  ]);

  /* =======================================================
     MANUAL REFRESH
  ======================================================= */

  const handleRefresh =
    async () => {
      await loadQuiz(true);
    };

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const joinedUsers =
    useMemo(
      () =>
        Array.isArray(
          quiz?.joined_users,
        )
          ? quiz.joined_users
          : [],
      [quiz],
    );

  const maxPlayers = Math.max(
    Number(
      quiz?.no_of_contestants ??
        20,
    ),
    1,
  );

  const joinedCount =
    joinedUsers.length;

  const isContestantsFull =
    joinedCount >= maxPlayers;

  const spotsLeft = Math.max(
    maxPlayers -
      joinedCount,
    0,
  );

  const playerPercentage =
    maxPlayers > 0
      ? Math.min(
          100,
          Math.round(
            (joinedCount /
              maxPlayers) *
              100,
          ),
        )
      : 0;

  const currentRound =
    Number(
      quiz?.current_round ?? 0,
    );

  const totalRounds =
    Number(
      quiz?.number_of_rounds ??
        quiz?.round_information
          ?.length ??
        0,
    );

  const totalQuestions = quiz
    ? getTotalQuestions(quiz)
    : 0;

  const qualificationSequence =
    quiz
      ? getQualificationSequence(
          quiz,
        )
      : [20, 15, 10, 5, 2, 1];

  const currentRoundName =
    quiz
      ? getRoundLabel(
          currentRound,
          quiz,
        )
      : "Waiting Room";

  const hasRoom = Boolean(
    quiz?.room_id?.trim(),
  );

  const subjectName = quiz
    ? getSubjectName(quiz)
    : "";

  /*
   * Automatic REST fallback polling is active
   * only when the lobby is full and the quiz
   * has not started.
   */
  const isPollingActive =
    Boolean(
      isContestantsFull &&
        currentRound <= 0 &&
        ![
          "COMPLETED",
          "FINISHED",
        ].includes(
          String(
            quiz?.status ?? "",
          ).toUpperCase(),
        ),
    );

  /* =======================================================
     WAITING MESSAGE
  ======================================================= */

  const waitingMessage =
    useMemo(() => {
      if (!quiz) {
        return "";
      }

      if (!isContestantsFull) {
        return `Waiting for ${spotsLeft} more contestant${
          spotsLeft === 1
            ? ""
            : "s"
        } to join the competition.`;
      }

      if (!hasRoom) {
        return "All contestants have joined. Waiting for the Admin to create the competition room.";
      }

      if (
        socketRoomJoined
      ) {
        return "You are connected to the competition room. Waiting for the Admin to start the first round.";
      }

      return "The competition room has been created. Connecting you to the competition room...";
    }, [
      quiz,
      isContestantsFull,
      spotsLeft,
      hasRoom,
      socketRoomJoined,
    ]);

  /* =======================================================
     ENTER COMPETITION
  ======================================================= */

  const handleEnterCompetition =
    () => {
      enterPlayPage();
    };

  /* =======================================================
     LEAVE
  ======================================================= */

  const handleLeave =
    () => {
      disconnectQuizSocket();

      router.push(
        "/student/quiz-board",
      );
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    status === "loading" ||
    !quiz
  ) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-400" />

            <h1 className="text-lg font-bold text-white">
              Loading Quiz Board...
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Preparing your competition
              waiting room.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (status === "error") {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
          <Card className="w-full border-red-500/20 bg-white/[0.04] p-8 text-center shadow-none">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <Shield className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="text-xl font-bold text-white">
              Unable to Load Competition
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              {error}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() =>
                  loadQuiz()
                }
                className="bg-blue-600 text-white hover:bg-blue-500"
              >
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    "/student/quiz-board",
                  )
                }
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
              >
                Back to Quiz Board
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN ARENA
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-6 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={handleLeave}
            className="text-slate-400 hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quiz Board
          </Button>

          <div className="flex items-center gap-2">
            {/* SOCKET STATUS */}

            <div
              className={`hidden items-center gap-2 rounded-full border px-3 py-2 sm:flex ${
                socketConnected
                  ? "border-green-500/20 bg-green-500/10"
                  : "border-yellow-500/20 bg-yellow-500/10"
              }`}
            >
              {socketConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />

                  <span className="text-xs font-semibold text-green-300">
                    Socket Connected
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-yellow-400" />

                  <span className="text-xs font-semibold text-yellow-300">
                    Socket Offline
                  </span>
                </>
              )}
            </div>

            {/* ROOM JOIN STATUS */}

            {hasRoom && (
              <div
                className={`hidden items-center gap-2 rounded-full border px-3 py-2 sm:flex ${
                  socketRoomJoined
                    ? "border-green-500/20 bg-green-500/10"
                    : "border-blue-500/20 bg-blue-500/10"
                }`}
              >
                {socketRoomJoined ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-400" />

                    <span className="text-xs font-semibold text-green-300">
                      In Room
                    </span>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />

                    <span className="text-xs font-semibold text-blue-300">
                      Joining Room
                    </span>
                  </>
                )}
              </div>
            )}

            {/* AUTO REFRESH STATUS */}

            <div
              className={`hidden items-center gap-2 rounded-full border px-3 py-2 sm:flex ${
                isPollingActive
                  ? "border-blue-500/20 bg-blue-500/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              {isPollingActive ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />

                  <span className="text-xs font-semibold text-blue-300">
                    Checks every 60s
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-slate-500" />

                  <span className="text-xs font-semibold text-slate-400">
                    Auto-check paused
                  </span>
                </>
              )}
            </div>

            {/* ROOM */}

            <div
              className={`hidden items-center gap-2 rounded-full border px-3 py-2 sm:flex ${
                hasRoom
                  ? "border-green-500/20 bg-green-500/10"
                  : "border-yellow-500/20 bg-yellow-500/10"
              }`}
            >
              {hasRoom ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />

                  <span className="text-xs font-semibold text-green-300">
                    Room Created
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-yellow-400" />

                  <span className="text-xs font-semibold text-yellow-300">
                    Waiting for Room
                  </span>
                </>
              )}
            </div>

            {/* STATUS */}

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 md:flex">
              <Radio className="h-4 w-4 text-blue-400" />

              <span className="text-xs font-semibold text-slate-300">
                {status ===
                "waiting_for_players"
                  ? "Waiting for Players"
                  : status ===
                      "waiting_for_room"
                    ? "Waiting for Room"
                    : status ===
                        "waiting_for_start"
                      ? "Waiting to Start"
                      : formatStatus(
                          quiz.status,
                        )}
              </span>
            </div>

            {/* MANUAL REFRESH */}

            <Button
              variant="ghost"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-slate-400 hover:bg-white/[0.05] hover:text-white"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </div>

        {/* MAIN HEADING */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-950 p-6 shadow-none sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                  Quiz Board Arena
                </span>

                {subjectName && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
                    {subjectName}
                  </span>
                )}

                {hasRoom && (
                  <span className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                    <Wifi className="h-3.5 w-3.5" />
                    Room Ready
                  </span>
                )}
              </div>

              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                {quiz.quiz_title ||
                  "Quiz Competition"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                {quiz.description ||
                  "Compete against other students, qualify through each round, and become the Quiz Board champion."}
              </p>

              {/* ROOM ID */}

              {quiz.room_id && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <Radio className="h-3.5 w-3.5 text-blue-400" />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Room
                  </span>

                  <span className="max-w-[320px] truncate font-mono text-xs font-bold text-slate-300">
                    {quiz.room_id}
                  </span>
                </div>
              )}
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Stage
              </div>

              <div className="mt-2 flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />

                <span className="text-xl font-black text-white">
                  {currentRoundName}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* =================================================
            WAITING ROOM
        ================================================= */}

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* PLAYERS */}

          <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />

                  <h2 className="font-bold text-white">
                    Competition Lobby
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Students currently registered
                  for this competition
                </p>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2">
                <span className="text-lg font-black text-blue-300">
                  {joinedCount}
                </span>

                <span className="text-sm text-slate-500">
                  {" "}
                  / {maxPlayers}
                </span>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Lobby capacity
                </span>

                <span className="font-bold text-slate-300">
                  {playerPercentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isContestantsFull
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                  style={{
                    width: `${playerPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* PLAYER GRID */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({
                length: Math.max(
                  maxPlayers,
                  joinedCount,
                ),
              }).map(
                (_, index) => {
                  const player =
                    joinedUsers[index];

                  if (!player) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="flex min-h-[82px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]"
                      >
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.04]">
                          <Users className="h-4 w-4 text-slate-600" />
                        </div>

                        <span className="text-[11px] text-slate-600">
                          Waiting...
                        </span>
                      </div>
                    );
                  }

                  const playerName =
                    getUserName(
                      player,
                      index,
                    );

                  const playerKey =
                    getEntityId(
                      player,
                    ) ||
                    `player-${index}`;

                  return (
                    <div
                      key={playerKey}
                      className="relative min-h-[82px] rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-black text-blue-300">
                          {getUserInitials(
                            playerName,
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-xs font-bold text-slate-200">
                            {playerName}
                          </div>

                          <div className="mt-1 flex items-center gap-1 text-[10px] text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Joined
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            {/* SOCKET PARTICIPANT INFO */}

            {hasRoom && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {socketRoomJoined ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    )}

                    <span className="text-xs font-semibold text-slate-300">
                      {socketRoomJoined
                        ? "You are connected to the competition room"
                        : "Connecting to competition room..."}
                    </span>
                  </div>

                  {socketParticipantCount !==
                    null && (
                    <span className="text-xs font-bold text-slate-500">
                      Socket participants:{" "}
                      {
                        socketParticipantCount
                      }
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* COMPETITION INFO */}

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />

                <h2 className="font-bold text-white">
                  Competition Info
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Players
                  </span>

                  <span className="font-bold text-white">
                    {joinedCount} /{" "}
                    {maxPlayers}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Rounds
                  </span>

                  <span className="font-bold text-white">
                    {totalRounds}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Total Questions
                  </span>

                  <span className="font-bold text-white">
                    {totalQuestions}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Time / Question
                  </span>

                  <span className="flex items-center gap-1 font-bold text-white">
                    <Clock3 className="h-4 w-4 text-blue-400" />

                    {quiz.time_per_question ??
                      20}
                    s
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Scheduled Time
                  </span>

                  <span className="max-w-[170px] text-right text-xs font-semibold text-slate-300">
                    {formatStartDate(
                      quiz.start_date,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Contestants
                  </span>

                  <span
                    className={`text-xs font-bold ${
                      isContestantsFull
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {isContestantsFull
                      ? "Full"
                      : `${spotsLeft} spot${
                          spotsLeft ===
                          1
                            ? ""
                            : "s"
                        } left`}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Competition Room
                  </span>

                  <span
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      hasRoom
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {hasRoom ? (
                      <>
                        <Wifi className="h-3.5 w-3.5" />
                        Created
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3.5 w-3.5" />
                        Not Created
                      </>
                    )}
                  </span>
                </div>

                {/* SOCKET */}

                {hasRoom && (
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Live Connection
                    </span>

                    <span
                      className={`flex items-center gap-1.5 text-xs font-bold ${
                        socketRoomJoined
                          ? "text-green-400"
                          : socketConnected
                            ? "text-blue-400"
                            : "text-yellow-400"
                      }`}
                    >
                      {socketRoomJoined ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          In Room
                        </>
                      ) : socketConnected ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Joining
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3.5 w-3.5" />
                          Offline
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* QUALIFICATION */}

            <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Medal className="h-5 w-5 text-indigo-400" />

                <h2 className="font-bold text-white">
                  Qualification
                </h2>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {qualificationSequence.map(
                  (
                    players,
                    index,
                  ) => (
                    <div
                      key={`${players}-${index}`}
                      className="flex shrink-0 items-center"
                    >
                      <div
                        className={`flex h-11 min-w-[50px] items-center justify-center rounded-xl border px-3 text-sm font-black ${
                          index === 0
                            ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                            : players ===
                                1
                              ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                              : "border-white/10 bg-white/[0.03] text-slate-300"
                        }`}
                      >
                        {players}
                      </div>

                      {index <
                        qualificationSequence.length -
                          1 && (
                        <div className="px-1 text-slate-700">
                          →
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                The fastest students who answer
                correctly progress through each
                elimination round until the final
                winner is determined.
              </p>
            </Card>
          </div>
        </section>

        {/* =================================================
            WAITING STATES
        ================================================= */}

        <section className="mt-6">
          {/* WAITING FOR PLAYERS */}

          {status ===
            "waiting_for_players" && (
            <Card className="border-yellow-500/20 bg-yellow-500/[0.06] p-6 text-center shadow-none sm:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                <Users className="h-8 w-8 text-yellow-400" />
              </div>

              <h2 className="text-2xl font-black text-white">
                Waiting for Contestants
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Other contestants still need
                to join the competition before
                the room preparation process
                begins.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3">
                  <span className="text-2xl font-black text-blue-300">
                    {joinedCount}
                  </span>

                  <span className="ml-1 text-sm text-slate-500">
                    joined
                  </span>
                </div>

                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3">
                  <span className="text-2xl font-black text-yellow-300">
                    {spotsLeft}
                  </span>

                  <span className="ml-1 text-sm text-slate-500">
                    remaining
                  </span>
                </div>
              </div>

              <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-sm font-semibold text-slate-300">
                  {waitingMessage}
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleLeave}
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Arena
                </Button>
              </div>
            </Card>
          )}

          {/* WAITING FOR ROOM */}

          {status ===
            "waiting_for_room" && (
            <Card className="border-blue-500/20 bg-blue-500/[0.06] p-6 text-center shadow-none sm:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <Wifi className="h-8 w-8 text-blue-400" />
              </div>

              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />

                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Lobby Full
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">
                Waiting for Competition Room
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                All required contestants have
                joined. The Admin can now create
                the competition room.
              </p>

              <div className="mt-6 flex justify-center">
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-7 py-4">
                  <div className="text-3xl font-black text-green-300">
                    {joinedCount} /{" "}
                    {maxPlayers}
                  </div>

                  <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Contestants Joined
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-sm font-semibold text-slate-300">
                  {waitingMessage}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-blue-300">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Checking for room creation
                every 60 seconds
              </div>

              <p className="mt-2 text-[11px] text-slate-600">
                You can also use Refresh to check
                immediately.
              </p>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleLeave}
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Arena
                </Button>
              </div>
            </Card>
          )}

          {/* WAITING FOR ADMIN TO START */}

          {status ===
            "waiting_for_start" && (
            <Card className="border-indigo-500/20 bg-indigo-500/[0.06] p-6 text-center shadow-none sm:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                <Radio className="h-8 w-8 animate-pulse text-indigo-400" />
              </div>

              <div className="mb-2 flex items-center justify-center gap-2">
                <span
                  className={`h-2 w-2 animate-pulse rounded-full ${
                    socketRoomJoined
                      ? "bg-green-400"
                      : "bg-yellow-400"
                  }`}
                />

                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    socketRoomJoined
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {socketRoomJoined
                    ? "Connected to Room"
                    : "Connecting to Room"}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">
                Waiting for Competition to Start
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                All contestants are present and
                the competition room has been
                created. Stay here while the
                Admin starts the first round.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-3">
                  <span className="text-2xl font-black text-green-300">
                    {joinedCount}
                  </span>

                  <span className="ml-1 text-sm text-slate-500">
                    joined
                  </span>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3">
                  <span className="text-2xl font-black text-blue-300">
                    {maxPlayers}
                  </span>

                  <span className="ml-1 text-sm text-slate-500">
                    required
                  </span>
                </div>

                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3">
                  <span className="text-2xl font-black text-indigo-300">
                    {totalRounds}
                  </span>

                  <span className="ml-1 text-sm text-slate-500">
                    rounds
                  </span>
                </div>
              </div>

              <div className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Contestants full
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Room created
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    socketRoomJoined
                      ? "border-green-500/20 bg-green-500/10 text-green-300"
                      : "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                  }`}
                >
                  {socketRoomJoined ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}

                  {socketRoomJoined
                    ? "Connected to live room"
                    : "Connecting to live room"}
                </span>
              </div>

              <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-sm font-semibold text-slate-300">
                  {waitingMessage}
                </p>
              </div>

              {quiz.room_id && (
                <div className="mx-auto mt-5 max-w-md rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Competition Room ID
                  </div>

                  <div className="mt-1 break-all font-mono text-xs font-bold text-blue-300">
                    {quiz.room_id}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-blue-300">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                Listening for the Admin to
                start the first round
              </div>

              <p className="mt-2 text-[11px] text-slate-600">
                The competition will open
                automatically when the backend
                sends the round_started event.
              </p>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleLeave}
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Arena
                </Button>
              </div>
            </Card>
          )}

          {/* LIVE */}

          {status === "live" && (
            <Card className="border-indigo-500/20 bg-indigo-500/[0.06] p-6 text-center shadow-none sm:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                <Radio className="h-8 w-8 animate-pulse text-indigo-400" />
              </div>

              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Live
                </span>
              </div>

              <h2 className="text-2xl font-black text-white">
                {currentRoundName}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                The competition has started.
                Enter the arena to continue.
              </p>

              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-300">
                  <Wifi className="h-3.5 w-3.5" />
                  Competition is live
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={
                    handleEnterCompetition
                  }
                  className="h-12 bg-blue-600 px-8 font-bold text-white hover:bg-blue-500"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Enter Competition
                </Button>
              </div>
            </Card>
          )}

          {/* COMPLETED */}

          {status ===
            "completed" && (
            <Card className="border-yellow-500/20 bg-yellow-500/[0.06] p-6 text-center shadow-none sm:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                <Crown className="h-8 w-8 text-yellow-400" />
              </div>

              <h2 className="text-2xl font-black text-white">
                Competition Completed
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                This Quiz Board competition
                has ended.
              </p>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleLeave}
                  className="bg-blue-600 text-white hover:bg-blue-500"
                >
                  Back to Quiz Board
                </Button>
              </div>
            </Card>
          )}
        </section>

        {/* =================================================
            REWARDS
        ================================================= */}

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10">
                <Crown className="h-5 w-5 text-yellow-400" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Champion
                </p>

                <p className="text-xl font-black text-white">
                  {quiz
                    .final_round_information
                    ?.first_position_reward ??
                    0}{" "}
                  Points
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                <Medal className="h-5 w-5 text-slate-300" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Runner-up
                </p>

                <p className="text-xl font-black text-white">
                  {quiz
                    .final_round_information
                    ?.second_position_reward ??
                    0}{" "}
                  Points
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-600 sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />

            JAMB League Quiz Board
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />

              Live Competition
            </span>

            <span className="flex items-center gap-1">
              {socketConnected ? (
                <Wifi className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-yellow-500" />
              )}

              {socketConnected
                ? "Socket Connected"
                : "Socket Offline"}
            </span>

            <span>
              Round{" "}
              {Math.max(
                currentRound,
                0,
              )}{" "}
              / {totalRounds}
            </span>

            <span className="hidden lg:inline">
              Updated{" "}
              {new Date(
                lastUpdated,
              ).toLocaleTimeString(
                "en-NG",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              )}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
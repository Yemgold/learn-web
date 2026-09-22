

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
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Loader2,
  Radio,
  RefreshCw,
  ShieldCheck,
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
  
} from "@/lib/socket/quizSocket";

/* ============================================================
   CONSTANTS
============================================================ */

const POLLING_INTERVAL = 60_000;

const PLAY_SESSION_PREFIX = "quiz-play-";

/* ============================================================
   TYPES
============================================================ */

type LobbyStatus =
  | "loading"
  | "waiting_for_players"
  | "waiting_for_room"
  | "waiting_for_start"
  | "live"
  | "completed"
  | "error";

interface QuizCompetition {
  _id?: string;
  id?: string;

  quiz_title?: string;
  description?: string;

  subject?: unknown;

  time_per_question?: number;
  start_date?: string;

  no_of_contestants?: number;
  number_of_rounds?: number;

  joined_users?: unknown[];

  current_round?: number;

  room_id?: string | null;

  status?: string;

  round_information?: unknown[];

  final_round_information?: {
    no_of_questions?: number;
    difficultyBreakdown?: {
      easy?: number;
      medium?: number;
      hard?: number;
    };
    first_position_reward?: number;
    second_position_reward?: number;
  };

  [key: string]: unknown;
}

/* ============================================================
   SOCKET PAYLOADS
============================================================ */

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

/* ============================================================
   PLAY SESSION DATA
============================================================ */

interface QuizPlaySession {
  quizId: string;

  quiz_title: string;
  subject: string;

  description: string;

  current_round: number;
  number_of_rounds: number;

  time_per_question: number;

  no_of_contestants: number;
  joined_count: number;

  room_id: string | null;

  start_date: string;
}

/* ============================================================
   HELPERS
============================================================ */

function normalizeStatus(status?: string) {
  return String(status || "")
    .trim()
    .toUpperCase();
}

function getQuizId(quiz: QuizCompetition | null) {
  if (!quiz) {
    return "";
  }

  return String(
    quiz._id ||
      quiz.id ||
      "",
  ).trim();
}

function getSubjectLabel(subject: unknown) {
  if (!subject) {
    return "General";
  }

  if (typeof subject === "string") {
    return subject;
  }

  if (
    typeof subject === "object" &&
    subject !== null
  ) {
    const value =
      subject as Record<string, unknown>;

    return String(
      value.name ||
        value.title ||
        value.subject_name ||
        value.subjectName ||
        value.label ||
        "General",
    );
  }

  return "General";
}

function getJoinedUsers(
  quiz: QuizCompetition | null,
): unknown[] {
  if (!quiz) {
    return [];
  }

  if (Array.isArray(quiz.joined_users)) {
    return quiz.joined_users;
  }

  const quizRecord =
    quiz as Record<string, unknown>;

  if (Array.isArray(quizRecord.joinedUsers)) {
    return quizRecord.joinedUsers;
  }

  if (Array.isArray(quizRecord.participants)) {
    return quizRecord.participants;
  }

  return [];
}

function getJoinedCount(
  quiz: QuizCompetition | null,
) {
  return getJoinedUsers(quiz).length;
}

function getContestantCapacity(
  quiz: QuizCompetition | null,
) {
  const value = Number(
    quiz?.no_of_contestants || 0,
  );

  return Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function isQuizFull(
  quiz: QuizCompetition | null,
) {
  const joined = getJoinedCount(quiz);
  const capacity = getContestantCapacity(quiz);

  return capacity > 0 && joined >= capacity;
}

function getCurrentRound(
  quiz: QuizCompetition | null,
) {
  const value = Number(
    quiz?.current_round || 0,
  );

  return Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

function getNumberOfRounds(
  quiz: QuizCompetition | null,
) {
  const value = Number(
    quiz?.number_of_rounds || 0,
  );

  return Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function getTimePerQuestion(
  quiz: QuizCompetition | null,
) {
  const value = Number(
    quiz?.time_per_question || 0,
  );

  return Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function hasRoom(
  quiz: QuizCompetition | null,
) {
  return Boolean(
    quiz?.room_id &&
      String(quiz.room_id).trim(),
  );
}

function hasScheduledTimePassed(
  quiz: QuizCompetition | null,
) {
  if (!quiz?.start_date) {
    return false;
  }

  const timestamp = Date.parse(
    quiz.start_date,
  );

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  return Date.now() >= timestamp;
}

function formatDateTime(
  value?: string,
) {
  if (!value) {
    return "Not scheduled";
  }

  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(timestamp));
}

function getApiErrorMessage(
  error: unknown,
) {
  const value =
    error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };

  return (
    value?.response?.data?.message ||
    value?.response?.data?.error ||
    value?.message ||
    "Unable to load this competition."
  );
}

/* ============================================================
   RESPONSE NORMALIZER

   Supports the common response shapes used by the API wrapper.
============================================================ */

function extractQuiz(
  payload: unknown,
): QuizCompetition | null {
  if (!payload) {
    return null;
  }

  if (
    typeof payload !== "object" ||
    payload === null
  ) {
    return null;
  }

  const root =
    payload as Record<string, unknown>;

  const candidates: unknown[] = [
    root.quiz,
    root.quizObj,
    root.quizCompetition,
    root.quizCompetitionObj,

    root.data,

    typeof root.data === "object" &&
    root.data !== null
      ? (root.data as Record<string, unknown>)
          .quiz
      : undefined,

    typeof root.data === "object" &&
    root.data !== null
      ? (root.data as Record<string, unknown>)
          .quizObj
      : undefined,

    typeof root.data === "object" &&
    root.data !== null
      ? (
          root.data as Record<
            string,
            unknown
          >
        ).quizCompetition
      : undefined,

    typeof root.data === "object" &&
    root.data !== null
      ? (
          root.data as Record<
            string,
            unknown
          >
        ).quizCompetitionObj
      : undefined,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      const object =
        candidate as Record<
          string,
          unknown
        >;

      if (
        "quiz_title" in object ||
        "_id" in object ||
        "id" in object ||
        "joined_users" in object
      ) {
        return object as QuizCompetition;
      }
    }
  }

  return null;
}

/* ============================================================
   QUALIFICATION SEQUENCE
============================================================ */

function getQualificationSequence(
  quiz: QuizCompetition | null,
) {
  const capacity =
    getContestantCapacity(quiz);

  if (capacity <= 0) {
    return [];
  }

  const sequence: number[] = [
    capacity,
  ];

  const rounds =
    Array.isArray(
      quiz?.round_information,
    )
      ? quiz.round_information
      : [];

  const sortedRounds = [...rounds].sort(
    (a, b) => {
      const first =
        Number(
          (
            a as Record<
              string,
              unknown
            >
          ).round_number || 0,
        );

      const second =
        Number(
          (
            b as Record<
              string,
              unknown
            >
          ).round_number || 0,
        );

      return first - second;
    },
  );

  let remaining = capacity;

  for (const round of sortedRounds) {
    const value =
      round as Record<
        string,
        unknown
      >;

    const exitNumber = Number(
      value.exit_number || 0,
    );

    if (
      Number.isFinite(exitNumber) &&
      exitNumber > 0
    ) {
      remaining = Math.max(
        1,
        remaining - exitNumber,
      );

      if (
        sequence[
          sequence.length - 1
        ] !== remaining
      ) {
        sequence.push(remaining);
      }
    }
  }

  if (
    sequence[
      sequence.length - 1
    ] !== 1
  ) {
    sequence.push(1);
  }

  return sequence;
}

/* ============================================================
   PARTICIPANT LABEL
============================================================ */

function getParticipantLabel(
  participant: unknown,
  index: number,
) {
  if (
    typeof participant === "string"
  ) {
    const value =
      participant.trim();

    /*
     * If the API is returning Mongo/Object IDs,
     * don't expose the raw ID as the player's name.
     */
    if (
      /^[a-f0-9]{20,}$/i.test(value)
    ) {
      return `Contestant ${index + 1}`;
    }

    return value || `Contestant ${index + 1}`;
  }

  if (
    participant &&
    typeof participant === "object"
  ) {
    const value =
      participant as Record<
        string,
        unknown
      >;

    const name =
      value.name ||
      value.full_name ||
      value.fullName ||
      value.username ||
      value.displayName ||
      value.email;

    if (name) {
      return String(name);
    }
  }

  return `Contestant ${index + 1}`;
}

/* ============================================================
   PAGE
============================================================ */

export default function QuizWaitingRoomPage() {
  const params =
    useParams<{
      quizId: string;
    }>();

  const router = useRouter();

  const quizId =
    typeof params?.quizId === "string"
      ? params.quizId
      : "";

  /* ==========================================================
     STATE
  ========================================================== */

  const [quiz, setQuiz] =
    useState<QuizCompetition | null>(
      null,
    );

  const [status, setStatus] =
    useState<LobbyStatus>("loading");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* Socket state */

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [
    socketRoomJoined,
    setSocketRoomJoined,
  ] = useState(false);

  const [
    socketParticipantCount,
    setSocketParticipantCount,
  ] = useState<number | null>(null);

  /* ==========================================================
     REFS
  ========================================================== */

  const requestInFlightRef =
    useRef(false);

  const navigatingToPlayRef =
    useRef(false);

  const joinedSocketRoomRef =
    useRef<string | null>(null);

  const quizRef =
    useRef<QuizCompetition | null>(null);

  /* Keep the latest quiz available to
     stable callbacks. */
  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);

  /* ==========================================================
     ENTER PLAY PAGE

     IMPORTANT:
     We save the competition metadata locally.

     The play page will NOT call getQuizById().
  ========================================================== */

  const enterPlayPage =
    useCallback(
      (
        roundOverride?: number,
      ) => {
        if (!quizId) {
          return;
        }

        if (
          navigatingToPlayRef.current
        ) {
          return;
        }

        const currentQuiz =
          quizRef.current;

        if (!currentQuiz) {
          return;
        }

        const currentRound =
          Number(
            roundOverride ??
              getCurrentRound(
                currentQuiz,
              ),
          );

        const sessionData: QuizPlaySession =
          {
            quizId,

            quiz_title:
              String(
                currentQuiz.quiz_title ||
                  "Quiz Competition",
              ),

            subject:
              getSubjectLabel(
                currentQuiz.subject,
              ),

            description:
              String(
                currentQuiz.description ||
                  "",
              ),

            current_round:
              Number.isFinite(
                currentRound,
              ) && currentRound > 0
                ? currentRound
                : 1,

            number_of_rounds:
              getNumberOfRounds(
                currentQuiz,
              ),

            time_per_question:
              getTimePerQuestion(
                currentQuiz,
              ),

            no_of_contestants:
              getContestantCapacity(
                currentQuiz,
              ),

            joined_count:
              getJoinedCount(
                currentQuiz,
              ),

            room_id:
              currentQuiz.room_id
                ? String(
                    currentQuiz.room_id,
                  )
                : null,

            start_date:
              String(
                currentQuiz.start_date ||
                  "",
              ),
          };

        try {
          sessionStorage.setItem(
            `${PLAY_SESSION_PREFIX}${quizId}`,
            JSON.stringify(
              sessionData,
            ),
          );
        } catch (storageError) {
          console.warn(
            "Unable to save quiz play session:",
            storageError,
          );
        }

        navigatingToPlayRef.current =
          true;

        router.push(
          `/student/quiz-board/${quizId}/play`,
        );
      },
      [quizId, router],
    );

  /* ==========================================================
     LOBBY STATUS
  ========================================================== */

  const updateLobbyStatus =
    useCallback(
      (
        currentQuiz: QuizCompetition | null,
      ) => {
        if (!currentQuiz) {
          setStatus("error");
          return;
        }

        const normalized =
          normalizeStatus(
            currentQuiz.status,
          );

        const currentRound =
          getCurrentRound(
            currentQuiz,
          );

        if (
          normalized === "COMPLETED" ||
          normalized === "FINISHED"
        ) {
          setStatus("completed");
          return;
        }

        if (
          currentRound > 0 ||
          normalized === "LIVE" ||
          normalized ===
            "IN_PROGRESS"
        ) {
          setStatus("live");
          return;
        }

        const full =
          isQuizFull(
            currentQuiz,
          );

        if (!full) {
          setStatus(
            "waiting_for_players",
          );
          return;
        }

        if (!hasRoom(currentQuiz)) {
          setStatus(
            "waiting_for_room",
          );
          return;
        }

        setStatus(
          "waiting_for_start",
        );
      },
      [],
    );

  /* ==========================================================
     LOAD QUIZ
  ========================================================== */

  const loadQuiz =
    useCallback(
      async (
        isRefresh = false,
      ) => {
        if (!quizId) {
          setError(
            "Competition ID is missing from the URL.",
          );
          setStatus("error");
          setLoading(false);
          return;
        }

        if (
          requestInFlightRef.current
        ) {
          return;
        }

        try {
          requestInFlightRef.current =
            true;

          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          if (!isRefresh) {
            setError("");
          }

          const response =
            await getQuizById(
              quizId,
            );

          console.log(
            "Quiz waiting room response:",
            response,
          );

          const normalizedQuiz =
            extractQuiz(
              response,
            );

          if (!normalizedQuiz) {
            throw new Error(
              "The competition data could not be read from the server response.",
            );
          }

          quizRef.current =
            normalizedQuiz;

          setQuiz(
            normalizedQuiz,
          );

          updateLobbyStatus(
            normalizedQuiz,
          );
        } catch (err) {
          console.error(
            "Failed to load quiz:",
            err,
          );

          /*
           * During a refresh, keep the previous
           * competition visible instead of
           * destroying the UI.
           */
          if (!isRefresh) {
            setQuiz(null);
            setStatus("error");
            setError(
              getApiErrorMessage(
                err,
              ),
            );
          } else {
            console.warn(
              "Quiz refresh failed:",
              getApiErrorMessage(
                err,
              ),
            );
          }
        } finally {
          requestInFlightRef.current =
            false;

          setLoading(false);
          setRefreshing(false);
        }
      },
      [quizId, updateLobbyStatus],
    );

  /* ==========================================================
     INITIAL LOAD + POLLING
  ========================================================== */

  useEffect(() => {
    void loadQuiz(false);

    const interval = window.setInterval(
      () => {
        void loadQuiz(true);
      },
      POLLING_INTERVAL,
    );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [loadQuiz]);

  /* ==========================================================
     SOCKET.IO ROOM CONNECTION
  ========================================================== */

  const roomId =
    quiz?.room_id
      ? String(
          quiz.room_id,
        ).trim()
      : "";

  useEffect(() => {
    /*
     * No room yet.
     *
     * The student only needs Socket.IO after
     * the administrator has created the room.
     */
    if (!roomId) {
      setSocketConnected(false);
      setSocketRoomJoined(false);
      setSocketParticipantCount(
        null,
      );

      joinedSocketRoomRef.current =
        null;

      return;
    }

    let cancelled = false;

    const socket =
      getQuizSocket();

    /* ========================================================
       CONNECT
    ======================================================== */

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
         * for the same confirmed room.
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
           *
           * The backend currently expects
           * room_id in this payload.
           */
          socket.emit(
            "join_room",
            {
              room_id: roomId,
            },
          );

          /*
           * DO NOT mark the room as joined here.
           *
           * We wait for joined_room_ack.
           */
        }
      };

    /* ========================================================
       CONNECT ERROR
    ======================================================== */

    const handleConnectError =
      (socketError: Error) => {
        if (cancelled) {
          return;
        }

        console.error(
          "[Quiz Socket] Connection error:",
          socketError,
        );

        setSocketConnected(false);
        setSocketRoomJoined(false);
      };

    /* ========================================================
       DISCONNECT
    ======================================================== */

    const handleDisconnect =
      (
        reason: string,
      ) => {
        if (cancelled) {
          return;
        }

        console.warn(
          "[Quiz Socket] Disconnected:",
          reason,
        );

        setSocketConnected(false);
        setSocketRoomJoined(false);

        /*
         * The previous room membership is no
         * longer considered confirmed.
         *
         * If Socket.IO reconnects, join_room
         * will be emitted again.
         */
        joinedSocketRoomRef.current =
          null;
      };

    /* ========================================================
       JOINED ROOM ACK
    ======================================================== */

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
         * Backend explicitly rejected the join.
         */
        if (
          payload &&
          payload.success === false
        ) {
          console.warn(
            "[Quiz Socket] Room join rejected:",
            payload.message,
          );

          setSocketRoomJoined(
            false,
          );

          /*
           * Allow another join attempt.
           */
          joinedSocketRoomRef.current =
            null;

          return;
        }

        /*
         * Backend confirmed the room join.
         */
        setSocketRoomJoined(
          true,
        );

        /*
         * NOW mark the room as joined.
         */
        joinedSocketRoomRef.current =
          roomId;
      };

    /* ========================================================
       PARTICIPANT JOINED
    ======================================================== */

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

        const count =
          Number(
            payload.joinedCount ??
              payload.joined_count ??
              payload.participantCount ??
              payload.participant_count ??
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
         * Refresh REST lobby information so
         * joined_users and room_id stay current.
         */
        void loadQuiz(true);
      };

    /* ========================================================
       ROUND STARTED
    ======================================================== */

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
         * Ignore a round_started event if the
         * backend includes a different quiz ID.
         */
        const eventQuizId =
          String(
            payload.quizId ??
              payload.quiz_id ??
              "",
          ).trim();

        if (
          eventQuizId &&
          eventQuizId !== quizId
        ) {
          console.warn(
            "[Quiz Socket] Ignoring round_started for another quiz:",
            eventQuizId,
          );

          return;
        }

        const eventRound =
          Number(
            payload.currentRound ??
              payload.current_round ??
              payload.round ??
              payload.round_number ??
              0,
          );

        setStatus("live");

        /*
         * Save metadata first, then navigate.
         *
         * The play page does NOT make another
         * getQuizById() request.
         */
        enterPlayPage(
          Number.isFinite(
            eventRound,
          ) && eventRound > 0
            ? eventRound
            : undefined,
        );
      };

    /* ========================================================
       REGISTER LISTENERS
    ======================================================== */

    socket.on(
      "connect",
      handleConnect,
    );

    socket.on(
      "connect_error",
      handleConnectError,
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
     * If the socket was already connected when
     * this effect was created, run the same
     * connection logic immediately.
     */
    if (socket.connected) {
      handleConnect();
    }

/* ========================================================
   CLEANUP
======================================================== */

return () => {
  cancelled = true;

  socket.off(
    "connect",
    handleConnect,
  );

  socket.off(
    "connect_error",
    handleConnectError,
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

  joinedSocketRoomRef.current =
    null;

  setSocketConnected(false);
  setSocketRoomJoined(false);

  /*
   * IMPORTANT:
   *
   * Do NOT disconnect the singleton
   * Socket.IO connection here.
   *
   * The student is moving from:
   *
   * Waiting Room
   *      ↓
   * Play Page
   *
   * The Play Page will continue using
   * the same socket connection.
   */
};


  }, [
    roomId,
    quizId,
    loadQuiz,
    enterPlayPage,
  ]);

  /* ==========================================================
     DERIVED DATA
  ========================================================== */

  const joinedCount =
    getJoinedCount(quiz);

  const contestantCapacity =
    getContestantCapacity(
      quiz,
    );

  const remainingPlayers =
    Math.max(
      0,
      contestantCapacity -
        joinedCount,
    );

  const currentRound =
    getCurrentRound(quiz);

  const numberOfRounds =
    getNumberOfRounds(quiz);

  const subject =
    getSubjectLabel(
      quiz?.subject,
    );

  const qualificationSequence =
    useMemo(
      () =>
        getQualificationSequence(
          quiz,
        ),
      [quiz],
    );

  const joinedUsers =
    getJoinedUsers(quiz);

  const scheduledTimePassed =
    hasScheduledTimePassed(
      quiz,
    );

  const finalRewards =
    quiz?.final_round_information;

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
            </div>

            <h1 className="text-2xl font-bold">
              Loading Competition
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Preparing your waiting room...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (
    status === "error" ||
    !quiz
  ) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
          <Card className="w-full border-white/10 bg-white/[0.04] p-8 text-center text-white shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold">
              Unable to Load Competition
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/60">
              {error ||
                "The competition could not be loaded."}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.back()
                }
                className="border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>

              <Button
                type="button"
                onClick={() =>
                  void loadQuiz(false)
                }
                className="bg-blue-600 text-white hover:bg-blue-500"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     STATUS MESSAGE
  ========================================================== */

  let statusTitle =
    "Preparing Competition";

  let statusMessage =
    "Please wait...";

  if (
    status ===
    "waiting_for_players"
  ) {
    statusTitle =
      "Waiting for Contestants";

    statusMessage =
      `Waiting for ${remainingPlayers} more contestant${
        remainingPlayers === 1
          ? ""
          : "s"
      } to join the competition.`;
  }

  if (
    status ===
    "waiting_for_room"
  ) {
    if (
      scheduledTimePassed
    ) {
      statusTitle =
        "All Contestants Have Joined";

      statusMessage =
        "All contestants have joined. Waiting for the Admin to open room.";
    } else {
      statusTitle =
        "Competition Is Full";

      statusMessage =
        "All contestants have joined. Waiting for the competition room to be opened.";
    }
  }

  if (
    status ===
    "waiting_for_start"
  ) {
    statusTitle =
      "Room Is Ready";

    statusMessage =
      socketRoomJoined
        ? "You are connected to the competition room. Waiting for the Admin to start the first round."
        : "The competition room has been created. Connecting you to the competition room...";
  }

  if (
    status === "live"
  ) {
    statusTitle =
      "Competition Is Live";

    statusMessage =
      currentRound > 0
        ? `Round ${currentRound} has started.`
        : "The competition has started.";
  }

  if (
    status === "completed"
  ) {
    statusTitle =
      "Competition Completed";

    statusMessage =
      "This competition has already been completed.";
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.back()
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Quiz Board
                </span>
              </div>

              <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">
                {quiz.quiz_title ||
                  "Quiz Competition"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                socketConnected
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.04] text-white/50"
              }`}
            >
              {socketConnected ? (
                <>
                  <Wifi className="h-3.5 w-3.5" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  Connecting
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                void loadQuiz(true)
              }
              disabled={refreshing}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              aria-label="Refresh competition"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ==================================================
            MAIN STATUS CARD
        ================================================== */}

        <Card className="overflow-hidden border-white/10 bg-white/[0.04] text-white shadow-2xl shadow-black/30">
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-10 sm:px-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex justify-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-3xl border ${
                    status === "live"
                      ? "border-emerald-400/20 bg-emerald-400/10"
                      : status ===
                          "completed"
                        ? "border-white/10 bg-white/[0.06]"
                        : "border-blue-400/20 bg-blue-400/10"
                  }`}
                >
                  {status ===
                  "live" ? (
                    <Radio className="h-9 w-9 text-emerald-400" />
                  ) : status ===
                    "completed" ? (
                    <CheckCircle2 className="h-9 w-9 text-white/60" />
                  ) : (
                    <Sparkles className="h-9 w-9 text-blue-400" />
                  )}
                </div>
              </div>

              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                  Competition Status
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {statusTitle}
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                  {statusMessage}
                </p>
              </div>

              {/* Socket status */}

              {roomId && (
                <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-2">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                      socketConnected
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {socketConnected ? (
                      <Wifi className="h-3.5 w-3.5" />
                    ) : (
                      <WifiOff className="h-3.5 w-3.5" />
                    )}

                    {socketConnected
                      ? "Socket connected"
                      : "Connecting to socket"}
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                      socketRoomJoined
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 bg-white/[0.04] text-white/50"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />

                    {socketRoomJoined
                      ? "Room joined"
                      : "Joining room"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              PLAYER COUNT
          ================================================== */}

          <div className="grid border-b border-white/10 sm:grid-cols-3">
            <div className="border-b border-white/10 p-6 text-center sm:border-b-0 sm:border-r">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10">
                <Users className="h-5 w-5 text-blue-400" />
              </div>

              <p className="text-2xl font-extrabold">
                {joinedCount}
                <span className="text-white/30">
                  {" "}
                  /{" "}
                  {contestantCapacity}
                </span>
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
                Contestants
              </p>
            </div>

            <div className="border-b border-white/10 p-6 text-center sm:border-b-0 sm:border-r">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10">
                <BookOpen className="h-5 w-5 text-violet-400" />
              </div>

              <p className="text-2xl font-extrabold">
                {numberOfRounds ||
                  "—"}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
                Rounds
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                <Clock3 className="h-5 w-5 text-amber-400" />
              </div>

              <p className="text-2xl font-extrabold">
                {getTimePerQuestion(
                  quiz,
                ) || "—"}
                {getTimePerQuestion(
                  quiz,
                ) > 0 && (
                  <span className="ml-1 text-sm font-bold text-white/40">
                    sec
                  </span>
                )}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/35">
                Per Question
              </p>
            </div>
          </div>

          {/* ==================================================
              COMPETITION DETAILS
          ================================================== */}

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                Subject
              </p>

              <p className="mt-2 font-bold text-white">
                {subject}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                Scheduled Start
              </p>

              <p className="mt-2 text-sm font-bold text-white">
                {formatDateTime(
                  quiz.start_date,
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                Current Round
              </p>

              <p className="mt-2 font-bold text-white">
                {currentRound > 0
                  ? `Round ${currentRound}`
                  : "Not started"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                Room
              </p>

              <p className="mt-2 font-mono text-sm font-bold text-white">
                {roomId
                  ? roomId
                  : "Not created"}
              </p>
            </div>
          </div>
        </Card>

        {/* ==================================================
            PLAYERS
        ================================================== */}

        <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />

                <h2 className="text-xl font-extrabold">
                  Contestants
                </h2>
              </div>

              <p className="mt-1 text-sm text-white/45">
                Students currently registered for this competition.
              </p>
            </div>

            {socketParticipantCount !==
              null && (
              <div className="text-sm text-white/50">
                Live room count:{" "}
                <span className="font-bold text-white">
                  {
                    socketParticipantCount
                  }
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({
              length:
                Math.max(
                  contestantCapacity,
                  joinedUsers.length,
                ),
            }).map(
              (_, index) => {
                const participant =
                  joinedUsers[
                    index
                  ];

                const joined =
                  Boolean(
                    participant,
                  );

                return (
                  <div
                    key={index}
                    className={`rounded-2xl border p-4 ${
                      joined
                        ? "border-blue-400/20 bg-blue-400/[0.06]"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
                        joined
                          ? "bg-blue-400/10 text-blue-400"
                          : "bg-white/[0.04] text-white/20"
                      }`}
                    >
                      {joined ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>

                    <p
                      className={`truncate text-sm font-bold ${
                        joined
                          ? "text-white"
                          : "text-white/25"
                      }`}
                    >
                      {joined
                        ? getParticipantLabel(
                            participant,
                            index,
                          )
                        : "Waiting..."}
                    </p>

                    <p className="mt-1 text-[11px] font-medium text-white/30">
                      Contestant{" "}
                      {index + 1}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </Card>

        {/* ==================================================
            QUALIFICATION
        ================================================== */}

        {qualificationSequence.length >
          0 && (
          <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                <Zap className="h-5 w-5 text-amber-400" />
              </div>

              <div className="min-w-0">
                <h2 className="font-extrabold">
                  Qualification
                  Journey
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/45">
                  Contestants qualify through each round until the final winner remains.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {qualificationSequence.map(
                    (
                      count,
                      index,
                    ) => (
                      <div
                        key={`${count}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div className="flex min-w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-extrabold">
                          {count}
                        </div>

                        {index <
                          qualificationSequence.length -
                            1 && (
                          <span className="text-white/20">
                            →
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ==================================================
            FINAL REWARDS
        ================================================== */}

        {finalRewards && (
          <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 text-white shadow-xl shadow-black/20 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                <Trophy className="h-5 w-5 text-amber-400" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">
                  Final Round Rewards
                </h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      1st Position
                    </p>

                    <p className="mt-2 text-xl font-extrabold text-amber-300">
                      {Number(
                        finalRewards.first_position_reward ||
                          0,
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs uppercase tracking-wider text-white/35">
                      2nd Position
                    </p>

                    <p className="mt-2 text-xl font-extrabold text-white">
                      {Number(
                        finalRewards.second_position_reward ||
                          0,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ==================================================
            LIVE STATE
        ================================================== */}

        {status === "live" && (
          <Card className="mt-6 border-emerald-400/20 bg-emerald-400/[0.06] p-6 text-white shadow-xl shadow-black/20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                  <Radio className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <h2 className="font-extrabold">
                    Round{" "}
                    {currentRound ||
                      1}{" "}
                    Is Live
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    The competition has started. Your quiz session is ready.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() =>
                  enterPlayPage(
                    currentRound ||
                      1,
                  )
                }
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Enter Quiz
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="py-8 text-center">
          <p className="text-xs text-white/25">
            Quiz Board automatically refreshes while you wait.
          </p>

          <p className="mt-1 text-xs text-white/20">
            Keep this page open so you can receive the round start signal.
          </p>
        </div>
      </div>
    </main>
  );
}
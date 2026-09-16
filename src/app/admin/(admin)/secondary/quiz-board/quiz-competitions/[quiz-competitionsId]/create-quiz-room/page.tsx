


"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Clock3,
  Loader2,
  Radio,
  RefreshCw,
  Trophy,
  Users,
  Wifi,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";

import { axiosInstance } from "@/lib/api/axios";


/* ============================================================
   TYPES
   ============================================================ */

interface RoundInformation {
  round_number?: number;
  no_of_questions?: number;
  difficultyBreakdown?: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
  exit_number?: number;
  exit_reward?: number;
}

interface FinalRoundInformation {
  no_of_questions?: number;
  difficultyBreakdown?: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
  first_position_reward?: number;
  second_position_reward?: number;
}

interface Quiz {
  _id: string;
  quiz_title?: string;
  description?: string;
  status?: string;
  subject?: string | { name?: string };
  time_per_question?: number;
  start_date?: string;
  no_of_contestants?: number;
  number_of_rounds?: number;
  round_information?: RoundInformation[];
  final_round_information?: FinalRoundInformation;
  current_round?: number;
  room_id?: string | null;
  joined_users?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface SocketEventLog {
  id: number;
  event: string;
  message: string;
  timestamp: string;
  payload?: unknown;
}

interface Participant {
  id?: string;
  userId?: string;
  _id?: string;
  name?: string;
  username?: string;
  fullName?: string;
  email?: string;
  [key: string]: unknown;
}

interface LeaderboardEntry {
  id?: string;
  userId?: string;
  _id?: string;
  name?: string;
  username?: string;
  score?: number;
  points?: number;
  rank?: number;
  position?: number;
  timeTaken?: number;
  timeTakenInSeconds?: number;
  [key: string]: unknown;
}

/* ============================================================
   SOCKET EVENTS
   ============================================================ */

const SOCKET_EVENTS = {
  PARTICIPANT_JOINED_ROOM: "participant_joined_room",
  ROUND_STARTED: "round_started",
  LEADERBOARD_UPDATED: "leaderboard_updated",
  TIEBREAKER_QUESTION_STARTED: "tiebreaker_question_started",
  PARTICIPANTS_ELIMINATED: "participants_eliminated",
  JOINED_ROOM_ACK: "joined_room_ack",
} as const;

const SOCKET_JOIN_EVENT = "join_room";

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Your REST API URL is:
 *
 * https://mypastquestionsapp.onrender.com/api/v1
 *
 * Socket.IO normally connects to the backend host rather than
 * the REST API prefix.
 *
 * Therefore this converts:
 *
 * /api/v1
 *
 * into:
 *
 * https://mypastquestionsapp.onrender.com
 */
function getSocketBaseUrl(): string {
  const apiUrl = String(
    axiosInstance.defaults.baseURL ?? "",
  ).trim();

  if (!apiUrl) {
    return "";
  }

  return apiUrl.replace(
    /\/api\/v1\/?$/,
    "",
  );
}

function formatTime(date = new Date()): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDateTime(value?: string): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getSubjectName(subject?: Quiz["subject"]): string {
  if (!subject) {
    return "Subject not specified";
  }

  if (typeof subject === "string") {
    return subject;
  }

  return subject.name || "Subject not specified";
}

function getParticipantName(
  participant: Participant | LeaderboardEntry,
): string {
  const value =
    participant.name ??
    participant.fullName ??
    participant.username ??
    participant.email ??
    participant.userId ??
    participant.id ??
    participant._id;

  return value != null ? String(value) : "Participant";
}

function extractRoomId(response: unknown): string | null {
  const data = response as {
    data?: {
      data?: {
        roomId?: string;
        quizId?: string;
      };
    };
  };

  return data?.data?.data?.roomId ?? null;
}

function extractQuizId(response: unknown): string | null {
  const data = response as {
    data?: {
      data?: {
        roomId?: string;
        quizId?: string;
      };
    };
  };

  return data?.data?.data?.quizId ?? null;
}

function extractQuizFromResponse(response: unknown): Quiz | null {
  const root = response as {
    data?: {
      _id?: string;
      quiz_title?: string;
      [key: string]: unknown;
    };
  };

  if (
    root?.data &&
    typeof root.data === "object" &&
    root.data._id
  ) {
    return root.data as Quiz;
  }

  return null;
}

function extractParticipants(payload: unknown): Participant[] {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as Participant[];
  }

  if (typeof payload !== "object") {
    return [];
  }

  const data = payload as Record<string, unknown>;

  const candidates = [
    data.participants,
    data.joined_users,
    data.joinedUsers,
    data.users,
    data.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as Participant[];
    }

    if (
      candidate &&
      typeof candidate === "object"
    ) {
      const nested = candidate as Record<string, unknown>;

      const nestedCandidates = [
        nested.participants,
        nested.joined_users,
        nested.joinedUsers,
        nested.users,
      ];

      for (const nestedCandidate of nestedCandidates) {
        if (Array.isArray(nestedCandidate)) {
          return nestedCandidate as Participant[];
        }
      }
    }
  }

  return [];
}

function extractLeaderboard(
  payload: unknown,
): LeaderboardEntry[] {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as LeaderboardEntry[];
  }

  if (typeof payload !== "object") {
    return [];
  }

  const data = payload as Record<string, unknown>;

  const candidates = [
    data.leaderboard,
    data.leaderBoard,
    data.rankings,
    data.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as LeaderboardEntry[];
    }

    if (
      candidate &&
      typeof candidate === "object"
    ) {
      const nested = candidate as Record<string, unknown>;

      const nestedCandidates = [
        nested.leaderboard,
        nested.leaderBoard,
        nested.rankings,
      ];

      for (const nestedCandidate of nestedCandidates) {
        if (Array.isArray(nestedCandidate)) {
          return nestedCandidate as LeaderboardEntry[];
        }
      }
    }
  }

  return [];
}

/* ============================================================
   PAGE
   ============================================================ */

export default function CreateQuizRoomPage() {
  const params = useParams();
  const router = useRouter();

  const quizCompetitionId = String(
    params?.["quiz-competitionsId"] ?? "",
  );

  const socketRef = useRef<Socket | null>(null);
  const eventIdRef = useRef(0);

  const [isCreatingRoom, setIsCreatingRoom] =
    useState(false);

  const [isLoadingQuiz, setIsLoadingQuiz] =
    useState(false);

  const [quiz, setQuiz] =
    useState<Quiz | null>(null);

  const [roomId, setRoomId] =
    useState<string | null>(null);

  const [createdQuizId, setCreatedQuizId] =
    useState<string | null>(null);

  const [socketConnected, setSocketConnected] =
    useState(false);

  const [socketError, setSocketError] =
    useState<string | null>(null);

  const [joinAcknowledged, setJoinAcknowledged] =
    useState(false);

  const [participants, setParticipants] =
    useState<Participant[]>([]);

  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>([]);

  const [currentRound, setCurrentRound] =
    useState<number>(0);

  const [isCopied, setIsCopied] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [eventLogs, setEventLogs] =
    useState<SocketEventLog[]>([]);

  /* ==========================================================
     SOCKET URL
     ========================================================== */

  const socketBaseUrl = useMemo(
    () => getSocketBaseUrl(),
    [],
  );

  /* ==========================================================
     EVENT LOGGER
     ========================================================== */

  const addEventLog = useCallback(
    (
      event: string,
      message: string,
      payload?: unknown,
    ) => {
      const newLog: SocketEventLog = {
        id: ++eventIdRef.current,
        event,
        message,
        timestamp: formatTime(),
        payload,
      };

      setEventLogs((previous) => [
        newLog,
        ...previous,
      ]);
    },
    [],
  );

  /* ==========================================================
     LOAD QUIZ
     ========================================================== */

  const loadQuiz = useCallback(
    async (quizId: string) => {
      if (!quizId) {
        return;
      }

      try {
        setIsLoadingQuiz(true);
        setError(null);

        const response =
          await axiosInstance.get(
            `/quiz/get-quiz-by-quizId/${quizId}`,
          );

        const fetchedQuiz =
          extractQuizFromResponse(
            response.data,
          );

        if (!fetchedQuiz) {
          throw new Error(
            "Quiz was not found in the server response.",
          );
        }

        setQuiz(fetchedQuiz);

        setCurrentRound(
          Number(
            fetchedQuiz.current_round ?? 0,
          ),
        );

        /*
         * If a room already exists, keep it.
         *
         * This is useful if the admin refreshes the page
         * after the room has already been created.
         */
        if (fetchedQuiz.room_id) {
          setRoomId(fetchedQuiz.room_id);
        }

        if (
          Array.isArray(
            fetchedQuiz.joined_users,
          )
        ) {
          setParticipants(
            fetchedQuiz.joined_users.map(
              (userId) => ({
                userId,
              }),
            ),
          );
        }
      } catch (requestError) {
        console.error(
          "Failed to load quiz:",
          requestError,
        );

        setError(
          "Unable to load the quiz information.",
        );
      } finally {
        setIsLoadingQuiz(false);
      }
    },
    [],
  );

  /* ==========================================================
     INITIAL QUIZ LOAD
     ========================================================== */

  useEffect(() => {
    if (!quizCompetitionId) {
      setError(
        "No quiz competition ID was provided.",
      );
      return;
    }

    void loadQuiz(
      quizCompetitionId,
    );
  }, [
    quizCompetitionId,
    loadQuiz,
  ]);

  /* ==========================================================
     CREATE ROOM
     ========================================================== */

  const createRoom = useCallback(
    async () => {
      if (!quizCompetitionId) {
        setError(
          "Quiz competition ID is missing.",
        );
        return;
      }

      try {
        setIsCreatingRoom(true);
        setError(null);
        setSocketError(null);

        /*
         * The backend expects:
         *
         * POST /quiz/create-room
         *
         * {
         *   quizId: "..."
         * }
         */
        const response =
          await axiosInstance.post(
            "/quiz/create-room",
            {
              quizId:
                quizCompetitionId,
            },
          );

        console.log(
          "Create room response:",
          response.data,
        );

        const newRoomId =
          extractRoomId(
            response.data,
          );

        const newQuizId =
          extractQuizId(
            response.data,
          );

        if (!newRoomId) {
          throw new Error(
            "Room was created but no room ID was returned.",
          );
        }

        setRoomId(newRoomId);

        if (newQuizId) {
          setCreatedQuizId(
            newQuizId,
          );
        } else {
          setCreatedQuizId(
            quizCompetitionId,
          );
        }

        addEventLog(
          "room_created",
          "Quiz room created successfully.",
          response.data,
        );

        /*
         * Fetch the latest quiz state after creating
         * the room so the UI gets the current room_id.
         */
        await loadQuiz(
          newQuizId ||
            quizCompetitionId,
        );
      } catch (requestError) {
        console.error(
          "Failed to create quiz room:",
          requestError,
        );

        let message =
          "Unable to create the quiz room.";

        if (
          typeof requestError ===
            "object" &&
          requestError !== null &&
          "response" in requestError
        ) {
          const axiosError =
            requestError as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            };

          message =
            axiosError.response?.data
              ?.message ||
            message;
        }

        setError(message);
      } finally {
        setIsCreatingRoom(false);
      }
    },
    [
      quizCompetitionId,
      addEventLog,
      loadQuiz,
    ],
  );

  /* ==========================================================
     JOIN SOCKET ROOM
     ========================================================== */

  const connectAndJoinRoom =
    useCallback(
      (
        targetRoomId: string,
      ) => {
        if (!targetRoomId) {
          return;
        }

        if (!socketBaseUrl) {
          setSocketError(
            "The backend API URL is not configured.",
          );
          return;
        }

        /*
         * Avoid creating duplicate socket connections.
         */
        if (
          socketRef.current?.connected
        ) {
          socketRef.current.emit(
            SOCKET_JOIN_EVENT,
            {
              room_id:
                targetRoomId,
            },
          );

          addEventLog(
            SOCKET_JOIN_EVENT,
            "Admin requested to join the quiz room.",
            {
              room_id:
                targetRoomId,
            },
          );

          return;
        }

        /*
         * Clean up an old socket before creating
         * another connection.
         */
        if (socketRef.current) {
          socketRef.current.removeAllListeners();
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        setSocketError(null);
        setJoinAcknowledged(false);

        const socket = io(
          socketBaseUrl,
          {
            transports: [
              "websocket",
            ],
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
          },
        );

        socketRef.current =
          socket;

        /* ====================================================
           CONNECT
           ==================================================== */

        socket.on(
          "connect",
          () => {
            console.log(
              "Socket connected:",
              socket.id,
            );

            setSocketConnected(true);
            setSocketError(null);

            addEventLog(
              "connect",
              "Admin connected to the quiz server.",
              {
                socketId:
                  socket.id,
              },
            );

            /*
             * CONFIRMED BACKEND CONTRACT:
             *
             * socket.emit("join_room", {
             *   room_id: roomId
             * });
             */
            socket.emit(
              SOCKET_JOIN_EVENT,
              {
                room_id:
                  targetRoomId,
              },
            );

            addEventLog(
              SOCKET_JOIN_EVENT,
              "Admin requested to join the quiz room.",
              {
                room_id:
                  targetRoomId,
              },
            );
          },
        );

        /* ====================================================
           CONNECT ERROR
           ==================================================== */

        socket.on(
          "connect_error",
          (connectError) => {
            console.error(
              "Socket connection error:",
              connectError,
            );

            setSocketConnected(false);

            setSocketError(
              connectError.message ||
                "Unable to connect to the quiz server.",
            );

            addEventLog(
              "connect_error",
              "Unable to connect to the quiz server.",
              {
                message:
                  connectError.message,
              },
            );
          },
        );

        /* ====================================================
           DISCONNECT
           ==================================================== */

        socket.on(
          "disconnect",
          (reason) => {
            console.log(
              "Socket disconnected:",
              reason,
            );

            setSocketConnected(false);
            setJoinAcknowledged(false);

            addEventLog(
              "disconnect",
              `Socket disconnected: ${reason}`,
            );
          },
        );

        /* ====================================================
           JOINED ROOM ACK
           ==================================================== */

        socket.on(
          SOCKET_EVENTS.JOINED_ROOM_ACK,
          (payload) => {
            console.log(
              SOCKET_EVENTS.JOINED_ROOM_ACK,
              payload,
            );

            setJoinAcknowledged(
              true,
            );

            addEventLog(
              SOCKET_EVENTS.JOINED_ROOM_ACK,
              "Admin successfully joined the quiz room.",
              payload,
            );

            /*
             * Some backend implementations return the
             * current participant list in the acknowledgement.
             */
            const ackParticipants =
              extractParticipants(
                payload,
              );

            if (
              ackParticipants.length
            ) {
              setParticipants(
                ackParticipants,
              );
            }
          },
        );

        /* ====================================================
           PARTICIPANT JOINED ROOM
           ==================================================== */

        socket.on(
          SOCKET_EVENTS.PARTICIPANT_JOINED_ROOM,
          (payload) => {
            console.log(
              SOCKET_EVENTS.PARTICIPANT_JOINED_ROOM,
              payload,
            );

            addEventLog(
              SOCKET_EVENTS.PARTICIPANT_JOINED_ROOM,
              "A participant joined the quiz room.",
              payload,
            );

            const nextParticipants =
              extractParticipants(
                payload,
              );

            if (
              nextParticipants.length
            ) {
              setParticipants(
                nextParticipants,
              );
              return;
            }

            /*
             * If the backend sends a single participant
             * rather than the complete list, add it.
             */
            if (
              payload &&
              typeof payload ===
                "object"
            ) {
              const candidate =
                payload as Participant;

              const candidateId =
                candidate.userId ||
                candidate.id ||
                candidate._id;

              if (candidateId) {
                setParticipants(
                  (previous) => {
                    const alreadyExists =
                      previous.some(
                        (participant) =>
                          String(
                            participant.userId ||
                              participant.id ||
                              participant._id,
                          ) ===
                          String(
                            candidateId,
                          ),
                      );

                    if (
                      alreadyExists
                    ) {
                      return previous;
                    }

                    return [
                      ...previous,
                      candidate,
                    ];
                  },
                );
              }
            }
          },
        );

        /* ====================================================
           ROUND STARTED
           ==================================================== */

        socket.on(
          SOCKET_EVENTS.ROUND_STARTED,
          (payload) => {
            console.log(
              SOCKET_EVENTS.ROUND_STARTED,
              payload,
            );

            addEventLog(
              SOCKET_EVENTS.ROUND_STARTED,
              "A quiz round has started.",
              payload,
            );

            if (
              payload &&
              typeof payload ===
                "object"
            ) {
              const data =
                payload as Record<
                  string,
                  unknown
                >;

              const round =
                data.round_number ??
                data.roundNumber ??
                data.current_round ??
                data.currentRound ??
                data.round;

              if (
                typeof round ===
                  "number" ||
                typeof round ===
                  "string"
              ) {
                setCurrentRound(
                  Number(round),
                );
              }
            }
          },
        );

        /* ====================================================
           LEADERBOARD UPDATED
           ==================================================== */

        socket.on(
          SOCKET_EVENTS.LEADERBOARD_UPDATED,
          (payload) => {
            console.log(
              SOCKET_EVENTS.LEADERBOARD_UPDATED,
              payload,
            );

            addEventLog(
              SOCKET_EVENTS.LEADERBOARD_UPDATED,
              "The leaderboard was updated.",
              payload,
            );

            const nextLeaderboard =
              extractLeaderboard(
                payload,
              );

            if (
              nextLeaderboard.length
            ) {
              setLeaderboard(
                nextLeaderboard,
              );
            }
          },
        );

        /* ====================================================
           TIEBREAKER QUESTION STARTED
           ==================================================== */

        socket.on(
          SOCKET_EVENTS.TIEBREAKER_QUESTION_STARTED,
          (payload) => {
            console.log(
              SOCKET_EVENTS.TIEBREAKER_QUESTION_STARTED,
              payload,
            );

            addEventLog(
              SOCKET_EVENTS.TIEBREAKER_QUESTION_STARTED,
              "A tiebreaker question has started.",
              payload,
            );
          },
        );

        /* ====================================================
           PARTICIPANTS ELIMINATED
           ==================================================== */

        socket.on(
          SOCKET_EVENTS.PARTICIPANTS_ELIMINATED,
          (payload) => {
            console.log(
              SOCKET_EVENTS.PARTICIPANTS_ELIMINATED,
              payload,
            );

            addEventLog(
              SOCKET_EVENTS.PARTICIPANTS_ELIMINATED,
              "Participants were eliminated.",
              payload,
            );

            const remainingParticipants =
              extractParticipants(
                payload,
              );

            if (
              remainingParticipants.length
            ) {
              setParticipants(
                remainingParticipants,
              );
            }
          },
        );

        socket.connect();
      },
      [
        socketBaseUrl,
        addEventLog,
      ],
    );

  /* ==========================================================
     AUTOMATICALLY JOIN AFTER ROOM CREATION / LOAD
     ========================================================== */

  useEffect(() => {
    if (!roomId) {
      return;
    }

    connectAndJoinRoom(
      roomId,
    );

    return () => {
      /*
       * We intentionally do not disconnect here when the
       * room ID changes due to a normal state update.
       *
       * The final cleanup is handled by the page-level
       * cleanup effect below.
       */
    };
  }, [
    roomId,
    connectAndJoinRoom,
  ]);

  /* ==========================================================
     PAGE CLEANUP
     ========================================================== */

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  /* ==========================================================
     COPY ROOM ID
     ========================================================== */

  const copyRoomId =
    useCallback(async () => {
      if (!roomId) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          roomId,
        );

        setIsCopied(true);

        window.setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (copyError) {
        console.error(
          "Failed to copy room ID:",
          copyError,
        );
      }
    }, [roomId]);

  /* ==========================================================
     MANUAL RECONNECT
     ========================================================== */

  const reconnectSocket =
    useCallback(() => {
      if (!roomId) {
        return;
      }

      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      connectAndJoinRoom(
        roomId,
      );
    }, [
      roomId,
      connectAndJoinRoom,
    ]);

  /* ==========================================================
     DERIVED VALUES
     ========================================================== */

  const participantCount =
    participants.length;

  const maximumParticipants =
    quiz?.no_of_contestants ?? 0;

  const participantProgress =
    maximumParticipants > 0
      ? Math.min(
          100,
          Math.round(
            (participantCount /
              maximumParticipants) *
              100,
          ),
        )
      : 0;

  const currentRoundInfo =
    quiz?.round_information?.find(
      (round) =>
        Number(
          round.round_number,
        ) === currentRound,
    );

  const isRoomReady =
    Boolean(roomId);

  const connectionLabel =
    socketConnected
      ? "Connected"
      : "Disconnected";

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/secondary/quiz-board/quiz-competitions"
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quiz Competitions
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Create Quiz Room
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Create and manage the live Socket.IO
              quiz room for this competition.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm ${
              socketConnected
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-slate-700 bg-slate-900 text-slate-400"
            }`}
          >
            {socketConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}

            {connectionLabel}
          </div>
        </div>

        {/* ====================================================
            ERROR
            ==================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-medium">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-300">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError(null);

                void loadQuiz(
                  quizCompetitionId,
                );
              }}
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs transition hover:bg-red-500/10"
            >
              Retry
            </button>
          </div>
        )}

        {socketError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              <p className="font-medium">
                Socket connection issue
              </p>

              <p className="mt-1 text-sm text-amber-300">
                {socketError}
              </p>
            </div>

            {roomId && (
              <button
                type="button"
                onClick={reconnectSocket}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs transition hover:bg-amber-500/10"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reconnect
              </button>
            )}
          </div>
        )}

        {/* ====================================================
            QUIZ INFORMATION
            ==================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Quiz Competition
              </p>

              <h2 className="text-xl font-bold">
                {isLoadingQuiz
                  ? "Loading quiz..."
                  : quiz?.quiz_title ||
                    "Quiz competition"}
              </h2>

              {quiz?.description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  {quiz.description}
                </p>
              )}
            </div>

            {quiz?.status && (
              <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                {quiz.status}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">
                Subject
              </p>

              <p className="mt-1 font-semibold text-slate-200">
                {getSubjectName(
                  quiz?.subject,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">
                Contestants
              </p>

              <p className="mt-1 font-semibold text-slate-200">
                {quiz?.no_of_contestants ??
                  "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">
                Time / Question
              </p>

              <p className="mt-1 flex items-center gap-1 font-semibold text-slate-200">
                <Clock3 className="h-4 w-4 text-cyan-400" />
                {quiz?.time_per_question ??
                  "—"}
                s
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">
                Rounds
              </p>

              <p className="mt-1 font-semibold text-slate-200">
                {quiz?.number_of_rounds ??
                  "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">
                Start Date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-200">
                {formatDateTime(
                  quiz?.start_date,
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================
            ROOM CONTROL
            ==================================================== */}

        {!isRoomReady ? (
          <section className="mb-6 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-slate-950 p-6 shadow-xl">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
                <Radio className="h-8 w-8 text-cyan-400" />
              </div>

              <h2 className="text-xl font-bold">
                Ready to create the quiz room
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                Creating the room will generate the
                room ID and connect the admin to the
                Socket.IO room automatically.
              </p>

              <button
                type="button"
                disabled={
                  isCreatingRoom ||
                  isLoadingQuiz
                }
                onClick={createRoom}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingRoom ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Create Quiz Room
                  </>
                )}
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* ==================================================
                ROOM ID
                ================================================== */}

            <section className="mb-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-950 p-5 shadow-xl">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                    <p className="text-sm font-semibold text-emerald-300">
                      Quiz Room Ready
                    </p>
                  </div>

                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Room ID
                  </p>

                  <div className="mt-2 break-all font-mono text-lg font-bold text-white sm:text-2xl">
                    {roomId}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyRoomId}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >
                    {isCopied ? (
                      <>
                        <ClipboardCheck className="h-4 w-4 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-4 w-4" />
                        Copy Room ID
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={reconnectSocket}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reconnect
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">
                    Socket Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        socketConnected
                          ? "bg-emerald-400"
                          : "bg-red-400"
                      }`}
                    />

                    <span className="text-sm font-semibold">
                      {socketConnected
                        ? "Connected"
                        : "Disconnected"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">
                    Room Join
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    {joinAcknowledged ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300">
                          Joined
                        </span>
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                        <span className="text-sm font-semibold text-amber-300">
                          Waiting for acknowledgement
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <p className="text-xs text-slate-500">
                    Quiz ID
                  </p>

                  <p className="mt-2 truncate font-mono text-sm font-semibold text-slate-300">
                    {createdQuizId ||
                      quiz?._id ||
                      quizCompetitionId}
                  </p>
                </div>
              </div>
            </section>

            {/* ==================================================
                LIVE STATS
                ================================================== */}

            <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Participants
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {participantCount}
                      <span className="text-lg text-slate-500">
                        {" "}
                        /{" "}
                        {maximumParticipants ||
                          "—"}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-cyan-500/10 p-3">
                    <Users className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>

                {maximumParticipants > 0 && (
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>
                        Room capacity
                      </span>

                      <span>
                        {participantProgress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                        style={{
                          width: `${participantProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Current Round
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {currentRound || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-violet-500/10 p-3">
                    <Trophy className="h-6 w-6 text-violet-400" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {quiz?.number_of_rounds
                    ? `${quiz.number_of_rounds} total rounds`
                    : "Round information unavailable"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Questions
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {currentRoundInfo
                        ?.no_of_questions ??
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-500/10 p-3">
                    <Zap className="h-6 w-6 text-amber-400" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Current round
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Leaderboard
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {leaderboard.length}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-500/10 p-3">
                    <Trophy className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Latest entries received
                </p>
              </div>
            </section>

            {/* ==================================================
                MAIN CONTENT
                ================================================== */}

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* =================================================
                  PARTICIPANTS
                  ================================================= */}

              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 p-5">
                  <div>
                    <h2 className="font-bold">
                      Live Participants
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Updated through Socket.IO
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                    {participantCount}
                  </div>
                </div>

                <div className="max-h-[430px] overflow-y-auto p-3">
                  {participants.length ===
                  0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                      <Users className="h-10 w-10 text-slate-700" />

                      <p className="mt-4 font-medium text-slate-400">
                        No participants yet
                      </p>

                      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-600">
                        Students who join this room
                        will appear here when the
                        backend emits
                        participant_joined_room.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {participants.map(
                        (
                          participant,
                          index,
                        ) => {
                          const participantId =
                            String(
                              participant.userId ||
                                participant.id ||
                                participant._id ||
                                index,
                            );

                          return (
                            <div
                              key={`${participantId}-${index}`}
                              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-bold text-cyan-400">
                                {index + 1}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-200">
                                  {getParticipantName(
                                    participant,
                                  )}
                                </p>

                                <p className="truncate font-mono text-[11px] text-slate-600">
                                  {participantId}
                                </p>
                              </div>

                              <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  LEADERBOARD
                  ================================================= */}

              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 p-5">
                  <div>
                    <h2 className="font-bold">
                      Leaderboard
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Latest leaderboard update
                    </p>
                  </div>

                  <Trophy className="h-5 w-5 text-amber-400" />
                </div>

                <div className="max-h-[430px] overflow-y-auto p-3">
                  {leaderboard.length ===
                  0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                      <Trophy className="h-10 w-10 text-slate-700" />

                      <p className="mt-4 font-medium text-slate-400">
                        No leaderboard data yet
                      </p>

                      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-600">
                        The leaderboard will appear
                        here when the backend emits
                        leaderboard_updated.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {leaderboard.map(
                        (
                          entry,
                          index,
                        ) => {
                          const position =
                            entry.rank ??
                            entry.position ??
                            index + 1;

                          return (
                            <div
                              key={`${String(
                                entry.userId ||
                                  entry.id ||
                                  entry._id ||
                                  index,
                              )}-${index}`}
                              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-sm font-bold text-amber-300">
                                {position}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-200">
                                  {getParticipantName(
                                    entry,
                                  )}
                                </p>

                                <p className="text-xs text-slate-500">
                                  Score:{" "}
                                  {entry.score ??
                                    entry.points ??
                                    0}
                                </p>
                              </div>

                              {typeof (
                                entry.timeTaken ??
                                entry.timeTakenInSeconds
                              ) ===
                                "number" && (
                                <span className="text-xs text-slate-500">
                                  {entry.timeTaken ??
                                    entry.timeTakenInSeconds}
                                  s
                                </span>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ==================================================
                ROUND INFORMATION
                ================================================== */}

            {quiz && (
              <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
                <div className="border-b border-slate-800 p-5">
                  <h2 className="font-bold">
                    Competition Rounds
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Configured round structure for this
                    competition.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-3">
                          Round
                        </th>
                        <th className="px-5 py-3">
                          Questions
                        </th>
                        <th className="px-5 py-3">
                          Easy
                        </th>
                        <th className="px-5 py-3">
                          Medium
                        </th>
                        <th className="px-5 py-3">
                          Hard
                        </th>
                        <th className="px-5 py-3">
                          Exit
                        </th>
                        <th className="px-5 py-3">
                          Reward
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {quiz.round_information?.map(
                        (round) => (
                          <tr
                            key={
                              round.round_number
                            }
                            className={`border-b border-slate-800/70 ${
                              Number(
                                round.round_number,
                              ) ===
                              currentRound
                                ? "bg-cyan-500/5"
                                : ""
                            }`}
                          >
                            <td className="px-5 py-4 font-semibold">
                              Round{" "}
                              {
                                round.round_number
                              }
                              {Number(
                                round.round_number,
                              ) ===
                                currentRound && (
                                <span className="ml-2 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
                                  CURRENT
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4 text-slate-300">
                              {round.no_of_questions ??
                                "—"}
                            </td>

                            <td className="px-5 py-4 text-slate-400">
                              {round
                                .difficultyBreakdown
                                ?.easy ??
                                0}
                            </td>

                            <td className="px-5 py-4 text-slate-400">
                              {round
                                .difficultyBreakdown
                                ?.medium ??
                                0}
                            </td>

                            <td className="px-5 py-4 text-slate-400">
                              {round
                                .difficultyBreakdown
                                ?.hard ??
                                0}
                            </td>

                            <td className="px-5 py-4 text-slate-400">
                              {round.exit_number ??
                                "—"}
                            </td>

                            <td className="px-5 py-4 font-semibold text-emerald-300">
                              {round.exit_reward ??
                                0}
                            </td>
                          </tr>
                        ),
                      )}

                      {quiz.final_round_information && (
                        <tr className="bg-amber-500/5">
                          <td className="px-5 py-4 font-semibold text-amber-300">
                            Final
                          </td>

                          <td className="px-5 py-4 text-slate-300">
                            {
                              quiz
                                .final_round_information
                                .no_of_questions
                            }
                          </td>

                          <td className="px-5 py-4 text-slate-400">
                            {quiz
                              .final_round_information
                              .difficultyBreakdown
                              ?.easy ??
                              0}
                          </td>

                          <td className="px-5 py-4 text-slate-400">
                            {quiz
                              .final_round_information
                              .difficultyBreakdown
                              ?.medium ??
                              0}
                          </td>

                          <td className="px-5 py-4 text-slate-400">
                            {quiz
                              .final_round_information
                              .difficultyBreakdown
                              ?.hard ??
                              0}
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            —
                          </td>

                          <td className="px-5 py-4 font-semibold text-amber-300">
                            {
                              quiz
                                .final_round_information
                                .first_position_reward
                            }{" "}
                            /{" "}
                            {
                              quiz
                                .final_round_information
                                .second_position_reward
                            }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ==================================================
                SOCKET EVENT LOG
                ================================================== */}

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 p-5">
                <div>
                  <h2 className="font-bold">
                    Live Room Events
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Real-time events received from the
                    quiz server.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Radio className="h-4 w-4" />
                  {eventLogs.length} events
                </div>
              </div>

              <div className="max-h-[420px] overflow-y-auto p-3">
                {eventLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                    <Radio className="h-10 w-10 text-slate-700" />

                    <p className="mt-4 font-medium text-slate-400">
                      Waiting for room events
                    </p>

                    <p className="mt-1 max-w-lg text-xs leading-5 text-slate-600">
                      Socket connection and room events
                      will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {eventLogs.map(
                      (event) => (
                        <div
                          key={event.id}
                          className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-md bg-cyan-500/10 px-2 py-1 font-mono text-[11px] font-semibold text-cyan-300">
                                  {event.event}
                                </span>

                                <span className="text-[11px] text-slate-600">
                                  {event.timestamp}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-slate-300">
                                {event.message}
                              </p>
                            </div>
                          </div>

                          {event.payload !==
                            undefined && (
                            <details className="mt-3">
                              <summary className="cursor-pointer text-xs text-slate-600 hover:text-slate-400">
                                View payload
                              </summary>

                              <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-black/30 p-3 text-[10px] leading-5 text-slate-500">
                                {JSON.stringify(
                                  event.payload,
                                  null,
                                  2,
                                )}
                              </pre>
                            </details>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* ==================================================
                SOCKET EVENTS REFERENCE
                ================================================== */}

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Radio className="h-5 w-5 text-cyan-400" />

                <div>
                  <h2 className="font-bold">
                    Socket.IO Events
                  </h2>

                  <p className="text-xs text-slate-500">
                    Events currently handled by this admin
                    room page.
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.values(
                  SOCKET_EVENTS,
                ).map((event) => (
                  <div
                    key={event}
                    className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
                  >
                    <code className="font-mono text-xs text-slate-400">
                      {event}
                    </code>
                  </div>
                ))}
              </div>
            </section>

            {/* ==================================================
                ROOM STATUS
                ================================================== */}

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  {socketConnected ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 text-red-400" />
                  )}

                  <div>
                    <p className="font-semibold">
                      {socketConnected
                        ? joinAcknowledged
                          ? "Admin is connected and inside the quiz room."
                          : "Admin is connected and waiting for room acknowledgement."
                        : "Admin is not connected to the quiz server."}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Students should use the existing room ID
                      from the quiz API and join this room
                      through Socket.IO.
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin/secondary/quiz-board/quiz-competitions"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quiz Competitions
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
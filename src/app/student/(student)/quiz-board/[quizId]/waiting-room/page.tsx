// C:\Users\Lara Spellman\Jamb\jamb-league\src\app\student\(student)\quiz-board\[quizId]\page.tsx

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";

import { io, Socket } from "socket.io-client";

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

/* =========================================================
   TYPES
========================================================= */

type QuizSubject = {
  _id?: string;
  name?: string;
};

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

type JoinedUser = {
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
  subject?: QuizSubject | null;
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
  data?: QuizCompetition | { quiz?: QuizCompetition };
};

type LobbyStatus =
  | "loading"
  | "not_ready"
  | "waiting"
  | "live"
  | "completed"
  | "error";

type SocketStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

type LeaderboardEntry = {
  id: string;
  name: string;
  rank?: number;
  score?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  unansweredQuestions?: number;
  timeTakenInSeconds?: number;
  [key: string]: unknown;
};

type TiebreakerQuestion = {
  id?: string;
  _id?: string;
  question?: string;
  content?: string;
  text?: string;
  options?: unknown[];
  [key: string]: unknown;
};

/* =========================================================
   SOCKET EVENT NAMES
========================================================= */

const SOCKET_EVENTS = {
  PARTICIPANT_JOINED_ROOM:
    "participant_joined_room",

  ROUND_STARTED: "round_started",

  LEADERBOARD_UPDATED:
    "leaderboard_updated",

  TIEBREAKER_QUESTION_STARTED:
    "tiebreaker_question_started",

  PARTICIPANTS_ELIMINATED:
    "participants_eliminated",

  JOINED_ROOM_ACK:
    "joined_room_ack",
};

const SOCKET_JOIN_EVENT = "join_room";

/* =========================================================
   HELPERS
========================================================= */

function extractQuiz(
  response:
    | QuizApiResponse
    | QuizCompetition,
): QuizCompetition | null {
  if (!response) {
    return null;
  }

  if ("_id" in response) {
    return response;
  }

  const data = response.data;

  if (!data) {
    return null;
  }

  if ("_id" in data) {
    return data;
  }

  return data.quiz ?? null;
}

function getUserName(
  user: JoinedUser,
  index: number,
) {
  if (user.fullName) {
    return user.fullName;
  }

  if (user.name) {
    return user.name;
  }

  if (user.username) {
    return user.username;
  }

  const combinedName =
    `${user.firstName ?? ""} ${
      user.lastName ?? ""
    }`.trim();

  if (combinedName) {
    return combinedName;
  }

  return `Player ${index + 1}`;
}

function getUserInitials(
  name: string,
) {
  const parts = name
    .trim()
    .split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getTotalQuestions(
  quiz: QuizCompetition,
) {
  const eliminationQuestions =
    quiz.round_information?.reduce(
      (total, round) =>
        total +
        Number(
          round.no_of_questions ?? 0,
        ),
      0,
    ) ?? 0;

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
) {
  const contestants = Number(
    quiz.no_of_contestants ?? 20,
  );

  const sequence = [contestants];

  const rounds =
    quiz.round_information ?? [];

  rounds.forEach((round) => {
    const exitNumber = Number(
      round.exit_number ?? 0,
    );

    if (
      exitNumber > 0 &&
      exitNumber <
        sequence[
          sequence.length - 1
        ]
    ) {
      sequence.push(exitNumber);
    }
  });

  if (
    !sequence.includes(2) &&
    contestants >= 2
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
) {
  const totalRounds = Number(
    quiz.number_of_rounds ?? 0,
  );

  if (
    currentRound >= totalRounds &&
    totalRounds > 0
  ) {
    return "Final Round";
  }

  if (currentRound <= 0) {
    return "Lobby";
  }

  return `Round ${currentRound}`;
}

function formatStartDate(
  date?: string,
) {
  if (!date) {
    return "Start time not announced";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Start time not announced";
  }

  return parsed.toLocaleString(
    "en-NG",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
}

function formatStatus(
  status?: string,
) {
  return String(
    status ?? "DRAFT",
  )
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

/* =========================================================
   SOCKET DATA HELPERS
========================================================= */

function unwrapSocketData(
  payload: unknown,
): any {
  if (
    !payload ||
    typeof payload !== "object"
  ) {
    return {};
  }

  const value = payload as any;

  if (
    value.data &&
    typeof value.data === "object"
  ) {
    return value.data;
  }

  return value;
}

function getSocketValue(
  payload: unknown,
  keys: string[],
): unknown {
  const root =
    unwrapSocketData(payload);

  for (const key of keys) {
    if (
      root &&
      root[key] !== undefined
    ) {
      return root[key];
    }
  }

  if (
    root?.data &&
    typeof root.data === "object"
  ) {
    for (const key of keys) {
      if (
        root.data[key] !==
        undefined
      ) {
        return root.data[key];
      }
    }
  }

  return undefined;
}

function normalizeJoinedUsers(
  value: unknown,
): JoinedUser[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return value.map(
    (
      player: any,
      index,
    ) => {
      if (
        player &&
        typeof player === "object"
      ) {
        return {
          ...player,
        };
      }

      return {
        id: String(
          player ?? index,
        ),
        name: `Player ${
          index + 1
        }`,
      };
    },
  );
}

function normalizeParticipant(
  value: unknown,
): JoinedUser | null {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  return {
    ...(value as JoinedUser),
  };
}

function getEntityId(
  entity: JoinedUser,
) {
  return (
    entity._id ||
    entity.id ||
    entity.userId ||
    ""
  );
}

function mergeParticipant(
  users: JoinedUser[],
  participant: JoinedUser,
) {
  const participantId =
    getEntityId(participant);

  if (!participantId) {
    return [
      ...users,
      participant,
    ];
  }

  const exists = users.some(
    (user) =>
      getEntityId(user) ===
      participantId,
  );

  if (exists) {
    return users.map((user) =>
      getEntityId(user) ===
      participantId
        ? {
            ...user,
            ...participant,
          }
        : user,
    );
  }

  return [
    ...users,
    participant,
  ];
}

function normalizeLeaderboard(
  value: unknown,
): LeaderboardEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(
    (
      entry: any,
      index,
    ) => {
      const participant =
        entry?.user ??
        entry?.participant ??
        entry;

      const name =
        participant?.fullName ||
        participant?.name ||
        participant?.username ||
        `${participant?.firstName ?? ""} ${
          participant?.lastName ?? ""
        }`.trim() ||
        `Player ${
          index + 1
        }`;

      const id = String(
        participant?._id ||
          participant?.id ||
          participant?.userId ||
          entry?._id ||
          entry?.id ||
          index,
      );

      return {
        ...entry,
        id,
        name,
        rank:
          Number(
            entry?.rank ??
              entry?.position ??
              index + 1,
          ) ||
          index + 1,
        score:
          entry?.score !==
          undefined
            ? Number(
                entry.score,
              )
            : entry?.totalScore !==
                undefined
              ? Number(
                  entry.totalScore,
                )
              : undefined,
        correctAnswers:
          entry?.correctAnswers !==
          undefined
            ? Number(
                entry.correctAnswers,
              )
            : undefined,
        wrongAnswers:
          entry?.wrongAnswers !==
          undefined
            ? Number(
                entry.wrongAnswers,
              )
            : undefined,
        unansweredQuestions:
          entry?.unansweredQuestions !==
          undefined
            ? Number(
                entry.unansweredQuestions,
              )
            : undefined,
        timeTakenInSeconds:
          entry?.timeTakenInSeconds !==
          undefined
            ? Number(
                entry.timeTakenInSeconds,
              )
            : undefined,
      };
    },
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function QuizBoardWaitingRoomPage() {
  const router = useRouter();

  const params = useParams();

  const quizId =
    typeof params?.quizId ===
    "string"
      ? params.quizId
      : Array.isArray(
            params?.quizId,
          )
        ? params.quizId[0]
        : "";

  const [quiz, setQuiz] =
    useState<QuizCompetition | null>(
      null,
    );

  const [status, setStatus] =
    useState<LobbyStatus>(
      "loading",
    );

  const [
    socketStatus,
    setSocketStatus,
  ] = useState<SocketStatus>(
    "disconnected",
  );

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  const [joinedAck, setJoinedAck] =
    useState(false);

  const [
    leaderboard,
    setLeaderboard,
  ] = useState<
    LeaderboardEntry[]
  >([]);

  const [
    eliminatedPlayers,
    setEliminatedPlayers,
  ] = useState<JoinedUser[]>([]);

  const [
    tiebreakerQuestion,
    setTiebreakerQuestion,
  ] =
    useState<TiebreakerQuestion | null>(
      null,
    );

  const [
    lastSocketEvent,
    setLastSocketEvent,
  ] = useState("");

  /*
   * This clock is intentionally updated every
   * second so the page automatically changes
   * state when the scheduled start time arrives.
   */
  const [currentTime, setCurrentTime] =
    useState<number>(() =>
      Date.now(),
    );

  const socketRef =
    useRef<Socket | null>(null);

  const reconnectTimerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const reconnectAttemptsRef =
    useRef(0);

  const manuallyClosedRef =
    useRef(false);

  /* =======================================================
     LIVE CLOCK
  ======================================================= */

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setCurrentTime(
          Date.now(),
        );
      }, 1000);

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, []);

  /* =======================================================
     UPDATE LOBBY STATUS
  ======================================================= */

  const updateLobbyStatus =
    useCallback(
      (
        nextQuiz: QuizCompetition,
      ) => {
        const nextCompetitionStatus =
          String(
            nextQuiz.status ?? "",
          ).toUpperCase();

        const currentRound =
          Number(
            nextQuiz.current_round ??
              0,
          );

        const totalRounds =
          Number(
            nextQuiz.number_of_rounds ??
              0,
          );

        /*
         * COMPLETED always wins.
         */
        if (
          nextCompetitionStatus ===
          "COMPLETED"
        ) {
          setStatus(
            "completed",
          );
          return;
        }

        /*
         * LIVE or an active current round
         * means the competition is already running.
         */
        if (
          nextCompetitionStatus ===
            "LIVE" ||
          (currentRound > 0 &&
            totalRounds > 0 &&
            currentRound <=
              totalRounds)
        ) {
          setStatus("live");
          return;
        }

        /*
         * ==================================================
         * IMPORTANT WAITING RULE
         * ==================================================
         *
         * The student is allowed to enter the
         * WAITING state ONLY when:
         *
         * 1. Scheduled start time has been reached
         * 2. Required number of contestants has joined
         *
         * Both conditions MUST be true.
         */

        const joinedCount =
          Array.isArray(
            nextQuiz.joined_users,
          )
            ? nextQuiz.joined_users
                .length
            : 0;

        const maxPlayers =
          Number(
            nextQuiz.no_of_contestants ??
              20,
          );

        const startTimestamp =
          nextQuiz.start_date
            ? new Date(
                nextQuiz.start_date,
              ).getTime()
            : NaN;

        const isStartTimeReached =
          Number.isFinite(
            startTimestamp,
          ) &&
          Date.now() >=
            startTimestamp;

        const isContestantsFull =
          maxPlayers > 0 &&
          joinedCount >=
            maxPlayers;

        /*
         * ONLY both conditions together
         * can produce "waiting".
         */
        if (
          isStartTimeReached &&
          isContestantsFull
        ) {
          setStatus(
            "waiting",
          );
          return;
        }

        /*
         * Everything else is NOT READY.
         */
        setStatus(
          "not_ready",
        );
      },
      [],
    );

  /* =======================================================
     KEEP STATUS IN SYNC WITH CLOCK
  ======================================================= */

  useEffect(() => {
    if (!quiz) {
      return;
    }

    /*
     * currentTime is intentionally referenced here
     * so this effect runs each second.
     *
     * This allows:
     *
     * 14:49:59 -> not_ready
     * 14:50:00 -> waiting
     *
     * when the lobby is already full.
     */
    void currentTime;

    updateLobbyStatus(
      quiz,
    );
  }, [
    quiz,
    currentTime,
    updateLobbyStatus,
  ]);

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

      if (silent) {
        setRefreshing(true);
      } else {
        setStatus(
          "loading",
        );
      }

      setError("");

      try {
        const response =
          await getQuizById(
            quizId,
          );

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
      } catch (err: any) {
        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Unable to load the competition.",
        );

        setStatus("error");
      } finally {
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
    loadQuiz();
  }, [loadQuiz]);

  /* =======================================================
     SOCKET CONNECTION
  ======================================================= */

  const connectToRoom =
    useCallback(
      (roomId: string) => {
        if (!roomId) {
          setSocketStatus(
            "disconnected",
          );

          return;
        }

        const socketUrl =
          process.env
            .NEXT_PUBLIC_QUIZ_SOCKET_URL;

        if (!socketUrl) {
          setSocketStatus(
            "error",
          );

          setError(
            "Quiz Socket.IO URL is not configured. Add NEXT_PUBLIC_QUIZ_SOCKET_URL to .env.local.",
          );

          return;
        }

        if (
          socketRef.current
            ?.connected ||
          socketRef.current?.active
        ) {
          return;
        }

        setSocketStatus(
          "connecting",
        );

        manuallyClosedRef.current =
          false;

        try {
          const socket = io(
            socketUrl,
            {
              transports: [
                "websocket",
              ],

              autoConnect: false,

              query: {
                room_id: roomId,
                quiz_id: quizId,
              },
            },
          );

          socketRef.current =
            socket;

          /* =============================================
             CONNECT
          ============================================= */

          socket.on(
            "connect",
            () => {
              reconnectAttemptsRef.current =
                0;

              setSocketStatus(
                "connected",
              );

              setError("");

              socket.emit(
                SOCKET_JOIN_EVENT,
                {
                  room_id:
                    roomId,
                  quiz_id:
                    quizId,
                },
              );
            },
          );

          /* =============================================
             JOINED ROOM ACK
          ============================================= */

          socket.on(
            SOCKET_EVENTS.JOINED_ROOM_ACK,
            (
              payload: unknown,
            ) => {
              setLastSocketEvent(
                SOCKET_EVENTS.JOINED_ROOM_ACK,
              );

              setJoinedAck(
                true,
              );

              const data =
                unwrapSocketData(
                  payload,
                );

              const socketQuiz =
                data?.quiz ??
                data?.competition;

              const users =
                normalizeJoinedUsers(
                  getSocketValue(
                    payload,
                    [
                      "joined_users",
                      "joinedUsers",
                      "participants",
                      "players",
                      "users",
                    ],
                  ),
                );

              setQuiz(
                (
                  currentQuiz,
                ) => {
                  if (
                    !currentQuiz &&
                    !socketQuiz
                  ) {
                    return currentQuiz;
                  }

                  const mergedQuiz =
                    {
                      ...(currentQuiz ??
                        {}),
                      ...(socketQuiz ??
                        {}),
                    } as QuizCompetition;

                  if (users) {
                    mergedQuiz.joined_users =
                      users;
                  }

                  return mergedQuiz;
                },
              );
            },
          );

          /* =============================================
             PARTICIPANT JOINED ROOM
          ============================================= */

          socket.on(
            SOCKET_EVENTS.PARTICIPANT_JOINED_ROOM,
            (
              payload: unknown,
            ) => {
              setLastSocketEvent(
                SOCKET_EVENTS.PARTICIPANT_JOINED_ROOM,
              );

              const users =
                normalizeJoinedUsers(
                  getSocketValue(
                    payload,
                    [
                      "joined_users",
                      "joinedUsers",
                      "participants",
                      "players",
                      "users",
                    ],
                  ),
                );

              const participant =
                normalizeParticipant(
                  getSocketValue(
                    payload,
                    [
                      "participant",
                      "user",
                      "player",
                      "joined_user",
                    ],
                  ),
                );

              setQuiz(
                (
                  currentQuiz,
                ) => {
                  if (
                    !currentQuiz
                  ) {
                    return currentQuiz;
                  }

                  let nextUsers =
                    Array.isArray(
                      currentQuiz.joined_users,
                    )
                      ? currentQuiz.joined_users
                      : [];

                  if (users) {
                    nextUsers =
                      users;
                  } else if (
                    participant
                  ) {
                    nextUsers =
                      mergeParticipant(
                        nextUsers,
                        participant,
                      );
                  }

                  return {
                    ...currentQuiz,
                    joined_users:
                      nextUsers,
                  };
                },
              );
            },
          );

          /* =============================================
             ROUND STARTED
          ============================================= */

          socket.on(
            SOCKET_EVENTS.ROUND_STARTED,
            (
              payload: unknown,
            ) => {
              setLastSocketEvent(
                SOCKET_EVENTS.ROUND_STARTED,
              );

              const roundValue =
                getSocketValue(
                  payload,
                  [
                    "current_round",
                    "currentRound",
                    "round",
                    "round_number",
                    "roundNumber",
                  ],
                );

              const statusValue =
                getSocketValue(
                  payload,
                  [
                    "status",
                  ],
                );

              setQuiz(
                (
                  currentQuiz,
                ) => {
                  if (
                    !currentQuiz
                  ) {
                    return currentQuiz;
                  }

                  const updatedQuiz =
                    {
                      ...currentQuiz,
                    };

                  if (
                    roundValue !==
                    undefined
                  ) {
                    updatedQuiz.current_round =
                      Number(
                        roundValue,
                      );
                  }

                  if (
                    statusValue !==
                    undefined
                  ) {
                    updatedQuiz.status =
                      String(
                        statusValue,
                      );
                  } else {
                    updatedQuiz.status =
                      "LIVE";
                  }

                  return updatedQuiz;
                },
              );

              setTiebreakerQuestion(
                null,
              );
            },
          );

          /* =============================================
             LEADERBOARD UPDATED
          ============================================= */

          socket.on(
            SOCKET_EVENTS.LEADERBOARD_UPDATED,
            (
              payload: unknown,
            ) => {
              setLastSocketEvent(
                SOCKET_EVENTS.LEADERBOARD_UPDATED,
              );

              const leaderboardValue =
                getSocketValue(
                  payload,
                  [
                    "leaderboard",
                    "rankings",
                    "players",
                    "participants",
                    "data",
                  ],
                );

              const entries =
                normalizeLeaderboard(
                  leaderboardValue,
                );

              if (
                entries.length
              ) {
                setLeaderboard(
                  entries,
                );
              }
            },
          );

          /* =============================================
             TIEBREAKER QUESTION STARTED
          ============================================= */

          socket.on(
            SOCKET_EVENTS.TIEBREAKER_QUESTION_STARTED,
            (
              payload: unknown,
            ) => {
              setLastSocketEvent(
                SOCKET_EVENTS.TIEBREAKER_QUESTION_STARTED,
              );

              const questionValue =
                getSocketValue(
                  payload,
                  [
                    "question",
                    "tiebreakerQuestion",
                    "tiebreaker_question",
                  ],
                );

              if (
                questionValue &&
                typeof questionValue ===
                  "object"
              ) {
                setTiebreakerQuestion(
                  questionValue as TiebreakerQuestion,
                );
              } else if (
                typeof questionValue ===
                "string"
              ) {
                setTiebreakerQuestion(
                  {
                    question:
                      questionValue,
                  },
                );
              }

              setQuiz(
                (
                  currentQuiz,
                ) =>
                  currentQuiz
                    ? {
                        ...currentQuiz,
                        status:
                          "LIVE",
                        current_round:
                          Math.max(
                            Number(
                              currentQuiz.current_round ??
                                0,
                            ),
                            1,
                          ),
                      }
                    : currentQuiz,
              );
            },
          );

          /* =============================================
             PARTICIPANTS ELIMINATED
          ============================================= */

          socket.on(
            SOCKET_EVENTS.PARTICIPANTS_ELIMINATED,
            (
              payload: unknown,
            ) => {
              setLastSocketEvent(
                SOCKET_EVENTS.PARTICIPANTS_ELIMINATED,
              );

              const eliminatedValue =
                getSocketValue(
                  payload,
                  [
                    "eliminatedParticipants",
                    "eliminated_participants",
                    "eliminatedUsers",
                    "eliminated_users",
                    "participants",
                  ],
                );

              const eliminated =
                normalizeJoinedUsers(
                  eliminatedValue,
                );

              if (
                eliminated
              ) {
                setEliminatedPlayers(
                  eliminated,
                );
              }

              const remainingUsers =
                normalizeJoinedUsers(
                  getSocketValue(
                    payload,
                    [
                      "remainingParticipants",
                      "remaining_participants",
                      "remainingUsers",
                      "remaining_users",
                      "joined_users",
                    ],
                  ),
                );

              if (
                remainingUsers
              ) {
                setQuiz(
                  (
                    currentQuiz,
                  ) =>
                    currentQuiz
                      ? {
                          ...currentQuiz,
                          joined_users:
                            remainingUsers,
                        }
                      : currentQuiz,
                );
              }
            },
          );

          /* =============================================
             SOCKET ERROR
          ============================================= */

          socket.on(
            "connect_error",
            (
              socketError,
            ) => {
              console.error(
                "Quiz Socket.IO connection error:",
                socketError,
              );

              setSocketStatus(
                "error",
              );
            },
          );

          /* =============================================
             DISCONNECT
          ============================================= */

          socket.on(
            "disconnect",
            (
              reason,
            ) => {
              console.log(
                "Quiz Socket.IO disconnected:",
                reason,
              );

              socketRef.current =
                null;

              if (
                manuallyClosedRef.current
              ) {
                setSocketStatus(
                  "disconnected",
                );

                return;
              }

              setSocketStatus(
                "disconnected",
              );

              if (
                reconnectAttemptsRef.current <
                5
              ) {
                const attempt =
                  reconnectAttemptsRef.current;

                reconnectAttemptsRef.current +=
                  1;

                const delay =
                  Math.min(
                    1000 *
                      2 **
                        attempt,
                    10000,
                  );

                reconnectTimerRef.current =
                  setTimeout(
                    () => {
                      connectToRoom(
                        roomId,
                      );
                    },
                    delay,
                  );
              }
            },
          );

          socket.connect();
        } catch (
          socketError: any
        ) {
          console.error(
            "Unable to create Quiz Socket.IO connection:",
            socketError,
          );

          setSocketStatus(
            "error",
          );

          setError(
            socketError?.message ||
              "Unable to connect to the Quiz Board room.",
          );
        }
      },
      [quizId],
    );

  /* =======================================================
     CONNECT USING ROOM ID
  ======================================================= */

  useEffect(() => {
    const roomId =
      quiz?.room_id?.trim();

    if (!roomId) {
      return;
    }

    manuallyClosedRef.current =
      false;

    connectToRoom(roomId);

    return () => {
      manuallyClosedRef.current =
        true;

      if (
        reconnectTimerRef.current
      ) {
        clearTimeout(
          reconnectTimerRef.current,
        );

        reconnectTimerRef.current =
          null;
      }

      if (
        socketRef.current
      ) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current =
          null;
      }

      setSocketStatus(
        "disconnected",
      );
    };
  }, [
    quiz?.room_id,
    connectToRoom,
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

  const joinedUsers = useMemo(
    () =>
      Array.isArray(
        quiz?.joined_users,
      )
        ? quiz.joined_users
        : [],
    [quiz],
  );

  const maxPlayers = Number(
    quiz?.no_of_contestants ??
      20,
  );

  const joinedCount =
    joinedUsers.length;

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

  /*
   * ========================================================
   * EXACT CONDITIONS REQUESTED
   * ========================================================
   */

  const startTimestamp =
    quiz?.start_date
      ? new Date(
          quiz.start_date,
        ).getTime()
      : NaN;

  const hasValidStartTime =
    Number.isFinite(
      startTimestamp,
    );

  const isStartTimeReached =
    hasValidStartTime &&
    currentTime >=
      startTimestamp;

  const isContestantsFull =
    maxPlayers > 0 &&
    joinedCount >=
      maxPlayers;

  /*
   * This is the exact condition for the
   * student to enter the WAITING state.
   */
  const canBeWaiting =
    isStartTimeReached &&
    isContestantsFull;

  const currentRound = Number(
    quiz?.current_round ?? 0,
  );

  const totalRounds = Number(
    quiz?.number_of_rounds ?? 5,
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
      : "Lobby";

  const hasRoom = Boolean(
    quiz?.room_id,
  );

  const spotsLeft = Math.max(
    maxPlayers -
      joinedCount,
    0,
  );

  /* =======================================================
     NOT READY MESSAGE
  ======================================================= */

  const notReadyMessage =
    useMemo(() => {
      if (
        !isStartTimeReached &&
        !isContestantsFull
      ) {
        return `Waiting for ${spotsLeft} more contestant${
          spotsLeft === 1
            ? ""
            : "s"
        } and the scheduled start time.`;
      }

      if (!isContestantsFull) {
        return `Waiting for ${spotsLeft} more contestant${
          spotsLeft === 1
            ? ""
            : "s"
        } to join.`;
      }

      if (!isStartTimeReached) {
        return "All contestants have joined. Waiting for the scheduled start time.";
      }

      return "The competition is getting ready.";
    }, [
      isStartTimeReached,
      isContestantsFull,
      spotsLeft,
    ]);

  /* =======================================================
     ENTER COMPETITION
  ======================================================= */

  const handleEnterCompetition =
    () => {
      if (!quizId) {
        return;
      }

      router.push(
        `/student/quiz-board/${quizId}/play`,
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
              arena.
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
              Unable to Load Arena
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
     ARENA
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
            onClick={() =>
              router.push(
                "/student/quiz-board",
              )
            }
            className="text-slate-400 hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quiz Board
          </Button>

          <div className="flex items-center gap-2">
            {/* SOCKET STATUS */}

            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-2 ${
                socketStatus ===
                "connected"
                  ? "border-green-500/20 bg-green-500/10"
                  : socketStatus ===
                      "connecting"
                    ? "border-yellow-500/20 bg-yellow-500/10"
                    : "border-red-500/20 bg-red-500/10"
              }`}
            >
              {socketStatus ===
              "connected" ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />

                  <span className="text-xs font-semibold text-green-300">
                    Live
                  </span>
                </>
              ) : socketStatus ===
                "connecting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />

                  <span className="text-xs font-semibold text-yellow-300">
                    Connecting
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-400" />

                  <span className="text-xs font-semibold text-red-300">
                    Offline
                  </span>
                </>
              )}
            </div>

            {/* JOIN ACK */}

            {joinedAck && (
              <div className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 sm:flex">
                <CheckCircle2 className="h-4 w-4 text-green-400" />

                <span className="text-xs font-semibold text-green-300">
                  Room Joined
                </span>
              </div>
            )}

            {/* QUIZ STATUS */}

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
              <Radio className="h-4 w-4 text-blue-400" />

              <span className="text-xs font-semibold text-slate-300">
                {canBeWaiting
                  ? "Ready / Waiting"
                  : formatStatus(
                      quiz.status,
                    )}
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={
                handleRefresh
              }
              disabled={
                refreshing
              }
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

                {quiz.subject?.name && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
                    {quiz.subject.name}
                  </span>
                )}

                {hasRoom && (
                  <span className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                    <Wifi className="h-3.5 w-3.5" />
                    Room Connected
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

              {quiz.room_id && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <Radio className="h-3.5 w-3.5 text-blue-400" />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Room
                  </span>

                  <span className="font-mono text-xs font-bold text-slate-300">
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

        {/* REAL-TIME EVENT NOTICE */}

        {lastSocketEvent && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3">
            <Radio className="h-4 w-4 shrink-0 text-blue-400" />

            <span className="text-xs text-slate-400">
              Live event received:
            </span>

            <span className="font-mono text-xs font-bold text-blue-300">
              {lastSocketEvent}
            </span>
          </div>
        )}

        {/* =================================================
            TIEBREAKER
        ================================================= */}

        {tiebreakerQuestion && (
          <Card className="mb-6 border-yellow-500/20 bg-yellow-500/[0.06] p-5 shadow-none sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />

                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                    Tiebreaker Started
                  </span>
                </div>

                <h2 className="text-lg font-black text-white">
                  A tiebreaker question is now active
                </h2>

                {(
                  tiebreakerQuestion.question ||
                  tiebreakerQuestion.content ||
                  tiebreakerQuestion.text
                ) && (
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                    {tiebreakerQuestion.question ||
                      tiebreakerQuestion.content ||
                      tiebreakerQuestion.text}
                  </p>
                )}
              </div>

              <Button
                onClick={
                  handleEnterCompetition
                }
                className="shrink-0 bg-yellow-500 font-bold text-black hover:bg-yellow-400"
              >
                Continue
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* =================================================
            LOBBY
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
                  Students currently inside the arena
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
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
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
                    joinedUsers[
                      index
                    ];

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
                      key={
                        playerKey
                      }
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
                    Start Time
                  </span>

                  <span className="max-w-[170px] text-right text-xs font-semibold text-slate-300">
                    {formatStartDate(
                      quiz.start_date,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Players Ready
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
                    Start Time Reached
                  </span>

                  <span
                    className={`text-xs font-bold ${
                      isStartTimeReached
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {isStartTimeReached
                      ? "Yes"
                      : "Not Yet"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Room
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
                        Connected
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3.5 w-3.5" />
                        Waiting for room
                      </>
                    )}
                  </span>
                </div>
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
                elimination round.
              </p>
            </Card>
          </div>
        </section>

        {/* =================================================
            LEADERBOARD
        ================================================= */}

        {leaderboard.length >
          0 && (
          <section className="mt-6">
            <Card className="border-indigo-500/20 bg-indigo-500/[0.05] p-5 shadow-none sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />

                    <h2 className="font-bold text-white">
                      Live Leaderboard
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Updated in real time
                  </p>
                </div>

                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-300">
                  Live
                </span>
              </div>

              <div className="space-y-2">
                {leaderboard
                  .slice(0, 10)
                  .map(
                    (
                      player,
                      index,
                    ) => (
                      <div
                        key={`${player.id}-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-black text-slate-300">
                          {player.rank ??
                            index +
                              1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-200">
                            {player.name}
                          </p>

                          <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-slate-500">
                            {player.correctAnswers !==
                              undefined && (
                              <span>
                                Correct:{" "}
                                {
                                  player.correctAnswers
                                }
                              </span>
                            )}

                            {player.timeTakenInSeconds !==
                              undefined && (
                              <span>
                                Time:{" "}
                                {
                                  player.timeTakenInSeconds
                                }
                                s
                              </span>
                            )}
                          </div>
                        </div>

                        {player.score !==
                          undefined && (
                          <div className="text-right">
                            <p className="text-sm font-black text-blue-300">
                              {
                                player.score
                              }
                            </p>

                            <p className="text-[10px] text-slate-600">
                              points
                            </p>
                          </div>
                        )}
                      </div>
                    ),
                  )}
              </div>
            </Card>
          </section>
        )}

        {/* =================================================
            ELIMINATED PLAYERS
        ================================================= */}

        {eliminatedPlayers.length >
          0 && (
          <section className="mt-6">
            <Card className="border-red-500/20 bg-red-500/[0.05] p-5 shadow-none sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-red-400" />

                <h2 className="font-bold text-white">
                  Participants Eliminated
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {eliminatedPlayers.map(
                  (
                    player,
                    index,
                  ) => {
                    const name =
                      getUserName(
                        player,
                        index,
                      );

                    return (
                      <span
                        key={
                          getEntityId(
                            player,
                          ) ||
                          `eliminated-${index}`
                        }
                        className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300"
                      >
                        {name}
                      </span>
                    );
                  },
                )}
              </div>
            </Card>
          </section>
        )}

        {/* =================================================
            WAITING / NOT READY / LIVE / COMPLETED
        ================================================= */}

        <section className="mt-6">
          {/* =================================================
              NOT READY
              
              IMPORTANT:
              This is used whenever EITHER:
              - start time has NOT been reached
              - contestant capacity has NOT been reached
              
              The student therefore CANNOT be in WAITING yet.
          ================================================= */}

          {status ===
            "not_ready" && (
            <Card className="border-yellow-500/20 bg-yellow-500/[0.06] p-6 text-center shadow-none sm:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                {isContestantsFull &&
                !isStartTimeReached ? (
                  <Clock3 className="h-8 w-8 text-yellow-400" />
                ) : (
                  <Users className="h-8 w-8 text-yellow-400" />
                )}
              </div>

              <h2 className="text-2xl font-black text-white">
                Competition Not Ready
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                The competition will enter the
                waiting state only when the
                scheduled start time has been
                reached and all required
                contestants have joined.
              </p>

              {/* REQUIREMENTS */}

              <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
                {/* PLAYERS */}

                <div
                  className={`rounded-2xl border p-4 ${
                    isContestantsFull
                      ? "border-green-500/20 bg-green-500/10"
                      : "border-yellow-500/20 bg-yellow-500/10"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users
                      className={`h-4 w-4 ${
                        isContestantsFull
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    />

                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Contestants
                    </span>
                  </div>

                  <div className="mt-2">
                    <span
                      className={`text-2xl font-black ${
                        isContestantsFull
                          ? "text-green-300"
                          : "text-yellow-300"
                      }`}
                    >
                      {joinedCount}
                    </span>

                    <span className="text-sm text-slate-500">
                      {" "}
                      /{" "}
                      {maxPlayers}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {isContestantsFull
                      ? "All contestant spots are filled."
                      : `${spotsLeft} more contestant${
                          spotsLeft ===
                          1
                            ? ""
                            : "s"
                        } required.`}
                  </p>
                </div>

                {/* START TIME */}

                <div
                  className={`rounded-2xl border p-4 ${
                    isStartTimeReached
                      ? "border-green-500/20 bg-green-500/10"
                      : "border-yellow-500/20 bg-yellow-500/10"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock3
                      className={`h-4 w-4 ${
                        isStartTimeReached
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    />

                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Scheduled Time
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-black text-white">
                    {formatStartDate(
                      quiz.start_date,
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {isStartTimeReached
                      ? "Scheduled start time has been reached."
                      : "Scheduled start time has not been reached."}
                  </p>
                </div>
              </div>

              {/* EXACT CURRENT REASON */}

              <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-sm font-semibold text-slate-300">
                  {notReadyMessage}
                </p>
              </div>

              {/* SOCKET */}

              <div className="mt-5 flex justify-center">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                    socketStatus ===
                    "connected"
                      ? "border-green-500/20 bg-green-500/10 text-green-300"
                      : socketStatus ===
                          "connecting"
                        ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                        : "border-red-500/20 bg-red-500/10 text-red-300"
                  }`}
                >
                  {socketStatus ===
                  "connected" ? (
                    <>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                      Live room connection active
                    </>
                  ) : socketStatus ===
                    "connecting" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />

                      Connecting to room...
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3.5 w-3.5" />

                      Room connection unavailable
                    </>
                  )}
                </div>
              </div>

              {/* LEAVE */}

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() =>
                    router.push(
                      "/student/quiz-board",
                    )
                  }
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />

                  Leave Arena
                </Button>
              </div>
            </Card>
          )}

          {/* =================================================
              WAITING

              This block can NEVER render unless:
              
              isStartTimeReached === true
              AND
              isContestantsFull === true
          ================================================= */}

          {status === "waiting" &&
            canBeWaiting && (
              <Card className="border-blue-500/20 bg-blue-500/[0.06] p-6 text-center shadow-none sm:p-8">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>

                <h2 className="text-2xl font-black text-white">
                  Waiting for Competition to Start
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  All required contestants are
                  present and the scheduled start
                  time has been reached. The
                  competition is ready to begin.
                </p>

                {/* SOCKET */}

                <div className="mt-5 flex justify-center">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                      socketStatus ===
                      "connected"
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : socketStatus ===
                            "connecting"
                          ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
                          : "border-red-500/20 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {socketStatus ===
                    "connected" ? (
                      <>
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                        Live room connection active
                      </>
                    ) : socketStatus ===
                      "connecting" ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />

                        Connecting to room...
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3.5 w-3.5" />

                        Waiting for room connection...
                      </>
                    )}
                  </div>
                </div>

                {/* PLAYER COUNTS */}

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
                </div>

                {/* REQUIREMENTS COMPLETE */}

                <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Contestants full
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Start time reached
                  </span>
                </div>

                {/* LEAVE */}

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={() =>
                      router.push(
                        "/student/quiz-board",
                      )
                    }
                    variant="outline"
                    className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />

                    Leave Arena
                  </Button>
                </div>
              </Card>
            )}

          {/* =================================================
              LIVE
          ================================================= */}

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
                The competition is currently in
                progress.
              </p>

              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-300">
                  <Wifi className="h-3.5 w-3.5" />
                  Live room connection active
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

                  Continue Competition
                </Button>
              </div>
            </Card>
          )}

          {/* =================================================
              COMPLETED
          ================================================= */}

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
                This Quiz Board competition has
                ended.
              </p>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() =>
                    router.push(
                      "/student/quiz-board",
                    )
                  }
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
              {socketStatus ===
              "connected" ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-green-500" />

                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" />

                  Disconnected
                </>
              )}
            </span>

            <span>
              Round{" "}
              {Math.max(
                currentRound,
                0,
              )}{" "}
              / {totalRounds}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}





















// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { io, Socket } from "socket.io-client";
// import {
//   ArrowLeft,
//   CheckCircle2,
//   Clock3,
//   Crown,
//   Loader2,
//   LogOut,
//   Medal,
//   MessageCircle,
//   Radio,
//   Shield,
//   Sparkles,
//   Trophy,
//   Users,
//   Wifi,
//   WifiOff,
//   Zap,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { getQuizById } from "@/lib/api/quizCompetition";

// /* =========================================================
//    TYPES
// ========================================================= */

// type QuizSubject = {
//   _id?: string;
//   name?: string;
// };

// type DifficultyBreakdown = {
//   easy?: number;
//   medium?: number;
//   hard?: number;
// };

// type QuizRound = {
//   round?: number;
//   round_number?: number;
//   no_of_questions?: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   exit_number?: number;
//   exit_reward?: number;
// };

// type FinalRoundInformation = {
//   no_of_questions?: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   first_position_reward?: number;
//   second_position_reward?: number;
// };

// type JoinedUser = {
//   _id?: string;
//   id?: string;
//   userId?: string;
//   name?: string;
//   username?: string;
//   fullName?: string;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
// };

// type QuizCompetition = {
//   _id: string;
//   quiz_title?: string;
//   description?: string;
//   status?: string;
//   subject?: QuizSubject | null;
//   time_per_question?: number;
//   start_date?: string;
//   no_of_contestants?: number;
//   number_of_rounds?: number;
//   round_information?: QuizRound[];
//   final_round_information?: FinalRoundInformation;
//   current_round?: number;
//   room_id?: string | null;
//   joined_users?: JoinedUser[];
// };

// type QuizApiResponse = {
//   success?: boolean;
//   message?: string;
//   data?: QuizCompetition | { quiz?: QuizCompetition };
// };

// type LobbyStatus =
//   | "loading"
//   | "waiting"
//   | "ready"
//   | "live"
//   | "completed"
//   | "error";

// type SocketStatus =
//   | "disconnected"
//   | "connecting"
//   | "connected"
//   | "error";

// type LeaderboardEntry = {
//   id: string;
//   name: string;
//   rank?: number;
//   score?: number;
//   correctAnswers?: number;
//   wrongAnswers?: number;
//   unansweredQuestions?: number;
//   timeTakenInSeconds?: number;
//   [key: string]: unknown;
// };

// type TiebreakerQuestion = {
//   id?: string;
//   _id?: string;
//   question?: string;
//   content?: string;
//   text?: string;
//   options?: unknown[];
//   [key: string]: unknown;
// };

// /* =========================================================
//    SOCKET EVENT NAMES
// ========================================================= */

// /**
//  * These names MUST match the backend emissions.
//  */
// const SOCKET_EVENTS = {
//   PARTICIPANT_JOINED_ROOM: "participant_joined_room",
//   ROUND_STARTED: "round_started",
//   LEADERBOARD_UPDATED: "leaderboard_updated",
//   TIEBREAKER_QUESTION_STARTED:
//     "tiebreaker_question_started",
//   PARTICIPANTS_ELIMINATED:
//     "participants_eliminated",
//   JOINED_ROOM_ACK: "joined_room_ack",
// };

// /**
//  * This is the event we emit to tell the backend
//  * that this socket wants to join the room.
//  *
//  * If your backend developer gives you a different
//  * event name, change ONLY this constant.
//  */
// const SOCKET_JOIN_EVENT = "join_room";

// /* =========================================================
//    HELPERS
// ========================================================= */

// function extractQuiz(
//   response: QuizApiResponse | QuizCompetition,
// ): QuizCompetition | null {
//   if (!response) return null;

//   if ("_id" in response) {
//     return response;
//   }

//   const data = response.data;

//   if (!data) return null;

//   if ("_id" in data) {
//     return data;
//   }

//   return data.quiz ?? null;
// }

// function getUserName(
//   user: JoinedUser,
//   index: number,
// ) {
//   if (user.fullName) return user.fullName;

//   if (user.name) return user.name;

//   if (user.username) return user.username;

//   const combinedName = `${user.firstName ?? ""} ${
//     user.lastName ?? ""
//   }`.trim();

//   if (combinedName) return combinedName;

//   return `Player ${index + 1}`;
// }

// function getUserInitials(name: string) {
//   const parts = name.trim().split(/\s+/);

//   if (parts.length === 1) {
//     return parts[0]
//       .slice(0, 2)
//       .toUpperCase();
//   }

//   return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
// }

// function getTotalQuestions(
//   quiz: QuizCompetition,
// ) {
//   const eliminationQuestions =
//     quiz.round_information?.reduce(
//       (total, round) =>
//         total +
//         Number(round.no_of_questions ?? 0),
//       0,
//     ) ?? 0;

//   const finalQuestions = Number(
//     quiz.final_round_information
//       ?.no_of_questions ?? 0,
//   );

//   return eliminationQuestions + finalQuestions;
// }

// function getQualificationSequence(
//   quiz: QuizCompetition,
// ) {
//   const contestants = Number(
//     quiz.no_of_contestants ?? 20,
//   );

//   const sequence = [contestants];

//   const rounds = quiz.round_information ?? [];

//   rounds.forEach((round) => {
//     const exitNumber = Number(
//       round.exit_number ?? 0,
//     );

//     if (
//       exitNumber > 0 &&
//       exitNumber <
//         sequence[sequence.length - 1]
//     ) {
//       sequence.push(exitNumber);
//     }
//   });

//   if (
//     !sequence.includes(2) &&
//     contestants >= 2
//   ) {
//     sequence.push(2);
//   }

//   if (!sequence.includes(1)) {
//     sequence.push(1);
//   }

//   return sequence;
// }

// function getRoundLabel(
//   currentRound: number,
//   quiz: QuizCompetition,
// ) {
//   const totalRounds = Number(
//     quiz.number_of_rounds ?? 0,
//   );

//   if (
//     currentRound >= totalRounds &&
//     totalRounds > 0
//   ) {
//     return "Final Round";
//   }

//   if (currentRound <= 0) {
//     return "Lobby";
//   }

//   return `Round ${currentRound}`;
// }

// function formatStartDate(date?: string) {
//   if (!date) {
//     return "Start time not announced";
//   }

//   const parsed = new Date(date);

//   if (Number.isNaN(parsed.getTime())) {
//     return "Start time not announced";
//   }

//   return parsed.toLocaleString("en-NG", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// function formatStatus(status?: string) {
//   return String(status ?? "DRAFT")
//     .replace(/_/g, " ")
//     .toLowerCase()
//     .replace(
//       /\b\w/g,
//       (letter) => letter.toUpperCase(),
//     );
// }

// /* =========================================================
//    SOCKET DATA HELPERS
// ========================================================= */

// function unwrapSocketData(
//   payload: unknown,
// ): any {
//   if (
//     !payload ||
//     typeof payload !== "object"
//   ) {
//     return {};
//   }

//   const value = payload as any;

//   if (
//     value.data &&
//     typeof value.data === "object"
//   ) {
//     return value.data;
//   }

//   return value;
// }

// function getSocketValue(
//   payload: unknown,
//   keys: string[],
// ): unknown {
//   const root = unwrapSocketData(payload);

//   for (const key of keys) {
//     if (
//       root &&
//       root[key] !== undefined
//     ) {
//       return root[key];
//     }
//   }

//   if (
//     root?.data &&
//     typeof root.data === "object"
//   ) {
//     for (const key of keys) {
//       if (
//         root.data[key] !== undefined
//       ) {
//         return root.data[key];
//       }
//     }
//   }

//   return undefined;
// }

// function normalizeJoinedUsers(
//   value: unknown,
// ): JoinedUser[] | null {
//   if (!Array.isArray(value)) {
//     return null;
//   }

//   return value.map(
//     (player: any, index) => {
//       if (
//         player &&
//         typeof player === "object"
//       ) {
//         return {
//           ...player,
//         };
//       }

//       return {
//         id: String(
//           player ?? index,
//         ),
//         name: `Player ${index + 1}`,
//       };
//     },
//   );
// }

// function normalizeParticipant(
//   value: unknown,
// ): JoinedUser | null {
//   if (
//     !value ||
//     typeof value !== "object"
//   ) {
//     return null;
//   }

//   return {
//     ...(value as JoinedUser),
//   };
// }

// function getEntityId(
//   entity: JoinedUser,
// ) {
//   return (
//     entity._id ||
//     entity.id ||
//     entity.userId ||
//     ""
//   );
// }

// function mergeParticipant(
//   users: JoinedUser[],
//   participant: JoinedUser,
// ) {
//   const participantId =
//     getEntityId(participant);

//   if (!participantId) {
//     return [
//       ...users,
//       participant,
//     ];
//   }

//   const exists = users.some(
//     (user) =>
//       getEntityId(user) ===
//       participantId,
//   );

//   if (exists) {
//     return users.map((user) =>
//       getEntityId(user) ===
//       participantId
//         ? {
//             ...user,
//             ...participant,
//           }
//         : user,
//     );
//   }

//   return [...users, participant];
// }

// function normalizeLeaderboard(
//   value: unknown,
// ): LeaderboardEntry[] {
//   if (!Array.isArray(value)) {
//     return [];
//   }

//   return value.map(
//     (entry: any, index) => {
//       const participant =
//         entry?.user ??
//         entry?.participant ??
//         entry;

//       const name =
//         participant?.fullName ||
//         participant?.name ||
//         participant?.username ||
//         `${participant?.firstName ?? ""} ${
//           participant?.lastName ?? ""
//         }`.trim() ||
//         `Player ${index + 1}`;

//       const id = String(
//         participant?._id ||
//           participant?.id ||
//           participant?.userId ||
//           entry?._id ||
//           entry?.id ||
//           index,
//       );

//       return {
//         ...entry,
//         id,
//         name,
//         rank:
//           Number(
//             entry?.rank ??
//               entry?.position ??
//               index + 1,
//           ) || index + 1,
//         score:
//           entry?.score !== undefined
//             ? Number(entry.score)
//             : entry?.totalScore !== undefined
//               ? Number(entry.totalScore)
//               : undefined,
//         correctAnswers:
//           entry?.correctAnswers !==
//           undefined
//             ? Number(
//                 entry.correctAnswers,
//               )
//             : undefined,
//         wrongAnswers:
//           entry?.wrongAnswers !==
//           undefined
//             ? Number(
//                 entry.wrongAnswers,
//               )
//             : undefined,
//         unansweredQuestions:
//           entry?.unansweredQuestions !==
//           undefined
//             ? Number(
//                 entry.unansweredQuestions,
//               )
//             : undefined,
//         timeTakenInSeconds:
//           entry?.timeTakenInSeconds !==
//           undefined
//             ? Number(
//                 entry.timeTakenInSeconds,
//               )
//             : undefined,
//       };
//     },
//   );
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// export default function QuizBoardWaitingRoomPage() {
//   const router = useRouter();
//   const params = useParams();

//   const quizId =
//     typeof params?.quizId === "string"
//       ? params.quizId
//       : Array.isArray(params?.quizId)
//         ? params.quizId[0]
//         : "";

//   const [quiz, setQuiz] =
//     useState<QuizCompetition | null>(
//       null,
//     );

//   const [status, setStatus] =
//     useState<LobbyStatus>("loading");

//   const [socketStatus, setSocketStatus] =
//     useState<SocketStatus>(
//       "disconnected",
//     );

//   const [error, setError] =
//     useState("");

//   const [refreshing, setRefreshing] =
//     useState(false);

//   const [joinedAck, setJoinedAck] =
//     useState(false);

//   const [leaderboard, setLeaderboard] =
//     useState<LeaderboardEntry[]>([]);

//   const [
//     eliminatedPlayers,
//     setEliminatedPlayers,
//   ] = useState<JoinedUser[]>([]);

//   const [
//     tiebreakerQuestion,
//     setTiebreakerQuestion,
//   ] =
//     useState<TiebreakerQuestion | null>(
//       null,
//     );

//   const [lastSocketEvent, setLastSocketEvent] =
//     useState("");

//   const socketRef =
//     useRef<Socket | null>(null);

//   const reconnectTimerRef =
//     useRef<ReturnType<
//       typeof setTimeout
//     > | null>(null);

//   const reconnectAttemptsRef =
//     useRef(0);

//   const manuallyClosedRef =
//     useRef(false);

//   /* =======================================================
//      UPDATE LOBBY STATE
//   ======================================================= */

//   const updateLobbyStatus =
//     useCallback(
//       (nextQuiz: QuizCompetition) => {
//         const nextCompetitionStatus =
//           String(
//             nextQuiz.status ?? "",
//           ).toUpperCase();

//         const currentRound =
//           Number(
//             nextQuiz.current_round ?? 0,
//           );

//         const totalRounds =
//           Number(
//             nextQuiz.number_of_rounds ??
//               0,
//           );

//         if (
//           nextCompetitionStatus ===
//           "COMPLETED"
//         ) {
//           setStatus("completed");
//           return;
//         }

//         if (
//           currentRound > 0 &&
//           totalRounds > 0 &&
//           currentRound <= totalRounds
//         ) {
//           setStatus("live");
//           return;
//         }

//         const joinedCount =
//           Array.isArray(
//             nextQuiz.joined_users,
//           )
//             ? nextQuiz.joined_users.length
//             : 0;

//         const maxPlayers =
//           Number(
//             nextQuiz.no_of_contestants ??
//               20,
//           );

//         if (
//           joinedCount >= maxPlayers
//         ) {
//           setStatus("ready");
//         } else {
//           setStatus("waiting");
//         }
//       },
//       [],
//     );

//   /* =======================================================
//      LOAD QUIZ
//   ======================================================= */

//   const loadQuiz = useCallback(
//     async (silent = false) => {
//       if (!quizId) {
//         setError(
//           "Competition ID is missing.",
//         );

//         setStatus("error");

//         return;
//       }

//       if (silent) {
//         setRefreshing(true);
//       } else {
//         setStatus("loading");
//       }

//       setError("");

//       try {
//         const response =
//           await getQuizById(quizId);

//         const nextQuiz =
//           extractQuiz(response);

//         if (!nextQuiz) {
//           throw new Error(
//             response?.message ||
//               "Unable to load this competition.",
//           );
//         }

//         setQuiz(nextQuiz);

//         updateLobbyStatus(
//           nextQuiz,
//         );
//       } catch (err: any) {
//         setError(
//           err?.response?.data
//             ?.message ||
//             err?.message ||
//             "Unable to load the competition.",
//         );

//         setStatus("error");
//       } finally {
//         setRefreshing(false);
//       }
//     },
//     [
//       quizId,
//       updateLobbyStatus,
//     ],
//   );

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     loadQuiz();
//   }, [loadQuiz]);

//   /* =======================================================
//      SOCKET CONNECTION
//   ======================================================= */

//   const connectToRoom =
//     useCallback(
//       (roomId: string) => {
//         if (!roomId) {
//           setSocketStatus(
//             "disconnected",
//           );
//           return;
//         }

//         const socketUrl =
//           process.env
//             .NEXT_PUBLIC_QUIZ_SOCKET_URL;

//         if (!socketUrl) {
//           setSocketStatus("error");

//           setError(
//             "Quiz Socket.IO URL is not configured. Add NEXT_PUBLIC_QUIZ_SOCKET_URL to .env.local.",
//           );

//           return;
//         }

//         if (
//           socketRef.current?.connected ||
//           socketRef.current?.active
//         ) {
//           return;
//         }

//         setSocketStatus("connecting");

//         manuallyClosedRef.current =
//           false;

//         try {
//           const socket = io(
//             socketUrl,
//             {
//               transports: [
//                 "websocket",
//               ],
//               autoConnect: false,

//               /*
//                * These values are sent during
//                * the Socket.IO handshake.
//                *
//                * The backend must support these
//                * query values if it wants to
//                * read them from handshake.query.
//                */
//               query: {
//                 room_id: roomId,
//                 quiz_id: quizId,
//               },
//             },
//           );

//           socketRef.current =
//             socket;

//           /* =============================================
//              CONNECT
//           ============================================= */

//           socket.on(
//             "connect",
//             () => {
//               reconnectAttemptsRef.current =
//                 0;

//               setSocketStatus(
//                 "connected",
//               );

//               setError("");

//               /*
//                * Tell backend that this student
//                * wants to join this room.
//                *
//                * If backend uses another event name,
//                * change SOCKET_JOIN_EVENT above.
//                */
//               socket.emit(
//                 SOCKET_JOIN_EVENT,
//                 {
//                   room_id: roomId,
//                   quiz_id: quizId,
//                 },
//               );
//             },
//           );

//           /* =============================================
//              JOINED ROOM ACK
//           ============================================= */

//           socket.on(
//             SOCKET_EVENTS.JOINED_ROOM_ACK,
//             (payload: unknown) => {
//               setLastSocketEvent(
//                 SOCKET_EVENTS.JOINED_ROOM_ACK,
//               );

//               setJoinedAck(true);

//               const data =
//                 unwrapSocketData(
//                   payload,
//                 );

//               const socketQuiz =
//                 data?.quiz ??
//                 data?.competition;

//               if (
//                 socketQuiz &&
//                 typeof socketQuiz ===
//                   "object"
//               ) {
//                 setQuiz(
//                   (
//                     currentQuiz,
//                   ) => {
//                     const merged =
//                       {
//                         ...(currentQuiz ??
//                           {}),
//                         ...socketQuiz,
//                       } as QuizCompetition;

//                     updateLobbyStatus(
//                       merged,
//                     );

//                     return merged;
//                   },
//                 );
//               }

//               const users =
//                 normalizeJoinedUsers(
//                   getSocketValue(
//                     payload,
//                     [
//                       "joined_users",
//                       "joinedUsers",
//                       "participants",
//                       "players",
//                       "users",
//                     ],
//                   ),
//                 );

//               if (users) {
//                 setQuiz(
//                   (
//                     currentQuiz,
//                   ) =>
//                     currentQuiz
//                       ? {
//                           ...currentQuiz,
//                           joined_users:
//                             users,
//                         }
//                       : currentQuiz,
//                 );
//               }
//             },
//           );

//           /* =============================================
//              PARTICIPANT JOINED ROOM
//           ============================================= */

//           socket.on(
//             SOCKET_EVENTS.PARTICIPANT_JOINED_ROOM,
//             (payload: unknown) => {
//               setLastSocketEvent(
//                 SOCKET_EVENTS.PARTICIPANT_JOINED_ROOM,
//               );

//               const users =
//                 normalizeJoinedUsers(
//                   getSocketValue(
//                     payload,
//                     [
//                       "joined_users",
//                       "joinedUsers",
//                       "participants",
//                       "players",
//                       "users",
//                     ],
//                   ),
//                 );

//               const participant =
//                 normalizeParticipant(
//                   getSocketValue(
//                     payload,
//                     [
//                       "participant",
//                       "user",
//                       "player",
//                       "joined_user",
//                     ],
//                   ),
//                 );

//               setQuiz(
//                 (currentQuiz) => {
//                   if (!currentQuiz) {
//                     return currentQuiz;
//                   }

//                   let nextUsers =
//                     Array.isArray(
//                       currentQuiz.joined_users,
//                     )
//                       ? currentQuiz.joined_users
//                       : [];

//                   if (users) {
//                     nextUsers = users;
//                   } else if (
//                     participant
//                   ) {
//                     nextUsers =
//                       mergeParticipant(
//                         nextUsers,
//                         participant,
//                       );
//                   }

//                   const updatedQuiz =
//                     {
//                       ...currentQuiz,
//                       joined_users:
//                         nextUsers,
//                     };

//                   updateLobbyStatus(
//                     updatedQuiz,
//                   );

//                   return updatedQuiz;
//                 },
//               );
//             },
//           );

//           /* =============================================
//              ROUND STARTED
//           ============================================= */

//           socket.on(
//             SOCKET_EVENTS.ROUND_STARTED,
//             (payload: unknown) => {
//               setLastSocketEvent(
//                 SOCKET_EVENTS.ROUND_STARTED,
//               );

//               const roundValue =
//                 getSocketValue(
//                   payload,
//                   [
//                     "current_round",
//                     "currentRound",
//                     "round",
//                     "round_number",
//                     "roundNumber",
//                   ],
//                 );

//               const statusValue =
//                 getSocketValue(
//                   payload,
//                   [
//                     "status",
//                   ],
//                 );

//               setQuiz(
//                 (currentQuiz) => {
//                   if (!currentQuiz) {
//                     return currentQuiz;
//                   }

//                   const updatedQuiz =
//                     {
//                       ...currentQuiz,
//                     };

//                   if (
//                     roundValue !==
//                     undefined
//                   ) {
//                     updatedQuiz.current_round =
//                       Number(
//                         roundValue,
//                       );
//                   }

//                   if (
//                     statusValue !==
//                     undefined
//                   ) {
//                     updatedQuiz.status =
//                       String(
//                         statusValue,
//                       );
//                   }

//                   return updatedQuiz;
//                 },
//               );

//               setTiebreakerQuestion(
//                 null,
//               );

//               setStatus("live");
//             },
//           );

//           /* =============================================
//              LEADERBOARD UPDATED
//           ============================================= */

//           socket.on(
//             SOCKET_EVENTS.LEADERBOARD_UPDATED,
//             (payload: unknown) => {
//               setLastSocketEvent(
//                 SOCKET_EVENTS.LEADERBOARD_UPDATED,
//               );

//               const leaderboardValue =
//                 getSocketValue(
//                   payload,
//                   [
//                     "leaderboard",
//                     "rankings",
//                     "players",
//                     "participants",
//                     "data",
//                   ],
//                 );

//               const entries =
//                 normalizeLeaderboard(
//                   leaderboardValue,
//                 );

//               if (entries.length) {
//                 setLeaderboard(
//                   entries,
//                 );
//               }
//             },
//           );

//           /* =============================================
//              TIEBREAKER QUESTION STARTED
//           ============================================= */

//           socket.on(
//             SOCKET_EVENTS.TIEBREAKER_QUESTION_STARTED,
//             (payload: unknown) => {
//               setLastSocketEvent(
//                 SOCKET_EVENTS.TIEBREAKER_QUESTION_STARTED,
//               );

//               const questionValue =
//                 getSocketValue(
//                   payload,
//                   [
//                     "question",
//                     "tiebreakerQuestion",
//                     "tiebreaker_question",
//                   ],
//                 );

//               if (
//                 questionValue &&
//                 typeof questionValue ===
//                   "object"
//               ) {
//                 setTiebreakerQuestion(
//                   questionValue as TiebreakerQuestion,
//                 );
//               } else if (
//                 typeof questionValue ===
//                 "string"
//               ) {
//                 setTiebreakerQuestion(
//                   {
//                     question:
//                       questionValue,
//                   },
//                 );
//               }

//               setStatus("live");
//             },
//           );

//           /* =============================================
//              PARTICIPANTS ELIMINATED
//           ============================================= */

//           socket.on(
//             SOCKET_EVENTS.PARTICIPANTS_ELIMINATED,
//             (payload: unknown) => {
//               setLastSocketEvent(
//                 SOCKET_EVENTS.PARTICIPANTS_ELIMINATED,
//               );

//               const eliminatedValue =
//                 getSocketValue(
//                   payload,
//                   [
//                     "eliminatedParticipants",
//                     "eliminated_participants",
//                     "eliminatedUsers",
//                     "eliminated_users",
//                     "participants",
//                   ],
//                 );

//               const eliminated =
//                 normalizeJoinedUsers(
//                   eliminatedValue,
//                 );

//               if (eliminated) {
//                 setEliminatedPlayers(
//                   eliminated,
//                 );
//               }

//               /*
//                * If backend also sends the
//                * remaining participants, use
//                * that to keep the lobby accurate.
//                */
//               const remainingUsers =
//                 normalizeJoinedUsers(
//                   getSocketValue(
//                     payload,
//                     [
//                       "remainingParticipants",
//                       "remaining_participants",
//                       "remainingUsers",
//                       "remaining_users",
//                       "joined_users",
//                     ],
//                   ),
//                 );

//               if (remainingUsers) {
//                 setQuiz(
//                   (
//                     currentQuiz,
//                   ) =>
//                     currentQuiz
//                       ? {
//                           ...currentQuiz,
//                           joined_users:
//                             remainingUsers,
//                         }
//                       : currentQuiz,
//                 );
//               }
//             },
//           );

//           /* =============================================
//              SOCKET ERROR
//           ============================================= */

//           socket.on(
//             "connect_error",
//             (socketError) => {
//               console.error(
//                 "Quiz Socket.IO connection error:",
//                 socketError,
//               );

//               setSocketStatus("error");
//             },
//           );

//           /* =============================================
//              DISCONNECT
//           ============================================= */

//           socket.on(
//             "disconnect",
//             (reason) => {
//               console.log(
//                 "Quiz Socket.IO disconnected:",
//                 reason,
//               );

//               socketRef.current =
//                 null;

//               if (
//                 manuallyClosedRef.current
//               ) {
//                 setSocketStatus(
//                   "disconnected",
//                 );
//                 return;
//               }

//               setSocketStatus(
//                 "disconnected",
//               );

//               if (
//                 reconnectAttemptsRef.current <
//                 5
//               ) {
//                 const attempt =
//                   reconnectAttemptsRef.current;

//                 reconnectAttemptsRef.current +=
//                   1;

//                 const delay =
//                   Math.min(
//                     1000 *
//                       2 **
//                         attempt,
//                     10000,
//                   );

//                 reconnectTimerRef.current =
//                   setTimeout(
//                     () => {
//                       connectToRoom(
//                         roomId,
//                       );
//                     },
//                     delay,
//                   );
//               }
//             },
//           );

//           socket.connect();
//         } catch (socketError: any) {
//           console.error(
//             "Unable to create Quiz Socket.IO connection:",
//             socketError,
//           );

//           setSocketStatus("error");

//           setError(
//             socketError?.message ||
//               "Unable to connect to the Quiz Board room.",
//           );
//         }
//       },
//       [quizId, updateLobbyStatus],
//     );

//   /* =======================================================
//      CONNECT USING ROOM ID
//   ======================================================= */

//   useEffect(() => {
//     const roomId =
//       quiz?.room_id?.trim();

//     if (!roomId) {
//       return;
//     }

//     manuallyClosedRef.current =
//       false;

//     connectToRoom(roomId);

//     return () => {
//       manuallyClosedRef.current =
//         true;

//       if (
//         reconnectTimerRef.current
//       ) {
//         clearTimeout(
//           reconnectTimerRef.current,
//         );

//         reconnectTimerRef.current =
//           null;
//       }

//       if (socketRef.current) {
//         socketRef.current.removeAllListeners();
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }

//       setSocketStatus(
//         "disconnected",
//       );
//     };
//   }, [
//     quiz?.room_id,
//     connectToRoom,
//   ]);

//   /* =======================================================
//      MANUAL REFRESH
//   ======================================================= */

//   const handleRefresh = async () => {
//     await loadQuiz(true);
//   };

//   /* =======================================================
//      DERIVED DATA
//   ======================================================= */

//   const joinedUsers = useMemo(
//     () =>
//       Array.isArray(
//         quiz?.joined_users,
//       )
//         ? quiz.joined_users
//         : [],
//     [quiz],
//   );

//   const maxPlayers = Number(
//     quiz?.no_of_contestants ?? 20,
//   );

//   const joinedCount =
//     joinedUsers.length;

//   const playerPercentage =
//     maxPlayers > 0
//       ? Math.min(
//           100,
//           Math.round(
//             (joinedCount /
//               maxPlayers) *
//               100,
//           ),
//         )
//       : 0;

//   const currentRound = Number(
//     quiz?.current_round ?? 0,
//   );

//   const totalRounds = Number(
//     quiz?.number_of_rounds ?? 5,
//   );

//   const totalQuestions = quiz
//     ? getTotalQuestions(quiz)
//     : 0;

//   const qualificationSequence =
//     quiz
//       ? getQualificationSequence(
//           quiz,
//         )
//       : [20, 15, 10, 5, 2, 1];

//   const currentRoundName = quiz
//     ? getRoundLabel(
//         currentRound,
//         quiz,
//       )
//     : "Lobby";

//   const hasRoom =
//     Boolean(quiz?.room_id);

//   /* =======================================================
//      ENTER COMPETITION
//   ======================================================= */

//   const handleEnterCompetition =
//     () => {
//       if (!quizId) return;

//       router.push(
//         `/student/quiz-board/${quizId}/play`,
//       );
//     };

//   /* =======================================================
//      LOADING
//   ======================================================= */

//   if (
//     status === "loading" ||
//     !quiz
//   ) {
//     return (
//       <main className="min-h-screen bg-slate-950 text-white">
//         <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
//           <div className="text-center">
//             <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-400" />

//             <h1 className="text-lg font-bold text-white">
//               Loading Quiz Board...
//             </h1>

//             <p className="mt-2 text-sm text-slate-400">
//               Preparing your competition arena.
//             </p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /* =======================================================
//      ERROR
//   ======================================================= */

//   if (status === "error") {
//     return (
//       <main className="min-h-screen bg-slate-950 text-white">
//         <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
//           <Card className="w-full border-red-500/20 bg-white/[0.04] p-8 text-center shadow-none">
//             <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
//               <Shield className="h-7 w-7 text-red-400" />
//             </div>

//             <h1 className="text-xl font-bold text-white">
//               Unable to Load Arena
//             </h1>

//             <p className="mt-3 text-sm text-slate-400">
//               {error}
//             </p>

//             <div className="mt-6 flex flex-wrap justify-center gap-3">
//               <Button
//                 onClick={() =>
//                   loadQuiz()
//                 }
//                 className="bg-blue-600 text-white hover:bg-blue-500"
//               >
//                 Try Again
//               </Button>

//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   router.push(
//                     "/student/quiz-board",
//                   )
//                 }
//                 className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
//               >
//                 Back to Quiz Board
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* =======================================================
//      ARENA
//   ======================================================= */

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       {/* BACKGROUND */}

//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[120px]" />

//         <div className="absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-[120px]" />
//       </div>

//       <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         {/* HEADER */}

//         <div className="mb-6 flex items-center justify-between gap-4">
//           <Button
//             variant="ghost"
//             onClick={() =>
//               router.push(
//                 "/student/quiz-board",
//               )
//             }
//             className="text-slate-400 hover:bg-white/[0.05] hover:text-white"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Quiz Board
//           </Button>

//           <div className="flex items-center gap-2">
//             {/* SOCKET STATUS */}

//             <div
//               className={`flex items-center gap-2 rounded-full border px-3 py-2 ${
//                 socketStatus ===
//                 "connected"
//                   ? "border-green-500/20 bg-green-500/10"
//                   : socketStatus ===
//                       "connecting"
//                     ? "border-yellow-500/20 bg-yellow-500/10"
//                     : "border-red-500/20 bg-red-500/10"
//               }`}
//             >
//               {socketStatus ===
//               "connected" ? (
//                 <>
//                   <Wifi className="h-4 w-4 text-green-400" />

//                   <span className="text-xs font-semibold text-green-300">
//                     Live
//                   </span>
//                 </>
//               ) : socketStatus ===
//                 "connecting" ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />

//                   <span className="text-xs font-semibold text-yellow-300">
//                     Connecting
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <WifiOff className="h-4 w-4 text-red-400" />

//                   <span className="text-xs font-semibold text-red-300">
//                     Offline
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* JOIN ACK */}

//             {joinedAck && (
//               <div className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 sm:flex">
//                 <CheckCircle2 className="h-4 w-4 text-green-400" />

//                 <span className="text-xs font-semibold text-green-300">
//                   Room Joined
//                 </span>
//               </div>
//             )}

//             {/* QUIZ STATUS */}

//             <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
//               <Radio className="h-4 w-4 text-blue-400" />

//               <span className="text-xs font-semibold text-slate-300">
//                 {formatStatus(
//                   quiz.status,
//                 )}
//               </span>
//             </div>

//             <Button
//               variant="ghost"
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="text-slate-400 hover:bg-white/[0.05] hover:text-white"
//             >
//               {refreshing ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 "Refresh"
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* MAIN HEADING */}

//         <section className="mb-6 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-950 p-6 shadow-none sm:p-8">
//           <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
//             <div>
//               <div className="mb-3 flex flex-wrap items-center gap-2">
//                 <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
//                   Quiz Board Arena
//                 </span>

//                 {quiz.subject?.name && (
//                   <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-300">
//                     {quiz.subject.name}
//                   </span>
//                 )}

//                 {hasRoom && (
//                   <span className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
//                     <Wifi className="h-3.5 w-3.5" />
//                     Room Connected
//                   </span>
//                 )}
//               </div>

//               <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
//                 {quiz.quiz_title ||
//                   "Quiz Competition"}
//               </h1>

//               <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
//                 {quiz.description ||
//                   "Compete against other students, qualify through each round, and become the Quiz Board champion."}
//               </p>

//               {quiz.room_id && (
//                 <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
//                   <Radio className="h-3.5 w-3.5 text-blue-400" />

//                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Room
//                   </span>

//                   <span className="font-mono text-xs font-bold text-slate-300">
//                     {quiz.room_id}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
//               <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//                 Current Stage
//               </div>

//               <div className="mt-2 flex items-center justify-center gap-2">
//                 <Zap className="h-5 w-5 text-yellow-400" />

//                 <span className="text-xl font-black text-white">
//                   {currentRoundName}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ERROR */}

//         {error && (
//           <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
//             {error}
//           </div>
//         )}

//         {/* REAL-TIME EVENT NOTICE */}

//         {lastSocketEvent && (
//           <div className="mb-6 flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3">
//             <Radio className="h-4 w-4 shrink-0 text-blue-400" />

//             <span className="text-xs text-slate-400">
//               Live event received:
//             </span>

//             <span className="font-mono text-xs font-bold text-blue-300">
//               {lastSocketEvent}
//             </span>
//           </div>
//         )}

//         {/* =================================================
//             TIEBREAKER
//         ================================================= */}

//         {tiebreakerQuestion && (
//           <Card className="mb-6 border-yellow-500/20 bg-yellow-500/[0.06] p-5 shadow-none sm:p-6">
//             <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <div className="mb-2 flex items-center gap-2">
//                   <Zap className="h-5 w-5 text-yellow-400" />

//                   <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
//                     Tiebreaker Started
//                   </span>
//                 </div>

//                 <h2 className="text-lg font-black text-white">
//                   A tiebreaker question is now active
//                 </h2>

//                 {(
//                   tiebreakerQuestion.question ||
//                   tiebreakerQuestion.content ||
//                   tiebreakerQuestion.text
//                 ) && (
//                   <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
//                     {tiebreakerQuestion.question ||
//                       tiebreakerQuestion.content ||
//                       tiebreakerQuestion.text}
//                   </p>
//                 )}
//               </div>

//               <Button
//                 onClick={
//                   handleEnterCompetition
//                 }
//                 className="shrink-0 bg-yellow-500 font-bold text-black hover:bg-yellow-400"
//               >
//                 Continue
//                 <Zap className="ml-2 h-4 w-4" />
//               </Button>
//             </div>
//           </Card>
//         )}

//         {/* =================================================
//             LOBBY
//         ================================================= */}

//         <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
//           {/* PLAYERS */}

//           <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
//             <div className="mb-6 flex items-center justify-between">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Users className="h-5 w-5 text-blue-400" />

//                   <h2 className="font-bold text-white">
//                     Competition Lobby
//                   </h2>
//                 </div>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Students currently inside the arena
//                 </p>
//               </div>

//               <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2">
//                 <span className="text-lg font-black text-blue-300">
//                   {joinedCount}
//                 </span>

//                 <span className="text-sm text-slate-500">
//                   {" "}
//                   / {maxPlayers}
//                 </span>
//               </div>
//             </div>

//             {/* PROGRESS */}

//             <div className="mb-6">
//               <div className="mb-2 flex items-center justify-between text-xs">
//                 <span className="text-slate-500">
//                   Lobby capacity
//                 </span>

//                 <span className="font-bold text-slate-300">
//                   {playerPercentage}%
//                 </span>
//               </div>

//               <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
//                 <div
//                   className="h-full rounded-full bg-blue-500 transition-all duration-500"
//                   style={{
//                     width: `${playerPercentage}%`,
//                   }}
//                 />
//               </div>
//             </div>

//             {/* PLAYER GRID */}

//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
//               {Array.from({
//                 length: Math.max(
//                   maxPlayers,
//                   joinedCount,
//                 ),
//               }).map((_, index) => {
//                 const player =
//                   joinedUsers[index];

//                 if (!player) {
//                   return (
//                     <div
//                       key={`empty-${index}`}
//                       className="flex min-h-[82px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]"
//                     >
//                       <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.04]">
//                         <Users className="h-4 w-4 text-slate-600" />
//                       </div>

//                       <span className="text-[11px] text-slate-600">
//                         Waiting...
//                       </span>
//                     </div>
//                   );
//                 }

//                 const playerName =
//                   getUserName(
//                     player,
//                     index,
//                   );

//                 const playerKey =
//                   getEntityId(player) ||
//                   `player-${index}`;

//                 return (
//                   <div
//                     key={playerKey}
//                     className="relative min-h-[82px] rounded-2xl border border-white/10 bg-white/[0.03] p-3"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-black text-blue-300">
//                         {getUserInitials(
//                           playerName,
//                         )}
//                       </div>

//                       <div className="min-w-0">
//                         <div className="truncate text-xs font-bold text-slate-200">
//                           {playerName}
//                         </div>

//                         <div className="mt-1 flex items-center gap-1 text-[10px] text-green-400">
//                           <CheckCircle2 className="h-3 w-3" />
//                           Joined
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </Card>

//           {/* COMPETITION INFO */}

//           <div className="space-y-6">
//             <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
//               <div className="mb-5 flex items-center gap-2">
//                 <Trophy className="h-5 w-5 text-yellow-400" />

//                 <h2 className="font-bold text-white">
//                   Competition Info
//                 </h2>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Players
//                   </span>

//                   <span className="font-bold text-white">
//                     {maxPlayers}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Rounds
//                   </span>

//                   <span className="font-bold text-white">
//                     {totalRounds}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Total Questions
//                   </span>

//                   <span className="font-bold text-white">
//                     {totalQuestions}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Time / Question
//                   </span>

//                   <span className="flex items-center gap-1 font-bold text-white">
//                     <Clock3 className="h-4 w-4 text-blue-400" />
//                     {quiz.time_per_question ??
//                       20}
//                     s
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Start Time
//                   </span>

//                   <span className="max-w-[170px] text-right text-xs font-semibold text-slate-300">
//                     {formatStartDate(
//                       quiz.start_date,
//                     )}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
//                   <span className="text-sm text-slate-500">
//                     Room
//                   </span>

//                   <span
//                     className={`flex items-center gap-1.5 text-xs font-bold ${
//                       hasRoom
//                         ? "text-green-400"
//                         : "text-yellow-400"
//                     }`}
//                   >
//                     {hasRoom ? (
//                       <>
//                         <Wifi className="h-3.5 w-3.5" />
//                         Connected
//                       </>
//                     ) : (
//                       <>
//                         <WifiOff className="h-3.5 w-3.5" />
//                         Waiting for room
//                       </>
//                     )}
//                   </span>
//                 </div>
//               </div>
//             </Card>

//             {/* QUALIFICATION */}

//             <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none sm:p-6">
//               <div className="mb-5 flex items-center gap-2">
//                 <Medal className="h-5 w-5 text-indigo-400" />

//                 <h2 className="font-bold text-white">
//                   Qualification
//                 </h2>
//               </div>

//               <div className="flex items-center gap-1 overflow-x-auto pb-2">
//                 {qualificationSequence.map(
//                   (players, index) => (
//                     <div
//                       key={`${players}-${index}`}
//                       className="flex shrink-0 items-center"
//                     >
//                       <div
//                         className={`flex h-11 min-w-[50px] items-center justify-center rounded-xl border px-3 text-sm font-black ${
//                           index === 0
//                             ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
//                             : players === 1
//                               ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
//                               : "border-white/10 bg-white/[0.03] text-slate-300"
//                         }`}
//                       >
//                         {players}
//                       </div>

//                       {index <
//                         qualificationSequence.length -
//                           1 && (
//                         <div className="px-1 text-slate-700">
//                           →
//                         </div>
//                       )}
//                     </div>
//                   ),
//                 )}
//               </div>

//               <p className="mt-3 text-xs leading-5 text-slate-500">
//                 The fastest students who answer
//                 correctly progress through each
//                 elimination round.
//               </p>
//             </Card>
//           </div>
//         </section>

//         {/* =================================================
//             LEADERBOARD
//         ================================================= */}

//         {leaderboard.length > 0 && (
//           <section className="mt-6">
//             <Card className="border-indigo-500/20 bg-indigo-500/[0.05] p-5 shadow-none sm:p-6">
//               <div className="mb-5 flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <Trophy className="h-5 w-5 text-yellow-400" />

//                     <h2 className="font-bold text-white">
//                       Live Leaderboard
//                     </h2>
//                   </div>

//                   <p className="mt-1 text-xs text-slate-500">
//                     Updated in real time
//                   </p>
//                 </div>

//                 <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-300">
//                   Live
//                 </span>
//               </div>

//               <div className="space-y-2">
//                 {leaderboard
//                   .slice(0, 10)
//                   .map(
//                     (
//                       player,
//                       index,
//                     ) => (
//                       <div
//                         key={`${player.id}-${index}`}
//                         className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
//                       >
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-black text-slate-300">
//                           {player.rank ??
//                             index + 1}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-bold text-slate-200">
//                             {player.name}
//                           </p>

//                           <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-slate-500">
//                             {player.correctAnswers !==
//                               undefined && (
//                               <span>
//                                 Correct:{" "}
//                                 {
//                                   player.correctAnswers
//                                 }
//                               </span>
//                             )}

//                             {player.timeTakenInSeconds !==
//                               undefined && (
//                               <span>
//                                 Time:{" "}
//                                 {
//                                   player.timeTakenInSeconds
//                                 }
//                                 s
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {player.score !==
//                           undefined && (
//                           <div className="text-right">
//                             <p className="text-sm font-black text-blue-300">
//                               {player.score}
//                             </p>

//                             <p className="text-[10px] text-slate-600">
//                               points
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     ),
//                   )}
//               </div>
//             </Card>
//           </section>
//         )}

//         {/* =================================================
//             ELIMINATED PLAYERS
//         ================================================= */}

//         {eliminatedPlayers.length >
//           0 && (
//           <section className="mt-6">
//             <Card className="border-red-500/20 bg-red-500/[0.05] p-5 shadow-none sm:p-6">
//               <div className="mb-4 flex items-center gap-2">
//                 <Users className="h-5 w-5 text-red-400" />

//                 <h2 className="font-bold text-white">
//                   Participants Eliminated
//                 </h2>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 {eliminatedPlayers.map(
//                   (
//                     player,
//                     index,
//                   ) => {
//                     const name =
//                       getUserName(
//                         player,
//                         index,
//                       );

//                     return (
//                       <span
//                         key={
//                           getEntityId(
//                             player,
//                           ) ||
//                           `eliminated-${index}`
//                         }
//                         className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300"
//                       >
//                         {name}
//                       </span>
//                     );
//                   },
//                 )}
//               </div>
//             </Card>
//           </section>
//         )}

//         {/* =================================================
//             WAITING / READY / LIVE / COMPLETED
//         ================================================= */}

//         <section className="mt-6">
//           {/* WAITING */}

//           {status === "waiting" && (
//             <Card className="border-blue-500/20 bg-blue-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
//                 <Users className="h-8 w-8 text-blue-400" />
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 Waiting for Players
//               </h2>

//               <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
//                 The competition will begin when
//                 the room is ready. Stay here while
//                 other students join.
//               </p>

//               <div className="mt-5 flex justify-center">
//                 <div
//                   className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
//                     socketStatus ===
//                     "connected"
//                       ? "border-green-500/20 bg-green-500/10 text-green-300"
//                       : "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
//                   }`}
//                 >
//                   {socketStatus ===
//                   "connected" ? (
//                     <>
//                       <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
//                       Live room connection active
//                     </>
//                   ) : (
//                     <>
//                       <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                       Connecting to room...
//                     </>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
//                 <div className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3">
//                   <span className="text-2xl font-black text-blue-300">
//                     {joinedCount}
//                   </span>

//                   <span className="ml-1 text-sm text-slate-500">
//                     joined
//                   </span>
//                 </div>

//                 <div className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3">
//                   <span className="text-2xl font-black text-slate-300">
//                     {Math.max(
//                       maxPlayers -
//                         joinedCount,
//                       0,
//                     )}
//                   </span>

//                   <span className="ml-1 text-sm text-slate-500">
//                     spots left
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={() =>
//                     router.push(
//                       "/student/quiz-board",
//                     )
//                   }
//                   variant="outline"
//                   className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Leave Arena
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {/* READY */}

//           {status === "ready" && (
//             <Card className="border-green-500/20 bg-green-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
//                 <CheckCircle2 className="h-8 w-8 text-green-400" />
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 Arena Is Ready
//               </h2>

//               <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
//                 All {maxPlayers} players have
//                 joined. Get ready for Round 1.
//               </p>

//               <div className="mt-4 flex justify-center">
//                 <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-300">
//                   <Wifi className="h-3.5 w-3.5" />
//                   Room connected
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={
//                     handleEnterCompetition
//                   }
//                   className="h-12 bg-blue-600 px-8 font-bold text-white hover:bg-blue-500"
//                 >
//                   <Zap className="mr-2 h-5 w-5" />
//                   Enter Competition
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {/* LIVE */}

//           {status === "live" && (
//             <Card className="border-indigo-500/20 bg-indigo-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
//                 <Radio className="h-8 w-8 animate-pulse text-indigo-400" />
//               </div>

//               <div className="mb-2 flex items-center justify-center gap-2">
//                 <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

//                 <span className="text-xs font-bold uppercase tracking-wider text-red-400">
//                   Live
//                 </span>
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 {currentRoundName}
//               </h2>

//               <p className="mt-2 text-sm text-slate-400">
//                 The competition is currently in
//                 progress.
//               </p>

//               <div className="mt-4 flex justify-center">
//                 <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-300">
//                   <Wifi className="h-3.5 w-3.5" />
//                   Live room connection active
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={
//                     handleEnterCompetition
//                   }
//                   className="h-12 bg-blue-600 px-8 font-bold text-white hover:bg-blue-500"
//                 >
//                   <Zap className="mr-2 h-5 w-5" />
//                   Continue Competition
//                 </Button>
//               </div>
//             </Card>
//           )}

//           {/* COMPLETED */}

//           {status === "completed" && (
//             <Card className="border-yellow-500/20 bg-yellow-500/[0.06] p-6 text-center shadow-none sm:p-8">
//               <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
//                 <Crown className="h-8 w-8 text-yellow-400" />
//               </div>

//               <h2 className="text-2xl font-black text-white">
//                 Competition Completed
//               </h2>

//               <p className="mt-2 text-sm text-slate-400">
//                 This Quiz Board competition has
//                 ended.
//               </p>

//               <div className="mt-6 flex justify-center">
//                 <Button
//                   onClick={() =>
//                     router.push(
//                       "/student/quiz-board",
//                     )
//                   }
//                   className="bg-blue-600 text-white hover:bg-blue-500"
//                 >
//                   Back to Quiz Board
//                 </Button>
//               </div>
//             </Card>
//           )}
//         </section>

//         {/* REWARDS */}

//         <section className="mt-6 grid gap-6 md:grid-cols-2">
//           <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10">
//                 <Crown className="h-5 w-5 text-yellow-400" />
//               </div>

//               <div>
//                 <p className="text-xs uppercase tracking-wider text-slate-500">
//                   Champion
//                 </p>

//                 <p className="text-xl font-black text-white">
//                   {quiz
//                     .final_round_information
//                     ?.first_position_reward ??
//                     0}{" "}
//                   Points
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <Card className="border-white/10 bg-white/[0.04] p-5 shadow-none">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
//                 <Medal className="h-5 w-5 text-slate-300" />
//               </div>

//               <div>
//                 <p className="text-xs uppercase tracking-wider text-slate-500">
//                   Runner-up
//                 </p>

//                 <p className="text-xl font-black text-white">
//                   {quiz
//                     .final_round_information
//                     ?.second_position_reward ??
//                     0}{" "}
//                   Points
//                 </p>
//               </div>
//             </div>
//           </Card>
//         </section>

//         {/* FOOTER */}

//         <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-600 sm:flex-row">
//           <div className="flex items-center gap-2">
//             <Sparkles className="h-3.5 w-3.5" />
//             JAMB League Quiz Board
//           </div>

//           <div className="flex items-center gap-4">
//             <span className="flex items-center gap-1">
//               <MessageCircle className="h-3.5 w-3.5" />
//               Live Competition
//             </span>

//             <span className="flex items-center gap-1">
//               {socketStatus ===
//               "connected" ? (
//                 <>
//                   <Wifi className="h-3.5 w-3.5 text-green-500" />
//                   Connected
//                 </>
//               ) : (
//                 <>
//                   <WifiOff className="h-3.5 w-3.5" />
//                   Disconnected
//                 </>
//               )}
//             </span>

//             <span>
//               Round{" "}
//               {Math.max(
//                 currentRound,
//                 0,
//               )}{" "}
//               / {totalRounds}
//             </span>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
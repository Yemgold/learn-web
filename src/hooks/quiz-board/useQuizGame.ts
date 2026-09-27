


"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Socket } from "socket.io-client";

import { getQuizSocket } from "@/lib/socket/quizSocket";

import {
  DEFAULT_QUESTION_TIME_LIMIT,
  createEmptyCurrentQuestion,
  createInitialQuizGameState,
} from "@/lib/quiz-board/shared/quizGameState";

import { QUIZ_GAME_EVENTS } from "@/lib/quiz-board/shared/quizGameEvents";

import {
  getSocketErrorMessage,
  normalizeLeaderboard,
  normalizeParticipants,
  normalizeQuizQuestion,
  toNumber,
} from "@/lib/quiz-board/shared/quizGameUtils";

import {
  isContestant,
  isHost,
  isSpectator,
} from "@/lib/quiz-board/shared/quizGamePermissions";

import type {
  QuizCurrentQuestion,
  QuizGameParticipant,
  QuizGameQuestion,
  QuizGameRole,
  QuizGameState,
  QuizLeaderboardEntry,
  StartQuestionPayload,
  StartRoundPayload,
  LockQuestionPayload,
  NextQuestionPayload,
  SubmitAnswerPayload,
} from "@/lib/quiz-board/shared/quizGameTypes";

export interface UseQuizGameOptions {
  quizId: string;
  roomId?: string | null;
  role: QuizGameRole;
  initialRound?: number;
  autoJoin?: boolean;
  onError?: (message: string) => void;
}

export interface UseQuizGameResult {
  state: QuizGameState;

  socket: Socket | null;

  connected: boolean;
  roomJoined: boolean;
  roomActivated: boolean;

  currentRound: number;

  currentQuestion: QuizCurrentQuestion | null;
  currentQuestionData: QuizGameQuestion | null;

  participants: QuizGameParticipant[];
  leaderboard: QuizLeaderboardEntry[];

  questionStarted: boolean;
  questionLocked: boolean;

  selectedAnswer: string | null;
  answerSubmitted: boolean;

  actionLoading: boolean;
  loading: boolean;
  error: string | null;

  canStartRound: boolean;
  canStartQuestion: boolean;
  canLockQuestion: boolean;
  canNextQuestion: boolean;
  canAnswer: boolean;

  joinRoom: () => void;

  startRound: (roundNumber?: number) => void;

  startQuestion: (
    question: QuizGameQuestion,
    timeLimit?: number,
  ) => void;

  lockQuestion: () => void;

  nextQuestion: () => void;

  submitAnswer: (answer: string) => void;

  resetQuestion: () => void;

  clearError: () => void;

  refreshRoom: () => void;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function asRecord(value: unknown): Record<string, unknown> {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as Record<string, unknown>;
  }

  return {};
}

function getPayloadData(value: unknown): unknown {
  const root = asRecord(value);

  return "data" in root ? root.data : value;
}

function getBoolean(
  value: unknown,
): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return undefined;
}

function getMessage(
  payload: unknown,
  fallback = "Quiz game error.",
): string {
  if (typeof payload === "string") {
    return payload;
  }

  const root = asRecord(payload);
  const data = asRecord(root.data);

  const candidates: unknown[] = [
    root.message,
    root.error,
    data.message,
    data.error,
  ];

  for (const candidate of candidates) {
    if (
      typeof candidate === "string" &&
      candidate.trim()
    ) {
      return candidate;
    }
  }

  try {
    const socketMessage =
      getSocketErrorMessage(payload);

    if (socketMessage) {
      return socketMessage;
    }
  } catch {
    // Ignore normalization failure.
  }

  return fallback;
}

function extractQuestion(
  payload: unknown,
): QuizGameQuestion | null {
  const root = asRecord(payload);
  const data = asRecord(root.data);

  const candidates: unknown[] = [
    root.question,
    root.questionData,
    root.currentQuestion,
    data.question,
    data.questionData,
    data.currentQuestion,
    root.data,
    payload,
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const record = asRecord(candidate);

    if (
      !record.question &&
      !record.questionText &&
      !record._id &&
      !record.id &&
      !record.questionId
    ) {
      continue;
    }

    try {
      return normalizeQuizQuestion(candidate);
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

function extractRound(
  payload: unknown,
  fallback: number,
): number {
  const root = asRecord(payload);
  const data = asRecord(root.data);

  const candidates: unknown[] = [
    root.roundNumber,
    root.round_number,
    root.currentRound,
    root.current_round,
    data.roundNumber,
    data.round_number,
    data.currentRound,
    data.current_round,
  ];

  for (const candidate of candidates) {
    const value = toNumber(candidate);

    if (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    ) {
      return Math.floor(value);
    }
  }

  return fallback;
}

function extractQuestionNumber(
  payload: unknown,
): number | undefined {
  const root = asRecord(payload);
  const data = asRecord(root.data);

  const candidates: unknown[] = [
    root.questionNumber,
    root.question_number,
    root.currentQuestionNumber,
    root.current_question_number,
    data.questionNumber,
    data.question_number,
    data.currentQuestionNumber,
    data.current_question_number,
  ];

  for (const candidate of candidates) {
    const value = toNumber(candidate);

    if (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    ) {
      return Math.floor(value);
    }
  }

  return undefined;
}

function extractTimeLimit(
  payload: unknown,
  fallback: number,
): number {
  const root = asRecord(payload);
  const data = asRecord(root.data);
  const timer = asRecord(
    root.timer ?? data.timer,
  );

  const candidates: unknown[] = [
    root.timeLimit,
    root.time_limit,
    root.duration,
    root.durationSeconds,

    data.timeLimit,
    data.time_limit,
    data.duration,
    data.durationSeconds,

    timer.timeLimit,
    timer.time_limit,
    timer.duration,
    timer.durationSeconds,
    timer.totalSeconds,
    timer.totalTime,
  ];

  for (const candidate of candidates) {
    const value = toNumber(candidate);

    if (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    ) {
      return Math.floor(value);
    }
  }

  return fallback;
}

function extractTimestamp(
  payload: unknown,
): number | null {
  if (payload === undefined || payload === null) {
    return null;
  }

  const numeric = toNumber(payload);

  if (
    typeof numeric === "number" &&
    Number.isFinite(numeric)
  ) {
    /*
     * The shared type uses milliseconds.
     *
     * If the backend sends Unix seconds, convert them.
     */
    if (numeric > 0 && numeric < 10_000_000_000) {
      return numeric * 1000;
    }

    return numeric;
  }

  if (typeof payload === "string") {
    const parsed = Date.parse(payload);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function extractStartedAt(
  payload: unknown,
): number | null {
  const root = asRecord(payload);
  const data = asRecord(root.data);

  return extractTimestamp(
    root.startedAt ??
      root.started_at ??
      data.startedAt ??
      data.started_at,
  );
}

function extractExpiresAt(
  payload: unknown,
): number | null {
  const root = asRecord(payload);
  const data = asRecord(root.data);

  return extractTimestamp(
    root.expiresAt ??
      root.expires_at ??
      data.expiresAt ??
      data.expires_at,
  );
}

function extractLockedAt(
  payload: unknown,
): number | null {
  const root = asRecord(payload);
  const data = asRecord(root.data);

  return extractTimestamp(
    root.lockedAt ??
      root.locked_at ??
      data.lockedAt ??
      data.locked_at,
  );
}

/**
 * Builds the shared QuizCurrentQuestion shape.
 *
 * Important:
 * QuizGameQuestion contains only question data.
 * Timer/session metadata belongs to QuizCurrentQuestion.
 */
function buildCurrentQuestion(
  payload: unknown,
  fallbackQuestion: QuizGameQuestion | null,
  fallbackRound: number,
  fallbackTimeLimit: number,
): QuizCurrentQuestion | null {
  const question =
    extractQuestion(payload) ??
    fallbackQuestion;

  if (!question) {
    return null;
  }

  const questionNumber =
    extractQuestionNumber(payload) ??
    question.questionNumber ??
    null;

  const timeLimit =
    extractTimeLimit(
      payload,
      fallbackTimeLimit,
    );

  const base =
    createEmptyCurrentQuestion();

  const startedAt =
    extractStartedAt(payload);

  const expiresAt =
    extractExpiresAt(payload);

  /*
   * createEmptyCurrentQuestion() gives us the
   * authoritative shared timer shape.
   *
   * We deliberately do NOT create:
   *
   * timer: {
   *   duration: ...
   * }
   *
   * because duration is not part of QuizGameTimer.
   */
  const timer = {
    ...base.timer,
  };

  /*
   * Populate only timer fields that actually
   * exist on the shared object.
   *
   * The cast is isolated here because the timer
   * can evolve independently from this hook.
   */
  const timerRecord =
    timer as unknown as Record<
      string,
      unknown
    >;

  if (
    startedAt !== null &&
    "startedAt" in timerRecord
  ) {
    timerRecord.startedAt = startedAt;
  }

  if (
    expiresAt !== null &&
    "expiresAt" in timerRecord
  ) {
    timerRecord.expiresAt = expiresAt;
  }

  if ("totalSeconds" in timerRecord) {
    timerRecord.totalSeconds =
      timeLimit;
  }

  if ("remainingSeconds" in timerRecord) {
    timerRecord.remainingSeconds =
      timeLimit;
  }

  if ("isRunning" in timerRecord) {
    timerRecord.isRunning = true;
  }

  return {
    ...base,

    question,

    questionNumber:
      typeof questionNumber === "number"
        ? questionNumber
        : null,

    roundNumber:
      fallbackRound > 0
        ? fallbackRound
        : null,

    status: "ACTIVE",

    startedAt,

    lockedAt: null,

    timeLimit,

    timer,
  };
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useQuizGame(
  options: UseQuizGameOptions,
): UseQuizGameResult {
  const {
    quizId,
    roomId,
    role,
    initialRound = 1,
    autoJoin = true,
    onError,
  } = options;

  const [state, setState] =
    useState<QuizGameState>(
      () => createInitialQuizGameState(),
    );

  const [socket, setSocket] =
    useState<Socket | null>(null);

  const [connected, setConnected] =
    useState(false);

  const [roomJoined, setRoomJoined] =
    useState(false);

  const [roomActivated, setRoomActivated] =
    useState(false);

  const [currentRound, setCurrentRound] =
    useState(initialRound);

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState<QuizCurrentQuestion | null>(
    null,
  );

  const [
    currentQuestionData,
    setCurrentQuestionData,
  ] = useState<QuizGameQuestion | null>(
    null,
  );

  const [participants, setParticipants] =
    useState<QuizGameParticipant[]>([]);

  const [leaderboard, setLeaderboard] =
    useState<QuizLeaderboardEntry[]>([]);

  const [
    questionStarted,
    setQuestionStarted,
  ] = useState(false);

  const [
    questionLocked,
    setQuestionLocked,
  ] = useState(false);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState<string | null>(null);

  const [
    answerSubmitted,
    setAnswerSubmitted,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Stable refs                                                            */
  /* ---------------------------------------------------------------------- */

  const socketRef =
    useRef<Socket | null>(null);

  const roomJoinedRef =
    useRef(false);

  const roomActivatedRef =
    useRef(false);

  const questionStartedRef =
    useRef(false);

  const questionLockedRef =
    useRef(false);

  const currentRoundRef =
    useRef(initialRound);

  const currentQuestionRef =
    useRef<QuizCurrentQuestion | null>(
      null,
    );

  const currentQuestionDataRef =
    useRef<QuizGameQuestion | null>(
      null,
    );

  const answerSubmittedRef =
    useRef(false);

  const roleRef =
    useRef<QuizGameRole>(role);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    currentRoundRef.current =
      currentRound;
  }, [currentRound]);

  useEffect(() => {
    roomJoinedRef.current =
      roomJoined;
  }, [roomJoined]);

  useEffect(() => {
    roomActivatedRef.current =
      roomActivated;
  }, [roomActivated]);

  useEffect(() => {
    questionStartedRef.current =
      questionStarted;
  }, [questionStarted]);

  useEffect(() => {
    questionLockedRef.current =
      questionLocked;
  }, [questionLocked]);

  useEffect(() => {
    currentQuestionRef.current =
      currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    currentQuestionDataRef.current =
      currentQuestionData;
  }, [currentQuestionData]);

  useEffect(() => {
    answerSubmittedRef.current =
      answerSubmitted;
  }, [answerSubmitted]);

  /* ---------------------------------------------------------------------- */
  /* Errors                                                                 */
  /* ---------------------------------------------------------------------- */

  const reportError =
    useCallback(
      (value: unknown) => {
        const message =
          getMessage(value);

        setError(message);

        onError?.(message);

        console.error(
          "[useQuizGame]",
          message,
          value,
        );
      },
      [onError],
    );

  const clearError =
    useCallback(() => {
      setError(null);
    }, []);

  /* ---------------------------------------------------------------------- */
  /* Room state                                                             */
  /* ---------------------------------------------------------------------- */

  const handleRoomState =
    useCallback(
      (payload: unknown) => {
        const root =
          asRecord(payload);

        const data =
          asRecord(root.data);

        const activated =
          getBoolean(
            root.activated ??
              root.isActivated ??
              root.roomActivated ??
              data.activated ??
              data.isActivated ??
              data.roomActivated,
          );

        if (
          activated !== undefined
        ) {
          setRoomActivated(
            activated,
          );

          roomActivatedRef.current =
            activated;
        }

        const round =
          extractRound(
            payload,
            currentRoundRef.current,
          );

        setCurrentRound(round);
        currentRoundRef.current =
          round;

        const rawParticipants =
          data.participants ??
          root.participants;

        if (
          rawParticipants !==
          undefined
        ) {
          try {
            setParticipants(
              normalizeParticipants(
                rawParticipants,
              ),
            );
          } catch (normalizationError) {
            console.error(
              "[useQuizGame] Participant normalization failed:",
              normalizationError,
            );
          }
        }

        const rawLeaderboard =
          data.leaderboard ??
          root.leaderboard;

        if (
          rawLeaderboard !==
          undefined
        ) {
          try {
            setLeaderboard(
              normalizeLeaderboard(
                rawLeaderboard,
              ),
            );
          } catch (normalizationError) {
            console.error(
              "[useQuizGame] Leaderboard normalization failed:",
              normalizationError,
            );
          }
        }

        const roomQuestion =
          extractQuestion(payload);

        if (roomQuestion) {
          setCurrentQuestionData(
            roomQuestion,
          );

          currentQuestionDataRef.current =
            roomQuestion;
        }
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Question started                                                       */
  /* ---------------------------------------------------------------------- */

  const handleQuestionStarted =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] question_started:",
          payload,
        );

        const question =
          extractQuestion(payload);

        if (question) {
          setCurrentQuestionData(
            question,
          );

          currentQuestionDataRef.current =
            question;
        }

        const timeLimit =
          extractTimeLimit(
            payload,
            DEFAULT_QUESTION_TIME_LIMIT,
          );

        const round =
          extractRound(
            payload,
            currentRoundRef.current,
          );

        const liveQuestion =
          buildCurrentQuestion(
            payload,
            question ??
              currentQuestionDataRef.current,
            round,
            timeLimit,
          );

        if (liveQuestion) {
          setCurrentQuestion(
            liveQuestion,
          );

          currentQuestionRef.current =
            liveQuestion;
        }

        setCurrentRound(round);
        currentRoundRef.current =
          round;

        setQuestionStarted(true);
        questionStartedRef.current =
          true;

        setQuestionLocked(false);
        questionLockedRef.current =
          false;

        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        answerSubmittedRef.current =
          false;

        setActionLoading(false);
        setError(null);
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Question locked                                                        */
  /* ---------------------------------------------------------------------- */

  const handleQuestionLocked =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] question_locked:",
          payload,
        );

        const lockedAt =
          extractLockedAt(payload) ??
          Date.now();

        setQuestionLocked(true);
        questionLockedRef.current =
          true;

        setCurrentQuestion(
          (previous) => {
            if (!previous) {
              return previous;
            }

            return {
              ...previous,
              status: "LOCKED",
              lockedAt,
            };
          },
        );

        setActionLoading(false);
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Question completed                                                     */
  /* ---------------------------------------------------------------------- */

  const handleQuestionCompleted =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] question_completed:",
          payload,
        );

        setActionLoading(false);
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Round started                                                           */
  /* ---------------------------------------------------------------------- */

  const handleRoundStarted =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] round_started:",
          payload,
        );

        const round =
          extractRound(
            payload,
            currentRoundRef.current,
          );

        setCurrentRound(round);
        currentRoundRef.current =
          round;

        setCurrentQuestion(null);
        currentQuestionRef.current =
          null;

        setCurrentQuestionData(null);
        currentQuestionDataRef.current =
          null;

        setQuestionStarted(false);
        questionStartedRef.current =
          false;

        setQuestionLocked(false);
        questionLockedRef.current =
          false;

        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        answerSubmittedRef.current =
          false;

        setActionLoading(false);
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Round completed                                                        */
  /* ---------------------------------------------------------------------- */

  const handleRoundCompleted =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] round_completed:",
          payload,
        );

        setQuestionStarted(false);
        questionStartedRef.current =
          false;

        setQuestionLocked(true);
        questionLockedRef.current =
          true;

        setActionLoading(false);
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Participant joined                                                     */
  /* ---------------------------------------------------------------------- */

  const handleParticipantJoined =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] participant_joined_room:",
          payload,
        );

        const participantPayload =
          getPayloadData(payload);

        try {
          const normalized =
            normalizeParticipants(
              Array.isArray(
                participantPayload,
              )
                ? participantPayload
                : [participantPayload],
            );

          if (!normalized.length) {
            return;
          }

          setParticipants(
            (previous) => {
              const merged = [
                ...previous,
              ];

              for (
                const participant of normalized
              ) {
                const index =
                  merged.findIndex(
                    (item) =>
                      item.id ===
                      participant.id,
                  );

                if (index >= 0) {
                  merged[index] =
                    participant;
                } else {
                  merged.push(
                    participant,
                  );
                }
              }

              return merged;
            },
          );
        } catch (normalizationError) {
          console.error(
            "[useQuizGame] Participant join normalization failed:",
            normalizationError,
          );
        }
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Participant left                                                       */
  /* ---------------------------------------------------------------------- */

  const handleParticipantLeft =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] participant_left_room:",
          payload,
        );

        const root =
          asRecord(payload);

        const data =
          asRecord(root.data);

        const rawId =
          root.participantId ??
          root.participant_id ??
          root.userId ??
          root.user_id ??
          data.participantId ??
          data.participant_id ??
          data.userId ??
          data.user_id;

        if (
          typeof rawId !==
          "string"
        ) {
          return;
        }

        const participantId =
          rawId;

        setParticipants(
          (previous) =>
            previous.filter(
              (participant) =>
                participant.id !==
                participantId,
            ),
        );
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Leaderboard                                                            */
  /* ---------------------------------------------------------------------- */

  const handleLeaderboardUpdated =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] leaderboard_updated:",
          payload,
        );

        const root =
          asRecord(payload);

        const data =
          asRecord(root.data);

        const raw =
          data.leaderboard ??
          root.leaderboard ??
          getPayloadData(payload);

        if (!raw) {
          return;
        }

        try {
          setLeaderboard(
            normalizeLeaderboard(raw),
          );
        } catch (normalizationError) {
          console.error(
            "[useQuizGame] Leaderboard normalization failed:",
            normalizationError,
          );
        }
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* First correct answer                                                   */
  /* ---------------------------------------------------------------------- */

  const handleFirstCorrectAnswer =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] first_correct_answer:",
          payload,
        );
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Answer result                                                           */
  /* ---------------------------------------------------------------------- */

  const handleAnswerResult =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] answer_result:",
          payload,
        );

        setAnswerSubmitted(true);
        answerSubmittedRef.current =
          true;

        setActionLoading(false);
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Room activation                                                        */
  /* ---------------------------------------------------------------------- */

  const handleRoomActivated =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] room_activated:",
          payload,
        );

        setRoomActivated(true);
        roomActivatedRef.current =
          true;

        setError(null);
      },
      [],
    );

  const handleRoomActivationAck =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] room_activation_ack:",
          payload,
        );

        const activated =
          getBoolean(
            asRecord(payload)
              .data instanceof Object
              ? asRecord(
                  asRecord(payload).data,
                ).activated ??
                  asRecord(
                    asRecord(payload).data,
                  ).isActivated ??
                  asRecord(
                    asRecord(payload).data,
                  ).roomActivated
              : asRecord(payload)
                  .activated ??
                  asRecord(payload)
                    .isActivated ??
                  asRecord(payload)
                    .roomActivated,
          );

        if (
          activated !== undefined
        ) {
          setRoomActivated(
            activated,
          );

          roomActivatedRef.current =
            activated;
        }
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Joined room                                                            */
  /* ---------------------------------------------------------------------- */

  const handleJoinedRoom =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] joined_room_ack:",
          payload,
        );

        setRoomJoined(true);
        roomJoinedRef.current =
          true;

        const activated =
          getBoolean(
            (() => {
              const root =
                asRecord(payload);

              const data =
                asRecord(root.data);

              return (
                root.activated ??
                root.isActivated ??
                root.roomActivated ??
                data.activated ??
                data.isActivated ??
                data.roomActivated
              );
            })(),
          );

        if (
          activated !== undefined
        ) {
          setRoomActivated(
            activated,
          );

          roomActivatedRef.current =
            activated;
        }

        setError(null);

        handleRoomState(payload);
      },
      [handleRoomState],
    );

  /* ---------------------------------------------------------------------- */
  /* Participants eliminated                                                */
  /* ---------------------------------------------------------------------- */

  const handleParticipantsEliminated =
    useCallback(
      (payload: unknown) => {
        console.log(
          "[useQuizGame] participants_eliminated:",
          payload,
        );

        const root =
          asRecord(payload);

        const data =
          asRecord(root.data);

        const eliminated =
          data.participants ??
          data.eliminatedParticipants ??
          root.participants ??
          root.eliminatedParticipants;

        if (
          !Array.isArray(
            eliminated,
          )
        ) {
          return;
        }

        const eliminatedIds =
          new Set<string>();

        for (
          const item of eliminated
        ) {
          if (
            typeof item ===
            "string"
          ) {
            eliminatedIds.add(item);
            continue;
          }

          const participant =
            asRecord(item);

          const rawId =
            participant.id ??
            participant.participantId ??
            participant.participant_id ??
            participant.userId ??
            participant.user_id;

          if (
            typeof rawId ===
            "string"
          ) {
            eliminatedIds.add(
              rawId,
            );
          }
        }

        if (
          !eliminatedIds.size
        ) {
          return;
        }

        setParticipants(
          (previous) =>
            previous.map(
              (participant) =>
                eliminatedIds.has(
                  participant.id,
                )
                  ? {
                      ...participant,
                      eliminated: true,
                    }
                  : participant,
            ),
        );

        /*
         * QuizLeaderboardEntry uses `id` only
         * if the shared type defines it.
         *
         * Current shared model identifies the
         * participant through its own normalized
         * identity fields, so compare against
         * the participant identity safely.
         */
        setLeaderboard(
          (previous) =>
            previous.map(
              (entry) => {
                const entryRecord =
                  entry as unknown as Record<
                    string,
                    unknown
                  >;

                const rawId =
                  entryRecord.id ??
                  entryRecord.userId ??
                  entryRecord.user_id ??
                  entryRecord.participantId ??
                  entryRecord.participant_id;

                if (
                  typeof rawId !==
                    "string" ||
                  !eliminatedIds.has(
                    rawId,
                  )
                ) {
                  return entry;
                }

                return {
                  ...entry,
                  eliminated: true,
                };
              },
            ),
        );
      },
      [],
    );

  /* ---------------------------------------------------------------------- */
  /* Socket error                                                           */
  /* ---------------------------------------------------------------------- */

  const handleSocketError =
    useCallback(
      (payload: unknown) => {
        console.error(
          "[useQuizGame] socket_error:",
          payload,
        );

        reportError(payload);

        setActionLoading(false);
      },
      [reportError],
    );

  /* ---------------------------------------------------------------------- */
  /* Join room                                                              */
  /* ---------------------------------------------------------------------- */

  const joinRoom =
    useCallback(() => {
      const activeSocket =
        socketRef.current;

      if (!activeSocket) {
        reportError(
          "Quiz socket is not available.",
        );
        return;
      }

      if (
        !activeSocket.connected
      ) {
        reportError(
          "Quiz socket is not connected.",
        );
        return;
      }

      if (!roomId) {
        reportError(
          "No quiz room ID was provided.",
        );
        return;
      }

      if (
        roomJoinedRef.current
      ) {
        return;
      }

      const payload = {
        roomId,
        quizId,
        role,
      };

      console.log(
        "[useQuizGame] join_room:",
        payload,
      );

      activeSocket.emit(
        QUIZ_GAME_EVENTS.JOIN_ROOM,
        payload,
      );
    }, [
      quizId,
      roomId,
      role,
      reportError,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Socket lifecycle                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!quizId) {
      return;
    }

    const activeSocket =
      getQuizSocket();

    socketRef.current =
      activeSocket;

    setSocket(activeSocket);

    const handleConnect =
      () => {
        console.log(
          "[useQuizGame] Socket connected:",
          activeSocket.id,
        );

        setConnected(true);

        if (
          autoJoin &&
          roomId
        ) {
          window.setTimeout(
            () => {
              if (
                !roomJoinedRef.current &&
                activeSocket.connected
              ) {
                activeSocket.emit(
                  QUIZ_GAME_EVENTS.JOIN_ROOM,
                  {
                    roomId,
                    quizId,
                    role,
                  },
                );
              }
            },
            0,
          );
        }
      };

    const handleDisconnect =
      (reason: string) => {
        console.log(
          "[useQuizGame] Socket disconnected:",
          reason,
        );

        setConnected(false);

        setRoomJoined(false);
        roomJoinedRef.current =
          false;

        setQuestionStarted(false);
        questionStartedRef.current =
          false;
      };

    const handleConnectError =
      (socketError: Error) => {
        console.error(
          "[useQuizGame] Socket connection error:",
          socketError,
        );

        setConnected(false);

        reportError(
          socketError.message ||
            "Unable to connect to quiz server.",
        );
      };

    activeSocket.on(
      "connect",
      handleConnect,
    );

    activeSocket.on(
      "disconnect",
      handleDisconnect,
    );

    activeSocket.on(
      "connect_error",
      handleConnectError,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.ROOM_STATE,
      handleRoomState,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.JOINED_ROOM_ACK,
      handleJoinedRoom,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.ROOM_ACTIVATED,
      handleRoomActivated,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.ROOM_ACTIVATION_ACK,
      handleRoomActivationAck,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.PARTICIPANT_JOINED_ROOM,
      handleParticipantJoined,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.PARTICIPANT_LEFT_ROOM,
      handleParticipantLeft,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.ROUND_STARTED,
      handleRoundStarted,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.ROUND_COMPLETED,
      handleRoundCompleted,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.QUESTION_STARTED,
      handleQuestionStarted,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.QUESTION_LOCKED,
      handleQuestionLocked,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.QUESTION_COMPLETED,
      handleQuestionCompleted,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.ANSWER_RESULT,
      handleAnswerResult,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.FIRST_CORRECT_ANSWER,
      handleFirstCorrectAnswer,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.LEADERBOARD_UPDATED,
      handleLeaderboardUpdated,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.PARTICIPANTS_ELIMINATED,
      handleParticipantsEliminated,
    );

    activeSocket.on(
      QUIZ_GAME_EVENTS.SOCKET_ERROR,
      handleSocketError,
    );

    if (
      activeSocket.connected
    ) {
      handleConnect();
    }

    return () => {
      activeSocket.off(
        "connect",
        handleConnect,
      );

      activeSocket.off(
        "disconnect",
        handleDisconnect,
      );

      activeSocket.off(
        "connect_error",
        handleConnectError,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.ROOM_STATE,
        handleRoomState,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.JOINED_ROOM_ACK,
        handleJoinedRoom,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.ROOM_ACTIVATED,
        handleRoomActivated,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.ROOM_ACTIVATION_ACK,
        handleRoomActivationAck,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.PARTICIPANT_JOINED_ROOM,
        handleParticipantJoined,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.PARTICIPANT_LEFT_ROOM,
        handleParticipantLeft,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.ROUND_STARTED,
        handleRoundStarted,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.ROUND_COMPLETED,
        handleRoundCompleted,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.QUESTION_STARTED,
        handleQuestionStarted,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.QUESTION_LOCKED,
        handleQuestionLocked,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.QUESTION_COMPLETED,
        handleQuestionCompleted,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.ANSWER_RESULT,
        handleAnswerResult,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.FIRST_CORRECT_ANSWER,
        handleFirstCorrectAnswer,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.LEADERBOARD_UPDATED,
        handleLeaderboardUpdated,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.PARTICIPANTS_ELIMINATED,
        handleParticipantsEliminated,
      );

      activeSocket.off(
        QUIZ_GAME_EVENTS.SOCKET_ERROR,
        handleSocketError,
      );

      /*
       * Do not disconnect here.
       *
       * getQuizSocket() is a singleton and owns
       * the actual socket lifecycle.
       */
    };
  }, [
    quizId,
    roomId,
    role,
    autoJoin,

    reportError,

    handleRoomState,
    handleJoinedRoom,
    handleRoomActivated,
    handleRoomActivationAck,

    handleParticipantJoined,
    handleParticipantLeft,

    handleRoundStarted,
    handleRoundCompleted,

    handleQuestionStarted,
    handleQuestionLocked,
    handleQuestionCompleted,

    handleAnswerResult,
    handleFirstCorrectAnswer,

    handleLeaderboardUpdated,
    handleParticipantsEliminated,

    handleSocketError,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Explicit room join                                                     */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      !autoJoin ||
      !connected ||
      !roomId ||
      roomJoined
    ) {
      return;
    }

    joinRoom();
  }, [
    autoJoin,
    connected,
    roomId,
    roomJoined,
    joinRoom,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Start round                                                             */
  /* ---------------------------------------------------------------------- */

  const startRound =
    useCallback(
      (roundNumber?: number) => {
        const activeSocket =
          socketRef.current;

        if (
          !activeSocket?.connected
        ) {
          reportError(
            "Quiz socket is not connected.",
          );
          return;
        }

        if (!roomId) {
          reportError(
            "No quiz room ID was provided.",
          );
          return;
        }

        if (
          !isHost(roleRef.current)
        ) {
          reportError(
            "Only the host can start a round.",
          );
          return;
        }

        if (
          !roomJoinedRef.current
        ) {
          reportError(
            "The host has not joined the quiz room.",
          );
          return;
        }

        if (
          !roomActivatedRef.current
        ) {
          reportError(
            "The quiz room has not been activated.",
          );
          return;
        }

        const nextRound =
          roundNumber ??
          currentRoundRef.current ??
          initialRound;

        if (
          !Number.isFinite(
            nextRound,
          ) ||
          nextRound < 1
        ) {
          reportError(
            "Invalid round number.",
          );
          return;
        }

        const payload:
          StartRoundPayload = {
            roomId,
            quizId,
            roundNumber:
              Math.floor(nextRound),
          };

        console.log(
          "[useQuizGame] start_round:",
          payload,
        );

        setActionLoading(true);

        activeSocket.emit(
          QUIZ_GAME_EVENTS.START_ROUND,
          payload,
        );
      },
      [
        quizId,
        roomId,
        initialRound,
        reportError,
      ],
    );

  /* ---------------------------------------------------------------------- */
  /* Start question                                                          */
  /* ---------------------------------------------------------------------- */

  const startQuestion =
    useCallback(
      (
        question: QuizGameQuestion,
        timeLimit =
          DEFAULT_QUESTION_TIME_LIMIT,
      ) => {
        const activeSocket =
          socketRef.current;

        if (
          !activeSocket?.connected
        ) {
          reportError(
            "Quiz socket is not connected.",
          );
          return;
        }

        if (!roomId) {
          reportError(
            "No quiz room ID was provided.",
          );
          return;
        }

        if (
          !isHost(roleRef.current)
        ) {
          reportError(
            "Only the host can start a question.",
          );
          return;
        }

        if (
          !roomJoinedRef.current
        ) {
          reportError(
            "The host has not joined the quiz room.",
          );
          return;
        }

        if (
          !roomActivatedRef.current
        ) {
          reportError(
            "The quiz room has not been activated.",
          );
          return;
        }

        if (
          questionStartedRef.current
        ) {
          reportError(
            "A question is already running.",
          );
          return;
        }

        const questionId =
          question.id;

        const questionNumber =
          question.questionNumber;

        if (!questionId) {
          reportError(
            "The selected question has no ID.",
          );
          return;
        }

        if (
          typeof questionNumber !==
            "number" ||
          questionNumber < 1
        ) {
          reportError(
            "The selected question has no valid question number.",
          );
          return;
        }

        const normalizedTimeLimit =
          Number.isFinite(
            timeLimit,
          )
            ? Math.max(
                1,
                Math.floor(
                  timeLimit,
                ),
              )
            : DEFAULT_QUESTION_TIME_LIMIT;

        const payload:
          StartQuestionPayload = {
            roomId,
            quizId,
            roundNumber:
              currentRoundRef.current,
            questionNumber,
            questionId,
            timeLimit:
              normalizedTimeLimit,
          };

        console.log(
          "[useQuizGame] start_question:",
          payload,
        );

        /*
         * Store the selected question locally.
         *
         * This does NOT mean the question has started.
         * The server's question_started event remains
         * authoritative.
         */
        setCurrentQuestionData(
          question,
        );

        currentQuestionDataRef.current =
          question;

        setActionLoading(true);

        activeSocket.emit(
          QUIZ_GAME_EVENTS.START_QUESTION,
          payload,
        );
      },
      [
        quizId,
        roomId,
        reportError,
      ],
    );

  /* ---------------------------------------------------------------------- */
  /* Lock question                                                           */
  /* ---------------------------------------------------------------------- */

  const lockQuestion =
    useCallback(() => {
      const activeSocket =
        socketRef.current;

      if (
        !activeSocket?.connected
      ) {
        reportError(
          "Quiz socket is not connected.",
        );
        return;
      }

      if (!roomId) {
        reportError(
          "No quiz room ID was provided.",
        );
        return;
      }

      if (
        !isHost(roleRef.current)
      ) {
        reportError(
          "Only the host can lock a question.",
        );
        return;
      }

      if (
        !roomJoinedRef.current
      ) {
        reportError(
          "The host has not joined the quiz room.",
        );
        return;
      }

      if (
        !questionStartedRef.current
      ) {
        reportError(
          "No question is currently running.",
        );
        return;
      }

      if (
        questionLockedRef.current
      ) {
        return;
      }

      const questionNumber =
        currentQuestionRef.current
          ?.questionNumber ??
        currentQuestionDataRef.current
          ?.questionNumber ??
        undefined;

      /*
       * The shared payload accepts
       * number | undefined, not null.
       */
      const payload:
        LockQuestionPayload = {
          roomId,
          quizId,
          roundNumber:
            currentRoundRef.current,
          questionNumber:
            typeof questionNumber ===
              "number"
              ? questionNumber
              : undefined,
        };

      console.log(
        "[useQuizGame] lock_question:",
        payload,
      );

      setActionLoading(true);

      activeSocket.emit(
        QUIZ_GAME_EVENTS.LOCK_QUESTION,
        payload,
      );
    }, [
      quizId,
      roomId,
      reportError,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Next question                                                           */
  /* ---------------------------------------------------------------------- */

  const nextQuestion =
    useCallback(() => {
      const activeSocket =
        socketRef.current;

      if (
        !activeSocket?.connected
      ) {
        reportError(
          "Quiz socket is not connected.",
        );
        return;
      }

      if (!roomId) {
        reportError(
          "No quiz room ID was provided.",
        );
        return;
      }

      if (
        !isHost(roleRef.current)
      ) {
        reportError(
          "Only the host can advance the quiz.",
        );
        return;
      }

      if (
        !roomJoinedRef.current
      ) {
        reportError(
          "The host has not joined the quiz room.",
        );
        return;
      }

      if (
        !questionLockedRef.current
      ) {
        reportError(
          "Lock the current question before moving to the next question.",
        );
        return;
      }

      const questionNumber =
        currentQuestionRef.current
          ?.questionNumber ??
        currentQuestionDataRef.current
          ?.questionNumber ??
        undefined;

      /*
       * number | null | undefined is converted
       * to number | undefined.
       */
      const payload:
        NextQuestionPayload = {
          roomId,
          quizId,
          roundNumber:
            currentRoundRef.current,
          questionNumber:
            typeof questionNumber ===
              "number"
              ? questionNumber
              : undefined,
        };

      console.log(
        "[useQuizGame] next_question:",
        payload,
      );

      setActionLoading(true);

      activeSocket.emit(
        QUIZ_GAME_EVENTS.NEXT_QUESTION,
        payload,
      );
    }, [
      quizId,
      roomId,
      reportError,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Submit answer                                                           */
  /* ---------------------------------------------------------------------- */

  const submitAnswer =
    useCallback(
      (answer: string) => {
        const activeSocket =
          socketRef.current;

        if (
          !activeSocket?.connected
        ) {
          reportError(
            "Quiz socket is not connected.",
          );
          return;
        }

        if (!roomId) {
          reportError(
            "No quiz room ID was provided.",
          );
          return;
        }

        if (
          !isContestant(
            roleRef.current,
          )
        ) {
          reportError(
            "Only contestants can submit answers.",
          );
          return;
        }

        if (
          !roomJoinedRef.current
        ) {
          reportError(
            "You have not joined the quiz room.",
          );
          return;
        }

        if (
          !questionStartedRef.current
        ) {
          reportError(
            "There is no active question.",
          );
          return;
        }

        if (
          questionLockedRef.current
        ) {
          reportError(
            "This question is locked.",
          );
          return;
        }

        if (
          answerSubmittedRef.current
        ) {
          return;
        }

        /*
         * Use currentQuestionData here.
         *
         * QuizCurrentQuestion.question is nullable
         * in the shared model. The normalized live
         * question is already stored separately and
         * is the correct source for submission.
         */
        const question =
          currentQuestionDataRef.current;

        if (!question) {
          reportError(
            "No current question is available.",
          );
          return;
        }

        const questionNumber =
          question.questionNumber;

        if (
          typeof questionNumber !==
            "number" ||
          questionNumber < 1
        ) {
          reportError(
            "The current question number is invalid.",
          );
          return;
        }

        const normalizedAnswer =
          answer.trim();

        if (!normalizedAnswer) {
          reportError(
            "Please select an answer.",
          );
          return;
        }

        const payload:
          SubmitAnswerPayload = {
            roomId,
            quizId,
            roundNumber:
              currentRoundRef.current,
            questionNumber,
            questionId:
              question.id,
            answer:
              normalizedAnswer,
          };

        console.log(
          "[useQuizGame] submit_answer:",
          payload,
        );

        /*
         * Optimistic local selection only.
         *
         * Correctness remains server-authoritative.
         */
        setSelectedAnswer(
          normalizedAnswer,
        );

        setAnswerSubmitted(true);
        answerSubmittedRef.current =
          true;

        activeSocket.emit(
          QUIZ_GAME_EVENTS.SUBMIT_ANSWER,
          payload,
        );
      },
      [
        quizId,
        roomId,
        reportError,
      ],
    );

  /* ---------------------------------------------------------------------- */
  /* Reset local question                                                   */
  /* ---------------------------------------------------------------------- */

  const resetQuestion =
    useCallback(() => {
      setCurrentQuestion(null);
      currentQuestionRef.current =
        null;

      setCurrentQuestionData(null);
      currentQuestionDataRef.current =
        null;

      setQuestionStarted(false);
      questionStartedRef.current =
        false;

      setQuestionLocked(false);
      questionLockedRef.current =
        false;

      setSelectedAnswer(null);

      setAnswerSubmitted(false);
      answerSubmittedRef.current =
        false;

      setActionLoading(false);
    }, []);

  /* ---------------------------------------------------------------------- */
  /* Refresh room                                                            */
  /* ---------------------------------------------------------------------- */

  const refreshRoom =
    useCallback(() => {
      const activeSocket =
        socketRef.current;

      if (!activeSocket) {
        return;
      }

      if (
        !activeSocket.connected
      ) {
        activeSocket.connect();
        return;
      }

      if (
        roomId &&
        !roomJoinedRef.current
      ) {
        joinRoom();
      }
    }, [
      roomId,
      joinRoom,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Derived permissions                                                    */
  /* ---------------------------------------------------------------------- */

  const canStartRound =
    useMemo(
      () =>
        connected &&
        roomJoined &&
        roomActivated &&
        isHost(role) &&
        !actionLoading,
      [
        connected,
        roomJoined,
        roomActivated,
        role,
        actionLoading,
      ],
    );

  const canStartQuestion =
    useMemo(
      () =>
        connected &&
        roomJoined &&
        roomActivated &&
        isHost(role) &&
        Boolean(
          currentQuestionData,
        ) &&
        !questionStarted &&
        !actionLoading,
      [
        connected,
        roomJoined,
        roomActivated,
        role,
        currentQuestionData,
        questionStarted,
        actionLoading,
      ],
    );

  const canLockQuestion =
    useMemo(
      () =>
        connected &&
        roomJoined &&
        isHost(role) &&
        questionStarted &&
        !questionLocked &&
        !actionLoading,
      [
        connected,
        roomJoined,
        role,
        questionStarted,
        questionLocked,
        actionLoading,
      ],
    );

  const canNextQuestion =
    useMemo(
      () =>
        connected &&
        roomJoined &&
        isHost(role) &&
        questionLocked &&
        !actionLoading,
      [
        connected,
        roomJoined,
        role,
        questionLocked,
        actionLoading,
      ],
    );

  const canAnswer =
    useMemo(
      () =>
        connected &&
        roomJoined &&
        isContestant(role) &&
        questionStarted &&
        !questionLocked &&
        !answerSubmitted,
      [
        connected,
        roomJoined,
        role,
        questionStarted,
        questionLocked,
        answerSubmitted,
      ],
    );

  /* ---------------------------------------------------------------------- */
  /* Shared state                                                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setState(
      (previous) =>
        ({
          ...previous,

          role,

          connectionStatus:
            connected
              ? "CONNECTED"
              : "DISCONNECTED",

          roomId:
            roomId ??
            previous.roomId,

          quizId,

          currentRound,

          participants,

          leaderboard,

          currentQuestion,

          questionStarted,

          questionLocked,

          selectedAnswer,

          answerSubmitted,

          error,

          actionLoading,
        }) as QuizGameState,
    );
  }, [
    role,
    connected,
    roomId,
    quizId,
    currentRound,
    participants,
    leaderboard,
    currentQuestion,
    questionStarted,
    questionLocked,
    selectedAnswer,
    answerSubmitted,
    error,
    actionLoading,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Reset when room changes                                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setRoomJoined(false);
    roomJoinedRef.current =
      false;

    setRoomActivated(false);
    roomActivatedRef.current =
      false;

    setCurrentRound(
      initialRound,
    );
    currentRoundRef.current =
      initialRound;

    setCurrentQuestion(null);
    currentQuestionRef.current =
      null;

    setCurrentQuestionData(null);
    currentQuestionDataRef.current =
      null;

    setQuestionStarted(false);
    questionStartedRef.current =
      false;

    setQuestionLocked(false);
    questionLockedRef.current =
      false;

    setSelectedAnswer(null);

    setAnswerSubmitted(false);
    answerSubmittedRef.current =
      false;

    setParticipants([]);
    setLeaderboard([]);

    setError(null);
    setActionLoading(false);
    setLoading(false);
  }, [
    quizId,
    roomId,
    initialRound,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Spectator protection                                                    */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      isSpectator(role)
    ) {
      setSelectedAnswer(null);

      setAnswerSubmitted(false);
      answerSubmittedRef.current =
        false;
    }
  }, [role]);

  /* ---------------------------------------------------------------------- */
  /* Result                                                                  */
  /* ---------------------------------------------------------------------- */

  return {
    state,

    socket,

    connected,
    roomJoined,
    roomActivated,

    currentRound,

    currentQuestion,
    currentQuestionData,

    participants,
    leaderboard,

    questionStarted,
    questionLocked,

    selectedAnswer,
    answerSubmitted,

    actionLoading,
    loading,
    error,

    canStartRound,
    canStartQuestion,
    canLockQuestion,
    canNextQuestion,
    canAnswer,

    joinRoom,

    startRound,
    startQuestion,

    lockQuestion,

    nextQuestion,

    submitAnswer,

    resetQuestion,

    clearError,

    refreshRoom,
  };
}

export default useQuizGame;
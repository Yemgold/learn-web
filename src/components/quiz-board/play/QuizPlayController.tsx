
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";

import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/api/axios";

import {
  getQuizCurrentRound,
  getQuizId,
  getQuizNumberOfRounds,
  getQuizRoomId,
  getQuizTimePerQuestion,
  getQuizTitle,
  type Quiz,
} from "@/types/quiz-board/quiz";

import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import HostQuizShow from "@/components/quiz-board/host/HostQuizShow";
import type { HostQuestionListItem } from "@/components/quiz-board/host/HostQuestionList";
import type { HostQuestionPreviewQuestion } from "@/components/quiz-board/host/HostQuestionPreview";

import SpectatorQuizShow from "@/components/quiz-board/spectator/SpectatorQuizShow";
import ContestantQuizShow from "@/components/quiz-board/contestant/ContestantQuizShow";

import { useQuizSocket } from "@/hooks/quiz-board/useQuizSocket";
import { useQuizRoomFallback } from "@/hooks/quiz-board/useQuizRoomFallback";

import { createQuizGameHttpController } from "@/lib/quiz-board/host/quizGameHttp";

/* =========================================================
   PROPS
========================================================= */

export interface QuizPlayControllerProps {
  quizId: string;
  requestedRole?: string | null;
  requestedRoomId?: string | null;
}

/* =========================================================
   DIAGNOSTIC HELPERS
========================================================= */

const DEBUG_QUIZ_PLAY = true;

function debugLog(message: string, data?: unknown) {
  if (!DEBUG_QUIZ_PLAY) return;

  if (data === undefined) {
    console.log(`[QuizPlayController] ${message}`);
  } else {
    console.log(`[QuizPlayController] ${message}`, data);
  }
}

function debugWarn(message: string, data?: unknown) {
  if (data === undefined) {
    console.warn(`[QuizPlayController] ${message}`);
  } else {
    console.warn(`[QuizPlayController] ${message}`, data);
  }
}

function debugError(message: string, data?: unknown) {
  console.error(`[QuizPlayController] ${message}`, data);
}

function getNumber(
  value: unknown,
  fallback: number | null = null,
): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function readStoredUser(): any {
  if (typeof window === "undefined") return null;

  const keys = [
    "user",
    "auth-user",
    "jamb_user",
    "jamb_auth_user",
  ];

  for (const key of keys) {
    try {
      const value = window.localStorage.getItem(key);

      if (value) return JSON.parse(value);
    } catch {
      // Ignore malformed storage.
    }
  }

  return null;
}

function getApplicationRole(user: any): string {
  return String(
    user?.role ??
      user?.userRole ??
      user?.user_role ??
      user?.accountType ??
      user?.account_type ??
      "",
  ).toUpperCase();
}

function getSocketRole(
  user: any,
  requestedRole: string | null,
): QuizGameRole {
  const requested = requestedRole?.trim().toLowerCase();

  if (requested === "spectator") return "SPECTATOR";
  if (requested === "host") return "HOST";
  if (requested === "contestant") return "CONTESTANT";

  const applicationRole = getApplicationRole(user);

  if (
    applicationRole === "ADMIN" ||
    applicationRole === "HOST"
  ) {
    return "HOST";
  }

  return "CONTESTANT";
}

/* =========================================================
   ERROR DIAGNOSTICS
========================================================= */

function getErrorMessage(
  err: any,
  fallback: string,
): string {
  const candidates = [
    err?.response?.data?.message,
    err?.response?.data?.error,
    err?.data?.message,
    err?.message,
  ];

  const message = candidates.find(
    (value) =>
      typeof value === "string" && value.trim().length > 0,
  );

  return typeof message === "string" ? message : fallback;
}

function describeError(err: any) {
  return {
    name: err?.name ?? null,
    message: err?.message ?? String(err),
    code: err?.code ?? null,

    httpStatus:
      err?.response?.status ??
      err?.status ??
      null,

    responseData:
      err?.response?.data ??
      err?.data ??
      null,

    responseHeaders:
      err?.response?.headers ?? null,

    requestExists: Boolean(err?.request),

    axiosError: Boolean(err?.isAxiosError),

    stack:
      err instanceof Error ? err.stack : null,
  };
}

/* =========================================================
   RESPONSE NORMALIZATION

   Supports common API envelope shapes without assuming
   that the backend uses one specific nesting structure.
========================================================= */

function unwrapApiResponse(result: any): any {
  let payload = result;

  for (let depth = 0; depth < 5; depth += 1) {
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      break;
    }

    // Never unwrap a recognized question container.
    const containsQuestions = [
      "questions",
      "questionObj",
      "roundQuestions",
      "round_questions",
      "questionList",
      "question_list",
    ].some((key) => payload[key] !== undefined);

    if (containsQuestions) break;

    // Do not unwrap individual question objects.
    if (
      payload.question !== undefined ||
      payload.questionText !== undefined ||
      payload.question_text !== undefined
    ) {
      break;
    }

    const next =
      payload.data ??
      payload.result ??
      payload.payload;

    if (next === undefined || next === payload) break;

    payload = next;
  }

  return payload;
}

function isRecord(value: unknown): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function getQuestionText(item: any): string {
  const value =
    item?.question ??
    item?.questionText ??
    item?.question_text ??
    item?.text ??
    item?.content ??
    item?.title;

  if (typeof value === "string") {
    return value.trim();
  }

  // Some APIs wrap question text in an object.
  if (isRecord(value)) {
    const nested =
      value.text ??
      value.content ??
      value.question ??
      value.value;

    if (typeof nested === "string") {
      return nested.trim();
    }
  }

  return "";
}

function isQuestionLike(item: any): boolean {
  if (!isRecord(item)) return false;

  return Boolean(
    getQuestionText(item) ||
      Array.isArray(item.options) ||
      Array.isArray(item.answers) ||
      Array.isArray(item.choices),
  );
}

function extractRoundQuestions(payload: any): any[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const questionKeys = [
    "questions",
    "questionObj",
    "roundQuestions",
    "round_questions",
    "questionList",
    "question_list",
    "quizQuestions",
    "quiz_questions",
  ];

  // Prefer explicitly named question arrays.
  for (const key of questionKeys) {
    const candidate = payload[key];

    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  // Support nested round and quiz response envelopes.
  const nestedKeys = [
    "data",
    "result",
    "payload",
    "round",
    "quiz",
    "quizData",
    "quiz_data",
    "roundData",
    "round_data",
  ];

  for (const key of nestedKeys) {
    const candidate = payload[key];

    if (!isRecord(candidate)) continue;

    const nestedQuestions = extractRoundQuestions(candidate);

    if (nestedQuestions.length > 0) {
      return nestedQuestions;
    }

    // Preserve explicitly returned empty arrays too, so the
    // caller can report an empty round rather than a bad shape.
    const hasExplicitQuestionArray = questionKeys.some(
      (questionKey) =>
        Array.isArray(candidate[questionKey]),
    );

    if (hasExplicitQuestionArray) {
      return [];
    }
  }

  // Some APIs return an array directly under another property.
  // Only accept arrays whose contents look like questions.
  for (const [key, candidate] of Object.entries(payload)) {
    if (
      Array.isArray(candidate) &&
      candidate.length > 0 &&
      candidate.some(isQuestionLike)
    ) {
      debugWarn(
        "Found a possible question array under an unexpected property.",
        { property: key, count: candidate.length },
      );

      return candidate;
    }
  }

  return [];
}

function summarizePayload(payload: any) {
  if (Array.isArray(payload)) {
    return {
      type: "array",
      length: payload.length,
      firstItemKeys: isRecord(payload[0])
        ? Object.keys(payload[0])
        : [],
    };
  }

  if (!isRecord(payload)) {
    return {
      type: typeof payload,
      value: payload ?? null,
    };
  }

  return {
    type: "object",
    keys: Object.keys(payload),
    dataKeys: isRecord(payload.data)
      ? Object.keys(payload.data)
      : [],
    roundKeys: isRecord(payload.round)
      ? Object.keys(payload.round)
      : [],
    quizKeys: isRecord(payload.quiz)
      ? Object.keys(payload.quiz)
      : [],
  };
}

/* =========================================================
   QUESTION NORMALIZATION

   Keep the host's question-list shape.
   Do not use this list as a contestant broadcast payload.
========================================================= */

function normalizeQuestion(
  item: any,
  index: number,
  fallbackTimeLimit: number,
): HostQuestionListItem | null {
  if (!isRecord(item)) {
    debugWarn("Skipping a non-object question.", {
      index,
      receivedType: typeof item,
    });

    return null;
  }

  const question = getQuestionText(item);

  if (!question) {
    debugWarn("Skipping a question with no recognizable text.", {
      index,
      keys: Object.keys(item),
      id: item.id ?? item._id ?? null,
    });

    return null;
  }

  const rawOptions =
    Array.isArray(item.options)
      ? item.options
      : Array.isArray(item.choices)
        ? item.choices
        : Array.isArray(item.answers)
          ? item.answers
          : [];

  const options = rawOptions.map((option: any, optionIndex: number) => {
    if (typeof option === "string") {
      return {
        label: String.fromCharCode(65 + optionIndex),
        value: option,
      };
    }

    if (!isRecord(option)) {
      return {
        label: String.fromCharCode(65 + optionIndex),
        value: String(option ?? ""),
      };
    }

    return {
      ...option,
      label:
        option.label ??
        option.key ??
        option.optionLabel ??
        option.option_label ??
        String.fromCharCode(65 + optionIndex),
      value:
        option.value ??
        option.text ??
        option.answer ??
        option.option ??
        "",
    };
  });

  const questionNumber =
    getNumber(
      item.questionNumber ??
        item.question_number ??
        item.number ??
        item.sequence,
      index + 1,
    ) ?? index + 1;

  const timeLimit = getNumber(
    item.timeLimit ??
      item.time_limit ??
      item.duration ??
      item.timePerQuestion ??
      item.time_per_question,
    null,
  );

  return {
    id: String(
      item.id ??
        item._id ??
        item.questionId ??
        item.question_id ??
        `question-${index + 1}`,
    ),

    questionNumber,
    question,
    options,

    timeLimit:
      timeLimit !== null && timeLimit > 0
        ? timeLimit
        : fallbackTimeLimit,

    status: item.status ?? "READY",

    answeredCount:
      getNumber(
        item.answeredCount ?? item.answered_count,
        0,
      ) ?? 0,

    correctCount:
      getNumber(
        item.correctCount ?? item.correct_count,
        0,
      ) ?? 0,
  };
}

/* =========================================================
   PREVIEW QUESTION
========================================================= */

function createPreviewQuestion(
  item: HostQuestionListItem,
): HostQuestionPreviewQuestion {
  return {
    id: item.id,
    questionNumber: item.questionNumber,
    question: item.question,

    options: Array.isArray(item.options)
      ? item.options.map((option: any) => ({
          label:
            option?.label ??
            option?.text ??
            "",

          value:
            option?.value ??
            option?.answer ??
            option?.text ??
            "",

          isCorrect:
            option?.isCorrect ??
            option?.is_correct,
        }))
      : [],

    timeLimit: item.timeLimit,
    status: item.status,
    answeredCount: item.answeredCount,
    correctCount: item.correctCount,
  };
}

/* =========================================================
   QUIZ PLAY CONTROLLER
========================================================= */

export default function QuizPlayController({
  quizId,
  requestedRole = null,
  requestedRoomId = null,
}: QuizPlayControllerProps) {
  const router = useRouter();

  /* QUIZ STATE */

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [role, setRole] = useState<QuizGameRole | null>(null);

  const [currentRound, setCurrentRound] = useState(1);

  const [questions, setQuestions] = useState<
    HostQuestionListItem[]
  >([]);

  const [selectedQuestion, setSelectedQuestion] =
    useState<HostQuestionPreviewQuestion | null>(null);

  const [questionLoading, setQuestionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [questionError, setQuestionError] =
    useState<string | null>(null);

  /* REFS */

  const selectedQuestionRef =
    useRef<HostQuestionPreviewQuestion | null>(null);

  const currentRoundRef = useRef(1);
  const liveQuestionRef = useRef<any>(null);

  // Prevent an old request from overwriting a newer round.
  const questionRequestIdRef = useRef(0);

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    selectedQuestionRef.current = selectedQuestion;
  }, [selectedQuestion]);

  /* TIME LIMIT */

  const quizTimeLimit = useMemo(() => {
    if (!quiz) return 30;

    try {
      const parsed = Number(getQuizTimePerQuestion(quiz));

      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    } catch (err) {
      debugWarn("Unable to determine quiz time limit.", err);
    }

    return 30;
  }, [quiz]);

  /* ROOM ID */

  const roomId = useMemo(() => {
    const urlRoomId = requestedRoomId?.trim();

    if (urlRoomId) return urlRoomId;
    if (!quiz) return null;

    const quizRoomId = getQuizRoomId(quiz);

    return quizRoomId ? String(quizRoomId).trim() : null;
  }, [requestedRoomId, quiz]);

  /* SHARED HTTP CONTROLLER */

  const quizHttpController = useMemo(
    () =>
      createQuizGameHttpController(
        quizId,
        roomId ?? undefined,
      ),
    [quizId, roomId],
  );

  /* LOAD QUIZ METADATA */

  const loadQuiz = useCallback(async () => {
    if (!quizId) {
      setError("Missing quiz ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      debugLog("Loading quiz metadata.", { quizId });

      const response = await axiosInstance.get(
        `/quiz/get-quiz-by-quizId/${encodeURIComponent(quizId)}`,
      );

      const body = response?.data;

      const rawQuiz =
        body?.data?.quiz ??
        body?.data ??
        body?.quiz ??
        body;

      debugLog("Quiz metadata response received.", {
        status: response?.status,
        payload: summarizePayload(rawQuiz),
      });

      if (!rawQuiz || typeof rawQuiz !== "object") {
        throw new Error(
          "Quiz competition could not be found in the API response.",
        );
      }

      let normalizedTimePerQuestion = 30;

      try {
        const parsed = Number(
          getQuizTimePerQuestion(rawQuiz),
        );

        if (Number.isFinite(parsed) && parsed > 0) {
          normalizedTimePerQuestion = parsed;
        }
      } catch (err) {
        debugWarn("Unable to normalize quiz time.", err);
      }

      const normalizedQuiz = {
        ...rawQuiz,

        id: getQuizId({
          id: rawQuiz.id ?? rawQuiz._id ?? quizId,
          _id: rawQuiz._id,
        }),

        title:
          rawQuiz.title ??
          rawQuiz.quiz_title ??
          "Quiz Competition",

        status: rawQuiz.status ?? "WAITING",

        numberOfRounds: getQuizNumberOfRounds(rawQuiz),

        timePerQuestion: normalizedTimePerQuestion,

        noOfContestants:
          rawQuiz.noOfContestants ??
          rawQuiz.no_of_contestants ??
          20,
      } as Quiz;

      setQuiz(normalizedQuiz);

      const initialRound = Math.max(
        1,
        getQuizCurrentRound(normalizedQuiz) || 1,
      );

      setCurrentRound(initialRound);
      currentRoundRef.current = initialRound;
    } catch (err: any) {
      debugError(
        "Failed to load quiz metadata.",
        describeError(err),
      );

      setError(
        getErrorMessage(err, "Unable to load competition."),
      );
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  /* DETERMINE ROLE */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const user = readStoredUser();
    const resolvedRole = getSocketRole(user, requestedRole);

    debugLog("Role resolved.", {
      requestedRole,
      resolvedRole,
      userRole: getApplicationRole(user),
    });

    setRole(resolvedRole);
  }, [requestedRole]);

  /* LOAD HOST ROUND QUESTIONS */

  const loadRoundQuestions = useCallback(
    async (roundNumber: number) => {
      if (role !== "HOST") return;

      if (!quizId) {
        setQuestionError("Missing quiz ID.");
        return;
      }

      if (!roomId) {
        setQuestionError(
          "Waiting for the active quiz room ID.",
        );
        return;
      }

      if (
        !Number.isFinite(roundNumber) ||
        roundNumber < 1
      ) {
        setQuestionError("Invalid round number.");
        return;
      }

      const requestId = ++questionRequestIdRef.current;

      const requestContext = {
        requestId,
        quizId,
        roomId,
        roundNumber,
      };

      try {
        setQuestionLoading(true);
        setQuestionError(null);

        debugLog("ROUND QUESTIONS REQUEST STARTED", {
          ...requestContext,
          endpointOwner: "quizGameHttp.ts",
        });

        // Keep all round-question HTTP requests inside the
        // shared controller.
        const result =
          await quizHttpController.getRoundQuestions(
            roundNumber,
            roomId,
          );

        // Ignore an obsolete response if another round or
        // room request has started.
        if (requestId !== questionRequestIdRef.current) {
          debugWarn("Ignoring stale round-question response.", {
            ...requestContext,
            latestRequestId: questionRequestIdRef.current,
          });

          return;
        }

        debugLog("ROUND QUESTIONS RAW RESPONSE", {
          ...requestContext,
          result,
          resultType: Array.isArray(result)
            ? "array"
            : typeof result,
          resultKeys: isRecord(result)
            ? Object.keys(result)
            : [],
        });

        const payload = unwrapApiResponse(result);
        const rawQuestions = extractRoundQuestions(payload);

        debugLog("ROUND QUESTIONS PARSED", {
          ...requestContext,
          responseSummary: summarizePayload(payload),
          rawQuestionCount: rawQuestions.length,
          firstQuestionKeys: isRecord(rawQuestions[0])
            ? Object.keys(rawQuestions[0])
            : [],
        });

        if (rawQuestions.length === 0) {
          debugError(
            "The server returned no recognizable questions for this round.",
            {
              ...requestContext,
              payload,
              result,
              responseSummary: summarizePayload(payload),
              possibleCauses: [
                "The endpoint returned an unexpected response shape.",
                "The requested round contains no questions.",
                "quizGameHttp.ts returned undefined.",
                "The backend endpoint does not provide round questions.",
              ],
            },
          );

          setQuestions([]);
          setSelectedQuestion(null);
          selectedQuestionRef.current = null;

          setQuestionError(
            `No questions were found for round ${roundNumber}. Check the browser console for the API response.`,
          );

          return;
        }

        const normalized: HostQuestionListItem[] = [];

        for (let index = 0; index < rawQuestions.length; index += 1) {
          const item = normalizeQuestion(
            rawQuestions[index],
            index,
            quizTimeLimit,
          );

          if (item) normalized.push(item);
        }

        if (normalized.length === 0) {
          debugError(
            "Questions were returned, but none passed frontend validation.",
            {
              ...requestContext,
              rawQuestionCount: rawQuestions.length,
              payload,
              firstQuestion: rawQuestions[0],
            },
          );

          setQuestions([]);
          setSelectedQuestion(null);
          selectedQuestionRef.current = null;

          setQuestionError(
            `Round ${roundNumber} returned ${rawQuestions.length} question records, but none had recognizable question text. Check the console for the original records.`,
          );

          return;
        }

        // Only commit data from the latest request.
        if (requestId !== questionRequestIdRef.current) return;

        setQuestions(normalized);

        const existingNumber =
          selectedQuestionRef.current?.questionNumber;

        const selected =
          normalized.find(
            (item) => item.questionNumber === existingNumber,
          ) ??
          normalized[0] ??
          null;

        if (!selected) {
          setSelectedQuestion(null);
          selectedQuestionRef.current = null;

          setQuestionError(
            `No usable question is available for round ${roundNumber}.`,
          );

          return;
        }

        const preview = createPreviewQuestion(selected);

        setSelectedQuestion(preview);
        selectedQuestionRef.current = preview;

        setQuestionError(null);

        debugLog("ROUND QUESTIONS LOADED SUCCESSFULLY", {
          ...requestContext,
          rawQuestionCount: rawQuestions.length,
          normalizedQuestionCount: normalized.length,
          selectedQuestionId: preview.id,
          selectedQuestionNumber: preview.questionNumber,
          optionCount: preview.options.length,
        });
      } catch (err: any) {
        if (requestId !== questionRequestIdRef.current) {
          debugWarn("Ignoring error from a stale question request.", {
            ...requestContext,
            error: describeError(err),
          });

          return;
        }

        const details = describeError(err);

        debugError("FAILED TO LOAD ROUND QUESTIONS", {
          ...requestContext,
          ...details,
          error: details,
          // Some controller errors carry their original payload
          // here even when the Axios response is unavailable.
          controllerResponse: err?.response ?? null,
          controllerData: err?.data ?? null,
          cause: err?.cause ?? null,
        });

        const status = details.httpStatus;

        const message = getErrorMessage(
          err,
          "Unable to load round questions.",
        );

        setQuestionError(
          status
            ? `${message} (HTTP ${status})`
            : `${message} Check the browser console for request diagnostics.`,
        );
      } finally {
        if (requestId === questionRequestIdRef.current) {
          setQuestionLoading(false);
        }
      }
    },
    [
      quizId,
      roomId,
      role,
      quizTimeLimit,
      quizHttpController,
    ],
  );

  /* LOAD QUESTIONS WHEN ROUND OR ROOM CHANGES */

  useEffect(() => {
    if (
      role !== "HOST" ||
      !quiz ||
      !roomId ||
      currentRound < 1
    ) {
      return;
    }

    void loadRoundQuestions(currentRound);
  }, [
    role,
    quiz,
    roomId,
    currentRound,
    loadRoundQuestions,
  ]);

  /* ROUND CHANGE */

  const handleRoundChanged = useCallback(
    (roundNumber: number) => {
      if (
        !Number.isFinite(roundNumber) ||
        roundNumber < 1
      ) {
        debugWarn("Rejected invalid round change.", {
          roundNumber,
        });

        return;
      }

      currentRoundRef.current = roundNumber;
      setCurrentRound(roundNumber);
    },
    [],
  );

  /* SOCKET */

  const socketState = useQuizSocket({
    quizId,
    roomId,
    role,
    currentRound,
    selectedQuestion,

    timeLimit:
      selectedQuestion?.timeLimit ??
      quizTimeLimit,

    onRoundChanged: handleRoundChanged,
  });

  const {
    connected,
    roomJoined,
    roomActivated,

    question,
    currentQuestionNumber,

    questionStarted,
    questionLocked,

    timeLimit,

    selectedAnswer,
    answerSubmitted,

    participants,
    leaderboard,
    feedEvents,

    socketError,
    actionLoading,

    startQuestion,
    lockQuestion,
    nextQuestion,

    selectContestantAnswer,

    fastestWinner,

    setTimeLimit,
    refreshSocketState,

    getQuizRoomLeaderboard,

    enableTopWinnerToSolveTie,
    tieBreakPayload,
    tieBreakLoading,
  } = socketState;

  /* REST FALLBACK */

  const {
    quiz: recoveredQuiz,
    round: recoveredRound,
    loading: fallbackLoading,
    refreshing: fallbackRefreshing,
    usingFallback,
    error: fallbackError,
    lastSyncedAt,
    refresh: refreshFallback,
  } = useQuizRoomFallback({
    quizId,
    roomId,
    currentRound,
    socketConnected: connected,
    enabled: Boolean(quizId && roomId),
    pollIntervalMs: 5000,
  });

  useEffect(() => {
    if (!usingFallback) return;

    debugWarn("REST FALLBACK ACTIVE", {
      quizId,
      roomId,
      currentRound,
      fallbackLoading,
      fallbackRefreshing,
      fallbackError,
      lastSyncedAt,
      recoveredQuizAvailable: Boolean(recoveredQuiz),
      recoveredRoundAvailable: Boolean(recoveredRound),
    });
  }, [
    usingFallback,
    quizId,
    roomId,
    currentRound,
    fallbackLoading,
    fallbackRefreshing,
    fallbackError,
    lastSyncedAt,
    recoveredQuiz,
    recoveredRound,
  ]);

  /* TIE BREAK */

  const handleEnableTieBreak = useCallback(
    (topWinnerId: string) => {
      enableTopWinnerToSolveTie(topWinnerId);
    },
    [enableTopWinnerToSolveTie],
  );

  /* SOCKET QUESTION TRACE */

  useEffect(() => {
    debugLog("SOCKET QUESTION STATE CHANGED", {
      role,
      quizId,
      roomId,

      questionExists: Boolean(question),
      questionId: question?.id ?? null,
      questionText: question?.question ?? null,
      questionNumber: question?.questionNumber ?? null,
      optionCount: question?.options?.length ?? 0,

      questionStarted,
      questionLocked,

      connected,
      roomJoined,
      roomActivated,

      timeLimit,

      startedAt: question?.startedAt ?? null,
      expiresAt: question?.expiresAt ?? null,
    });

    if (question?.id && question?.question) {
      liveQuestionRef.current = question;
    }
  }, [
    question,
    role,
    quizId,
    roomId,
    questionStarted,
    questionLocked,
    connected,
    roomJoined,
    roomActivated,
    timeLimit,
  ]);

  /* DISPLAY QUESTION */

  const displayQuestion =
    question ??
    liveQuestionRef.current ??
    null;

  /* CONTESTANT DISPLAY TRACE */

  useEffect(() => {
    if (role !== "CONTESTANT") return;

    debugLog("CONTESTANT DISPLAY STATE", {
      questionExists: Boolean(displayQuestion),
      questionId: displayQuestion?.id ?? null,
      questionNumber:
        displayQuestion?.questionNumber ?? null,
      optionCount: displayQuestion?.options?.length ?? 0,

      questionStarted,
      questionLocked,

      connected,
      roomJoined,
      roomActivated,

      timeLimit:
        displayQuestion?.timeLimit ?? timeLimit,

      timerStartedAt: displayQuestion?.startedAt ?? null,
      timerExpiresAt: displayQuestion?.expiresAt ?? null,
    });
  }, [
    role,
    displayQuestion,
    questionStarted,
    questionLocked,
    connected,
    roomJoined,
    roomActivated,
    timeLimit,
  ]);

  /* DERIVED QUIZ VALUES */

  const totalRounds = useMemo(
    () => (quiz ? getQuizNumberOfRounds(quiz) : 1),
    [quiz],
  );

  const quizTitle = useMemo(
    () =>
      quiz
        ? getQuizTitle(quiz) ?? "Quiz Competition"
        : "Quiz Competition",
    [quiz],
  );

  const subject = quiz?.subject ?? "Quiz Board";

  /* QUESTION SELECTION */

  const selectQuestion = useCallback(
    (item: HostQuestionListItem) => {
      const preview = createPreviewQuestion(item);

      setSelectedQuestion(preview);
      selectedQuestionRef.current = preview;
    },
    [],
  );

  /* CONTESTANT ANSWER SELECTION */

  const handleContestantSelectAnswer = useCallback(
    (optionId: string) => {
      const normalizedOptionId = String(
        optionId ?? "",
      ).trim();

      if (!normalizedOptionId) {
        debugWarn("Ignoring empty option ID selection.");
        return;
      }

      if (role !== "CONTESTANT") {
        debugWarn("Answer selection ignored: invalid role.", {
          role,
        });
        return;
      }

      if (!connected) {
        debugWarn("Answer selection ignored: socket disconnected.");
        return;
      }

      if (!roomJoined) {
        debugWarn("Answer selection ignored: room not joined.");
        return;
      }

      if (!roomActivated) {
        debugWarn("Answer selection ignored: room not activated.");
        return;
      }

      if (!displayQuestion?.id) {
        debugWarn("Answer selection ignored: no active question.");
        return;
      }

      if (!questionStarted) {
        debugWarn("Answer selection ignored: question not started.");
        return;
      }

      if (questionLocked) {
        debugWarn("Answer selection ignored: question locked.");
        return;
      }

      if (answerSubmitted) {
        debugWarn("Answer selection ignored: already submitted.");
        return;
      }

      debugLog("CONTESTANT OPTION SELECTED", {
        quizId,
        roomId,
        questionId: displayQuestion.id,
        questionNumber:
          displayQuestion.questionNumber ?? null,
        optionId: normalizedOptionId,
      });

      // Submit the option ID, not its displayed text.
      selectContestantAnswer(normalizedOptionId);
    },
    [
      role,
      connected,
      roomJoined,
      roomActivated,
      displayQuestion,
      questionStarted,
      questionLocked,
      answerSubmitted,
      quizId,
      roomId,
      selectContestantAnswer,
    ],
  );



  /* REFRESH */

  const refresh = useCallback(() => {
    debugLog("MANUAL REFRESH REQUESTED", {
      quizId,
      roomId,
      role,
      roundNumber: currentRoundRef.current,
    });

    // Refresh metadata. Updating quiz causes the existing
    // question-loading effect to load the current round once.
    void loadQuiz();

    // Keep Socket.IO room state and REST fallback refreshes.
    // Do not call loadRoundQuestions here because the effect
    // already handles the question fetch.
    refreshSocketState();
    void refreshFallback();
  }, [
    quizId,
    roomId,
    role,
    loadQuiz,
    refreshSocketState,
    refreshFallback,
  ]);

  /* NAVIGATION */

  const back = useCallback(() => {
    router.back();
  }, [router]);

  /* CURRENT USER */

  const currentUser = useMemo(
    () => readStoredUser(),
    [],
  );

  const currentUserId = String(
    currentUser?.id ??
      currentUser?._id ??
      "",
  );

  const currentUserEntry = useMemo(
    () =>
      leaderboard.find(
        (entry: any) =>
          String(
            entry?.userId ??
              entry?.participantId ??
              "",
          ) === currentUserId,
      ) ?? null,
    [leaderboard, currentUserId],
  );

  /* HOST ACTION AVAILABILITY */

  const canStartQuestion =
    connected &&
    roomJoined &&
    roomActivated &&
    Boolean(selectedQuestion) &&
    !questionStarted;

  const canLockQuestion =
    connected &&
    roomJoined &&
    questionStarted &&
    !questionLocked;

  const canNextQuestion =
    connected &&
    roomJoined &&
    questionLocked;

  /* HOST DEBUG */

  useEffect(() => {
    if (role !== "HOST") return;

    debugLog("HOST START CONDITIONS", {
      role,
      connected,
      roomJoined,
      roomActivated,

      selectedQuestion: Boolean(selectedQuestion),
      selectedQuestionNumber:
        selectedQuestion?.questionNumber ?? null,

      questionStarted,
      questionLocked,
      actionLoading,

      canStartQuestion,
      canLockQuestion,
      canNextQuestion,
    });
  }, [
    role,
    connected,
    roomJoined,
    roomActivated,
    selectedQuestion,
    questionStarted,
    questionLocked,
    actionLoading,
    canStartQuestion,
    canLockQuestion,
    canNextQuestion,
  ]);

  /* LOADING */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-sm text-slate-400">
            Loading quiz...
          </p>
        </div>
      </main>
    );
  }

  /* INVALID STATE */

  if (error || !quiz || !role || !roomId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-slate-900 p-6 text-center">
          <h1 className="text-lg font-semibold">
            Unable to load competition
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {error ??
              (!roomId
                ? "No quiz room is available for this competition."
                : "Invalid quiz state.")}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={refresh}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={back}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* HOST */

  if (role === "HOST") {
    return (
      <HostQuizShow
        quizId={quizId}
        roomId={roomId}
        quizTitle={quizTitle}
        subject={subject}
        description={quiz.description ?? ""}
        currentRound={currentRound}
        totalRounds={totalRounds}
        questions={questions}
        selectedQuestionNumber={
          selectedQuestion?.questionNumber ?? null
        }
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={questions.length || null}
        selectedQuestion={selectedQuestion}
        questionStarted={questionStarted}
        questionLocked={questionLocked}
        timeLimit={timeLimit}
        connected={connected}
        roomActivated={roomActivated}
        participants={participants}
        leaderboard={leaderboard}
        loading={loading}
        questionLoading={questionLoading}
        actionLoading={actionLoading}
        error={questionError ?? socketError}
        canStartQuestion={canStartQuestion}
        canLockQuestion={canLockQuestion}
        canNextQuestion={canNextQuestion}
        onBack={back}
        onSelectQuestion={selectQuestion}
        onStartQuestion={startQuestion}
        onLockQuestion={lockQuestion}
        onNextQuestion={nextQuestion}
        onTimeLimitChange={setTimeLimit}
        onRefresh={refresh}
        onBroadcastLeaderboard={() =>
          getQuizRoomLeaderboard(currentRound)
        }
        tieBreakPayload={tieBreakPayload}
        tieBreakLoading={tieBreakLoading}
        onEnableTieBreak={handleEnableTieBreak}
      />
    );
  }

  /* SPECTATOR */

  if (role === "SPECTATOR") {
    const spectatorProps = {
      quizId,
      roomId,
      quizTitle,
      subject,

      description: quiz.description ?? "",

      currentRound,
      totalRounds,

      currentQuestionNumber,

      totalQuestions:
        displayQuestion?.totalQuestions ??
        questions.length ??
        null,

      question: displayQuestion,

      questionStarted,
      questionLocked,

      timeLimit:
        displayQuestion?.timeLimit ??
        timeLimit,

      startedAt: displayQuestion?.startedAt ?? null,
      expiresAt: displayQuestion?.expiresAt ?? null,

      connected,

      connectionStatus: connected
        ? "CONNECTED"
        : "DISCONNECTED",

      roomJoined,
      roomActivated,

      participants,
      leaderboard,
      feedEvents,

      loading,
      questionLoading,

      error: socketError ?? questionError,

      onBack: back,
      onRefresh: refresh,
    } as ComponentProps<typeof SpectatorQuizShow>;

    return <SpectatorQuizShow {...spectatorProps} />;
  }

  /* CONTESTANT */

  const contestantProps = {
    quizId,
    roomId,
    quizTitle,
    subject,

    description: quiz.description ?? "",

    currentRound,
    totalRounds,

    question: displayQuestion,

    selectedAnswer,
    answerSubmitted,

    questionStarted,
    questionLocked,

    connected,
    roomJoined,
    roomActivated,

    timerStartedAt: displayQuestion?.startedAt ?? null,
    timerExpiresAt: displayQuestion?.expiresAt ?? null,

    timeLimit:
      displayQuestion?.timeLimit ??
      timeLimit,

    fastestWinner,

    score: currentUserEntry?.score ?? 0,
    rank: currentUserEntry?.rank ?? null,

    participantCount: participants.length,

    answerStatus: answerSubmitted
      ? "SUBMITTED"
      : questionStarted
        ? "WAITING"
        : "IDLE",

    eliminated: false,

    loading,

    error: socketError,

    onBack: back,

    onSelectAnswer: handleContestantSelectAnswer,
  } as ComponentProps<typeof ContestantQuizShow>;

  return <ContestantQuizShow {...contestantProps} />;
}






"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Loader2,
  Radio,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  getQuizSocket,
  disconnectQuizSocket,
} from "@/lib/socket/quizSocket";

/* ================================================================
   SESSION DATA
   This is the data saved by the waiting room before entering /play.
   ================================================================ */

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

/* ================================================================
   QUESTION TYPES
   ================================================================ */

interface QuizOption {
  label: string;
  value: string;
  text: string;
}

interface LiveQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  questionNumber: number | null;
  totalQuestions: number | null;
}

/* ================================================================
   SOCKET PAYLOAD TYPES
   ================================================================ */

interface SocketRoundStartedPayload {
  quizId?: string;
  quiz_id?: string;

  roomId?: string;
  room_id?: string;

  currentRound?: number;
  current_round?: number;
  round?: number;
  round_number?: number;
  roundNumber?: number;

  question?: unknown;
  data?: unknown;
}

interface SocketJoinedRoomAckPayload {
  success?: boolean;
  message?: string;

  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;
}

type JsonRecord = Record<string, unknown>;

const PLAY_SESSION_PREFIX = "quiz-play-";

/* ================================================================
   POSSIBLE QUESTION FIELD NAMES
   ================================================================ */

const QUESTION_TEXT_KEYS = [
  "question_text",
  "questionText",
  "question",
  "text",
  "prompt",
  "questionTitle",
  "question_title",
];

const OPTION_KEYS = [
  "options",
  "answer_options",
  "answerOptions",
  "choices",
  "answers",
  "question_options",
  "questionOptions",
  "optionsList",
];

const QUESTION_NUMBER_KEYS = [
  "questionNumber",
  "question_number",
  "questionNo",
  "question_no",
  "currentQuestionNumber",
  "current_question_number",
];

const TOTAL_QUESTION_KEYS = [
  "totalQuestions",
  "total_questions",
  "questionCount",
  "question_count",
  "total",
];

/* ================================================================
   HELPERS
   ================================================================ */

function isRecord(value: unknown): value is JsonRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function firstDefined(
  record: JsonRecord,
  keys: string[],
): unknown {
  for (const key of keys) {
    if (
      record[key] !== undefined &&
      record[key] !== null
    ) {
      return record[key];
    }
  }

  return undefined;
}

function toCleanString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return "";
}

function toPositiveNumber(
  value: unknown,
): number | null {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return null;
  }

  return number;
}

/* ================================================================
   OPTION LABEL
   ================================================================ */

function deriveOptionLabel(
  rawLabel: string,
  fallbackIndex: number,
  rawKey?: string,
): string {
  const label = rawLabel.trim();

  if (label) {
    return label;
  }

  if (rawKey) {
    /*
     * Supports:
     *
     * optionA
     * option_A
     * option-A
     * option A
     * answerA
     * choiceA
     *
     * The previous version used [_- ] which TypeScript interpreted
     * as an invalid character range.
     */

    const optionMatch = rawKey.match(
      /(?:option|answer|choice)(?:_|-|\s)?([A-D])$/i,
    );

    if (optionMatch?.[1]) {
      return optionMatch[1].toUpperCase();
    }

    if (/^[A-D]$/i.test(rawKey.trim())) {
      return rawKey.trim().toUpperCase();
    }
  }

  return String.fromCharCode(
    65 + fallbackIndex,
  );
}

/* ================================================================
   NORMALIZE OPTIONS
   ================================================================ */

function normalizeOptions(
  rawOptions: unknown,
): QuizOption[] {
  /* ==============================================================
     ARRAY OPTIONS
     ============================================================== */

  if (Array.isArray(rawOptions)) {
    return rawOptions
      .map((item, index) => {
        /* ----------------------------------------------------------
           String / number option
           ---------------------------------------------------------- */

        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          const text = String(item).trim();

          if (!text) {
            return null;
          }

          return {
            label: String.fromCharCode(
              65 + index,
            ),
            value: text,
            text,
          };
        }

        /* ----------------------------------------------------------
           Object option
           ---------------------------------------------------------- */

        if (!isRecord(item)) {
          return null;
        }

        const rawLabel = toCleanString(
          firstDefined(item, [
            "label",
            "optionLabel",
            "option_label",
            "letter",
            "key",
            "code",
          ]),
        );

        const rawText = toCleanString(
          firstDefined(item, [
            "text",
            "optionText",
            "option_text",
            "content",
            "answer",
            "value",
            "option",
            "name",
            "label",
          ]),
        );

        const rawValue = toCleanString(
          firstDefined(item, [
            "value",
            "optionValue",
            "option_value",
            "id",
            "_id",
            "answer",
            "text",
            "content",
          ]),
        );

        if (!rawText) {
          return null;
        }

        return {
          label: deriveOptionLabel(
            rawLabel,
            index,
          ),
          value:
            rawValue || rawText,
          text: rawText,
        };
      })
      .filter(
        (
          option,
        ): option is QuizOption =>
          option !== null &&
          Boolean(option.text),
      );
  }

  /* ==============================================================
     OBJECT OPTIONS
     ============================================================== */

  if (isRecord(rawOptions)) {
    return Object.entries(rawOptions)
      .map(([key, value], index) => {
        /* ----------------------------------------------------------
           A: "Option text"
           ---------------------------------------------------------- */

        if (
          typeof value === "string" ||
          typeof value === "number"
        ) {
          const text = String(value).trim();

          if (!text) {
            return null;
          }

          return {
            label: deriveOptionLabel(
              "",
              index,
              key,
            ),
            value: key,
            text,
          };
        }

        /* ----------------------------------------------------------
           A: { text, value }
           ---------------------------------------------------------- */

        if (!isRecord(value)) {
          return null;
        }

        const rawLabel = toCleanString(
          firstDefined(value, [
            "label",
            "optionLabel",
            "option_label",
            "letter",
            "key",
            "code",
          ]),
        );

        const rawText = toCleanString(
          firstDefined(value, [
            "text",
            "optionText",
            "option_text",
            "content",
            "answer",
            "value",
            "option",
            "name",
            "label",
          ]),
        );

        const rawValue = toCleanString(
          firstDefined(value, [
            "value",
            "optionValue",
            "option_value",
            "id",
            "_id",
            "answer",
            "text",
            "content",
          ]),
        );

        if (!rawText) {
          return null;
        }

        return {
          label: deriveOptionLabel(
            rawLabel,
            index,
            key,
          ),
          value:
            rawValue || key,
          text: rawText,
        };
      })
      .filter(
        (
          option,
        ): option is QuizOption =>
          option !== null &&
          Boolean(option.text),
      );
  }

  return [];
}

/* ================================================================
   FIND QUESTION IN A RECORD
   ================================================================ */

function buildQuestionFromRecord(
  record: JsonRecord,
): LiveQuestion | null {
  const rawQuestion = firstDefined(
    record,
    QUESTION_TEXT_KEYS,
  );

  /*
   * Supports nested payloads such as:
   *
   * {
   *   question: {
   *     question_text: "...",
   *     options: [...]
   *   }
   * }
   */

  let questionSource:
    | JsonRecord
    | null = null;

  if (isRecord(rawQuestion)) {
    questionSource = rawQuestion;
  }

  const questionText =
    questionSource
      ? toCleanString(
          firstDefined(
            questionSource,
            QUESTION_TEXT_KEYS,
          ),
        )
      : toCleanString(
          rawQuestion,
        );

  /* --------------------------------------------------------------
     First try options on the parent.
     -------------------------------------------------------------- */

  let rawOptions = firstDefined(
    record,
    OPTION_KEYS,
  );

  /* --------------------------------------------------------------
     Then try nested question object.
     -------------------------------------------------------------- */

  if (
    rawOptions === undefined &&
    questionSource
  ) {
    rawOptions = firstDefined(
      questionSource,
      OPTION_KEYS,
    );
  }

  /* --------------------------------------------------------------
     Finally look for direct fields:
     
     optionA
     optionB
     optionC
     optionD

     or:

     A
     B
     C
     D
     -------------------------------------------------------------- */

  if (
    rawOptions === undefined
  ) {
    const optionFields: Record<
      string,
      unknown
    > = {};

    for (const key of Object.keys(
      record,
    )) {
      /*
       * Supports:
       *
       * optionA
       * option_A
       * option-A
       * option A
       *
       * answerA
       * choiceA
       *
       * A
       * B
       * C
       * D
       *
       * The old [_- ] pattern was the source of TS1517.
       */

      if (
        /^(?:option|answer|choice)(?:_|-|\s)?[A-D]$/i.test(
          key,
        ) ||
        /^(?:A|B|C|D)$/i.test(
          key,
        )
      ) {
        optionFields[key] =
          record[key];
      }
    }

    if (
      Object.keys(optionFields)
        .length >= 2
    ) {
      rawOptions =
        optionFields;
    }
  }

  const options =
    normalizeOptions(
      rawOptions,
    );

  if (
    !questionText ||
    options.length < 2
  ) {
    return null;
  }

  /* --------------------------------------------------------------
     Question ID
     -------------------------------------------------------------- */

  const rawId =
    firstDefined(record, [
      "questionId",
      "question_id",
      "id",
      "_id",
      "uuid",
    ]) ??
    (questionSource
      ? firstDefined(
          questionSource,
          [
            "questionId",
            "question_id",
            "id",
            "_id",
            "uuid",
          ],
        )
      : undefined);

  /* --------------------------------------------------------------
     Question number
     -------------------------------------------------------------- */

  const rawQuestionNumber =
    firstDefined(
      record,
      QUESTION_NUMBER_KEYS,
    ) ??
    (questionSource
      ? firstDefined(
          questionSource,
          QUESTION_NUMBER_KEYS,
        )
      : undefined);

  /* --------------------------------------------------------------
     Total questions
     -------------------------------------------------------------- */

  const rawTotalQuestions =
    firstDefined(
      record,
      TOTAL_QUESTION_KEYS,
    ) ??
    (questionSource
      ? firstDefined(
          questionSource,
          TOTAL_QUESTION_KEYS,
        )
      : undefined);

  return {
    id:
      toCleanString(rawId) ||
      `${questionText}-${options
        .map(
          (option) =>
            `${option.label}:${option.value}`,
        )
        .join("|")}`,

    question: questionText,

    options,

    questionNumber:
      toPositiveNumber(
        rawQuestionNumber,
      ),

    totalQuestions:
      toPositiveNumber(
        rawTotalQuestions,
      ),
  };
}

/* ================================================================
   RECURSIVELY SEARCH ANY SOCKET PAYLOAD
   ================================================================ */

function findQuestionInPayload(
  payload: unknown,
  depth = 0,
  seen = new WeakSet<object>(),
): LiveQuestion | null {
  if (
    depth > 7 ||
    payload === null ||
    payload === undefined
  ) {
    return null;
  }

  if (
    typeof payload !== "object"
  ) {
    return null;
  }

  if (seen.has(payload)) {
    return null;
  }

  seen.add(payload);

  /* ==============================================================
     RECORD
     ============================================================== */

  if (isRecord(payload)) {
    /* ------------------------------------------------------------
       First check this object directly.
       ------------------------------------------------------------ */

    const directQuestion =
      buildQuestionFromRecord(
        payload,
      );

    if (directQuestion) {
      return directQuestion;
    }

    /* ------------------------------------------------------------
       Search likely nested locations first.
       ------------------------------------------------------------ */

    const priorityKeys = [
      "question",
      "questionData",
      "question_data",
      "currentQuestion",
      "current_question",
      "questionObj",
      "question_obj",
      "questionObject",
      "question_object",
      "quizQuestion",
      "quiz_question",
      "data",
      "payload",
      "result",
    ];

    for (const key of priorityKeys) {
      if (
        payload[key] ===
        undefined
      ) {
        continue;
      }

      const found =
        findQuestionInPayload(
          payload[key],
          depth + 1,
          seen,
        );

      if (found) {
        return found;
      }
    }

    /* ------------------------------------------------------------
       Then search every other property.
       ------------------------------------------------------------ */

    for (const value of Object.values(
      payload,
    )) {
      const found =
        findQuestionInPayload(
          value,
          depth + 1,
          seen,
        );

      if (found) {
        return found;
      }
    }
  }

  /* ==============================================================
     ARRAY
     ============================================================== */

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found =
        findQuestionInPayload(
          item,
          depth + 1,
          seen,
        );

      if (found) {
        return found;
      }
    }
  }

  return null;
}

/* ================================================================
   ROUND EXTRACTION
   ================================================================ */

function extractRound(
  payload: unknown,
): number | null {
  if (!isRecord(payload)) {
    return null;
  }

  const rawRound =
    firstDefined(
      payload,
      [
        "currentRound",
        "current_round",
        "round",
        "round_number",
        "roundNumber",
      ],
    );

  return toPositiveNumber(
    rawRound,
  );
}

/* ================================================================
   QUIZ ID EXTRACTION
   ================================================================ */

function extractEventQuizId(
  payload: unknown,
): string {
  if (!isRecord(payload)) {
    return "";
  }

  return toCleanString(
    firstDefined(
      payload,
      [
        "quizId",
        "quiz_id",
      ],
    ),
  );
}

/* ================================================================
   PAGE
   ================================================================ */

export default function QuizPlayPage() {
  const params =
    useParams<{
      quizId: string;
    }>();

  const router =
    useRouter();

  /* ==============================================================
     QUIZ ID
     ============================================================== */

  const quizId = useMemo(() => {
    const value =
      params?.quizId;

    if (
      Array.isArray(value)
    ) {
      return String(
        value[0] || "",
      ).trim();
    }

    return String(
      value || "",
    ).trim();
  }, [params]);

  /* ==============================================================
     STATE
     ============================================================== */

  const [session, setSession] =
    useState<QuizPlaySession | null>(
      null,
    );

  const [
    sessionError,
    setSessionError,
  ] = useState("");

  const [
    socketConnected,
    setSocketConnected,
  ] = useState(false);

  const [
    socketRoomJoined,
    setSocketRoomJoined,
  ] = useState(false);

  const [
    socketError,
    setSocketError,
  ] = useState("");

  const [
    lastSocketEvent,
    setLastSocketEvent,
  ] = useState("");

  const [
    currentRound,
    setCurrentRound,
  ] = useState(1);

  const [
    question,
    setQuestion,
  ] = useState<LiveQuestion | null>(
    null,
  );

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState<string | null>(
    null,
  );

  /* ==============================================================
     REFS
     ============================================================== */

  const mountedRef =
    useRef(false);

  const joinedSocketRoomRef =
    useRef<string | null>(
      null,
    );

  const lastQuestionFingerprintRef =
    useRef<string | null>(
      null,
    );

  /* ==============================================================
     APPLY QUESTION
     ============================================================== */

  const applyQuestion =
    useCallback(
      (
        incoming: LiveQuestion,
        eventName: string,
      ) => {
        const fingerprint =
          `${incoming.id}|${incoming.question}|${incoming.options
            .map(
              (option) =>
                `${option.label}:${option.value}:${option.text}`,
            )
            .join("||")}`;

        /*
         * Prevent the same question from being processed twice.
         */

        if (
          lastQuestionFingerprintRef.current ===
          fingerprint
        ) {
          return;
        }

        lastQuestionFingerprintRef.current =
          fingerprint;

        setQuestion(
          incoming,
        );

        setSelectedAnswer(
          null,
        );

        console.log(
          "[Quiz Play Socket] QUESTION DETECTED",
          {
            eventName,
            question:
              incoming,
          },
        );
      },
      [],
    );

  /* ================================================================
     LOAD PLAY SESSION FROM SESSION STORAGE

     IMPORTANT:
     There is NO API REQUEST here.
     ================================================================ */

  useEffect(() => {
    mountedRef.current =
      true;

    if (!quizId) {
      setSessionError(
        "Competition ID is missing from the URL.",
      );

      return () => {
        mountedRef.current =
          false;
      };
    }

    try {
      const stored =
        sessionStorage.getItem(
          `${PLAY_SESSION_PREFIX}${quizId}`,
        );

      if (!stored) {
        setSessionError(
          "Quiz session data was not found. Please return to the waiting room and enter the competition again.",
        );

        return () => {
          mountedRef.current =
            false;
        };
      }

      const parsed =
        JSON.parse(
          stored,
        ) as QuizPlaySession;

      if (
        !parsed ||
        String(
          parsed.quizId,
        ) !== quizId
      ) {
        setSessionError(
          "The saved quiz session does not match this competition.",
        );

        return () => {
          mountedRef.current =
            false;
        };
      }

      setSession(
        parsed,
      );

      const savedRound =
        Number(
          parsed.current_round,
        );

      setCurrentRound(
        Number.isFinite(
          savedRound,
        ) &&
          savedRound > 0
          ? savedRound
          : 1,
      );
    } catch (error) {
      console.error(
        "[Quiz Play] Failed to read session:",
        error,
      );

      setSessionError(
        "Unable to read the quiz session. Please return to the waiting room and try again.",
      );
    }

    return () => {
      mountedRef.current =
        false;
    };
  }, [quizId]);

  /* ================================================================
     SOCKET.IO

     Same socket helper as waiting room.

     NO getQuizById()
     NO get-round-questions()
     ================================================================ */

  useEffect(() => {
    if (
      !session ||
      !quizId
    ) {
      return;
    }

    const roomId =
      session.room_id
        ? String(
            session.room_id,
          ).trim()
        : "";

    if (!roomId) {
      setSocketError(
        "The competition room ID is missing. Please return to the waiting room.",
      );

      return;
    }

    let cancelled =
      false;

    const socket =
      getQuizSocket();

    /* ==============================================================
       CONNECT
       ============================================================== */

    const handleConnect =
      () => {
        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        console.log(
          "[Quiz Play Socket] Connected:",
          socket.id,
        );

        setSocketConnected(
          true,
        );

        setSocketError(
          "",
        );

        /*
         * Join the same room used by the waiting room.
         */

        if (
          joinedSocketRoomRef.current !==
          roomId
        ) {
          console.log(
            "[Quiz Play Socket] Joining room:",
            roomId,
          );

          socket.emit(
            "join_room",
            {
              room_id:
                roomId,
            },
          );

          /*
           * Do NOT mark as joined yet.
           *
           * Wait for joined_room_ack.
           */
        }
      };

    /* ==============================================================
       CONNECTION ERROR
       ============================================================== */

    const handleConnectError =
      (error: Error) => {
        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        console.error(
          "[Quiz Play Socket] Connection error:",
          error,
        );

        setSocketConnected(
          false,
        );

        setSocketRoomJoined(
          false,
        );

        joinedSocketRoomRef.current =
          null;

        setSocketError(
          error?.message ||
            "Unable to connect to the quiz room.",
        );
      };

    /* ==============================================================
       DISCONNECT
       ============================================================== */

    const handleDisconnect =
      (reason: string) => {
        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        console.warn(
          "[Quiz Play Socket] Disconnected:",
          reason,
        );

        setSocketConnected(
          false,
        );

        setSocketRoomJoined(
          false,
        );

        joinedSocketRoomRef.current =
          null;
      };

    /* ==============================================================
       JOINED ROOM ACK
       ============================================================== */

    const handleJoinedRoomAck =
      (
        payload: SocketJoinedRoomAckPayload,
      ) => {
        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        console.log(
          "[Quiz Play Socket] joined_room_ack:",
          payload,
        );

        if (
          payload?.success ===
          false
        ) {
          setSocketRoomJoined(
            false,
          );

          joinedSocketRoomRef.current =
            null;

          setSocketError(
            payload.message ||
              "The quiz room rejected your connection.",
          );

          return;
        }

        const eventRoomId =
          String(
            payload?.roomId ??
              payload?.room_id ??
              roomId,
          ).trim();

        if (
          eventRoomId &&
          eventRoomId !== roomId
        ) {
          console.warn(
            "[Quiz Play Socket] joined_room_ack belongs to another room:",
            eventRoomId,
          );

          return;
        }

        console.log(
          "[Quiz Play Socket] Successfully joined room:",
          roomId,
        );

        setSocketRoomJoined(
          true,
        );

        joinedSocketRoomRef.current =
          roomId;

        setSocketError(
          "",
        );
      };

    /* ==============================================================
       ROUND STARTED
       ============================================================== */

    const handleRoundStarted =
      (
        payload: SocketRoundStartedPayload,
      ) => {
        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        console.log(
          "[Quiz Play Socket] round_started:",
          payload,
        );

        setLastSocketEvent(
          "round_started",
        );

        const eventQuizId =
          extractEventQuizId(
            payload,
          );

        /*
         * Ignore another quiz.
         */

        if (
          eventQuizId &&
          eventQuizId !==
            quizId
        ) {
          console.warn(
            "[Quiz Play Socket] Ignoring round_started for another quiz:",
            eventQuizId,
          );

          return;
        }

        const eventRound =
          extractRound(
            payload,
          );

        if (
          eventRound
        ) {
          console.log(
            "[Quiz Play Socket] Round started:",
            eventRound,
          );

          setCurrentRound(
            eventRound,
          );
        }

        /*
         * Some backends may include the first question directly
         * inside round_started.
         */

        const incomingQuestion =
          findQuestionInPayload(
            payload,
          );

        if (
          incomingQuestion
        ) {
          applyQuestion(
            incomingQuestion,
            "round_started",
          );
        }
      };

    /* ==============================================================
       ON ANY EVENT

       This receives EVERY incoming Socket.IO event.

       We use it to discover the actual question event being sent
       by the existing backend.
       ============================================================== */

    const handleAnyEvent =
      (
        eventName: string,
        ...args: unknown[]
      ) => {
        if (
          cancelled ||
          !mountedRef.current
        ) {
          return;
        }

        console.log(
          `[Quiz Play Socket] Event: ${eventName}`,
          ...args,
        );

        setLastSocketEvent(
          eventName,
        );

        /*
         * One argument = use it directly.
         *
         * Multiple arguments = inspect the array.
         */

        const eventPayload =
          args.length === 1
            ? args[0]
            : args;

        /*
         * Ignore events belonging to another quiz.
         */

        const eventQuizId =
          extractEventQuizId(
            eventPayload,
          );

        if (
          eventQuizId &&
          eventQuizId !==
            quizId
        ) {
          console.warn(
            "[Quiz Play Socket] Ignoring event for another quiz:",
            {
              eventName,
              eventQuizId,
              quizId,
            },
          );

          return;
        }

        /*
         * Search recursively for a question.
         */

        const incomingQuestion =
          findQuestionInPayload(
            eventPayload,
          );

        if (
          incomingQuestion
        ) {
          console.log(
            "[Quiz Play Socket] QUESTION-LIKE PAYLOAD FOUND",
            {
              eventName,
              payload:
                eventPayload,
            },
          );

          applyQuestion(
            incomingQuestion,
            eventName,
          );
        }
      };

    /* ==============================================================
       REGISTER LISTENERS
       ============================================================== */

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
      "round_started",
      handleRoundStarted,
    );

    /*
     * Listen to every incoming event.
     */

    socket.onAny(
      handleAnyEvent,
    );

    /* ==============================================================
       SOCKET MAY ALREADY BE CONNECTED
       ============================================================== */

    if (
      socket.connected
    ) {
      handleConnect();
    } else {
      setSocketConnected(
        false,
      );

      console.log(
        "[Quiz Play Socket] Waiting for socket connection...",
      );
    }

    /* ==============================================================
       CLEANUP
       ============================================================== */

    return () => {
      cancelled =
        true;

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
        "round_started",
        handleRoundStarted,
      );

      socket.offAny(
        handleAnyEvent,
      );

      joinedSocketRoomRef.current =
        null;

      /*
       * Clean up the singleton socket when leaving /play.
       */

      disconnectQuizSocket();
    };
  }, [
    applyQuestion,
    quizId,
    session,
  ]);

  /* ================================================================
     ANSWER SELECTION

     For now this only selects the answer locally.

     We are NOT emitting a made-up answer event until the actual
     backend answer-submission contract is known.
     ================================================================ */

  const handleAnswerSelect =
    (option: QuizOption) => {
      if (!question) {
        return;
      }

      setSelectedAnswer(
        option.value,
      );

      console.log(
        "[Quiz Play] Student selected answer:",
        {
          quizId,
          round:
            currentRound,
          questionId:
            question.id,
          question:
            question.question,
          optionLabel:
            option.label,
          optionValue:
            option.value,
          optionText:
            option.text,
        },
      );
    };

  /* ================================================================
     LEAVE QUIZ
     ================================================================ */

  const handleLeaveQuiz =
    () => {
      router.push(
        `/student/quiz-board/${quizId}`,
      );
    };

  /* ================================================================
     SESSION ERROR
     ================================================================ */

  if (sessionError) {
    return (
      <main className="min-h-screen bg-[#07111f] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="border-white/10 bg-white/[0.04] p-8 text-white shadow-2xl shadow-black/30">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold">
              Quiz session unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {sessionError}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {/* ==================================================
                  FIX:
                  Button does not support asChild in this project.
                  Use a normal Link instead.
                  ================================================== */}

              <Link
                href={`/student/quiz-board/${
                  quizId || ""
                }`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Waiting Room
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ================================================================
     LOADING
     ================================================================ */

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading quiz session...
        </div>
      </main>
    );
  }

  /* ================================================================
     QUESTION LABEL
     ================================================================ */

  const progressLabel =
    question?.questionNumber
      ? `Question ${question.questionNumber}${
          question.totalQuestions
            ? ` of ${question.totalQuestions}`
            : ""
        }`
      : "Question waiting";

  /* ================================================================
     PAGE
     ================================================================ */

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* ========================================================
            TOP BAR
            ======================================================== */}

        <header className="mb-5 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/student/quiz-board/${quizId}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Back to waiting room"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                JAMB League • Quiz Board
              </p>

              <h1 className="truncate text-lg font-bold sm:text-xl">
                {session.quiz_title}
              </h1>

              <p className="truncate text-xs text-slate-400">
                {session.subject ||
                  "Quiz Competition"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* ====================================================
                SOCKET STATUS
                ==================================================== */}

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs">
              {socketConnected ? (
                <Wifi className="h-3.5 w-3.5 text-emerald-300" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-amber-300" />
              )}

              <span
                className={
                  socketConnected
                    ? "text-emerald-200"
                    : "text-amber-200"
                }
              >
                {socketConnected
                  ? "Connected"
                  : "Connecting..."}
              </span>
            </div>

            {/* ====================================================
                ROOM STATUS
                ==================================================== */}

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs">
              <Radio className="h-3.5 w-3.5 text-sky-300" />

              <span className="text-slate-300">
                {socketRoomJoined
                  ? "Room joined"
                  : "Joining room..."}
              </span>
            </div>
          </div>
        </header>

        {/* ========================================================
            SOCKET ERROR
            ======================================================== */}

        {socketError && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Socket connection issue
              </p>

              <p className="mt-1 text-red-100/80">
                {socketError}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            ROUND / SOCKET DEBUG STATUS
            ======================================================== */}

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Current Round
            </p>

            <p className="mt-1 text-xl font-bold">
              Round {currentRound}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Question
            </p>

            <p className="mt-1 text-xl font-bold">
              {question
                ? "Received"
                : "Waiting"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Last Socket Event
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-sky-200">
              {lastSocketEvent ||
                "None yet"}
            </p>
          </div>
        </div>

        {/* ========================================================
            QUESTION CARD
            ======================================================== */}

        <section className="mx-auto max-w-5xl">
          <Card className="overflow-hidden border-white/10 bg-white/[0.045] text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
            {/* ====================================================
                QUESTION HEADER
                ==================================================== */}

            <div className="border-b border-white/10 bg-black/10 px-5 py-4 sm:px-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CircleDot className="h-4 w-4 text-sky-300" />

                  <span>
                    {progressLabel}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  Round{" "}
                  {currentRound}{" "}
                  of{" "}
                  {
                    session.number_of_rounds
                  }
                </div>
              </div>
            </div>

            {/* ====================================================
                QUESTION CONTENT
                ==================================================== */}

            <div className="p-5 sm:p-8 lg:p-10">
              {!question ? (
                /* ==================================================
                   WAITING FOR QUESTION
                   ================================================== */

                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10">
                    {socketConnected ? (
                      <Loader2 className="h-7 w-7 animate-spin text-sky-300" />
                    ) : (
                      <RefreshCw className="h-7 w-7 text-sky-300" />
                    )}
                  </div>

                  <h2 className="text-xl font-bold sm:text-2xl">
                    Waiting for the first
                    question
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                    When the Admin starts
                    Round{" "}
                    {currentRound},
                    the question
                    event sent by
                    the competition
                    server will
                    appear here
                    automatically.
                  </p>

                  {/* ==================================================
                     CONNECTION DEBUG
                     ================================================== */}

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-xs text-slate-400">
                    <p>
                      Socket:{" "}
                      {socketConnected
                        ? "connected"
                        : "not connected"}
                    </p>

                    <p className="mt-1">
                      Room:{" "}
                      {socketRoomJoined
                        ? "joined"
                        : "not joined"}
                    </p>

                    <p className="mt-1">
                      Listener:{" "}
                      <span className="text-sky-300">
                        onAny()
                      </span>
                    </p>

                    <p className="mt-1">
                      Last event:{" "}
                      <span className="text-sky-300">
                        {lastSocketEvent ||
                          "none"}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                /* ==================================================
                   QUESTION RECEIVED
                   ================================================== */

                <div>
                  {/* ==================================================
                     QUESTION
                     ================================================== */}

                  <div className="mb-8">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">
                      {progressLabel}
                    </p>

                    <h2 className="text-2xl font-bold leading-relaxed sm:text-3xl">
                      {
                        question.question
                      }
                    </h2>
                  </div>

                  {/* ==================================================
                     ANSWER OPTIONS
                     ================================================== */}

                  <div className="grid gap-4 sm:grid-cols-2">
                    {question.options.map(
                      (option) => {
                        const isSelected =
                          selectedAnswer ===
                          option.value;

                        return (
                          <button
                            key={`${question.id}-${option.label}-${option.value}`}
                            type="button"
                            onClick={() =>
                              handleAnswerSelect(
                                option,
                              )
                            }
                            className={`group w-full rounded-2xl border p-4 text-left transition sm:p-5 ${
                              isSelected
                                ? "border-sky-400 bg-sky-400/10 shadow-lg shadow-sky-950/30"
                                : "border-white/10 bg-white/[0.025] hover:border-sky-400/40 hover:bg-white/[0.055]"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {/* ==================================================
                                 OPTION LETTER
                                 ================================================== */}

                              <span
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${
                                  isSelected
                                    ? "bg-sky-400 text-slate-950"
                                    : "bg-white/[0.08] text-slate-200 group-hover:bg-sky-400/15 group-hover:text-sky-200"
                                }`}
                              >
                                {
                                  option.label
                                }
                              </span>

                              {/* ==================================================
                                 OPTION TEXT
                                 ================================================== */}

                              <span className="flex-1 pt-1 text-base font-medium leading-6 text-slate-100">
                                {
                                  option.text
                                }
                              </span>

                              {/* ==================================================
                                 SELECTED ICON
                                 ================================================== */}

                              {isSelected && (
                                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-sky-300" />
                              )}
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>

                  {/* ==================================================
                     SELECTED ANSWER MESSAGE
                     ================================================== */}

                  {selectedAnswer && (
                    <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
                      Answer selected.
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* ========================================================
            FOOTER
            ======================================================== */}

        <div className="mx-auto mt-5 flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            Room ID:{" "}
            <span className="font-mono text-slate-400">
              {session.room_id ||
                "—"}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={
              handleLeaveQuiz
            }
            className="border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08] hover:text-white"
          >
            Leave Quiz
          </Button>
        </div>
      </div>
    </main>
  );
}



"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  SocketJoinedRoomAckPayload,
  SocketParticipantJoinedPayload,
  SocketRoundStartedPayload,
  QuizRoom,
} from "@/lib/quiz-board/waiting-room/types";

import { getQuizSocket } from "@/lib/socket/quizSocket";

/* =========================================================
   SOCKET ROLE
========================================================= */

export type QuizSocketRole =
  | "CONTESTANT"
  | "SPECTATOR"
  | "ADMIN"
  | "HOST"
  | string;

/* =========================================================
   GENERIC PAYLOAD TYPES
========================================================= */

export interface QuizRoomStatePayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  status?: string;

  activated?: boolean;

  currentRound?: number;
  current_round?: number;

  contestantCount?: number;
  contestant_count?: number;

  maxContestants?: number;
  max_contestants?: number;

  contestantId?: string | null;
  contestant_id?: string | null;

  contestantCode?: string | null;
  contestant_code?: string | null;

  spectatorCode?: string | null;
  spectator_code?: string | null;

  room?: QuizRoom | null;

  data?: unknown;

  [key: string]: unknown;
}

export interface QuizRoomActivatedPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  status?: string;

  activated?: boolean;

  currentRound?: number;
  current_round?: number;

  data?: unknown;

  [key: string]: unknown;
}

export interface LeaderboardUpdatedPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  leaderboard?: unknown;

  data?: unknown;

  [key: string]: unknown;
}

export interface TiebreakerQuestionStartedPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  round?: number;
  roundNumber?: number;
  round_number?: number;

  question?: unknown;

  questionId?: string;
  question_id?: string;

  data?: unknown;

  [key: string]: unknown;
}

export interface ParticipantsEliminatedPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  round?: number;
  roundNumber?: number;
  round_number?: number;

  participants?: unknown[];

  participantIds?: string[];
  participant_ids?: string[];

  eliminatedParticipants?: unknown[];
  eliminated_participants?: unknown[];

  data?: unknown;

  [key: string]: unknown;
}

/* =========================================================
   FRONTEND → BACKEND PAYLOADS
========================================================= */

export interface ActivateRoomPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  role?: QuizSocketRole;
}

export interface JoinRoomPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  role?: QuizSocketRole;

  contestantId?: string;
  contestant_id?: string;

  spectatorCode?: string;
  spectator_code?: string;
}

export interface StartRoundPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  round?: number;
  roundNumber?: number;
  round_number?: number;

  role?: QuizSocketRole;
}

export interface SyncLeaderboardPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  leaderboard?: unknown;

  role?: QuizSocketRole;
}

export interface RequestTiebreakerQuestionPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  round?: number;
  roundNumber?: number;
  round_number?: number;

  role?: QuizSocketRole;
}

export interface ResolveTiebreakerEliminationsPayload {
  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  round?: number;
  roundNumber?: number;
  round_number?: number;

  participantIds?: string[];
  participant_ids?: string[];

  role?: QuizSocketRole;
}

/* =========================================================
   OPTIONS
========================================================= */

export interface UseQuizRoomSocketOptions {
  enabled?: boolean;

  roomId?: string | null;

  quizId?: string | null;

  role?: QuizSocketRole;

  contestantId?: string | null;

  spectatorCode?: string | null;

  onRoomState?: (
    payload: QuizRoomStatePayload,
  ) => void;

  onRoomActivated?: (
    payload: QuizRoomActivatedPayload,
  ) => void;

  onParticipantJoined?: (
    payload: SocketParticipantJoinedPayload,
  ) => void;

  onRoundStarted?: (
    payload: SocketRoundStartedPayload,
  ) => void;

  onLeaderboardUpdated?: (
    payload: LeaderboardUpdatedPayload,
  ) => void;

  onTiebreakerQuestionStarted?: (
    payload: TiebreakerQuestionStartedPayload,
  ) => void;

  onParticipantsEliminated?: (
    payload: ParticipantsEliminatedPayload,
  ) => void;
}

/* =========================================================
   RETURN TYPE
========================================================= */

export interface UseQuizRoomSocketReturn {
  socket: ReturnType<typeof getQuizSocket> | null;

  socketConnected: boolean;

  socketRoomJoined: boolean;

  socketParticipantCount: number | null;

  socketError: string;

  connect: () => void;

  disconnect: () => void;

  joinRoom: () => void;

  activateRoom: (
    payload?: Partial<ActivateRoomPayload>,
  ) => void;

  startRound: (
    payload?: Partial<StartRoundPayload>,
  ) => void;

  syncLeaderboard: (
    payload?: Partial<SyncLeaderboardPayload>,
  ) => void;

  requestTiebreakerQuestion: (
    payload?: Partial<RequestTiebreakerQuestionPayload>,
  ) => void;

  resolveTiebreakerEliminations: (
    payload?: Partial<ResolveTiebreakerEliminationsPayload>,
  ) => void;
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeString(
  value: unknown,
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getPayloadObject(
  payload: unknown,
): Record<string, unknown> | null {
  if (
    !payload ||
    typeof payload !== "object"
  ) {
    return null;
  }

  return payload as Record<
    string,
    unknown
  >;
}

/**
 * Some Socket.IO events may arrive directly:
 *
 * {
 *   roomId: "...",
 *   status: "ACTIVE"
 * }
 *
 * while others may be wrapped:
 *
 * {
 *   success: true,
 *   data: {
 *     roomId: "...",
 *     status: "ACTIVE"
 *   }
 * }
 *
 * This helper allows both forms.
 */
function getPayloadLayers(
  payload: unknown,
): Record<string, unknown>[] {
  const root =
    getPayloadObject(payload);

  if (!root) {
    return [];
  }

  const layers: Record<string, unknown>[] = [
    root,
  ];

  const data =
    getPayloadObject(root.data);

  if (data) {
    layers.push(data);
  }

  const room =
    getPayloadObject(root.room);

  if (room) {
    layers.push(room);
  }

  return layers;
}

function getPayloadValue(
  payload: unknown,
  keys: string[],
): unknown {
  const layers =
    getPayloadLayers(payload);

  for (const layer of layers) {
    for (const key of keys) {
      if (
        layer[key] !== undefined &&
        layer[key] !== null
      ) {
        return layer[key];
      }
    }
  }

  return undefined;
}

function getPayloadRoomId(
  payload: unknown,
): string {
  return normalizeString(
    getPayloadValue(
      payload,
      [
        "roomId",
        "room_id",
        "roomID",
      ],
    ),
  );
}

function getPayloadQuizId(
  payload: unknown,
): string {
  return normalizeString(
    getPayloadValue(
      payload,
      [
        "quizId",
        "quiz_id",
        "quizID",
      ],
    ),
  );
}

function getPayloadCount(
  payload: unknown,
): number | null {
  const value =
    getPayloadValue(
      payload,
      [
        "joinedCount",
        "joined_count",
        "participantCount",
        "participant_count",
        "contestantCount",
        "contestant_count",
      ],
    );

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const parsed =
      Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

function getPayloadMessage(
  payload: unknown,
): string {
  return normalizeString(
    getPayloadValue(
      payload,
      ["message"],
    ),
  );
}

function isMatchingRoom(
  payload: unknown,
  expectedRoomId: string,
): boolean {
  if (!expectedRoomId) {
    return true;
  }

  const payloadRoomId =
    getPayloadRoomId(payload);

  /*
   * The backend may omit roomId because the
   * Socket.IO event is already scoped to a room.
   */
  if (!payloadRoomId) {
    return true;
  }

  return (
    payloadRoomId ===
    expectedRoomId
  );
}

function isMatchingQuiz(
  payload: unknown,
  expectedQuizId: string,
): boolean {
  if (!expectedQuizId) {
    return true;
  }

  const payloadQuizId =
    getPayloadQuizId(payload);

  /*
   * The backend may omit quizId.
   */
  if (!payloadQuizId) {
    return true;
  }

  return (
    payloadQuizId ===
    expectedQuizId
  );
}

/**
 * Convert a room_state payload into the QuizRoom shape
 * consumed by the waiting-room helpers.
 */
function normalizeRoomState(
  payload: QuizRoomStatePayload,
): QuizRoom | null {
  const root =
    getPayloadObject(payload);

  if (!root) {
    return null;
  }

  const nestedRoom =
    getPayloadObject(root.room);

  const nestedData =
    getPayloadObject(root.data);

  const source =
    nestedRoom ??
    nestedData ??
    root;

  const roomId =
    normalizeString(
      source.roomId ??
        source.room_id ??
        source.roomID ??
        root.roomId ??
        root.room_id,
    );

  const quizId =
    normalizeString(
      source.quizId ??
        source.quiz_id ??
        source.quizID ??
        root.quizId ??
        root.quiz_id,
    );

  const status =
    normalizeString(
      source.status ??
        root.status,
    );

  const currentRoundValue =
    source.currentRound ??
    source.current_round ??
    root.currentRound ??
    root.current_round;

  const contestantCountValue =
    source.contestantCount ??
    source.contestant_count ??
    source.participantCount ??
    source.participant_count ??
    root.contestantCount ??
    root.contestant_count;

  const maxContestantsValue =
    source.maxContestants ??
    source.max_contestants ??
    root.maxContestants ??
    root.max_contestants;

  const activatedValue =
    source.activated ??
    root.activated;

  const contestantId =
    source.contestantId ??
    source.contestant_id ??
    root.contestantId ??
    root.contestant_id;

  const contestantCode =
    source.contestantCode ??
    source.contestant_code ??
    root.contestantCode ??
    root.contestant_code;

  const spectatorCode =
    source.spectatorCode ??
    source.spectator_code ??
    root.spectatorCode ??
    root.spectator_code;

  const room: QuizRoom = {
    ...(nestedRoom ?? {}),
    ...(nestedData ?? {}),
    ...root,

    ...(roomId
      ? {
          roomId,
          room_id: roomId,
        }
      : {}),

    ...(quizId
      ? {
          quizId,
          quiz_id: quizId,
        }
      : {}),

    ...(status
      ? {
          status,
        }
      : {}),

    ...(typeof activatedValue ===
      "boolean"
      ? {
          activated:
            activatedValue,
        }
      : {}),

    ...(typeof currentRoundValue ===
        "number" &&
      Number.isFinite(
        currentRoundValue,
      )
      ? {
          currentRound:
            currentRoundValue,
          current_round:
            currentRoundValue,
        }
      : {}),

    ...(typeof contestantCountValue ===
        "number" &&
      Number.isFinite(
        contestantCountValue,
      )
      ? {
          contestantCount:
            contestantCountValue,
          contestant_count:
            contestantCountValue,
        }
      : {}),

    ...(typeof maxContestantsValue ===
        "number" &&
      Number.isFinite(
        maxContestantsValue,
      )
      ? {
          maxContestants:
            maxContestantsValue,
          max_contestants:
            maxContestantsValue,
        }
      : {}),

    ...(contestantId !==
      undefined
      ? {
          contestantId:
            typeof contestantId ===
            "string"
              ? contestantId
              : null,
        }
      : {}),

    ...(contestantCode !==
      undefined
      ? {
          contestantCode:
            typeof contestantCode ===
            "string"
              ? contestantCode
              : null,
        }
      : {}),

    ...(spectatorCode !==
      undefined
      ? {
          spectatorCode:
            typeof spectatorCode ===
            "string"
              ? spectatorCode
              : null,
        }
      : {}),
  };

  /*
   * A completely empty payload should not replace
   * an existing room state.
   */
  if (
    !roomId &&
    !quizId &&
    !status &&
    !nestedRoom &&
    !nestedData
  ) {
    return null;
  }

  return room;
}

/* =========================================================
   HOOK
========================================================= */

export default function useQuizRoomSocket(
  options: UseQuizRoomSocketOptions = {},
): UseQuizRoomSocketReturn {
  const {
    enabled = true,

    roomId,

    quizId,

    role = "CONTESTANT",

    contestantId,

    spectatorCode,

    onRoomState,

    onRoomActivated,

    onParticipantJoined,

    onRoundStarted,

    onLeaderboardUpdated,

    onTiebreakerQuestionStarted,

    onParticipantsEliminated,
  } = options;

  const normalizedRoomId =
    normalizeString(roomId);

  const normalizedQuizId =
    normalizeString(quizId);

  const normalizedContestantId =
    normalizeString(contestantId);

  const normalizedSpectatorCode =
    normalizeString(spectatorCode);

  const [
    socket,
    setSocket,
  ] = useState<
    ReturnType<
      typeof getQuizSocket
    > | null
  >(null);

  const [
    socketConnected,
    setSocketConnected,
  ] = useState(false);

  const [
    socketRoomJoined,
    setSocketRoomJoined,
  ] = useState(false);

  const [
    socketParticipantCount,
    setSocketParticipantCount,
  ] = useState<number | null>(
    null,
  );

  const [
    socketError,
    setSocketError,
  ] = useState("");

  const joinedRoomRef =
    useRef<string | null>(null);

  const mountedRef =
    useRef(true);

  const callbacksRef =
    useRef({
      onRoomState,
      onRoomActivated,
      onParticipantJoined,
      onRoundStarted,
      onLeaderboardUpdated,
      onTiebreakerQuestionStarted,
      onParticipantsEliminated,
    });

  useEffect(() => {
    callbacksRef.current = {
      onRoomState,
      onRoomActivated,
      onParticipantJoined,
      onRoundStarted,
      onLeaderboardUpdated,
      onTiebreakerQuestionStarted,
      onParticipantsEliminated,
    };
  }, [
    onRoomState,
    onRoomActivated,
    onParticipantJoined,
    onRoundStarted,
    onLeaderboardUpdated,
    onTiebreakerQuestionStarted,
    onParticipantsEliminated,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* =======================================================
     GET SOCKET INSTANCE
  ======================================================= */

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const currentSocket =
      getQuizSocket();

    setSocket(currentSocket);
  }, [enabled]);

  /* =======================================================
     BUILD JOIN PAYLOAD
  ======================================================= */

  const buildJoinPayload =
    useCallback((): JoinRoomPayload => {
      const payload: JoinRoomPayload = {
        room_id:
          normalizedRoomId,

        roomId:
          normalizedRoomId,

        quiz_id:
          normalizedQuizId ||
          undefined,

        quizId:
          normalizedQuizId ||
          undefined,

        role,
      };

      if (
        normalizedContestantId
      ) {
        payload.contestantId =
          normalizedContestantId;

        payload.contestant_id =
          normalizedContestantId;
      }

      if (
        normalizedSpectatorCode
      ) {
        payload.spectatorCode =
          normalizedSpectatorCode;

        payload.spectator_code =
          normalizedSpectatorCode;
      }

      return payload;
    }, [
      normalizedRoomId,
      normalizedQuizId,
      normalizedContestantId,
      normalizedSpectatorCode,
      role,
    ]);

  /* =======================================================
     JOIN ROOM
  ======================================================= */

  const joinRoom =
    useCallback(() => {
      if (
        !socket ||
        !normalizedRoomId
      ) {
        return;
      }

      if (!socket.connected) {
        return;
      }

      if (
        joinedRoomRef.current ===
        normalizedRoomId
      ) {
        return;
      }

      setSocketError("");

      socket.emit(
        "join_room",
        buildJoinPayload(),
      );
    }, [
      socket,
      normalizedRoomId,
      buildJoinPayload,
    ]);

  /* =======================================================
     CONNECT
  ======================================================= */

  const connect =
    useCallback(() => {
      if (!socket) {
        return;
      }

      setSocketError("");

      if (socket.connected) {
        if (mountedRef.current) {
          setSocketConnected(true);
        }

        /*
         * If the socket is already connected but this room
         * has not been joined, join it immediately.
         */
        if (
          normalizedRoomId &&
          joinedRoomRef.current !==
            normalizedRoomId
        ) {
          joinRoom();
        }

        return;
      }

      socket.connect();
    }, [
      socket,
      normalizedRoomId,
      joinRoom,
    ]);

  /* =======================================================
     DISCONNECT
  ======================================================= */

  const disconnect =
    useCallback(() => {
      if (!socket) {
        return;
      }

      /*
       * There is deliberately no leave_room event.
       */
      joinedRoomRef.current =
        null;

      if (mountedRef.current) {
        setSocketConnected(false);
        setSocketRoomJoined(false);
        setSocketParticipantCount(
          null,
        );
      }

      socket.disconnect();
    }, [socket]);

  /* =======================================================
     ACTIVATE ROOM
  ======================================================= */

  const activateRoom =
    useCallback(
      (
        payloadOverrides: Partial<ActivateRoomPayload> = {},
      ) => {
        if (!socket?.connected) {
          return;
        }

        const payload: ActivateRoomPayload = {
          room_id:
            normalizedRoomId,

          roomId:
            normalizedRoomId,

          quiz_id:
            normalizedQuizId ||
            undefined,

          quizId:
            normalizedQuizId ||
            undefined,

          role,

          ...payloadOverrides,
        };

        socket.emit(
          "activate_room",
          payload,
        );
      },
      [
        socket,
        normalizedRoomId,
        normalizedQuizId,
        role,
      ],
    );

  /* =======================================================
     START ROUND
  ======================================================= */

  const startRound =
    useCallback(
      (
        payloadOverrides: Partial<StartRoundPayload> = {},
      ) => {
        if (!socket?.connected) {
          return;
        }

        const payload: StartRoundPayload = {
          room_id:
            normalizedRoomId,

          roomId:
            normalizedRoomId,

          quiz_id:
            normalizedQuizId ||
            undefined,

          quizId:
            normalizedQuizId ||
            undefined,

          role,

          ...payloadOverrides,
        };

        socket.emit(
          "start_round",
          payload,
        );
      },
      [
        socket,
        normalizedRoomId,
        normalizedQuizId,
        role,
      ],
    );

  /* =======================================================
     SYNC LEADERBOARD
  ======================================================= */

  const syncLeaderboard =
    useCallback(
      (
        payloadOverrides: Partial<SyncLeaderboardPayload> = {},
      ) => {
        if (!socket?.connected) {
          return;
        }

        const payload: SyncLeaderboardPayload = {
          room_id:
            normalizedRoomId,

          roomId:
            normalizedRoomId,

          quiz_id:
            normalizedQuizId ||
            undefined,

          quizId:
            normalizedQuizId ||
            undefined,

          role,

          ...payloadOverrides,
        };

        socket.emit(
          "sync_leaderboard",
          payload,
        );
      },
      [
        socket,
        normalizedRoomId,
        normalizedQuizId,
        role,
      ],
    );

  /* =======================================================
     REQUEST TIEBREAKER QUESTION
  ======================================================= */

  const requestTiebreakerQuestion =
    useCallback(
      (
        payloadOverrides: Partial<RequestTiebreakerQuestionPayload> = {},
      ) => {
        if (!socket?.connected) {
          return;
        }

        const payload: RequestTiebreakerQuestionPayload = {
          room_id:
            normalizedRoomId,

          roomId:
            normalizedRoomId,

          quiz_id:
            normalizedQuizId ||
            undefined,

          quizId:
            normalizedQuizId ||
            undefined,

          role,

          ...payloadOverrides,
        };

        socket.emit(
          "request_tiebreaker_question",
          payload,
        );
      },
      [
        socket,
        normalizedRoomId,
        normalizedQuizId,
        role,
      ],
    );

  /* =======================================================
     RESOLVE TIEBREAKER ELIMINATIONS
  ======================================================= */

  const resolveTiebreakerEliminations =
    useCallback(
      (
        payloadOverrides: Partial<ResolveTiebreakerEliminationsPayload> = {},
      ) => {
        if (!socket?.connected) {
          return;
        }

        const payload: ResolveTiebreakerEliminationsPayload = {
          room_id:
            normalizedRoomId,

          roomId:
            normalizedRoomId,

          quiz_id:
            normalizedQuizId ||
            undefined,

          quizId:
            normalizedQuizId ||
            undefined,

          role,

          ...payloadOverrides,
        };

        socket.emit(
          "resolve_tiebreaker_eliminations",
          payload,
        );
      },
      [
        socket,
        normalizedRoomId,
        normalizedQuizId,
        role,
      ],
    );

  /* =======================================================
     SOCKET EVENT LISTENERS
  ======================================================= */

  useEffect(() => {
    if (
      !enabled ||
      !socket
    ) {
      return;
    }

    /* -----------------------------------------------------
       CONNECT
    ----------------------------------------------------- */

    const handleConnect =
      () => {
        if (!mountedRef.current) {
          return;
        }

        setSocketConnected(true);
        setSocketRoomJoined(false);
        setSocketError("");

        /*
         * Socket.IO room membership is not preserved across
         * a reconnect, so reset the local membership marker.
         */
        joinedRoomRef.current =
          null;

        /*
         * Rejoin immediately after reconnect.
         */
        if (normalizedRoomId) {
          window.setTimeout(() => {
            if (
              !mountedRef.current ||
              !socket.connected
            ) {
              return;
            }

            joinRoom();
          }, 0);
        }
      };

    /* -----------------------------------------------------
       CONNECT ERROR
    ----------------------------------------------------- */

    const handleConnectError =
      (error: Error) => {
        joinedRoomRef.current =
          null;

        if (!mountedRef.current) {
          return;
        }

        setSocketConnected(false);
        setSocketRoomJoined(false);

        setSocketError(
          error?.message ||
            "Unable to connect to the quiz server.",
        );
      };

    /* -----------------------------------------------------
       DISCONNECT
    ----------------------------------------------------- */

    const handleDisconnect =
      (reason: string) => {
        joinedRoomRef.current =
          null;

        if (!mountedRef.current) {
          return;
        }

        setSocketConnected(false);
        setSocketRoomJoined(false);

        if (
          reason &&
          reason !==
            "io client disconnect"
        ) {
          setSocketError(
            `Quiz connection lost: ${reason}`,
          );
        }
      };

    /* -----------------------------------------------------
       joined_room_ack
    ----------------------------------------------------- */

    const handleJoinedRoomAck =
      (
        payload: SocketJoinedRoomAckPayload,
      ) => {
        if (
          !isMatchingRoom(
            payload,
            normalizedRoomId,
          )
        ) {
          return;
        }

        if (
          !isMatchingQuiz(
            payload,
            normalizedQuizId,
          )
        ) {
          return;
        }

        if (
          payload.success === false
        ) {
          joinedRoomRef.current =
            null;

          if (mountedRef.current) {
            setSocketRoomJoined(false);

            setSocketError(
              payload.message ||
                "The server did not authorize this room.",
            );
          }

          return;
        }

        const payloadRoomId =
          getPayloadRoomId(
            payload,
          );

        joinedRoomRef.current =
          normalizedRoomId ||
          payloadRoomId ||
          null;

        if (mountedRef.current) {
          setSocketRoomJoined(true);
          setSocketError("");
        }
      };

    /* -----------------------------------------------------
       room_state
    ----------------------------------------------------- */

    const handleRoomState =
      (
        payload: QuizRoomStatePayload,
      ) => {
        if (
          !isMatchingRoom(
            payload,
            normalizedRoomId,
          )
        ) {
          return;
        }

        if (
          !isMatchingQuiz(
            payload,
            normalizedQuizId,
          )
        ) {
          return;
        }

        const count =
          getPayloadCount(payload);

        if (
          count !== null &&
          mountedRef.current
        ) {
          setSocketParticipantCount(
            count,
          );
        }

        /*
         * This is the critical bridge.
         *
         * WaitingRoom receives this and calls:
         *
         * setRoom(...)
         */
        callbacksRef.current.onRoomState?.(
          payload,
        );
      };

    /* -----------------------------------------------------
       room_activated
    ----------------------------------------------------- */

    const handleRoomActivated =
      (
        payload: QuizRoomActivatedPayload,
      ) => {
        if (
          !isMatchingRoom(
            payload,
            normalizedRoomId,
          )
        ) {
          return;
        }

        if (
          !isMatchingQuiz(
            payload,
            normalizedQuizId,
          )
        ) {
          return;
        }

        callbacksRef.current.onRoomActivated?.(
          payload,
        );
      };

    /* -----------------------------------------------------
       participant_joined_room
    ----------------------------------------------------- */

    const handleParticipantJoined =
      (
        payload: SocketParticipantJoinedPayload,
      ) => {
        if (
          !isMatchingRoom(
            payload,
            normalizedRoomId,
          )
        ) {
          return;
        }

        if (
          !isMatchingQuiz(
            payload,
            normalizedQuizId,
          )
        ) {
          return;
        }

        const count =
          getPayloadCount(payload);

        if (
          count !== null &&
          mountedRef.current
        ) {
          setSocketParticipantCount(
            count,
          );
        }

        callbacksRef.current.onParticipantJoined?.(
          payload,
        );
      };

    /* -----------------------------------------------------
       round_started
    ----------------------------------------------------- */

    const handleRoundStarted =
      (
        payload: SocketRoundStartedPayload,
      ) => {
        if (
          !isMatchingRoom(
            payload,
            normalizedRoomId,
          )
        ) {
          return;
        }

        if (
          !isMatchingQuiz(
            payload,
            normalizedQuizId,
          )
        ) {
          return;
        }

        callbacksRef.current.onRoundStarted?.(
          payload,
        );
      };

    /* -----------------------------------------------------
       leaderboard_updated
    ----------------------------------------------------- */

    const handleLeaderboardUpdated =
      (
        payload: LeaderboardUpdatedPayload,
      ) => {
        if (
          !isMatchingRoom(
            payload,
            normalizedRoomId,
          )
        ) {
          return;
        }

        if (
          !isMatchingQuiz(
            payload,
            normalizedQuizId,
          )
        ) {
          return;
        }

        callbacksRef.current.onLeaderboardUpdated?.(
          payload,
        );
      };

    /* -----------------------------------------------------
       tiebreaker_question_started
    ----------------------------------------------------- */

    const handleTiebreakerQuestionStarted =
      (
        payload: TiebreakerQuestionStartedPayload,
      ) => {
        if (
          !isMatchingRoom(
            payload,
            normalizedRoomId,
          )
        ) {
          return;
        }

        if (
          !isMatchingQuiz(
            payload,
            normalizedQuizId,
          )
        ) {
          return;
        }

        callbacksRef.current.onTiebreakerQuestionStarted?.(
          payload,
        );
      };

    /* -----------------------------------------------------
       participants_eliminated
    ----------------------------------------------------- */

    const handleParticipantsEliminated =
      (
        payload: ParticipantsEliminatedPayload,
      ) => {
        if (
          !isMatchingRoom(
            payload,
            normalizedRoomId,
          )
        ) {
          return;
        }

        if (
          !isMatchingQuiz(
            payload,
            normalizedQuizId,
          )
        ) {
          return;
        }

        callbacksRef.current.onParticipantsEliminated?.(
          payload,
        );
      };

    /* =====================================================
       REGISTER BACKEND EVENTS
    ===================================================== */

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
      "room_state",
      handleRoomState,
    );

    socket.on(
      "room_activated",
      handleRoomActivated,
    );

    socket.on(
      "participant_joined_room",
      handleParticipantJoined,
    );

    socket.on(
      "round_started",
      handleRoundStarted,
    );

    socket.on(
      "leaderboard_updated",
      handleLeaderboardUpdated,
    );

    socket.on(
      "tiebreaker_question_started",
      handleTiebreakerQuestionStarted,
    );

    socket.on(
      "participants_eliminated",
      handleParticipantsEliminated,
    );

    /* =====================================================
       ALREADY CONNECTED
    ===================================================== */

    if (socket.connected) {
      if (mountedRef.current) {
        setSocketConnected(true);
        setSocketError("");
      }

      if (
        normalizedRoomId &&
        joinedRoomRef.current !==
          normalizedRoomId
      ) {
        joinRoom();
      }
    }

    /* =====================================================
       CLEANUP LISTENERS
    ===================================================== */

    return () => {
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
        "room_state",
        handleRoomState,
      );

      socket.off(
        "room_activated",
        handleRoomActivated,
      );

      socket.off(
        "participant_joined_room",
        handleParticipantJoined,
      );

      socket.off(
        "round_started",
        handleRoundStarted,
      );

      socket.off(
        "leaderboard_updated",
        handleLeaderboardUpdated,
      );

      socket.off(
        "tiebreaker_question_started",
        handleTiebreakerQuestionStarted,
      );

      socket.off(
        "participants_eliminated",
        handleParticipantsEliminated,
      );
    };
  }, [
    enabled,
    socket,
    normalizedRoomId,
    normalizedQuizId,
    joinRoom,
  ]);

  /* =======================================================
     ROOM ID CHANGED
  ======================================================= */

  useEffect(() => {
    if (
      !enabled ||
      !socket
    ) {
      return;
    }

    if (
      joinedRoomRef.current &&
      joinedRoomRef.current !==
        normalizedRoomId
    ) {
      joinedRoomRef.current =
        null;

      if (mountedRef.current) {
        setSocketRoomJoined(false);
        setSocketParticipantCount(
          null,
        );
      }
    }

    if (
      socket.connected &&
      normalizedRoomId &&
      joinedRoomRef.current !==
        normalizedRoomId
    ) {
      joinRoom();
    }
  }, [
    enabled,
    socket,
    normalizedRoomId,
    joinRoom,
  ]);

  /* =======================================================
     AUTOMATIC CONNECTION
  ======================================================= */

  useEffect(() => {
    if (
      !enabled ||
      !socket
    ) {
      return;
    }

    connect();
  }, [
    enabled,
    socket,
    connect,
  ]);

  /* =======================================================
     DISABLED STATE
  ======================================================= */

  useEffect(() => {
    if (enabled) {
      return;
    }

    joinedRoomRef.current =
      null;

    if (mountedRef.current) {
      setSocketConnected(false);
      setSocketRoomJoined(false);
      setSocketParticipantCount(
        null,
      );
      setSocketError("");
    }
  }, [enabled]);

  /* =======================================================
     UNMOUNT
  ======================================================= */

  useEffect(() => {
    return () => {
      joinedRoomRef.current =
        null;
    };
  }, []);

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    socket,

    socketConnected,

    socketRoomJoined,

    socketParticipantCount,

    socketError,

    connect,

    disconnect,

    joinRoom,

    activateRoom,

    startRound,

    syncLeaderboard,

    requestTiebreakerQuestion,

    resolveTiebreakerEliminations,
  };
}
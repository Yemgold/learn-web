




"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createQuizGameHttpController,
  type QuizGameHttpQuiz,
  type QuizGameHttpRound,
} from "@/lib/quiz-board/host/quizGameHttp";

/* ============================================================
   TYPES
============================================================ */

export interface QuizRoomFallbackSnapshot {
  quiz: QuizGameHttpQuiz | null;
  round: QuizGameHttpRound | null;
  syncedAt: number;
}

export interface UseQuizRoomFallbackOptions {
  /**
   * ID of the quiz competition.
   */
  quizId: string | null | undefined;

  /**
   * ID of the active room created for this competition.
   *
   * Required by the updated round-question endpoint.
   */
  roomId: string | null | undefined;

  /**
   * Current round received from the socket.
   * Defaults to round 1 when zero or missing.
   */
  currentRound: number;

  /**
   * Existing Socket.IO connection state.
   */
  socketConnected: boolean;

  /**
   * Disable recovery when it is not required.
   */
  enabled?: boolean;

  /**
   * Poll interval during socket disconnection.
   * Defaults to 5000 milliseconds.
   */
  pollIntervalMs?: number;

  /**
   * Optional callback for applying recovered data
   * to the existing component state.
   */
  onSnapshot?: (
    snapshot: QuizRoomFallbackSnapshot,
  ) => void;
}

export interface UseQuizRoomFallbackResult {
  quiz: QuizGameHttpQuiz | null;
  round: QuizGameHttpRound | null;

  loading: boolean;
  refreshing: boolean;
  usingFallback: boolean;

  error: string | null;
  lastSyncedAt: number | null;

  /**
   * Manually request another HTTP snapshot.
   */
  refresh: () => Promise<void>;
}

/* ============================================================
   ERROR HELPER
============================================================ */

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Unable to recover quiz information from the server.";
}

/* ============================================================
   HOOK
============================================================ */

/**
 * HOST-ONLY RECOVERY HOOK
 *
 * Round-question responses may contain answer keys.
 * Do not use this hook on student-facing pages unless the
 * backend provides a separate student-safe endpoint.
 *
 * This hook recovers quiz information and round questions.
 * It does not replace server-authoritative game actions,
 * answer validation, scoring, activation or advancement.
 *
 * Updated round-question route:
 *
 * GET /quiz/get-round-questions/:quizId/:roomId
 */
export function useQuizRoomFallback({
  quizId,
  roomId,
  currentRound,
  socketConnected,
  enabled = true,
  pollIntervalMs = 5000,
  onSnapshot,
}: UseQuizRoomFallbackOptions): UseQuizRoomFallbackResult {
  const normalizedQuizId = quizId?.trim() ?? "";
  const normalizedRoomId = roomId?.trim() ?? "";

  const hasRequiredIds =
    Boolean(normalizedQuizId) &&
    Boolean(normalizedRoomId);

  const safePollInterval = Math.max(
    1000,
    Math.floor(pollIntervalMs || 5000),
  );

  const requestedRound = Math.max(
    1,
    Math.floor(Number(currentRound) || 1),
  );

  /* ==========================================================
     STATE
  ========================================================== */

  const [quiz, setQuiz] =
    useState<QuizGameHttpQuiz | null>(null);

  const [round, setRound] =
    useState<QuizGameHttpRound | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [lastSyncedAt, setLastSyncedAt] =
    useState<number | null>(null);

  /* ==========================================================
     REFS
  ========================================================== */

  const mountedRef = useRef(false);

  const inFlightRef = useRef(false);

  const pendingRefreshRef = useRef(false);

  const refreshLatestRef =
    useRef<() => Promise<void>>(async () => {});

  const firstLoadRef = useRef(true);

  const quizRef =
    useRef<QuizGameHttpQuiz | null>(null);

  const roundRef =
    useRef<QuizGameHttpRound | null>(null);

  const onSnapshotRef = useRef(onSnapshot);

  /*
   * Always use the latest callback without restarting the
   * polling effect when the parent creates a new callback.
   */
  onSnapshotRef.current = onSnapshot;

  /* ==========================================================
     MOUNT STATUS
  ========================================================== */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ==========================================================
     RESET WHEN QUIZ OR ROOM CHANGES
  ========================================================== */

  useEffect(() => {
    quizRef.current = null;
    roundRef.current = null;

    setQuiz(null);
    setRound(null);

    setError(null);
    setLastSyncedAt(null);

    setLoading(
      enabled && hasRequiredIds,
    );

    setRefreshing(false);

    firstLoadRef.current = true;

    /*
     * Requests already in progress cannot necessarily be
     * cancelled here, but stale results are guarded below
     * by checking the current request identity.
     */
  }, [
    normalizedQuizId,
    normalizedRoomId,
    enabled,
    hasRequiredIds,
  ]);

  /* ==========================================================
     FETCH SNAPSHOT
  ========================================================== */

  const refresh = useCallback(async (): Promise<void> => {
    if (
      !enabled ||
      !normalizedQuizId ||
      !normalizedRoomId
    ) {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);

        if (enabled && normalizedQuizId && !normalizedRoomId) {
          setError(
            "Room ID is required to recover round questions.",
          );
        } else {
          setError(null);
        }
      }

      return;
    }

    /*
     * Avoid overlapping requests.
     * Queue one more refresh if a request arrives while
     * another refresh is already running.
     */
    if (inFlightRef.current) {
      pendingRefreshRef.current = true;
      return;
    }

    inFlightRef.current = true;

    if (mountedRef.current) {
      setRefreshing(true);
      setLoading(firstLoadRef.current);
    }

    /*
     * Capture IDs and round for this particular request.
     */
    const requestQuizId = normalizedQuizId;
    const requestRoomId = normalizedRoomId;
    const requestRound = requestedRound;

    try {
      const controller =
        createQuizGameHttpController(
          requestQuizId,
          requestRoomId,
        );

      /*
       * Load quiz information and round questions independently.
       * One may succeed even if the other fails.
       */
      const [quizResult, roundResult] =
        await Promise.allSettled([
          controller.getQuiz(),

          controller.getRoundQuestions(
            requestRound,
          ),
        ]);

      if (!mountedRef.current) {
        return;
      }

      /*
       * Do not apply results from an old quiz/room request
       * to the currently selected quiz/room.
       */
      if (
        requestQuizId !== normalizedQuizId ||
        requestRoomId !== normalizedRoomId
      ) {
        return;
      }

      let quizError: string | null = null;
      let roundError: string | null = null;

      let recoveredQuiz = quizRef.current;
      let recoveredRound = roundRef.current;

      /* ======================================================
         QUIZ RESULT
      ====================================================== */

      if (quizResult.status === "fulfilled") {
        recoveredQuiz = quizResult.value;
        quizRef.current = recoveredQuiz;

        setQuiz(recoveredQuiz);
      } else {
        quizError = getErrorMessage(
          quizResult.reason,
        );
      }

      /* ======================================================
         ROUND RESULT
      ====================================================== */

      if (roundResult.status === "fulfilled") {
        recoveredRound = roundResult.value;
        roundRef.current = recoveredRound;

        setRound(recoveredRound);
      } else {
        roundError = getErrorMessage(
          roundResult.reason,
        );
      }

      /* ======================================================
         ERROR / PARTIAL RECOVERY STATUS
      ====================================================== */

      const quizLoaded =
        quizResult.status === "fulfilled";

      const roundLoaded =
        roundResult.status === "fulfilled";

      if (!quizLoaded && !roundLoaded) {
        setError(
          [quizError, roundError]
            .filter(Boolean)
            .join(" "),
        );
      } else if (quizError || roundError) {
        setError(
          [
            quizError
              ? `Quiz information: ${quizError}`
              : null,

            roundError
              ? `Round questions: ${roundError}`
              : null,
          ]
            .filter(Boolean)
            .join(" "),
        );
      } else {
        setError(null);
      }

      /* ======================================================
         PUBLISH RECOVERED SNAPSHOT
      ====================================================== */

      if (quizLoaded || roundLoaded) {
        const syncedAt = Date.now();

        setLastSyncedAt(syncedAt);

        const snapshot: QuizRoomFallbackSnapshot = {
          quiz: recoveredQuiz,
          round: recoveredRound,
          syncedAt,
        };

        try {
          onSnapshotRef.current?.(snapshot);
        } catch (callbackError) {
          console.error(
            "[Quiz Room Fallback] Snapshot callback failed:",
            callbackError,
          );
        }
      }
    } catch (requestError: unknown) {
      if (mountedRef.current) {
        setError(
          getErrorMessage(requestError),
        );
      }

      console.error(
        "[Quiz Room Fallback] Recovery failed:",
        requestError,
      );
    } finally {
      inFlightRef.current = false;

      if (mountedRef.current) {
        setRefreshing(false);
        setLoading(false);

        firstLoadRef.current = false;
      }

      /*
       * Run a queued refresh using the latest callback.
       */
      if (
        pendingRefreshRef.current &&
        mountedRef.current
      ) {
        pendingRefreshRef.current = false;

        window.setTimeout(() => {
          if (mountedRef.current) {
            void refreshLatestRef.current();
          }
        }, 0);
      }
    }
  }, [
    enabled,
    normalizedQuizId,
    normalizedRoomId,
    requestedRound,
  ]);

  refreshLatestRef.current = refresh;

  /* ==========================================================
     SOCKET CONNECTION / FALLBACK POLLING
  ========================================================== */

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setRefreshing(false);
      setError(null);

      return;
    }

    if (!normalizedQuizId) {
      setLoading(false);
      setRefreshing(false);
      setError(null);

      return;
    }

    if (!normalizedRoomId) {
      setLoading(false);
      setRefreshing(false);

      setError(
        "Room ID is required to recover round questions.",
      );

      return;
    }

    /*
     * Initial baseline load and reconnect recovery.
     */
    void refresh();

    /*
     * When connected, sockets remain the primary live source.
     * The HTTP request above still loads a baseline snapshot.
     */
    if (socketConnected) {
      return;
    }

    /*
     * When disconnected, poll HTTP endpoints periodically.
     */
    const intervalId = window.setInterval(() => {
      void refreshLatestRef.current();
    }, safePollInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    enabled,
    normalizedQuizId,
    normalizedRoomId,
    socketConnected,
    safePollInterval,
    refresh,
  ]);

  /* ==========================================================
     RETURN
  ========================================================== */

  return {
    quiz,
    round,

    loading,
    refreshing,

    usingFallback:
      enabled &&
      hasRequiredIds &&
      !socketConnected,

    error,
    lastSyncedAt,

    refresh,
  };
}

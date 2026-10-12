




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
   * Quiz ID used by the existing HTTP endpoints.
   */
  quizId: string | null | undefined;

  /**
   * Current round received from the socket.
   *
   * Round 1 is used when this is zero or missing.
   */
  currentRound: number;

  /**
   * Pass your existing Socket.IO connected state.
   */
  socketConnected: boolean;

  /**
   * Disable recovery when the component does not need it.
   */
  enabled?: boolean;

  /**
   * Poll interval during socket disconnection.
   * Defaults to 5000 milliseconds.
   */
  pollIntervalMs?: number;

  /**
   * Optional callback for applying recovered data to
   * your existing component state.
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
 * The round-question endpoint may return answer keys.
 * Do not use this hook for student-facing quiz pages unless
 * your backend provides a separate student-safe API.
 *
 * This hook recovers quiz information and question data.
 * It does not replace socket events for answer submission,
 * score arbitration, room activation or question advancement.
 */
export function useQuizRoomFallback({
  quizId,
  currentRound,
  socketConnected,
  enabled = true,
  pollIntervalMs = 5000,
  onSnapshot,
}: UseQuizRoomFallbackOptions): UseQuizRoomFallbackResult {
  const normalizedQuizId = quizId?.trim() ?? "";

  const safePollInterval = Math.max(
    1000,
    Math.floor(pollIntervalMs || 5000),
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

  const onSnapshotRef =
    useRef(onSnapshot);

  /*
   * Keep the latest callback without restarting the polling
   * effect whenever the parent creates a new callback function.
   */
  onSnapshotRef.current = onSnapshot;

  /* ==========================================================
     COMPONENT MOUNT STATUS
  ========================================================== */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ==========================================================
     RESET DATA WHEN THE QUIZ CHANGES
  ========================================================== */

  useEffect(() => {
    quizRef.current = null;
    roundRef.current = null;

    setQuiz(null);
    setRound(null);

    setError(null);
    setLastSyncedAt(null);

    setLoading(true);

    firstLoadRef.current = true;
  }, [normalizedQuizId]);

  /* ==========================================================
     FETCH SNAPSHOT
  ========================================================== */

  const refresh = useCallback(async (): Promise<void> => {
    if (
      !enabled ||
      !normalizedQuizId
    ) {
      return;
    }

    /*
     * Avoid overlapping HTTP requests.
     *
     * If another refresh is requested while a request is
     * running, queue one additional refresh using the latest
     * callback after the current request finishes.
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

    try {
      const controller =
        createQuizGameHttpController(
          normalizedQuizId,
        );

      const requestedRound = Math.max(
        1,
        Math.floor(Number(currentRound) || 1),
      );

      /*
       * Load quiz information and round questions independently.
       *
       * One request can succeed even if the other fails.
       */
      const [quizResult, roundResult] =
        await Promise.allSettled([
          controller.getQuiz(),

          controller.getRoundQuestions(
            requestedRound,
          ),
        ]);

      if (!mountedRef.current) {
        return;
      }

      let quizError: string | null = null;
      let roundError: string | null = null;

      let recoveredQuiz =
        quizRef.current;

      let recoveredRound =
        roundRef.current;

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
          [
            quizError,
            roundError,
          ]
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
       * If a refresh was requested during the current request,
       * perform another one using the latest function reference.
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
    currentRound,
  ]);

  /*
   * Allows queued requests to use the latest refresh callback.
   */
  refreshLatestRef.current = refresh;

  /* ==========================================================
     SOCKET CONNECTION / FALLBACK POLLING
  ========================================================== */

  useEffect(() => {
    if (
      !enabled ||
      !normalizedQuizId
    ) {
      setLoading(false);
      setRefreshing(false);

      return;
    }

    /*
     * Initial load and reconnect recovery.
     */
    void refresh();

    /*
     * While connected, sockets remain the primary source.
     * A one-time HTTP refresh above still provides a baseline.
     */
    if (socketConnected) {
      return;
    }

    /*
     * Socket disconnected:
     * recover quiz and round data periodically.
     */
    const intervalId = window.setInterval(() => {
      void refresh();
    }, safePollInterval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    enabled,
    normalizedQuizId,
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
      Boolean(normalizedQuizId) &&
      !socketConnected,

    error,
    lastSyncedAt,

    refresh,
  };
}

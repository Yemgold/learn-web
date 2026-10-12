



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
  quizId: string | null | undefined;
  roomId: string | null | undefined;
  currentRound: number;
  socketConnected: boolean;
  enabled?: boolean;
  pollIntervalMs?: number;
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
 * HOST-ONLY HTTP RECOVERY.
 *
 * Uses quizGameHttp.ts as the single source for HTTP requests.
 *
 * - Loads a baseline snapshot.
 * - Refreshes after socket reconnection.
 * - Polls while the socket is disconnected.
 * - Rejects stale results after the quiz, room, or round changes.
 *
 * This hook does not broadcast questions to other participants.
 * The backend remains authoritative for game actions and scoring.
 *
 * Do not use with answer-bearing endpoints on student pages.
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

  const requestedRound = Math.max(
    1,
    Math.floor(Number(currentRound) || 1),
  );

  const safePollInterval = Math.max(
    1000,
    Math.floor(pollIntervalMs || 5000),
  );

  /*
   * The identity includes the round because a response for an
   * earlier round must not replace the currently requested round.
   */
  const requestIdentity = [
    normalizedQuizId,
    normalizedRoomId,
    requestedRound,
  ].join("::");

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

  const currentIdentityRef = useRef(requestIdentity);

  const quizRef =
    useRef<QuizGameHttpQuiz | null>(null);

  const roundRef =
    useRef<QuizGameHttpRound | null>(null);

  const onSnapshotRef = useRef(onSnapshot);

  /*
   * Keep these current during render. An asynchronous request
   * can then verify that it still belongs to the active view.
   */
  currentIdentityRef.current = requestIdentity;
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
     RESET WHEN THE ACTIVE REQUEST CHANGES
  ========================================================== */

  useEffect(() => {
    quizRef.current = null;
    roundRef.current = null;

    setQuiz(null);
    setRound(null);

    setError(null);
    setLastSyncedAt(null);
    setRefreshing(false);

    firstLoadRef.current = true;

    setLoading(Boolean(enabled && hasRequiredIds));
  }, [
    requestIdentity,
    enabled,
    hasRequiredIds,
  ]);

  /* ==========================================================
     REFRESH
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
     * Serialize HTTP refreshes. If another refresh is requested
     * while one is running, queue one follow-up using the latest
     * quiz, room and round.
     */
    if (inFlightRef.current) {
      pendingRefreshRef.current = true;
      return;
    }

    inFlightRef.current = true;

    const requestQuizId = normalizedQuizId;
    const requestRoomId = normalizedRoomId;
    const requestRound = requestedRound;
    const identityAtStart = requestIdentity;

    const isCurrentRequest = () =>
      mountedRef.current &&
      currentIdentityRef.current === identityAtStart;

    if (isCurrentRequest()) {
      setRefreshing(true);
      setLoading(firstLoadRef.current);
    }

    try {
      const controller =
        createQuizGameHttpController(
          requestQuizId,
          requestRoomId,
        );

      /*
       * The controller is the only place that defines these
       * endpoint calls. Promise.allSettled preserves partial
       * recovery if either endpoint fails.
       */
      const [quizResult, roundResult] =
        await Promise.allSettled([
          controller.getQuiz(),
          controller.getRoundQuestions(requestRound),
        ]);

      /*
       * Never let a response for an old room or round overwrite
       * the currently selected view.
       */
      if (!isCurrentRequest()) {
        return;
      }

      let quizError: string | null = null;
      let roundError: string | null = null;

      let recoveredQuiz = quizRef.current;
      let recoveredRound = roundRef.current;

      const quizLoaded =
        quizResult.status === "fulfilled";

      const roundLoaded =
        roundResult.status === "fulfilled";

      if (quizLoaded) {
        recoveredQuiz = quizResult.value;
        quizRef.current = recoveredQuiz;
        setQuiz(recoveredQuiz);
      } else {
        quizError = getErrorMessage(quizResult.reason);
      }

      if (roundLoaded) {
        recoveredRound = roundResult.value;
        roundRef.current = recoveredRound;
        setRound(recoveredRound);
      } else {
        roundError = getErrorMessage(roundResult.reason);
      }

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
      if (isCurrentRequest()) {
        setError(getErrorMessage(requestError));
      }

      console.error(
        "[Quiz Room Fallback] Recovery failed:",
        requestError,
      );
    } finally {
      inFlightRef.current = false;

      if (isCurrentRequest()) {
        setRefreshing(false);
        setLoading(false);
        firstLoadRef.current = false;
      }

      /*
       * If a refresh was requested while this request was
       * running, perform one fresh request with current values.
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
    requestIdentity,
  ]);

  refreshLatestRef.current = refresh;

  /* ==========================================================
     SOCKET CONNECTION AND POLLING
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
     * Load a baseline snapshot on mount, round change, and
     * reconnection. Socket events remain the primary live source.
     */
    void refresh();

    if (socketConnected) {
      return;
    }

    /*
     * While disconnected, periodically recover from REST.
     * Polling does not broadcast to other participants.
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

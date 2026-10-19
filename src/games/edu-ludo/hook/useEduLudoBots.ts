




"use client";

import { useCallback, useEffect, useRef } from "react";

import type {
  EduLudoPhase,
  EduLudoPlayerState,
} from "./useEduLudoGame";

import type {
  LudoDifficulty,
} from "../utils/ludoQuestions";

export interface UseEduLudoBotsOptions {
  phase: EduLudoPhase;
  currentPlayer: EduLudoPlayerState | null;
  difficulty: LudoDifficulty;
  guaranteedSixBonuses: Record<string, number>;

  /** Delay before a bot starts its turn. */
  turnDelayMs?: number;

  /** Delay before a bot submits its answer. */
  answerDelayMs?: number;

  /** Delay before a bot continues after seeing feedback. */
  feedbackDelayMs?: number;

  /** Called when the bot should roll its dice. */
  onRollDice: (playerId: string, forcedRoll?: number) => void;

  /** Called when the bot should answer the current question. */
  onAnswerQuestion: (playerId: string, answerIndex: number) => void;

  /** Called when the bot should continue after feedback. */
  onContinueAfterFeedback: (playerId: string) => void;

  /** Called when the bot should select one of its legal tokens. */
  onSelectToken: (playerId: string) => void;

  /** Returns whether the current bot has a legal token move. */
  hasLegalMoves: boolean;

  /** Whether the board is currently animating a move. */
  isAnimatingMove: boolean;

  /** Whether dice are currently rolling. */
  isRolling: boolean;

  /** Whether a question is currently available for the bot. */
  hasQuestion: boolean;

  /** Whether the bot answered correctly. */
  lastAnswerCorrect: boolean;

  /** Difficulty-dependent answer accuracy can be customized. */
  accuracyByDifficulty?: Partial<Record<LudoDifficulty, number>>;

  /** Consumes one saved guaranteed 6 from the bot's bonus bank. */
  onConsumeGuaranteedSix: (playerId: string) => boolean;
}

const DEFAULT_ACCURACY: Record<LudoDifficulty, number> = {
  easy: 0.91,
  medium: 0.76,
  hard: 0.58,
};

const DEFAULT_TURN_DELAY_MS = 1200;
const DEFAULT_ANSWER_DELAY_MS = 3200;
const DEFAULT_FEEDBACK_DELAY_MS = 5000;

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

function getRandomAnswerIndex(): number {
  return randomInt(4);
}

function getRandomDiceRoll(): number {
  return randomInt(6) + 1;
}

function normalizeAccuracy(
  value: number | undefined,
  fallback: number,
): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.min(1, value));
}

/**
 * Controls automated bot behavior for Educational Ludo.
 *
 * The hook does not own game state. It responds to the supplied phase,
 * current player, and callbacks.
 */
export function useEduLudoBots({
  phase,
  currentPlayer,
  difficulty,
  guaranteedSixBonuses,
  turnDelayMs = DEFAULT_TURN_DELAY_MS,
  answerDelayMs = DEFAULT_ANSWER_DELAY_MS,
  feedbackDelayMs = DEFAULT_FEEDBACK_DELAY_MS,
  onRollDice,
  onAnswerQuestion,
  onContinueAfterFeedback,
  onSelectToken,
  hasLegalMoves,
  isAnimatingMove,
  isRolling,
  hasQuestion,
  lastAnswerCorrect,
  accuracyByDifficulty,
  onConsumeGuaranteedSix,
}: UseEduLudoBotsOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionLockRef = useRef(false);
  const mountedRef = useRef(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = useCallback(
    (callback: () => void, delayMs: number) => {
      clearTimer();

      timerRef.current = setTimeout(() => {
        timerRef.current = null;

        if (!mountedRef.current) {
          return;
        }

        callback();
      }, Math.max(0, delayMs));
    },
    [clearTimer],
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  /**
   * BOT TURN:
   * When it is a bot's turn and no move or roll is in progress,
   * wait briefly, then roll.
   *
   * A bot uses a banked guaranteed 6 on a later turn if available.
   */
  useEffect(() => {
    if (
      phase !== "playing" ||
      !currentPlayer?.isBot ||
      hasLegalMoves ||
      isAnimatingMove ||
      isRolling
    ) {
      clearTimer();
      actionLockRef.current = false;
      return;
    }

    const playerId = currentPlayer.id;

    schedule(() => {
      if (actionLockRef.current) {
        return;
      }

      actionLockRef.current = true;

      const availableBonuses = guaranteedSixBonuses[playerId] ?? 0;

      if (
        availableBonuses > 0 &&
        onConsumeGuaranteedSix(playerId)
      ) {
        onRollDice(playerId, 6);
      } else {
        onRollDice(playerId, getRandomDiceRoll());
      }

      actionLockRef.current = false;
    }, turnDelayMs);

    return clearTimer;
  }, [
    phase,
    currentPlayer,
    hasLegalMoves,
    isAnimatingMove,
    isRolling,
    guaranteedSixBonuses,
    turnDelayMs,
    onRollDice,
    onConsumeGuaranteedSix,
    schedule,
    clearTimer,
  ]);

  /**
   * BOT ANSWER:
   * The bot waits before choosing an answer.
   *
   * It uses the current difficulty's accuracy setting to decide whether
   * to answer correctly. The callback receives the actual option index
   * only when the caller provides an answer-selection strategy.
   *
   * To avoid needing access to the answer key in this hook, callers should
   * pass onAnswerQuestion a function that translates a correct/incorrect
   * decision into an answer index for the current question.
   */
  useEffect(() => {
    if (
      phase !== "question" ||
      !currentPlayer?.isBot ||
      !hasQuestion
    ) {
      clearTimer();
      return;
    }

    const playerId = currentPlayer.id;

    schedule(() => {
      const accuracy = normalizeAccuracy(
        accuracyByDifficulty?.[difficulty],
        DEFAULT_ACCURACY[difficulty],
      );

      const wantsCorrectAnswer = Math.random() < accuracy;

      // The caller is responsible for translating this decision into
      // an actual option index for its current question.
      onAnswerQuestion(
        playerId,
        wantsCorrectAnswer ? 0 : getRandomAnswerIndex(),
      );
    }, answerDelayMs);

    return clearTimer;
  }, [
    phase,
    currentPlayer,
    hasQuestion,
    difficulty,
    accuracyByDifficulty,
    answerDelayMs,
    onAnswerQuestion,
    schedule,
    clearTimer,
  ]);

  /**
   * BOT FEEDBACK:
   * Wait before acting on the feedback result.
   * If the answer was correct and moves are available, select a token.
   * Otherwise, continue to the next turn.
   */
  useEffect(() => {
    if (
      phase !== "feedback" ||
      !currentPlayer?.isBot ||
      isAnimatingMove
    ) {
      clearTimer();
      return;
    }

    const playerId = currentPlayer.id;

    schedule(() => {
      if (lastAnswerCorrect && hasLegalMoves) {
        onSelectToken(playerId);
      } else {
        onContinueAfterFeedback(playerId);
      }
    }, feedbackDelayMs);

    return clearTimer;
  }, [
    phase,
    currentPlayer,
    isAnimatingMove,
    lastAnswerCorrect,
    hasLegalMoves,
    feedbackDelayMs,
    onSelectToken,
    onContinueAfterFeedback,
    schedule,
    clearTimer,
  ]);

  return {
    cancelPendingAction: clearTimer,
  };
}

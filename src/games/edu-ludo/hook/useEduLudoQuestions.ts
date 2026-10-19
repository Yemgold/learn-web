

//C:\Users\Lara Spellman\Jamb\jamb-league\src\games\edu-ludo\hook\useEduLudoQuestions.ts


"use client";

/**
 * Learnyfi Educational Ludo
 * Question-management hook.
 *
 * Responsibilities:
 * - Select questions by subject and difficulty.
 * - Charge ₦2 when a question is presented.
 * - Check submitted answers.
 * - Track consecutive correct answers per player.
 * - Award one saved guaranteed 6 after six consecutive correct answers.
 * - Reset a player's streak after a wrong answer or timeout.
 *
 * This hook manages question-related state only. Token movement,
 * turn advancement, CBT rewards, and bot timing remain in the game
 * coordinator.
 */

import { useCallback, useRef, useState } from "react";

import {
  getRandomLudoQuestion,
  type LudoDifficulty,
  type LudoQuestion,
  type LudoSubjectFilter,
} from "../utils/ludoQuestions";

import {
  calculateQuestionCharge,
  getQuestionCbtReward,
} from "../utils/ludoRewards";

export interface LudoQuestionAnswerResult {
  playerId: string;
  questionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timedOut: boolean;
  cbtReward: number;
  currentStreak: number;
  earnedGuaranteedSix: boolean;
  explanation: string;
}

export interface UseEduLudoQuestionsOptions {
  initialBalance: number;
  initialCbtPoints?: number;
  subject?: LudoSubjectFilter;
  difficulty?: LudoDifficulty;
  onCbtReward?: (playerId: string, points: number) => void;
  onGuaranteedSixEarned?: (playerId: string) => void;
  onQuestionPresented?: (playerId: string, question: LudoQuestion) => void;
}

export interface PresentQuestionOptions {
  playerId: string;
  isHuman?: boolean;
}

export interface SubmitAnswerOptions {
  playerId: string;
  selectedAnswer: number;
  timedOut?: boolean;
}

const QUESTIONS_PER_BONUS = 6;

export function useEduLudoQuestions({
  initialBalance,
  initialCbtPoints = 0,
  subject = "All Subjects",
  difficulty,
  onCbtReward,
  onGuaranteedSixEarned,
  onQuestionPresented,
}: UseEduLudoQuestionsOptions) {
  const [walletBalance, setWalletBalance] = useState(initialBalance);
  const [cbtPoints, setCbtPoints] = useState(initialCbtPoints);

  const [currentQuestion, setCurrentQuestion] =
    useState<LudoQuestion | null>(null);

  const [seenQuestionIds, setSeenQuestionIds] = useState<string[]>([]);

  const [correctStreaks, setCorrectStreaks] = useState<
    Record<string, number>
  >({});

  const [guaranteedSixBonuses, setGuaranteedSixBonuses] = useState<
    Record<string, number>
  >({});

  const [lastResult, setLastResult] =
    useState<LudoQuestionAnswerResult | null>(null);

  // Synchronous guards prevent duplicate submissions before React rerenders.
  const answerSubmittedRef = useRef(false);

  const seenQuestionIdsRef = useRef<Set<string>>(new Set());

  /**
   * Presents a question and charges the human player ₦2.
   *
   * Bot questions do not charge the human's wallet.
   * Returns false if no question is available or the human cannot pay.
   */
  const presentQuestion = useCallback(
    ({
      playerId,
      isHuman = true,
    }: PresentQuestionOptions): boolean => {
      const charge = calculateQuestionCharge(walletBalance);

      if (isHuman && !charge.canAfford) {
        return false;
      }

      const question = getRandomLudoQuestion(
        subject,
        difficulty,
        Array.from(seenQuestionIdsRef.current),
      );

      if (!question) {
        return false;
      }

      if (isHuman) {
        setWalletBalance(charge.balanceAfter);
      }

      seenQuestionIdsRef.current.add(question.id);
      setSeenQuestionIds(Array.from(seenQuestionIdsRef.current));

      answerSubmittedRef.current = false;
      setLastResult(null);
      setCurrentQuestion(question);

      onQuestionPresented?.(playerId, question);

      return true;
    },
    [walletBalance, subject, difficulty, onQuestionPresented],
  );

  /**
   * Checks an answer and updates the player's streak.
   *
   * Use selectedAnswer = -1 for a timeout. A timeout counts as incorrect
   * and resets that player's streak.
   *
   * The guaranteed 6 is banked after six consecutive correct answers.
   * It is NOT automatically used on the turn it is earned.
   */
  const submitAnswer = useCallback(
    ({
      playerId,
      selectedAnswer,
      timedOut = false,
    }: SubmitAnswerOptions): LudoQuestionAnswerResult | null => {
      const question = currentQuestion;

      if (!question || answerSubmittedRef.current) {
        return null;
      }

      answerSubmittedRef.current = true;

      const isValidAnswer =
        Number.isInteger(selectedAnswer) &&
        selectedAnswer >= 0 &&
        selectedAnswer < question.options.length;

      const isCorrect =
        !timedOut &&
        isValidAnswer &&
        selectedAnswer === question.correctAnswer;

      const previousStreak = correctStreaks[playerId] ?? 0;

      let nextStreak = 0;
      let earnedGuaranteedSix = false;
      let reward = 0;

      if (isCorrect) {
        nextStreak = previousStreak + 1;
        reward = getQuestionCbtReward(question.difficulty);

        if (nextStreak >= QUESTIONS_PER_BONUS) {
          // Bank a bonus and begin a fresh streak.
          nextStreak = 0;
          earnedGuaranteedSix = true;

          setGuaranteedSixBonuses((previous) => ({
            ...previous,
            [playerId]: (previous[playerId] ?? 0) + 1,
          }));

          onGuaranteedSixEarned?.(playerId);
        }

        setCbtPoints((previous) => previous + reward);
        onCbtReward?.(playerId, reward);
      }

      // Wrong answers and timeouts reset this player's streak only.
      setCorrectStreaks((previous) => ({
        ...previous,
        [playerId]: nextStreak,
      }));

      const result: LudoQuestionAnswerResult = {
        playerId,
        questionId: question.id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timedOut,
        cbtReward: reward,
        currentStreak: nextStreak,
        earnedGuaranteedSix,
        explanation: question.explanation,
      };

      setLastResult(result);

      return result;
    },
    [
      currentQuestion,
      correctStreaks,
      onCbtReward,
      onGuaranteedSixEarned,
    ],
  );

  /**
   * Uses one saved guaranteed 6.
   *
   * Call this only when the player chooses to use the bonus on a future
   * turn. This function consumes the bonus; the caller should then use
   * a dice value of 6 and present the resulting question.
   *
   * It intentionally does not roll the dice or present a question itself,
   * keeping turn control inside EduLudoGame.tsx.
   */
  const consumeGuaranteedSix = useCallback(
    (playerId: string): boolean => {
      const available = guaranteedSixBonuses[playerId] ?? 0;

      if (available <= 0) {
        return false;
      }

      setGuaranteedSixBonuses((previous) => {
        const current = previous[playerId] ?? 0;

        if (current <= 0) {
          return previous;
        }

        return {
          ...previous,
          [playerId]: current - 1,
        };
      });

      return true;
    },
    [guaranteedSixBonuses],
  );

  /**
   * Clears the active question and answer result.
   * Call after feedback has been displayed and the game is ready to proceed.
   */
  const clearQuestion = useCallback(() => {
    setCurrentQuestion(null);
    setLastResult(null);
    answerSubmittedRef.current = false;
  }, []);

  /**
   * Resets question-related state for a new match.
   *
   * Existing wallet and CBT values are restored from the supplied values.
   */
  const resetQuestions = useCallback(
    (
      nextWalletBalance: number = initialBalance,
      nextCbtPoints: number = initialCbtPoints,
    ) => {
      setWalletBalance(nextWalletBalance);
      setCbtPoints(nextCbtPoints);
      setCurrentQuestion(null);
      setSeenQuestionIds([]);
      setCorrectStreaks({});
      setGuaranteedSixBonuses({});
      setLastResult(null);

      seenQuestionIdsRef.current = new Set();
      answerSubmittedRef.current = false;
    },
    [initialBalance, initialCbtPoints],
  );

  const getCorrectStreak = useCallback(
    (playerId: string): number => correctStreaks[playerId] ?? 0,
    [correctStreaks],
  );

  const getGuaranteedSixCount = useCallback(
    (playerId: string): number => guaranteedSixBonuses[playerId] ?? 0,
    [guaranteedSixBonuses],
  );

  return {
    walletBalance,
    setWalletBalance,
    cbtPoints,
    setCbtPoints,
    currentQuestion,
    seenQuestionIds,
    correctStreaks,
    guaranteedSixBonuses,
    lastResult,
    presentQuestion,
    submitAnswer,
    consumeGuaranteedSix,
    clearQuestion,
    resetQuestions,
    getCorrectStreak,
    getGuaranteedSixCount,
  };
}

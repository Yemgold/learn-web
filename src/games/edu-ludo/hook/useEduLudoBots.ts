



"use client";

import { useCallback, useEffect, useRef } from "react";

import type {
  EduLudoPhase,
  EduLudoPlayerState,
} from "./useEduLudoGame";

import type { LudoDifficulty } from "../utils/ludoQuestions";

export interface UseEduLudoBotsOptions {
  phase: EduLudoPhase;
  currentPlayer: EduLudoPlayerState | null;
  difficulty: LudoDifficulty;
  guaranteedSixBonuses: Record<string, number>;

  turnDelayMs?: number;
  answerDelayMs?: number;
  feedbackDelayMs?: number;

  onRollDice: (playerId: string, forcedRoll?: number) => void;
  onAnswerQuestion: (playerId: string, answerIndex: number) => void;
  onContinueAfterFeedback: (playerId: string) => void;
  onSelectToken: (playerId: string) => void;

  hasLegalMoves: boolean;
  isAnimatingMove: boolean;
  isRolling: boolean;
  hasQuestion: boolean;
  lastAnswerCorrect: boolean;

  accuracyByDifficulty?: Partial<Record<LudoDifficulty, number>>;

  onConsumeGuaranteedSix: (playerId: string) => boolean;
}

const DEFAULT_ACCURACY: Record<LudoDifficulty, number> = {
  easy: 0.58,
  medium: 0.76,
  hard: 0.91,
};

const DEFAULT_TURN_DELAY_MS = 1200;
const DEFAULT_FEEDBACK_DELAY_MS = 5000;
const TOKEN_SELECTION_DELAY_MS = 450;

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

function getRandomDiceRoll(): number {
  return randomInt(6) + 1;
}

function getThinkingDelay(difficulty: LudoDifficulty): number {
  switch (difficulty) {
    case "easy":
      return 4200;
    case "medium":
      return 3800;
    case "hard":
      return 3200;
    default:
      return 3800;
  }
}

function normalizeAccuracy(
  value: number | undefined,
  fallback: number,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.min(1, value));
}

export function useEduLudoBots(options: UseEduLudoBotsOptions) {
  // Each action has its own timer. Never let an inactive phase cancel
  // the timer belonging to another phase.
  const rollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestRef = useRef(options);
  latestRef.current = options;

  const clearTimer = useCallback(
    (timerRef: { current: ReturnType<typeof setTimeout> | null }) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    [],
  );

  const schedule = useCallback(
    (
      timerRef: { current: ReturnType<typeof setTimeout> | null },
      callback: () => void,
      delayMs: number,
    ) => {
      clearTimer(timerRef);

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        callback();
      }, Math.max(0, delayMs));
    },
    [clearTimer],
  );

  // Clean up all outstanding actions when the hook unmounts.
  useEffect(() => {
    return () => {
      clearTimer(rollTimerRef);
      clearTimer(answerTimerRef);
      clearTimer(feedbackTimerRef);
      clearTimer(tokenTimerRef);
    };
  }, [clearTimer]);

  const playerId = options.currentPlayer?.id ?? null;
  const isBotTurn = Boolean(options.currentPlayer?.isBot);

  // ------------------------------------------------------------
  // 1. BOT DICE ROLL
  // ------------------------------------------------------------
  useEffect(() => {
    const current = latestRef.current;

    const shouldRoll =
      current.phase === "playing" &&
      Boolean(current.currentPlayer?.isBot) &&
      !current.hasLegalMoves &&
      !current.isAnimatingMove &&
      !current.isRolling &&
      !current.hasQuestion;

    if (!shouldRoll) {
      clearTimer(rollTimerRef);
      return;
    }

    const id = current.currentPlayer!.id;

    schedule(
      rollTimerRef,
      () => {
        const latest = latestRef.current;

        if (
          latest.phase !== "playing" ||
          latest.currentPlayer?.id !== id ||
          !latest.currentPlayer?.isBot ||
          latest.hasLegalMoves ||
          latest.isAnimatingMove ||
          latest.isRolling ||
          latest.hasQuestion
        ) {
          return;
        }

        let roll: number;

        const hasBonus = (latest.guaranteedSixBonuses[id] ?? 0) > 0;

        if (hasBonus && latest.onConsumeGuaranteedSix(id)) {
          roll = 6;
        } else {
          roll = getRandomDiceRoll();
        }

        latest.onRollDice(id, roll);
      },
      current.turnDelayMs ?? DEFAULT_TURN_DELAY_MS,
    );

    return () => clearTimer(rollTimerRef);
  }, [
    options.phase,
    playerId,
    isBotTurn,
    options.hasLegalMoves,
    options.isAnimatingMove,
    options.isRolling,
    options.hasQuestion,
    options.guaranteedSixBonuses,
    options.turnDelayMs,
    options.onRollDice,
    options.onConsumeGuaranteedSix,
    schedule,
    clearTimer,
  ]);

  // ------------------------------------------------------------
  // 2. BOT ANSWERS THE QUESTION
  // ------------------------------------------------------------
  useEffect(() => {
    const current = latestRef.current;

    const shouldAnswer =
      current.phase === "question" &&
      Boolean(current.currentPlayer?.isBot) &&
      current.hasQuestion;

    if (!shouldAnswer) {
      clearTimer(answerTimerRef);
      return;
    }

    const id = current.currentPlayer!.id;
    const difficulty = current.difficulty;

    const accuracy = normalizeAccuracy(
      current.accuracyByDifficulty?.[difficulty],
      DEFAULT_ACCURACY[difficulty],
    );

    const delay =
      current.answerDelayMs ?? getThinkingDelay(difficulty);

    schedule(
      answerTimerRef,
      () => {
        const latest = latestRef.current;

        if (
          latest.phase !== "question" ||
          latest.currentPlayer?.id !== id ||
          !latest.currentPlayer?.isBot ||
          !latest.hasQuestion
        ) {
          return;
        }

        const wantsCorrectAnswer = Math.random() < accuracy;

        /*
         * IMPORTANT:
         * The parent callback must interpret:
         *   0     = choose the correct answer
         *   1–3   = choose an incorrect answer
         *
         * The nonzero value is an intent marker, not necessarily
         * the actual wrong option index.
         */
        const answerIntent = wantsCorrectAnswer
          ? 0
          : randomInt(3) + 1;

        latest.onAnswerQuestion(id, answerIntent);
      },
      delay,
    );

    return () => clearTimer(answerTimerRef);
  }, [
    options.phase,
    playerId,
    isBotTurn,
    options.hasQuestion,
    options.difficulty,
    options.answerDelayMs,
    options.accuracyByDifficulty,
    options.onAnswerQuestion,
    schedule,
    clearTimer,
  ]);

  // ------------------------------------------------------------
  // 3. BOT WAITS FOR FEEDBACK, THEN CONTINUES
  // ------------------------------------------------------------
  useEffect(() => {
    const current = latestRef.current;

    const shouldContinue =
      current.phase === "feedback" &&
      Boolean(current.currentPlayer?.isBot) &&
      !current.isAnimatingMove;

    if (!shouldContinue) {
      clearTimer(feedbackTimerRef);
      return;
    }

    const id = current.currentPlayer!.id;

    schedule(
      feedbackTimerRef,
      () => {
        const latest = latestRef.current;

        if (
          latest.phase !== "feedback" ||
          latest.currentPlayer?.id !== id ||
          !latest.currentPlayer?.isBot ||
          latest.isAnimatingMove
        ) {
          return;
        }

        // The parent must transition the game out of feedback.
        latest.onContinueAfterFeedback(id);
      },
      current.feedbackDelayMs ?? DEFAULT_FEEDBACK_DELAY_MS,
    );

    return () => clearTimer(feedbackTimerRef);
  }, [
    options.phase,
    playerId,
    isBotTurn,
    options.isAnimatingMove,
    options.feedbackDelayMs,
    options.onContinueAfterFeedback,
    schedule,
    clearTimer,
  ]);

  // ------------------------------------------------------------
  // 4. BOT AUTOMATICALLY SELECTS A LEGAL TOKEN
  // ------------------------------------------------------------
  useEffect(() => {
    const current = latestRef.current;

    const shouldSelectToken =
      current.phase === "playing" &&
      Boolean(current.currentPlayer?.isBot) &&
      current.hasLegalMoves &&
      !current.isAnimatingMove &&
      !current.isRolling &&
      !current.hasQuestion;

    if (!shouldSelectToken) {
      clearTimer(tokenTimerRef);
      return;
    }

    const id = current.currentPlayer!.id;

    schedule(
      tokenTimerRef,
      () => {
        const latest = latestRef.current;

        if (
          latest.phase !== "playing" ||
          latest.currentPlayer?.id !== id ||
          !latest.currentPlayer?.isBot ||
          !latest.hasLegalMoves ||
          latest.isAnimatingMove ||
          latest.isRolling ||
          latest.hasQuestion
        ) {
          return;
        }

        latest.onSelectToken(id);
      },
      TOKEN_SELECTION_DELAY_MS,
    );

    return () => clearTimer(tokenTimerRef);
  }, [
    options.phase,
    playerId,
    isBotTurn,
    options.hasLegalMoves,
    options.isAnimatingMove,
    options.isRolling,
    options.hasQuestion,
    options.onSelectToken,
    schedule,
    clearTimer,
  ]);

  const cancelPendingAction = useCallback(() => {
    clearTimer(rollTimerRef);
    clearTimer(answerTimerRef);
    clearTimer(feedbackTimerRef);
    clearTimer(tokenTimerRef);
  }, [clearTimer]);

  return { cancelPendingAction };
}















// // "use client";

// // import { useCallback, useEffect, useRef } from "react";

// // import type {
// //   EduLudoPhase,
// //   EduLudoPlayerState,
// // } from "./useEduLudoGame";

// // import type {
// //   LudoDifficulty,
// // } from "../utils/ludoQuestions";

// // export interface UseEduLudoBotsOptions {
// //   phase: EduLudoPhase;
// //   currentPlayer: EduLudoPlayerState | null;
// //   difficulty: LudoDifficulty;
// //   guaranteedSixBonuses: Record<string, number>;

// //   /** Delay before a bot starts its turn. */
// //   turnDelayMs?: number;

// //   /** Delay before a bot submits its answer. */
// //   answerDelayMs?: number;

// //   /** Delay before a bot continues after seeing feedback. */
// //   feedbackDelayMs?: number;

// //   /** Called when the bot should roll its dice. */
// //   onRollDice: (playerId: string, forcedRoll?: number) => void;

// //   /** Called when the bot should answer the current question. */
// //   onAnswerQuestion: (playerId: string, answerIndex: number) => void;

// //   /** Called when the bot should continue after feedback. */
// //   onContinueAfterFeedback: (playerId: string) => void;

// //   /** Called when the bot should select one of its legal tokens. */
// //   onSelectToken: (playerId: string) => void;

// //   /** Returns whether the current bot has a legal token move. */
// //   hasLegalMoves: boolean;

// //   /** Whether the board is currently animating a move. */
// //   isAnimatingMove: boolean;

// //   /** Whether dice are currently rolling. */
// //   isRolling: boolean;

// //   /** Whether a question is currently available for the bot. */
// //   hasQuestion: boolean;

// //   /** Whether the bot answered correctly. */
// //   lastAnswerCorrect: boolean;

// //   /** Difficulty-dependent answer accuracy can be customized. */
// //   accuracyByDifficulty?: Partial<Record<LudoDifficulty, number>>;

// //   /** Consumes one saved guaranteed 6 from the bot's bonus bank. */
// //   onConsumeGuaranteedSix: (playerId: string) => boolean;
// // }

// // const DEFAULT_ACCURACY: Record<LudoDifficulty, number> = {
// //   easy: 0.91,
// //   medium: 0.76,
// //   hard: 0.58,
// // };

// // const DEFAULT_TURN_DELAY_MS = 1200;
// // const DEFAULT_ANSWER_DELAY_MS = 3200;
// // const DEFAULT_FEEDBACK_DELAY_MS = 5000;

// // function randomInt(maxExclusive: number): number {
// //   return Math.floor(Math.random() * maxExclusive);
// // }

// // function getRandomAnswerIndex(): number {
// //   return randomInt(4);
// // }

// // function getRandomDiceRoll(): number {
// //   return randomInt(6) + 1;
// // }

// // function normalizeAccuracy(
// //   value: number | undefined,
// //   fallback: number,
// // ): number {
// //   if (value === undefined || !Number.isFinite(value)) {
// //     return fallback;
// //   }

// //   return Math.max(0, Math.min(1, value));
// // }

// // /**
// //  * Controls automated bot behavior for Educational Ludo.
// //  *
// //  * The hook does not own game state. It responds to the supplied phase,
// //  * current player, and callbacks.
// //  */
// // export function useEduLudoBots({
// //   phase,
// //   currentPlayer,
// //   difficulty,
// //   guaranteedSixBonuses,
// //   turnDelayMs = DEFAULT_TURN_DELAY_MS,
// //   answerDelayMs = DEFAULT_ANSWER_DELAY_MS,
// //   feedbackDelayMs = DEFAULT_FEEDBACK_DELAY_MS,
// //   onRollDice,
// //   onAnswerQuestion,
// //   onContinueAfterFeedback,
// //   onSelectToken,
// //   hasLegalMoves,
// //   isAnimatingMove,
// //   isRolling,
// //   hasQuestion,
// //   lastAnswerCorrect,
// //   accuracyByDifficulty,
// //   onConsumeGuaranteedSix,
// // }: UseEduLudoBotsOptions) {
// //   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// //   const actionLockRef = useRef(false);
// //   const mountedRef = useRef(true);

// //   const clearTimer = useCallback(() => {
// //     if (timerRef.current !== null) {
// //       clearTimeout(timerRef.current);
// //       timerRef.current = null;
// //     }
// //   }, []);

// //   const schedule = useCallback(
// //     (callback: () => void, delayMs: number) => {
// //       clearTimer();

// //       timerRef.current = setTimeout(() => {
// //         timerRef.current = null;

// //         if (!mountedRef.current) {
// //           return;
// //         }

// //         callback();
// //       }, Math.max(0, delayMs));
// //     },
// //     [clearTimer],
// //   );

// //   useEffect(() => {
// //     mountedRef.current = true;

// //     return () => {
// //       mountedRef.current = false;

// //       if (timerRef.current !== null) {
// //         clearTimeout(timerRef.current);
// //         timerRef.current = null;
// //       }
// //     };
// //   }, []);

// //   /**
// //    * BOT TURN:
// //    * When it is a bot's turn and no move or roll is in progress,
// //    * wait briefly, then roll.
// //    *
// //    * A bot uses a banked guaranteed 6 on a later turn if available.
// //    */
// //   useEffect(() => {
// //     if (
// //       phase !== "playing" ||
// //       !currentPlayer?.isBot ||
// //       hasLegalMoves ||
// //       isAnimatingMove ||
// //       isRolling
// //     ) {
// //       clearTimer();
// //       actionLockRef.current = false;
// //       return;
// //     }

// //     const playerId = currentPlayer.id;

// //     schedule(() => {
// //       if (actionLockRef.current) {
// //         return;
// //       }

// //       actionLockRef.current = true;

// //       const availableBonuses = guaranteedSixBonuses[playerId] ?? 0;

// //       if (
// //         availableBonuses > 0 &&
// //         onConsumeGuaranteedSix(playerId)
// //       ) {
// //         onRollDice(playerId, 6);
// //       } else {
// //         onRollDice(playerId, getRandomDiceRoll());
// //       }

// //       actionLockRef.current = false;
// //     }, turnDelayMs);

// //     return clearTimer;
// //   }, [
// //     phase,
// //     currentPlayer,
// //     hasLegalMoves,
// //     isAnimatingMove,
// //     isRolling,
// //     guaranteedSixBonuses,
// //     turnDelayMs,
// //     onRollDice,
// //     onConsumeGuaranteedSix,
// //     schedule,
// //     clearTimer,
// //   ]);

// //   /**
// //    * BOT ANSWER:
// //    * The bot waits before choosing an answer.
// //    *
// //    * It uses the current difficulty's accuracy setting to decide whether
// //    * to answer correctly. The callback receives the actual option index
// //    * only when the caller provides an answer-selection strategy.
// //    *
// //    * To avoid needing access to the answer key in this hook, callers should
// //    * pass onAnswerQuestion a function that translates a correct/incorrect
// //    * decision into an answer index for the current question.
// //    */
// //   useEffect(() => {
// //     if (
// //       phase !== "question" ||
// //       !currentPlayer?.isBot ||
// //       !hasQuestion
// //     ) {
// //       clearTimer();
// //       return;
// //     }

// //     const playerId = currentPlayer.id;

// //     schedule(() => {
// //       const accuracy = normalizeAccuracy(
// //         accuracyByDifficulty?.[difficulty],
// //         DEFAULT_ACCURACY[difficulty],
// //       );

// //       const wantsCorrectAnswer = Math.random() < accuracy;

// //       // The caller is responsible for translating this decision into
// //       // an actual option index for its current question.
// //       onAnswerQuestion(
// //         playerId,
// //         wantsCorrectAnswer ? 0 : getRandomAnswerIndex(),
// //       );
// //     }, answerDelayMs);

// //     return clearTimer;
// //   }, [
// //     phase,
// //     currentPlayer,
// //     hasQuestion,
// //     difficulty,
// //     accuracyByDifficulty,
// //     answerDelayMs,
// //     onAnswerQuestion,
// //     schedule,
// //     clearTimer,
// //   ]);

// //   /**
// //    * BOT FEEDBACK:
// //    * Wait before acting on the feedback result.
// //    * If the answer was correct and moves are available, select a token.
// //    * Otherwise, continue to the next turn.
// //    */
// //   useEffect(() => {
// //     if (
// //       phase !== "feedback" ||
// //       !currentPlayer?.isBot ||
// //       isAnimatingMove
// //     ) {
// //       clearTimer();
// //       return;
// //     }

// //     const playerId = currentPlayer.id;

// //     schedule(() => {
// //       if (lastAnswerCorrect && hasLegalMoves) {
// //         onSelectToken(playerId);
// //       } else {
// //         onContinueAfterFeedback(playerId);
// //       }
// //     }, feedbackDelayMs);

// //     return clearTimer;
// //   }, [
// //     phase,
// //     currentPlayer,
// //     isAnimatingMove,
// //     lastAnswerCorrect,
// //     hasLegalMoves,
// //     feedbackDelayMs,
// //     onSelectToken,
// //     onContinueAfterFeedback,
// //     schedule,
// //     clearTimer,
// //   ]);

// //   return {
// //     cancelPendingAction: clearTimer,
// //   };
// // }







// "use client";

// import { useCallback, useEffect, useRef } from "react";
// import type {
//   EduLudoPhase,
//   EduLudoPlayerState,
// } from "./useEduLudoGame";
// import type { LudoDifficulty } from "../utils/ludoQuestions";

// export interface UseEduLudoBotsOptions {
//   phase: EduLudoPhase;
//   currentPlayer: EduLudoPlayerState | null;
//   difficulty: LudoDifficulty;
//   guaranteedSixBonuses: Record<string, number>;
//   turnDelayMs?: number;
//   answerDelayMs?: number;
//   feedbackDelayMs?: number;
//   onRollDice: (playerId: string, forcedRoll?: number) => void;
//   onAnswerQuestion: (playerId: string, answerIndex: number) => void;
//   onContinueAfterFeedback: (playerId: string) => void;
//   onSelectToken: (playerId: string) => void;
//   hasLegalMoves: boolean;
//   isAnimatingMove: boolean;
//   isRolling: boolean;
//   hasQuestion: boolean;
//   lastAnswerCorrect: boolean;
//   accuracyByDifficulty?: Partial<Record<LudoDifficulty, number>>;
//   onConsumeGuaranteedSix: (playerId: string) => boolean;
// }

// const DEFAULT_ACCURACY: Record<LudoDifficulty, number> = {
//   easy: 0.58,
//   medium: 0.76,
//   hard: 0.91,
// };

// const DEFAULT_TURN_DELAY_MS = 1200;
// const DEFAULT_FEEDBACK_DELAY_MS = 5000;

// function randomInt(maxExclusive: number): number {
//   return Math.floor(Math.random() * maxExclusive);
// }

// function getRandomDiceRoll(): number {
//   return randomInt(6) + 1;
// }

// function normalizeAccuracy(value: number | undefined, fallback: number) {
//   if (typeof value !== "number" || !Number.isFinite(value)) {
//     return fallback;
//   }

//   return Math.max(0, Math.min(1, value));
// }

// function getThinkingDelay(difficulty: LudoDifficulty): number {
//   switch (difficulty) {
//     case "easy":
//       return 4200;
//     case "medium":
//       return 3800;
//     case "hard":
//       return 3200;
//     default:
//       return 3800;
//   }
// }

// export function useEduLudoBots(options: UseEduLudoBotsOptions) {
//   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // Keep current callbacks available without restarting timers on every render.
//   const latestRef = useRef(options);
//   latestRef.current = options;

//   const clearTimer = useCallback(() => {
//     if (timerRef.current !== null) {
//       clearTimeout(timerRef.current);
//       timerRef.current = null;
//     }
//   }, []);

//   const schedule = useCallback(
//     (callback: () => void, delayMs: number) => {
//       clearTimer();

//       timerRef.current = setTimeout(() => {
//         timerRef.current = null;
//         callback();
//       }, Math.max(0, delayMs));
//     },
//     [clearTimer],
//   );

//   useEffect(() => {
//     return () => clearTimer();
//   }, [clearTimer]);

//   const playerId = options.currentPlayer?.id ?? null;
//   const isBotTurn = Boolean(options.currentPlayer?.isBot);

//   // 1. Start a bot's turn by rolling the dice.
//   useEffect(() => {
//     const current = latestRef.current;

//     if (
//       current.phase !== "playing" ||
//       !current.currentPlayer?.isBot ||
//       current.hasLegalMoves ||
//       current.isAnimatingMove ||
//       current.isRolling ||
//       current.hasQuestion
//     ) {
//       clearTimer();
//       return;
//     }

//     const id = current.currentPlayer.id;

//     schedule(() => {
//       const latest = latestRef.current;

//       if (
//         latest.phase !== "playing" ||
//         latest.currentPlayer?.id !== id ||
//         !latest.currentPlayer.isBot ||
//         latest.isAnimatingMove ||
//         latest.isRolling ||
//         latest.hasQuestion
//       ) {
//         return;
//       }

//       const hasBonus = (latest.guaranteedSixBonuses[id] ?? 0) > 0;
//       let forcedRoll: number | undefined;

//       // Consume the saved bonus here. The parent must not consume it again
//       // when it receives this forced roll.
//       if (hasBonus && latest.onConsumeGuaranteedSix(id)) {
//         forcedRoll = 6;
//       } else {
//         forcedRoll = getRandomDiceRoll();
//       }

//       latest.onRollDice(id, forcedRoll);
//     }, current.turnDelayMs ?? DEFAULT_TURN_DELAY_MS);

//     return clearTimer;
//   }, [
//     options.phase,
//     playerId,
//     isBotTurn,
//     options.hasLegalMoves,
//     options.isAnimatingMove,
//     options.isRolling,
//     options.hasQuestion,
//     options.guaranteedSixBonuses,
//     options.turnDelayMs,
//     schedule,
//     clearTimer,
//   ]);

//   // 2. Let the bot visibly think before submitting its answer.
//   useEffect(() => {
//     const current = latestRef.current;

//     if (
//       current.phase !== "question" ||
//       !current.currentPlayer?.isBot ||
//       !current.hasQuestion
//     ) {
//       clearTimer();
//       return;
//     }

//     const id = current.currentPlayer.id;
//     const difficulty = current.difficulty;
//     const accuracy = normalizeAccuracy(
//       current.accuracyByDifficulty?.[difficulty],
//       DEFAULT_ACCURACY[difficulty],
//     );
//     const delay =
//       current.answerDelayMs ?? getThinkingDelay(difficulty);

//     schedule(() => {
//       const latest = latestRef.current;

//       if (
//         latest.phase !== "question" ||
//         latest.currentPlayer?.id !== id ||
//         !latest.currentPlayer.isBot ||
//         !latest.hasQuestion
//       ) {
//         return;
//       }

//       // Index 0 means "choose the correct answer" to the parent callback.
//       // Indices 1–3 mean "choose an incorrect answer"; the parent maps that
//       // intent to a real, randomly selected wrong option.
//       const wantsCorrectAnswer = Math.random() < accuracy;
//       const answerIntent = wantsCorrectAnswer ? 0 : randomInt(3) + 1;

//       latest.onAnswerQuestion(id, answerIntent);
//     }, delay);

//     return clearTimer;
//   }, [
//     options.phase,
//     playerId,
//     isBotTurn,
//     options.hasQuestion,
//     options.difficulty,
//     options.answerDelayMs,
//     options.accuracyByDifficulty,
//     schedule,
//     clearTimer,
//   ]);

//   // 3. Keep the answer and explanation visible before continuing.
//   // Always let the coordinator recalculate legal moves after feedback.
//   useEffect(() => {
//     const current = latestRef.current;

//     if (
//       current.phase !== "feedback" ||
//       !current.currentPlayer?.isBot ||
//       current.isAnimatingMove
//     ) {
//       clearTimer();
//       return;
//     }

//     const id = current.currentPlayer.id;

//     schedule(() => {
//       const latest = latestRef.current;

//       if (
//         latest.phase !== "feedback" ||
//         latest.currentPlayer?.id !== id ||
//         !latest.currentPlayer.isBot ||
//         latest.isAnimatingMove
//       ) {
//         return;
//       }

//       latest.onContinueAfterFeedback(id);
//     }, current.feedbackDelayMs ?? DEFAULT_FEEDBACK_DELAY_MS);

//     return clearTimer;
//   }, [
//     options.phase,
//     playerId,
//     isBotTurn,
//     options.isAnimatingMove,
//     options.feedbackDelayMs,
//     schedule,
//     clearTimer,
//   ]);

//   // 4. Once the coordinator has returned to "playing", automatically choose
//   // a legal token. This separate step avoids selecting before moves recalc.
//   useEffect(() => {
//     const current = latestRef.current;

//     if (
//       current.phase !== "playing" ||
//       !current.currentPlayer?.isBot ||
//       !current.hasLegalMoves ||
//       current.isAnimatingMove ||
//       current.isRolling ||
//       current.hasQuestion
//     ) {
//       return;
//     }

//     const id = current.currentPlayer.id;

//     schedule(() => {
//       const latest = latestRef.current;

//       if (
//         latest.phase !== "playing" ||
//         latest.currentPlayer?.id !== id ||
//         !latest.currentPlayer.isBot ||
//         !latest.hasLegalMoves ||
//         latest.isAnimatingMove ||
//         latest.isRolling ||
//         latest.hasQuestion
//       ) {
//         return;
//       }

//       latest.onSelectToken(id);
//     }, 450);

//     return clearTimer;
//   }, [
//     options.phase,
//     playerId,
//     isBotTurn,
//     options.hasLegalMoves,
//     options.isAnimatingMove,
//     options.isRolling,
//     options.hasQuestion,
//     schedule,
//     clearTimer,
//   ]);

//   return { cancelPendingAction: clearTimer };
// }





"use client";

import { useCallback, useMemo, useState } from "react";

export const CORRECT_ANSWERS_FOR_GUARANTEED_SIX = 6;

export interface EduLudoPlayerBonusState {
  /** Consecutive correct answers toward the next guaranteed six. */
  correctStreak: number;

  /** Guaranteed six bonuses available to use on future turns. */
  guaranteedSixCount: number;

  /** Whether the player has reached the streak threshold. */
  streakReady: boolean;
}

export interface EduLudoBonusEvent {
  playerId: string;
  correctStreak: number;
  guaranteedSixCount: number;
}

export interface UseEduLudoBonusesOptions {
  /** Number of consecutive correct answers required to earn a bonus. */
  answersRequired?: number;

  /** Called when a player earns a guaranteed six. */
  onGuaranteedSixEarned?: (event: EduLudoBonusEvent) => void;

  /** Called when a player's saved guaranteed six is consumed. */
  onGuaranteedSixUsed?: (event: EduLudoBonusEvent) => void;

  /** Called when a player's streak is reset by a wrong answer or timeout. */
  onStreakReset?: (playerId: string) => void;
}

export interface UseEduLudoBonusesReturn {
  bonuses: Record<string, EduLudoPlayerBonusState>;

  getBonusState: (playerId: string) => EduLudoPlayerBonusState;
  getCorrectStreak: (playerId: string) => number;
  getGuaranteedSixCount: (playerId: string) => number;
  hasGuaranteedSix: (playerId: string) => boolean;

  /** Record a correct answer and award a saved six when the threshold is reached. */
  recordCorrectAnswer: (playerId: string) => EduLudoBonusEvent | null;

  /** Reset only this player's streak after a wrong answer or timeout. */
  recordWrongAnswer: (playerId: string) => void;

  /** Use one saved bonus on a future turn. Returns true if one was available. */
  consumeGuaranteedSix: (playerId: string) => boolean;

  /** Clear one player's streak and saved bonuses. */
  resetPlayerBonuses: (playerId: string) => void;

  /** Clear every player's streaks and saved bonuses. */
  resetAllBonuses: () => void;

  /** Initialize bonus tracking for a player without overwriting existing progress. */
  registerPlayer: (playerId: string) => void;
}

const EMPTY_BONUS_STATE: EduLudoPlayerBonusState = {
  correctStreak: 0,
  guaranteedSixCount: 0,
  streakReady: false,
};

function createBonusState(): EduLudoPlayerBonusState {
  return { ...EMPTY_BONUS_STATE };
}

export function useEduLudoBonuses(
  options: UseEduLudoBonusesOptions = {},
): UseEduLudoBonusesReturn {
  const {
    answersRequired = CORRECT_ANSWERS_FOR_GUARANTEED_SIX,
    onGuaranteedSixEarned,
    onGuaranteedSixUsed,
    onStreakReset,
  } = options;

  const threshold = Math.max(1, Math.floor(answersRequired));

  const [bonuses, setBonuses] = useState<
    Record<string, EduLudoPlayerBonusState>
  >({});

  const getBonusState = useCallback(
    (playerId: string): EduLudoPlayerBonusState =>
      bonuses[playerId] ?? EMPTY_BONUS_STATE,
    [bonuses],
  );

  const getCorrectStreak = useCallback(
    (playerId: string) => getBonusState(playerId).correctStreak,
    [getBonusState],
  );

  const getGuaranteedSixCount = useCallback(
    (playerId: string) => getBonusState(playerId).guaranteedSixCount,
    [getBonusState],
  );

  const hasGuaranteedSix = useCallback(
    (playerId: string) => getGuaranteedSixCount(playerId) > 0,
    [getGuaranteedSixCount],
  );

  const registerPlayer = useCallback((playerId: string) => {
    if (!playerId) return;

    setBonuses((previous) => {
      if (previous[playerId]) return previous;

      return {
        ...previous,
        [playerId]: createBonusState(),
      };
    });
  }, []);

  const recordCorrectAnswer = useCallback(
    (playerId: string): EduLudoBonusEvent | null => {
      if (!playerId) return null;

      let earnedEvent: EduLudoBonusEvent | null = null;

      setBonuses((previous) => {
        const current = previous[playerId] ?? createBonusState();
        const nextStreak = current.correctStreak + 1;

        if (nextStreak >= threshold) {
          const nextBonusCount = current.guaranteedSixCount + 1;

          earnedEvent = {
            playerId,
            correctStreak: 0,
            guaranteedSixCount: nextBonusCount,
          };

          return {
            ...previous,
            [playerId]: {
              correctStreak: 0,
              guaranteedSixCount: nextBonusCount,
              streakReady: false,
            },
          };
        }

        return {
          ...previous,
          [playerId]: {
            ...current,
            correctStreak: nextStreak,
            streakReady: nextStreak >= threshold,
          },
        };
      });

      /*
       * State updater functions may be replayed by React in development.
       * The callback is deliberately not called inside the updater.
       *
       * The next render exposes the updated state. Consumers can use the
       * returned state/getters to drive the UI and can observe earned events
       * through their own answer-resolution flow.
       */
      return earnedEvent;
    },
    [threshold],
  );

  const recordWrongAnswer = useCallback(
    (playerId: string) => {
      if (!playerId) return;

      const current = bonuses[playerId] ?? EMPTY_BONUS_STATE;

      if (current.correctStreak > 0) {
        onStreakReset?.(playerId);
      }

      setBonuses((previous) => {
        const existing = previous[playerId] ?? createBonusState();

        return {
          ...previous,
          [playerId]: {
            ...existing,
            correctStreak: 0,
            streakReady: false,
          },
        };
      });
    },
    [bonuses, onStreakReset],
  );

  const consumeGuaranteedSix = useCallback(
    (playerId: string): boolean => {
      if (!playerId) return false;

      const current = bonuses[playerId] ?? EMPTY_BONUS_STATE;

      if (current.guaranteedSixCount <= 0) return false;

      const nextCount = current.guaranteedSixCount - 1;

      setBonuses((previous) => {
        const existing = previous[playerId] ?? EMPTY_BONUS_STATE;

        if (existing.guaranteedSixCount <= 0) return previous;

        return {
          ...previous,
          [playerId]: {
            ...existing,
            guaranteedSixCount: existing.guaranteedSixCount - 1,
          },
        };
      });

      onGuaranteedSixUsed?.({
        playerId,
        correctStreak: current.correctStreak,
        guaranteedSixCount: nextCount,
      });

      return true;
    },
    [bonuses, onGuaranteedSixUsed],
  );

  const resetPlayerBonuses = useCallback((playerId: string) => {
    if (!playerId) return;

    setBonuses((previous) => ({
      ...previous,
      [playerId]: createBonusState(),
    }));
  }, []);

  const resetAllBonuses = useCallback(() => {
    setBonuses({});
  }, []);

  return useMemo(
    () => ({
      bonuses,
      getBonusState,
      getCorrectStreak,
      getGuaranteedSixCount,
      hasGuaranteedSix,
      recordCorrectAnswer,
      recordWrongAnswer,
      consumeGuaranteedSix,
      resetPlayerBonuses,
      resetAllBonuses,
      registerPlayer,
    }),
    [
      bonuses,
      getBonusState,
      getCorrectStreak,
      getGuaranteedSixCount,
      hasGuaranteedSix,
      recordCorrectAnswer,
      recordWrongAnswer,
      consumeGuaranteedSix,
      resetPlayerBonuses,
      resetAllBonuses,
      registerPlayer,
    ],
  );
}

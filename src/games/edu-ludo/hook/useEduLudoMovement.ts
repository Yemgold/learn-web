




"use client";

/**
 * Learnyfi Educational Ludo
 * Token movement hook.
 *
 * Responsibilities:
 * - Calculate legal moves.
 * - Calculate token destinations.
 * - Animate token movement one square at a time.
 * - Identify captures on the shared track.
 * - Detect tokens reaching home and players winning.
 *
 * The game coordinator remains responsible for applying the returned
 * results to the authoritative player state and awarding CBT rewards.
 */

import { useCallback, useRef } from "react";

import {
  FINISH_POSITION,
  TRACK_LENGTH,
  canTokenMove,
  getGlobalTrackPosition,
  getTokenDestination,
  hasPlayerWon,
  isSafePosition,
} from "../utils/ludoMovement";

import type { EduLudoColor } from "../components/eduLudoTypes"; 

export interface LudoMovementToken {
  id: string;
  position: number;
}

export interface LudoMovementPlayer {
  id: string;
  color: EduLudoColor;
  hasWon?: boolean;
  tokens: LudoMovementToken[];
}

export interface LudoLegalMove {
  playerId: string;
  tokenId: string;
  from: number;
  to: number;
  diceRoll: number;
}

export interface LudoCapture {
  playerId: string;
  tokenId: string;
  previousPosition: number;
}

export interface LudoMovementResult {
  move: LudoLegalMove;
  captures: LudoCapture[];
  tokenReachedHome: boolean;
  playerWon: boolean;
}

export interface UseEduLudoMovementOptions {
  stepDurationMs?: number;
  onStep?: (
    playerId: string,
    tokenId: string,
    position: number,
    stepIndex: number,
  ) => void;
}

const DEFAULT_STEP_DURATION_MS = 300;

/**
 * Returns all legal moves for the specified player and dice roll.
 */
export function getPlayerLegalMoves(
  player: LudoMovementPlayer,
  diceRoll: number,
): LudoLegalMove[] {
  if (player.hasWon) {
    return [];
  }

  return player.tokens.flatMap((token) => {
    if (!canTokenMove(token.position, diceRoll)) {
      return [];
    }

    const destination = getTokenDestination(token.position, diceRoll);

    if (destination === null) {
      return [];
    }

    return [
      {
        playerId: player.id,
        tokenId: token.id,
        from: token.position,
        to: destination,
        diceRoll,
      },
    ];
  });
}

/**
 * Finds a token by ID in a player collection.
 */
export function findLudoToken(
  players: readonly LudoMovementPlayer[],
  playerId: string,
  tokenId: string,
): LudoMovementToken | null {
  const player = players.find((entry) => entry.id === playerId);

  return player?.tokens.find((token) => token.id === tokenId) ?? null;
}

/**
 * Checks whether a relative token position is on the shared track.
 */
export function isOnSharedTrack(position: number): boolean {
  return position >= 0 && position < TRACK_LENGTH;
}

/**
 * Returns the global track square for a token, or null if it is not
 * currently on the shared track.
 */
export function getSharedTrackPosition(
  color: EduLudoColor,
  relativePosition: number,
): number | null {
  if (!isOnSharedTrack(relativePosition)) {
    return null;
  }

  return getGlobalTrackPosition(color, relativePosition);
}

/**
 * Determines which opposing tokens would be captured when the moving
 * token reaches its destination.
 *
 * Captures happen only on the shared track. Tokens on safe squares,
 * in base, or on their home paths cannot be captured.
 *
 * This function returns capture information but does not mutate players.
 */
export function findLudoCaptures(
  players: readonly LudoMovementPlayer[],
  movingPlayerId: string,
  movingTokenId: string,
  destination: number,
): LudoCapture[] {
  if (!isOnSharedTrack(destination)) {
    return [];
  }

  const movingPlayer = players.find(
    (player) => player.id === movingPlayerId,
  );

  if (!movingPlayer || isSafePosition(destination)) {
    return [];
  }

  const destinationGlobal = getSharedTrackPosition(
    movingPlayer.color,
    destination,
  );

  if (destinationGlobal === null) {
    return [];
  }

  const captures: LudoCapture[] = [];

  for (const opponent of players) {
    if (opponent.id === movingPlayerId || opponent.hasWon) {
      continue;
    }

    for (const token of opponent.tokens) {
      if (token.position < 0 || token.position >= TRACK_LENGTH) {
        continue;
      }

      const opponentGlobal = getSharedTrackPosition(
        opponent.color,
        token.position,
      );

      if (opponentGlobal !== destinationGlobal) {
        continue;
      }

      captures.push({
        playerId: opponent.id,
        tokenId: token.id,
        previousPosition: token.position,
      });
    }
  }

  // The moving token itself must never be treated as a capture target.
  return captures.filter(
    (capture) =>
      capture.playerId !== movingPlayerId ||
      capture.tokenId !== movingTokenId,
  );
}

/**
 * Calculates the complete result of a proposed legal move.
 */
export function calculateLudoMovementResult(
  players: readonly LudoMovementPlayer[],
  move: LudoLegalMove,
): LudoMovementResult | null {
  const player = players.find(
    (entry) => entry.id === move.playerId,
  );

  const token = player?.tokens.find(
    (entry) => entry.id === move.tokenId,
  );

  if (!player || !token || player.hasWon) {
    return null;
  }

  if (token.position !== move.from) {
    return null;
  }

  const expectedDestination = getTokenDestination(
    token.position,
    move.diceRoll,
  );

  if (expectedDestination === null || expectedDestination !== move.to) {
    return null;
  }

  const captures = findLudoCaptures(
    players,
    move.playerId,
    move.tokenId,
    move.to,
  );

  const tokenReachedHome = move.to === FINISH_POSITION;

  const resultingPositions = player.tokens.map((entry) =>
    entry.id === move.tokenId ? move.to : entry.position,
  );

  const playerWon = hasPlayerWon(resultingPositions);

  return {
    move,
    captures,
    tokenReachedHome,
    playerWon,
  };
}

/**
 * Hook for animating movement without tying the animation to React state.
 *
 * onStep is called for each intermediate position. The game coordinator
 * can use it to update the moving token's displayed position.
 *
 * The animation can be cancelled when the component unmounts or when
 * cancelAnimation() is called.
 */
export function useEduLudoMovement({
  stepDurationMs = DEFAULT_STEP_DURATION_MS,
  onStep,
}: UseEduLudoMovementOptions = {}) {
  const animationIdRef = useRef(0);

  const cancelAnimation = useCallback(() => {
    animationIdRef.current += 1;
  }, []);

  const animateMove = useCallback(
    async (move: LudoLegalMove): Promise<boolean> => {
      const animationId = ++animationIdRef.current;

      const distance = Math.abs(move.to - move.from);

      // A token entering from base appears at the starting square.
      if (move.from === -1 && move.to === 0) {
        onStep?.(move.playerId, move.tokenId, 0, 1);
        return animationIdRef.current === animationId;
      }

      // Invalid or zero-distance animation.
      if (distance === 0 || move.from < 0 || move.to < move.from) {
        return animationIdRef.current === animationId;
      }

      for (let step = 1; step <= distance; step += 1) {
        if (animationIdRef.current !== animationId) {
          return false;
        }

        const position = move.from + step;

        onStep?.(
          move.playerId,
          move.tokenId,
          position,
          step,
        );

        if (step < distance) {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, Math.max(0, stepDurationMs));
          });
        }
      }

      return animationIdRef.current === animationId;
    },
    [onStep, stepDurationMs],
  );

  return {
    animateMove,
    cancelAnimation,
  };
}

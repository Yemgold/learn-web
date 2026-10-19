




/**
 * Learnyfi Educational Ludo
 * Movement utilities
 *
 * Responsibilities:
 * - Track and home-path configuration
 * - Safe-square checks
 * - Legal move calculations
 * - Token destination calculations
 *
 * This file contains no React components or state.
 */

import type { EduLudoColor } from "../components/eduLudoTypes"; 

/** Number of squares on the shared Ludo track. */
export const TRACK_LENGTH = 52;

/** Final position of a token after reaching home. */
export const FINISH_POSITION = 57;

/** Positions at which a player's tokens cannot be captured. */
export const SAFE_POSITIONS: readonly number[] = [
  0, 8, 13, 21, 26, 34, 39, 47,
];

/**
 * Each player's starting square on the shared track.
 *
 * Keep these values consistent with the existing game board.
 */
export const START_POSITIONS: Record<EduLudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 39,
  blue: 26,
};

/**
 * Returns true when a track position is a safe square.
 */
export function isSafePosition(position: number): boolean {
  return SAFE_POSITIONS.includes(position);
}

/**
 * Converts a player's relative track position into a shared board position.
 *
 * `relativePosition`:
 * - -1 means the token is in its base.
 * - 0 means the token is at the player's starting square.
 * - 1–51 are subsequent positions on the shared track.
 * - 52 and above are handled as home-path positions by the game.
 *
 * Returns null for a token in its base or already on the home path.
 */
export function getGlobalTrackPosition(
  color: EduLudoColor,
  relativePosition: number,
): number | null {
  if (relativePosition < 0 || relativePosition >= TRACK_LENGTH) {
    return null;
  }

  return (START_POSITIONS[color] + relativePosition) % TRACK_LENGTH;
}

/**
 * Determines whether a token can move from its current position
 * using the supplied dice roll.
 *
 * A token in base needs a six to enter the track.
 * A token must land exactly on FINISH_POSITION; overshooting is not allowed.
 */
export function canTokenMove(
  position: number,
  diceRoll: number,
): boolean {
  if (!Number.isInteger(diceRoll) || diceRoll < 1 || diceRoll > 6) {
    return false;
  }

  if (position === -1) {
    return diceRoll === 6;
  }

  if (position < -1 || position >= FINISH_POSITION) {
    return false;
  }

  return position + diceRoll <= FINISH_POSITION;
}

/**
 * Calculates a token's destination after a valid dice roll.
 *
 * Returns null if the move is illegal.
 */
export function getTokenDestination(
  position: number,
  diceRoll: number,
): number | null {
  if (!canTokenMove(position, diceRoll)) {
    return null;
  }

  // A six brings a token out of its base to its starting square.
  if (position === -1) {
    return 0;
  }

  return position + diceRoll;
}

/**
 * Returns all legal token indices for a player.
 *
 * The input positions should be ordered exactly as the player's tokens
 * are ordered in the game state.
 */
export function getLegalTokenIndices(
  tokenPositions: readonly number[],
  diceRoll: number,
): number[] {
  return tokenPositions.reduce<number[]>((legalIndices, position, index) => {
    if (canTokenMove(position, diceRoll)) {
      legalIndices.push(index);
    }

    return legalIndices;
  }, []);
}

/**
 * Calculates the shared track square occupied by a token.
 *
 * Returns null when the token is in base, finished, or on the home path.
 */
export function getTokenTrackSquare(
  color: EduLudoColor,
  relativePosition: number,
): number | null {
  return getGlobalTrackPosition(color, relativePosition);
}

/**
 * Determines whether a token has reached home.
 */
export function hasTokenFinished(position: number): boolean {
  return position === FINISH_POSITION;
}

/**
 * Returns the number of track steps remaining before the token finishes.
 *
 * Returns null if the token is in base or already finished.
 */
export function getStepsToFinish(position: number): number | null {
  if (position < 0 || position >= FINISH_POSITION) {
    return null;
  }

  return FINISH_POSITION - position;
}

/**
 * Determines whether a player has completed all their tokens.
 */
export function hasPlayerWon(
  tokenPositions: readonly number[],
): boolean {
  return (
    tokenPositions.length > 0 &&
    tokenPositions.every((position) => hasTokenFinished(position))
  );
}

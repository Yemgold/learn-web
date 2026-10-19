



"use client";

import { useCallback, useMemo, useState } from "react";

import {
  INITIAL_CBT_POINTS,
  INITIAL_WALLET_BALANCE,
  TOKENS_PER_PLAYER,
} from "../components/eduLudoConstants"; 




import type { EduLudoColor } from "../components/eduLudoTypes";

export type EduLudoPhase =
  | "lobby"
  | "playing"
  | "question"
  | "feedback"
  | "moving"
  | "finished";

export type EduLudoMode =
  | "solo"
  | "friends"
  | "classroom"
  | "tournament";

export interface EduLudoTokenState {
  id: string;
  position: number;
}

export interface EduLudoPlayerState {
  id: string;
  name: string;
  color: EduLudoColor;
  isBot: boolean;
  hasWon: boolean;
  score: number;
  tokens: EduLudoTokenState[];
}

export interface EduLudoGameState {
  phase: EduLudoPhase;
  mode: EduLudoMode;
  players: EduLudoPlayerState[];
  turnIndex: number;
  diceValue: number | null;
  walletBalance: number;
  cbtPoints: number;
  questionCount: number;
}

export interface UseEduLudoGameOptions {
  initialBalance?: number;
  initialCbtPoints?: number;
  initialMode?: EduLudoMode;
  initialPlayerColor?: EduLudoColor;
}

const PLAYER_COLORS: EduLudoColor[] = [
  "red",
  "green",
  "yellow",
  "blue",
];

const BOT_NAMES = ["Ada", "Tunde", "Zara"];

/**
 * Creates the initial token collection for one player.
 */
function createTokens(playerId: string): EduLudoTokenState[] {
  return Array.from({ length: TOKENS_PER_PLAYER }, (_, index) => ({
    id: `${playerId}-token-${index + 1}`,
    position: -1,
  }));
}

/**
 * Creates a solo match with one human player and three bots.
 *
 * The selected player color determines the human's color. The bots
 * receive the remaining colors in their original order.
 */
export function createEduLudoPlayers(
  humanColor: EduLudoColor = "red",
): EduLudoPlayerState[] {
  const remainingColors = PLAYER_COLORS.filter(
    (color) => color !== humanColor,
  );

  return [
    {
      id: "human",
      name: "You",
      color: humanColor,
      isBot: false,
      hasWon: false,
      score: 0,
      tokens: createTokens("human"),
    },
    ...remainingColors.map((color, index) => {
      const id = `bot-${index + 1}`;

      return {
        id,
        name: BOT_NAMES[index] ?? `Bot ${index + 1}`,
        color,
        isBot: true,
        hasWon: false,
        score: 0,
        tokens: createTokens(id),
      };
    }),
  ];
}

/**
 * Returns a valid player index within the current player collection.
 */
function normalizeTurnIndex(
  turnIndex: number,
  playerCount: number,
): number {
  if (playerCount <= 0) {
    return 0;
  }

  return ((turnIndex % playerCount) + playerCount) % playerCount;
}

/**
 * Central state hook for Educational Ludo.
 *
 * This hook manages general game state only. Question selection,
 * streaks, saved guaranteed sixes, movement animation, and bot timing
 * should be connected through their respective hooks.
 */
export function useEduLudoGame({
  initialBalance = INITIAL_WALLET_BALANCE,
  initialCbtPoints = INITIAL_CBT_POINTS,
  initialMode = "solo",
  initialPlayerColor = "red",
}: UseEduLudoGameOptions = {}) {
  const [phase, setPhase] = useState<EduLudoPhase>("lobby");
  const [mode, setMode] = useState<EduLudoMode>(initialMode);

  const [players, setPlayers] = useState<EduLudoPlayerState[]>(() =>
    createEduLudoPlayers(initialPlayerColor),
  );

  const [turnIndex, setTurnIndex] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);

  const [walletBalance, setWalletBalance] = useState(initialBalance);
  const [cbtPoints, setCbtPoints] = useState(initialCbtPoints);
  const [questionCount, setQuestionCount] = useState(0);

  const currentPlayer = useMemo(
    () => players[turnIndex] ?? null,
    [players, turnIndex],
  );

  const gameState = useMemo<EduLudoGameState>(
    () => ({
      phase,
      mode,
      players,
      turnIndex,
      diceValue,
      walletBalance,
      cbtPoints,
      questionCount,
    }),
    [
      phase,
      mode,
      players,
      turnIndex,
      diceValue,
      walletBalance,
      cbtPoints,
      questionCount,
    ],
  );

  /**
   * Starts or restarts a match.
   */
  const startGame = useCallback(
    (color: EduLudoColor = initialPlayerColor) => {
      setPlayers(createEduLudoPlayers(color));
      setTurnIndex(0);
      setDiceValue(null);
      setWalletBalance(initialBalance);
      setCbtPoints(initialCbtPoints);
      setQuestionCount(0);
      setPhase("playing");
    },
    [initialBalance, initialCbtPoints, initialPlayerColor],
  );

  /**
   * Returns the game to the lobby without deleting the wallet balance.
   */
  const returnToLobby = useCallback(() => {
    setPhase("lobby");
    setDiceValue(null);
  }, []);

  /**
   * Sets the game phase.
   */
  const changePhase = useCallback((nextPhase: EduLudoPhase) => {
    setPhase(nextPhase);
  }, []);

  /**
   * Stores a dice result from 1 to 6.
   */
  const setDiceRoll = useCallback((roll: number | null) => {
    if (roll === null) {
      setDiceValue(null);
      return;
    }

    if (!Number.isInteger(roll) || roll < 1 || roll > 6) {
      return;
    }

    setDiceValue(roll);
  }, []);

  /**
   * Advances to the next player who has not won.
   *
   * If every player has won, the match is marked finished.
   */
  const advanceTurn = useCallback(() => {
    setPlayers((currentPlayers) => {
      if (currentPlayers.length === 0) {
        setPhase("finished");
        return currentPlayers;
      }

      const unfinishedIndices = currentPlayers
        .map((player, index) => (player.hasWon ? -1 : index))
        .filter((index) => index >= 0);

      if (unfinishedIndices.length === 0) {
        setPhase("finished");
        return currentPlayers;
      }

      setTurnIndex((currentTurn) => {
        for (let offset = 1; offset <= currentPlayers.length; offset += 1) {
          const candidate = normalizeTurnIndex(
            currentTurn + offset,
            currentPlayers.length,
          );

          if (!currentPlayers[candidate]?.hasWon) {
            return candidate;
          }
        }

        return currentTurn;
      });

      return currentPlayers;
    });

    setDiceValue(null);
    setPhase("playing");
  }, []);

  /**
   * Increments the question count after a question is presented.
   */
  const recordQuestionPresented = useCallback(() => {
    setQuestionCount((count) => count + 1);
  }, []);

  /**
   * Adds CBT points to the user's balance.
   *
   * This does not change the naira wallet balance.
   */
  const addCbtPoints = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    setCbtPoints((current) => current + Math.floor(amount));
  }, []);

  /**
   * Updates the wallet balance.
   *
   * Use this for wallet synchronization or an already-validated charge.
   * Prefer the reward utility when calculating a question charge.
   */
  const updateWalletBalance = useCallback((balance: number) => {
    if (!Number.isFinite(balance) || balance < 0) {
      return;
    }

    setWalletBalance(balance);
  }, []);

  /**
   * Updates a player's state using the latest state value.
   */
  const updatePlayer = useCallback(
    (
      playerId: string,
      updater: (
        player: EduLudoPlayerState,
      ) => EduLudoPlayerState,
    ) => {
      setPlayers((currentPlayers) =>
        currentPlayers.map((player) =>
          player.id === playerId ? updater(player) : player,
        ),
      );
    },
    [],
  );

  /**
   * Updates a player's token position.
   *
   * Movement legality should be validated by ludoMovement.ts before
   * calling this function.
   */
  const updateTokenPosition = useCallback(
    (
      playerId: string,
      tokenId: string,
      position: number,
    ) => {
      if (
        !Number.isInteger(position) ||
        position < -1 ||
        position > 57
      ) {
        return;
      }

      updatePlayer(playerId, (player) => ({
        ...player,
        tokens: player.tokens.map((token) =>
          token.id === tokenId
            ? { ...token, position }
            : token,
        ),
      }));
    },
    [updatePlayer],
  );

  /**
   * Marks a player as having won.
   */
  const markPlayerWon = useCallback(
    (playerId: string) => {
      updatePlayer(playerId, (player) => ({
        ...player,
        hasWon: true,
      }));
    },
    [updatePlayer],
  );

  /**
   * Changes the current game mode.
   */
  const changeMode = useCallback((nextMode: EduLudoMode) => {
    setMode(nextMode);
  }, []);

  return {
    gameState,
    phase,
    setPhase,
    mode,
    setMode,
    players,
    setPlayers,
    turnIndex,
    setTurnIndex,
    diceValue,
    setDiceValue,
    walletBalance,
    setWalletBalance,
    cbtPoints,
    setCbtPoints,
    questionCount,
    currentPlayer,
    startGame,
    returnToLobby,
    changePhase,
    setDiceRoll,
    advanceTurn,
    recordQuestionPresented,
    addCbtPoints,
    updateWalletBalance,
    updatePlayer,
    updateTokenPosition,
    markPlayerWon,
    changeMode,
  };
}

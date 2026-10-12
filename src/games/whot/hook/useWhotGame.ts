






"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  createInitialGameState,
  handleQuestionTimeout,
  performBotTurn,
  whotGameReducer,
  type WhotEngineOptions,
  type WhotEngineState,
} from "../lib/game-engine";

import type {
  WhotGameAction,
  WhotGameConfig,
  WhotPlayerId,
} from "../types/whot";

/* ============================================================
   LEARNYFI WHOT — GAME HOOK
   ============================================================

   Responsibilities:
   - Own the game state.
   - Start and restart the game.
   - Expose player actions.
   - Track the question countdown.
   - Automatically time out unanswered questions.
   - Automatically run the bot's turn.
   - Prevent duplicate bot turns from repeated effects.

   This hook is frontend-only.
   ============================================================ */

export interface UseWhotGameOptions {
  config?: Partial<WhotGameConfig>;

  /** Delay before the bot starts its turn, in milliseconds. */
  botDelay?: number;

  /** Delay after the bot finishes before returning control. */
  botResponseDelay?: number;

  /** Whether the bot can answer questions incorrectly. */
  randomizeBotAnswers?: boolean;

  /** Start the game immediately instead of waiting for START_GAME. */
  autoStart?: boolean;
}

export interface UseWhotGameReturn {
  state: WhotEngineState;

  /** Seconds remaining on the currently selected question. */
  timeRemaining: number;

  /** Whether the game has not started yet. */
  isReady: boolean;

  /** Whether the game is active. */
  isPlaying: boolean;

  /** Whether the player can currently make a move. */
  isPlayerTurn: boolean;

  /** Whether the bot is currently playing. */
  isBotTurn: boolean;

  /** Whether the game has a winner. */
  isFinished: boolean;

  /** Winner ID, or null when the game has not finished. */
  winner: WhotPlayerId | null;

  /** Whether the selected card has an active question. */
  isQuestionOpen: boolean;

  /** Dispatch a supported game action. */
  dispatch: React.Dispatch<WhotGameAction>;

  /** Start the game. */
  startGame: () => void;

  /** Start a new game with a fresh shuffle and deal. */
  restartGame: () => void;

  /** Select a playable card and open its question. */
  selectCard: (instanceId: string) => void;

  /** Submit an answer option index. */
  submitAnswer: (answerIndex: number) => void;

  /** Draw a card from the market. */
  drawCard: () => void;
}

interface InternalState {
  game: WhotEngineState;
}

type InternalAction =
  | { type: "GAME_ACTION"; action: WhotGameAction }
  | { type: "REPLACE_GAME"; game: WhotEngineState };

function internalReducer(
  state: InternalState,
  action: InternalAction,
): InternalState {
  switch (action.type) {
    case "GAME_ACTION":
      return {
        game: whotGameReducer(state.game, action.action),
      };

    case "REPLACE_GAME":
      return {
        game: action.game,
      };

    default:
      return state;
  }
}

/**
 * React hook for running a complete local WHOT game.
 */
export function useWhotGame(
  options: UseWhotGameOptions = {},
): UseWhotGameReturn {
  const {
    config,
    botDelay = 900,
    botResponseDelay = 500,
    randomizeBotAnswers = true,
    autoStart = false,
  } = options;

  const initialGameRef = useRef<WhotEngineState | null>(null);

  if (initialGameRef.current === null) {
    initialGameRef.current = createInitialGameState(config);
  }

  const [internalState, internalDispatch] = useReducer(
    internalReducer,
    {
      game: initialGameRef.current,
    },
  );

  const state = internalState.game;

  const [clockNow, setClockNow] = useState<number>(() => Date.now());

  const botTurnLockRef = useRef(false);
  const botTurnKeyRef = useRef<string | null>(null);
  const autoStartRef = useRef(false);

  /* ----------------------------------------------------------
     DISPATCH
     ---------------------------------------------------------- */

  const dispatch = useCallback(
    (action: WhotGameAction) => {
      internalDispatch({
        type: "GAME_ACTION",
        action,
      });
    },
    [],
  );

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, [dispatch]);

  const restartGame = useCallback(() => {
    botTurnLockRef.current = false;
    botTurnKeyRef.current = null;

    internalDispatch({
      type: "REPLACE_GAME",
      game: createInitialGameState(config),
    });

    setClockNow(Date.now());

    if (autoStart) {
      autoStartRef.current = true;
    }
  }, [config, autoStart]);

  const selectCard = useCallback(
    (instanceId: string) => {
      dispatch({
        type: "SELECT_CARD",
        instanceId,
      });
    },
    [dispatch],
  );

  const submitAnswer = useCallback(
    (answerIndex: number) => {
      dispatch({
        type: "SUBMIT_ANSWER",
        answerIndex,
      });
    },
    [dispatch],
  );

  const drawCard = useCallback(() => {
    dispatch({ type: "DRAW_CARD" });
  }, [dispatch]);

  /* ----------------------------------------------------------
     AUTO-START
     ---------------------------------------------------------- */

  useEffect(() => {
    if (autoStart && !autoStartRef.current && state.status === "READY") {
      autoStartRef.current = true;
      dispatch({ type: "START_GAME" });
    }
  }, [autoStart, state.status, dispatch]);

  /* ----------------------------------------------------------
     QUESTION CLOCK
     ---------------------------------------------------------- */

  useEffect(() => {
    if (
      state.status !== "PLAYING" ||
      state.selectedCardInstanceId === null ||
      state.questionDeadline === null
    ) {
      return;
    }

    const updateClock = () => {
      const now = Date.now();

      setClockNow(now);

      if (now >= state.questionDeadline!) {
        internalDispatch({
          type: "REPLACE_GAME",
          game: handleQuestionTimeout(state, now),
        });
      }
    };

    updateClock();

    const intervalId = window.setInterval(updateClock, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    state.status,
    state.selectedCardInstanceId,
    state.questionDeadline,
    state,
  ]);

  /* ----------------------------------------------------------
     BOT TURN
     ---------------------------------------------------------- */

  useEffect(() => {
    if (
      state.status !== "PLAYING" ||
      state.currentTurn !== "bot" ||
      state.selectedCardInstanceId !== null
    ) {
      botTurnLockRef.current = false;
      botTurnKeyRef.current = null;
      return;
    }

    const turnKey = `${state.turnsPlayed}:${state.bot.hand.length}:${state.drawPile.length}:${state.discardPile.length}`;

    if (
      botTurnLockRef.current ||
      botTurnKeyRef.current === turnKey
    ) {
      return;
    }

    botTurnLockRef.current = true;
    botTurnKeyRef.current = turnKey;

    const timeoutId = window.setTimeout(() => {
      internalDispatch({
        type: "REPLACE_GAME",
        game: performBotTurn(state, {
          randomizeBotAnswers,
        } satisfies WhotEngineOptions),
      });

      botTurnLockRef.current = false;
    }, Math.max(0, botDelay) + Math.max(0, botResponseDelay));

    return () => {
      window.clearTimeout(timeoutId);
      botTurnLockRef.current = false;
    };
  }, [
    state,
    botDelay,
    botResponseDelay,
    randomizeBotAnswers,
  ]);

  /* ----------------------------------------------------------
     COUNTDOWN VALUE
     ---------------------------------------------------------- */

  const timeRemaining =
    state.questionDeadline === null
      ? 0
      : Math.max(
          0,
          Math.ceil((state.questionDeadline - clockNow) / 1000),
        );

  /* ----------------------------------------------------------
     RETURN API
     ---------------------------------------------------------- */

  return {
    state,
    timeRemaining,

    isReady: state.status === "READY",
    isPlaying: state.status === "PLAYING",
    isPlayerTurn:
      state.status === "PLAYING" &&
      state.currentTurn === "player",
    isBotTurn:
      state.status === "PLAYING" &&
      state.currentTurn === "bot",
    isFinished: state.status === "FINISHED",
    winner: state.winner,

    isQuestionOpen: state.selectedCardInstanceId !== null,

    dispatch,
    startGame,
    restartGame,
    selectCard,
    submitAnswer,
    drawCard,
  };
}

export default useWhotGame;

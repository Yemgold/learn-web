





"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import type { Dispatch } from "react";

import {
  createInitialGameState,
  handleQuestionTimeout,
  performBotAnswer,
  performBotTurn,
  whotGameReducer,
  type WhotEngineState,
} from "../lib/game-engine";

import type {
  WhotGameAction,
  WhotGameConfig,
  WhotPlayerId,
} from "../types/whot";

/* ============================================================
   LEARNYFI WHOT — GAME HOOK

   Responsibilities:
   - Own the game state.
   - Start and restart the game.
   - Expose player actions.
   - Manage question timers and timeouts.
   - Automatically answer player-played card questions as bot.
   - Automatically play bot cards.
   - Pause after feedback until Continue is clicked.
   - Prevent duplicate bot actions and timeouts.

   Frontend-only implementation.
   ============================================================ */

export interface UseWhotGameOptions {
  config?: Partial<WhotGameConfig>;
  botDelay?: number;
  botResponseDelay?: number;

  /** Whether bot answers are probabilistic or always correct. */
  randomizeBotAnswers?: boolean;

  autoStart?: boolean;
}

export interface UseWhotGameReturn {
  state: WhotEngineState;
  timeRemaining: number;

  isReady: boolean;
  isPlaying: boolean;
  isPlayerTurn: boolean;
  isBotTurn: boolean;
  isFinished: boolean;

  winner: WhotPlayerId | null;
  isQuestionOpen: boolean;

  dispatch: Dispatch<WhotGameAction>;

  startGame: () => void;
  restartGame: () => void;
  selectCard: (instanceId: string) => void;
  submitAnswer: (answerIndex: number) => void;
  drawCard: () => void;
  continueAfterFeedback: () => void;
}

interface InternalState {
  game: WhotEngineState;
}

type InternalAction =
  | {
      type: "GAME_ACTION";
      action: WhotGameAction;
    }
  | {
      type: "REPLACE_GAME";
      game: WhotEngineState;
    };

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

export function useWhotGame(
  options: UseWhotGameOptions = {},
): UseWhotGameReturn {
  const {
    config,
    botDelay = 2000,
    botResponseDelay = 9000,
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

  const botAnswerLockRef = useRef(false);
  const botAnswerKeyRef = useRef<string | null>(null);

  const autoStartRef = useRef(false);
  const handledTimeoutRef = useRef<number | null>(null);

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

    botAnswerLockRef.current = false;
    botAnswerKeyRef.current = null;

    handledTimeoutRef.current = null;
    autoStartRef.current = false;

    internalDispatch({
      type: "REPLACE_GAME",
      game: createInitialGameState(config),
    });

    setClockNow(Date.now());
  }, [config]);

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

  const continueAfterFeedback = useCallback(() => {
    dispatch({ type: "CONTINUE_AFTER_FEEDBACK" });
  }, [dispatch]);

  /* ----------------------------------------------------------
     AUTO-START
     ---------------------------------------------------------- */

  useEffect(() => {
    if (
      autoStart &&
      !autoStartRef.current &&
      state.status === "READY"
    ) {
      autoStartRef.current = true;
      dispatch({ type: "START_GAME" });
    }
  }, [autoStart, state.status, dispatch]);

  /* ----------------------------------------------------------
     QUESTION CLOCK
     ---------------------------------------------------------- */

  useEffect(() => {
    const deadline = state.questionDeadline;

    if (
      state.status !== "PLAYING" ||
      state.activeQuestionCard === null ||
      state.questionSource === null ||
      deadline === null ||
      state.answerFeedback !== null
    ) {
      return;
    }

    const updateClock = () => {
      const now = Date.now();

      setClockNow(now);

      if (now < deadline) {
        return;
      }

      if (handledTimeoutRef.current === deadline) {
        return;
      }

      handledTimeoutRef.current = deadline;

      internalDispatch({
        type: "REPLACE_GAME",
        game: handleQuestionTimeout(state, now),
      });
    };

    updateClock();

    const intervalId = window.setInterval(updateClock, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [state]);

  /* ----------------------------------------------------------
     RESET TIMEOUT GUARD
     ---------------------------------------------------------- */

  useEffect(() => {
    if (state.questionDeadline === null) {
      handledTimeoutRef.current = null;
      return;
    }

    if (handledTimeoutRef.current !== state.questionDeadline) {
      handledTimeoutRef.current = null;
    }
  }, [state.questionDeadline]);

  /* ----------------------------------------------------------
     AUTOMATIC BOT ANSWER

     When you play a card, questionSource is "player".
     The bot answers automatically after a thinking delay.

     The engine decides whether the bot answers correctly,
     based on question difficulty and randomizeBotAnswers.
     ---------------------------------------------------------- */

  useEffect(() => {
    const card = state.activeQuestionCard;
    const deadline = state.questionDeadline;

    if (
      state.status !== "PLAYING" ||
      state.questionSource !== "player" ||
      card === null ||
      deadline === null ||
      state.answerFeedback !== null
    ) {
      botAnswerLockRef.current = false;
      botAnswerKeyRef.current = null;
      return;
    }

    const answerKey = `${card.instanceId}:${deadline}`;

    if (
      botAnswerLockRef.current ||
      botAnswerKeyRef.current === answerKey
    ) {
      return;
    }

    botAnswerLockRef.current = true;
    botAnswerKeyRef.current = answerKey;

    const delay = Math.max(0, botResponseDelay);

    const timeoutId = window.setTimeout(() => {
      internalDispatch({
        type: "REPLACE_GAME",
        game: performBotAnswer(state, {
          randomizeBotAnswers,
        }),
      });

      botAnswerLockRef.current = false;
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      botAnswerLockRef.current = false;
    };
  }, [
    state,
    botDelay,
    botResponseDelay,
    randomizeBotAnswers,
  ]);

  /* ----------------------------------------------------------
     AUTOMATIC BOT CARD PLAY

     The bot waits until feedback has been dismissed.
     A fresh turn key prevents duplicate bot plays.
     ---------------------------------------------------------- */

  useEffect(() => {
    if (
      state.status !== "PLAYING" ||
      state.currentTurn !== "bot" ||
      state.activeQuestionCard !== null ||
      state.answerFeedback !== null
    ) {
      botTurnLockRef.current = false;
      botTurnKeyRef.current = null;
      return;
    }

    const turnKey = [
      state.turnsPlayed,
      state.bot.hand.length,
      state.drawPile.length,
      state.discardPile.length,
      state.botChallengeCount,
    ].join(":");

    if (
      botTurnLockRef.current ||
      botTurnKeyRef.current === turnKey
    ) {
      return;
    }

    botTurnLockRef.current = true;
    botTurnKeyRef.current = turnKey;

    const delay =
      Math.max(0, botDelay) +
      Math.max(0, botResponseDelay);

    const timeoutId = window.setTimeout(() => {
      internalDispatch({
        type: "REPLACE_GAME",
        game: performBotTurn(state),
      });

      botTurnLockRef.current = false;
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      botTurnLockRef.current = false;
    };
  }, [state, botDelay, botResponseDelay]);

  /* ----------------------------------------------------------
     COUNTDOWN
     ---------------------------------------------------------- */

  const timeRemaining =
    state.questionDeadline === null
      ? 0
      : Math.max(
          0,
          Math.ceil(
            (state.questionDeadline - clockNow) / 1000,
          ),
        );

  /* ----------------------------------------------------------
     DERIVED TURN STATE
     ---------------------------------------------------------- */

  const isQuestionOpen =
    state.status === "PLAYING" &&
    state.activeQuestionCard !== null &&
    state.questionSource !== null;

  const isPlayerTurn =
    state.status === "PLAYING" &&
    state.currentTurn === "player" &&
    !isQuestionOpen &&
    state.answerFeedback === null;

  const isBotTurn =
    state.status === "PLAYING" &&
    (
      state.currentTurn === "bot" ||
      (
        isQuestionOpen &&
        state.questionSource === "player"
      )
    );

  /* ----------------------------------------------------------
     RETURN API
     ---------------------------------------------------------- */

  return {
    state,
    timeRemaining,

    isReady: state.status === "READY",
    isPlaying: state.status === "PLAYING",
    isPlayerTurn,
    isBotTurn,
    isFinished: state.status === "FINISHED",
    winner: state.winner,
    isQuestionOpen,

    dispatch,
    startGame,
    restartGame,
    selectCard,
    submitAnswer,
    drawCard,
    continueAfterFeedback,
  };
}

export default useWhotGame;



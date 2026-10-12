




import {
  DEFAULT_WHOT_CONFIG,
  type WhotAnswerOutcome,
  type WhotCard,
  type WhotGameAction,
  type WhotGameConfig,
  type WhotGameState,
  type WhotMoveResult,
  type WhotPlayerId,
} from "../types/whot";

import { dealInitialCards, shuffle } from "./deck";

/* ============================================================
   LEARNYFI WHOT — GAME ENGINE
   ============================================================

   Frontend-only game engine.

   Rules:
   - Each player starts with six cards.
   - A card can be played when its subject matches the
     subject of the center card.
   - Playing a card opens a question for that card.
   - Correct answer: play the card and pass the turn.
   - Wrong answer or timeout: draw two cards and pass the turn.
   - Drawing from the market passes the turn to the bot.
   - The first player with no cards wins.
   - The bot automatically selects a playable card and answers
     according to its simulated accuracy.
   - Discarded cards can be recycled when the draw pile empties.

   No API calls, sockets, or backend dependencies.
   ============================================================ */

export interface WhotEngineState extends WhotGameState {
  /** Cards previously played, excluding the current center card. */
  discardPile: WhotCard[];

  /** Configuration used for this game session. */
  config: WhotGameConfig;
}

export interface WhotEngineOptions {
  config?: Partial<WhotGameConfig>;
  randomizeBotAnswers?: boolean;
}

const PLAYER_NAME = "You";
const BOT_NAME = "Learnyfi Bot";

function createConfig(
  overrides: Partial<WhotGameConfig> = {},
): WhotGameConfig {
  return {
    ...DEFAULT_WHOT_CONFIG,
    ...overrides,
  };
}

function createEmptyResultMessage(
  state: WhotEngineState,
  message: string,
): WhotEngineState {
  return {
    ...state,
    message,
  };
}

function createMoveFailure(
  reason: Extract<WhotMoveResult, { success: false }>["reason"],
  message: string,
): WhotMoveResult {
  return {
    success: false,
    reason,
    message,
  };
}

function createMoveSuccess(message: string): WhotMoveResult {
  return {
    success: true,
    message,
  };
}

/* ============================================================
   GAME CREATION
   ============================================================ */

/**
 * Creates a fresh game in READY state.
 *
 * The cards are dealt immediately. START_GAME changes the state
 * to PLAYING when the user is ready to begin.
 */
export function createInitialGameState(
  configOverrides: Partial<WhotGameConfig> = {},
): WhotEngineState {
  const config = createConfig(configOverrides);

  validateConfig(config);

  const deal = dealInitialCards({
    initialHandSize: config.initialHandSize,
    copiesPerQuestion: config.copiesPerQuestion,
  });

  return {
    status: "READY",

    player: {
      id: "player",
      name: PLAYER_NAME,
      hand: deal.playerHand,
    },

    bot: {
      id: "bot",
      name: BOT_NAME,
      hand: deal.botHand,
    },

    drawPile: deal.drawPile,
    discardPile: [],
    centerCard: deal.centerCard,

    currentTurn: "player",
    selectedCardInstanceId: null,
    questionDeadline: null,
    winner: null,

    message: "Your cards are ready. Start the game!",
    correctAnswers: 0,
    incorrectAnswers: 0,
    turnsPlayed: 0,

    config,
  };
}

/**
 * Starts a game that has been dealt and is in READY state.
 */
export function startWhotGame(
  state: WhotEngineState,
): WhotEngineState {
  if (state.status !== "READY") {
    return createEmptyResultMessage(
      state,
      "This game has already started or finished.",
    );
  }

  return {
    ...state,
    status: "PLAYING",
    currentTurn: "player",
    selectedCardInstanceId: null,
    questionDeadline: null,
    message: "Your turn! Match the subject of the center card.",
  };
}

/**
 * Resets the game with a fresh shuffle and deal.
 */
export function restartWhotGame(
  state: WhotEngineState,
): WhotEngineState {
  return createInitialGameState(state.config);
}

function validateConfig(config: WhotGameConfig): void {
  if (
    !Number.isInteger(config.initialHandSize) ||
    config.initialHandSize < 1
  ) {
    throw new Error(
      "[Learnyfi WHOT] initialHandSize must be a positive integer.",
    );
  }

  if (
    !Number.isFinite(config.questionTimeLimit) ||
    config.questionTimeLimit <= 0
  ) {
    throw new Error(
      "[Learnyfi WHOT] questionTimeLimit must be greater than zero.",
    );
  }

  if (
    !Number.isInteger(config.wrongAnswerPenalty) ||
    config.wrongAnswerPenalty < 0
  ) {
    throw new Error(
      "[Learnyfi WHOT] wrongAnswerPenalty must be a non-negative integer.",
    );
  }

  if (
    !Number.isInteger(config.drawOnNoMatch) ||
    config.drawOnNoMatch < 0
  ) {
    throw new Error(
      "[Learnyfi WHOT] drawOnNoMatch must be a non-negative integer.",
    );
  }

  if (
    !Number.isInteger(config.copiesPerQuestion) ||
    config.copiesPerQuestion < 1
  ) {
    throw new Error(
      "[Learnyfi WHOT] copiesPerQuestion must be a positive integer.",
    );
  }
}

/* ============================================================
   PLAYABLE CARDS
   ============================================================ */

/**
 * In this educational WHOT version, subjects determine whether
 * a card can be played.
 */
export function isCardPlayable(
  card: WhotCard,
  centerCard: WhotCard,
): boolean {
  return card.subject === centerCard.subject;
}

/**
 * Returns all cards the specified player can currently play.
 */
export function getPlayableCards(
  state: WhotEngineState,
  playerId: WhotPlayerId = "player",
): WhotCard[] {
  const hand =
    playerId === "player"
      ? state.player.hand
      : state.bot.hand;

  return hand.filter((card) =>
    isCardPlayable(card, state.centerCard),
  );
}

/**
 * Checks whether a player has at least one legal move.
 */
export function hasPlayableCard(
  state: WhotEngineState,
  playerId: WhotPlayerId = "player",
): boolean {
  return getPlayableCards(state, playerId).length > 0;
}

/* ============================================================
   CARD SELECTION
   ============================================================ */

/**
 * Selects a card and starts its question timer.
 *
 * Selecting a card does not remove it from the hand.
 * The card is played only after a correct answer.
 */
export function selectWhotCard(
  state: WhotEngineState,
  instanceId: string,
  now: number = Date.now(),
): WhotEngineState {
  if (state.status !== "PLAYING") {
    return createEmptyResultMessage(
      state,
      "The game is not currently active.",
    );
  }

  if (state.currentTurn !== "player") {
    return createEmptyResultMessage(
      state,
      "Wait for your turn.",
    );
  }

  if (state.selectedCardInstanceId !== null) {
    return createEmptyResultMessage(
      state,
      "Answer the current question before selecting another card.",
    );
  }

  const card = state.player.hand.find(
    (item) => item.instanceId === instanceId,
  );

  if (!card) {
    return createEmptyResultMessage(
      state,
      "That card is no longer in your hand.",
    );
  }

  if (!isCardPlayable(card, state.centerCard)) {
    return createEmptyResultMessage(
      state,
      `Choose a ${state.centerCard.subject} card to match the center card.`,
    );
  }

  return {
    ...state,
    selectedCardInstanceId: instanceId,
    questionDeadline:
      now + state.config.questionTimeLimit * 1000,
    message: `Answer the ${card.subject} question before time runs out!`,
  };
}

/* ============================================================
   DRAW PILE AND DISCARD PILE
   ============================================================ */

/**
 * Recycles discarded cards if the draw pile is empty.
 *
 * The current center card is never recycled because it is not
 * stored in discardPile.
 */
function prepareDrawPile(
  state: WhotEngineState,
): WhotEngineState {
  if (state.drawPile.length > 0) {
    return state;
  }

  if (state.discardPile.length === 0) {
    return state;
  }

  return {
    ...state,
    drawPile: shuffle(state.discardPile),
    discardPile: [],
  };
}

interface DrawResult {
  state: WhotEngineState;
  cards: WhotCard[];
}

/**
 * Draws up to `count` cards, recycling the discard pile when
 * necessary. If there are no cards available anywhere, the
 * function safely returns fewer cards than requested.
 */
function takeCards(
  initialState: WhotEngineState,
  count: number,
): DrawResult {
  let state = initialState;
  const cards: WhotCard[] = [];

  for (let index = 0; index < count; index += 1) {
    state = prepareDrawPile(state);

    if (state.drawPile.length === 0) {
      break;
    }

    const [card, ...remainingPile] = state.drawPile;

    cards.push(card);

    state = {
      ...state,
      drawPile: remainingPile,
    };
  }

  return {
    state,
    cards,
  };
}

/**
 * Adds cards to the selected player's hand.
 */
function addCardsToHand(
  state: WhotEngineState,
  playerId: WhotPlayerId,
  cards: WhotCard[],
): WhotEngineState {
  if (cards.length === 0) {
    return state;
  }

  if (playerId === "player") {
    return {
      ...state,
      player: {
        ...state.player,
        hand: [...state.player.hand, ...cards],
      },
    };
  }

  return {
    ...state,
    bot: {
      ...state.bot,
      hand: [...state.bot.hand, ...cards],
    },
  };
}

/**
 * Draws cards for a player and returns the updated state.
 */
export function drawCardsForPlayer(
  state: WhotEngineState,
  playerId: WhotPlayerId,
  count: number,
): WhotEngineState {
  if (!Number.isInteger(count) || count < 0) {
    return createEmptyResultMessage(
      state,
      "The number of cards to draw must be a non-negative integer.",
    );
  }

  const result = takeCards(state, count);
  const nextState = addCardsToHand(
    result.state,
    playerId,
    result.cards,
  );

  if (result.cards.length < count) {
    return {
      ...nextState,
      message:
        result.cards.length === 0
          ? "No more cards are available in the market."
          : `Only ${result.cards.length} card(s) were available to draw.`,
    };
  }

  return nextState;
}

/* ============================================================
   TURN MANAGEMENT
   ============================================================ */

function switchTurn(
  state: WhotEngineState,
  nextPlayer: WhotPlayerId,
  message: string,
): WhotEngineState {
  return {
    ...state,
    currentTurn: nextPlayer,
    selectedCardInstanceId: null,
    questionDeadline: null,
    turnsPlayed: state.turnsPlayed + 1,
    message,
  };
}

function finishGame(
  state: WhotEngineState,
  winner: WhotPlayerId,
): WhotEngineState {
  const winnerName =
    winner === "player" ? PLAYER_NAME : BOT_NAME;

  return {
    ...state,
    status: "FINISHED",
    winner,
    selectedCardInstanceId: null,
    questionDeadline: null,
    message:
      winner === "player"
        ? "Congratulations! You won Learnyfi WHOT!"
        : `${winnerName} wins this round. Try again!`,
  };
}

/* ============================================================
   ANSWER VALIDATION
   ============================================================ */

/**
 * Returns the question attached to the currently selected card.
 *
 * The UI can use this to display the question modal.
 */
export function getSelectedQuestion(
  state: WhotEngineState,
): WhotCard | null {
  if (!state.selectedCardInstanceId) {
    return null;
  }

  return (
    state.player.hand.find(
      (card) =>
        card.instanceId === state.selectedCardInstanceId,
    ) ?? null
  );
}

/**
 * Checks whether the selected question has expired.
 */
export function isQuestionExpired(
  state: WhotEngineState,
  now: number = Date.now(),
): boolean {
  return (
    state.questionDeadline !== null &&
    now >= state.questionDeadline
  );
}

/**
 * Applies the result of a player's answer.
 *
 * Correct:
 *   - Remove the selected card from the player's hand.
 *   - Move the previous center card into the discard pile.
 *   - Make the selected card the new center card.
 *   - Check for a winner.
 *
 * Incorrect:
 *   - Keep the selected card in the player's hand.
 *   - Draw the configured penalty cards.
 *   - Pass the turn to the bot.
 */
export function submitWhotAnswer(
  state: WhotEngineState,
  answerIndex: number,
): WhotEngineState {
  if (state.status !== "PLAYING") {
    return createEmptyResultMessage(
      state,
      "The game is not currently active.",
    );
  }

  if (state.currentTurn !== "player") {
    return createEmptyResultMessage(
      state,
      "It is not your turn.",
    );
  }

  const selectedCard = getSelectedQuestion(state);

  if (!selectedCard) {
    return createEmptyResultMessage(
      state,
      "Select a playable card before answering.",
    );
  }

  if (
    !Number.isInteger(answerIndex) ||
    answerIndex < 0 ||
    answerIndex >= selectedCard.options.length
  ) {
    return createEmptyResultMessage(
      state,
      "Select a valid answer option.",
    );
  }

  const correct = answerIndex === selectedCard.correctAnswerIndex;

  if (correct) {
    const remainingHand = state.player.hand.filter(
      (card) => card.instanceId !== selectedCard.instanceId,
    );

    const nextState: WhotEngineState = {
      ...state,

      player: {
        ...state.player,
        hand: remainingHand,
      },

      centerCard: selectedCard,
      discardPile: [
        ...state.discardPile,
        state.centerCard,
      ],

      selectedCardInstanceId: null,
      questionDeadline: null,
      correctAnswers: state.correctAnswers + 1,
      turnsPlayed: state.turnsPlayed + 1,
    };

    if (remainingHand.length === 0) {
      return finishGame(nextState, "player");
    }

    return {
      ...nextState,
      currentTurn: "bot",
      message: "Correct answer! Your card is played. The bot is next.",
    };
  }

  const result = takeCards(
    {
      ...state,
      selectedCardInstanceId: null,
      questionDeadline: null,
      incorrectAnswers: state.incorrectAnswers + 1,
    },
    state.config.wrongAnswerPenalty,
  );

  const penalizedState = addCardsToHand(
    result.state,
    "player",
    result.cards,
  );

  return switchTurn(
    penalizedState,
    "bot",
    result.cards.length === 0
      ? "Incorrect answer. No penalty cards are available. The bot is next."
      : `Incorrect answer. You drew ${result.cards.length} card(s). The bot is next.`,
  );
}

/**
 * Applies a timeout as an incorrect answer.
 */
export function handleQuestionTimeout(
  state: WhotEngineState,
  now: number = Date.now(),
): WhotEngineState {
  if (state.selectedCardInstanceId === null) {
    return state;
  }

  if (
    state.questionDeadline !== null &&
    now < state.questionDeadline
  ) {
    return createEmptyResultMessage(
      state,
      "There is still time to answer the question.",
    );
  }

  const result = takeCards(
    {
      ...state,
      selectedCardInstanceId: null,
      questionDeadline: null,
      incorrectAnswers: state.incorrectAnswers + 1,
    },
    state.config.wrongAnswerPenalty,
  );

  const penalizedState = addCardsToHand(
    result.state,
    "player",
    result.cards,
  );

  return switchTurn(
    penalizedState,
    "bot",
    `Time is up! You drew ${result.cards.length} card(s). The bot is next.`,
  );
}

/* ============================================================
   MARKET DRAW
   ============================================================ */

/**
 * Lets the player draw one card from the market.
 *
 * Drawing passes the turn to the bot. The player must not have
 * an unanswered question open.
 */
export function drawMarketCard(
  state: WhotEngineState,
): WhotEngineState {
  if (state.status !== "PLAYING") {
    return createEmptyResultMessage(
      state,
      "The game is not currently active.",
    );
  }

  if (state.currentTurn !== "player") {
    return createEmptyResultMessage(
      state,
      "Wait for your turn before drawing a card.",
    );
  }

  if (state.selectedCardInstanceId !== null) {
    return createEmptyResultMessage(
      state,
      "Answer your current question before drawing a card.",
    );
  }

  const result = takeCards(state, 1);

  if (result.cards.length === 0) {
    return createEmptyResultMessage(
      result.state,
      "The market is empty. No cards are available to draw.",
    );
  }

  const nextState = addCardsToHand(
    result.state,
    "player",
    result.cards,
  );

  return switchTurn(
    nextState,
    "bot",
    "You drew a card from the market. The bot is next.",
  );
}

/* ============================================================
   BOT TURN
   ============================================================ */

function getBotAnswerAccuracy(card: WhotCard): number {
  switch (card.difficulty) {
    case "EASY":
      return 0.92;
    case "MEDIUM":
      return 0.78;
    case "HARD":
      return 0.62;
    default:
      return 0.75;
  }
}

function simulateBotAnswer(
  card: WhotCard,
  randomizeBotAnswers: boolean,
): boolean {
  if (!randomizeBotAnswers) {
    return true;
  }

  return Math.random() < getBotAnswerAccuracy(card);
}

/**
 * Runs one complete bot turn.
 *
 * The bot:
 *   1. Finds cards matching the center subject.
 *   2. Selects one of those cards if possible.
 *   3. Simulates answering its question.
 *   4. Plays it on a correct answer.
 *   5. Draws penalty cards on an incorrect answer.
 *   6. Draws one card if it has no playable card.
 *
 * The bot does not expose its answer key to the player UI.
 * This is a frontend simulation, not a security boundary.
 */
export function performBotTurn(
  state: WhotEngineState,
  options: WhotEngineOptions = {},
): WhotEngineState {
  if (state.status !== "PLAYING") {
    return state;
  }

  if (state.currentTurn !== "bot") {
    return createEmptyResultMessage(
      state,
      "It is not the bot's turn.",
    );
  }

  const randomizeBotAnswers =
    options.randomizeBotAnswers ?? true;

  const playableCards = getPlayableCards(state, "bot");

  if (playableCards.length === 0) {
    const result = takeCards(
      state,
      state.config.drawOnNoMatch,
    );

    const nextState = addCardsToHand(
      result.state,
      "bot",
      result.cards,
    );

    return switchTurn(
      nextState,
      "player",
      result.cards.length > 0
        ? `The bot had no matching card and drew ${result.cards.length} card(s). Your turn!`
        : "The bot had no matching card, and the market is empty. Your turn!",
    );
  }

  // Prefer an easier question, then randomly choose among cards
  // with the same difficulty. This keeps the bot playable while
  // avoiding a fixed, predictable card order.
  const difficultyRank = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  } as const;

  const easiestDifficulty = Math.min(
    ...playableCards.map(
      (card) => difficultyRank[card.difficulty],
    ),
  );

  const preferredCards = playableCards.filter(
    (card) =>
      difficultyRank[card.difficulty] === easiestDifficulty,
  );

  const selectedCard =
    preferredCards[
      Math.floor(Math.random() * preferredCards.length)
    ];

  const correct = simulateBotAnswer(
    selectedCard,
    randomizeBotAnswers,
  );

  if (!correct) {
    const result = takeCards(
      state,
      state.config.wrongAnswerPenalty,
    );

    const nextState = addCardsToHand(
      result.state,
      "bot",
      result.cards,
    );

    return switchTurn(
      nextState,
      "player",
      `The bot answered incorrectly and drew ${result.cards.length} card(s). Your turn!`,
    );
  }

  const remainingHand = state.bot.hand.filter(
    (card) => card.instanceId !== selectedCard.instanceId,
  );

  const nextState: WhotEngineState = {
    ...state,

    bot: {
      ...state.bot,
      hand: remainingHand,
    },

    centerCard: selectedCard,
    discardPile: [
      ...state.discardPile,
      state.centerCard,
    ],

    turnsPlayed: state.turnsPlayed + 1,
    selectedCardInstanceId: null,
    questionDeadline: null,

    message: `The bot played a ${selectedCard.subject} card. Your turn!`,
  };

  if (remainingHand.length === 0) {
    return finishGame(nextState, "bot");
  }

  return {
    ...nextState,
    currentTurn: "player",
  };
}

/* ============================================================
   ANSWER OUTCOME HELPER
   ============================================================ */

/**
 * Produces an answer outcome for UI feedback.
 *
 * Use this only where the answer is already known to the caller.
 * Do not send the correct answer index to contestant-facing
 * components before an answer has been submitted.
 */
export function evaluateWhotAnswer(
  card: WhotCard,
  answerIndex: number | null,
): WhotAnswerOutcome {
  const correct =
    answerIndex !== null &&
    Number.isInteger(answerIndex) &&
    answerIndex === card.correctAnswerIndex;

  if (correct) {
    return {
      correct: true,
      answerIndex,
      explanation: card.explanation,
    };
  }

  return {
    correct: false,
    answerIndex,
    explanation: card.explanation,
  };
}

/* ============================================================
   MOVE VALIDATION
   ============================================================ */

/**
 * Validates whether the player can select a particular card.
 *
 * This helper is useful for disabling non-playable cards in
 * the UI before the user clicks them.
 */
export function validatePlayerCardMove(
  state: WhotEngineState,
  instanceId: string,
): WhotMoveResult {
  if (state.status !== "PLAYING") {
    return createMoveFailure(
      "GAME_NOT_ACTIVE",
      "The game is not currently active.",
    );
  }

  if (state.currentTurn !== "player") {
    return createMoveFailure(
      "NOT_YOUR_TURN",
      "Wait for your turn.",
    );
  }

  const card = state.player.hand.find(
    (item) => item.instanceId === instanceId,
  );

  if (!card) {
    return createMoveFailure(
      "CARD_NOT_FOUND",
      "That card could not be found in your hand.",
    );
  }

  if (!isCardPlayable(card, state.centerCard)) {
    return createMoveFailure(
      "INVALID_MOVE",
      `You can only play a ${state.centerCard.subject} card.`,
    );
  }

  return createMoveSuccess("This card can be played.");
}

/* ============================================================
   GAME REDUCER
   ============================================================ */

/**
 * Central reducer for connecting the engine to React state.
 *
 * Note:
 * BOT_TURN is deliberately a separate action. The UI can call
 * it after the player's turn ends, for example from a
 * useEffect, instead of running bot logic during rendering.
 */
export function whotGameReducer(
  state: WhotEngineState,
  action: WhotGameAction,
): WhotEngineState {
  switch (action.type) {
    case "START_GAME":
      return startWhotGame(state);

    case "SELECT_CARD":
      return selectWhotCard(state, action.instanceId);

    case "SUBMIT_ANSWER":
      return submitWhotAnswer(state, action.answerIndex);

    case "DRAW_CARD":
      return drawMarketCard(state);

    case "BOT_TURN":
      return performBotTurn(state);

    case "QUESTION_TIMEOUT":
      return handleQuestionTimeout(state);

    case "RESTART_GAME":
      return restartWhotGame(state);

    default:
      return state;
  }
}

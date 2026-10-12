
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
   LEARNYFI WHOT — EDUCATIONAL CHALLENGE ENGINE
   ============================================================

   RULES
   - Each player starts with six cards.
   - Cards match the center card by subject.
   - The player answers questions on their own selected cards.
   - The bot plays a card and challenges the player with its
     question instead of answering it automatically.
   - Correct answers earn the player points.
   - Wrong answers and timeouts award points to the bot.
   - A wrong answer on a player card draws penalty cards.
   - A wrong answer on a bot card allows the bot to challenge
     again, up to three consecutive questions per turn.
   - Answer feedback remains visible until Continue is clicked.
   - The first player to empty their hand wins, subject to the
     bot's final-question challenge rule.
   - Discarded cards can be recycled when the market empties.

   Frontend-only prototype. Answer keys are not secure against
   inspection of client-side code.
   ============================================================ */

const PLAYER_NAME = "You";
const BOT_NAME = "Learnyfi Bot";

export const MAX_BOT_CHALLENGES_PER_TURN = 3;

const PLAYER_CORRECT_POINTS = {
  EASY: 10,
  MEDIUM: 15,
  HARD: 20,
} as const;

const BOT_CORRECT_POINTS = 10;

export type WhotQuestionSource = "player" | "bot";

export interface WhotAnswerFeedback {
  source: WhotQuestionSource;
  correct: boolean;
  correctAnswerIndex: number;
  explanation?: string;
  pointsAwarded: number;
}

export interface WhotEngineState extends WhotGameState {
  /** Cards previously played, excluding the center card. */
  discardPile: WhotCard[];

  /** Configuration for this game session. */
  config: WhotGameConfig;

  /** Card whose question is currently open. */
  activeQuestionCard: WhotCard | null;

  /** Identifies who played the card whose question is open. */
  questionSource: WhotQuestionSource | null;

  /** Educational points accumulated by each side. */
  playerScore: number;
  botScore: number;

  /** Consecutive bot questions during the current challenge turn. */
  botChallengeCount: number;

  /** Last answer feedback, available for the UI to display. */
  answerFeedback: WhotAnswerFeedback | null;
}

export interface WhotEngineOptions {
  config?: Partial<WhotGameConfig>;
  randomizeBotAnswers?: boolean;
}

function createConfig(
  overrides: Partial<WhotGameConfig> = {},
): WhotGameConfig {
  return {
    ...DEFAULT_WHOT_CONFIG,
    ...overrides,
  };
}

function withMessage(
  state: WhotEngineState,
  message: string,
): WhotEngineState {
  return { ...state, message };
}

function createMoveFailure(
  reason: Extract<WhotMoveResult, { success: false }>["reason"],
  message: string,
): WhotMoveResult {
  return { success: false, reason, message };
}

function createMoveSuccess(message: string): WhotMoveResult {
  return { success: true, message };
}

function clearQuestion(
  state: WhotEngineState,
): WhotEngineState {
  return {
    ...state,
    selectedCardInstanceId: null,
    questionDeadline: null,
    activeQuestionCard: null,
    questionSource: null,
  };
}

function clearAnswerFeedback(
  state: WhotEngineState,
): WhotEngineState {
  return {
    ...state,
    answerFeedback: null,
  };
}

/* ============================================================
   GAME CREATION
   ============================================================ */

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

    activeQuestionCard: null,
    questionSource: null,

    playerScore: 0,
    botScore: 0,
    botChallengeCount: 0,

    answerFeedback: null,
  };
}

export function startWhotGame(
  state: WhotEngineState,
): WhotEngineState {
  if (state.status !== "READY") {
    return withMessage(
      state,
      "This game has already started or finished.",
    );
  }

  return {
    ...state,
    status: "PLAYING",
    currentTurn: "player",
    message: "Your turn! Match the subject of the center card.",
  };
}

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

export function isCardPlayable(
  card: WhotCard,
  centerCard: WhotCard,
): boolean {
  return card.subject === centerCard.subject;
}

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

export function hasPlayableCard(
  state: WhotEngineState,
  playerId: WhotPlayerId = "player",
): boolean {
  return getPlayableCards(state, playerId).length > 0;
}

/* ============================================================
   PLAYER CARD SELECTION
   ============================================================ */

export function selectWhotCard(
  state: WhotEngineState,
  instanceId: string,
  now: number = Date.now(),
): WhotEngineState {
  if (state.status !== "PLAYING") {
    return withMessage(state, "The game is not currently active.");
  }

  if (state.currentTurn !== "player") {
    return withMessage(state, "Wait for your turn.");
  }

  if (state.answerFeedback !== null) {
    return withMessage(
      state,
      "Review your answer feedback and click Continue first.",
    );
  }

  if (state.activeQuestionCard !== null) {
    return withMessage(
      state,
      "Answer the current question before selecting another card.",
    );
  }

  const card = state.player.hand.find(
    (item) => item.instanceId === instanceId,
  );

  if (!card) {
    return withMessage(state, "That card is no longer in your hand.");
  }

  if (!isCardPlayable(card, state.centerCard)) {
    return withMessage(
      state,
      `Choose a ${state.centerCard.subject} card to match the center card.`,
    );
  }

  return {
    ...state,
    selectedCardInstanceId: card.instanceId,
    activeQuestionCard: card,
    questionSource: "player",
    questionDeadline: now + state.config.questionTimeLimit * 1000,
    answerFeedback: null,
    message: `Answer the ${card.subject} question before time runs out!`,
  };
}

/* ============================================================
   DRAW PILE
   ============================================================ */

function prepareDrawPile(
  state: WhotEngineState,
): WhotEngineState {
  if (state.drawPile.length > 0 || state.discardPile.length === 0) {
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
    state = { ...state, drawPile: remainingPile };
  }

  return { state, cards };
}

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

export function drawCardsForPlayer(
  state: WhotEngineState,
  playerId: WhotPlayerId,
  count: number,
): WhotEngineState {
  if (!Number.isInteger(count) || count < 0) {
    return withMessage(
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
   TURN AND GAME FINISHING
   ============================================================ */

function switchTurn(
  state: WhotEngineState,
  nextPlayer: WhotPlayerId,
  message: string,
): WhotEngineState {
  return {
    ...clearQuestion(state),
    currentTurn: nextPlayer,
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
    ...clearQuestion(state),
    status: "FINISHED",
    winner,
    message:
      winner === "player"
        ? `Congratulations! You won Learnyfi WHOT with ${state.playerScore} points!`
        : `${winnerName} wins this round with ${state.botScore} points. Try again!`,
  };
}

/* ============================================================
   ACTIVE QUESTION HELPERS
   ============================================================ */

export function getSelectedQuestion(
  state: WhotEngineState,
): WhotCard | null {
  if (state.activeQuestionCard) {
    return state.activeQuestionCard;
  }

  if (!state.selectedCardInstanceId) {
    return null;
  }

  return (
    state.player.hand.find(
      (card) => card.instanceId === state.selectedCardInstanceId,
    ) ?? null
  );
}

export function isQuestionExpired(
  state: WhotEngineState,
  now: number = Date.now(),
): boolean {
  return (
    state.questionDeadline !== null &&
    now >= state.questionDeadline
  );
}

/* ============================================================
   ANSWER FEEDBACK
   ============================================================ */

function createFeedback(
  card: WhotCard,
  source: WhotQuestionSource,
  correct: boolean,
  pointsAwarded: number,
): WhotAnswerFeedback {
  return {
    source,
    correct,
    correctAnswerIndex: card.correctAnswerIndex,
    explanation: card.explanation,
    pointsAwarded,
  };
}

function scoreCorrectPlayerAnswer(
  _state: WhotEngineState,
  card: WhotCard,
): number {
  return PLAYER_CORRECT_POINTS[card.difficulty];
}

function scoreBotForPlayerMistake(): number {
  return BOT_CORRECT_POINTS;
}

/* ============================================================
   PLAYER ANSWERS A QUESTION
   ============================================================ */

export function submitWhotAnswer(
  state: WhotEngineState,
  answerIndex: number,
): WhotEngineState {
  if (state.status !== "PLAYING") {
    return withMessage(state, "The game is not currently active.");
  }

  if (state.answerFeedback !== null) {
    return withMessage(
      state,
      "Your previous answer has already been recorded. Click Continue.",
    );
  }

  if (
    state.activeQuestionCard === null ||
    state.questionSource === null
  ) {
    return withMessage(
      state,
      "There is no active question to answer.",
    );
  }

  if (
    !Number.isInteger(answerIndex) ||
    answerIndex < 0 ||
    answerIndex >= state.activeQuestionCard.options.length
  ) {
    return withMessage(state, "Select a valid answer option.");
  }

  const card = state.activeQuestionCard;
  const source = state.questionSource;
  const correct = answerIndex === card.correctAnswerIndex;

  if (source === "player") {
    if (state.currentTurn !== "player") {
      return withMessage(state, "It is not your turn.");
    }

    return resolvePlayerCardAnswer(state, card, answerIndex, correct);
  }

  if (state.currentTurn !== "player") {
    return withMessage(state, "Wait until the bot's question is ready.");
  }

  return resolveBotCardAnswer(state, card, answerIndex, correct);
}

function resolvePlayerCardAnswer(
  state: WhotEngineState,
  card: WhotCard,
  _answerIndex: number,
  correct: boolean,
): WhotEngineState {
  if (correct) {
    const points = scoreCorrectPlayerAnswer(state, card);

    const remainingHand = state.player.hand.filter(
      (item) => item.instanceId !== card.instanceId,
    );

    const nextState: WhotEngineState = {
      ...state,
      player: {
        ...state.player,
        hand: remainingHand,
      },
      centerCard: card,
      discardPile: [...state.discardPile, state.centerCard],
      playerScore: state.playerScore + points,
      correctAnswers: state.correctAnswers + 1,
      turnsPlayed: state.turnsPlayed + 1,
      answerFeedback: createFeedback(card, "player", true, points),
      selectedCardInstanceId: null,
      activeQuestionCard: null,
      questionSource: null,
      questionDeadline: null,
      botChallengeCount: 0,
    };

    if (remainingHand.length === 0) {
      return finishGame(nextState, "player");
    }

    return {
      ...nextState,
      currentTurn: "bot",
      message: `Correct! +${points} points. Your ${card.subject} card is played. Click Continue when you're ready for the bot's turn.`,
    };
  }

  const points = scoreBotForPlayerMistake();

  const result = takeCards(
    {
      ...state,
      incorrectAnswers: state.incorrectAnswers + 1,
      botScore: state.botScore + points,
      answerFeedback: createFeedback(card, "player", false, points),
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
    `Incorrect! The correct answer was revealed. The bot earns ${points} points, and you draw ${result.cards.length} card(s). Click Continue to proceed.`,
  );
}

function resolveBotCardAnswer(
  state: WhotEngineState,
  card: WhotCard,
  _answerIndex: number,
  correct: boolean,
): WhotEngineState {
  if (correct) {
    const points = scoreCorrectPlayerAnswer(state, card);

    let nextState: WhotEngineState = {
      ...state,
      playerScore: state.playerScore + points,
      correctAnswers: state.correctAnswers + 1,
      turnsPlayed: state.turnsPlayed + 1,
      botChallengeCount: 0,
      answerFeedback: createFeedback(card, "bot", true, points),
      selectedCardInstanceId: null,
      activeQuestionCard: null,
      questionSource: null,
      questionDeadline: null,
    };

    // The bot's final card only wins if the player fails to
    // answer its question. A correct answer forces the bot to
    // draw a replacement card.
    if (nextState.bot.hand.length === 0) {
      const drawResult = takeCards(nextState, 1);

      nextState = addCardsToHand(
        drawResult.state,
        "bot",
        drawResult.cards,
      );

      if (drawResult.cards.length === 0) {
        return finishGame(nextState, "player");
      }

      return {
        ...nextState,
        currentTurn: "player",
        message: `Correct! +${points} points. You stopped the bot's final-card challenge, and it had to draw a card. Click Continue for your turn.`,
      };
    }

    return {
      ...nextState,
      currentTurn: "player",
      message: `Correct! +${points} points. The bot's card stays on the table. Click Continue for your turn.`,
    };
  }

  const points = scoreBotForPlayerMistake();
  const nextChallengeCount = state.botChallengeCount + 1;

  const result = takeCards(
    {
      ...state,
      incorrectAnswers: state.incorrectAnswers + 1,
      botScore: state.botScore + points,
      answerFeedback: createFeedback(card, "bot", false, points),
    },
    state.config.wrongAnswerPenalty,
  );

  let nextState = addCardsToHand(
    result.state,
    "player",
    result.cards,
  );

  nextState = {
    ...clearQuestion(nextState),
    botChallengeCount: nextChallengeCount,
    turnsPlayed: nextState.turnsPlayed + 1,
  };

  // The bot's final card wins only after the player fails the
  // final question. Keep the feedback for the UI to display.
  if (nextState.bot.hand.length === 0) {
    return finishGame(
      {
        ...nextState,
        message: `Incorrect! The bot earns ${points} points. ${result.cards.length} penalty card(s) added.`,
      },
      "bot",
    );
  }

  if (nextChallengeCount >= MAX_BOT_CHALLENGES_PER_TURN) {
    return {
      ...nextState,
      currentTurn: "player",
      botChallengeCount: 0,
      message: `Incorrect! The bot earns ${points} points. You drew ${result.cards.length} card(s). The bot's three-question challenge is over. Click Continue for your turn.`,
    };
  }

  return {
    ...nextState,
    currentTurn: "bot",
    message: `Incorrect! The correct answer was revealed. The bot earns ${points} points. You drew ${result.cards.length} card(s). Click Continue for the bot's next challenge.`,
  };
}

/* ============================================================
   QUESTION TIMEOUT
   ============================================================ */

export function handleQuestionTimeout(
  state: WhotEngineState,
  now: number = Date.now(),
): WhotEngineState {
  if (
    state.status !== "PLAYING" ||
    state.answerFeedback !== null ||
    state.activeQuestionCard === null ||
    state.questionSource === null
  ) {
    return state;
  }

  if (
    state.questionDeadline !== null &&
    now < state.questionDeadline
  ) {
    return withMessage(
      state,
      "There is still time to answer the question.",
    );
  }

  const card = state.activeQuestionCard;
  const source = state.questionSource;

  if (source === "player") {
    return resolvePlayerCardAnswer(state, card, -1, false);
  }

  return resolveBotCardAnswer(state, card, -1, false);
}

/* ============================================================
   MARKET DRAW
   ============================================================ */

export function drawMarketCard(
  state: WhotEngineState,
): WhotEngineState {
  if (state.status !== "PLAYING") {
    return withMessage(state, "The game is not currently active.");
  }

  if (state.currentTurn !== "player") {
    return withMessage(state, "Wait for your turn before drawing a card.");
  }

  if (state.answerFeedback !== null) {
    return withMessage(
      state,
      "Review your answer feedback and click Continue first.",
    );
  }

  if (state.activeQuestionCard !== null) {
    return withMessage(
      state,
      "Answer the current question before drawing a card.",
    );
  }

  const result = takeCards(state, 1);

  if (result.cards.length === 0) {
    return withMessage(
      result.state,
      "The market is empty. No cards are available to draw.",
    );
  }

  const nextState = addCardsToHand(
    result.state,
    "player",
    result.cards,
  );

  return {
    ...switchTurn(
      nextState,
      "bot",
      "You drew a card from the market. Click Continue if feedback is visible, otherwise the bot will play next.",
    ),
    botChallengeCount: 0,
  };
}

/* ============================================================
   BOT CHALLENGE TURN
   ============================================================ */

export function performBotTurn(
  state: WhotEngineState,
  _options: WhotEngineOptions = {},
): WhotEngineState {
  if (state.status !== "PLAYING") {
    return state;
  }

  if (state.currentTurn !== "bot") {
    return withMessage(state, "It is not the bot's turn.");
  }

  if (state.activeQuestionCard !== null) {
    return state;
  }

  // Wait until the player has dismissed the previous feedback.
  if (state.answerFeedback !== null) {
    return state;
  }

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

    return {
      ...switchTurn(
        nextState,
        "player",
        result.cards.length > 0
          ? `The bot had no matching card and drew ${result.cards.length} card(s). Your turn!`
          : "The bot had no matching card and the market is empty. Your turn!",
      ),
      botChallengeCount: 0,
    };
  }

  // Prefer an easier question, then randomly select among cards
  // of that difficulty.
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
    (card) => difficultyRank[card.difficulty] === easiestDifficulty,
  );

  const selectedCard =
    preferredCards[Math.floor(Math.random() * preferredCards.length)];

  const remainingHand = state.bot.hand.filter(
    (card) => card.instanceId !== selectedCard.instanceId,
  );

  return {
    ...state,

    bot: {
      ...state.bot,
      hand: remainingHand,
    },

    centerCard: selectedCard,
    discardPile: [...state.discardPile, state.centerCard],

    currentTurn: "player",
    selectedCardInstanceId: selectedCard.instanceId,
    activeQuestionCard: selectedCard,
    questionSource: "bot",
    questionDeadline:
      Date.now() + state.config.questionTimeLimit * 1000,

    answerFeedback: null,
    turnsPlayed: state.turnsPlayed + 1,

    message: `The bot played a ${selectedCard.subject} card! Answer its question to defend your turn.`,
  };
}

/* ============================================================
   ANSWER OUTCOME HELPER
   ============================================================ */

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
    return createMoveFailure("NOT_YOUR_TURN", "Wait for your turn.");
  }

  if (state.answerFeedback !== null) {
    return createMoveFailure(
      "INVALID_MOVE",
      "Review your answer feedback and click Continue first.",
    );
  }

  if (state.activeQuestionCard !== null) {
    return createMoveFailure(
      "INVALID_MOVE",
      "Answer the current question before selecting another card.",
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
   REDUCER
   ============================================================ */

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

    case "CONTINUE_AFTER_FEEDBACK":
      if (
        state.status !== "PLAYING" ||
        state.answerFeedback === null
      ) {
        return state;
      }

      return clearAnswerFeedback(state);

    default:
      return state;
  }
}

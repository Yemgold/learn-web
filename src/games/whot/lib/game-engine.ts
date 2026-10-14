
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

   FLOW
   1. You play a matching card. The bot answers its question.
   2. The bot plays a matching card. You answer its question.
   3. Correct answers award points to the answerer.
   4. Incorrect answers/timeouts award points to the opponent.
   5. An incorrect answerer draws penalty cards.
   6. Feedback stays visible until Continue is clicked.
   7. A final card must survive its question challenge to win.

   Frontend-only prototype. Answer keys are visible in client code.
   ============================================================ */

const PLAYER_NAME = "You";
const BOT_NAME = "Learnyfi Bot";

export const MAX_BOT_CHALLENGES_PER_TURN = 3;

const PLAYER_CORRECT_POINTS = {
  EASY: 10,
  MEDIUM: 15,
  HARD: 20,
} as const;

const BOT_CORRECT_POINTS = {
  EASY: 10,
  MEDIUM: 15,
  HARD: 20,
} as const;

export type WhotQuestionSource = "player" | "bot";

export interface WhotAnswerFeedback {
  /** Identifies who played the card being challenged. */
  source: WhotQuestionSource;
  correct: boolean;
  correctAnswerIndex: number;
  explanation?: string;
  pointsAwarded: number;
}

export interface WhotEngineState extends WhotGameState {
  discardPile: WhotCard[];
  config: WhotGameConfig;
  activeQuestionCard: WhotCard | null;

  /** "player": bot answers. "bot": human answers. */
  questionSource: WhotQuestionSource | null;

  playerScore: number;
  botScore: number;
  botChallengeCount: number;
  answerFeedback: WhotAnswerFeedback | null;
}

export interface WhotEngineOptions {
  config?: Partial<WhotGameConfig>;
  randomizeBotAnswers?: boolean;
}

function createConfig(
  overrides: Partial<WhotGameConfig> = {},
): WhotGameConfig {
  return { ...DEFAULT_WHOT_CONFIG, ...overrides };
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
  return { ...state, answerFeedback: null };
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
  return (
    card.subject === centerCard.subject ||
    card.difficulty === centerCard.difficulty
  );
}


export function getPlayableCards(
  state: WhotEngineState,
  playerId: WhotPlayerId = "player",
): WhotCard[] {
  const hand =
    playerId === "player" ? state.player.hand : state.bot.hand;

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
   DRAW PILE AND PENALTIES
   ============================================================ */

function prepareDrawPile(
  state: WhotEngineState,
): WhotEngineState {
  if (state.drawPile.length > 0 || state.discardPile.length === 0) {
    return state;
  }

  // Keep the current center card in place.
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

    if (state.drawPile.length === 0) break;

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
  if (cards.length === 0) return state;

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
  const winnerName = winner === "player" ? PLAYER_NAME : BOT_NAME;

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
   QUESTION HELPERS
   ============================================================ */

export function getSelectedQuestion(
  state: WhotEngineState,
): WhotCard | null {
  if (state.activeQuestionCard) return state.activeQuestionCard;

  if (!state.selectedCardInstanceId) return null;

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

function pointsForCard(card: WhotCard): number {
  return PLAYER_CORRECT_POINTS[card.difficulty];
}

/* ============================================================
   PLAYER PLAYS A CARD
   The card is placed on the table immediately.
   The bot must now answer its question.
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
      "Resolve the current question before selecting another card.",
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
    `Choose a ${state.centerCard.subject} card or a ${state.centerCard.difficulty} difficulty card.`,
  );
}


  const remainingHand = state.player.hand.filter(
    (item) => item.instanceId !== card.instanceId,
  );

  return {
    ...state,
    player: {
      ...state.player,
      hand: remainingHand,
    },
    discardPile: [...state.discardPile, state.centerCard],
    centerCard: card,
    selectedCardInstanceId: card.instanceId,
    activeQuestionCard: card,
    questionSource: "player",
    questionDeadline: now + state.config.questionTimeLimit * 1000,
    answerFeedback: null,
    message: `You played ${card.subject}. 🤖 Learnyfi Bot is thinking...`,
  };
}

/* ============================================================
   ANSWER RESOLUTION
   ============================================================ */

function resolveBotAnswerToPlayerCard(
  state: WhotEngineState,
  card: WhotCard,
  correct: boolean,
): WhotEngineState {
  if (correct) {
    const points = BOT_CORRECT_POINTS[card.difficulty];

    let nextState: WhotEngineState = {
      ...state,
      botScore: state.botScore + points,
      correctAnswers: state.correctAnswers + 1,
      answerFeedback: createFeedback(card, "player", true, points),
      selectedCardInstanceId: null,
      activeQuestionCard: null,
      questionSource: null,
      questionDeadline: null,
      botChallengeCount: 0,
      turnsPlayed: state.turnsPlayed + 1,
    };

    // Your final card is not a win if the bot answers correctly.
    // You must draw a replacement card before play continues.
    if (nextState.player.hand.length === 0) {
      const drawResult = takeCards(nextState, 1);
      nextState = addCardsToHand(
        drawResult.state,
        "player",
        drawResult.cards,
      );

      if (drawResult.cards.length === 0) {
        return finishGame(nextState, "bot");
      }

      return {
        ...nextState,
        currentTurn: "bot",
        message: `The bot answered correctly and earned ${points} points. Because that was your final card, you must draw a replacement. Click Continue.`,
      };
    }

    return {
      ...nextState,
      currentTurn: "bot",
      message: `The bot answered correctly and earned ${points} points. Click Continue for the bot's turn.`,
    };
  }

  const points = pointsForCard(card);
  const result = takeCards(
    {
      ...state,
      playerScore: state.playerScore + points,
      incorrectAnswers: state.incorrectAnswers + 1,
      answerFeedback: createFeedback(card, "player", false, points),
    },
    state.config.wrongAnswerPenalty,
  );

  let nextState = addCardsToHand(result.state, "bot", result.cards);

  nextState = {
    ...nextState,
    selectedCardInstanceId: null,
    activeQuestionCard: null,
    questionSource: null,
    questionDeadline: null,
    botChallengeCount: 0,
    turnsPlayed: nextState.turnsPlayed + 1,
  };

  // Your final card wins if the bot fails its question.
  if (nextState.player.hand.length === 0) {
    return finishGame(
      {
        ...nextState,
        message: `The bot answered incorrectly. You earn ${points} points, and the bot draws ${result.cards.length} penalty card(s). You win!`,
      },
      "player",
    );
  }

  return {
    ...nextState,
    currentTurn: "bot",
    message: `The bot answered incorrectly. You earn ${points} points, and the bot draws ${result.cards.length} penalty card(s). Click Continue.`,
  };
}

/**
 * Call this from the game hook after a short bot-thinking delay
 * whenever questionSource === "player".
 *
 * Bot accuracy is affected by the question difficulty.
 */
export function performBotAnswer(
  state: WhotEngineState,
  options: WhotEngineOptions = {},
): WhotEngineState {
  if (
    state.status !== "PLAYING" ||
    state.questionSource !== "player" ||
    state.activeQuestionCard === null ||
    state.answerFeedback !== null
  ) {
    return state;
  }

  const card = state.activeQuestionCard;

  // Easier questions are more likely to be answered correctly.
  const accuracyByDifficulty = {
    EASY: 0.9,
    MEDIUM: 0.72,
    HARD: 0.5,
  } as const;

  const randomize = options.randomizeBotAnswers ?? true;
  const correct = randomize
    ? Math.random() < accuracyByDifficulty[card.difficulty]
    : true;

  return resolveBotAnswerToPlayerCard(state, card, correct);
}

/* ============================================================
   PLAYER ANSWERS THE BOT'S CARD
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
    state.questionSource !== "bot"
  ) {
    return withMessage(
      state,
      "There is no question waiting for your answer.",
    );
  }

  if (state.currentTurn !== "player") {
    return withMessage(state, "Wait until it is your turn to answer.");
  }

  if (
    !Number.isInteger(answerIndex) ||
    answerIndex < 0 ||
    answerIndex >= state.activeQuestionCard.options.length
  ) {
    return withMessage(state, "Select a valid answer option.");
  }

  const card = state.activeQuestionCard;
  const correct = answerIndex === card.correctAnswerIndex;

  if (correct) {
    const points = pointsForCard(card);

    let nextState: WhotEngineState = {
      ...state,
      playerScore: state.playerScore + points,
      correctAnswers: state.correctAnswers + 1,
      answerFeedback: createFeedback(card, "bot", true, points),
      selectedCardInstanceId: null,
      activeQuestionCard: null,
      questionSource: null,
      questionDeadline: null,
      botChallengeCount: 0,
      turnsPlayed: state.turnsPlayed + 1,
    };

    // The bot's final card is stopped by a correct answer.
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
    }

    return {
      ...nextState,
      currentTurn: "player",
      message: `Correct! You earn ${points} points. Click Continue to keep playing.`,
    };
  }

  const points = BOT_CORRECT_POINTS[card.difficulty];

  const result = takeCards(
    {
      ...state,
      botScore: state.botScore + points,
      incorrectAnswers: state.incorrectAnswers + 1,
      answerFeedback: createFeedback(card, "bot", false, points),
    },
    state.config.wrongAnswerPenalty,
  );

  let nextState = addCardsToHand(result.state, "player", result.cards);

  nextState = {
    ...nextState,
    selectedCardInstanceId: null,
    activeQuestionCard: null,
    questionSource: null,
    questionDeadline: null,
    turnsPlayed: nextState.turnsPlayed + 1,
  };

  // If the bot played its final card, a wrong answer means it wins.
  if (nextState.bot.hand.length === 0) {
    return finishGame(
      {
        ...nextState,
        message: `Incorrect! The bot earns ${points} points. You draw ${result.cards.length} penalty card(s). The bot wins this round.`,
      },
      "bot",
    );
  }

  return {
    ...nextState,
    currentTurn: "player",
    message: `Incorrect! The bot earns ${points} points, and you draw ${result.cards.length} penalty card(s). Click Continue.`,
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

  // If the bot is answering your card, the bot's timeout is
  // treated as an incorrect answer.
  if (state.questionSource === "player") {
    return resolveBotAnswerToPlayerCard(
      state,
      state.activeQuestionCard,
      false,
    );
  }

  // Human timeout: same penalty as an incorrect answer.
  const card = state.activeQuestionCard;
  const points = BOT_CORRECT_POINTS[card.difficulty];

  const result = takeCards(
    {
      ...state,
      botScore: state.botScore + points,
      incorrectAnswers: state.incorrectAnswers + 1,
      answerFeedback: createFeedback(card, "bot", false, points),
    },
    state.config.wrongAnswerPenalty,
  );

  let nextState = addCardsToHand(result.state, "player", result.cards);

  nextState = {
    ...nextState,
    selectedCardInstanceId: null,
    activeQuestionCard: null,
    questionSource: null,
    questionDeadline: null,
    turnsPlayed: nextState.turnsPlayed + 1,
  };

  if (nextState.bot.hand.length === 0) {
    return finishGame(
      {
        ...nextState,
        message: `Time is up! The bot earns ${points} points. You draw ${result.cards.length} penalty card(s). The bot wins this round.`,
      },
      "bot",
    );
  }

  return {
    ...nextState,
    currentTurn: "player",
    message: `Time is up! The bot earns ${points} points, and you draw ${result.cards.length} penalty card(s). Click Continue.`,
  };
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
    return withMessage(
      state,
      "Wait for your turn before drawing a card.",
    );
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
      "Resolve the current question before drawing a card.",
    );
  }

  const result = takeCards(state, 1);

  if (result.cards.length === 0) {
    return withMessage(
      result.state,
      "The market is empty. No cards are available to draw.",
    );
  }

  const nextState = addCardsToHand(result.state, "player", result.cards);

  return {
    ...switchTurn(
      nextState,
      "bot",
      "You drew a card from the market. Click Continue if feedback is visible; otherwise the bot will play next.",
    ),
    botChallengeCount: 0,
  };
}

/* ============================================================
   BOT CARD PLAY
   ============================================================ */

export function performBotTurn(
  state: WhotEngineState,
  _options: WhotEngineOptions = {},
): WhotEngineState {
  if (state.status !== "PLAYING" || state.currentTurn !== "bot") {
    return state;
  }

  if (state.activeQuestionCard !== null || state.answerFeedback !== null) {
    return state;
  }

  const playableCards = getPlayableCards(state, "bot");

  if (playableCards.length === 0) {
    const result = takeCards(state, state.config.drawOnNoMatch);
    const nextState = addCardsToHand(result.state, "bot", result.cards);

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

  const difficultyRank = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  } as const;

  const easiestDifficulty = Math.min(
    ...playableCards.map((card) => difficultyRank[card.difficulty]),
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
    discardPile: [...state.discardPile, state.centerCard],
    centerCard: selectedCard,
    currentTurn: "player",
    selectedCardInstanceId: selectedCard.instanceId,
    activeQuestionCard: selectedCard,
    questionSource: "bot",
    questionDeadline: Date.now() + state.config.questionTimeLimit * 1000,
    answerFeedback: null,
    turnsPlayed: state.turnsPlayed + 1,
    message: `Learnyfi Bot played ${selectedCard.subject}. Answer its question!`,
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
      "Resolve the current question before selecting another card.",
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
    `Play a ${state.centerCard.subject} card or a ${state.centerCard.difficulty} difficulty card.`,
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










import { WHOT_QUESTIONS } from "../data/questions";
import { shuffleArray } from "./shuffle";

import type {
  WhotCard,
  WhotQuestion,
} from "../types/whot";

/* ============================================================
   LEARNYFI WHOT — DECK MANAGEMENT
   ============================================================

   Responsibilities:
   - Validate the local question bank.
   - Shuffle cards without mutating the original array.
   - Generate unique physical card instance IDs.
   - Create a deck from the question bank.
   - Deal starting hands to the player and bot.
   - Select the initial center card.
   - Keep deck operations frontend-only.

   ============================================================ */

/* ------------------------------------------------------------
   TYPES
   ------------------------------------------------------------ */

export interface InitialDeal {
  playerHand: WhotCard[];
  botHand: WhotCard[];
  drawPile: WhotCard[];
  centerCard: WhotCard;
}

export interface CreateDeckOptions {
  /** Number of physical copies of each question. */
  copiesPerQuestion?: number;

  /** Optional source question bank. */
  questions?: readonly WhotQuestion[];
}

export interface DealOptions {
  /** Number of cards dealt to each player. */
  initialHandSize?: number;

  /** Number of copies of each question. */
  copiesPerQuestion?: number;

  /** Optional source question bank. */
  questions?: readonly WhotQuestion[];
}

/* ------------------------------------------------------------
   SHUFFLE
   ------------------------------------------------------------ */

/**
 * Fisher-Yates shuffle.
 *
 * Returns a new array and leaves the original array unchanged.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/* ------------------------------------------------------------
   QUESTION VALIDATION
   ------------------------------------------------------------ */

/**
 * Validates a question before creating physical cards.
 */
export function validateQuestionBank(
  questions: readonly WhotQuestion[],
): void {
  if (questions.length === 0) {
    throw new Error(
      "[Learnyfi WHOT] The question bank cannot be empty.",
    );
  }

  const questionIds = new Set<string>();

  for (const question of questions) {
    if (!question.id.trim()) {
      throw new Error(
        "[Learnyfi WHOT] Every question must have a non-empty ID.",
      );
    }

    if (questionIds.has(question.id)) {
      throw new Error(
        `[Learnyfi WHOT] Duplicate question ID: ${question.id}`,
      );
    }

    questionIds.add(question.id);

    if (!question.question.trim()) {
      throw new Error(
        `[Learnyfi WHOT] Question "${question.id}" has empty question text.`,
      );
    }

    if (question.options.length < 2) {
      throw new Error(
        `[Learnyfi WHOT] Question "${question.id}" needs at least two options.`,
      );
    }

    if (
      question.options.some(
        (option) =>
          typeof option !== "string" || option.trim().length === 0,
      )
    ) {
      throw new Error(
        `[Learnyfi WHOT] Question "${question.id}" contains an empty option.`,
      );
    }

    if (
      !Number.isInteger(question.correctAnswerIndex) ||
      question.correctAnswerIndex < 0 ||
      question.correctAnswerIndex >= question.options.length
    ) {
      throw new Error(
        `[Learnyfi WHOT] Question "${question.id}" has an invalid answer index.`,
      );
    }
  }
}

/* ------------------------------------------------------------
   CREATE DECK
   ------------------------------------------------------------ */

/**
 * Creates a deck of physical cards from the local question bank.
 *
 * Every physical card receives a unique instanceId, even when
 * several copies of the same question are included.
 */
export function createDeck(
  options: CreateDeckOptions = {},
): WhotCard[] {
  const {
    copiesPerQuestion = 2,
    questions = WHOT_QUESTIONS,
  } = options;

  if (
    !Number.isInteger(copiesPerQuestion) ||
    copiesPerQuestion < 1
  ) {
    throw new Error(
      "[Learnyfi WHOT] copiesPerQuestion must be a positive integer.",
    );
  }

  validateQuestionBank(questions);

  const cards: WhotCard[] = [];

  for (const question of questions) {
    for (
      let copyIndex = 0;
      copyIndex < copiesPerQuestion;
      copyIndex++
    ) {
      cards.push({
        ...question,
        options: [...question.options],
        instanceId: `${question.id}-copy-${copyIndex + 1}`,
      });
    }
  }

  return shuffle(cards);
}

/* ------------------------------------------------------------
   DEAL INITIAL CARDS
   ------------------------------------------------------------ */

/**
 * Shuffles the deck and deals cards to the player and bot.
 *
 * Default:
 * - Player: 6 cards
 * - Bot: 6 cards
 * - Center: 1 card
 * - Remaining cards: draw pile
 */
export function dealInitialCards(
  options: DealOptions = {},
): InitialDeal {
  const {
    initialHandSize = 6,
    copiesPerQuestion = 2,
    questions = WHOT_QUESTIONS,
  } = options;

  if (
    !Number.isInteger(initialHandSize) ||
    initialHandSize < 1
  ) {
    throw new Error(
      "[Learnyfi WHOT] initialHandSize must be a positive integer.",
    );
  }

  const deck = createDeck({
    copiesPerQuestion,
    questions,
  });

  const requiredCards = initialHandSize * 2 + 1;

  if (deck.length < requiredCards) {
    throw new Error(
      `[Learnyfi WHOT] Not enough cards. Need at least ${requiredCards}, but only ${deck.length} are available.`,
    );
  }

  const playerHand = deck.splice(0, initialHandSize);
  const botHand = deck.splice(0, initialHandSize);
  const centerCard = deck.shift();

  if (!centerCard) {
    throw new Error(
      "[Learnyfi WHOT] Unable to select the initial center card.",
    );
  }

  return {
    playerHand,
    botHand,
    centerCard,
    drawPile: deck,
  };
}

/* ------------------------------------------------------------
   INITIAL DEAL ALIAS
   ------------------------------------------------------------ */

/**
 * Convenience alias for initializing a new game.
 *
 * This allows the game engine to call createInitialDeal()
 * without needing to know the lower-level deal function.
 */
export function createInitialDeal(): InitialDeal {
  return dealInitialCards();
}

/* ------------------------------------------------------------
   DRAW A CARD
   ------------------------------------------------------------ */

/**
 * Draws one card from the top of a draw pile.
 *
 * Returns null when the pile is empty.
 */
export function drawCard(
  drawPile: readonly WhotCard[],
): {
  card: WhotCard | null;
  remainingPile: WhotCard[];
} {
  if (drawPile.length === 0) {
    return {
      card: null,
      remainingPile: [],
    };
  }

  const [card, ...remainingPile] = drawPile;

  return {
    card,
    remainingPile,
  };
}

/* ------------------------------------------------------------
   DRAW MULTIPLE CARDS
   ------------------------------------------------------------ */

/**
 * Draws up to the requested number of cards.
 *
 * If fewer cards remain than requested, all remaining cards
 * are returned without throwing an error.
 */
export function drawCards(
  drawPile: readonly WhotCard[],
  count: number,
): {
  cards: WhotCard[];
  remainingPile: WhotCard[];
} {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(
      "[Learnyfi WHOT] Draw count must be a non-negative integer.",
    );
  }

  const actualCount = Math.min(count, drawPile.length);

  return {
    cards: drawPile.slice(0, actualCount),
    remainingPile: drawPile.slice(actualCount),
  };
}

/* ------------------------------------------------------------
   RECYCLE DISCARD CARDS
   ------------------------------------------------------------ */

/**
 * Recycles discarded cards into a new shuffled draw pile.
 *
 * The current center card must remain on the table, so callers
 * should pass only recyclable discarded cards.
 */
export function recycleDiscardPile(
  discardedCards: readonly WhotCard[],
): WhotCard[] {
  return shuffle(discardedCards);
}

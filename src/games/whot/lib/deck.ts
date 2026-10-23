


import { WHOT_QUESTIONS } from "../data/questions";
import type {
  WhotCard,
  WhotQuestion,
  WhotSubject,
} from "../types/whot";

/* ============================================================
   LEARNYFI WHOT — DECK MANAGEMENT
   ============================================================

   Responsibilities:
   - Validate the local question bank.
   - Filter questions using the student's selected subjects.
   - Shuffle cards without mutating the original array.
   - Generate unique physical card instance IDs.
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

  /**
   * Selected subject IDs or names from the setup page.
   *
   * Examples:
   * ["biology", "chemistry", "physics", "english"]
   * ["mathematics", "english", "biology", "chemistry"]
   *
   * If omitted, the complete question bank is used.
   */
  selectedSubjects?: readonly string[];
}

export interface DealOptions {
  /** Number of cards dealt to each player. */
  initialHandSize?: number;

  /** Number of copies of each question. */
  copiesPerQuestion?: number;

  /** Optional source question bank. */
  questions?: readonly WhotQuestion[];

  /** Subjects selected by the student during setup. */
  selectedSubjects?: readonly string[];
}

/* ------------------------------------------------------------
   SUBJECT NORMALIZATION
   ------------------------------------------------------------ */

/**
 * Maps setup-page subject IDs and names to the categories
 * currently supported by the WHOT question bank.
 *
 * Unsupported subjects are deliberately not mapped to another
 * category. For example, Commerce must never become Biology.
 */
const SUBJECT_ALIASES: Record<string, WhotSubject> = {
  maths: "MATHS",
  math: "MATHS",
  mathematics: "MATHS",

  english: "ENGLISH",
  "english language": "ENGLISH",

  biology: "BIOLOGY",
  chemistry: "CHEMISTRY",
  physics: "PHYSICS",
  history: "HISTORY",

  general: "GENERAL",
  "general knowledge": "GENERAL",
};

function normalizeSubject(value: string): WhotSubject | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  return SUBJECT_ALIASES[normalized] ?? null;
}

/**
 * Converts selected setup subjects into the supported WHOT
 * categories and filters the question bank.
 *
 * Unsupported subjects are ignored, but they never cause
 * unrelated questions to be substituted.
 */
export function filterQuestionsBySubjects(
  questions: readonly WhotQuestion[],
  selectedSubjects?: readonly string[],
): WhotQuestion[] {
  // No selection means use the full question bank.
  if (selectedSubjects === undefined) {
    return [...questions];
  }

  if (selectedSubjects.length === 0) {
    throw new Error(
      "[Learnyfi WHOT] No subjects were selected. Return to setup and select your subjects.",
    );
  }

  const selectedCodes = new Set<WhotSubject>();

  for (const selectedSubject of selectedSubjects) {
    const subject = normalizeSubject(selectedSubject);

    if (subject) {
      selectedCodes.add(subject);
    }
  }

  if (selectedCodes.size === 0) {
    throw new Error(
      "[Learnyfi WHOT] None of your selected subjects currently has a supported question category. Please choose a subject with available questions.",
    );
  }

  const filteredQuestions = questions.filter((question) =>
    selectedCodes.has(question.subject),
  );

  if (filteredQuestions.length === 0) {
    throw new Error(
      "[Learnyfi WHOT] No questions are available for your selected subjects.",
    );
  }

  return filteredQuestions;
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

    if (
      !Array.isArray(question.options) ||
      question.options.length < 2
    ) {
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
 * Creates a deck of physical cards from the selected question
 * categories.
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
    selectedSubjects,
  } = options;

  if (
    !Number.isInteger(copiesPerQuestion) ||
    copiesPerQuestion < 1
  ) {
    throw new Error(
      "[Learnyfi WHOT] copiesPerQuestion must be a positive integer.",
    );
  }

  const questionPool = filterQuestionsBySubjects(
    questions,
    selectedSubjects,
  );

  validateQuestionBank(questionPool);

  const cards: WhotCard[] = [];

  for (const question of questionPool) {
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
 * Shuffles the filtered deck and deals cards to the player
 * and bot.
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
    selectedSubjects,
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
    selectedSubjects,
  });

  const requiredCards = initialHandSize * 2 + 1;

  if (deck.length < requiredCards) {
    throw new Error(
      `[Learnyfi WHOT] Not enough cards for this game. Need at least ${requiredCards}, but only ${deck.length} cards are available for your selected subjects. Add more questions or reduce the hand size.`,
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
 */
export function createInitialDeal(
  options: DealOptions = {},
): InitialDeal {
  return dealInitialCards(options);
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



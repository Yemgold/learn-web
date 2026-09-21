





// C:\Users\Lara Spellman\Jamb\jamb-league\src\types\flashcard.ts

/**
 * Difficulty level of a flashcard.
 */
export type FlashcardDifficulty = "easy" | "medium" | "hard";

/**
 * A single educational flashcard.
 */
export interface Flashcard {
  /**
   * Unique identifier for the card.
   */
  id: string;

  /**
   * Subject the card belongs to.
   * Example: Biology, Chemistry, Physics.
   */
  subject: string;

  /**
   * Main topic of the card.
   * Example: Photosynthesis, Excretion, Cell Structure.
   */
  topic: string;

  /**
   * The question/front of the flashcard.
   */
  question: string;

  /**
   * The answer/back of the flashcard.
   */
  answer: string;

  /**
   * Optional additional explanation.
   */
  explanation?: string;

  /**
   * Optional image associated with the card.
   */
  image?: string;

  /**
   * Optional image alt text for accessibility.
   */
  imageAlt?: string;

  /**
   * Difficulty level.
   */
  difficulty?: FlashcardDifficulty;

  /**
   * Searchable concepts/keywords.
   */
  tags?: string[];

  /**
   * Optional source/reference.
   * Example: JAMB Biology, WAEC Biology.
   */
  source?: string;

  /**
   * Optional year associated with the source.
   */
  year?: number;

  /**
   * Optional order of the card within a topic.
   */
  order?: number;
}

/**
 * A collection of flashcards belonging to one topic.
 */
export interface FlashcardDeck {
  /**
   * Unique identifier for the deck.
   */
  id: string;

  /**
   * Display title.
   * Example: "Photosynthesis".
   */
  title: string;

  /**
   * Subject.
   */
  subject: string;

  /**
   * Topic represented by the deck.
   */
  topic: string;

  /**
   * Optional description shown before starting.
   */
  description?: string;

  /**
   * Optional image for the deck/topic.
   */
  image?: string;

  /**
   * All cards in this deck.
   */
  cards: Flashcard[];
}

/**
 * A topic available to the student.
 */
export interface FlashcardTopic {
  /**
   * Unique topic identifier.
   * Example: "photosynthesis".
   */
  id: string;

  /**
   * Display name.
   * Example: "Photosynthesis".
   */
  name: string;

  /**
   * Subject the topic belongs to.
   */
  subject: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Number of available flashcards.
   */
  cardCount: number;

  /**
   * Optional topic image.
   */
  image?: string;

  /**
   * Flashcard deck for the topic.
   */
  deck?: FlashcardDeck;
}

/**
 * Student's progress on an individual flashcard.
 */
export interface FlashcardProgress {
  /**
   * Flashcard ID.
   */
  cardId: string;

  /**
   * Number of times the student has viewed the card.
   */
  views: number;

  /**
   * Number of times the student marked the card as known.
   */
  correctCount: number;

  /**
   * Number of times the student marked the card for review.
   */
  reviewCount: number;

  /**
   * Whether the student currently considers the card mastered.
   */
  mastered: boolean;

  /**
   * Last time the card was reviewed.
   */
  lastReviewedAt?: string;
}

/**
 * Overall progress for a flashcard deck.
 */
export interface FlashcardDeckProgress {
  /**
   * Deck ID.
   */
  deckId: string;

  /**
   * Total number of cards.
   */
  totalCards: number;

  /**
   * Cards the student has mastered.
   */
  masteredCards: number;

  /**
   * Cards that need review.
   */
  reviewCards: number;

  /**
   * Cards not yet studied.
   */
  remainingCards: number;

  /**
   * Progress percentage from 0 to 100.
   */
  percentage: number;

  /**
   * Individual card progress.
   */
  cards: FlashcardProgress[];
}


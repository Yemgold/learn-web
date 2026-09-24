




import type {
  Flashcard,
  FlashcardDeck,
  FlashcardTopic,
} from "@/types/flashcard";

import NumberBasesFlashcards from "./number-bases";
import FractionsDecimalsPercentagesFlashcards from "./fractions-decimals-percentages";
import RatioProportionRatesFlashcards from "./ratio-proportion-rates";
import AlgebraicExpressionsFlashcards from "./algebraic-expressions";
import LinearEquationsInequalitiesFlashcards from "./linear-equations-inequalities";
import QuadraticEquationsFlashcards from "./quadratic-equations";
import SequencesSeriesFlashcards from "./sequences-series";
import SetsFlashcards from "./sets";
import VariationFlashcards from "./variation";
import SurdsIndicesLogarithmsFlashcards from "./surds-indices-logarithms";
import CoordinateGeometryFlashcards from "./coordinate-geometry";
import TrigonometryFlashcards from "./trigonometry";
import MensurationFlashcards from "./mensuration";
import StatisticsFlashcards from "./statistics";
import ProbabilityFlashcards from "./probability";
import VectorsMatricesFlashcards from "./vectors-matrices";
import FunctionsFlashcards from "./functions";
import CalculusFlashcards from "./calculus";
import GeometryFlashcards from "./geometry";

/**
 * Mathematics flashcard decks.
 *
 * Each topic is represented as a FlashcardDeck.
 * The complete Mathematics collection is derived from
 * these decks to keep the data structure consistent.
 */
export const mathematicsFlashcardDecks: FlashcardDeck[] = [
  {
    id: "mathematics-number-bases",
    title: "Number Bases",
    subject: "Mathematics",
    topic: "Number Bases",
    description:
      "JAMB-aligned flashcards covering number bases.",
    cards: NumberBasesFlashcards,
  },

  {
    id: "mathematics-fractions-decimals-percentages",
    title: "Fractions, Decimals and Percentages",
    subject: "Mathematics",
    topic: "Fractions, Decimals and Percentages",
    description:
      "JAMB-aligned flashcards covering fractions, decimals and percentages.",
    cards: FractionsDecimalsPercentagesFlashcards,
  },

  {
    id: "mathematics-ratio-proportion-rates",
    title: "Ratio, Proportion and Rates",
    subject: "Mathematics",
    topic: "Ratio, Proportion and Rates",
    description:
      "JAMB-aligned flashcards covering ratio, proportion and rates.",
    cards: RatioProportionRatesFlashcards,
  },

  {
    id: "mathematics-algebraic-expressions",
    title: "Algebraic Expressions",
    subject: "Mathematics",
    topic: "Algebraic Expressions",
    description:
      "JAMB-aligned flashcards covering algebraic expressions.",
    cards: AlgebraicExpressionsFlashcards,
  },

  {
    id: "mathematics-linear-equations-inequalities",
    title: "Linear Equations and Inequalities",
    subject: "Mathematics",
    topic: "Linear Equations and Inequalities",
    description:
      "JAMB-aligned flashcards covering linear equations and inequalities.",
    cards: LinearEquationsInequalitiesFlashcards,
  },

  {
    id: "mathematics-quadratic-equations",
    title: "Quadratic Equations",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    description:
      "JAMB-aligned flashcards covering quadratic equations.",
    cards: QuadraticEquationsFlashcards,
  },

  {
    id: "mathematics-sequences-series",
    title: "Sequences and Series",
    subject: "Mathematics",
    topic: "Sequences and Series",
    description:
      "JAMB-aligned flashcards covering sequences and series.",
    cards: SequencesSeriesFlashcards,
  },

  {
    id: "mathematics-sets",
    title: "Sets",
    subject: "Mathematics",
    topic: "Sets",
    description:
      "JAMB-aligned flashcards covering sets.",
    cards: SetsFlashcards,
  },

  {
    id: "mathematics-variation",
    title: "Variation",
    subject: "Mathematics",
    topic: "Variation",
    description:
      "JAMB-aligned flashcards covering variation.",
    cards: VariationFlashcards,
  },

  {
    id: "mathematics-surds-indices-logarithms",
    title: "Surds, Indices and Logarithms",
    subject: "Mathematics",
    topic: "Surds, Indices and Logarithms",
    description:
      "JAMB-aligned flashcards covering surds, indices and logarithms.",
    cards: SurdsIndicesLogarithmsFlashcards,
  },

  {
    id: "mathematics-coordinate-geometry",
    title: "Coordinate Geometry",
    subject: "Mathematics",
    topic: "Coordinate Geometry",
    description:
      "JAMB-aligned flashcards covering coordinate geometry.",
    cards: CoordinateGeometryFlashcards,
  },

  {
    id: "mathematics-trigonometry",
    title: "Trigonometry",
    subject: "Mathematics",
    topic: "Trigonometry",
    description:
      "JAMB-aligned flashcards covering trigonometry.",
    cards: TrigonometryFlashcards,
  },

  {
    id: "mathematics-mensuration",
    title: "Mensuration",
    subject: "Mathematics",
    topic: "Mensuration",
    description:
      "JAMB-aligned flashcards covering mensuration.",
    cards: MensurationFlashcards,
  },

  {
    id: "mathematics-statistics",
    title: "Statistics",
    subject: "Mathematics",
    topic: "Statistics",
    description:
      "JAMB-aligned flashcards covering statistics.",
    cards: StatisticsFlashcards,
  },

  {
    id: "mathematics-probability",
    title: "Probability",
    subject: "Mathematics",
    topic: "Probability",
    description:
      "JAMB-aligned flashcards covering probability.",
    cards: ProbabilityFlashcards,
  },

  {
    id: "mathematics-vectors-matrices",
    title: "Vectors and Matrices",
    subject: "Mathematics",
    topic: "Vectors and Matrices",
    description:
      "JAMB-aligned flashcards covering vectors and matrices.",
    cards: VectorsMatricesFlashcards,
  },

  {
    id: "mathematics-functions",
    title: "Functions",
    subject: "Mathematics",
    topic: "Functions",
    description:
      "JAMB-aligned flashcards covering functions.",
    cards: FunctionsFlashcards,
  },

  {
    id: "mathematics-calculus",
    title: "Introductory Calculus",
    subject: "Mathematics",
    topic: "Introductory Calculus",
    description:
      "JAMB-aligned flashcards covering introductory calculus.",
    cards: CalculusFlashcards,
  },

  {
    id: "mathematics-geometry",
    title: "Geometry",
    subject: "Mathematics",
    topic: "Geometry",
    description:
      "JAMB-aligned flashcards covering geometry.",
    cards: GeometryFlashcards,
  },
];

/**
 * All Mathematics cards in topic/deck order.
 */
export const mathematicsFlashcards: Flashcard[] =
  mathematicsFlashcardDecks.flatMap((deck) => deck.cards);

/**
 * Topic metadata used by the Mathematics flashcard browser.
 *
 * cardCount belongs to FlashcardTopic, not FlashcardDeck.
 */
export const mathematicsFlashcardTopics: FlashcardTopic[] =
  mathematicsFlashcardDecks.map((deck) => ({
    id: deck.id,
    name: deck.title,
    subject: deck.subject,
    topic: deck.topic,
    description: deck.description,
    cardCount: deck.cards.length,
  }));

/**
 * Get a Mathematics flashcard deck by its ID.
 */
export function getMathematicsFlashcardDeck(
  deckId: string,
): FlashcardDeck | undefined {
  return mathematicsFlashcardDecks.find(
    (deck) => deck.id === deckId,
  );
}

/**
 * Get all Mathematics flashcards belonging to a topic.
 */
export function getMathematicsFlashcardsByTopic(
  topic: string,
): Flashcard[] {
  const normalized = topic.trim().toLowerCase();

  return mathematicsFlashcards.filter(
    (card) => card.topic.trim().toLowerCase() === normalized,
  );
}

/**
 * Total number of Mathematics flashcards.
 */
export const totalMathematicsFlashcards =
  mathematicsFlashcards.length;

/**
 * Total number of Mathematics flashcard decks/topics.
 */
export const totalMathematicsFlashcardDecks =
  mathematicsFlashcardDecks.length;

export default mathematicsFlashcardDecks;


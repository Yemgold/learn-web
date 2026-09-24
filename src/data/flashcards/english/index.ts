




import type {
  Flashcard,
  FlashcardDeck,
  FlashcardTopic,
} from "@/types/flashcard";

import PartsOfSpeechFlashcards from "./parts-of-speech";
import NounsPronounsFlashcards from "./nouns-pronouns";
import VerbsTensesFlashcards from "./verbs-tenses";
import SubjectVerbAgreementFlashcards from "./subject-verb-agreement";
import ArticlesDeterminersFlashcards from "./articles-determiners";
import PrepositionsFlashcards from "./prepositions";
import ConjunctionsConnectorsFlashcards from "./conjunctions-connectors";
import SentenceStructureFlashcards from "./sentence-structure";
import QuestionTagsFlashcards from "./question-tags";
import ReportedSpeechFlashcards from "./reported-speech";
import ActivePassiveFlashcards from "./active-passive";
import VocabularySynonymsAntonymsFlashcards from "./vocabulary-synonyms-antonyms";
import IdiomsFlashcards from "./idioms";
import WordMeaningContextFlashcards from "./word-meaning-context";
import ComprehensionSkillsFlashcards from "./comprehension-skills";
import LexisStructureFlashcards from "./lexis-structure";
import PunctuationFlashcards from "./punctuation";
import OralEnglishFlashcards from "./oral-english";
import FiguresOfSpeechFlashcards from "./figures-of-speech";
import CommonErrorsFlashcards from "./common-errors";

/**
 * English flashcard decks.
 *
 * Each topic is represented as a FlashcardDeck.
 * The cards themselves are the source of truth for card counts.
 */
export const englishFlashcardDecks: FlashcardDeck[] = [
  {
    id: "english-parts-of-speech",
    title: "Parts of Speech",
    subject: "English",
    topic: "Parts of Speech",
    description:
      "Identify and understand the major grammatical classes used in English.",
    cards: PartsOfSpeechFlashcards,
  },

  {
    id: "english-nouns-pronouns",
    title: "Nouns and Pronouns",
    subject: "English",
    topic: "Nouns and Pronouns",
    description:
      "Use nouns and pronouns correctly in context.",
    cards: NounsPronounsFlashcards,
  },

  {
    id: "english-verbs-tenses",
    title: "Verbs and Tenses",
    subject: "English",
    topic: "Verbs and Tenses",
    description:
      "Understand tense, aspect, auxiliary verbs, and correct verb forms.",
    cards: VerbsTensesFlashcards,
  },

  {
    id: "english-subject-verb-agreement",
    title: "Subject-Verb Agreement",
    subject: "English",
    topic: "Subject-Verb Agreement",
    description:
      "Apply agreement rules in sentences and examination questions.",
    cards: SubjectVerbAgreementFlashcards,
  },

  {
    id: "english-articles-determiners",
    title: "Articles and Determiners",
    subject: "English",
    topic: "Articles and Determiners",
    description:
      "Use a, an, the, and other determiners appropriately.",
    cards: ArticlesDeterminersFlashcards,
  },

  {
    id: "english-prepositions",
    title: "Prepositions",
    subject: "English",
    topic: "Prepositions",
    description:
      "Master common prepositions of time, place, movement, and relationship.",
    cards: PrepositionsFlashcards,
  },

  {
    id: "english-conjunctions-connectors",
    title: "Conjunctions and Connectors",
    subject: "English",
    topic: "Conjunctions and Connectors",
    description:
      "Use coordinating, subordinating, and linking expressions.",
    cards: ConjunctionsConnectorsFlashcards,
  },

  {
    id: "english-sentence-structure",
    title: "Sentence Structure",
    subject: "English",
    topic: "Sentence Structure",
    description:
      "Recognize sentence elements, clauses, and common structural errors.",
    cards: SentenceStructureFlashcards,
  },

  {
    id: "english-question-tags",
    title: "Question Tags",
    subject: "English",
    topic: "Question Tags",
    description:
      "Form and use question tags correctly.",
    cards: QuestionTagsFlashcards,
  },

  {
    id: "english-reported-speech",
    title: "Direct and Reported Speech",
    subject: "English",
    topic: "Direct and Reported Speech",
    description:
      "Convert between direct and indirect/reported speech.",
    cards: ReportedSpeechFlashcards,
  },

  {
    id: "english-active-passive",
    title: "Active and Passive Voice",
    subject: "English",
    topic: "Active and Passive Voice",
    description:
      "Identify and transform active and passive constructions.",
    cards: ActivePassiveFlashcards,
  },

  {
    id: "english-vocabulary-synonyms-antonyms",
    title: "Vocabulary, Synonyms and Antonyms",
    subject: "English",
    topic: "Vocabulary, Synonyms and Antonyms",
    description:
      "Build vocabulary and distinguish similar and opposite meanings.",
    cards: VocabularySynonymsAntonymsFlashcards,
  },

  {
    id: "english-idioms",
    title: "Idioms and Expressions",
    subject: "English",
    topic: "Idioms and Expressions",
    description:
      "Understand common idiomatic expressions used in English.",
    cards: IdiomsFlashcards,
  },

  {
    id: "english-word-meaning-context",
    title: "Word Meaning in Context",
    subject: "English",
    topic: "Word Meaning in Context",
    description:
      "Infer meaning from context and distinguish literal from contextual usage.",
    cards: WordMeaningContextFlashcards,
  },

  {
    id: "english-comprehension-skills",
    title: "Comprehension Skills",
    subject: "English",
    topic: "Comprehension Skills",
    description:
      "Develop skills for answering passage-based questions accurately.",
    cards: ComprehensionSkillsFlashcards,
  },

  {
    id: "english-lexis-structure",
    title: "Lexis and Structure",
    subject: "English",
    topic: "Lexis and Structure",
    description:
      "Handle vocabulary, collocation, grammar, and sentence-completion questions.",
    cards: LexisStructureFlashcards,
  },

  {
    id: "english-punctuation",
    title: "Punctuation",
    subject: "English",
    topic: "Punctuation",
    description:
      "Use punctuation marks to clarify meaning and structure.",
    cards: PunctuationFlashcards,
  },

  {
    id: "english-oral-english",
    title: "Oral English",
    subject: "English",
    topic: "Oral English",
    description:
      "Study sounds, stress, intonation, and common pronunciation distinctions tested in English.",
    cards: OralEnglishFlashcards,
  },

  {
    id: "english-figures-of-speech",
    title: "Figures of Speech",
    subject: "English",
    topic: "Figures of Speech",
    description:
      "Recognize common literary and rhetorical devices used in English passages.",
    cards: FiguresOfSpeechFlashcards,
  },

  {
    id: "english-common-errors",
    title: "Common Errors",
    subject: "English",
    topic: "Common Errors",
    description:
      "Identify frequent errors in grammar, usage, spelling, and sentence construction.",
    cards: CommonErrorsFlashcards,
  },
];

/**
 * All English flashcards in topic order.
 */
export const englishFlashcards: Flashcard[] =
  englishFlashcardDecks.flatMap((deck) => deck.cards);

/**
 * Topic metadata used by the English flashcard browser.
 *
 * cardCount is calculated from the actual cards in each deck.
 */
export const englishFlashcardTopics: FlashcardTopic[] =
  englishFlashcardDecks.map((deck) => ({
    id: deck.id,
    name: deck.title,
    subject: deck.subject,
    topic: deck.topic,
    description: deck.description,
    cardCount: deck.cards.length,
  }));

/**
 * Get an English flashcard deck by its ID.
 */
export function getEnglishFlashcardDeck(
  deckId: string,
): FlashcardDeck | undefined {
  return englishFlashcardDecks.find(
    (deck) => deck.id === deckId,
  );
}

/**
 * Get all English flashcards belonging to a topic.
 */
export function getEnglishFlashcardsByTopic(
  topic: string,
): Flashcard[] {
  const normalized = topic.trim().toLowerCase();

  return englishFlashcards.filter(
    (card) => card.topic.trim().toLowerCase() === normalized,
  );
}

/**
 * Total number of English flashcards.
 */
export const totalEnglishFlashcards =
  englishFlashcards.length;

/**
 * Total number of English flashcard decks.
 */
export const totalEnglishFlashcardDecks =
  englishFlashcardDecks.length;

export default englishFlashcardDecks;
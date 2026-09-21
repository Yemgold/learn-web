// C:\Users\Lara Spellman\Jamb\jamb-league\src\data\flashcards\biology\index.ts

import type {
  Flashcard,
  FlashcardDeck,
  FlashcardTopic,
} from "@/types/flashcard";

import LivingOrganismsFlashcards from "./living-organisms";
import EvolutionAmongOrganismsFlashcards from "./evolution-among-organisms";
import AdaptationsFlashcards from "./adaptations";
import InternalStructureFlashcards from "./internal-structure";
import NutritionFlashcards from "./nutrition";
import TransportFlashcards from "./transport";
import RespirationFlashcards from "./respiration";
import ExcretionFlashcards from "./excretion";
import SupportMovementFlashcards from "./support-movement";
import ReproductionFlashcards from "./reproduction";
import GrowthFlashcards from "./growth";
import CoordinationFlashcards from "./coordination";
import FactorsDistributionFlashcards from "./factors-distribution";
import SymbioticInteractionsFlashcards from "./symbiotic-interactions";
import NaturalHabitatsFlashcards from "./natural-habitats";
import LocalBiomesFlashcards from "./local-biomes";
import EcologyPopulationsFlashcards from "./ecology-populations";
import SoilFlashcards from "./soil";
import HumansEnvironmentFlashcards from "./humans-environment";
import VariationPopulationFlashcards from "./variation-population";
import HeredityFlashcards from "./heredity";
import TheoriesEvolutionFlashcards from "./theories-evolution";
import EvidenceEvolutionFlashcards from "./evidence-evolution";
import PracticalBiologyFlashcards from "./practical-biology";

export const biologyFlashcardDecks: FlashcardDeck[] = [
  {
    id: "biology-living-organisms",
    title: "Living Organisms",
    subject: "Biology",
    topic: "Living Organisms",
    description: "Biology flashcards covering living organisms for JAMB and WAEC preparation.",
    cards: LivingOrganismsFlashcards,
  },
  {
    id: "biology-evolution-among-organisms",
    title: "Evolution Among Organisms",
    subject: "Biology",
    topic: "Evolution Among Organisms",
    description: "Biology flashcards covering evolution among organisms for JAMB and WAEC preparation.",
    cards: EvolutionAmongOrganismsFlashcards,
  },
  {
    id: "biology-adaptations",
    title: "Variety of Organisms (Adaptations)",
    subject: "Biology",
    topic: "Variety of Organisms (Adaptations)",
    description: "Biology flashcards covering variety of organisms (adaptations) for JAMB and WAEC preparation.",
    cards: AdaptationsFlashcards,
  },
  {
    id: "biology-internal-structure",
    title: "Internal Structure of a Flowering Plant and a Mammal",
    subject: "Biology",
    topic: "Internal Structure of a Flowering Plant and a Mammal",
    description: "Biology flashcards covering internal structure of a flowering plant and a mammal for JAMB and WAEC preparation.",
    cards: InternalStructureFlashcards,
  },
  {
    id: "biology-nutrition",
    title: "Nutrition",
    subject: "Biology",
    topic: "Nutrition",
    description: "Biology flashcards covering nutrition for JAMB and WAEC preparation.",
    cards: NutritionFlashcards,
  },
  {
    id: "biology-transport",
    title: "Transport",
    subject: "Biology",
    topic: "Transport",
    description: "Biology flashcards covering transport for JAMB and WAEC preparation.",
    cards: TransportFlashcards,
  },
  {
    id: "biology-respiration",
    title: "Respiration",
    subject: "Biology",
    topic: "Respiration",
    description: "Biology flashcards covering respiration for JAMB and WAEC preparation.",
    cards: RespirationFlashcards,
  },
  {
    id: "biology-excretion",
    title: "Excretion",
    subject: "Biology",
    topic: "Excretion",
    description: "Biology flashcards covering excretion for JAMB and WAEC preparation.",
    cards: ExcretionFlashcards,
  },
  {
    id: "biology-support-movement",
    title: "Support and Movement",
    subject: "Biology",
    topic: "Support and Movement",
    description: "Biology flashcards covering support and movement for JAMB and WAEC preparation.",
    cards: SupportMovementFlashcards,
  },
  {
    id: "biology-reproduction",
    title: "Reproduction",
    subject: "Biology",
    topic: "Reproduction",
    description: "Biology flashcards covering reproduction for JAMB and WAEC preparation.",
    cards: ReproductionFlashcards,
  },
  {
    id: "biology-growth",
    title: "Growth",
    subject: "Biology",
    topic: "Growth",
    description: "Biology flashcards covering growth for JAMB and WAEC preparation.",
    cards: GrowthFlashcards,
  },
  {
    id: "biology-coordination",
    title: "Coordination and Control",
    subject: "Biology",
    topic: "Coordination and Control",
    description: "Biology flashcards covering coordination and control for JAMB and WAEC preparation.",
    cards: CoordinationFlashcards,
  },
  {
    id: "biology-factors-distribution",
    title: "Factors Affecting the Distribution of Organisms",
    subject: "Biology",
    topic: "Factors Affecting the Distribution of Organisms",
    description: "Biology flashcards covering factors affecting the distribution of organisms for JAMB and WAEC preparation.",
    cards: FactorsDistributionFlashcards,
  },
  {
    id: "biology-symbiotic-interactions",
    title: "Symbiotic Interactions of Plants and Animals",
    subject: "Biology",
    topic: "Symbiotic Interactions of Plants and Animals",
    description: "Biology flashcards covering symbiotic interactions of plants and animals for JAMB and WAEC preparation.",
    cards: SymbioticInteractionsFlashcards,
  },
  {
    id: "biology-natural-habitats",
    title: "Natural Habitats",
    subject: "Biology",
    topic: "Natural Habitats",
    description: "Biology flashcards covering natural habitats for JAMB and WAEC preparation.",
    cards: NaturalHabitatsFlashcards,
  },
  {
    id: "biology-local-biomes",
    title: "Local (Nigerian) Biomes",
    subject: "Biology",
    topic: "Local (Nigerian) Biomes",
    description: "Biology flashcards covering local (nigerian) biomes for JAMB and WAEC preparation.",
    cards: LocalBiomesFlashcards,
  },
  {
    id: "biology-ecology-populations",
    title: "Ecology of Populations",
    subject: "Biology",
    topic: "Ecology of Populations",
    description: "Biology flashcards covering ecology of populations for JAMB and WAEC preparation.",
    cards: EcologyPopulationsFlashcards,
  },
  {
    id: "biology-soil",
    title: "Soil",
    subject: "Biology",
    topic: "Soil",
    description: "Biology flashcards covering soil for JAMB and WAEC preparation.",
    cards: SoilFlashcards,
  },
  {
    id: "biology-humans-environment",
    title: "Humans and Environment",
    subject: "Biology",
    topic: "Humans and Environment",
    description: "Biology flashcards covering humans and environment for JAMB and WAEC preparation.",
    cards: HumansEnvironmentFlashcards,
  },
  {
    id: "biology-variation-population",
    title: "Variation in Population",
    subject: "Biology",
    topic: "Variation in Population",
    description: "Biology flashcards covering variation in population for JAMB and WAEC preparation.",
    cards: VariationPopulationFlashcards,
  },
  {
    id: "biology-heredity",
    title: "Heredity",
    subject: "Biology",
    topic: "Heredity",
    description: "Biology flashcards covering heredity for JAMB and WAEC preparation.",
    cards: HeredityFlashcards,
  },
  {
    id: "biology-theories-evolution",
    title: "Theories of Evolution",
    subject: "Biology",
    topic: "Theories of Evolution",
    description: "Biology flashcards covering theories of evolution for JAMB and WAEC preparation.",
    cards: TheoriesEvolutionFlashcards,
  },
  {
    id: "biology-evidence-evolution",
    title: "Evidence of Evolution",
    subject: "Biology",
    topic: "Evidence of Evolution",
    description: "Biology flashcards covering evidence of evolution for JAMB and WAEC preparation.",
    cards: EvidenceEvolutionFlashcards,
  },
  {
    id: "biology-practical-biology",
    title: "Practical Biology (Supplementary)",
    subject: "Biology",
    topic: "Practical Biology (Supplementary)",
    description: "Biology flashcards covering practical biology (supplementary) for JAMB and WAEC preparation.",
    cards: PracticalBiologyFlashcards,
  },
];

export const biologyFlashcardTopics: FlashcardTopic[] =
  biologyFlashcardDecks.map((deck) => ({
    id: deck.id,
    name: deck.title,
    subject: deck.subject,
    description: deck.description,
    cardCount: deck.cards.length,
    image: deck.image,
    deck,
  }));

export const biologyFlashcards: Flashcard[] =
  biologyFlashcardDecks.flatMap((deck) => deck.cards);

export function getBiologyFlashcardDeck(
  deckId: string,
): FlashcardDeck | undefined {
  return biologyFlashcardDecks.find((deck) => deck.id === deckId);
}

export function getBiologyFlashcardsByTopic(
  topic: string,
): Flashcard[] {
  return biologyFlashcards.filter(
    (card) => card.topic.toLowerCase() === topic.toLowerCase(),
  );
}

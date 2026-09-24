




import type {
  Flashcard,
  FlashcardDeck,
  FlashcardTopic,
} from "@/types/flashcard";

import MeasurementsAndUnitsFlashcards from "./measurements-and-units";
import MotionFlashcards from "./motion";
import ForcesAndEquilibriumFlashcards from "./forces-and-equilibrium";
import WorkEnergyAndPowerFlashcards from "./work-energy-and-power";
import SimpleMachinesFlashcards from "./simple-machines";
import GravitationFlashcards from "./gravitation";
import PropertiesOfMatterFlashcards from "./properties-of-matter";
import HeatAndTemperatureFlashcards from "./heat-and-temperature";
import WavesFlashcards from "./waves";
import SoundFlashcards from "./sound";
import LightAndOpticsFlashcards from "./light-and-optics";
import ElectricityFlashcards from "./electricity";
import ElectromagnetismFlashcards from "./electromagnetism";
import AtomicAndNuclearPhysicsFlashcards from "./atomic-and-nuclear-physics";
import ElectronicsFlashcards from "./electronics";
import FluidMechanicsFlashcards from "./fluid-mechanics";
import ThermalExpansionFlashcards from "./thermal-expansion";
import RadioactivityApplicationsFlashcards from "./radioactivity-applications";

/**
 * Physics flashcard decks.
 *
 * Each topic is represented as a FlashcardDeck.
 * The cards themselves remain the source of truth for card counts.
 */
export const physicsFlashcardDecks: FlashcardDeck[] = [
  {
    id: "physics-measurements-and-units",
    title: "Measurements and Units",
    subject: "Physics",
    topic: "Measurements and Units",
    description:
      "JAMB-aligned Physics flashcards covering measurements and units.",
    cards: MeasurementsAndUnitsFlashcards,
  },

  {
    id: "physics-motion",
    title: "Motion",
    subject: "Physics",
    topic: "Motion",
    description: "JAMB-aligned Physics flashcards covering motion.",
    cards: MotionFlashcards,
  },

  {
    id: "physics-forces-and-equilibrium",
    title: "Forces and Equilibrium",
    subject: "Physics",
    topic: "Forces and Equilibrium",
    description:
      "JAMB-aligned Physics flashcards covering forces and equilibrium.",
    cards: ForcesAndEquilibriumFlashcards,
  },

  {
    id: "physics-work-energy-and-power",
    title: "Work, Energy and Power",
    subject: "Physics",
    topic: "Work, Energy and Power",
    description:
      "JAMB-aligned Physics flashcards covering work, energy and power.",
    cards: WorkEnergyAndPowerFlashcards,
  },

  {
    id: "physics-simple-machines",
    title: "Simple Machines",
    subject: "Physics",
    topic: "Simple Machines",
    description:
      "JAMB-aligned Physics flashcards covering simple machines.",
    cards: SimpleMachinesFlashcards,
  },

  {
    id: "physics-gravitation",
    title: "Gravitation",
    subject: "Physics",
    topic: "Gravitation",
    description:
      "JAMB-aligned Physics flashcards covering gravitation.",
    cards: GravitationFlashcards,
  },

  {
    id: "physics-properties-of-matter",
    title: "Properties of Matter",
    subject: "Physics",
    topic: "Properties of Matter",
    description:
      "JAMB-aligned Physics flashcards covering properties of matter.",
    cards: PropertiesOfMatterFlashcards,
  },

  {
    id: "physics-heat-and-temperature",
    title: "Heat and Temperature",
    subject: "Physics",
    topic: "Heat and Temperature",
    description:
      "JAMB-aligned Physics flashcards covering heat and temperature.",
    cards: HeatAndTemperatureFlashcards,
  },

  {
    id: "physics-waves",
    title: "Waves",
    subject: "Physics",
    topic: "Waves",
    description: "JAMB-aligned Physics flashcards covering waves.",
    cards: WavesFlashcards,
  },

  {
    id: "physics-sound",
    title: "Sound",
    subject: "Physics",
    topic: "Sound",
    description: "JAMB-aligned Physics flashcards covering sound.",
    cards: SoundFlashcards,
  },

  {
    id: "physics-light-and-optics",
    title: "Light and Optics",
    subject: "Physics",
    topic: "Light and Optics",
    description:
      "JAMB-aligned Physics flashcards covering light and optics.",
    cards: LightAndOpticsFlashcards,
  },

  {
    id: "physics-electricity",
    title: "Electricity",
    subject: "Physics",
    topic: "Electricity",
    description:
      "JAMB-aligned Physics flashcards covering electricity.",
    cards: ElectricityFlashcards,
  },

  {
    id: "physics-electromagnetism",
    title: "Electromagnetism",
    subject: "Physics",
    topic: "Electromagnetism",
    description:
      "JAMB-aligned Physics flashcards covering electromagnetism.",
    cards: ElectromagnetismFlashcards,
  },

  {
    id: "physics-atomic-and-nuclear-physics",
    title: "Atomic and Nuclear Physics",
    subject: "Physics",
    topic: "Atomic and Nuclear Physics",
    description:
      "JAMB-aligned Physics flashcards covering atomic and nuclear physics.",
    cards: AtomicAndNuclearPhysicsFlashcards,
  },

  {
    id: "physics-electronics",
    title: "Electronics",
    subject: "Physics",
    topic: "Electronics",
    description:
      "JAMB-aligned Physics flashcards covering electronics.",
    cards: ElectronicsFlashcards,
  },

  {
    id: "physics-fluid-mechanics",
    title: "Fluid Mechanics",
    subject: "Physics",
    topic: "Fluid Mechanics",
    description:
      "JAMB-aligned Physics flashcards covering fluid mechanics.",
    cards: FluidMechanicsFlashcards,
  },

  {
    id: "physics-thermal-expansion",
    title: "Thermal Expansion",
    subject: "Physics",
    topic: "Thermal Expansion",
    description:
      "JAMB-aligned Physics flashcards covering thermal expansion.",
    cards: ThermalExpansionFlashcards,
  },

  {
    id: "physics-radioactivity-applications",
    title: "Radioactivity and Applications",
    subject: "Physics",
    topic: "Radioactivity and Applications",
    description:
      "JAMB-aligned Physics flashcards covering radioactivity and applications.",
    cards: RadioactivityApplicationsFlashcards,
  },
];

/**
 * All Physics flashcards in topic order.
 */
export const physicsFlashcards: Flashcard[] =
  physicsFlashcardDecks.flatMap((deck) => deck.cards);

/**
 * Topic metadata used by the Physics flashcard browser.
 *
 * cardCount is calculated from the actual cards in each deck.
 */
export const physicsFlashcardTopics: FlashcardTopic[] =
  physicsFlashcardDecks.map((deck) => ({
    id: deck.id,
    name: deck.title,
    subject: deck.subject,
    topic: deck.topic,
    description: deck.description,
    cardCount: deck.cards.length,
  }));

/**
 * Get a Physics flashcard deck by its ID.
 */
export function getPhysicsFlashcardDeck(
  deckId: string,
): FlashcardDeck | undefined {
  return physicsFlashcardDecks.find(
    (deck) => deck.id === deckId,
  );
}

/**
 * Get all Physics flashcards belonging to a topic.
 */
export function getPhysicsFlashcardsByTopic(
  topic: string,
): Flashcard[] {
  const normalized = topic.trim().toLowerCase();

  return physicsFlashcards.filter(
    (card) => card.topic.trim().toLowerCase() === normalized,
  );
}

/**
 * Total number of Physics flashcards.
 */
export const totalPhysicsFlashcards =
  physicsFlashcards.length;

/**
 * Total number of Physics flashcard decks.
 */
export const totalPhysicsFlashcardDecks =
  physicsFlashcardDecks.length;

export default physicsFlashcardDecks;


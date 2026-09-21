import type { Flashcard, FlashcardDeck, FlashcardTopic } from "@/types/flashcard";

import MatterFlashcards from "./matter";
import AtomicStructureFlashcards from "./atomic-structure";
import PeriodicTableFlashcards from "./periodic-table";
import ChemicalBondingFlashcards from "./chemical-bonding";
import ChemicalFormulaeFlashcards from "./chemical-formulae";
import StoichiometryFlashcards from "./stoichiometry";
import MoleConceptFlashcards from "./mole-concept";
import GasLawsFlashcards from "./gas-laws";
import KineticTheoryFlashcards from "./kinetic-theory";
import SolutionsFlashcards from "./solutions";
import AcidsBasesSaltsFlashcards from "./acids-bases-salts";
import WaterFlashcards from "./water";
import SolubilityFlashcards from "./solubility";
import SeparationTechniquesFlashcards from "./separation-techniques";
import ChemicalEnergyFlashcards from "./chemical-energy";
import ReactionRatesFlashcards from "./reaction-rates";
import ChemicalEquilibriumFlashcards from "./chemical-equilibrium";
import RedoxReactionsFlashcards from "./redox-reactions";
import ElectrochemistryFlashcards from "./electrochemistry";
import ElectrolysisFlashcards from "./electrolysis";
import OrganicChemistryFlashcards from "./organic-chemistry";
import HydrocarbonsFlashcards from "./hydrocarbons";
import FunctionalGroupsFlashcards from "./functional-groups";
import PolymersFlashcards from "./polymers";
import ChemistryAndEnvironmentFlashcards from "./chemistry-and-environment";
import MetalsFlashcards from "./metals";
import NonMetalsFlashcards from "./non-metals";
import IndustrialChemistryFlashcards from "./industrial-chemistry";
import PracticalChemistryFlashcards from "./practical-chemistry";

/**
 * Chemistry flashcard decks.
 *
 * 29 topic decks × 15 cards each = 435 flashcards.
 */
export const chemistryFlashcardDecks: FlashcardDeck[] = [
  {
    id: "chemistry-matter",
    title: "Matter",
    subject: "Chemistry",
    topic: "Matter",
    description: "JAMB-focused Chemistry flashcards covering matter concepts.",
    cards: MatterFlashcards,
  },
  {
    id: "chemistry-atomic-structure",
    title: "Atomic Structure",
    subject: "Chemistry",
    topic: "Atomic Structure",
    description: "JAMB-focused Chemistry flashcards covering atomic structure concepts.",
    cards: AtomicStructureFlashcards,
  },
  {
    id: "chemistry-periodic-table",
    title: "Periodic Table",
    subject: "Chemistry",
    topic: "Periodic Table",
    description: "JAMB-focused Chemistry flashcards covering periodic table concepts.",
    cards: PeriodicTableFlashcards,
  },
  {
    id: "chemistry-chemical-bonding",
    title: "Chemical Bonding",
    subject: "Chemistry",
    topic: "Chemical Bonding",
    description: "JAMB-focused Chemistry flashcards covering chemical bonding concepts.",
    cards: ChemicalBondingFlashcards,
  },
  {
    id: "chemistry-chemical-formulae",
    title: "Chemical Formulae",
    subject: "Chemistry",
    topic: "Chemical Formulae",
    description: "JAMB-focused Chemistry flashcards covering chemical formulae concepts.",
    cards: ChemicalFormulaeFlashcards,
  },
  {
    id: "chemistry-stoichiometry",
    title: "Stoichiometry",
    subject: "Chemistry",
    topic: "Stoichiometry",
    description: "JAMB-focused Chemistry flashcards covering stoichiometry concepts.",
    cards: StoichiometryFlashcards,
  },
  {
    id: "chemistry-mole-concept",
    title: "Mole Concept",
    subject: "Chemistry",
    topic: "Mole Concept",
    description: "JAMB-focused Chemistry flashcards covering mole concept concepts.",
    cards: MoleConceptFlashcards,
  },
  {
    id: "chemistry-gas-laws",
    title: "Gas Laws",
    subject: "Chemistry",
    topic: "Gas Laws",
    description: "JAMB-focused Chemistry flashcards covering gas laws concepts.",
    cards: GasLawsFlashcards,
  },
  {
    id: "chemistry-kinetic-theory",
    title: "Kinetic Theory",
    subject: "Chemistry",
    topic: "Kinetic Theory",
    description: "JAMB-focused Chemistry flashcards covering kinetic theory concepts.",
    cards: KineticTheoryFlashcards,
  },
  {
    id: "chemistry-solutions",
    title: "Solutions",
    subject: "Chemistry",
    topic: "Solutions",
    description: "JAMB-focused Chemistry flashcards covering solutions concepts.",
    cards: SolutionsFlashcards,
  },
  {
    id: "chemistry-acids-bases-salts",
    title: "Acids, Bases and Salts",
    subject: "Chemistry",
    topic: "Acids, Bases and Salts",
    description: "JAMB-focused Chemistry flashcards covering acids, bases and salts concepts.",
    cards: AcidsBasesSaltsFlashcards,
  },
  {
    id: "chemistry-water",
    title: "Water",
    subject: "Chemistry",
    topic: "Water",
    description: "JAMB-focused Chemistry flashcards covering water concepts.",
    cards: WaterFlashcards,
  },
  {
    id: "chemistry-solubility",
    title: "Solubility",
    subject: "Chemistry",
    topic: "Solubility",
    description: "JAMB-focused Chemistry flashcards covering solubility concepts.",
    cards: SolubilityFlashcards,
  },
  {
    id: "chemistry-separation-techniques",
    title: "Separation Techniques",
    subject: "Chemistry",
    topic: "Separation Techniques",
    description: "JAMB-focused Chemistry flashcards covering separation techniques concepts.",
    cards: SeparationTechniquesFlashcards,
  },
  {
    id: "chemistry-chemical-energy",
    title: "Chemical Energy",
    subject: "Chemistry",
    topic: "Chemical Energy",
    description: "JAMB-focused Chemistry flashcards covering chemical energy concepts.",
    cards: ChemicalEnergyFlashcards,
  },
  {
    id: "chemistry-reaction-rates",
    title: "Reaction Rates",
    subject: "Chemistry",
    topic: "Reaction Rates",
    description: "JAMB-focused Chemistry flashcards covering reaction rates concepts.",
    cards: ReactionRatesFlashcards,
  },
  {
    id: "chemistry-chemical-equilibrium",
    title: "Chemical Equilibrium",
    subject: "Chemistry",
    topic: "Chemical Equilibrium",
    description: "JAMB-focused Chemistry flashcards covering chemical equilibrium concepts.",
    cards: ChemicalEquilibriumFlashcards,
  },
  {
    id: "chemistry-redox-reactions",
    title: "Redox Reactions",
    subject: "Chemistry",
    topic: "Redox Reactions",
    description: "JAMB-focused Chemistry flashcards covering redox reactions concepts.",
    cards: RedoxReactionsFlashcards,
  },
  {
    id: "chemistry-electrochemistry",
    title: "Electrochemistry",
    subject: "Chemistry",
    topic: "Electrochemistry",
    description: "JAMB-focused Chemistry flashcards covering electrochemistry concepts.",
    cards: ElectrochemistryFlashcards,
  },
  {
    id: "chemistry-electrolysis",
    title: "Electrolysis",
    subject: "Chemistry",
    topic: "Electrolysis",
    description: "JAMB-focused Chemistry flashcards covering electrolysis concepts.",
    cards: ElectrolysisFlashcards,
  },
  {
    id: "chemistry-organic-chemistry",
    title: "Organic Chemistry",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    description: "JAMB-focused Chemistry flashcards covering organic chemistry concepts.",
    cards: OrganicChemistryFlashcards,
  },
  {
    id: "chemistry-hydrocarbons",
    title: "Hydrocarbons",
    subject: "Chemistry",
    topic: "Hydrocarbons",
    description: "JAMB-focused Chemistry flashcards covering hydrocarbons concepts.",
    cards: HydrocarbonsFlashcards,
  },
  {
    id: "chemistry-functional-groups",
    title: "Functional Groups",
    subject: "Chemistry",
    topic: "Functional Groups",
    description: "JAMB-focused Chemistry flashcards covering functional groups concepts.",
    cards: FunctionalGroupsFlashcards,
  },
  {
    id: "chemistry-polymers",
    title: "Polymers",
    subject: "Chemistry",
    topic: "Polymers",
    description: "JAMB-focused Chemistry flashcards covering polymers concepts.",
    cards: PolymersFlashcards,
  },
  {
    id: "chemistry-chemistry-and-environment",
    title: "Chemistry and Environment",
    subject: "Chemistry",
    topic: "Chemistry and Environment",
    description: "JAMB-focused Chemistry flashcards covering chemistry and environment concepts.",
    cards: ChemistryAndEnvironmentFlashcards,
  },
  {
    id: "chemistry-metals",
    title: "Metals",
    subject: "Chemistry",
    topic: "Metals",
    description: "JAMB-focused Chemistry flashcards covering metals concepts.",
    cards: MetalsFlashcards,
  },
  {
    id: "chemistry-non-metals",
    title: "Non-metals",
    subject: "Chemistry",
    topic: "Non-metals",
    description: "JAMB-focused Chemistry flashcards covering non-metals concepts.",
    cards: NonMetalsFlashcards,
  },
  {
    id: "chemistry-industrial-chemistry",
    title: "Industrial Chemistry",
    subject: "Chemistry",
    topic: "Industrial Chemistry",
    description: "JAMB-focused Chemistry flashcards covering industrial chemistry concepts.",
    cards: IndustrialChemistryFlashcards,
  },
  {
    id: "chemistry-practical-chemistry",
    title: "Practical Chemistry",
    subject: "Chemistry",
    topic: "Practical Chemistry",
    description: "JAMB-focused Chemistry flashcards covering practical chemistry concepts.",
    cards: PracticalChemistryFlashcards,
  },
];

/** All Chemistry cards in topic order. */
export const chemistryFlashcards: Flashcard[] =
  chemistryFlashcardDecks.flatMap((deck) => deck.cards);

/** Topic metadata used by the Chemistry flashcard browser. */
export const chemistryFlashcardTopics: FlashcardTopic[] =
  chemistryFlashcardDecks.map((deck) => ({
    id: deck.id,
    name: deck.title,
    subject: deck.subject,
    topic: deck.topic,
    description: deck.description,
    cardCount: deck.cards.length,
  }));

export function getChemistryFlashcardDeck(
  deckId: string,
): FlashcardDeck | undefined {
  return chemistryFlashcardDecks.find((deck) => deck.id === deckId);
}

export function getChemistryFlashcardsByTopic(
  topic: string,
): Flashcard[] {
  const normalized = topic.trim().toLowerCase();

  return chemistryFlashcards.filter(
    (card) => card.topic.trim().toLowerCase() === normalized,
  );
}

export default chemistryFlashcardDecks;

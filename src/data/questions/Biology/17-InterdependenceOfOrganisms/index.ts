


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — INTERDEPENDENCE OF ORGANISMS                                     */
/* -------------------------------------------------------------------------- */

export const interdependenceOfOrganismsQuestions: ArenaQuestion[] = [
  {
    id: "biology-interdependence-001",

    question:
      "Which of the following relationships between organisms is an example of mutualism?",

    options: [
      {
        id: "A",
        text: "Tapeworm living in the intestine of a human",
      },
      {
        id: "B",
        text: "Bee obtaining nectar from a flower while pollinating it",
      },
      {
        id: "C",
        text: "Lion feeding on a gazelle",
      },
      {
        id: "D",
        text: "Fungus growing on a dead tree",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Mutualism is a relationship in which both organisms benefit from the association.",

      steps: [
        "The bee obtains nectar from the flower as a source of food.",
        "While visiting the flower, the bee carries pollen from one flower to another.",
        "The flower benefits from the pollination process.",
        "Therefore, both the bee and the flowering plant benefit.",
        "Hence, the correct answer is a bee obtaining nectar while pollinating a flower.",
      ],
    },
  },

  {
    id: "biology-interdependence-002",

    question:
      "Which of the following is an example of parasitism?",

    options: [
      {
        id: "A",
        text: "Lichen consisting of an alga and a fungus",
      },
      {
        id: "B",
        text: "Tapeworm living in the intestine of a human",
      },
      {
        id: "C",
        text: "Bee pollinating a flower",
      },
      {
        id: "D",
        text: "Cattle grazing on grass",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Parasitism occurs when one organism benefits while the other organism is harmed.",

      steps: [
        "A tapeworm lives inside the intestine of its host.",
        "The tapeworm obtains nutrients from the host.",
        "The host may suffer loss of nutrients and other harmful effects.",
        "Therefore, the tapeworm benefits while the human host is harmed.",
        "Hence, the relationship is parasitism.",
      ],
    },
  },

  {
    id: "biology-interdependence-003",

    question:
      "What type of relationship exists between a lion and a gazelle when the lion kills and eats the gazelle?",

    options: [
      {
        id: "A",
        text: "Mutualism",
      },
      {
        id: "B",
        text: "Commensalism",
      },
      {
        id: "C",
        text: "Predation",
      },
      {
        id: "D",
        text: "Parasitism",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Predation is a relationship in which one organism captures and feeds on another organism.",

      steps: [
        "The lion is the predator.",
        "The gazelle is the prey.",
        "The lion captures and eats the gazelle.",
        "The lion benefits by obtaining food.",
        "The gazelle is harmed and killed.",
        "Therefore, the relationship is predation.",
      ],
    },
  },

  {
    id: "biology-interdependence-004",

    question:
      "Which of the following organisms is most likely to be described as a decomposer?",

    options: [
      {
        id: "A",
        text: "Grass",
      },
      {
        id: "B",
        text: "Goat",
      },
      {
        id: "C",
        text: "Fungus",
      },
      {
        id: "D",
        text: "Hawk",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Decomposers obtain nutrients by breaking down dead organic matter.",

      steps: [
        "Fungi obtain nutrients from dead and decaying organic material.",
        "They release enzymes that break down complex organic substances.",
        "The resulting simpler substances can be absorbed by the fungi.",
        "Grass is a producer, while goats and hawks are consumers.",
        "Therefore, fungus is the correct answer.",
      ],
    },
  },

  {
    id: "biology-interdependence-005",

    question:
      "What is the major importance of decomposers in an ecosystem?",

    options: [
      {
        id: "A",
        text: "They produce sunlight for plants",
      },
      {
        id: "B",
        text: "They recycle nutrients back into the environment",
      },
      {
        id: "C",
        text: "They prevent all organisms from competing",
      },
      {
        id: "D",
        text: "They convert consumers into producers",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Decomposers play an important role in nutrient cycling within ecosystems.",

      steps: [
        "Dead plants, animals and their wastes contain nutrients.",
        "Decomposers break down this organic material.",
        "Mineral nutrients are released into the soil or surrounding environment.",
        "Plants can absorb many of these nutrients.",
        "Therefore, decomposers help recycle nutrients within ecosystems.",
      ],
    },
  },

  {
    id: "biology-interdependence-006",

    question:
      "Which of the following best describes commensalism?",

    options: [
      {
        id: "A",
        text: "Both organisms benefit",
      },
      {
        id: "B",
        text: "One organism benefits while the other is harmed",
      },
      {
        id: "C",
        text: "One organism benefits while the other is neither significantly helped nor harmed",
      },
      {
        id: "D",
        text: "Both organisms are harmed",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Commensalism is an association in which one organism benefits while the other is not significantly affected.",

      steps: [
        "One organism obtains a benefit from the relationship.",
        "The second organism is neither significantly helped nor harmed.",
        "This differs from mutualism, where both organisms benefit.",
        "It also differs from parasitism, where one organism benefits and the other is harmed.",
        "Therefore, option C correctly describes commensalism.",
      ],
    },
  },

  {
    id: "biology-interdependence-007",

    question:
      "Which of the following is an example of competition between organisms?",

    options: [
      {
        id: "A",
        text: "Two plants competing for sunlight and water",
      },
      {
        id: "B",
        text: "A lion eating a zebra",
      },
      {
        id: "C",
        text: "A tapeworm feeding in a human intestine",
      },
      {
        id: "D",
        text: "A bee pollinating a flower",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Competition occurs when organisms require the same limited resources.",

      steps: [
        "Plants require resources such as sunlight, water, mineral salts and space.",
        "When resources are limited, plants may compete for them.",
        "Two plants growing close together may compete for sunlight and water.",
        "The organisms are therefore competing for limited resources.",
        "Hence, option A is correct.",
      ],
    },
  },

  {
    id: "biology-interdependence-008",

    question:
      "What is the most likely effect of removing all predators from an ecosystem?",

    options: [
      {
        id: "A",
        text: "The prey population may increase greatly",
      },
      {
        id: "B",
        text: "All producers will immediately disappear",
      },
      {
        id: "C",
        text: "The ecosystem will have no consumers",
      },
      {
        id: "D",
        text: "Decomposers will stop functioning",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Predators help regulate the populations of their prey within ecosystems.",

      steps: [
        "Predators feed on prey organisms.",
        "This feeding helps keep prey populations under control.",
        "If predators are removed, fewer prey organisms are eaten.",
        "The prey population may therefore increase rapidly.",
        "An excessive prey population can place greater pressure on available resources.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-interdependence-009",

    question:
      "Which of the following best explains why organisms in a food chain are interdependent?",

    options: [
      {
        id: "A",
        text: "Every organism can manufacture its own food",
      },
      {
        id: "B",
        text: "Organisms depend on one another directly or indirectly for food and other resources",
      },
      {
        id: "C",
        text: "All organisms occupy exactly the same habitat",
      },
      {
        id: "D",
        text: "Only predators require other organisms for survival",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Organisms within ecosystems are connected through feeding relationships and their dependence on environmental resources.",

      steps: [
        "Producers provide food and energy for consumers.",
        "Herbivores depend on plants for food.",
        "Carnivores may depend on herbivores and other consumers.",
        "Decomposers break down dead organisms and recycle nutrients.",
        "Therefore, organisms depend on one another directly or indirectly.",
      ],
    },
  },

  {
    id: "biology-interdependence-010",

    question:
      "Which of the following would most likely happen if a major plant species disappeared from an ecosystem?",

    options: [
      {
        id: "A",
        text: "Herbivores depending on the plant may decrease",
      },
      {
        id: "B",
        text: "All animals would immediately become producers",
      },
      {
        id: "C",
        text: "Predators would no longer require food",
      },
      {
        id: "D",
        text: "Decomposers would immediately become extinct",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The disappearance of an important producer can affect many organisms that depend on it for food.",

      steps: [
        "Plants are producers and form the base of many food chains.",
        "Herbivores depend on plants as their source of food.",
        "If an important plant species disappears, herbivores that depend on it may have less food.",
        "Their population may therefore decrease or they may have to find alternative food sources.",
        "Changes in herbivore populations can also affect predators.",
        "Therefore, option A is correct.",
      ],
    },
  },
];

export default interdependenceOfOrganismsQuestions;
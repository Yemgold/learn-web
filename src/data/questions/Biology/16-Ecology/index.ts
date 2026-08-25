


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — ECOLOGY                                                          */
/* -------------------------------------------------------------------------- */

export const ecologyQuestions: ArenaQuestion[] = [
  {
    id: "biology-ecology-001",

    question:
      "The branch of biology that deals with the relationships between organisms and their environment is known as",

    options: [
      {
        id: "A",
        text: "Genetics",
      },
      {
        id: "B",
        text: "Ecology",
      },
      {
        id: "C",
        text: "Physiology",
      },
      {
        id: "D",
        text: "Taxonomy",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Ecology is the study of the relationships between organisms and their living and non-living environment.",

      steps: [
        "Organisms interact with other organisms.",
        "Organisms also interact with non-living factors such as water, temperature and soil.",
        "The study of these interactions is called ecology.",
        "Therefore, the correct answer is Ecology.",
      ],
    },
  },

  {
    id: "biology-ecology-002",

    question:
      "Which of the following is an abiotic factor in an ecosystem?",

    options: [
      {
        id: "A",
        text: "Predation",
      },
      {
        id: "B",
        text: "Competition",
      },
      {
        id: "C",
        text: "Temperature",
      },
      {
        id: "D",
        text: "Parasitism",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Abiotic factors are the non-living components of an ecosystem.",

      steps: [
        "Temperature is a physical, non-living condition.",
        "Predation, competition and parasitism involve interactions between living organisms.",
        "Therefore, temperature is the abiotic factor.",
      ],
    },
  },

  {
    id: "biology-ecology-003",

    question:
      "Which of the following organisms is a producer in an ecosystem?",

    options: [
      {
        id: "A",
        text: "Goat",
      },
      {
        id: "B",
        text: "Grass",
      },
      {
        id: "C",
        text: "Lion",
      },
      {
        id: "D",
        text: "Earthworm",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Producers are organisms that manufacture their own food, usually through photosynthesis.",

      steps: [
        "Green plants contain chlorophyll.",
        "They can manufacture organic food through photosynthesis.",
        "Grass is a green plant and therefore functions as a producer.",
        "Goat, lion and earthworm obtain food from other organisms or organic matter.",
        "Therefore, the correct answer is Grass.",
      ],
    },
  },

  {
    id: "biology-ecology-004",

    question:
      "Which sequence correctly represents a simple food chain?",

    options: [
      {
        id: "A",
        text: "Grass → Goat → Lion",
      },
      {
        id: "B",
        text: "Lion → Goat → Grass",
      },
      {
        id: "C",
        text: "Goat → Grass → Lion",
      },
      {
        id: "D",
        text: "Grass → Lion → Goat",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A food chain shows the direction of feeding relationships and energy transfer between organisms.",

      steps: [
        "Grass is a producer.",
        "The goat feeds on grass and acts as a primary consumer.",
        "The lion can feed on the goat and acts as a higher-level consumer.",
        "Therefore, Grass → Goat → Lion is the correct sequence.",
      ],
    },
  },

  {
    id: "biology-ecology-005",

    question:
      "Which group of organisms is mainly responsible for decomposing dead organic matter?",

    options: [
      {
        id: "A",
        text: "Green plants",
      },
      {
        id: "B",
        text: "Fungi and bacteria",
      },
      {
        id: "C",
        text: "Herbivores",
      },
      {
        id: "D",
        text: "Carnivores",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Decomposers break down dead organisms and organic waste, releasing nutrients back into the environment.",

      steps: [
        "Dead plants and animals contain organic matter.",
        "Fungi and bacteria break down this material.",
        "The decomposition process releases nutrients into the environment.",
        "These nutrients can subsequently be reused by plants.",
        "Therefore, fungi and bacteria are major decomposers.",
      ],
    },
  },

  {
    id: "biology-ecology-006",

    question:
      "The interaction between two organisms in which both organisms benefit is called",

    options: [
      {
        id: "A",
        text: "Parasitism",
      },
      {
        id: "B",
        text: "Predation",
      },
      {
        id: "C",
        text: "Mutualism",
      },
      {
        id: "D",
        text: "Competition",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Mutualism is a biological interaction in which both participating organisms benefit.",

      steps: [
        "In mutualism, both organisms gain an advantage.",
        "In parasitism, one organism benefits while the host is harmed.",
        "In predation, one organism captures and feeds on another.",
        "Competition occurs when organisms seek the same limited resources.",
        "Therefore, the correct answer is Mutualism.",
      ],
    },
  },

  {
    id: "biology-ecology-007",

    question:
      "Which of the following is most likely to occur when two organisms compete for the same limited food resource?",

    options: [
      {
        id: "A",
        text: "Both organisms always increase rapidly",
      },
      {
        id: "B",
        text: "The organisms may experience reduced access to food",
      },
      {
        id: "C",
        text: "The food resource becomes unlimited",
      },
      {
        id: "D",
        text: "Competition immediately stops reproduction",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Competition occurs when organisms require the same limited resource.",

      steps: [
        "Food is a resource required by many organisms.",
        "When the resource is limited, organisms may compete for it.",
        "Competition can reduce the amount of food available to individual organisms.",
        "Therefore, the organisms may experience reduced access to food.",
      ],
    },
  },

  {
    id: "biology-ecology-008",

    question:
      "What is the main source of energy for most ecosystems?",

    options: [
      {
        id: "A",
        text: "Soil",
      },
      {
        id: "B",
        text: "Water",
      },
      {
        id: "C",
        text: "The Sun",
      },
      {
        id: "D",
        text: "Decomposers",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Sunlight provides the primary energy input for most ecosystems.",

      steps: [
        "Green plants capture light energy through photosynthesis.",
        "Plants convert this energy into chemical energy stored in food.",
        "Consumers obtain energy by feeding on plants or other organisms.",
        "Therefore, the Sun is the main source of energy for most ecosystems.",
      ],
    },
  },

  {
    id: "biology-ecology-009",

    question:
      "Which of the following would most likely increase the population size of a species in a habitat?",

    options: [
      {
        id: "A",
        text: "Increased availability of food",
      },
      {
        id: "B",
        text: "Increased predation",
      },
      {
        id: "C",
        text: "Severe shortage of water",
      },
      {
        id: "D",
        text: "Increased disease",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The availability of resources such as food can influence population growth.",

      steps: [
        "Organisms require food for energy and survival.",
        "An increase in available food can improve survival and reproductive success.",
        "Increased predation, water shortage and disease can reduce population size.",
        "Therefore, increased availability of food is most likely to increase population size.",
      ],
    },
  },

  {
    id: "biology-ecology-010",

    question:
      "A community together with the non-living components of its environment is called",

    options: [
      {
        id: "A",
        text: "Population",
      },
      {
        id: "B",
        text: "Community",
      },
      {
        id: "C",
        text: "Ecosystem",
      },
      {
        id: "D",
        text: "Habitat",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "An ecosystem consists of living organisms and the non-living components with which they interact.",

      steps: [
        "A population consists of members of the same species in an area.",
        "A community consists of different populations living and interacting in an area.",
        "An ecosystem includes the community together with abiotic factors.",
        "Therefore, the correct answer is Ecosystem.",
      ],
    },
  },

  {
    id: "biology-ecology-011",

    question:
      "Which of the following is an example of a population?",

    options: [
      {
        id: "A",
        text: "All organisms in a forest",
      },
      {
        id: "B",
        text: "All the goats in a village",
      },
      {
        id: "C",
        text: "All living and non-living things in a pond",
      },
      {
        id: "D",
        text: "Plants, animals and fungi in a habitat",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A population consists of individuals of the same species living in a particular area at a particular time.",

      steps: [
        "Goats belong to the same species or population group in this example.",
        "The goats are living within the same geographical area.",
        "The organisms in the other options include several species or non-living components.",
        "Therefore, all the goats in a village represent a population.",
      ],
    },
  },

  {
    id: "biology-ecology-012",

    question:
      "Which process returns carbon dioxide to the atmosphere during the carbon cycle?",

    options: [
      {
        id: "A",
        text: "Photosynthesis",
      },
      {
        id: "B",
        text: "Respiration",
      },
      {
        id: "C",
        text: "Water absorption",
      },
      {
        id: "D",
        text: "Mineral uptake",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Respiration releases carbon dioxide as organisms break down food to obtain energy.",

      steps: [
        "Organisms carry out cellular respiration to release energy from food.",
        "Carbon dioxide is produced during aerobic respiration.",
        "This carbon dioxide can enter the atmosphere.",
        "Photosynthesis removes carbon dioxide from the atmosphere.",
        "Therefore, respiration returns carbon dioxide to the atmosphere.",
      ],
    },
  },

  {
    id: "biology-ecology-013",

    question:
      "Which of the following human activities can contribute most directly to deforestation?",

    options: [
      {
        id: "A",
        text: "Controlled recycling",
      },
      {
        id: "B",
        text: "Large-scale clearing of forests for agriculture",
      },
      {
        id: "C",
        text: "Planting trees",
      },
      {
        id: "D",
        text: "Protection of wildlife reserves",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Deforestation involves the removal or clearing of forests, often for agriculture, settlement or other human activities.",

      steps: [
        "Forests are sometimes cleared to create farmland.",
        "Large-scale clearing removes trees and reduces forest cover.",
        "Planting trees helps restore forest cover.",
        "Therefore, large-scale clearing of forests for agriculture can directly contribute to deforestation.",
      ],
    },
  },

  {
    id: "biology-ecology-014",

    question:
      "Which of the following is an important consequence of excessive deforestation?",

    options: [
      {
        id: "A",
        text: "Increased habitat destruction",
      },
      {
        id: "B",
        text: "Permanent increase in biodiversity",
      },
      {
        id: "C",
        text: "Elimination of soil erosion",
      },
      {
        id: "D",
        text: "Unlimited increase in rainfall",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Deforestation removes vegetation and can destroy habitats used by many organisms.",

      steps: [
        "Many organisms depend on forests for food and shelter.",
        "Removing forests can destroy or fragment these habitats.",
        "This may reduce populations and biodiversity.",
        "Deforestation can also increase soil erosion and alter local environmental conditions.",
        "Therefore, increased habitat destruction is a major consequence.",
      ],
    },
  },

  {
    id: "biology-ecology-015",

    question:
      "Ecological succession refers to",

    options: [
      {
        id: "A",
        text: "The movement of animals from one habitat to another",
      },
      {
        id: "B",
        text: "The gradual change in the composition of a community over time",
      },
      {
        id: "C",
        text: "The feeding relationship between two organisms",
      },
      {
        id: "D",
        text: "The seasonal migration of birds",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Ecological succession is the gradual and relatively predictable change in the structure and composition of a biological community over time.",

      steps: [
        "Communities change as organisms colonize, grow and alter their environment.",
        "Different species may replace earlier communities over time.",
        "This gradual process is called ecological succession.",
        "Therefore, the correct answer is the gradual change in community composition over time.",
      ],
    },
  },

  {
    id: "biology-ecology-016",

    question:
      "Which organisms are usually the first colonizers during primary succession on bare rock?",

    options: [
      {
        id: "A",
        text: "Large mammals",
      },
      {
        id: "B",
        text: "Lichens",
      },
      {
        id: "C",
        text: "Large trees",
      },
      {
        id: "D",
        text: "Carnivorous birds",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Lichens are commonly regarded as pioneer organisms in primary succession on newly exposed bare surfaces.",

      steps: [
        "Primary succession can begin on surfaces where little or no soil exists.",
        "Lichens can colonize exposed rock.",
        "They contribute to the gradual formation of soil and create conditions that allow other organisms to establish.",
        "Therefore, lichens are common pioneer organisms in primary succession.",
      ],
    },
  },

  {
    id: "biology-ecology-017",

    question:
      "Which of the following best describes a habitat?",

    options: [
      {
        id: "A",
        text: "The role played by an organism in an ecosystem",
      },
      {
        id: "B",
        text: "The place where an organism normally lives",
      },
      {
        id: "C",
        text: "All organisms of the same species",
      },
      {
        id: "D",
        text: "The feeding level of an organism",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A habitat is the place or type of environment in which an organism normally lives.",

      steps: [
        "Organisms require suitable conditions for survival.",
        "The environment where an organism normally lives is its habitat.",
        "The role of an organism in an ecosystem is more closely described by its niche.",
        "Therefore, the correct answer is the place where an organism normally lives.",
      ],
    },
  },

  {
    id: "biology-ecology-018",

    question:
      "Which of the following factors can limit the population size of organisms in a habitat?",

    options: [
      {
        id: "A",
        text: "Unlimited resources",
      },
      {
        id: "B",
        text: "Availability of food and space",
      },
      {
        id: "C",
        text: "Unlimited shelter",
      },
      {
        id: "D",
        text: "Absence of competition",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Population size is influenced by the availability of essential resources such as food, water, space and shelter.",

      steps: [
        "Organisms need resources to survive and reproduce.",
        "Food and space may become limited as population size increases.",
        "Competition for these resources can restrict population growth.",
        "Therefore, availability of food and space can limit population size.",
      ],
    },
  },

  {
    id: "biology-ecology-019",

    question:
      "Which relationship exists when a parasite obtains nutrients from a host and harms the host?",

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
        text: "Parasitism",
      },
      {
        id: "D",
        text: "Competition",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Parasitism is an interaction in which one organism benefits while the host is harmed.",

      steps: [
        "The parasite obtains nutrients or other benefits from the host.",
        "The host provides resources required by the parasite.",
        "The host is negatively affected by the relationship.",
        "Therefore, the relationship is parasitism.",
      ],
    },
  },

  {
    id: "biology-ecology-020",

    question:
      "Which of the following practices can help conserve biodiversity?",

    options: [
      {
        id: "A",
        text: "Destruction of natural habitats",
      },
      {
        id: "B",
        text: "Uncontrolled hunting",
      },
      {
        id: "C",
        text: "Establishment of protected areas",
      },
      {
        id: "D",
        text: "Illegal logging",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Protected areas help conserve organisms and their habitats by restricting or managing activities that threaten biodiversity.",

      steps: [
        "Many species depend on specific natural habitats.",
        "Protected areas can preserve these habitats.",
        "They can also provide safer environments for threatened species.",
        "Destruction, uncontrolled hunting and illegal logging can reduce biodiversity.",
        "Therefore, establishing protected areas can help conserve biodiversity.",
      ],
    },
  },
];

export default ecologyQuestions;
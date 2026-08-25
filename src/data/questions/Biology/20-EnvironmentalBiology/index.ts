


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — ENVIRONMENTAL BIOLOGY                                            */
/* -------------------------------------------------------------------------- */

export const environmentalBiologyQuestions: ArenaQuestion[] = [
  {
    id: "biology-environmental-001",

    question:
      "Which of the following is the major cause of air pollution in many urban areas?",

    options: [
      {
        id: "A",
        text: "Burning of fossil fuels",
      },
      {
        id: "B",
        text: "Planting of trees",
      },
      {
        id: "C",
        text: "Proper waste disposal",
      },
      {
        id: "D",
        text: "Rainfall",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The burning of fossil fuels releases several pollutants into the atmosphere.",

      steps: [
        "Fossil fuels include coal, petroleum and natural gas.",
        "Their combustion releases gases and particles into the atmosphere.",
        "Vehicles, industries and power stations are important sources of these emissions.",
        "These pollutants can reduce air quality and affect living organisms.",
        "Therefore, burning of fossil fuels is a major cause of air pollution.",
      ],
    },
  },

  {
    id: "biology-environmental-002",

    question:
      "Which of the following activities contributes most directly to deforestation?",

    options: [
      {
        id: "A",
        text: "Afforestation",
      },
      {
        id: "B",
        text: "Uncontrolled logging",
      },
      {
        id: "C",
        text: "Wildlife conservation",
      },
      {
        id: "D",
        text: "Establishment of forest reserves",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Uncontrolled removal of trees reduces forest cover and contributes directly to deforestation.",

      steps: [
        "Deforestation involves the permanent or extensive removal of forest vegetation.",
        "Logging removes trees for timber and other forest products.",
        "When logging is uncontrolled, trees may be removed faster than they can naturally regenerate.",
        "This reduces the size and quality of forest habitats.",
        "Therefore, uncontrolled logging contributes directly to deforestation.",
      ],
    },
  },

  {
    id: "biology-environmental-003",

    question:
      "Which of the following is an effect of soil erosion?",

    options: [
      {
        id: "A",
        text: "Increase in soil fertility",
      },
      {
        id: "B",
        text: "Loss of topsoil",
      },
      {
        id: "C",
        text: "Increase in forest cover",
      },
      {
        id: "D",
        text: "Improvement of soil structure",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Soil erosion involves the removal and transportation of soil particles, especially the nutrient-rich topsoil.",

      steps: [
        "Topsoil contains much of the organic matter and nutrients required by plants.",
        "Water and wind can remove exposed soil particles.",
        "Continuous erosion can therefore remove the fertile upper layer of soil.",
        "Loss of topsoil reduces the productivity of agricultural land.",
        "Therefore, loss of topsoil is an important effect of soil erosion.",
      ],
    },
  },

  {
    id: "biology-environmental-004",

    question:
      "Which of the following practices can help to control soil erosion?",

    options: [
      {
        id: "A",
        text: "Continuous bush burning",
      },
      {
        id: "B",
        text: "Removal of vegetation",
      },
      {
        id: "C",
        text: "Planting cover crops",
      },
      {
        id: "D",
        text: "Overgrazing",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Vegetation protects the soil surface from direct rainfall and reduces the speed of surface runoff.",

      steps: [
        "Plant roots hold soil particles together.",
        "Leaves and stems reduce the direct impact of rainfall on exposed soil.",
        "Cover crops provide vegetation over the soil surface.",
        "This reduces the amount of soil that can be carried away by water.",
        "Therefore, planting cover crops helps control soil erosion.",
      ],
    },
  },

  {
    id: "biology-environmental-005",

    question:
      "Which of the following gases is mainly responsible for the greenhouse effect?",

    options: [
      {
        id: "A",
        text: "Oxygen",
      },
      {
        id: "B",
        text: "Nitrogen",
      },
      {
        id: "C",
        text: "Carbon dioxide",
      },
      {
        id: "D",
        text: "Hydrogen",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Carbon dioxide is an important greenhouse gas that contributes to the warming of the Earth's atmosphere.",

      steps: [
        "The Earth receives energy from the Sun.",
        "Some of the heat emitted by the Earth's surface is absorbed and re-emitted by greenhouse gases.",
        "Carbon dioxide is one of the important gases involved in this process.",
        "Human activities such as burning fossil fuels can increase atmospheric carbon dioxide.",
        "Therefore, carbon dioxide contributes significantly to the greenhouse effect.",
      ],
    },
  },

  {
    id: "biology-environmental-006",

    question:
      "Which of the following is a major consequence of excessive carbon dioxide accumulation in the atmosphere?",

    options: [
      {
        id: "A",
        text: "Global warming",
      },
      {
        id: "B",
        text: "Decrease in atmospheric temperature",
      },
      {
        id: "C",
        text: "Complete disappearance of oxygen",
      },
      {
        id: "D",
        text: "Formation of soil minerals",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "An increase in atmospheric greenhouse gases can enhance heat retention and contribute to global warming.",

      steps: [
        "Carbon dioxide is a greenhouse gas.",
        "Increasing its concentration can strengthen the greenhouse effect.",
        "More heat can consequently be retained within the Earth's climate system.",
        "This contributes to a long-term increase in average global temperature.",
        "Therefore, global warming is a major consequence.",
      ],
    },
  },

  {
    id: "biology-environmental-007",

    question:
      "Which of the following is an example of water pollution?",

    options: [
      {
        id: "A",
        text: "Discharge of untreated sewage into a river",
      },
      {
        id: "B",
        text: "Planting trees around a river",
      },
      {
        id: "C",
        text: "Filtering drinking water",
      },
      {
        id: "D",
        text: "Protecting wetlands",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Untreated sewage can introduce harmful substances and microorganisms into water bodies.",

      steps: [
        "Sewage may contain organic waste, nutrients and disease-causing microorganisms.",
        "Discharging untreated sewage into rivers introduces these substances directly into the water.",
        "This can reduce water quality and harm aquatic organisms.",
        "It can also make the water unsafe for human use.",
        "Therefore, untreated sewage discharge is an example of water pollution.",
      ],
    },
  },

  {
    id: "biology-environmental-008",

    question:
      "Which of the following pollutants is most likely to cause eutrophication in a water body?",

    options: [
      {
        id: "A",
        text: "Nitrates and phosphates",
      },
      {
        id: "B",
        text: "Oxygen",
      },
      {
        id: "C",
        text: "Sand particles",
      },
      {
        id: "D",
        text: "Nitrogen gas",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Excess nutrients such as nitrates and phosphates can stimulate excessive growth of algae in water bodies.",

      steps: [
        "Nitrates and phosphates are nutrients required by plants and algae.",
        "Excessive amounts can enter water through agricultural runoff and sewage.",
        "The nutrients may cause rapid growth of algae.",
        "When the algae die and decompose, dissolved oxygen can be reduced.",
        "This process is associated with eutrophication.",
      ],
    },
  },

  {
    id: "biology-environmental-009",

    question:
      "Which of the following methods is most suitable for reducing household solid waste?",

    options: [
      {
        id: "A",
        text: "Open dumping",
      },
      {
        id: "B",
        text: "Burning all waste indiscriminately",
      },
      {
        id: "C",
        text: "Recycling and reuse",
      },
      {
        id: "D",
        text: "Dumping waste into rivers",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Recycling and reuse reduce the amount of waste that needs to be disposed of.",

      steps: [
        "Some waste materials can be used again instead of being discarded.",
        "Materials such as paper, glass, metals and some plastics can be recycled.",
        "Recycling reduces the amount of solid waste sent to disposal sites.",
        "It also reduces the need to obtain new raw materials.",
        "Therefore, recycling and reuse are effective waste-management practices.",
      ],
    },
  },

  {
    id: "biology-environmental-010",

    question:
      "Which of the following is the best method of conserving endangered species?",

    options: [
      {
        id: "A",
        text: "Destruction of their habitats",
      },
      {
        id: "B",
        text: "Uncontrolled hunting",
      },
      {
        id: "C",
        text: "Protection of their natural habitats",
      },
      {
        id: "D",
        text: "Introduction of pollutants into their environment",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Protecting natural habitats helps endangered organisms maintain access to food, shelter and suitable breeding conditions.",

      steps: [
        "Wild organisms depend on suitable habitats for survival.",
        "Habitat destruction can reduce food, shelter and breeding sites.",
        "Protecting habitats preserves the environmental conditions required by the species.",
        "Protected areas can also reduce harmful human activities such as uncontrolled hunting.",
        "Therefore, protection of natural habitats is an important conservation method.",
      ],
    },
  },
];

export default environmentalBiologyQuestions;
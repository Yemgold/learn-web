


import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — HEAT TRANSFER
// --------------------------------------------------------------------------

export const heatTransferQuestions: ArenaQuestion[] = [
  {
    id: "physics-heat-transfer-001",

    question:
      "Which of the following methods of heat transfer can occur through a vacuum?",

    options: [
      {
        id: "A",
        text: "Conduction",
      },
      {
        id: "B",
        text: "Convection",
      },
      {
        id: "C",
        text: "Radiation",
      },
      {
        id: "D",
        text: "Conduction and convection",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Radiation is the transfer of heat energy through electromagnetic waves and does not require a material medium.",

      steps: [
        "Conduction requires particles to transfer thermal energy through a material.",
        "Convection occurs through the movement of particles in fluids.",
        "Radiation transfers energy through electromagnetic waves.",
        "Radiation can therefore travel through a vacuum.",
        "Therefore, the correct answer is Radiation.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-002",

    question:
      "Which mode of heat transfer is mainly responsible for the heating of water when it is boiled in a pot?",

    options: [
      {
        id: "A",
        text: "Conduction",
      },
      {
        id: "B",
        text: "Convection",
      },
      {
        id: "C",
        text: "Radiation",
      },
      {
        id: "D",
        text: "Reflection",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Convection transfers heat through the movement of fluid particles.",

      steps: [
        "Water is a fluid.",
        "When the water at the bottom of the pot is heated, it becomes less dense and rises.",
        "Cooler water moves downward to replace it.",
        "This continuous movement creates convection currents.",
        "Therefore, convection is mainly responsible for distributing heat through the water.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-003",

    question:
      "Which of the following is a good conductor of heat?",

    options: [
      {
        id: "A",
        text: "Wood",
      },
      {
        id: "B",
        text: "Plastic",
      },
      {
        id: "C",
        text: "Copper",
      },
      {
        id: "D",
        text: "Rubber",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Metals are generally good conductors of heat because thermal energy can be transferred efficiently through them.",

      steps: [
        "Copper is a metal.",
        "Metals generally conduct heat well.",
        "Wood, plastic and rubber are poor conductors of heat.",
        "Copper is therefore the best conductor among the options.",
        "Therefore, the correct answer is Copper.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-004",

    question:
      "Why are cooking pots usually made of metals while their handles are often made of plastic or wood?",

    options: [
      {
        id: "A",
        text: "Metals are poor conductors while plastic is a good conductor",
      },
      {
        id: "B",
        text: "Metals conduct heat well while plastic and wood are poor conductors",
      },
      {
        id: "C",
        text: "Plastic and wood have higher melting points than metals",
      },
      {
        id: "D",
        text: "Metals cannot absorb heat",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Cooking pots need to transfer heat efficiently to the food, while their handles should reduce heat transfer to the user's hand.",

      steps: [
        "Metals are generally good conductors of heat.",
        "This allows heat from the heat source to reach the food efficiently.",
        "Plastic and wood are poor conductors of heat.",
        "They therefore reduce the transfer of heat to the handle.",
        "Therefore, the correct answer is that metals conduct heat well while plastic and wood are poor conductors.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-005",

    question:
      "The transfer of heat through a solid from one particle to another without movement of the particles from their positions is called",

    options: [
      {
        id: "A",
        text: "Convection",
      },
      {
        id: "B",
        text: "Radiation",
      },
      {
        id: "C",
        text: "Conduction",
      },
      {
        id: "D",
        text: "Evaporation",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Conduction is the transfer of thermal energy through a substance without bulk movement of the substance.",

      steps: [
        "In conduction, particles transfer energy to neighbouring particles.",
        "The particles vibrate or move locally but do not move as a bulk current.",
        "Conduction is particularly important in solids.",
        "Therefore, the correct answer is Conduction.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-006",

    question:
      "Which of the following surfaces is the best absorber of radiant heat?",

    options: [
      {
        id: "A",
        text: "Shiny white surface",
      },
      {
        id: "B",
        text: "Polished silver surface",
      },
      {
        id: "C",
        text: "Dull black surface",
      },
      {
        id: "D",
        text: "Shiny aluminium surface",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Dull black surfaces are generally good absorbers of radiant heat.",

      steps: [
        "Dull black surfaces absorb radiant energy efficiently.",
        "Shiny and polished surfaces tend to reflect a greater proportion of radiant heat.",
        "Therefore, a dull black surface is the best absorber among the options.",
        "The correct answer is Dull black surface.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-007",

    question:
      "Which type of surface is generally the best reflector of radiant heat?",

    options: [
      {
        id: "A",
        text: "Dull black surface",
      },
      {
        id: "B",
        text: "Rough dark surface",
      },
      {
        id: "C",
        text: "Polished shiny surface",
      },
      {
        id: "D",
        text: "Matte black surface",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Polished shiny surfaces are good reflectors of radiant heat.",

      steps: [
        "Shiny surfaces reflect a large proportion of incident radiant energy.",
        "Dull dark surfaces tend to absorb radiant heat more effectively.",
        "Polished surfaces are therefore used where reflection of thermal radiation is desired.",
        "Therefore, the correct answer is Polished shiny surface.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-008",

    question:
      "Why does convection occur in a fluid when the fluid is heated?",

    options: [
      {
        id: "A",
        text: "The heated fluid becomes denser and sinks",
      },
      {
        id: "B",
        text: "The heated fluid becomes less dense and rises",
      },
      {
        id: "C",
        text: "The fluid stops moving",
      },
      {
        id: "D",
        text: "The fluid becomes a solid",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Heating a fluid can cause it to expand and become less dense, causing it to rise.",

      steps: [
        "Heating causes the fluid to expand.",
        "The expanded fluid becomes less dense.",
        "The warmer, less dense fluid rises.",
        "Cooler, denser fluid moves downward.",
        "This produces convection currents.",
        "Therefore, the correct answer is that the heated fluid becomes less dense and rises.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-009",

    question:
      "The vacuum between the double walls of a thermos flask mainly reduces heat transfer by",

    options: [
      {
        id: "A",
        text: "Conduction and convection",
      },
      {
        id: "B",
        text: "Radiation only",
      },
      {
        id: "C",
        text: "Evaporation only",
      },
      {
        id: "D",
        text: "Convection only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A vacuum contains very few particles, so it greatly reduces conduction and prevents convection between the walls.",

      steps: [
        "Conduction requires particles to transfer thermal energy.",
        "Convection requires the movement of particles in a fluid.",
        "A vacuum has essentially no material particles between the walls.",
        "Therefore, conduction and convection are greatly reduced.",
        "Radiation can still occur across the vacuum.",
        "Therefore, the correct answer is Conduction and convection.",
      ],
    },
  },

  {
    id: "physics-heat-transfer-010",

    question:
      "The shiny inner surface of a thermos flask helps to reduce heat loss by",

    options: [
      {
        id: "A",
        text: "Increasing convection",
      },
      {
        id: "B",
        text: "Absorbing all radiation",
      },
      {
        id: "C",
        text: "Reflecting thermal radiation",
      },
      {
        id: "D",
        text: "Increasing conduction",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A shiny surface reflects radiant heat and therefore reduces heat transfer by radiation.",

      steps: [
        "Thermal radiation can transfer heat across a vacuum.",
        "A shiny surface is a good reflector of radiant heat.",
        "The shiny inner surface therefore reflects thermal radiation back toward the contents.",
        "This reduces heat loss by radiation.",
        "Therefore, the correct answer is Reflecting thermal radiation.",
      ],
    },
  },
];

export default heatTransferQuestions;
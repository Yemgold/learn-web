



import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — CHANGE OF STATE
// --------------------------------------------------------------------------

export const changeOfStateQuestions: ArenaQuestion[] = [
  {
    id: "physics-change-of-state-001",

    question:
      "Which of the following processes involves the change of a liquid into a gas at the surface of the liquid?",

    options: [
      {
        id: "A",
        text: "Condensation",
      },
      {
        id: "B",
        text: "Evaporation",
      },
      {
        id: "C",
        text: "Freezing",
      },
      {
        id: "D",
        text: "Melting",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Evaporation is the process by which molecules escape from the surface of a liquid into the gaseous state.",

      steps: [
        "A liquid contains molecules moving at different speeds.",
        "Some molecules at the surface have enough energy to escape from the liquid.",
        "These molecules enter the gaseous state.",
        "This process is called evaporation.",
        "Therefore, the correct answer is Evaporation.",
      ],
    },
  },

  {
    id: "physics-change-of-state-002",

    question:
      "What is the change of state from a solid directly to a gas without passing through the liquid state called?",

    options: [
      {
        id: "A",
        text: "Sublimation",
      },
      {
        id: "B",
        text: "Condensation",
      },
      {
        id: "C",
        text: "Vaporization",
      },
      {
        id: "D",
        text: "Freezing",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Sublimation occurs when a solid changes directly into a gas without becoming a liquid first.",

      steps: [
        "A change of state occurs when matter changes from one physical state to another.",
        "In sublimation, a solid changes directly into a gas.",
        "The liquid state is not involved in the process.",
        "Examples include iodine and solid carbon dioxide under suitable conditions.",
        "Therefore, the correct answer is Sublimation.",
      ],
    },
  },

  {
    id: "physics-change-of-state-003",

    question:
      "Which process occurs when a gas changes into a liquid?",

    options: [
      {
        id: "A",
        text: "Melting",
      },
      {
        id: "B",
        text: "Sublimation",
      },
      {
        id: "C",
        text: "Condensation",
      },
      {
        id: "D",
        text: "Evaporation",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Condensation is the change of a substance from the gaseous state to the liquid state.",

      steps: [
        "Gas molecules lose energy when the gas is cooled.",
        "The molecules move closer together.",
        "The gas changes into a liquid.",
        "This process is known as condensation.",
        "Therefore, the correct answer is Condensation.",
      ],
    },
  },

  {
    id: "physics-change-of-state-004",

    question:
      "What happens to the temperature of a pure substance while it is melting at its melting point?",

    options: [
      {
        id: "A",
        text: "It increases continuously",
      },
      {
        id: "B",
        text: "It decreases continuously",
      },
      {
        id: "C",
        text: "It remains constant",
      },
      {
        id: "D",
        text: "It becomes zero",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "During the melting of a pure substance at its melting point, the temperature remains constant until the solid has completely melted.",

      steps: [
        "Heat supplied to a substance normally increases its temperature.",
        "At the melting point, the substance begins changing from solid to liquid.",
        "The supplied heat is used mainly to overcome intermolecular forces.",
        "Therefore, the temperature remains constant during the change of state.",
        "The correct answer is It remains constant.",
      ],
    },
  },

  {
    id: "physics-change-of-state-005",

    question:
      "The heat required to change a unit mass of a substance from solid to liquid at its melting point is called",

    options: [
      {
        id: "A",
        text: "specific heat capacity",
      },
      {
        id: "B",
        text: "specific latent heat of fusion",
      },
      {
        id: "C",
        text: "specific latent heat of vaporization",
      },
      {
        id: "D",
        text: "thermal capacity",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Specific latent heat of fusion is the heat required to change unit mass of a substance from solid to liquid at constant temperature.",

      steps: [
        "Fusion means the change from solid to liquid.",
        "Latent heat is energy supplied during a change of state without a temperature change.",
        "Specific latent heat refers to the energy required per unit mass.",
        "Therefore, the correct term is specific latent heat of fusion.",
      ],
    },
  },

  {
    id: "physics-change-of-state-006",

    question:
      "Which of the following factors increases the rate of evaporation of a liquid?",

    options: [
      {
        id: "A",
        text: "Decreasing the surface area",
      },
      {
        id: "B",
        text: "Lowering the temperature",
      },
      {
        id: "C",
        text: "Increasing the surface area",
      },
      {
        id: "D",
        text: "Increasing the humidity",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Increasing the exposed surface area gives more liquid molecules an opportunity to escape into the atmosphere.",

      steps: [
        "Evaporation occurs at the surface of a liquid.",
        "A larger surface exposes more molecules to the surroundings.",
        "More molecules can therefore escape at the same time.",
        "This increases the rate of evaporation.",
        "Therefore, the correct answer is Increasing the surface area.",
      ],
    },
  },

  {
    id: "physics-change-of-state-007",

    question:
      "Why does evaporation produce a cooling effect?",

    options: [
      {
        id: "A",
        text: "The liquid absorbs cold from the surroundings",
      },
      {
        id: "B",
        text: "The fastest-moving molecules escape from the liquid",
      },
      {
        id: "C",
        text: "The liquid loses all its heat",
      },
      {
        id: "D",
        text: "The pressure of the liquid increases",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Evaporation causes cooling because higher-energy molecules escape from the surface of the liquid.",

      steps: [
        "Molecules in a liquid have different kinetic energies.",
        "The molecules with relatively high kinetic energy are more likely to escape.",
        "The remaining molecules therefore have a lower average kinetic energy.",
        "A lower average kinetic energy corresponds to a lower temperature.",
        "Therefore, evaporation produces a cooling effect.",
      ],
    },
  },

  {
    id: "physics-change-of-state-008",

    question:
      "The boiling point of a liquid is the temperature at which",

    options: [
      {
        id: "A",
        text: "the liquid begins to freeze",
      },
      {
        id: "B",
        text: "the vapour pressure equals the external pressure",
      },
      {
        id: "C",
        text: "the liquid loses all its molecules",
      },
      {
        id: "D",
        text: "the liquid changes directly into a solid",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A liquid boils when its vapour pressure becomes equal to the pressure exerted on its surface.",

      steps: [
        "Molecules in a liquid are constantly escaping to form vapour.",
        "As temperature increases, the vapour pressure increases.",
        "Boiling begins when the vapour pressure becomes equal to the external pressure.",
        "Therefore, the correct answer is that the vapour pressure equals the external pressure.",
      ],
    },
  },

  {
    id: "physics-change-of-state-009",

    question:
      "Which of the following occurs when a liquid is cooled to its freezing point?",

    options: [
      {
        id: "A",
        text: "It changes from liquid to solid",
      },
      {
        id: "B",
        text: "It changes from solid to gas",
      },
      {
        id: "C",
        text: "It changes from gas to liquid",
      },
      {
        id: "D",
        text: "It changes from gas to solid",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Freezing is the change of state from liquid to solid caused by sufficient cooling.",

      steps: [
        "Cooling removes thermal energy from the liquid.",
        "The molecules lose kinetic energy.",
        "At the freezing point, the liquid begins to form a solid structure.",
        "The substance changes from liquid to solid.",
        "Therefore, the correct answer is It changes from liquid to solid.",
      ],
    },
  },

  {
    id: "physics-change-of-state-010",

    question:
      "Which of the following statements about boiling and evaporation is correct?",

    options: [
      {
        id: "A",
        text: "Evaporation occurs throughout the liquid",
      },
      {
        id: "B",
        text: "Boiling occurs only at the surface",
      },
      {
        id: "C",
        text: "Evaporation can occur at temperatures below the boiling point",
      },
      {
        id: "D",
        text: "Boiling occurs at every temperature",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Evaporation can take place at temperatures below the boiling point, while boiling occurs throughout the liquid at a particular pressure.",

      steps: [
        "Evaporation occurs mainly at the surface of a liquid.",
        "It can occur at temperatures below the boiling point.",
        "Boiling involves vapour formation throughout the liquid.",
        "Therefore, the correct answer is that evaporation can occur at temperatures below the boiling point.",
      ],
    },
  },
];

export default changeOfStateQuestions;
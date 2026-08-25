


import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — GAS LAWS
// --------------------------------------------------------------------------

export const gasLawsQuestions: ArenaQuestion[] = [
  {
    id: "physics-gaslaws-001",

    question:
      "A gas occupies a volume of 600 cm³ at a pressure of 1.0 × 10⁵ Pa. If the temperature remains constant and the pressure is increased to 2.0 × 10⁵ Pa, what will be the new volume of the gas?",

    options: [
      {
        id: "A",
        text: "150 cm³",
      },
      {
        id: "B",
        text: "300 cm³",
      },
      {
        id: "C",
        text: "600 cm³",
      },
      {
        id: "D",
        text: "1200 cm³",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "At constant temperature, Boyle's law states that the pressure of a fixed mass of gas is inversely proportional to its volume.",

      steps: [
        "Boyle's law is P₁V₁ = P₂V₂.",
        "P₁ = 1.0 × 10⁵ Pa and V₁ = 600 cm³.",
        "P₂ = 2.0 × 10⁵ Pa.",
        "Therefore, V₂ = (P₁V₁) / P₂.",
        "V₂ = (1.0 × 10⁵ × 600) / (2.0 × 10⁵).",
        "Therefore, V₂ = 300 cm³.",
      ],
    },
  },

  {
    id: "physics-gaslaws-002",

    question:
      "Which gas law states that the volume of a fixed mass of gas is directly proportional to its absolute temperature at constant pressure?",

    options: [
      {
        id: "A",
        text: "Boyle's law",
      },
      {
        id: "B",
        text: "Charles' law",
      },
      {
        id: "C",
        text: "Dalton's law",
      },
      {
        id: "D",
        text: "Avogadro's law",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Charles' law describes the relationship between the volume and absolute temperature of a fixed mass of gas at constant pressure.",

      steps: [
        "Charles' law applies when pressure is kept constant.",
        "The volume of the gas increases as its absolute temperature increases.",
        "The relationship is V/T = constant.",
        "Therefore, the correct answer is Charles' law.",
      ],
    },
  },

  {
    id: "physics-gaslaws-003",

    question:
      "A gas has a volume of 400 cm³ at 27°C. If the pressure remains constant, what will be its volume at 127°C?",

    options: [
      {
        id: "A",
        text: "267 cm³",
      },
      {
        id: "B",
        text: "400 cm³",
      },
      {
        id: "C",
        text: "533 cm³",
      },
      {
        id: "D",
        text: "800 cm³",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Charles' law requires temperature to be expressed in kelvin before the calculation is made.",

      steps: [
        "Convert 27°C to kelvin: 27 + 273 = 300 K.",
        "Convert 127°C to kelvin: 127 + 273 = 400 K.",
        "Charles' law gives V₁/T₁ = V₂/T₂.",
        "V₂ = V₁T₂/T₁.",
        "V₂ = (400 × 400) / 300.",
        "Therefore, V₂ ≈ 533 cm³.",
      ],
    },
  },

  {
    id: "physics-gaslaws-004",

    question:
      "A fixed mass of gas is heated from 300 K to 600 K while its volume remains constant. What happens to its pressure?",

    options: [
      {
        id: "A",
        text: "It is halved",
      },
      {
        id: "B",
        text: "It remains constant",
      },
      {
        id: "C",
        text: "It is doubled",
      },
      {
        id: "D",
        text: "It becomes zero",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "At constant volume, the pressure of a fixed mass of gas is directly proportional to its absolute temperature.",

      steps: [
        "The temperature changes from 300 K to 600 K.",
        "The final temperature is twice the initial temperature.",
        "At constant volume, P/T is constant.",
        "Therefore, the pressure also becomes twice its original value.",
        "Hence, the pressure is doubled.",
      ],
    },
  },

  {
    id: "physics-gaslaws-005",

    question:
      "Which temperature scale must be used when applying the gas laws to calculations involving absolute temperature?",

    options: [
      {
        id: "A",
        text: "Celsius",
      },
      {
        id: "B",
        text: "Fahrenheit",
      },
      {
        id: "C",
        text: "Kelvin",
      },
      {
        id: "D",
        text: "Centigrade only",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Gas-law relationships involving absolute temperature require temperature to be measured on the Kelvin scale.",

      steps: [
        "Gas laws use absolute temperature.",
        "The Kelvin scale begins at absolute zero.",
        "Temperatures in Celsius must therefore be converted to Kelvin.",
        "The conversion is K = °C + 273 approximately.",
        "Therefore, the correct answer is Kelvin.",
      ],
    },
  },

  {
    id: "physics-gaslaws-006",

    question:
      "A gas occupies 2.0 m³ at a pressure of 100 kPa. If its volume is reduced to 1.0 m³ at constant temperature, what will be its new pressure?",

    options: [
      {
        id: "A",
        text: "25 kPa",
      },
      {
        id: "B",
        text: "50 kPa",
      },
      {
        id: "C",
        text: "200 kPa",
      },
      {
        id: "D",
        text: "400 kPa",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Boyle's law shows that pressure and volume are inversely proportional when temperature is constant.",

      steps: [
        "Use P₁V₁ = P₂V₂.",
        "P₁ = 100 kPa and V₁ = 2.0 m³.",
        "V₂ = 1.0 m³.",
        "Therefore, P₂ = P₁V₁/V₂.",
        "P₂ = (100 × 2.0) / 1.0.",
        "Therefore, P₂ = 200 kPa.",
      ],
    },
  },

  {
    id: "physics-gaslaws-007",

    question:
      "A gas is contained in a sealed vessel. If its temperature is increased while its volume remains constant, the pressure increases because",

    options: [
      {
        id: "A",
        text: "the gas molecules become larger",
      },
      {
        id: "B",
        text: "the molecules collide more frequently with the walls",
      },
      {
        id: "C",
        text: "the number of molecules decreases",
      },
      {
        id: "D",
        text: "the volume of the vessel increases",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Increasing the temperature of a gas increases the average kinetic energy of its molecules.",

      steps: [
        "Heating the gas makes its molecules move faster.",
        "The faster molecules collide with the container walls more frequently.",
        "The collisions also occur with greater momentum.",
        "This produces a greater pressure on the walls.",
        "Therefore, the correct answer is that the molecules collide more frequently with the walls.",
      ],
    },
  },

  {
    id: "physics-gaslaws-008",

    question:
      "At constant pressure, a gas occupies 500 cm³ at 300 K. What volume will it occupy at 450 K?",

    options: [
      {
        id: "A",
        text: "250 cm³",
      },
      {
        id: "B",
        text: "500 cm³",
      },
      {
        id: "C",
        text: "650 cm³",
      },
      {
        id: "D",
        text: "750 cm³",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Charles' law states that volume is directly proportional to absolute temperature at constant pressure.",

      steps: [
        "Use V₁/T₁ = V₂/T₂.",
        "V₁ = 500 cm³.",
        "T₁ = 300 K and T₂ = 450 K.",
        "Therefore, V₂ = V₁T₂/T₁.",
        "V₂ = (500 × 450) / 300.",
        "Therefore, V₂ = 750 cm³.",
      ],
    },
  },

  {
    id: "physics-gaslaws-009",

    question:
      "Which of the following statements correctly describes Boyle's law?",

    options: [
      {
        id: "A",
        text: "Pressure is directly proportional to volume at constant temperature",
      },
      {
        id: "B",
        text: "Pressure is inversely proportional to volume at constant temperature",
      },
      {
        id: "C",
        text: "Volume is directly proportional to temperature at constant pressure",
      },
      {
        id: "D",
        text: "Pressure is directly proportional to temperature at constant volume",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Boyle's law describes the pressure-volume relationship of a fixed mass of gas at constant temperature.",

      steps: [
        "For Boyle's law, temperature remains constant.",
        "When the volume decreases, the pressure increases.",
        "When the volume increases, the pressure decreases.",
        "Therefore, pressure is inversely proportional to volume.",
        "Hence, option B is correct.",
      ],
    },
  },

  {
    id: "physics-gaslaws-010",

    question:
      "A gas has a pressure of 120 kPa at 300 K. If its volume remains constant and its temperature is increased to 450 K, what is the new pressure?",

    options: [
      {
        id: "A",
        text: "80 kPa",
      },
      {
        id: "B",
        text: "160 kPa",
      },
      {
        id: "C",
        text: "180 kPa",
      },
      {
        id: "D",
        text: "240 kPa",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "At constant volume, pressure is directly proportional to absolute temperature.",

      steps: [
        "Use P₁/T₁ = P₂/T₂.",
        "P₁ = 120 kPa.",
        "T₁ = 300 K and T₂ = 450 K.",
        "Therefore, P₂ = P₁T₂/T₁.",
        "P₂ = (120 × 450) / 300.",
        "Therefore, P₂ = 180 kPa.",
      ],
    },
  },
];

export default gasLawsQuestions;
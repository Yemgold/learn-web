


// C:\Users\Lara Spellman\Jamb\jamb-league\src\data\questions\Physics\19-ElectricCurrent\index.ts

import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — ELECTRIC CURRENT                                                 */
/* -------------------------------------------------------------------------- */

export const electricCurrentQuestions: ArenaQuestion[] = [
  {
    id: "physics-electric-current-001",

    question:
      "Which of the following is the SI unit of electric current?",

    options: [
      {
        id: "A",
        text: "Volt",
      },
      {
        id: "B",
        text: "Ohm",
      },
      {
        id: "C",
        text: "Ampere",
      },
      {
        id: "D",
        text: "Coulomb",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electric current is the rate at which electric charge flows through a conductor.",

      steps: [
        "Electric current is measured in amperes.",
        "The ampere is the SI unit of electric current.",
        "The volt is the unit of potential difference.",
        "The ohm is the unit of resistance.",
        "Therefore, the correct answer is Ampere.",
      ],
    },
  },

  {
    id: "physics-electric-current-002",

    question:
      "A current of 2 A flows through a conductor for 5 seconds. What quantity of charge passes through the conductor?",

    options: [
      {
        id: "A",
        text: "0.4 C",
      },
      {
        id: "B",
        text: "2.5 C",
      },
      {
        id: "C",
        text: "7 C",
      },
      {
        id: "D",
        text: "10 C",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "The quantity of electric charge is related to current and time by Q = It.",

      steps: [
        "The formula is Q = It.",
        "The current I is 2 A.",
        "The time t is 5 s.",
        "Substitute the values: Q = 2 × 5.",
        "Therefore, Q = 10 C.",
      ],
    },
  },

  {
    id: "physics-electric-current-003",

    question:
      "Which instrument is used to measure electric current in a circuit?",

    options: [
      {
        id: "A",
        text: "Voltmeter",
      },
      {
        id: "B",
        text: "Ammeter",
      },
      {
        id: "C",
        text: "Galvanometer",
      },
      {
        id: "D",
        text: "Thermometer",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An ammeter is designed to measure the electric current flowing through a circuit.",

      steps: [
        "Electric current is measured in amperes.",
        "An ammeter is the instrument used to measure current.",
        "A voltmeter measures potential difference.",
        "A thermometer measures temperature.",
        "Therefore, the correct answer is Ammeter.",
      ],
    },
  },

  {
    id: "physics-electric-current-004",

    question:
      "How should an ammeter be connected in an electrical circuit to measure current?",

    options: [
      {
        id: "A",
        text: "In parallel with the component",
      },
      {
        id: "B",
        text: "In series with the component",
      },
      {
        id: "C",
        text: "Across the battery only",
      },
      {
        id: "D",
        text: "Without completing the circuit",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An ammeter measures the current passing through a component, so it must be placed in the same path as the current.",

      steps: [
        "Current flows through the components of a series path.",
        "An ammeter must therefore be connected in series.",
        "Connecting it in parallel is not the correct arrangement for normal current measurement.",
        "Therefore, the correct answer is In series with the component.",
      ],
    },
  },

  {
    id: "physics-electric-current-005",

    question:
      "Which of the following materials is generally a good conductor of electricity?",

    options: [
      {
        id: "A",
        text: "Copper",
      },
      {
        id: "B",
        text: "Rubber",
      },
      {
        id: "C",
        text: "Glass",
      },
      {
        id: "D",
        text: "Plastic",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Metals such as copper contain many free electrons that allow electric charge to flow easily.",

      steps: [
        "A good conductor allows electric charge to flow easily.",
        "Copper is a metal and is an excellent conductor of electricity.",
        "Rubber, glass and plastic are generally electrical insulators.",
        "Therefore, the correct answer is Copper.",
      ],
    },
  },

  {
    id: "physics-electric-current-006",

    question:
      "A resistor has a resistance of 5 Ω and a current of 2 A flows through it. What is the potential difference across the resistor?",

    options: [
      {
        id: "A",
        text: "2.5 V",
      },
      {
        id: "B",
        text: "5 V",
      },
      {
        id: "C",
        text: "10 V",
      },
      {
        id: "D",
        text: "25 V",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Ohm's law relates potential difference, current and resistance.",

      steps: [
        "Ohm's law is V = IR.",
        "The resistance R is 5 Ω.",
        "The current I is 2 A.",
        "Substitute the values: V = 2 × 5.",
        "Therefore, the potential difference is 10 V.",
      ],
    },
  },

  {
    id: "physics-electric-current-007",

    question:
      "Which of the following equations represents Ohm's law?",

    options: [
      {
        id: "A",
        text: "V = IR",
      },
      {
        id: "B",
        text: "P = VI",
      },
      {
        id: "C",
        text: "Q = It",
      },
      {
        id: "D",
        text: "E = Pt",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Ohm's law states that the potential difference across a conductor is proportional to the current through it when physical conditions remain constant.",

      steps: [
        "Ohm's law relates voltage, current and resistance.",
        "The relationship is V = IR.",
        "V represents potential difference.",
        "I represents current and R represents resistance.",
        "Therefore, the correct answer is V = IR.",
      ],
    },
  },

  {
    id: "physics-electric-current-008",

    question:
      "Two resistors of 4 Ω and 6 Ω are connected in series. What is their total resistance?",

    options: [
      {
        id: "A",
        text: "2 Ω",
      },
      {
        id: "B",
        text: "5 Ω",
      },
      {
        id: "C",
        text: "10 Ω",
      },
      {
        id: "D",
        text: "24 Ω",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "For resistors connected in series, the total resistance is the sum of the individual resistances.",

      steps: [
        "The first resistance is 4 Ω.",
        "The second resistance is 6 Ω.",
        "For series resistors, Rₜ = R₁ + R₂.",
        "Therefore, Rₜ = 4 + 6 = 10 Ω.",
        "The correct answer is 10 Ω.",
      ],
    },
  },

  {
    id: "physics-electric-current-009",

    question:
      "Two resistors are connected in parallel. Which statement about the total resistance is correct?",

    options: [
      {
        id: "A",
        text: "It is greater than both resistors",
      },
      {
        id: "B",
        text: "It is equal to the larger resistor",
      },
      {
        id: "C",
        text: "It is less than the smallest resistor",
      },
      {
        id: "D",
        text: "It is always zero",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Parallel resistors provide more than one path for current, resulting in a lower equivalent resistance.",

      steps: [
        "For resistors in parallel, current has multiple paths through the circuit.",
        "The equivalent resistance is lower than the resistance of each individual branch.",
        "Therefore, the total resistance is less than the smallest resistor.",
        "The correct answer is It is less than the smallest resistor.",
      ],
    },
  },

  {
    id: "physics-electric-current-010",

    question:
      "A 12 V battery is connected to a resistor of resistance 4 Ω. What current flows through the resistor?",

    options: [
      {
        id: "A",
        text: "0.33 A",
      },
      {
        id: "B",
        text: "3 A",
      },
      {
        id: "C",
        text: "8 A",
      },
      {
        id: "D",
        text: "48 A",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Ohm's law can be used to calculate the current when voltage and resistance are known.",

      steps: [
        "Ohm's law is V = IR.",
        "Rearrange the equation to obtain I = V/R.",
        "The voltage V is 12 V.",
        "The resistance R is 4 Ω.",
        "Therefore, I = 12/4 = 3 A.",
      ],
    },
  },
];

export default electricCurrentQuestions;
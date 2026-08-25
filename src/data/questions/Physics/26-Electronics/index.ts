


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — ELECTRONICS                                                      */
/* -------------------------------------------------------------------------- */

export const electronicsQuestions: ArenaQuestion[] = [
  {
    id: "physics-electronics-001",

    question:
      "Which of the following electronic components is used to control the flow of electric current in a circuit?",

    options: [
      {
        id: "A",
        text: "Transistor",
      },
      {
        id: "B",
        text: "Resistor",
      },
      {
        id: "C",
        text: "Capacitor",
      },
      {
        id: "D",
        text: "Diode",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A transistor is a semiconductor device that can be used to control or amplify electrical signals.",

      steps: [
        "A transistor is a semiconductor electronic component.",
        "It can be used as a switch to control current.",
        "It can also be used to amplify electrical signals.",
        "Therefore, the correct answer is Transistor.",
      ],
    },
  },

  {
    id: "physics-electronics-002",

    question:
      "Which electronic component allows electric current to flow mainly in one direction?",

    options: [
      {
        id: "A",
        text: "Resistor",
      },
      {
        id: "B",
        text: "Capacitor",
      },
      {
        id: "C",
        text: "Diode",
      },
      {
        id: "D",
        text: "Transformer",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A diode is a semiconductor device that permits current to flow predominantly in one direction.",

      steps: [
        "A diode has two terminals.",
        "When correctly forward-biased, it allows current to flow through it.",
        "When reverse-biased, it greatly restricts current flow.",
        "Therefore, the correct answer is Diode.",
      ],
    },
  },

  {
    id: "physics-electronics-003",

    question:
      "Which of the following materials is commonly used as a semiconductor?",

    options: [
      {
        id: "A",
        text: "Copper",
      },
      {
        id: "B",
        text: "Silicon",
      },
      {
        id: "C",
        text: "Aluminium",
      },
      {
        id: "D",
        text: "Iron",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Silicon is one of the most widely used semiconductor materials in electronic devices.",

      steps: [
        "Semiconductors have electrical conductivity between that of conductors and insulators.",
        "Silicon has useful semiconductor properties.",
        "It is widely used in diodes, transistors and integrated circuits.",
        "Therefore, the correct answer is Silicon.",
      ],
    },
  },

  {
    id: "physics-electronics-004",

    question:
      "What is the main function of a resistor in an electronic circuit?",

    options: [
      {
        id: "A",
        text: "To store electric charge",
      },
      {
        id: "B",
        text: "To limit electric current",
      },
      {
        id: "C",
        text: "To produce magnetic fields only",
      },
      {
        id: "D",
        text: "To convert AC directly into mechanical energy",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A resistor provides opposition to the flow of electric current.",

      steps: [
        "Resistance opposes the flow of electric charge.",
        "A resistor therefore limits the current in a circuit.",
        "The resistor can also produce a voltage drop.",
        "Therefore, the correct answer is To limit electric current.",
      ],
    },
  },

  {
    id: "physics-electronics-005",

    question:
      "Which electronic component is primarily used for storing electrical charge?",

    options: [
      {
        id: "A",
        text: "Capacitor",
      },
      {
        id: "B",
        text: "Diode",
      },
      {
        id: "C",
        text: "Transistor",
      },
      {
        id: "D",
        text: "Resistor",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A capacitor stores electrical energy in an electric field between its conductors.",

      steps: [
        "A capacitor consists of conductors separated by an insulating material.",
        "When connected to a source, charge accumulates on its plates.",
        "Energy is stored in the electric field between the plates.",
        "Therefore, the correct answer is Capacitor.",
      ],
    },
  },

  {
    id: "physics-electronics-006",

    question:
      "A diode is said to be forward biased when",

    options: [
      {
        id: "A",
        text: "its p-type region is connected to the negative terminal",
      },
      {
        id: "B",
        text: "its n-type region is connected to the positive terminal",
      },
      {
        id: "C",
        text: "its p-type region is connected to the positive terminal",
      },
      {
        id: "D",
        text: "both terminals are connected to the negative terminal",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A p-n junction diode is forward biased when the p-type side is connected to the positive terminal and the n-type side to the negative terminal.",

      steps: [
        "A diode contains p-type and n-type semiconductor regions.",
        "Forward bias reduces the barrier at the junction.",
        "The p-type region is connected to the positive terminal.",
        "The n-type region is connected to the negative terminal.",
        "Therefore, the correct answer is its p-type region is connected to the positive terminal.",
      ],
    },
  },

  {
    id: "physics-electronics-007",

    question:
      "Which of the following is an important application of a transistor?",

    options: [
      {
        id: "A",
        text: "Amplification of signals",
      },
      {
        id: "B",
        text: "Measurement of temperature only",
      },
      {
        id: "C",
        text: "Production of mechanical friction",
      },
      {
        id: "D",
        text: "Storage of water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Transistors are widely used as amplifiers and electronic switches.",

      steps: [
        "A transistor can control a larger current using a smaller controlling signal.",
        "This property allows it to amplify electrical signals.",
        "Transistors are also widely used as switches in digital circuits.",
        "Therefore, the correct answer is Amplification of signals.",
      ],
    },
  },

  {
    id: "physics-electronics-008",

    question:
      "Which of the following is a major advantage of an integrated circuit?",

    options: [
      {
        id: "A",
        text: "It requires very large physical space",
      },
      {
        id: "B",
        text: "It contains many electronic components on a small chip",
      },
      {
        id: "C",
        text: "It can only operate with mechanical energy",
      },
      {
        id: "D",
        text: "It cannot be used in digital devices",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An integrated circuit combines many electronic components on a small semiconductor chip.",

      steps: [
        "An integrated circuit is manufactured on a semiconductor material.",
        "It can contain transistors, resistors and other components.",
        "These components are interconnected on a small chip.",
        "This makes electronic systems smaller and more compact.",
        "Therefore, the correct answer is It contains many electronic components on a small chip.",
      ],
    },
  },

  {
    id: "physics-electronics-009",

    question:
      "Which logic gate gives an output of 1 only when all its inputs are 1?",

    options: [
      {
        id: "A",
        text: "OR gate",
      },
      {
        id: "B",
        text: "NOT gate",
      },
      {
        id: "C",
        text: "AND gate",
      },
      {
        id: "D",
        text: "NOR gate",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "An AND gate produces a high output only when all of its inputs are high.",

      steps: [
        "A logic gate processes binary inputs.",
        "An AND gate gives an output of 1 when every input is 1.",
        "If any input is 0, the output is 0.",
        "Therefore, the correct answer is AND gate.",
      ],
    },
  },

  {
    id: "physics-electronics-010",

    question:
      "Which logic gate produces an output that is the opposite of its input?",

    options: [
      {
        id: "A",
        text: "AND gate",
      },
      {
        id: "B",
        text: "OR gate",
      },
      {
        id: "C",
        text: "NOT gate",
      },
      {
        id: "D",
        text: "AND-OR gate",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A NOT gate reverses the logical state of its input.",

      steps: [
        "A NOT gate has one input and one output.",
        "When the input is 1, the output is 0.",
        "When the input is 0, the output is 1.",
        "Therefore, the correct answer is NOT gate.",
      ],
    },
  },
];

export default electronicsQuestions;
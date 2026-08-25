


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — ELECTRIC FIELDS                                                  */
/* -------------------------------------------------------------------------- */

export const electricFieldsQuestions: ArenaQuestion[] = [
  {
    id: "physics-electric-fields-001",

    question:
      "Which of the following is the SI unit of electric field intensity?",

    options: [
      {
        id: "A",
        text: "Coulomb",
      },
      {
        id: "B",
        text: "Volt",
      },
      {
        id: "C",
        text: "Newton per coulomb",
      },
      {
        id: "D",
        text: "Joule",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electric field intensity is defined as the force experienced per unit positive charge placed in an electric field.",

      steps: [
        "Electric field intensity is given by E = F/Q.",
        "Force is measured in newtons (N).",
        "Electric charge is measured in coulombs (C).",
        "Therefore, the SI unit is newton per coulomb (N/C).",
        "Hence, the correct answer is Newton per coulomb.",
      ],
    },
  },

  {
    id: "physics-electric-fields-002",

    question:
      "A charge of 2 C experiences a force of 10 N in an electric field. What is the electric field intensity?",

    options: [
      {
        id: "A",
        text: "2 N/C",
      },
      {
        id: "B",
        text: "5 N/C",
      },
      {
        id: "C",
        text: "10 N/C",
      },
      {
        id: "D",
        text: "20 N/C",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Electric field intensity is the force acting on a unit positive charge.",

      steps: [
        "Use the formula E = F/Q.",
        "The force is 10 N.",
        "The charge is 2 C.",
        "Substitute the values: E = 10/2.",
        "Therefore, E = 5 N/C.",
      ],
    },
  },

  {
    id: "physics-electric-fields-003",

    question:
      "Which of the following correctly describes the direction of an electric field at a point?",

    options: [
      {
        id: "A",
        text: "The direction of motion of an electron",
      },
      {
        id: "B",
        text: "The direction of force on a positive test charge",
      },
      {
        id: "C",
        text: "The direction of force on a negative charge",
      },
      {
        id: "D",
        text: "The direction of movement of any charged particle",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The direction of an electric field is defined using a positive test charge.",

      steps: [
        "An electric field exerts a force on charged particles.",
        "By convention, the field direction is the direction of force on a positive test charge.",
        "A negative charge experiences a force opposite to the field direction.",
        "Therefore, the correct answer is the direction of force on a positive test charge.",
      ],
    },
  },

  {
    id: "physics-electric-fields-004",

    question:
      "Electric field lines around an isolated positive charge are directed",

    options: [
      {
        id: "A",
        text: "Towards the charge",
      },
      {
        id: "B",
        text: "Away from the charge",
      },
      {
        id: "C",
        text: "Parallel to the charge",
      },
      {
        id: "D",
        text: "In circular paths around the charge",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Electric field lines show the direction in which a positive test charge would move.",

      steps: [
        "A positive charge repels another positive charge.",
        "Therefore, a positive test charge placed near an isolated positive charge is pushed away.",
        "Electric field lines around a positive charge therefore point outward.",
        "Hence, the correct answer is Away from the charge.",
      ],
    },
  },

  {
    id: "physics-electric-fields-005",

    question:
      "Electric field lines around an isolated negative charge are directed",

    options: [
      {
        id: "A",
        text: "Away from the charge",
      },
      {
        id: "B",
        text: "Towards the charge",
      },
      {
        id: "C",
        text: "Parallel to the charge",
      },
      {
        id: "D",
        text: "In circular paths around the charge",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A negative charge attracts a positive test charge.",

      steps: [
        "Electric field direction is defined as the direction of force on a positive test charge.",
        "A negative charge attracts a positive test charge.",
        "Therefore, the field lines point towards the negative charge.",
        "Hence, the correct answer is Towards the charge.",
      ],
    },
  },

  {
    id: "physics-electric-fields-006",

    question:
      "Two point charges are separated by a distance. If the distance between them is doubled, the electrostatic force between them becomes",

    options: [
      {
        id: "A",
        text: "Twice as large",
      },
      {
        id: "B",
        text: "Four times as large",
      },
      {
        id: "C",
        text: "One-half as large",
      },
      {
        id: "D",
        text: "One-quarter as large",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "According to Coulomb's law, electrostatic force is inversely proportional to the square of the distance between two charges.",

      steps: [
        "Coulomb's law gives F ∝ 1/r².",
        "If the distance is doubled, the new distance is 2r.",
        "The new force is proportional to 1/(2r)².",
        "This becomes 1/(4r²).",
        "Therefore, the force becomes one-quarter of its original value.",
      ],
    },
  },

  {
    id: "physics-electric-fields-007",

    question:
      "Which of the following statements about electric field lines is correct?",

    options: [
      {
        id: "A",
        text: "Electric field lines can cross one another",
      },
      {
        id: "B",
        text: "Electric field lines always form closed loops",
      },
      {
        id: "C",
        text: "Electric field lines are closer together where the field is stronger",
      },
      {
        id: "D",
        text: "Electric field lines have no direction",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The density of electric field lines represents the relative strength of an electric field.",

      steps: [
        "Electric field lines are used to represent electric fields visually.",
        "A region with closely spaced field lines represents a stronger field.",
        "A region with widely spaced field lines represents a weaker field.",
        "Field lines cannot cross because that would imply two field directions at the same point.",
        "Therefore, the correct answer is that field lines are closer together where the field is stronger.",
      ],
    },
  },

  {
    id: "physics-electric-fields-008",

    question:
      "Two like charges placed near each other will",

    options: [
      {
        id: "A",
        text: "Attract each other",
      },
      {
        id: "B",
        text: "Repel each other",
      },
      {
        id: "C",
        text: "Produce no force",
      },
      {
        id: "D",
        text: "Always move towards each other",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Like electric charges repel each other, while unlike charges attract each other.",

      steps: [
        "Like charges have the same sign.",
        "Two positive charges repel each other.",
        "Two negative charges also repel each other.",
        "Therefore, like charges exert a repulsive force on each other.",
      ],
    },
  },

  {
    id: "physics-electric-fields-009",

    question:
      "Two unlike charges placed near each other will",

    options: [
      {
        id: "A",
        text: "Repel each other",
      },
      {
        id: "B",
        text: "Attract each other",
      },
      {
        id: "C",
        text: "Produce no electric force",
      },
      {
        id: "D",
        text: "Always have equal charges",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Unlike electric charges exert attractive forces on each other.",

      steps: [
        "Unlike charges have opposite signs.",
        "A positive charge and a negative charge attract each other.",
        "The force between them is electrostatic.",
        "Therefore, unlike charges attract each other.",
      ],
    },
  },

  {
    id: "physics-electric-fields-010",

    question:
      "Which instrument is commonly used to detect the presence of electric charge?",

    options: [
      {
        id: "A",
        text: "Ammeter",
      },
      {
        id: "B",
        text: "Electroscope",
      },
      {
        id: "C",
        text: "Voltmeter",
      },
      {
        id: "D",
        text: "Galvanometer",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An electroscope is a device used to detect the presence of electric charge.",

      steps: [
        "An electroscope responds to the presence of electric charge.",
        "When charged, its conducting parts show a separation due to electrostatic repulsion.",
        "An ammeter measures electric current.",
        "A voltmeter measures potential difference.",
        "Therefore, the correct answer is Electroscope.",
      ],
    },
  },
];

export default electricFieldsQuestions;
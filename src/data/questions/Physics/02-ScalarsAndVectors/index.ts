


import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — SCALARS AND VECTORS
// --------------------------------------------------------------------------

export const scalarsAndVectorsQuestions: ArenaQuestion[] = [
  {
    id: "physics-scalars-vectors-001",

    question:
      "Which of the following physical quantities is a scalar quantity?",

    options: [
      {
        id: "A",
        text: "Velocity",
      },
      {
        id: "B",
        text: "Displacement",
      },
      {
        id: "C",
        text: "Force",
      },
      {
        id: "D",
        text: "Speed",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "A scalar quantity has magnitude only, while a vector quantity has both magnitude and direction.",

      steps: [
        "Speed describes how fast an object moves.",
        "Speed has magnitude but no direction.",
        "Velocity, displacement and force have both magnitude and direction.",
        "Therefore, speed is a scalar quantity.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-002",

    question:
      "Which of the following quantities is a vector quantity?",

    options: [
      {
        id: "A",
        text: "Mass",
      },
      {
        id: "B",
        text: "Time",
      },
      {
        id: "C",
        text: "Velocity",
      },
      {
        id: "D",
        text: "Temperature",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Velocity is a vector quantity because it has both magnitude and direction.",

      steps: [
        "Mass has magnitude only.",
        "Time has magnitude only.",
        "Temperature has magnitude only.",
        "Velocity specifies both how fast an object moves and its direction of motion.",
        "Therefore, velocity is the vector quantity.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-003",

    question:
      "A student walks 5 m east and then 5 m west. What is the student's displacement?",

    options: [
      {
        id: "A",
        text: "0 m",
      },
      {
        id: "B",
        text: "5 m",
      },
      {
        id: "C",
        text: "10 m",
      },
      {
        id: "D",
        text: "25 m",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Displacement is the vector distance from the initial position to the final position.",

      steps: [
        "The student moves 5 m east.",
        "The student then moves 5 m west.",
        "The second movement brings the student back to the starting point.",
        "The initial and final positions are therefore the same.",
        "Hence, the displacement is 0 m.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-004",

    question:
      "A boy walks 8 m north and then 6 m south. What is the magnitude of his displacement?",

    options: [
      {
        id: "A",
        text: "2 m",
      },
      {
        id: "B",
        text: "6 m",
      },
      {
        id: "C",
        text: "14 m",
      },
      {
        id: "D",
        text: "48 m",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Displacement depends on the net change in position, taking direction into account.",

      steps: [
        "The boy moves 8 m north.",
        "He then moves 6 m south.",
        "The southward movement opposes the northward movement.",
        "Net displacement = 8 m − 6 m.",
        "Therefore, the magnitude of the displacement is 2 m north.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-005",

    question:
      "Which of the following pairs consists entirely of scalar quantities?",

    options: [
      {
        id: "A",
        text: "Speed and distance",
      },
      {
        id: "B",
        text: "Velocity and acceleration",
      },
      {
        id: "C",
        text: "Force and displacement",
      },
      {
        id: "D",
        text: "Momentum and velocity",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Both speed and distance are scalar quantities because they have magnitude but no direction.",

      steps: [
        "Speed has magnitude only.",
        "Distance also has magnitude only.",
        "Velocity, acceleration, force, displacement and momentum are vector quantities.",
        "Therefore, speed and distance form the correct pair.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-006",

    question:
      "Which of the following is required to completely describe a vector quantity?",

    options: [
      {
        id: "A",
        text: "Magnitude only",
      },
      {
        id: "B",
        text: "Direction only",
      },
      {
        id: "C",
        text: "Magnitude and direction",
      },
      {
        id: "D",
        text: "Unit only",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A vector quantity is completely specified by its magnitude and direction.",

      steps: [
        "Magnitude tells us the size of the quantity.",
        "Direction tells us the orientation or sense of the quantity.",
        "A vector therefore requires both magnitude and direction.",
        "Hence, the correct answer is magnitude and direction.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-007",

    question:
      "A force of 10 N acts towards the east. Which statement correctly describes the force?",

    options: [
      {
        id: "A",
        text: "It is a scalar quantity of magnitude 10 N.",
      },
      {
        id: "B",
        text: "It is a vector quantity of magnitude 10 N directed east.",
      },
      {
        id: "C",
        text: "It is a scalar quantity directed east.",
      },
      {
        id: "D",
        text: "It has no magnitude.",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Force is a vector quantity because it has both magnitude and direction.",

      steps: [
        "The magnitude of the force is 10 N.",
        "Its direction is east.",
        "Force therefore requires both magnitude and direction for complete description.",
        "Hence, it is a vector quantity of magnitude 10 N directed east.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-008",

    question:
      "Two forces of 6 N and 8 N act at right angles to each other. What is the magnitude of their resultant force?",

    options: [
      {
        id: "A",
        text: "2 N",
      },
      {
        id: "B",
        text: "10 N",
      },
      {
        id: "C",
        text: "14 N",
      },
      {
        id: "D",
        text: "48 N",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Perpendicular vectors can be combined using Pythagoras' theorem.",

      steps: [
        "The two forces are 6 N and 8 N.",
        "They act at right angles.",
        "Resultant force = √(6² + 8²).",
        "Resultant force = √(36 + 64).",
        "Resultant force = √100 = 10 N.",
        "Therefore, the magnitude of the resultant force is 10 N.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-009",

    question:
      "A car travels 30 km east and then 40 km north. What is the magnitude of its displacement?",

    options: [
      {
        id: "A",
        text: "10 km",
      },
      {
        id: "B",
        text: "50 km",
      },
      {
        id: "C",
        text: "70 km",
      },
      {
        id: "D",
        text: "1,200 km",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The eastward and northward movements form perpendicular components of the displacement.",

      steps: [
        "The eastward component is 30 km.",
        "The northward component is 40 km.",
        "Using Pythagoras' theorem, displacement = √(30² + 40²).",
        "Displacement = √(900 + 1600).",
        "Displacement = √2500.",
        "Therefore, the magnitude of the displacement is 50 km.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-010",

    question:
      "Which of the following quantities cannot be represented completely by a number and a unit alone?",

    options: [
      {
        id: "A",
        text: "Mass",
      },
      {
        id: "B",
        text: "Temperature",
      },
      {
        id: "C",
        text: "Time",
      },
      {
        id: "D",
        text: "Displacement",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "A vector quantity requires both magnitude and direction for complete description.",

      steps: [
        "Mass is a scalar quantity.",
        "Temperature is a scalar quantity.",
        "Time is a scalar quantity.",
        "Displacement is a vector quantity.",
        "Therefore, displacement cannot be completely described by a number and unit alone.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-011",

    question:
      "Two vectors of magnitudes 5 units and 12 units act in the same direction. What is the magnitude of their resultant?",

    options: [
      {
        id: "A",
        text: "7 units",
      },
      {
        id: "B",
        text: "13 units",
      },
      {
        id: "C",
        text: "17 units",
      },
      {
        id: "D",
        text: "60 units",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Vectors acting in the same direction are added directly.",

      steps: [
        "The first vector has magnitude 5 units.",
        "The second vector has magnitude 12 units.",
        "Both vectors act in the same direction.",
        "Resultant = 5 + 12.",
        "Therefore, the resultant has magnitude 17 units.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-012",

    question:
      "Two vectors of magnitudes 15 N and 9 N act in opposite directions. What is the magnitude of their resultant?",

    options: [
      {
        id: "A",
        text: "6 N",
      },
      {
        id: "B",
        text: "9 N",
      },
      {
        id: "C",
        text: "15 N",
      },
      {
        id: "D",
        text: "24 N",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "When two vectors act in opposite directions, the smaller magnitude is subtracted from the larger magnitude.",

      steps: [
        "The two forces have magnitudes 15 N and 9 N.",
        "They act in opposite directions.",
        "Resultant = 15 N − 9 N.",
        "Therefore, the magnitude of the resultant is 6 N.",
        "The resultant acts in the direction of the 15 N vector.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-013",

    question:
      "Which of the following quantities is NOT a vector quantity?",

    options: [
      {
        id: "A",
        text: "Acceleration",
      },
      {
        id: "B",
        text: "Momentum",
      },
      {
        id: "C",
        text: "Weight",
      },
      {
        id: "D",
        text: "Energy",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Energy is a scalar quantity because it has magnitude but no direction.",

      steps: [
        "Acceleration has both magnitude and direction.",
        "Momentum has both magnitude and direction.",
        "Weight is a force and therefore has direction.",
        "Energy has magnitude only.",
        "Therefore, energy is not a vector quantity.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-014",

    question:
      "A man walks 3 km east and then 4 km north. What is the direction of his resultant displacement relative to the east?",

    options: [
      {
        id: "A",
        text: "36.9° north of east",
      },
      {
        id: "B",
        text: "53.1° north of east",
      },
      {
        id: "C",
        text: "45° north of east",
      },
      {
        id: "D",
        text: "90° north of east",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The direction of the resultant can be found using the tangent ratio.",

      steps: [
        "The eastward component is 3 km.",
        "The northward component is 4 km.",
        "tan θ = opposite / adjacent = 4 / 3.",
        "Therefore, θ = tan⁻¹(4 / 3).",
        "θ ≈ 53.1°.",
        "Hence, the resultant displacement is 53.1° north of east.",
      ],
    },
  },

  {
    id: "physics-scalars-vectors-015",

    question:
      "Which of the following statements about distance and displacement is correct?",

    options: [
      {
        id: "A",
        text: "Both distance and displacement are vectors.",
      },
      {
        id: "B",
        text: "Distance is a vector while displacement is a scalar.",
      },
      {
        id: "C",
        text: "Distance is a scalar while displacement is a vector.",
      },
      {
        id: "D",
        text: "Both distance and displacement are scalars.",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Distance measures the total path travelled, while displacement measures the directed change in position.",

      steps: [
        "Distance has magnitude only and is therefore a scalar.",
        "Displacement has both magnitude and direction.",
        "Therefore, displacement is a vector.",
        "Hence, distance is scalar while displacement is vector.",
      ],
    },
  },
];

export default scalarsAndVectorsQuestions;
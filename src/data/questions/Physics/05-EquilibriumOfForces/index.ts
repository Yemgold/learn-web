


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — EQUILIBRIUM OF FORCES                                           */
/* -------------------------------------------------------------------------- */

export const equilibriumOfForcesQuestions: ArenaQuestion[] = [
  {
    id: "physics-equilibrium-001",

    question:
      "A body is said to be in equilibrium when the resultant force acting on it is",

    options: [
      {
        id: "A",
        text: "maximum",
      },
      {
        id: "B",
        text: "zero",
      },
      {
        id: "C",
        text: "constant but non-zero",
      },
      {
        id: "D",
        text: "greater than its weight",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A body is in equilibrium when the vector sum of all the forces acting on it is zero.",

      steps: [
        "Equilibrium means there is no resultant force acting on the body.",
        "The forces acting on the body must balance one another.",
        "Therefore, the resultant force is zero.",
        "The correct answer is zero.",
      ],
    },
  },

  {
    id: "physics-equilibrium-002",

    question:
      "A body at rest on a horizontal table is in equilibrium because",

    options: [
      {
        id: "A",
        text: "its weight is greater than the reaction",
      },
      {
        id: "B",
        text: "the reaction is greater than its weight",
      },
      {
        id: "C",
        text: "its weight is equal to the reaction",
      },
      {
        id: "D",
        text: "there is no force acting on it",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The body remains at rest because the upward reaction from the table balances its downward weight.",

      steps: [
        "The weight of the body acts vertically downward.",
        "The table exerts an upward normal reaction on the body.",
        "For equilibrium, the upward and downward forces must be equal.",
        "Therefore, the weight is equal to the reaction.",
      ],
    },
  },

  {
    id: "physics-equilibrium-003",

    question:
      "A force of 10 N acts eastward on a body. What force must act on the body to keep it in equilibrium?",

    options: [
      {
        id: "A",
        text: "10 N eastward",
      },
      {
        id: "B",
        text: "5 N westward",
      },
      {
        id: "C",
        text: "10 N westward",
      },
      {
        id: "D",
        text: "20 N eastward",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "For a body to remain in equilibrium, the opposing force must have the same magnitude.",

      steps: [
        "A force of 10 N acts eastward.",
        "The resultant force must be zero.",
        "Therefore, an equal force must act in the opposite direction.",
        "The opposite direction to east is west.",
        "Hence, the required force is 10 N westward.",
      ],
    },
  },

  {
    id: "physics-equilibrium-004",

    question:
      "Three forces of 5 N, 7 N and 12 N act along the same straight line. If the body is in equilibrium, which statement is correct?",

    options: [
      {
        id: "A",
        text: "All three forces must act in the same direction",
      },
      {
        id: "B",
        text: "The resultant of the forces must be zero",
      },
      {
        id: "C",
        text: "The largest force must act alone",
      },
      {
        id: "D",
        text: "The total force must be 24 N",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The defining condition for translational equilibrium is that the resultant force is zero.",

      steps: [
        "Equilibrium requires the vector sum of all forces to be zero.",
        "Forces acting along a straight line may oppose one another.",
        "Their algebraic sum must therefore equal zero.",
        "Hence, the resultant of the forces must be zero.",
      ],
    },
  },

  {
    id: "physics-equilibrium-005",

    question:
      "A 20 N weight is suspended by a string. What is the tension in the string if the weight is stationary?",

    options: [
      {
        id: "A",
        text: "0 N",
      },
      {
        id: "B",
        text: "10 N",
      },
      {
        id: "C",
        text: "20 N",
      },
      {
        id: "D",
        text: "40 N",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "When a suspended object is stationary, the upward tension balances its downward weight.",

      steps: [
        "The weight of the object is 20 N downward.",
        "The tension in the string acts upward.",
        "The object is stationary, so the resultant force is zero.",
        "Therefore, the tension must equal the weight.",
        "Hence, the tension is 20 N.",
      ],
    },
  },

  {
    id: "physics-equilibrium-006",

    question:
      "Which of the following conditions is necessary for a body to be in translational equilibrium?",

    options: [
      {
        id: "A",
        text: "The resultant force must be zero",
      },
      {
        id: "B",
        text: "The body must always be moving",
      },
      {
        id: "C",
        text: "The body must have zero mass",
      },
      {
        id: "D",
        text: "The body must have maximum acceleration",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Translational equilibrium occurs when there is no resultant force producing linear acceleration.",

      steps: [
        "According to Newton's second law, a net force produces acceleration.",
        "For translational equilibrium, the acceleration is zero.",
        "Therefore, the resultant force must be zero.",
        "The correct answer is that the resultant force must be zero.",
      ],
    },
  },

  {
    id: "physics-equilibrium-007",

    question:
      "Two horizontal forces of 15 N and 10 N act in opposite directions on a body. What is the magnitude of the resultant force?",

    options: [
      {
        id: "A",
        text: "5 N",
      },
      {
        id: "B",
        text: "10 N",
      },
      {
        id: "C",
        text: "15 N",
      },
      {
        id: "D",
        text: "25 N",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Opposing forces are combined by subtracting the smaller force from the larger force.",

      steps: [
        "The larger force is 15 N.",
        "The smaller opposing force is 10 N.",
        "Resultant force = 15 N − 10 N.",
        "Therefore, the resultant force is 5 N.",
        "The resultant acts in the direction of the 15 N force.",
      ],
    },
  },

  {
    id: "physics-equilibrium-008",

    question:
      "A uniform metre rule is balanced at its centre of gravity. Which condition is satisfied?",

    options: [
      {
        id: "A",
        text: "The clockwise moment equals the anticlockwise moment",
      },
      {
        id: "B",
        text: "The clockwise moment is greater",
      },
      {
        id: "C",
        text: "The anticlockwise moment is greater",
      },
      {
        id: "D",
        text: "There is no gravitational force",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Rotational equilibrium requires the total clockwise moment to equal the total anticlockwise moment.",

      steps: [
        "A balanced object has no tendency to rotate.",
        "The turning effects about the pivot must therefore balance.",
        "The sum of clockwise moments must equal the sum of anticlockwise moments.",
        "Therefore, the clockwise moment equals the anticlockwise moment.",
      ],
    },
  },

  {
    id: "physics-equilibrium-009",

    question:
      "The turning effect of a force about a pivot is known as",

    options: [
      {
        id: "A",
        text: "moment",
      },
      {
        id: "B",
        text: "momentum",
      },
      {
        id: "C",
        text: "impulse",
      },
      {
        id: "D",
        text: "pressure",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The turning effect produced by a force about a point or pivot is called the moment of the force.",

      steps: [
        "A force can cause an object to rotate about a pivot.",
        "This rotational effect is called the moment of the force.",
        "It depends on the force and its perpendicular distance from the pivot.",
        "Therefore, the correct answer is moment.",
      ],
    },
  },

  {
    id: "physics-equilibrium-010",

    question:
      "A force of 20 N acts perpendicularly at a distance of 0.5 m from a pivot. What is the moment of the force?",

    options: [
      {
        id: "A",
        text: "5 Nm",
      },
      {
        id: "B",
        text: "10 Nm",
      },
      {
        id: "C",
        text: "20 Nm",
      },
      {
        id: "D",
        text: "40 Nm",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The moment of a force is calculated by multiplying the force by its perpendicular distance from the pivot.",

      steps: [
        "The force is 20 N.",
        "The perpendicular distance from the pivot is 0.5 m.",
        "Moment = force × perpendicular distance.",
        "Moment = 20 × 0.5.",
        "Therefore, the moment is 10 Nm.",
      ],
    },
  },

  {
    id: "physics-equilibrium-011",

    question:
      "A body is in rotational equilibrium when",

    options: [
      {
        id: "A",
        text: "the resultant moment about any point is zero",
      },
      {
        id: "B",
        text: "its mass is zero",
      },
      {
        id: "C",
        text: "its weight is zero",
      },
      {
        id: "D",
        text: "only one force acts on it",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Rotational equilibrium means the body has no net turning effect.",

      steps: [
        "A body in rotational equilibrium has no angular acceleration.",
        "The clockwise and anticlockwise turning effects must balance.",
        "Therefore, the resultant moment about a point is zero.",
        "Hence, option A is correct.",
      ],
    },
  },

  {
    id: "physics-equilibrium-012",

    question:
      "Which of the following forces can produce the greatest turning effect about a pivot?",

    options: [
      {
        id: "A",
        text: "A small force acting far from the pivot",
      },
      {
        id: "B",
        text: "A large force acting far from the pivot",
      },
      {
        id: "C",
        text: "A large force acting at the pivot",
      },
      {
        id: "D",
        text: "A small force acting at the pivot",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The turning effect increases with both the magnitude of the force and its perpendicular distance from the pivot.",

      steps: [
        "A larger force produces a greater turning effect.",
        "A greater perpendicular distance from the pivot also produces a greater turning effect.",
        "Therefore, a large force acting far from the pivot produces the greatest turning effect.",
        "The correct answer is option B.",
      ],
    },
  },

  {
    id: "physics-equilibrium-013",

    question:
      "A 30 N force acts at a perpendicular distance of 2 m from a pivot. Calculate its moment.",

    options: [
      {
        id: "A",
        text: "15 Nm",
      },
      {
        id: "B",
        text: "30 Nm",
      },
      {
        id: "C",
        text: "60 Nm",
      },
      {
        id: "D",
        text: "90 Nm",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The moment of a force is obtained by multiplying the force by its perpendicular distance from the pivot.",

      steps: [
        "Force = 30 N.",
        "Perpendicular distance = 2 m.",
        "Moment = force × perpendicular distance.",
        "Moment = 30 × 2.",
        "Therefore, the moment is 60 Nm.",
      ],
    },
  },

  {
    id: "physics-equilibrium-014",

    question:
      "A uniform beam is supported at both ends. If the beam is stationary, the upward supporting forces must",

    options: [
      {
        id: "A",
        text: "be greater than the weight of the beam",
      },
      {
        id: "B",
        text: "have a resultant equal to the weight of the beam",
      },
      {
        id: "C",
        text: "be zero",
      },
      {
        id: "D",
        text: "act downward",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "For vertical equilibrium, the total upward supporting force must balance the downward weight.",

      steps: [
        "The beam has a downward gravitational force due to its weight.",
        "The supports provide upward forces.",
        "Since the beam is stationary, the resultant vertical force must be zero.",
        "Therefore, the total upward force must equal the weight of the beam.",
      ],
    },
  },

  {
    id: "physics-equilibrium-015",

    question:
      "A 40 N object is supported by two identical vertical strings. If the object is stationary and the strings share the load equally, what is the tension in each string?",

    options: [
      {
        id: "A",
        text: "10 N",
      },
      {
        id: "B",
        text: "20 N",
      },
      {
        id: "C",
        text: "40 N",
      },
      {
        id: "D",
        text: "80 N",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "When two identical strings share a load equally, each string supports half of the total weight.",

      steps: [
        "The total weight is 40 N.",
        "There are two identical strings sharing the load equally.",
        "Each string therefore supports 40 ÷ 2 N.",
        "The tension in each string is 20 N.",
      ],
    },
  },

  {
    id: "physics-equilibrium-016",

    question:
      "Which of the following is an example of a body in static equilibrium?",

    options: [
      {
        id: "A",
        text: "A car accelerating along a road",
      },
      {
        id: "B",
        text: "A book resting on a table",
      },
      {
        id: "C",
        text: "A stone falling freely",
      },
      {
        id: "D",
        text: "A ball moving in a circle with changing speed",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Static equilibrium describes a body that remains at rest while all acting forces and moments are balanced.",

      steps: [
        "A book resting on a table has no linear acceleration.",
        "Its downward weight is balanced by the upward reaction from the table.",
        "Therefore, it remains at rest.",
        "The book is an example of static equilibrium.",
      ],
    },
  },

  {
    id: "physics-equilibrium-017",

    question:
      "If the resultant force acting on a moving body is zero, the body will",

    options: [
      {
        id: "A",
        text: "stop immediately",
      },
      {
        id: "B",
        text: "accelerate continuously",
      },
      {
        id: "C",
        text: "continue moving with constant velocity",
      },
      {
        id: "D",
        text: "move with increasing speed",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "According to Newton's first law, a body with zero resultant force maintains its state of motion.",

      steps: [
        "Zero resultant force means zero acceleration.",
        "A moving body with zero acceleration maintains its velocity.",
        "Therefore, it continues moving with constant velocity.",
        "The correct answer is option C.",
      ],
    },
  },

  {
    id: "physics-equilibrium-018",

    question:
      "A uniform metre rule has its centre of gravity at the",

    options: [
      {
        id: "A",
        text: "0 cm mark",
      },
      {
        id: "B",
        text: "25 cm mark",
      },
      {
        id: "C",
        text: "50 cm mark",
      },
      {
        id: "D",
        text: "100 cm mark",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "For a uniform object, the centre of gravity is located at its geometric centre.",

      steps: [
        "A metre rule has a length of 100 cm.",
        "Its geometric centre is halfway along its length.",
        "Half of 100 cm is 50 cm.",
        "Therefore, the centre of gravity is at the 50 cm mark.",
      ],
    },
  },

  {
    id: "physics-equilibrium-019",

    question:
      "A force produces no moment about a pivot when its line of action",

    options: [
      {
        id: "A",
        text: "is far from the pivot",
      },
      {
        id: "B",
        text: "passes through the pivot",
      },
      {
        id: "C",
        text: "is perpendicular to the pivot",
      },
      {
        id: "D",
        text: "is parallel to the ground",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A force has zero moment about a pivot when its perpendicular distance from the pivot is zero.",

      steps: [
        "The moment depends on the perpendicular distance between the pivot and the force's line of action.",
        "If the line of action passes through the pivot, that distance is zero.",
        "Therefore, the moment produced is zero.",
        "Hence, the correct answer is that the line of action passes through the pivot.",
      ],
    },
  },

  {
    id: "physics-equilibrium-020",

    question:
      "Which statement correctly describes the principle of moments for a body in equilibrium?",

    options: [
      {
        id: "A",
        text: "The sum of clockwise moments equals the sum of anticlockwise moments",
      },
      {
        id: "B",
        text: "The clockwise moments must always be greater",
      },
      {
        id: "C",
        text: "The anticlockwise moments must always be greater",
      },
      {
        id: "D",
        text: "All forces must act in the same direction",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The principle of moments states that for a body in rotational equilibrium, clockwise and anticlockwise moments about a point are equal.",

      steps: [
        "A body in rotational equilibrium has no net turning effect.",
        "Clockwise turning effects must balance anticlockwise turning effects.",
        "Therefore, the sum of clockwise moments equals the sum of anticlockwise moments.",
        "This is the principle of moments.",
      ],
    },
  },
];

export default equilibriumOfForcesQuestions;
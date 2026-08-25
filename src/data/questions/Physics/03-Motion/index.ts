


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — MOTION                                                           */
/* -------------------------------------------------------------------------- */

export const motionQuestions: ArenaQuestion[] = [
  {
    id: "physics-motion-001",

    question:
      "A car starts from rest and accelerates uniformly at 4 m/s² for 5 seconds. What is its final velocity?",

    options: [
      {
        id: "A",
        text: "5 m/s",
      },
      {
        id: "B",
        text: "10 m/s",
      },
      {
        id: "C",
        text: "20 m/s",
      },
      {
        id: "D",
        text: "25 m/s",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The final velocity of an object undergoing uniform acceleration can be calculated using v = u + at.",

      steps: [
        "The initial velocity, u, is 0 m/s because the car starts from rest.",
        "The acceleration, a, is 4 m/s².",
        "The time, t, is 5 seconds.",
        "Using v = u + at, substitute the values: v = 0 + (4 × 5).",
        "Therefore, the final velocity is 20 m/s.",
      ],
    },
  },

  {
    id: "physics-motion-002",

    question:
      "Which of the following quantities describes the distance travelled by an object in a particular direction?",

    options: [
      {
        id: "A",
        text: "Speed",
      },
      {
        id: "B",
        text: "Distance",
      },
      {
        id: "C",
        text: "Displacement",
      },
      {
        id: "D",
        text: "Acceleration",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Displacement is the distance travelled by an object in a specified direction.",

      steps: [
        "Distance is the total length of the path travelled.",
        "Displacement is the straight-line distance from the initial position to the final position in a specified direction.",
        "Speed describes how quickly distance is covered.",
        "Acceleration describes the rate of change of velocity.",
        "Therefore, the correct answer is Displacement.",
      ],
    },
  },

  {
    id: "physics-motion-003",

    question:
      "A body moves with a constant velocity of 15 m/s for 8 seconds. What distance does it cover?",

    options: [
      {
        id: "A",
        text: "23 m",
      },
      {
        id: "B",
        text: "60 m",
      },
      {
        id: "C",
        text: "120 m",
      },
      {
        id: "D",
        text: "150 m",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "For motion at constant velocity, distance is calculated using s = vt.",

      steps: [
        "The velocity is 15 m/s.",
        "The time is 8 seconds.",
        "Use the formula s = vt.",
        "Substitute the values: s = 15 × 8.",
        "Therefore, the distance covered is 120 m.",
      ],
    },
  },

  {
    id: "physics-motion-004",

    question:
      "A cyclist increases his velocity from 5 m/s to 25 m/s in 10 seconds. What is his acceleration?",

    options: [
      {
        id: "A",
        text: "1 m/s²",
      },
      {
        id: "B",
        text: "2 m/s²",
      },
      {
        id: "C",
        text: "3 m/s²",
      },
      {
        id: "D",
        text: "4 m/s²",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Acceleration is the rate of change of velocity with time.",

      steps: [
        "The initial velocity, u, is 5 m/s.",
        "The final velocity, v, is 25 m/s.",
        "The time taken is 10 seconds.",
        "Use a = (v - u) / t.",
        "Therefore, a = (25 - 5) / 10 = 2 m/s².",
      ],
    },
  },

  {
    id: "physics-motion-005",

    question:
      "A stone is dropped from rest and falls freely under gravity. If g = 10 m/s², what will be its velocity after 3 seconds?",

    options: [
      {
        id: "A",
        text: "10 m/s",
      },
      {
        id: "B",
        text: "20 m/s",
      },
      {
        id: "C",
        text: "30 m/s",
      },
      {
        id: "D",
        text: "40 m/s",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "For an object falling freely from rest, its velocity can be calculated using v = u + gt.",

      steps: [
        "The stone is dropped from rest, so u = 0 m/s.",
        "The acceleration due to gravity is 10 m/s².",
        "The time is 3 seconds.",
        "Using v = u + gt, v = 0 + (10 × 3).",
        "Therefore, the velocity after 3 seconds is 30 m/s downward.",
      ],
    },
  },

  {
    id: "physics-motion-006",

    question:
      "A vehicle travels 100 m in 20 seconds. What is its average speed?",

    options: [
      {
        id: "A",
        text: "2 m/s",
      },
      {
        id: "B",
        text: "5 m/s",
      },
      {
        id: "C",
        text: "20 m/s",
      },
      {
        id: "D",
        text: "50 m/s",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Average speed is the total distance travelled divided by the total time taken.",

      steps: [
        "The total distance travelled is 100 m.",
        "The total time taken is 20 seconds.",
        "Use average speed = distance / time.",
        "Average speed = 100 / 20.",
        "Therefore, the average speed is 5 m/s.",
      ],
    },
  },

  {
    id: "physics-motion-007",

    question:
      "Which of the following graphs represents uniform motion?",

    options: [
      {
        id: "A",
        text: "A straight-line distance-time graph with constant slope",
      },
      {
        id: "B",
        text: "A curved distance-time graph",
      },
      {
        id: "C",
        text: "A horizontal velocity-time graph with changing velocity",
      },
      {
        id: "D",
        text: "A random zigzag graph",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Uniform motion means that an object covers equal distances in equal intervals of time.",

      steps: [
        "The slope of a distance-time graph represents speed.",
        "For uniform motion, speed remains constant.",
        "A constant speed produces a straight-line distance-time graph with a constant slope.",
        "Therefore, the correct answer is a straight-line distance-time graph with constant slope.",
      ],
    },
  },

  {
    id: "physics-motion-008",

    question:
      "A ball moving at 20 m/s is brought to rest uniformly in 4 seconds. What is its acceleration?",

    options: [
      {
        id: "A",
        text: "-5 m/s²",
      },
      {
        id: "B",
        text: "5 m/s²",
      },
      {
        id: "C",
        text: "-4 m/s²",
      },
      {
        id: "D",
        text: "4 m/s²",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Acceleration is the change in velocity divided by the time taken.",

      steps: [
        "The initial velocity is 20 m/s.",
        "The final velocity is 0 m/s because the ball comes to rest.",
        "The time taken is 4 seconds.",
        "Use a = (v - u) / t.",
        "Therefore, a = (0 - 20) / 4 = -5 m/s².",
        "The negative sign indicates that the ball is decelerating.",
      ],
    },
  },

  {
    id: "physics-motion-009",

    question:
      "An object starts from rest and moves with a uniform acceleration of 2 m/s² for 6 seconds. How far does it travel?",

    options: [
      {
        id: "A",
        text: "12 m",
      },
      {
        id: "B",
        text: "24 m",
      },
      {
        id: "C",
        text: "36 m",
      },
      {
        id: "D",
        text: "72 m",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The distance travelled under uniform acceleration can be calculated using s = ut + ½at².",

      steps: [
        "The object starts from rest, so u = 0 m/s.",
        "The acceleration is 2 m/s².",
        "The time is 6 seconds.",
        "Using s = ut + ½at², s = (0 × 6) + ½(2)(6²).",
        "Therefore, s = 36 m.",
      ],
    },
  },

  {
    id: "physics-motion-010",

    question:
      "A body moves in a circular path at constant speed. Which of the following statements is correct?",

    options: [
      {
        id: "A",
        text: "The body has constant velocity",
      },
      {
        id: "B",
        text: "The body has no acceleration",
      },
      {
        id: "C",
        text: "The velocity changes continuously",
      },
      {
        id: "D",
        text: "The body is at rest",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "In circular motion, an object may have constant speed while its velocity changes because its direction is continuously changing.",

      steps: [
        "Speed is a scalar quantity and may remain constant.",
        "Velocity is a vector quantity that depends on both speed and direction.",
        "During circular motion, the direction of motion changes continuously.",
        "Therefore, the velocity changes continuously.",
        "The change in velocity means that the object has centripetal acceleration.",
      ],
    },
  },
];

export default motionQuestions;




import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — GRAVITATIONAL FIELD                                               */
/* -------------------------------------------------------------------------- */

export const gravitationalFieldQuestions: ArenaQuestion[] = [
  {
    id: "physics-gravity-001",

    question:
      "Which of the following statements correctly describes a gravitational field?",

    options: [
      {
        id: "A",
        text: "A region where only light can exist",
      },
      {
        id: "B",
        text: "A region around a mass where another mass experiences gravitational force",
      },
      {
        id: "C",
        text: "A region where objects have no weight",
      },
      {
        id: "D",
        text: "A region occupied only by gases",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A gravitational field is the region surrounding a mass in which another mass experiences a gravitational force.",

      steps: [
        "Every object with mass produces a gravitational field around it.",
        "Another object placed within the field experiences gravitational attraction.",
        "The strength of the field depends on the mass producing the field and the distance from it.",
        "Therefore, the correct answer is a region around a mass where another mass experiences gravitational force.",
      ],
    },
  },

  {
    id: "physics-gravity-002",

    question:
      "What is the SI unit of gravitational field strength?",

    options: [
      {
        id: "A",
        text: "Newton",
      },
      {
        id: "B",
        text: "Joule",
      },
      {
        id: "C",
        text: "Newton per kilogram",
      },
      {
        id: "D",
        text: "Kilogram per newton",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Gravitational field strength is defined as the gravitational force acting per unit mass.",

      steps: [
        "Gravitational field strength is given by g = F/m.",
        "Force is measured in newtons.",
        "Mass is measured in kilograms.",
        "Therefore, the SI unit is newtons per kilogram (N/kg).",
      ],
    },
  },

  {
    id: "physics-gravity-003",

    question:
      "What is the approximate value of the acceleration due to gravity near the surface of the Earth?",

    options: [
      {
        id: "A",
        text: "1.6 m/s²",
      },
      {
        id: "B",
        text: "5.0 m/s²",
      },
      {
        id: "C",
        text: "9.8 m/s²",
      },
      {
        id: "D",
        text: "98 m/s²",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Near the Earth's surface, objects accelerate downward at approximately 9.8 m/s² when air resistance is neglected.",

      steps: [
        "The acceleration is caused by the Earth's gravitational field.",
        "The standard approximate value is 9.8 m/s².",
        "In many examination calculations, g may be approximated as 10 m/s².",
        "Therefore, the correct answer is 9.8 m/s².",
      ],
    },
  },

  {
    id: "physics-gravity-004",

    question:
      "A body has a mass of 5 kg. If the acceleration due to gravity is 10 m/s², what is its weight?",

    options: [
      {
        id: "A",
        text: "0.5 N",
      },
      {
        id: "B",
        text: "5 N",
      },
      {
        id: "C",
        text: "50 N",
      },
      {
        id: "D",
        text: "500 N",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Weight is the gravitational force acting on a body and is calculated by multiplying mass by gravitational acceleration.",

      steps: [
        "The formula is W = mg.",
        "The mass is 5 kg.",
        "The acceleration due to gravity is 10 m/s².",
        "Substitute the values: W = 5 × 10.",
        "Therefore, the weight is 50 N.",
      ],
    },
  },

  {
    id: "physics-gravity-005",

    question:
      "Which of the following factors determines the gravitational force between two bodies?",

    options: [
      {
        id: "A",
        text: "Their masses and the distance between them",
      },
      {
        id: "B",
        text: "Only their volumes",
      },
      {
        id: "C",
        text: "Only their temperatures",
      },
      {
        id: "D",
        text: "Only their colours",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Newton's law of universal gravitation states that gravitational force depends on the masses of the bodies and the distance between their centres.",

      steps: [
        "The gravitational force increases as either mass increases.",
        "The gravitational force decreases as the separation between the bodies increases.",
        "Therefore, both mass and distance affect gravitational force.",
        "The correct answer is their masses and the distance between them.",
      ],
    },
  },

  {
    id: "physics-gravity-006",

    question:
      "If the distance between two masses is doubled, what happens to the gravitational force between them?",

    options: [
      {
        id: "A",
        text: "It becomes four times greater",
      },
      {
        id: "B",
        text: "It becomes twice as great",
      },
      {
        id: "C",
        text: "It becomes one-quarter of its original value",
      },
      {
        id: "D",
        text: "It remains unchanged",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Gravitational force is inversely proportional to the square of the distance between two masses.",

      steps: [
        "The relationship is F ∝ 1/r².",
        "If the distance is doubled, the new distance is 2r.",
        "The new force is proportional to 1/(2r)².",
        "This gives 1/4 of the original force.",
        "Therefore, the gravitational force becomes one-quarter of its original value.",
      ],
    },
  },

  {
    id: "physics-gravity-007",

    question:
      "Which statement about the weight of an object on the Moon is correct compared with its weight on Earth?",

    options: [
      {
        id: "A",
        text: "Its weight is greater on the Moon",
      },
      {
        id: "B",
        text: "Its weight is approximately one-sixth of its Earth weight",
      },
      {
        id: "C",
        text: "Its weight is exactly the same",
      },
      {
        id: "D",
        text: "Its mass becomes zero",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The Moon has a weaker gravitational field than Earth, so an object weighs less on the Moon.",

      steps: [
        "Weight depends on the gravitational field strength.",
        "The Moon's gravitational field strength is approximately one-sixth that of Earth.",
        "Therefore, an object weighs approximately one-sixth as much on the Moon.",
        "Its mass, however, remains unchanged.",
      ],
    },
  },

  {
    id: "physics-gravity-008",

    question:
      "An astronaut travels from Earth to the Moon. Which quantity remains unchanged?",

    options: [
      {
        id: "A",
        text: "Weight",
      },
      {
        id: "B",
        text: "Gravitational field strength",
      },
      {
        id: "C",
        text: "Mass",
      },
      {
        id: "D",
        text: "Gravitational force",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Mass is the amount of matter in an object and does not depend on the strength of the gravitational field.",

      steps: [
        "An object's mass remains constant when it moves from one location to another.",
        "Weight depends on gravitational field strength.",
        "The gravitational field strength on the Moon is different from that on Earth.",
        "Therefore, the astronaut's mass remains unchanged.",
      ],
    },
  },

  {
    id: "physics-gravity-009",

    question:
      "A satellite remains in orbit around the Earth mainly because of the Earth's",

    options: [
      {
        id: "A",
        text: "Magnetic field",
      },
      {
        id: "B",
        text: "Gravitational attraction",
      },
      {
        id: "C",
        text: "Electric charge",
      },
      {
        id: "D",
        text: "Atmospheric pressure",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The Earth's gravitational attraction provides the force that keeps a satellite in orbit.",

      steps: [
        "A satellite moves forward because of its orbital velocity.",
        "The Earth's gravitational force continually pulls the satellite toward Earth.",
        "This gravitational attraction provides the centripetal force required for the orbit.",
        "Therefore, the correct answer is gravitational attraction.",
      ],
    },
  },

  {
    id: "physics-gravity-010",

    question:
      "Which of the following best explains why objects fall toward the Earth when released?",

    options: [
      {
        id: "A",
        text: "The Earth repels all objects",
      },
      {
        id: "B",
        text: "The Earth's gravitational field attracts objects",
      },
      {
        id: "C",
        text: "Objects naturally move downward without any force",
      },
      {
        id: "D",
        text: "Air pressure always pushes objects downward",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Objects fall toward Earth because the Earth's gravitational field exerts an attractive force on them.",

      steps: [
        "The Earth has a large mass.",
        "Its mass produces a gravitational field around it.",
        "Objects within this field experience gravitational attraction toward Earth's centre.",
        "This attraction causes released objects to accelerate downward.",
        "Therefore, the correct answer is that the Earth's gravitational field attracts objects.",
      ],
    },
  },
];

export default gravitationalFieldQuestions;
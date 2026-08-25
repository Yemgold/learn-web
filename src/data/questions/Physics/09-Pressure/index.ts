


import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — PRESSURE
// --------------------------------------------------------------------------

export const pressureQuestions: ArenaQuestion[] = [
  {
    id: "physics-pressure-001",

    question:
      "A force of 200 N acts normally on an area of 4 m². What pressure is exerted?",

    options: [
      {
        id: "A",
        text: "25 Pa",
      },
      {
        id: "B",
        text: "50 Pa",
      },
      {
        id: "C",
        text: "100 Pa",
      },
      {
        id: "D",
        text: "800 Pa",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Pressure is defined as the force acting normally per unit area.",

      steps: [
        "The formula for pressure is P = F/A.",
        "The force is 200 N.",
        "The area is 4 m².",
        "Substitute the values: P = 200/4.",
        "Therefore, the pressure is 50 Pa.",
      ],
    },
  },

  {
    id: "physics-pressure-002",

    question:
      "Which of the following is the SI unit of pressure?",

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
        text: "Pascal",
      },
      {
        id: "D",
        text: "Watt",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The SI unit of pressure is the pascal.",

      steps: [
        "Pressure is force divided by area.",
        "The SI unit of force is the newton.",
        "The SI unit of area is the square metre.",
        "Therefore, pressure has the unit N/m².",
        "One N/m² is defined as one pascal.",
      ],
    },
  },

  {
    id: "physics-pressure-003",

    question:
      "Why does a sharp knife cut more easily than a blunt knife when the same force is applied?",

    options: [
      {
        id: "A",
        text: "A sharp knife has greater mass",
      },
      {
        id: "B",
        text: "A sharp knife exerts less force",
      },
      {
        id: "C",
        text: "A sharp knife produces greater pressure",
      },
      {
        id: "D",
        text: "A sharp knife has greater volume",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Pressure increases when the same force acts over a smaller area.",

      steps: [
        "Pressure is given by P = F/A.",
        "A sharp knife has a smaller contact area than a blunt knife.",
        "The same applied force therefore acts over a smaller area.",
        "This produces greater pressure.",
        "The greater pressure makes cutting easier.",
      ],
    },
  },

  {
    id: "physics-pressure-004",

    question:
      "A force of 500 N acts on an area of 0.5 m². Calculate the pressure produced.",

    options: [
      {
        id: "A",
        text: "250 Pa",
      },
      {
        id: "B",
        text: "500 Pa",
      },
      {
        id: "C",
        text: "1,000 Pa",
      },
      {
        id: "D",
        text: "2,500 Pa",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Pressure is calculated by dividing force by the area over which it acts.",

      steps: [
        "Use the formula P = F/A.",
        "The force is 500 N.",
        "The area is 0.5 m².",
        "Substitute: P = 500/0.5.",
        "Therefore, P = 1,000 Pa.",
      ],
    },
  },

  {
    id: "physics-pressure-005",

    question:
      "Which of the following would increase the pressure exerted by a solid on a surface?",

    options: [
      {
        id: "A",
        text: "Increasing the contact area",
      },
      {
        id: "B",
        text: "Decreasing the force",
      },
      {
        id: "C",
        text: "Increasing the force while keeping the area constant",
      },
      {
        id: "D",
        text: "Increasing the area and decreasing the force",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Pressure is directly proportional to force when the area remains constant.",

      steps: [
        "Pressure is given by P = F/A.",
        "If the area remains constant, increasing the force increases the pressure.",
        "Increasing the contact area would reduce pressure for the same force.",
        "Therefore, increasing the force while keeping the area constant increases pressure.",
      ],
    },
  },

  {
    id: "physics-pressure-006",

    question:
      "A person standing on one foot exerts greater pressure on the ground than when standing on both feet because",

    options: [
      {
        id: "A",
        text: "the person's weight increases",
      },
      {
        id: "B",
        text: "the contact area is reduced",
      },
      {
        id: "C",
        text: "the gravitational force disappears",
      },
      {
        id: "D",
        text: "the person's mass increases",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "For a constant weight, reducing the contact area increases pressure.",

      steps: [
        "The person's weight remains approximately the same.",
        "Pressure is given by P = F/A.",
        "Standing on one foot reduces the contact area.",
        "The same weight therefore acts over a smaller area.",
        "Hence, the pressure on the ground increases.",
      ],
    },
  },

  {
    id: "physics-pressure-007",

    question:
      "What happens to the pressure exerted by a liquid as depth below its surface increases?",

    options: [
      {
        id: "A",
        text: "It decreases",
      },
      {
        id: "B",
        text: "It remains constant",
      },
      {
        id: "C",
        text: "It increases",
      },
      {
        id: "D",
        text: "It becomes zero",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Liquid pressure increases with depth because the weight of liquid above the point increases.",

      steps: [
        "Liquid pressure depends on the depth below the surface.",
        "As depth increases, there is a greater column of liquid above the point.",
        "The weight of this liquid produces greater pressure.",
        "Therefore, liquid pressure increases with depth.",
      ],
    },
  },

  {
    id: "physics-pressure-008",

    question:
      "Which instrument is commonly used to measure atmospheric pressure?",

    options: [
      {
        id: "A",
        text: "Thermometer",
      },
      {
        id: "B",
        text: "Barometer",
      },
      {
        id: "C",
        text: "Hydrometer",
      },
      {
        id: "D",
        text: "Ammeter",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A barometer is an instrument used to measure atmospheric pressure.",

      steps: [
        "Atmospheric pressure is the pressure exerted by the Earth's atmosphere.",
        "A barometer is designed to measure atmospheric pressure.",
        "A thermometer measures temperature.",
        "A hydrometer measures the relative density of liquids.",
        "An ammeter measures electric current.",
      ],
    },
  },

  {
    id: "physics-pressure-009",

    question:
      "Why are dams generally made thicker at the bottom than at the top?",

    options: [
      {
        id: "A",
        text: "Water pressure increases with depth",
      },
      {
        id: "B",
        text: "Water pressure decreases with depth",
      },
      {
        id: "C",
        text: "Water has no pressure at the bottom",
      },
      {
        id: "D",
        text: "The bottom receives less water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Liquid pressure increases with depth, so the lower part of a dam experiences greater pressure.",

      steps: [
        "Water exerts pressure on the walls of a dam.",
        "Liquid pressure increases as depth increases.",
        "The bottom of the dam is therefore subjected to greater pressure.",
        "The dam is made thicker at the bottom to withstand this greater force.",
      ],
    },
  },

  {
    id: "physics-pressure-010",

    question:
      "A pressure of 2,000 Pa acts on an area of 3 m². What force produces this pressure?",

    options: [
      {
        id: "A",
        text: "667 N",
      },
      {
        id: "B",
        text: "1,000 N",
      },
      {
        id: "C",
        text: "6,000 N",
      },
      {
        id: "D",
        text: "8,000 N",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The force can be calculated by rearranging the pressure formula.",

      steps: [
        "The formula is P = F/A.",
        "Rearrange to obtain F = PA.",
        "The pressure is 2,000 Pa.",
        "The area is 3 m².",
        "Therefore, F = 2,000 × 3 = 6,000 N.",
      ],
    },
  },
];

export default pressureQuestions;
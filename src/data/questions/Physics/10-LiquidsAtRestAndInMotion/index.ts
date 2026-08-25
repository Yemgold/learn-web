


import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — LIQUIDS AT REST AND IN MOTION
// --------------------------------------------------------------------------

export const liquidsAtRestAndInMotionQuestions: ArenaQuestion[] = [
  {
    id: "physics-liquids-001",

    question:
      "What is the pressure exerted by a liquid at a point below its surface mainly dependent on?",

    options: [
      {
        id: "A",
        text: "The colour of the liquid",
      },
      {
        id: "B",
        text: "The depth and density of the liquid",
      },
      {
        id: "C",
        text: "The shape of the container only",
      },
      {
        id: "D",
        text: "The volume of the container only",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The pressure in a liquid at rest depends mainly on the density of the liquid, the depth below the surface and gravitational acceleration.",

      steps: [
        "The pressure due to a liquid is given by P = ρgh.",
        "ρ represents the density of the liquid.",
        "g represents gravitational acceleration.",
        "h represents the depth below the liquid surface.",
        "Therefore, pressure depends on the density and depth of the liquid.",
      ],
    },
  },

  {
    id: "physics-liquids-002",

    question:
      "A liquid has a density of 1000 kg/m³. Calculate the pressure due to the liquid at a depth of 2 m. Take g = 10 m/s².",

    options: [
      {
        id: "A",
        text: "2,000 Pa",
      },
      {
        id: "B",
        text: "5,000 Pa",
      },
      {
        id: "C",
        text: "20,000 Pa",
      },
      {
        id: "D",
        text: "200,000 Pa",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The pressure due to a liquid column can be calculated using P = ρgh.",

      steps: [
        "Use the formula P = ρgh.",
        "Density, ρ = 1000 kg/m³.",
        "Depth, h = 2 m.",
        "Gravitational acceleration, g = 10 m/s².",
        "P = 1000 × 10 × 2.",
        "Therefore, P = 20,000 Pa.",
      ],
    },
  },

  {
    id: "physics-liquids-003",

    question:
      "Which instrument is commonly used to measure atmospheric pressure?",

    options: [
      {
        id: "A",
        text: "Hydrometer",
      },
      {
        id: "B",
        text: "Barometer",
      },
      {
        id: "C",
        text: "Thermometer",
      },
      {
        id: "D",
        text: "Hygrometer",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A barometer is an instrument used to measure atmospheric pressure.",

      steps: [
        "Atmospheric pressure is the pressure exerted by the atmosphere.",
        "A barometer is designed to measure atmospheric pressure.",
        "A hydrometer measures the relative density of a liquid.",
        "A thermometer measures temperature.",
        "Therefore, the correct answer is Barometer.",
      ],
    },
  },

  {
    id: "physics-liquids-004",

    question:
      "According to Pascal's principle, pressure applied to an enclosed liquid is",

    options: [
      {
        id: "A",
        text: "Transmitted equally in all directions",
      },
      {
        id: "B",
        text: "Transmitted only downward",
      },
      {
        id: "C",
        text: "Lost immediately",
      },
      {
        id: "D",
        text: "Transmitted only upward",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Pascal's principle states that pressure applied to an enclosed fluid is transmitted equally and undiminished throughout the fluid.",

      steps: [
        "Consider a liquid enclosed in a container.",
        "An external force is applied to the liquid.",
        "The resulting pressure is transmitted through the liquid.",
        "The pressure is transmitted equally in all directions.",
        "This principle is used in hydraulic machines.",
      ],
    },
  },

  {
    id: "physics-liquids-005",

    question:
      "A hydraulic press has a small piston of area 0.02 m² and a large piston of area 0.5 m². If a force of 100 N is applied to the small piston, what force acts on the large piston?",

    options: [
      {
        id: "A",
        text: "250 N",
      },
      {
        id: "B",
        text: "500 N",
      },
      {
        id: "C",
        text: "2,500 N",
      },
      {
        id: "D",
        text: "5,000 N",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A hydraulic press works according to Pascal's principle, allowing pressure to produce a larger force on a larger piston.",

      steps: [
        "Pressure on the small piston is P = F₁/A₁.",
        "The same pressure acts on the large piston.",
        "Therefore, F₁/A₁ = F₂/A₂.",
        "F₂ = F₁ × A₂/A₁.",
        "F₂ = 100 × 0.5/0.02.",
        "Therefore, F₂ = 2,500 N.",
      ],
    },
  },

  {
    id: "physics-liquids-006",

    question:
      "An object floats in a liquid when",

    options: [
      {
        id: "A",
        text: "Its weight is greater than the upthrust",
      },
      {
        id: "B",
        text: "The upthrust is equal to its weight",
      },
      {
        id: "C",
        text: "There is no gravitational force",
      },
      {
        id: "D",
        text: "Its volume is zero",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A floating object is in equilibrium because the upward buoyant force balances its downward weight.",

      steps: [
        "The weight of the object acts downward.",
        "The liquid exerts an upward force called upthrust.",
        "For the object to float steadily, the forces must balance.",
        "Therefore, the upthrust must equal the weight of the object.",
      ],
    },
  },

  {
    id: "physics-liquids-007",

    question:
      "The upward force exerted by a liquid on an immersed object is known as",

    options: [
      {
        id: "A",
        text: "Friction",
      },
      {
        id: "B",
        text: "Tension",
      },
      {
        id: "C",
        text: "Upthrust",
      },
      {
        id: "D",
        text: "Weight",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "When an object is placed in a liquid, the liquid exerts an upward force on the object called upthrust or buoyant force.",

      steps: [
        "The liquid exerts pressure on the surface of the immersed object.",
        "The pressure at greater depth is higher.",
        "This produces a resultant upward force.",
        "The resultant upward force is called upthrust.",
        "Therefore, the correct answer is Upthrust.",
      ],
    },
  },

  {
    id: "physics-liquids-008",

    question:
      "According to Archimedes' principle, the upthrust on an immersed body is equal to the",

    options: [
      {
        id: "A",
        text: "Weight of the body",
      },
      {
        id: "B",
        text: "Mass of the body",
      },
      {
        id: "C",
        text: "Weight of the liquid displaced",
      },
      {
        id: "D",
        text: "Volume of the container",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Archimedes' principle relates the buoyant force on an immersed body to the weight of the fluid displaced.",

      steps: [
        "When a body is immersed in a liquid, it displaces some of the liquid.",
        "The displaced liquid has a definite weight.",
        "The upthrust on the body is equal to the weight of the displaced liquid.",
        "Therefore, the correct answer is the weight of the liquid displaced.",
      ],
    },
  },

  {
    id: "physics-liquids-009",

    question:
      "Water flows through a pipe that becomes narrower. What happens to the speed of the water in the narrower section?",

    options: [
      {
        id: "A",
        text: "It decreases",
      },
      {
        id: "B",
        text: "It becomes zero",
      },
      {
        id: "C",
        text: "It increases",
      },
      {
        id: "D",
        text: "It remains permanently unchanged",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "For steady flow of an incompressible liquid, the continuity principle states that the speed increases when the cross-sectional area decreases.",

      steps: [
        "The volume flow rate must remain constant for steady incompressible flow.",
        "The continuity equation is A₁v₁ = A₂v₂.",
        "When the pipe becomes narrower, its cross-sectional area decreases.",
        "Therefore, the velocity must increase.",
        "This is why water flows faster through a narrow section of a pipe.",
      ],
    },
  },

  {
    id: "physics-liquids-010",

    question:
      "Which of the following best explains why water flows faster through a narrow part of a pipe?",

    options: [
      {
        id: "A",
        text: "The density of water becomes zero",
      },
      {
        id: "B",
        text: "The same volume of water must pass through the smaller area",
      },
      {
        id: "C",
        text: "Gravity stops acting on the water",
      },
      {
        id: "D",
        text: "The water becomes a gas",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The continuity principle requires the flow rate of an incompressible liquid to remain constant along a pipe.",

      steps: [
        "Water is approximately incompressible.",
        "For steady flow, the same volume of water must pass through each section per unit time.",
        "A narrow section has a smaller cross-sectional area.",
        "Therefore, the water must move faster through the narrow section.",
        "Hence, the correct answer is that the same volume of water must pass through the smaller area.",
      ],
    },
  },
];

export default liquidsAtRestAndInMotionQuestions;
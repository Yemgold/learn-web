



import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — TEMPERATURE AND THERMAL EXPANSION
// --------------------------------------------------------------------------

export const temperatureAndThermalExpansionQuestions: ArenaQuestion[] = [
  {
    id: "physics-temperature-001",

    question:
      "Which of the following instruments is used to measure temperature?",

    options: [
      {
        id: "A",
        text: "Barometer",
      },
      {
        id: "B",
        text: "Thermometer",
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
        "A thermometer is an instrument specifically designed to measure temperature.",

      steps: [
        "Temperature indicates how hot or cold a body is.",
        "A thermometer is used to measure temperature.",
        "A barometer measures atmospheric pressure.",
        "A hydrometer measures the relative density of liquids.",
        "Therefore, the correct answer is Thermometer.",
      ],
    },
  },

  {
    id: "physics-temperature-002",

    question:
      "Which of the following is an SI unit of temperature?",

    options: [
      {
        id: "A",
        text: "Degree Celsius",
      },
      {
        id: "B",
        text: "Degree Fahrenheit",
      },
      {
        id: "C",
        text: "Kelvin",
      },
      {
        id: "D",
        text: "Joule",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The kelvin is the SI base unit of thermodynamic temperature.",

      steps: [
        "Temperature can be measured using different scales.",
        "The Celsius and Fahrenheit scales are commonly used in everyday measurements.",
        "The SI base unit of thermodynamic temperature is the kelvin.",
        "The joule is a unit of energy.",
        "Therefore, the correct answer is Kelvin.",
      ],
    },
  },

  {
    id: "physics-temperature-003",

    question:
      "What is the relationship between temperature in Celsius and Kelvin?",

    options: [
      {
        id: "A",
        text: "K = °C - 273",
      },
      {
        id: "B",
        text: "K = °C + 273",
      },
      {
        id: "C",
        text: "K = °C × 273",
      },
      {
        id: "D",
        text: "K = °C ÷ 273",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The Kelvin temperature scale is related to the Celsius scale by adding approximately 273 to the Celsius temperature.",

      steps: [
        "The conversion relationship is K = °C + 273 approximately.",
        "For example, 0°C corresponds to approximately 273 K.",
        "Therefore, Celsius temperature is converted to Kelvin by adding 273.",
        "Hence, the correct answer is K = °C + 273.",
      ],
    },
  },

  {
    id: "physics-temperature-004",

    question:
      "Convert 27°C to Kelvin.",

    options: [
      {
        id: "A",
        text: "246 K",
      },
      {
        id: "B",
        text: "273 K",
      },
      {
        id: "C",
        text: "300 K",
      },
      {
        id: "D",
        text: "327 K",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "To convert Celsius to Kelvin, add approximately 273 to the Celsius temperature.",

      steps: [
        "Temperature = 27°C.",
        "Use K = °C + 273.",
        "K = 27 + 273.",
        "K = 300.",
        "Therefore, 27°C is approximately 300 K.",
      ],
    },
  },

  {
    id: "physics-temperature-005",

    question:
      "What happens to most solids when their temperature is increased?",

    options: [
      {
        id: "A",
        text: "They contract",
      },
      {
        id: "B",
        text: "They expand",
      },
      {
        id: "C",
        text: "Their mass increases",
      },
      {
        id: "D",
        text: "Their density always becomes zero",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Most solids expand when heated because the particles vibrate more vigorously and occupy slightly more space.",

      steps: [
        "Heating increases the thermal energy of a solid.",
        "The particles vibrate more vigorously.",
        "The average separation between particles increases slightly.",
        "As a result, the solid expands.",
        "Therefore, the correct answer is They expand.",
      ],
    },
  },

  {
    id: "physics-temperature-006",

    question:
      "Which type of expansion occurs when the length of a solid increases due to heating?",

    options: [
      {
        id: "A",
        text: "Linear expansion",
      },
      {
        id: "B",
        text: "Superficial expansion",
      },
      {
        id: "C",
        text: "Cubical expansion",
      },
      {
        id: "D",
        text: "Volume compression",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Linear expansion refers to the increase in the length of a solid when its temperature rises.",

      steps: [
        "A solid can expand in length, area and volume.",
        "Expansion in length is called linear expansion.",
        "Expansion in area is called superficial or areal expansion.",
        "Expansion in volume is called cubical expansion.",
        "Therefore, the correct answer is Linear expansion.",
      ],
    },
  },

  {
    id: "physics-temperature-007",

    question:
      "Which of the following is an example of the practical use of thermal expansion?",

    options: [
      {
        id: "A",
        text: "Leaving gaps between railway tracks",
      },
      {
        id: "B",
        text: "Using a fixed length for all bridges",
      },
      {
        id: "C",
        text: "Preventing all metals from expanding",
      },
      {
        id: "D",
        text: "Making thermometers without temperature-sensitive materials",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Railway tracks are provided with small gaps to allow room for expansion when their temperature increases.",

      steps: [
        "Railway tracks are usually made of metal.",
        "Metals expand when heated.",
        "If there were no allowance for expansion, excessive thermal stress could develop.",
        "Small gaps or expansion arrangements provide room for thermal expansion.",
        "Therefore, leaving gaps between railway tracks is a practical application of thermal expansion.",
      ],
    },
  },

  {
    id: "physics-temperature-008",

    question:
      "The coefficient of linear expansion of a material describes the",

    options: [
      {
        id: "A",
        text: "Change in mass per unit temperature change",
      },
      {
        id: "B",
        text: "Fractional change in length per unit temperature change",
      },
      {
        id: "C",
        text: "Change in pressure per unit volume",
      },
      {
        id: "D",
        text: "Increase in density per unit temperature change",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The coefficient of linear expansion measures how much the length of a material changes relative to its original length for a given temperature change.",

      steps: [
        "Consider the original length of a solid.",
        "When its temperature changes, its length changes.",
        "The coefficient of linear expansion relates the change in length to the original length and temperature change.",
        "Therefore, it represents the fractional change in length per unit temperature change.",
      ],
    },
  },

  {
    id: "physics-temperature-009",

    question:
      "A metal rod of length 2 m expands by 0.002 m when its temperature rises by 50°C. What is its coefficient of linear expansion?",

    options: [
      {
        id: "A",
        text: "2 × 10⁻⁵ °C⁻¹",
      },
      {
        id: "B",
        text: "2 × 10⁻⁴ °C⁻¹",
      },
      {
        id: "C",
        text: "5 × 10⁻⁵ °C⁻¹",
      },
      {
        id: "D",
        text: "5 × 10⁻⁴ °C⁻¹",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The coefficient of linear expansion can be obtained by dividing the change in length by the product of the original length and temperature change.",

      steps: [
        "Original length L = 2 m.",
        "Change in length ΔL = 0.002 m.",
        "Temperature change ΔT = 50°C.",
        "Use α = ΔL / (LΔT).",
        "α = 0.002 / (2 × 50).",
        "α = 0.002 / 100.",
        "Therefore, α = 2 × 10⁻⁵ °C⁻¹.",
      ],
    },
  },

  {
    id: "physics-temperature-010",

    question:
      "Why are expansion joints provided in bridges?",

    options: [
      {
        id: "A",
        text: "To increase the mass of the bridge",
      },
      {
        id: "B",
        text: "To allow for thermal expansion and contraction",
      },
      {
        id: "C",
        text: "To prevent the bridge from receiving sunlight",
      },
      {
        id: "D",
        text: "To reduce the gravitational force on the bridge",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Expansion joints allow bridge materials to expand and contract as their temperature changes.",

      steps: [
        "Bridge structures are exposed to changes in temperature.",
        "Their materials expand when heated and contract when cooled.",
        "If expansion and contraction were completely restricted, large stresses could develop.",
        "Expansion joints provide room for these dimensional changes.",
        "Therefore, expansion joints are used to allow thermal expansion and contraction.",
      ],
    },
  },
];

export default temperatureAndThermalExpansionQuestions;
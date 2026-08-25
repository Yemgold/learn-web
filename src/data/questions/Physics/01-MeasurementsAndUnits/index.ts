


import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — MEASUREMENTS AND UNITS
// --------------------------------------------------------------------------

export const measurementsAndUnitsQuestions: ArenaQuestion[] = [
  {
    id: "physics-measurements-001",

    question:
      "Which of the following is an SI base quantity?",

    options: [
      {
        id: "A",
        text: "Force",
      },
      {
        id: "B",
        text: "Energy",
      },
      {
        id: "C",
        text: "Mass",
      },
      {
        id: "D",
        text: "Velocity",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Mass is one of the seven fundamental SI base quantities.",

      steps: [
        "The SI system has seven base quantities.",
        "They include length, mass, time, electric current, thermodynamic temperature, amount of substance and luminous intensity.",
        "Force, energy and velocity are derived quantities.",
        "Therefore, the correct answer is Mass.",
      ],
    },
  },

  {
    id: "physics-measurements-002",

    question:
      "What is the SI unit of length?",

    options: [
      {
        id: "A",
        text: "Centimetre",
      },
      {
        id: "B",
        text: "Metre",
      },
      {
        id: "C",
        text: "Kilometre",
      },
      {
        id: "D",
        text: "Millimetre",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The metre is the SI base unit of length.",

      steps: [
        "Length is one of the fundamental physical quantities.",
        "Its SI base unit is the metre.",
        "Centimetre, kilometre and millimetre are multiples or submultiples of the metre.",
        "Therefore, the correct answer is Metre.",
      ],
    },
  },

  {
    id: "physics-measurements-003",

    question:
      "Which instrument is most suitable for measuring the internal diameter of a small tube?",

    options: [
      {
        id: "A",
        text: "Metre rule",
      },
      {
        id: "B",
        text: "Measuring tape",
      },
      {
        id: "C",
        text: "Vernier calipers",
      },
      {
        id: "D",
        text: "Stopwatch",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Vernier calipers can measure small internal and external dimensions accurately.",

      steps: [
        "A metre rule is suitable for ordinary length measurements.",
        "A measuring tape is useful for longer or flexible measurements.",
        "Vernier calipers have jaws designed for measuring internal and external dimensions.",
        "A stopwatch measures time rather than length.",
        "Therefore, the correct answer is Vernier calipers.",
      ],
    },
  },

  {
    id: "physics-measurements-004",

    question:
      "Which instrument is used to measure the diameter of a thin wire accurately?",

    options: [
      {
        id: "A",
        text: "Metre rule",
      },
      {
        id: "B",
        text: "Micrometer screw gauge",
      },
      {
        id: "C",
        text: "Thermometer",
      },
      {
        id: "D",
        text: "Spring balance",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A micrometer screw gauge is designed for measuring very small dimensions accurately.",

      steps: [
        "A thin wire has a small diameter.",
        "A metre rule cannot measure such a small diameter with high precision.",
        "A micrometer screw gauge is suitable for measuring small dimensions such as wire diameter.",
        "A thermometer measures temperature and a spring balance measures force or weight.",
        "Therefore, the correct answer is Micrometer screw gauge.",
      ],
    },
  },

  {
    id: "physics-measurements-005",

    question:
      "Which of the following is the SI unit of time?",

    options: [
      {
        id: "A",
        text: "Minute",
      },
      {
        id: "B",
        text: "Hour",
      },
      {
        id: "C",
        text: "Second",
      },
      {
        id: "D",
        text: "Day",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The second is the SI base unit of time.",

      steps: [
        "Time is a fundamental physical quantity.",
        "Its SI base unit is the second.",
        "Minute, hour and day are commonly used units of time but are not SI base units.",
        "Therefore, the correct answer is Second.",
      ],
    },
  },

  {
    id: "physics-measurements-006",

    question:
      "Which of the following is a derived physical quantity?",

    options: [
      {
        id: "A",
        text: "Length",
      },
      {
        id: "B",
        text: "Mass",
      },
      {
        id: "C",
        text: "Time",
      },
      {
        id: "D",
        text: "Force",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Force is a derived quantity because its unit is obtained from the base SI units of mass, length and time.",

      steps: [
        "Length, mass and time are SI base quantities.",
        "Force is calculated using F = ma.",
        "The SI unit of force is kg m/s².",
        "Therefore, force is a derived physical quantity.",
      ],
    },
  },

  {
    id: "physics-measurements-007",

    question:
      "What is the SI unit of temperature?",

    options: [
      {
        id: "A",
        text: "Degree Celsius",
      },
      {
        id: "B",
        text: "Kelvin",
      },
      {
        id: "C",
        text: "Degree Fahrenheit",
      },
      {
        id: "D",
        text: "Joule",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The kelvin is the SI base unit of thermodynamic temperature.",

      steps: [
        "Temperature is a fundamental physical quantity.",
        "The SI base unit of thermodynamic temperature is the kelvin.",
        "Degree Celsius is widely used for expressing temperature but is not the SI base unit.",
        "Joule is a unit of energy.",
        "Therefore, the correct answer is Kelvin.",
      ],
    },
  },

  {
    id: "physics-measurements-008",

    question:
      "A student measures the length of a rod three times and obtains 10.2 cm, 10.3 cm and 10.2 cm. What is the average length?",

    options: [
      {
        id: "A",
        text: "10.1 cm",
      },
      {
        id: "B",
        text: "10.2 cm",
      },
      {
        id: "C",
        text: "10.23 cm",
      },
      {
        id: "D",
        text: "10.7 cm",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The average value is obtained by adding all the measurements and dividing by the number of measurements.",

      steps: [
        "Add the three measurements: 10.2 + 10.3 + 10.2 = 30.7 cm.",
        "There are three measurements.",
        "Average = 30.7 ÷ 3.",
        "Average = 10.23 cm approximately.",
        "Therefore, the correct answer is 10.23 cm.",
      ],
    },
  },

  {
    id: "physics-measurements-009",

    question:
      "Which of the following quantities has the SI unit kg/m³?",

    options: [
      {
        id: "A",
        text: "Pressure",
      },
      {
        id: "B",
        text: "Density",
      },
      {
        id: "C",
        text: "Force",
      },
      {
        id: "D",
        text: "Energy",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Density is defined as mass per unit volume.",

      steps: [
        "The formula for density is ρ = m/V.",
        "Mass is measured in kilograms.",
        "Volume is measured in cubic metres.",
        "Therefore, the SI unit of density is kg/m³.",
        "The correct answer is Density.",
      ],
    },
  },

  {
    id: "physics-measurements-010",

    question:
      "Which of the following prefixes represents 10⁻³?",

    options: [
      {
        id: "A",
        text: "Kilo",
      },
      {
        id: "B",
        text: "Mega",
      },
      {
        id: "C",
        text: "Milli",
      },
      {
        id: "D",
        text: "Micro",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The prefix milli represents one thousandth of a unit.",

      steps: [
        "Kilo represents 10³.",
        "Mega represents 10⁶.",
        "Milli represents 10⁻³.",
        "Micro represents 10⁻⁶.",
        "Therefore, the correct answer is Milli.",
      ],
    },
  },

  {
    id: "physics-measurements-011",

    question:
      "How many metres are there in 2.5 kilometres?",

    options: [
      {
        id: "A",
        text: "25 m",
      },
      {
        id: "B",
        text: "250 m",
      },
      {
        id: "C",
        text: "2,500 m",
      },
      {
        id: "D",
        text: "25,000 m",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "One kilometre is equal to 1,000 metres.",

      steps: [
        "1 km = 1,000 m.",
        "The distance is 2.5 km.",
        "Convert to metres: 2.5 × 1,000.",
        "Therefore, the distance is 2,500 m.",
      ],
    },
  },

  {
    id: "physics-measurements-012",

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
        "The ampere is the SI base unit of electric current.",

      steps: [
        "Electric current is one of the seven SI base quantities.",
        "Its SI base unit is the ampere.",
        "Volt is a unit of potential difference.",
        "Ohm is a unit of resistance.",
        "Therefore, the correct answer is Ampere.",
      ],
    },
  },

  {
    id: "physics-measurements-013",

    question:
      "What is the dimension of velocity?",

    options: [
      {
        id: "A",
        text: "[LT⁻¹]",
      },
      {
        id: "B",
        text: "[LT⁻²]",
      },
      {
        id: "C",
        text: "[MLT⁻¹]",
      },
      {
        id: "D",
        text: "[MLT⁻²]",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Velocity is displacement divided by time.",

      steps: [
        "The dimension of displacement is [L].",
        "The dimension of time is [T].",
        "Velocity = displacement ÷ time.",
        "Therefore, the dimension of velocity is [LT⁻¹].",
      ],
    },
  },

  {
    id: "physics-measurements-014",

    question:
      "What is the dimension of acceleration?",

    options: [
      {
        id: "A",
        text: "[LT⁻¹]",
      },
      {
        id: "B",
        text: "[LT⁻²]",
      },
      {
        id: "C",
        text: "[MLT⁻¹]",
      },
      {
        id: "D",
        text: "[ML⁻¹T⁻²]",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Acceleration is the rate of change of velocity with time.",

      steps: [
        "The dimension of velocity is [LT⁻¹].",
        "Acceleration is velocity divided by time.",
        "Therefore, [LT⁻¹] ÷ [T] = [LT⁻²].",
        "Hence, the dimension of acceleration is [LT⁻²].",
      ],
    },
  },

  {
    id: "physics-measurements-015",

    question:
      "Which of the following quantities is measured in joules?",

    options: [
      {
        id: "A",
        text: "Force",
      },
      {
        id: "B",
        text: "Power",
      },
      {
        id: "C",
        text: "Energy",
      },
      {
        id: "D",
        text: "Pressure",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The joule is the SI derived unit of energy and work.",

      steps: [
        "Energy is the capacity to do work.",
        "The SI unit of energy is the joule.",
        "Force is measured in newtons.",
        "Power is measured in watts.",
        "Pressure is measured in pascals.",
        "Therefore, the correct answer is Energy.",
      ],
    },
  },

  {
    id: "physics-measurements-016",

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
        "Pressure is force acting normally per unit area, and its SI unit is the pascal.",

      steps: [
        "Pressure = Force ÷ Area.",
        "The SI unit of force is newton.",
        "The SI unit of area is square metre.",
        "Therefore, pressure has the unit N/m².",
        "N/m² is called the pascal.",
        "Therefore, the correct answer is Pascal.",
      ],
    },
  },

  {
    id: "physics-measurements-017",

    question:
      "A measuring instrument gives readings that are very close to one another but far from the true value. The instrument is said to be",

    options: [
      {
        id: "A",
        text: "Accurate but not precise",
      },
      {
        id: "B",
        text: "Precise but not accurate",
      },
      {
        id: "C",
        text: "Both accurate and precise",
      },
      {
        id: "D",
        text: "Neither accurate nor precise",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Precision refers to the closeness of repeated measurements to one another, while accuracy refers to closeness to the true value.",

      steps: [
        "The readings are very close to one another.",
        "Therefore, the measurements are precise.",
        "However, they are far from the true value.",
        "Therefore, they are not accurate.",
        "The correct answer is Precise but not accurate.",
      ],
    },
  },

  {
    id: "physics-measurements-018",

    question:
      "Which instrument is commonly used to measure temperature?",

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
        text: "Ammeter",
      },
      {
        id: "D",
        text: "Hydrometer",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A thermometer is an instrument used to measure temperature.",

      steps: [
        "Temperature describes how hot or cold a body is.",
        "A thermometer is designed to measure temperature.",
        "A barometer measures atmospheric pressure.",
        "An ammeter measures electric current.",
        "A hydrometer measures the relative density of liquids.",
        "Therefore, the correct answer is Thermometer.",
      ],
    },
  },

  {
    id: "physics-measurements-019",

    question:
      "What is the SI unit of mass?",

    options: [
      {
        id: "A",
        text: "Gram",
      },
      {
        id: "B",
        text: "Kilogram",
      },
      {
        id: "C",
        text: "Newton",
      },
      {
        id: "D",
        text: "Pound",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The kilogram is the SI base unit of mass.",

      steps: [
        "Mass is a fundamental physical quantity.",
        "The SI base unit of mass is the kilogram.",
        "The gram is a smaller unit related to the kilogram.",
        "Newton is the SI unit of force.",
        "Therefore, the correct answer is Kilogram.",
      ],
    },
  },

  {
    id: "physics-measurements-020",

    question:
      "Which of the following quantities has the SI unit watt?",

    options: [
      {
        id: "A",
        text: "Energy",
      },
      {
        id: "B",
        text: "Power",
      },
      {
        id: "C",
        text: "Force",
      },
      {
        id: "D",
        text: "Pressure",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The watt is the SI derived unit of power.",

      steps: [
        "Power is the rate at which work is done or energy is transferred.",
        "Power = Energy ÷ Time.",
        "The SI unit of power is the watt.",
        "Energy is measured in joules.",
        "Force is measured in newtons.",
        "Therefore, the correct answer is Power.",
      ],
    },
  },
];

export default measurementsAndUnitsQuestions;
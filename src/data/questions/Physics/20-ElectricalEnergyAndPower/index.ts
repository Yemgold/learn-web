



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — ELECTRICAL ENERGY AND POWER                                      */
/* -------------------------------------------------------------------------- */

export const electricalEnergyAndPowerQuestions: ArenaQuestion[] = [
  {
    id: "physics-electrical-energy-power-001",

    question:
      "A current of 2 A flows through a resistor connected to a potential difference of 12 V. What is the electrical power consumed by the resistor?",

    options: [
      {
        id: "A",
        text: "6 W",
      },
      {
        id: "B",
        text: "12 W",
      },
      {
        id: "C",
        text: "24 W",
      },
      {
        id: "D",
        text: "48 W",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electrical power is the rate at which electrical energy is converted or consumed.",

      steps: [
        "The formula for electrical power is P = VI.",
        "The potential difference is 12 V.",
        "The current is 2 A.",
        "Substitute the values: P = 12 × 2.",
        "Therefore, the electrical power is 24 W.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-002",

    question:
      "An electric heater has a power rating of 2,000 W and operates for 5 minutes. How much electrical energy does it consume?",

    options: [
      {
        id: "A",
        text: "10,000 J",
      },
      {
        id: "B",
        text: "100,000 J",
      },
      {
        id: "C",
        text: "600,000 J",
      },
      {
        id: "D",
        text: "1,000,000 J",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electrical energy consumed can be calculated by multiplying power by time.",

      steps: [
        "The formula is E = Pt.",
        "The power is 2,000 W.",
        "Convert 5 minutes to seconds: 5 × 60 = 300 s.",
        "Substitute the values: E = 2,000 × 300.",
        "Therefore, the electrical energy consumed is 600,000 J.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-003",

    question:
      "A 100 W electric bulb is connected to a 200 V supply. What current flows through the bulb?",

    options: [
      {
        id: "A",
        text: "0.2 A",
      },
      {
        id: "B",
        text: "0.5 A",
      },
      {
        id: "C",
        text: "2.0 A",
      },
      {
        id: "D",
        text: "20 A",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The current can be determined from the electrical power equation P = VI.",

      steps: [
        "The formula is P = VI.",
        "Rearrange the formula to get I = P/V.",
        "The power is 100 W.",
        "The voltage is 200 V.",
        "Therefore, I = 100/200 = 0.5 A.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-004",

    question:
      "Which of the following is the SI unit of electrical energy?",

    options: [
      {
        id: "A",
        text: "Watt",
      },
      {
        id: "B",
        text: "Joule",
      },
      {
        id: "C",
        text: "Volt",
      },
      {
        id: "D",
        text: "Ampere",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Electrical energy is measured in joules in the SI system.",

      steps: [
        "Energy is the capacity to do work.",
        "The SI unit of energy is the joule (J).",
        "The watt is the SI unit of power.",
        "The volt measures potential difference.",
        "The ampere measures electric current.",
        "Therefore, the correct answer is Joule.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-005",

    question:
      "Which of the following is the SI unit of electrical power?",

    options: [
      {
        id: "A",
        text: "Joule",
      },
      {
        id: "B",
        text: "Coulomb",
      },
      {
        id: "C",
        text: "Watt",
      },
      {
        id: "D",
        text: "Ohm",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electrical power is measured in watts.",

      steps: [
        "Power is the rate of doing work or transferring energy.",
        "The SI unit of power is the watt (W).",
        "One watt is equal to one joule per second.",
        "Therefore, the correct answer is Watt.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-006",

    question:
      "An appliance rated 1,000 W operates for 2 hours. How much energy does it consume in kilowatt-hours?",

    options: [
      {
        id: "A",
        text: "0.5 kWh",
      },
      {
        id: "B",
        text: "1 kWh",
      },
      {
        id: "C",
        text: "2 kWh",
      },
      {
        id: "D",
        text: "20 kWh",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electrical energy in kilowatt-hours is calculated by multiplying power in kilowatts by time in hours.",

      steps: [
        "Convert 1,000 W to kilowatts: 1,000 W = 1 kW.",
        "The appliance operates for 2 hours.",
        "Use E = Pt.",
        "Therefore, E = 1 × 2 = 2 kWh.",
        "The appliance consumes 2 kWh of electrical energy.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-007",

    question:
      "A 60 W lamp is used for 10 hours. What is the electrical energy consumed?",

    options: [
      {
        id: "A",
        text: "0.06 kWh",
      },
      {
        id: "B",
        text: "0.6 kWh",
      },
      {
        id: "C",
        text: "6 kWh",
      },
      {
        id: "D",
        text: "60 kWh",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Energy consumption can be calculated using E = Pt when power is expressed in kilowatts and time in hours.",

      steps: [
        "The lamp has a power of 60 W.",
        "Convert 60 W to kilowatts: 60/1000 = 0.06 kW.",
        "The operating time is 10 hours.",
        "Therefore, E = 0.06 × 10.",
        "The energy consumed is 0.6 kWh.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-008",

    question:
      "Which electrical quantity is measured in kilowatt-hours (kWh)?",

    options: [
      {
        id: "A",
        text: "Current",
      },
      {
        id: "B",
        text: "Voltage",
      },
      {
        id: "C",
        text: "Electrical energy",
      },
      {
        id: "D",
        text: "Resistance",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The kilowatt-hour is a commonly used unit for measuring electrical energy consumed by appliances.",

      steps: [
        "Electrical energy is commonly measured in kilowatt-hours for domestic electricity consumption.",
        "Electric current is measured in amperes.",
        "Potential difference is measured in volts.",
        "Resistance is measured in ohms.",
        "Therefore, the correct answer is Electrical energy.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-009",

    question:
      "A current of 5 A flows through an appliance connected to a 240 V supply. What is the power rating of the appliance?",

    options: [
      {
        id: "A",
        text: "48 W",
      },
      {
        id: "B",
        text: "245 W",
      },
      {
        id: "C",
        text: "1,200 W",
      },
      {
        id: "D",
        text: "4,800 W",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electrical power is the product of potential difference and current.",

      steps: [
        "Use the formula P = VI.",
        "The voltage is 240 V.",
        "The current is 5 A.",
        "Substitute the values: P = 240 × 5.",
        "Therefore, the power rating is 1,200 W.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-010",

    question:
      "An electric iron has a power rating of 1.5 kW. If it is used for 4 hours, how much energy does it consume?",

    options: [
      {
        id: "A",
        text: "0.375 kWh",
      },
      {
        id: "B",
        text: "3 kWh",
      },
      {
        id: "C",
        text: "6 kWh",
      },
      {
        id: "D",
        text: "8 kWh",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electrical energy consumed is the product of power and operating time.",

      steps: [
        "The power of the iron is 1.5 kW.",
        "The operating time is 4 hours.",
        "Use E = Pt.",
        "Therefore, E = 1.5 × 4.",
        "The electrical energy consumed is 6 kWh.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-011",

    question:
      "A 12 V battery supplies a current of 3 A to a circuit. What is the power supplied by the battery?",

    options: [
      {
        id: "A",
        text: "4 W",
      },
      {
        id: "B",
        text: "15 W",
      },
      {
        id: "C",
        text: "36 W",
      },
      {
        id: "D",
        text: "48 W",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The power supplied by an electrical source is given by P = VI.",

      steps: [
        "The voltage is 12 V.",
        "The current is 3 A.",
        "Use P = VI.",
        "Therefore, P = 12 × 3 = 36 W.",
        "The battery supplies 36 W of power.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-012",

    question:
      "Which of the following factors determines the electrical energy consumed by an appliance?",

    options: [
      {
        id: "A",
        text: "Power rating and time of use",
      },
      {
        id: "B",
        text: "Resistance only",
      },
      {
        id: "C",
        text: "Voltage only",
      },
      {
        id: "D",
        text: "Current only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Electrical energy consumed depends on both the power of an appliance and the length of time it operates.",

      steps: [
        "The relationship is E = Pt.",
        "E represents electrical energy.",
        "P represents electrical power.",
        "t represents the operating time.",
        "Therefore, both power rating and time of use determine energy consumption.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-013",

    question:
      "A 2 kW electric heater is connected to a supply for 30 minutes. How much energy does it consume?",

    options: [
      {
        id: "A",
        text: "0.5 kWh",
      },
      {
        id: "B",
        text: "1 kWh",
      },
      {
        id: "C",
        text: "2 kWh",
      },
      {
        id: "D",
        text: "4 kWh",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The energy consumed is obtained by multiplying power by operating time.",

      steps: [
        "The power is 2 kW.",
        "Convert 30 minutes to hours: 30/60 = 0.5 hours.",
        "Use E = Pt.",
        "Therefore, E = 2 × 0.5.",
        "The energy consumed is 1 kWh.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-014",

    question:
      "A device converts 600 J of electrical energy into useful energy in 5 seconds. What is its useful power output?",

    options: [
      {
        id: "A",
        text: "30 W",
      },
      {
        id: "B",
        text: "120 W",
      },
      {
        id: "C",
        text: "300 W",
      },
      {
        id: "D",
        text: "3,000 W",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Power is the rate of energy transfer.",

      steps: [
        "Use the formula P = E/t.",
        "The useful energy is 600 J.",
        "The time is 5 seconds.",
        "Therefore, P = 600/5.",
        "The useful power output is 120 W.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-015",

    question:
      "A 500 W appliance operates continuously for 6 hours. What is the energy consumed in kilowatt-hours?",

    options: [
      {
        id: "A",
        text: "0.3 kWh",
      },
      {
        id: "B",
        text: "3 kWh",
      },
      {
        id: "C",
        text: "5 kWh",
      },
      {
        id: "D",
        text: "30 kWh",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "To calculate energy consumption in kWh, convert the power to kilowatts and multiply by time in hours.",

      steps: [
        "Convert 500 W to kilowatts: 500/1000 = 0.5 kW.",
        "The appliance operates for 6 hours.",
        "Use E = Pt.",
        "Therefore, E = 0.5 × 6.",
        "The energy consumed is 3 kWh.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-016",

    question:
      "An electrical appliance has a resistance of 20 Ω and carries a current of 2 A. What is its power?",

    options: [
      {
        id: "A",
        text: "10 W",
      },
      {
        id: "B",
        text: "20 W",
      },
      {
        id: "C",
        text: "40 W",
      },
      {
        id: "D",
        text: "80 W",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Electrical power can also be calculated using P = I²R.",

      steps: [
        "The current is 2 A.",
        "The resistance is 20 Ω.",
        "Use P = I²R.",
        "Therefore, P = 2² × 20.",
        "P = 4 × 20 = 80 W.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-017",

    question:
      "Two appliances have power ratings of 500 W and 1,500 W respectively. Which appliance consumes more energy when both are used for the same length of time?",

    options: [
      {
        id: "A",
        text: "The 500 W appliance",
      },
      {
        id: "B",
        text: "The 1,500 W appliance",
      },
      {
        id: "C",
        text: "Both consume the same energy",
      },
      {
        id: "D",
        text: "It cannot be determined",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "For the same operating time, an appliance with a higher power rating consumes more electrical energy.",

      steps: [
        "Electrical energy is given by E = Pt.",
        "The operating time is the same for both appliances.",
        "Therefore, the appliance with the greater power consumes more energy.",
        "1,500 W is greater than 500 W.",
        "Therefore, the 1,500 W appliance consumes more energy.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-018",

    question:
      "A 240 V electric heater draws a current of 10 A. What is its power rating?",

    options: [
      {
        id: "A",
        text: "24 W",
      },
      {
        id: "B",
        text: "240 W",
      },
      {
        id: "C",
        text: "2,400 W",
      },
      {
        id: "D",
        text: "24,000 W",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electrical power is calculated as the product of voltage and current.",

      steps: [
        "Use P = VI.",
        "The voltage is 240 V.",
        "The current is 10 A.",
        "Therefore, P = 240 × 10.",
        "The power rating is 2,400 W.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-019",

    question:
      "An appliance consumes 3,600 J of electrical energy in 60 seconds. What is its power rating?",

    options: [
      {
        id: "A",
        text: "6 W",
      },
      {
        id: "B",
        text: "60 W",
      },
      {
        id: "C",
        text: "600 W",
      },
      {
        id: "D",
        text: "2,160 W",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Power is the amount of energy transferred per unit time.",

      steps: [
        "Use P = E/t.",
        "The energy is 3,600 J.",
        "The time is 60 seconds.",
        "Therefore, P = 3,600/60.",
        "The power rating is 60 W.",
      ],
    },
  },

  {
    id: "physics-electrical-energy-power-020",

    question:
      "Which formula correctly relates electrical energy, power and time?",

    options: [
      {
        id: "A",
        text: "E = P/t",
      },
      {
        id: "B",
        text: "E = Pt",
      },
      {
        id: "C",
        text: "E = t/P",
      },
      {
        id: "D",
        text: "E = P + t",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Electrical energy is equal to the product of power and time.",

      steps: [
        "Power is the rate at which energy is transferred.",
        "Therefore, energy is obtained by multiplying power by time.",
        "The relationship is E = Pt.",
        "Therefore, the correct answer is E = Pt.",
      ],
    },
  },
];

export default electricalEnergyAndPowerQuestions;



import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — WORK, ENERGY AND POWER
// --------------------------------------------------------------------------

export const workEnergyAndPowerQuestions: ArenaQuestion[] = [
  {
    id: "physics-work-energy-001",

    question:
      "A force of 20 N moves a body through a distance of 5 m in the direction of the force. What is the work done?",

    options: [
      {
        id: "A",
        text: "4 J",
      },
      {
        id: "B",
        text: "25 J",
      },
      {
        id: "C",
        text: "100 J",
      },
      {
        id: "D",
        text: "400 J",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Work is done when a force causes an object to move through a distance in the direction of the force.",

      steps: [
        "The formula for work done is W = Fd.",
        "The force is 20 N.",
        "The distance moved is 5 m.",
        "Substitute the values: W = 20 × 5.",
        "Therefore, the work done is 100 J.",
      ],
    },
  },

  {
    id: "physics-work-energy-002",

    question:
      "A man carries a load horizontally through a distance of 10 m at constant height. What is the work done by the man's upward force on the load?",

    options: [
      {
        id: "A",
        text: "Zero",
      },
      {
        id: "B",
        text: "10 J",
      },
      {
        id: "C",
        text: "100 J",
      },
      {
        id: "D",
        text: "The maximum possible work",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Work depends on the component of force acting in the direction of displacement.",

      steps: [
        "The man applies an upward force to support the load.",
        "The load moves horizontally.",
        "The force and displacement are perpendicular to each other.",
        "A force perpendicular to displacement does no mechanical work on the object.",
        "Therefore, the work done by the upward force is zero.",
      ],
    },
  },

  {
    id: "physics-work-energy-003",

    question:
      "Which of the following is the SI unit of work?",

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
        text: "Newton",
      },
      {
        id: "D",
        text: "Pascal",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The joule is the SI unit used to measure work and energy.",

      steps: [
        "Work is calculated from force multiplied by displacement in the direction of the force.",
        "Force is measured in newtons.",
        "Displacement is measured in metres.",
        "Therefore, the unit of work is newton-metre.",
        "One newton-metre is equal to one joule.",
      ],
    },
  },

  {
    id: "physics-work-energy-004",

    question:
      "A machine does 600 J of work in 20 seconds. What is its power?",

    options: [
      {
        id: "A",
        text: "20 W",
      },
      {
        id: "B",
        text: "30 W",
      },
      {
        id: "C",
        text: "300 W",
      },
      {
        id: "D",
        text: "12,000 W",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Power is the rate at which work is done.",

      steps: [
        "The formula for power is P = W/t.",
        "The work done is 600 J.",
        "The time taken is 20 s.",
        "Substitute the values: P = 600 ÷ 20.",
        "Therefore, the power is 30 W.",
      ],
    },
  },

  {
    id: "physics-work-energy-005",

    question:
      "Which of the following quantities is a measure of the rate of doing work?",

    options: [
      {
        id: "A",
        text: "Energy",
      },
      {
        id: "B",
        text: "Force",
      },
      {
        id: "C",
        text: "Power",
      },
      {
        id: "D",
        text: "Momentum",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Power describes how quickly work is done.",

      steps: [
        "Work measures the transfer of energy by a force through a distance.",
        "Power measures how quickly that work is performed.",
        "Therefore, power is the rate of doing work.",
        "The SI unit of power is the watt.",
      ],
    },
  },

  {
    id: "physics-work-energy-006",

    question:
      "A body of mass 4 kg moves with a velocity of 5 m/s. What is its kinetic energy?",

    options: [
      {
        id: "A",
        text: "10 J",
      },
      {
        id: "B",
        text: "20 J",
      },
      {
        id: "C",
        text: "50 J",
      },
      {
        id: "D",
        text: "100 J",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Kinetic energy is the energy possessed by a body due to its motion.",

      steps: [
        "The formula for kinetic energy is KE = ½mv².",
        "The mass is 4 kg.",
        "The velocity is 5 m/s.",
        "Substitute the values: KE = ½ × 4 × 5².",
        "KE = 2 × 25.",
        "Therefore, the kinetic energy is 50 J.",
      ],
    },
  },

  {
    id: "physics-work-energy-007",

    question:
      "A stone of mass 2 kg is raised to a height of 10 m. Taking g = 10 m/s², what is its potential energy?",

    options: [
      {
        id: "A",
        text: "20 J",
      },
      {
        id: "B",
        text: "100 J",
      },
      {
        id: "C",
        text: "200 J",
      },
      {
        id: "D",
        text: "400 J",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A body raised above the ground possesses gravitational potential energy.",

      steps: [
        "The formula for gravitational potential energy is PE = mgh.",
        "The mass is 2 kg.",
        "The height is 10 m.",
        "The acceleration due to gravity is 10 m/s².",
        "Substitute the values: PE = 2 × 10 × 10.",
        "Therefore, the potential energy is 200 J.",
      ],
    },
  },

  {
    id: "physics-work-energy-008",

    question:
      "Which of the following possesses kinetic energy?",

    options: [
      {
        id: "A",
        text: "A stationary car",
      },
      {
        id: "B",
        text: "A book resting on a table",
      },
      {
        id: "C",
        text: "A moving vehicle",
      },
      {
        id: "D",
        text: "A stretched spring at rest",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Kinetic energy is associated with the motion of an object.",

      steps: [
        "An object possesses kinetic energy when it is moving.",
        "A stationary car has no translational kinetic energy.",
        "A book resting on a table is not moving.",
        "A moving vehicle has kinetic energy because it is in motion.",
        "Therefore, the correct answer is a moving vehicle.",
      ],
    },
  },

  {
    id: "physics-work-energy-009",

    question:
      "If the velocity of a moving body is doubled, its kinetic energy becomes",

    options: [
      {
        id: "A",
        text: "Twice as large",
      },
      {
        id: "B",
        text: "Three times as large",
      },
      {
        id: "C",
        text: "Four times as large",
      },
      {
        id: "D",
        text: "Half as large",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Kinetic energy depends on the square of velocity.",

      steps: [
        "Kinetic energy is proportional to v².",
        "If the velocity is doubled, the new velocity is 2v.",
        "The new kinetic energy is proportional to (2v)².",
        "(2v)² = 4v².",
        "Therefore, the kinetic energy becomes four times as large.",
      ],
    },
  },

  {
    id: "physics-work-energy-010",

    question:
      "A force of 50 N acts on a body and moves it through 4 m in the direction of the force. What is the work done?",

    options: [
      {
        id: "A",
        text: "12.5 J",
      },
      {
        id: "B",
        text: "46 J",
      },
      {
        id: "C",
        text: "200 J",
      },
      {
        id: "D",
        text: "250 J",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "When force and displacement are in the same direction, work done is the product of force and displacement.",

      steps: [
        "Use W = Fd.",
        "The force is 50 N.",
        "The displacement is 4 m.",
        "W = 50 × 4.",
        "Therefore, the work done is 200 J.",
      ],
    },
  },

  {
    id: "physics-work-energy-011",

    question:
      "Which of the following is a form of energy possessed by a body because of its position?",

    options: [
      {
        id: "A",
        text: "Kinetic energy",
      },
      {
        id: "B",
        text: "Potential energy",
      },
      {
        id: "C",
        text: "Sound energy",
      },
      {
        id: "D",
        text: "Electrical current",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Potential energy is stored energy associated with position or configuration.",

      steps: [
        "An object can store energy because of its position.",
        "A raised object possesses gravitational potential energy.",
        "This energy can be converted into kinetic energy when the object falls.",
        "Therefore, the correct answer is potential energy.",
      ],
    },
  },

  {
    id: "physics-work-energy-012",

    question:
      "A 1000 W electric motor operates for 10 seconds. How much energy does it use?",

    options: [
      {
        id: "A",
        text: "100 J",
      },
      {
        id: "B",
        text: "1,000 J",
      },
      {
        id: "C",
        text: "10,000 J",
      },
      {
        id: "D",
        text: "100,000 J",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Electrical energy used can be calculated from power multiplied by time.",

      steps: [
        "The formula is E = Pt.",
        "The power is 1000 W.",
        "The operating time is 10 seconds.",
        "E = 1000 × 10.",
        "Therefore, the energy used is 10,000 J.",
      ],
    },
  },

  {
    id: "physics-work-energy-013",

    question:
      "A machine has an input energy of 500 J and produces useful output energy of 400 J. What is its efficiency?",

    options: [
      {
        id: "A",
        text: "20%",
      },
      {
        id: "B",
        text: "40%",
      },
      {
        id: "C",
        text: "80%",
      },
      {
        id: "D",
        text: "125%",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Efficiency compares useful output energy with the total input energy.",

      steps: [
        "Efficiency = useful output energy ÷ input energy × 100%.",
        "The useful output energy is 400 J.",
        "The input energy is 500 J.",
        "Efficiency = 400 ÷ 500 × 100%.",
        "Therefore, the efficiency is 80%.",
      ],
    },
  },

  {
    id: "physics-work-energy-014",

    question:
      "Which of the following statements about a machine with an efficiency of 100% is correct?",

    options: [
      {
        id: "A",
        text: "It produces more energy than it receives",
      },
      {
        id: "B",
        text: "All input energy is converted into useful output energy",
      },
      {
        id: "C",
        text: "It destroys some of the input energy",
      },
      {
        id: "D",
        text: "Its output energy is greater than its input energy",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An efficiency of 100% means that the useful output equals the input energy.",

      steps: [
        "Efficiency is the ratio of useful output to input.",
        "An efficiency of 100% means the ratio is 1.",
        "Therefore, all the input energy is converted into useful output energy.",
        "A machine cannot produce more energy than it receives.",
      ],
    },
  },

  {
    id: "physics-work-energy-015",

    question:
      "A body of mass 10 kg is moving at 2 m/s. What is its kinetic energy?",

    options: [
      {
        id: "A",
        text: "10 J",
      },
      {
        id: "B",
        text: "20 J",
      },
      {
        id: "C",
        text: "40 J",
      },
      {
        id: "D",
        text: "80 J",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Kinetic energy is calculated using half the product of mass and the square of velocity.",

      steps: [
        "Use KE = ½mv².",
        "The mass is 10 kg.",
        "The velocity is 2 m/s.",
        "KE = ½ × 10 × 2².",
        "KE = 5 × 4.",
        "Therefore, the kinetic energy is 20 J.",
      ],
    },
  },

  {
    id: "physics-work-energy-016",

    question:
      "A boy of mass 40 kg climbs a staircase 5 m high. Taking g = 10 m/s², what is the gain in potential energy?",

    options: [
      {
        id: "A",
        text: "80 J",
      },
      {
        id: "B",
        text: "200 J",
      },
      {
        id: "C",
        text: "1,000 J",
      },
      {
        id: "D",
        text: "2,000 J",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "The gain in gravitational potential energy depends on mass, gravitational acceleration and height.",

      steps: [
        "Use PE = mgh.",
        "The mass is 40 kg.",
        "The height is 5 m.",
        "The acceleration due to gravity is 10 m/s².",
        "PE = 40 × 10 × 5.",
        "Therefore, the gain in potential energy is 2,000 J.",
      ],
    },
  },

  {
    id: "physics-work-energy-017",

    question:
      "Which of the following devices converts electrical energy mainly into mechanical energy?",

    options: [
      {
        id: "A",
        text: "Electric motor",
      },
      {
        id: "B",
        text: "Electric heater",
      },
      {
        id: "C",
        text: "Electric lamp",
      },
      {
        id: "D",
        text: "Electric kettle",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "An electric motor converts electrical energy into mechanical energy.",

      steps: [
        "Electrical energy can be transformed into other forms.",
        "An electric motor uses electrical energy to produce motion.",
        "The useful output of a motor is mechanical energy.",
        "Therefore, the correct answer is an electric motor.",
      ],
    },
  },

  {
    id: "physics-work-energy-018",

    question:
      "A machine performs 2,000 J of work in 50 seconds. What is its power?",

    options: [
      {
        id: "A",
        text: "20 W",
      },
      {
        id: "B",
        text: "40 W",
      },
      {
        id: "C",
        text: "100 W",
      },
      {
        id: "D",
        text: "400 W",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Power is the amount of work done per unit time.",

      steps: [
        "Use P = W/t.",
        "The work done is 2,000 J.",
        "The time taken is 50 seconds.",
        "P = 2,000 ÷ 50.",
        "Therefore, the power is 40 W.",
      ],
    },
  },

  {
    id: "physics-work-energy-019",

    question:
      "Which of the following best describes the law of conservation of energy?",

    options: [
      {
        id: "A",
        text: "Energy can be created but cannot be destroyed",
      },
      {
        id: "B",
        text: "Energy can be destroyed but cannot be created",
      },
      {
        id: "C",
        text: "Energy cannot be created or destroyed but can be transformed",
      },
      {
        id: "D",
        text: "Energy disappears whenever work is done",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The conservation of energy states that the total energy of an isolated system remains constant.",

      steps: [
        "Energy exists in different forms.",
        "Energy can change from one form to another.",
        "For example, potential energy can be converted into kinetic energy.",
        "Energy is not created or destroyed in the process.",
        "Therefore, energy cannot be created or destroyed but can be transformed.",
      ],
    },
  },

  {
    id: "physics-work-energy-020",

    question:
      "A 5 kg object is raised vertically through a height of 8 m. Taking g = 10 m/s², what work is done against gravity?",

    options: [
      {
        id: "A",
        text: "40 J",
      },
      {
        id: "B",
        text: "80 J",
      },
      {
        id: "C",
        text: "400 J",
      },
      {
        id: "D",
        text: "800 J",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "When an object is raised vertically, work is done against gravity and is equal to its gain in gravitational potential energy.",

      steps: [
        "The work done against gravity is W = mgh.",
        "The mass is 5 kg.",
        "The height is 8 m.",
        "The acceleration due to gravity is 10 m/s².",
        "W = 5 × 10 × 8.",
        "Therefore, the work done is 400 J.",
      ],
    },
  },
];

export default workEnergyAndPowerQuestions;
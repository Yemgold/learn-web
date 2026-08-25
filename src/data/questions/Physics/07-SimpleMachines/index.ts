



import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — SIMPLE MACHINES
// --------------------------------------------------------------------------

export const simpleMachinesQuestions: ArenaQuestion[] = [
  {
    id: "physics-simple-machines-001",

    question:
      "Which of the following is an example of a simple machine?",

    options: [
      {
        id: "A",
        text: "Lever",
      },
      {
        id: "B",
        text: "Electric motor",
      },
      {
        id: "C",
        text: "Transformer",
      },
      {
        id: "D",
        text: "Battery",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A simple machine is a device that makes work easier by changing the magnitude or direction of a force.",

      steps: [
        "A lever is one of the basic types of simple machines.",
        "Other simple machines include pulleys, inclined planes, wheels and axles, screws and wedges.",
        "An electric motor, transformer and battery are not classified as simple machines.",
        "Therefore, the correct answer is Lever.",
      ],
    },
  },

  {
    id: "physics-simple-machines-002",

    question:
      "A machine has a load of 600 N and an effort of 200 N. What is its mechanical advantage?",

    options: [
      {
        id: "A",
        text: "2",
      },
      {
        id: "B",
        text: "3",
      },
      {
        id: "C",
        text: "4",
      },
      {
        id: "D",
        text: "6",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Mechanical advantage is the ratio of the load to the effort applied to a machine.",

      steps: [
        "Mechanical advantage = Load ÷ Effort.",
        "The load is 600 N.",
        "The effort is 200 N.",
        "Therefore, mechanical advantage = 600 ÷ 200.",
        "The mechanical advantage is 3.",
      ],
    },
  },

  {
    id: "physics-simple-machines-003",

    question:
      "A machine requires an effort of 100 N to raise a load of 400 N. What is its mechanical advantage?",

    options: [
      {
        id: "A",
        text: "0.25",
      },
      {
        id: "B",
        text: "2",
      },
      {
        id: "C",
        text: "4",
      },
      {
        id: "D",
        text: "5",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Mechanical advantage compares the load lifted with the effort required.",

      steps: [
        "Mechanical advantage = Load ÷ Effort.",
        "Load = 400 N.",
        "Effort = 100 N.",
        "Therefore, mechanical advantage = 400 ÷ 100.",
        "The mechanical advantage is 4.",
      ],
    },
  },

  {
    id: "physics-simple-machines-004",

    question:
      "Which of the following simple machines consists of a rigid bar that turns about a fixed point called a fulcrum?",

    options: [
      {
        id: "A",
        text: "Pulley",
      },
      {
        id: "B",
        text: "Lever",
      },
      {
        id: "C",
        text: "Screw",
      },
      {
        id: "D",
        text: "Inclined plane",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A lever is a rigid bar that can rotate about a fixed point called the fulcrum.",

      steps: [
        "A lever consists of a rigid bar.",
        "The bar rotates about a fixed point called the fulcrum.",
        "The positions of the effort, fulcrum and load determine the class of the lever.",
        "Therefore, the correct answer is Lever.",
      ],
    },
  },

  {
    id: "physics-simple-machines-005",

    question:
      "Which class of lever has the fulcrum positioned between the effort and the load?",

    options: [
      {
        id: "A",
        text: "First-class lever",
      },
      {
        id: "B",
        text: "Second-class lever",
      },
      {
        id: "C",
        text: "Third-class lever",
      },
      {
        id: "D",
        text: "Fourth-class lever",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The arrangement of the fulcrum, effort and load determines the class of a lever.",

      steps: [
        "In a first-class lever, the fulcrum lies between the effort and the load.",
        "A pair of scissors is an example of a first-class lever.",
        "In a second-class lever, the load lies between the fulcrum and effort.",
        "In a third-class lever, the effort lies between the fulcrum and load.",
        "Therefore, the correct answer is First-class lever.",
      ],
    },
  },

  {
    id: "physics-simple-machines-006",

    question:
      "Which of the following is an example of a second-class lever?",

    options: [
      {
        id: "A",
        text: "Scissors",
      },
      {
        id: "B",
        text: "Wheelbarrow",
      },
      {
        id: "C",
        text: "Tweezers",
      },
      {
        id: "D",
        text: "Pair of pliers",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A second-class lever has the load positioned between the fulcrum and the effort.",

      steps: [
        "A wheelbarrow has its wheel acting as the fulcrum.",
        "The load is placed between the wheel and the handles where the effort is applied.",
        "This arrangement makes the wheelbarrow a second-class lever.",
        "Therefore, the correct answer is Wheelbarrow.",
      ],
    },
  },

  {
    id: "physics-simple-machines-007",

    question:
      "Which of the following is an example of a third-class lever?",

    options: [
      {
        id: "A",
        text: "Wheelbarrow",
      },
      {
        id: "B",
        text: "Scissors",
      },
      {
        id: "C",
        text: "Tweezers",
      },
      {
        id: "D",
        text: "Bottle opener",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "In a third-class lever, the effort is positioned between the fulcrum and the load.",

      steps: [
        "Tweezers operate as a third-class lever.",
        "The fixed end acts as the fulcrum.",
        "The effort is applied between the fulcrum and the object being held.",
        "Therefore, the correct answer is Tweezers.",
      ],
    },
  },

  {
    id: "physics-simple-machines-008",

    question:
      "A machine lifts a load of 500 N through a distance of 2 m when an effort moves through 10 m. What is the velocity ratio?",

    options: [
      {
        id: "A",
        text: "2",
      },
      {
        id: "B",
        text: "5",
      },
      {
        id: "C",
        text: "8",
      },
      {
        id: "D",
        text: "10",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Velocity ratio is the ratio of the distance moved by the effort to the distance moved by the load.",

      steps: [
        "Velocity ratio = Distance moved by effort ÷ Distance moved by load.",
        "The effort moves through 10 m.",
        "The load moves through 2 m.",
        "Therefore, velocity ratio = 10 ÷ 2.",
        "The velocity ratio is 5.",
      ],
    },
  },

  {
    id: "physics-simple-machines-009",

    question:
      "A machine has a mechanical advantage of 4 and a velocity ratio of 5. What is its efficiency?",

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
        "The efficiency of a machine is the ratio of mechanical advantage to velocity ratio expressed as a percentage.",

      steps: [
        "Efficiency = (Mechanical advantage ÷ Velocity ratio) × 100%.",
        "Mechanical advantage = 4.",
        "Velocity ratio = 5.",
        "Efficiency = (4 ÷ 5) × 100%.",
        "Therefore, the efficiency is 80%.",
      ],
    },
  },

  {
    id: "physics-simple-machines-010",

    question:
      "Why can the efficiency of a real machine never be greater than 100%?",

    options: [
      {
        id: "A",
        text: "Machines always increase the amount of energy supplied",
      },
      {
        id: "B",
        text: "Some energy is lost through friction and other effects",
      },
      {
        id: "C",
        text: "The effort is always greater than the load",
      },
      {
        id: "D",
        text: "The velocity ratio is always zero",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Real machines experience energy losses, mainly because of friction and deformation.",

      steps: [
        "Energy supplied to a machine is converted into useful output energy and energy losses.",
        "Friction between moving parts converts some mechanical energy into heat.",
        "Other losses can also occur due to deformation and resistance.",
        "Consequently, the useful output energy cannot exceed the input energy.",
        "Therefore, the efficiency of a real machine cannot be greater than 100%.",
      ],
    },
  },

  {
    id: "physics-simple-machines-011",

    question:
      "Which simple machine is commonly used to change the direction of an applied force?",

    options: [
      {
        id: "A",
        text: "Fixed pulley",
      },
      {
        id: "B",
        text: "Screw",
      },
      {
        id: "C",
        text: "Wedge",
      },
      {
        id: "D",
        text: "Wheel and axle",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A fixed pulley can change the direction in which an effort is applied.",

      steps: [
        "In a fixed pulley, the pulley is attached to a fixed support.",
        "Pulling downward on the rope can cause the load to move upward.",
        "Thus, the direction of the applied effort is changed.",
        "Therefore, the correct answer is Fixed pulley.",
      ],
    },
  },

  {
    id: "physics-simple-machines-012",

    question:
      "A machine has an input energy of 500 J and produces a useful output energy of 400 J. What is its efficiency?",

    options: [
      {
        id: "A",
        text: "40%",
      },
      {
        id: "B",
        text: "60%",
      },
      {
        id: "C",
        text: "80%",
      },
      {
        id: "D",
        text: "90%",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Efficiency is the ratio of useful output energy to input energy expressed as a percentage.",

      steps: [
        "Efficiency = (Useful output energy ÷ Input energy) × 100%.",
        "Useful output energy = 400 J.",
        "Input energy = 500 J.",
        "Efficiency = (400 ÷ 500) × 100%.",
        "Therefore, the efficiency is 80%.",
      ],
    },
  },
];

// --------------------------------------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------------------------------------

export default simpleMachinesQuestions;
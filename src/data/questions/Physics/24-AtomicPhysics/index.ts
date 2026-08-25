



import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — ATOMIC PHYSICS
// --------------------------------------------------------------------------

export const atomicPhysicsQuestions: ArenaQuestion[] = [
  {
    id: "physics-atomic-001",

    question:
      "Which of the following particles has a negative electric charge?",

    options: [
      {
        id: "A",
        text: "Proton",
      },
      {
        id: "B",
        text: "Neutron",
      },
      {
        id: "C",
        text: "Electron",
      },
      {
        id: "D",
        text: "Alpha particle",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "An electron is a subatomic particle carrying a negative electric charge.",

      steps: [
        "Atoms contain protons, neutrons and electrons.",
        "Protons have a positive charge.",
        "Neutrons have no electric charge.",
        "Electrons have a negative electric charge.",
        "Therefore, the correct answer is Electron.",
      ],
    },
  },

  {
    id: "physics-atomic-002",

    question:
      "The atomic number of an element is equal to the number of",

    options: [
      {
        id: "A",
        text: "neutrons in the nucleus",
      },
      {
        id: "B",
        text: "protons in the nucleus",
      },
      {
        id: "C",
        text: "neutrons and electrons",
      },
      {
        id: "D",
        text: "protons and neutrons",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The atomic number identifies an element by the number of protons in its nucleus.",

      steps: [
        "The nucleus contains protons and neutrons.",
        "The number of protons determines the identity of an element.",
        "This number is called the atomic number.",
        "Therefore, atomic number is equal to the number of protons in the nucleus.",
      ],
    },
  },

  {
    id: "physics-atomic-003",

    question:
      "An atom has 11 protons and 12 neutrons. What is its mass number?",

    options: [
      {
        id: "A",
        text: "11",
      },
      {
        id: "B",
        text: "12",
      },
      {
        id: "C",
        text: "23",
      },
      {
        id: "D",
        text: "24",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The mass number is the total number of protons and neutrons in the nucleus.",

      steps: [
        "Number of protons = 11.",
        "Number of neutrons = 12.",
        "Mass number = protons + neutrons.",
        "Mass number = 11 + 12 = 23.",
        "Therefore, the correct answer is 23.",
      ],
    },
  },

  {
    id: "physics-atomic-004",

    question:
      "Which of the following is an isotope of an element?",

    options: [
      {
        id: "A",
        text: "Atoms having the same number of protons but different numbers of neutrons",
      },
      {
        id: "B",
        text: "Atoms having different numbers of protons but the same number of neutrons",
      },
      {
        id: "C",
        text: "Atoms having the same mass number but different atomic numbers",
      },
      {
        id: "D",
        text: "Atoms having different numbers of electrons only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Isotopes are atoms of the same element with the same atomic number but different mass numbers.",

      steps: [
        "Atoms of the same element have the same number of protons.",
        "Isotopes differ in the number of neutrons they contain.",
        "A difference in neutron number produces different mass numbers.",
        "Therefore, isotopes have the same number of protons but different numbers of neutrons.",
      ],
    },
  },

  {
    id: "physics-atomic-005",

    question:
      "Which of the following radiations has the greatest penetrating power?",

    options: [
      {
        id: "A",
        text: "Alpha radiation",
      },
      {
        id: "B",
        text: "Beta radiation",
      },
      {
        id: "C",
        text: "Gamma radiation",
      },
      {
        id: "D",
        text: "Ultraviolet radiation",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Gamma radiation has the greatest penetrating power among alpha, beta and gamma radiation.",

      steps: [
        "Alpha particles have relatively low penetrating power.",
        "Beta particles penetrate more deeply than alpha particles.",
        "Gamma rays are highly penetrating electromagnetic radiation.",
        "Gamma radiation can pass through materials that stop alpha and beta radiation.",
        "Therefore, the correct answer is Gamma radiation.",
      ],
    },
  },

  {
    id: "physics-atomic-006",

    question:
      "Which type of radioactive emission consists of helium nuclei?",

    options: [
      {
        id: "A",
        text: "Alpha radiation",
      },
      {
        id: "B",
        text: "Beta radiation",
      },
      {
        id: "C",
        text: "Gamma radiation",
      },
      {
        id: "D",
        text: "X-radiation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "An alpha particle is essentially a helium nucleus consisting of two protons and two neutrons.",

      steps: [
        "Alpha radiation consists of alpha particles.",
        "Each alpha particle contains two protons and two neutrons.",
        "This combination is the nucleus of a helium atom.",
        "Therefore, alpha radiation consists of helium nuclei.",
      ],
    },
  },

  {
    id: "physics-atomic-007",

    question:
      "What happens to the atomic number of an element when it emits an alpha particle?",

    options: [
      {
        id: "A",
        text: "It increases by 2",
      },
      {
        id: "B",
        text: "It decreases by 2",
      },
      {
        id: "C",
        text: "It increases by 4",
      },
      {
        id: "D",
        text: "It remains unchanged",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An alpha particle contains two protons, so alpha emission reduces the atomic number by two.",

      steps: [
        "The atomic number is the number of protons in the nucleus.",
        "An alpha particle contains two protons.",
        "When an alpha particle is emitted, two protons leave the nucleus.",
        "Therefore, the atomic number decreases by 2.",
      ],
    },
  },

  {
    id: "physics-atomic-008",

    question:
      "Which radioactive emission is negatively charged?",

    options: [
      {
        id: "A",
        text: "Alpha particle",
      },
      {
        id: "B",
        text: "Beta particle",
      },
      {
        id: "C",
        text: "Gamma ray",
      },
      {
        id: "D",
        text: "Neutron",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A beta-minus particle is a high-speed electron and therefore carries a negative charge.",

      steps: [
        "Alpha particles have a positive charge.",
        "Beta-minus particles are high-speed electrons.",
        "Electrons have a negative charge.",
        "Gamma rays have no electric charge.",
        "Therefore, the negatively charged radioactive emission is the beta particle.",
      ],
    },
  },

  {
    id: "physics-atomic-009",

    question:
      "The half-life of a radioactive substance is 4 hours. If the initial amount is 80 g, what amount will remain after 8 hours?",

    options: [
      {
        id: "A",
        text: "40 g",
      },
      {
        id: "B",
        text: "30 g",
      },
      {
        id: "C",
        text: "20 g",
      },
      {
        id: "D",
        text: "10 g",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The half-life is the time required for half of a radioactive substance to decay.",

      steps: [
        "Initial amount = 80 g.",
        "Half-life = 4 hours.",
        "After 4 hours, half of 80 g remains: 40 g.",
        "After another 4 hours, half of 40 g remains: 20 g.",
        "Therefore, after 8 hours, 20 g remains.",
      ],
    },
  },

  {
    id: "physics-atomic-010",

    question:
      "Which instrument is commonly used to detect ionizing radiation?",

    options: [
      {
        id: "A",
        text: "Thermometer",
      },
      {
        id: "B",
        text: "Geiger-Muller counter",
      },
      {
        id: "C",
        text: "Ammeter",
      },
      {
        id: "D",
        text: "Barometer",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A Geiger-Muller counter is an instrument used to detect and measure ionizing radiation.",

      steps: [
        "Ionizing radiation can produce charged particles when it interacts with matter.",
        "A Geiger-Muller counter detects these radiation events.",
        "A thermometer measures temperature.",
        "An ammeter measures electric current.",
        "A barometer measures atmospheric pressure.",
        "Therefore, the correct answer is Geiger-Muller counter.",
      ],
    },
  },
];

export default atomicPhysicsQuestions;
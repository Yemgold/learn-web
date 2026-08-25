

// C:\Users\Lara Spellman\Jamb\jamb-league\src\data\questions\Physics\25-NuclearPhysics\index.ts

import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — NUCLEAR PHYSICS                                                  */
/* -------------------------------------------------------------------------- */

export const nuclearPhysicsQuestions: ArenaQuestion[] = [
  {
    id: "physics-nuclear-001",

    question:
      "Which of the following particles is emitted during alpha decay?",

    options: [
      {
        id: "A",
        text: "An electron",
      },
      {
        id: "B",
        text: "A helium nucleus",
      },
      {
        id: "C",
        text: "A neutron",
      },
      {
        id: "D",
        text: "A proton",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An alpha particle is the nucleus of a helium atom and consists of two protons and two neutrons.",

      steps: [
        "Alpha decay involves the emission of an alpha particle.",
        "An alpha particle contains two protons and two neutrons.",
        "This is the same as the nucleus of a helium atom.",
        "Therefore, the correct answer is a helium nucleus.",
      ],
    },
  },

  {
    id: "physics-nuclear-002",

    question:
      "Which of the following is a characteristic of radioactive substances?",

    options: [
      {
        id: "A",
        text: "They emit radiation spontaneously",
      },
      {
        id: "B",
        text: "They can only emit radiation when heated",
      },
      {
        id: "C",
        text: "They always produce visible light",
      },
      {
        id: "D",
        text: "They become radioactive only when exposed to sunlight",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Radioactive substances contain unstable nuclei that spontaneously undergo nuclear transformations and emit radiation.",

      steps: [
        "Some atomic nuclei are unstable.",
        "Unstable nuclei spontaneously transform into more stable states.",
        "During this process, radiation may be emitted.",
        "The emission does not require heating or exposure to sunlight.",
        "Therefore, radioactive substances emit radiation spontaneously.",
      ],
    },
  },

  {
    id: "physics-nuclear-003",

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
        text: "Visible radiation",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Gamma radiation is highly penetrating because it consists of high-energy electromagnetic radiation.",

      steps: [
        "Alpha particles have relatively low penetrating power.",
        "Beta particles penetrate materials more deeply than alpha particles.",
        "Gamma rays have much greater penetrating power than alpha and beta radiation.",
        "Therefore, gamma radiation has the greatest penetrating power.",
      ],
    },
  },

  {
    id: "physics-nuclear-004",

    question:
      "What is meant by the half-life of a radioactive substance?",

    options: [
      {
        id: "A",
        text: "The time taken for all the radioactive nuclei to decay",
      },
      {
        id: "B",
        text: "The time taken for half of the radioactive nuclei to decay",
      },
      {
        id: "C",
        text: "The time taken for the substance to become twice as radioactive",
      },
      {
        id: "D",
        text: "The time taken for the temperature of the substance to halve",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Half-life is the time required for half of the unstable radioactive nuclei in a sample to decay.",

      steps: [
        "A radioactive sample contains unstable nuclei.",
        "These nuclei decay at a characteristic rate.",
        "The half-life is the time required for half of the original radioactive nuclei to decay.",
        "Therefore, the correct answer is the time taken for half of the radioactive nuclei to decay.",
      ],
    },
  },

  {
    id: "physics-nuclear-005",

    question:
      "Which of the following is used to detect ionizing radiation?",

    options: [
      {
        id: "A",
        text: "Thermometer",
      },
      {
        id: "B",
        text: "Geiger-Müller counter",
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
        "A Geiger-Müller counter is an instrument used to detect and measure ionizing radiation.",

      steps: [
        "Ionizing radiation can produce ionization in suitable materials.",
        "A Geiger-Müller counter detects the ionization produced by radiation.",
        "A thermometer measures temperature.",
        "An ammeter measures electric current.",
        "A barometer measures atmospheric pressure.",
        "Therefore, the correct answer is Geiger-Müller counter.",
      ],
    },
  },

  {
    id: "physics-nuclear-006",

    question:
      "Which type of radioactive emission consists of negatively charged particles?",

    options: [
      {
        id: "A",
        text: "Alpha particles",
      },
      {
        id: "B",
        text: "Beta particles",
      },
      {
        id: "C",
        text: "Gamma rays",
      },
      {
        id: "D",
        text: "Neutrons",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Beta-minus radiation consists of high-speed electrons, which carry negative electric charge.",

      steps: [
        "Beta-minus decay involves the emission of an electron from the nucleus.",
        "An electron has a negative electric charge.",
        "Alpha particles are positively charged.",
        "Gamma rays have no electric charge.",
        "Therefore, beta particles are the negatively charged emission.",
      ],
    },
  },

  {
    id: "physics-nuclear-007",

    question:
      "What happens to the atomic number of a nucleus during alpha decay?",

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
        "An alpha particle contains two protons, so the emission of an alpha particle reduces the atomic number by two.",

      steps: [
        "The atomic number is the number of protons in the nucleus.",
        "An alpha particle contains two protons.",
        "When an alpha particle is emitted, two protons leave the nucleus.",
        "Therefore, the atomic number decreases by 2.",
      ],
    },
  },

  {
    id: "physics-nuclear-008",

    question:
      "What happens to the mass number of a nucleus during alpha decay?",

    options: [
      {
        id: "A",
        text: "It decreases by 2",
      },
      {
        id: "B",
        text: "It decreases by 4",
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
        "An alpha particle contains two protons and two neutrons, giving it a mass number of four.",

      steps: [
        "Mass number is the total number of protons and neutrons in a nucleus.",
        "An alpha particle contains two protons and two neutrons.",
        "Therefore, an alpha particle has a mass number of 4.",
        "When it is emitted, the original nucleus loses four nucleons.",
        "Therefore, the mass number decreases by 4.",
      ],
    },
  },

  {
    id: "physics-nuclear-009",

    question:
      "Which process involves the splitting of a heavy atomic nucleus into smaller nuclei?",

    options: [
      {
        id: "A",
        text: "Nuclear fusion",
      },
      {
        id: "B",
        text: "Nuclear fission",
      },
      {
        id: "C",
        text: "Ionization",
      },
      {
        id: "D",
        text: "Radioactive excitation",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Nuclear fission is the splitting of a heavy nucleus into two or more smaller nuclei, usually releasing energy.",

      steps: [
        "A heavy atomic nucleus can become unstable after absorbing a neutron.",
        "The nucleus may split into smaller nuclei.",
        "This process is called nuclear fission.",
        "A large amount of energy can be released during the process.",
        "Therefore, the correct answer is nuclear fission.",
      ],
    },
  },

  {
    id: "physics-nuclear-010",

    question:
      "Which process is responsible for the production of energy in the Sun?",

    options: [
      {
        id: "A",
        text: "Nuclear fission",
      },
      {
        id: "B",
        text: "Nuclear fusion",
      },
      {
        id: "C",
        text: "Chemical combustion",
      },
      {
        id: "D",
        text: "Radioactive cooling",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The Sun produces enormous amounts of energy through nuclear fusion reactions in its core.",

      steps: [
        "The Sun contains large amounts of hydrogen.",
        "Under extremely high temperature and pressure, hydrogen nuclei combine.",
        "This process is called nuclear fusion.",
        "Fusion converts a small amount of mass into energy.",
        "Therefore, nuclear fusion is responsible for the Sun's energy production.",
      ],
    },
  },

  {
    id: "physics-nuclear-011",

    question:
      "Which of the following particles is electrically neutral?",

    options: [
      {
        id: "A",
        text: "Proton",
      },
      {
        id: "B",
        text: "Electron",
      },
      {
        id: "C",
        text: "Neutron",
      },
      {
        id: "D",
        text: "Alpha particle",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A neutron has no net electric charge.",

      steps: [
        "A proton has a positive electric charge.",
        "An electron has a negative electric charge.",
        "A neutron has no electric charge.",
        "An alpha particle contains two protons and is therefore positively charged.",
        "Therefore, the correct answer is neutron.",
      ],
    },
  },

  {
    id: "physics-nuclear-012",

    question:
      "Which of the following materials is commonly used to shield against gamma radiation?",

    options: [
      {
        id: "A",
        text: "Paper",
      },
      {
        id: "B",
        text: "Thin plastic sheet",
      },
      {
        id: "C",
        text: "Thick lead",
      },
      {
        id: "D",
        text: "Cotton wool",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Gamma radiation is highly penetrating, so dense materials such as thick lead or concrete are commonly used for shielding.",

      steps: [
        "Gamma rays can penetrate paper and thin materials.",
        "A dense material is needed to reduce gamma radiation effectively.",
        "Lead has a high density and is commonly used as a radiation shield.",
        "Therefore, thick lead is the best option listed.",
      ],
    },
  },

  {
    id: "physics-nuclear-013",

    question:
      "A radioactive sample has a half-life of 10 days. What fraction of the original sample remains after 30 days?",

    options: [
      {
        id: "A",
        text: "1/2",
      },
      {
        id: "B",
        text: "1/4",
      },
      {
        id: "C",
        text: "1/8",
      },
      {
        id: "D",
        text: "1/16",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Thirty days represents three half-lives when the half-life is 10 days.",

      steps: [
        "Half-life = 10 days.",
        "Number of half-lives = 30 ÷ 10 = 3.",
        "After the first half-life, 1/2 remains.",
        "After the second half-life, 1/4 remains.",
        "After the third half-life, 1/8 remains.",
        "Therefore, one-eighth of the original sample remains.",
      ],
    },
  },

  {
    id: "physics-nuclear-014",

    question:
      "Which of the following is a major application of radioisotopes in medicine?",

    options: [
      {
        id: "A",
        text: "Food preservation and sterilization only",
      },
      {
        id: "B",
        text: "Diagnosis and treatment of some diseases",
      },
      {
        id: "C",
        text: "Increasing blood pressure",
      },
      {
        id: "D",
        text: "Producing oxygen in the lungs",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Radioisotopes have important medical applications, including diagnostic imaging and treatment of certain diseases.",

      steps: [
        "Some radioisotopes can be introduced into the body in controlled amounts.",
        "Their radiation can be detected to provide information about organs and tissues.",
        "Certain radioactive sources can also be used to destroy abnormal cells.",
        "Therefore, radioisotopes can be used in the diagnosis and treatment of some diseases.",
      ],
    },
  },

  {
    id: "physics-nuclear-015",

    question:
      "Which of the following is an important safety precaution when working with radioactive materials?",

    options: [
      {
        id: "A",
        text: "Increase exposure time",
      },
      {
        id: "B",
        text: "Move as close as possible to the source",
      },
      {
        id: "C",
        text: "Reduce exposure time and increase distance",
      },
      {
        id: "D",
        text: "Store radioactive sources without shielding",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Radiation exposure can be reduced by limiting the time spent near a source, increasing distance from it and using suitable shielding.",

      steps: [
        "Radiation exposure increases with the time spent near a radioactive source.",
        "Reducing exposure time reduces the dose received.",
        "Increasing distance from the source generally reduces exposure.",
        "Appropriate shielding can provide additional protection.",
        "Therefore, reducing exposure time and increasing distance is correct.",
      ],
    },
  },
];

export default nuclearPhysicsQuestions;
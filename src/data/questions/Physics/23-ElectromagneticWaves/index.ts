


import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — ELECTROMAGNETIC WAVES
// --------------------------------------------------------------------------

export const electromagneticWavesQuestions: ArenaQuestion[] = [
  {
    id: "physics-electromagnetic-waves-001",

    question:
      "Which of the following is a characteristic common to all electromagnetic waves?",

    options: [
      {
        id: "A",
        text: "They require a material medium for propagation",
      },
      {
        id: "B",
        text: "They travel through vacuum",
      },
      {
        id: "C",
        text: "They are all sound waves",
      },
      {
        id: "D",
        text: "They cannot travel through space",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Electromagnetic waves can propagate through a vacuum and therefore do not require a material medium.",

      steps: [
        "Electromagnetic waves consist of oscillating electric and magnetic fields.",
        "The electric and magnetic fields can sustain propagation through empty space.",
        "Therefore, electromagnetic waves do not require a material medium.",
        "They can travel through the vacuum of space.",
        "Therefore, the correct answer is that they travel through vacuum.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-002",

    question:
      "Which of the following electromagnetic waves has the highest frequency?",

    options: [
      {
        id: "A",
        text: "Radio waves",
      },
      {
        id: "B",
        text: "Microwaves",
      },
      {
        id: "C",
        text: "Ultraviolet rays",
      },
      {
        id: "D",
        text: "Gamma rays",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Gamma rays occupy the highest-frequency region of the electromagnetic spectrum.",

      steps: [
        "The electromagnetic spectrum contains radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays.",
        "Frequency increases across the spectrum from radio waves toward gamma rays.",
        "Gamma rays therefore have the highest frequency.",
        "They also have the shortest wavelengths.",
        "Therefore, the correct answer is Gamma rays.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-003",

    question:
      "Which electromagnetic radiation has the longest wavelength?",

    options: [
      {
        id: "A",
        text: "Gamma rays",
      },
      {
        id: "B",
        text: "X-rays",
      },
      {
        id: "C",
        text: "Radio waves",
      },
      {
        id: "D",
        text: "Ultraviolet rays",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Radio waves have the longest wavelengths in the electromagnetic spectrum.",

      steps: [
        "Wavelength and frequency are inversely related for electromagnetic waves.",
        "Radio waves occupy the low-frequency end of the electromagnetic spectrum.",
        "Therefore, they have the longest wavelengths.",
        "Gamma rays have the shortest wavelengths.",
        "Therefore, the correct answer is Radio waves.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-004",

    question:
      "Which of the following electromagnetic waves is commonly used for television and radio communication?",

    options: [
      {
        id: "A",
        text: "Radio waves",
      },
      {
        id: "B",
        text: "Gamma rays",
      },
      {
        id: "C",
        text: "X-rays",
      },
      {
        id: "D",
        text: "Ultraviolet rays",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Radio waves are widely used for transmitting radio and television signals.",

      steps: [
        "Communication systems require electromagnetic waves to carry information.",
        "Radio-frequency waves can be modulated to carry audio and other information.",
        "Radio and television broadcasting therefore use radio waves.",
        "X-rays, ultraviolet rays and gamma rays have different applications.",
        "Therefore, the correct answer is Radio waves.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-005",

    question:
      "Which electromagnetic radiation is commonly used in remote controls?",

    options: [
      {
        id: "A",
        text: "Infrared radiation",
      },
      {
        id: "B",
        text: "Gamma radiation",
      },
      {
        id: "C",
        text: "X-rays",
      },
      {
        id: "D",
        text: "Ultraviolet radiation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Many television and electronic-device remote controls transmit signals using infrared radiation.",

      steps: [
        "A remote control needs to transmit coded signals to a receiving device.",
        "Infrared radiation can be produced by an infrared LED.",
        "The emitted infrared signal carries the information to the receiver.",
        "The receiver detects and interprets the signal.",
        "Therefore, the correct answer is Infrared radiation.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-006",

    question:
      "Which electromagnetic radiation is commonly used for taking photographs of bones in medical diagnosis?",

    options: [
      {
        id: "A",
        text: "Radio waves",
      },
      {
        id: "B",
        text: "Microwaves",
      },
      {
        id: "C",
        text: "X-rays",
      },
      {
        id: "D",
        text: "Infrared radiation",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "X-rays can pass through soft tissues more readily than bones and are therefore useful for producing medical images of bones.",

      steps: [
        "X-rays are high-energy electromagnetic radiation.",
        "They can penetrate body tissues.",
        "Bones absorb X-rays more strongly than many surrounding soft tissues.",
        "This difference allows an image of the internal structure to be produced.",
        "Therefore, the correct answer is X-rays.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-007",

    question:
      "Which electromagnetic radiation is responsible for most of the visible light detected by the human eye?",

    options: [
      {
        id: "A",
        text: "Visible light",
      },
      {
        id: "B",
        text: "Radio waves",
      },
      {
        id: "C",
        text: "Microwaves",
      },
      {
        id: "D",
        text: "Gamma rays",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Visible light is the portion of the electromagnetic spectrum that can be detected by the normal human eye.",

      steps: [
        "The electromagnetic spectrum contains radiation of different wavelengths and frequencies.",
        "Only a small region of this spectrum is visible to the human eye.",
        "This region is called visible light.",
        "Radio waves, microwaves and gamma rays are outside the visible range.",
        "Therefore, the correct answer is Visible light.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-008",

    question:
      "Which electromagnetic radiation is mainly responsible for causing sunburn?",

    options: [
      {
        id: "A",
        text: "Infrared radiation",
      },
      {
        id: "B",
        text: "Ultraviolet radiation",
      },
      {
        id: "C",
        text: "Radio waves",
      },
      {
        id: "D",
        text: "Microwaves",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Excessive exposure to ultraviolet radiation from the Sun can damage skin cells and cause sunburn.",

      steps: [
        "The Sun emits different types of electromagnetic radiation.",
        "Ultraviolet radiation has higher frequency and energy than visible light.",
        "Excessive ultraviolet exposure can damage skin cells.",
        "This damage can result in sunburn.",
        "Therefore, the correct answer is Ultraviolet radiation.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-009",

    question:
      "Which of the following is an important use of microwaves?",

    options: [
      {
        id: "A",
        text: "Satellite communication",
      },
      {
        id: "B",
        text: "Detecting bone fractures using X-ray imaging",
      },
      {
        id: "C",
        text: "Sterilizing some medical equipment using gamma radiation",
      },
      {
        id: "D",
        text: "Producing visible colours in the human eye",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Microwaves are useful in communication systems, including satellite communication.",

      steps: [
        "Microwaves can travel through the atmosphere and can carry large amounts of information.",
        "They are therefore useful in communication technology.",
        "Satellite communication commonly uses microwave frequencies.",
        "X-rays and gamma rays have different applications.",
        "Therefore, the correct answer is Satellite communication.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-waves-010",

    question:
      "Which statement correctly describes the speed of electromagnetic waves in a vacuum?",

    options: [
      {
        id: "A",
        text: "It depends on their colour",
      },
      {
        id: "B",
        text: "It depends on their frequency",
      },
      {
        id: "C",
        text: "They all travel at the same speed",
      },
      {
        id: "D",
        text: "Only radio waves can travel in a vacuum",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "In a vacuum, all electromagnetic waves propagate at the same speed, approximately 3.0 × 10⁸ m/s.",

      steps: [
        "Radio waves, microwaves, infrared, visible light, ultraviolet, X-rays and gamma rays are all electromagnetic waves.",
        "In a vacuum, they all travel at the speed of light.",
        "Their frequencies and wavelengths differ, but their vacuum speed is the same.",
        "Therefore, the correct answer is that they all travel at the same speed.",
      ],
    },
  },
];

export default electromagneticWavesQuestions;
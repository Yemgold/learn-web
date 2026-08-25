



import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — WAVES
// --------------------------------------------------------------------------

export const wavesQuestions: ArenaQuestion[] = [
  {
    id: "physics-waves-001",

    question:
      "Which of the following is a characteristic of a wave motion?",

    options: [
      {
        id: "A",
        text: "Permanent transfer of matter from one point to another",
      },
      {
        id: "B",
        text: "Transfer of energy from one point to another",
      },
      {
        id: "C",
        text: "Production of matter",
      },
      {
        id: "D",
        text: "Destruction of energy",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A wave is a disturbance that transfers energy from one location to another without causing a net transfer of matter.",

      steps: [
        "A wave is produced when a disturbance occurs in a medium or field.",
        "The disturbance carries energy from one point to another.",
        "The particles of the medium generally oscillate about their equilibrium positions.",
        "Therefore, the main characteristic is the transfer of energy.",
      ],
    },
  },

  {
    id: "physics-waves-002",

    question:
      "The distance between two successive crests of a wave is known as",

    options: [
      {
        id: "A",
        text: "Amplitude",
      },
      {
        id: "B",
        text: "Frequency",
      },
      {
        id: "C",
        text: "Wavelength",
      },
      {
        id: "D",
        text: "Period",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Wavelength is the distance between two successive points on a wave that are in the same phase.",

      steps: [
        "A crest is the highest point of a transverse wave.",
        "The distance from one crest to the next crest is one complete wavelength.",
        "Wavelength is represented by the symbol λ.",
        "Therefore, the correct answer is Wavelength.",
      ],
    },
  },

  {
    id: "physics-waves-003",

    question:
      "A wave has a frequency of 5 Hz and a wavelength of 4 m. What is its speed?",

    options: [
      {
        id: "A",
        text: "0.8 m/s",
      },
      {
        id: "B",
        text: "1.25 m/s",
      },
      {
        id: "C",
        text: "9 m/s",
      },
      {
        id: "D",
        text: "20 m/s",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "The speed of a wave is related to its frequency and wavelength.",

      steps: [
        "Use the wave relationship: v = fλ.",
        "The frequency is 5 Hz.",
        "The wavelength is 4 m.",
        "Substitute the values: v = 5 × 4.",
        "Therefore, the wave speed is 20 m/s.",
      ],
    },
  },

  {
    id: "physics-waves-004",

    question:
      "Which of the following is an example of a transverse wave?",

    options: [
      {
        id: "A",
        text: "Sound wave in air",
      },
      {
        id: "B",
        text: "Wave on the surface of water",
      },
      {
        id: "C",
        text: "Compression wave in a spring",
      },
      {
        id: "D",
        text: "Sound wave in a liquid",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "In a transverse wave, particles of the medium vibrate perpendicular to the direction in which the wave travels.",

      steps: [
        "In a transverse wave, the vibration is perpendicular to the direction of propagation.",
        "Surface water waves are commonly treated as transverse waves at this level.",
        "Sound waves in fluids are longitudinal.",
        "Therefore, a wave on the surface of water is the correct answer.",
      ],
    },
  },

  {
    id: "physics-waves-005",

    question:
      "Which of the following waves requires a material medium for its propagation?",

    options: [
      {
        id: "A",
        text: "Light wave",
      },
      {
        id: "B",
        text: "Radio wave",
      },
      {
        id: "C",
        text: "Sound wave",
      },
      {
        id: "D",
        text: "X-ray",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Sound is a mechanical wave and requires particles of a medium through which it can propagate.",

      steps: [
        "Mechanical waves require a material medium.",
        "Sound is produced by vibrations of particles.",
        "Sound can travel through solids, liquids and gases.",
        "Light, radio waves and X-rays are electromagnetic waves and can travel through a vacuum.",
        "Therefore, the correct answer is Sound wave.",
      ],
    },
  },

  {
    id: "physics-waves-006",

    question:
      "The number of complete oscillations made by a vibrating body in one second is called",

    options: [
      {
        id: "A",
        text: "Amplitude",
      },
      {
        id: "B",
        text: "Frequency",
      },
      {
        id: "C",
        text: "Wavelength",
      },
      {
        id: "D",
        text: "Phase",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Frequency is the number of complete oscillations or cycles made per second.",

      steps: [
        "One complete oscillation is one cycle.",
        "Frequency measures how many cycles occur in one second.",
        "The SI unit of frequency is the hertz (Hz).",
        "Therefore, the correct answer is Frequency.",
      ],
    },
  },

  {
    id: "physics-waves-007",

    question:
      "A wave makes 600 complete oscillations in 2 minutes. What is its frequency?",

    options: [
      {
        id: "A",
        text: "2 Hz",
      },
      {
        id: "B",
        text: "5 Hz",
      },
      {
        id: "C",
        text: "10 Hz",
      },
      {
        id: "D",
        text: "300 Hz",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Frequency is the number of complete oscillations per second.",

      steps: [
        "The wave makes 600 oscillations.",
        "2 minutes is equal to 120 seconds.",
        "Frequency = number of oscillations ÷ time.",
        "Frequency = 600 ÷ 120.",
        "Therefore, the frequency is 5 Hz.",
      ],
    },
  },

  {
    id: "physics-waves-008",

    question:
      "Which of the following phenomena demonstrates the bending of waves around an obstacle or through an opening?",

    options: [
      {
        id: "A",
        text: "Reflection",
      },
      {
        id: "B",
        text: "Refraction",
      },
      {
        id: "C",
        text: "Diffraction",
      },
      {
        id: "D",
        text: "Polarization",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Diffraction is the spreading or bending of waves when they pass through an opening or around an obstacle.",

      steps: [
        "Waves can spread after passing through a narrow opening.",
        "They can also bend around the edges of obstacles.",
        "This phenomenon is called diffraction.",
        "Therefore, the correct answer is Diffraction.",
      ],
    },
  },

  {
    id: "physics-waves-009",

    question:
      "When a wave changes direction as it passes from one medium to another because its speed changes, the phenomenon is called",

    options: [
      {
        id: "A",
        text: "Reflection",
      },
      {
        id: "B",
        text: "Refraction",
      },
      {
        id: "C",
        text: "Diffraction",
      },
      {
        id: "D",
        text: "Interference",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Refraction occurs when a wave changes speed and consequently changes direction as it enters another medium.",

      steps: [
        "A wave may travel at different speeds in different media.",
        "When its speed changes at a boundary, its direction may also change.",
        "This change in direction is called refraction.",
        "Therefore, the correct answer is Refraction.",
      ],
    },
  },

  {
    id: "physics-waves-010",

    question:
      "Two waves of the same frequency travelling in the same medium are said to be in phase when they have",

    options: [
      {
        id: "A",
        text: "Different amplitudes only",
      },
      {
        id: "B",
        text: "The same displacement and direction of motion at the same time",
      },
      {
        id: "C",
        text: "Different wavelengths",
      },
      {
        id: "D",
        text: "Different frequencies",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Two waves are in phase when corresponding points on the waves have the same displacement and are moving in the same direction at the same instant.",

      steps: [
        "Phase describes the position of a vibrating particle within its cycle.",
        "Two waves with the same phase reach corresponding positions at the same time.",
        "They have the same displacement and direction of motion at that instant.",
        "Therefore, the correct answer is the same displacement and direction of motion at the same time.",
      ],
    },
  },
];

export default wavesQuestions;
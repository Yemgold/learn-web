


// --------------------------------------------------------------------------
// PHYSICS — SOUND WAVES
// --------------------------------------------------------------------------

import type { ArenaQuestion } from "@/components/arena/Arena";

export const soundWavesQuestions: ArenaQuestion[] = [
  {
    id: "physics-sound-waves-001",

    question:
      "Which of the following is required for sound to travel from one place to another?",

    options: [
      {
        id: "A",
        text: "A material medium",
      },
      {
        id: "B",
        text: "A vacuum",
      },
      {
        id: "C",
        text: "Only sunlight",
      },
      {
        id: "D",
        text: "Only an electric field",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Sound is a mechanical wave and therefore requires a material medium for its propagation.",

      steps: [
        "Sound is produced by the vibration of a source.",
        "The vibration is transferred from particle to particle through a medium.",
        "The medium may be a solid, liquid or gas.",
        "Sound cannot travel through a vacuum.",
        "Therefore, a material medium is required.",
      ],
    },
  },

  {
    id: "physics-sound-waves-002",

    question:
      "Which of the following types of wave is a sound wave in air?",

    options: [
      {
        id: "A",
        text: "Transverse wave",
      },
      {
        id: "B",
        text: "Longitudinal wave",
      },
      {
        id: "C",
        text: "Electromagnetic wave",
      },
      {
        id: "D",
        text: "Stationary electromagnetic wave",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Sound travels through air as a longitudinal mechanical wave.",

      steps: [
        "Particles of air vibrate back and forth in the direction of wave propagation.",
        "This produces compressions and rarefactions.",
        "A wave in which particles vibrate parallel to the direction of propagation is longitudinal.",
        "Therefore, sound in air is a longitudinal wave.",
      ],
    },
  },

  {
    id: "physics-sound-waves-003",

    question:
      "The distance between two successive compressions in a sound wave is called the",

    options: [
      {
        id: "A",
        text: "amplitude",
      },
      {
        id: "B",
        text: "frequency",
      },
      {
        id: "C",
        text: "wavelength",
      },
      {
        id: "D",
        text: "period",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Wavelength is the distance between two successive points that are in the same phase.",

      steps: [
        "A sound wave contains alternating compressions and rarefactions.",
        "The distance from one compression to the next compression is one complete wavelength.",
        "Wavelength is usually represented by the symbol λ.",
        "Therefore, the correct answer is wavelength.",
      ],
    },
  },

  {
    id: "physics-sound-waves-004",

    question:
      "The pitch of a musical sound depends mainly on its",

    options: [
      {
        id: "A",
        text: "amplitude",
      },
      {
        id: "B",
        text: "frequency",
      },
      {
        id: "C",
        text: "speed",
      },
      {
        id: "D",
        text: "wavelength only",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The pitch of a sound is determined by its frequency.",

      steps: [
        "Frequency is the number of complete vibrations made per second.",
        "A sound with a higher frequency has a higher pitch.",
        "A sound with a lower frequency has a lower pitch.",
        "Therefore, pitch depends mainly on frequency.",
      ],
    },
  },

  {
    id: "physics-sound-waves-005",

    question:
      "The loudness of a sound is primarily related to its",

    options: [
      {
        id: "A",
        text: "frequency",
      },
      {
        id: "B",
        text: "amplitude",
      },
      {
        id: "C",
        text: "wavelength",
      },
      {
        id: "D",
        text: "period",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The loudness of a sound is related to the amplitude of the vibration producing the sound.",

      steps: [
        "Amplitude measures the maximum displacement of vibrating particles from their equilibrium position.",
        "A larger amplitude generally produces a louder sound.",
        "A smaller amplitude produces a softer sound.",
        "Therefore, loudness is primarily related to amplitude.",
      ],
    },
  },

  {
    id: "physics-sound-waves-006",

    question:
      "A sound wave has a frequency of 500 Hz. How many vibrations does its source make in 2 seconds?",

    options: [
      {
        id: "A",
        text: "250",
      },
      {
        id: "B",
        text: "500",
      },
      {
        id: "C",
        text: "1,000",
      },
      {
        id: "D",
        text: "2,500",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Frequency is the number of vibrations made per second.",

      steps: [
        "Frequency = 500 Hz.",
        "This means the source makes 500 vibrations every second.",
        "Time = 2 seconds.",
        "Number of vibrations = frequency × time.",
        "Number of vibrations = 500 × 2 = 1,000.",
        "Therefore, the correct answer is 1,000 vibrations.",
      ],
    },
  },

  {
    id: "physics-sound-waves-007",

    question:
      "A sound wave has a frequency of 200 Hz and a wavelength of 1.5 m. What is its speed?",

    options: [
      {
        id: "A",
        text: "100 m/s",
      },
      {
        id: "B",
        text: "200 m/s",
      },
      {
        id: "C",
        text: "300 m/s",
      },
      {
        id: "D",
        text: "400 m/s",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The speed of a wave is given by v = fλ.",

      steps: [
        "Frequency, f = 200 Hz.",
        "Wavelength, λ = 1.5 m.",
        "Use the formula v = fλ.",
        "Substitute the values: v = 200 × 1.5.",
        "Therefore, v = 300 m/s.",
      ],
    },
  },

  {
    id: "physics-sound-waves-008",

    question:
      "Which of the following is an example of an ultrasonic sound?",

    options: [
      {
        id: "A",
        text: "10 Hz",
      },
      {
        id: "B",
        text: "500 Hz",
      },
      {
        id: "C",
        text: "10,000 Hz",
      },
      {
        id: "D",
        text: "30,000 Hz",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Ultrasonic sounds have frequencies above the upper limit of normal human hearing.",

      steps: [
        "The normal human hearing range is approximately 20 Hz to 20,000 Hz.",
        "Sounds above 20,000 Hz are called ultrasonic.",
        "30,000 Hz is greater than 20,000 Hz.",
        "Therefore, 30,000 Hz is an ultrasonic sound.",
      ],
    },
  },

  {
    id: "physics-sound-waves-009",

    question:
      "Which of the following frequencies is within the approximate range of normal human hearing?",

    options: [
      {
        id: "A",
        text: "10 Hz",
      },
      {
        id: "B",
        text: "500 Hz",
      },
      {
        id: "C",
        text: "25,000 Hz",
      },
      {
        id: "D",
        text: "40,000 Hz",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Humans can normally hear frequencies approximately between 20 Hz and 20,000 Hz.",

      steps: [
        "The lower limit of normal human hearing is approximately 20 Hz.",
        "The upper limit is approximately 20,000 Hz.",
        "500 Hz lies within this range.",
        "10 Hz is infrasonic, while 25,000 Hz and 40,000 Hz are ultrasonic.",
        "Therefore, 500 Hz is within the normal hearing range.",
      ],
    },
  },

  {
    id: "physics-sound-waves-010",

    question:
      "An echo is produced mainly as a result of the",

    options: [
      {
        id: "A",
        text: "refraction of sound",
      },
      {
        id: "B",
        text: "reflection of sound",
      },
      {
        id: "C",
        text: "absorption of sound",
      },
      {
        id: "D",
        text: "diffraction of light",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An echo occurs when a sound wave is reflected from a distant surface and reaches the listener again.",

      steps: [
        "Sound waves can be reflected by hard surfaces.",
        "If the reflected sound reaches the listener after a sufficient time interval, it is heard as a separate sound.",
        "This repeated sound is called an echo.",
        "Therefore, an echo is caused by reflection of sound.",
      ],
    },
  },

  {
    id: "physics-sound-waves-011",

    question:
      "Which of the following surfaces is most suitable for producing a clear echo?",

    options: [
      {
        id: "A",
        text: "A thick curtain",
      },
      {
        id: "B",
        text: "A soft carpet",
      },
      {
        id: "C",
        text: "A large concrete wall",
      },
      {
        id: "D",
        text: "A pile of cotton",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Hard, smooth surfaces are good reflectors of sound.",

      steps: [
        "Concrete surfaces are hard and relatively smooth.",
        "They reflect a significant amount of sound.",
        "Soft materials such as carpets and curtains absorb much of the sound.",
        "Therefore, a large concrete wall is most suitable for producing a clear echo.",
      ],
    },
  },

  {
    id: "physics-sound-waves-012",

    question:
      "Which phenomenon explains why sound can bend around an obstacle?",

    options: [
      {
        id: "A",
        text: "Reflection",
      },
      {
        id: "B",
        text: "Diffraction",
      },
      {
        id: "C",
        text: "Polarization",
      },
      {
        id: "D",
        text: "Dispersion",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Diffraction is the bending or spreading of waves around obstacles and through openings.",

      steps: [
        "Sound is a wave and can undergo diffraction.",
        "When sound encounters an obstacle or opening of suitable size, it can spread around it.",
        "This allows sound to be heard even when the source is not directly visible.",
        "Therefore, the phenomenon is diffraction.",
      ],
    },
  },

  {
    id: "physics-sound-waves-013",

    question:
      "The quality or timbre of a musical sound enables us to distinguish between sounds having the same",

    options: [
      {
        id: "A",
        text: "pitch and loudness",
      },
      {
        id: "B",
        text: "frequency only",
      },
      {
        id: "C",
        text: "amplitude only",
      },
      {
        id: "D",
        text: "speed only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Timbre allows different sound sources to be distinguished even when they produce sounds with the same pitch and loudness.",

      steps: [
        "Pitch depends mainly on frequency.",
        "Loudness is related mainly to amplitude.",
        "Different instruments can produce sounds with the same pitch and loudness.",
        "Their waveforms and harmonic content may still differ.",
        "This difference gives each sound its characteristic quality or timbre.",
      ],
    },
  },

  {
    id: "physics-sound-waves-014",

    question:
      "Which instrument produces sound mainly by vibrating a stretched string?",

    options: [
      {
        id: "A",
        text: "Guitar",
      },
      {
        id: "B",
        text: "Flute",
      },
      {
        id: "C",
        text: "Drum",
      },
      {
        id: "D",
        text: "Trumpet",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A guitar produces sound mainly through the vibration of its stretched strings.",

      steps: [
        "A guitar has strings stretched under tension.",
        "When a string is plucked, it vibrates.",
        "The vibration is transferred to the guitar body and surrounding air.",
        "This produces the sound heard.",
        "Therefore, the guitar is the correct answer.",
      ],
    },
  },

  {
    id: "physics-sound-waves-015",

    question:
      "If the frequency of a sound wave is increased while its speed remains constant, its wavelength will",

    options: [
      {
        id: "A",
        text: "increase",
      },
      {
        id: "B",
        text: "decrease",
      },
      {
        id: "C",
        text: "remain unchanged",
      },
      {
        id: "D",
        text: "become zero",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The wave equation shows that wavelength is inversely proportional to frequency when wave speed is constant.",

      steps: [
        "The wave equation is v = fλ.",
        "If v remains constant, then λ = v/f.",
        "Therefore, increasing the frequency causes the wavelength to decrease.",
        "Hence, the correct answer is decrease.",
      ],
    },
  },

  {
    id: "physics-sound-waves-016",

    question:
      "A sound wave has a wavelength of 0.5 m and travels at 340 m/s. What is its frequency?",

    options: [
      {
        id: "A",
        text: "170 Hz",
      },
      {
        id: "B",
        text: "340 Hz",
      },
      {
        id: "C",
        text: "680 Hz",
      },
      {
        id: "D",
        text: "850 Hz",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The frequency of a wave can be calculated using v = fλ.",

      steps: [
        "Wave speed, v = 340 m/s.",
        "Wavelength, λ = 0.5 m.",
        "Rearrange the formula: f = v/λ.",
        "Substitute the values: f = 340/0.5.",
        "Therefore, f = 680 Hz.",
      ],
    },
  },

  {
    id: "physics-sound-waves-017",

    question:
      "Which part of the human ear vibrates first when sound waves enter the ear?",

    options: [
      {
        id: "A",
        text: "Eardrum",
      },
      {
        id: "B",
        text: "Cochlea",
      },
      {
        id: "C",
        text: "Auditory nerve",
      },
      {
        id: "D",
        text: "Semicircular canals",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The eardrum is the first major structure that vibrates in response to incoming sound waves.",

      steps: [
        "Sound waves enter the external auditory canal.",
        "They reach the eardrum.",
        "The eardrum vibrates in response to the sound waves.",
        "These vibrations are transferred through the small bones of the middle ear.",
        "The vibrations eventually reach the cochlea.",
        "Therefore, the eardrum is the correct answer.",
      ],
    },
  },

  {
    id: "physics-sound-waves-018",

    question:
      "The loudness of a sound can be measured in",

    options: [
      {
        id: "A",
        text: "metres",
      },
      {
        id: "B",
        text: "hertz",
      },
      {
        id: "C",
        text: "decibels",
      },
      {
        id: "D",
        text: "newtons",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Sound level is commonly expressed in decibels (dB).",

      steps: [
        "Hertz is the unit used for frequency.",
        "Metres measure distance.",
        "Newtons measure force.",
        "Decibels are used to express sound level.",
        "Therefore, the correct answer is decibels.",
      ],
    },
  },

  {
    id: "physics-sound-waves-019",

    question:
      "Which of the following can be used to reduce unwanted sound in a building?",

    options: [
      {
        id: "A",
        text: "Sound-absorbing materials",
      },
      {
        id: "B",
        text: "Bare concrete surfaces only",
      },
      {
        id: "C",
        text: "Metal sheets without insulation",
      },
      {
        id: "D",
        text: "Hard reflective surfaces",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Sound-absorbing materials reduce unwanted sound by absorbing part of the sound energy.",

      steps: [
        "Unwanted sound is called noise.",
        "Materials such as acoustic foam, carpets and thick curtains can absorb sound.",
        "Absorption reduces the amount of sound reflected around a room.",
        "Therefore, sound-absorbing materials can help reduce unwanted sound.",
      ],
    },
  },

  {
    id: "physics-sound-waves-020",

    question:
      "Which statement about sound is correct?",

    options: [
      {
        id: "A",
        text: "Sound can travel through a vacuum.",
      },
      {
        id: "B",
        text: "Sound is an electromagnetic wave.",
      },
      {
        id: "C",
        text: "Sound requires a medium for propagation.",
      },
      {
        id: "D",
        text: "Sound always travels at the same speed in all media.",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Sound is a mechanical wave and requires a material medium to travel.",

      steps: [
        "Sound is produced by mechanical vibrations.",
        "These vibrations are transmitted through particles of a medium.",
        "Therefore, sound cannot travel through a vacuum.",
        "The speed of sound also depends on the medium and its properties.",
        "Therefore, the correct statement is that sound requires a medium for propagation.",
      ],
    },
  },
];

export default soundWavesQuestions;
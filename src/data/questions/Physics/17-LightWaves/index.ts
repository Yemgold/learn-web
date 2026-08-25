



// C:\Users\Lara Spellman\Jamb\jamb-league\src\data\questions\Physics\17-LightWaves\index.ts

import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — LIGHT WAVES                                                     */
/* -------------------------------------------------------------------------- */

export const lightWavesQuestions: ArenaQuestion[] = [
  {
    id: "physics-light-waves-001",

    question:
      "Which of the following is a property of light waves?",

    options: [
      {
        id: "A",
        text: "They require a material medium for propagation",
      },
      {
        id: "B",
        text: "They are mechanical waves",
      },
      {
        id: "C",
        text: "They can travel through a vacuum",
      },
      {
        id: "D",
        text: "They cannot be reflected",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Light is an electromagnetic wave and can travel through empty space without a material medium.",

      steps: [
        "Light is an electromagnetic wave.",
        "Electromagnetic waves do not require a material medium for propagation.",
        "Light from the Sun travels through the vacuum of space before reaching Earth.",
        "Therefore, light can travel through a vacuum.",
      ],
    },
  },

  {
    id: "physics-light-waves-002",

    question:
      "The bouncing back of light when it strikes a surface is known as",

    options: [
      {
        id: "A",
        text: "Refraction",
      },
      {
        id: "B",
        text: "Reflection",
      },
      {
        id: "C",
        text: "Diffraction",
      },
      {
        id: "D",
        text: "Dispersion",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Reflection occurs when light strikes a surface and is returned into the original medium.",

      steps: [
        "Light travels in straight lines in a uniform medium.",
        "When light strikes a reflecting surface, its direction changes.",
        "The light is returned into the medium from which it came.",
        "This phenomenon is called reflection.",
      ],
    },
  },

  {
    id: "physics-light-waves-003",

    question:
      "According to the law of reflection, the angle of incidence is",

    options: [
      {
        id: "A",
        text: "Greater than the angle of reflection",
      },
      {
        id: "B",
        text: "Less than the angle of reflection",
      },
      {
        id: "C",
        text: "Equal to the angle of reflection",
      },
      {
        id: "D",
        text: "Always 90°",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The law of reflection states that the angle of incidence is equal to the angle of reflection.",

      steps: [
        "The angle of incidence is measured between the incident ray and the normal.",
        "The angle of reflection is measured between the reflected ray and the normal.",
        "For a plane reflecting surface, these two angles are equal.",
        "Therefore, the angle of incidence equals the angle of reflection.",
      ],
    },
  },

  {
    id: "physics-light-waves-004",

    question:
      "A ray of light travels from air into glass. What happens to its speed?",

    options: [
      {
        id: "A",
        text: "It increases",
      },
      {
        id: "B",
        text: "It decreases",
      },
      {
        id: "C",
        text: "It remains unchanged",
      },
      {
        id: "D",
        text: "It becomes zero",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Light travels more slowly in glass than it does in air.",

      steps: [
        "Air is optically less dense than glass.",
        "The speed of light depends on the medium through which it travels.",
        "Light travels more slowly in glass than in air.",
        "Therefore, its speed decreases when it enters glass.",
      ],
    },
  },

  {
    id: "physics-light-waves-005",

    question:
      "The bending of light as it passes obliquely from one medium into another is called",

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
        text: "Interference",
      },
      {
        id: "D",
        text: "Polarization",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Refraction is the change in direction of light when it passes from one medium into another because its speed changes.",

      steps: [
        "Light travels at different speeds in different transparent media.",
        "When light enters another medium obliquely, its speed changes.",
        "The change in speed causes the direction of the light ray to change.",
        "This phenomenon is called refraction.",
      ],
    },
  },

  {
    id: "physics-light-waves-006",

    question:
      "Which optical device uses a converging lens to produce an enlarged image of a small object?",

    options: [
      {
        id: "A",
        text: "Periscope",
      },
      {
        id: "B",
        text: "Magnifying glass",
      },
      {
        id: "C",
        text: "Plane mirror",
      },
      {
        id: "D",
        text: "Pinhole camera",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A magnifying glass uses a convex lens to produce a magnified virtual image when the object is placed within the focal length.",

      steps: [
        "A magnifying glass contains a convex or converging lens.",
        "The object is placed between the lens and its principal focus.",
        "The lens forms an upright and enlarged virtual image.",
        "Therefore, the correct answer is magnifying glass.",
      ],
    },
  },

  {
    id: "physics-light-waves-007",

    question:
      "Which of the following lenses is thicker at the centre than at the edges?",

    options: [
      {
        id: "A",
        text: "Concave lens",
      },
      {
        id: "B",
        text: "Convex lens",
      },
      {
        id: "C",
        text: "Cylindrical lens",
      },
      {
        id: "D",
        text: "Plane glass plate",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A convex lens is thicker at its centre and thinner at its edges.",

      steps: [
        "A convex lens curves outward on both sides.",
        "Its central region is thicker than its edges.",
        "It converges parallel rays of light toward a focus.",
        "Therefore, the correct answer is convex lens.",
      ],
    },
  },

  {
    id: "physics-light-waves-008",

    question:
      "An object is placed beyond 2F of a convex lens. Where is the image formed?",

    options: [
      {
        id: "A",
        text: "Between F and 2F",
      },
      {
        id: "B",
        text: "At F",
      },
      {
        id: "C",
        text: "Beyond 2F",
      },
      {
        id: "D",
        text: "At the optical centre",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "For a convex lens, an object placed beyond 2F produces a real, inverted and diminished image between F and 2F.",

      steps: [
        "Consider a convex lens with principal focus F.",
        "The object is placed beyond twice the focal length, 2F.",
        "A ray parallel to the principal axis passes through the focus after refraction.",
        "A ray through the optical centre continues approximately undeviated.",
        "The rays meet between F and 2F.",
        "Therefore, the image is formed between F and 2F.",
      ],
    },
  },

  {
    id: "physics-light-waves-009",

    question:
      "Which of the following phenomena is responsible for the formation of a rainbow?",

    options: [
      {
        id: "A",
        text: "Reflection only",
      },
      {
        id: "B",
        text: "Refraction, dispersion and internal reflection",
      },
      {
        id: "C",
        text: "Diffraction only",
      },
      {
        id: "D",
        text: "Polarization only",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A rainbow forms when sunlight undergoes refraction, dispersion and internal reflection inside water droplets.",

      steps: [
        "Sunlight enters a water droplet and is refracted.",
        "The white light is dispersed into its component colours.",
        "The light undergoes internal reflection inside the droplet.",
        "The light is refracted again as it leaves the droplet.",
        "The combination of these effects produces the visible rainbow.",
      ],
    },
  },

  {
    id: "physics-light-waves-010",

    question:
      "Which colour of visible light has the longest wavelength?",

    options: [
      {
        id: "A",
        text: "Violet",
      },
      {
        id: "B",
        text: "Blue",
      },
      {
        id: "C",
        text: "Green",
      },
      {
        id: "D",
        text: "Red",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Red light has the longest wavelength among the colours in the visible spectrum.",

      steps: [
        "Visible light consists of a range of wavelengths.",
        "Red has the longest wavelength in the visible spectrum.",
        "Violet has the shortest wavelength.",
        "Therefore, the correct answer is red.",
      ],
    },
  },
];

export default lightWavesQuestions;
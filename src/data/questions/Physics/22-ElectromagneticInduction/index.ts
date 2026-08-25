


import type { ArenaQuestion } from "@/components/arena/Arena";

// --------------------------------------------------------------------------
// PHYSICS — ELECTROMAGNETIC INDUCTION
// --------------------------------------------------------------------------

export const electromagneticInductionQuestions: ArenaQuestion[] = [
  {
    id: "physics-electromagnetic-induction-001",

    question:
      "Which of the following is the basic principle involved in electromagnetic induction?",

    options: [
      {
        id: "A",
        text: "Production of electric current by a changing magnetic field",
      },
      {
        id: "B",
        text: "Production of heat by a stationary magnet",
      },
      {
        id: "C",
        text: "Production of light by an electric field",
      },
      {
        id: "D",
        text: "Production of sound by an electric current",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Electromagnetic induction is the production of an electromotive force when the magnetic flux linking a conductor changes.",

      steps: [
        "A changing magnetic field can induce an electromotive force in a conductor.",
        "If the conductor forms part of a closed circuit, an induced current flows.",
        "The magnetic field must change relative to the conductor.",
        "Therefore, the correct answer is production of electric current by a changing magnetic field.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-002",

    question:
      "Who is credited with the discovery of electromagnetic induction?",

    options: [
      {
        id: "A",
        text: "Isaac Newton",
      },
      {
        id: "B",
        text: "Michael Faraday",
      },
      {
        id: "C",
        text: "James Watt",
      },
      {
        id: "D",
        text: "Albert Einstein",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Michael Faraday discovered electromagnetic induction in the nineteenth century.",

      steps: [
        "Michael Faraday investigated the relationship between electricity and magnetism.",
        "He discovered that changing magnetic flux through a circuit produces an induced electromotive force.",
        "This phenomenon is known as electromagnetic induction.",
        "Therefore, the correct answer is Michael Faraday.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-003",

    question:
      "Which of the following devices operates mainly on the principle of electromagnetic induction?",

    options: [
      {
        id: "A",
        text: "Transformer",
      },
      {
        id: "B",
        text: "Electric heater",
      },
      {
        id: "C",
        text: "Electric bulb",
      },
      {
        id: "D",
        text: "Fuse",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A transformer works through electromagnetic induction between its primary and secondary coils.",

      steps: [
        "An alternating current in the primary coil produces a changing magnetic field.",
        "The changing magnetic field passes through the transformer core.",
        "This changing magnetic flux induces an electromotive force in the secondary coil.",
        "Therefore, the transformer operates on electromagnetic induction.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-004",

    question:
      "According to Faraday's law, the magnitude of the induced electromotive force depends on the",

    options: [
      {
        id: "A",
        text: "rate of change of magnetic flux",
      },
      {
        id: "B",
        text: "mass of the conductor",
      },
      {
        id: "C",
        text: "length of the battery",
      },
      {
        id: "D",
        text: "temperature of the surroundings only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Faraday's law states that the magnitude of the induced electromotive force is proportional to the rate of change of magnetic flux.",

      steps: [
        "Magnetic flux measures the magnetic field passing through a given area.",
        "When the magnetic flux changes, an electromotive force is induced.",
        "A faster change in magnetic flux produces a larger induced electromotive force.",
        "Therefore, the correct answer is the rate of change of magnetic flux.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-005",

    question:
      "A coil is moved rapidly into a magnetic field. What happens to the induced electromotive force compared with moving the coil slowly?",

    options: [
      {
        id: "A",
        text: "It becomes smaller",
      },
      {
        id: "B",
        text: "It becomes larger",
      },
      {
        id: "C",
        text: "It becomes zero",
      },
      {
        id: "D",
        text: "It remains unchanged",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The induced electromotive force increases when the rate of change of magnetic flux increases.",

      steps: [
        "Moving the coil changes the magnetic flux linking the coil.",
        "Moving the coil more rapidly produces a faster change in magnetic flux.",
        "According to Faraday's law, a faster change produces a greater induced electromotive force.",
        "Therefore, the induced electromotive force becomes larger.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-006",

    question:
      "Lenz's law states that the direction of an induced current is such that it",

    options: [
      {
        id: "A",
        text: "always flows clockwise",
      },
      {
        id: "B",
        text: "always flows anticlockwise",
      },
      {
        id: "C",
        text: "opposes the change producing it",
      },
      {
        id: "D",
        text: "increases the magnetic flux producing it",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Lenz's law gives the direction of the induced current in an electromagnetic induction process.",

      steps: [
        "A changing magnetic flux produces an induced current.",
        "The magnetic field produced by the induced current opposes the change in magnetic flux.",
        "This opposition is consistent with the conservation of energy.",
        "Therefore, the correct answer is that the induced current opposes the change producing it.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-007",

    question:
      "Which of the following methods can produce an induced current in a coil?",

    options: [
      {
        id: "A",
        text: "Moving a magnet into or out of the coil",
      },
      {
        id: "B",
        text: "Keeping the magnet stationary far from the coil",
      },
      {
        id: "C",
        text: "Removing all magnetic material from the coil",
      },
      {
        id: "D",
        text: "Disconnecting the coil from all conductors",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "An induced current is produced when the magnetic flux linking a conducting coil changes.",

      steps: [
        "Moving a magnet relative to a coil changes the magnetic flux through the coil.",
        "The changing flux induces an electromotive force.",
        "If the coil forms a closed circuit, an induced current flows.",
        "Therefore, moving a magnet into or out of the coil can produce an induced current.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-008",

    question:
      "A generator converts",

    options: [
      {
        id: "A",
        text: "electrical energy into chemical energy",
      },
      {
        id: "B",
        text: "mechanical energy into electrical energy",
      },
      {
        id: "C",
        text: "chemical energy into mechanical energy",
      },
      {
        id: "D",
        text: "heat energy into chemical energy",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An electric generator uses electromagnetic induction to convert mechanical energy into electrical energy.",

      steps: [
        "Mechanical energy is supplied to rotate the generator.",
        "The rotation causes a changing magnetic flux through the conductors.",
        "Electromagnetic induction produces an induced electromotive force.",
        "The resulting electrical energy can be supplied to an external circuit.",
        "Therefore, a generator converts mechanical energy into electrical energy.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-009",

    question:
      "In an AC generator, the function of the slip rings is to",

    options: [
      {
        id: "A",
        text: "produce the magnetic field",
      },
      {
        id: "B",
        text: "provide continuous electrical contact with the rotating coil",
      },
      {
        id: "C",
        text: "increase the mass of the coil",
      },
      {
        id: "D",
        text: "prevent the coil from rotating",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Slip rings maintain electrical contact between the rotating coil and the external circuit.",

      steps: [
        "The coil of an AC generator rotates inside a magnetic field.",
        "The rotating coil produces an alternating induced electromotive force.",
        "Slip rings rotate with the coil while maintaining contact with stationary brushes.",
        "This allows the generated electrical energy to reach the external circuit.",
        "Therefore, the correct answer is to provide continuous electrical contact with the rotating coil.",
      ],
    },
  },

  {
    id: "physics-electromagnetic-induction-010",

    question:
      "The output voltage of an ideal transformer is increased when",

    options: [
      {
        id: "A",
        text: "the secondary coil has fewer turns than the primary coil",
      },
      {
        id: "B",
        text: "the secondary coil has more turns than the primary coil",
      },
      {
        id: "C",
        text: "the primary coil is removed",
      },
      {
        id: "D",
        text: "the transformer is disconnected from the source",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A step-up transformer has more turns on its secondary coil than on its primary coil.",

      steps: [
        "For an ideal transformer, the voltage ratio is related to the turns ratio.",
        "The relationship is Vs/Vp = Ns/Np.",
        "If the secondary coil has more turns than the primary coil, Ns is greater than Np.",
        "Therefore, the secondary voltage is greater than the primary voltage.",
        "This type of transformer is called a step-up transformer.",
      ],
    },
  },
];

export default electromagneticInductionQuestions;
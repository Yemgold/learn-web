


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — MAGNETS AND MAGNETIC FIELDS                                     */
/* -------------------------------------------------------------------------- */

export const magnetsAndMagneticFieldsQuestions: ArenaQuestion[] = [
  {
    id: "physics-magnets-001",

    question:
      "Which of the following materials is strongly attracted to a magnet?",

    options: [
      {
        id: "A",
        text: "Copper",
      },
      {
        id: "B",
        text: "Aluminium",
      },
      {
        id: "C",
        text: "Iron",
      },
      {
        id: "D",
        text: "Glass",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Iron is a ferromagnetic material and is strongly attracted to magnets.",

      steps: [
        "Magnetic materials are materials that can be attracted by a magnet.",
        "Iron is strongly attracted to magnets.",
        "Copper, aluminium and glass are not strongly attracted to ordinary magnets.",
        "Therefore, the correct answer is Iron.",
      ],
    },
  },

  {
    id: "physics-magnets-002",

    question:
      "Which part of a bar magnet has the strongest magnetic force?",

    options: [
      {
        id: "A",
        text: "Centre",
      },
      {
        id: "B",
        text: "North pole",
      },
      {
        id: "C",
        text: "South pole",
      },
      {
        id: "D",
        text: "Both poles",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "The magnetic force of a bar magnet is strongest at its two poles.",

      steps: [
        "A bar magnet has two poles: north and south.",
        "The magnetic field is strongest near the poles.",
        "Both the north and south poles exert strong magnetic forces.",
        "Therefore, the correct answer is Both poles.",
      ],
    },
  },

  {
    id: "physics-magnets-003",

    question:
      "What happens when the north pole of a magnet is brought close to the north pole of another magnet?",

    options: [
      {
        id: "A",
        text: "They attract each other",
      },
      {
        id: "B",
        text: "They repel each other",
      },
      {
        id: "C",
        text: "They lose their magnetism",
      },
      {
        id: "D",
        text: "Nothing happens",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Like magnetic poles repel each other, while unlike poles attract.",

      steps: [
        "The two magnets have north poles facing each other.",
        "North and north are like magnetic poles.",
        "Like poles repel each other.",
        "Therefore, the magnets will repel each other.",
      ],
    },
  },

  {
    id: "physics-magnets-004",

    question:
      "Which of the following statements about magnetic field lines is correct?",

    options: [
      {
        id: "A",
        text: "They cross one another",
      },
      {
        id: "B",
        text: "They are closer together where the field is weaker",
      },
      {
        id: "C",
        text: "They indicate the direction of the magnetic field",
      },
      {
        id: "D",
        text: "They exist only inside a magnet",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Magnetic field lines are used to represent the direction and strength of a magnetic field.",

      steps: [
        "Magnetic field lines show the direction of a magnetic field.",
        "The direction at any point is given by the tangent to the field line.",
        "Field lines do not cross one another.",
        "Closely spaced field lines indicate a stronger field.",
        "Therefore, the correct answer is that they indicate the direction of the magnetic field.",
      ],
    },
  },

  {
    id: "physics-magnets-005",

    question:
      "Outside a bar magnet, magnetic field lines are conventionally directed from",

    options: [
      {
        id: "A",
        text: "South pole to north pole",
      },
      {
        id: "B",
        text: "North pole to south pole",
      },
      {
        id: "C",
        text: "Centre to north pole",
      },
      {
        id: "D",
        text: "Centre to south pole",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "By convention, magnetic field lines outside a bar magnet run from the north pole to the south pole.",

      steps: [
        "A bar magnet has north and south poles.",
        "Magnetic field lines form closed loops.",
        "Outside the magnet, they run from north to south.",
        "Inside the magnet, they return from south to north.",
        "Therefore, the correct answer is North pole to south pole.",
      ],
    },
  },

  {
    id: "physics-magnets-006",

    question:
      "Which instrument is commonly used to detect the presence and direction of a magnetic field?",

    options: [
      {
        id: "A",
        text: "Thermometer",
      },
      {
        id: "B",
        text: "Compass",
      },
      {
        id: "C",
        text: "Barometer",
      },
      {
        id: "D",
        text: "Ammeter",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A compass contains a small magnetized needle that aligns with a magnetic field.",

      steps: [
        "A compass contains a freely rotating magnetic needle.",
        "The needle aligns itself with the surrounding magnetic field.",
        "This allows the direction of the magnetic field to be determined.",
        "Therefore, the correct answer is Compass.",
      ],
    },
  },

  {
    id: "physics-magnets-007",

    question:
      "Which of the following methods can be used to magnetize a piece of iron?",

    options: [
      {
        id: "A",
        text: "Heating it strongly and cooling it immediately",
      },
      {
        id: "B",
        text: "Stroking it repeatedly with a magnet in one direction",
      },
      {
        id: "C",
        text: "Placing it in water",
      },
      {
        id: "D",
        text: "Covering it with plastic",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Repeated stroking of a suitable iron or steel object with a magnet in one direction can align its magnetic domains.",

      steps: [
        "Magnetization involves producing an ordered alignment of magnetic domains.",
        "A piece of iron or steel can be stroked repeatedly with a magnet.",
        "The strokes should be made in the same direction.",
        "This can produce magnetism in the material.",
        "Therefore, the correct answer is stroking it repeatedly with a magnet in one direction.",
      ],
    },
  },

  {
    id: "physics-magnets-008",

    question:
      "An electromagnet is produced by passing electric current through a coil wound around",

    options: [
      {
        id: "A",
        text: "A wooden rod",
      },
      {
        id: "B",
        text: "A soft iron core",
      },
      {
        id: "C",
        text: "A glass tube",
      },
      {
        id: "D",
        text: "A plastic rod",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A soft iron core greatly strengthens the magnetic field produced by a current-carrying coil.",

      steps: [
        "Electric current through a coil produces a magnetic field.",
        "Placing a soft iron core inside the coil increases the strength of the field.",
        "Soft iron is suitable because it is easily magnetized and demagnetized.",
        "Therefore, the correct answer is a soft iron core.",
      ],
    },
  },

  {
    id: "physics-magnets-009",

    question:
      "Which of the following is an advantage of an electromagnet over a permanent magnet?",

    options: [
      {
        id: "A",
        text: "It cannot be switched off",
      },
      {
        id: "B",
        text: "Its magnetic strength cannot be changed",
      },
      {
        id: "C",
        text: "It can be switched on and off",
      },
      {
        id: "D",
        text: "It does not require electric current",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "An electromagnet produces magnetism when electric current flows through its coil.",

      steps: [
        "An electromagnet depends on electric current.",
        "When the current is switched off, its magnetic effect is greatly reduced.",
        "Therefore, an electromagnet can be switched on and off.",
        "This makes electromagnets useful in devices such as electric bells and lifting machines.",
      ],
    },
  },

  {
    id: "physics-magnets-010",

    question:
      "Which of the following factors can increase the strength of an electromagnet?",

    options: [
      {
        id: "A",
        text: "Reducing the number of turns of the coil",
      },
      {
        id: "B",
        text: "Reducing the current in the coil",
      },
      {
        id: "C",
        text: "Increasing the number of turns of the coil",
      },
      {
        id: "D",
        text: "Removing the iron core",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Increasing the number of turns of a current-carrying coil generally increases the strength of its magnetic field.",

      steps: [
        "A current-carrying coil produces a magnetic field.",
        "The magnetic field becomes stronger as the number of turns of the coil increases.",
        "Increasing the current can also strengthen the field.",
        "A suitable soft iron core further increases the field strength.",
        "Therefore, the correct answer is increasing the number of turns of the coil.",
      ],
    },
  },

  {
    id: "physics-magnets-011",

    question:
      "The region around a magnet in which magnetic force can be detected is called the",

    options: [
      {
        id: "A",
        text: "Electric field",
      },
      {
        id: "B",
        text: "Magnetic field",
      },
      {
        id: "C",
        text: "Gravitational field",
      },
      {
        id: "D",
        text: "Pressure field",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A magnetic field is the region around a magnet where magnetic forces can be experienced.",

      steps: [
        "A magnet produces a force around itself.",
        "The region where this magnetic force can act is called the magnetic field.",
        "Magnetic field lines are used to represent this field.",
        "Therefore, the correct answer is Magnetic field.",
      ],
    },
  },

  {
    id: "physics-magnets-012",

    question:
      "Which of the following materials is most suitable for making a permanent magnet?",

    options: [
      {
        id: "A",
        text: "Soft iron",
      },
      {
        id: "B",
        text: "Steel",
      },
      {
        id: "C",
        text: "Copper",
      },
      {
        id: "D",
        text: "Aluminium",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Steel is suitable for permanent magnets because it retains magnetism for a long time.",

      steps: [
        "A permanent magnet should retain its magnetism.",
        "Steel has a high retentivity compared with soft iron.",
        "Soft iron is more suitable for temporary magnets and electromagnets.",
        "Therefore, steel is commonly used for permanent magnets.",
      ],
    },
  },

  {
    id: "physics-magnets-013",

    question:
      "The magnetic effect of an electric current was demonstrated by the deflection of a compass needle near a",

    options: [
      {
        id: "A",
        text: "Current-carrying conductor",
      },
      {
        id: "B",
        text: "Glass rod",
      },
      {
        id: "C",
        text: "Thermometer",
      },
      {
        id: "D",
        text: "Non-magnetic plastic rod",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A current-carrying conductor produces a magnetic field around it.",

      steps: [
        "Electric current produces a magnetic field around a conductor.",
        "A compass needle is a small magnet.",
        "When placed near the current-carrying conductor, the magnetic field acts on the needle.",
        "The needle therefore deflects.",
        "This demonstrates the magnetic effect of electric current.",
      ],
    },
  },

  {
    id: "physics-magnets-014",

    question:
      "What happens to the magnetic field around a straight conductor when the current through it is increased?",

    options: [
      {
        id: "A",
        text: "The magnetic field becomes weaker",
      },
      {
        id: "B",
        text: "The magnetic field becomes stronger",
      },
      {
        id: "C",
        text: "The magnetic field disappears",
      },
      {
        id: "D",
        text: "The direction of current automatically reverses",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The strength of the magnetic field around a current-carrying conductor increases as the current increases.",

      steps: [
        "A current-carrying conductor produces a magnetic field.",
        "The magnetic field strength depends on the current flowing through the conductor.",
        "Increasing the current increases the magnetic field strength.",
        "Therefore, the magnetic field becomes stronger.",
      ],
    },
  },

  {
    id: "physics-magnets-015",

    question:
      "Which rule is commonly used to determine the direction of the magnetic field around a straight current-carrying conductor?",

    options: [
      {
        id: "A",
        text: "Right-hand grip rule",
      },
      {
        id: "B",
        text: "Law of reflection",
      },
      {
        id: "C",
        text: "Archimedes' principle",
      },
      {
        id: "D",
        text: "Hooke's law",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The right-hand grip rule relates the direction of current to the direction of the magnetic field around a straight conductor.",

      steps: [
        "Imagine gripping the conductor with the right hand.",
        "Point the thumb in the direction of conventional current.",
        "The curled fingers show the direction of the magnetic field.",
        "Therefore, the right-hand grip rule is used.",
      ],
    },
  },

  {
    id: "physics-magnets-016",

    question:
      "A magnetic compass placed near a current-carrying wire deflects because",

    options: [
      {
        id: "A",
        text: "The wire becomes permanently magnetized",
      },
      {
        id: "B",
        text: "The current produces a magnetic field",
      },
      {
        id: "C",
        text: "The wire produces heat",
      },
      {
        id: "D",
        text: "The compass produces an electric current",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Electric current produces a magnetic field, and this field interacts with the compass needle.",

      steps: [
        "The compass needle is a small magnet.",
        "Current flowing through the wire creates a magnetic field around the wire.",
        "The field exerts a magnetic effect on the compass needle.",
        "The needle therefore changes direction.",
        "Therefore, the correct answer is that the current produces a magnetic field.",
      ],
    },
  },

  {
    id: "physics-magnets-017",

    question:
      "Which device uses an electromagnet to produce mechanical movement?",

    options: [
      {
        id: "A",
        text: "Electric bell",
      },
      {
        id: "B",
        text: "Glass thermometer",
      },
      {
        id: "C",
        text: "Measuring cylinder",
      },
      {
        id: "D",
        text: "Mercury barometer",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "An electric bell uses an electromagnet to attract an armature and produce repeated mechanical movement.",

      steps: [
        "Electric current flows through the coil of the electromagnet.",
        "The electromagnet attracts the armature.",
        "This movement causes the striker to hit the bell.",
        "The electrical circuit is repeatedly made and broken.",
        "Therefore, the electric bell is an application of an electromagnet.",
      ],
    },
  },

  {
    id: "physics-magnets-018",

    question:
      "A freely suspended bar magnet comes to rest approximately along the",

    options: [
      {
        id: "A",
        text: "East-west direction",
      },
      {
        id: "B",
        text: "North-south direction",
      },
      {
        id: "C",
        text: "Vertical direction only",
      },
      {
        id: "D",
        text: "South-east direction",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A freely suspended magnet aligns approximately with the Earth's magnetic field.",

      steps: [
        "The Earth behaves approximately like a giant magnet.",
        "Its magnetic field interacts with a freely suspended magnet.",
        "The magnet aligns itself approximately along the north-south direction.",
        "Therefore, the correct answer is North-south direction.",
      ],
    },
  },

  {
    id: "physics-magnets-019",

    question:
      "Which of the following is a major use of electromagnets?",

    options: [
      {
        id: "A",
        text: "Lifting iron and steel objects",
      },
      {
        id: "B",
        text: "Measuring body temperature",
      },
      {
        id: "C",
        text: "Measuring atmospheric pressure",
      },
      {
        id: "D",
        text: "Measuring liquid volume",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Electromagnets can be switched on and off, making them useful for lifting ferromagnetic materials.",

      steps: [
        "An electromagnet produces a magnetic field when current flows.",
        "The magnetic field can attract iron and steel objects.",
        "The current can be switched off to release the objects.",
        "This makes electromagnets useful in scrapyard lifting machines.",
        "Therefore, the correct answer is lifting iron and steel objects.",
      ],
    },
  },

  {
    id: "physics-magnets-020",

    question:
      "Which statement correctly describes the magnetic field at a point?",

    options: [
      {
        id: "A",
        text: "It has no direction",
      },
      {
        id: "B",
        text: "It has both magnitude and direction",
      },
      {
        id: "C",
        text: "It exists only inside magnetic materials",
      },
      {
        id: "D",
        text: "It is always zero between two magnets",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A magnetic field is a vector field, meaning that it has both magnitude and direction at a point.",

      steps: [
        "The magnetic field describes the magnetic influence at a point.",
        "Its direction can be represented using magnetic field lines.",
        "Its strength describes the magnitude of the field.",
        "Therefore, a magnetic field has both magnitude and direction.",
      ],
    },
  },
];

export default magnetsAndMagneticFieldsQuestions;
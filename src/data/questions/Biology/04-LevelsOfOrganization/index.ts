



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — LEVELS OF ORGANIZATION                                           */
/* -------------------------------------------------------------------------- */

export const levelsOfOrganizationQuestions: ArenaQuestion[] = [
  {
    id: "biology-levels-001",

    question:
      "Which of the following represents the correct order of organization in a multicellular organism, from the simplest to the most complex?",

    options: [
      {
        id: "A",
        text: "Cell → Tissue → Organ → System → Organism",
      },
      {
        id: "B",
        text: "Tissue → Cell → Organ → Organism → System",
      },
      {
        id: "C",
        text: "Cell → Organ → Tissue → System → Organism",
      },
      {
        id: "D",
        text: "Organ → Tissue → Cell → System → Organism",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Multicellular organisms are organized into progressively more complex levels of biological organization.",

      steps: [
        "The cell is the basic structural and functional unit of life.",
        "A group of similar cells performing a particular function forms a tissue.",
        "Different tissues combine to form an organ.",
        "Related organs work together as an organ system.",
        "All the organ systems together make up an organism.",
        "Therefore, the correct order is Cell → Tissue → Organ → System → Organism.",
      ],
    },
  },

  {
    id: "biology-levels-002",

    question:
      "Which of the following is the basic structural and functional unit of a living organism?",

    options: [
      {
        id: "A",
        text: "Tissue",
      },
      {
        id: "B",
        text: "Organ",
      },
      {
        id: "C",
        text: "Cell",
      },
      {
        id: "D",
        text: "Organ system",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The cell is regarded as the basic structural and functional unit of life.",

      steps: [
        "All living organisms are made up of cells.",
        "Cells carry out essential life processes.",
        "Similar cells may combine to form tissues.",
        "Tissues may combine to form organs.",
        "Therefore, the basic structural and functional unit of life is the cell.",
      ],
    },
  },

  {
    id: "biology-levels-003",

    question:
      "A group of similar cells performing the same function is known as a",

    options: [
      {
        id: "A",
        text: "Tissue",
      },
      {
        id: "B",
        text: "Organ",
      },
      {
        id: "C",
        text: "System",
      },
      {
        id: "D",
        text: "Organism",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A tissue consists of a group of similar cells that are specialized to perform a particular function.",

      steps: [
        "Cells are the basic units of organisms.",
        "Similar cells can become specialized for particular functions.",
        "A collection of similar specialized cells forms a tissue.",
        "Examples include muscle tissue and epithelial tissue.",
        "Therefore, the correct answer is Tissue.",
      ],
    },
  },

  {
    id: "biology-levels-004",

    question:
      "Which of the following is an example of an organ in a flowering plant?",

    options: [
      {
        id: "A",
        text: "Xylem",
      },
      {
        id: "B",
        text: "Root",
      },
      {
        id: "C",
        text: "Parenchyma",
      },
      {
        id: "D",
        text: "Guard cell",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An organ consists of different tissues working together to perform specific functions.",

      steps: [
        "The root is made up of different tissues.",
        "These tissues work together to absorb water and mineral salts and anchor the plant.",
        "Xylem is a vascular tissue.",
        "Parenchyma is a type of plant tissue.",
        "A guard cell is an individual specialized cell.",
        "Therefore, the correct answer is Root.",
      ],
    },
  },

  {
    id: "biology-levels-005",

    question:
      "Which of the following structures is made up of different tissues working together?",

    options: [
      {
        id: "A",
        text: "Cell",
      },
      {
        id: "B",
        text: "Tissue",
      },
      {
        id: "C",
        text: "Organ",
      },
      {
        id: "D",
        text: "Organelle",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "An organ is formed when different tissues work together to perform one or more specific functions.",

      steps: [
        "A cell is the basic unit of life.",
        "Similar cells form tissues.",
        "Different tissues combine to form organs.",
        "For example, the heart contains different tissues that work together.",
        "Therefore, the correct answer is Organ.",
      ],
    },
  },

  {
    id: "biology-levels-006",

    question:
      "The heart, blood vessels and blood are mainly associated with which organ system?",

    options: [
      {
        id: "A",
        text: "Digestive system",
      },
      {
        id: "B",
        text: "Circulatory system",
      },
      {
        id: "C",
        text: "Respiratory system",
      },
      {
        id: "D",
        text: "Excretory system",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The circulatory system is responsible for transporting substances around the body.",

      steps: [
        "The heart pumps blood throughout the body.",
        "Blood vessels transport blood to and from different parts of the body.",
        "Blood carries oxygen, nutrients, hormones and waste products.",
        "These structures work together as part of the circulatory system.",
        "Therefore, the correct answer is Circulatory system.",
      ],
    },
  },

  {
    id: "biology-levels-007",

    question:
      "Which of the following pairs consists of an organ and its corresponding organ system?",

    options: [
      {
        id: "A",
        text: "Heart and circulatory system",
      },
      {
        id: "B",
        text: "Blood and digestive system",
      },
      {
        id: "C",
        text: "Neuron and respiratory system",
      },
      {
        id: "D",
        text: "Xylem and nervous system",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Organs are specialized structures that form part of organ systems.",

      steps: [
        "The heart is an organ.",
        "The heart is an important organ of the circulatory system.",
        "The circulatory system transports substances around the body.",
        "Blood is a connective tissue rather than an organ.",
        "A neuron is a specialized cell of nervous tissue.",
        "Therefore, heart and circulatory system form the correct pair.",
      ],
    },
  },

  {
    id: "biology-levels-008",

    question:
      "Which level of organization is represented by the combination of the stomach, small intestine and large intestine?",

    options: [
      {
        id: "A",
        text: "Cell",
      },
      {
        id: "B",
        text: "Tissue",
      },
      {
        id: "C",
        text: "Organ system",
      },
      {
        id: "D",
        text: "Organism",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Several organs can work together to carry out a major body function.",

      steps: [
        "The stomach is an organ.",
        "The small intestine is an organ.",
        "The large intestine is also an organ.",
        "These organs work together in the digestion and absorption of food.",
        "Together with other organs, they form the digestive system.",
        "Therefore, the correct answer is Organ system.",
      ],
    },
  },

  {
    id: "biology-levels-009",

    question:
      "Which of the following is the highest level of organization listed?",

    options: [
      {
        id: "A",
        text: "Cell",
      },
      {
        id: "B",
        text: "Tissue",
      },
      {
        id: "C",
        text: "Organ",
      },
      {
        id: "D",
        text: "Organism",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "An organism represents the complete living individual made up of interconnected structures and systems.",

      steps: [
        "Cells form tissues.",
        "Tissues form organs.",
        "Organs work together in organ systems.",
        "Organ systems collectively make up an organism.",
        "Therefore, the organism is the highest level among the options given.",
      ],
    },
  },

  {
    id: "biology-levels-010",

    question:
      "Which of the following statements about biological organization is correct?",

    options: [
      {
        id: "A",
        text: "A tissue is made up of several unrelated organ systems",
      },
      {
        id: "B",
        text: "An organ is usually made up of different tissues",
      },
      {
        id: "C",
        text: "An organism is always made up of only one cell",
      },
      {
        id: "D",
        text: "An organelle is more complex than an organ system",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Biological structures are organized into levels of increasing complexity.",

      steps: [
        "Cells combine to form tissues.",
        "Different tissues combine and work together to form organs.",
        "Organs can work together as organ systems.",
        "Organ systems collectively make up a multicellular organism.",
        "Therefore, the statement that an organ is usually made up of different tissues is correct.",
      ],
    },
  },
];

export default levelsOfOrganizationQuestions;
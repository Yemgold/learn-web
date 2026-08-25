


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — CELL STRUCTURE AND FUNCTIONS                                     */
/* -------------------------------------------------------------------------- */

export const cellStructureAndFunctionsQuestions: ArenaQuestion[] = [
  {
    id: "biology-cell-001",

    question:
      "Which organelle is known as the control centre of a typical eukaryotic cell?",

    options: [
      {
        id: "A",
        text: "Mitochondrion",
      },
      {
        id: "B",
        text: "Nucleus",
      },
      {
        id: "C",
        text: "Ribosome",
      },
      {
        id: "D",
        text: "Vacuole",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The nucleus contains the genetic material of a eukaryotic cell and controls many of the cell's activities.",

      steps: [
        "The nucleus is surrounded by a nuclear membrane in a typical eukaryotic cell.",
        "It contains chromosomes made up of DNA and associated proteins.",
        "The genetic information in the nucleus helps regulate cellular activities.",
        "Mitochondria are mainly involved in aerobic respiration and energy release.",
        "Ribosomes are involved in protein synthesis.",
        "Therefore, the correct answer is the nucleus.",
      ],
    },
  },

  {
    id: "biology-cell-002",

    question:
      "Which organelle is primarily responsible for the release of energy during aerobic respiration?",

    options: [
      {
        id: "A",
        text: "Chloroplast",
      },
      {
        id: "B",
        text: "Mitochondrion",
      },
      {
        id: "C",
        text: "Golgi apparatus",
      },
      {
        id: "D",
        text: "Lysosome",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Mitochondria are the major sites of aerobic respiration in eukaryotic cells and are associated with ATP production.",

      steps: [
        "Cells require energy to carry out their activities.",
        "During aerobic respiration, energy is released from organic substances.",
        "Mitochondria contain structures and enzymes involved in aerobic respiration.",
        "The energy released is used to produce ATP for cellular activities.",
        "Therefore, the correct answer is the mitochondrion.",
      ],
    },
  },

  {
    id: "biology-cell-003",

    question:
      "Which structure controls the movement of substances into and out of a cell?",

    options: [
      {
        id: "A",
        text: "Cell membrane",
      },
      {
        id: "B",
        text: "Cell wall",
      },
      {
        id: "C",
        text: "Nucleus",
      },
      {
        id: "D",
        text: "Cytoplasm",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The cell membrane regulates the movement of substances between the cell and its surrounding environment.",

      steps: [
        "The cell membrane surrounds the cytoplasm of the cell.",
        "It is selectively permeable, meaning that the movement of many substances across it is regulated.",
        "Small molecules may cross by processes such as diffusion or osmosis.",
        "Some substances require transport proteins or energy-dependent transport.",
        "Therefore, the correct answer is the cell membrane.",
      ],
    },
  },

  {
    id: "biology-cell-004",

    question:
      "Which of the following structures is present in a plant cell but absent from an animal cell?",

    options: [
      {
        id: "A",
        text: "Cell membrane",
      },
      {
        id: "B",
        text: "Cytoplasm",
      },
      {
        id: "C",
        text: "Cell wall",
      },
      {
        id: "D",
        text: "Nucleus",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Plant cells have a cellulose cell wall outside the cell membrane, whereas animal cells do not have a cell wall.",

      steps: [
        "Both plant and animal cells have a cell membrane.",
        "Both contain cytoplasm and, in typical cells, a nucleus.",
        "Plant cells have a cell wall made mainly of cellulose.",
        "The cell wall provides support and helps maintain the shape of the plant cell.",
        "Therefore, the correct answer is the cell wall.",
      ],
    },
  },

  {
    id: "biology-cell-005",

    question:
      "Which organelle contains chlorophyll and is responsible for photosynthesis in green plants?",

    options: [
      {
        id: "A",
        text: "Chloroplast",
      },
      {
        id: "B",
        text: "Mitochondrion",
      },
      {
        id: "C",
        text: "Ribosome",
      },
      {
        id: "D",
        text: "Lysosome",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Chloroplasts contain chlorophyll and are the main sites of photosynthesis in green plant cells.",

      steps: [
        "Chlorophyll is a green pigment that absorbs light energy.",
        "In green plants, chlorophyll is located mainly in chloroplasts.",
        "The absorbed light energy is used during photosynthesis.",
        "Mitochondria are primarily associated with aerobic respiration.",
        "Therefore, the correct answer is chloroplast.",
      ],
    },
  },

  {
    id: "biology-cell-006",

    question:
      "Which cell structure is the site of protein synthesis?",

    options: [
      {
        id: "A",
        text: "Ribosome",
      },
      {
        id: "B",
        text: "Vacuole",
      },
      {
        id: "C",
        text: "Cell wall",
      },
      {
        id: "D",
        text: "Centrosome",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Ribosomes are cellular structures responsible for assembling amino acids into proteins.",

      steps: [
        "Proteins are made from chains of amino acids.",
        "Ribosomes read information carried by messenger RNA.",
        "They join amino acids together in the appropriate sequence.",
        "This process produces polypeptide chains that can form functional proteins.",
        "Therefore, the correct answer is ribosome.",
      ],
    },
  },

  {
    id: "biology-cell-007",

    question:
      "Which process involves the movement of water molecules through a selectively permeable membrane from a region of higher water potential to a region of lower water potential?",

    options: [
      {
        id: "A",
        text: "Diffusion",
      },
      {
        id: "B",
        text: "Osmosis",
      },
      {
        id: "C",
        text: "Active transport",
      },
      {
        id: "D",
        text: "Phagocytosis",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Osmosis is the movement of water molecules through a selectively permeable membrane from higher water potential to lower water potential.",

      steps: [
        "Water molecules are continuously moving in solution.",
        "A selectively permeable membrane allows some substances to pass more readily than others.",
        "During osmosis, water moves across the membrane down its water-potential gradient.",
        "The process does not directly require cellular energy.",
        "Therefore, the correct answer is osmosis.",
      ],
    },
  },

  {
    id: "biology-cell-008",

    question:
      "Which process requires the expenditure of metabolic energy to move substances across a cell membrane against a concentration gradient?",

    options: [
      {
        id: "A",
        text: "Diffusion",
      },
      {
        id: "B",
        text: "Osmosis",
      },
      {
        id: "C",
        text: "Active transport",
      },
      {
        id: "D",
        text: "Simple filtration",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Active transport uses cellular energy to move substances against their concentration gradient.",

      steps: [
        "Particles naturally tend to move down their concentration gradient during diffusion.",
        "Active transport moves substances from a region of lower concentration to a region of higher concentration.",
        "This movement against the concentration gradient requires energy.",
        "Membrane transport proteins are involved in many forms of active transport.",
        "Therefore, the correct answer is active transport.",
      ],
    },
  },

  {
    id: "biology-cell-009",

    question:
      "Which of the following structures is mainly responsible for packaging and transporting substances within a cell?",

    options: [
      {
        id: "A",
        text: "Golgi apparatus",
      },
      {
        id: "B",
        text: "Nucleolus",
      },
      {
        id: "C",
        text: "Centrosome",
      },
      {
        id: "D",
        text: "Chloroplast",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The Golgi apparatus modifies, sorts and packages many proteins and other cellular products for transport.",

      steps: [
        "Proteins and other substances can be transported to the Golgi apparatus in vesicles.",
        "The Golgi apparatus modifies and sorts many of these substances.",
        "It packages them into vesicles for delivery to different destinations.",
        "The nucleolus is involved in ribosome production.",
        "Therefore, the correct answer is the Golgi apparatus.",
      ],
    },
  },

  {
    id: "biology-cell-010",

    question:
      "Which organelle contains digestive enzymes that can break down worn-out cell components and foreign materials?",

    options: [
      {
        id: "A",
        text: "Lysosome",
      },
      {
        id: "B",
        text: "Ribosome",
      },
      {
        id: "C",
        text: "Chloroplast",
      },
      {
        id: "D",
        text: "Centrosome",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Lysosomes contain hydrolytic enzymes that digest various materials within cells.",

      steps: [
        "Lysosomes are membrane-bound organelles containing digestive enzymes.",
        "These enzymes can break down worn-out cellular components.",
        "They can also help digest materials taken into the cell.",
        "The resulting smaller molecules can be reused or removed from the cell.",
        "Therefore, the correct answer is lysosome.",
      ],
    },
  },

  {
    id: "biology-cell-011",

    question:
      "Which structure is found in both prokaryotic and eukaryotic cells and is responsible for protein synthesis?",

    options: [
      {
        id: "A",
        text: "Nucleus",
      },
      {
        id: "B",
        text: "Ribosome",
      },
      {
        id: "C",
        text: "Mitochondrion",
      },
      {
        id: "D",
        text: "Chloroplast",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Ribosomes occur in both prokaryotic and eukaryotic cells and are responsible for protein synthesis.",

      steps: [
        "Prokaryotic cells do not have membrane-bound nuclei.",
        "Eukaryotic cells contain a membrane-bound nucleus.",
        "Both cell types contain ribosomes.",
        "Ribosomes assemble amino acids into proteins.",
        "Therefore, the correct answer is ribosome.",
      ],
    },
  },

  {
    id: "biology-cell-012",

    question:
      "Which of the following is a major difference between prokaryotic and eukaryotic cells?",

    options: [
      {
        id: "A",
        text: "Only eukaryotic cells contain genetic material",
      },
      {
        id: "B",
        text: "Only prokaryotic cells contain ribosomes",
      },
      {
        id: "C",
        text: "Eukaryotic cells possess membrane-bound organelles",
      },
      {
        id: "D",
        text: "Prokaryotic cells are always multicellular",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Eukaryotic cells contain membrane-bound organelles such as nuclei and mitochondria, while typical prokaryotic cells lack these membrane-bound organelles.",

      steps: [
        "Both prokaryotic and eukaryotic cells contain genetic material.",
        "Both types of cells contain ribosomes.",
        "Eukaryotic cells have membrane-bound organelles.",
        "Typical prokaryotic cells do not have a membrane-bound nucleus.",
        "Therefore, the correct answer is that eukaryotic cells possess membrane-bound organelles.",
      ],
    },
  },

  {
    id: "biology-cell-013",

    question:
      "Which organelle is particularly abundant in cells that require large amounts of energy?",

    options: [
      {
        id: "A",
        text: "Mitochondrion",
      },
      {
        id: "B",
        text: "Lysosome",
      },
      {
        id: "C",
        text: "Vacuole",
      },
      {
        id: "D",
        text: "Cell wall",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Cells with high energy demands generally contain many mitochondria because mitochondria are major sites of aerobic respiration.",

      steps: [
        "Cellular activities require energy.",
        "Mitochondria are major sites of aerobic respiration.",
        "Aerobic respiration produces ATP that can be used by the cell.",
        "Cells with high energy requirements therefore tend to have numerous mitochondria.",
        "Therefore, the correct answer is mitochondrion.",
      ],
    },
  },

  {
    id: "biology-cell-014",

    question:
      "Which of the following is the main function of the large central vacuole in a typical plant cell?",

    options: [
      {
        id: "A",
        text: "Storage of cell sap and maintenance of turgor",
      },
      {
        id: "B",
        text: "Synthesis of DNA",
      },
      {
        id: "C",
        text: "Production of ribosomes",
      },
      {
        id: "D",
        text: "Aerobic respiration",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The large central vacuole of a plant cell contains cell sap and contributes to the maintenance of turgor pressure.",

      steps: [
        "The central vacuole is surrounded by a membrane called the tonoplast.",
        "It contains cell sap made up of water and dissolved substances.",
        "Water entering the vacuole helps maintain pressure against the cell wall.",
        "This pressure contributes to the firmness and support of plant tissues.",
        "Therefore, the correct answer is storage of cell sap and maintenance of turgor.",
      ],
    },
  },

  {
    id: "biology-cell-015",

    question:
      "Which cell division process produces two genetically similar daughter cells and is important for growth and tissue repair?",

    options: [
      {
        id: "A",
        text: "Meiosis",
      },
      {
        id: "B",
        text: "Mitosis",
      },
      {
        id: "C",
        text: "Fertilization",
      },
      {
        id: "D",
        text: "Binary conjugation",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Mitosis produces two daughter cells that generally have the same chromosome number as the parent cell and is important for growth and repair.",

      steps: [
        "Before mitosis, the cell duplicates its DNA.",
        "The duplicated chromosomes are separated during nuclear division.",
        "The cell then divides to form two daughter cells.",
        "The daughter cells generally retain the same chromosome number as the parent cell.",
        "Mitosis is therefore important for growth, replacement and tissue repair.",
        "Therefore, the correct answer is mitosis.",
      ],
    },
  },
];

export default cellStructureAndFunctionsQuestions;
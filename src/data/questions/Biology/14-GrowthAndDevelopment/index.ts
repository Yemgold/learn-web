



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — GROWTH AND DEVELOPMENT                                           */
/* -------------------------------------------------------------------------- */

export const growthAndDevelopmentQuestions: ArenaQuestion[] = [
  {
    id: "biology-growth-001",

    question:
      "Which of the following best describes growth in a living organism?",

    options: [
      {
        id: "A",
        text: "A permanent increase in size and dry mass",
      },
      {
        id: "B",
        text: "Movement from one place to another",
      },
      {
        id: "C",
        text: "Removal of waste products",
      },
      {
        id: "D",
        text: "Production of offspring",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Growth is a permanent and irreversible increase in the size, dry mass or number of cells of an organism.",

      steps: [
        "Growth involves a permanent increase in size or dry mass.",
        "It is normally associated with an increase in cell number or cell size.",
        "Movement, excretion and reproduction are different life processes.",
        "Therefore, the correct answer is a permanent increase in size and dry mass.",
      ],
    },
  },

  {
    id: "biology-growth-002",

    question:
      "Which of the following processes is mainly responsible for growth in multicellular organisms?",

    options: [
      {
        id: "A",
        text: "Respiration",
      },
      {
        id: "B",
        text: "Cell division",
      },
      {
        id: "C",
        text: "Excretion",
      },
      {
        id: "D",
        text: "Transpiration",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Cell division increases the number of cells in a multicellular organism and contributes greatly to growth.",

      steps: [
        "Growth in multicellular organisms involves an increase in cell number and cell size.",
        "Mitosis produces new cells that contribute to growth and tissue formation.",
        "Respiration provides energy but does not directly increase cell number.",
        "Therefore, cell division is the correct answer.",
      ],
    },
  },

  {
    id: "biology-growth-003",

    question:
      "Which type of cell division is mainly responsible for growth and replacement of worn-out cells?",

    options: [
      {
        id: "A",
        text: "Meiosis",
      },
      {
        id: "B",
        text: "Binary fission",
      },
      {
        id: "C",
        text: "Mitosis",
      },
      {
        id: "D",
        text: "Fertilization",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Mitosis produces genetically similar daughter cells and is important for growth and tissue repair.",

      steps: [
        "Mitosis occurs in body cells.",
        "It produces two genetically similar daughter cells.",
        "The new cells help organisms grow and replace damaged or worn-out cells.",
        "Meiosis is mainly involved in the formation of gametes.",
        "Therefore, the correct answer is mitosis.",
      ],
    },
  },

  {
    id: "biology-growth-004",

    question:
      "Which of the following is required in large quantities for normal growth in humans?",

    options: [
      {
        id: "A",
        text: "Proteins",
      },
      {
        id: "B",
        text: "Carbon dioxide",
      },
      {
        id: "C",
        text: "Urea",
      },
      {
        id: "D",
        text: "Alcohol",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Proteins provide amino acids needed for the formation and repair of body tissues.",

      steps: [
        "Growth requires the formation of new cells and tissues.",
        "Proteins supply amino acids used to build body structures.",
        "Growing children therefore require adequate protein in their diet.",
        "Carbon dioxide, urea and alcohol are not required as major nutrients for growth.",
        "Therefore, the correct answer is proteins.",
      ],
    },
  },

  {
    id: "biology-growth-005",

    question:
      "Which hormone is mainly responsible for promoting growth in children?",

    options: [
      {
        id: "A",
        text: "Insulin",
      },
      {
        id: "B",
        text: "Growth hormone",
      },
      {
        id: "C",
        text: "Adrenaline",
      },
      {
        id: "D",
        text: "Thyroxine",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Growth hormone from the pituitary gland plays an important role in stimulating body growth during childhood.",

      steps: [
        "Growth hormone is produced by the pituitary gland.",
        "It promotes the growth of bones and other body tissues.",
        "Its effects are especially important during childhood and adolescence.",
        "Therefore, the correct answer is growth hormone.",
      ],
    },
  },

  {
    id: "biology-growth-006",

    question:
      "Which of the following factors can affect the growth of a plant?",

    options: [
      {
        id: "A",
        text: "Light intensity",
      },
      {
        id: "B",
        text: "Soil nutrients",
      },
      {
        id: "C",
        text: "Water availability",
      },
      {
        id: "D",
        text: "All of the above",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Plant growth depends on several environmental and internal factors.",

      steps: [
        "Plants require suitable light conditions for photosynthesis.",
        "Water is necessary for photosynthesis, transport and cell activities.",
        "Mineral nutrients are required for healthy growth.",
        "Therefore, light, water and soil nutrients can all affect plant growth.",
      ],
    },
  },

  {
    id: "biology-growth-007",

    question:
      "Which part of a plant is mainly responsible for primary growth in length?",

    options: [
      {
        id: "A",
        text: "Apical meristem",
      },
      {
        id: "B",
        text: "Root hair",
      },
      {
        id: "C",
        text: "Stoma",
      },
      {
        id: "D",
        text: "Xylem vessel",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Apical meristems contain actively dividing cells and are responsible for the increase in length of roots and shoots.",

      steps: [
        "Meristematic tissues contain cells capable of repeated division.",
        "Apical meristems are found at the tips of roots and shoots.",
        "Their activity causes primary growth, which increases plant length.",
        "Therefore, the correct answer is apical meristem.",
      ],
    },
  },

  {
    id: "biology-growth-008",

    question:
      "What is meant by development in an organism?",

    options: [
      {
        id: "A",
        text: "Only an increase in body weight",
      },
      {
        id: "B",
        text: "Progressive changes in form, structure and function",
      },
      {
        id: "C",
        text: "Removal of metabolic waste",
      },
      {
        id: "D",
        text: "Movement from one location to another",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Development refers to progressive changes in the form, structure and functions of an organism as it matures.",

      steps: [
        "Development involves changes that occur as an organism becomes more mature.",
        "These changes may involve body structure, organs and physiological functions.",
        "Development is therefore broader than simply an increase in size.",
        "Therefore, the correct answer is progressive changes in form, structure and function.",
      ],
    },
  },

  {
    id: "biology-growth-009",

    question:
      "Which of the following is an example of metamorphosis?",

    options: [
      {
        id: "A",
        text: "A seed increasing in size",
      },
      {
        id: "B",
        text: "A tadpole developing into a frog",
      },
      {
        id: "C",
        text: "A human gaining body weight",
      },
      {
        id: "D",
        text: "A plant absorbing water",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Metamorphosis involves marked changes in body form during the development of certain organisms.",

      steps: [
        "A tadpole has a body form that differs greatly from that of an adult frog.",
        "During development, the tadpole undergoes major structural changes.",
        "These changes eventually produce the adult frog.",
        "Therefore, tadpole development into a frog is an example of metamorphosis.",
      ],
    },
  },

  {
    id: "biology-growth-010",

    question:
      "Which of the following is a characteristic feature of adolescence in humans?",

    options: [
      {
        id: "A",
        text: "Cessation of all growth",
      },
      {
        id: "B",
        text: "Development of secondary sexual characteristics",
      },
      {
        id: "C",
        text: "Loss of all reproductive ability",
      },
      {
        id: "D",
        text: "Permanent stoppage of cell division",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Adolescence is a period of rapid physical and physiological development during which secondary sexual characteristics appear.",

      steps: [
        "Adolescence occurs between childhood and adulthood.",
        "Hormonal changes cause major physical and reproductive changes.",
        "Secondary sexual characteristics develop during this period.",
        "Examples include changes in body shape and development of reproductive features.",
        "Therefore, the correct answer is development of secondary sexual characteristics.",
      ],
    },
  },

  {
    id: "biology-growth-011",

    question:
      "Which of the following conditions is likely to result from severe malnutrition during childhood?",

    options: [
      {
        id: "A",
        text: "Stunted growth",
      },
      {
        id: "B",
        text: "Increased height in all cases",
      },
      {
        id: "C",
        text: "Permanent increase in metabolism",
      },
      {
        id: "D",
        text: "Increased production of all hormones",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Adequate nutrients are necessary for normal growth and development, especially during childhood.",

      steps: [
        "Growing children require proteins, vitamins, minerals, carbohydrates and other nutrients.",
        "Severe nutritional deficiencies can interfere with normal body development.",
        "Prolonged malnutrition may result in stunted growth.",
        "Therefore, the correct answer is stunted growth.",
      ],
    },
  },

  {
    id: "biology-growth-012",

    question:
      "Which of the following best distinguishes growth from development?",

    options: [
      {
        id: "A",
        text: "Growth involves quantitative changes while development involves qualitative changes",
      },
      {
        id: "B",
        text: "Growth only occurs in plants",
      },
      {
        id: "C",
        text: "Development only occurs in animals",
      },
      {
        id: "D",
        text: "Growth and development mean exactly the same thing",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Growth and development are related but different biological processes.",

      steps: [
        "Growth involves measurable increases such as size, height, mass or cell number.",
        "These are generally described as quantitative changes.",
        "Development involves progressive changes in form, structure and function.",
        "These are mainly qualitative changes.",
        "Therefore, growth involves quantitative changes while development involves qualitative changes.",
      ],
    },
  },
];

export default growthAndDevelopmentQuestions;
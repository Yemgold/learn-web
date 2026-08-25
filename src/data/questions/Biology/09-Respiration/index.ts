



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — RESPIRATION                                                      */
/* -------------------------------------------------------------------------- */

export const respirationQuestions: ArenaQuestion[] = [
  {
    id: "biology-respiration-001",

    question:
      "Which of the following organelles is the main site of aerobic respiration in a cell?",

    options: [
      {
        id: "A",
        text: "Ribosome",
      },
      {
        id: "B",
        text: "Mitochondrion",
      },
      {
        id: "C",
        text: "Chloroplast",
      },
      {
        id: "D",
        text: "Nucleus",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The mitochondrion is the main organelle where aerobic respiration occurs and large amounts of ATP are produced.",

      steps: [
        "Cells require energy to carry out their activities.",
        "Aerobic respiration releases energy from glucose in the presence of oxygen.",
        "Most of the stages of aerobic respiration occur in the mitochondria.",
        "The mitochondria therefore serve as the main sites of aerobic respiration.",
        "Therefore, the correct answer is mitochondrion.",
      ],
    },
  },

  {
    id: "biology-respiration-002",

    question:
      "Which of the following is required for aerobic respiration?",

    options: [
      {
        id: "A",
        text: "Oxygen",
      },
      {
        id: "B",
        text: "Nitrogen",
      },
      {
        id: "C",
        text: "Chlorophyll",
      },
      {
        id: "D",
        text: "Carbon monoxide",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Aerobic respiration is respiration that uses oxygen to release energy from food.",

      steps: [
        "The word aerobic refers to processes involving oxygen.",
        "Aerobic respiration uses oxygen during the breakdown of glucose.",
        "Energy is released and made available to the cell.",
        "Nitrogen and chlorophyll are not requirements for aerobic respiration.",
        "Therefore, oxygen is required for aerobic respiration.",
      ],
    },
  },

  {
    id: "biology-respiration-003",

    question:
      "Which of the following products is formed during aerobic respiration?",

    options: [
      {
        id: "A",
        text: "Carbon dioxide",
      },
      {
        id: "B",
        text: "Nitrogen",
      },
      {
        id: "C",
        text: "Chlorophyll",
      },
      {
        id: "D",
        text: "Urea only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Aerobic respiration breaks down glucose using oxygen and produces carbon dioxide, water and energy.",

      steps: [
        "Glucose is broken down during aerobic respiration.",
        "Oxygen is used in the process.",
        "Carbon dioxide is produced as a waste product.",
        "Water is also produced.",
        "Energy is released for use by the cell.",
      ],
    },
  },

  {
    id: "biology-respiration-004",

    question:
      "Which substance is the main respiratory substrate used by cells to release energy?",

    options: [
      {
        id: "A",
        text: "Glucose",
      },
      {
        id: "B",
        text: "Water",
      },
      {
        id: "C",
        text: "Oxygen",
      },
      {
        id: "D",
        text: "Carbon dioxide",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Glucose is an important respiratory substrate that can be broken down to release energy.",

      steps: [
        "Respiratory substrates are substances that are broken down during respiration.",
        "Glucose is a major respiratory substrate.",
        "The energy stored in glucose is released during respiration.",
        "Oxygen is used during aerobic respiration but is not the respiratory substrate.",
        "Therefore, glucose is the correct answer.",
      ],
    },
  },

  {
    id: "biology-respiration-005",

    question:
      "What is the main importance of respiration to living organisms?",

    options: [
      {
        id: "A",
        text: "It produces chlorophyll",
      },
      {
        id: "B",
        text: "It releases energy for life processes",
      },
      {
        id: "C",
        text: "It produces sunlight",
      },
      {
        id: "D",
        text: "It prevents reproduction",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Respiration releases energy from food, making that energy available for essential life processes.",

      steps: [
        "Living organisms require energy for activities such as growth and movement.",
        "Energy is stored in food substances such as glucose.",
        "Respiration breaks down these substances and releases energy.",
        "The released energy is used for various cellular activities.",
        "Therefore, respiration is important because it releases energy for life processes.",
      ],
    },
  },

  {
    id: "biology-respiration-006",

    question:
      "Which of the following correctly describes anaerobic respiration in yeast?",

    options: [
      {
        id: "A",
        text: "Glucose is converted into ethanol and carbon dioxide",
      },
      {
        id: "B",
        text: "Glucose is completely broken down into carbon dioxide and water",
      },
      {
        id: "C",
        text: "Oxygen is converted into glucose",
      },
      {
        id: "D",
        text: "Ethanol is converted into oxygen",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "In yeast, anaerobic respiration involves the incomplete breakdown of glucose to produce ethanol and carbon dioxide.",

      steps: [
        "Anaerobic respiration occurs without oxygen.",
        "Yeast can obtain energy from glucose under anaerobic conditions.",
        "Glucose is incompletely broken down.",
        "Ethanol and carbon dioxide are produced.",
        "This process is also called alcoholic fermentation.",
      ],
    },
  },

  {
    id: "biology-respiration-007",

    question:
      "Which of the following substances accumulates in human muscles during vigorous exercise when oxygen supply is insufficient?",

    options: [
      {
        id: "A",
        text: "Ethanol",
      },
      {
        id: "B",
        text: "Lactic acid",
      },
      {
        id: "C",
        text: "Starch",
      },
      {
        id: "D",
        text: "Chlorophyll",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "When oxygen supply is insufficient during vigorous exercise, muscles can temporarily obtain energy through anaerobic respiration, producing lactic acid.",

      steps: [
        "During vigorous exercise, muscles require a large amount of energy.",
        "The oxygen supply may become insufficient for the energy demand.",
        "Muscle cells can temporarily respire anaerobically.",
        "Lactic acid is produced during anaerobic respiration in muscles.",
        "The accumulation of lactic acid is associated with muscle fatigue.",
      ],
    },
  },

  {
    id: "biology-respiration-008",

    question:
      "Which gas is taken into the body during normal breathing and used in aerobic respiration?",

    options: [
      {
        id: "A",
        text: "Carbon dioxide",
      },
      {
        id: "B",
        text: "Oxygen",
      },
      {
        id: "C",
        text: "Nitrogen",
      },
      {
        id: "D",
        text: "Hydrogen",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Oxygen enters the body during breathing and is used by cells during aerobic respiration.",

      steps: [
        "Air enters the lungs during inhalation.",
        "Oxygen moves from the air spaces in the lungs into the blood.",
        "The blood transports oxygen to body tissues.",
        "Cells use oxygen during aerobic respiration.",
        "Therefore, oxygen is the gas required for aerobic respiration.",
      ],
    },
  },

  {
    id: "biology-respiration-009",

    question:
      "Why does the breathing rate increase during vigorous exercise?",

    options: [
      {
        id: "A",
        text: "The body requires less oxygen",
      },
      {
        id: "B",
        text: "The muscles require more energy and therefore more oxygen",
      },
      {
        id: "C",
        text: "The body stops producing carbon dioxide",
      },
      {
        id: "D",
        text: "The lungs stop exchanging gases",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Vigorous exercise increases the energy demand of muscles, so breathing becomes faster to supply more oxygen and remove more carbon dioxide.",

      steps: [
        "Active muscles require more energy.",
        "More energy is obtained through increased respiration.",
        "Aerobic respiration requires oxygen.",
        "Exercise also produces more carbon dioxide.",
        "Breathing rate increases to improve oxygen uptake and carbon dioxide removal.",
      ],
    },
  },

  {
    id: "biology-respiration-010",

    question:
      "Which of the following statements about aerobic respiration is correct?",

    options: [
      {
        id: "A",
        text: "It occurs only in plants",
      },
      {
        id: "B",
        text: "It occurs only in animals",
      },
      {
        id: "C",
        text: "It releases energy from food using oxygen",
      },
      {
        id: "D",
        text: "It produces no waste products",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Aerobic respiration is a cellular process in which energy is released from food using oxygen.",

      steps: [
        "Both plants and animals carry out cellular respiration.",
        "Aerobic respiration requires oxygen.",
        "Food substances such as glucose are broken down.",
        "Energy is released and made available to cells.",
        "Carbon dioxide and water are produced as end products.",
        "Therefore, the correct answer is that it releases energy from food using oxygen.",
      ],
    },
  },
];

export default respirationQuestions;
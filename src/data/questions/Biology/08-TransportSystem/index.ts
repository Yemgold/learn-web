


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — TRANSPORT SYSTEM                                                 */
/* -------------------------------------------------------------------------- */

export const transportSystemQuestions: ArenaQuestion[] = [
  {
    id: "biology-transport-001",

    question:
      "Which of the following structures is responsible for the transport of water and mineral salts in flowering plants?",

    options: [
      {
        id: "A",
        text: "Phloem",
      },
      {
        id: "B",
        text: "Xylem",
      },
      {
        id: "C",
        text: "Cambium",
      },
      {
        id: "D",
        text: "Epidermis",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Xylem is the vascular tissue responsible mainly for transporting water and dissolved mineral salts from the roots to other parts of the plant.",

      steps: [
        "Roots absorb water and mineral salts from the soil.",
        "Xylem vessels conduct these substances upward through the plant.",
        "Phloem mainly transports manufactured food.",
        "Therefore, the correct answer is Xylem.",
      ],
    },
  },

  {
    id: "biology-transport-002",

    question:
      "Which component of blood is mainly responsible for the transport of oxygen?",

    options: [
      {
        id: "A",
        text: "Platelets",
      },
      {
        id: "B",
        text: "White blood cells",
      },
      {
        id: "C",
        text: "Red blood cells",
      },
      {
        id: "D",
        text: "Plasma",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Red blood cells transport oxygen because they contain haemoglobin, a pigment that combines readily with oxygen.",

      steps: [
        "Red blood cells contain the pigment haemoglobin.",
        "Haemoglobin combines with oxygen in the lungs.",
        "The oxygenated blood carries oxygen to body tissues.",
        "Therefore, red blood cells are mainly responsible for oxygen transport.",
      ],
    },
  },

  {
    id: "biology-transport-003",

    question:
      "Which blood vessel carries blood away from the heart?",

    options: [
      {
        id: "A",
        text: "Vein",
      },
      {
        id: "B",
        text: "Artery",
      },
      {
        id: "C",
        text: "Capillary",
      },
      {
        id: "D",
        text: "Venule",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Arteries are blood vessels that carry blood away from the heart.",

      steps: [
        "The heart pumps blood into arteries.",
        "Arteries carry blood away from the heart.",
        "Veins return blood towards the heart.",
        "Capillaries connect arteries and veins and allow exchange of substances.",
        "Therefore, the correct answer is Artery.",
      ],
    },
  },

  {
    id: "biology-transport-004",

    question:
      "Which of the following blood vessels is best adapted for the exchange of materials between the blood and body tissues?",

    options: [
      {
        id: "A",
        text: "Artery",
      },
      {
        id: "B",
        text: "Vein",
      },
      {
        id: "C",
        text: "Capillary",
      },
      {
        id: "D",
        text: "Aorta",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Capillaries are tiny blood vessels with very thin walls that allow substances to move between the blood and surrounding tissues.",

      steps: [
        "Capillaries have walls that are approximately one cell thick.",
        "Their narrow diameter brings blood close to body cells.",
        "Oxygen and nutrients can move from the blood into tissues.",
        "Carbon dioxide and other waste products can move into the blood.",
        "Therefore, the correct answer is Capillary.",
      ],
    },
  },

  {
    id: "biology-transport-005",

    question:
      "Which part of the human heart receives oxygenated blood from the lungs?",

    options: [
      {
        id: "A",
        text: "Right atrium",
      },
      {
        id: "B",
        text: "Right ventricle",
      },
      {
        id: "C",
        text: "Left atrium",
      },
      {
        id: "D",
        text: "Left ventricle",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The left atrium receives oxygenated blood from the lungs through the pulmonary veins.",

      steps: [
        "Blood becomes oxygenated in the lungs.",
        "The pulmonary veins carry this oxygenated blood to the heart.",
        "The pulmonary veins enter the left atrium.",
        "The left atrium passes the blood into the left ventricle.",
        "Therefore, the correct answer is Left atrium.",
      ],
    },
  },

  {
    id: "biology-transport-006",

    question:
      "Which of the following is the main function of haemoglobin in red blood cells?",

    options: [
      {
        id: "A",
        text: "Digestion of food",
      },
      {
        id: "B",
        text: "Transport of oxygen",
      },
      {
        id: "C",
        text: "Production of antibodies",
      },
      {
        id: "D",
        text: "Blood clotting",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Haemoglobin is the respiratory pigment in red blood cells and is mainly involved in oxygen transport.",

      steps: [
        "Haemoglobin is found inside red blood cells.",
        "It combines with oxygen in the lungs.",
        "The resulting oxyhaemoglobin allows oxygen to be transported around the body.",
        "Therefore, the correct answer is Transport of oxygen.",
      ],
    },
  },

  {
    id: "biology-transport-007",

    question:
      "Which of the following components of blood is mainly responsible for clotting?",

    options: [
      {
        id: "A",
        text: "Red blood cells",
      },
      {
        id: "B",
        text: "White blood cells",
      },
      {
        id: "C",
        text: "Platelets",
      },
      {
        id: "D",
        text: "Plasma",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Platelets play an important role in blood clotting and help prevent excessive blood loss when a blood vessel is damaged.",

      steps: [
        "Damage to a blood vessel causes platelets to gather at the damaged area.",
        "Platelets help initiate the clotting process.",
        "A blood clot forms over the damaged area.",
        "This helps reduce blood loss.",
        "Therefore, the correct answer is Platelets.",
      ],
    },
  },

  {
    id: "biology-transport-008",

    question:
      "Which of the following substances is transported through the phloem of a flowering plant?",

    options: [
      {
        id: "A",
        text: "Water only",
      },
      {
        id: "B",
        text: "Mineral salts only",
      },
      {
        id: "C",
        text: "Manufactured food",
      },
      {
        id: "D",
        text: "Oxygen only",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Phloem transports organic nutrients, especially sugars produced during photosynthesis, from sources to areas where they are needed or stored.",

      steps: [
        "Green leaves manufacture food through photosynthesis.",
        "Sugars produced by photosynthesis need to be transported to other parts of the plant.",
        "Phloem carries these manufactured food substances.",
        "Xylem mainly transports water and mineral salts.",
        "Therefore, the correct answer is Manufactured food.",
      ],
    },
  },

  {
    id: "biology-transport-009",

    question:
      "Which chamber of the human heart pumps oxygenated blood to the rest of the body?",

    options: [
      {
        id: "A",
        text: "Right atrium",
      },
      {
        id: "B",
        text: "Right ventricle",
      },
      {
        id: "C",
        text: "Left atrium",
      },
      {
        id: "D",
        text: "Left ventricle",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "The left ventricle pumps oxygenated blood through the aorta to all parts of the body.",

      steps: [
        "Oxygenated blood enters the left atrium from the lungs.",
        "It then moves into the left ventricle.",
        "The left ventricle has a thick muscular wall.",
        "It contracts strongly to pump blood into the aorta.",
        "The aorta distributes the blood to the body.",
        "Therefore, the correct answer is Left ventricle.",
      ],
    },
  },

  {
    id: "biology-transport-010",

    question:
      "Which process is mainly responsible for the upward movement of water in a plant?",

    options: [
      {
        id: "A",
        text: "Transpiration pull",
      },
      {
        id: "B",
        text: "Digestion",
      },
      {
        id: "C",
        text: "Fermentation",
      },
      {
        id: "D",
        text: "Germination",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Transpiration from the leaves creates a pulling force that helps move water upward through the xylem.",

      steps: [
        "Water is absorbed by the roots.",
        "It moves through the xylem towards the leaves.",
        "Water is lost from the leaves through transpiration.",
        "This loss creates a tension that helps pull water upward.",
        "Therefore, the correct answer is Transpiration pull.",
      ],
    },
  },
];

export default transportSystemQuestions;
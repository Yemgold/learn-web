



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — EXCRETION                                                        */
/* -------------------------------------------------------------------------- */

export const excretionQuestions: ArenaQuestion[] = [
  {
    id: "biology-excretion-001",

    question:
      "Which of the following organs is primarily responsible for the excretion of urea in humans?",

    options: [
      {
        id: "A",
        text: "Lungs",
      },
      {
        id: "B",
        text: "Kidneys",
      },
      {
        id: "C",
        text: "Liver",
      },
      {
        id: "D",
        text: "Skin",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The kidneys remove urea and other nitrogenous wastes from the blood and form urine.",

      steps: [
        "Proteins are broken down to produce nitrogenous waste.",
        "In humans, ammonia is converted into urea in the liver.",
        "The urea is transported in the blood to the kidneys.",
        "The kidneys filter the blood and remove urea as part of urine.",
        "Therefore, the kidneys are primarily responsible for the excretion of urea.",
      ],
    },
  },

  {
    id: "biology-excretion-002",

    question:
      "Which of the following substances is excreted through the lungs in humans?",

    options: [
      {
        id: "A",
        text: "Urea",
      },
      {
        id: "B",
        text: "Carbon dioxide",
      },
      {
        id: "C",
        text: "Bile",
      },
      {
        id: "D",
        text: "Sweat",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The lungs remove carbon dioxide and water vapour from the body during exhalation.",

      steps: [
        "Carbon dioxide is produced during cellular respiration.",
        "It is transported by the blood to the lungs.",
        "The lungs remove carbon dioxide from the blood.",
        "Carbon dioxide is then expelled during exhalation.",
        "Therefore, carbon dioxide is excreted through the lungs.",
      ],
    },
  },

  {
    id: "biology-excretion-003",

    question:
      "Which of the following is the main nitrogenous waste product excreted by humans?",

    options: [
      {
        id: "A",
        text: "Ammonia",
      },
      {
        id: "B",
        text: "Urea",
      },
      {
        id: "C",
        text: "Carbon dioxide",
      },
      {
        id: "D",
        text: "Glucose",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Urea is the principal nitrogenous waste product excreted by humans.",

      steps: [
        "Proteins are broken down into amino acids.",
        "Excess amino acids are deaminated in the liver.",
        "The toxic ammonia produced is converted into urea.",
        "Urea is transported to the kidneys and removed in urine.",
        "Therefore, urea is the main nitrogenous waste product excreted by humans.",
      ],
    },
  },

  {
    id: "biology-excretion-004",

    question:
      "Which structure of the kidney is the functional unit responsible for urine formation?",

    options: [
      {
        id: "A",
        text: "Nephron",
      },
      {
        id: "B",
        text: "Ureter",
      },
      {
        id: "C",
        text: "Bladder",
      },
      {
        id: "D",
        text: "Urethra",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The nephron is the functional unit of the kidney and carries out the processes involved in urine formation.",

      steps: [
        "Each kidney contains numerous microscopic nephrons.",
        "The nephron filters the blood.",
        "Useful substances are selectively reabsorbed.",
        "Waste products and excess substances remain in the filtrate and form urine.",
        "Therefore, the nephron is the functional unit of the kidney.",
      ],
    },
  },

  {
    id: "biology-excretion-005",

    question:
      "Which process involves the movement of useful substances from the kidney tubules back into the blood?",

    options: [
      {
        id: "A",
        text: "Ultrafiltration",
      },
      {
        id: "B",
        text: "Selective reabsorption",
      },
      {
        id: "C",
        text: "Deamination",
      },
      {
        id: "D",
        text: "Exhalation",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Selective reabsorption returns useful substances from the filtrate to the blood.",

      steps: [
        "Blood is filtered at the renal corpuscle.",
        "The filtrate contains both useful substances and waste products.",
        "Useful substances such as glucose and some ions are reabsorbed.",
        "The substances move from the kidney tubules back into the blood.",
        "This process is called selective reabsorption.",
      ],
    },
  },

  {
    id: "biology-excretion-006",

    question:
      "Which of the following substances is normally absent from the urine of a healthy person?",

    options: [
      {
        id: "A",
        text: "Urea",
      },
      {
        id: "B",
        text: "Water",
      },
      {
        id: "C",
        text: "Glucose",
      },
      {
        id: "D",
        text: "Mineral salts",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Glucose is normally completely reabsorbed from the kidney filtrate in a healthy person.",

      steps: [
        "Glucose is filtered into the nephron during ultrafiltration.",
        "The body needs glucose for energy.",
        "Normally, glucose is completely reabsorbed into the blood.",
        "Therefore, glucose should not normally be present in urine.",
        "Urea, water and mineral salts can normally occur in urine.",
      ],
    },
  },

  {
    id: "biology-excretion-007",

    question:
      "Which organ converts toxic ammonia into the less toxic substance urea?",

    options: [
      {
        id: "A",
        text: "Kidney",
      },
      {
        id: "B",
        text: "Liver",
      },
      {
        id: "C",
        text: "Lung",
      },
      {
        id: "D",
        text: "Heart",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The liver converts toxic ammonia into urea through the urea cycle.",

      steps: [
        "Amino acids can be broken down when they are in excess.",
        "Deamination produces ammonia.",
        "Ammonia is highly toxic to the body.",
        "The liver converts ammonia into the less toxic urea.",
        "The urea is then transported to the kidneys for excretion.",
      ],
    },
  },

  {
    id: "biology-excretion-008",

    question:
      "Which of the following structures carries urine from the kidney to the urinary bladder?",

    options: [
      {
        id: "A",
        text: "Urethra",
      },
      {
        id: "B",
        text: "Ureter",
      },
      {
        id: "C",
        text: "Renal artery",
      },
      {
        id: "D",
        text: "Renal vein",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The ureter is a tube that transports urine from each kidney to the urinary bladder.",

      steps: [
        "Urine is formed in the nephrons of the kidneys.",
        "The urine collects in the kidney before leaving it.",
        "The ureter carries urine from the kidney to the bladder.",
        "The bladder stores urine temporarily.",
        "The urethra carries urine from the bladder to the outside of the body.",
      ],
    },
  },

  {
    id: "biology-excretion-009",

    question:
      "Which of the following is an excretory product of green plants?",

    options: [
      {
        id: "A",
        text: "Oxygen",
      },
      {
        id: "B",
        text: "Starch",
      },
      {
        id: "C",
        text: "Chlorophyll",
      },
      {
        id: "D",
        text: "Glucose",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Oxygen produced during photosynthesis can be released from green plants as a metabolic waste product.",

      steps: [
        "Green plants carry out photosynthesis.",
        "Oxygen is produced during photosynthesis.",
        "Oxygen is not required in the same quantity in which it may be produced during photosynthesis.",
        "It can diffuse out of the leaves through the stomata.",
        "Therefore, oxygen can serve as an excretory product of green plants.",
      ],
    },
  },

  {
    id: "biology-excretion-010",

    question:
      "Which structure in the human kidney receives blood directly from the renal artery?",

    options: [
      {
        id: "A",
        text: "Glomerulus",
      },
      {
        id: "B",
        text: "Ureter",
      },
      {
        id: "C",
        text: "Urinary bladder",
      },
      {
        id: "D",
        text: "Urethra",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Blood entering the kidney through the renal artery is distributed into smaller blood vessels, including those supplying the glomeruli.",

      steps: [
        "The renal artery carries oxygenated blood into the kidney.",
        "The blood is distributed through progressively smaller blood vessels.",
        "The glomerulus is a network of capillaries within the nephron.",
        "Filtration of the blood begins at the glomerulus.",
        "Therefore, the glomerulus is directly involved in receiving blood supplied through the renal circulation.",
      ],
    },
  },
];

export default excretionQuestions;
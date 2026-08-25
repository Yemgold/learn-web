

import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — NUTRITION                                                        */
/* -------------------------------------------------------------------------- */

export const nutritionQuestions: ArenaQuestion[] = [
  {
    id: "biology-nutrition-001",

    question:
      "Which of the following nutrients is mainly required for growth and repair of body tissues?",

    options: [
      {
        id: "A",
        text: "Carbohydrates",
      },
      {
        id: "B",
        text: "Proteins",
      },
      {
        id: "C",
        text: "Vitamins",
      },
      {
        id: "D",
        text: "Mineral salts",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Proteins are essential nutrients required mainly for growth, repair and replacement of body tissues.",

      steps: [
        "Proteins are made up of amino acids.",
        "They are required for the growth and development of body tissues.",
        "Proteins also help repair damaged tissues.",
        "Carbohydrates are mainly used as a source of energy.",
        "Therefore, the correct answer is Proteins.",
      ],
    },
  },

  {
    id: "biology-nutrition-002",

    question:
      "Which of the following nutrients provides the major source of energy in the human body?",

    options: [
      {
        id: "A",
        text: "Protein",
      },
      {
        id: "B",
        text: "Carbohydrate",
      },
      {
        id: "C",
        text: "Vitamin",
      },
      {
        id: "D",
        text: "Mineral salt",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Carbohydrates are an important source of energy for the body.",

      steps: [
        "Carbohydrates are broken down during digestion.",
        "Simple sugars such as glucose are absorbed into the bloodstream.",
        "Glucose can be used during respiration to release energy.",
        "Proteins have important roles in growth and tissue repair.",
        "Therefore, the correct answer is Carbohydrate.",
      ],
    },
  },

  {
    id: "biology-nutrition-003",

    question:
      "Which of the following vitamins is important for normal vision?",

    options: [
      {
        id: "A",
        text: "Vitamin A",
      },
      {
        id: "B",
        text: "Vitamin B",
      },
      {
        id: "C",
        text: "Vitamin C",
      },
      {
        id: "D",
        text: "Vitamin K",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Vitamin A is important for maintaining normal vision and healthy epithelial tissues.",

      steps: [
        "Vitamin A is required for normal functioning of the eyes.",
        "It is particularly important for vision in dim light.",
        "Severe deficiency can lead to night blindness.",
        "Therefore, the correct answer is Vitamin A.",
      ],
    },
  },

  {
    id: "biology-nutrition-004",

    question:
      "A deficiency of vitamin C in the diet may result in which of the following diseases?",

    options: [
      {
        id: "A",
        text: "Rickets",
      },
      {
        id: "B",
        text: "Scurvy",
      },
      {
        id: "C",
        text: "Beriberi",
      },
      {
        id: "D",
        text: "Night blindness",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Scurvy is associated with prolonged deficiency of vitamin C.",

      steps: [
        "Vitamin C is important for normal connective tissue formation and other body functions.",
        "A prolonged deficiency of vitamin C can cause scurvy.",
        "Rickets is associated mainly with vitamin D deficiency.",
        "Night blindness is associated with vitamin A deficiency.",
        "Therefore, the correct answer is Scurvy.",
      ],
    },
  },

  {
    id: "biology-nutrition-005",

    question:
      "Which of the following mineral elements is essential for the formation of haemoglobin?",

    options: [
      {
        id: "A",
        text: "Calcium",
      },
      {
        id: "B",
        text: "Iron",
      },
      {
        id: "C",
        text: "Sodium",
      },
      {
        id: "D",
        text: "Iodine",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Iron is an essential component involved in the formation of haemoglobin.",

      steps: [
        "Haemoglobin is the pigment in red blood cells that carries oxygen.",
        "Iron is an important component of haemoglobin.",
        "Adequate dietary iron is therefore necessary for normal haemoglobin production.",
        "Calcium is particularly important for bones and teeth.",
        "Therefore, the correct answer is Iron.",
      ],
    },
  },

  {
    id: "biology-nutrition-006",

    question:
      "Which of the following is the main function of dietary fibre in the human digestive system?",

    options: [
      {
        id: "A",
        text: "To provide proteins for tissue repair",
      },
      {
        id: "B",
        text: "To increase the absorption of glucose",
      },
      {
        id: "C",
        text: "To aid movement of food through the alimentary canal",
      },
      {
        id: "D",
        text: "To produce digestive enzymes",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Dietary fibre adds bulk to food and helps promote normal movement through the digestive tract.",

      steps: [
        "Dietary fibre is largely not digested by human digestive enzymes.",
        "It adds bulk to the contents of the intestine.",
        "This helps food and waste move through the alimentary canal.",
        "Adequate fibre is therefore useful for maintaining normal bowel movement.",
        "Therefore, the correct answer is to aid movement of food through the alimentary canal.",
      ],
    },
  },

  {
    id: "biology-nutrition-007",

    question:
      "Which of the following tests is used to detect starch in a food sample?",

    options: [
      {
        id: "A",
        text: "Benedict's test",
      },
      {
        id: "B",
        text: "Biuret test",
      },
      {
        id: "C",
        text: "Iodine test",
      },
      {
        id: "D",
        text: "Emulsion test",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Iodine solution is commonly used to test for the presence of starch.",

      steps: [
        "A food sample can be treated with iodine solution.",
        "If starch is present, the iodine produces a characteristic blue-black colour.",
        "Benedict's test is used for reducing sugars.",
        "The Biuret test is used for proteins.",
        "Therefore, the correct answer is Iodine test.",
      ],
    },
  },

  {
    id: "biology-nutrition-008",

    question:
      "Which of the following tests is commonly used to detect proteins in a food sample?",

    options: [
      {
        id: "A",
        text: "Iodine test",
      },
      {
        id: "B",
        text: "Biuret test",
      },
      {
        id: "C",
        text: "Benedict's test",
      },
      {
        id: "D",
        text: "Emulsion test",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The Biuret test is used to test for the presence of proteins.",

      steps: [
        "Proteins contain peptide bonds.",
        "The Biuret test reacts with these bonds.",
        "A positive Biuret test produces a violet or purple colour.",
        "Iodine is used to test for starch.",
        "Benedict's test is used to test for reducing sugars.",
        "Therefore, the correct answer is Biuret test.",
      ],
    },
  },

  {
    id: "biology-nutrition-009",

    question:
      "Which of the following organs produces bile?",

    options: [
      {
        id: "A",
        text: "Pancreas",
      },
      {
        id: "B",
        text: "Stomach",
      },
      {
        id: "C",
        text: "Liver",
      },
      {
        id: "D",
        text: "Small intestine",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The liver produces bile, which is stored in the gall bladder before being released into the small intestine.",

      steps: [
        "The liver is an important digestive organ.",
        "It produces bile.",
        "Bile is stored and concentrated in the gall bladder.",
        "Bile is released into the small intestine.",
        "Bile helps emulsify fats, increasing their surface area for enzyme action.",
        "Therefore, the correct answer is Liver.",
      ],
    },
  },

  {
    id: "biology-nutrition-010",

    question:
      "Which of the following is the main advantage of emulsification of fats during digestion?",

    options: [
      {
        id: "A",
        text: "It converts fats directly into glucose",
      },
      {
        id: "B",
        text: "It increases the surface area available for lipase action",
      },
      {
        id: "C",
        text: "It converts proteins into amino acids",
      },
      {
        id: "D",
        text: "It prevents the absorption of fatty acids",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Emulsification breaks large fat globules into smaller droplets, increasing the surface area available to digestive enzymes.",

      steps: [
        "Large fat globules have a relatively small surface area for enzyme action.",
        "Bile salts break the fat into smaller droplets.",
        "This process is called emulsification.",
        "The smaller droplets provide a larger total surface area.",
        "Lipase can therefore act more effectively on the fat.",
        "Therefore, the correct answer is that it increases the surface area available for lipase action.",
      ],
    },
  },

  {
    id: "biology-nutrition-011",

    question:
      "Where does most absorption of digested food take place in the human alimentary canal?",

    options: [
      {
        id: "A",
        text: "Stomach",
      },
      {
        id: "B",
        text: "Small intestine",
      },
      {
        id: "C",
        text: "Large intestine",
      },
      {
        id: "D",
        text: "Oesophagus",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The small intestine is the major site for absorption of digested nutrients.",

      steps: [
        "Digestion is completed largely in the small intestine.",
        "The lining of the small intestine contains numerous villi.",
        "Villi greatly increase the surface area available for absorption.",
        "Digested nutrients pass through the intestinal wall into the blood or lymph.",
        "Therefore, the correct answer is Small intestine.",
      ],
    },
  },

  {
    id: "biology-nutrition-012",

    question:
      "Which structure in the small intestine increases the surface area for absorption?",

    options: [
      {
        id: "A",
        text: "Alveoli",
      },
      {
        id: "B",
        text: "Villi",
      },
      {
        id: "C",
        text: "Nephrons",
      },
      {
        id: "D",
        text: "Cilia",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Villi are finger-like projections lining the small intestine that increase the surface area available for nutrient absorption.",

      steps: [
        "The inner surface of the small intestine contains numerous villi.",
        "Each villus contains a network of blood capillaries and a lacteal.",
        "The large number of villi provides a very large surface area.",
        "This makes absorption of digested nutrients more efficient.",
        "Therefore, the correct answer is Villi.",
      ],
    },
  },

  {
    id: "biology-nutrition-013",

    question:
      "Which enzyme begins the digestion of starch in the human alimentary canal?",

    options: [
      {
        id: "A",
        text: "Pepsin",
      },
      {
        id: "B",
        text: "Amylase",
      },
      {
        id: "C",
        text: "Lipase",
      },
      {
        id: "D",
        text: "Trypsin",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Amylase begins the digestion of starch into smaller carbohydrate molecules.",

      steps: [
        "Digestion of starch begins in the mouth.",
        "Salivary glands release saliva containing amylase.",
        "Amylase acts on starch and breaks it down into smaller sugars.",
        "Pepsin digests proteins, while lipase digests fats.",
        "Therefore, the correct answer is Amylase.",
      ],
    },
  },

  {
    id: "biology-nutrition-014",

    question:
      "Which enzyme is mainly responsible for the digestion of proteins in the stomach?",

    options: [
      {
        id: "A",
        text: "Amylase",
      },
      {
        id: "B",
        text: "Lipase",
      },
      {
        id: "C",
        text: "Pepsin",
      },
      {
        id: "D",
        text: "Maltase",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Pepsin is a protease that begins significant protein digestion in the stomach.",

      steps: [
        "The stomach contains gastric glands that secrete gastric juice.",
        "Gastric juice contains hydrochloric acid and digestive enzymes.",
        "Pepsin breaks proteins into smaller peptide molecules.",
        "The acidic environment of the stomach supports pepsin activity.",
        "Therefore, the correct answer is Pepsin.",
      ],
    },
  },

  {
    id: "biology-nutrition-015",

    question:
      "Which of the following conditions is most likely to result from a prolonged lack of adequate food nutrients?",

    options: [
      {
        id: "A",
        text: "Malnutrition",
      },
      {
        id: "B",
        text: "Photosynthesis",
      },
      {
        id: "C",
        text: "Transpiration",
      },
      {
        id: "D",
        text: "Pollination",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Malnutrition occurs when the body does not receive the appropriate amount or balance of nutrients.",

      steps: [
        "The body requires carbohydrates, proteins, fats, vitamins, minerals, water and other nutrients.",
        "A prolonged inadequate or unbalanced diet can cause nutritional problems.",
        "Such conditions are broadly described as malnutrition.",
        "The effects depend on which nutrients are deficient or excessive.",
        "Therefore, the correct answer is Malnutrition.",
      ],
    },
  },
];

export default nutritionQuestions;
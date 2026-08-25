


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — HEALTH AND DISEASE                                                */
/* -------------------------------------------------------------------------- */

export const healthAndDiseaseQuestions: ArenaQuestion[] = [
  {
    id: "biology-health-disease-001",

    question:
      "Which of the following is an example of a communicable disease?",

    options: [
      {
        id: "A",
        text: "Hypertension",
      },
      {
        id: "B",
        text: "Diabetes mellitus",
      },
      {
        id: "C",
        text: "Malaria",
      },
      {
        id: "D",
        text: "Sickle-cell anaemia",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A communicable disease is a disease that can be transmitted from an infected person, animal or source to another person.",

      steps: [
        "Communicable diseases are caused by infectious agents such as parasites, bacteria, viruses or fungi.",
        "Malaria is caused by Plasmodium parasites.",
        "Malaria can be transmitted from an infected person through the bite of an infected female Anopheles mosquito.",
        "Hypertension, diabetes and sickle-cell anaemia are not communicable diseases.",
        "Therefore, the correct answer is Malaria.",
      ],
    },
  },

  {
    id: "biology-health-disease-002",

    question:
      "Which organism is responsible for causing malaria?",

    options: [
      {
        id: "A",
        text: "Trypanosoma",
      },
      {
        id: "B",
        text: "Plasmodium",
      },
      {
        id: "C",
        text: "Salmonella",
      },
      {
        id: "D",
        text: "Ascaris",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Malaria is caused by organisms belonging to the genus Plasmodium.",

      steps: [
        "Plasmodium is a parasitic protozoan.",
        "It causes malaria in humans.",
        "The parasite is transmitted mainly through the bite of an infected female Anopheles mosquito.",
        "Trypanosoma causes sleeping sickness.",
        "Ascaris is a parasitic worm, while Salmonella is a bacterium associated with certain infections.",
        "Therefore, the correct answer is Plasmodium.",
      ],
    },
  },

  {
    id: "biology-health-disease-003",

    question:
      "Which of the following is the main vector responsible for transmitting malaria in humans?",

    options: [
      {
        id: "A",
        text: "Male Anopheles mosquito",
      },
      {
        id: "B",
        text: "Female Anopheles mosquito",
      },
      {
        id: "C",
        text: "Housefly",
      },
      {
        id: "D",
        text: "Tsetse fly",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The female Anopheles mosquito is the major vector responsible for transmitting malaria parasites to humans.",

      steps: [
        "A vector is an organism that carries and transmits a disease-causing organism.",
        "The female Anopheles mosquito transmits Plasmodium parasites.",
        "Female mosquitoes require blood meals for egg development.",
        "The male mosquito does not transmit malaria to humans in this way.",
        "Therefore, the correct answer is Female Anopheles mosquito.",
      ],
    },
  },

  {
    id: "biology-health-disease-004",

    question:
      "Which of the following measures is most effective in reducing the transmission of malaria?",

    options: [
      {
        id: "A",
        text: "Sleeping under insecticide-treated mosquito nets",
      },
      {
        id: "B",
        text: "Eating more carbohydrates",
      },
      {
        id: "C",
        text: "Avoiding exercise",
      },
      {
        id: "D",
        text: "Drinking cold water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Reducing contact between humans and infected mosquitoes is an important method of preventing malaria transmission.",

      steps: [
        "Malaria is transmitted through the bite of infected female Anopheles mosquitoes.",
        "Insecticide-treated mosquito nets reduce mosquito bites during sleep.",
        "Other mosquito-control measures include eliminating breeding sites and using appropriate mosquito-control methods.",
        "The other options do not prevent malaria transmission.",
        "Therefore, the correct answer is Sleeping under insecticide-treated mosquito nets.",
      ],
    },
  },

  {
    id: "biology-health-disease-005",

    question:
      "Which of the following is a non-communicable disease?",

    options: [
      {
        id: "A",
        text: "Cholera",
      },
      {
        id: "B",
        text: "Tuberculosis",
      },
      {
        id: "C",
        text: "Hypertension",
      },
      {
        id: "D",
        text: "Measles",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Non-communicable diseases are generally not transmitted directly from one person to another.",

      steps: [
        "Hypertension is a condition in which blood pressure remains abnormally high.",
        "It is classified as a non-communicable disease.",
        "Cholera, tuberculosis and measles are communicable diseases.",
        "Therefore, the correct answer is Hypertension.",
      ],
    },
  },

  {
    id: "biology-health-disease-006",

    question:
      "Which of the following microorganisms causes tuberculosis?",

    options: [
      {
        id: "A",
        text: "Mycobacterium tuberculosis",
      },
      {
        id: "B",
        text: "Plasmodium falciparum",
      },
      {
        id: "C",
        text: "Trypanosoma",
      },
      {
        id: "D",
        text: "Entamoeba histolytica",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Tuberculosis is an infectious disease caused mainly by the bacterium Mycobacterium tuberculosis.",

      steps: [
        "Mycobacterium tuberculosis is a bacterium.",
        "It is the principal causative organism of tuberculosis.",
        "Plasmodium causes malaria.",
        "Trypanosoma causes African sleeping sickness.",
        "Entamoeba histolytica causes amoebic dysentery.",
        "Therefore, the correct answer is Mycobacterium tuberculosis.",
      ],
    },
  },

  {
    id: "biology-health-disease-007",

    question:
      "Which of the following diseases is commonly associated with contaminated water?",

    options: [
      {
        id: "A",
        text: "Cholera",
      },
      {
        id: "B",
        text: "Hypertension",
      },
      {
        id: "C",
        text: "Sickle-cell anaemia",
      },
      {
        id: "D",
        text: "Asthma",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Cholera is a water- and food-borne disease that can spread when drinking water or food is contaminated with Vibrio cholerae.",

      steps: [
        "Cholera is caused by the bacterium Vibrio cholerae.",
        "The disease can spread through contaminated food or water.",
        "Poor sanitation increases the risk of transmission.",
        "Safe drinking water and proper sanitation help prevent cholera.",
        "Therefore, the correct answer is Cholera.",
      ],
    },
  },

  {
    id: "biology-health-disease-008",

    question:
      "Which of the following is an important method of preventing the spread of cholera?",

    options: [
      {
        id: "A",
        text: "Drinking untreated water",
      },
      {
        id: "B",
        text: "Proper sanitation and safe drinking water",
      },
      {
        id: "C",
        text: "Sharing personal towels",
      },
      {
        id: "D",
        text: "Leaving refuse around the house",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Improved sanitation and access to safe drinking water are important measures for preventing cholera.",

      steps: [
        "Cholera can spread through contaminated food and water.",
        "Safe drinking water reduces exposure to the causative bacterium.",
        "Proper disposal of human waste reduces contamination of water sources.",
        "Good personal and food hygiene also helps reduce transmission.",
        "Therefore, the correct answer is Proper sanitation and safe drinking water.",
      ],
    },
  },

  {
    id: "biology-health-disease-009",

    question:
      "Which of the following diseases is caused by a virus?",

    options: [
      {
        id: "A",
        text: "Measles",
      },
      {
        id: "B",
        text: "Malaria",
      },
      {
        id: "C",
        text: "Tuberculosis",
      },
      {
        id: "D",
        text: "Cholera",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Measles is a highly contagious viral disease.",

      steps: [
        "Measles is caused by the measles virus.",
        "Malaria is caused by Plasmodium parasites.",
        "Tuberculosis is caused mainly by Mycobacterium tuberculosis.",
        "Cholera is caused by Vibrio cholerae bacteria.",
        "Therefore, the correct answer is Measles.",
      ],
    },
  },

  {
    id: "biology-health-disease-010",

    question:
      "Which of the following is an example of a disease that can be inherited?",

    options: [
      {
        id: "A",
        text: "Malaria",
      },
      {
        id: "B",
        text: "Cholera",
      },
      {
        id: "C",
        text: "Sickle-cell anaemia",
      },
      {
        id: "D",
        text: "Measles",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Some diseases or disorders can be inherited because they are associated with genetic characteristics passed from parents to offspring.",

      steps: [
        "Sickle-cell anaemia is a genetic disorder involving haemoglobin.",
        "The genes responsible can be inherited from parents.",
        "Malaria, cholera and measles are infectious diseases and are not inherited in this manner.",
        "Therefore, the correct answer is Sickle-cell anaemia.",
      ],
    },
  },
];

export default healthAndDiseaseQuestions;
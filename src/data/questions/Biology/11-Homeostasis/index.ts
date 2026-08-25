



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — HOMEOSTASIS                                                      */
/* -------------------------------------------------------------------------- */

export const homeostasisQuestions: ArenaQuestion[] = [
  {
    id: "biology-homeostasis-001",

    question:
      "Which of the following best describes homeostasis?",

    options: [
      {
        id: "A",
        text: "The growth of an organism",
      },
      {
        id: "B",
        text: "The maintenance of a relatively constant internal environment",
      },
      {
        id: "C",
        text: "The reproduction of an organism",
      },
      {
        id: "D",
        text: "The movement of substances into and out of cells",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Homeostasis is the maintenance of a relatively stable internal environment despite changes in the external environment.",

      steps: [
        "The internal conditions of an organism must remain within suitable limits.",
        "Examples include body temperature, blood glucose concentration and water balance.",
        "The body uses regulatory mechanisms to detect and correct changes.",
        "Therefore, homeostasis is the maintenance of a relatively constant internal environment.",
      ],
    },
  },

  {
    id: "biology-homeostasis-002",

    question:
      "Which organ plays the major role in regulating the water content of the blood?",

    options: [
      {
        id: "A",
        text: "Heart",
      },
      {
        id: "B",
        text: "Kidney",
      },
      {
        id: "C",
        text: "Lung",
      },
      {
        id: "D",
        text: "Stomach",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The kidneys regulate the amount of water and dissolved substances in the blood by controlling the composition of urine.",

      steps: [
        "Blood is filtered in the kidneys.",
        "Useful substances and appropriate amounts of water are reabsorbed.",
        "Excess water and dissolved waste can be removed in urine.",
        "Therefore, the kidney is the major organ involved in regulating blood water content.",
      ],
    },
  },

  {
    id: "biology-homeostasis-003",

    question:
      "Which hormone helps to regulate the concentration of glucose in the blood?",

    options: [
      {
        id: "A",
        text: "Insulin",
      },
      {
        id: "B",
        text: "Adrenaline",
      },
      {
        id: "C",
        text: "Thyroxine",
      },
      {
        id: "D",
        text: "Oestrogen",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Insulin is an important hormone involved in controlling blood glucose concentration.",

      steps: [
        "Blood glucose concentration rises after the digestion and absorption of carbohydrates.",
        "The pancreas releases insulin when blood glucose concentration becomes high.",
        "Insulin promotes the uptake of glucose by body cells.",
        "It also promotes the conversion of excess glucose to glycogen for storage.",
        "Therefore, insulin helps reduce an elevated blood glucose concentration.",
      ],
    },
  },

  {
    id: "biology-homeostasis-004",

    question:
      "What happens when the concentration of glucose in the blood rises above normal?",

    options: [
      {
        id: "A",
        text: "The pancreas releases insulin",
      },
      {
        id: "B",
        text: "The pancreas stops producing all hormones",
      },
      {
        id: "C",
        text: "The kidneys stop filtering the blood",
      },
      {
        id: "D",
        text: "The liver releases more glucose into the blood",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "An increase in blood glucose concentration stimulates the pancreas to release insulin.",

      steps: [
        "Blood glucose concentration is monitored by the body.",
        "When the concentration rises above the normal range, the pancreas responds.",
        "Insulin is released into the bloodstream.",
        "Insulin encourages cells to take up glucose and promotes storage of glucose as glycogen.",
        "This helps return blood glucose concentration toward normal.",
      ],
    },
  },

  {
    id: "biology-homeostasis-005",

    question:
      "Which part of the brain is mainly involved in the regulation of body temperature?",

    options: [
      {
        id: "A",
        text: "Cerebellum",
      },
      {
        id: "B",
        text: "Medulla oblongata",
      },
      {
        id: "C",
        text: "Hypothalamus",
      },
      {
        id: "D",
        text: "Cerebrum",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The hypothalamus plays a major role in monitoring and regulating body temperature.",

      steps: [
        "The hypothalamus receives information about the temperature of the body.",
        "It compares the detected temperature with the normal range.",
        "When body temperature changes, appropriate responses are initiated.",
        "These responses may include sweating, shivering and changes in blood flow near the skin.",
        "Therefore, the hypothalamus is the correct answer.",
      ],
    },
  },

  {
    id: "biology-homeostasis-006",

    question:
      "What is the main function of sweating when body temperature becomes too high?",

    options: [
      {
        id: "A",
        text: "To increase body temperature",
      },
      {
        id: "B",
        text: "To cool the body through evaporation",
      },
      {
        id: "C",
        text: "To increase blood glucose concentration",
      },
      {
        id: "D",
        text: "To prevent respiration",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Sweating helps cool the body because the evaporation of sweat from the skin removes heat.",

      steps: [
        "When body temperature rises, sweat glands produce sweat.",
        "Sweat spreads over the surface of the skin.",
        "Heat energy is used when water in the sweat evaporates.",
        "This removes heat from the body surface.",
        "Therefore, sweating helps cool the body through evaporation.",
      ],
    },
  },

  {
    id: "biology-homeostasis-007",

    question:
      "Which response helps the human body conserve heat when the external temperature is very low?",

    options: [
      {
        id: "A",
        text: "Increased sweating",
      },
      {
        id: "B",
        text: "Vasodilation of skin blood vessels",
      },
      {
        id: "C",
        text: "Vasoconstriction of skin blood vessels",
      },
      {
        id: "D",
        text: "Increased evaporation from the skin",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Vasoconstriction reduces blood flow near the skin surface and therefore reduces heat loss.",

      steps: [
        "When the body becomes too cold, it needs to reduce heat loss.",
        "Blood vessels near the skin become narrower.",
        "This process is called vasoconstriction.",
        "Less warm blood reaches the surface of the skin.",
        "Therefore, less heat is lost to the environment.",
      ],
    },
  },

  {
    id: "biology-homeostasis-008",

    question:
      "Which hormone increases the reabsorption of water by the kidneys?",

    options: [
      {
        id: "A",
        text: "Insulin",
      },
      {
        id: "B",
        text: "Antidiuretic hormone",
      },
      {
        id: "C",
        text: "Adrenaline",
      },
      {
        id: "D",
        text: "Glucagon",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Antidiuretic hormone, commonly called ADH, helps regulate the body's water balance by increasing water reabsorption by the kidneys.",

      steps: [
        "The body monitors the concentration of water in the blood.",
        "When the body needs to conserve more water, ADH release increases.",
        "ADH causes the kidneys to reabsorb more water.",
        "Less water is therefore lost in urine.",
        "Therefore, antidiuretic hormone is the correct answer.",
      ],
    },
  },

  {
    id: "biology-homeostasis-009",

    question:
      "What is likely to happen when a person becomes dehydrated?",

    options: [
      {
        id: "A",
        text: "The kidneys produce a large volume of dilute urine",
      },
      {
        id: "B",
        text: "The kidneys conserve more water",
      },
      {
        id: "C",
        text: "Sweating always increases greatly",
      },
      {
        id: "D",
        text: "The concentration of water in the blood increases greatly",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "During dehydration, the body conserves water by increasing water reabsorption in the kidneys.",

      steps: [
        "Dehydration means that the body has lost more water than it has taken in.",
        "The concentration of dissolved substances in the blood increases.",
        "The body responds by increasing water conservation.",
        "More water is reabsorbed by the kidneys.",
        "The volume of urine becomes smaller and more concentrated.",
        "Therefore, the kidneys conserve more water.",
      ],
    },
  },

  {
    id: "biology-homeostasis-010",

    question:
      "Which of the following is an example of negative feedback in homeostasis?",

    options: [
      {
        id: "A",
        text: "An increase in body temperature causing more heat to be produced",
      },
      {
        id: "B",
        text: "A rise in blood glucose causing insulin release that lowers blood glucose",
      },
      {
        id: "C",
        text: "A decrease in water causing increased water loss",
      },
      {
        id: "D",
        text: "An increase in temperature causing increased sweating that raises temperature",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Negative feedback occurs when a change triggers a response that opposes the original change.",

      steps: [
        "Blood glucose concentration rises above the normal range.",
        "The pancreas releases insulin.",
        "Insulin promotes glucose uptake and storage.",
        "Blood glucose concentration decreases toward the normal range.",
        "The response therefore opposes the initial increase.",
        "This is an example of negative feedback.",
      ],
    },
  },
];

export default homeostasisQuestions;
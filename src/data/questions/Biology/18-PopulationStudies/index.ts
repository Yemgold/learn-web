


import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — POPULATION STUDIES                                               */
/* -------------------------------------------------------------------------- */

export const populationStudiesQuestions: ArenaQuestion[] = [
  {
    id: "biology-population-001",

    question:
      "Which of the following is defined as the number of individuals of a species living in a given area at a particular time?",

    options: [
      {
        id: "A",
        text: "Population density",
      },
      {
        id: "B",
        text: "Population growth",
      },
      {
        id: "C",
        text: "Community",
      },
      {
        id: "D",
        text: "Ecosystem",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Population density refers to the number of individuals of a particular species occupying a given area at a particular time.",

      steps: [
        "A population consists of individuals of the same species living in a particular area.",
        "Population density measures the number of individuals relative to the area occupied.",
        "It can change when individuals are born, die, enter or leave the population.",
        "Therefore, the correct answer is Population density.",
      ],
    },
  },

  {
    id: "biology-population-002",

    question:
      "Which of the following factors is most likely to increase the size of a population?",

    options: [
      {
        id: "A",
        text: "High death rate",
      },
      {
        id: "B",
        text: "High birth rate",
      },
      {
        id: "C",
        text: "Emigration",
      },
      {
        id: "D",
        text: "Increased predation",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A high birth rate adds new individuals to a population and therefore tends to increase its size.",

      steps: [
        "Birth introduces new individuals into a population.",
        "A high birth rate therefore increases the number of individuals.",
        "Death and emigration remove individuals from a population.",
        "Increased predation can also reduce population size.",
        "Therefore, the correct answer is High birth rate.",
      ],
    },
  },

  {
    id: "biology-population-003",

    question:
      "Which of the following processes involves the movement of individuals into a population from another area?",

    options: [
      {
        id: "A",
        text: "Emigration",
      },
      {
        id: "B",
        text: "Immigration",
      },
      {
        id: "C",
        text: "Mortality",
      },
      {
        id: "D",
        text: "Natality",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Immigration is the movement of individuals into a population from another area.",

      steps: [
        "Immigration means individuals enter a population.",
        "These individuals increase the population size.",
        "Emigration refers to individuals leaving a population.",
        "Mortality refers to death, while natality refers to birth.",
        "Therefore, the correct answer is Immigration.",
      ],
    },
  },

  {
    id: "biology-population-004",

    question:
      "Which of the following processes decreases the size of a population when individuals leave the area?",

    options: [
      {
        id: "A",
        text: "Immigration",
      },
      {
        id: "B",
        text: "Natality",
      },
      {
        id: "C",
        text: "Emigration",
      },
      {
        id: "D",
        text: "Reproduction",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Emigration occurs when individuals leave a population and move to another area.",

      steps: [
        "Individuals leaving a population are described as emigrants.",
        "The movement out of a population is called emigration.",
        "This reduces the number of individuals in the original population.",
        "Immigration has the opposite effect because individuals enter a population.",
        "Therefore, the correct answer is Emigration.",
      ],
    },
  },

  {
    id: "biology-population-005",

    question:
      "Which of the following is a density-dependent factor that can regulate population size?",

    options: [
      {
        id: "A",
        text: "Competition for food",
      },
      {
        id: "B",
        text: "Flood",
      },
      {
        id: "C",
        text: "Earthquake",
      },
      {
        id: "D",
        text: "Volcanic eruption",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Competition for limited resources becomes more intense as population density increases.",

      steps: [
        "Individuals in a population may compete for food, water, space and mates.",
        "Competition generally becomes stronger when population density is high.",
        "This can reduce survival and reproduction.",
        "Floods, earthquakes and volcanic eruptions are generally density-independent factors.",
        "Therefore, the correct answer is Competition for food.",
      ],
    },
  },

  {
    id: "biology-population-006",

    question:
      "Which of the following is an example of a density-independent factor affecting population size?",

    options: [
      {
        id: "A",
        text: "Competition",
      },
      {
        id: "B",
        text: "Disease transmission",
      },
      {
        id: "C",
        text: "Predation",
      },
      {
        id: "D",
        text: "Flooding",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Flooding can affect a population regardless of whether the population density is high or low.",

      steps: [
        "Density-independent factors affect populations without depending strongly on population density.",
        "Flooding is an environmental disturbance that can affect organisms across an area.",
        "Competition, predation and many forms of disease transmission are influenced by population density.",
        "Therefore, the correct answer is Flooding.",
      ],
    },
  },

  {
    id: "biology-population-007",

    question:
      "The maximum population size that an environment can support indefinitely is known as the",

    options: [
      {
        id: "A",
        text: "Population density",
      },
      {
        id: "B",
        text: "Carrying capacity",
      },
      {
        id: "C",
        text: "Birth rate",
      },
      {
        id: "D",
        text: "Growth rate",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Carrying capacity is the maximum population size that the available resources and environmental conditions can sustainably support.",

      steps: [
        "Every environment has limited resources.",
        "Resources such as food, water, space and shelter limit population growth.",
        "The largest population that can be maintained under those conditions is called the carrying capacity.",
        "Therefore, the correct answer is Carrying capacity.",
      ],
    },
  },

  {
    id: "biology-population-008",

    question:
      "A population with abundant resources and few environmental limitations is most likely to show",

    options: [
      {
        id: "A",
        text: "Rapid population growth",
      },
      {
        id: "B",
        text: "Immediate extinction",
      },
      {
        id: "C",
        text: "Zero reproduction",
      },
      {
        id: "D",
        text: "Permanent population decline",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "When resources are abundant and limiting factors are weak, organisms can survive and reproduce successfully, resulting in rapid population growth.",

      steps: [
        "Food and other resources are necessary for survival and reproduction.",
        "Abundant resources reduce competition.",
        "Reduced environmental limitations allow more individuals to survive and reproduce.",
        "The population can therefore increase rapidly.",
        "Therefore, the correct answer is Rapid population growth.",
      ],
    },
  },

  {
    id: "biology-population-009",

    question:
      "Which method is commonly used to estimate the population of small, mobile animals?",

    options: [
      {
        id: "A",
        text: "Quadrat sampling only",
      },
      {
        id: "B",
        text: "Capture-mark-recapture",
      },
      {
        id: "C",
        text: "Leaf counting",
      },
      {
        id: "D",
        text: "Soil testing",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Capture-mark-recapture is commonly used to estimate the size of populations of mobile animals.",

      steps: [
        "A sample of animals is captured.",
        "The animals are marked harmlessly and released.",
        "After sufficient time, another sample is captured.",
        "The proportion of marked animals in the second sample can be used to estimate population size.",
        "Therefore, the correct answer is Capture-mark-recapture.",
      ],
    },
  },

  {
    id: "biology-population-010",

    question:
      "Which sampling method is particularly suitable for estimating the abundance of plants in a grassland?",

    options: [
      {
        id: "A",
        text: "Capture-mark-recapture",
      },
      {
        id: "B",
        text: "Quadrat sampling",
      },
      {
        id: "C",
        text: "Blood sampling",
      },
      {
        id: "D",
        text: "Migration tracking",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Quadrat sampling is useful for studying plants and other organisms that remain in one place.",

      steps: [
        "Plants are generally stationary organisms.",
        "A quadrat provides a defined area in which organisms can be counted.",
        "Several quadrats can be placed randomly or systematically within the study area.",
        "The results can be used to estimate abundance or distribution.",
        "Therefore, the correct answer is Quadrat sampling.",
      ],
    },
  },
];

export default populationStudiesQuestions;
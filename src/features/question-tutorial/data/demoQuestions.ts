


import { TutorialQuestion } from "../types/question-tutorial";

export const demoQuestions: TutorialQuestion[] = [
  {
    id: "physics-mechanics-001",

    subject: "Physics",

    topic: "Mechanics",

    questionNumber: 1,

    question:
      "A body of mass 5 kg moves with a velocity of 20 m/s. What is its kinetic energy?",

    options: [
      {
        id: "a",
        label: "A",
        text: "500 J",
      },
      {
        id: "b",
        label: "B",
        text: "1,000 J",
      },
      {
        id: "c",
        label: "C",
        text: "2,000 J",
      },
      {
        id: "d",
        label: "D",
        text: "4,000 J",
      },
    ],

    correctAnswer: "b",

    explanation:
      "The kinetic energy of a body is calculated using its mass and velocity. Substituting a mass of 5 kg and velocity of 20 m/s gives 1,000 J. Therefore, option B is correct.",

    formula: "KE = ½mv²",

    difficulty: "medium",
  },

  {
    id: "physics-mechanics-002",

    subject: "Physics",

    topic: "Mechanics",

    questionNumber: 2,

    question:
      "Which of the following is the SI unit of force?",

    options: [
      {
        id: "a",
        label: "A",
        text: "Joule",
      },
      {
        id: "b",
        label: "B",
        text: "Newton",
      },
      {
        id: "c",
        label: "C",
        text: "Watt",
      },
      {
        id: "d",
        label: "D",
        text: "Pascal",
      },
    ],

    correctAnswer: "b",

    explanation:
      "The SI unit of force is the newton. Force is defined as mass multiplied by acceleration, and the resulting SI unit is kg·m/s², which is called the newton.",

    difficulty: "easy",
  },
];
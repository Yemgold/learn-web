



export type TutorialOption = {
  id: string;
  label: string;
  text: string;
};

export type TutorialQuestion = {
  id: string;

  subject: string;

  topic: string;

  questionNumber: number;

  question: string;

  options: TutorialOption[];

  correctAnswer: string;

  explanation: string;

  formula?: string;

  difficulty?: "easy" | "medium" | "hard";
};
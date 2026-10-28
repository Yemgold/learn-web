





export type Difficulty = "easy" | "medium" | "hard";

export type ExamType = "jamb" | "waec" | "neco";

export interface ContentSegment {
  text: string;
  styles: string[];
}

export interface QuestionContent {
  type: "text";
  order: number;
  segments: ContentSegment[];

  latex?: string;

  table?: string[][];

  graph?: {
    type: string;
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
}

export interface QuestionOption {
  label: string;
  value: string;
}

export interface QuestionBankItem {
  content: QuestionContent[];

  question: string;

  instruction: string;

  topic: string;

  section: string;

  options: QuestionOption[];

  correctAnswers: string[];

  explanation: string;

  explanationSteps: string[];

  difficulty: Difficulty;

  examType: ExamType;

  apiSubjectName: string;

  isMultipleAnswer: boolean;
}

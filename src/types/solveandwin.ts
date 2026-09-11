//...................................................
 //   Contest Subject
//......................................................


export type ContestSubjectPayload = {
  subjectId: string;
  expectedNoOfQuestions: number;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  durationInMinutes: number;
};

export type CreateContestPayload = {
  title: string;
  description: string;
  category: string;
  status: "DRAFT" | "UPCOMING";
  amountToBeWonInKobo: number;
  entryPoints: number;
  startDate: string;
  windowPeriod: number;
  subjects: ContestSubjectPayload[];
};

export type CreateContestResponse = {
  success: boolean;
  message: string;
  data?: {
    _id?: string;
    id?: string;
    title?: string;
    description?: string;
    category?: string;
    status?: string;
    amountToBeWonInKobo?: number;
    entryPoints?: number;
    startDate?: string;
    windowPeriod?: number;
    subjects?: ContestSubjectPayload[];
    [key: string]: unknown;
  };
};




//...................................................
 //   ALL Participant 
//......................................................

export type ContestParticipationOption = {
  label: string;
  value: string;
  _id: string;
};

export type ContestParticipationContentSegment = {
  text: string;
  styles: unknown[];
};

export type ContestParticipationContent = {
  type: string;
  order: number;
  segments: ContestParticipationContentSegment[];
  image: unknown;
  table: unknown[];
  graph: unknown;
  items: unknown[];
};

export type ContestParticipationQuestion = {
  questionId: string;
  question: string;
  instruction: string;

  content: ContestParticipationContent[];

  media: unknown;

  options: ContestParticipationOption[];

  section: string;
  questionType: string;

  correctAnswers: string[];

  isMultipleAnswer: boolean;

  explanation: string;
  explanationSteps: unknown[];

  difficulty: string;
  marks: number;

  selectedOption: string | null;
  isCorrect: boolean | null;
  marksAwarded: number;
};

export type ContestParticipationSubject = {
  subjectId: string;

  questions: ContestParticipationQuestion[];

  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;

  score: number;

  durationInSeconds: number;
  remainingDurationInSeconds: number;

  startedAt: string | null;
  endsAt: string | null;
  submittedAt: string | null;
};

export type ContestParticipation = {
  _id: string;

  userId: string;
  contestId: string;

  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;

  score: number;
  percentage: number;
  pointsSpent: number;

  durationInSeconds: number;

  status: string;

  subjects: ContestParticipationSubject[];

  createdAt: string;
  updatedAt: string;

  __v: number;
};

export type GetAllContestParticipationsData = {
  totalCount: number;
  totalPages: number;

  contestParticipationObj: ContestParticipation[];
};

export type GetAllContestParticipationsResponse = {
  success: boolean;
  message: string;

  data: GetAllContestParticipationsData;
};


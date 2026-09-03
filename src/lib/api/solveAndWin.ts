// /* ============================================================
//    CREATE CONTEST
// ============================================================ */

// export type CreateContestPayload = {
//   title: string;
//   description: string;
//   category: string;
//   status: "DRAFT" | "UPCOMING";
//   amountToBeWonInKobo: number;
//   entryPoints: number;
//   startDate: string;
//   endDate: string;
//   subjectIds: string[];
// };

// export type CreateContestResponse = {
//   success: boolean;
//   message: string;
//   data?: {
//     _id?: string;
//     id?: string;
//     title?: string;
//     description?: string;
//     category?: string;
//     status?: string;
//     amountToBeWonInKobo?: number;
//     entryPoints?: number;
//     subjectIds?: string[];
//     [key: string]: unknown;
//   };
// };


// export async function createContest(
//   payload: CreateContestPayload,
// ): Promise<CreateContestResponse> {
//   const response =
//     await api.post<CreateContestResponse>(
//       "/solve-and-win/contests/create-contest",
//       payload,
//     );

//   return response.data;
// }






import { api } from "./axios";



export type CreateContestPayload = {
  title: string;
  description: string;
  category: string;
  status: "DRAFT" | "UPCOMING";
  amountToBeWonInKobo: number;
  entryPoints: number;
  startDate: string;
  endDate: string;
  subjectIds: string[];
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
    endDate?: string;
    subjectIds?: string[];
    [key: string]: unknown;
  };
};



/* ============================================================
   TYPES
============================================================ */

export interface ContestSubject {
  subjectId:
    | string
    | {
        _id: string;
        name: string;
      };

  questions: unknown[];
}

export interface SolveAndWinContest {
  _id: string;
  title: string;
  description: string;
  category: string;

  amountToBeWonInKobo: number;

  entryPoints: number;

  subjects: ContestSubject[];

  status: string;

  isActive: boolean;

  startDate: string;

  endDate: string;

  createdAt: string;

  updatedAt: string;

  __v?: number;
}

export interface GetAllContestsResponse {
  success: boolean;
  message: string;

  data: {
    totalCount: number;
    totalPages: number;
    solveAndWinContestObj: SolveAndWinContest[];
  };
}



/* ============================================================
   CREATE CONTEST
============================================================ */

export async function createContest(
  payload: CreateContestPayload,
): Promise<CreateContestResponse> {
  const response =
    await api.post<CreateContestResponse>(
      "/solve-and-win/contests/create-contest",
      payload,
    );

  return response.data;
}



/* ============================================================
   GET ALL CONTESTS
   ============================================================ */

export async function getAllSolveAndWinContests(): Promise<GetAllContestsResponse> {
  const response = await api.get<GetAllContestsResponse>(
    "/solve-and-win/contests/get-all-contests",
  );

  return response.data;
}


export async function getAllActiveContests() {
  const response = await api.get("/solve-and-win/contests/get-all-active-contests");
  return response.data;
}

export interface GetContestWithSubjectsResponse {
  success: boolean;
  message: string;
  data: SolveAndWinContest;
}

export async function getContestWithSubjectsById(
  contestId: string,
): Promise<GetContestWithSubjectsResponse> {
  const response = await api.get(
    `/solve-and-win/contests/get-contest-with-subjects-by-id/${contestId}`,
  );

  return response.data;
}


export async function cancelContestById(contestId: string) {
  const response = await api.delete(
    `/solve-and-win/contests/cancel-contest-by-id/${contestId}`,
  );

  return response.data;
}


export interface AddQuestionsToSubjectInContestPayload {
  questions: Array<{
    content: Record<string, unknown>[];
    question: string;
    instruction: string;
    topic: string;
    section: string;
    options: Array<{
      label: string;
      value: string;
    }>;
    correctAnswers: string[];
    answer: string;
    solution: string;
    explanation: string;
    explanationSteps: string[];
    difficulty: string;
    category: string;
    examType: string;
    examYear: string;
    apiSubjectName: string;
    isMultipleAnswer: boolean;
    marks: number;
  }>;
  totalNumberOfExpectedQuestions: number;
}

export async function addQuestionsToSubjectInContest(
  competitionId: string,
  subjectId: string,
  payload: AddQuestionsToSubjectInContestPayload,
) {
  const response = await api.patch(
    `/solve-and-win/contests/add-questions-to-subject-in-contest/${encodeURIComponent(
      competitionId,
    )}/${encodeURIComponent(subjectId)}`,
    payload,
  );

  return response.data;
}


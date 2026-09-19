
// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\api\solveAndWin.ts

import { api } from "./axios";

import type { GetAllContestParticipationsResponse,CreateContestPayload,CreateContestResponse
 } from "@/types/solveandwin"; 




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

  expectedNoOfQuestions: number;
  durationInSeconds: number;

  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };

  questions?: unknown[];
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
  MY JOINED CONTESTS
============================================================ */

export interface MyJoinedContest {
  contestId: string;
  [key: string]: unknown;
}

export interface MyJoinedContestsData {
  totalCount: number;
  totalPages: number;
  contestParticipationObj: MyJoinedContest[];
}

export interface MyJoinedContestsResponse {
  success: boolean;
  message?: string;
  data: MyJoinedContestsData;
}

export const getMyJoinedContests = async (
  userId: string
): Promise<MyJoinedContestsResponse> => {
  const response = await api.get<MyJoinedContestsResponse>(
    `/solve-and-win/contests/my-joined-contest/${userId}`,
    {
      params: {
        _t: Date.now(),
      },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );

  return response.data;
};

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


export async function getAllNotCompletedContests(): Promise<GetAllContestsResponse> {
  try {
    const response = await api.get<GetAllContestsResponse>(
      "/solve-and-win/contests/get-all-not-completed-contests",
    );

    return response.data;
  } catch (error: any) {
    if (
      error?.response?.status === 404 &&
      error?.response?.data?.message === "No upcoming contests found."
    ) {
      return {
        success: true,
        message: "No upcoming contests found.",
        data: {
          totalCount: 0,
          totalPages: 0,
          solveAndWinContestObj: [],
        },
      };
    }

    // Keep all other errors as real errors.
    throw error;
  }
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

export async function deactivateContest(contestId: string) {
  const { data } = await api.patch(
    `/solve-and-win/contests/deactivate-contest-by-contestId/${contestId}`
  );

  return data;
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
  subjectId: string,
  payload: AddQuestionsToSubjectInContestPayload,
) {
  const response = await api.patch(
    `/solve-and-win/contests/add-solve-and-win-contest-questions-to-database/${encodeURIComponent(
      subjectId,
    )}`,
    payload,
  );

  return response.data;
}





/* ============================================================
   GET CONTEST BY ID
============================================================ */

export interface GetContestByIdResponse {
  success: boolean;
  message: string;
  data: SolveAndWinContest;
}

export async function getContestById(
  contestId: string,
): Promise<GetContestByIdResponse> {
  const response = await api.get<GetContestByIdResponse>(
    `/solve-and-win/contests/get-contest-by-id/${contestId}`,
  );

  return response.data;
}


/* ============================================================
   UPDATE CONTEST BY ID
============================================================ */

export type UpdateContestPayload = Partial<CreateContestPayload>;

export interface UpdateContestResponse {
  success: boolean;
  message: string;
  data?: SolveAndWinContest;
}

export async function updateContestById(
  contestId: string,
  payload: UpdateContestPayload,
): Promise<UpdateContestResponse> {
  const response = await api.patch<UpdateContestResponse>(
    `/solve-and-win/contests/update-contest-by-id/${contestId}`,
    payload,
  );

  return response.data;
}





/* ============================================================
   UPDATE CONTEST QUESTION REMAINING TIME
============================================================ */

export interface UpdateContestQuestionRemainingTimePayload {
  remainingTime: number;
}

export interface UpdateContestQuestionRemainingTimeResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export async function updateSolveAndWinContestQuestionRemainingTime(
  contestId: string,
  subjectId: string,
  payload: UpdateContestQuestionRemainingTimePayload,
): Promise<UpdateContestQuestionRemainingTimeResponse> {
  const response =
    await api.patch<UpdateContestQuestionRemainingTimeResponse>(
      `/solve-and-win/contests/update-solve-and-win-contest-question-remaining-time/${encodeURIComponent(
        contestId,
      )}/${encodeURIComponent(subjectId)}`,
      payload,
    );

  return response.data;
}





/* ============================================================
   ENDPOINTS FOR PLAY SOLVE AND WIN PAGE
   UPDATE ANSWERS / FINAL SUBMIT
   ============================================================ */


export async function updateSolveAndWinContestQuestionAnswers(
  contestId: string,
  subjectId: string,
  payload: SolveAndWinAnswerPayload,
) {
  if (
    !payload ||
    !Array.isArray(payload.answers) ||
    payload.answers.length === 0
  ) {
    return null;
  }

  const response = await api.patch(
    `/solve-and-win/contests/update-solve-and-win-contest-question-answers/${encodeURIComponent(
      contestId,
    )}/${encodeURIComponent(subjectId)}`,
    payload,
  );

  return response.data;
}







export const startSolveAndWinContest = async (
  contestId: string,
  subjectId: string
) => {
  const response = await api.get(
    `/solve-and-win/contests/start-solve-and-win-contest/${contestId}/${subjectId}`
  );

  return response.data;
};







export type SolveAndWinAnswerPayload = {
  answers: Array<{
    questionId: string;
    selectedOption: string;
  }>;
};

export async function submitSolveAndWinContest(
  contestId: string,
  subjectId: string,
  payload: SolveAndWinAnswerPayload,
) {
  if (
    !payload ||
    !Array.isArray(payload.answers) ||
    payload.answers.length === 0
  ) {
    throw new Error(
      "Cannot submit contest: at least one answer is required.",
    );
  }

  const response = await api.patch(
    `/solve-and-win/contests/submit-solve-and-win-contest-question/${encodeURIComponent(
      contestId,
    )}/${encodeURIComponent(subjectId)}`,
    payload,
  );

  return response.data;
}



export async function getAllContestParticipations(
  page = 1,
  limit = 10
): Promise<GetAllContestParticipationsResponse> {
  const response = await api.get<GetAllContestParticipationsResponse>(
    "/solve-and-win/contests/get-all-contest-participations",
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
}


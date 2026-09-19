





// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\api\quizCompetition.ts

import { axiosInstance } from "@/lib/api/axios";

import type {
  CreateQuizCompetitionPayload,
  CreateQuizCompetitionResponse,
} from "@/types/quizCompetition";

/**
 * ============================================================
 * QUIZ COMPETITION API
 * ============================================================
 */

/**
 * Create a new quiz competition.
 *
 * POST /quiz
 */
export async function createQuizCompetition(
  payload: CreateQuizCompetitionPayload,
) {
  const response =
    await axiosInstance.post<CreateQuizCompetitionResponse>(
      "/quiz",
      payload,
    );

  return response.data;
}


// 
// 
// 

export const getAllQuizzes = async (
  page = 1,
  limit = 10
) => {
  const response = await axiosInstance.get("/quiz/get-all-quizzes", {

    
    params: {
      page,
      limit,
    },
  });

  return response.data;
};


export const getAllWaitingQuizzesUserHasNotJoined = async (
  userId: string,
  page = 1,
  limit = 10
) => {
  const response = await axiosInstance.get(
    `/quiz/get-all-waiting-quizzes-user-has-not-joined/${userId}`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
};




export interface JoinQuizResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Join a Quiz Board competition by quiz ID
 */
export const joinQuizById = async (
  quizId: string
): Promise<JoinQuizResponse> => {
  const response = await axiosInstance.post(
    `/quiz/join-quiz-by-id/${quizId}`
  );

  return response.data;
};



export const getQuizById = async (quizId: string) => {
  const response = await axiosInstance.get(
    `/quiz/get-quiz-by-quizId/${quizId}`,
  );

  return response.data;
};


/* -------------------------------------------------------------------------- */
/* GET MY QUIZZES                                                             */
/* -------------------------------------------------------------------------- */

export const getAllMyQuizzes = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  try {
    const response = await axiosInstance.get(
      `/quiz/get-all-my-quizzes/${userId}`,
    );

    return response.data;
  } catch (error: any) {
    // A 404 here means the user has not joined
    // any Quiz Board competitions yet.
    if (
      error?.response?.status === 404 &&
      error?.response?.data?.message ===
        "Quiz participations not found."
    ) {
      return {
        success: true,
        message: "No quiz participations found.",
        data: {
          totalCount: 0,
          totalPages: 0,
          quizParticipationObj: [],
        },
      };
    }

    // Preserve all other errors.
    throw error;
  }
};
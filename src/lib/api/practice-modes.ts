import { axiosInstance } from "@/lib/api/axios";

/* ==========================================================================
   PRACTICE MODE TYPES
   ========================================================================== */

export interface PracticeMode {
  _id: string;
  name: string;
  description: string;
  timePerQuestion: number;
  awardedPointPerCorrectAnswer: number;
  isActive: boolean;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GetAllPracticeModesResponse {
  success: boolean;
  message: string;
  data: PracticeMode[];
}

/* ==========================================================================
   GET ALL PRACTICE MODES
   ========================================================================== */

/**
 * GET
 * /api/v1/practice-modes/get-all-practice-modes
 *
 * Returns all practice modes configured by the backend.
 */
export async function getAllPracticeModes(): Promise<
  GetAllPracticeModesResponse
> {
  const response =
    await axiosInstance.get<GetAllPracticeModesResponse>(
      "/practice-modes/get-all-practice-modes",
    );

  return response.data;
}



// import { axiosInstance } from "./axios";

// export interface PracticeMode {
//   _id: string;
//   name: string;
//   description: string;
//   timePerQuestion: number;
//   awardedPointPerCorrectAnswer: number;
//   isActive: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface GetPracticeModesResponse {
//   success: boolean;
//   message: string;
//   data: PracticeMode[];
// }

// export async function getAllPracticeModes(): Promise<PracticeMode[]> {
//   const response =
//     await axiosInstance.get<GetPracticeModesResponse>(
//       "/practice-modes/get-all-practice-modes",
//     );

//   return response.data?.data ?? [];
// }
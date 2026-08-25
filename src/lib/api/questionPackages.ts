



// src/lib/api/questionPackages.ts

import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   TYPES
   ============================================================ */

export interface QuestionPackageSubject {
  id: string;
  name: string;
  version: number;
}

export interface QuestionPackageTopic {
  id: string;
  name: string;
}

export interface QuestionPackageOption {
  id: string;
  text: string;
}

export type QuestionDifficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

export interface QuestionPackageQuestion {
  id: string;

  topicId: string;

  question: string;

  options: QuestionPackageOption[];

  explanation: string;

  difficulty: QuestionDifficulty;
}

export interface QuestionPackageData {
  subject: QuestionPackageSubject;

  topics: QuestionPackageTopic[];

  questions: QuestionPackageQuestion[];

  version: number;
}

export interface QuestionPackageResponse {
  success: boolean;

  message?: string;

  data: QuestionPackageData;
}

/* ============================================================
   GET QUESTION PACKAGE
   ============================================================ */

export async function getQuestionPackage(
  subjectId: string,
): Promise<QuestionPackageResponse> {
  const response =
    await axiosInstance.get<QuestionPackageResponse>(
      `/question-packages/${subjectId}`,
    );

  return response.data;
}


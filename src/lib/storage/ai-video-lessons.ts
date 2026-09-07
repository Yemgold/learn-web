






// src/lib/storage/ai-video-lessons.ts

/* =========================================================
   AI VIDEO LESSON STORAGE
   ---------------------------------------------------------
   Temporary frontend storage for AI-generated video lessons.

   CURRENT:
   Admin → localStorage → Student

   FUTURE:
   Admin → API → Database → Student
   ========================================================= */

export const AI_VIDEO_LESSONS_STORAGE_KEY =
  "jamb-league-ai-video-lessons";

/* =========================================================
   TYPES
   ========================================================= */

export type LessonStatus =
  | "DRAFT"
  | "PROCESSING"
  | "READY"
  | "PUBLISHED";

export type Difficulty =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED";

export type AccessType =
  | "FREE"
  | "PREMIUM"
  | "PLAN_REQUIRED";

export type TeachingStyle =
  | "friendly"
  | "exam"
  | "energetic"
  | "step-by-step";

export type VisualStyle =
  | "modern"
  | "whiteboard"
  | "science"
  | "exam";

export type LessonScene = {
  id: string;
  number: number;
  title: string;
  narration: string;
  durationSeconds: number;
  visualInstruction: string;
};

export type LearningObjective = {
  id: string;
  text: string;
};

export type ExplanationStep = {
  id: string;
  number: number;
  title: string;
  explanation: string;
};

export type KeyPoint = {
  id: string;
  text: string;
};

export type VoiceConfig = {
  id: string;
  name: string;
  provider: string;
  providerVoiceId?: string;
  language: string;
  speakingRate?: number;
  pitch?: number;
};

export type AiVideoTeacher = {
  avatarId: string;
  name: string;
  avatarUrl: string;
};

export type AiVideoLesson = {
  id: string;

  title: string;

  subject: string;

  topic: string;

  description: string;

  difficulty: Difficulty;

  accessType: AccessType;

  status: LessonStatus;

  durationMinutes: number;

  teacher: AiVideoTeacher;

  voice: VoiceConfig;

  teachingStyle: TeachingStyle;

  visualStyle: VisualStyle;

  objectives: LearningObjective[];

  steps: ExplanationStep[];

  keyPoints: KeyPoint[];

  summary: string;

  jambTips: string;

  keywords: string;

  generatedScript: string;

  scenes: LessonScene[];

  videoUrl: string | null;

  thumbnailUrl: string | null;

  createdAt: string;

  updatedAt: string;

  publishedAt?: string | null;
};

/* =========================================================
   BROWSER CHECK
   ========================================================= */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/* =========================================================
   READ ALL LESSONS
   ========================================================= */

export function getAiVideoLessons(): AiVideoLesson[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(
      AI_VIDEO_LESSONS_STORAGE_KEY,
    );

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as AiVideoLesson[];
  } catch (error) {
    console.error(
      "Failed to read AI video lessons from localStorage:",
      error,
    );

    return [];
  }
}

/* =========================================================
   GET ONE LESSON BY ID
   ========================================================= */

export function getAiVideoLesson(
  lessonId: string,
): AiVideoLesson | null {
  if (!lessonId) {
    return null;
  }

  const lessons = getAiVideoLessons();

  return (
    lessons.find(
      (lesson) => lesson.id === lessonId,
    ) ?? null
  );
}

/* =========================================================
   SAVE / CREATE LESSON
   ========================================================= */

export function saveAiVideoLesson(
  lesson: AiVideoLesson,
): AiVideoLesson | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const lessons = getAiVideoLessons();

    const now = new Date().toISOString();

    const normalizedLesson: AiVideoLesson = {
      ...lesson,
      createdAt:
        lesson.createdAt || now,
      updatedAt: now,
    };

    const existingIndex = lessons.findIndex(
      (item) => item.id === lesson.id,
    );

    if (existingIndex >= 0) {
      lessons[existingIndex] = normalizedLesson;
    } else {
      lessons.unshift(normalizedLesson);
    }

    window.localStorage.setItem(
      AI_VIDEO_LESSONS_STORAGE_KEY,
      JSON.stringify(lessons),
    );

    return normalizedLesson;
  } catch (error) {
    console.error(
      "Failed to save AI video lesson:",
      error,
    );

    return null;
  }
}

/* =========================================================
   UPDATE LESSON
   ========================================================= */

export function updateAiVideoLesson(
  lessonId: string,
  updates: Partial<AiVideoLesson>,
): AiVideoLesson | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const lessons = getAiVideoLessons();

    const index = lessons.findIndex(
      (lesson) => lesson.id === lessonId,
    );

    if (index === -1) {
      return null;
    }

    const updatedLesson: AiVideoLesson = {
      ...lessons[index],
      ...updates,
      id: lessons[index].id,
      updatedAt: new Date().toISOString(),
    };

    lessons[index] = updatedLesson;

    window.localStorage.setItem(
      AI_VIDEO_LESSONS_STORAGE_KEY,
      JSON.stringify(lessons),
    );

    return updatedLesson;
  } catch (error) {
    console.error(
      "Failed to update AI video lesson:",
      error,
    );

    return null;
  }
}

/* =========================================================
   PUBLISH LESSON
   ========================================================= */

export function publishAiVideoLesson(
  lessonId: string,
): AiVideoLesson | null {
  return updateAiVideoLesson(
    lessonId,
    {
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
    },
  );
}

/* =========================================================
   UNPUBLISH LESSON
   ========================================================= */

export function unpublishAiVideoLesson(
  lessonId: string,
): AiVideoLesson | null {
  return updateAiVideoLesson(
    lessonId,
    {
      status: "READY",
      publishedAt: null,
    },
  );
}

/* =========================================================
   DELETE LESSON
   ========================================================= */

export function deleteAiVideoLesson(
  lessonId: string,
): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    const lessons = getAiVideoLessons();

    const filteredLessons = lessons.filter(
      (lesson) => lesson.id !== lessonId,
    );

    if (filteredLessons.length === lessons.length) {
      return false;
    }

    window.localStorage.setItem(
      AI_VIDEO_LESSONS_STORAGE_KEY,
      JSON.stringify(filteredLessons),
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to delete AI video lesson:",
      error,
    );

    return false;
  }
}

/* =========================================================
   GET PUBLISHED LESSONS
   ========================================================= */

export function getPublishedAiVideoLessons(): AiVideoLesson[] {
  return getAiVideoLessons().filter(
    (lesson) =>
      lesson.status === "PUBLISHED",
  );
}

/* =========================================================
   GET DRAFT LESSONS
   ========================================================= */

export function getDraftAiVideoLessons(): AiVideoLesson[] {
  return getAiVideoLessons().filter(
    (lesson) =>
      lesson.status === "DRAFT",
  );
}

/* =========================================================
   GET LESSONS BY SUBJECT
   ========================================================= */

export function getAiVideoLessonsBySubject(
  subject: string,
): AiVideoLesson[] {
  const normalizedSubject =
    subject.trim().toLowerCase();

  return getAiVideoLessons().filter(
    (lesson) =>
      lesson.subject.trim().toLowerCase() ===
      normalizedSubject,
  );
}

/* =========================================================
   CLEAR ALL LESSONS
   ---------------------------------------------------------
   Useful during development/testing only.
   ========================================================= */

export function clearAiVideoLessons(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(
      AI_VIDEO_LESSONS_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Failed to clear AI video lessons:",
      error,
    );
  }
}

/* =========================================================
   STORAGE EVENT HELPER
   ---------------------------------------------------------
   Allows pages/components to react when another browser
   tab changes the lesson storage.
   ========================================================= */

export function subscribeToAiVideoLessons(
  callback: () => void,
): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const handleStorage = (
    event: StorageEvent,
  ) => {
    if (
      event.key ===
      AI_VIDEO_LESSONS_STORAGE_KEY
    ) {
      callback();
    }
  };

  window.addEventListener(
    "storage",
    handleStorage,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorage,
    );
  };
}
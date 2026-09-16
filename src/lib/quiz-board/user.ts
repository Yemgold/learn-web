




// src/lib/quiz-board/user.ts

export interface QuizBoardUser {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  email?: string;

  [key: string]: unknown;
}

/**
 * Safely parse a localStorage value.
 */
function parseStorageValue(value: string | null): unknown {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/**
 * Extract a user object from different possible authentication shapes.
 */
function extractUserObject(value: unknown): QuizBoardUser | null {
  if (!value) return null;

  if (typeof value === "object" && value !== null) {
    const object = value as Record<string, unknown>;

    // Direct user object
    if (
      typeof object._id === "string" ||
      typeof object.id === "string" ||
      typeof object.userId === "string"
    ) {
      return object as QuizBoardUser;
    }

    // Nested user object
    if (object.user && typeof object.user === "object") {
      const nestedUser = object.user as Record<string, unknown>;

      if (
        typeof nestedUser._id === "string" ||
        typeof nestedUser.id === "string" ||
        typeof nestedUser.userId === "string"
      ) {
        return nestedUser as QuizBoardUser;
      }
    }

    // Nested data object
    if (object.data && typeof object.data === "object") {
      const nestedData = object.data as Record<string, unknown>;

      if (
        typeof nestedData._id === "string" ||
        typeof nestedData.id === "string" ||
        typeof nestedData.userId === "string"
      ) {
        return nestedData as QuizBoardUser;
      }

      if (
        nestedData.user &&
        typeof nestedData.user === "object"
      ) {
        const nestedUser = nestedData.user as Record<string, unknown>;

        if (
          typeof nestedUser._id === "string" ||
          typeof nestedUser.id === "string" ||
          typeof nestedUser.userId === "string"
        ) {
          return nestedUser as QuizBoardUser;
        }
      }
    }
  }

  return null;
}

/**
 * Get the currently authenticated user from localStorage.
 *
 * The application has used several possible auth storage keys,
 * so they are checked in order.
 */
export function getCurrentQuizBoardUser(): QuizBoardUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKeys = [
    "user",
    "auth-user",
    "jamb_user",
    "jamb_auth_user",
  ];

  for (const key of storageKeys) {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) continue;

    const parsedValue = parseStorageValue(storedValue);
    const user = extractUserObject(parsedValue);

    if (user) {
      return user;
    }
  }

  return null;
}

/**
 * Get only the authenticated user's ID.
 *
 * Returns null when no valid user ID can be found.
 */
export function getCurrentQuizBoardUserId(): string | null {
  const user = getCurrentQuizBoardUser();

  if (!user) {
    return null;
  }

  if (typeof user._id === "string" && user._id.trim()) {
    return user._id.trim();
  }

  if (typeof user.id === "string" && user.id.trim()) {
    return user.id.trim();
  }

  if (typeof user.userId === "string" && user.userId.trim()) {
    return user.userId.trim();
  }

  return null;
}

/**
 * Check whether a user is currently authenticated.
 */
export function hasQuizBoardUser(): boolean {
  return Boolean(getCurrentQuizBoardUserId());
}
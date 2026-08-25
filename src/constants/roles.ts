





// src/constants/roles.ts

export const ROLES = {
  ADMIN: "ADMIN",

  ORGANIZER: "ORGANIZER",

  STUDENT: "STUDENT",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
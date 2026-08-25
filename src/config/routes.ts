






// src/config/routes.ts

export const APP_ROUTES = {
  HOME: "/",

  ABOUT: "/about",

  CONTACT: "/contact",

  FAQ: "/faq",

  LOGIN: "/login",

  REGISTER: "/register",

  FORGOT_PASSWORD: "/forgot-password",

  RESET_PASSWORD: "/reset-password",

  VERIFY_EMAIL: "/verify-email",

  DASHBOARD: "/dashboard",

  PROFILE: "/profile",

  SETTINGS: "/settings",

  TEAM: "/team",

  COMPETITIONS: "/competitions",

  EXAMS: "/exams",

  RESULTS: "/results",

  RANKINGS: "/rankings",

  NOTIFICATIONS: "/notifications",

  ADMIN: "/admin",

  ORGANIZER: "/organizer",

  STUDENT: "/student",

  PAYMENT: "/payment",

  NOT_FOUND: "/404",
} as const;

export type AppRoute =
  (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
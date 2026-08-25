






// src/config/app.ts

import { env } from "./env";

export const appConfig = {
  name: env.APP_NAME,

  description:
    "JAMB League is a nationwide competitive learning platform for secondary school students preparing for UTME.",

  version: "1.0.0",

  author: "JAMB League",

  supportEmail: "support@jambleague.com",

  website: env.APP_URL,

  apiBaseUrl: env.API_URL,

  defaultLocale: "en",

  defaultTimezone: "Africa/Lagos",

  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },

  competition: {
    minimumTeamMembers: 3,
    maximumTeamMembers: 3,
  },
} as const;
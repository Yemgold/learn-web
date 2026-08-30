






// import { create } from "zustand";

// import type { User } from "@/types";

// import {
//   setAccessToken,
//   getAccessToken,
//   setRefreshToken,
//   getRefreshToken,
//   clearTokens,
// } from "@/lib/auth/token";

// /* ============================================================
//    STORAGE KEYS
//    ============================================================ */

// const USER_KEY = "jamb_auth_user";

// /* ============================================================
//    AUTH STATE
//    ============================================================ */

// interface AuthState {
//   user: User | null;

//   accessToken: string | null;

//   refreshToken: string | null;

//   isAuthenticated: boolean;

//   isHydrated: boolean;

//   login: (params: {
//     user: User;
//     accessToken: string;
//     refreshToken: string;
//   }) => void;

//   updateUser: (user: User) => void;

//   updateAccessToken: (
//     token: string | null,
//   ) => void;

//   updateRefreshToken: (
//     token: string | null,
//   ) => void;

//   hydrate: () => void;

//   logout: () => void;

//   clear: () => void;
// }

// /* ============================================================
//    USER STORAGE HELPERS
//    ============================================================ */

// function setStoredUser(
//   user: User | null,
// ): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   if (user) {
//     localStorage.setItem(
//       USER_KEY,
//       JSON.stringify(user),
//     );
//   } else {
//     localStorage.removeItem(USER_KEY);
//   }
// }

// function getStoredUser(): User | null {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   try {
//     const storedUser =
//       localStorage.getItem(USER_KEY);

//     if (!storedUser) {
//       return null;
//     }

//     return JSON.parse(storedUser) as User;
//   } catch (error) {
//     console.error(
//       "Failed to restore stored user:",
//       error,
//     );

//     localStorage.removeItem(USER_KEY);

//     return null;
//   }
// }

// function clearStoredUser(): void {
//   if (typeof window === "undefined") {
//     return;
//   }

//   localStorage.removeItem(USER_KEY);
// }

// /* ============================================================
//    AUTH STORE
//    ============================================================ */

// export const useAuthStore =
//   create<AuthState>((set) => ({
//     /* ========================================================
//        INITIAL STATE
//        ======================================================== */

//     user: null,

//     accessToken: null,

//     refreshToken: null,

//     isAuthenticated: false,

//     isHydrated: false,

//     /* ========================================================
//        LOGIN
//        ======================================================== */

//     login: ({
//       user,
//       accessToken,
//       refreshToken,
//     }) => {
//       /*
//        * Persist access token.
//        */
//       setAccessToken(accessToken);

//       /*
//        * Persist refresh token.
//        */
//       setRefreshToken(refreshToken);

//       /*
//        * Persist user so a browser refresh does not
//        * immediately lose the authenticated user.
//        */
//       setStoredUser(user);

//       /*
//        * Update Zustand.
//        */
//       set({
//         user,

//         accessToken,

//         refreshToken,

//         isAuthenticated: true,

//         isHydrated: true,
//       });
//     },

//     /* ========================================================
//        UPDATE USER
//        ======================================================== */

//     updateUser: (user) => {
//       setStoredUser(user);

//       set({
//         user,
//       });
//     },

//     /* ========================================================
//        UPDATE ACCESS TOKEN
//        ======================================================== */

//     updateAccessToken: (token) => {
//       setAccessToken(token);

//       set({
//         accessToken: token,

//         isAuthenticated: Boolean(token),
//       });
//     },

//     /* ========================================================
//        UPDATE REFRESH TOKEN
//        ======================================================== */

//     updateRefreshToken: (token) => {
//       setRefreshToken(token);

//       set({
//         refreshToken: token,
//       });
//     },

//     /* ========================================================
//        HYDRATE
//        ======================================================== */

//     hydrate: () => {
//       console.log(
//         "========== AUTH HYDRATE ==========",
//       );

//       /*
//        * Recover persisted tokens.
//        */
//       const storedAccessToken =
//         getAccessToken();

//       const storedRefreshToken =
//         getRefreshToken();

//       /*
//        * Recover persisted user.
//        */
//       const storedUser =
//         getStoredUser();

//       console.log(
//         "Has access token:",
//         Boolean(storedAccessToken),
//       );

//       console.log(
//         "Has refresh token:",
//         Boolean(storedRefreshToken),
//       );

//       console.log(
//         "Has stored user:",
//         Boolean(storedUser),
//       );

//       /*
//        * Access token + user available.
//        */
//       if (
//         storedAccessToken &&
//         storedUser
//       ) {
//         set({
//           user: storedUser,

//           accessToken:
//             storedAccessToken,

//           refreshToken:
//             storedRefreshToken,

//           isAuthenticated: true,

//           isHydrated: true,
//         });

//         console.log(
//           "✅ AUTH RESTORED",
//         );

//         console.log(
//           "=================================",
//         );

//         return;
//       }

//       /*
//        * Access token exists but user does not.
//        *
//        * Keep the token available. We will later use
//        * the current-user endpoint to restore the user.
//        */
//       if (storedAccessToken) {
//         set({
//           user: null,

//           accessToken:
//             storedAccessToken,

//           refreshToken:
//             storedRefreshToken,

//           isAuthenticated: true,

//           isHydrated: true,
//         });

//         console.log(
//           "⚠️ TOKEN RESTORED WITHOUT USER",
//         );

//         console.log(
//           "=================================",
//         );

//         return;
//       }

//       /*
//        * Refresh token exists but access token does not.
//        *
//        * The refresh-token flow should obtain a new
//        * access token.
//        */
//       if (storedRefreshToken) {
//         set({
//           user: storedUser,

//           accessToken: null,

//           refreshToken:
//             storedRefreshToken,

//           isAuthenticated: false,

//           isHydrated: true,
//         });

//         console.log(
//           "⚠️ REFRESH TOKEN AVAILABLE",
//         );

//         console.log(
//           "=================================",
//         );

//         return;
//       }

//       /*
//        * Nothing available.
//        */
//       set({
//         user: null,

//         accessToken: null,

//         refreshToken: null,

//         isAuthenticated: false,

//         isHydrated: true,
//       });

//       console.log(
//         "❌ NO AUTH SESSION FOUND",
//       );

//       console.log(
//         "=================================",
//       );
//     },

//     /* ========================================================
//        LOGOUT
//        ======================================================== */

//     logout: () => {
//       clearTokens();

//       clearStoredUser();

//       set({
//         user: null,

//         accessToken: null,

//         refreshToken: null,

//         isAuthenticated: false,

//         isHydrated: true,
//       });
//     },

//     /* ========================================================
//        CLEAR
//        ======================================================== */

//     clear: () => {
//       clearTokens();

//       clearStoredUser();

//       set({
//         user: null,

//         accessToken: null,

//         refreshToken: null,

//         isAuthenticated: false,

//         isHydrated: true,
//       });
//     },
//   }));














import { create } from "zustand";

import type { User } from "@/types";

import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from "@/lib/auth/token";

/* ============================================================
   STORAGE
   ============================================================ */

const USER_KEY = "jamb_auth_user";

/* ============================================================
   TYPES
   ============================================================ */

interface LoginParams {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;

  accessToken: string | null;

  refreshToken: string | null;

  isAuthenticated: boolean;

  isHydrated: boolean;

  login: (params: LoginParams) => void;

  updateUser: (user: User) => void;

  updateAccessToken: (
    token: string | null,
  ) => void;

  updateRefreshToken: (
    token: string | null,
  ) => void;

  hydrate: () => void;

  logout: () => void;

  clear: () => void;
}

/* ============================================================
   USER STORAGE
   ============================================================ */

function setStoredUser(
  user: User | null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (user) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user),
      );
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error(
      "Failed to store auth user:",
      error,
    );
  }
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser =
      localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as User;
  } catch (error) {
    console.error(
      "Failed to restore stored user:",
      error,
    );

    localStorage.removeItem(USER_KEY);

    return null;
  }
}

function clearStoredUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(USER_KEY);
}

/* ============================================================
   AUTH STORE
   ============================================================ */

export const useAuthStore =
  create<AuthState>((set) => ({
    /* ========================================================
       INITIAL STATE
       ======================================================== */

    user: null,

    accessToken: null,

    refreshToken: null,

    isAuthenticated: false,

    isHydrated: false,

    /* ========================================================
       LOGIN
       ======================================================== */

    login: ({
      user,
      accessToken,
      refreshToken,
    }) => {
      console.log(
        "========== AUTH STORE LOGIN ==========",
      );

      console.log({
        hasUser: Boolean(user),

        hasAccessToken:
          Boolean(accessToken),

        hasRefreshToken:
          Boolean(refreshToken),
      });

      /*
       * Persist access token.
       */
      setAccessToken(accessToken);

      /*
       * Persist refresh token.
       *
       * THIS IS CRITICAL.
       *
       * The refresh token must survive a browser
       * refresh so AuthProvider can request a new
       * access token.
       */
      setRefreshToken(refreshToken);

      /*
       * Persist user.
       */
      setStoredUser(user);

      /*
       * Update Zustand.
       */
      set({
        user,

        accessToken,

        refreshToken,

        isAuthenticated: true,

        isHydrated: true,
      });

      console.log(
        "✅ AUTH STORE LOGIN COMPLETE",
      );

      console.log({
        accessTokenStored:
          Boolean(getAccessToken()),

        refreshTokenStored:
          Boolean(getRefreshToken()),

        userStored:
          Boolean(getStoredUser()),
      });

      console.log(
        "========================================",
      );
    },

    /* ========================================================
       UPDATE USER
       ======================================================== */

    updateUser: (user) => {
      setStoredUser(user);

      set({
        user,
      });
    },

    /* ========================================================
       UPDATE ACCESS TOKEN
       ======================================================== */

    updateAccessToken: (token) => {
      console.log(
        "========== UPDATE ACCESS TOKEN ==========",
      );

      console.log(
        "Has new access token:",
        Boolean(token),
      );

      /*
       * Persist token in token.ts.
       */
      setAccessToken(token);

      /*
       * IMPORTANT:
       *
       * Do NOT delete the refresh token here.
       *
       * Updating the access token must not affect
       * the refresh token.
       */
      set((state) => ({
        accessToken: token,

        /*
         * If we already have a user or refresh token,
         * the session remains authenticated.
         */
        isAuthenticated:
          Boolean(token) ||
          Boolean(state.refreshToken) ||
          Boolean(state.user),
      }));

      console.log(
        "Access token persisted:",
        Boolean(getAccessToken()),
      );

      console.log(
        "Refresh token still available:",
        Boolean(getRefreshToken()),
      );

      console.log(
        "===========================================",
      );
    },

    /* ========================================================
       UPDATE REFRESH TOKEN
       ======================================================== */

    updateRefreshToken: (token) => {
      console.log(
        "========== UPDATE REFRESH TOKEN ==========",
      );

      console.log(
        "Has refresh token:",
        Boolean(token),
      );

      setRefreshToken(token);

      set({
        refreshToken: token,
      });

      console.log(
        "Refresh token persisted:",
        Boolean(getRefreshToken()),
      );

      console.log(
        "==========================================",
      );
    },

    /* ========================================================
       HYDRATE
       ======================================================== */

    hydrate: () => {
      console.log(
        "========== AUTH HYDRATE ==========",
      );

      /*
       * Recover persisted values.
       */
      const storedAccessToken =
        getAccessToken();

      const storedRefreshToken =
        getRefreshToken();

      const storedUser =
        getStoredUser();

      console.log({
        hasAccessToken:
          Boolean(storedAccessToken),

        hasRefreshToken:
          Boolean(storedRefreshToken),

        hasStoredUser:
          Boolean(storedUser),
      });

      /* ======================================================
         CASE 1
         ACCESS TOKEN + REFRESH TOKEN + USER
         ====================================================== */

      if (
        storedAccessToken &&
        storedRefreshToken &&
        storedUser
      ) {
        set({
          user: storedUser,

          accessToken:
            storedAccessToken,

          refreshToken:
            storedRefreshToken,

          isAuthenticated: true,

          isHydrated: true,
        });

        console.log(
          "✅ COMPLETE AUTH SESSION RESTORED",
        );

        console.log(
          "=================================",
        );

        return;
      }

      /* ======================================================
         CASE 2
         ACCESS TOKEN + REFRESH TOKEN
         BUT USER MISSING
         ====================================================== */

      if (
        storedAccessToken &&
        storedRefreshToken
      ) {
        set({
          user: storedUser,

          accessToken:
            storedAccessToken,

          refreshToken:
            storedRefreshToken,

          isAuthenticated: true,

          isHydrated: true,
        });

        console.log(
          "⚠️ TOKENS RESTORED WITHOUT USER",
        );

        console.log(
          "=================================",
        );

        return;
      }

      /* ======================================================
         CASE 3
         REFRESH TOKEN + USER
         BUT ACCESS TOKEN MISSING
         ====================================================== */

      if (
        storedRefreshToken
      ) {
        /*
         * THIS IS THE IMPORTANT CASE.
         *
         * A browser refresh can happen after the access
         * token has expired or after it was not persisted.
         *
         * We DO NOT log the user out here.
         *
         * AuthProvider will use the refresh token to
         * obtain a new access token.
         */
        set({
          user: storedUser,

          accessToken: null,

          refreshToken:
            storedRefreshToken,

          /*
           * Keep the session alive while the refresh
           * operation is happening.
           */
          isAuthenticated: Boolean(
            storedUser,
          ),

          isHydrated: true,
        });

        console.log(
          "🔄 REFRESH TOKEN AVAILABLE — SESSION WILL BE RESTORED",
        );

        console.log(
          "=================================",
        );

        return;
      }

      /* ======================================================
         CASE 4
         ACCESS TOKEN + USER BUT NO REFRESH TOKEN
         ====================================================== */

      if (
        storedAccessToken &&
        storedUser
      ) {
        /*
         * Keep the existing access-token session.
         *
         * This situation is not ideal because there is
         * no refresh token, but we should not immediately
         * destroy the access token.
         */
        set({
          user: storedUser,

          accessToken:
            storedAccessToken,

          refreshToken: null,

          isAuthenticated: true,

          isHydrated: true,
        });

        console.log(
          "⚠️ ACCESS TOKEN RESTORED WITHOUT REFRESH TOKEN",
        );

        console.log(
          "=================================",
        );

        return;
      }

      /* ======================================================
         CASE 5
         NOTHING AVAILABLE
         ====================================================== */

      set({
        user: null,

        accessToken: null,

        refreshToken: null,

        isAuthenticated: false,

        isHydrated: true,
      });

      console.log(
        "❌ NO AUTH SESSION FOUND",
      );

      console.log(
        "=================================",
      );
    },

    /* ========================================================
       LOGOUT
       ======================================================== */

    logout: () => {
      console.log(
        "========== AUTH LOGOUT ==========",
      );

      clearTokens();

      clearStoredUser();

      set({
        user: null,

        accessToken: null,

        refreshToken: null,

        isAuthenticated: false,

        isHydrated: true,
      });

      console.log(
        "✅ LOCAL AUTH STATE CLEARED",
      );

      console.log(
        "=================================",
      );
    },

    /* ========================================================
       CLEAR
       ======================================================== */

    clear: () => {
      console.log(
        "========== AUTH CLEAR ==========",
      );

      clearTokens();

      clearStoredUser();

      set({
        user: null,

        accessToken: null,

        refreshToken: null,

        isAuthenticated: false,

        isHydrated: true,
      });

      console.log(
        "✅ AUTH STATE CLEARED",
      );

      console.log(
        "================================",
      );
    },
  }));


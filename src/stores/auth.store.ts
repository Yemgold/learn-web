



import { create } from "zustand";

import type { User } from "@/types";

import {
  setAccessToken,
  clearAccessToken,
} from "@/lib/auth/token";

interface AuthState {
  user: User | null;

  accessToken: string | null;

  refreshToken: string | null;

  isAuthenticated: boolean;

  login: (params: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;

  updateUser: (user: User) => void;

  updateAccessToken: (token: string | null) => void;

  updateRefreshToken: (token: string) => void;

  logout: () => void;

  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  accessToken: null,

  refreshToken: null,

  isAuthenticated: false,

  login: ({
    user,
    accessToken,
    refreshToken,
  }) => {
    // Store token for Axios interceptor
    setAccessToken(accessToken);

    // Store auth state in Zustand
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  updateUser: (user) =>
    set({
      user,
    }),

  updateAccessToken: (token) => {
    // Update the in-memory token used by Axios
    setAccessToken(token);

    // Update Zustand
    set({
      accessToken: token,
    });
  },

  updateRefreshToken: (token) =>
    set({
      refreshToken: token,
    }),

  logout: () => {
    clearAccessToken();

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  clear: () => {
    clearAccessToken();

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));











// import { create } from "zustand";

// import type { User } from "@/types";

// import {
//   setAccessToken,
//   clearAccessToken,
// } from "@/lib/auth/token";

// interface AuthState {
//   user: User | null;

//   accessToken: string | null;

//   refreshToken: string | null;

//   isAuthenticated: boolean;

//   login: (params: {
//     user: User;
//     accessToken: string;
//     refreshToken: string;
//   }) => void;

//   updateUser: (user: User) => void;

//   updateAccessToken: (token: string | null) => void;

//   updateRefreshToken: (token: string) => void;

//   logout: () => void;

//   clear: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,

//   accessToken: null,

//   refreshToken: null,

//   isAuthenticated: false,

//   /* ============================================================
//      LOGIN
//      ============================================================ */

//   login: ({
//     user,
//     accessToken,
//     refreshToken,
//   }) => {
//     /*
//      * Keep Zustand state updated
//      */
//     set({
//       user,
//       accessToken,
//       refreshToken,
//       isAuthenticated: true,
//     });

//     /*
//      * Keep Axios token storage synchronized
//      */
//     setAccessToken(accessToken);
//   },

//   /* ============================================================
//      UPDATE USER
//      ============================================================ */

//   updateUser: (user) =>
//     set({
//       user,
//     }),

//   /* ============================================================
//      UPDATE ACCESS TOKEN
//      ============================================================ */

//   updateAccessToken: (token) => {
//     /*
//      * Update Zustand
//      */
//     set({
//       accessToken: token,
//     });

//     /*
//      * Update token storage used by Axios
//      */
//     setAccessToken(token);
//   },

//   /* ============================================================
//      UPDATE REFRESH TOKEN
//      ============================================================ */

//   updateRefreshToken: (token) =>
//     set({
//       refreshToken: token,
//     }),

//   /* ============================================================
//      LOGOUT
//      ============================================================ */

//   logout: () => {
//     /*
//      * Clear Axios token
//      */
//     clearAccessToken();

//     /*
//      * Clear Zustand
//      */
//     set({
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//     });
//   },

//   /* ============================================================
//      CLEAR
//      ============================================================ */

//   clear: () => {
//     /*
//      * Clear Axios token
//      */
//     clearAccessToken();

//     /*
//      * Clear Zustand
//      */
//     set({
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//     });
//   },
// }));
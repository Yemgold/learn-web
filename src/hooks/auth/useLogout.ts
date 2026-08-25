



"use client";

import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "@/lib/api/auth";

import { useAuthStore } from "@/stores/auth.store";

import {
  clearAccessToken,
} from "@/lib/auth/token";

/* ============================================================
   LOGOUT HOOK
   ============================================================ */

export function useLogout() {
  return useMutation({
    /* ==========================================================
       MUTATION
       ========================================================== */

    mutationFn: async () => {
      return logoutUser();
    },

    /* ==========================================================
       SUCCESS
       ========================================================== */

    onSuccess: (response) => {
      console.log(
        "========== LOGOUT MUTATION SUCCESS ==========",
      );

      console.log(response);

      /* ======================================================
         CLEAR ACCESS TOKEN
         ====================================================== */

      clearAccessToken();

      console.log(
        "✅ ACCESS TOKEN CLEARED",
      );

      /* ======================================================
         CLEAR AUTH STORE
         ====================================================== */

      useAuthStore
        .getState()
        .logout();

      console.log(
        "✅ AUTH STORE CLEARED",
      );
    },

    /* ==========================================================
       ERROR
       ========================================================== */

    onError: (error: any) => {
      console.error(
        "========== LOGOUT MUTATION ERROR ==========",
      );

      console.error(
        "Status:",
        error?.response?.status,
      );

      console.error(
        "Backend response:",
        error?.response?.data,
      );

      console.error(
        "Message:",
        error?.message,
      );

      /*
       * IMPORTANT
       *
       * Even if the backend request fails, clear the
       * local authentication state.
       *
       * Otherwise the application can remain locally
       * authenticated with an invalid session/token.
       */

      clearAccessToken();

      useAuthStore
        .getState()
        .logout();

      console.log(
        "✅ LOCAL AUTH STATE CLEARED",
      );
    },
  });
}
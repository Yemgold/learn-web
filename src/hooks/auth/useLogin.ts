





"use client";

import { useMutation } from "@tanstack/react-query";

import {
  loginUser,
  forceSwitch,
  buildLoginRequest,
} from "@/lib/api/auth";

import { useAuthStore } from "@/stores/auth.store";

/* ============================================================
   TYPES
   ============================================================ */

type LoginData = {
  email: string;
  password: string;
};

/* ============================================================
   FRONTEND USER MAPPER
   ============================================================ */

function mapBackendUserToFrontendUser(
  backendUser: any,
  session: any,
) {
  return {
    /*
     * IDs
     */
    id: backendUser._id,
    _id: backendUser._id,

    /*
     * BASIC INFORMATION
     */
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    email: backendUser.email,

    /*
     * ROLE
     */
    role: backendUser.role,

    /*
     * AUTH STATUS
     */
    verified: backendUser.isVerified,
    active: session?.isActive ?? true,

    /*
     * CONTACT
     */
    phoneNumber: backendUser.phoneNumber,

    /*
     * REFERRAL
     */
    referralCode: backendUser.referralCode,
    referredBy: backendUser.referredBy,
    referralChain: backendUser.referralChain,

    /*
     * PAYMENT / PLANS
     */
    isVerified: backendUser.isVerified,
    hasPaid: backendUser.hasPaid,
    plans: backendUser.plans,

    /*
     * WALLET
     */
    userWallet: backendUser.userWallet,

    /*
     * DEVICE
     */
    device: backendUser.device,

    /*
     * DATES
     */
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
  };
}

/* ============================================================
   AUTH SUCCESS HANDLER
   ============================================================ */

function handleAuthSuccess(response: any) {
  console.log(
    "========== AUTH MUTATION SUCCESS ==========",
  );

  console.log(
    "Raw authentication response:",
    response,
  );

  /* ============================================================
     VALIDATE RESPONSE
     ============================================================ */

  const authData = response?.data;

  if (!authData) {
    console.error(
      "❌ Authentication succeeded but response.data is missing.",
    );

    return response;
  }

  const backendUser = authData.user;
  const session = authData.session;
  const accessToken = authData.accessToken;
  const refreshToken = authData.refreshToken;

  /* ============================================================
     VALIDATE USER
     ============================================================ */

  if (!backendUser) {
    console.error(
      "❌ Authentication succeeded but user data is missing.",
    );

    return response;
  }

  /* ============================================================
     VALIDATE ACCESS TOKEN
     ============================================================ */

  if (!accessToken) {
    console.error(
      "❌ Authentication succeeded but access token is missing.",
    );

    return response;
  }

  /* ============================================================
     VALIDATE REFRESH TOKEN
     ============================================================ */

  if (!refreshToken) {
    console.error(
      "❌ Authentication succeeded but refresh token is missing.",
    );

    return response;
  }

  /* ============================================================
     MAP BACKEND USER
     ============================================================ */

  const user = mapBackendUserToFrontendUser(
    backendUser,
    session,
  );

  console.log(
    "========== MAPPED FRONTEND USER ==========",
  );

  console.log(user);

  /* ============================================================
     UPDATE ZUSTAND AUTH STATE
     ============================================================ */

  /*
   * IMPORTANT:
   *
   * useAuthStore.login() is responsible for:
   *
   * 1. Saving access token
   * 2. Saving refresh token
   * 3. Saving user
   * 4. Updating Zustand
   * 5. Setting isAuthenticated = true
   * 6. Setting isHydrated = true
   *
   * Do NOT call setAccessToken() separately here.
   */

  useAuthStore.getState().login({
    user,
    accessToken,
    refreshToken,
  });

  /* ============================================================
     VERIFY AUTH STATE
     ============================================================ */

  const currentAuth =
    useAuthStore.getState();

  console.log(
    "========== AUTH STORE UPDATED ==========",
  );

  console.log({
    hasUser: Boolean(currentAuth.user),

    userId:
      currentAuth.user?.id ??
      currentAuth.user?._id ??
      null,

    role:
      currentAuth.user?.role ??
      null,

    isAuthenticated:
      currentAuth.isAuthenticated,

    isHydrated:
      currentAuth.isHydrated,

    hasAccessToken:
      Boolean(currentAuth.accessToken),

    hasRefreshToken:
      Boolean(currentAuth.refreshToken),
  });

  console.log(
    "==========================================",
  );

  /*
   * Return the original response so React Query
   * consumers still receive the normal API response.
   */

  return response;
}

/* ============================================================
   ERROR LOGGER
   ============================================================ */

function logAuthError(
  title: string,
  error: any,
) {
  console.error(
    `========== ${title} ==========`,
  );

  console.error(
    "Raw error:",
    error,
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
    "Request URL:",
    error?.config?.url,
  );

  console.error(
    "Base URL:",
    error?.config?.baseURL,
  );

  console.error(
    "Full URL:",
    `${error?.config?.baseURL ?? ""}${
      error?.config?.url ?? ""
    }`,
  );

  console.error(
    "Method:",
    error?.config?.method?.toUpperCase(),
  );

  console.error(
    "Error code:",
    error?.code,
  );

  console.error(
    "Error message:",
    error?.message,
  );

  console.error(
    "==========================================",
  );
}

/* ============================================================
   LOGIN HOOK
   ============================================================ */

export function useLogin() {
  /* ============================================================
     NORMAL LOGIN
     ============================================================ */

  const loginMutation = useMutation({
    mutationFn: async (
      data: LoginData,
    ) => {
      console.log(
        "========== LOGIN MUTATION START ==========",
      );

      console.log({
        email:
          data.email
            .trim()
            .toLowerCase(),

        hasPassword:
          Boolean(data.password),
      });

      /*
       * Build the complete backend payload.
       *
       * This adds:
       *
       * deviceId
       * deviceName
       */

      const payload =
        buildLoginRequest(
          data.email,
          data.password,
        );

      console.log(
        "Login payload prepared:",
        {
          email: payload.email,
          hasPassword:
            Boolean(payload.password),
          deviceId: payload.deviceId,
          deviceName:
            payload.deviceName,
        },
      );

      /*
       * Call backend login.
       */

      const response =
        await loginUser(payload);

      console.log(
        "========== LOGIN MUTATION API SUCCESS ==========",
      );

      return response;
    },

    /* ========================================================
       SUCCESS
       ======================================================== */

    onSuccess: (
      response,
    ) => {
      handleAuthSuccess(
        response,
      );
    },

    /* ========================================================
       ERROR
       ======================================================== */

    onError: (
      error: any,
    ) => {
      logAuthError(
        "LOGIN MUTATION ERROR",
        error,
      );
    },
  });

  /* ============================================================
     FORCE SWITCH
     ============================================================ */

  const forceSwitchMutation =
    useMutation({
      mutationFn: async (
        data: LoginData,
      ) => {
        console.log(
          "========== FORCE SWITCH MUTATION START ==========",
        );

        console.log({
          email:
            data.email
              .trim()
              .toLowerCase(),

          hasPassword:
            Boolean(data.password),
        });

        /*
         * Build the same device-aware login payload.
         */

        const payload =
          buildLoginRequest(
            data.email,
            data.password,
          );

        console.log(
          "Force switch payload prepared:",
          {
            email: payload.email,

            hasPassword:
              Boolean(
                payload.password,
              ),

            deviceId:
              payload.deviceId,

            deviceName:
              payload.deviceName,
          },
        );

        /*
         * Call backend force-switch.
         */

        const response =
          await forceSwitch(
            payload,
          );

        console.log(
          "========== FORCE SWITCH API SUCCESS ==========",
        );

        return response;
      },

      /* ======================================================
         SUCCESS
         ====================================================== */

      onSuccess: (
        response,
      ) => {
        console.log(
          "========== FORCE SWITCH AUTH SUCCESS ==========",
        );

        /*
         * Use exactly the same authentication
         * state handler as normal login.
         *
         * This guarantees that force-switch also
         * stores:
         *
         * accessToken
         * refreshToken
         * user
         */

        handleAuthSuccess(
          response,
        );
      },

      /* ======================================================
         ERROR
         ====================================================== */

      onError: (
        error: any,
      ) => {
        logAuthError(
          "FORCE SWITCH MUTATION ERROR",
          error,
        );
      },
    });

  /* ============================================================
     RETURN
     ============================================================ */

  return {
    /*
     * Normal login mutation
     *
     * isPending
     * isSuccess
     * isError
     * error
     * mutate
     * mutateAsync
     * etc.
     */

    ...loginMutation,

    /*
     * Force-switch mutation
     */

    forceSwitchMutation,
  };
}

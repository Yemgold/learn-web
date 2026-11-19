


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
  schoolSubdomain?: string;
};

/* ============================================================
   FRONTEND USER MAPPER
   ============================================================ */

function mapBackendUserToFrontendUser(
  backendUser: any,
  session: any,
  schoolContext: any,
) {
  return {
    id: backendUser._id,
    _id: backendUser._id,

    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    email: backendUser.email,

    role: backendUser.role,

    verified: backendUser.isVerified,
    active: session?.isActive ?? true,

    phoneNumber: backendUser.phoneNumber,

    referralCode: backendUser.referralCode,
    referredBy: backendUser.referredBy,
    referralChain: backendUser.referralChain,

    isVerified: backendUser.isVerified,
    hasPaid: backendUser.hasPaid,
    plans: backendUser.plans,

    userWallet: backendUser.userWallet,

    device: backendUser.device,

    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,

    // Preserve the school membership context returned by the backend.
    schoolContext:
      backendUser.schoolContext ??
      schoolContext ??
      undefined,
  };
}

/* ============================================================
   AUTH SUCCESS HANDLER
   ============================================================ */

function handleAuthSuccess(response: any) {
  console.log(
    "========== AUTH MUTATION SUCCESS ==========",
  );

  /*
   * Do not log the complete response here.
   * It contains authentication tokens.
   */

  const authData = response?.data;

  if (!authData) {
    console.error(
      "Authentication succeeded but response.data is missing.",
    );

    return response;
  }

  const backendUser = authData.user;
  const session = authData.session;
  const accessToken = authData.accessToken;
  const refreshToken = authData.refreshToken;

  if (!backendUser) {
    console.error(
      "Authentication succeeded but user data is missing.",
    );

    return response;
  }

  if (!accessToken) {
    console.error(
      "Authentication succeeded but access token is missing.",
    );

    return response;
  }

  if (!refreshToken) {
    console.error(
      "Authentication succeeded but refresh token is missing.",
    );

    return response;
  }

  /*
   * Some authentication responses may place schoolContext
   * inside user, while others may place it alongside user.
   */

  const schoolContext =
    backendUser.schoolContext ??
    authData.schoolContext ??
    undefined;

  const user = mapBackendUserToFrontendUser(
    backendUser,
    session,
    schoolContext,
  );

  console.log(
    "========== MAPPED FRONTEND USER ==========",
  );

  console.log({
    userId: user.id,
    email: user.email,
    role: user.role,

    hasSchoolContext: Boolean(user.schoolContext),

    schoolName:
      user.schoolContext?.schoolName ?? null,

    schoolSubdomain:
      user.schoolContext?.subDomain ?? null,

    schoolMembershipId:
      user.schoolContext?.userSchoolMembership?._id ?? null,

    schoolId:
      user.schoolContext?.userSchoolMembership?.schoolId ?? null,
  });

  useAuthStore.getState().login({
    user,
    accessToken,
    refreshToken,
  });

  const currentAuth = useAuthStore.getState();

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
      currentAuth.user?.role ?? null,

    hasSchoolContext:
      Boolean(currentAuth.user?.schoolContext),

    schoolId:
      currentAuth.user?.schoolContext
        ?.userSchoolMembership?.schoolId ?? null,

    schoolSubdomain:
      currentAuth.user?.schoolContext?.subDomain ?? null,

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

  console.error("Status:", error?.response?.status);

  console.error(
    "Backend response:",
    error?.response?.data,
  );

  console.error("Request URL:", error?.config?.url);

  console.error("Base URL:", error?.config?.baseURL);

  console.error(
    "Full URL:",
    `${error?.config?.baseURL ?? ""}${error?.config?.url ?? ""}`,
  );

  console.error(
    "Method:",
    error?.config?.method?.toUpperCase(),
  );

  console.error("Error code:", error?.code);

  console.error("Error message:", error?.message);

  console.error(
    "==========================================",
  );
}

/* ============================================================
   LOGIN HOOK
   ============================================================ */

export function useLogin() {
  /* ============================================================
     NORMAL LOGIN + SCHOOL LOGIN
     ============================================================ */

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      console.log(
        "========== LOGIN MUTATION START ==========",
      );

      console.log({
        email: data.email.trim().toLowerCase(),
        hasPassword: Boolean(data.password),
        schoolSubdomain: data.schoolSubdomain || null,
      });

      const payload = buildLoginRequest(
        data.email,
        data.password,
      );

      console.log(
        "Login payload prepared:",
        {
          email: payload.email,
          hasPassword: Boolean(payload.password),
          deviceId: payload.deviceId,
          deviceName: payload.deviceName,
        },
      );

      const response = await loginUser(
        payload,
        data.schoolSubdomain,
      );

      console.log(
        "========== LOGIN MUTATION API SUCCESS ==========",
      );

      return response;
    },

    onSuccess: (response) => {
      handleAuthSuccess(response);
    },

    onError: (error: any) => {
      logAuthError(
        "LOGIN MUTATION ERROR",
        error,
      );
    },
  });

  /* ============================================================
     FORCE SWITCH
     ============================================================ */

  const forceSwitchMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      console.log(
        "========== FORCE SWITCH MUTATION START ==========",
      );

      console.log({
        email: data.email.trim().toLowerCase(),
        hasPassword: Boolean(data.password),
        schoolSubdomain: data.schoolSubdomain || null,
      });

      const payload = buildLoginRequest(
        data.email,
        data.password,
      );

      console.log(
        "Force switch payload prepared:",
        {
          email: payload.email,
          hasPassword: Boolean(payload.password),
          deviceId: payload.deviceId,
          deviceName: payload.deviceName,
        },
      );

      const response = await forceSwitch(payload);

      console.log(
        "========== FORCE SWITCH API SUCCESS ==========",
      );

      return response;
    },

    onSuccess: (response) => {
      console.log(
        "========== FORCE SWITCH AUTH SUCCESS ==========",
      );

      handleAuthSuccess(response);
    },

    onError: (error: any) => {
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
    ...loginMutation,
    forceSwitchMutation,
  };
}
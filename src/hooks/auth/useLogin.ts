// "use client";

// import { useMutation } from "@tanstack/react-query";

// import {
//   loginUser,
//   buildLoginRequest,
// } from "@/lib/api/auth";

// import { useAuthStore } from "@/stores/auth.store";


// import {
//   setAccessToken,
//   getAccessToken,
// } from "@/lib/auth/token";




// export function useLogin() {
//   return useMutation({
//     mutationFn: async (data: {
//       email: string;
//       password: string;
//     }) => {
//       const payload = buildLoginRequest(
//         data.email,
//         data.password,
//       );

//       return loginUser(payload);
//     },

//     onSuccess: (response) => {
//       console.log(
//         "========== LOGIN MUTATION SUCCESS ==========",
//       );

//       console.log(response);

//       /* ============================================================
//          VALIDATE RESPONSE
//          ============================================================ */

//       const authData = response?.data;

//       if (!authData?.user) {
//         console.error(
//           "Login succeeded but user data is missing.",
//         );

//         return;
//       }

//       if (!authData.accessToken) {
//         console.error(
//           "Login succeeded but access token is missing.",
//         );

//         return;
//       }

//       if (!authData.refreshToken) {
//         console.error(
//           "Login succeeded but refresh token is missing.",
//         );

//         return;
//       }

//       /* ============================================================
//          BACKEND USER
//          ============================================================ */

//       const backendUser = authData.user;

//       const session = authData.session;

//   /* ============================================================
//    MAP BACKEND USER → FRONTEND USER
//    ============================================================ */

// const user = {
//   /*
//    * Keep both IDs.
//    *
//    * id  → frontend/base entity compatibility
//    * _id → MongoDB/backend/referral API ID
//    */
//   id: backendUser._id,
//   _id: backendUser._id,

//   firstName: backendUser.firstName,
//   lastName: backendUser.lastName,

//   email: backendUser.email,

//   role: backendUser.role,

//   /* ============================================================
//      AUTH STATUS
//      ============================================================ */

//   verified: backendUser.isVerified,

//   active: session?.isActive ?? true,

//   /* ============================================================
//      CONTACT
//      ============================================================ */

//   phoneNumber: backendUser.phoneNumber,

//   /* ============================================================
//      REFERRAL
//      ============================================================ */

//   referralCode: backendUser.referralCode,

//   referredBy: backendUser.referredBy,

//   referralChain: backendUser.referralChain,

//   /* ============================================================
//      PAYMENT / PLANS
//      ============================================================ */

//   isVerified: backendUser.isVerified,

//   hasPaid: backendUser.hasPaid,

//   plans: backendUser.plans,

//   /* ============================================================
//      WALLET
//      ============================================================ */

//   userWallet: backendUser.userWallet,

//   /* ============================================================
//      DEVICE
//      ============================================================ */

//   device: backendUser.device,

//   /* ============================================================
//      DATES
//      ============================================================ */

//   createdAt: backendUser.createdAt,

//   updatedAt: backendUser.updatedAt,
// };

//       /* ============================================================
//    SAVE ACCESS TOKEN FOR AXIOS
//    ============================================================ */

// setAccessToken(authData.accessToken);

// console.log(
//   "========== ACCESS TOKEN STORED ==========",
// );

// console.log({
//   hasAccessToken: !!getAccessToken(),
//   tokenPreview: getAccessToken()
//     ? `${getAccessToken()!.substring(0, 20)}...`
//     : null,
// });

// /* ============================================================
//    SAVE AUTH STATE
//    ============================================================ */

// useAuthStore.getState().login({
//   user,
//   accessToken: authData.accessToken,
//   refreshToken: authData.refreshToken,
// });



//       /* ============================================================
//          DEBUG
//          ============================================================ */

//       const currentAuth =
//         useAuthStore.getState();

//       console.log(
//         "========== AUTH STORE UPDATED ==========",
//       );

//       console.log({
//         user: currentAuth.user,
//         role: currentAuth.user?.role,
//         verified: currentAuth.user?.verified,
//         active: currentAuth.user?.active,
//         isAuthenticated:
//           currentAuth.isAuthenticated,
//       });
//     },

//     onError: (error: any) => {
//       console.error(
//         "========== LOGIN MUTATION ERROR ==========",
//       );

//       console.error(
//         "Status:",
//         error?.response?.status,
//       );

//       console.error(
//         "Backend response:",
//         error?.response?.data,
//       );
//     },
//   });
// }





"use client";

import { useMutation } from "@tanstack/react-query";

import {
  loginUser,
  forceSwitch,
  buildLoginRequest,
} from "@/lib/api/auth";

import { useAuthStore } from "@/stores/auth.store";

import {
  setAccessToken,
  getAccessToken,
} from "@/lib/auth/token";

/* ============================================================
   TYPES
   ============================================================ */

type LoginData = {
  email: string;
  password: string;
};

/* ============================================================
   AUTH SUCCESS HANDLER
   ============================================================ */

function handleAuthSuccess(response: any) {
  console.log(
    "========== AUTH MUTATION SUCCESS ==========",
  );

  console.log(response);

  /* ============================================================
     VALIDATE RESPONSE
     ============================================================ */

  const authData = response?.data;

  if (!authData?.user) {
    console.error(
      "Authentication succeeded but user data is missing.",
    );

    return;
  }

  if (!authData.accessToken) {
    console.error(
      "Authentication succeeded but access token is missing.",
    );

    return;
  }

  if (!authData.refreshToken) {
    console.error(
      "Authentication succeeded but refresh token is missing.",
    );

    return;
  }

  /* ============================================================
     BACKEND USER
     ============================================================ */

  const backendUser = authData.user;

  const session = authData.session;

  /* ============================================================
     MAP BACKEND USER → FRONTEND USER
     ============================================================ */

  const user = {
    /*
     * Keep both IDs.
     *
     * id  → frontend/base entity compatibility
     * _id → MongoDB/backend/referral API ID
     */

    id: backendUser._id,
    _id: backendUser._id,

    firstName: backendUser.firstName,
    lastName: backendUser.lastName,

    email: backendUser.email,

    role: backendUser.role,

    /* ============================================================
       AUTH STATUS
       ============================================================ */

    verified: backendUser.isVerified,

    active: session?.isActive ?? true,

    /* ============================================================
       CONTACT
       ============================================================ */

    phoneNumber: backendUser.phoneNumber,

    /* ============================================================
       REFERRAL
       ============================================================ */

    referralCode: backendUser.referralCode,

    referredBy: backendUser.referredBy,

    referralChain: backendUser.referralChain,

    /* ============================================================
       PAYMENT / PLANS
       ============================================================ */

    isVerified: backendUser.isVerified,

    hasPaid: backendUser.hasPaid,

    plans: backendUser.plans,

    /* ============================================================
       WALLET
       ============================================================ */

    userWallet: backendUser.userWallet,

    /* ============================================================
       DEVICE
       ============================================================ */

    device: backendUser.device,

    /* ============================================================
       DATES
       ============================================================ */

    createdAt: backendUser.createdAt,

    updatedAt: backendUser.updatedAt,
  };

  /* ============================================================
     SAVE ACCESS TOKEN FOR AXIOS
     ============================================================ */

  setAccessToken(authData.accessToken);

  console.log(
    "========== ACCESS TOKEN STORED ==========",
  );

  console.log({
    hasAccessToken: !!getAccessToken(),

    tokenPreview: getAccessToken()
      ? `${getAccessToken()!.substring(0, 20)}...`
      : null,
  });

  /* ============================================================
     SAVE AUTH STATE
     ============================================================ */

  useAuthStore.getState().login({
    user,
    accessToken: authData.accessToken,
    refreshToken: authData.refreshToken,
  });

  /* ============================================================
     DEBUG
     ============================================================ */

  const currentAuth =
    useAuthStore.getState();

  console.log(
    "========== AUTH STORE UPDATED ==========",
  );

  console.log({
    user: currentAuth.user,

    role: currentAuth.user?.role,

    verified: currentAuth.user?.verified,

    active: currentAuth.user?.active,

    isAuthenticated:
      currentAuth.isAuthenticated,
  });

  /* ============================================================
     RETURN RESPONSE
     ============================================================ */

  return response;
}

/* ============================================================
   HOOK
   ============================================================ */

export function useLogin() {
  /* ============================================================
     NORMAL LOGIN MUTATION
     ============================================================ */

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const payload = buildLoginRequest(
        data.email,
        data.password,
      );

      return loginUser(payload);
    },

    onSuccess: handleAuthSuccess,

    onError: (error: any) => {
      console.error(
        "========== LOGIN MUTATION ERROR ==========",
      );

      console.error(
        "Status:",
        error?.response?.status,
      );

      console.error(
        "Backend response:",
        error?.response?.data,
      );
    },
  });

  /* ============================================================
     FORCE SWITCH MUTATION
     ============================================================ */

  const forceSwitchMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const payload = buildLoginRequest(
        data.email,
        data.password,
      );

      return forceSwitch(payload);
    },

    onSuccess: (response) => {
      console.log(
        "========== FORCE SWITCH SUCCESS ==========",
      );

      handleAuthSuccess(response);
    },

    onError: (error: any) => {
      console.error(
        "========== FORCE SWITCH ERROR ==========",
      );

      console.error(
        "Status:",
        error?.response?.status,
      );

      console.error(
        "Backend response:",
        error?.response?.data,
      );
    },
  });

  /* ============================================================
     RETURN BOTH MUTATIONS
     ============================================================ */

  return {
    /* ============================================================
       NORMAL LOGIN
       ============================================================ */

    ...loginMutation,

    /* ============================================================
       FORCE SWITCH
       ============================================================ */

    forceSwitchMutation,
  };
}
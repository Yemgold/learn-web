

// // src/lib/api/axios.ts

// import axios, {
//   type AxiosError,
//   type InternalAxiosRequestConfig,
// } from "axios";

// import { env } from "@/config";
// import { API } from "@/constants";

// import { getAccessToken } from "@/lib/auth/token";
// import { getDeviceId } from "@/lib/auth/device";

// import { useAuthStore } from "@/stores";

// /* ============================================================
//    AXIOS INSTANCE
//    ============================================================ */

// export const axiosInstance = axios.create({
//   baseURL: env.API_URL,

//   timeout: API.TIMEOUT,

//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },

//   withCredentials: true,
// });

// /* ============================================================
//    HELPERS
//    ============================================================ */

// /**
//  * Determines whether the failed request is the wallet
//  * transaction-history endpoint returning the expected
//  * "no transactions" 404 response.
//  */
// function isEmptyTransactionsResponse(
//   error: AxiosError,
// ): boolean {
//   const status = error.response?.status;

//   const url = error.config?.url ?? "";

//   const responseData = error.response?.data as
//     | {
//         message?: string;
//         success?: boolean;
//         status?: number;
//       }
//     | undefined;

//   const message =
//     typeof responseData?.message === "string"
//       ? responseData.message.toLowerCase()
//       : "";

//   const isTransactionEndpoint =
//     url.includes(
//       "/transactions/get-all-transactions-with-userId/",
//     );

//   const isNotFound =
//     status === 404;

//   const isTransactionsNotFound =
//     message.includes("transactions not found");

//   return (
//     isTransactionEndpoint &&
//     isNotFound &&
//     isTransactionsNotFound
//   );
// }

// /* ============================================================
//    REQUEST INTERCEPTOR
//    ============================================================ */

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     /* ========================================================
//        GET AUTH INFORMATION
//        ======================================================== */

//     const accessToken =
//       getAccessToken();

//     const deviceId =
//       getDeviceId();

//     /*
//      * Refresh token is stored inside the Zustand auth store.
//      *
//      * We read the current state without using the React hook,
//      * because Axios interceptors run outside React components.
//      */

//     const refreshToken =
//       useAuthStore.getState().refreshToken;

//     console.log(
//       "========== API REQUEST ==========",
//     );

//     console.log(
//       "URL:",
//       config.url,
//     );

//     console.log(
//       "Full URL:",
//       `${config.baseURL ?? ""}${config.url ?? ""}`,
//     );

//     console.log(
//       "Method:",
//       config.method?.toUpperCase(),
//     );

//     console.log(
//       "Has access token:",
//       Boolean(accessToken),
//     );

//     console.log(
//       "Has refresh token:",
//       Boolean(refreshToken),
//     );

//     /*
//      * Do not print the actual access token.
//      */

//     console.log(
//       "Access token preview:",
//       accessToken
//         ? `${accessToken.substring(0, 20)}...`
//         : null,
//     );

//     /*
//      * Do not print the actual refresh token.
//      */

//     console.log(
//       "Refresh token available:",
//       Boolean(refreshToken),
//     );

//     /* ========================================================
//        ACCESS TOKEN
//        ======================================================== */

//     if (accessToken) {
//       config.headers.set(
//         "Authorization",
//         `Bearer ${accessToken}`,
//       );

//       console.log(
//         "Authorization attached:",
//         Boolean(
//           config.headers.get(
//             "Authorization",
//           ),
//         ),
//       );
//     } else {
//       console.log(
//         "No access token — public request.",
//       );
//     }

//     /* ========================================================
//        DEVICE ID
//        ======================================================== */

//     if (deviceId) {
//       config.headers.set(
//         "X-Device-Id",
//         deviceId,
//       );

//       console.log(
//         "Device ID attached:",
//         true,
//       );
//     } else {
//       console.warn(
//         "⚠️ NO DEVICE ID AVAILABLE",
//       );
//     }

//     // /* ========================================================
//     //    REFRESH TOKEN
//     //    ======================================================== */

//     // if (refreshToken) {
//     //   config.headers.set(
//     //     "X-Refresh-Token",
//     //     refreshToken,
//     //   );

//     //   console.log(
//     //     "Refresh token attached:",
//     //     true,
//     //   );
//     // } else {
//     //   console.warn(
//     //     "⚠️ NO REFRESH TOKEN AVAILABLE",
//     //   );
//     // }




//        /* ========================================================
//    REFRESH TOKEN
//    ======================================================== */

// const isLogoutRequest =
//   config.url?.includes("/auth/logout");

// if (isLogoutRequest) {
//   if (refreshToken) {
//     config.headers.set(
//       "X-Refresh-Token",
//       refreshToken,
//     );

//     console.log(
//       "Refresh token attached for logout:",
//       true,
//     );
//   } else {
//     console.warn(
//       "⚠️ NO REFRESH TOKEN AVAILABLE FOR LOGOUT",
//     );
//   }
// }

//     /* ========================================================
//        FINAL REQUEST HEADERS
//        ======================================================== */

//     console.log(
//       "Authorization header:",
//       config.headers.get(
//         "Authorization",
//       ),
//     );

//     console.log(
//       "X-Device-Id header:",
//       config.headers.get(
//         "X-Device-Id",
//       ),
//     );

//     console.log(
//       "X-Refresh-Token attached:",
//       Boolean(
//         config.headers.get(
//           "X-Refresh-Token",
//         ),
//       ),
//     );

//     return config;
//   },

//   (error) => {
//     console.error(
//       "========== REQUEST INTERCEPTOR ERROR ==========",
//     );

//     console.error(error);

//     return Promise.reject(error);
//   },
// );

// /* ============================================================
//    RESPONSE INTERCEPTOR
//    ============================================================ */

// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(
//       "========== API RESPONSE ==========",
//     );

//     console.log(
//       "Status:",
//       response.status,
//     );

//     console.log(
//       "URL:",
//       response.config.url,
//     );

//     console.log(
//       "Response:",
//       response.data,
//     );

//     return response;
//   },

//   (error: AxiosError) => {
//     /* ========================================================
//        EXPECTED EMPTY TRANSACTION RESPONSE
//        ======================================================== */

//     if (
//       isEmptyTransactionsResponse(
//         error,
//       )
//     ) {
//       console.info(
//         "No wallet transactions found. Showing empty transaction state.",
//       );

//       return Promise.reject(error);
//     }

//     /* ========================================================
//        REAL API ERROR
//        ======================================================== */

//     console.error(
//       "========== API ERROR ==========",
//     );

//     console.error(
//       "Message:",
//       error.message,
//     );

//     console.error(
//       "Code:",
//       error.code,
//     );

//     console.error(
//       "URL:",
//       error.config?.url,
//     );

//     console.error(
//       "Full URL:",
//       `${error.config?.baseURL ?? ""}${
//         error.config?.url ?? ""
//       }`,
//     );

//     console.error(
//       "Method:",
//       error.config?.method?.toUpperCase(),
//     );

//     console.error(
//       "Status:",
//       error.response?.status,
//     );

//     console.error(
//       "Response:",
//       error.response?.data,
//     );

//     console.error(
//       "Request headers:",
//       error.config?.headers,
//     );

//     console.error(
//       "Response headers:",
//       error.response?.headers,
//     );

//     return Promise.reject(error);
//   },
// );



// export interface Subject {
//   _id: string;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   plans: string[];
//   hasFreePractice: boolean;
// }

// export interface SubjectsResponse {
//   success: boolean;
//   message: string;
//   data: {
//     subjectObj: Subject[];
//     totalPages: number;
//     totalCount: number;
//   };
// }

// export async function getSubjectsByPlan(
//   plan: string,
// ): Promise<SubjectsResponse> {
//   const response = await api.get(
//     `/subjects/get-all-subjects-per-category/${encodeURIComponent(plan)}`,
//   );

//   return response.data;
// }


// /* ============================================================
//    API ALIAS
//    ============================================================ */

// export const api =
//   axiosInstance;














// src/lib/api/axios.ts

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config";
import { API } from "@/constants";

import { getAccessToken } from "@/lib/auth/token";
import { getDeviceId } from "@/lib/auth/device";

import { useAuthStore } from "@/stores";

/* ============================================================
   AXIOS INSTANCE
   ============================================================ */

export const axiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: API.TIMEOUT,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  withCredentials: true,
});

/* ============================================================
   TYPES
   ============================================================ */

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: unknown;
  status?: number;
  data?: unknown;
}

/* ============================================================
   HELPERS
   ============================================================ */

function getErrorResponseData(
  error: AxiosError,
): ApiErrorResponse | undefined {
  if (!error.response?.data) {
    return undefined;
  }

  if (
    typeof error.response.data === "object" &&
    error.response.data !== null
  ) {
    return error.response.data as ApiErrorResponse;
  }

  return undefined;
}

/* ============================================================
   EMPTY TRANSACTION RESPONSE
   ============================================================ */

/**
 * The wallet transaction-history endpoint may return 404
 * when the user simply has no transactions yet.
 *
 * This is expected application behaviour, not a real
 * API failure.
 */
function isEmptyTransactionsResponse(
  error: AxiosError,
): boolean {
  const status = error.response?.status;

  const url = error.config?.url ?? "";

  const responseData =
    getErrorResponseData(error);

  const message =
    typeof responseData?.message === "string"
      ? responseData.message.toLowerCase()
      : "";

  const isTransactionEndpoint =
    url.includes(
      "/transactions/get-all-transactions-with-userId/",
    );

  const isNotFound =
    status === 404;

  const isTransactionsNotFound =
    message.includes(
      "transactions not found",
    );

  return (
    isTransactionEndpoint &&
    isNotFound &&
    isTransactionsNotFound
  );
}

/* ============================================================
   REQUEST INTERCEPTOR
   ============================================================ */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    /* ========================================================
       AUTH INFORMATION
       ======================================================== */

    const accessToken =
      getAccessToken();

    const deviceId =
      getDeviceId();

    /*
     * Axios runs outside React, so we must access Zustand
     * through getState().
     */

    const refreshToken =
      useAuthStore.getState().refreshToken;

    /* ========================================================
       REQUEST DEBUG
       ======================================================== */

    console.log(
      "========== API REQUEST ==========",
    );

    console.log(
      "URL:",
      config.url,
    );

    console.log(
      "Full URL:",
      `${config.baseURL ?? ""}${config.url ?? ""}`,
    );

    console.log(
      "Method:",
      config.method?.toUpperCase(),
    );

    console.log(
      "Has access token:",
      Boolean(accessToken),
    );

    console.log(
      "Has refresh token:",
      Boolean(refreshToken),
    );

    console.log(
      "Has device ID:",
      Boolean(deviceId),
    );

    /* ========================================================
       ACCESS TOKEN
       ======================================================== */

    if (accessToken) {
      config.headers.set(
        "Authorization",
        `Bearer ${accessToken}`,
      );
    }

    /* ========================================================
       DEVICE ID
       ======================================================== */

    if (deviceId) {
      config.headers.set(
        "X-Device-Id",
        deviceId,
      );
    }

    /* ========================================================
       REFRESH TOKEN
       ======================================================== */

    /*
     * Your current backend flow only requires the refresh
     * token on logout, so we preserve that behaviour.
     *
     * If your backend refresh endpoint also requires
     * X-Refresh-Token, add that endpoint here.
     */

    const isLogoutRequest =
      config.url?.includes(
        "/auth/logout",
      );

    if (
      isLogoutRequest &&
      refreshToken
    ) {
      config.headers.set(
        "X-Refresh-Token",
        refreshToken,
      );
    }

    /* ========================================================
       FINAL HEADERS DEBUG
       ======================================================== */

    console.log(
      "Authorization attached:",
      Boolean(
        config.headers.get(
          "Authorization",
        ),
      ),
    );

    console.log(
      "X-Device-Id attached:",
      Boolean(
        config.headers.get(
          "X-Device-Id",
        ),
      ),
    );

    console.log(
      "X-Refresh-Token attached:",
      Boolean(
        config.headers.get(
          "X-Refresh-Token",
        ),
      ),
    );

    console.log(
      "Request body:",
      config.data,
    );

    console.log(
      "=================================",
    );

    return config;
  },

  (error) => {
    console.error(
      "========== REQUEST INTERCEPTOR ERROR ==========",
    );

    console.error(
      "Request interceptor error:",
      error,
    );

    console.error(
      "================================================",
    );

    return Promise.reject(error);
  },
);

/* ============================================================
   RESPONSE INTERCEPTOR
   ============================================================ */

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "========== API RESPONSE ==========",
    );

    console.log(
      "Status:",
      response.status,
    );

    console.log(
      "URL:",
      response.config.url,
    );

    console.log(
      "Response:",
      response.data,
    );

    console.log(
      "==================================",
    );

    return response;
  },

  (error: AxiosError) => {
    /* ========================================================
       EXPECTED EMPTY TRANSACTION RESPONSE
       ======================================================== */

    if (
      isEmptyTransactionsResponse(
        error,
      )
    ) {
      console.info(
        "No wallet transactions found. Showing empty transaction state.",
      );

      return Promise.reject(error);
    }

    /* ========================================================
       EXTRACT BACKEND ERROR
       ======================================================== */

    const responseData =
      getErrorResponseData(error);

    const backendMessage =
      responseData?.message ??
      responseData?.error ??
      null;

    /* ========================================================
       API ERROR
       ======================================================== */

    console.error(
      "========== API ERROR ==========",
    );

    console.error(
      "Message:",
      error.message,
    );

    console.error(
      "Code:",
      error.code,
    );

    console.error(
      "Status:",
      error.response?.status,
    );

    console.error(
      "URL:",
      error.config?.url,
    );

    console.error(
      "Full URL:",
      `${error.config?.baseURL ?? ""}${
        error.config?.url ?? ""
      }`,
    );

    console.error(
      "Method:",
      error.config?.method?.toUpperCase(),
    );

    console.error(
      "Backend message:",
      backendMessage,
    );

    console.error(
      "Backend response:",
      error.response?.data,
    );

    console.error(
      "Request body:",
      error.config?.data,
    );

    console.error(
      "Request headers:",
      error.config?.headers,
    );

    console.error(
      "Response headers:",
      error.response?.headers,
    );

    console.error(
      "Is Axios error:",
      axios.isAxiosError(error),
    );

    console.error(
      "================================",
    );

    return Promise.reject(error);
  },
);

/* ============================================================
   API ALIAS
   ============================================================ */

export const api =
  axiosInstance;

/* ============================================================
   SUBJECT TYPES
   ============================================================ */

export interface Subject {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  plans: string[];
  hasFreePractice: boolean;
}

export interface SubjectsResponse {
  success: boolean;
  message: string;

  data: {
    subjectObj: Subject[];
    totalPages: number;
    totalCount: number;
  };
}

/* ============================================================
   SUBJECT API
   ============================================================ */

export async function getSubjectsByPlan(
  plan: string,
): Promise<SubjectsResponse> {
  const response =
    await api.get(
      `/subjects/get-all-subjects-per-category/${encodeURIComponent(
        plan,
      )}`,
    );

  return response.data;
}

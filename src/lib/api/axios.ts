
// // src/lib/api/axios.ts

// import axios, {
//   type AxiosError,
//   type InternalAxiosRequestConfig,
// } from "axios";

// import { env } from "@/config";
// import { API } from "@/constants";

// import {
//   getAccessToken,
//   getRefreshToken,
//   setAccessToken,
//   clearTokens,
// } from "@/lib/auth/token";

// import { getDeviceId } from "@/lib/auth/device";

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
//    TYPES
//    ============================================================ */

// interface ApiErrorResponse {
//   success?: boolean;
//   message?: string;
//   error?: string;
//   errors?: unknown;
//   status?: number;
//   data?: unknown;
// }

// interface RefreshResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     accessToken?: string;
//     refreshToken?: string;
//   };
// }

// interface RetryableRequestConfig
//   extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// /* ============================================================
//    REFRESH STATE
//    ============================================================ */

// /*
//  * Prevent multiple API requests from simultaneously
//  * calling the refresh endpoint.
//  */
// let refreshPromise: Promise<string | null> | null =
//   null;

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function getErrorResponseData(
//   error: AxiosError,
// ): ApiErrorResponse | undefined {
//   if (!error.response?.data) {
//     return undefined;
//   }

//   if (
//     typeof error.response.data === "object" &&
//     error.response.data !== null
//   ) {
//     return error.response.data as ApiErrorResponse;
//   }

//   return undefined;
// }

// /* ============================================================
//    EMPTY TRANSACTION RESPONSE
//    ============================================================ */

// function isEmptyTransactionsResponse(
//   error: AxiosError,
// ): boolean {
//   const status = error.response?.status;

//   const url = error.config?.url ?? "";

//   const responseData =
//     getErrorResponseData(error);

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
//     message.includes(
//       "transactions not found",
//     );

//   return (
//     isTransactionEndpoint &&
//     isNotFound &&
//     isTransactionsNotFound
//   );
// }

// /* ============================================================
//    REFRESH ACCESS TOKEN
//    ============================================================ */

// async function refreshAccessToken(): Promise<
//   string | null
// > {
//   /*
//    * Reuse an existing refresh request if one is already
//    * running.
//    */
//   if (refreshPromise) {
//     return refreshPromise;
//   }

//   refreshPromise = (async () => {
//     const refreshToken =
//       getRefreshToken();

//     const deviceId =
//       getDeviceId();

//     if (!refreshToken) {
//       console.warn(
//         "No refresh token available.",
//       );

//       return null;
//     }

//     if (!deviceId) {
//       console.warn(
//         "No device ID available for token refresh.",
//       );

//       return null;
//     }

//     try {
//       console.log(
//         "========== TOKEN REFRESH START ==========",
//       );

//       console.log(
//         "Has refresh token:",
//         Boolean(refreshToken),
//       );

//       console.log(
//         "Has device ID:",
//         Boolean(deviceId),
//       );

//       /*
//        * IMPORTANT:
//        *
//        * Use axios directly instead of axiosInstance.
//        *
//        * This prevents the request from going through
//        * our authentication interceptors and creating a
//        * refresh loop.
//        */
//       const response =
//         await axios.post<RefreshResponse>(
//           `${env.API_URL}/auth/request-access-token`,
//           {},
//           {
//             timeout: API.TIMEOUT,

//             headers: {
//               "Content-Type":
//                 "application/json",

//               Accept:
//                 "application/json",

//               "X-Device-Id":
//                 deviceId,

//               "X-Refresh-Token":
//                 refreshToken,
//             },

//             withCredentials: true,
//           },
//         );

//       console.log(
//         "Token refresh response:",
//         response.data,
//       );

//       const newAccessToken =
//         response.data?.data?.accessToken;

//       const newRefreshToken =
//         response.data?.data?.refreshToken;

//       if (!newAccessToken) {
//         console.error(
//           "Token refresh succeeded but no access token was returned.",
//         );

//         return null;
//       }

//       /*
//        * Save the new access token.
//        */
//       setAccessToken(
//         newAccessToken,
//       );

//       /*
//        * Some backends rotate the refresh token.
//        *
//        * If a new refresh token was returned,
//        * persist it too.
//        */
//       if (newRefreshToken) {
//         /*
//          * We intentionally do not import
//          * setRefreshToken here because the refresh
//          * token may remain unchanged depending on the
//          * backend contract.
//          *
//          * Add it if your backend rotates refresh tokens.
//          */
//       }

//       console.log(
//         "✅ NEW ACCESS TOKEN STORED",
//       );

//       console.log(
//         "=========================================",
//       );

//       return newAccessToken;
//     } catch (refreshError) {
//       console.error(
//         "========== TOKEN REFRESH FAILED ==========",
//       );

//       if (
//         axios.isAxiosError(
//           refreshError,
//         )
//       ) {
//         console.error(
//           "Refresh status:",
//           refreshError.response
//             ?.status,
//         );

//         console.error(
//           "Refresh response:",
//           refreshError.response
//             ?.data,
//         );
//       } else {
//         console.error(
//           refreshError,
//         );
//       }

//       console.error(
//         "==========================================",
//       );

//       /*
//        * The refresh token is no longer usable.
//        *
//        * Clear local authentication tokens.
//        *
//        * We deliberately do not directly redirect
//        * from Axios. The application's auth guard
//        * should handle navigation.
//        */
//       clearTokens();

//       return null;
//     } finally {
//       refreshPromise = null;
//     }
//   })();

//   return refreshPromise;
// }

// /* ============================================================
//    REQUEST INTERCEPTOR
//    ============================================================ */

// axiosInstance.interceptors.request.use(
//   (
//     config: InternalAxiosRequestConfig,
//   ) => {
//     const accessToken =
//       getAccessToken();

//     const deviceId =
//       getDeviceId();

//     const refreshToken =
//       getRefreshToken();

//     /* ========================================================
//        DEBUG
//        ======================================================== */

//     console.log(
//       "========== API REQUEST ==========",
//     );

//     console.log(
//       "URL:",
//       config.url,
//     );

//     console.log(
//       "Full URL:",
//       `${config.baseURL ?? ""}${
//         config.url ?? ""
//       }`,
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

//     console.log(
//       "Has device ID:",
//       Boolean(deviceId),
//     );

//     /* ========================================================
//        ACCESS TOKEN
//        ======================================================== */

//     if (accessToken) {
//       config.headers.set(
//         "Authorization",
//         `Bearer ${accessToken}`,
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
//     }

//     /* ========================================================
//        REFRESH TOKEN
//        ======================================================== */

//     /*
//      * ONLY attach the refresh token to the refresh
//      * endpoint.
//      */
//     const isRefreshRequest =
//       config.url?.includes(
//         "/auth/request-access-token",
//       );

//     if (
//       isRefreshRequest &&
//       refreshToken
//     ) {
//       config.headers.set(
//         "X-Refresh-Token",
//         refreshToken,
//       );
//     }

//     /* ========================================================
//        LOGOUT
//        ======================================================== */

//     const isLogoutRequest =
//       config.url?.includes(
//         "/auth/logout",
//       );

//     if (
//       isLogoutRequest &&
//       refreshToken
//     ) {
//       config.headers.set(
//         "X-Refresh-Token",
//         refreshToken,
//       );
//     }

//     /* ========================================================
//        FINAL DEBUG
//        ======================================================== */

//     console.log(
//       "Authorization attached:",
//       Boolean(
//         config.headers.get(
//           "Authorization",
//         ),
//       ),
//     );

//     console.log(
//       "X-Device-Id attached:",
//       Boolean(
//         config.headers.get(
//           "X-Device-Id",
//         ),
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

//     console.log(
//       "Request body:",
//       config.data,
//     );

//     console.log(
//       "=================================",
//     );

//     return config;
//   },

//   (error) => {
//     console.error(
//       "========== REQUEST INTERCEPTOR ERROR ==========",
//     );

//     console.error(
//       error,
//     );

//     console.error(
//       "================================================",
//     );

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

//     console.log(
//       "==================================",
//     );

//     return response;
//   },

//   async (
//     error: AxiosError,
//   ) => {
//     /* ========================================================
//        EMPTY TRANSACTIONS
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

//     const originalRequest =
//       error.config as
//         | RetryableRequestConfig
//         | undefined;

//     /* ========================================================
//        CHECK 401
//        ======================================================== */

//     const status =
//       error.response?.status;

//     const is401 =
//       status === 401;

//     const requestUrl =
//       originalRequest?.url ?? "";

//     const isRefreshRequest =
//       requestUrl.includes(
//         "/auth/request-access-token",
//       );

//     /*
//      * Never attempt to refresh the refresh request
//      * itself.
//      */
//     if (
//       is401 &&
//       originalRequest &&
//       !originalRequest._retry &&
//       !isRefreshRequest
//     ) {
//       originalRequest._retry =
//         true;

//       console.log(
//         "========== ACCESS TOKEN EXPIRED ==========",
//       );

//       console.log(
//         "Attempting token refresh...",
//       );

//       const newAccessToken =
//         await refreshAccessToken();

//       if (newAccessToken) {
//         console.log(
//           "✅ RETRYING ORIGINAL REQUEST",
//         );

//         /*
//          * Attach the new token to the failed request.
//          */
//         originalRequest.headers.set(
//           "Authorization",
//           `Bearer ${newAccessToken}`,
//         );

//         return axiosInstance(
//           originalRequest,
//         );
//       }

//       console.warn(
//         "❌ TOKEN REFRESH FAILED",
//       );

//       console.warn(
//         "Original request will remain failed.",
//       );

//       console.log(
//         "==========================================",
//       );
//     }

//     /* ========================================================
//        ERROR INFORMATION
//        ======================================================== */

//     const responseData =
//       getErrorResponseData(error);

//     const backendMessage =
//       responseData?.message ??
//       responseData?.error ??
//       null;

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
//       "Status:",
//       error.response?.status,
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
//       "Backend message:",
//       backendMessage,
//     );

//     console.error(
//       "Backend response:",
//       error.response?.data,
//     );

//     console.error(
//       "Request body:",
//       error.config?.data,
//     );

//     console.error(
//       "Request headers:",
//       error.config?.headers,
//     );

//     console.error(
//       "Response headers:",
//       error.response?.headers,
//     );

//     console.error(
//       "Is Axios error:",
//       axios.isAxiosError(error),
//     );

//     console.error(
//       "================================",
//     );

//     return Promise.reject(error);
//   },
// );

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

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
} from "@/lib/auth/token";

import { getDeviceId } from "@/lib/auth/device";

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

interface RefreshResponse {
  success: boolean;
  message?: string;

  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/* ============================================================
   REFRESH STATE
   ============================================================ */

/*
 * Only one refresh request is allowed to run at a time.
 *
 * If 5 API requests return 401 at the same time,
 * they will all wait for this same promise instead of
 * sending 5 refresh requests.
 */
let refreshPromise: Promise<string | null> | null = null;

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
   EMPTY TRANSACTIONS RESPONSE
   ============================================================ */

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
   AUTH SESSION EXPIRED EVENT
   ============================================================ */

/*
 * Axios should not directly import the Zustand auth store.
 *
 * Instead, when refresh fails, we dispatch an event.
 *
 * AuthProvider listens for this event and clears the
 * authenticated Zustand state.
 */

function notifySessionExpired(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("jamb:auth-session-expired"),
  );
}

/* ============================================================
   REFRESH ACCESS TOKEN
   ============================================================ */

async function refreshAccessToken(): Promise<
  string | null
> {
  /*
   * If another request is already refreshing,
   * wait for that request.
   */
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken =
      getRefreshToken();

    const deviceId =
      getDeviceId();

    /* ========================================================
       VALIDATION
       ======================================================== */

    if (!refreshToken) {
      console.warn(
        "❌ Cannot refresh access token: no refresh token.",
      );

      return null;
    }

    if (!deviceId) {
      console.warn(
        "❌ Cannot refresh access token: no device ID.",
      );

      return null;
    }

    try {
      console.log(
        "========== TOKEN REFRESH START ==========",
      );

      console.log(
        "Has refresh token:",
        Boolean(refreshToken),
      );

      console.log(
        "Has device ID:",
        Boolean(deviceId),
      );

      console.log(
        "Device ID:",
        deviceId,
      );

      console.log(
        "Refresh endpoint:",
        `${env.API_URL}/auth/request-access-token`,
      );

      /*
       * IMPORTANT:
       *
       * Use plain axios here.
       *
       * DO NOT use axiosInstance.
       *
       * This prevents the refresh request from passing
       * through the normal Authorization interceptor.
       */
      const response =
        await axios.post<RefreshResponse>(
          `${env.API_URL}/auth/request-access-token`,
          {},
          {
            timeout: API.TIMEOUT,

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",

              "X-Device-Id":
                deviceId,

              "X-Refresh-Token":
                refreshToken,
            },

            withCredentials: true,
          },
        );

      console.log(
        "========== TOKEN REFRESH RESPONSE ==========",
      );

      console.log(
        "Status:",
        response.status,
      );

      console.log(
        "Success:",
        response.data?.success,
      );

      console.log(
        "Message:",
        response.data?.message,
      );

      console.log(
        "Has new access token:",
        Boolean(
          response.data?.data?.accessToken,
        ),
      );

      console.log(
        "Has rotated refresh token:",
        Boolean(
          response.data?.data?.refreshToken,
        ),
      );

      console.log(
        "=============================================",
      );

      /* ======================================================
         GET NEW ACCESS TOKEN
         ====================================================== */

      const newAccessToken =
        response.data?.data?.accessToken;

      if (!newAccessToken) {
        console.error(
          "❌ Refresh succeeded but backend returned no access token.",
        );

        return null;
      }

      /* ======================================================
         STORE NEW ACCESS TOKEN
         ====================================================== */

      setAccessToken(
        newAccessToken,
      );

      console.log(
        "✅ NEW ACCESS TOKEN STORED",
      );

      /*
       * If your backend rotates refresh tokens,
       * it may return a new refresh token.
       *
       * We intentionally don't overwrite the existing
       * refresh token here unless you confirm that your
       * backend rotates it.
       */

      console.log(
        "=========================================",
      );

      return newAccessToken;
    } catch (refreshError) {
      console.error(
        "========== TOKEN REFRESH FAILED ==========",
      );

      if (
        axios.isAxiosError(
          refreshError,
        )
      ) {
        console.error(
          "Refresh status:",
          refreshError.response?.status,
        );

        console.error(
          "Refresh response:",
          refreshError.response?.data,
        );

        console.error(
          "Refresh URL:",
          refreshError.config?.url,
        );

        console.error(
          "Refresh method:",
          refreshError.config?.method,
        );
      } else {
        console.error(
          refreshError,
        );
      }

      console.error(
        "==========================================",
      );

      /*
       * The refresh token is no longer usable.
       *
       * Clear the local token storage.
       */
      clearTokens();

      /*
       * Tell AuthProvider/Zustand that the session
       * has expired.
       */
      notifySessionExpired();

      return null;
    } finally {
      /*
       * Allow another refresh operation later.
       */
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/* ============================================================
   REQUEST INTERCEPTOR
   ============================================================ */

axiosInstance.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    const accessToken =
      getAccessToken();

    const deviceId =
      getDeviceId();

    const refreshToken =
      getRefreshToken();

    /* ========================================================
       DEBUG
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
      `${config.baseURL ?? ""}${
        config.url ?? ""
      }`,
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
     * The normal API should NOT receive the refresh token.
     *
     * Only explicitly attach it to the refresh endpoint.
     */
    const isRefreshRequest =
      config.url?.includes(
        "/auth/request-access-token",
      );

    if (
      isRefreshRequest &&
      refreshToken
    ) {
      config.headers.set(
        "X-Refresh-Token",
        refreshToken,
      );

      /*
       * Remove Authorization from the refresh request.
       *
       * This is important because the access token may
       * already be expired.
       */
      config.headers.delete(
        "Authorization",
      );
    }

    /* ========================================================
       LOGOUT
       ======================================================== */

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
       FINAL DEBUG
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

  async (
    error: AxiosError,
  ) => {
    /* ========================================================
       EMPTY TRANSACTIONS
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
       ORIGINAL REQUEST
       ======================================================== */

    const originalRequest =
      error.config as
        | RetryableRequestConfig
        | undefined;

    /* ========================================================
       ERROR STATUS
       ======================================================== */

    const status =
      error.response?.status;

    const is401 =
      status === 401;

    const requestUrl =
      originalRequest?.url ?? "";

    const isRefreshRequest =
      requestUrl.includes(
        "/auth/request-access-token",
      );

    /* ========================================================
       ACCESS TOKEN EXPIRED
       ======================================================== */

    /*
     * Only attempt refresh for a normal API request.
     *
     * Never refresh the refresh endpoint itself.
     */
    if (
      is401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry =
        true;

      console.log(
        "========== ACCESS TOKEN EXPIRED ==========",
      );

      console.log(
        "Attempting token refresh...",
      );

      const newAccessToken =
        await refreshAccessToken();

      /* ======================================================
         REFRESH SUCCESS
         ====================================================== */

      if (newAccessToken) {
        console.log(
          "✅ TOKEN REFRESH SUCCESSFUL",
        );

        console.log(
          "✅ RETRYING ORIGINAL REQUEST",
        );

        /*
         * Attach the new access token.
         */
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );

        console.log(
          "==========================================",
        );

        /*
         * Retry the exact request that failed.
         */
        return axiosInstance(
          originalRequest,
        );
      }

      /* ======================================================
         REFRESH FAILED
         ====================================================== */

      console.warn(
        "❌ TOKEN REFRESH FAILED",
      );

      console.warn(
        "Session has been cleared.",
      );

      console.log(
        "==========================================",
      );
    }

    /* ========================================================
       ERROR INFORMATION
       ======================================================== */

    const responseData =
      getErrorResponseData(error);

    const backendMessage =
      responseData?.message ??
      responseData?.error ??
      null;

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








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

/*
 * IMPORTANT:
 *
 * The backend documentation shows:
 *
 * {
 *   "success": true,
 *   "message": "Access token generated successfully",
 *   "data": "NEW_ACCESS_TOKEN"
 * }
 *
 * Therefore data is a STRING, not:
 *
 * data: {
 *   accessToken: string
 * }
 */
interface RefreshResponse {
  success: boolean;
  message?: string;
  data?: string;
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
 * If several API requests return 401 simultaneously,
 * they all wait for the same refresh operation.
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
 * Instead, when refresh fails, dispatch an event.
 *
 * AuthProvider listens for this event and clears the
 * authenticated Zustand state.
 */
function notifySessionExpired(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      "jamb:auth-session-expired",
    ),
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
   * wait for that same refresh operation.
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
       * Use plain Axios here.
       *
       * DO NOT use axiosInstance.
       *
       * This prevents the refresh request from being
       * processed by the normal authenticated request
       * interceptor.
       *
       * ------------------------------------------------------
       *
       * BACKEND DOCUMENTATION:
       *
       * Security:
       * JWT-refresh (http, Bearer)
       *
       * Therefore the REFRESH TOKEN must be sent as:
       *
       * Authorization: Bearer <refresh-token>
       *
       * NOT:
       *
       * X-Refresh-Token: <refresh-token>
       * ------------------------------------------------------
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

              /*
               * The backend documentation says the
               * refresh endpoint uses HTTP Bearer auth.
               */
              Authorization:
                `Bearer ${refreshToken}`,

              /*
               * Keep the device ID because your
               * authentication system uses device/session
               * information and the existing backend contract
               * may require it.
               */
              ...(deviceId
                ? {
                    "X-Device-Id":
                      deviceId,
                  }
                : {}),
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
          response.data?.data,
        ),
      );

      console.log(
        "=============================================",
      );

      /* ======================================================
         GET NEW ACCESS TOKEN
         ====================================================== */

      /*
       * IMPORTANT:
       *
       * Backend response:
       *
       * data: "eyJhbGciOiJIUzI1Ni..."
       *
       * Therefore:
       *
       * response.data.data
       *
       * is the NEW ACCESS TOKEN.
       */

      const newAccessToken =
        response.data?.data;

      if (
        !newAccessToken ||
        typeof newAccessToken !== "string"
      ) {
        console.error(
          "❌ Refresh succeeded but backend returned no valid access token.",
        );

        console.error(
          "Refresh response:",
          JSON.stringify(
            response.data,
            null,
            2,
          ),
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
          JSON.stringify(
            refreshError.response?.data,
            null,
            2,
          ),
        );

        console.error(
          "Refresh URL:",
          refreshError.config?.url,
        );

        console.error(
          "Refresh method:",
          refreshError.config?.method,
        );

        /*
         * Do not print the Authorization header here.
         *
         * It contains the refresh token.
         */
        console.error(
          "Refresh request headers:",
          {
            hasAuthorization:
              Boolean(
                refreshError.config?.headers?.[
                  "Authorization"
                ],
              ),

            hasDeviceId:
              Boolean(
                refreshError.config?.headers?.[
                  "X-Device-Id"
                ],
              ),
          },
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
       * At this point the backend rejected the refresh
       * request, so the frontend cannot safely continue
       * the authenticated session.
       */
      clearTokens();

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
       REFRESH ENDPOINT
       ======================================================== */

    /*
     * Normally this axiosInstance interceptor is NOT used
     * for the automatic refresh request because refreshAccessToken()
     * uses plain axios.
     *
     * This section remains defensive for any other code that
     * explicitly calls /auth/request-access-token through
     * axiosInstance.
     *
     * IMPORTANT:
     *
     * The backend expects the refresh token as:
     *
     * Authorization: Bearer <refresh-token>
     *
     * Therefore we replace the normal access-token
     * Authorization header with the refresh token.
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
        "Authorization",
        `Bearer ${refreshToken}`,
      );
    }

    /* ========================================================
       LOGOUT
       ======================================================== */

    /*
     * Keep the existing logout behavior.
     *
     * The logout endpoint can continue receiving the
     * refresh token using X-Refresh-Token if that is what
     * its existing backend contract requires.
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
     * Never attempt to refresh the refresh endpoint itself.
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

    /*
     * Do not log the actual Authorization header because
     * it can contain either an access token or refresh token.
     */
    console.error(
      "Request headers:",
      {
        hasAuthorization:
          Boolean(
            error.config?.headers?.[
              "Authorization"
            ],
          ),

        hasDeviceId:
          Boolean(
            error.config?.headers?.[
              "X-Device-Id"
            ],
          ),

        hasRefreshHeader:
          Boolean(
            error.config?.headers?.[
              "X-Refresh-Token"
            ],
          ),
      },
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

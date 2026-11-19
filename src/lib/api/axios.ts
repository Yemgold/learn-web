
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
  data?: string;
}

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/* ============================================================
   REFRESH STATE
============================================================ */

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

  const responseData = getErrorResponseData(error);

  const message =
    typeof responseData?.message === "string"
      ? responseData.message.toLowerCase()
      : "";

  return (
    url.includes(
      "/transactions/get-all-transactions-with-userId/",
    ) &&
    status === 404 &&
    message.includes("transactions not found")
  );
}

/* ============================================================
   EMPTY SOLVE & WIN CONTEST RESPONSE
============================================================ */

function isNoUpcomingSolveAndWinContestsResponse(
  error: AxiosError,
): boolean {
  const status = error.response?.status;
  const url = error.config?.url ?? "";

  const responseData = getErrorResponseData(error);

  const message =
    typeof responseData?.message === "string"
      ? responseData.message.trim()
      : "";

  return (
    status === 404 &&
    url.includes(
      "/solve-and-win/contests/get-all-not-completed-contests",
    ) &&
    message === "No upcoming contests found."
  );
}

/* ============================================================
   AUTH SESSION EXPIRED EVENT
============================================================ */

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

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    const deviceId = getDeviceId();

    if (!refreshToken) {
      console.warn(
        "Cannot refresh access token: no refresh token.",
      );

      return null;
    }

    try {
      console.log(
        "========== TOKEN REFRESH START ==========",
      );

      console.log("Has refresh token:", Boolean(refreshToken));
      console.log("Has device ID:", Boolean(deviceId));

      const response = await axios.post<RefreshResponse>(
        `${env.API_URL}/auth/request-access-token`,
        {},
        {
          timeout: API.TIMEOUT,

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${refreshToken}`,

            ...(deviceId
              ? {
                  "X-Device-Id": deviceId,
                }
              : {}),
          },

          withCredentials: true,
        },
      );

      const newAccessToken = response.data?.data;

      if (
        !newAccessToken ||
        typeof newAccessToken !== "string"
      ) {
        console.error(
          "Refresh succeeded but backend returned no valid access token.",
        );

        return null;
      }

      setAccessToken(newAccessToken);

      console.log("New access token stored.");

      console.log(
        "==========================================",
      );

      return newAccessToken;
    } catch (refreshError) {
      console.error(
        "========== TOKEN REFRESH FAILED ==========",
      );

      if (axios.isAxiosError(refreshError)) {
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

        console.error(
          "Has Authorization:",
          Boolean(
            refreshError.config?.headers?.[
              "Authorization"
            ],
          ),
        );

        console.error(
          "Has device ID:",
          Boolean(
            refreshError.config?.headers?.[
              "X-Device-Id"
            ],
          ),
        );
      } else {
        console.error(refreshError);
      }

      console.error(
        "==========================================",
      );

      clearTokens();
      notifySessionExpired();

      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/* ============================================================
   REQUEST INTERCEPTOR
============================================================ */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    const deviceId = getDeviceId();
    const refreshToken = getRefreshToken();

    console.log("========== API REQUEST ==========");

    console.log("URL:", config.url);

    console.log(
      "Full URL:",
      `${config.baseURL ?? ""}${config.url ?? ""}`,
    );

    console.log("Method:", config.method?.toUpperCase());

    console.log("Has access token:", Boolean(accessToken));
    console.log("Has refresh token:", Boolean(refreshToken));
    console.log("Has device ID:", Boolean(deviceId));

    if (accessToken) {
      config.headers.set(
        "Authorization",
        `Bearer ${accessToken}`,
      );
    }

    if (deviceId) {
      config.headers.set("X-Device-Id", deviceId);
    }

    const isRefreshRequest =
      config.url?.includes("/auth/request-access-token");

    if (isRefreshRequest && refreshToken) {
      config.headers.set(
        "Authorization",
        `Bearer ${refreshToken}`,
      );
    }

    const isLogoutRequest =
      config.url?.includes("/auth/logout");

    if (isLogoutRequest && refreshToken) {
      config.headers.set(
        "X-Refresh-Token",
        refreshToken,
      );
    }

    console.log(
      "Authorization attached:",
      Boolean(config.headers.get("Authorization")),
    );

    console.log(
      "X-Device-Id attached:",
      Boolean(config.headers.get("X-Device-Id")),
    );

    console.log(
      "X-Refresh-Token attached:",
      Boolean(config.headers.get("X-Refresh-Token")),
    );

    // Never log passwords, tokens or complete authentication bodies.
    console.log("=================================");

    return config;
  },

  (error) => {
    console.error("Request interceptor error:", error);

    return Promise.reject(error);
  },
);

/* ============================================================
   RESPONSE INTERCEPTOR
============================================================ */

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("========== API RESPONSE ==========");

    console.log("Status:", response.status);
    console.log("URL:", response.config.url);
    console.log("Response:", response.data);

    console.log("==================================");

    return response;
  },

  async (error: AxiosError) => {
    /* ========================================================
       EXPECTED EMPTY RESPONSES
    ======================================================== */

    if (isEmptyTransactionsResponse(error)) {
      console.info(
        "No wallet transactions found. Showing empty transaction state.",
      );

      return Promise.reject(error);
    }

    if (isNoUpcomingSolveAndWinContestsResponse(error)) {
      console.info(
        "No upcoming Solve & Win contests. Showing empty contest state.",
      );

      return Promise.reject(error);
    }

    /* ========================================================
       ORIGINAL REQUEST
    ======================================================== */

    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    const status = error.response?.status;
    const is401 = status === 401;

    const requestUrl = originalRequest?.url ?? "";

    const isRefreshRequest =
      requestUrl.includes("/auth/request-access-token");

    /* ========================================================
       ACCESS TOKEN EXPIRED
    ======================================================== */

    if (
      is401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      console.log(
        "========== ACCESS TOKEN EXPIRED ==========",
      );

      console.log("Attempting token refresh...");

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        console.log("Token refresh successful.");
        console.log("Retrying original request.");

        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );

        console.log(
          "==========================================",
        );

        return axiosInstance(originalRequest);
      }

      console.warn("Token refresh failed.");
      console.warn("Session has been cleared.");

      console.log(
        "==========================================",
      );
    }

    /* ========================================================
       ERROR INFORMATION
    ======================================================== */

    const responseData = getErrorResponseData(error);

    const backendMessage =
      responseData?.message ??
      responseData?.error ??
      null;

    console.error("========== API ERROR ==========");

    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);

    console.error(
      "Full URL:",
      `${error.config?.baseURL ?? ""}${error.config?.url ?? ""}`,
    );

    console.error(
      "Method:",
      error.config?.method?.toUpperCase(),
    );

    console.error("Backend message:", backendMessage);
    console.error("Backend response:", error.response?.data);

    // Do not print authentication request bodies or credentials.
    console.error(
      "Request headers:",
      {
        hasAuthorization: Boolean(
          error.config?.headers?.["Authorization"],
        ),

        hasDeviceId: Boolean(
          error.config?.headers?.["X-Device-Id"],
        ),

        hasRefreshHeader: Boolean(
          error.config?.headers?.["X-Refresh-Token"],
        ),
      },
    );

    console.error("Is Axios error:", axios.isAxiosError(error));

    console.error("================================");

    return Promise.reject(error);
  },
);

/* ============================================================
   API ALIAS
============================================================ */

export const api = axiosInstance;

export const apiClient = axiosInstance;


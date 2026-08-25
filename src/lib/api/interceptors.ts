



// import type {
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from "axios";

// import { axiosInstance } from "./axios";
// import { getAccessToken } from "@/lib/auth/token";
// import { getDeviceId } from "@/lib/auth/device";

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = getAccessToken();
//     const deviceId = getDeviceId();

//     console.log("========== API REQUEST ==========");
//     console.log("URL:", config.url);

//     console.log(
//       "Has access token:",
//       !!token,
//     );

//     console.log(
//       "Token preview:",
//       token
//         ? `${token.substring(0, 20)}...`
//         : null,
//     );

//     console.log(
//       "Device ID:",
//       deviceId,
//     );

//     /*
//      * ACCESS TOKEN
//      */
//     if (token) {
//   config.headers.Authorization = `Bearer ${token}`;

//   console.log(
//     "Authorization attached:",
//     !!config.headers.Authorization
//   );
// } else {
//   console.log(
//     "No access token — public request."
//   );
// }

//     /*
//      * DEVICE ID
//      */
//     if (deviceId) {
//       config.headers["X-Device-Id"] =
//         deviceId;

//       console.log(
//         "Device ID attached:",
//         !!config.headers["X-Device-Id"],
//       );
//     } else {
//       console.warn(
//         "⚠️ NO DEVICE ID AVAILABLE",
//       );
//     }

//     return config;
//   },

//   (error) => {
//     return Promise.reject(error);
//   },
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,

//   async (error: AxiosError) => {
//     console.error(
//       "========== API ERROR ==========",
//     );

//     console.error(
//       "URL:",
//       error.config?.url,
//     );

//     console.error(
//       "Status:",
//       error.response?.status,
//     );

//     console.error(
//       "Response:",
//       error.response?.data,
//     );

//     return Promise.reject(error);
//   },
// );

// export {};

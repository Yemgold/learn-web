import { apiClient } from "@/lib/api";

import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from "@/types";

export const authService = {
  login(payload: LoginRequest) {
    return apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload
    );
  },

  forceSwitch(payload: LoginRequest) {
    return apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/force-switch",
      payload
    );
  },

  register(payload: RegisterRequest) {
    return apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      payload
    );
  },

  forgotPassword(payload: ForgotPasswordRequest) {
    return apiClient.post<ApiResponse<null>>(
      "/auth/forgot-password",
      payload
    );
  },

  resetPassword(payload: ResetPasswordRequest) {
    return apiClient.post<ApiResponse<null>>(
      "/auth/reset-password",
      payload
    );
  },

  verifyEmail(token: string) {
    return apiClient.post<ApiResponse<null>>(
      "/auth/verify-email",
      { token }
    );
  },

  resendVerification(email: string) {
    return apiClient.post<ApiResponse<null>>(
      "/auth/resend-verification",
      { email }
    );
  },

  logout() {
    return apiClient.post<ApiResponse<null>>(
      "/auth/logout"
    );
  },

  refresh() {
    return apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/refresh"
    );
  },

  me() {
    return apiClient.get<ApiResponse<User>>(
      "/auth/me"
    );
  },
};




// import { apiClient } from "@/lib/api";

// import type {
//   ApiResponse,
//   AuthResponse,
//   LoginRequest,
//   RegisterRequest,
//   ForgotPasswordRequest,
//   ResetPasswordRequest,
//   User,
// } from "@/types";

// export const authService = {
//   login(payload: LoginRequest) {
//     return apiClient.post<ApiResponse<AuthResponse>>(
//       "/auth/login",
//       payload
//     );
//   },

//   register(payload: RegisterRequest) {
//     return apiClient.post<ApiResponse<AuthResponse>>(
//       "/auth/register",
//       payload
//     );
//   },

//   forgotPassword(payload: ForgotPasswordRequest) {
//     return apiClient.post<ApiResponse<null>>(
//       "/auth/forgot-password",
//       payload
//     );
//   },

//   resetPassword(payload: ResetPasswordRequest) {
//     return apiClient.post<ApiResponse<null>>(
//       "/auth/reset-password",
//       payload
//     );
//   },

//   verifyEmail(token: string) {
//     return apiClient.post<ApiResponse<null>>(
//       "/auth/verify-email",
//       { token }
//     );
//   },

//   resendVerification(email: string) {
//     return apiClient.post<ApiResponse<null>>(
//       "/auth/resend-verification",
//       { email }
//     );
//   },

//   logout() {
//     return apiClient.post<ApiResponse<null>>(
//       "/auth/logout"
//     );
//   },

//   refresh() {
//     return apiClient.post<ApiResponse<AuthResponse>>(
//       "/auth/refresh"
//     );
//   },

//   me() {
//     return apiClient.get<ApiResponse<User>>(
//       "/auth/me"
//     );
//   },
// };
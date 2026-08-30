
// src/lib/auth/token.ts

const ACCESS_TOKEN_KEY = "jamb_access_token";
const REFRESH_TOKEN_KEY = "jamb_refresh_token";

let accessToken: string | null = null;
let refreshToken: string | null = null;

/* ============================================================
   ACCESS TOKEN
   ============================================================ */

export function setAccessToken(
  token: string | null,
): void {
  accessToken = token;

  if (typeof window !== "undefined") {
    if (token) {
      sessionStorage.setItem(
        ACCESS_TOKEN_KEY,
        token,
      );
    } else {
      sessionStorage.removeItem(
        ACCESS_TOKEN_KEY,
      );
    }
  }
}

export function getAccessToken(): string | null {
  if (accessToken) {
    return accessToken;
  }

  if (typeof window !== "undefined") {
    const storedToken =
      sessionStorage.getItem(
        ACCESS_TOKEN_KEY,
      );

    if (storedToken) {
      accessToken = storedToken;

      return storedToken;
    }
  }

  return null;
}

export function clearAccessToken(): void {
  accessToken = null;

  if (typeof window !== "undefined") {
    sessionStorage.removeItem(
      ACCESS_TOKEN_KEY,
    );
  }
}

export function hasAccessToken(): boolean {
  return !!getAccessToken();
}

export function restoreAccessToken(): string | null {
  return getAccessToken();
}

/* ============================================================
   REFRESH TOKEN
   ============================================================ */

export function setRefreshToken(
  token: string | null,
): void {
  refreshToken = token;

  if (typeof window !== "undefined") {
    if (token) {
      sessionStorage.setItem(
        REFRESH_TOKEN_KEY,
        token,
      );
    } else {
      sessionStorage.removeItem(
        REFRESH_TOKEN_KEY,
      );
    }
  }
}

export function getRefreshToken(): string | null {
  if (refreshToken) {
    return refreshToken;
  }

  if (typeof window !== "undefined") {
    const storedToken =
      sessionStorage.getItem(
        REFRESH_TOKEN_KEY,
      );

    if (storedToken) {
      refreshToken = storedToken;

      return storedToken;
    }
  }

  return null;
}

export function clearRefreshToken(): void {
  refreshToken = null;

  if (typeof window !== "undefined") {
    sessionStorage.removeItem(
      REFRESH_TOKEN_KEY,
    );
  }
}

/* ============================================================
   CLEAR ALL TOKENS
   ============================================================ */

export function clearTokens(): void {
  clearAccessToken();
  clearRefreshToken();
}





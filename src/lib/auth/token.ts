// src/lib/auth/token.ts

const ACCESS_TOKEN_KEY = "jamb_access_token";

let accessToken: string | null = null;

/* ============================================================
   SET ACCESS TOKEN
   ============================================================ */

export function setAccessToken(token: string | null): void {
  accessToken = token;

  /*
   * Keep the token in memory for fast access.
   *
   * Also persist it in sessionStorage so that navigating/
   * reloading the application does not immediately lose the
   * token.
   */
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

/* ============================================================
   GET ACCESS TOKEN
   ============================================================ */

export function getAccessToken(): string | null {
  /*
   * First use the in-memory token.
   */
  if (accessToken) {
    return accessToken;
  }

  /*
   * If the in-memory token is missing, recover it from
   * sessionStorage.
   */
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

/* ============================================================
   CLEAR ACCESS TOKEN
   ============================================================ */

export function clearAccessToken(): void {
  accessToken = null;

  if (typeof window !== "undefined") {
    sessionStorage.removeItem(
      ACCESS_TOKEN_KEY,
    );
  }
}

/* ============================================================
   HAS ACCESS TOKEN
   ============================================================ */

export function hasAccessToken(): boolean {
  return !!getAccessToken();
}

/* ============================================================
   RESTORE ACCESS TOKEN
   ============================================================ */

export function restoreAccessToken(): string | null {
  return getAccessToken();
}




// // src/lib/auth/token.ts

// let accessToken: string | null = null;

// /**
//  * Store access token in memory.
//  */
// export function setAccessToken(
//   token: string | null
// ): void {
//   accessToken = token;
// }

// /**
//  * Retrieve access token.
//  */
// export function getAccessToken(): string | null {
//   return accessToken;
// }

// /**
//  * Clear access token.
//  */
// export function clearAccessToken(): void {
//   accessToken = null;
// }

// /**
//  * Check authentication state.
//  */
// export function hasAccessToken(): boolean {
//   return !!accessToken;
// }
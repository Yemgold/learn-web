





// "use client";

// import {
//   ReactNode,
//   useEffect,
//   useState,
// } from "react";

// import { useAuthStore } from "@/stores";
// import { requestAccessToken } from "@/lib/api/auth";
// import { clearTokens } from "@/lib/auth/token";

// interface Props {
//   children: ReactNode;
// }

// export default function AuthProvider({
//   children,
// }: Props) {
//   const hydrate = useAuthStore(
//     (state) => state.hydrate,
//   );

//   const isHydrated = useAuthStore(
//     (state) => state.isHydrated,
//   );

//   const refreshToken = useAuthStore(
//     (state) => state.refreshToken,
//   );

//   const updateAccessToken = useAuthStore(
//     (state) => state.updateAccessToken,
//   );

//   const [isRestoringSession, setIsRestoringSession] =
//     useState(true);

//   /* ============================================================
//      INITIAL HYDRATION
//      ============================================================ */

//   useEffect(() => {
//     hydrate();
//   }, [hydrate]);

//   /* ============================================================
//      RESTORE SESSION
//      ============================================================ */

//   useEffect(() => {
//     if (!isHydrated) {
//       return;
//     }

//     let cancelled = false;

//     const restoreSession = async () => {
//       /*
//        * We are done restoring immediately if there is
//        * no persisted refresh token.
//        */
//       if (!refreshToken) {
//         console.log(
//           "========== AUTH RESTORE ==========",
//         );

//         console.log(
//           "No refresh token available.",
//         );

//         console.log(
//           "No existing session to restore.",
//         );

//         console.log(
//           "=================================",
//         );

//         if (!cancelled) {
//           setIsRestoringSession(false);
//         }

//         return;
//       }

//       try {
//         console.log(
//           "========== AUTH RESTORE ==========",
//         );

//         console.log(
//           "Refresh token available:",
//           true,
//         );

//         /*
//          * Request a fresh access token.
//          *
//          * requestAccessToken() sends:
//          *
//          * X-Refresh-Token
//          * X-Device-Id
//          */
//         const response =
//           await requestAccessToken(
//             refreshToken,
//           );

//         console.log(
//           "REFRESH RESPONSE:",
//           response,
//         );

//         /*
//          * Expected backend response:
//          *
//          * {
//          *   success: true,
//          *   message: "...",
//          *   data: {
//          *     accessToken: "..."
//          *   }
//          * }
//          */
//         const newAccessToken =
//           response?.data?.accessToken;

//         if (!newAccessToken) {
//           console.error(
//             "❌ REFRESH SUCCEEDED BUT NO ACCESS TOKEN WAS RETURNED",
//           );

//           /*
//            * Treat an invalid response as a failed
//            * authentication restoration.
//            */
//           clearTokens();

//           return;
//         }

//         if (cancelled) {
//           return;
//         }

//         /*
//          * Store the fresh access token.
//          */
//         updateAccessToken(
//           newAccessToken,
//         );

//         console.log(
//           "✅ NEW ACCESS TOKEN STORED",
//         );

//         console.log(
//           "=================================",
//         );
//       } catch (error: unknown) {
//         /*
//          * A 401 here means the persisted refresh token
//          * is no longer usable.
//          */
//         const status =
//           typeof error === "object" &&
//           error !== null &&
//           "response" in error
//             ? (
//                 error as {
//                   response?: {
//                     status?: number;
//                   };
//                 }
//               ).response?.status
//             : undefined;

//         console.error(
//           "========== AUTH RESTORE FAILED ==========",
//         );

//         console.error(
//           "Refresh request failed:",
//           error,
//         );

//         console.error(
//           "Refresh status:",
//           status,
//         );

//         if (status === 401) {
//           console.warn(
//             "❌ STORED REFRESH TOKEN IS NO LONGER VALID.",
//           );

//           console.warn(
//             "Clearing stale authentication state.",
//           );

//           /*
//            * Remove stale access/refresh tokens.
//            *
//            * This prevents AuthProvider from repeatedly
//            * trying the same invalid refresh token.
//            */
//           clearTokens();
//         }

//         console.error(
//           "==========================================",
//         );
//       } finally {
//         if (!cancelled) {
//           setIsRestoringSession(false);
//         }
//       }
//     };

//     restoreSession();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     isHydrated,
//     refreshToken,
//     updateAccessToken,
//   ]);

//   /* ============================================================
//      WAIT FOR AUTH RESTORATION
//      ============================================================ */

//   if (
//     !isHydrated ||
//     isRestoringSession
//   ) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <div className="text-white text-sm">
//           Restoring session...
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }













// src/providers/AuthProvider.tsx

"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import { useAuthStore } from "@/stores";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({
  children,
}: Props) {
  const hydrate =
    useAuthStore(
      (state) => state.hydrate,
    );

  const isHydrated =
    useAuthStore(
      (state) => state.isHydrated,
    );

  const clear =
    useAuthStore(
      (state) => state.clear,
    );

  /* ============================================================
     INITIAL HYDRATION
     ============================================================ */

  useEffect(() => {
    console.log(
      "========== AUTH PROVIDER ==========",
    );

    console.log(
      "Hydrating authentication state...",
    );

    hydrate();
  }, [hydrate]);

  /* ============================================================
     SESSION EXPIRED EVENT
     ============================================================ */

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const handleSessionExpired =
      () => {
        console.warn(
          "========== AUTH SESSION EXPIRED ==========",
        );

        console.warn(
          "Axios could not refresh the access token.",
        );

        console.warn(
          "Clearing Zustand authentication state.",
        );

        clear();

        console.warn(
          "==========================================",
        );
      };

    window.addEventListener(
      "jamb:auth-session-expired",
      handleSessionExpired,
    );

    return () => {
      window.removeEventListener(
        "jamb:auth-session-expired",
        handleSessionExpired,
      );
    };
  }, [clear]);

  /* ============================================================
     WAIT FOR INITIAL HYDRATION
     ============================================================ */

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-sm">
          Restoring session...
        </div>
      </div>
    );
  }

  /* ============================================================
     APPLICATION
     ============================================================ */

  return <>{children}</>;
}



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
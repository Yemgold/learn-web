


"use client";

import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  useEffect(() => {
    // TODO:
    // Restore session
    // Fetch current user
    // Refresh expired access token
  }, []);

  return <>{children}</>;
}
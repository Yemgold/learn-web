



"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";
import type {
  SchoolMembershipRole,
  MemberStatus,
} from "@/types/schools";

export interface SchoolAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface SchoolAuthMembership {
  id: string;
  role: SchoolMembershipRole;
  status: MemberStatus;
  schoolId?: string;
}

interface SchoolAuthContextValue {
  user: SchoolAuthUser | null;
  membership: SchoolAuthMembership | null;
  role: SchoolMembershipRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: SchoolAuthUser | null) => void;
  setMembership: (membership: SchoolAuthMembership | null) => void;
  setIsLoading: (loading: boolean) => void;
  setAuth: (
    user: SchoolAuthUser | null,
    membership: SchoolAuthMembership | null
  ) => void;
  clearAuth: () => void;
}

interface SchoolAuthProviderProps {
  children: ReactNode;
  initialUser?: SchoolAuthUser | null;
  initialMembership?: SchoolAuthMembership | null;
  initialLoading?: boolean;
}

const SchoolAuthContext = createContext<
  SchoolAuthContextValue | undefined
>(undefined);

export function SchoolAuthProvider({
  children,
  initialUser = null,
  initialMembership = null,
  initialLoading = false,
}: SchoolAuthProviderProps) {
  const [user, setUser] = useState<SchoolAuthUser | null>(initialUser);

  const [membership, setMembership] =
    useState<SchoolAuthMembership | null>(initialMembership);

  const [isLoading, setIsLoading] = useState(initialLoading);

  const role = membership?.role ?? null;

  const setAuth = useCallback(
    (
      nextUser: SchoolAuthUser | null,
      nextMembership: SchoolAuthMembership | null
    ) => {
      setUser(nextUser);
      setMembership(nextMembership);
    },
    []
  );

  const clearAuth = useCallback(() => {
    setUser(null);
    setMembership(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      membership,
      role,
      isAuthenticated: Boolean(user && membership),
      isLoading,
      setUser,
      setMembership,
      setIsLoading,
      setAuth,
      clearAuth,
    }),
    [user, membership, role, isLoading, setAuth, clearAuth]
  );

  return (
    <SchoolAuthContext.Provider value={value}>
      {children}
    </SchoolAuthContext.Provider>
  );
}

export function useSchoolAuth() {
  const context = useContext(SchoolAuthContext);

  if (!context) {
    throw new Error(
      "useSchoolAuth must be used within a SchoolAuthProvider."
    );
  }

  return context;
}
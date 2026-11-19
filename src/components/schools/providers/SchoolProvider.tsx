




"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { SchoolProfile } from "@/types/schools";

interface SchoolContextValue {
  school: SchoolProfile | null;
  isLoading: boolean;
  error: string | null;
  setSchool: (school: SchoolProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshSchool: () => Promise<void>;
}

interface SchoolProviderProps {
  children: ReactNode;
  initialSchool?: SchoolProfile | null;
  initialLoading?: boolean;
  onRefresh?: () => Promise<SchoolProfile | null>;
}

const SchoolContext = createContext<SchoolContextValue | undefined>(
  undefined
);

export function SchoolProvider({
  children,
  initialSchool = null,
  initialLoading = false,
  onRefresh,
}: SchoolProviderProps) {
  const [school, setSchool] = useState<SchoolProfile | null>(initialSchool);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const refreshSchool = useCallback(async () => {
    if (!onRefresh) return;

    try {
      setIsLoading(true);
      setError(null);

      const updatedSchool = await onRefresh();

      setSchool(updatedSchool);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh school information."
      );
    } finally {
      setIsLoading(false);
    }
  }, [onRefresh]);

  const value = useMemo(
    () => ({
      school,
      isLoading,
      error,
      setSchool,
      setIsLoading,
      setError,
      refreshSchool,
    }),
    [school, isLoading, error, refreshSchool]
  );

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);

  if (!context) {
    throw new Error("useSchool must be used within a SchoolProvider.");
  }

  return context;
}
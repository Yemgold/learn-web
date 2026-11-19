




"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

export interface SchoolTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  fontFamily?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  mode?: "light" | "dark" | "system";
}

const DEFAULT_SCHOOL_THEME: SchoolTheme = {
  primaryColor: "#2563EB",
  secondaryColor: "#1E40AF",
  accentColor: "#F59E0B",
  backgroundColor: "#F8FAFC",
  textColor: "#0F172A",
  borderRadius: "md",
  mode: "light",
};

interface SchoolThemeContextValue {
  theme: SchoolTheme;
  setTheme: (theme: SchoolTheme) => void;
  updateTheme: (updates: Partial<SchoolTheme>) => void;
  resetTheme: () => void;
}

interface SchoolThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<SchoolTheme>;
}

const SchoolThemeContext = createContext<
  SchoolThemeContextValue | undefined
>(undefined);

export function SchoolThemeProvider({
  children,
  initialTheme,
}: SchoolThemeProviderProps) {
  const [theme, setTheme] = useState<SchoolTheme>({
    ...DEFAULT_SCHOOL_THEME,
    ...initialTheme,
  });

  const updateTheme = (updates: Partial<SchoolTheme>) => {
    setTheme((currentTheme) => ({
      ...currentTheme,
      ...updates,
    }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_SCHOOL_THEME);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      updateTheme,
      resetTheme,
    }),
    [theme]
  );

  return (
    <SchoolThemeContext.Provider value={value}>
      {children}
    </SchoolThemeContext.Provider>
  );
}

export function useSchoolTheme() {
  const context = useContext(SchoolThemeContext);

  if (!context) {
    throw new Error(
      "useSchoolTheme must be used within a SchoolThemeProvider."
    );
  }

  return context;
}
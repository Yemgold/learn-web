





"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

export interface SchoolSettings {
  academicSession: string;
  currentTerm: "FIRST" | "SECOND" | "THIRD" | null;
  timezone: string;
  currency: string;
  locale: string;
  gradingScale: {
    grade: string;
    minimumScore: number;
    maximumScore: number;
  }[];
  passMark: number;
  allowStudentResults: boolean;
  allowStudentAssessmentHistory: boolean;
  enableNotifications: boolean;
  enableEmailNotifications: boolean;
}

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  academicSession: "",
  currentTerm: null,
  timezone: "Africa/Lagos",
  currency: "NGN",
  locale: "en-NG",
  gradingScale: [
    { grade: "A", minimumScore: 70, maximumScore: 100 },
    { grade: "B", minimumScore: 60, maximumScore: 69 },
    { grade: "C", minimumScore: 50, maximumScore: 59 },
    { grade: "D", minimumScore: 45, maximumScore: 49 },
    { grade: "E", minimumScore: 40, maximumScore: 44 },
    { grade: "F", minimumScore: 0, maximumScore: 39 },
  ],
  passMark: 40,
  allowStudentResults: true,
  allowStudentAssessmentHistory: true,
  enableNotifications: true,
  enableEmailNotifications: true,
};

interface SchoolSettingsContextValue {
  settings: SchoolSettings;
  setSettings: (settings: SchoolSettings) => void;
  updateSettings: (updates: Partial<SchoolSettings>) => void;
  resetSettings: () => void;
}

interface SchoolSettingsProviderProps {
  children: ReactNode;
  initialSettings?: Partial<SchoolSettings>;
}

const SchoolSettingsContext = createContext<
  SchoolSettingsContextValue | undefined
>(undefined);

export function SchoolSettingsProvider({
  children,
  initialSettings,
}: SchoolSettingsProviderProps) {
  const [settings, setSettings] = useState<SchoolSettings>({
    ...DEFAULT_SCHOOL_SETTINGS,
    ...initialSettings,
    gradingScale:
      initialSettings?.gradingScale ??
      DEFAULT_SCHOOL_SETTINGS.gradingScale,
  });

  const updateSettings = (updates: Partial<SchoolSettings>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...updates,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SCHOOL_SETTINGS);
  };

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      updateSettings,
      resetSettings,
    }),
    [settings]
  );

  return (
    <SchoolSettingsContext.Provider value={value}>
      {children}
    </SchoolSettingsContext.Provider>
  );
}

export function useSchoolSettings() {
  const context = useContext(SchoolSettingsContext);

  if (!context) {
    throw new Error(
      "useSchoolSettings must be used within a SchoolSettingsProvider."
    );
  }

  return context;
}
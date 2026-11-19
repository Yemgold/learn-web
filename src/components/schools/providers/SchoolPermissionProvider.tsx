




"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

import type { ReactNode } from "react";
import type { SchoolMembershipRole } from "@/types/schools";

import { useSchoolAuth } from "./SchoolAuthProvider";

export type SchoolPermission =
  | "school.view"
  | "school.update"
  | "school.delete"
  | "school.manage_settings"
  | "members.view"
  | "members.create"
  | "members.update"
  | "members.delete"
  | "members.manage_admins"
  | "classes.view"
  | "classes.manage"
  | "subjects.view"
  | "subjects.manage"
  | "enrollments.view"
  | "enrollments.manage"
  | "assignments.view"
  | "assignments.manage"
  | "questions.view"
  | "questions.create"
  | "questions.update"
  | "questions.delete"
  | "assessments.view"
  | "assessments.create"
  | "assessments.update"
  | "assessments.delete"
  | "assessments.take"
  | "results.view"
  | "reports.view"
  | "access.manage"
  | "subscriptions.manage";

type PermissionMap = Record<
  SchoolPermission,
  SchoolMembershipRole[]
>;

const DEFAULT_PERMISSIONS: PermissionMap = {
  "school.view": ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
  "school.update": ["OWNER", "ADMIN"],
  "school.delete": ["OWNER"],
  "school.manage_settings": ["OWNER", "ADMIN"],

  "members.view": ["OWNER", "ADMIN", "TEACHER"],
  "members.create": ["OWNER", "ADMIN"],
  "members.update": ["OWNER", "ADMIN"],
  "members.delete": ["OWNER", "ADMIN"],
  "members.manage_admins": ["OWNER"],

  "classes.view": ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
  "classes.manage": ["OWNER", "ADMIN"],

  "subjects.view": ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
  "subjects.manage": ["OWNER", "ADMIN"],

  "enrollments.view": ["OWNER", "ADMIN", "TEACHER"],
  "enrollments.manage": ["OWNER", "ADMIN"],

  "assignments.view": ["OWNER", "ADMIN", "TEACHER"],
  "assignments.manage": ["OWNER", "ADMIN"],

  "questions.view": ["OWNER", "ADMIN", "TEACHER"],
  "questions.create": ["OWNER", "ADMIN", "TEACHER"],
  "questions.update": ["OWNER", "ADMIN", "TEACHER"],
  "questions.delete": ["OWNER", "ADMIN"],

  "assessments.view": ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
  "assessments.create": ["OWNER", "ADMIN", "TEACHER"],
  "assessments.update": ["OWNER", "ADMIN", "TEACHER"],
  "assessments.delete": ["OWNER", "ADMIN"],
  "assessments.take": ["STUDENT"],

  "results.view": ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
  "reports.view": ["OWNER", "ADMIN", "TEACHER"],

  "access.manage": ["OWNER", "ADMIN"],
  "subscriptions.manage": ["OWNER"],
};

interface SchoolPermissionContextValue {
  can: (permission: SchoolPermission) => boolean;
  canAny: (permissions: SchoolPermission[]) => boolean;
  canAll: (permissions: SchoolPermission[]) => boolean;
  hasRole: (roles: SchoolMembershipRole[]) => boolean;
  permissions: PermissionMap;
}

interface SchoolPermissionProviderProps {
  children: ReactNode;
  customPermissions?: Partial<PermissionMap>;
}

const SchoolPermissionContext = createContext<
  SchoolPermissionContextValue | undefined
>(undefined);

export function SchoolPermissionProvider({
  children,
  customPermissions,
}: SchoolPermissionProviderProps) {
  const { role, membership } = useSchoolAuth();

  const permissions = useMemo<PermissionMap>(
    () => ({
      ...DEFAULT_PERMISSIONS,
      ...customPermissions,
    }),
    [customPermissions]
  );

  const isActiveMember = membership?.status === "ACTIVE";

  const can = useCallback(
    (permission: SchoolPermission) => {
      if (!role || !isActiveMember) return false;

      return permissions[permission].includes(role);
    },
    [role, isActiveMember, permissions]
  );

  const canAny = useCallback(
    (requestedPermissions: SchoolPermission[]) =>
      requestedPermissions.some(can),
    [can]
  );

  const canAll = useCallback(
    (requestedPermissions: SchoolPermission[]) =>
      requestedPermissions.every(can),
    [can]
  );

  const hasRole = useCallback(
    (roles: SchoolMembershipRole[]) =>
      Boolean(role && isActiveMember && roles.includes(role)),
    [role, isActiveMember]
  );

  const value = useMemo(
    () => ({
      can,
      canAny,
      canAll,
      hasRole,
      permissions,
    }),
    [can, canAny, canAll, hasRole, permissions]
  );

  return (
    <SchoolPermissionContext.Provider value={value}>
      {children}
    </SchoolPermissionContext.Provider>
  );
}

export function useSchoolPermissions() {
  const context = useContext(SchoolPermissionContext);

  if (!context) {
    throw new Error(
      "useSchoolPermissions must be used within a SchoolPermissionProvider."
    );
  }

  return context;
}
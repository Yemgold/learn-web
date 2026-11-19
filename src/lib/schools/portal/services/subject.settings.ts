



import { apiClient } from "@/lib/api";

export interface SchoolNotificationSettings {
  emailNotifications: boolean;
  enrollmentNotifications: boolean;
  resultNotifications: boolean;
  announcementNotifications: boolean;
}

export interface SchoolSettings {
  academicYear: string;
  currentTerm: string;
  timezone: string;
  dateFormat: string;
  notifications: SchoolNotificationSettings;
}

export type UpdateSchoolSettingsPayload = Partial<
  Omit<SchoolSettings, "notifications">
> & {
  notifications?: Partial<SchoolNotificationSettings>;
};

export const defaultSchoolSettings: SchoolSettings = {
  academicYear: "",
  currentTerm: "",
  timezone: "Africa/Lagos",
  dateFormat: "DD/MM/YYYY",
  notifications: {
    emailNotifications: true,
    enrollmentNotifications: true,
    resultNotifications: true,
    announcementNotifications: true,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  let result = value;

  for (let i = 0; i < 3; i++) {
    if (!isRecord(result) || !("data" in result)) break;
    result = result.data;
  }

  return result;
}

export function normalizeSchoolSettings(value: unknown): SchoolSettings {
  const result = unwrapResponse(value);

  if (!isRecord(result)) return defaultSchoolSettings;

  const notifications = isRecord(result.notifications)
    ? result.notifications
    : {};

  return {
    academicYear: String(result.academicYear ?? ""),
    currentTerm: String(result.currentTerm ?? ""),
    timezone: String(result.timezone ?? "Africa/Lagos"),
    dateFormat: String(result.dateFormat ?? "DD/MM/YYYY"),
    notifications: {
      emailNotifications:
        typeof notifications.emailNotifications === "boolean"
          ? notifications.emailNotifications
          : true,
      enrollmentNotifications:
        typeof notifications.enrollmentNotifications === "boolean"
          ? notifications.enrollmentNotifications
          : true,
      resultNotifications:
        typeof notifications.resultNotifications === "boolean"
          ? notifications.resultNotifications
          : true,
      announcementNotifications:
        typeof notifications.announcementNotifications === "boolean"
          ? notifications.announcementNotifications
          : true,
    },
  };
}

export async function getSchoolSettings(): Promise<SchoolSettings> {
  const response: unknown = await apiClient.get("/schools/settings");
  return normalizeSchoolSettings(response);
}

export async function updateSchoolSettings(
  payload: UpdateSchoolSettingsPayload
): Promise<SchoolSettings> {
  const response: unknown = await apiClient.patch(
    "/schools/settings",
    payload
  );

  return normalizeSchoolSettings(response);
}








import { apiClient } from "@/lib/api";

export type SchoolAccessMode =
  | "STUDENT_PIN"
  | "SCHOOL_SUBSCRIPTION";

export interface SchoolAccess {
  mode: SchoolAccessMode;
  isActive: boolean;
  requiresPin: boolean;
  requiresSubscription: boolean;
  message: string;
}

export interface AccessPin {
  id: string;
  pin: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string | null;
}

export interface GenerateAccessPinPayload {
  usageLimit: number;
  validityDays: number;
}

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

function normalizeAccess(value: unknown): SchoolAccess {
  const result = unwrapResponse(value);

  if (!isRecord(result)) {
    return {
      mode: "STUDENT_PIN",
      isActive: false,
      requiresPin: true,
      requiresSubscription: false,
      message: "",
    };
  }

  const mode =
    result.mode === "SCHOOL_SUBSCRIPTION"
      ? "SCHOOL_SUBSCRIPTION"
      : "STUDENT_PIN";

  return {
    mode,
    isActive: Boolean(result.isActive ?? result.active),
    requiresPin: Boolean(result.requiresPin ?? mode === "STUDENT_PIN"),
    requiresSubscription: Boolean(
      result.requiresSubscription ?? mode === "SCHOOL_SUBSCRIPTION"
    ),
    message: String(result.message ?? ""),
  };
}

function normalizePin(value: unknown): AccessPin | null {
  if (!isRecord(value)) return null;

  return {
    id: String(value.id ?? value._id ?? ""),
    pin: String(value.pin ?? value.code ?? ""),
    usageLimit: Number(value.usageLimit ?? 0),
    usageCount: Number(value.usageCount ?? value.usedCount ?? 0),
    isActive: Boolean(value.isActive ?? value.active),
    expiresAt: value.expiresAt ? String(value.expiresAt) : null,
    createdAt: value.createdAt ? String(value.createdAt) : null,
  };
}

function normalizePins(value: unknown): AccessPin[] {
  const result = unwrapResponse(value);

  const records = Array.isArray(result)
    ? result
    : isRecord(result) && Array.isArray(result.pins)
      ? result.pins
      : [];

  return records
    .map(normalizePin)
    .filter((pin): pin is AccessPin => pin !== null);
}

export async function getSchoolAccess(): Promise<SchoolAccess> {
  const response: unknown = await apiClient.get("/schools/access");
  return normalizeAccess(response);
}

export async function getSchoolAccessPins(): Promise<AccessPin[]> {
  const response: unknown = await apiClient.get("/schools/access/pins");
  return normalizePins(response);
}

export async function generateSchoolAccessPin(
  payload: GenerateAccessPinPayload
): Promise<AccessPin | null> {
  const response: unknown = await apiClient.post(
    "/schools/access/pins",
    payload
  );

  const result = unwrapResponse(response);

  if (isRecord(result) && "pin" in result) {
    return normalizePin(result);
  }

  return normalizePin(result);
}

export async function updateSchoolAccessPinStatus(
  pinId: string,
  isActive: boolean
): Promise<unknown> {
  return apiClient.patch(
    `/schools/access/pins/${encodeURIComponent(pinId)}/status`,
    { isActive }
  );
}

export async function deactivateSchoolAccessPin(
  pinId: string
): Promise<unknown> {
  return updateSchoolAccessPinStatus(pinId, false);
}

export async function activateSchoolAccessPin(
  pinId: string
): Promise<unknown> {
  return updateSchoolAccessPinStatus(pinId, true);
}

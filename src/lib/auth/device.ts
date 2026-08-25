



const STORAGE_KEY = "klazik_device_id";

/**
 * Get or create the browser device ID.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "server-device";
  }

  const existingId = localStorage.getItem(STORAGE_KEY);

  if (existingId) {
    return existingId;
  }

  const newId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}`;

  localStorage.setItem(STORAGE_KEY, newId);

  return newId;
}
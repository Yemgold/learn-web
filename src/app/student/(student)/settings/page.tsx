






"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Bell,
  Check,
  Globe,
  Lock,
  LogOut,
  Moon,
  Save,
  Shield,
  Smartphone,
  Sun,
  UserCog,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { axiosInstance as api } from "@/lib/api/axios";
import { clearAccessToken } from "@/lib/auth/token";

interface Settings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  competitionReminders: boolean;
  darkMode: boolean;
  language: string;
}

interface UserSession {
  _id?: string;
  id?: string;
  deviceName?: string;
  device?: string;
  userAgent?: string;
  createdAt?: string;
  lastActive?: string;
  current?: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  emailNotifications: true,
  pushNotifications: true,
  competitionReminders: true,
  darkMode: false,
  language: "en",
};

const SETTINGS_ENDPOINT = "/users/me/settings";
const SESSIONS_ENDPOINT = "/users/me/sessions";
const CHANGE_PASSWORD_ENDPOINT = "/users/me/change-password";

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return data?.message || data?.error || fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

function extractSettings(responseData: unknown): Partial<Settings> {
  if (!responseData || typeof responseData !== "object") return {};

  const response = responseData as {
    data?: unknown;
    settings?: unknown;
  };

  const candidate =
    response.settings ??
    (response.data &&
    typeof response.data === "object" &&
    "settings" in response.data
      ? (response.data as { settings?: unknown }).settings
      : response.data) ??
    responseData;

  if (!candidate || typeof candidate !== "object") return {};

  const value = candidate as Record<string, unknown>;

  return {
    ...(typeof value.emailNotifications === "boolean" && {
      emailNotifications: value.emailNotifications,
    }),
    ...(typeof value.pushNotifications === "boolean" && {
      pushNotifications: value.pushNotifications,
    }),
    ...(typeof value.competitionReminders === "boolean" && {
      competitionReminders: value.competitionReminders,
    }),
    ...(typeof value.darkMode === "boolean" && {
      darkMode: value.darkMode,
    }),
    ...(typeof value.language === "string" && {
      language: value.language,
    }),
  };
}

function extractSessions(responseData: unknown): UserSession[] {
  if (!responseData || typeof responseData !== "object") return [];

  const response = responseData as {
    data?: unknown;
    sessions?: unknown;
  };

  const data = response.data;

  if (Array.isArray(response.sessions)) {
    return response.sessions as UserSession[];
  }

  if (Array.isArray(data)) {
    return data as UserSession[];
  }

  if (data && typeof data === "object") {
    const nested = data as { sessions?: unknown };

    if (Array.isArray(nested.sessions)) {
      return nested.sessions as UserSession[];
    }
  }

  return [];
}

export default function StudentSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<Settings>(DEFAULT_SETTINGS);
  const [initialSettings, setInitialSettings] =
    useState<Settings>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [settingsEndpointAvailable, setSettingsEndpointAvailable] =
    useState(true);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsMessage, setSessionsMessage] = useState("");
  const [showSessions, setShowSessions] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.get(SETTINGS_ENDPOINT);
      const loaded = {
        ...DEFAULT_SETTINGS,
        ...extractSettings(response.data),
      };

      setSettings(loaded);
      setInitialSettings(loaded);
      setSettingsEndpointAvailable(true);
    } catch (err) {
      const status = axios.isAxiosError(err)
        ? err.response?.status
        : undefined;

      if (status === 404 || status === 405) {
        setSettingsEndpointAvailable(false);
        setSettings(DEFAULT_SETTINGS);
        setInitialSettings(DEFAULT_SETTINGS);
        setError(
          "The settings API is not available yet. Your preferences cannot be saved to your account until the backend endpoint is implemented."
        );
      } else {
        setError(
          getErrorMessage(
            err,
            "Could not load your settings. Please try again."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
    setMessage("");
  };

  const saveSettings = async () => {
    if (!settingsEndpointAvailable) {
      setError(
        "Cannot save yet: implement PATCH /api/v1/users/me/settings on the backend first."
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await api.patch(SETTINGS_ENDPOINT, settings);
      const saved = {
        ...settings,
        ...extractSettings(response.data),
      };

      setSettings(saved);
      setInitialSettings(saved);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "learnyfi-appearance",
          JSON.stringify({
            darkMode: saved.darkMode,
            language: saved.language,
          })
        );

        document.documentElement.classList.toggle(
          "dark",
          saved.darkMode
        );
      }

      setMessage("Your settings have been saved.");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Could not save your settings. Please try again."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setError("");
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      await api.post(CHANGE_PASSWORD_ENDPOINT, {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setMessage(
        "Your password has been changed. If your backend revokes sessions, you may need to sign in again."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Could not change your password. Check the API endpoint and try again."
        )
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const loadSessions = async () => {
    setShowSessions(true);
    setSessionsLoading(true);
    setSessionsMessage("");
    setError("");

    try {
      const response = await api.get(SESSIONS_ENDPOINT);
      setSessions(extractSessions(response.data));

      if (extractSessions(response.data).length === 0) {
        setSessionsMessage(
          "No registered sessions were returned by the server."
        );
      }
    } catch (err) {
      setSessionsMessage(
        getErrorMessage(
          err,
          "Could not load devices. Confirm that the sessions endpoint exists."
        )
      );
    } finally {
      setSessionsLoading(false);
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Clear local credentials even if the server is unavailable.
      console.error("Logout request failed:", err);
    } finally {
      clearAccessToken();

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("jamb_access_token");
        window.sessionStorage.removeItem("jamb_refresh_token");
      }

      router.replace("/auth/login");
      router.refresh();
    }
  };

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        <header className="mb-8">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Student Portal
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Account Settings
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Manage your notifications, appearance, security, and account
            preferences.
          </p>
        </header>

        {(error || message) && (
          <div
            role={error ? "alert" : "status"}
            className={`mb-6 rounded-xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || message}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-52 items-center justify-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your settings...
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-5 sm:p-7">
              <SectionHeading
                icon={<Bell className="h-6 w-6 text-blue-600" />}
                title="Notifications"
                description="Choose which updates you want to receive."
              />

              <div className="mt-6 divide-y divide-slate-100">
                <ToggleItem
                  title="Email Notifications"
                  description="Receive important updates by email."
                  checked={settings.emailNotifications}
                  onChange={(value) =>
                    updateSetting("emailNotifications", value)
                  }
                />

                <ToggleItem
                  title="Push Notifications"
                  description="Receive notifications inside the platform."
                  checked={settings.pushNotifications}
                  onChange={(value) =>
                    updateSetting("pushNotifications", value)
                  }
                />

                <ToggleItem
                  title="Competition Reminders"
                  description="Get reminders before competitions start."
                  checked={settings.competitionReminders}
                  onChange={(value) =>
                    updateSetting("competitionReminders", value)
                  }
                />
              </div>
            </Card>

            <Card className="p-5 sm:p-7">
              <SectionHeading
                icon={
                  settings.darkMode ? (
                    <Moon className="h-6 w-6 text-indigo-600" />
                  ) : (
                    <Sun className="h-6 w-6 text-amber-500" />
                  )
                }
                title="Appearance"
                description="Personalize how Learnyfi looks on this device."
              />

              <div className="mt-6">
                <ToggleItem
                  title="Dark Mode"
                  description="Use your platform's dark theme where supported."
                  checked={settings.darkMode}
                  onChange={(value) => {
                    updateSetting("darkMode", value);

                    if (typeof document !== "undefined") {
                      document.documentElement.classList.toggle(
                        "dark",
                        value
                      );
                    }
                  }}
                />
              </div>

              <div className="mt-5 max-w-sm">
                <label
                  htmlFor="language"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Language
                </label>

                <select
                  id="language"
                  value={settings.language}
                  onChange={(event) =>
                    updateSetting("language", event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="en">English</option>
                  <option value="yo">Yorùbá</option>
                  <option value="ig">Igbo</option>
                  <option value="ha">Hausa</option>
                </select>

                <p className="mt-2 text-xs text-slate-500">
                  Translating the entire platform also requires language
                  support in the application.
                </p>
              </div>
            </Card>

            <Card className="p-5 sm:p-7">
              <SectionHeading
                icon={<Shield className="h-6 w-6 text-green-600" />}
                title="Security"
                description="Protect your account and review your sign-in sessions."
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setShowPasswordForm((previous) => !previous);
                    setError("");
                    setMessage("");
                  }}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="justify-start"
                  onClick={loadSessions}
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Manage Devices
                </Button>
              </div>

              {showPasswordForm && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <h3 className="font-semibold text-slate-900">
                    Change your password
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Use a strong password that you do not use elsewhere.
                  </p>

                  <div className="relative mt-4">
                    <label
                      htmlFor="currentPassword"
                      className="mb-2 block text-sm font-medium"
                    >
                      Current password
                    </label>
                    <input
                      id="currentPassword"
                      type={showPasswords ? "text" : "password"}
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 pr-12 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-medium"
                    >
                      New password
                    </label>
                    <input
                      id="newPassword"
                      type={showPasswords ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 pr-12 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium"
                    >
                      Confirm new password
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 pr-12 outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((previous) => !previous)
                    }
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-700"
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showPasswords ? "Hide passwords" : "Show passwords"}
                  </button>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={changePassword}
                      disabled={changingPassword}
                    >
                      {changingPassword && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Password
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPasswordForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {showSessions && (
                <div className="mt-6 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">
                      Signed-in devices
                    </h3>

                    <button
                      type="button"
                      onClick={loadSessions}
                      aria-label="Refresh device sessions"
                      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>

                  {sessionsLoading ? (
                    <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading sessions...
                    </p>
                  ) : sessions.length ? (
                    <div className="mt-4 space-y-3">
                      {sessions.map((session, index) => (
                        <div
                          key={session._id || session.id || index}
                          className="rounded-lg bg-slate-50 p-3"
                        >
                          <p className="font-medium text-slate-800">
                            {session.deviceName ||
                              session.device ||
                              "Registered device"}
                            {session.current && (
                              <span className="ml-2 text-xs font-semibold text-green-700">
                                Current session
                              </span>
                            )}
                          </p>

                          {session.userAgent && (
                            <p className="mt-1 break-words text-xs text-slate-500">
                              {session.userAgent}
                            </p>
                          )}

                          {session.lastActive && (
                            <p className="mt-1 text-xs text-slate-500">
                              Last active:{" "}
                              {new Date(session.lastActive).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      {sessionsMessage || "No sessions to display."}
                    </p>
                  )}

                  <p className="mt-4 text-xs text-slate-500">
                    This page currently displays sessions only. Revoking
                    another device requires a separate backend endpoint.
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-5 sm:p-7">
              <SectionHeading
                icon={<UserCog className="h-6 w-6 text-purple-600" />}
                title="Account"
                description="Manage your account access."
              />

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start border-red-200 text-red-700 hover:bg-red-50"
                  onClick={logout}
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  {loggingOut ? "Logging out..." : "Log Out"}
                </Button>
              </div>
            </Card>

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                {hasChanges
                  ? "You have unsaved changes."
                  : "Your preferences are up to date."}
              </p>

              <Button
                type="button"
                size="lg"
                onClick={saveSettings}
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionHeading({
  icon,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 shrink-0">{icon}</div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

interface ToggleItemProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleItem({
  title,
  description,
  checked,
  onChange,
}: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-600">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        >
          {checked && <Check className="h-3 w-3 text-blue-600" />}
        </span>
      </button>
    </div>
  );
}

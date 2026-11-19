



"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, RefreshCw, Save, Settings2 } from "lucide-react";

import {
  defaultSchoolSettings,
  getSchoolSettings,
  updateSchoolSettings,
  type SchoolSettings,
} from "@/lib/schools/portal/services/subject.settings";

import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import Button from "@/components/schools/ui/Button";
import LoadingState from "@/components/schools/shared/LoadingState";

export default function SchoolSettingsPage() {
  const [settings, setSettings] =
    useState<SchoolSettings>(defaultSchoolSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getSchoolSettings();
      setSettings(result);
    } catch (err) {
      console.error("Failed to load school settings:", err);
      setError("Unable to load school settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  function updateField<K extends keyof SchoolSettings>(
    key: K,
    value: SchoolSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateNotification(
    key: keyof SchoolSettings["notifications"],
    value: boolean
  ) {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value,
      },
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateSchoolSettings(settings);
      setSettings(updated);
      setSuccess("School settings saved successfully.");
    } catch (err) {
      console.error("Failed to save school settings:", err);
      setError("Unable to save your settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading school settings..." />;
  }

  const notificationOptions: {
    key: keyof SchoolSettings["notifications"];
    label: string;
    description: string;
  }[] = [
    {
      key: "emailNotifications",
      label: "Email notifications",
      description: "Receive school updates through email.",
    },
    {
      key: "enrollmentNotifications",
      label: "Enrollment notifications",
      description: "Get notified when students enroll.",
    },
    {
      key: "resultNotifications",
      label: "Result notifications",
      description: "Receive updates when examination results are published.",
    },
    {
      key: "announcementNotifications",
      label: "Announcement notifications",
      description: "Receive important school announcements.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            School Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your academic and notification preferences.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSettings}
            leftIcon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            leftIcon={<Save size={16} />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 size={19} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">
              Academic Preferences
            </h2>
          </div>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Academic Year
            </label>
            <input
              value={settings.academicYear}
              onChange={(event) =>
                updateField("academicYear", event.target.value)
              }
              placeholder="e.g. 2026/2027"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Current Term
            </label>
            <select
              value={settings.currentTerm}
              onChange={(event) =>
                updateField("currentTerm", event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">Select term</option>
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(event) =>
                updateField("timezone", event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="Africa/Lagos">Africa/Lagos</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(event) =>
                updateField("dateFormat", event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={19} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">
              Notification Preferences
            </h2>
          </div>
        </CardHeader>

        <CardContent className="divide-y divide-gray-100">
          {notificationOptions.map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start justify-between gap-4 py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.notifications[item.key]}
                onChange={(event) =>
                  updateNotification(item.key, event.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={saving}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}






"use client";

import { useState } from "react";
import {
  Bell,
  Lock,
  Shield,
  Moon,
  Globe,
  Smartphone,
  LogOut,
  Save,
  UserCog,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentSettingsPage() {
  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [pushNotifications, setPushNotifications] =
    useState(true);

  const [competitionReminders, setCompetitionReminders] =
    useState(true);

  const [darkMode, setDarkMode] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Student Portal
          </span>

          <h1 className="mt-4 text-4xl font-bold">
            Account Settings
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Manage your account preferences, notifications,
            security and privacy settings.
          </p>
        </div>

        <div className="space-y-8">
          {/* Notifications */}
          <Card>
            <div className="flex items-center gap-3">
              <Bell className="h-7 w-7 text-blue-600" />

              <h2 className="text-2xl font-bold">
                Notifications
              </h2>
            </div>

            <div className="mt-8 space-y-6">
              <ToggleItem
                title="Email Notifications"
                description="Receive competition updates by email."
                checked={emailNotifications}
                onChange={() =>
                  setEmailNotifications(!emailNotifications)
                }
              />

              <ToggleItem
                title="Push Notifications"
                description="Receive notifications inside the platform."
                checked={pushNotifications}
                onChange={() =>
                  setPushNotifications(!pushNotifications)
                }
              />

              <ToggleItem
                title="Competition Reminders"
                description="Receive reminders before competitions start."
                checked={competitionReminders}
                onChange={() =>
                  setCompetitionReminders(
                    !competitionReminders
                  )
                }
              />
            </div>
          </Card>

          {/* Appearance */}
          <Card>
            <div className="flex items-center gap-3">
              <Moon className="h-7 w-7 text-indigo-600" />

              <h2 className="text-2xl font-bold">
                Appearance
              </h2>
            </div>

            <div className="mt-8">
              <ToggleItem
                title="Dark Mode"
                description="Switch between light and dark themes."
                checked={darkMode}
                onChange={() =>
                  setDarkMode(!darkMode)
                }
              />
            </div>
          </Card>

          {/* Security */}
          <Card>
            <div className="flex items-center gap-3">
              <Shield className="h-7 w-7 text-green-600" />

              <h2 className="text-2xl font-bold">
                Security
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                leftIcon={<Lock className="h-4 w-4" />}
              >
                Change Password
              </Button>

              <Button
                variant="outline"
                leftIcon={<Smartphone className="h-4 w-4" />}
              >
                Manage Devices
              </Button>
            </div>
          </Card>

          {/* Account */}
          <Card>
            <div className="flex items-center gap-3">
              <UserCog className="h-7 w-7 text-purple-600" />

              <h2 className="text-2xl font-bold">
                Account
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                leftIcon={<Globe className="h-4 w-4" />}
              >
                Language
              </Button>

              <Button
                variant="outline"
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                Logout
              </Button>
            </div>
          </Card>

          {/* Save */}
          <div className="flex justify-end">
            <Button
              size="lg"
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

interface ToggleItemProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleItem({
  title,
  description,
  checked,
  onChange,
}: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-xl border p-5">
      <div>
        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-600">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
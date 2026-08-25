





"use client";

import {
  Settings,
  Shield,
  Bell,
  Mail,
  Globe,
  Database,
  Save,
  CreditCard,
  Trophy,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Admin Dashboard
          </span>

          <h1 className="mt-4 text-4xl font-bold">
            Platform Settings
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Configure platform preferences, competition settings,
            payment options, notifications and security for the
            JAMB League system.
          </p>
        </div>

        <div className="space-y-8">
          {/* General */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Settings className="h-7 w-7 text-blue-600" />

              <h2 className="text-2xl font-bold">
                General Settings
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Platform Name"
                defaultValue="JAMB League"
              />

              <Input
                label="Support Email"
                defaultValue="support@jambleague.com"
              />

              <Input
                label="Website URL"
                defaultValue="https://jambleague.com"
              />

              <Input
                label="Contact Phone"
                defaultValue="+2348000000000"
              />
            </div>
          </Card>

          {/* Competition */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Trophy className="h-7 w-7 text-yellow-500" />

              <h2 className="text-2xl font-bold">
                Competition Settings
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Maximum Teams"
                defaultValue="1000"
              />

              <Input
                label="Students Per Team"
                defaultValue="3"
              />

              <Input
                label="Competition Duration"
                defaultValue="90 Minutes"
              />

              <Input
                label="Passing Score"
                defaultValue="200"
              />
            </div>
          </Card>

          {/* Payments */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <CreditCard className="h-7 w-7 text-green-600" />

              <h2 className="text-2xl font-bold">
                Payment Settings
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Registration Fee"
                defaultValue="15000"
              />

              <Input
                label="Currency"
                defaultValue="NGN"
              />

              <Input
                label="Payment Gateway"
                defaultValue="Paystack"
              />

              <Input
                label="Transaction Reference Prefix"
                defaultValue="JL"
              />
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Bell className="h-7 w-7 text-orange-500" />

              <h2 className="text-2xl font-bold">
                Notifications
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Sender Email"
                defaultValue="no-reply@jambleague.com"
              />

              <Input
                label="SMS Sender Name"
                defaultValue="JAMB League"
              />

              <Input
                label="Reminder Interval"
                defaultValue="24 Hours"
              />

              <Input
                label="Announcement Channel"
                defaultValue="Email & SMS"
              />
            </div>
          </Card>

          {/* Security */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Shield className="h-7 w-7 text-red-500" />

              <h2 className="text-2xl font-bold">
                Security
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Session Timeout"
                defaultValue="30 Minutes"
              />

              <Input
                label="Maximum Login Attempts"
                defaultValue="5"
              />

              <Input
                label="Password Minimum Length"
                defaultValue="8"
              />

              <Input
                label="JWT Expiration"
                defaultValue="15 Minutes"
              />
            </div>
          </Card>

          {/* Email */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Mail className="h-7 w-7 text-blue-500" />

              <h2 className="text-2xl font-bold">
                Email Configuration
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="SMTP Host"
                defaultValue="smtp.resend.com"
              />

              <Input
                label="SMTP Port"
                defaultValue="587"
              />

              <Input
                label="Sender Name"
                defaultValue="JAMB League"
              />

              <Input
                label="Reply Email"
                defaultValue="support@jambleague.com"
              />
            </div>
          </Card>

          {/* Platform */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Globe className="h-7 w-7 text-indigo-600" />

              <h2 className="text-2xl font-bold">
                Platform
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Default Language"
                defaultValue="English"
              />

              <Input
                label="Timezone"
                defaultValue="Africa/Lagos"
              />

              <Input
                label="Country"
                defaultValue="Nigeria"
              />

              <Input
                label="Date Format"
                defaultValue="DD/MM/YYYY"
              />
            </div>
          </Card>

          {/* Database */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Database className="h-7 w-7 text-purple-600" />

              <h2 className="text-2xl font-bold">
                System Information
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Database"
                defaultValue="MongoDB Atlas"
                disabled
              />

              <Input
                label="Backend"
                defaultValue="NestJS"
                disabled
              />

              <Input
                label="Frontend"
                defaultValue="Next.js 16"
                disabled
              />

              <Input
                label="API Version"
                defaultValue="v1"
                disabled
              />
            </div>
          </Card>

          {/* Admin */}
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Users className="h-7 w-7 text-cyan-600" />

              <h2 className="text-2xl font-bold">
                Administrator
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Admin Name"
                defaultValue="Super Administrator"
              />

              <Input
                label="Admin Email"
                defaultValue="admin@jambleague.com"
              />
            </div>
          </Card>

          {/* Save */}
          <div className="flex justify-end">
            <Button leftIcon={<Save className="h-4 w-4" />}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
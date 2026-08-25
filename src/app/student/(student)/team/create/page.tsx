





"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ArrowLeft,
  Info,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateTeamPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    // TODO:
    // Connect to createTeam mutation

    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/team"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Team
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Users className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Create Team
              </h1>

              <p className="mt-2 text-slate-600">
                Form your own JAMB League team and invite two
                teammates to compete together.
              </p>
            </div>
          </div>
        </div>

        {/* Information */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <div className="flex gap-4">
            <Info className="mt-1 h-6 w-6 text-blue-600" />

            <div>
              <h2 className="font-semibold text-blue-900">
                Team Requirements
              </h2>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-800">
                <li>Each team consists of exactly 3 students.</li>
                <li>
                  The creator automatically becomes the Team
                  Captain.
                </li>
                <li>
                  Invite teammates using their registered email
                  addresses.
                </li>
                <li>
                  Invitations must be accepted before the team is
                  eligible for competitions.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card>
          <form
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <Input
              label="Team Name"
              name="teamName"
              placeholder="Future Doctors"
              required
            />

            <Input
              label="Team Motto"
              name="motto"
              placeholder="Learning Together, Winning Together"
            />

            <Input
              label="Invitation Email 1"
              type="email"
              name="memberOne"
              placeholder="student1@example.com"
              leftIcon={<UserPlus className="h-4 w-4" />}
            />

            <Input
              label="Invitation Email 2"
              type="email"
              name="memberTwo"
              placeholder="student2@example.com"
              leftIcon={<UserPlus className="h-4 w-4" />}
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Team Description
              </label>

              <textarea
                rows={5}
                placeholder="Tell us about your team..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                type="submit"
                loading={loading}
                fullWidth
              >
                Create Team
              </Button>

              <Link
                href="/student/team"
                className="w-full"
              >
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
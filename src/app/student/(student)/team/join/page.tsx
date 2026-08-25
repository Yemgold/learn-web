



"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ArrowLeft,
  Hash,
  UserPlus,
  Info,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JoinTeamPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    // TODO:
    // Connect to joinTeam mutation

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
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Join Existing Team
              </h1>

              <p className="mt-2 text-slate-600">
                Enter a Team Code to request membership in an
                existing JAMB League team.
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
                Before You Join
              </h2>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-800">
                <li>You can only belong to one team.</li>
                <li>
                  Your request must be approved by the Team
                  Captain.
                </li>
                <li>
                  Every competition team consists of exactly
                  three students.
                </li>
                <li>
                  Ask your Team Captain for the correct Team
                  Code.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Join Form */}
        <Card>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <Input
              label="Team Code"
              name="teamCode"
              placeholder="JL-2027-001"
              required
              leftIcon={<Hash className="h-4 w-4" />}
            />

            <Input
              label="Team Name (Optional)"
              name="teamName"
              placeholder="Future Doctors"
              leftIcon={<Users className="h-4 w-4" />}
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Message to Team Captain (Optional)
              </label>

              <textarea
                rows={5}
                placeholder="Introduce yourself and explain why you'd like to join this team..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                type="submit"
                loading={loading}
                leftIcon={<Search className="h-4 w-4" />}
              >
                Find & Join Team
              </Button>

              <Link href="/student/team">
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

        {/* Help */}
        <Card className="mt-8">
          <div className="flex items-start gap-4">
            <Users className="mt-1 h-6 w-6 text-blue-600" />

            <div>
              <h2 className="text-xl font-bold">
                Don't have a Team?
              </h2>

              <p className="mt-2 text-slate-600">
                You can create your own team and invite two
                friends to participate in the JAMB League.
              </p>

              <Link
                href="/student/team/create"
                className="mt-5 inline-flex"
              >
                <Button variant="secondary">
                  Create New Team
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
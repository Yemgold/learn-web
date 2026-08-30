




"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Users,
  UserPlus,
  ArrowLeft,
  Info,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JoinTeamPage() {
  const router = useRouter();
  const params = useParams();

  const competitionId = params?.competitionId as string;

  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [joinedTeamName, setJoinedTeamName] = useState("");

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setError("");

    const code = teamCode.trim().toUpperCase();

    if (!code) {
      setError("Please enter your team code.");
      return;
    }

    if (!competitionId) {
      setError("Competition could not be identified.");
      return;
    }

    try {
      setLoading(true);

      /*
       * IMPORTANT:
       *
       * The backend should handle the actual team joining.
       *
       * Expected backend flow:
       *
       * 1. Authenticate the current student.
       * 2. Verify the competition exists and is open for joining.
       * 3. Find the team using the supplied team code.
       * 4. Verify the team belongs to this competition.
       * 5. Verify the team has space available.
       * 6. Verify the student is not already in another team
       *    for this competition.
       * 7. Add the authenticated student to the team.
       * 8. Return the team information.
       *
       * Replace the temporary block below with your actual
       * joinTeam API/mutation.
       */

      /*
      const response = await joinTeam({
        competitionId,
        teamCode: code,
      });

      const team = response.data;

      setJoinedTeamName(team.teamName);
      setSuccess(true);
      */

      // Temporary placeholder until the backend is connected.
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      setJoinedTeamName("Future Doctors");
      setSuccess(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to join the team. Please check the code and try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-2xl px-4 py-10">
          <Link
            href={`/student/competitions/${competitionId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Link>

          <Card className="mt-8 p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              You Joined the Team!
            </h1>

            <p className="mt-3 text-slate-600">
              You have successfully joined{" "}
              <span className="font-semibold text-slate-900">
                {joinedTeamName}
              </span>
              .
            </p>

            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center justify-center gap-3">
                <Users className="h-6 w-6 text-green-600" />

                <span className="font-semibold text-green-900">
                  You are now a team member
                </span>
              </div>

              <p className="mt-2 text-sm text-green-800">
                The Team Captain can see you in the team roster.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                fullWidth
                onClick={() =>
                  router.push(
                    `/student/competitions/${competitionId}/team`
                  )
                }
              >
                View My Team
              </Button>

              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() =>
                  router.push(
                    `/student/competitions/${competitionId}/room`
                  )
                }
              >
                Competition Room
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/student/competitions/${competitionId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Join a Team
              </h1>

              <p className="mt-2 text-slate-600">
                Enter the team code shared with you by the
                Team Captain.
              </p>
            </div>
          </div>
        </div>

        {/* Information */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <div className="flex gap-4">
            <Info className="mt-1 h-6 w-6 shrink-0 text-blue-600" />

            <div>
              <h2 className="font-semibold text-blue-900">
                How Team Joining Works
              </h2>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-800">
                <li>
                  Ask your Team Captain for the team's unique
                  code.
                </li>

                <li>
                  Enter the code exactly as it was provided to
                  you.
                </li>

                <li>
                  Each team can have a maximum of 3 students.
                </li>

                <li>
                  You can only join one team in this
                  competition.
                </li>

                <li>
                  Joining a team does not cost CBT points.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Join Form */}
        <Card>
          <form
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <div>
              <div className="mb-2 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-slate-600" />

                <label
                  htmlFor="teamCode"
                  className="text-sm font-medium"
                >
                  Team Code
                </label>
              </div>

              <Input
                id="teamCode"
                name="teamCode"
                value={teamCode}
                onChange={(e) =>
                  setTeamCode(
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="e.g. FD8K2P"
                autoComplete="off"
                required
                disabled={loading}
                className="text-center text-xl font-bold tracking-[0.25em] uppercase"
              />

              <p className="mt-2 text-sm text-slate-500">
                Enter the unique code given to you by your
                Team Captain.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />

                <p>{error}</p>
              </div>
            )}

            {/* No Fee */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                <div className="text-sm text-green-900">
                  <p className="font-semibold">
                    No CBT points required
                  </p>

                  <p className="mt-1">
                    The 5 CBT-point fee applies only when a
                    student creates a new team. Joining an
                    existing team is free.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                type="submit"
                loading={loading}
                fullWidth
              >
                {loading
                  ? "Joining Team..."
                  : "Join Team"}
              </Button>

              <Link
                href={`/student/competitions/${competitionId}`}
                className="w-full"
              >
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        {/* Help */}
        <div className="mt-6 flex items-start gap-3 text-sm text-slate-500">
          <Users className="mt-0.5 h-4 w-4 shrink-0" />

          <p>
            Don't have a team code? Ask a friend who has
            already created a team to send their code to you.
          </p>
        </div>
      </div>
    </main>
  );
}

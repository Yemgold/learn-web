




"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Trophy,
  Copy,
  Check,
  Crown,
  Settings,
  Plus,
  LogIn,
  ArrowLeft,
  RefreshCw,
  Info,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  isCaptain: boolean;
}

interface Team {
  id: string;
  name: string;
  motto?: string;
  description?: string;
  code: string;
  members: TeamMember[];
}

export default function CompetitionTeamPage() {
  const router = useRouter();
  const params = useParams();

  const competitionId = params?.competitionId as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  /*
   * Load the authenticated student's team for this competition.
   *
   * Replace the temporary implementation with your actual
   * getMyTeam API/mutation.
   */
  useEffect(() => {
    async function loadMyTeam() {
      if (!competitionId) return;

      try {
        setLoading(true);
        setError("");

        /*
         * Example:
         *
         * const response = await getMyTeam(competitionId);
         *
         * setTeam(response.data);
         */

        // Temporary placeholder until backend is connected.
        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );

        /*
         * Set this to null if you want to preview the
         * "student has no team" state.
         */
        setTeam(null);

        /*
         * Example team response:
         *
         * setTeam({
         *   id: "team-id",
         *   name: "Future Doctors",
         *   motto: "Learning Together, Winning Together",
         *   description: "We are here to win!",
         *   code: "FD8K2P",
         *   members: [
         *     {
         *       id: "1",
         *       name: "John Doe",
         *       email: "john@example.com",
         *       avatar: null,
         *       isCaptain: true,
         *     },
         *     {
         *       id: "2",
         *       name: "David Smith",
         *       email: "david@example.com",
         *       avatar: null,
         *       isCaptain: false,
         *     },
         *   ],
         * });
         */
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load your team."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMyTeam();
  }, [competitionId]);

  async function copyTeamCode() {
    if (!team?.code) return;

    try {
      await navigator.clipboard.writeText(team.code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the team code.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-4xl px-4 py-10">
          <Link
            href={`/student/competitions/${competitionId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Link>

          <Card className="mt-8 p-8">
            <div className="flex min-h-[300px] items-center justify-center">
              <RefreshCw className="h-7 w-7 animate-spin text-primary" />
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /*
   * NO TEAM STATE
   */
  if (!team) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-4xl px-4 py-10">
          {/* Back */}
          <Link
            href={`/student/competitions/${competitionId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Link>

          {/* Header */}
          <div className="mt-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100">
              <Users className="h-10 w-10 text-blue-600" />
            </div>

            <h1 className="mt-6 text-4xl font-bold text-slate-900">
              Your Team
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Join an existing team using a team code, or
              create your own team and invite your friends.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Options */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Create Team */}
            <Card className="p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <Plus className="h-7 w-7 text-blue-600" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Create a Team
              </h2>

              <p className="mt-3 leading-6 text-slate-600">
                Create your own team, become the Team Captain,
                and invite two friends using your unique team
                code.
              </p>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  Creation Fee: 5 CBT Points
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800">
                  The 5 CBT points will be deducted from your
                  wallet by the backend when your team is
                  successfully created.
                </p>
              </div>

              <Link
                href={`/student/competitions/${competitionId}/team/create`}
                className="mt-6 block"
              >
                <Button
                  type="button"
                  fullWidth
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </Link>
            </Card>

            {/* Join Team */}
            <Card className="p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                <UserPlus className="h-7 w-7 text-green-600" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Join a Team
              </h2>

              <p className="mt-3 leading-6 text-slate-600">
                Already have an invitation? Enter the team
                code given to you by the Team Captain.
              </p>

              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-900">
                  Joining is Free
                </p>

                <p className="mt-1 text-xs leading-5 text-green-800">
                  You don't need to spend CBT points to join an
                  existing team.
                </p>
              </div>

              <Link
                href={`/student/competitions/${competitionId}/team/join`}
                className="mt-6 block"
              >
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Join Team
                </Button>
              </Link>
            </Card>
          </div>

          {/* Information */}
          <Card className="mt-8 border-blue-200 bg-blue-50 p-5">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <h3 className="font-semibold text-blue-900">
                  How teams work
                </h3>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Each team has a maximum of 3 students. If
                  you create the team, you become the captain
                  and receive a unique team code. Share that
                  code with your friends so they can join.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /*
   * HAS TEAM STATE
   */

  const captain = team.members.find(
    (member) => member.isCaptain
  );

  const currentUserIsCaptain = Boolean(
    captain
    /*
     * When connected to your auth state, replace this with
     * an actual comparison such as:
     *
     * captain?.id === currentUser.id
     */
  );

  const slotsRemaining = Math.max(
    0,
    3 - team.members.length
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-4xl px-4 py-10">
        {/* Back */}
        <Link
          href={`/student/competitions/${competitionId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <Trophy className="h-7 w-7 text-blue-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-blue-600">
                  Competition Team
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                  {team.name}
                </h1>
              </div>
            </div>

            {team.motto && (
              <p className="mt-3 text-slate-600">
                “{team.motto}”
              </p>
            )}
          </div>

          {currentUserIsCaptain && (
            <Link
              href={`/student/competitions/${competitionId}/team/remove`}
            >
              <Button
                type="button"
                variant="outline"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
            </Link>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Team Code */}
        <Card className="mt-8 overflow-hidden border-blue-200">
          <div className="bg-blue-50 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Team Code
                </p>

                <p className="mt-1 text-3xl font-bold tracking-[0.2em] text-blue-950">
                  {team.code}
                </p>

                <p className="mt-2 text-sm text-blue-700">
                  Share this code with friends to let them
                  join your team.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={copyTeamCode}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Members */}
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Team Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your team has {team.members.length} of 3
                members.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-700">
                  {member.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">
                      {member.name}
                    </p>

                    {member.isCaptain && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                        <Crown className="h-3 w-3" />
                        Captain
                      </span>
                    )}
                  </div>

                  {member.email && (
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {member.email}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: slotsRemaining }).map(
              (_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                    <UserPlus className="h-5 w-5 text-slate-400" />
                  </div>

                  <div>
                    <p className="font-medium text-slate-700">
                      Open Team Slot
                    </p>

                    <p className="text-sm text-slate-500">
                      Share your team code to invite another
                      student.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Description */}
        {team.description && (
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              About This Team
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {team.description}
            </p>
          </Card>
        )}

        {/* Team Status */}
        <Card className="mt-6 border-green-200 bg-green-50 p-5">
          <div className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

            <div>
              <h3 className="font-semibold text-green-900">
                Team Status
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-800">
                {team.members.length === 3
                  ? "Your team is complete with 3 members."
                  : `Your team has ${slotsRemaining} open ${
                      slotsRemaining === 1
                        ? "slot"
                        : "slots"
                    }. Share your team code with your friends to fill them.`}
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            fullWidth
            onClick={() =>
              router.push(
                `/student/competitions/${competitionId}/room`
              )
            }
          >
            <Trophy className="mr-2 h-4 w-4" />
            Competition Room
          </Button>

          {currentUserIsCaptain && (
            <Link
              href={`/student/competitions/${competitionId}/team/remove`}
              className="w-full"
            >
              <Button
                type="button"
                variant="outline"
                fullWidth
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

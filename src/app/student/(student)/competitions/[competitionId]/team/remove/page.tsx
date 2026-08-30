





"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  ArrowLeft,
  Copy,
  Check,
  UserMinus,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
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
  code: string;
  members: TeamMember[];
}

export default function RemoveTeamMemberPage() {
  const router = useRouter();
  const params = useParams();

  const competitionId = params?.competitionId as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  /*
   * Load the authenticated student's team.
   *
   * Replace this temporary implementation with your
   * getMyTeam API/mutation.
   */
  useEffect(() => {
    async function loadTeam() {
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

        setTeam({
          id: "temporary-team-id",
          name: "Future Doctors",
          code: "FD8K2P",
          members: [
            {
              id: "captain-id",
              name: "Team Captain",
              email: "captain@example.com",
              avatar: null,
              isCaptain: true,
            },
            {
              id: "member-1",
              name: "David Smith",
              email: "david@example.com",
              avatar: null,
              isCaptain: false,
            },
            {
              id: "member-2",
              name: "Sarah James",
              email: "sarah@example.com",
              avatar: null,
              isCaptain: false,
            },
          ],
        });
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

    loadTeam();
  }, [competitionId]);

  async function handleRemoveMember(member: TeamMember) {
    if (!team) return;

    if (member.isCaptain) {
      setError("The Team Captain cannot be removed from the team.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name} from the team?\n\nThey will no longer be a member of this team and another student can join using the team code.`
    );

    if (!confirmed) return;

    try {
      setRemovingId(member.id);
      setError("");
      setSuccess("");

      /*
       * Replace this block with your actual API call.
       *
       * Example:
       *
       * await removeTeamMember({
       *   competitionId,
       *   teamId: team.id,
       *   memberId: member.id,
       * });
       */

      // Temporary placeholder until backend is connected.
      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      setTeam((current) => {
        if (!current) return current;

        return {
          ...current,
          members: current.members.filter(
            (existingMember) =>
              existingMember.id !== member.id
          ),
        };
      });

      setSuccess(
        `${member.name} has been removed from the team.`
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to remove this team member."
      );
    } finally {
      setRemovingId(null);
    }
  }

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
        <div className="container mx-auto max-w-3xl px-4 py-10">
          <Link
            href={`/student/competitions/${competitionId}/team`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Team
          </Link>

          <Card className="mt-8 p-8">
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-7 w-7 animate-spin text-primary" />
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (!team) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-3xl px-4 py-10">
          <Link
            href={`/student/competitions/${competitionId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Link>

          <Card className="mt-8 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Users className="h-8 w-8 text-slate-500" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              No Team Found
            </h1>

            <p className="mt-2 text-slate-600">
              You are not currently part of a team for this
              competition.
            </p>

            <div className="mt-6">
              <Button
                type="button"
                onClick={() =>
                  router.push(
                    `/student/competitions/${competitionId}/team`
                  )
                }
              >
                Go to My Team
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const captain = team.members.find(
    (member) => member.isCaptain
  );

  const otherMembers = team.members.filter(
    (member) => !member.isCaptain
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/student/competitions/${competitionId}/team`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Team
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
              <UserMinus className="h-8 w-8 text-orange-600" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Manage Team
              </h1>

              <p className="mt-2 text-slate-600">
                Manage your team members and replace members
                when necessary.
              </p>
            </div>
          </div>
        </div>

        {/* Team Summary */}
        <Card className="mb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Team
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {team.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {team.members.length} / 3 members
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                Team Code
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-xl font-bold tracking-widest text-blue-950">
                  {team.code}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  onClick={copyTeamCode}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />

            <p>{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 flex gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <Check className="h-5 w-5 shrink-0" />

            <p>{success}</p>
          </div>
        )}

        {/* Captain */}
        <Card className="mb-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Team Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Only the Team Captain can remove members.
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {team.members.length}/3
            </div>
          </div>

          <div className="space-y-3">
            {/* Captain */}
            {captain && (
              <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {captain.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">
                      {captain.name}
                    </p>

                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      <ShieldCheck className="h-3 w-3" />
                      Captain
                    </span>
                  </div>

                  {captain.email && (
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {captain.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Other Members */}
            {otherMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {member.name}
                  </p>

                  {member.email && (
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {member.email}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    handleRemoveMember(member)
                  }
                  disabled={removingId !== null}
                >
                  {removingId === member.id ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove
                    </>
                  )}
                </Button>
              </div>
            ))}

            {/* Empty slot */}
            {team.members.length < 3 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <Users className="mx-auto h-7 w-7 text-slate-400" />

                <p className="mt-2 font-medium text-slate-700">
                  {3 - team.members.length} team slot
                  {3 - team.members.length !== 1
                    ? "s"
                    : ""}{" "}
                  available
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Share your team code with another student
                  to fill the available slot.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={copyTeamCode}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Code Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Team Code
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Replacement Information */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <div className="flex gap-4">
            <InfoIcon />

            <div>
              <h2 className="font-semibold text-amber-900">
                Replacing a Team Member
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                If you remove a team member, their slot becomes
                available. You can then give your existing team
                code to another student. No additional CBT
                points are charged for replacing a member.
              </p>
            </div>
          </div>
        </Card>

        {/* Important Warning */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <div className="flex gap-4">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <h2 className="font-semibold text-red-900">
                Important
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-800">
                Removing a member should only be done when
                necessary. Once removed, the student will no
                longer be part of this team and another student
                may take the available slot.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            fullWidth
            onClick={() =>
              router.push(
                `/student/competitions/${competitionId}/team`
              )
            }
          >
            <Users className="mr-2 h-4 w-4" />
            Back to My Team
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
      </div>
    </main>
  );
}

function InfoIcon() {
  return (
    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-600 text-xs font-bold text-amber-600">
      i
    </div>
  );
}

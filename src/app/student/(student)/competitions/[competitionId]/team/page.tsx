



"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Trophy,
  Crown,
  Copy,
  Check,
  Settings,
  DoorOpen,
  UserRound,
  ShieldCheck,
  Info,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  name: string;
  role: "Captain" | "Member";
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  motto: string;
  description: string;
  code: string;
  members: TeamMember[];
}

export default function MyTeamPage() {
  const params = useParams();

  const competitionId = params?.competitionId as string;

  const [copied, setCopied] = useState(false);

  // TEMPORARY UI DATA
  // Replace this with your backend response later.
  const team: Team = {
    id: "team-001",
    name: "Future Doctors",
    motto: "Learn Together. Compete Together. Win Together.",
    description:
      "We are a team of ambitious students preparing to compete, learn, and achieve the best possible result in this competition.",
    code: "FD8K2P",
    members: [
      {
        id: "student-001",
        name: "John Doe",
        role: "Captain",
      },
      {
        id: "student-002",
        name: "Mary Johnson",
        role: "Member",
      },
      {
        id: "student-003",
        name: "David James",
        role: "Member",
      },
    ],
  };

  const memberCount = team.members.length;
  const maxMembers = 3;

  const remainingSlots = Math.max(
    0,
    maxMembers - memberCount
  );

  const isTeamFull = memberCount >= maxMembers;

  // TEMPORARY:
  // This simulates the logged-in student being the captain.
  const isCaptain = true;

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(team.code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      console.error("Unable to copy team code");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-16 text-white">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Back */}
        <Link
          href={`/student/competitions/${competitionId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <Trophy className="h-8 w-8 text-blue-400" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-blue-400">
                  My Competition Team
                </p>

                <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                  Team Created
                </span>
              </div>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                {team.name}
              </h1>

              <p className="mt-1 text-slate-400">
                {team.motto}
              </p>
            </div>
          </div>

          {/* Captain Management */}
          {isCaptain && (
            <Link
              href={`/student/competitions/${competitionId}/team/remove`}
            >
              <Button
                type="button"
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
            </Link>
          )}
        </div>

        {/* Team Code */}
        <Card className="mt-8 overflow-hidden border-blue-500/20 bg-white/[0.04] shadow-none">
          <div className="border-b border-blue-500/10 bg-blue-500/10 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />

                  <p className="text-sm font-semibold text-blue-300">
                    Your Team Code
                  </p>
                </div>

                <p className="mt-2 text-3xl font-bold tracking-[0.2em] text-white">
                  {team.code}
                </p>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-200/70">
                  Share this code with your friends so they can
                  join your team for this competition.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyCode}
                className="border-blue-400/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 hover:text-white"
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

        {/* Team Statistics */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.04] p-6 shadow-none">
            <Users className="h-6 w-6 text-blue-400" />

            <p className="mt-4 text-sm text-slate-500">
              Team Members
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {memberCount} / {maxMembers}
            </p>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] p-6 shadow-none">
            <Trophy className="h-6 w-6 text-yellow-400" />

            <p className="mt-4 text-sm text-slate-500">
              Team Status
            </p>

            <p className="mt-1 text-2xl font-bold text-green-400">
              {isTeamFull ? "Ready" : "Incomplete"}
            </p>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] p-6 shadow-none">
            <Crown className="h-6 w-6 text-amber-400" />

            <p className="mt-4 text-sm text-slate-500">
              Your Role
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {isCaptain ? "Captain" : "Member"}
            </p>
          </Card>
        </div>

        {/* Team Members */}
        <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 shadow-none">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Team Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Students currently registered on your team.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <Users className="h-4 w-4" />
              {memberCount} / {maxMembers}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
              >
                {/* Avatar */}
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-300">
                    {member.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                {/* Member Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-200">
                      {member.name}
                    </p>

                    {member.role === "Captain" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                        <Crown className="h-3 w-3" />
                        Captain
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {member.role}
                  </p>
                </div>

                {/* Member Icon */}
                <div className="hidden rounded-full border border-white/10 bg-white/[0.05] p-2 sm:block">
                  {member.role === "Captain" ? (
                    <Crown className="h-4 w-4 text-amber-400" />
                  ) : (
                    <UserRound className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Remaining Slots */}
          {remainingSlots > 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />

                <div>
                  <p className="font-semibold text-slate-200">
                    {remainingSlots}{" "}
                    {remainingSlots === 1
                      ? "slot"
                      : "slots"}{" "}
                    remaining
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Share your team code with friends to fill
                    the remaining team slot.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Team Details */}
        <Card className="mt-6 border-white/10 bg-white/[0.04] p-6 shadow-none">
          <h2 className="text-2xl font-bold text-white">
            Team Details
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Team Name
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {team.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Team Motto
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {team.motto}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Description
              </p>

              <p className="mt-2 leading-7 text-slate-400">
                {team.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Captain Information */}
        {isCaptain && (
          <Card className="mt-6 border-amber-500/20 bg-amber-500/10 p-5 shadow-none">
            <div className="flex items-start gap-3">
              <Crown className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

              <div>
                <h3 className="font-semibold text-amber-200">
                  You are the Team Captain
                </h3>

                <p className="mt-1 text-sm leading-6 text-amber-200/70">
                  You created this team. Share the team code
                  with your friends and manage your team members
                  when necessary.
                </p>

                <Link
                  href={`/student/competitions/${competitionId}/team/remove`}
                  className="mt-3 inline-flex text-sm font-semibold text-amber-300 underline decoration-amber-500/40 underline-offset-4 hover:text-amber-200"
                >
                  Manage Team Members
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/student/competitions/${competitionId}/room`}
            className="w-full"
          >
            <Button
              type="button"
              fullWidth
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-500"
            >
              <DoorOpen className="mr-2 h-5 w-5" />
              Competition Room
            </Button>
          </Link>

          <Link
            href={`/student/competitions/${competitionId}/teams`}
            className="w-full"
          >
            <Button
              type="button"
              fullWidth
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
            >
              <Users className="mr-2 h-5 w-5" />
              View Other Teams
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

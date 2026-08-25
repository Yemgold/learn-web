








"use client";

import Link from "next/link";
import {
  CalendarDays,
  Trophy,
  Users,
  Gift,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CompetitionOverviewProps {
  title: string;
  subject: string;
  description: string;
  startDate: string;
  teamsJoined: number;
  maxTeams: number;
  prize: string;
  entryFee: string;

  /**
   * URL to the registration page.
   * Example:
   * /competitions/jamb-league-2027/register
   */
  joinHref: string;
}

export default function CompetitionOverview({
  title,
  subject,
  description,
  startDate,
  teamsJoined,
  maxTeams,
  prize,
  entryFee,
  joinHref,
}: CompetitionOverviewProps) {
  return (
    <Card
      hoverable
      className="overflow-hidden rounded-3xl"
    >
      <div className="grid gap-10 p-8 lg:grid-cols-2 lg:p-12">
        {/* Left */}
        <div>
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Featured Competition
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-2 text-lg font-medium text-blue-600">
            {subject}
          </p>

          <p className="mt-6 leading-8 text-slate-600">
            {description}
          </p>

          <div className="mt-10">
            <Link href={joinHref}>
              <Button
                size="lg"
                rightIcon={
                  <ArrowRight className="h-5 w-5" />
                }
              >
                Join Competition
              </Button>
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Card className="p-6">
            <CalendarDays className="mb-4 h-8 w-8 text-blue-600" />

            <p className="text-sm text-slate-500">
              Start Date
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {startDate}
            </h3>
          </Card>

          <Card className="p-6">
            <Users className="mb-4 h-8 w-8 text-emerald-600" />

            <p className="text-sm text-slate-500">
              Teams Joined
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {teamsJoined} / {maxTeams}
            </h3>
          </Card>

          <Card className="p-6">
            <Trophy className="mb-4 h-8 w-8 text-amber-500" />

            <p className="text-sm text-slate-500">
              Prize Pool
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {prize}
            </h3>
          </Card>

          <Card className="p-6">
            <Gift className="mb-4 h-8 w-8 text-rose-500" />

            <p className="text-sm text-slate-500">
              Entry Fee
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {entryFee}
            </h3>
          </Card>
        </div>
      </div>
    </Card>
  );
}
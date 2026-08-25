




"use client";

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import LeaderboardRow from "./LeaderboardRow";

const topTeams = [
  {
    id: "1",
    rank: 1,
    teamName: "Brain Masters",
    school: "King's College Lagos",
    state: "Lagos",
    score: 985,
    competitions: 18,
  },
  {
    id: "2",
    rank: 2,
    teamName: "Alpha Scholars",
    school: "Federal Government College",
    state: "FCT",
    score: 970,
    competitions: 18,
  },
  {
    id: "3",
    rank: 3,
    teamName: "Success Team",
    school: "Government College Ibadan",
    state: "Oyo",
    score: 956,
    competitions: 17,
  },
];

export default function LeaderboardPreview() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
              <Trophy className="h-4 w-4" />
              National Rankings
            </div>

            <h2 className="text-4xl font-bold text-slate-900">
              Top Performing Teams
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              These teams are currently leading the JAMB League
              national leaderboard based on competition performance,
              consistency and overall score.
            </p>
          </div>

          <Link href="/student/competitions/leaderboard">
            <Button
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View Full Leaderboard
            </Button>
          </Link>
        </div>

        {/* Table Header */}
        <div className="mb-4 hidden grid-cols-[70px_1.7fr_1.2fr_120px_120px_120px] gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500 lg:grid">
          <div>Rank</div>
          <div>Team</div>
          <div>State</div>
          <div>Score</div>
          <div>Played</div>
          <div>Status</div>
        </div>

        {/* Top Teams */}
        <div className="space-y-4">
          {topTeams.map((team) => (
            <LeaderboardRow
              key={team.id}
              rank={team.rank}
              teamName={team.teamName}
              school={team.school}
              state={team.state}
              score={team.score}
              competitions={team.competitions}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center">
          <Link href="/student/competitions/leaderboard">
            <Button
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Explore Complete Rankings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}





import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import LeaderboardStats from "@/components/leaderboard/LeaderboardStats";
import LeaderboardFilters from "@/components/leaderboard/LeaderboardFilters";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <section className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
            <Trophy className="h-4 w-4" />
            National Rankings
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            JAMB League Leaderboard
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Discover the highest-performing teams across Nigeria.
            Rankings are updated automatically after every competition,
            helping students measure their progress against the best.
          </p>
        </section>

        {/* Statistics */}
        <section className="mb-12">
          <LeaderboardStats />
        </section>

        {/* Filters */}
        <section className="mb-10">
          <LeaderboardFilters />
        </section>

        {/* Table */}
        <section>
          <LeaderboardTable />
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 rounded-3xl bg-blue-600 px-8 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">
            Ready to climb the rankings?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Join a team, participate in competitions, practise
            consistently, and earn your place on Nigeria's biggest
            student leaderboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/competitions">
              <Button
                variant="secondary"
                size="lg"
              >
                Join Competition
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
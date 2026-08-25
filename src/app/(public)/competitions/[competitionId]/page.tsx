




import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Users,
  Trophy,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompetitionPageProps {
  params: Promise<{
    competitionId: string;
  }>;
}

export default async function CompetitionDetailsPage({
  params,
}: CompetitionPageProps) {
  const { competitionId } = await params;

  // Temporary mock data
  const competition = {
    id: competitionId,
    title: "JAMB League 2027 Championship",
    subject: "All UTME Subjects",
    description:
      "Compete with students from schools across Nigeria in a realistic CBT environment. Build a team of three students, improve your preparation, and compete for scholarships and national recognition.",
    startDate: "January 15, 2027",
    registrationDeadline: "December 31, 2026",
    duration: "2 Hours",
    prizePool: "₦1,000,000",
    entryFee: "Free",
    teamsJoined: 250,
    maxTeams: 1000,
  };

  if (!competition) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto max-w-5xl px-4">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            {competition.subject}
          </span>

          <h1 className="mt-6 text-5xl font-bold">
            {competition.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            {competition.description}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold">
                Competition Overview
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                JAMB League is Nigeria's largest online academic
                competition for UTME candidates. Teams compete in
                timed CBT examinations while building confidence and
                improving examination performance.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold">
                Competition Benefits
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  "National Ranking",
                  "Scholarship Opportunities",
                  "Digital Certificate",
                  "Performance Analytics",
                  "Real CBT Experience",
                  "National Recognition",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-600" />

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold">
                Competition Rules
              </h2>

              <ul className="mt-6 list-disc space-y-3 pl-6 leading-7 text-slate-600">
                <li>Each team must consist of three students.</li>
                <li>
                  Every student can belong to only one team.
                </li>
                <li>
                  Internet connection is required throughout the
                  competition.
                </li>
                <li>
                  Rankings are based on score and completion time.
                </li>
                <li>
                  Any form of malpractice leads to disqualification.
                </li>
              </ul>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold">
                Competition Information
              </h3>

              <div className="mt-6 space-y-5">
                <InfoItem
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Start Date"
                  value={competition.startDate}
                />

                <InfoItem
                  icon={<Clock className="h-5 w-5" />}
                  label="Duration"
                  value={competition.duration}
                />

                <InfoItem
                  icon={<Users className="h-5 w-5" />}
                  label="Teams"
                  value={`${competition.teamsJoined}/${competition.maxTeams}`}
                />

                <InfoItem
                  icon={<Trophy className="h-5 w-5" />}
                  label="Prize Pool"
                  value={competition.prizePool}
                />

                <InfoItem
                  icon={<BookOpen className="h-5 w-5" />}
                  label="Entry Fee"
                  value={competition.entryFee}
                />
              </div>

              <Link
                href={`/competitions/${competition.id}/register`}
                className="mt-8 block"
              >
                <Button
                  fullWidth
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Register Team
                </Button>
              </Link>
            </Card>

            <Card>
              <h3 className="font-bold">
                Registration Deadline
              </h3>

              <p className="mt-4 text-slate-600">
                {competition.registrationDeadline}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-blue-600">{icon}</div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}
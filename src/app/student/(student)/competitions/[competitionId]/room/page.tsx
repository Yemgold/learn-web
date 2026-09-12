









import Link from "next/link";
import {
  Clock3,
  Trophy,
  Users,
  CalendarDays,
  Wifi,
  MonitorSmartphone,
  ShieldCheck,
  ArrowLeft,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WaitingRoomPageProps {
  params: Promise<{
    competitionId: string;
  }>;
}

export default async function WaitingRoomPage({
  params,
}: WaitingRoomPageProps) {
  const { competitionId } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="border-b border-blue-500/20 bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-950 py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
            Competition Waiting Room
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
            JAMB League 2027 Championship
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-blue-100/70">
            Your team has successfully registered. Please remain on this
            page until the competition begins.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Countdown */}
            <Card className="border-white/10 bg-white/[0.04] p-6 text-center shadow-none">
              <Clock3 className="mx-auto h-14 w-14 text-blue-400" />

              <h2 className="mt-6 text-3xl font-bold text-white">
                Competition Starts In
              </h2>

              {/* Placeholder countdown */}
              <div className="mt-8 grid grid-cols-4 gap-3 sm:gap-4">
                {[
                  ["12", "Days"],
                  ["08", "Hours"],
                  ["25", "Minutes"],
                  ["18", "Seconds"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.08] p-4 sm:p-5"
                  >
                    <div className="text-2xl font-bold text-blue-300 sm:text-3xl">
                      {value}
                    </div>

                    <div className="mt-1 text-xs text-slate-500 sm:text-sm">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Team */}
            <Card className="border-white/10 bg-white/[0.04] p-6 shadow-none">
              <h2 className="text-2xl font-bold text-white">
                Registered Team
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  "John Doe (Captain)",
                  "Mary Johnson",
                  "David James",
                ].map((member) => (
                  <div
                    key={member}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-400" />

                      <span className="font-medium text-slate-200">
                        {member}
                      </span>
                    </div>

                    <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructions */}
            <Card className="border-white/10 bg-white/[0.04] p-6 shadow-none">
              <h2 className="text-2xl font-bold text-white">
                Before the Competition
              </h2>

              <div className="mt-6 space-y-5">
                <Instruction
                  icon={<Wifi className="h-5 w-5" />}
                  title="Stable Internet"
                  description="Ensure you have a reliable internet connection throughout the examination."
                />

                <Instruction
                  icon={<MonitorSmartphone className="h-5 w-5" />}
                  title="Use a Supported Device"
                  description="Laptop or desktop is recommended for the best CBT experience."
                />

                <Instruction
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Follow Examination Rules"
                  description="Do not refresh the page or open multiple tabs during the examination."
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.04] p-6 shadow-none">
              <h3 className="text-xl font-bold text-white">
                Competition Summary
              </h3>

              <div className="mt-6 space-y-5">
                <SummaryItem
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Date"
                  value="January 15, 2027"
                />

                <SummaryItem
                  icon={<Clock3 className="h-5 w-5" />}
                  label="Duration"
                  value="2 Hours"
                />

                <SummaryItem
                  icon={<Users className="h-5 w-5" />}
                  label="Team Size"
                  value="3 Students"
                />

                <SummaryItem
                  icon={<Trophy className="h-5 w-5" />}
                  label="Prize Pool"
                  value="₦1,000,000"
                />
              </div>
            </Card>

            <Card className="border-white/10 bg-white/[0.04] p-6 text-center shadow-none">
              <Play className="mx-auto h-12 w-12 text-green-400" />

              <h3 className="mt-4 text-xl font-bold text-white">
                Competition Access
              </h3>

              <p className="mt-3 leading-6 text-slate-400">
                The{" "}
                <strong className="text-slate-200">
                  Start Competition
                </strong>{" "}
                button will become active automatically when the
                competition begins.
              </p>

              <Button
                fullWidth
                size="lg"
                disabled
                className="mt-6 border border-white/10 bg-white/[0.06] text-slate-500"
              >
                Waiting for Competition...
              </Button>
            </Card>

            <Link href={`/student/competitions`}>
              <Button
                variant="outline"
                fullWidth
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
              >
                Back to Competition
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SummaryItem({
  icon,
  label,
  value,
}: SummaryItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl border border-blue-500/10 bg-blue-500/10 p-2 text-blue-400">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

interface InstructionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Instruction({
  icon,
  title,
  description,
}: InstructionProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-xl border border-blue-500/10 bg-blue-500/10 p-3 text-blue-400">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold text-slate-200">
          {title}
        </h4>

        <p className="mt-1 leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}





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
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-600 py-16 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            Competition Waiting Room
          </span>

          <h1 className="mt-6 text-4xl font-bold">
            JAMB League 2027 Championship
          </h1>

          <p className="mt-4 max-w-3xl text-blue-100">
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
            <Card className="text-center">
              <Clock3 className="mx-auto h-14 w-14 text-blue-600" />

              <h2 className="mt-6 text-3xl font-bold">
                Competition Starts In
              </h2>

              {/* Placeholder countdown */}
              <div className="mt-8 grid grid-cols-4 gap-4">
                {[
                  ["12", "Days"],
                  ["08", "Hours"],
                  ["25", "Minutes"],
                  ["18", "Seconds"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-blue-50 p-5"
                  >
                    <div className="text-3xl font-bold text-blue-700">
                      {value}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Team */}
            <Card>
              <h2 className="text-2xl font-bold">
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
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />

                      <span className="font-medium">
                        {member}
                      </span>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Ready
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructions */}
            <Card>
              <h2 className="text-2xl font-bold">
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
            <Card>
              <h3 className="text-xl font-bold">
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

            <Card className="text-center">
              <Play className="mx-auto h-12 w-12 text-green-600" />

              <h3 className="mt-4 text-xl font-bold">
                Competition Access
              </h3>

              <p className="mt-3 text-slate-600">
                The <strong>Start Competition</strong> button will
                become active automatically when the competition begins.
              </p>

              <Button
                fullWidth
                size="lg"
                disabled
                className="mt-6"
              >
                Waiting for Competition...
              </Button>
            </Card>

            <Link href={`/competitions/${competitionId}`}>
              <Button
                variant="outline"
                fullWidth
                leftIcon={<ArrowLeft className="h-4 w-4" />}
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
      <div className="text-blue-600">
        {icon}
      </div>

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
      <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold">
          {title}
        </h4>

        <p className="mt-1 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}
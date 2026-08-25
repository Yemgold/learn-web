



import Link from "next/link";
import { Users, UserPlus, ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface RegisterTeamPageProps {
  params: Promise<{
    competitionId: string;
  }>;
}

export default async function RegisterTeamPage({
  params,
}: RegisterTeamPageProps) {
  const { competitionId } = await params;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-3">
            <Users className="h-10 w-10" />

            <div>
              <h1 className="text-4xl font-bold">
                Register Your Team
              </h1>

              <p className="mt-2 text-blue-100">
                Competition ID: {competitionId}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold">
                Team Information
              </h2>

              <p className="mt-2 text-slate-600">
                Each team must consist of three students.
              </p>

              <form className="mt-8 space-y-8">
                {/* Team */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold">
                    Team Details
                  </h3>

                  <Input
                    label="Team Name"
                    placeholder="Enter team name"
                  />

                  <Input
                    label="School Name"
                    placeholder="Enter school name"
                  />
                </div>

                {/* Captain */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold">
                    Team Captain
                  </h3>

                  <Input
                    label="Full Name"
                    placeholder="Captain's full name"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="captain@email.com"
                  />

                  <Input
                    label="Phone Number"
                    placeholder="08012345678"
                  />
                </div>

                {/* Member 2 */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold">
                    Team Member 2
                  </h3>

                  <Input
                    label="Full Name"
                    placeholder="Student name"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="student@email.com"
                  />
                </div>

                {/* Member 3 */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold">
                    Team Member 3
                  </h3>

                  <Input
                    label="Full Name"
                    placeholder="Student name"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="student@email.com"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  leftIcon={<UserPlus className="h-5 w-5" />}
                >
                  Register Team
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold">
                Registration Checklist
              </h3>

              <ul className="mt-5 space-y-4 text-slate-600">
                <li>✅ Team of exactly 3 students</li>
                <li>✅ Valid email for each member</li>
                <li>✅ School information</li>
                <li>✅ Team captain selected</li>
                <li>✅ Internet connection</li>
              </ul>
            </Card>

            <Card>
              <h3 className="text-xl font-bold">
                Competition Rules
              </h3>

              <ul className="mt-5 space-y-3 text-slate-600">
                <li>• One student cannot join multiple teams.</li>
                <li>• Team details cannot be edited after approval.</li>
                <li>• All members must verify their email.</li>
                <li>• Competition starts at the scheduled time.</li>
              </ul>
            </Card>

            <div className="space-y-3">
              <Link href={`/competitions/${competitionId}`}>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Back to Competition
                </Button>
              </Link>

              <Link
                href={`/competitions/${competitionId}/room`}
              >
                <Button
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Preview Waiting Room
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}






import Link from "next/link";
import {
  Users,
  Crown,
  User,
  Mail,
  Phone,
  Trophy,
  ArrowRight,
  Plus,
  UserPlus,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    role: "Captain",
    email: "john@example.com",
    phone: "+234 801 234 5678",
    icon: Crown,
    color: "text-amber-500",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Member",
    email: "jane@example.com",
    phone: "+234 802 345 6789",
    icon: User,
    color: "text-blue-600",
  },
  {
    id: 3,
    name: "Michael Johnson",
    role: "Member",
    email: "michael@example.com",
    phone: "+234 803 456 7890",
    icon: User,
    color: "text-blue-600",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Student Portal
            </span>

            <h1 className="mt-4 text-4xl font-bold">
              My Team
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              View your teammates, manage your team and
              prepare for upcoming JAMB League competitions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/student/team/create">
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Team
              </Button>
            </Link>

            <Link href="/student/team/join">
              <Button
                variant="outline"
                leftIcon={<UserPlus className="h-4 w-4" />}
              >
                Join Team
              </Button>
            </Link>
          </div>
        </div>

        {/* Team Summary */}
        <Card className="mb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Users className="h-10 w-10 text-blue-600" />

                <div>
                  <h2 className="text-3xl font-bold">
                    Future Doctors
                  </h2>

                  <p className="text-slate-600">
                    Team Code: JL-2027-001
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-slate-600">
                A dedicated team preparing together for the
                2027 JAMB League Championship with the goal
                of achieving outstanding UTME scores.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-8 py-6 text-center">
              <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

              <h3 className="mt-3 text-3xl font-bold">
                #15
              </h3>

              <p className="text-slate-600">
                National Ranking
              </p>
            </div>
          </div>
        </Card>

        {/* Members */}
        <div>
          <h2 className="mb-6 text-3xl font-bold">
            Team Members
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {teamMembers.map((member) => {
              const Icon = member.icon;

              return (
                <Card
                  key={member.id}
                  hoverable
                  className="flex flex-col"
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                    <Icon
                      className={`h-12 w-12 ${member.color}`}
                    />
                  </div>

                  <h3 className="mt-6 text-center text-2xl font-bold">
                    {member.name}
                  </h3>

                  <p className="mt-2 text-center text-blue-600 font-medium">
                    {member.role}
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-slate-500" />

                      <span className="text-sm text-slate-600">
                        {member.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-slate-500" />

                      <span className="text-sm text-slate-600">
                        {member.phone}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mt-10">
          <h2 className="text-2xl font-bold">
            Team Actions
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/student/team/invitations">
              <Button
                fullWidth
                variant="outline"
                rightIcon={
                  <ArrowRight className="h-4 w-4" />
                }
              >
                Invitations
              </Button>
            </Link>

            <Link href="/student/competitions">
              <Button
                fullWidth
                variant="outline"
                rightIcon={
                  <ArrowRight className="h-4 w-4" />
                }
              >
                Competitions
              </Button>
            </Link>

            <Link href="/student/profile">
              <Button
                fullWidth
                rightIcon={
                  <ArrowRight className="h-4 w-4" />
                }
              >
                My Profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
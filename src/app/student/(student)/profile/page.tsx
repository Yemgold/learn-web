




import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  School,
  MapPin,
  CalendarDays,
  Users,
  Trophy,
  BookOpen,
  Award,
  Pencil,
  ArrowRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentProfilePage() {
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
              My Profile
            </h1>

            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              View your personal information, academic details,
              achievements and team information.
            </p>
          </div>

          <Link href="/student/profile/edit">
            <Button
              leftIcon={<Pencil className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="mb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100">
              <User className="h-14 w-14 text-blue-600" />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold">
                John Doe
              </h2>

              <p className="mt-2 text-slate-600">
                SS3 Student • Future Medical Student
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  Verified Student
                </span>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                  Team Captain
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card hoverable className="text-center">
            <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

            <h2 className="mt-4 text-3xl font-bold">
              5
            </h2>

            <p className="mt-2 text-slate-600">
              Competitions
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Award className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">
              2
            </h2>

            <p className="mt-2 text-slate-600">
              Medals
            </p>
          </Card>

          <Card hoverable className="text-center">
            <BookOpen className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold">
              82%
            </h2>

            <p className="mt-2 text-slate-600">
              Practice Average
            </p>
          </Card>

          <Card hoverable className="text-center">
            <Users className="mx-auto h-10 w-10 text-purple-600" />

            <h2 className="mt-4 text-3xl font-bold">
              3
            </h2>

            <p className="mt-2 text-slate-600">
              Team Members
            </p>
          </Card>
        </div>

        {/* Details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <h2 className="text-2xl font-bold">
              Personal Information
            </h2>

            <div className="mt-8 space-y-6">
              <InfoRow
                icon={<User className="h-5 w-5" />}
                label="Full Name"
                value="John Doe"
              />

              <InfoRow
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value="john@example.com"
              />

              <InfoRow
                icon={<Phone className="h-5 w-5" />}
                label="Phone"
                value="+234 801 234 5678"
              />

              <InfoRow
                icon={<CalendarDays className="h-5 w-5" />}
                label="Date of Birth"
                value="15 June 2008"
              />

              <InfoRow
                icon={<MapPin className="h-5 w-5" />}
                label="State"
                value="Lagos"
              />
            </div>
          </Card>

          {/* Academic Information */}
          <Card>
            <h2 className="text-2xl font-bold">
              Academic Information
            </h2>

            <div className="mt-8 space-y-6">
              <InfoRow
                icon={<School className="h-5 w-5" />}
                label="School"
                value="Federal Government College"
              />

              <InfoRow
                icon={<BookOpen className="h-5 w-5" />}
                label="Class"
                value="SS3"
              />

              <InfoRow
                icon={<Award className="h-5 w-5" />}
                label="Preferred Course"
                value="Medicine & Surgery"
              />

              <InfoRow
                icon={<Users className="h-5 w-5" />}
                label="Team"
                value="Future Doctors"
              />

              <InfoRow
                icon={<Trophy className="h-5 w-5" />}
                label="National Rank"
                value="#127"
              />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-10">
          <h2 className="text-2xl font-bold">
            Quick Actions
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/student/team">
              <Button
                fullWidth
                variant="outline"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                View Team
              </Button>
            </Link>

            <Link href="/student/results">
              <Button
                fullWidth
                variant="outline"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                View Results
              </Button>
            </Link>

            <Link href="/student/settings">
              <Button
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Account Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}
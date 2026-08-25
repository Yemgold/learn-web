





"use client";

import Link from "next/link";
import {
  Users,
  UserCheck,
  GraduationCap,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Download,
  Plus,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const students = [
  {
    id: "STD-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "08031234567",
    school: "King's College Lagos",
    team: "Future Doctors",
    status: "Active",
  },
  {
    id: "STD-002",
    name: "Grace Johnson",
    email: "grace@example.com",
    phone: "08045551234",
    school: "FGGC Benin",
    team: "Science Legends",
    status: "Active",
  },
  {
    id: "STD-003",
    name: "David James",
    email: "david@example.com",
    phone: "08067894512",
    school: "Government College Ibadan",
    team: "Brain Builders",
    status: "Pending",
  },
  {
    id: "STD-004",
    name: "Mary Ibrahim",
    email: "mary@example.com",
    phone: "08123456789",
    school: "Corona Secondary School",
    team: "Elite Scholars",
    status: "Suspended",
  },
];

export default function AdminStudentsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Admin Dashboard
            </span>

            <h1 className="mt-4 text-4xl font-bold">
              Students
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Manage student registrations, monitor profiles,
              verify participation and organize teams across all
              JAMB League competitions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>

            <Link href="/admin/students/create">
              <Button leftIcon={<Plus className="h-4 w-4" />}>
                Add Student
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="text-center">
            <Users className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold">
              4,825
            </h2>

            <p className="mt-2 text-slate-600">
              Registered Students
            </p>
          </Card>

          <Card className="text-center">
            <UserCheck className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">
              4,610
            </h2>

            <p className="mt-2 text-slate-600">
              Active Students
            </p>
          </Card>

          <Card className="text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-purple-600" />

            <h2 className="mt-4 text-3xl font-bold">
              215
            </h2>

            <p className="mt-2 text-slate-600">
              Pending Verification
            </p>
          </Card>

          <Card className="text-center">
            <Filter className="mx-auto h-10 w-10 text-orange-500" />

            <h2 className="mt-4 text-3xl font-bold">
              152
            </h2>

            <p className="mt-2 text-slate-600">
              Schools
            </p>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <Input
            placeholder="Search by name, email, school or team..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Students List */}
        <div className="space-y-6">
          {students.map((student) => (
            <Card
              key={student.id}
              hoverable
              className="p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {student.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : student.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-slate-600">
                    <p>
                      <strong>ID:</strong> {student.id}
                    </p>

                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {student.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {student.phone}
                    </p>

                    <p>
                      <strong>School:</strong>{" "}
                      {student.school}
                    </p>

                    <p>
                      <strong>Team:</strong>{" "}
                      {student.team}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    View Profile
                  </Button>

                  <Button variant="outline">
                    Edit
                  </Button>

                  <Button variant="destructive">
                    Suspend
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}



"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UserCheck,
  GraduationCap,
  School,
  Phone,
  MapPin,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CompleteProfilePage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    // TODO:
    // Call complete profile API here

    setTimeout(() => {
      setLoading(false);
    }, 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10">
      <Card
        hoverable
        className="w-full max-w-3xl shadow-xl"
      >
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <UserCheck className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Complete Your Profile
          </h1>

          <p className="mt-3 text-muted-foreground">
            Tell us more about yourself before joining
            competitions.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="mt-10 space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              placeholder="08012345678"
              required
              leftIcon={<Phone className="h-4 w-4" />}
            />

            <Input
              label="School"
              name="school"
              placeholder="Federal Government College"
              required
              leftIcon={<School className="h-4 w-4" />}
            />

            <Input
              label="Class"
              name="class"
              placeholder="SS3"
              required
              leftIcon={<GraduationCap className="h-4 w-4" />}
            />

            <Input
              label="State"
              name="state"
              placeholder="Lagos"
              required
              leftIcon={<MapPin className="h-4 w-4" />}
            />

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              required
              leftIcon={
                <CalendarDays className="h-4 w-4" />
              }
            />
          </div>

          <Input
            label="Address"
            name="address"
            placeholder="Your residential address"
            required
          />

          <Input
            label="Parent / Guardian Name"
            name="guardianName"
            placeholder="Parent or Guardian"
            required
          />

          <Input
            label="Parent / Guardian Phone"
            name="guardianPhone"
            placeholder="08098765432"
            required
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
          >
            Complete Profile
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          Already completed your profile?{" "}
          <Link
            href="/student/dashboard"
            className="font-semibold text-primary hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </Card>
    </main>
  );
}
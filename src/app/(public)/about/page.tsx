


import Link from "next/link";
import {
  GraduationCap,
  Trophy,
  Users,
  Target,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const values = [
  {
    title: "Academic Excellence",
    description:
      "We encourage students to develop deep understanding rather than rote memorization.",
    icon: GraduationCap,
  },
  {
    title: "Healthy Competition",
    description:
      "Teams compete fairly, learn from one another, and grow together.",
    icon: Trophy,
  },
  {
    title: "Collaboration",
    description:
      "Students work in teams of three, building communication and leadership skills.",
    icon: Users,
  },
  {
    title: "Purpose-Driven Learning",
    description:
      "Every challenge is designed to improve UTME readiness and future success.",
    icon: Target,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <GraduationCap className="h-10 w-10" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
            About JAMB League
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            JAMB League is Nigeria's collaborative academic competition platform
            where students prepare for UTME through teamwork, practice,
            national rankings, and healthy competition.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              Our Mission
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We believe that students perform better when they learn together.
              JAMB League transforms exam preparation into an engaging team
              experience where students motivate one another, practise
              consistently, and compete with peers across the country.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Beyond examinations, our goal is to build confidence, discipline,
              collaboration, and problem-solving skills that students will carry
              into university and their future careers.
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <Users className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Teams of 3 Students
                  </h3>
                  <p className="mt-1 text-slate-600">
                    Collaborate, discuss, and learn together.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                  <Trophy className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    National Competitions
                  </h3>
                  <p className="mt-1 text-slate-600">
                    Compete with schools and teams across Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <Target className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Real UTME Preparation
                  </h3>
                  <p className="mt-1 text-slate-600">
                    Practise with exam-focused questions and challenges.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-slate-900">
              What We Stand For
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              These values guide every competition, question, and feature we
              build for students.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <Card
                  key={value.title}
                  hoverable
                  className="p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-10 md:p-14">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-4xl font-bold text-slate-900">
                Our Vision
              </h2>

              <p className="mt-6 text-xl leading-9 text-slate-600">
                To become the leading student competition and exam-preparation
                platform in Africa, helping millions of students achieve academic
                excellence through technology, collaboration, and healthy
                competition.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold">
            Ready to Join the League?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Form a team, practise consistently, compete nationally, and take
            your JAMB preparation to the next level.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                rightIcon={
                  <ArrowRight className="h-4 w-4" />
                }
              >
                Create Account
              </Button>
            </Link>

            <Link href="/competitions">
              <Button
                size="lg"
                variant="outline"
              >
                Explore Competitions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
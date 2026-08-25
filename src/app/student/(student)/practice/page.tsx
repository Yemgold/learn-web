




"use client";

import Link from "next/link";
import {
  Brain,
  ArrowRight,
  GraduationCap,
  FileText,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

import { Card } from "@/components/ui/card";

/* ============================================================
   TYPES
   ============================================================ */

type ExamType = "jamb" | "waec" | "neco";

interface ExamConfig {
  id: ExamType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  lightColor: string;
  href: string;
}

/* ============================================================
   EXAM CONFIGURATION
   ============================================================ */

const EXAMS: ExamConfig[] = [
  {
    id: "jamb",
    name: "JAMB",
    description:
      "Practice JAMB past questions, CBT examinations, and track your performance.",
    icon: Brain,
    color: "text-blue-600",
    lightColor: "bg-blue-50",
    href: "/student/practice/jamb",
  },

  {
    id: "waec",
    name: "WAEC",
    description:
      "Practice WAEC past questions, examinations, and monitor your academic progress.",
    icon: FileText,
    color: "text-green-600",
    lightColor: "bg-green-50",
    href: "/student/practice/waec",
  },

  {
    id: "neco",
    name: "NECO",
    description:
      "Practice NECO past questions, examinations, and improve your examination performance.",
    icon: ClipboardCheck,
    color: "text-purple-600",
    lightColor: "bg-purple-50",
    href: "/student/practice/neco",
  },
];

/* ============================================================
   PRACTICE EXAMINATION SELECTION PAGE
   ============================================================ */

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* ==================================================
            HEADER
           ================================================== */}

        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Student Practice
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
            Choose Your Examination Type
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-600">
            Select the examination you want to practise. Your practice
            dashboard will be customized for the examination you choose.
          </p>
        </div>

        {/* ==================================================
            EXAMINATION CARDS
           ================================================== */}

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {EXAMS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group text-left"
              >
                <Card
                  hoverable
                  className="relative h-full overflow-hidden border-2 border-slate-200 bg-white p-7 transition-all group-hover:-translate-y-1 group-hover:border-blue-500 group-hover:shadow-xl"
                >
                  {/* Selected / Arrow Indicator */}

                  <div className="absolute right-5 top-5 opacity-0 transition group-hover:opacity-100">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>

                  {/* Icon */}

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.lightColor}`}
                  >
                    <Icon className={`h-8 w-8 ${item.color}`} />
                  </div>

                  {/* Name */}

                  <h2 className="mt-6 text-2xl font-bold text-slate-900">
                    {item.name}
                  </h2>

                  {/* Description */}

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  {/* Button */}

                  <div className="mt-7 flex items-center gap-2 text-sm font-bold text-blue-600">
                    Start {item.name} Practice

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
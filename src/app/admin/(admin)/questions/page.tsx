


"use client";

import Link from "next/link";
import {
  Plus,
  Search,
  BookOpen,
  FileQuestion,
  CheckCircle2,
  Pencil,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const questions = [
  {
    id: "Q001",
    subject: "Use of English",
    topic: "Lexis & Structure",
    difficulty: "Easy",
    status: "Published",
  },
  {
    id: "Q002",
    subject: "Mathematics",
    topic: "Quadratic Equations",
    difficulty: "Medium",
    status: "Published",
  },
  {
    id: "Q003",
    subject: "Physics",
    topic: "Motion",
    difficulty: "Hard",
    status: "Draft",
  },
  {
    id: "Q004",
    subject: "Biology",
    topic: "Genetics",
    difficulty: "Medium",
    status: "Published",
  },
];

export default function AdminQuestionsPage() {
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
              Question Bank
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Manage JAMB CBT questions, organize them by
              subject and topic, and publish them for practice
              tests and competitions.
            </p>
          </div>

          <Link href="/admin/questions/create">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Question
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-4">
          <Card className="text-center">
            <FileQuestion className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold">
              12,450
            </h2>

            <p className="mt-2 text-slate-600">
              Total Questions
            </p>
          </Card>

          <Card className="text-center">
            <BookOpen className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold">
              23
            </h2>

            <p className="mt-2 text-slate-600">
              Subjects
            </p>
          </Card>

          <Card className="text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />

            <h2 className="mt-4 text-3xl font-bold">
              12,110
            </h2>

            <p className="mt-2 text-slate-600">
              Published
            </p>
          </Card>

          <Card className="text-center">
            <Filter className="mx-auto h-10 w-10 text-orange-500" />

            <h2 className="mt-4 text-3xl font-bold">
              340
            </h2>

            <p className="mt-2 text-slate-600">
              Drafts
            </p>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <Input
            placeholder="Search questions..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question) => (
            <Card
              key={question.id}
              hoverable
              className="p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold">
                      {question.subject}
                    </h2>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {question.topic}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        question.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : question.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {question.difficulty}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        question.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {question.status}
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-slate-500">
                    Question ID: {question.id}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    View
                  </Button>

                  <Button
                    variant="outline"
                    leftIcon={<Pencil className="h-4 w-4" />}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete
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
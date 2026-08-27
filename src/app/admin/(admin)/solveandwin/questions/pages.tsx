



"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface Question {
  id: string;
  question: string;
  subject: string;
  examType: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  year: number;
  marks: number;
  status: "published" | "draft" | "archived";
}

const questions: Question[] = [
  {
    id: "question-001",
    question:
      "If x² − 5x + 6 = 0, what are the values of x?",
    subject: "Mathematics",
    examType: "jamb",
    topic: "Quadratic Equations",
    difficulty: "medium",
    year: 2025,
    marks: 2,
    status: "published",
  },
  {
    id: "question-002",
    question:
      "Which organelle is responsible for energy production in a cell?",
    subject: "Biology",
    examType: "jamb",
    topic: "Cell Biology",
    difficulty: "easy",
    year: 2024,
    marks: 1,
    status: "published",
  },
  {
    id: "question-003",
    question:
      "What is the electronic configuration of sodium?",
    subject: "Chemistry",
    examType: "jamb",
    topic: "Atomic Structure",
    difficulty: "medium",
    year: 2025,
    marks: 2,
    status: "published",
  },
  {
    id: "question-004",
    question:
      "A car accelerates from rest at 4 m/s² for 5 seconds. What is its final velocity?",
    subject: "Physics",
    examType: "jamb",
    topic: "Motion",
    difficulty: "easy",
    year: 2023,
    marks: 2,
    status: "published",
  },
  {
    id: "question-005",
    question:
      "Choose the option that best completes the sentence: The students _____ before the teacher arrived.",
    subject: "Use of English",
    examType: "jamb",
    topic: "Grammar",
    difficulty: "medium",
    year: 2026,
    marks: 1,
    status: "published",
  },
  {
    id: "question-006",
    question:
      "Which process converts glucose into pyruvate?",
    subject: "Biology",
    examType: "jamb",
    topic: "Respiration",
    difficulty: "hard",
    year: 2022,
    marks: 2,
    status: "published",
  },
  {
    id: "question-007",
    question:
      "Calculate the pH of a solution with a hydrogen ion concentration of 0.001 mol/dm³.",
    subject: "Chemistry",
    examType: "jamb",
    topic: "Acids and Bases",
    difficulty: "medium",
    year: 2024,
    marks: 2,
    status: "published",
  },
  {
    id: "question-008",
    question:
      "What is the derivative of x² + 3x?",
    subject: "Mathematics",
    examType: "jamb",
    topic: "Calculus",
    difficulty: "hard",
    year: 2026,
    marks: 2,
    status: "published",
  },
];

export default function SolveAndWinQuestionsPage() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState("all");
  const [selectedQuestions, setSelectedQuestions] =
    useState<string[]>([]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const searchMatch =
        search.trim() === "" ||
        question.question
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        question.topic
          .toLowerCase()
          .includes(search.toLowerCase());

      const subjectMatch =
        subjectFilter === "all" ||
        question.subject === subjectFilter;

      const difficultyMatch =
        difficultyFilter === "all" ||
        question.difficulty === difficultyFilter;

      return (
        searchMatch &&
        subjectMatch &&
        difficultyMatch
      );
    });
  }, [
    search,
    subjectFilter,
    difficultyFilter,
  ]);

  const allVisibleSelected =
    filteredQuestions.length > 0 &&
    filteredQuestions.every((question) =>
      selectedQuestions.includes(question.id),
    );

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedQuestions((current) =>
        current.filter(
          (id) =>
            !filteredQuestions.some(
              (question) => question.id === id,
            ),
        ),
      );

      return;
    }

    setSelectedQuestions((current) => {
      const ids = new Set(current);

      filteredQuestions.forEach((question) => {
        ids.add(question.id);
      });

      return Array.from(ids);
    });
  };

  const clearSelection = () => {
    setSelectedQuestions([]);
  };

  const handleAssign = () => {
    if (selectedQuestions.length === 0) {
      alert("Select at least one question first.");
      return;
    }

    /*
     * BACKEND INTEGRATION
     *
     * When the backend endpoint is ready:
     *
     * POST
     * /api/v1/admin/solve-and-win/challenges/:challengeId/questions
     *
     * Example payload:
     *
     * {
     *   questionIds: selectedQuestions
     * }
     */

    console.log(
      "SOLVE & WIN QUESTION IDS:",
      selectedQuestions,
    );

    alert(
      `${selectedQuestions.length} question(s) selected. Connect the assignment API to save them.`,
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/solveandwin"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Solve & Win
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Manage Questions
            </h1>

            <p className="mt-2 text-slate-600">
              Select CBT questions that can be used in Solve & Win
              challenges.
            </p>
          </div>

          <Link
            href="/admin/questions"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Open Question Bank
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Question Pool"
            value={questions.length.toString()}
            description="Available CBT questions"
          />

          <StatCard
            label="Filtered"
            value={filteredQuestions.length.toString()}
            description="Questions matching filters"
          />

          <StatCard
            label="Selected"
            value={selectedQuestions.length.toString()}
            description="Questions selected"
          />

          <StatCard
            label="Subjects"
            value={
              new Set(
                questions.map(
                  (question) => question.subject,
                ),
              ).size.toString()
            }
            description="Subjects represented"
          />
        </div>

        {/* Main */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Question Bank */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border bg-white shadow-sm">
              {/* Search / Filters */}
              <div className="border-b p-6">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-slate-900">
                    CBT Question Pool
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Search and select questions for Solve & Win.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium text-slate-700">
                      Search
                    </label>

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search question or topic..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Subject
                    </label>

                    <select
                      value={subjectFilter}
                      onChange={(event) =>
                        setSubjectFilter(
                          event.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="all">
                        All Subjects
                      </option>

                      <option value="Mathematics">
                        Mathematics
                      </option>

                      <option value="Biology">
                        Biology
                      </option>

                      <option value="Chemistry">
                        Chemistry
                      </option>

                      <option value="Physics">
                        Physics
                      </option>

                      <option value="Use of English">
                        Use of English
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Difficulty
                    </label>

                    <select
                      value={difficultyFilter}
                      onChange={(event) =>
                        setDifficultyFilter(
                          event.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="all">
                        All Difficulties
                      </option>

                      <option value="easy">
                        Easy
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="hard">
                        Hard
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selection Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-slate-50 px-6 py-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                    className="h-5 w-5 rounded"
                  />

                  <span className="text-sm font-semibold text-slate-700">
                    Select visible questions
                  </span>
                </label>

                {selectedQuestions.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Clear selection
                  </button>
                )}
              </div>

              {/* Questions */}
              <div className="divide-y">
                {filteredQuestions.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="font-semibold text-slate-900">
                      No questions found
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Try changing your search or filters.
                    </p>
                  </div>
                ) : (
                  filteredQuestions.map((question) => {
                    const selected =
                      selectedQuestions.includes(
                        question.id,
                      );

                    return (
                      <div
                        key={question.id}
                        className={`p-6 transition ${
                          selected
                            ? "bg-blue-50/50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex gap-4">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleQuestion(
                                question.id,
                              )
                            }
                            className="mt-1 h-5 w-5 shrink-0 rounded"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <p className="font-semibold leading-7 text-slate-900">
                                {question.question}
                              </p>

                              <DifficultyBadge
                                difficulty={
                                  question.difficulty
                                }
                              />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Tag>
                                {question.subject}
                              </Tag>

                              <Tag>
                                {question.topic}
                              </Tag>

                              <Tag>
                                JAMB {question.year}
                              </Tag>

                              <Tag>
                                {question.marks}{" "}
                                {question.marks === 1
                                  ? "mark"
                                  : "marks"}
                              </Tag>

                              <Tag>
                                {question.status}
                              </Tag>
                            </div>

                            <div className="mt-4">
                              <Link
                                href={`/admin/questions/${question.id}`}
                                className="text-sm font-semibold text-blue-600 hover:underline"
                              >
                                View Question →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Selected Questions */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Selected Questions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Questions ready for assignment.
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                  {selectedQuestions.length}
                </span>
              </div>

              {selectedQuestions.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed p-5 text-center">
                  <p className="text-sm text-slate-500">
                    No questions selected yet.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {selectedQuestions.map((id, index) => {
                    const question = questions.find(
                      (item) => item.id === id,
                    );

                    if (!question) return null;

                    return (
                      <div
                        key={id}
                        className="rounded-xl border bg-slate-50 p-4"
                      >
                        <div className="flex gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                            {index + 1}
                          </span>

                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-medium leading-5 text-slate-800">
                              {question.question}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {question.subject} •{" "}
                              {question.topic}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleQuestion(id)
                          }
                          className="mt-3 text-xs font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={handleAssign}
                disabled={
                  selectedQuestions.length === 0
                }
                className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Assign Selected Questions
              </button>
            </section>

            {/* Selection Rules */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Question Rules
              </h2>

              <div className="space-y-4">
                <Rule
                  title="Use CBT Questions"
                  description="Questions should come from the existing question bank."
                />

                <Rule
                  title="Published Only"
                  description="Only published questions should be available for live challenges."
                />

                <Rule
                  title="Match Exam Type"
                  description="JAMB challenges should use JAMB-compatible questions."
                />

                <Rule
                  title="Question Count"
                  description="The selected question count should match the challenge configuration."
                />
              </div>
            </section>

            {/* Important */}
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-semibold text-amber-900">
                Important
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Do not duplicate CBT questions when assigning them
                to Solve & Win. The challenge should reference the
                existing question records by ID.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */

interface StatCardProps {
  label: string;
  value: string;
  description: string;
}

function StatCard({
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </section>
  );
}

/* ============================================================
   DIFFICULTY
   ============================================================ */

function DifficultyBadge({
  difficulty,
}: {
  difficulty: Question["difficulty"];
}) {
  const classes =
    difficulty === "easy"
      ? "bg-green-50 text-green-700"
      : difficulty === "medium"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {difficulty}
    </span>
  );
}

/* ============================================================
   TAG
   ============================================================ */

function Tag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
      {children}
    </span>
  );
}

/* ============================================================
   RULE
   ============================================================ */

function Rule({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="font-semibold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-sm leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";






"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Loader2,
  Plus,
  Search,
  Trash2,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ============================================================
   TYPES
   ============================================================ */

interface Subject {
  _id: string;
  name: string;
  slug?: string;
  code?: string;
  description?: string;
  icon?: string;
}

interface CompetitionSubject {
  subjectId: string;
  subject: Subject;
  questionCount: number;
  marksPerQuestion: number;
  durationMinutes: number;
}

/* ============================================================
   MOCK DATA
   Replace this with your backend subject API.
   ============================================================ */

const availableSubjects: Subject[] = [
  {
    _id: "english",
    name: "English Language",
    slug: "english",
    code: "ENG",
  },
  {
    _id: "mathematics",
    name: "Mathematics",
    slug: "mathematics",
    code: "MATH",
  },
  {
    _id: "physics",
    name: "Physics",
    slug: "physics",
    code: "PHY",
  },
  {
    _id: "chemistry",
    name: "Chemistry",
    slug: "chemistry",
    code: "CHEM",
  },
  {
    _id: "biology",
    name: "Biology",
    slug: "biology",
    code: "BIO",
  },
  {
    _id: "economics",
    name: "Economics",
    slug: "economics",
    code: "ECO",
  },
  {
    _id: "government",
    name: "Government",
    slug: "government",
    code: "GOV",
  },
  {
    _id: "commerce",
    name: "Commerce",
    slug: "commerce",
    code: "COM",
  },
];

/* ============================================================
   PAGE
   ============================================================ */

export default function AddCompetitionSubjectsPage() {
  const router = useRouter();
  const params = useParams();

  const competitionId = params?.competitionId as string;

  const [search, setSearch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<
    CompetitionSubject[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  /* ============================================================
     FILTER SUBJECTS
     ============================================================ */

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return availableSubjects;
    }

    return availableSubjects.filter((subject) => {
      return (
        subject.name.toLowerCase().includes(query) ||
        subject.code?.toLowerCase().includes(query)
      );
    });
  }, [search]);

  /* ============================================================
     LOAD EXISTING COMPETITION SUBJECTS
     
     Replace this section with your backend request.
     ============================================================ */

  useEffect(() => {
    if (!competitionId) return;

    const loadCompetitionSubjects = async () => {
      try {
        setIsLoading(true);
        setError("");

        /*
         * Example:
         *
         * const response = await getCompetitionSubjects(
         *   competitionId
         * );
         *
         * setSelectedSubjects(response.data);
         */

        // Temporary:
        await Promise.resolve();
      } catch (err) {
        console.error("Failed to load competition subjects:", err);
        setError("Failed to load the competition subjects.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetitionSubjects();
  }, [competitionId]);

  /* ============================================================
     CHECK IF SUBJECT IS SELECTED
     ============================================================ */

  const isSelected = (subjectId: string) => {
    return selectedSubjects.some(
      (item) => item.subjectId === subjectId,
    );
  };

  /* ============================================================
     ADD SUBJECT
     ============================================================ */

  const handleAddSubject = (subject: Subject) => {
    if (isSelected(subject._id)) {
      return;
    }

    const newSubject: CompetitionSubject = {
      subjectId: subject._id,
      subject,
      questionCount: 10,
      marksPerQuestion: 1,
      durationMinutes: 10,
    };

    setSelectedSubjects((current) => [
      ...current,
      newSubject,
    ]);
  };

  /* ============================================================
     REMOVE SUBJECT
     ============================================================ */

  const handleRemoveSubject = (subjectId: string) => {
    setSelectedSubjects((current) =>
      current.filter(
        (item) => item.subjectId !== subjectId,
      ),
    );
  };

  /* ============================================================
     UPDATE SUBJECT CONFIG
     ============================================================ */

  const updateSubject = (
    subjectId: string,
    field:
      | "questionCount"
      | "marksPerQuestion"
      | "durationMinutes",
    value: number,
  ) => {
    setSelectedSubjects((current) =>
      current.map((item) =>
        item.subjectId === subjectId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  /* ============================================================
     SAVE
     ============================================================ */

  const handleSave = async () => {
    if (!competitionId) {
      setError("Competition ID is missing.");
      return;
    }

    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        competitionId,
        subjects: selectedSubjects.map((item) => ({
          subjectId: item.subjectId,
          questionCount: item.questionCount,
          marksPerQuestion: item.marksPerQuestion,
          durationMinutes: item.durationMinutes,
        })),
      };

      console.log(
        "SAVE COMPETITION SUBJECTS:",
        payload,
      );

      /*
       * Replace with your real API call:
       *
       * await addCompetitionSubjects(payload);
       */

      await Promise.resolve();

      router.push(
        `/admin/solveandwin/competitions/${competitionId}`,
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Failed to save competition subjects:",
        err,
      );

      setError(
        "Failed to add subjects to the competition. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* ============================================================
     TOTALS
     ============================================================ */

  const totalQuestions = selectedSubjects.reduce(
    (total, subject) =>
      total + subject.questionCount,
    0,
  );

  const totalMarks = selectedSubjects.reduce(
    (total, subject) =>
      total +
      subject.questionCount *
        subject.marksPerQuestion,
    0,
  );

  const totalDuration = selectedSubjects.reduce(
    (total, subject) =>
      total + subject.durationMinutes,
    0,
  );

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/admin/solveandwin/competitions/${competitionId}`,
              )
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                <Trophy className="h-4 w-4" />
                Solve & Win
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Add Competition Subjects
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">
                Select the subjects that will be available
                in this competition and configure the
                number of questions, marks and duration.
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={
                isSaving ||
                selectedSubjects.length === 0
              }
              leftIcon={
                isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )
              }
            >
              {isSaving
                ? "Saving..."
                : "Save Subjects"}
            </Button>
          </div>
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            SUMMARY
        ====================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm font-medium text-slate-500">
              Selected Subjects
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {selectedSubjects.length}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-medium text-slate-500">
              Total Questions
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalQuestions}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-medium text-slate-500">
              Total Marks
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalMarks}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-medium text-slate-500">
              Total Duration
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalDuration} min
            </p>
          </Card>
        </div>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* ====================================================
              AVAILABLE SUBJECTS
          ==================================================== */}

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Available Subjects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select one or more subjects for this
                competition.
              </p>

              <div className="mt-5">
                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search subjects..."
                  leftIcon={
                    <Search className="h-4 w-4" />
                  }
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="flex items-center justify-center px-6 py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-4 font-medium text-slate-700">
                    No subjects found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try another search term.
                  </p>
                </div>
              ) : (
                filteredSubjects.map((subject) => {
                  const selected = isSelected(
                    subject._id,
                  );

                  return (
                    <div
                      key={subject._id}
                      className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                          <BookOpen className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900">
                            {subject.name}
                          </h3>

                          {subject.code && (
                            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                              {subject.code}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant={
                          selected
                            ? "outline"
                            : "default"
                        }
                        disabled={selected}
                        onClick={() =>
                          handleAddSubject(subject)
                        }
                        leftIcon={
                          selected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )
                        }
                      >
                        {selected ? "Added" : "Add"}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* ====================================================
              SELECTED SUBJECTS
          ==================================================== */}

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Competition Subjects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure each subject before saving.
              </p>
            </div>

            {selectedSubjects.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <BookOpen className="h-7 w-7 text-slate-400" />
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  No subjects selected
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Select subjects from the list on the
                  left to add them to this competition.
                </p>
              </div>
            ) : (
              <div className="space-y-5 p-6">
                {selectedSubjects.map(
                  (item, index) => (
                    <div
                      key={item.subjectId}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                            {index + 1}
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-900">
                              {item.subject.name}
                            </h3>

                            {item.subject.code && (
                              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                {item.subject.code}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSubject(
                              item.subjectId,
                            )
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${item.subject.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {/* Question Count */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Questions
                          </label>

                          <Input
                            type="number"
                            min={1}
                            value={
                              item.questionCount
                            }
                            onChange={(event) =>
                              updateSubject(
                                item.subjectId,
                                "questionCount",
                                Math.max(
                                  1,
                                  Number(
                                    event.target.value,
                                  ),
                                ),
                              )
                            }
                          />
                        </div>

                        {/* Marks */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Marks / Question
                          </label>

                          <Input
                            type="number"
                            min={1}
                            value={
                              item.marksPerQuestion
                            }
                            onChange={(event) =>
                              updateSubject(
                                item.subjectId,
                                "marksPerQuestion",
                                Math.max(
                                  1,
                                  Number(
                                    event.target.value,
                                  ),
                                ),
                              )
                            }
                          />
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Duration (min)
                          </label>

                          <Input
                            type="number"
                            min={1}
                            value={
                              item.durationMinutes
                            }
                            onChange={(event) =>
                              updateSubject(
                                item.subjectId,
                                "durationMinutes",
                                Math.max(
                                  1,
                                  Number(
                                    event.target.value,
                                  ),
                                ),
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-4 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600">
                        <span>
                          {item.questionCount}{" "}
                          questions
                        </span>

                        <span>
                          {item.questionCount *
                            item.marksPerQuestion}{" "}
                          marks
                        </span>

                        <span>
                          {item.durationMinutes}{" "}
                          minutes
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </Card>
        </div>

        {/* ======================================================
            BOTTOM ACTIONS
        ====================================================== */}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                `/admin/solveandwin/competitions/${competitionId}`,
              )
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              isSaving ||
              selectedSubjects.length === 0
            }
            onClick={handleSave}
            leftIcon={
              isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )
            }
          >
            {isSaving
              ? "Saving Subjects..."
              : `Save ${selectedSubjects.length} Subject${
                  selectedSubjects.length === 1
                    ? ""
                    : "s"
                }`}
          </Button>
        </div>
      </div>
    </main>
  );
}

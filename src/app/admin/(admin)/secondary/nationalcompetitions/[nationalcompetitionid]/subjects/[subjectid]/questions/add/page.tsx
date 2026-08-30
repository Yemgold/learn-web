





"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileQuestion,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

type OptionKey = "A" | "B" | "C" | "D";

interface QuestionOption {
  key: OptionKey;
  text: string;
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AddCompetitionQuestionPage() {
  const params = useParams();

  const rawCompetitionId =
    params.nationalcompetitionid;

  const rawSubjectId =
    params.subjectid;

  const competitionId = Array.isArray(
    rawCompetitionId,
  )
    ? rawCompetitionId[0]
    : rawCompetitionId;

  const subjectId = Array.isArray(
    rawSubjectId,
  )
    ? rawSubjectId[0]
    : rawSubjectId;

  /* ==========================================================
     FORM STATE
     ========================================================== */

  const [question, setQuestion] =
    useState("");

  const [options, setOptions] =
    useState<QuestionOption[]>([
      {
        key: "A",
        text: "",
      },
      {
        key: "B",
        text: "",
      },
      {
        key: "C",
        text: "",
      },
      {
        key: "D",
        text: "",
      },
    ]);

  const [correctAnswer, setCorrectAnswer] =
    useState<OptionKey | "">("");

  const [explanation, setExplanation] =
    useState("");

  const [difficulty, setDifficulty] =
    useState<
      "EASY" | "MEDIUM" | "HARD"
    >("MEDIUM");

  const [marks, setMarks] =
    useState("1");

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  /* ==========================================================
     UPDATE OPTION
     ========================================================== */

  const updateOption = (
    key: OptionKey,
    value: string,
  ) => {
    setOptions((current) =>
      current.map((option) =>
        option.key === key
          ? {
              ...option,
              text: value,
            }
          : option,
      ),
    );
  };

  /* ==========================================================
     VALIDATE FORM
     ========================================================== */

  const validateForm = (): boolean => {
    setError("");
    setSuccessMessage("");

    if (!question.trim()) {
      setError(
        "Please enter the question.",
      );
      return false;
    }

    const emptyOption =
      options.find(
        (option) =>
          !option.text.trim(),
      );

    if (emptyOption) {
      setError(
        `Please enter text for option ${emptyOption.key}.`,
      );
      return false;
    }

    if (!correctAnswer) {
      setError(
        "Please select the correct answer.",
      );
      return false;
    }

    const numericMarks =
      Number(marks);

    if (
      !marks.trim() ||
      Number.isNaN(numericMarks) ||
      numericMarks <= 0
    ) {
      setError(
        "Marks must be a number greater than 0.",
      );
      return false;
    }

    return true;
  };

  /* ==========================================================
     SAVE QUESTION
     ========================================================== */

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    /*
     * IMPORTANT:
     *
     * There is currently no National Competition
     * question-create API.
     *
     * Therefore we intentionally do NOT send
     * this data to a backend endpoint yet.
     *
     * Once the backend endpoint exists, this is where
     * the API call should be connected.
     */

    await new Promise((resolve) =>
      setTimeout(resolve, 800),
    );

    setIsSaving(false);

    setSuccessMessage(
      "Question validated successfully. The save operation will be connected to the National Competition API when the backend endpoint is available.",
    );
  };

  /* ==========================================================
     RESET FORM
     ========================================================== */

  const handleReset = () => {
    setQuestion("");

    setOptions([
      {
        key: "A",
        text: "",
      },
      {
        key: "B",
        text: "",
      },
      {
        key: "C",
        text: "",
      },
      {
        key: "D",
        text: "",
      },
    ]);

    setCorrectAnswer("");
    setExplanation("");
    setDifficulty("MEDIUM");
    setMarks("1");

    setError("");
    setSuccessMessage("");
  };

  /* ==========================================================
     ROUTE VALIDATION
     ========================================================== */

  if (!competitionId || !subjectId) {
    return (
      <ErrorState message="Competition ID or Subject ID is missing." />
    );
  }

  /* ==========================================================
     PAGE
     ========================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

          <Link
            href="/admin"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Admin
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span>Secondary</span>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/secondary/nationalcompetitions"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            National Competitions
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Competition
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Subjects
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Subject
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions`}
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Questions
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-900 dark:text-white">
            Add
          </span>

        </div>

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href={`/admin/secondary/nationalcompetitions/${competitionId}/subjects/${subjectId}/questions`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Questions
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <FileQuestion className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Add Question
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Create a multiple-choice question for this
            national competition subject.
          </p>

        </div>

        {/* ==================================================
            LAYOUT
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* =================================================
              FORM
          ================================================= */}

          <div className="space-y-6">

            {/* QUESTION */}

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Question
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter the question students will answer.
                </p>

              </div>

              <div className="p-5 sm:p-6">

                <label
                  htmlFor="question"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Question Text
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  id="question"
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target.value,
                    )
                  }
                  placeholder="Enter the question..."
                  rows={6}
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-800"
                />

              </div>

            </section>

            {/* OPTIONS */}

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Answer Options
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter four answer choices and select the
                  correct one.
                </p>

              </div>

              <div className="space-y-5 p-5 sm:p-6">

                {options.map(
                  (option) => (
                    <div
                      key={option.key}
                    >

                      <div className="mb-2 flex items-center justify-between">

                        <label
                          htmlFor={`option-${option.key}`}
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Option{" "}
                          {option.key}
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">

                          <input
                            type="radio"
                            name="correctAnswer"
                            value={
                              option.key
                            }
                            checked={
                              correctAnswer ===
                              option.key
                            }
                            onChange={() =>
                              setCorrectAnswer(
                                option.key,
                              )
                            }
                            className="h-4 w-4"
                          />

                          Correct answer

                        </label>

                      </div>

                      <textarea
                        id={`option-${option.key}`}
                        value={
                          option.text
                        }
                        onChange={(
                          event,
                        ) =>
                          updateOption(
                            option.key,
                            event.target
                              .value,
                          )
                        }
                        placeholder={`Enter option ${option.key}...`}
                        rows={3}
                        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-800"
                      />

                    </div>
                  ),
                )}

              </div>

            </section>

            {/* EXPLANATION */}

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Explanation
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Optional explanation shown after the
                  question is answered.
                </p>

              </div>

              <div className="p-5 sm:p-6">

                <label
                  htmlFor="explanation"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Explanation
                </label>

                <textarea
                  id="explanation"
                  value={explanation}
                  onChange={(event) =>
                    setExplanation(
                      event.target.value,
                    )
                  }
                  placeholder="Explain why the selected answer is correct..."
                  rows={5}
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-800"
                />

              </div>

            </section>

            {/* ERROR */}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* SUCCESS */}

            {successMessage && (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300">

                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <span>
                  {successMessage}
                </span>

              </div>
            )}

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Trash2 className="h-4 w-4" />
                Clear Form
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >

                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Question
                  </>
                )}

              </button>

            </div>

          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-6">

            {/* QUESTION SETTINGS */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Question Settings
              </h2>

              <div className="mt-5 space-y-5">

                {/* DIFFICULTY */}

                <div>

                  <label
                    htmlFor="difficulty"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(event) =>
                      setDifficulty(
                        event.target
                          .value as
                          | "EASY"
                          | "MEDIUM"
                          | "HARD",
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  >
                    <option value="EASY">
                      Easy
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="HARD">
                      Hard
                    </option>
                  </select>

                </div>

                {/* MARKS */}

                <div>

                  <label
                    htmlFor="marks"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Marks
                  </label>

                  <input
                    id="marks"
                    type="number"
                    min="1"
                    step="1"
                    value={marks}
                    onChange={(event) =>
                      setMarks(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-gray-500 dark:focus:ring-gray-800"
                  />

                </div>

              </div>

            </section>

            {/* PREVIEW */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Question Preview
              </h2>

              <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

                <p className="text-sm leading-6 text-gray-800 dark:text-gray-200">
                  {question.trim() ||
                    "Your question will appear here."}
                </p>

                <div className="mt-4 space-y-2">

                  {options.map(
                    (option) => (
                      <div
                        key={option.key}
                        className={[
                          "rounded-lg border px-3 py-2.5 text-sm",
                          correctAnswer ===
                          option.key
                            ? "border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300"
                            : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
                        ].join(" ")}
                      >
                        <span className="mr-2 font-semibold">
                          {option.key}.
                        </span>

                        {option.text.trim() ||
                          `Option ${option.key}`}
                      </div>
                    ),
                  )}

                </div>

              </div>

            </section>

            {/* BACKEND STATUS */}

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

              <div className="flex items-start gap-3">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />

                <div>

                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Backend status
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    The National Competition question
                    creation endpoint is not connected yet.
                  </p>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </div>
    </div>
  );
}

/* ============================================================
   ERROR STATE
   ============================================================ */

function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-3xl">

        <Link
          href="/admin/secondary/nationalcompetitions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">

            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />

          </div>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invalid route
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {message}
          </p>

          <Link
            href="/admin/secondary/nationalcompetitions"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
          >
            Back to Competitions
          </Link>

        </div>

      </div>

    </div>
  );
}






"use client";

import Link from "next/link";
import { useState } from "react";

const examTypes = [
  { value: "jamb", label: "JAMB" },
  { value: "waec", label: "WAEC" },
  { value: "neco", label: "NECO" },
];

const subjects = [
  { value: "mixed", label: "Mixed" },
  { value: "english", label: "Use of English" },
  { value: "mathematics", label: "Mathematics" },
  { value: "biology", label: "Biology" },
  { value: "chemistry", label: "Chemistry" },
  { value: "physics", label: "Physics" },
];

const difficulties = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const icons = [
  { value: "zap", label: "⚡ Zap" },
  { value: "book", label: "📚 Book" },
  { value: "brain", label: "🧠 Brain" },
  { value: "trophy", label: "🏆 Trophy" },
  { value: "target", label: "🎯 Target" },
];

export default function CreateSolveAndWinPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    examType: "jamb",
    subjectId: "mixed",
    questionCount: 10,
    durationMinutes: 10,
    entryCost: 500,
    rewardType: "cash",
    rewardAmount: 500,
    currency: "NGN",
    difficulty: "easy",
    icon: "zap",
    enabled: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (
    field: keyof typeof form,
    value: string | number | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),

        examType: form.examType,

        subjectId: form.subjectId,

        questionCount: Number(form.questionCount),

        durationMinutes: Number(form.durationMinutes),

        entryCost: {
          cbtPoints: Number(form.entryCost),
        },

        reward: {
          type: form.rewardType,
          amount: Number(form.rewardAmount),
          currency: form.currency,
        },

        difficulty: form.difficulty,

        icon: form.icon,

        enabled: form.enabled,
      };

      console.log(
        "CREATE SOLVE & WIN PAYLOAD",
        payload,
      );

      /*
       * BACKEND INTEGRATION
       *
       * When the backend endpoint is ready:
       *
       * await axiosInstance.post(
       *   "/admin/solve-and-win/challenges",
       *   payload,
       * );
       *
       * Then redirect back to:
       *
       * /admin/solveandwin
       */

      alert(
        "Challenge form is ready. Connect the API endpoint to create the challenge.",
      );
    } catch (error) {
      console.error(
        "Failed to create Solve & Win challenge:",
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/solveandwin"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Solve & Win
          </Link>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Create Solve & Win Challenge
          </h1>

          <p className="mt-2 text-slate-600">
            Configure a new challenge for students to enter using
            CBT Points and compete for rewards.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the basic details students will see.
              </p>
            </div>

            <div className="space-y-5">
              <Field
                label="Challenge Title"
                required
              >
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. JAMB Quick Challenge"
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                label="Description"
                required
              >
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Describe what students should expect from this challenge..."
                  rows={4}
                  required
                  className={inputClass}
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Exam Type"
                  required
                >
                  <select
                    value={form.examType}
                    onChange={(event) =>
                      updateField(
                        "examType",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    {examTypes.map((exam) => (
                      <option
                        key={exam.value}
                        value={exam.value}
                      >
                        {exam.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Subject"
                  required
                >
                  <select
                    value={form.subjectId}
                    onChange={(event) =>
                      updateField(
                        "subjectId",
                        event.target.value,
                      )
                    }
                    className={inputClass}
                  >
                    {subjects.map((subject) => (
                      <option
                        key={subject.value}
                        value={subject.value}
                      >
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </section>

          {/* Challenge Configuration */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Challenge Configuration
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Define how the challenge will be played.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Field
                label="Number of Questions"
                required
              >
                <input
                  type="number"
                  min={1}
                  value={form.questionCount}
                  onChange={(event) =>
                    updateField(
                      "questionCount",
                      Number(event.target.value),
                    )
                  }
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                label="Duration (Minutes)"
                required
              >
                <input
                  type="number"
                  min={1}
                  value={form.durationMinutes}
                  onChange={(event) =>
                    updateField(
                      "durationMinutes",
                      Number(event.target.value),
                    )
                  }
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                label="Difficulty"
                required
              >
                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    updateField(
                      "difficulty",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                >
                  {difficulties.map((difficulty) => (
                    <option
                      key={difficulty.value}
                      value={difficulty.value}
                    >
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="font-semibold text-blue-900">
                Question Source
              </p>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                Questions for this challenge should come from the
                existing CBT question bank. After creating the
                challenge, you can assign or configure the questions.
              </p>
            </div>
          </section>

          {/* Entry & Reward */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Entry & Reward
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure how many CBT Points students spend and
                what they can win.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Entry Cost (CBT Points)"
                required
              >
                <input
                  type="number"
                  min={0}
                  value={form.entryCost}
                  onChange={(event) =>
                    updateField(
                      "entryCost",
                      Number(event.target.value),
                    )
                  }
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                label="Reward Type"
                required
              >
                <select
                  value={form.rewardType}
                  onChange={(event) =>
                    updateField(
                      "rewardType",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                >
                  <option value="cash">
                    Cash
                  </option>

                  <option value="cbtPoints">
                    CBT Points
                  </option>
                </select>
              </Field>

              <Field
                label="Reward Amount"
                required
              >
                <input
                  type="number"
                  min={0}
                  value={form.rewardAmount}
                  onChange={(event) =>
                    updateField(
                      "rewardAmount",
                      Number(event.target.value),
                    )
                  }
                  required
                  className={inputClass}
                />
              </Field>

              <Field
                label="Currency"
                required
              >
                <select
                  value={form.currency}
                  onChange={(event) =>
                    updateField(
                      "currency",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                >
                  <option value="NGN">
                    NGN
                  </option>

                  <option value="USD">
                    USD
                  </option>
                </select>
              </Field>
            </div>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">
                Important
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                The backend should deduct the entry CBT Points
                atomically when a student joins the challenge. The
                frontend should never directly modify a student's
                wallet balance.
              </p>
            </div>
          </section>

          {/* Appearance */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Challenge Appearance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose how the challenge is represented in the
                student interface.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Icon"
                required
              >
                <select
                  value={form.icon}
                  onChange={(event) =>
                    updateField(
                      "icon",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                >
                  {icons.map((icon) => (
                    <option
                      key={icon.value}
                      value={icon.value}
                    >
                      {icon.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Preview
                </p>

                <div className="mt-2 flex items-center gap-3 rounded-xl border bg-slate-50 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                    {getIcon(form.icon)}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {form.title || "Challenge Title"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {form.questionCount} questions •{" "}
                      {form.durationMinutes} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Availability
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Decide whether students can immediately see and
                enter this challenge.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-4 rounded-xl border p-4 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) =>
                  updateField(
                    "enabled",
                    event.target.checked,
                  )
                }
                className="mt-1 h-5 w-5"
              />

              <div>
                <p className="font-semibold text-slate-900">
                  Enable challenge
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  When enabled, the challenge can become available
                  to students through the Solve & Win section.
                </p>
              </div>
            </label>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link
              href="/admin/solveandwin"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creating..."
                : "Create Challenge"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ============================================================
   FIELD
   ============================================================ */

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({
  label,
  required,
  children,
}: FieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

/* ============================================================
   ICON
   ============================================================ */

function getIcon(icon: string) {
  switch (icon) {
    case "zap":
      return "⚡";

    case "book":
      return "📚";

    case "brain":
      return "🧠";

    case "trophy":
      return "🏆";

    case "target":
      return "🎯";

    default:
      return "🏆";
  }
}

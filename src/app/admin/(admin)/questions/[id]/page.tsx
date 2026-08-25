




import Link from "next/link";

interface QuestionDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuestionDetailsPage({
  params,
}: QuestionDetailsPageProps) {
  const { id } = await params;

  // Temporary placeholder data
  const question = {
    id,
    subject: "Mathematics",
    topic: "Quadratic Equations",
    difficulty: "Medium",
    status: "Published",
    marks: 2,
    createdBy: "Admin",
    createdAt: "10 January 2027",

    question:
      "If x² − 5x + 6 = 0, what are the values of x?",

    options: [
      {
        label: "A",
        value: "x = 2 or x = 3",
        correct: true,
      },
      {
        label: "B",
        value: "x = 1 or x = 6",
        correct: false,
      },
      {
        label: "C",
        value: "x = -2 or x = -3",
        correct: false,
      },
      {
        label: "D",
        value: "x = 5 or x = 6",
        correct: false,
      },
    ],

    explanation:
      "Factorizing x² − 5x + 6 gives (x − 2)(x − 3) = 0, therefore x = 2 or x = 3.",
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/questions"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Question Bank
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Question Details
            </h1>

            <p className="mt-2 text-slate-600">
              View complete information about this CBT
              question.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/admin/questions/${id}/edit`}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Edit Question
            </Link>

            <button className="rounded-xl border border-red-300 bg-red-50 px-5 py-3 font-semibold text-red-700 hover:bg-red-100">
              Delete
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-8 lg:col-span-2">
            {/* Question */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Question
              </h2>

              <p className="text-lg leading-8 text-slate-800">
                {question.question}
              </p>
            </section>

            {/* Options */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold">
                Answer Options
              </h2>

              <div className="space-y-4">
                {question.options.map((option) => (
                  <div
                    key={option.label}
                    className={`rounded-xl border p-4 ${
                      option.correct
                        ? "border-green-300 bg-green-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold">
                          {option.label}.
                        </span>{" "}
                        {option.value}
                      </div>

                      {option.correct && (
                        <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Explanation */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">
                Explanation
              </h2>

              <p className="leading-7 text-slate-600">
                {question.explanation}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Question Information
              </h2>

              <div className="space-y-5">
                <Info
                  label="Subject"
                  value={question.subject}
                />

                <Info
                  label="Topic"
                  value={question.topic}
                />

                <Info
                  label="Difficulty"
                  value={question.difficulty}
                />

                <Info
                  label="Marks"
                  value={`${question.marks} Marks`}
                />

                <Info
                  label="Status"
                  value={question.status}
                />

                <Info
                  label="Created By"
                  value={question.createdBy}
                />

                <Info
                  label="Created On"
                  value={question.createdAt}
                />
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Link
                  href={`/admin/questions/${id}/edit`}
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  Edit Question
                </Link>

                <button className="w-full rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-semibold text-green-700 hover:bg-green-100">
                  Duplicate Question
                </button>

                <button className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-700 hover:bg-amber-100">
                  Archive
                </button>

                <button className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100">
                  Delete Question
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}






import Link from "next/link";

interface EditQuestionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const { id } = await params;

  // Placeholder data
  const question = {
    id,
    subject: "Mathematics",
    topic: "Quadratic Equations",
    difficulty: "Medium",
    question:
      "If x² - 5x + 6 = 0, what are the values of x?",
    optionA: "2 and 3",
    optionB: "1 and 6",
    optionC: "-2 and -3",
    optionD: "3 and 6",
    answer: "A",
    explanation:
      "Factorizing x² - 5x + 6 gives (x − 2)(x − 3) = 0. Therefore x = 2 or x = 3.",
    status: "Published",
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href={`/admin/questions/${id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Question
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Edit Question
            </h1>

            <p className="mt-2 text-slate-600">
              Update the question, options, answer and explanation.
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            ID: {question.id}
          </span>
        </div>

        <form className="space-y-8">
          {/* Basic Details */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Question Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subject
                </label>

                <select
                  defaultValue={question.subject}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>Economics</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Topic
                </label>

                <input
                  defaultValue={question.topic}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Difficulty
                </label>

                <select
                  defaultValue={question.difficulty}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  defaultValue={question.status}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                >
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Archived</option>
                </select>
              </div>
            </div>
          </section>

          {/* Question */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Question
            </h2>

            <label className="mb-2 block text-sm font-medium">
              Question Text
            </label>

            <textarea
              rows={5}
              defaultValue={question.question}
              className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </section>

          {/* Options */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Answer Options
            </h2>

            <div className="space-y-5">
              {[
                ["A", question.optionA],
                ["B", question.optionB],
                ["C", question.optionC],
                ["D", question.optionD],
              ].map(([letter, value]) => (
                <div
                  key={letter}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                    {letter}
                  </div>

                  <input
                    defaultValue={value}
                    className="flex-1 rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Correct Answer */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Correct Answer
            </h2>

            <select
              defaultValue={question.answer}
              className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </section>

          {/* Explanation */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              Explanation
            </h2>

            <textarea
              rows={5}
              defaultValue={question.explanation}
              className="w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="rounded-xl border border-amber-300 bg-amber-50 px-8 py-3 font-semibold text-amber-700 transition hover:bg-amber-100"
            >
              Save as Draft
            </button>

            <button
              type="button"
              className="rounded-xl border border-red-300 bg-red-50 px-8 py-3 font-semibold text-red-700 transition hover:bg-red-100"
            >
              Delete Question
            </button>

            <Link
              href={`/admin/questions/${id}`}
              className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}




export default function CreateQuestionPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Question Bank
          </span>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Create New Question
          </h1>

          <p className="mt-3 max-w-3xl text-slate-600">
            Add new CBT questions to the JAMB League question bank. Questions
            can be assigned to subjects, topics, difficulty levels and
            competitions.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <section className="rounded-2xl border bg-white p-8 shadow-sm lg:col-span-2">
            <h2 className="mb-6 text-2xl font-semibold">
              Question Details
            </h2>

            <form className="space-y-6">
              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>Economics</option>
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Topic
                </label>

                <input
                  type="text"
                  placeholder="e.g. Quadratic Equations"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Difficulty
                </label>

                <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              {/* Question */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Question
                </label>

                <textarea
                  rows={6}
                  placeholder="Enter the question..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Answer Options
                </h3>

                <input
                  type="text"
                  placeholder="Option A"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Option B"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Option C"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Option D"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              {/* Correct Answer */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Correct Answer
                </label>

                <select className="w-full rounded-xl border border-slate-300 px-4 py-3">
                  <option>Option A</option>
                  <option>Option B</option>
                  <option>Option C</option>
                  <option>Option D</option>
                </select>
              </div>

              {/* Explanation */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Explanation
                </label>

                <textarea
                  rows={5}
                  placeholder="Explain why this answer is correct..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Save Question
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100"
                >
                  Save as Draft
                </button>

                <button
                  type="reset"
                  className="rounded-xl border border-red-300 px-6 py-3 font-semibold text-red-600 hover:bg-red-50"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                Question Guidelines
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Use clear and concise wording.</li>
                <li>• Only one correct answer.</li>
                <li>• Avoid ambiguous options.</li>
                <li>• Provide an explanation.</li>
                <li>• Assign the correct subject.</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                Statistics
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between">
                  <span>Total Questions</span>
                  <strong>5,280</strong>
                </div>

                <div className="flex justify-between">
                  <span>Mathematics</span>
                  <strong>1,240</strong>
                </div>

                <div className="flex justify-between">
                  <span>English</span>
                  <strong>980</strong>
                </div>

                <div className="flex justify-between">
                  <span>Science</span>
                  <strong>2,010</strong>
                </div>

                <div className="flex justify-between">
                  <span>Others</span>
                  <strong>1,050</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
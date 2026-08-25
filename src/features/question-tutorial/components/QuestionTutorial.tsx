


"use client";

import { useState } from "react";

const subjects = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
];

const topics: Record<string, string[]> = {
  Mathematics: [
    "Algebra",
    "Geometry",
    "Statistics",
  ],

  English: [
    "Grammar",
    "Comprehension",
    "Vocabulary",
  ],

  Physics: [
    "Mechanics",
    "Waves",
    "Heat",
    "Electricity",
  ],

  Chemistry: [
    "Atomic Structure",
    "Chemical Bonding",
    "Organic Chemistry",
  ],

  Biology: [
    "Cell Biology",
    "Genetics",
    "Ecology",
  ],

  Economics: [
    "Demand and Supply",
    "Production",
    "Market Structure",
  ],
};

export default function QuestionTutorial() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  const availableTopics = subject
    ? topics[subject] ?? []
    : [];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">

          <div className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            🎮 JAMB League Arena
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Learn Through Questions
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Listen, think, answer and understand JAMB questions
            through interactive lessons.
          </p>

        </div>

        {/* Selection */}
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* Subject */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Select Subject
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

              {subjects.map((item) => {
                const selected = subject === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSubject(item);
                      setTopic("");
                    }}
                    className={`rounded-2xl border p-4 text-left font-semibold transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

            </div>
          </div>

          {/* Topic */}
          {subject && (
            <div className="mt-8">

              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Select Topic
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                {availableTopics.map((item) => {
                  const selected = topic === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(item)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-semibold">
                        {item}
                      </span>

                      <span className="mt-1 block text-sm text-slate-500">
                        Interactive questions
                      </span>
                    </button>
                  );
                })}

              </div>

            </div>
          )}

          {/* Start */}
          <button
            type="button"
            disabled={!subject || !topic}
            className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start Interactive Lesson →
          </button>

        </div>
      </div>
    </main>
  );
}
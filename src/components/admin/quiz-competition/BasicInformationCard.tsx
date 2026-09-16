



// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\admin\quiz-competition\BasicInformationCard.tsx

"use client";

import {
  Clock3,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import type {
  FormState,
  QuizPreset,
  Subject,
} from "@/types/quizCompetition";

import { formatDateTimeLocal } from "@/lib/quizCompetition/utils";

type Props = {
  form: FormState;
  subjects: Subject[];
  loadingSubjects: boolean;
  selectedSubject?: Subject;
  quizPresets: QuizPreset[];

  updateForm: <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => void;

  handleSubjectChange: (
    subjectId: string,
  ) => void;

  handleQuizPresetChange: (
    title: string,
  ) => void;
};

export default function BasicInformationCard({
  form,
  subjects,
  loadingSubjects,
  selectedSubject,
  quizPresets,
  updateForm,
  handleSubjectChange,
  handleQuizPresetChange,
}: Props) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Set the main details for the
          competition.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Subject
          </label>

          <select
            id="subject"
            value={form.subject}
            onChange={(event) =>
              handleSubjectChange(
                event.target.value,
              )
            }
            disabled={loadingSubjects}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">
              {loadingSubjects
                ? "Loading subjects..."
                : "Select subject"}
            </option>

            {subjects.map((subject) => (
              <option
                key={String(subject._id)}
                value={String(subject._id)}
              >
                {subject.name ??
                  "Unnamed subject"}
              </option>
            ))}
          </select>

          {selectedSubject && (
            <p className="mt-2 text-xs text-slate-500">
              Selected:{" "}
              {selectedSubject.name}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="status"
            value={form.status}
            onChange={(event) =>
              updateForm(
                "status",
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          >
            <option value="DRAFT">
              Draft
            </option>

            <option value="PUBLISHED">
              Published
            </option>
          </select>
        </div>

        {/* Quiz Title */}
        <div className="md:col-span-2">
          <label
            htmlFor="quiz_title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Quiz Title
          </label>

          <select
            id="quiz_title"
            value={form.quiz_title}
            onChange={(event) =>
              handleQuizPresetChange(
                event.target.value,
              )
            }
            disabled={
              !form.subject ||
              quizPresets.length === 0
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">
              {!form.subject
                ? "Select a subject first"
                : "Select quiz title"}
            </option>

            {quizPresets.map((preset) => (
              <option
                key={preset.title}
                value={preset.title}
              >
                {preset.title}
              </option>
            ))}
          </select>

          <p className="mt-1.5 text-xs text-slate-500">
            Select a ready-made competition
            title. The matching description
            will be filled automatically.
          </p>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={form.description}
            onChange={(event) =>
              updateForm(
                "description",
                event.target.value,
              )
            }
            rows={4}
            placeholder={
              form.quiz_title
                ? "The description will appear here..."
                : "Select a quiz title to load a description..."
            }
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />

          <p className="mt-1.5 text-xs text-slate-500">
            The description is automatically
            populated from the selected title,
            but you can edit it before creating
            the competition.
          </p>
        </div>

        {/* Time */}
        <div>
          <label
            htmlFor="time_per_question"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Time Per Question
          </label>

          <div className="relative">
            <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="time_per_question"
              type="number"
              min={1}
              value={
                form.time_per_question
              }
              onChange={(event) =>
                updateForm(
                  "time_per_question",
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Seconds allowed for each
            question.
          </p>
        </div>

        {/* Contestants */}
        <div>
          <label
            htmlFor="no_of_contestants"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Number of Contestants
          </label>

          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="no_of_contestants"
              type="number"
              min={2}
              value={
                form.no_of_contestants
              }
              onChange={(event) =>
                updateForm(
                  "no_of_contestants",
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Total rounds */}
        <div>
          <label
            htmlFor="number_of_rounds"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Total Number of Rounds
          </label>

          <input
            id="number_of_rounds"
            type="number"
            min={1}
            value={
              form.number_of_rounds
            }
            onChange={(event) =>
              updateForm(
                "number_of_rounds",
                Math.max(
                  1,
                  Number(
                    event.target.value,
                  ),
                ),
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />

          <p className="mt-1 text-xs text-slate-500">
            Includes the Final Round.
            Therefore, 5 means 4
            elimination rounds + 1 final.
          </p>
        </div>

        {/* Start date */}
        <div>
          <label
            htmlFor="start_date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Start Date & Time
          </label>

          <input
            id="start_date"
            type="datetime-local"
            value={formatDateTimeLocal(
              form.start_date,
            )}
            onChange={(event) =>
              updateForm(
                "start_date",
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>
    </Card>
  );
}
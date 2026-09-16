




// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\admin\quiz-competition\FinalReview.tsx

"use client";

import { Card } from "@/components/ui/card";

import type {
  FormState,
  Subject,
} from "@/types/quizCompetition";

type Props = {
  form: FormState;
  selectedSubject?: Subject;
  eliminationRounds: number;
  eliminationExitTotal: number;
};

export default function FinalReview({
  form,
  selectedSubject,
  eliminationRounds,
  eliminationExitTotal,
}: Props) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Final Review
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Confirm the competition before
          creating it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ReviewItem
          label="Quiz Title"
          value={
            form.quiz_title ||
            "Not selected"
          }
        />

        <ReviewItem
          label="Subject"
          value={
            selectedSubject?.name ??
            "Not selected"
          }
        />

        <ReviewItem
          label="Contestants"
          value={form.no_of_contestants}
        />

        <ReviewItem
          label="Total Rounds"
          value={form.number_of_rounds}
        />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Structure
            </p>

            <p className="text-sm text-slate-500">
              {eliminationRounds} elimination
              round
              {eliminationRounds === 1
                ? ""
                : "s"}{" "}
              + 1 final round
            </p>
          </div>

          <div className="text-sm font-medium text-slate-700">
            {eliminationExitTotal}{" "}
            contestants exit before the
            final
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Description
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          {form.description ||
            "No description selected."}
        </p>
      </div>
    </Card>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}





// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\admin\quiz-competition\FinalRoundCard.tsx

"use client";

import {
  AlertCircle,
  Trophy,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import type {
  DifficultyBreakdown,
  FinalRound,
  FormState,
} from "@/types/quizCompetition";

import { getDifficultyTotal } from "@/lib/quizCompetition/utils";

type Props = {
  form: FormState;
  finalRound: FinalRound;

  updateForm: <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => void;

  setFinalRound: React.Dispatch<
    React.SetStateAction<FinalRound>
  >;

  updateFinalDifficulty: (
    difficulty: keyof DifficultyBreakdown,
    value: number,
  ) => void;
};

export default function FinalRoundCard({
  form,
  finalRound,
  updateForm,
  setFinalRound,
  updateFinalDifficulty,
}: Props) {
  const difficultyTotal =
    getDifficultyTotal(
      finalRound.difficultyBreakdown,
    );

  const isValid =
    difficultyTotal ===
    Number(finalRound.no_of_questions);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-900 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Trophy className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Final Round
            </h2>

            <p className="text-sm text-slate-300">
              The championship round for
              the remaining contestants.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Questions */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Number of Questions
            </label>

            <input
              type="number"
              min={1}
              value={
                finalRound.no_of_questions
              }
              onChange={(event) =>
                setFinalRound((previous) => ({
                  ...previous,
                  no_of_questions:
                    Math.max(
                      1,
                      Number(
                        event.target.value,
                      ),
                    ),
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* First */}
          <RewardField
            label="First Position"
            value={
              form.first_position_reward
            }
            className="border-emerald-200 bg-emerald-50"
            labelClassName="text-emerald-700"
            inputClassName="border-emerald-300 focus:border-emerald-600 focus:ring-emerald-200"
            onChange={(value) =>
              updateForm(
                "first_position_reward",
                Math.max(0, value),
              )
            }
          />

          {/* Second */}
          <RewardField
            label="Second Position"
            value={
              form.second_position_reward
            }
            className="border-amber-200 bg-amber-50"
            labelClassName="text-amber-700"
            inputClassName="border-amber-300 focus:border-amber-600 focus:ring-amber-200"
            onChange={(value) =>
              updateForm(
                "second_position_reward",
                Math.max(0, value),
              )
            }
          />
        </div>

        {/* Difficulty */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Final Round Difficulty
                Breakdown
              </h4>

              <p className="text-xs text-slate-500">
                Must equal the total number
                of final-round questions.
              </p>
            </div>

            <span
              className={`text-sm font-semibold ${
                isValid
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              Total: {difficultyTotal}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {(
              [
                "easy",
                "medium",
                "hard",
              ] as const
            ).map((difficulty) => (
              <div
                key={difficulty}
                className="rounded-lg border border-slate-200 p-4"
              >
                <label className="mb-2 block text-sm font-medium capitalize text-slate-700">
                  {difficulty}
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    finalRound
                      .difficultyBreakdown[
                      difficulty
                    ]
                  }
                  onChange={(event) =>
                    updateFinalDifficulty(
                      difficulty,
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            ))}
          </div>

          {!isValid && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              <AlertCircle className="h-4 w-4" />

              Easy + Medium + Hard
              must equal{" "}
              {finalRound.no_of_questions}.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function RewardField({
  label,
  value,
  className,
  labelClassName,
  inputClassName,
  onChange,
}: {
  label: string;
  value: number;
  className: string;
  labelClassName: string;
  inputClassName: string;
  onChange: (value: number) => void;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${className}`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide ${labelClassName}`}
      >
        {label}
      </p>

      <div className="mt-2">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(event) =>
            onChange(
              Number(event.target.value),
            )
          }
          className={`w-full rounded-lg bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 ${inputClassName}`}
        />
      </div>
    </div>
  );
}
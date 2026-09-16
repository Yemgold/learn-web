





// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\admin\quiz-competition\EliminationRounds.tsx

"use client";

import {
  AlertCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import type {
  DifficultyBreakdown,
  EliminationRound,
} from "@/types/quizCompetition";

import { getDifficultyTotal } from "@/lib/quizCompetition/utils";

type Props = {
  rounds: EliminationRound[];

  updateRound: (
    roundNumber: number,
    updates: Partial<EliminationRound>,
  ) => void;

  updateRoundDifficulty: (
    roundNumber: number,
    difficulty: keyof DifficultyBreakdown,
    value: number,
  ) => void;
};

export default function EliminationRounds({
  rounds,
  updateRound,
  updateRoundDifficulty,
}: Props) {
  if (rounds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Elimination Rounds
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure each elimination
          round. The final round is
          configured separately below.
        </p>
      </div>

      {rounds.map((round) => {
        const difficultyTotal =
          getDifficultyTotal(
            round.difficultyBreakdown,
          );

        const isValid =
          difficultyTotal ===
          Number(round.no_of_questions);

        return (
          <Card
            key={round.round_number}
            className="overflow-hidden"
          >
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Round{" "}
                    {round.round_number}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Elimination round
                  </p>
                </div>

                <div
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isValid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {difficultyTotal} /{" "}
                  {round.no_of_questions}{" "}
                  questions
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-5 md:grid-cols-3">
                {/* Questions */}
                <NumberField
                  label="Number of Questions"
                  min={1}
                  value={
                    round.no_of_questions
                  }
                  onChange={(value) =>
                    updateRound(
                      round.round_number,
                      {
                        no_of_questions:
                          Math.max(
                            1,
                            value,
                          ),
                      },
                    )
                  }
                />

                {/* Exit */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Exit Number
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={round.exit_number}
                    onChange={(event) =>
                      updateRound(
                        round.round_number,
                        {
                          exit_number:
                            Math.max(
                              0,
                              Number(
                                event
                                  .target
                                  .value,
                              ),
                            ),
                        },
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Contestants removed
                    after this round.
                  </p>
                </div>

                {/* Exit reward */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Exit Reward
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={round.exit_reward}
                    onChange={(event) =>
                      updateRound(
                        round.round_number,
                        {
                          exit_reward:
                            Math.max(
                              0,
                              Number(
                                event
                                  .target
                                  .value,
                              ),
                            ),
                        },
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Reward for contestants
                    exiting at this stage.
                  </p>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Difficulty Breakdown
                    </h4>

                    <p className="text-xs text-slate-500">
                      Must equal the total
                      number of questions.
                    </p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      isValid
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    Total:{" "}
                    {difficultyTotal}
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
                          round
                            .difficultyBreakdown[
                            difficulty
                          ]
                        }
                        onChange={(event) =>
                          updateRoundDifficulty(
                            round.round_number,
                            difficulty,
                            Number(
                              event.target
                                .value,
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
                    {round.no_of_questions}.
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function NumberField({
  label,
  min,
  value,
  onChange,
}: {
  label: string;
  min: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="number"
        min={min}
        value={value}
        onChange={(event) =>
          onChange(
            Number(event.target.value),
          )
        }
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}
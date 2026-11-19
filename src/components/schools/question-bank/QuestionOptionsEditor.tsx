
"use client";

import { Plus, Trash2, CheckCircle2 } from "lucide-react";

import type { QuestionOption } from "@/types/schools/question-bank.types";

interface QuestionOptionsEditorProps {
  options: QuestionOption[];
  correctAnswers: string[];
  multipleAnswers?: boolean;
  disabled?: boolean;
  onOptionsChange: (options: QuestionOption[]) => void;
  onCorrectAnswersChange: (answers: string[]) => void;
}

const OPTION_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function QuestionOptionsEditor({
  options,
  correctAnswers,
  multipleAnswers = false,
  disabled = false,
  onOptionsChange,
  onCorrectAnswersChange,
}: QuestionOptionsEditorProps) {
  /* ------------------------------------------------------------------------ */
  /* UPDATE OPTION TEXT                                                       */
  /* ------------------------------------------------------------------------ */

  const updateOption = (
    optionId: string,
    text: string
  ) => {
    onOptionsChange(
      options.map((option) =>
        option.id === optionId
          ? { ...option, text }
          : option
      )
    );
  };

  /* ------------------------------------------------------------------------ */
  /* ADD OPTION                                                               */
  /* ------------------------------------------------------------------------ */

  const addOption = () => {
    if (options.length >= OPTION_LABELS.length) return;

    const newOption: QuestionOption = {
      id: `option-${Date.now()}-${options.length}`,
      label: OPTION_LABELS[options.length],
      text: "",
      isCorrect: false,
    };

    onOptionsChange([...options, newOption]);
  };

  /* ------------------------------------------------------------------------ */
  /* REMOVE OPTION                                                            */
  /* ------------------------------------------------------------------------ */

  const removeOption = (optionId: string) => {
    if (options.length <= 2) return;

    const updatedOptions = options
      .filter((option) => option.id !== optionId)
      .map((option, index) => ({
        ...option,
        label: OPTION_LABELS[index],
      }));

    onOptionsChange(updatedOptions);

    onCorrectAnswersChange(
      correctAnswers.filter((answer) => answer !== optionId)
    );
  };

  /* ------------------------------------------------------------------------ */
  /* SELECT CORRECT ANSWER                                                    */
  /* ------------------------------------------------------------------------ */

  const toggleCorrectAnswer = (optionId: string) => {
    let updatedAnswers: string[];

    if (multipleAnswers) {
      updatedAnswers = correctAnswers.includes(optionId)
        ? correctAnswers.filter((answer) => answer !== optionId)
        : [...correctAnswers, optionId];
    } else {
      updatedAnswers = correctAnswers.includes(optionId)
        ? []
        : [optionId];
    }

    onCorrectAnswersChange(updatedAnswers);

    onOptionsChange(
      options.map((option) => ({
        ...option,
        isCorrect: updatedAnswers.includes(option.id),
      }))
    );
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Answer Options
          </h3>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Select the correct answer for this question.
          </p>
        </div>

        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {options.length} / {OPTION_LABELS.length} options
        </span>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isCorrect = correctAnswers.includes(option.id);

          return (
            <div
              key={option.id}
              className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                isCorrect
                  ? "border-green-300 bg-green-50/70 dark:border-green-500/30 dark:bg-green-500/5"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggleCorrectAnswer(option.id)}
                aria-label={`Mark option ${option.label} as correct`}
                aria-pressed={isCorrect}
                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isCorrect
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-300 bg-gray-50 text-gray-600 hover:border-green-500 hover:text-green-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 size={17} />
                ) : (
                  option.label || OPTION_LABELS[index]
                )}
              </button>

              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`question-option-${option.id}`}
                  className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400"
                >
                  Option {option.label || OPTION_LABELS[index]}
                </label>

                <input
                  id={`question-option-${option.id}`}
                  type="text"
                  value={option.text}
                  disabled={disabled}
                  onChange={(event) =>
                    updateOption(option.id, event.target.value)
                  }
                  placeholder={`Enter option ${option.label || OPTION_LABELS[index]}`}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                {isCorrect && (
                  <p className="mt-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    Correct answer
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={disabled || options.length <= 2}
                onClick={() => removeOption(option.id)}
                aria-label={`Remove option ${option.label}`}
                className="mt-1 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-500/10"
              >
                <Trash2 size={17} />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={disabled || options.length >= OPTION_LABELS.length}
        onClick={addOption}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-500/30 dark:text-blue-400 dark:hover:bg-blue-500/10"
      >
        <Plus size={17} />
        Add another option
      </button>

      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          {multipleAnswers
            ? "Multiple-answer mode: select every option that is correct."
            : "Single-answer mode: select only one correct option."}
        </p>
      </div>

      {correctAnswers.length === 0 && (
        <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
          Please select at least one correct answer.
        </p>
      )}
    </div>
  );
}

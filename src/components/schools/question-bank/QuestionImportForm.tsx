




"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Upload,
  FileJson,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Download,
} from "lucide-react";

import type {
  QuestionDifficulty,
  QuestionExamType,
  QuestionImportPayload,
  QuestionImportResult,
} from "@/types/schools/question-bank.types";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface QuestionImportFormProps {
  submitting: boolean;

  subjects: Array<{
    _id: string;
    subjectName: string;
    subjectCode?: string;
  }>;

  classes?: Array<{
    _id: string;
    className: string;
    classCode?: string;
  }>;

  onSubmit: (
    payload: QuestionImportPayload
  ) => Promise<QuestionImportResult | null>;

  onCancel?: () => void;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function QuestionImportForm({
  submitting,
  subjects,
  classes = [],
  onSubmit,
  onCancel,
}: QuestionImportFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] =
    useState<QuestionImportPayload["questions"]>([]);

  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [difficulty, setDifficulty] =
    useState<QuestionDifficulty | "">("");

  const [examType, setExamType] =
    useState<QuestionExamType | "">("");

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] =
    useState<QuestionImportResult | null>(null);

  /* ------------------------------------------------------------------------ */
  /* VALIDATE JSON QUESTIONS                                                  */
  /* ------------------------------------------------------------------------ */

  const validateQuestions = (
    data: unknown
  ): QuestionImportPayload["questions"] => {
    if (!Array.isArray(data)) {
      throw new Error("The JSON file must contain an array of questions.");
    }

    if (data.length === 0) {
      throw new Error("The JSON file contains no questions.");
    }

    return data.map((item, index) => {
      if (
        typeof item !== "object" ||
        item === null ||
        Array.isArray(item)
      ) {
        throw new Error(
          `Question ${index + 1} must be a valid object.`
        );
      }

      const question = item as Record<string, unknown>;

      if (
        typeof question.questionText !== "string" ||
        !question.questionText.trim()
      ) {
        throw new Error(
          `Question ${index + 1} is missing questionText.`
        );
      }

      const questionType = question.questionType;

      if (
        !["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"].includes(
          String(questionType)
        )
      ) {
        throw new Error(
          `Question ${index + 1} has an invalid questionType.`
        );
      }

      const correctAnswers = question.correctAnswers;

      if (
        !Array.isArray(correctAnswers) ||
        !correctAnswers.every(
          (answer) => typeof answer === "string"
        )
      ) {
        throw new Error(
          `Question ${index + 1} must have a correctAnswers array.`
        );
      }

    const questionDifficulty =
  question.difficulty ?? (difficulty || "MEDIUM");

      if (
        !["EASY", "MEDIUM", "HARD"].includes(
          String(questionDifficulty)
        )
      ) {
        throw new Error(
          `Question ${index + 1} has an invalid difficulty.`
        );
      }

      const options = Array.isArray(question.options)
        ? question.options.map((option, optionIndex) => {
            if (
              typeof option !== "object" ||
              option === null ||
              Array.isArray(option)
            ) {
              throw new Error(
                `Question ${index + 1}, option ${optionIndex + 1} is invalid.`
              );
            }

            const optionRecord = option as Record<string, unknown>;

            if (
              typeof optionRecord.text !== "string" ||
              !optionRecord.text.trim()
            ) {
              throw new Error(
                `Question ${index + 1}, option ${optionIndex + 1} is missing text.`
              );
            }

            return {
              id:
                typeof optionRecord.id === "string"
                  ? optionRecord.id
                  : `option-${index}-${optionIndex}`,
              label:
                typeof optionRecord.label === "string"
                  ? optionRecord.label
                  : String.fromCharCode(65 + optionIndex),
              text: optionRecord.text.trim(),
              isCorrect: correctAnswers.includes(
                typeof optionRecord.id === "string"
                  ? optionRecord.id
                  : `option-${index}-${optionIndex}`
              ),
            };
          })
        : [];

      if (
        questionType === "MULTIPLE_CHOICE" &&
        options.length < 2
      ) {
        throw new Error(
          `Question ${index + 1} must have at least two options.`
        );
      }

      if (
        questionType === "MULTIPLE_CHOICE" &&
        correctAnswers.length === 0
      ) {
        throw new Error(
          `Question ${index + 1} must have at least one correct answer.`
        );
      }

      if (
        questionType === "TRUE_FALSE" &&
        !correctAnswers.some((answer) =>
          ["TRUE", "FALSE"].includes(answer.toUpperCase())
        )
      ) {
        throw new Error(
          `Question ${index + 1} must have TRUE or FALSE as its correct answer.`
        );
      }

      const marks = Number(question.marks ?? 1);

      if (!Number.isFinite(marks) || marks <= 0) {
        throw new Error(
          `Question ${index + 1} must have a valid positive marks value.`
        );
      }

      return {
        questionText: question.questionText.trim(),
        questionType: questionType as
          | "MULTIPLE_CHOICE"
          | "TRUE_FALSE"
          | "SHORT_ANSWER",
        subjectId,
        ...(classId ? { classId } : {}),
        difficulty: questionDifficulty as QuestionDifficulty,
        ...(typeof question.examType === "string"
          ? { examType: question.examType as QuestionExamType }
          : examType
            ? { examType }
            : {}),
        options,
        correctAnswers: correctAnswers.map((answer) =>
          answer.trim()
        ),
        ...(Array.isArray(question.acceptedAnswers)
          ? {
              acceptedAnswers: question.acceptedAnswers.filter(
                (answer): answer is string =>
                  typeof answer === "string"
              ),
            }
          : {}),
        ...(typeof question.explanation === "string"
          ? { explanation: question.explanation }
          : {}),
        marks,
        ...(question.status === "DRAFT" ||
        question.status === "PUBLISHED" ||
        question.status === "ARCHIVED"
          ? { status: question.status }
          : { status: "DRAFT" as const }),
      };
    });
  };

  /* ------------------------------------------------------------------------ */
  /* FILE UPLOAD                                                              */
  /* ------------------------------------------------------------------------ */

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    setError(null);
    setResult(null);
    setParsedQuestions([]);
    setFile(null);

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".json")) {
      setError("Please select a valid .json file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size cannot exceed 5MB.");
      event.target.value = "";
      return;
    }

    try {
      const content = await selectedFile.text();
      const parsedData: unknown = JSON.parse(content);

      const questions = validateQuestions(parsedData);

      setFile(selectedFile);
      setParsedQuestions(questions);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to read the selected JSON file."
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError(null);
    setResult(null);

    if (!subjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!file || parsedQuestions.length === 0) {
      setError("Please upload a valid question JSON file.");
      return;
    }

    const payload: QuestionImportPayload = {
      subjectId,
      ...(classId ? { classId } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(examType ? { examType } : {}),
      questions: parsedQuestions,
    };

    const importResult = await onSubmit(payload);

    if (importResult) {
      setResult(importResult);

      if (importResult.failed === 0) {
        setFile(null);
        setParsedQuestions([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  /* ------------------------------------------------------------------------ */
  /* RESET                                                                    */
  /* ------------------------------------------------------------------------ */

  const clearFile = () => {
    setFile(null);
    setParsedQuestions([]);
    setError(null);
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ------------------------------------------------------------------------ */
  /* DOWNLOAD SAMPLE                                                          */
  /* ------------------------------------------------------------------------ */

  const downloadTemplate = () => {
    const template = [
      {
        questionText: "What is the capital of Nigeria?",
        questionType: "MULTIPLE_CHOICE",
        difficulty: "EASY",
        options: [
          {
            id: "option-a",
            label: "A",
            text: "Lagos",
            isCorrect: false,
          },
          {
            id: "option-b",
            label: "B",
            text: "Abuja",
            isCorrect: true,
          },
          {
            id: "option-c",
            label: "C",
            text: "Kano",
            isCorrect: false,
          },
          {
            id: "option-d",
            label: "D",
            text: "Ibadan",
            isCorrect: false,
          },
        ],
        correctAnswers: ["option-b"],
        explanation: "Abuja is the capital of Nigeria.",
        marks: 1,
      },
    ];

    const blob = new Blob(
      [JSON.stringify(template, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "question-bank-template.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* HEADER */}

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Import Questions
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload a JSON file containing multiple questions.
        </p>
      </div>

      {/* SUBJECT AND CLASS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subject <span className="text-red-500">*</span>
          </label>

          <select
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
            disabled={submitting}
            required
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">Select subject</option>

            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.subjectName}
                {subject.subjectCode
                  ? ` (${subject.subjectCode})`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Class
          </label>

          <select
            value={classId}
            onChange={(event) => setClassId(event.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">All classes</option>

            {classes.map((schoolClass) => (
              <option
                key={schoolClass._id}
                value={schoolClass._id}
              >
                {schoolClass.className}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(event) =>
              setDifficulty(
                event.target.value as QuestionDifficulty | ""
              )
            }
            disabled={submitting}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">Use individual question difficulty</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Exam Type
          </label>

          <select
            value={examType}
            onChange={(event) =>
              setExamType(
                event.target.value as QuestionExamType | ""
              )
            }
            disabled={submitting}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">Use individual question exam type</option>
            <option value="INTERNAL">Internal</option>
            <option value="WAEC">WAEC</option>
            <option value="NECO">NECO</option>
            <option value="JAMB">JAMB</option>
            <option value="POST_UTME">Post UTME</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* TEMPLATE DOWNLOAD */}

      <button
        type="button"
        onClick={downloadTemplate}
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        <Download size={17} />
        Download JSON template
      </button>

      {/* FILE UPLOAD */}

      <div
        onClick={() => {
          if (!submitting) fileInputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if (
            !submitting &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={submitting ? -1 : 0}
        aria-disabled={submitting}
        className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-blue-500/5"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          disabled={submitting}
          className="hidden"
        />

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Upload size={25} />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Click to upload your question file
        </h3>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          JSON files only · Maximum file size: 5MB
        </p>
      </div>

      {/* SELECTED FILE */}

      {file && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/5">
          <div className="flex min-w-0 items-center gap-3">
            <FileJson
              size={24}
              className="shrink-0 text-green-600"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {file.name}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(file.size / 1024).toFixed(1)} KB ·{" "}
                {parsedQuestions.length} questions validated
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFile}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-red-600 dark:hover:bg-gray-800"
            aria-label="Remove uploaded file"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* VALIDATION SUCCESS */}

      {parsedQuestions.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/5">
          <FileCheck
            size={20}
            className="shrink-0 text-green-600"
          />

          <div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              File validation successful
            </p>

            <p className="mt-1 text-xs text-green-700 dark:text-green-400">
              {parsedQuestions.length} questions are ready for import.
            </p>
          </div>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <p className="text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* IMPORT RESULT */}

      {result && (
        <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Import Results
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {result.total}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-500/10">
              <p className="text-xl font-bold text-green-600">
                {result.successful}
              </p>
              <p className="text-xs text-green-700 dark:text-green-400">
                Successful
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-500/10">
              <p className="text-xl font-bold text-red-600">
                {result.failed}
              </p>
              <p className="text-xs text-red-700 dark:text-red-400">
                Failed
              </p>
            </div>
          </div>

          {result.failed === 0 && (
            <p className="flex items-center gap-2 text-sm font-medium text-green-600">
              <CheckCircle2 size={17} />
              All questions imported successfully.
            </p>
          )}

          {result.errors.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-red-600">
                Import errors
              </p>

              {result.errors.map((message, index) => (
                <p
                  key={`${index}-${message}`}
                  className="text-xs text-red-600 dark:text-red-400"
                >
                  {index + 1}. {message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTIONS */}

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            !file ||
            parsedQuestions.length === 0 ||
            !subjectId
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload size={17} />
              Import {parsedQuestions.length} Questions
            </>
          )}
        </button>
      </div>
    </form>
  );
}

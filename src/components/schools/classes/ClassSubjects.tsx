"use client";

import {
  BookOpen,
  BookMarked,
  X,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";

export interface ClassSubjectItem {
  id: string;
  name: string;
  code?: string;
}

interface ClassSubjectsButtonProps {
  count: number;
  onClick: () => void;
}

export function ClassSubjectsButton({
  count,
  onClick,
}: ClassSubjectsButtonProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={onClick}
      leftIcon={<BookOpen size={14} />}
    >
      View ({count})
    </Button>
  );
}

interface ClassSubjectsDialogProps {
  open: boolean;
  className: string;
  classCode: string;
  subjects: ClassSubjectItem[];
  onClose: () => void;
}

export function ClassSubjectsDialog({
  open,
  className,
  classCode,
  subjects,
  onClose,
}: ClassSubjectsDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="class-subjects-title"
        className="max-h-[85dvh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            <h2
              id="class-subjects-title"
              className="font-semibold text-gray-900"
            >
              Assigned Subjects
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {className} · {classCode}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close subjects"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(85dvh-8rem)] overflow-y-auto p-5">
          {subjects.length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-4 py-8 text-center">
              <BookMarked className="mx-auto text-gray-400" size={25} />
              <p className="mt-2 text-sm text-gray-600">
                No subjects are assigned to this class.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                {subjects.length} subject{subjects.length === 1 ? "" : "s"} assigned
              </p>

              <ul className="space-y-2">
                {subjects.map((subject, index) => (
                  <li
                    key={subject.id || `${subject.name}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <BookMarked size={17} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium capitalize text-gray-900">
                        {subject.name}
                      </span>
                      {subject.code && (
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {subject.code}
                        </span>
                      )}
                    </span>

                    <span className="text-xs text-gray-400">
                      {index + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-100 px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </section>
    </div>
  );
}

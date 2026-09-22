







// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\video-lecture\TeachingScriptEditor.tsx

"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  FileText,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type TeachingScriptEditorProps = {
  script: string;
  onChange: (script: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
};

export default function TeachingScriptEditor({
  script,
  onChange,
  onGenerate,
  isGenerating = false,
}: TeachingScriptEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!script.trim()) return;

    try {
      await navigator.clipboard.writeText(script);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy teaching script:", error);
    }
  };

  const handleClear = () => {
    onChange("");
    setCopied(false);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ============================================================
          HEADER
          ============================================================ */}

      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <FileText className="h-4 w-4" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Teaching Script
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-slate-500">
              Generate a structured teaching script from the lesson
              information, objectives, explanations, key points and JAMB
              preparation tips above.
            </p>
          </div>

          <Button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="shrink-0 rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : script.trim() ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Script
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Script
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ============================================================
          SCRIPT AREA
          ============================================================ */}

      <div className="p-5">
        {!script.trim() ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Sparkles className="h-6 w-6 text-slate-500" />
            </div>

            <h3 className="text-base font-semibold text-slate-900">
              No teaching script yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Complete the lesson information above, then click
              <span className="font-medium text-slate-700">
                {" "}
                Generate Script
              </span>{" "}
              to create a narration script for your video.
            </p>

            <Button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="mt-5 rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Teaching Script
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Editable Narration
                </p>

                <p className="text-xs text-slate-500">
                  You can edit the generated script before recording your
                  lesson.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                  className="rounded-xl"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Script
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>

            <textarea
              value={script}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Your teaching script will appear here..."
              className="min-h-[520px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
              spellCheck
            />

            <div className="mt-3 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {script.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <span>
                The script remains editable until you save or publish the
                lesson.
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
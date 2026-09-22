"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Clock3,
  Eye,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  ListChecks,
  Play,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { generateTeachingScript } from "@/lib/video-lecture/scriptGenerator";
import TeachingScriptEditor from "@/components/video-lecture/TeachingScriptEditor";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type AccessType = "Free" | "Premium";
type LessonStatus = "Draft" | "Published" | "Scheduled";

type ExplanationStep = {
  id: string;
  title: string;
  explanation: string;
  example: string;
};

type LearningObjective = {
  id: string;
  text: string;
};

type KeyPoint = {
  id: string;
  text: string;
};

/* ================================================================
   SHARED INPUT CLASS
   ================================================================ */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

/* ================================================================
   PAGE
   ================================================================ */

export default function VideoLecturePage() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState(
    "JAMB League Instructor"
  );

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] =
    useState("");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("Intermediate");

  const [accessType, setAccessType] =
    useState<AccessType>("Free");

  const [status, setStatus] =
    useState<LessonStatus>("Draft");

  const [duration, setDuration] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const [objectives, setObjectives] =
    useState<LearningObjective[]>([
      {
        id: crypto.randomUUID(),
        text: "",
      },
    ]);

  const [steps, setSteps] =
    useState<ExplanationStep[]>([
      {
        id: crypto.randomUUID(),
        title: "",
        explanation: "",
        example: "",
      },
    ]);

  const [keyPoints, setKeyPoints] =
    useState<KeyPoint[]>([
      {
        id: crypto.randomUUID(),
        text: "",
      },
    ]);

  const [summary, setSummary] = useState("");
  const [jambTips, setJambTips] = useState("");
  const [examTraps, setExamTraps] = useState("");
  const [keywords, setKeywords] = useState("");

  /* ============================================================
     TEACHING SCRIPT
     ============================================================ */

  const [teachingScript, setTeachingScript] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("");

  /* ============================================================
     VIDEO PREVIEW
     ============================================================ */

  useEffect(() => {
    if (!videoFile) {
      setVideoPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(videoFile);

    setVideoPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  /* ============================================================
     THUMBNAIL PREVIEW
     ============================================================ */

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(thumbnailFile);

    setThumbnailPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [thumbnailFile]);

  /* ============================================================
     COMPLETION
     ============================================================ */

  const completion = useMemo(() => {
    const checks = [
      {
        label: "Subject",
        complete: !!subject,
      },
      {
        label: "Topic",
        complete: !!topic,
      },
      {
        label: "Lesson title",
        complete: !!lessonTitle.trim(),
      },
      {
        label: "Description",
        complete: !!description.trim(),
      },
      {
        label: "Tutorial video",
        complete: !!videoFile,
      },
      {
        label: "Learning objectives",
        complete: objectives.some(
          (item) => item.text.trim()
        ),
      },
      {
        label: "Step-by-step explanation",
        complete: steps.some(
          (step) =>
            !!step.title.trim() &&
            !!step.explanation.trim()
        ),
      },
      {
        label: "Key points",
        complete: keyPoints.some(
          (item) => item.text.trim()
        ),
      },
      {
        label: "Lesson summary",
        complete: !!summary.trim(),
      },
      {
        label: "Exam tips",
        complete: !!jambTips.trim(),
      },
    ];

    const completed = checks.filter(
      (item) => item.complete
    ).length;

    return Math.round(
      (completed / checks.length) * 100
    );
  }, [
    subject,
    topic,
    lessonTitle,
    description,
    videoFile,
    objectives,
    steps,
    keyPoints,
    summary,
    jambTips,
  ]);

  const completedChecklist = useMemo(() => {
    return [
      !!subject,
      !!topic,
      !!lessonTitle.trim(),
      !!description.trim(),
      !!videoFile,
      objectives.some(
        (item) => item.text.trim()
      ),
      steps.some(
        (step) =>
          !!step.title.trim() &&
          !!step.explanation.trim()
      ),
      keyPoints.some(
        (item) => item.text.trim()
      ),
      !!summary.trim(),
      !!jambTips.trim(),
    ].filter(Boolean).length;
  }, [
    subject,
    topic,
    lessonTitle,
    description,
    videoFile,
    objectives,
    steps,
    keyPoints,
    summary,
    jambTips,
  ]);

  /* ============================================================
     GENERATE TEACHING SCRIPT
     ============================================================ */

  const handleGenerateScript = () => {
    const script = generateTeachingScript({
      subject,
      topic,
      lessonTitle,
      description,
      instructor,
      objectives,
      steps,
      keyPoints,
      summary,
      jambTips,
      examTraps,
      keywords,
    });

    setTeachingScript(script);
  };

  /* ============================================================
     OBJECTIVES
     ============================================================ */

  const addObjective = () => {
    setObjectives((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        text: "",
      },
    ]);
  };

  const removeObjective = (id: string) => {
    setObjectives((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  const updateObjective = (
    id: string,
    text: string
  ) => {
    setObjectives((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              text,
            }
          : item
      )
    );
  };

  /* ============================================================
     STEPS
     ============================================================ */

  const addStep = () => {
    setSteps((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: "",
        explanation: "",
        example: "",
      },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps((current) =>
      current.filter(
        (step) => step.id !== id
      )
    );
  };

  const updateStep = (
    id: string,
    field: keyof ExplanationStep,
    value: string
  ) => {
    setSteps((current) =>
      current.map((step) =>
        step.id === id
          ? {
              ...step,
              [field]: value,
            }
          : step
      )
    );
  };

  const moveStep = (
    index: number,
    direction: "up" | "down"
  ) => {
    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= steps.length
    ) {
      return;
    }

    const updated = [...steps];

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setSteps(updated);
  };

  /* ============================================================
     KEY POINTS
     ============================================================ */

  const addKeyPoint = () => {
    setKeyPoints((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        text: "",
      },
    ]);
  };

  const removeKeyPoint = (id: string) => {
    setKeyPoints((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  const updateKeyPoint = (
    id: string,
    text: string
  ) => {
    setKeyPoints((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              text,
            }
          : item
      )
    );
  };

  /* ============================================================
     SAVE
     ============================================================ */

  const handleSaveDraft = () => {
    setIsSaving(true);

    const lessonData = {
      subject,
      topic,
      lessonTitle,
      description,
      instructor,
      videoFile,
      thumbnailFile,
      difficulty,
      accessType,
      status: "Draft",
      duration,
      scheduledDate,
      objectives,
      steps,
      keyPoints,
      summary,
      jambTips,
      examTraps,
      keywords,

      // Teaching script
      teachingScript,
    };

    console.log(
      "Save lesson draft",
      lessonData
    );

    setTimeout(() => {
      setIsSaving(false);

      setLastSaved(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 700);
  };

  const handlePublish = () => {
    const lessonData = {
      subject,
      topic,
      lessonTitle,
      description,
      instructor,
      videoFile,
      thumbnailFile,
      difficulty,
      accessType,
      status,
      duration,
      scheduledDate,
      objectives,
      steps,
      keyPoints,
      summary,
      jambTips,
      examTraps,
      keywords,

      // Teaching script
      teachingScript,
    };

    console.log(
      "Publish lesson",
      lessonData
    );
  };

  /* ============================================================
     FILES
     ============================================================ */

  const handleVideoChange = (
    file: File | null
  ) => {
    if (!file) return;

    setVideoFile(file);
  };

  const handleThumbnailChange = (
    file: File | null
  ) => {
    if (!file) return;

    setThumbnailFile(file);
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ========================================================
          TOP HEADER
          ======================================================== */}

      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[76px] flex-col justify-center gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <Link
                href="/admin/secondary/video-lecture"
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5" />
                    Secondary
                  </span>

                  <span>/</span>

                  <span>Video Lecture</span>

                  <span>/</span>

                  <span className="text-slate-700">
                    Create Lesson
                  </span>
                </div>

                <h1 className="mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl">
                  Create Video Lesson
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-1 hidden items-center gap-2 text-xs text-slate-400 xl:flex">
                {isSaving ? (
                  <>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                    Saving...
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Saved {lastSaved}
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    Unsaved changes
                  </>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  setShowPreview(true)
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving
                  ? "Saving..."
                  : "Save Draft"}
              </Button>

              <Button
                onClick={handlePublish}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Check className="mr-2 h-4 w-4" />
                {status === "Scheduled"
                  ? "Schedule Lesson"
                  : "Publish Lesson"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          COMPLETION BAR
          ======================================================== */}

      <div className="border-b bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Lesson progress
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-700">
                {completedChecklist}/10 sections completed
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-bold ${
                  completion === 100
                    ? "text-emerald-600"
                    : "text-slate-900"
                }`}
              >
                {completion}%
              </span>

              <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 sm:w-48">
                <div
                  className={`h-full rounded-full transition-all ${
                    completion === 100
                      ? "bg-emerald-500"
                      : "bg-slate-900"
                  }`}
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN
          ======================================================== */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* ====================================================
              LEFT EDITOR
              ==================================================== */}

          <div className="min-w-0 space-y-7">
            {/* LESSON INFORMATION */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="border-b bg-white px-5 py-5 sm:px-6">
                <SectionHeader
                  icon={
                    <BookOpen className="h-5 w-5" />
                  }
                  eyebrow="01"
                  title="Lesson Information"
                  description="Define the lesson students will see in the learning platform."
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Subject"
                    required
                  >
                    <select
                      value={subject}
                      onChange={(e) =>
                        setSubject(
                          e.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select subject
                      </option>
                      <option value="Biology">
                        Biology
                      </option>
                      <option value="Chemistry">
                        Chemistry
                      </option>
                      <option value="Physics">
                        Physics
                      </option>
                      <option value="Mathematics">
                        Mathematics
                      </option>
                      <option value="English">
                        English
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Topic"
                    required
                  >
                    <select
                      value={topic}
                      onChange={(e) =>
                        setTopic(
                          e.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option value="">
                        Select topic
                      </option>
                      <option value="Cell Structure">
                        Cell Structure
                      </option>
                      <option value="Genetics">
                        Genetics
                      </option>
                      <option value="Ecology">
                        Ecology
                      </option>
                      <option value="Evolution">
                        Evolution
                      </option>
                    </select>
                  </Field>

                  <div className="md:col-span-2">
                    <Field
                      label="Lesson title"
                      required
                      hint="Keep the title clear, specific and searchable."
                    >
                      <input
                        value={lessonTitle}
                        onChange={(e) =>
                          setLessonTitle(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Understanding Cell Structure and Functions"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Instructor"
                    hint="Shown on the student lesson page."
                  >
                    <input
                      value={instructor}
                      onChange={(e) =>
                        setInstructor(
                          e.target.value
                        )
                      }
                      placeholder="e.g. JAMB League Instructor"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Difficulty">
                    <select
                      value={difficulty}
                      onChange={(e) =>
                        setDifficulty(
                          e.target
                            .value as Difficulty
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Beginner">
                        Beginner
                      </option>
                      <option value="Intermediate">
                        Intermediate
                      </option>
                      <option value="Advanced">
                        Advanced
                      </option>
                    </select>
                  </Field>

                  <div className="md:col-span-2">
                    <Field
                      label="Short description"
                      required
                      hint="This is the introduction students see before starting the lesson."
                    >
                      <textarea
                        value={description}
                        onChange={(e) =>
                          setDescription(
                            e.target.value
                          )
                        }
                        rows={4}
                        placeholder="Explain what this lesson teaches and why students should watch it..."
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </Card>

            {/* VIDEO */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="border-b bg-white px-5 py-5 sm:px-6">
                <SectionHeader
                  icon={
                    <Video className="h-5 w-5" />
                  }
                  eyebrow="02"
                  title="Tutorial Video"
                  description="Upload the main instructional video students will watch."
                />
              </div>

              <div className="p-5 sm:p-6">
                {!videoFile ? (
                  <label className="group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-slate-300 hover:bg-slate-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                      <Upload className="h-7 w-7 text-slate-500 transition group-hover:text-slate-900" />
                    </div>

                    <div className="mt-5 text-sm font-bold text-slate-900">
                      Upload your tutorial video
                    </div>

                    <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
                      Upload an MP4, WebM or MOV
                      video. Your video should
                      clearly explain the lesson
                      topic from beginning to end.
                    </p>

                    <span className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
                      Choose Video
                    </span>

                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) =>
                        handleVideoChange(
                          e.target.files?.[0] ??
                            null
                        )
                      }
                    />
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                    <div className="aspect-video w-full">
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center gap-4 border-t border-white/10 bg-slate-900 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Play className="h-5 w-5 text-white" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {videoFile.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {(
                            videoFile.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setVideoFile(null)
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Field
                    label="Video duration"
                    hint="You can enter it manually or let the backend/provider determine it."
                  >
                    <div className="relative">
                      <Clock3 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                      <input
                        value={duration}
                        onChange={(e) =>
                          setDuration(
                            e.target.value
                          )
                        }
                        placeholder="e.g. 18:45"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Video thumbnail"
                    hint="Recommended size: 1280 × 720."
                  >
                    {thumbnailPreviewUrl ? (
                      <div className="relative overflow-hidden rounded-xl border border-slate-200">
                        <img
                          src={thumbnailPreviewUrl}
                          alt="Lesson thumbnail preview"
                          className="aspect-video w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setThumbnailFile(null)
                          }
                          className="absolute right-2 top-2 rounded-lg bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm transition hover:bg-slate-50">
                        <ImageIcon className="h-5 w-5 text-slate-500" />

                        <span className="flex-1">
                          Choose thumbnail
                        </span>

                        <span className="rounded-lg border px-3 py-1.5 text-xs font-semibold">
                          Browse
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleThumbnailChange(
                              e.target.files?.[0] ??
                                null
                            )
                          }
                        />
                      </label>
                    )}
                  </Field>
                </div>
              </div>
            </Card>

            {/* OBJECTIVES */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="border-b bg-white px-5 py-5 sm:px-6">
                <SectionHeader
                  icon={
                    <ListChecks className="h-5 w-5" />
                  }
                  eyebrow="03"
                  title="Learning Objectives"
                  description="Tell students exactly what they should be able to understand or do after the lesson."
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  {objectives.map(
                    (objective, index) => (
                      <div
                        key={objective.id}
                        className="group flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                          {index + 1}
                        </div>

                        <input
                          value={objective.text}
                          onChange={(e) =>
                            updateObjective(
                              objective.id,
                              e.target.value
                            )
                          }
                          placeholder="Students should be able to..."
                          className={inputClass}
                        />

                        {objectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeObjective(
                                objective.id
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={addObjective}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Objective
                </Button>
              </div>
            </Card>

            {/* EXPLANATION */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="border-b bg-white px-5 py-5 sm:px-6">
                <SectionHeader
                  icon={
                    <FileText className="h-5 w-5" />
                  }
                  eyebrow="04"
                  title="Step-by-Step Explanation"
                  description="Break the lesson into logical teaching sections students can easily follow."
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="space-y-5">
                  {steps.map(
                    (step, index) => (
                      <div
                        key={step.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  Teaching section
                                </p>

                                <h3 className="mt-0.5 font-bold text-slate-900">
                                  Step {index + 1}
                                </h3>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() =>
                                    moveStep(
                                      index,
                                      "up"
                                    )
                                  }
                                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                                  title="Move up"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    index ===
                                    steps.length - 1
                                  }
                                  onClick={() =>
                                    moveStep(
                                      index,
                                      "down"
                                    )
                                  }
                                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                                  title="Move down"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </button>

                                {steps.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeStep(
                                        step.id
                                      )
                                    }
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
                                    title="Delete step"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="mt-5 space-y-4">
                              <Field label="Step heading">
                                <input
                                  value={step.title}
                                  onChange={(e) =>
                                    updateStep(
                                      step.id,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. Identify the cell membrane"
                                  className={inputClass}
                                />
                              </Field>

                              <Field label="Explanation">
                                <textarea
                                  value={
                                    step.explanation
                                  }
                                  onChange={(e) =>
                                    updateStep(
                                      step.id,
                                      "explanation",
                                      e.target.value
                                    )
                                  }
                                  rows={5}
                                  placeholder="Explain this concept clearly and step by step..."
                                  className={`${inputClass} resize-none`}
                                />
                              </Field>

                              <Field
                                label="Example / Application"
                                hint="Optional"
                              >
                                <textarea
                                  value={step.example}
                                  onChange={(e) =>
                                    updateStep(
                                      step.id,
                                      "example",
                                      e.target.value
                                    )
                                  }
                                  rows={3}
                                  placeholder="Give an example, calculation or real-world application..."
                                  className={`${inputClass} resize-none`}
                                />
                              </Field>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={addStep}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Explanation Step
                </Button>
              </div>
            </Card>

            {/* KEY POINTS */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="border-b bg-white px-5 py-5 sm:px-6">
                <SectionHeader
                  icon={
                    <Lightbulb className="h-5 w-5" />
                  }
                  eyebrow="05"
                  title="Key Points"
                  description="Important facts and ideas students should remember."
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  {keyPoints.map(
                    (point, index) => (
                      <div
                        key={point.id}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                          <Lightbulb className="h-4 w-4" />
                        </div>

                        <input
                          value={point.text}
                          onChange={(e) =>
                            updateKeyPoint(
                              point.id,
                              e.target.value
                            )
                          }
                          placeholder={`Important point ${
                            index + 1
                          }`}
                          className={inputClass}
                        />

                        {keyPoints.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeKeyPoint(
                                point.id
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={addKeyPoint}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Key Point
                </Button>
              </div>
            </Card>

            {/* EXAM FOCUS */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="border-b bg-white px-5 py-5 sm:px-6">
                <SectionHeader
                  icon={
                    <CircleHelp className="h-5 w-5" />
                  }
                  eyebrow="06"
                  title="JAMB / Exam Focus"
                  description="Add exam-focused guidance that helps students prepare for questions on this topic."
                />
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="JAMB / Exam Tips"
                    hint="Frequently tested areas, shortcuts and important reminders."
                  >
                    <textarea
                      value={jambTips}
                      onChange={(e) =>
                        setJambTips(
                          e.target.value
                        )
                      }
                      rows={6}
                      placeholder="Example: Remember that the cell membrane is selectively permeable..."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <Field
                    label="Common Exam Traps"
                    hint="Mistakes students commonly make when answering questions."
                  >
                    <textarea
                      value={examTraps}
                      onChange={(e) =>
                        setExamTraps(
                          e.target.value
                        )
                      }
                      rows={6}
                      placeholder="Example: Do not confuse diffusion with osmosis..."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </div>
              </div>
            </Card>

            {/* SUMMARY */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="border-b bg-white px-5 py-5 sm:px-6">
                <SectionHeader
                  icon={
                    <FileText className="h-5 w-5" />
                  }
                  eyebrow="07"
                  title="Lesson Summary"
                  description="Give students a concise recap they can revisit after watching."
                />
              </div>

              <div className="p-5 sm:p-6">
                <textarea
                  value={summary}
                  onChange={(e) =>
                    setSummary(e.target.value)
                  }
                  rows={7}
                  placeholder="Summarize the major concepts covered in this lesson..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </Card>

            {/* ==================================================
                TEACHING SCRIPT
                ================================================== */}

            <TeachingScriptEditor
              script={teachingScript}
              onChange={setTeachingScript}
              onGenerate={handleGenerateScript}
            />

            {/* SEARCH / KEYWORDS */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="border-b bg-white px-5 py-5 sm:px-6">
                <SectionHeader
                  icon={
                    <Search className="h-5 w-5" />
                  }
                  eyebrow="08"
                  title="Search & Keywords"
                  description="Add words that help students discover this lesson."
                />
              </div>

              <div className="p-5 sm:p-6">
                <Field
                  label="Keywords"
                  hint="Separate keywords with commas."
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                    <input
                      value={keywords}
                      onChange={(e) =>
                        setKeywords(
                          e.target.value
                        )
                      }
                      placeholder="cell, cell structure, biology, JAMB biology, organelles"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>
              </div>
            </Card>

            {/* BOTTOM ACTIONS */}

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  Ready to save your lesson?
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  You can preview the student
                  experience before publishing.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowPreview(true)
                  }
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>

                <Button
                  onClick={handlePublish}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {status === "Scheduled"
                    ? "Schedule Lesson"
                    : "Publish Lesson"}
                </Button>
              </div>
            </div>
          </div>

          {/* ====================================================
              SIDEBAR
              ==================================================== */}

          <aside className="space-y-5 xl:sticky xl:top-[100px] xl:self-start">
            {/* COMPLETION */}

            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Lesson completion
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                      {completion}%
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <Sparkles className="h-5 w-5 text-slate-700" />
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      completion === 100
                        ? "bg-emerald-500"
                        : "bg-slate-900"
                    }`}
                    style={{
                      width: `${completion}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {completion === 100
                    ? "Everything required for a complete lesson is ready."
                    : "Complete the required lesson sections before publishing."}
                </p>
              </div>
            </Card>

            {/* PUBLISHING */}

            <Card className="border-slate-200 shadow-sm">
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-slate-500" />

                  <h2 className="font-semibold text-slate-900">
                    Publishing
                  </h2>
                </div>

                <div className="mt-5 space-y-5">
                  <Field label="Status">
                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(
                          e.target
                            .value as LessonStatus
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Draft">
                        Draft
                      </option>
                      <option value="Published">
                        Published
                      </option>
                      <option value="Scheduled">
                        Scheduled
                      </option>
                    </select>
                  </Field>

                  {status === "Scheduled" && (
                    <Field
                      label="Publish date & time"
                      required
                    >
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) =>
                          setScheduledDate(
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                  )}

                  <Field label="Student access">
                    <select
                      value={accessType}
                      onChange={(e) =>
                        setAccessType(
                          e.target
                            .value as AccessType
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Free">
                        Free
                      </option>
                      <option value="Premium">
                        Premium
                      </option>
                    </select>
                  </Field>

                  <Field label="Difficulty">
                    <select
                      value={difficulty}
                      onChange={(e) =>
                        setDifficulty(
                          e.target
                            .value as Difficulty
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Beginner">
                        Beginner
                      </option>
                      <option value="Intermediate">
                        Intermediate
                      </option>
                      <option value="Advanced">
                        Advanced
                      </option>
                    </select>
                  </Field>
                </div>
              </div>
            </Card>

            {/* LESSON DETAILS */}

            <Card className="border-slate-200 shadow-sm">
              <div className="p-5">
                <h2 className="font-semibold text-slate-900">
                  Lesson Details
                </h2>

                <div className="mt-4 divide-y divide-slate-100">
                  <DetailRow
                    label="Subject"
                    value={
                      subject || "Not selected"
                    }
                  />

                  <DetailRow
                    label="Topic"
                    value={
                      topic || "Not selected"
                    }
                  />

                  <DetailRow
                    label="Difficulty"
                    value={difficulty}
                  />

                  <DetailRow
                    label="Access"
                    value={accessType}
                  />

                  <DetailRow
                    label="Duration"
                    value={
                      duration || "Not set"
                    }
                  />

                  <DetailRow
                    label="Script"
                    value={
                      teachingScript
                        ? "Generated"
                        : "Not generated"
                    }
                  />
                </div>
              </div>
            </Card>

            {/* CHECKLIST */}

            <Card className="border-slate-200 shadow-sm">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">
                    Content Checklist
                  </h2>

                  <span className="text-xs font-semibold text-slate-400">
                    {completedChecklist}/10
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <Checklist
                    label="Subject selected"
                    complete={!!subject}
                  />

                  <Checklist
                    label="Topic selected"
                    complete={!!topic}
                  />

                  <Checklist
                    label="Lesson title"
                    complete={!!lessonTitle.trim()}
                  />

                  <Checklist
                    label="Description"
                    complete={!!description.trim()}
                  />

                  <Checklist
                    label="Tutorial video"
                    complete={!!videoFile}
                  />

                  <Checklist
                    label="Learning objectives"
                    complete={objectives.some(
                      (item) =>
                        item.text.trim()
                    )}
                  />

                  <Checklist
                    label="Step-by-step explanation"
                    complete={steps.some(
                      (step) =>
                        !!step.title.trim() &&
                        !!step.explanation.trim()
                    )}
                  />

                  <Checklist
                    label="Key points"
                    complete={keyPoints.some(
                      (item) =>
                        item.text.trim()
                    )}
                  />

                  <Checklist
                    label="Lesson summary"
                    complete={!!summary.trim()}
                  />

                  <Checklist
                    label="Exam tips"
                    complete={!!jambTips.trim()}
                  />
                </div>
              </div>
            </Card>

            {/* PUBLISHING TIP */}

            <Card className="border-dashed border-slate-300 bg-slate-50 shadow-none">
              <div className="p-5">
                <div className="flex gap-3">
                  <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Publishing tip
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Make sure the video,
                      explanation, examples and
                      summary all teach the same
                      concept before publishing.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </main>

      {/* ========================================================
          STUDENT PREVIEW
          ======================================================== */}

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6">
          <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* PREVIEW HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-slate-500" />

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Student Preview
                  </p>
                </div>

                <h2 className="mt-1 truncate text-lg font-bold text-slate-900 sm:text-xl">
                  {lessonTitle ||
                    "Untitled Lesson"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPreview(false)
                }
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* PREVIEW CONTENT */}

            <div className="overflow-y-auto">
              <div className="mx-auto max-w-4xl p-5 sm:p-8">
                {/* HERO */}

                <div className="grid gap-7 lg:grid-cols-[1fr_280px]">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {subject && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {subject}
                        </span>
                      )}

                      {topic && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {topic}
                        </span>
                      )}

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {difficulty}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {accessType}
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {lessonTitle ||
                        "Untitled Lesson"}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {description ||
                        "No lesson description has been added yet."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>
                        Instructor:{" "}
                        <strong className="text-slate-700">
                          {instructor}
                        </strong>
                      </span>

                      {duration && (
                        <span className="flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          {duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* THUMBNAIL */}

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    {thumbnailPreviewUrl ? (
                      <div className="relative aspect-video lg:aspect-[4/3]">
                        <img
                          src={thumbnailPreviewUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                            <Play className="ml-1 h-6 w-6 text-slate-900" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-slate-950 lg:aspect-[4/3]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                          <Play className="ml-1 h-6 w-6 text-slate-900" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* VIDEO */}

                {videoPreviewUrl && (
                  <section className="mt-8 overflow-hidden rounded-2xl bg-slate-950">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="aspect-video w-full"
                    />
                  </section>
                )}

                {/* OBJECTIVES */}

                {objectives.some(
                  (item) => item.text.trim()
                ) && (
                  <section className="mt-10">
                    <SectionTitle>
                      What You Will Learn
                    </SectionTitle>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {objectives
                        .filter((item) =>
                          item.text.trim()
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />

                            <span className="text-sm leading-6 text-slate-600">
                              {item.text}
                            </span>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {/* EXPLANATION */}

                {steps.some(
                  (step) =>
                    step.title.trim() ||
                    step.explanation.trim()
                ) && (
                  <section className="mt-10">
                    <SectionTitle>
                      Step-by-Step Explanation
                    </SectionTitle>

                    <div className="mt-6 space-y-6">
                      {steps
                        .filter(
                          (step) =>
                            step.title.trim() ||
                            step.explanation.trim()
                        )
                        .map(
                          (step, index) => (
                            <div
                              key={step.id}
                              className="flex gap-4"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                                {index + 1}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-900">
                                  {step.title ||
                                    `Step ${
                                      index + 1
                                    }`}
                                </h4>

                                {step.explanation && (
                                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                                    {
                                      step.explanation
                                    }
                                  </p>
                                )}

                                {step.example && (
                                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Example /
                                      Application
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                      {
                                        step.example
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </section>
                )}

                {/* KEY POINTS */}

                {keyPoints.some(
                  (item) => item.text.trim()
                ) && (
                  <section className="mt-10">
                    <SectionTitle>
                      Key Points to Remember
                    </SectionTitle>

                    <div className="mt-5 space-y-3">
                      {keyPoints
                        .filter((item) =>
                          item.text.trim()
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 rounded-xl bg-amber-50 p-4"
                          >
                            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                            <p className="text-sm leading-6 text-slate-700">
                              {item.text}
                            </p>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {/* EXAM */}

                {(jambTips || examTraps) && (
                  <section className="mt-10">
                    <SectionTitle>
                      JAMB / Exam Focus
                    </SectionTitle>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {jambTips && (
                        <div className="rounded-2xl bg-slate-900 p-5 text-white">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Exam Tips
                          </p>

                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                            {jambTips}
                          </p>
                        </div>
                      )}

                      {examTraps && (
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                          <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                            Common Exam Traps
                          </p>

                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {examTraps}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* SUMMARY */}

                {summary && (
                  <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <SectionTitle>
                      Lesson Summary
                    </SectionTitle>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {summary}
                    </p>
                  </section>
                )}

                {/* ==================================================
                    TEACHING SCRIPT PREVIEW
                    ================================================== */}

                {teachingScript && (
                  <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <SectionTitle>
                      Teaching Script
                    </SectionTitle>

                    <div className="mt-4 rounded-xl bg-slate-50 p-5">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {teachingScript}
                      </p>
                    </div>
                  </section>
                )}

                {/* FOOTER */}

                <div className="mt-10 border-t pt-6 text-center">
                  <p className="text-xs text-slate-400">
                    End of student preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   SECTION HEADER
   ================================================================ */

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-slate-400">
            {eyebrow}
          </span>

          <span className="h-1 w-1 rounded-full bg-slate-300" />
        </div>

        <h2 className="mt-0.5 font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   FIELD
   ================================================================ */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2">
        <label className="text-sm font-semibold text-slate-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>

        {hint && (
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {hint}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

/* ================================================================
   CHECKLIST
   ================================================================ */

function Checklist({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition ${
          complete
            ? "bg-emerald-500 text-white"
            : "border border-slate-300 bg-white"
        }`}
      >
        {complete && (
          <Check className="h-3 w-3" />
        )}
      </div>

      <span
        className={`text-sm ${
          complete
            ? "text-slate-700"
            : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ================================================================
   DETAIL ROW
   ================================================================ */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-xs font-medium text-slate-400">
        {label}
      </span>

      <span className="max-w-[180px] truncate text-right text-sm font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}

/* ================================================================
   PREVIEW SECTION TITLE
   ================================================================ */

function SectionTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h3 className="text-xl font-bold tracking-tight text-slate-900">
      {children}
    </h3>
  );
}













// "use client";

// import { useEffect, useMemo, useState, type ReactNode } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   BookOpen,
//   CalendarClock,
//   Check,
//   CheckCircle2,
//   ChevronDown,
//   ChevronUp,
//   CircleHelp,
//   Clock3,
//   Eye,
//   FileText,
//   Image as ImageIcon,
//   Lightbulb,
//   ListChecks,
//   Play,
//   Plus,
//   Save,
//   Search,
//   Sparkles,
//   Trash2,
//   Upload,
//   Video,
//   X,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// type Difficulty = "Beginner" | "Intermediate" | "Advanced";
// type AccessType = "Free" | "Premium";
// type LessonStatus = "Draft" | "Published" | "Scheduled";

// type ExplanationStep = {
//   id: string;
//   title: string;
//   explanation: string;
//   example: string;
// };

// type LearningObjective = {
//   id: string;
//   text: string;
// };

// type KeyPoint = {
//   id: string;
//   text: string;
// };

// /* ================================================================
//    SHARED INPUT CLASS
//    ================================================================ */

// const inputClass =
//   "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

// /* ================================================================
//    PAGE
//    ================================================================ */

// export default function VideoLecturePage() {
//   const [subject, setSubject] = useState("");
//   const [topic, setTopic] = useState("");
//   const [lessonTitle, setLessonTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [instructor, setInstructor] = useState(
//     "JAMB League Instructor"
//   );

//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [thumbnailFile, setThumbnailFile] =
//     useState<File | null>(null);

//   const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
//   const [thumbnailPreviewUrl, setThumbnailPreviewUrl] =
//     useState("");

//   const [difficulty, setDifficulty] =
//     useState<Difficulty>("Intermediate");

//   const [accessType, setAccessType] =
//     useState<AccessType>("Free");

//   const [status, setStatus] =
//     useState<LessonStatus>("Draft");

//   const [duration, setDuration] = useState("");
//   const [scheduledDate, setScheduledDate] = useState("");

//   const [objectives, setObjectives] =
//     useState<LearningObjective[]>([
//       {
//         id: crypto.randomUUID(),
//         text: "",
//       },
//     ]);

//   const [steps, setSteps] =
//     useState<ExplanationStep[]>([
//       {
//         id: crypto.randomUUID(),
//         title: "",
//         explanation: "",
//         example: "",
//       },
//     ]);

//   const [keyPoints, setKeyPoints] =
//     useState<KeyPoint[]>([
//       {
//         id: crypto.randomUUID(),
//         text: "",
//       },
//     ]);

//   const [summary, setSummary] = useState("");
//   const [jambTips, setJambTips] = useState("");
//   const [examTraps, setExamTraps] = useState("");
//   const [keywords, setKeywords] = useState("");

//   const [showPreview, setShowPreview] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [lastSaved, setLastSaved] = useState("");

//   /* ============================================================
//      VIDEO PREVIEW
//      ============================================================ */

//   useEffect(() => {
//     if (!videoFile) {
//       setVideoPreviewUrl("");
//       return;
//     }

//     const url = URL.createObjectURL(videoFile);

//     setVideoPreviewUrl(url);

//     return () => {
//       URL.revokeObjectURL(url);
//     };
//   }, [videoFile]);

//   /* ============================================================
//      THUMBNAIL PREVIEW
//      ============================================================ */

//   useEffect(() => {
//     if (!thumbnailFile) {
//       setThumbnailPreviewUrl("");
//       return;
//     }

//     const url = URL.createObjectURL(thumbnailFile);

//     setThumbnailPreviewUrl(url);

//     return () => {
//       URL.revokeObjectURL(url);
//     };
//   }, [thumbnailFile]);

//   /* ============================================================
//      COMPLETION
//      ============================================================ */

//   const completion = useMemo(() => {
//     const checks = [
//       {
//         label: "Subject",
//         complete: !!subject,
//       },
//       {
//         label: "Topic",
//         complete: !!topic,
//       },
//       {
//         label: "Lesson title",
//         complete: !!lessonTitle.trim(),
//       },
//       {
//         label: "Description",
//         complete: !!description.trim(),
//       },
//       {
//         label: "Tutorial video",
//         complete: !!videoFile,
//       },
//       {
//         label: "Learning objectives",
//         complete: objectives.some(
//           (item) => item.text.trim()
//         ),
//       },
//       {
//         label: "Step-by-step explanation",
//         complete: steps.some(
//           (step) =>
//             !!step.title.trim() &&
//             !!step.explanation.trim()
//         ),
//       },
//       {
//         label: "Key points",
//         complete: keyPoints.some(
//           (item) => item.text.trim()
//         ),
//       },
//       {
//         label: "Lesson summary",
//         complete: !!summary.trim(),
//       },
//       {
//         label: "Exam tips",
//         complete: !!jambTips.trim(),
//       },
//     ];

//     const completed = checks.filter(
//       (item) => item.complete
//     ).length;

//     return Math.round(
//       (completed / checks.length) * 100
//     );
//   }, [
//     subject,
//     topic,
//     lessonTitle,
//     description,
//     videoFile,
//     objectives,
//     steps,
//     keyPoints,
//     summary,
//     jambTips,
//   ]);

//   const completedChecklist = useMemo(() => {
//     return [
//       !!subject,
//       !!topic,
//       !!lessonTitle.trim(),
//       !!description.trim(),
//       !!videoFile,
//       objectives.some(
//         (item) => item.text.trim()
//       ),
//       steps.some(
//         (step) =>
//           !!step.title.trim() &&
//           !!step.explanation.trim()
//       ),
//       keyPoints.some(
//         (item) => item.text.trim()
//       ),
//       !!summary.trim(),
//       !!jambTips.trim(),
//     ].filter(Boolean).length;
//   }, [
//     subject,
//     topic,
//     lessonTitle,
//     description,
//     videoFile,
//     objectives,
//     steps,
//     keyPoints,
//     summary,
//     jambTips,
//   ]);

//   /* ============================================================
//      OBJECTIVES
//      ============================================================ */

//   const addObjective = () => {
//     setObjectives((current) => [
//       ...current,
//       {
//         id: crypto.randomUUID(),
//         text: "",
//       },
//     ]);
//   };

//   const removeObjective = (id: string) => {
//     setObjectives((current) =>
//       current.filter(
//         (item) => item.id !== id
//       )
//     );
//   };

//   const updateObjective = (
//     id: string,
//     text: string
//   ) => {
//     setObjectives((current) =>
//       current.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               text,
//             }
//           : item
//       )
//     );
//   };

//   /* ============================================================
//      STEPS
//      ============================================================ */

//   const addStep = () => {
//     setSteps((current) => [
//       ...current,
//       {
//         id: crypto.randomUUID(),
//         title: "",
//         explanation: "",
//         example: "",
//       },
//     ]);
//   };

//   const removeStep = (id: string) => {
//     setSteps((current) =>
//       current.filter(
//         (step) => step.id !== id
//       )
//     );
//   };

//   const updateStep = (
//     id: string,
//     field: keyof ExplanationStep,
//     value: string
//   ) => {
//     setSteps((current) =>
//       current.map((step) =>
//         step.id === id
//           ? {
//               ...step,
//               [field]: value,
//             }
//           : step
//       )
//     );
//   };

//   const moveStep = (
//     index: number,
//     direction: "up" | "down"
//   ) => {
//     const newIndex =
//       direction === "up"
//         ? index - 1
//         : index + 1;

//     if (
//       newIndex < 0 ||
//       newIndex >= steps.length
//     ) {
//       return;
//     }

//     const updated = [...steps];

//     [updated[index], updated[newIndex]] = [
//       updated[newIndex],
//       updated[index],
//     ];

//     setSteps(updated);
//   };

//   /* ============================================================
//      KEY POINTS
//      ============================================================ */

//   const addKeyPoint = () => {
//     setKeyPoints((current) => [
//       ...current,
//       {
//         id: crypto.randomUUID(),
//         text: "",
//       },
//     ]);
//   };

//   const removeKeyPoint = (id: string) => {
//     setKeyPoints((current) =>
//       current.filter(
//         (item) => item.id !== id
//       )
//     );
//   };

//   const updateKeyPoint = (
//     id: string,
//     text: string
//   ) => {
//     setKeyPoints((current) =>
//       current.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               text,
//             }
//           : item
//       )
//     );
//   };

//   /* ============================================================
//      SAVE
//      ============================================================ */

//   const handleSaveDraft = () => {
//     setIsSaving(true);

//     const lessonData = {
//       subject,
//       topic,
//       lessonTitle,
//       description,
//       instructor,
//       videoFile,
//       thumbnailFile,
//       difficulty,
//       accessType,
//       status: "Draft",
//       duration,
//       scheduledDate,
//       objectives,
//       steps,
//       keyPoints,
//       summary,
//       jambTips,
//       examTraps,
//       keywords,
//     };

//     console.log(
//       "Save lesson draft",
//       lessonData
//     );

//     setTimeout(() => {
//       setIsSaving(false);

//       setLastSaved(
//         new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       );
//     }, 700);
//   };

//   const handlePublish = () => {
//     const lessonData = {
//       subject,
//       topic,
//       lessonTitle,
//       description,
//       instructor,
//       videoFile,
//       thumbnailFile,
//       difficulty,
//       accessType,
//       status,
//       duration,
//       scheduledDate,
//       objectives,
//       steps,
//       keyPoints,
//       summary,
//       jambTips,
//       examTraps,
//       keywords,
//     };

//     console.log(
//       "Publish lesson",
//       lessonData
//     );
//   };

//   /* ============================================================
//      FILES
//      ============================================================ */

//   const handleVideoChange = (
//     file: File | null
//   ) => {
//     if (!file) return;

//     setVideoFile(file);
//   };

//   const handleThumbnailChange = (
//     file: File | null
//   ) => {
//     if (!file) return;

//     setThumbnailFile(file);
//   };

//   /* ============================================================
//      RENDER
//      ============================================================ */

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       {/* ========================================================
//           TOP HEADER
//           ======================================================== */}

//       <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
//         <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
//           <div className="flex min-h-[76px] flex-col justify-center gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex min-w-0 items-start gap-3">
//               <Link
//                 href="/admin/secondary/video-lecture"
//                 className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </Link>

//               <div className="min-w-0">
//                 <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
//                   <span className="flex items-center gap-1.5">
//                     <Video className="h-3.5 w-3.5" />
//                     Secondary
//                   </span>

//                   <span>/</span>

//                   <span>Video Lecture</span>

//                   <span>/</span>

//                   <span className="text-slate-700">
//                     Create Lesson
//                   </span>
//                 </div>

//                 <h1 className="mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl">
//                   Create Video Lesson
//                 </h1>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <div className="mr-1 hidden items-center gap-2 text-xs text-slate-400 xl:flex">
//                 {isSaving ? (
//                   <>
//                     <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
//                     Saving...
//                   </>
//                 ) : lastSaved ? (
//                   <>
//                     <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
//                     Saved {lastSaved}
//                   </>
//                 ) : (
//                   <>
//                     <span className="h-2 w-2 rounded-full bg-slate-300" />
//                     Unsaved changes
//                   </>
//                 )}
//               </div>

//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   setShowPreview(true)
//                 }
//               >
//                 <Eye className="mr-2 h-4 w-4" />
//                 Preview
//               </Button>

//               <Button
//                 variant="outline"
//                 onClick={handleSaveDraft}
//                 disabled={isSaving}
//               >
//                 <Save className="mr-2 h-4 w-4" />
//                 {isSaving
//                   ? "Saving..."
//                   : "Save Draft"}
//               </Button>

//               <Button
//                 onClick={handlePublish}
//                 className="bg-slate-900 hover:bg-slate-800"
//               >
//                 <Check className="mr-2 h-4 w-4" />
//                 {status === "Scheduled"
//                   ? "Schedule Lesson"
//                   : "Publish Lesson"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ========================================================
//           COMPLETION BAR
//           ======================================================== */}

//       <div className="border-b bg-white">
//         <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between gap-4">
//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                 Lesson progress
//               </p>

//               <p className="mt-0.5 text-sm font-semibold text-slate-700">
//                 {completedChecklist}/10 sections completed
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               <span
//                 className={`text-sm font-bold ${
//                   completion === 100
//                     ? "text-emerald-600"
//                     : "text-slate-900"
//                 }`}
//               >
//                 {completion}%
//               </span>

//               <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 sm:w-48">
//                 <div
//                   className={`h-full rounded-full transition-all ${
//                     completion === 100
//                       ? "bg-emerald-500"
//                       : "bg-slate-900"
//                   }`}
//                   style={{
//                     width: `${completion}%`,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ========================================================
//           MAIN
//           ======================================================== */}

//       <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
//         <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
//           {/* ====================================================
//               LEFT EDITOR
//               ==================================================== */}

//           <div className="min-w-0 space-y-7">
//             {/* LESSON INFORMATION */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="border-b bg-white px-5 py-5 sm:px-6">
//                 <SectionHeader
//                   icon={
//                     <BookOpen className="h-5 w-5" />
//                   }
//                   eyebrow="01"
//                   title="Lesson Information"
//                   description="Define the lesson students will see in the learning platform."
//                 />
//               </div>

//               <div className="p-5 sm:p-6">
//                 <div className="grid gap-5 md:grid-cols-2">
//                   <Field
//                     label="Subject"
//                     required
//                   >
//                     <select
//                       value={subject}
//                       onChange={(e) =>
//                         setSubject(
//                           e.target.value
//                         )
//                       }
//                       className={inputClass}
//                     >
//                       <option value="">
//                         Select subject
//                       </option>
//                       <option value="Biology">
//                         Biology
//                       </option>
//                       <option value="Chemistry">
//                         Chemistry
//                       </option>
//                       <option value="Physics">
//                         Physics
//                       </option>
//                       <option value="Mathematics">
//                         Mathematics
//                       </option>
//                       <option value="English">
//                         English
//                       </option>
//                     </select>
//                   </Field>

//                   <Field
//                     label="Topic"
//                     required
//                   >
//                     <select
//                       value={topic}
//                       onChange={(e) =>
//                         setTopic(
//                           e.target.value
//                         )
//                       }
//                       className={inputClass}
//                     >
//                       <option value="">
//                         Select topic
//                       </option>
//                       <option value="Cell Structure">
//                         Cell Structure
//                       </option>
//                       <option value="Genetics">
//                         Genetics
//                       </option>
//                       <option value="Ecology">
//                         Ecology
//                       </option>
//                       <option value="Evolution">
//                         Evolution
//                       </option>
//                     </select>
//                   </Field>

//                   <div className="md:col-span-2">
//                     <Field
//                       label="Lesson title"
//                       required
//                       hint="Keep the title clear, specific and searchable."
//                     >
//                       <input
//                         value={lessonTitle}
//                         onChange={(e) =>
//                           setLessonTitle(
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. Understanding Cell Structure and Functions"
//                         className={inputClass}
//                       />
//                     </Field>
//                   </div>

//                   <Field
//                     label="Instructor"
//                     hint="Shown on the student lesson page."
//                   >
//                     <input
//                       value={instructor}
//                       onChange={(e) =>
//                         setInstructor(
//                           e.target.value
//                         )
//                       }
//                       placeholder="e.g. JAMB League Instructor"
//                       className={inputClass}
//                     />
//                   </Field>

//                   <Field label="Difficulty">
//                     <select
//                       value={difficulty}
//                       onChange={(e) =>
//                         setDifficulty(
//                           e.target
//                             .value as Difficulty
//                         )
//                       }
//                       className={inputClass}
//                     >
//                       <option value="Beginner">
//                         Beginner
//                       </option>
//                       <option value="Intermediate">
//                         Intermediate
//                       </option>
//                       <option value="Advanced">
//                         Advanced
//                       </option>
//                     </select>
//                   </Field>

//                   <div className="md:col-span-2">
//                     <Field
//                       label="Short description"
//                       required
//                       hint="This is the introduction students see before starting the lesson."
//                     >
//                       <textarea
//                         value={description}
//                         onChange={(e) =>
//                           setDescription(
//                             e.target.value
//                           )
//                         }
//                         rows={4}
//                         placeholder="Explain what this lesson teaches and why students should watch it..."
//                         className={`${inputClass} resize-none`}
//                       />
//                     </Field>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             {/* VIDEO */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="border-b bg-white px-5 py-5 sm:px-6">
//                 <SectionHeader
//                   icon={
//                     <Video className="h-5 w-5" />
//                   }
//                   eyebrow="02"
//                   title="Tutorial Video"
//                   description="Upload the main instructional video students will watch."
//                 />
//               </div>

//               <div className="p-5 sm:p-6">
//                 {!videoFile ? (
//                   <label className="group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-slate-300 hover:bg-slate-100">
//                     <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
//                       <Upload className="h-7 w-7 text-slate-500 transition group-hover:text-slate-900" />
//                     </div>

//                     <div className="mt-5 text-sm font-bold text-slate-900">
//                       Upload your tutorial video
//                     </div>

//                     <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
//                       Upload an MP4, WebM or MOV
//                       video. Your video should
//                       clearly explain the lesson
//                       topic from beginning to end.
//                     </p>

//                     <span className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
//                       Choose Video
//                     </span>

//                     <input
//                       type="file"
//                       accept="video/*"
//                       className="hidden"
//                       onChange={(e) =>
//                         handleVideoChange(
//                           e.target.files?.[0] ??
//                             null
//                         )
//                       }
//                     />
//                   </label>
//                 ) : (
//                   <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
//                     <div className="aspect-video w-full">
//                       <video
//                         src={videoPreviewUrl}
//                         controls
//                         className="h-full w-full object-contain"
//                       />
//                     </div>

//                     <div className="flex items-center gap-4 border-t border-white/10 bg-slate-900 p-4">
//                       <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
//                         <Play className="h-5 w-5 text-white" />
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <p className="truncate text-sm font-semibold text-white">
//                           {videoFile.name}
//                         </p>

//                         <p className="mt-1 text-xs text-slate-400">
//                           {(
//                             videoFile.size /
//                             1024 /
//                             1024
//                           ).toFixed(2)}{" "}
//                           MB
//                         </p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           setVideoFile(null)
//                         }
//                         className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-6 grid gap-5 md:grid-cols-2">
//                   <Field
//                     label="Video duration"
//                     hint="You can enter it manually or let the backend/provider determine it."
//                   >
//                     <div className="relative">
//                       <Clock3 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

//                       <input
//                         value={duration}
//                         onChange={(e) =>
//                           setDuration(
//                             e.target.value
//                           )
//                         }
//                         placeholder="e.g. 18:45"
//                         className={`${inputClass} pl-10`}
//                       />
//                     </div>
//                   </Field>

//                   <Field
//                     label="Video thumbnail"
//                     hint="Recommended size: 1280 × 720."
//                   >
//                     {thumbnailPreviewUrl ? (
//                       <div className="relative overflow-hidden rounded-xl border border-slate-200">
//                         <img
//                           src={thumbnailPreviewUrl}
//                           alt="Lesson thumbnail preview"
//                           className="aspect-video w-full object-cover"
//                         />

//                         <button
//                           type="button"
//                           onClick={() =>
//                             setThumbnailFile(null)
//                           }
//                           className="absolute right-2 top-2 rounded-lg bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80"
//                         >
//                           <X className="h-4 w-4" />
//                         </button>
//                       </div>
//                     ) : (
//                       <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm transition hover:bg-slate-50">
//                         <ImageIcon className="h-5 w-5 text-slate-500" />

//                         <span className="flex-1">
//                           Choose thumbnail
//                         </span>

//                         <span className="rounded-lg border px-3 py-1.5 text-xs font-semibold">
//                           Browse
//                         </span>

//                         <input
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={(e) =>
//                             handleThumbnailChange(
//                               e.target.files?.[0] ??
//                                 null
//                             )
//                           }
//                         />
//                       </label>
//                     )}
//                   </Field>
//                 </div>
//               </div>
//             </Card>

//             {/* OBJECTIVES */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="border-b bg-white px-5 py-5 sm:px-6">
//                 <SectionHeader
//                   icon={
//                     <ListChecks className="h-5 w-5" />
//                   }
//                   eyebrow="03"
//                   title="Learning Objectives"
//                   description="Tell students exactly what they should be able to understand or do after the lesson."
//                 />
//               </div>

//               <div className="p-5 sm:p-6">
//                 <div className="space-y-3">
//                   {objectives.map(
//                     (objective, index) => (
//                       <div
//                         key={objective.id}
//                         className="group flex items-center gap-3"
//                       >
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
//                           {index + 1}
//                         </div>

//                         <input
//                           value={objective.text}
//                           onChange={(e) =>
//                             updateObjective(
//                               objective.id,
//                               e.target.value
//                             )
//                           }
//                           placeholder="Students should be able to..."
//                           className={inputClass}
//                         />

//                         {objectives.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               removeObjective(
//                                 objective.id
//                               )
//                             }
//                             className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         )}
//                       </div>
//                     )
//                   )}
//                 </div>

//                 <Button
//                   variant="outline"
//                   className="mt-5"
//                   onClick={addObjective}
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Objective
//                 </Button>
//               </div>
//             </Card>

//             {/* EXPLANATION */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="border-b bg-white px-5 py-5 sm:px-6">
//                 <SectionHeader
//                   icon={
//                     <FileText className="h-5 w-5" />
//                   }
//                   eyebrow="04"
//                   title="Step-by-Step Explanation"
//                   description="Break the lesson into logical teaching sections students can easily follow."
//                 />
//               </div>

//               <div className="p-5 sm:p-6">
//                 <div className="space-y-5">
//                   {steps.map(
//                     (step, index) => (
//                       <div
//                         key={step.id}
//                         className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
//                       >
//                         <div className="flex items-start gap-4">
//                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
//                             {index + 1}
//                           </div>

//                           <div className="min-w-0 flex-1">
//                             <div className="flex items-center justify-between gap-3">
//                               <div>
//                                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                                   Teaching section
//                                 </p>

//                                 <h3 className="mt-0.5 font-bold text-slate-900">
//                                   Step {index + 1}
//                                 </h3>
//                               </div>

//                               <div className="flex items-center gap-1">
//                                 <button
//                                   type="button"
//                                   disabled={index === 0}
//                                   onClick={() =>
//                                     moveStep(
//                                       index,
//                                       "up"
//                                     )
//                                   }
//                                   className="rounded-lg p-2 text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
//                                   title="Move up"
//                                 >
//                                   <ChevronUp className="h-4 w-4" />
//                                 </button>

//                                 <button
//                                   type="button"
//                                   disabled={
//                                     index ===
//                                     steps.length - 1
//                                   }
//                                   onClick={() =>
//                                     moveStep(
//                                       index,
//                                       "down"
//                                     )
//                                   }
//                                   className="rounded-lg p-2 text-slate-500 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
//                                   title="Move down"
//                                 >
//                                   <ChevronDown className="h-4 w-4" />
//                                 </button>

//                                 {steps.length > 1 && (
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       removeStep(
//                                         step.id
//                                       )
//                                     }
//                                     className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
//                                     title="Delete step"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </button>
//                                 )}
//                               </div>
//                             </div>

//                             <div className="mt-5 space-y-4">
//                               <Field label="Step heading">
//                                 <input
//                                   value={step.title}
//                                   onChange={(e) =>
//                                     updateStep(
//                                       step.id,
//                                       "title",
//                                       e.target.value
//                                     )
//                                   }
//                                   placeholder="e.g. Identify the cell membrane"
//                                   className={inputClass}
//                                 />
//                               </Field>

//                               <Field label="Explanation">
//                                 <textarea
//                                   value={
//                                     step.explanation
//                                   }
//                                   onChange={(e) =>
//                                     updateStep(
//                                       step.id,
//                                       "explanation",
//                                       e.target.value
//                                     )
//                                   }
//                                   rows={5}
//                                   placeholder="Explain this concept clearly and step by step..."
//                                   className={`${inputClass} resize-none`}
//                                 />
//                               </Field>

//                               <Field
//                                 label="Example / Application"
//                                 hint="Optional"
//                               >
//                                 <textarea
//                                   value={step.example}
//                                   onChange={(e) =>
//                                     updateStep(
//                                       step.id,
//                                       "example",
//                                       e.target.value
//                                     )
//                                   }
//                                   rows={3}
//                                   placeholder="Give an example, calculation or real-world application..."
//                                   className={`${inputClass} resize-none`}
//                                 />
//                               </Field>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   )}
//                 </div>

//                 <Button
//                   variant="outline"
//                   className="mt-5"
//                   onClick={addStep}
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Explanation Step
//                 </Button>
//               </div>
//             </Card>

//             {/* KEY POINTS */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="border-b bg-white px-5 py-5 sm:px-6">
//                 <SectionHeader
//                   icon={
//                     <Lightbulb className="h-5 w-5" />
//                   }
//                   eyebrow="05"
//                   title="Key Points"
//                   description="Important facts and ideas students should remember."
//                 />
//               </div>

//               <div className="p-5 sm:p-6">
//                 <div className="space-y-3">
//                   {keyPoints.map(
//                     (point, index) => (
//                       <div
//                         key={point.id}
//                         className="flex items-center gap-3"
//                       >
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
//                           <Lightbulb className="h-4 w-4" />
//                         </div>

//                         <input
//                           value={point.text}
//                           onChange={(e) =>
//                             updateKeyPoint(
//                               point.id,
//                               e.target.value
//                             )
//                           }
//                           placeholder={`Important point ${
//                             index + 1
//                           }`}
//                           className={inputClass}
//                         />

//                         {keyPoints.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               removeKeyPoint(
//                                 point.id
//                               )
//                             }
//                             className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         )}
//                       </div>
//                     )
//                   )}
//                 </div>

//                 <Button
//                   variant="outline"
//                   className="mt-5"
//                   onClick={addKeyPoint}
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Key Point
//                 </Button>
//               </div>
//             </Card>

//             {/* EXAM FOCUS */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="border-b bg-white px-5 py-5 sm:px-6">
//                 <SectionHeader
//                   icon={
//                     <CircleHelp className="h-5 w-5" />
//                   }
//                   eyebrow="06"
//                   title="JAMB / Exam Focus"
//                   description="Add exam-focused guidance that helps students prepare for questions on this topic."
//                 />
//               </div>

//               <div className="p-5 sm:p-6">
//                 <div className="grid gap-5 md:grid-cols-2">
//                   <Field
//                     label="JAMB / Exam Tips"
//                     hint="Frequently tested areas, shortcuts and important reminders."
//                   >
//                     <textarea
//                       value={jambTips}
//                       onChange={(e) =>
//                         setJambTips(
//                           e.target.value
//                         )
//                       }
//                       rows={6}
//                       placeholder="Example: Remember that the cell membrane is selectively permeable..."
//                       className={`${inputClass} resize-none`}
//                     />
//                   </Field>

//                   <Field
//                     label="Common Exam Traps"
//                     hint="Mistakes students commonly make when answering questions."
//                   >
//                     <textarea
//                       value={examTraps}
//                       onChange={(e) =>
//                         setExamTraps(
//                           e.target.value
//                         )
//                       }
//                       rows={6}
//                       placeholder="Example: Do not confuse diffusion with osmosis..."
//                       className={`${inputClass} resize-none`}
//                     />
//                   </Field>
//                 </div>
//               </div>
//             </Card>

//             {/* SUMMARY */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="border-b bg-white px-5 py-5 sm:px-6">
//                 <SectionHeader
//                   icon={
//                     <FileText className="h-5 w-5" />
//                   }
//                   eyebrow="07"
//                   title="Lesson Summary"
//                   description="Give students a concise recap they can revisit after watching."
//                 />
//               </div>

//               <div className="p-5 sm:p-6">
//                 <textarea
//                   value={summary}
//                   onChange={(e) =>
//                     setSummary(e.target.value)
//                   }
//                   rows={7}
//                   placeholder="Summarize the major concepts covered in this lesson..."
//                   className={`${inputClass} resize-none`}
//                 />
//               </div>
//             </Card>

//             {/* SEARCH / KEYWORDS */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="border-b bg-white px-5 py-5 sm:px-6">
//                 <SectionHeader
//                   icon={
//                     <Search className="h-5 w-5" />
//                   }
//                   eyebrow="08"
//                   title="Search & Keywords"
//                   description="Add words that help students discover this lesson."
//                 />
//               </div>

//               <div className="p-5 sm:p-6">
//                 <Field
//                   label="Keywords"
//                   hint="Separate keywords with commas."
//                 >
//                   <div className="relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

//                     <input
//                       value={keywords}
//                       onChange={(e) =>
//                         setKeywords(
//                           e.target.value
//                         )
//                       }
//                       placeholder="cell, cell structure, biology, JAMB biology, organelles"
//                       className={`${inputClass} pl-10`}
//                     />
//                   </div>
//                 </Field>
//               </div>
//             </Card>

//             {/* BOTTOM ACTIONS */}

//             <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <p className="font-semibold text-slate-900">
//                   Ready to save your lesson?
//                 </p>

//                 <p className="mt-1 text-sm text-slate-500">
//                   You can preview the student
//                   experience before publishing.
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() =>
//                     setShowPreview(true)
//                   }
//                 >
//                   <Eye className="mr-2 h-4 w-4" />
//                   Preview
//                 </Button>

//                 <Button
//                   variant="outline"
//                   onClick={handleSaveDraft}
//                   disabled={isSaving}
//                 >
//                   <Save className="mr-2 h-4 w-4" />
//                   Save Draft
//                 </Button>

//                 <Button
//                   onClick={handlePublish}
//                   className="bg-slate-900 hover:bg-slate-800"
//                 >
//                   <Check className="mr-2 h-4 w-4" />
//                   {status === "Scheduled"
//                     ? "Schedule Lesson"
//                     : "Publish Lesson"}
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* ====================================================
//               SIDEBAR
//               ==================================================== */}

//           <aside className="space-y-5 xl:sticky xl:top-[100px] xl:self-start">
//             {/* COMPLETION */}

//             <Card className="overflow-hidden border-slate-200 shadow-sm">
//               <div className="p-5">
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                       Lesson completion
//                     </p>

//                     <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
//                       {completion}%
//                     </p>
//                   </div>

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
//                     <Sparkles className="h-5 w-5 text-slate-700" />
//                   </div>
//                 </div>

//                 <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
//                   <div
//                     className={`h-full rounded-full transition-all ${
//                       completion === 100
//                         ? "bg-emerald-500"
//                         : "bg-slate-900"
//                     }`}
//                     style={{
//                       width: `${completion}%`,
//                     }}
//                   />
//                 </div>

//                 <p className="mt-3 text-xs leading-5 text-slate-500">
//                   {completion === 100
//                     ? "Everything required for a complete lesson is ready."
//                     : "Complete the required lesson sections before publishing."}
//                 </p>
//               </div>
//             </Card>

//             {/* PUBLISHING */}

//             <Card className="border-slate-200 shadow-sm">
//               <div className="p-5">
//                 <div className="flex items-center gap-2">
//                   <CalendarClock className="h-4 w-4 text-slate-500" />

//                   <h2 className="font-semibold text-slate-900">
//                     Publishing
//                   </h2>
//                 </div>

//                 <div className="mt-5 space-y-5">
//                   <Field label="Status">
//                     <select
//                       value={status}
//                       onChange={(e) =>
//                         setStatus(
//                           e.target
//                             .value as LessonStatus
//                         )
//                       }
//                       className={inputClass}
//                     >
//                       <option value="Draft">
//                         Draft
//                       </option>
//                       <option value="Published">
//                         Published
//                       </option>
//                       <option value="Scheduled">
//                         Scheduled
//                       </option>
//                     </select>
//                   </Field>

//                   {status === "Scheduled" && (
//                     <Field
//                       label="Publish date & time"
//                       required
//                     >
//                       <input
//                         type="datetime-local"
//                         value={scheduledDate}
//                         onChange={(e) =>
//                           setScheduledDate(
//                             e.target.value
//                           )
//                         }
//                         className={inputClass}
//                       />
//                     </Field>
//                   )}

//                   <Field label="Student access">
//                     <select
//                       value={accessType}
//                       onChange={(e) =>
//                         setAccessType(
//                           e.target
//                             .value as AccessType
//                         )
//                       }
//                       className={inputClass}
//                     >
//                       <option value="Free">
//                         Free
//                       </option>
//                       <option value="Premium">
//                         Premium
//                       </option>
//                     </select>
//                   </Field>

//                   <Field label="Difficulty">
//                     <select
//                       value={difficulty}
//                       onChange={(e) =>
//                         setDifficulty(
//                           e.target
//                             .value as Difficulty
//                         )
//                       }
//                       className={inputClass}
//                     >
//                       <option value="Beginner">
//                         Beginner
//                       </option>
//                       <option value="Intermediate">
//                         Intermediate
//                       </option>
//                       <option value="Advanced">
//                         Advanced
//                       </option>
//                     </select>
//                   </Field>
//                 </div>
//               </div>
//             </Card>

//             {/* LESSON DETAILS */}

//             <Card className="border-slate-200 shadow-sm">
//               <div className="p-5">
//                 <h2 className="font-semibold text-slate-900">
//                   Lesson Details
//                 </h2>

//                 <div className="mt-4 divide-y divide-slate-100">
//                   <DetailRow
//                     label="Subject"
//                     value={
//                       subject || "Not selected"
//                     }
//                   />

//                   <DetailRow
//                     label="Topic"
//                     value={
//                       topic || "Not selected"
//                     }
//                   />

//                   <DetailRow
//                     label="Difficulty"
//                     value={difficulty}
//                   />

//                   <DetailRow
//                     label="Access"
//                     value={accessType}
//                   />

//                   <DetailRow
//                     label="Duration"
//                     value={
//                       duration || "Not set"
//                     }
//                   />
//                 </div>
//               </div>
//             </Card>

//             {/* CHECKLIST */}

//             <Card className="border-slate-200 shadow-sm">
//               <div className="p-5">
//                 <div className="flex items-center justify-between">
//                   <h2 className="font-semibold text-slate-900">
//                     Content Checklist
//                   </h2>

//                   <span className="text-xs font-semibold text-slate-400">
//                     {completedChecklist}/10
//                   </span>
//                 </div>

//                 <div className="mt-5 space-y-3">
//                   <Checklist
//                     label="Subject selected"
//                     complete={!!subject}
//                   />

//                   <Checklist
//                     label="Topic selected"
//                     complete={!!topic}
//                   />

//                   <Checklist
//                     label="Lesson title"
//                     complete={!!lessonTitle.trim()}
//                   />

//                   <Checklist
//                     label="Description"
//                     complete={!!description.trim()}
//                   />

//                   <Checklist
//                     label="Tutorial video"
//                     complete={!!videoFile}
//                   />

//                   <Checklist
//                     label="Learning objectives"
//                     complete={objectives.some(
//                       (item) =>
//                         item.text.trim()
//                     )}
//                   />

//                   <Checklist
//                     label="Step-by-step explanation"
//                     complete={steps.some(
//                       (step) =>
//                         !!step.title.trim() &&
//                         !!step.explanation.trim()
//                     )}
//                   />

//                   <Checklist
//                     label="Key points"
//                     complete={keyPoints.some(
//                       (item) =>
//                         item.text.trim()
//                     )}
//                   />

//                   <Checklist
//                     label="Lesson summary"
//                     complete={!!summary.trim()}
//                   />

//                   <Checklist
//                     label="Exam tips"
//                     complete={!!jambTips.trim()}
//                   />
//                 </div>
//               </div>
//             </Card>

//             {/* PUBLISHING TIP */}

//             <Card className="border-dashed border-slate-300 bg-slate-50 shadow-none">
//               <div className="p-5">
//                 <div className="flex gap-3">
//                   <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900">
//                       Publishing tip
//                     </h3>

//                     <p className="mt-1 text-xs leading-5 text-slate-500">
//                       Make sure the video,
//                       explanation, examples and
//                       summary all teach the same
//                       concept before publishing.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </aside>
//         </div>
//       </main>

//       {/* ========================================================
//           STUDENT PREVIEW
//           ======================================================== */}

//       {showPreview && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-6">
//           <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
//             {/* PREVIEW HEADER */}

//             <div className="flex shrink-0 items-center justify-between border-b px-5 py-4 sm:px-6">
//               <div className="min-w-0">
//                 <div className="flex items-center gap-2">
//                   <Eye className="h-4 w-4 text-slate-500" />

//                   <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//                     Student Preview
//                   </p>
//                 </div>

//                 <h2 className="mt-1 truncate text-lg font-bold text-slate-900 sm:text-xl">
//                   {lessonTitle ||
//                     "Untitled Lesson"}
//                 </h2>
//               </div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowPreview(false)
//                 }
//                 className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* PREVIEW CONTENT */}

//             <div className="overflow-y-auto">
//               <div className="mx-auto max-w-4xl p-5 sm:p-8">
//                 {/* HERO */}

//                 <div className="grid gap-7 lg:grid-cols-[1fr_280px]">
//                   <div>
//                     <div className="flex flex-wrap gap-2">
//                       {subject && (
//                         <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
//                           {subject}
//                         </span>
//                       )}

//                       {topic && (
//                         <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
//                           {topic}
//                         </span>
//                       )}

//                       <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
//                         {difficulty}
//                       </span>

//                       <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
//                         {accessType}
//                       </span>
//                     </div>

//                     <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//                       {lessonTitle ||
//                         "Untitled Lesson"}
//                     </h3>

//                     <p className="mt-4 text-sm leading-7 text-slate-600">
//                       {description ||
//                         "No lesson description has been added yet."}
//                     </p>

//                     <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
//                       <span>
//                         Instructor:{" "}
//                         <strong className="text-slate-700">
//                           {instructor}
//                         </strong>
//                       </span>

//                       {duration && (
//                         <span className="flex items-center gap-1.5">
//                           <Clock3 className="h-3.5 w-3.5" />
//                           {duration}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* THUMBNAIL */}

//                   <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
//                     {thumbnailPreviewUrl ? (
//                       <div className="relative aspect-video lg:aspect-[4/3]">
//                         <img
//                           src={thumbnailPreviewUrl}
//                           alt=""
//                           className="h-full w-full object-cover"
//                         />

//                         <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//                           <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
//                             <Play className="ml-1 h-6 w-6 text-slate-900" />
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex aspect-video items-center justify-center bg-slate-950 lg:aspect-[4/3]">
//                         <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
//                           <Play className="ml-1 h-6 w-6 text-slate-900" />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* VIDEO */}

//                 {videoPreviewUrl && (
//                   <section className="mt-8 overflow-hidden rounded-2xl bg-slate-950">
//                     <video
//                       src={videoPreviewUrl}
//                       controls
//                       className="aspect-video w-full"
//                     />
//                   </section>
//                 )}

//                 {/* OBJECTIVES */}

//                 {objectives.some(
//                   (item) => item.text.trim()
//                 ) && (
//                   <section className="mt-10">
//                     <SectionTitle>
//                       What You Will Learn
//                     </SectionTitle>

//                     <div className="mt-5 grid gap-3 sm:grid-cols-2">
//                       {objectives
//                         .filter((item) =>
//                           item.text.trim()
//                         )
//                         .map((item) => (
//                           <div
//                             key={item.id}
//                             className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"
//                           >
//                             <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />

//                             <span className="text-sm leading-6 text-slate-600">
//                               {item.text}
//                             </span>
//                           </div>
//                         ))}
//                     </div>
//                   </section>
//                 )}

//                 {/* EXPLANATION */}

//                 {steps.some(
//                   (step) =>
//                     step.title.trim() ||
//                     step.explanation.trim()
//                 ) && (
//                   <section className="mt-10">
//                     <SectionTitle>
//                       Step-by-Step Explanation
//                     </SectionTitle>

//                     <div className="mt-6 space-y-6">
//                       {steps
//                         .filter(
//                           (step) =>
//                             step.title.trim() ||
//                             step.explanation.trim()
//                         )
//                         .map(
//                           (step, index) => (
//                             <div
//                               key={step.id}
//                               className="flex gap-4"
//                             >
//                               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
//                                 {index + 1}
//                               </div>

//                               <div className="min-w-0 flex-1">
//                                 <h4 className="font-bold text-slate-900">
//                                   {step.title ||
//                                     `Step ${
//                                       index + 1
//                                     }`}
//                                 </h4>

//                                 {step.explanation && (
//                                   <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
//                                     {
//                                       step.explanation
//                                     }
//                                   </p>
//                                 )}

//                                 {step.example && (
//                                   <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
//                                     <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
//                                       Example /
//                                       Application
//                                     </p>

//                                     <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
//                                       {
//                                         step.example
//                                       }
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )
//                         )}
//                     </div>
//                   </section>
//                 )}

//                 {/* KEY POINTS */}

//                 {keyPoints.some(
//                   (item) => item.text.trim()
//                 ) && (
//                   <section className="mt-10">
//                     <SectionTitle>
//                       Key Points to Remember
//                     </SectionTitle>

//                     <div className="mt-5 space-y-3">
//                       {keyPoints
//                         .filter((item) =>
//                           item.text.trim()
//                         )
//                         .map((item) => (
//                           <div
//                             key={item.id}
//                             className="flex gap-3 rounded-xl bg-amber-50 p-4"
//                           >
//                             <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

//                             <p className="text-sm leading-6 text-slate-700">
//                               {item.text}
//                             </p>
//                           </div>
//                         ))}
//                     </div>
//                   </section>
//                 )}

//                 {/* EXAM */}

//                 {(jambTips || examTraps) && (
//                   <section className="mt-10">
//                     <SectionTitle>
//                       JAMB / Exam Focus
//                     </SectionTitle>

//                     <div className="mt-5 grid gap-4 md:grid-cols-2">
//                       {jambTips && (
//                         <div className="rounded-2xl bg-slate-900 p-5 text-white">
//                           <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
//                             Exam Tips
//                           </p>

//                           <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
//                             {jambTips}
//                           </p>
//                         </div>
//                       )}

//                       {examTraps && (
//                         <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
//                           <p className="text-xs font-bold uppercase tracking-wide text-red-500">
//                             Common Exam Traps
//                           </p>

//                           <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
//                             {examTraps}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </section>
//                 )}

//                 {/* SUMMARY */}

//                 {summary && (
//                   <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
//                     <SectionTitle>
//                       Lesson Summary
//                     </SectionTitle>

//                     <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
//                       {summary}
//                     </p>
//                   </section>
//                 )}

//                 {/* FOOTER */}

//                 <div className="mt-10 border-t pt-6 text-center">
//                   <p className="text-xs text-slate-400">
//                     End of student preview
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================================================================
//    SECTION HEADER
//    ================================================================ */

// function SectionHeader({
//   icon,
//   eyebrow,
//   title,
//   description,
// }: {
//   icon: ReactNode;
//   eyebrow: string;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
//         {icon}
//       </div>

//       <div className="min-w-0">
//         <div className="flex items-center gap-2">
//           <span className="text-[10px] font-bold tracking-widest text-slate-400">
//             {eyebrow}
//           </span>

//           <span className="h-1 w-1 rounded-full bg-slate-300" />
//         </div>

//         <h2 className="mt-0.5 font-semibold text-slate-900">
//           {title}
//         </h2>

//         <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
//           {description}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ================================================================
//    FIELD
//    ================================================================ */

// function Field({
//   label,
//   required,
//   hint,
//   children,
// }: {
//   label: string;
//   required?: boolean;
//   hint?: string;
//   children: ReactNode;
// }) {
//   return (
//     <div>
//       <div className="mb-2">
//         <label className="text-sm font-semibold text-slate-700">
//           {label}

//           {required && (
//             <span className="ml-1 text-red-500">
//               *
//             </span>
//           )}
//         </label>

//         {hint && (
//           <p className="mt-1 text-xs leading-5 text-slate-400">
//             {hint}
//           </p>
//         )}
//       </div>

//       {children}
//     </div>
//   );
// }

// /* ================================================================
//    CHECKLIST
//    ================================================================ */

// function Checklist({
//   label,
//   complete,
// }: {
//   label: string;
//   complete: boolean;
// }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div
//         className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition ${
//           complete
//             ? "bg-emerald-500 text-white"
//             : "border border-slate-300 bg-white"
//         }`}
//       >
//         {complete && (
//           <Check className="h-3 w-3" />
//         )}
//       </div>

//       <span
//         className={`text-sm ${
//           complete
//             ? "text-slate-700"
//             : "text-slate-400"
//         }`}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }

// /* ================================================================
//    DETAIL ROW
//    ================================================================ */

// function DetailRow({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="flex items-center justify-between gap-4 py-3">
//       <span className="text-xs font-medium text-slate-400">
//         {label}
//       </span>

//       <span className="max-w-[180px] truncate text-right text-sm font-semibold text-slate-700">
//         {value}
//       </span>
//     </div>
//   );
// }

// /* ================================================================
//    PREVIEW SECTION TITLE
//    ================================================================ */

// function SectionTitle({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <h3 className="text-xl font-bold tracking-tight text-slate-900">
//       {children}
//     </h3>
//   );
// }












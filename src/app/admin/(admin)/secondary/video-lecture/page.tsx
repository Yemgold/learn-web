





"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
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
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

export default function VideoLecturePage() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [description, setDescription] = useState("");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [difficulty, setDifficulty] =
    useState<Difficulty>("Intermediate");

  const [accessType, setAccessType] =
    useState<AccessType>("Free");

  const [status, setStatus] =
    useState<LessonStatus>("Draft");

  const [duration, setDuration] = useState("");

  const [objectives, setObjectives] = useState<LearningObjective[]>([
    {
      id: crypto.randomUUID(),
      text: "",
    },
  ]);

  const [steps, setSteps] = useState<ExplanationStep[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      explanation: "",
      example: "",
    },
  ]);

  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([
    {
      id: crypto.randomUUID(),
      text: "",
    },
  ]);

  const [summary, setSummary] = useState("");
  const [jambTips, setJambTips] = useState("");
  const [keywords, setKeywords] = useState("");

  const [showPreview, setShowPreview] = useState(false);

  const completion = useMemo(() => {
    const checks = [
      subject,
      topic,
      lessonTitle,
      description,
      videoFile,
      objectives.some((item) => item.text.trim()),
      steps.some(
        (step) =>
          step.title.trim() && step.explanation.trim()
      ),
      summary,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [
    subject,
    topic,
    lessonTitle,
    description,
    videoFile,
    objectives,
    steps,
    summary,
  ]);

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
      current.filter((item) => item.id !== id)
    );
  };

  const updateObjective = (id: string, text: string) => {
    setObjectives((current) =>
      current.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    );
  };

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
      current.filter((step) => step.id !== id)
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
      direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= steps.length) {
      return;
    }

    const updated = [...steps];

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setSteps(updated);
  };

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
      current.filter((item) => item.id !== id)
    );
  };

  const updateKeyPoint = (id: string, text: string) => {
    setKeyPoints((current) =>
      current.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    );
  };

  const handleSaveDraft = () => {
    console.log("Save lesson draft", {
      subject,
      topic,
      lessonTitle,
      description,
      videoFile,
      thumbnailFile,
      difficulty,
      accessType,
      status: "Draft",
      duration,
      objectives,
      steps,
      keyPoints,
      summary,
      jambTips,
      keywords,
    });
  };

  const handlePublish = () => {
    console.log("Publish lesson", {
      subject,
      topic,
      lessonTitle,
      description,
      videoFile,
      thumbnailFile,
      difficulty,
      accessType,
      status,
      duration,
      objectives,
      steps,
      keyPoints,
      summary,
      jambTips,
      keywords,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Link
                href="/admin/secondary/video-lecture"
                className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Video className="h-4 w-4" />
                  Secondary
                  <span>/</span>
                  Video Lecture
                </div>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Create Video Lesson
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create a structured video tutorial for students.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveDraft}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>

              <Button onClick={handlePublish}>
                <Check className="mr-2 h-4 w-4" />
                Publish Lesson
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">
              Lesson completion
            </span>

            <span className="font-semibold text-slate-900">
              {completion}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {/* BASIC INFORMATION */}
            <Card className="p-6">
              <SectionHeader
                icon={<BookOpen className="h-5 w-5" />}
                title="Lesson Information"
                description="Define what this lesson is about."
              />

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Subject" required>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input"
                  >
                    <option value="">
                      Select subject
                    </option>
                    <option value="biology">Biology</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="physics">Physics</option>
                    <option value="mathematics">
                      Mathematics
                    </option>
                    <option value="english">English</option>
                  </select>
                </Field>

                <Field label="Topic" required>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="input"
                  >
                    <option value="">
                      Select topic
                    </option>
                    <option value="cell-structure">
                      Cell Structure
                    </option>
                    <option value="genetics">
                      Genetics
                    </option>
                    <option value="ecology">
                      Ecology
                    </option>
                    <option value="evolution">
                      Evolution
                    </option>
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field label="Lesson title" required>
                    <input
                      value={lessonTitle}
                      onChange={(e) =>
                        setLessonTitle(e.target.value)
                      }
                      placeholder="e.g. Understanding Cell Structure and Functions"
                      className="input"
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Short description"
                    required
                    hint="A short introduction students see before watching."
                  >
                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      rows={4}
                      placeholder="Explain what this lesson teaches..."
                      className="input resize-none"
                    />
                  </Field>
                </div>
              </div>
            </Card>

            {/* VIDEO */}
            <Card className="p-6">
              <SectionHeader
                icon={<Video className="h-5 w-5" />}
                title="Tutorial Video"
                description="Upload the main instructional video."
              />

              <div className="mt-6">
                <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-slate-300 hover:bg-slate-100">
                  <Upload className="h-10 w-10 text-slate-400" />

                  <div className="mt-4 text-sm font-semibold text-slate-800">
                    {videoFile
                      ? videoFile.name
                      : "Upload tutorial video"}
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    MP4, WebM or MOV
                  </p>

                  <span className="mt-4 rounded-lg border bg-white px-4 py-2 text-sm font-medium">
                    Choose Video
                  </span>

                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) =>
                      setVideoFile(
                        e.target.files?.[0] ?? null
                      )
                    }
                  />
                </label>
              </div>

              {videoFile && (
                <div className="mt-5 rounded-xl border bg-white p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                      <Play className="h-5 w-5 text-slate-700" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {videoFile.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {(videoFile.size / 1024 / 1024).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field
                  label="Video duration"
                  hint="Optional if your video provider returns it automatically."
                >
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      value={duration}
                      onChange={(e) =>
                        setDuration(e.target.value)
                      }
                      placeholder="e.g. 18:45"
                      className="input pl-10"
                    />
                  </div>
                </Field>

                <Field
                  label="Video thumbnail"
                  hint="Recommended: 1280 × 720"
                >
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-4 py-3 text-sm hover:bg-slate-50">
                    <ImageIcon className="h-4 w-4 text-slate-500" />

                    <span className="flex-1 truncate">
                      {thumbnailFile
                        ? thumbnailFile.name
                        : "Choose thumbnail"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setThumbnailFile(
                          e.target.files?.[0] ?? null
                        )
                      }
                    />
                  </label>
                </Field>
              </div>
            </Card>

            {/* LEARNING OBJECTIVES */}
            <Card className="p-6">
              <SectionHeader
                icon={<ListChecks className="h-5 w-5" />}
                title="Learning Objectives"
                description="Tell students exactly what they should learn."
              />

              <div className="mt-6 space-y-3">
                {objectives.map((objective, index) => (
                  <div
                    key={objective.id}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
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
                      className="input"
                    />

                    {objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeObjective(objective.id)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-4"
                onClick={addObjective}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Objective
              </Button>
            </Card>

            {/* STEP BY STEP */}
            <Card className="p-6">
              <SectionHeader
                icon={<FileText className="h-5 w-5" />}
                title="Step-by-Step Explanation"
                description="Break the lesson into clear teaching steps."
              />

              <div className="mt-6 space-y-5">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="rounded-xl border bg-slate-50 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold text-slate-900">
                            Step {index + 1}
                          </h3>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() =>
                                moveStep(index, "up")
                              }
                              className="rounded-lg p-2 text-slate-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              disabled={
                                index === steps.length - 1
                              }
                              onClick={() =>
                                moveStep(index, "down")
                              }
                              className="rounded-lg p-2 text-slate-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>

                            {steps.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeStep(step.id)
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 space-y-4">
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
                              className="input"
                            />
                          </Field>

                          <Field label="Explanation">
                            <textarea
                              value={step.explanation}
                              onChange={(e) =>
                                updateStep(
                                  step.id,
                                  "explanation",
                                  e.target.value
                                )
                              }
                              rows={5}
                              placeholder="Explain this concept clearly and step by step..."
                              className="input resize-none"
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
                              className="input resize-none"
                            />
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-5"
                onClick={addStep}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Explanation Step
              </Button>
            </Card>

            {/* KEY POINTS */}
            <Card className="p-6">
              <SectionHeader
                icon={<Lightbulb className="h-5 w-5" />}
                title="Key Points"
                description="Important facts students should remember."
              />

              <div className="mt-6 space-y-3">
                {keyPoints.map((point, index) => (
                  <div
                    key={point.id}
                    className="flex items-center gap-3"
                  >
                    <Lightbulb className="h-4 w-4 shrink-0 text-slate-400" />

                    <input
                      value={point.text}
                      onChange={(e) =>
                        updateKeyPoint(
                          point.id,
                          e.target.value
                        )
                      }
                      placeholder={`Important point ${index + 1}`}
                      className="input"
                    />

                    {keyPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeKeyPoint(point.id)
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-4"
                onClick={addKeyPoint}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Key Point
              </Button>
            </Card>

            {/* SUMMARY */}
            <Card className="p-6">
              <SectionHeader
                icon={<FileText className="h-5 w-5" />}
                title="Lesson Summary"
                description="A final recap students can read after watching."
              />

              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={6}
                placeholder="Summarize the major concepts covered in this lesson..."
                className="input mt-6 resize-none"
              />
            </Card>

            {/* JAMB TIPS */}
            <Card className="p-6">
              <SectionHeader
                icon={<CircleHelp className="h-5 w-5" />}
                title="JAMB / Exam Tips"
                description="Add exam-focused guidance for students."
              />

              <textarea
                value={jambTips}
                onChange={(e) =>
                  setJambTips(e.target.value)
                }
                rows={5}
                placeholder="Add common JAMB traps, frequently tested areas, shortcuts or exam advice..."
                className="input mt-6 resize-none"
              />
            </Card>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">
                Publishing
              </h2>

              <div className="mt-5 space-y-4">
                <Field label="Status">
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as LessonStatus
                      )
                    }
                    className="input"
                  >
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Scheduled</option>
                  </select>
                </Field>

                <Field label="Difficulty">
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(
                        e.target.value as Difficulty
                      )
                    }
                    className="input"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </Field>

                <Field label="Student access">
                  <select
                    value={accessType}
                    onChange={(e) =>
                      setAccessType(
                        e.target.value as AccessType
                      )
                    }
                    className="input"
                  >
                    <option>Free</option>
                    <option>Premium</option>
                  </select>
                </Field>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-slate-900">
                Content Checklist
              </h2>

              <div className="mt-4 space-y-3">
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
                  complete={!!lessonTitle}
                />

                <Checklist
                  label="Tutorial video"
                  complete={!!videoFile}
                />

                <Checklist
                  label="Learning objectives"
                  complete={objectives.some(
                    (item) => item.text.trim()
                  )}
                />

                <Checklist
                  label="Step-by-step explanation"
                  complete={steps.some(
                    (step) =>
                      step.title.trim() &&
                      step.explanation.trim()
                  )}
                />

                <Checklist
                  label="Lesson summary"
                  complete={!!summary}
                />
              </div>
            </Card>

            <Card className="border-dashed p-5">
              <div className="flex gap-3">
                <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Publishing tip
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Make sure the video, explanation and
                    summary all teach the same concept before
                    publishing.
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </main>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student Preview
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {lessonTitle || "Untitled Lesson"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {subject && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {subject}
                  </span>
                )}

                {topic && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {topic}
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {difficulty}
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                {description ||
                  "No lesson description has been added yet."}
              </p>

              <div className="mt-6 flex aspect-video items-center justify-center rounded-xl bg-slate-950">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <Play className="ml-1 h-7 w-7 text-slate-900" />
                </div>
              </div>

              <section className="mt-8">
                <h3 className="text-lg font-bold text-slate-900">
                  What You Will Learn
                </h3>

                <ul className="mt-4 space-y-3">
                  {objectives
                    .filter((item) => item.text.trim())
                    .map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-3 text-sm text-slate-600"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                        {item.text}
                      </li>
                    ))}
                </ul>
              </section>

              <section className="mt-8">
                <h3 className="text-lg font-bold text-slate-900">
                  Step-by-Step Explanation
                </h3>

                <div className="mt-4 space-y-5">
                  {steps
                    .filter(
                      (step) =>
                        step.title.trim() ||
                        step.explanation.trim()
                    )
                    .map((step, index) => (
                      <div
                        key={step.id}
                        className="flex gap-4"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {index + 1}
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {step.title ||
                              `Step ${index + 1}`}
                          </h4>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {step.explanation}
                          </p>

                          {step.example && (
                            <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                              <strong className="text-slate-900">
                                Example:
                              </strong>{" "}
                              {step.example}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              {summary && (
                <section className="mt-8 rounded-xl bg-slate-50 p-5">
                  <h3 className="font-bold text-slate-900">
                    Summary
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {summary}
                  </p>
                </section>
              )}

              {jambTips && (
                <section className="mt-6 rounded-xl border p-5">
                  <h3 className="font-bold text-slate-900">
                    JAMB / Exam Tips
                  </h3>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {jambTips}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.65rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          outline: none;
        }

        .input:focus {
          border-color: rgb(100 116 139);
          box-shadow: 0 0 0 2px rgb(226 232 240);
        }

        .input::placeholder {
          color: rgb(148 163 184);
        }
      `}</style>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div>
        <h2 className="font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>

        {hint && (
          <p className="mt-1 text-xs text-slate-400">
            {hint}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

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
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          complete
            ? "bg-slate-900 text-white"
            : "border border-slate-300 bg-white"
        }`}
      >
        {complete && <Check className="h-3 w-3" />}
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

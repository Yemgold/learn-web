
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Clock3,
  Eye,
  FileText,
  Film,
  GraduationCap,
  Image as ImageIcon,
  Loader2,
  Mic2,
  Pencil,
  Play,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
  UserRound,
  Video,
  Volume2,
  WandSparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  secondarySyllabus,
  getSyllabusSections,
} from "@/data/syllabus";

import {
  deleteAiVideoLesson,
  getAiVideoLessons,
  saveAiVideoLesson,
  type AccessType,
  type AiVideoLesson,
  type AiVideoTeacher,
  type Difficulty,
  type ExplanationStep,
  type KeyPoint,
  type LearningObjective,
  type LessonScene,
  type LessonStatus,
  type TeachingStyle,
  type VisualStyle,
  type VoiceConfig,
} from "@/lib/storage/ai-video-lessons";

/* =========================================================
   LOCAL TYPES
   ========================================================= */

type GenerationStage =
  | "idle"
  | "script"
  | "visuals"
  | "video"
  | "complete";

type VoiceOption = VoiceConfig & {
  description: string;
};

type AvatarOption = AiVideoTeacher & {
  description: string;
};

type LessonForm = {
  subjectId: string;
  sectionId: string;
  topicId: string;

  subject: string;
  section: string;
  topic: string;

  title: string;
  description: string;

  difficulty: Difficulty;
  accessType: AccessType;
  durationMinutes: number;

  teachingStyle: TeachingStyle;
  visualStyle: VisualStyle;

  avatarId: string;
  voiceId: string;

  objectives: string[];
  keyPoints: string[];

  summary: string;
  jambTips: string;
  keywords: string;
};

/* =========================================================
   AVATARS
   ========================================================= */

const AVATARS: AvatarOption[] = [
  {
    avatarId: "amara",
    name: "Amara",
    avatarUrl: "",
    description: "Friendly Nigerian female teacher",
  },
  {
    avatarId: "daniel",
    name: "Daniel",
    avatarUrl: "",
    description: "Calm Nigerian male teacher",
  },
  {
    avatarId: "zainab",
    name: "Zainab",
    avatarUrl: "",
    description: "Energetic female science teacher",
  },
  {
    avatarId: "michael",
    name: "Michael",
    avatarUrl: "",
    description: "Exam-focused male teacher",
  },
];

/* =========================================================
   VOICES
   ========================================================= */

const VOICES: VoiceOption[] = [
  {
    id: "amara-natural",
    name: "Amara Natural",
    provider: "Demo AI",
    providerVoiceId: "amara-natural",
    language: "en-NG",
    speakingRate: 1,
    pitch: 0,
    description: "Natural Nigerian English",
  },
  {
    id: "daniel-clear",
    name: "Daniel Clear",
    provider: "Demo AI",
    providerVoiceId: "daniel-clear",
    language: "en-NG",
    speakingRate: 0.95,
    pitch: 0,
    description: "Clear and calm teaching voice",
  },
  {
    id: "zainab-energetic",
    name: "Zainab Energetic",
    provider: "Demo AI",
    providerVoiceId: "zainab-energetic",
    language: "en-NG",
    speakingRate: 1.05,
    pitch: 1,
    description: "Energetic classroom delivery",
  },
  {
    id: "michael-exam",
    name: "Michael Exam",
    provider: "Demo AI",
    providerVoiceId: "michael-exam",
    language: "en-NG",
    speakingRate: 0.95,
    pitch: -1,
    description: "Focused examination preparation",
  },
];

/* =========================================================
   INITIAL FORM
   ========================================================= */

const INITIAL_FORM: LessonForm = {
  subjectId: secondarySyllabus[0]?.id ?? "",
  sectionId: "",
  topicId: "",

  subject: secondarySyllabus[0]?.name ?? "",
  section: "",
  topic: "",

  title: "",
  description: "",

  difficulty: "BEGINNER",
  accessType: "FREE",
  durationMinutes: 10,

  teachingStyle: "exam",
  visualStyle: "science",

  avatarId: AVATARS[0].avatarId,
  voiceId: VOICES[0].id,

  objectives: [
    "Understand the main concept clearly.",
    "Identify important examination points.",
    "Apply the concept to JAMB-style questions.",
  ],

  keyPoints: [
    "Understand the definition and core idea.",
    "Know the important facts and relationships.",
    "Recognize common examination traps.",
  ],

  summary: "",
  jambTips:
    "Pay attention to definitions, relationships and common examination wording.",
  keywords: "",
};

/* =========================================================
   HELPERS
   ========================================================= */

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function formatStatus(status: LessonStatus) {
  return status.replace("_", " ");
}

function getStatusClass(status: LessonStatus) {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-100 text-green-700";
    case "READY":
      return "bg-blue-100 text-blue-700";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-700";
    case "DRAFT":
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getAvatar(avatarId: string) {
  return (
    AVATARS.find((avatar) => avatar.avatarId === avatarId) ??
    AVATARS[0]
  );
}

function getVoice(voiceId: string) {
  return (
    VOICES.find((voice) => voice.id === voiceId) ??
    VOICES[0]
  );
}

function buildLessonId(
  subject: string,
  topic: string,
  existingLessons: AiVideoLesson[],
) {
  const base = `${subject}-${topic}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const matching = existingLessons.filter((lesson) =>
    lesson.id.startsWith(base),
  );

  const number = String(matching.length + 1).padStart(3, "0");

  return `${base}-${number}`;
}

/* =========================================================
   SCENE GENERATOR
   ========================================================= */

function generateScenes(
  form: LessonForm,
): LessonScene[] {
  return [
    {
      id: makeId("scene"),
      number: 1,
      title: "Introduction",
      narration: `Welcome to this lesson on ${form.topic}. In this lesson, we will understand the important concepts you need to know for ${form.subject}.`,
      durationSeconds: 45,
      visualInstruction:
        "Show the lesson title, subject and topic with a clean educational introduction.",
    },
    {
      id: makeId("scene"),
      number: 2,
      title: "Core Concept",
      narration: `Let's begin by understanding the main idea behind ${form.topic}. This is one of the key areas students should understand before attempting examination questions.`,
      durationSeconds: 90,
      visualInstruction:
        "Display the core definition and important terminology using educational diagrams and labels.",
    },
    {
      id: makeId("scene"),
      number: 3,
      title: "Step-by-Step Explanation",
      narration: `Now let's break the topic down step by step. Focus on the relationship between the major ideas and remember the key facts highlighted in this section.`,
      durationSeconds: 180,
      visualInstruction:
        "Show a progressive diagram with numbered steps and highlighted examination points.",
    },
    {
      id: makeId("scene"),
      number: 4,
      title: "Example",
      narration: `Let's apply what we have learned using an examination-style example. Think carefully about the information provided before choosing your answer.`,
      durationSeconds: 90,
      visualInstruction:
        "Display a JAMB-style example question followed by a guided explanation.",
    },
    {
      id: makeId("scene"),
      number: 5,
      title: "JAMB Tip",
      narration: `Here is an important JAMB tip. Do not rely only on memorization. Understand the concept and watch carefully for words that change the meaning of a question.`,
      durationSeconds: 60,
      visualInstruction:
        "Show an examination tip card with highlighted keywords and common mistakes.",
    },
    {
      id: makeId("scene"),
      number: 6,
      title: "Summary",
      narration: `Let's quickly review what we have learned. Remember the main concept, the important facts and how they can appear in examination questions.`,
      durationSeconds: 75,
      visualInstruction:
        "Show a concise summary of the major learning points.",
    },
  ];
}

/* =========================================================
   SCRIPT GENERATOR
   ========================================================= */

function buildScript(
  form: LessonForm,
  scenes: LessonScene[],
) {
  return scenes
    .map(
      (scene) =>
        `SCENE ${scene.number}: ${scene.title}\n\n${scene.narration}`,
    )
    .join("\n\n");
}

/* =========================================================
   MOCK VIDEO PLAYER
   ========================================================= */

function MockGeneratedPlayer({
  lesson,
}: {
  lesson: AiVideoLesson;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-black">
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <Play className="ml-1 h-9 w-9 fill-white" />
            </div>

            <p className="text-lg font-semibold">
              AI Video Preview
            </p>

            <p className="mt-1 text-sm text-white/60">
              {lesson.title}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Play className="h-4 w-4 fill-white" />
              <span className="text-sm">
                00:00 / {lesson.durationMinutes}:00
              </span>
            </div>

            <span className="text-xs text-white/70">
              Demo Player
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function VideoAiLecturePage() {
  const [form, setForm] =
    useState<LessonForm>(INITIAL_FORM);

  const [generationStage, setGenerationStage] =
    useState<GenerationStage>("idle");

  const [generationProgress, setGenerationProgress] =
    useState(0);

  const [generatedLesson, setGeneratedLesson] =
    useState<AiVideoLesson | null>(null);

  const [script, setScript] = useState("");

  const [scenes, setScenes] =
    useState<LessonScene[]>([]);

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [activeSection, setActiveSection] =
    useState<
      "setup" | "script" | "teacher" | "preview"
    >("setup");

  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const [editingSceneId, setEditingSceneId] =
    useState<string | null>(null);

  const [existingLessons, setExistingLessons] =
    useState<AiVideoLesson[]>([]);

  /* =======================================================
     LOAD EXISTING LESSONS
     ======================================================= */

  useEffect(() => {
    setExistingLessons(getAiVideoLessons());
  }, []);

  /* =======================================================
     SELECTED SUBJECT
     ======================================================= */

  const selectedSubject = useMemo(
    () =>
      secondarySyllabus.find(
        (subject) => subject.id === form.subjectId,
      ),
    [form.subjectId],
  );

  const sections = useMemo(
    () =>
      form.subjectId
        ? getSyllabusSections(form.subjectId)
        : [],
    [form.subjectId],
  );

  const selectedSection = useMemo(
    () =>
      sections.find(
        (section) => section.id === form.sectionId,
      ),
    [sections, form.sectionId],
  );

  const selectedTopic = useMemo(
    () =>
      selectedSection?.topics.find(
        (topic) => topic.id === form.topicId,
      ),
    [selectedSection, form.topicId],
  );

  /* =======================================================
     SUBJECT CHANGE
     ======================================================= */

  function handleSubjectChange(
    subjectId: string,
  ) {
    const subject = secondarySyllabus.find(
      (item) => item.id === subjectId,
    );

    const firstSection = subject?.sections?.[0];

    const firstTopic =
      firstSection?.topics?.[0];

    setForm((current) => ({
      ...current,

      subjectId,
      subject: subject?.name ?? "",

      sectionId: firstSection?.id ?? "",
      section:
        firstSection?.name ?? "",

      topicId: firstTopic?.id ?? "",
      topic:
        firstTopic?.name ?? "",

      title: firstTopic
        ? `Understanding ${firstTopic.name} — Complete AI Tutorial`
        : "",
    }));
  }

  /* =======================================================
     SECTION CHANGE
     ======================================================= */

  function handleSectionChange(
    sectionId: string,
  ) {
    const section = sections.find(
      (item) => item.id === sectionId,
    );

    const firstTopic =
      section?.topics?.[0];

    setForm((current) => ({
      ...current,

      sectionId,
      section: section?.name ?? "",

      topicId: firstTopic?.id ?? "",
      topic: firstTopic?.name ?? "",

      title: firstTopic
        ? `Understanding ${firstTopic.name} — Complete AI Tutorial`
        : current.title,
    }));
  }

  /* =======================================================
     TOPIC CHANGE
     ======================================================= */

  function handleTopicChange(
    topicId: string,
  ) {
    const topic =
      selectedSection?.topics.find(
        (item) => item.id === topicId,
      );

    setForm((current) => ({
      ...current,

      topicId,
      topic: topic?.name ?? "",

      title: topic
        ? `Understanding ${topic.name} — Complete AI Tutorial`
        : current.title,
    }));
  }

  /* =======================================================
     GENERATION
     ======================================================= */

  async function handleGenerate() {
    if (!form.subjectId) {
      setSaveMessage("Please select a subject.");
      return;
    }

    if (!form.sectionId) {
      setSaveMessage("Please select a section.");
      return;
    }

    if (!form.topicId) {
      setSaveMessage("Please select a topic.");
      return;
    }

    if (!form.title.trim()) {
      setSaveMessage("Please enter a lesson title.");
      return;
    }

    setSaveMessage("");
    setGenerationStage("script");
    setGenerationProgress(10);
    setActiveSection("script");

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    const generatedScenes =
      generateScenes(form);

    setGenerationProgress(40);

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    const generatedScript =
      buildScript(
        form,
        generatedScenes,
      );

    setScript(generatedScript);
    setScenes(generatedScenes);

    setGenerationStage("visuals");
    setGenerationProgress(65);

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    setGenerationStage("video");
    setGenerationProgress(85);

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    const avatar = getAvatar(
      form.avatarId,
    );

    const voice = getVoice(
      form.voiceId,
    );

    const lessonId = buildLessonId(
      form.subject,
      form.topic,
      existingLessons,
    );

    const objectives: LearningObjective[] =
      form.objectives
        .filter((item) => item.trim())
        .map((text) => ({
          id: makeId("objective"),
          text: text.trim(),
        }));

    const steps: ExplanationStep[] =
      generatedScenes.map(
        (scene, index) => ({
          id: makeId("step"),
          number: index + 1,
          title: scene.title,
          explanation: scene.narration,
        }),
      );

    const keyPoints: KeyPoint[] =
      form.keyPoints
        .filter((item) => item.trim())
        .map((text) => ({
          id: makeId("keypoint"),
          text: text.trim(),
        }));

    const durationSeconds =
      generatedScenes.reduce(
        (total, scene) =>
          total + scene.durationSeconds,
        0,
      );

    const lesson: AiVideoLesson = {
      id: lessonId,

      title: form.title.trim(),

      subject:
        selectedSubject?.name ??
        form.subject,

      topic:
        selectedTopic?.name ??
        form.topic,

      description:
        form.description.trim(),

      difficulty:
        form.difficulty,

      accessType:
        form.accessType,

      status: "READY",

      durationMinutes:
        Math.max(
          1,
          Math.round(
            durationSeconds / 60,
          ),
        ),

      teacher: {
        avatarId: avatar.avatarId,
        name: avatar.name,
        avatarUrl:
          avatar.avatarUrl,
      },

      voice: {
        id: voice.id,
        name: voice.name,
        provider: voice.provider,
        providerVoiceId:
          voice.providerVoiceId,
        language: voice.language,
        speakingRate:
          voice.speakingRate,
        pitch: voice.pitch,
      },

      teachingStyle:
        form.teachingStyle,

      visualStyle:
        form.visualStyle,

      objectives,

      steps,

      keyPoints,

      summary:
        form.summary.trim() ||
        `In this lesson, we covered ${form.topic} and the important concepts students should understand for ${form.subject}.`,

      jambTips:
        form.jambTips.trim(),

      keywords:
        form.keywords.trim(),

      generatedScript,

      scenes: generatedScenes,

      videoUrl:
        "mock-ai-video",

      thumbnailUrl:
        null,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      publishedAt:
        null,
    };

    setGeneratedLesson(lesson);

    setGenerationStage("complete");
    setGenerationProgress(100);
    setActiveSection("preview");
  }

  /* =======================================================
     SAVE
     ======================================================= */

  async function saveLesson(
    status: LessonStatus,
  ) {
    if (!generatedLesson) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    const lessonToSave: AiVideoLesson = {
      ...generatedLesson,
      status,
      publishedAt:
        status === "PUBLISHED"
          ? new Date().toISOString()
          : generatedLesson.publishedAt,
    };

    await new Promise((resolve) =>
      setTimeout(resolve, 400),
    );

    const saved =
      saveAiVideoLesson(
        lessonToSave,
      );

    setIsSaving(false);

    if (!saved) {
      setSaveMessage(
        "Failed to save the lesson.",
      );
      return;
    }

    setGeneratedLesson(saved);
    setExistingLessons(
      getAiVideoLessons(),
    );

    setSaveMessage(
      status === "PUBLISHED"
        ? "Lesson published successfully."
        : "Lesson saved as draft.",
    );
  }

  /* =======================================================
     SAVE DRAFT
     ======================================================= */

  function handleSaveDraft() {
    saveLesson("DRAFT");
  }

  /* =======================================================
     PUBLISH
     ======================================================= */

  function handlePublish() {
    saveLesson("PUBLISHED");
  }

  /* =======================================================
     DELETE EXISTING LESSON
     ======================================================= */

  function handleDeleteLesson(
    lessonId: string,
  ) {
    const lesson =
      existingLessons.find(
        (item) => item.id === lessonId,
      );

    if (!lesson) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${lesson.title}"?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    const deleted =
      deleteAiVideoLesson(
        lessonId,
      );

    if (!deleted) {
      setSaveMessage(
        "Unable to delete the lesson.",
      );
      return;
    }

    setExistingLessons(
      getAiVideoLessons(),
    );

    if (
      generatedLesson?.id ===
      lessonId
    ) {
      setGeneratedLesson(null);
      setScript("");
      setScenes([]);
      setGenerationStage("idle");
      setGenerationProgress(0);
    }

    setSaveMessage(
      "Lesson deleted successfully.",
    );
  }

  /* =======================================================
     UPDATE SCENE
     ======================================================= */

  function updateScene(
    sceneId: string,
    updates: Partial<LessonScene>,
  ) {
    setScenes((current) =>
      current.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              ...updates,
            }
          : scene,
      ),
    );
  }

  /* =======================================================
     ADD OBJECTIVE
     ======================================================= */

  function addObjective() {
    setForm((current) => ({
      ...current,
      objectives: [
        ...current.objectives,
        "",
      ],
    }));
  }

  /* =======================================================
     REMOVE OBJECTIVE
     ======================================================= */

  function removeObjective(
    index: number,
  ) {
    setForm((current) => ({
      ...current,
      objectives:
        current.objectives.filter(
          (_, itemIndex) =>
            itemIndex !== index,
        ),
    }));
  }

  /* =======================================================
     UPDATE OBJECTIVE
     ======================================================= */

  function updateObjective(
    index: number,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      objectives:
        current.objectives.map(
          (item, itemIndex) =>
            itemIndex === index
              ? value
              : item,
        ),
    }));
  }

  /* =======================================================
     ADD KEY POINT
     ======================================================= */

  function addKeyPoint() {
    setForm((current) => ({
      ...current,
      keyPoints: [
        ...current.keyPoints,
        "",
      ],
    }));
  }

  /* =======================================================
     REMOVE KEY POINT
     ======================================================= */

  function removeKeyPoint(
    index: number,
  ) {
    setForm((current) => ({
      ...current,
      keyPoints:
        current.keyPoints.filter(
          (_, itemIndex) =>
            itemIndex !== index,
        ),
    }));
  }

  /* =======================================================
     UPDATE KEY POINT
     ======================================================= */

  function updateKeyPoint(
    index: number,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      keyPoints:
        current.keyPoints.map(
          (item, itemIndex) =>
            itemIndex === index
              ? value
              : item,
        ),
    }));
  }

  /* =======================================================
     RESET CREATOR
     ======================================================= */

  function handleCreateAnother() {
    const firstSubject =
      secondarySyllabus[0];

    const firstSection =
      firstSubject?.sections?.[0];

    const firstTopic =
      firstSection?.topics?.[0];

    setForm({
      ...INITIAL_FORM,

      subjectId:
        firstSubject?.id ?? "",

      subject:
        firstSubject?.name ?? "",

      sectionId:
        firstSection?.id ?? "",

      section:
        firstSection?.name ?? "",

      topicId:
        firstTopic?.id ?? "",

      topic:
        firstTopic?.name ?? "",

      title: firstTopic
        ? `Understanding ${firstTopic.name} — Complete AI Tutorial`
        : "",
    });

    setGeneratedLesson(null);
    setScript("");
    setScenes([]);
    setGenerationStage("idle");
    setGenerationProgress(0);
    setSaveMessage("");
    setActiveSection("setup");
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/admin/secondary/video-lecture"
                className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to AI Video Lectures
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                  <WandSparkles className="h-6 w-6 text-indigo-600" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    AI Video Lecture Creator
                  </h1>

                  <p className="text-sm text-slate-500">
                    Create syllabus-based AI lessons for students.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleCreateAnother}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Lesson
            </Button>
          </div>
        </div>
      </div>

      {/* ===================================================
          GENERATION PROGRESS
      =================================================== */}

      {generationStage !== "idle" && (
        <div className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {generationStage === "complete"
                  ? "Generation complete"
                  : generationStage === "script"
                    ? "Generating lesson script..."
                    : generationStage === "visuals"
                      ? "Creating visual scenes..."
                      : "Preparing video preview..."}
              </span>

              <span className="font-semibold text-indigo-600">
                {generationProgress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${generationProgress}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            MESSAGE
        ================================================= */}

        {saveMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {saveMessage}
            </div>

            <button
              type="button"
              onClick={() =>
                setSaveMessage("")
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* ===============================================
              LEFT
          =============================================== */}

          <div className="space-y-6">
            {/* =============================================
                TABS
            ============================================= */}

            <div className="flex overflow-x-auto rounded-xl border bg-white p-1">
              {[
                {
                  id: "setup" as const,
                  label: "Lesson Setup",
                  icon: FileText,
                },
                {
                  id: "script" as const,
                  label: "Script & Scenes",
                  icon: Film,
                },
                {
                  id: "teacher" as const,
                  label: "AI Teacher",
                  icon: UserRound,
                },
                {
                  id: "preview" as const,
                  label: "Preview",
                  icon: Eye,
                },
              ].map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        tab.id,
                      )
                    }
                    className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      activeSection ===
                      tab.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* =============================================
                SETUP
            ============================================= */}

            {activeSection === "setup" && (
              <Card className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />

                    <h2 className="text-lg font-semibold">
                      Syllabus Selection
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the exact subject, section and topic from your syllabus.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  {/* SUBJECT */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Subject
                    </label>

                    <select
                      value={
                        form.subjectId
                      }
                      onChange={(event) =>
                        handleSubjectChange(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    >
                      {secondarySyllabus.map(
                        (subject) => (
                          <option
                            key={subject.id}
                            value={subject.id}
                          >
                            {subject.name}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* SECTION */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Section
                    </label>

                    <select
                      value={
                        form.sectionId
                      }
                      onChange={(event) =>
                        handleSectionChange(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    >
                      <option value="">
                        Select section
                      </option>

                      {sections.map(
                        (section) => (
                          <option
                            key={section.id}
                            value={section.id}
                          >
                            {section.code} —{" "}
                            {section.name}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* TOPIC */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Topic
                    </label>

                    <select
                      value={
                        form.topicId
                      }
                      onChange={(event) =>
                        handleTopicChange(
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    >
                      <option value="">
                        Select topic
                      </option>

                      {selectedSection?.topics.map(
                        (topic) => (
                          <option
                            key={topic.id}
                            value={topic.id}
                          >
                            {topic.name}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                {/* SELECTED TOPIC */}

                {selectedTopic && (
                  <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex items-start gap-3">
                      <Target className="mt-0.5 h-5 w-5 text-indigo-600" />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                          Selected syllabus topic
                        </p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {selectedTopic.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {form.subject} •{" "}
                          {form.section}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================
                    LESSON DETAILS
                ======================================== */}

                <div className="mt-8 border-t pt-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold">
                      Lesson Details
                    </h2>

                    <p className="text-sm text-slate-500">
                      Define how the AI lesson should be presented.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Lesson Title
                      </label>

                      <input
                        value={form.title}
                        onChange={(event) =>
                          setForm(
                            (current) => ({
                              ...current,
                              title:
                                event.target
                                  .value,
                            }),
                          )
                        }
                        placeholder="Enter lesson title"
                        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Description
                      </label>

                      <textarea
                        value={
                          form.description
                        }
                        onChange={(event) =>
                          setForm(
                            (current) => ({
                              ...current,
                              description:
                                event.target
                                  .value,
                            }),
                          )
                        }
                        rows={4}
                        placeholder="Describe what students will learn..."
                        className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Difficulty
                        </label>

                        <select
                          value={
                            form.difficulty
                          }
                          onChange={(event) =>
                            setForm(
                              (current) => ({
                                ...current,
                                difficulty:
                                  event
                                    .target
                                    .value as Difficulty,
                              }),
                            )
                          }
                          className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                        >
                          <option value="BEGINNER">
                            Beginner
                          </option>
                          <option value="INTERMEDIATE">
                            Intermediate
                          </option>
                          <option value="ADVANCED">
                            Advanced
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Access
                        </label>

                        <select
                          value={
                            form.accessType
                          }
                          onChange={(event) =>
                            setForm(
                              (current) => ({
                                ...current,
                                accessType:
                                  event
                                    .target
                                    .value as AccessType,
                              }),
                            )
                          }
                          className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                        >
                          <option value="FREE">
                            Free
                          </option>
                          <option value="PREMIUM">
                            Premium
                          </option>
                          <option value="PLAN_REQUIRED">
                            Plan Required
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Target Duration
                        </label>

                        <select
                          value={
                            form.durationMinutes
                          }
                          onChange={(event) =>
                            setForm(
                              (current) => ({
                                ...current,
                                durationMinutes:
                                  Number(
                                    event
                                      .target
                                      .value,
                                  ),
                              }),
                            )
                          }
                          className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"
                        >
                          <option value={5}>
                            5 minutes
                          </option>
                          <option value={10}>
                            10 minutes
                          </option>
                          <option value={15}>
                            15 minutes
                          </option>
                          <option value={20}>
                            20 minutes
                          </option>
                          <option value={30}>
                            30 minutes
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ========================================
                    OBJECTIVES
                ======================================== */}

                <div className="mt-8 border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Learning Objectives
                      </h2>

                      <p className="text-sm text-slate-500">
                        What should students know after watching?
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={
                        addObjective
                      }
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {form.objectives.map(
                      (
                        objective,
                        index,
                      ) => (
                        <div
                          key={index}
                          className="flex gap-2"
                        >
                          <input
                            value={
                              objective
                            }
                            onChange={(
                              event,
                            ) =>
                              updateObjective(
                                index,
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder={`Objective ${index + 1}`}
                            className="flex-1 rounded-lg border px-3 py-2.5 text-sm"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeObjective(
                                index,
                              )
                            }
                            className="rounded-lg border px-3 text-slate-400 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* ========================================
                    KEY POINTS
                ======================================== */}

                <div className="mt-8 border-t pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Key Points
                      </h2>

                      <p className="text-sm text-slate-500">
                        Important facts the AI teacher should emphasize.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={
                        addKeyPoint
                      }
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {form.keyPoints.map(
                      (
                        keyPoint,
                        index,
                      ) => (
                        <div
                          key={index}
                          className="flex gap-2"
                        >
                          <input
                            value={
                              keyPoint
                            }
                            onChange={(
                              event,
                            ) =>
                              updateKeyPoint(
                                index,
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder={`Key point ${index + 1}`}
                            className="flex-1 rounded-lg border px-3 py-2.5 text-sm"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeKeyPoint(
                                index,
                              )
                            }
                            className="rounded-lg border px-3 text-slate-400 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* ========================================
                    ADVANCED
                ======================================== */}

                <div className="mt-8 border-t pt-6">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAdvanced(
                        (current) =>
                          !current,
                      )
                    }
                    className="flex w-full items-center justify-between"
                  >
                    <div className="text-left">
                      <h2 className="font-semibold">
                        Advanced Lesson Content
                      </h2>

                      <p className="text-sm text-slate-500">
                        Summary, JAMB tips and keywords.
                      </p>
                    </div>

                    {showAdvanced ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {showAdvanced && (
                    <div className="mt-5 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Summary
                        </label>

                        <textarea
                          value={
                            form.summary
                          }
                          onChange={(event) =>
                            setForm(
                              (current) => ({
                                ...current,
                                summary:
                                  event
                                    .target
                                    .value,
                              }),
                            )
                          }
                          rows={4}
                          className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          JAMB Tips
                        </label>

                        <textarea
                          value={
                            form.jambTips
                          }
                          onChange={(event) =>
                            setForm(
                              (current) => ({
                                ...current,
                                jambTips:
                                  event
                                    .target
                                    .value,
                              }),
                            )
                          }
                          rows={4}
                          className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Keywords
                        </label>

                        <input
                          value={
                            form.keywords
                          }
                          onChange={(event) =>
                            setForm(
                              (current) => ({
                                ...current,
                                keywords:
                                  event
                                    .target
                                    .value,
                              }),
                            )
                          }
                          placeholder="photosynthesis, chlorophyll, glucose..."
                          className="w-full rounded-lg border px-3 py-2.5 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* =============================================
                SCRIPT
            ============================================= */}

            {activeSection === "script" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-600" />

                        <h2 className="text-lg font-semibold">
                          Generated Script
                        </h2>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Review and edit the generated narration.
                      </p>
                    </div>

                    {generatedLesson && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Generated
                      </span>
                    )}
                  </div>

                  {!script ? (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                      <Sparkles className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-3 font-medium text-slate-600">
                        No script generated yet
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Configure the lesson and generate the AI video.
                      </p>
                    </div>
                  ) : (
                    <textarea
                      value={script}
                      onChange={(event) =>
                        setScript(
                          event.target.value,
                        )
                      }
                      rows={20}
                      className="w-full rounded-xl border p-4 font-mono text-sm leading-6 outline-none focus:border-indigo-500"
                    />
                  )}
                </Card>

                <Card className="p-6">
                  <div className="mb-5">
                    <div className="flex items-center gap-2">
                      <Clapperboard className="h-5 w-5 text-indigo-600" />

                      <h2 className="text-lg font-semibold">
                        Video Scenes
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Each scene controls the narration and visual direction.
                    </p>
                  </div>

                  {scenes.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-10 text-center text-sm text-slate-400">
                      Generate the lesson to create scenes.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scenes.map(
                        (scene) => {
                          const isEditing =
                            editingSceneId ===
                            scene.id;

                          return (
                            <div
                              key={
                                scene.id
                              }
                              className="rounded-xl border p-4"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">
                                  {
                                    scene.number
                                  }
                                </div>

                                <div className="min-w-0 flex-1">
                                  {isEditing ? (
                                    <div className="space-y-3">
                                      <input
                                        value={
                                          scene.title
                                        }
                                        onChange={(
                                          event,
                                        ) =>
                                          updateScene(
                                            scene.id,
                                            {
                                              title:
                                                event
                                                  .target
                                                  .value,
                                            },
                                          )
                                        }
                                        className="w-full rounded-lg border px-3 py-2 text-sm font-semibold"
                                      />

                                      <textarea
                                        value={
                                          scene.narration
                                        }
                                        onChange={(
                                          event,
                                        ) =>
                                          updateScene(
                                            scene.id,
                                            {
                                              narration:
                                                event
                                                  .target
                                                  .value,
                                            },
                                          )
                                        }
                                        rows={
                                          5
                                        }
                                        className="w-full rounded-lg border px-3 py-2 text-sm"
                                      />

                                      <textarea
                                        value={
                                          scene.visualInstruction
                                        }
                                        onChange={(
                                          event,
                                        ) =>
                                          updateScene(
                                            scene.id,
                                            {
                                              visualInstruction:
                                                event
                                                  .target
                                                  .value,
                                            },
                                          )
                                        }
                                        rows={
                                          3
                                        }
                                        className="w-full rounded-lg border px-3 py-2 text-sm"
                                      />

                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() =>
                                          setEditingSceneId(
                                            null,
                                          )
                                        }
                                      >
                                        <Check className="mr-2 h-4 w-4" />
                                        Done
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <h3 className="font-semibold">
                                            {
                                              scene.title
                                            }
                                          </h3>

                                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            {
                                              scene.durationSeconds
                                            }{" "}
                                            seconds
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            setEditingSceneId(
                                              scene.id,
                                            )
                                          }
                                          className="rounded-lg border p-2 text-slate-400 hover:text-slate-900"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {
                                          scene.narration
                                        }
                                      </p>

                                      <div className="mt-3 rounded-lg bg-slate-50 p-3">
                                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                          <ImageIcon className="h-3.5 w-3.5" />
                                          Visual
                                        </div>

                                        <p className="text-sm text-slate-600">
                                          {
                                            scene.visualInstruction
                                          }
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* =============================================
                TEACHER
            ============================================= */}

            {activeSection === "teacher" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-5 w-5 text-indigo-600" />

                      <h2 className="text-lg font-semibold">
                        AI Teacher
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose who presents the lesson.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {AVATARS.map(
                      (avatar) => {
                        const selected =
                          form.avatarId ===
                          avatar.avatarId;

                        return (
                          <button
                            key={
                              avatar.avatarId
                            }
                            type="button"
                            onClick={() =>
                              setForm(
                                (
                                  current,
                                ) => ({
                                  ...current,
                                  avatarId:
                                    avatar.avatarId,
                                }),
                              )
                            }
                            className={`rounded-xl border p-4 text-left transition ${
                              selected
                                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                                : "hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                <UserRound className="h-7 w-7 text-slate-500" />
                              </div>

                              <div>
                                <p className="font-semibold">
                                  {
                                    avatar.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    avatar.description
                                  }
                                </p>
                              </div>

                              {selected && (
                                <CheckCircle2 className="ml-auto h-5 w-5 text-indigo-600" />
                              )}
                            </div>
                          </button>
                        );
                      },
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-indigo-600" />

                      <h2 className="text-lg font-semibold">
                        Voice
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Select the voice used for narration.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {VOICES.map(
                      (voice) => {
                        const selected =
                          form.voiceId ===
                          voice.id;

                        return (
                          <button
                            key={
                              voice.id
                            }
                            type="button"
                            onClick={() =>
                              setForm(
                                (
                                  current,
                                ) => ({
                                  ...current,
                                  voiceId:
                                    voice.id,
                                }),
                              )
                            }
                            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left ${
                              selected
                                ? "border-indigo-500 bg-indigo-50"
                                : "hover:border-slate-300"
                            }`}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                              <Mic2 className="h-5 w-5 text-slate-500" />
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold">
                                {
                                  voice.name
                                }
                              </p>

                              <p className="text-xs text-slate-500">
                                {
                                  voice.description
                                }
                              </p>
                            </div>

                            {selected && (
                              <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                      Teaching Style
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Control how the AI teacher communicates.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        value:
                          "friendly" as const,
                        label:
                          "Friendly",
                        description:
                          "Warm and conversational",
                      },
                      {
                        value:
                          "exam" as const,
                        label:
                          "Exam Focused",
                        description:
                          "Focused on examination success",
                      },
                      {
                        value:
                          "energetic" as const,
                        label:
                          "Energetic",
                        description:
                          "Fast and engaging",
                      },
                      {
                        value:
                          "step-by-step" as const,
                        label:
                          "Step by Step",
                        description:
                          "Slow and structured",
                      },
                    ].map(
                      (style) => (
                        <button
                          key={
                            style.value
                          }
                          type="button"
                          onClick={() =>
                            setForm(
                              (
                                current,
                              ) => ({
                                ...current,
                                teachingStyle:
                                  style.value,
                              }),
                            )
                          }
                          className={`rounded-xl border p-4 text-left ${
                            form.teachingStyle ===
                            style.value
                              ? "border-indigo-500 bg-indigo-50"
                              : ""
                          }`}
                        >
                          <p className="font-semibold">
                            {
                              style.label
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              style.description
                            }
                          </p>
                        </button>
                      ),
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                      Visual Style
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose the visual presentation style.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        value:
                          "modern" as const,
                        label:
                          "Modern",
                      },
                      {
                        value:
                          "whiteboard" as const,
                        label:
                          "Whiteboard",
                      },
                      {
                        value:
                          "science" as const,
                        label:
                          "Science",
                      },
                      {
                        value:
                          "exam" as const,
                        label:
                          "Exam",
                      },
                    ].map(
                      (style) => (
                        <button
                          key={
                            style.value
                          }
                          type="button"
                          onClick={() =>
                            setForm(
                              (
                                current,
                              ) => ({
                                ...current,
                                visualStyle:
                                  style.value,
                              }),
                            )
                          }
                          className={`rounded-xl border p-4 text-left ${
                            form.visualStyle ===
                            style.value
                              ? "border-indigo-500 bg-indigo-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Video className="h-5 w-5 text-indigo-600" />

                            <span className="font-semibold">
                              {
                                style.label
                              }
                            </span>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* =============================================
                PREVIEW
            ============================================= */}

            {activeSection === "preview" && (
              <div className="space-y-6">
                {!generatedLesson ? (
                  <Card className="p-12 text-center">
                    <Video className="mx-auto h-12 w-12 text-slate-300" />

                    <h2 className="mt-4 text-lg font-semibold">
                      No lesson generated yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                      Configure your subject, section and topic, then generate the AI lesson.
                    </p>

                    <Button
                      className="mt-6"
                      onClick={() =>
                        setActiveSection(
                          "setup",
                        )
                      }
                    >
                      Go to Setup
                    </Button>
                  </Card>
                ) : (
                  <>
                    <Card className="overflow-hidden">
                      <MockGeneratedPlayer
                        lesson={
                          generatedLesson
                        }
                      />

                      <div className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                                {
                                  generatedLesson.subject
                                }
                              </span>

                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {
                                  generatedLesson.topic
                                }
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                  generatedLesson.status,
                                )}`}
                              >
                                {formatStatus(
                                  generatedLesson.status,
                                )}
                              </span>
                            </div>

                            <h2 className="mt-3 text-2xl font-bold">
                              {
                                generatedLesson.title
                              }
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {
                                generatedLesson.description
                              }
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock3 className="h-4 w-4" />

                            {
                              generatedLesson.durationMinutes
                            }{" "}
                            min
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-400">
                              AI Teacher
                            </p>

                            <p className="mt-1 font-semibold">
                              {
                                generatedLesson
                                  .teacher
                                  .name
                              }
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-400">
                              Voice
                            </p>

                            <p className="mt-1 font-semibold">
                              {
                                generatedLesson
                                  .voice
                                  .name
                              }
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-400">
                              Visual Style
                            </p>

                            <p className="mt-1 font-semibold capitalize">
                              {
                                generatedLesson.visualStyle
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="mb-5 flex items-center gap-2">
                        <Target className="h-5 w-5 text-indigo-600" />

                        <h2 className="text-lg font-semibold">
                          Learning Objectives
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {generatedLesson.objectives.map(
                          (objective) => (
                            <div
                              key={
                                objective.id
                              }
                              className="flex items-start gap-3"
                            >
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                              <p className="text-sm text-slate-600">
                                {
                                  objective.text
                                }
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="mb-5">
                        <h2 className="text-lg font-semibold">
                          Summary
                        </h2>
                      </div>

                      <p className="text-sm leading-7 text-slate-600">
                        {
                          generatedLesson.summary
                        }
                      </p>

                      <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                          JAMB Tip
                        </p>

                        <p className="mt-2 text-sm leading-6 text-yellow-900">
                          {
                            generatedLesson.jambTips
                          }
                        </p>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* =============================================
                BOTTOM ACTIONS
            ============================================= */}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (
                    activeSection ===
                    "setup"
                  ) {
                    return;
                  }

                  if (
                    activeSection ===
                    "script"
                  ) {
                    setActiveSection(
                      "setup",
                    );
                  } else if (
                    activeSection ===
                    "teacher"
                  ) {
                    setActiveSection(
                      "script",
                    );
                  } else {
                    setActiveSection(
                      "teacher",
                    );
                  }
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {activeSection ===
              "setup" ? (
                <Button
                  onClick={
                    handleGenerate
                  }
                  disabled={
                    generationStage !==
                      "idle" &&
                    generationStage !==
                      "complete"
                  }
                >
                  {generationStage !==
                    "idle" &&
                  generationStage !==
                    "complete" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Lesson
                    </>
                  )}
                </Button>
              ) : activeSection ===
                "preview" ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={
                      handleSaveDraft
                    }
                    disabled={
                      isSaving ||
                      !generatedLesson
                    }
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Draft
                  </Button>

                  <Button
                    onClick={
                      handlePublish
                    }
                    disabled={
                      isSaving ||
                      !generatedLesson
                    }
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Publish Lesson
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    if (
                      activeSection ===
                      "script"
                    ) {
                      setActiveSection(
                        "teacher",
                      );
                    } else if (
                      activeSection ===
                      "teacher"
                    ) {
                      setActiveSection(
                        "preview",
                      );
                    }
                  }}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* ===============================================
              RIGHT SIDEBAR
          =============================================== */}

          <aside className="space-y-6">
            {/* LESSON SUMMARY */}

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-600" />

                <h2 className="font-semibold">
                  Lesson Summary
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400">
                    Subject
                  </p>

                  <p className="mt-1 font-medium">
                    {form.subject ||
                      "Not selected"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Section
                  </p>

                  <p className="mt-1 font-medium">
                    {form.section ||
                      "Not selected"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Topic
                  </p>

                  <p className="mt-1 font-medium">
                    {form.topic ||
                      "Not selected"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Difficulty
                  </p>

                  <p className="mt-1 font-medium">
                    {form.difficulty}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Access
                  </p>

                  <p className="mt-1 font-medium">
                    {form.accessType}
                  </p>
                </div>
              </div>
            </Card>

            {/* EXISTING LESSONS */}

            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    Existing Lessons
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {existingLessons.length} lesson
                    {existingLessons.length ===
                    1
                      ? ""
                      : "s"}
                  </p>
                </div>

                <Film className="h-5 w-5 text-slate-400" />
              </div>

              {existingLessons.length ===
              0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center">
                  <Video className="mx-auto h-7 w-7 text-slate-300" />

                  <p className="mt-2 text-sm text-slate-500">
                    No lessons created yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {existingLessons.map(
                    (lesson) => (
                      <div
                        key={
                          lesson.id
                        }
                        className="rounded-xl border p-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                            <Video className="h-4 w-4 text-indigo-600" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold">
                              {
                                lesson.title
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                lesson.subject
                              }{" "}
                              •{" "}
                              {
                                lesson.topic
                              }
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusClass(
                                  lesson.status,
                                )}`}
                              >
                                {
                                  lesson.status
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteLesson(
                                    lesson.id,
                                  )
                                }
                                className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                title="Delete lesson"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </Card>

            {/* QUICK INFO */}

            <Card className="border-indigo-100 bg-indigo-50 p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-indigo-600" />

                <div>
                  <h3 className="font-semibold text-indigo-900">
                    AI Lesson Pipeline
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-indigo-700">
                    Select a syllabus topic, generate the script and scenes, choose an AI teacher, preview the lesson, then save or publish it.
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}





// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Bot,
//   Check,
//   CheckCircle2,
//   ChevronDown,
//   ChevronUp,
//   Clapperboard,
//   Clock3,
//   Eye,
//   FileText,
//   Film,
//   GraduationCap,
//   Image as ImageIcon,
//   Loader2,
//   Mic2,
//   Pencil,
//   Play,
//   Plus,
//   RefreshCw,
//   Save,
//   Sparkles,
//   Square,
//   Target,
//   Trash2,
//   UserRound,
//   Video,
//   Volume2,
//   WandSparkles,
//   X,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// import {
//   getAiVideoLessons,
//   saveAiVideoLesson,
//   type AccessType,
//   type AiVideoLesson,
//   type AiVideoTeacher,
//   type Difficulty,
//   type ExplanationStep,
//   type KeyPoint,
//   type LearningObjective,
//   type LessonScene,
//   type LessonStatus,
//   type TeachingStyle,
//   type VisualStyle,
//   type VoiceConfig,
// } from "@/lib/storage/ai-video-lessons";

// /* -------------------------------------------------------------------------- */
// /* Types                                                                      */
// /* -------------------------------------------------------------------------- */

// type GenerationStage =
//   | "idle"
//   | "script"
//   | "visuals"
//   | "video"
//   | "complete";

// type VoiceOption = VoiceConfig & {
//   description: string;
// };

// type AvatarOption = AiVideoTeacher & {
//   description: string;
// };

// type LessonForm = {
//   subject: string;
//   topic: string;
//   title: string;
//   description: string;
//   difficulty: Difficulty;
//   accessType: AccessType;
//   durationMinutes: number;
//   teachingStyle: TeachingStyle;
//   visualStyle: VisualStyle;
//   avatarId: string;
//   voiceId: string;
//   objectives: string[];
//   keyPoints: string[];
//   summary: string;
//   jambTips: string;
//   keywords: string;
// };

// /* -------------------------------------------------------------------------- */
// /* Constants                                                                  */
// /* -------------------------------------------------------------------------- */

// const AVATAR_BASE =
//   "https://api.dicebear.com/9.x/personas/svg?backgroundColor=f3f4f6";

// const AVATARS: AvatarOption[] = [
//   {
//     avatarId: "amara",
//     name: "Amara",
//     avatarUrl: `${AVATAR_BASE}&seed=Amara`,
//     description: "Friendly female science teacher",
//   },
//   {
//     avatarId: "daniel",
//     name: "Daniel",
//     avatarUrl: `${AVATAR_BASE}&seed=Daniel`,
//     description: "Professional male exam tutor",
//   },
//   {
//     avatarId: "zainab",
//     name: "Zainab",
//     avatarUrl: `${AVATAR_BASE}&seed=Zainab`,
//     description: "Calm and patient tutor",
//   },
//   {
//     avatarId: "michael",
//     name: "Michael",
//     avatarUrl: `${AVATAR_BASE}&seed=Michael`,
//     description: "Energetic classroom teacher",
//   },
// ];

// const VOICES: VoiceOption[] = [
//   {
//     id: "amara-natural",
//     name: "Amara Natural",
//     provider: "browser-demo",
//     providerVoiceId: "en-female-natural",
//     language: "en-NG",
//     speakingRate: 0.98,
//     pitch: 1.03,
//     description: "Natural, warm Nigerian-English style",
//   },
//   {
//     id: "amara-energetic",
//     name: "Amara Energetic",
//     provider: "browser-demo",
//     providerVoiceId: "en-female-energetic",
//     language: "en-NG",
//     speakingRate: 1.08,
//     pitch: 1.08,
//     description: "Bright and energetic classroom delivery",
//   },
//   {
//     id: "daniel-professional",
//     name: "Daniel Professional",
//     provider: "browser-demo",
//     providerVoiceId: "en-male-professional",
//     language: "en-NG",
//     speakingRate: 0.96,
//     pitch: 0.92,
//     description: "Clear professional examination tutor",
//   },
//   {
//     id: "zainab-calm",
//     name: "Zainab Calm",
//     provider: "browser-demo",
//     providerVoiceId: "en-female-calm",
//     language: "en-NG",
//     speakingRate: 0.88,
//     pitch: 1,
//     description: "Slow and calm explanatory voice",
//   },
// ];

// const TEACHING_STYLES: {
//   id: TeachingStyle;
//   name: string;
//   description: string;
// }[] = [
//   {
//     id: "friendly",
//     name: "Friendly",
//     description: "Simple and conversational",
//   },
//   {
//     id: "exam",
//     name: "Exam Focused",
//     description: "JAMB-focused explanations and tips",
//   },
//   {
//     id: "energetic",
//     name: "Energetic",
//     description: "Fast-paced and engaging",
//   },
//   {
//     id: "step-by-step",
//     name: "Step-by-Step",
//     description: "Detailed guided teaching",
//   },
// ];

// const VISUAL_STYLES: {
//   id: VisualStyle;
//   name: string;
//   description: string;
// }[] = [
//   {
//     id: "modern",
//     name: "Modern",
//     description: "Clean animated educational graphics",
//   },
//   {
//     id: "whiteboard",
//     name: "Whiteboard",
//     description: "Teacher-style board explanations",
//   },
//   {
//     id: "science",
//     name: "Science",
//     description: "Diagrams and scientific illustrations",
//   },
//   {
//     id: "exam",
//     name: "Exam",
//     description: "Questions, formulas and exam tips",
//   },
// ];

// const SUBJECTS = [
//   "Biology",
//   "Physics",
//   "Chemistry",
//   "Mathematics",
//   "English",
//   "Economics",
//   "Government",
//   "Geography",
//   "Commerce",
//   "Literature",
// ];

// const INITIAL_FORM: LessonForm = {
//   subject: "Biology",
//   topic: "Cell Structure",
//   title: "Understanding Cell Structure — Complete AI Tutorial",
//   description:
//     "A complete visual lesson explaining cell structure, organelles, their functions, and common JAMB examination points.",
//   difficulty: "BEGINNER",
//   accessType: "FREE",
//   durationMinutes: 10,
//   teachingStyle: "exam",
//   visualStyle: "science",
//   avatarId: "amara",
//   voiceId: "amara-natural",
//   objectives: [
//     "Identify the major structures found in a typical cell.",
//     "Explain the functions of important cell organelles.",
//     "Differentiate between plant and animal cells.",
//   ],
//   keyPoints: [
//     "The nucleus controls many activities of the cell.",
//     "Mitochondria are associated with aerobic respiration and ATP production.",
//     "Plant cells have structures such as a cell wall and chloroplasts.",
//   ],
//   summary:
//     "Cells are the basic structural and functional units of living organisms. Different organelles perform specialized functions that allow cells to survive and carry out life processes.",
//   jambTips:
//     "For JAMB, focus on matching each organelle with its correct function and knowing the differences between plant and animal cells.",
//   keywords:
//     "cell structure, cell organelles, nucleus, mitochondria, chloroplast, ribosome, biology",
// };

// /* -------------------------------------------------------------------------- */
// /* Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// function makeId(prefix: string) {
//   return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
// }

// function formatDifficulty(value: Difficulty) {
//   switch (value) {
//     case "BEGINNER":
//       return "Beginner";
//     case "INTERMEDIATE":
//       return "Intermediate";
//     case "ADVANCED":
//       return "Advanced";
//     default:
//       return value;
//   }
// }

// function formatAccess(value: AccessType) {
//   switch (value) {
//     case "FREE":
//       return "Free";
//     case "PREMIUM":
//       return "Premium";
//     case "PLAN_REQUIRED":
//       return "Plan Required";
//     default:
//       return value;
//   }
// }

// function formatTeachingStyle(value: TeachingStyle) {
//   switch (value) {
//     case "friendly":
//       return "Friendly";
//     case "exam":
//       return "Exam Focused";
//     case "energetic":
//       return "Energetic";
//     case "step-by-step":
//       return "Step-by-Step";
//     default:
//       return value;
//   }
// }

// function formatVisualStyle(value: VisualStyle) {
//   switch (value) {
//     case "modern":
//       return "Modern";
//     case "whiteboard":
//       return "Whiteboard";
//     case "science":
//       return "Science";
//     case "exam":
//       return "Exam";
//     default:
//       return value;
//   }
// }

// function getAvatar(avatarId: string) {
//   return (
//     AVATARS.find((avatar) => avatar.avatarId === avatarId) ?? AVATARS[0]
//   );
// }

// function getVoice(voiceId: string) {
//   return VOICES.find((voice) => voice.id === voiceId) ?? VOICES[0];
// }

// function buildLessonId(subject: string, topic: string) {
//   const subjectPart = subject
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");

//   const topicPart = topic
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");

//   const base = `${subjectPart}-${topicPart}`;

//   const existing = getAiVideoLessons();

//   const matching = existing.filter((lesson) =>
//     lesson.id.startsWith(base),
//   );

//   const nextNumber = matching.length + 1;

//   return `${base}-${String(nextNumber).padStart(3, "0")}`;
// }

// function generateScenes(form: LessonForm): LessonScene[] {
//   const subject = form.subject;
//   const topic = form.topic;

//   return [
//     {
//       id: makeId("scene"),
//       number: 1,
//       title: "Introduction",
//       narration: `Welcome to this ${subject} lesson on ${topic}. In this lesson, we will break down the topic into simple ideas that you can remember and apply in your examination.`,
//       durationSeconds: 45,
//       visualInstruction:
//         "Show the lesson title, subject, topic and AI teacher introduction.",
//     },
//     {
//       id: makeId("scene"),
//       number: 2,
//       title: "Core Concept",
//       narration: `Let us begin with the core idea behind ${topic}. Understanding the basic concept first makes the more detailed parts of this lesson much easier to understand.`,
//       durationSeconds: 90,
//       visualInstruction:
//         "Display an animated educational diagram introducing the central concept.",
//     },
    
//       {
//   id: makeId("scene"),
//   number: 3,
//   title: "Step-by-Step",
//   narration: `We will now work through ${topic} step by step, paying attention to the details that are commonly tested.`,
//   durationSeconds: 180,
//   visualInstruction:
//     "Animate the lesson explanation step by step with labels and highlighted concepts.",
// },
//     {
//       id: makeId("scene"),
//       number: 4,
//       title: "Example",
//       narration: `Here is a simple example related to ${topic}. Pay attention to how the concept is applied rather than simply memorizing the definition.`,
//       durationSeconds: 90,
//       visualInstruction:
//         "Show a worked educational example with animated annotations.",
//     },
//     {
//       id: makeId("scene"),
//       number: 5,
//       title: "JAMB Tip",
//       narration: form.jambTips,
//       durationSeconds: 60,
//       visualInstruction:
//         "Show a JAMB examination tip card with key words highlighted.",
//     },
//     {
//       id: makeId("scene"),
//       number: 6,
//       title: "Summary",
//       narration: form.summary,
//       durationSeconds: 75,
//       visualInstruction:
//         "Display the major points from the lesson as an animated summary.",
//     },
//   ];
// }

// function buildScript(form: LessonForm, scenes: LessonScene[]) {
//   const objectives = form.objectives
//     .filter(Boolean)
//     .map((item, index) => `${index + 1}. ${item}`)
//     .join("\n");

//   const keyPoints = form.keyPoints
//     .filter(Boolean)
//     .map((item, index) => `${index + 1}. ${item}`)
//     .join("\n");

//   return `AI TEACHING SCRIPT

// Title:
// ${form.title}

// Subject:
// ${form.subject}

// Topic:
// ${form.topic}

// Teaching style:
// ${formatTeachingStyle(form.teachingStyle)}

// Learning objectives:
// ${objectives}

// INTRODUCTION
// ${scenes[0]?.narration ?? ""}

// CORE CONCEPT
// ${scenes[1]?.narration ?? ""}

// STEP-BY-STEP EXPLANATION
// ${scenes[2]?.narration ?? ""}

// EXAMPLE
// ${scenes[3]?.narration ?? ""}

// JAMB EXAMINATION TIP
// ${form.jambTips}

// KEY POINTS
// ${keyPoints}

// SUMMARY
// ${form.summary}

// The AI teacher should explain the topic clearly, use simple examples, pause naturally between concepts, and emphasize important examination terms.`;
// }

// /* -------------------------------------------------------------------------- */
// /* Mock AI Player                                                             */
// /* -------------------------------------------------------------------------- */

// function MockGeneratedPlayer({
//   lesson,
//   scenes,
// }: {
//   lesson: AiVideoLesson;
//   scenes: LessonScene[];
// }) {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [elapsed, setElapsed] = useState(0);
//   const [sceneIndex, setSceneIndex] = useState(0);
//   const [isMuted, setIsMuted] = useState(false);

//   const totalDuration = useMemo(
//     () =>
//       scenes.reduce(
//         (total, scene) => total + Math.max(1, scene.durationSeconds),
//         0,
//       ),
//     [scenes],
//   );

//   const currentScene = scenes[sceneIndex] ?? scenes[0];

//   useEffect(() => {
//     if (!isPlaying || !currentScene) return;

//     const interval = window.setInterval(() => {
//       setElapsed((current) => {
//         const next = current + 1;

//         let accumulated = 0;

//         for (let index = 0; index < scenes.length; index += 1) {
//           accumulated += scenes[index].durationSeconds;

//           if (next < accumulated) {
//             if (index !== sceneIndex) {
//               setSceneIndex(index);
//             }

//             break;
//           }
//         }

//         if (next >= totalDuration) {
//           setIsPlaying(false);
//           return totalDuration;
//         }

//         return next;
//       });
//     }, 1000);

//     return () => window.clearInterval(interval);
//   }, [isPlaying, currentScene, sceneIndex, scenes, totalDuration]);

//   function togglePlay() {
//     if (!scenes.length) return;

//     if (elapsed >= totalDuration) {
//       setElapsed(0);
//       setSceneIndex(0);
//       setIsPlaying(true);
//       return;
//     }

//     setIsPlaying((value) => !value);
//   }

//   function restart() {
//     setElapsed(0);
//     setSceneIndex(0);
//     setIsPlaying(true);
//   }

//   function jumpToScene(index: number) {
//     const safeIndex = Math.max(0, Math.min(index, scenes.length - 1));

//     let startTime = 0;

//     for (let i = 0; i < safeIndex; i += 1) {
//       startTime += scenes[i].durationSeconds;
//     }

//     setElapsed(startTime);
//     setSceneIndex(safeIndex);
//   }

//   function formatTime(seconds: number) {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);

//     return `${mins}:${String(secs).padStart(2, "0")}`;
//   }

//   if (!currentScene) {
//     return (
//       <div className="flex aspect-video items-center justify-center rounded-3xl bg-slate-950 text-white">
//         <div className="text-center">
//           <Video className="mx-auto mb-3 h-10 w-10 text-slate-500" />
//           <p className="text-sm text-slate-400">
//             No generated scenes available.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const progress =
//     totalDuration > 0 ? Math.min(100, (elapsed / totalDuration) * 100) : 0;

//   return (
//     <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
//       <div className="relative aspect-video overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />

//         <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur">
//           <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
//           AI VIDEO PREVIEW
//         </div>

//         <div className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur">
//           Scene {sceneIndex + 1} / {scenes.length}
//         </div>

//         <div className="absolute inset-0 flex items-center justify-center p-8">
//           <div className="grid w-full max-w-4xl grid-cols-[150px_1fr] gap-8">
//             <div className="flex flex-col items-center justify-center">
//               <div className="relative">
//                 <img
//                   src={lesson.teacher.avatarUrl}
//                   alt={lesson.teacher.name}
//                   className="h-32 w-32 rounded-full border-4 border-white/20 bg-white object-cover shadow-2xl"
//                 />

//                 {isPlaying && (
//                   <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[10px] font-medium text-white backdrop-blur">
//                     <Volume2 className="h-3 w-3" />
//                     Speaking
//                   </div>
//                 )}
//               </div>

//               <div className="mt-4 text-center">
//                 <p className="font-semibold text-white">
//                   {lesson.teacher.name}
//                 </p>
//                 <p className="mt-1 text-xs text-white/50">AI Teacher</p>
//               </div>
//             </div>

//             <div className="flex min-w-0 items-center">
//               <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
//                 <div className="mb-5">
//                   <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
//                     {lesson.subject}
//                   </span>

//                   <h3 className="mt-2 text-2xl font-bold text-white">
//                     {lesson.title}
//                   </h3>

//                   <p className="mt-2 text-sm text-white/50">
//                     {lesson.topic}
//                   </p>
//                 </div>

//                 <div className="rounded-xl border border-white/10 bg-black/20 p-5">
//                   <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-300">
//                     <ImageIcon className="h-4 w-4" />
//                     Visual Explanation
//                   </div>

//                   <p className="text-sm leading-7 text-white/80">
//                     {currentScene.visualInstruction}
//                   </p>
//                 </div>

//                 <div className="mt-5 rounded-xl bg-white/5 p-4">
//                   <p className="text-sm leading-6 text-white/80">
//                     {currentScene.narration}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pb-4 pt-16">
//           <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/20">
//             <div
//               className="h-full rounded-full bg-indigo-400 transition-all"
//               style={{ width: `${progress}%` }}
//             />
//           </div>

//           <div className="flex items-center justify-between text-xs text-white/60">
//             <span>{formatTime(elapsed)}</span>
//             <span>{formatTime(totalDuration)}</span>
//           </div>

//           <div className="mt-3 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={togglePlay}
//                 className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 transition hover:scale-105"
//               >
//                 {isPlaying ? (
//                   <Square className="h-4 w-4 fill-current" />
//                 ) : (
//                   <Play className="ml-0.5 h-4 w-4 fill-current" />
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={restart}
//                 className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
//                 title="Restart"
//               >
//                 <RefreshCw className="h-4 w-4" />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setIsMuted((value) => !value)}
//                 className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
//                 title={isMuted ? "Unmute" : "Mute"}
//               >
//                 {isMuted ? (
//                   <Volume2 className="h-4 w-4 opacity-50" />
//                 ) : (
//                   <Volume2 className="h-4 w-4" />
//                 )}
//               </button>
//             </div>

//             <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/70">
//               {lesson.voice.name}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-white/10 bg-slate-900 p-3">
//         <div className="flex gap-2 overflow-x-auto">
//           {scenes.map((scene, index) => (
//             <button
//               key={scene.id}
//               type="button"
//               onClick={() => jumpToScene(index)}
//               className={`shrink-0 rounded-xl px-3 py-2 text-left text-xs transition ${
//                 index === sceneIndex
//                   ? "bg-indigo-500 text-white"
//                   : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
//               }`}
//             >
//               <span className="block font-semibold">
//                 {index + 1}. {scene.title}
//               </span>

//               <span className="mt-1 block opacity-60">
//                 {scene.durationSeconds}s
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Main Page                                                                  */
// /* -------------------------------------------------------------------------- */

// export default function VideoAiLecturePage() {
//   const [form, setForm] = useState<LessonForm>(INITIAL_FORM);

//   const [generationStage, setGenerationStage] =
//     useState<GenerationStage>("idle");

//   const [generationProgress, setGenerationProgress] = useState(0);

//   const [generatedLesson, setGeneratedLesson] =
//     useState<AiVideoLesson | null>(null);

//   const [script, setScript] = useState("");
//   const [scenes, setScenes] = useState<LessonScene[]>([]);

//   const [isSaving, setIsSaving] = useState(false);
//   const [saveMessage, setSaveMessage] = useState("");

//   const [activeSection, setActiveSection] = useState<
//     "setup" | "script" | "teacher" | "preview"
//   >("setup");

//   const [showAdvanced, setShowAdvanced] = useState(false);

//   const [editingSceneId, setEditingSceneId] = useState<string | null>(null);

//   const [existingLessons, setExistingLessons] = useState<AiVideoLesson[]>([]);

//   /* ------------------------------------------------------------------------ */
//   /* Existing lessons                                                         */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     setExistingLessons(getAiVideoLessons());
//   }, []);

//   /* ------------------------------------------------------------------------ */
//   /* Derived                                                                  */
//   /* ------------------------------------------------------------------------ */

//   const selectedAvatar = getAvatar(form.avatarId);
//   const selectedVoice = getVoice(form.voiceId);

//   const canGenerate =
//     Boolean(form.subject.trim()) &&
//     Boolean(form.topic.trim()) &&
//     Boolean(form.title.trim()) &&
//     form.objectives.some((item) => item.trim());

//   const totalSceneDuration = useMemo(
//     () =>
//       scenes.reduce(
//         (total, scene) => total + Math.max(1, scene.durationSeconds),
//         0,
//       ),
//     [scenes],
//   );

//   /* ------------------------------------------------------------------------ */
//   /* Form helpers                                                             */
//   /* ------------------------------------------------------------------------ */

//   function updateForm<K extends keyof LessonForm>(
//     key: K,
//     value: LessonForm[K],
//   ) {
//     setForm((current) => ({
//       ...current,
//       [key]: value,
//     }));
//   }

//   function updateObjective(index: number, value: string) {
//     setForm((current) => {
//       const next = [...current.objectives];
//       next[index] = value;

//       return {
//         ...current,
//         objectives: next,
//       };
//     });
//   }

//   function addObjective() {
//     setForm((current) => ({
//       ...current,
//       objectives: [...current.objectives, ""],
//     }));
//   }

//   function removeObjective(index: number) {
//     setForm((current) => ({
//       ...current,
//       objectives: current.objectives.filter(
//         (_, currentIndex) => currentIndex !== index,
//       ),
//     }));
//   }

//   function updateKeyPoint(index: number, value: string) {
//     setForm((current) => {
//       const next = [...current.keyPoints];
//       next[index] = value;

//       return {
//         ...current,
//         keyPoints: next,
//       };
//     });
//   }

//   function addKeyPoint() {
//     setForm((current) => ({
//       ...current,
//       keyPoints: [...current.keyPoints, ""],
//     }));
//   }

//   function removeKeyPoint(index: number) {
//     setForm((current) => ({
//       ...current,
//       keyPoints: current.keyPoints.filter(
//         (_, currentIndex) => currentIndex !== index,
//       ),
//     }));
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Generate                                                                  */
//   /* ------------------------------------------------------------------------ */

//   async function handleGenerate() {
//     if (!canGenerate) {
//       setSaveMessage(
//         "Please complete the subject, topic, title and at least one learning objective.",
//       );
//       return;
//     }

//     setSaveMessage("");
//     setGenerationProgress(0);
//     setGenerationStage("script");
//     setActiveSection("script");

//     await new Promise((resolve) => setTimeout(resolve, 700));
//     setGenerationProgress(20);

//     const generatedScenes = generateScenes(form);

//     const generatedScript = buildScript(form, generatedScenes);

//     setScenes(generatedScenes);
//     setScript(generatedScript);

//     await new Promise((resolve) => setTimeout(resolve, 800));
//     setGenerationProgress(45);

//     setGenerationStage("visuals");
//     setActiveSection("teacher");

//     await new Promise((resolve) => setTimeout(resolve, 800));
//     setGenerationProgress(65);

//     setGenerationStage("video");

//     await new Promise((resolve) => setTimeout(resolve, 900));
//     setGenerationProgress(90);

//     const now = new Date().toISOString();

//     const lessonId = buildLessonId(form.subject, form.topic);

//     const lesson: AiVideoLesson = {
//       id: lessonId,
//       title: form.title.trim(),
//       subject: form.subject.trim(),
//       topic: form.topic.trim(),
//       description: form.description.trim(),
//       difficulty: form.difficulty,
//       accessType: form.accessType,
//       status: "READY",
//       durationMinutes: Math.max(
//         1,
//         Math.ceil(totalSceneDuration / 60),
//       ),
//       teacher: selectedAvatar,
//       voice: selectedVoice,
//       teachingStyle: form.teachingStyle,
//       visualStyle: form.visualStyle,
//       objectives: form.objectives
//         .filter((item) => item.trim())
//         .map((text) => ({
//           id: makeId("objective"),
//           text: text.trim(),
//         })),
//       steps: generatedScenes
//         .filter((scene) => scene.title === "Step-by-Step")
//         .map((scene, index) => ({
//           id: makeId("step"),
//           number: index + 1,
//           title: "Step-by-Step Explanation",
//           explanation: scene.narration,
//         })),
//       keyPoints: form.keyPoints
//         .filter((item) => item.trim())
//         .map((text) => ({
//           id: makeId("point"),
//           text: text.trim(),
//         })),
//       summary: form.summary.trim(),
//       jambTips: form.jambTips.trim(),
//       keywords: form.keywords.trim(),
//       generatedScript,
//       scenes: generatedScenes,
//       videoUrl: "mock-ai-video",
//       thumbnailUrl: null,
//       createdAt: now,
//       updatedAt: now,
//       publishedAt: null,
//     };

//     setGeneratedLesson(lesson);
//     setGenerationProgress(100);
//     setGenerationStage("complete");
//     setActiveSection("preview");
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Save                                                                      */
//   /* ------------------------------------------------------------------------ */

//   async function handleSaveDraft() {
//     if (!generatedLesson) return;

//     setIsSaving(true);
//     setSaveMessage("");

//     try {
//       const now = new Date().toISOString();

//       const lessonToSave: AiVideoLesson = {
//         ...generatedLesson,
//         status: "DRAFT",
//         generatedScript: script,
//         scenes,
//         updatedAt: now,
//         publishedAt: null,
//       };

//       saveAiVideoLesson(lessonToSave);

//       setGeneratedLesson(lessonToSave);
//       setExistingLessons(getAiVideoLessons());

//       setSaveMessage("Draft saved successfully.");
//     } catch (error) {
//       console.error("Failed to save AI video lesson:", error);
//       setSaveMessage("Failed to save the lesson.");
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   async function handlePublish() {
//     if (!generatedLesson) return;

//     setIsSaving(true);
//     setSaveMessage("");

//     try {
//       const now = new Date().toISOString();

//       const lessonToPublish: AiVideoLesson = {
//         ...generatedLesson,
//         status: "PUBLISHED",
//         generatedScript: script,
//         scenes,
//         updatedAt: now,
//         publishedAt: now,
//       };

//       saveAiVideoLesson(lessonToPublish);

//       setGeneratedLesson(lessonToPublish);
//       setExistingLessons(getAiVideoLessons());

//       setSaveMessage(
//         "Lesson published successfully. Students can now see it.",
//       );
//     } catch (error) {
//       console.error("Failed to publish AI video lesson:", error);
//       setSaveMessage("Failed to publish the lesson.");
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Scene editing                                                             */
//   /* ------------------------------------------------------------------------ */

//   function updateScene(
//     sceneId: string,
//     updates: Partial<LessonScene>,
//   ) {
//     setScenes((current) =>
//       current.map((scene) =>
//         scene.id === sceneId
//           ? {
//               ...scene,
//               ...updates,
//             }
//           : scene,
//       ),
//     );
//   }

//   function deleteScene(sceneId: string) {
//     setScenes((current) => {
//       const remaining = current.filter((scene) => scene.id !== sceneId);

//       return remaining.map((scene, index) => ({
//         ...scene,
//         number: index + 1,
//       }));
//     });
//   }

//   function addScene() {
//     setScenes((current) => [
//       ...current,
//       {
//         id: makeId("scene"),
//         number: current.length + 1,
//         title: "New Scene",
//         narration: "Enter the narration for this scene.",
//         durationSeconds: 45,
//         visualInstruction:
//           "Describe the visual content that should appear on screen.",
//       },
//     ]);
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Reset                                                                     */
//   /* ------------------------------------------------------------------------ */

//   function resetCreator() {
//     setForm(INITIAL_FORM);
//     setGenerationStage("idle");
//     setGenerationProgress(0);
//     setGeneratedLesson(null);
//     setScript("");
//     setScenes([]);
//     setSaveMessage("");
//     setActiveSection("setup");
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Render                                                                    */
//   /* ------------------------------------------------------------------------ */

//   return (
//     <main className="min-h-screen bg-slate-50 pb-16">
//       {/* Header */}
//       <div className="border-b border-slate-200 bg-white">
//         <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div className="flex items-start gap-3">
//               <Link
//                 href="/admin/secondary/video-lecture"
//                 className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </Link>

//               <div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
//                     <WandSparkles className="h-5 w-5" />
//                   </div>

//                   <h1 className="text-xl font-bold tracking-tight text-slate-950">
//                     AI Video Lecture Creator
//                   </h1>
//                 </div>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Generate structured AI teaching lessons for secondary
//                   students.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="hidden rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 sm:block">
//                 AI Teaching Studio
//               </div>

//               <Button
//                 variant="outline"
//                 onClick={resetCreator}
//                 className="gap-2"
//               >
//                 <RefreshCw className="h-4 w-4" />
//                 New Lesson
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress */}
//       <div className="border-b border-slate-200 bg-white">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
//             {[
//               {
//                 id: "setup",
//                 number: "01",
//                 label: "Lesson Setup",
//                 icon: FileText,
//               },
//               {
//                 id: "script",
//                 number: "02",
//                 label: "AI Script",
//                 icon: Sparkles,
//               },
//               {
//                 id: "teacher",
//                 number: "03",
//                 label: "Teacher & Voice",
//                 icon: Mic2,
//               },
//               {
//                 id: "preview",
//                 number: "04",
//                 label: "Preview & Publish",
//                 icon: Film,
//               },
//             ].map((item) => {
//               const Icon = item.icon;

//               const active = activeSection === item.id;

//               return (
//                 <button
//                   key={item.id}
//                   type="button"
//                   onClick={() =>
//                     setActiveSection(
//                       item.id as
//                         | "setup"
//                         | "script"
//                         | "teacher"
//                         | "preview",
//                     )
//                   }
//                   className={`flex items-center gap-3 px-4 py-4 text-left transition ${
//                     active
//                       ? "bg-indigo-50 text-indigo-700"
//                       : "text-slate-500 hover:bg-slate-50"
//                   }`}
//                 >
//                   <div
//                     className={`flex h-9 w-9 items-center justify-center rounded-xl ${
//                       active
//                         ? "bg-indigo-600 text-white"
//                         : "bg-slate-100 text-slate-500"
//                     }`}
//                   >
//                     <Icon className="h-4 w-4" />
//                   </div>

//                   <div>
//                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
//                       {item.number}
//                     </p>
//                     <p className="text-sm font-semibold">{item.label}</p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* Generation status */}
//         {generationStage !== "idle" && (
//           <Card className="mb-6 overflow-hidden border-indigo-100 bg-white">
//             <div className="p-5">
//               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
//                     {generationStage === "complete" ? (
//                       <CheckCircle2 className="h-5 w-5" />
//                     ) : (
//                       <Loader2 className="h-5 w-5 animate-spin" />
//                     )}
//                   </div>

//                   <div>
//                     <p className="font-semibold text-slate-950">
//                       {generationStage === "script" &&
//                         "AI is writing the teaching script..."}
//                       {generationStage === "visuals" &&
//                         "AI is preparing educational visuals..."}
//                       {generationStage === "video" &&
//                         "AI video production is in progress..."}
//                       {generationStage === "complete" &&
//                         "AI lesson generation complete"}
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       {generationStage === "complete"
//                         ? "Review the generated lesson before publishing."
//                         : "This is a simulated generation workflow for now."}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="min-w-[220px]">
//                   <div className="mb-1 flex justify-between text-xs">
//                     <span className="font-medium text-slate-500">
//                       Generation progress
//                     </span>

//                     <span className="font-bold text-indigo-600">
//                       {generationProgress}%
//                     </span>
//                   </div>

//                   <div className="h-2 overflow-hidden rounded-full bg-slate-100">
//                     <div
//                       className="h-full rounded-full bg-indigo-600 transition-all duration-500"
//                       style={{
//                         width: `${generationProgress}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* Save message */}
//         {saveMessage && (
//           <div
//             className={`mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
//               saveMessage.includes("successfully")
//                 ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//                 : "border-amber-200 bg-amber-50 text-amber-700"
//             }`}
//           >
//             {saveMessage.includes("successfully") ? (
//               <CheckCircle2 className="h-5 w-5 shrink-0" />
//             ) : (
//               <Target className="h-5 w-5 shrink-0" />
//             )}

//             <span>{saveMessage}</span>
//           </div>
//         )}

//         <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
//           {/* Main */}
//           <div className="space-y-6">
//             {/* Lesson Setup */}
//             <Card className="overflow-hidden border-slate-200 bg-white">
//               <div className="border-b border-slate-200 p-6">
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                         <GraduationCap className="h-5 w-5" />
//                       </div>

//                       <div>
//                         <h2 className="font-bold text-slate-950">
//                           Lesson Setup
//                         </h2>

//                         <p className="text-xs text-slate-500">
//                           Define what the AI teacher should teach.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
//                     Step 1
//                   </span>
//                 </div>
//               </div>

//               <div className="space-y-6 p-6">
//                 <div className="grid gap-5 md:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-700">
//                       Subject
//                     </label>

//                     <select
//                       value={form.subject}
//                       onChange={(event) =>
//                         updateForm("subject", event.target.value)
//                       }
//                       className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     >
//                       {SUBJECTS.map((subject) => (
//                         <option key={subject} value={subject}>
//                           {subject}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-700">
//                       Topic
//                     </label>

//                     <input
//                       value={form.topic}
//                       onChange={(event) =>
//                         updateForm("topic", event.target.value)
//                       }
//                       placeholder="e.g. Cell Structure"
//                       className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-700">
//                     Lesson title
//                   </label>

//                   <input
//                     value={form.title}
//                     onChange={(event) =>
//                       updateForm("title", event.target.value)
//                     }
//                     placeholder="Enter a lesson title"
//                     className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-700">
//                     Description
//                   </label>

//                   <textarea
//                     value={form.description}
//                     onChange={(event) =>
//                       updateForm("description", event.target.value)
//                     }
//                     rows={4}
//                     className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   />
//                 </div>

//                 <div className="grid gap-5 md:grid-cols-3">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-700">
//                       Difficulty
//                     </label>

//                     <select
//                       value={form.difficulty}
//                       onChange={(event) =>
//                         updateForm(
//                           "difficulty",
//                           event.target.value as Difficulty,
//                         )
//                       }
//                       className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     >
//                       <option value="BEGINNER">Beginner</option>
//                       <option value="INTERMEDIATE">
//                         Intermediate
//                       </option>
//                       <option value="ADVANCED">Advanced</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-700">
//                       Access
//                     </label>

//                     <select
//                       value={form.accessType}
//                       onChange={(event) =>
//                         updateForm(
//                           "accessType",
//                           event.target.value as AccessType,
//                         )
//                       }
//                       className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     >
//                       <option value="FREE">Free</option>
//                       <option value="PREMIUM">Premium</option>
//                       <option value="PLAN_REQUIRED">
//                         Plan Required
//                       </option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-700">
//                       Target duration
//                     </label>

//                     <div className="relative">
//                       <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                       <input
//                         type="number"
//                         min={1}
//                         max={60}
//                         value={form.durationMinutes}
//                         onChange={(event) =>
//                           updateForm(
//                             "durationMinutes",
//                             Number(event.target.value),
//                           )
//                         }
//                         className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Objectives */}
//                 <div>
//                   <div className="mb-3 flex items-center justify-between">
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-700">
//                         Learning objectives
//                       </label>

//                       <p className="mt-1 text-xs text-slate-500">
//                         Tell the AI what students should know by the end.
//                       </p>
//                     </div>

//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={addObjective}
//                       className="gap-2"
//                     >
//                       <Plus className="h-4 w-4" />
//                       Add
//                     </Button>
//                   </div>

//                   <div className="space-y-2">
//                     {form.objectives.map((objective, index) => (
//                       <div
//                         key={`objective-${index}`}
//                         className="flex gap-2"
//                       >
//                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
//                           {index + 1}
//                         </div>

//                         <input
//                           value={objective}
//                           onChange={(event) =>
//                             updateObjective(index, event.target.value)
//                           }
//                           placeholder="Students should be able to..."
//                           className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                         />

//                         {form.objectives.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeObjective(index)}
//                             className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Advanced */}
//                 <div className="overflow-hidden rounded-2xl border border-slate-200">
//                   <button
//                     type="button"
//                     onClick={() => setShowAdvanced((value) => !value)}
//                     className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left"
//                   >
//                     <div>
//                       <p className="text-sm font-semibold text-slate-800">
//                         Advanced lesson content
//                       </p>

//                       <p className="text-xs text-slate-500">
//                         Key points, summary, JAMB tips and keywords
//                       </p>
//                     </div>

//                     {showAdvanced ? (
//                       <ChevronUp className="h-4 w-4 text-slate-500" />
//                     ) : (
//                       <ChevronDown className="h-4 w-4 text-slate-500" />
//                     )}
//                   </button>

//                   {showAdvanced && (
//                     <div className="space-y-5 p-5">
//                       <div>
//                         <div className="mb-3 flex items-center justify-between">
//                           <label className="text-sm font-semibold text-slate-700">
//                             Key points
//                           </label>

//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={addKeyPoint}
//                             className="gap-2"
//                           >
//                             <Plus className="h-4 w-4" />
//                             Add
//                           </Button>
//                         </div>

//                         <div className="space-y-2">
//                           {form.keyPoints.map((point, index) => (
//                             <div
//                               key={`point-${index}`}
//                               className="flex gap-2"
//                             >
//                               <input
//                                 value={point}
//                                 onChange={(event) =>
//                                   updateKeyPoint(
//                                     index,
//                                     event.target.value,
//                                   )
//                                 }
//                                 placeholder="Important concept students should remember"
//                                 className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                               />

//                               <button
//                                 type="button"
//                                 onClick={() => removeKeyPoint(index)}
//                                 className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <label className="mb-2 block text-sm font-semibold text-slate-700">
//                           Lesson summary
//                         </label>

//                         <textarea
//                           value={form.summary}
//                           onChange={(event) =>
//                             updateForm("summary", event.target.value)
//                           }
//                           rows={4}
//                           className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                         />
//                       </div>

//                       <div>
//                         <label className="mb-2 block text-sm font-semibold text-slate-700">
//                           JAMB tips
//                         </label>

//                         <textarea
//                           value={form.jambTips}
//                           onChange={(event) =>
//                             updateForm("jambTips", event.target.value)
//                           }
//                           rows={4}
//                           className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                         />
//                       </div>

//                       <div>
//                         <label className="mb-2 block text-sm font-semibold text-slate-700">
//                           Keywords
//                         </label>

//                         <input
//                           value={form.keywords}
//                           onChange={(event) =>
//                             updateForm("keywords", event.target.value)
//                           }
//                           placeholder="cell, nucleus, organelles..."
//                           className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-end border-t border-slate-100 pt-5">
//                   <Button
//                     type="button"
//                     onClick={handleGenerate}
//                     disabled={!canGenerate || generationStage !== "idle"}
//                     className="gap-2 bg-indigo-600 px-6 hover:bg-indigo-700"
//                   >
//                     {generationStage !== "idle" ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Generating...
//                       </>
//                     ) : (
//                       <>
//                         <Sparkles className="h-4 w-4" />
//                         Generate AI Lesson
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </Card>

//             {/* Script */}
//             {generatedLesson && (
//               <Card className="overflow-hidden border-slate-200 bg-white">
//                 <div className="border-b border-slate-200 p-6">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex items-start gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
//                         <FileText className="h-5 w-5" />
//                       </div>

//                       <div>
//                         <h2 className="font-bold text-slate-950">
//                           AI Teaching Script
//                         </h2>

//                         <p className="text-xs text-slate-500">
//                           Review and edit what the AI teacher will say.
//                         </p>
//                       </div>
//                     </div>

//                     <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                       Generated
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <textarea
//                     value={script}
//                     onChange={(event) => setScript(event.target.value)}
//                     rows={20}
//                     className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-5 font-mono text-sm leading-7 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   />

//                   <div className="mt-4 flex items-center justify-between">
//                     <p className="text-xs text-slate-400">
//                       {script.length.toLocaleString()} characters
//                     </p>

//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setActiveSection("teacher")}
//                       className="gap-2"
//                     >
//                       Continue
//                       <ArrowRight className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {/* Scenes */}
//             {generatedLesson && scenes.length > 0 && (
//               <Card className="overflow-hidden border-slate-200 bg-white">
//                 <div className="border-b border-slate-200 p-6">
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="flex items-start gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
//                         <Clapperboard className="h-5 w-5" />
//                       </div>

//                       <div>
//                         <h2 className="font-bold text-slate-950">
//                           Video Scenes
//                         </h2>

//                         <p className="text-xs text-slate-500">
//                           These scenes will become the structure of the
//                           generated video.
//                         </p>
//                       </div>
//                     </div>

//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={addScene}
//                       className="gap-2"
//                     >
//                       <Plus className="h-4 w-4" />
//                       Add Scene
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="divide-y divide-slate-100">
//                   {scenes.map((scene, index) => {
//                     const editing = editingSceneId === scene.id;

//                     return (
//                       <div
//                         key={scene.id}
//                         className="p-5 transition hover:bg-slate-50/70"
//                       >
//                         <div className="flex gap-4">
//                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
//                             {index + 1}
//                           </div>

//                           <div className="min-w-0 flex-1">
//                             <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
//                               <div>
//                                 <p className="font-semibold text-slate-900">
//                                   {scene.title}
//                                 </p>

//                                 <p className="mt-1 text-xs text-slate-400">
//                                   {scene.durationSeconds} seconds
//                                 </p>
//                               </div>

//                               <div className="flex items-center gap-2">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     setEditingSceneId(
//                                       editing ? null : scene.id,
//                                     )
//                                   }
//                                   className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-white"
//                                 >
//                                   <Pencil className="h-3.5 w-3.5" />
//                                   {editing ? "Close" : "Edit"}
//                                 </button>

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     deleteScene(scene.id)
//                                   }
//                                   className="flex h-8 items-center justify-center rounded-lg border border-slate-200 px-2.5 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
//                                 >
//                                   <Trash2 className="h-3.5 w-3.5" />
//                                 </button>
//                               </div>
//                             </div>

//                             {editing ? (
//                               <div className="mt-4 space-y-4">
//                                 <div className="grid gap-4 md:grid-cols-[1fr_140px]">
//                                   <input
//                                     value={scene.title}
//                                     onChange={(event) =>
//                                       updateScene(scene.id, {
//                                         title:
//                                           event.target.value,
//                                       })
//                                     }
//                                     className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                                   />

//                                   <input
//                                     type="number"
//                                     min={5}
//                                     value={
//                                       scene.durationSeconds
//                                     }
//                                     onChange={(event) =>
//                                       updateScene(scene.id, {
//                                         durationSeconds:
//                                           Number(
//                                             event.target.value,
//                                           ),
//                                       })
//                                     }
//                                     className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                                   />
//                                 </div>

//                                 <textarea
//                                   value={scene.narration}
//                                   onChange={(event) =>
//                                     updateScene(scene.id, {
//                                       narration:
//                                         event.target.value,
//                                     })
//                                   }
//                                   rows={5}
//                                   placeholder="Narration"
//                                   className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                                 />

//                                 <textarea
//                                   value={scene.visualInstruction}
//                                   onChange={(event) =>
//                                     updateScene(scene.id, {
//                                       visualInstruction:
//                                         event.target.value,
//                                     })
//                                   }
//                                   rows={3}
//                                   placeholder="Visual instruction"
//                                   className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                                 />
//                               </div>
//                             ) : (
//                               <div className="mt-3 space-y-2">
//                                 <p className="text-sm leading-6 text-slate-600">
//                                   {scene.narration}
//                                 </p>

//                                 <div className="rounded-xl bg-slate-50 p-3">
//                                   <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
//                                     <ImageIcon className="h-3.5 w-3.5" />
//                                     Visual
//                                   </div>

//                                   <p className="mt-1 text-xs leading-5 text-slate-500">
//                                     {scene.visualInstruction}
//                                   </p>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </Card>
//             )}

//             {/* Teacher & Voice */}
//             {generatedLesson && (
//               <Card className="overflow-hidden border-slate-200 bg-white">
//                 <div className="border-b border-slate-200 p-6">
//                   <div className="flex items-start gap-3">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
//                       <UserRound className="h-5 w-5" />
//                     </div>

//                     <div>
//                       <h2 className="font-bold text-slate-950">
//                         AI Teacher & Voice
//                       </h2>

//                       <p className="text-xs text-slate-500">
//                         Choose how the lesson should be presented.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-7 p-6">
//                   {/* Avatar */}
//                   <div>
//                     <label className="mb-3 block text-sm font-semibold text-slate-700">
//                       AI Teacher
//                     </label>

//                     <div className="grid gap-3 sm:grid-cols-2">
//                       {AVATARS.map((avatar) => {
//                         const selected =
//                           form.avatarId === avatar.avatarId;

//                         return (
//                           <button
//                             key={avatar.avatarId}
//                             type="button"
//                             onClick={() =>
//                               updateForm(
//                                 "avatarId",
//                                 avatar.avatarId,
//                               )
//                             }
//                             className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
//                               selected
//                                 ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
//                                 : "border-slate-200 hover:border-slate-300"
//                             }`}
//                           >
//                             <img
//                               src={avatar.avatarUrl}
//                               alt={avatar.name}
//                               className="h-14 w-14 rounded-full border border-slate-200 bg-white"
//                             />

//                             <div className="min-w-0 flex-1">
//                               <p className="font-semibold text-slate-900">
//                                 {avatar.name}
//                               </p>

//                               <p className="mt-1 text-xs text-slate-500">
//                                 {avatar.description}
//                               </p>
//                             </div>

//                             {selected && (
//                               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
//                                 <Check className="h-3.5 w-3.5" />
//                               </div>
//                             )}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* Voice */}
//                   <div>
//                     <label className="mb-3 block text-sm font-semibold text-slate-700">
//                       Voice
//                     </label>

//                     <div className="grid gap-3 md:grid-cols-2">
//                       {VOICES.map((voice) => {
//                         const selected = form.voiceId === voice.id;

//                         return (
//                           <button
//                             key={voice.id}
//                             type="button"
//                             onClick={() =>
//                               updateForm("voiceId", voice.id)
//                             }
//                             className={`rounded-2xl border p-4 text-left transition ${
//                               selected
//                                 ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
//                                 : "border-slate-200 hover:border-slate-300"
//                             }`}
//                           >
//                             <div className="flex items-start justify-between gap-3">
//                               <div className="flex items-center gap-3">
//                                 <div
//                                   className={`flex h-10 w-10 items-center justify-center rounded-xl ${
//                                     selected
//                                       ? "bg-indigo-600 text-white"
//                                       : "bg-slate-100 text-slate-500"
//                                   }`}
//                                 >
//                                   <Mic2 className="h-4 w-4" />
//                                 </div>

//                                 <div>
//                                   <p className="font-semibold text-slate-900">
//                                     {voice.name}
//                                   </p>

//                                   <p className="mt-1 text-xs text-slate-500">
//                                     {voice.description}
//                                   </p>
//                                 </div>
//                               </div>

//                               {selected && (
//                                 <CheckCircle2 className="h-5 w-5 text-indigo-600" />
//                               )}
//                             </div>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* Teaching style */}
//                   <div>
//                     <label className="mb-3 block text-sm font-semibold text-slate-700">
//                       Teaching style
//                     </label>

//                     <div className="grid gap-3 sm:grid-cols-2">
//                       {TEACHING_STYLES.map((style) => {
//                         const selected =
//                           form.teachingStyle === style.id;

//                         return (
//                           <button
//                             key={style.id}
//                             type="button"
//                             onClick={() =>
//                               updateForm(
//                                 "teachingStyle",
//                                 style.id,
//                               )
//                             }
//                             className={`rounded-2xl border p-4 text-left transition ${
//                               selected
//                                 ? "border-indigo-500 bg-indigo-50"
//                                 : "border-slate-200 hover:border-slate-300"
//                             }`}
//                           >
//                             <p className="font-semibold text-slate-900">
//                               {style.name}
//                             </p>

//                             <p className="mt-1 text-xs text-slate-500">
//                               {style.description}
//                             </p>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* Visual style */}
//                   <div>
//                     <label className="mb-3 block text-sm font-semibold text-slate-700">
//                       Visual style
//                     </label>

//                     <div className="grid gap-3 sm:grid-cols-2">
//                       {VISUAL_STYLES.map((style) => {
//                         const selected =
//                           form.visualStyle === style.id;

//                         return (
//                           <button
//                             key={style.id}
//                             type="button"
//                             onClick={() =>
//                               updateForm(
//                                 "visualStyle",
//                                 style.id,
//                               )
//                             }
//                             className={`rounded-2xl border p-4 text-left transition ${
//                               selected
//                                 ? "border-indigo-500 bg-indigo-50"
//                                 : "border-slate-200 hover:border-slate-300"
//                             }`}
//                           >
//                             <div className="flex items-center gap-2">
//                               <ImageIcon className="h-4 w-4 text-indigo-500" />

//                               <p className="font-semibold text-slate-900">
//                                 {style.name}
//                               </p>
//                             </div>

//                             <p className="mt-1 text-xs text-slate-500">
//                               {style.description}
//                             </p>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {/* Preview */}
//             {generatedLesson && (
//               <Card className="overflow-hidden border-slate-200 bg-white">
//                 <div className="border-b border-slate-200 p-6">
//                   <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                     <div className="flex items-start gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
//                         <Play className="h-5 w-5" />
//                       </div>

//                       <div>
//                         <h2 className="font-bold text-slate-950">
//                           Generated Video Preview
//                         </h2>

//                         <p className="text-xs text-slate-500">
//                           Preview the AI-generated lesson before publishing.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
//                         {scenes.length} scenes
//                       </span>

//                       <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
//                         {Math.ceil(totalSceneDuration / 60)} min
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <MockGeneratedPlayer
//                     lesson={{
//                       ...generatedLesson,
//                       generatedScript: script,
//                       scenes,
//                     }}
//                     scenes={scenes}
//                   />
//                 </div>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar */}
//           <aside className="space-y-5">
//             {/* Current configuration */}
//             <Card className="border-slate-200 bg-white">
//               <div className="border-b border-slate-200 p-5">
//                 <h3 className="font-bold text-slate-950">
//                   Lesson Configuration
//                 </h3>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Current AI generation settings
//                 </p>
//               </div>

//               <div className="space-y-4 p-5">
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Subject
//                   </p>

//                   <p className="mt-1 text-sm font-semibold text-slate-800">
//                     {form.subject}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Topic
//                   </p>

//                   <p className="mt-1 text-sm font-semibold text-slate-800">
//                     {form.topic || "Not specified"}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="rounded-xl bg-slate-50 p-3">
//                     <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                       Difficulty
//                     </p>

//                     <p className="mt-1 text-xs font-semibold text-slate-700">
//                       {formatDifficulty(form.difficulty)}
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-slate-50 p-3">
//                     <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                       Access
//                     </p>

//                     <p className="mt-1 text-xs font-semibold text-slate-700">
//                       {formatAccess(form.accessType)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
//                   <div className="flex items-center gap-2">
//                     <UserRound className="h-4 w-4 text-indigo-600" />

//                     <p className="text-xs font-bold text-indigo-900">
//                       {selectedAvatar.name}
//                     </p>
//                   </div>

//                   <p className="mt-1 text-xs text-indigo-700/70">
//                     {selectedVoice.name}
//                   </p>
//                 </div>

//                 <div className="rounded-xl border border-slate-200 p-3">
//                   <div className="flex items-center gap-2">
//                     <Sparkles className="h-4 w-4 text-violet-500" />

//                     <p className="text-xs font-bold text-slate-700">
//                       {formatTeachingStyle(form.teachingStyle)}
//                     </p>
//                   </div>

//                   <p className="mt-1 text-xs text-slate-500">
//                     {formatVisualStyle(form.visualStyle)} visual treatment
//                   </p>
//                 </div>
//               </div>
//             </Card>

//             {/* Generation result */}
//             {generatedLesson && (
//               <Card className="border-emerald-200 bg-white">
//                 <div className="border-b border-emerald-100 p-5">
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="h-5 w-5 text-emerald-600" />

//                     <h3 className="font-bold text-slate-950">
//                       Lesson Ready
//                     </h3>
//                   </div>

//                   <p className="mt-1 text-xs text-slate-500">
//                     Review everything before publishing.
//                   </p>
//                 </div>

//                 <div className="space-y-3 p-5">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-slate-500">Scenes</span>
//                     <span className="font-semibold text-slate-800">
//                       {scenes.length}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-slate-500">Duration</span>
//                     <span className="font-semibold text-slate-800">
//                       {Math.ceil(totalSceneDuration / 60)} min
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-slate-500">Status</span>
//                     <span
//                       className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//                         generatedLesson.status === "PUBLISHED"
//                           ? "bg-emerald-50 text-emerald-700"
//                           : "bg-amber-50 text-amber-700"
//                       }`}
//                     >
//                       {generatedLesson.status}
//                     </span>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {/* Actions */}
//             {generatedLesson && (
//               <Card className="border-slate-200 bg-white">
//                 <div className="p-5">
//                   <div className="mb-4">
//                     <h3 className="font-bold text-slate-950">
//                       Publishing
//                     </h3>

//                     <p className="mt-1 text-xs leading-5 text-slate-500">
//                       Save a draft while reviewing, or publish the lesson
//                       for students.
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       disabled={isSaving}
//                       onClick={handleSaveDraft}
//                       className="w-full justify-center gap-2"
//                     >
//                       {isSaving ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <Save className="h-4 w-4" />
//                       )}
//                       Save Draft
//                     </Button>

//                     <Button
//                       type="button"
//                       disabled={isSaving}
//                       onClick={handlePublish}
//                       className="w-full justify-center gap-2 bg-indigo-600 hover:bg-indigo-700"
//                     >
//                       {isSaving ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : (
//                         <CheckCircle2 className="h-4 w-4" />
//                       )}
//                       Publish Lesson
//                     </Button>
//                   </div>

//                   {generatedLesson.status === "PUBLISHED" && (
//                     <Link
//                       href={`/student/question-ai-videos/${generatedLesson.id}`}
//                       className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
//                     >
//                       <Eye className="h-4 w-4" />
//                       View Student Lesson
//                     </Link>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* Storage info */}
//             <Card className="border-slate-200 bg-slate-950 text-white">
//               <div className="p-5">
//                 <div className="flex items-center gap-2">
//                   <Bot className="h-5 w-5 text-indigo-300" />

//                   <h3 className="font-bold">
//                     Current Demo Mode
//                   </h3>
//                 </div>

//                 <p className="mt-3 text-xs leading-6 text-slate-400">
//                   Lessons are currently stored in browser localStorage.
//                   The AI generation, avatar, visual and video stages are
//                   simulated until the backend AI video service is connected.
//                 </p>

//                 <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Storage
//                   </p>

//                   <p className="mt-1 break-all text-xs text-slate-300">
//                     jamb-league-ai-video-lessons
//                   </p>
//                 </div>

//                 <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Existing lessons
//                   </p>

//                   <p className="mt-1 text-sm font-bold text-white">
//                     {existingLessons.length}
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           </aside>
//         </div>
//       </div>
//     </main>
//   );
// }




























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
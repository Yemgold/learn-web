


"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { toCanvas } from "html-to-image";
import {
  Camera,
  CameraOff,
  CircleStop,
  Download,
  FileImage,
  FileText,
  Mic,
  Pause,
  Play,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Pen,
  Eraser,
  Upload,
  Radio,
  Timer,
  Bold,
  Italic,
  Underline,
  List,
  Palette,
  Type,
  X,
} from "lucide-react";

type Stroke = {
  color: string;
  size: number;
  points: { x: number; y: number }[];
};

type LectureSlide = {
  id: string;
  title: string;
  html: string;
  strokes: Stroke[];
};

const createSlide = (title = "New lecture slide"): LectureSlide => ({
  id: crypto.randomUUID(),
  title,
  html: `<h1 style="color:#172554;font-size:34px"> ${title} </h1><p>Start typing your lecture here...</p>`,
  strokes: [],
});

const COLORS = [
  "#172554",
  "#dc2626",
  "#16a34a",
  "#2563eb",
  "#9333ea",
  "#ea580c",
  "#111827",
];

export default function LectureRecordingStudio() {
  const [slides, setSlides] = useState<LectureSlide[]>([
    {
      id: "welcome",
      title: "Introduction",
      html: `<h1 style="font-size:38px;color:#172554">Welcome to Learnyfi</h1><p style="font-size:25px">Your interactive teaching studio.</p><p>Paste your lecture notes, add pictures, draw diagrams and start teaching.</p>`,
      strokes: [],
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lectureTitle, setLectureTitle] = useState("My Learnyfi Lecture");
  const [cameraReady, setCameraReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const [penEnabled, setPenEnabled] = useState(false);
  const [eraserEnabled, setEraserEnabled] = useState(false);
  const [penColor, setPenColor] = useState("#dc2626");
  const [penSize, setPenSize] = useState(4);

  const [autoAdvance, setAutoAdvance] = useState(false);
  const [slideSeconds, setSlideSeconds] = useState(30);

  const boardRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const cameraStreamRef = useRef<MediaStream | null>(null);
  const outputStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const boardSnapshotRef = useRef<HTMLCanvasElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const recordingRef = useRef(false);
  const strokesRef = useRef<Stroke[]>([]);
  const [snapshotVersion, setSnapshotVersion] = useState(0);

  const slidesRef = useRef(slides);
const activeIndexRef = useRef(activeIndex);

slidesRef.current = slides;
activeIndexRef.current = activeIndex;

  const activeSlide = slides[activeIndex];

  const updateSlide = useCallback(
    (updates: Partial<LectureSlide>) => {
      setSlides((previous) =>
        previous.map((slide, index) =>
          index === activeIndex ? { ...slide, ...updates } : slide
        )
      );
      setSnapshotVersion((value) => value + 1);
    },
    [activeIndex]
  );

  const saveEditorContent = () => {
    if (!boardRef.current) return;

    const editor = boardRef.current.querySelector(".lecture-editor-content");
    if (!editor) return;

    updateSlide({
      html: editor.innerHTML,
    });
  };

  // Keep the editor content synchronized when navigating slides.
  useEffect(() => {
    if (boardRef.current && activeSlide) {
      const editor = boardRef.current.querySelector(".lecture-editor-content");
      if (editor) editor.innerHTML = activeSlide.html;
    }
    strokesRef.current = activeSlide?.strokes ?? [];
    redrawDrawingCanvas();
    setSnapshotVersion((value) => value + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide?.id]);

  const redrawDrawingCanvas = useCallback(() => {
    const canvas = drawingCanvasRef.current;
    const board = boardRef.current;
    if (!canvas || !board) return;

    const rect = board.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const stroke of strokesRef.current) {
      if (stroke.points.length < 1) continue;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;

      stroke.points.forEach((point, index) => {
        const x = point.x * rect.width;
        const y = point.y * rect.height;

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      if (stroke.points.length === 1) {
        const point = stroke.points[0];
        ctx.arc(
          point.x * rect.width,
          point.y * rect.height,
          stroke.size / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = stroke.color;
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  }, []);

  useEffect(() => {
    redrawDrawingCanvas();

    const observer = new ResizeObserver(redrawDrawingCanvas);
    if (boardRef.current) observer.observe(boardRef.current);

    return () => observer.disconnect();
  }, [redrawDrawingCanvas, activeIndex]);

  // Convert the rich lecture board into a recording-ready image.
  useEffect(() => {
    let cancelled = false;

    const refreshSnapshot = async () => {
      if (!boardRef.current) return;

      try {
        const snapshot = await toCanvas(boardRef.current, {
          width: 1280,
          height: 720,
          pixelRatio: 1,
          backgroundColor: "#ffffff",
          cacheBust: true,
        });

        if (!cancelled) {
          boardSnapshotRef.current = snapshot;
        }
      } catch (err) {
        console.error("Lecture board snapshot failed:", err);
      }
    };

    const timeout = setTimeout(refreshSnapshot, 200);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [activeIndex, snapshotVersion, slides]);

  const addSlide = () => {
    const slide = createSlide(`Lecture slide ${slides.length + 1}`);
    setSlides((previous) => [...previous, slide]);
    setActiveIndex(slides.length);
  };

  const duplicateSlide = () => {
    const copy = {
      ...activeSlide,
      id: crypto.randomUUID(),
      title: `${activeSlide.title} (Copy)`,
      strokes: [...activeSlide.strokes],
    };

    setSlides((previous) => [
      ...previous.slice(0, activeIndex + 1),
      copy,
      ...previous.slice(activeIndex + 1),
    ]);
    setActiveIndex(activeIndex + 1);
  };

  const deleteSlide = () => {
    if (slides.length <= 1) {
      setError("Your lecture must have at least one slide.");
      return;
    }

    setSlides((previous) =>
      previous.filter((_, index) => index !== activeIndex)
    );
    setActiveIndex(Math.max(0, activeIndex - 1));
  };

  const moveSlide = (direction: number) => {
    const next = activeIndex + direction;
    if (next >= 0 && next < slides.length) {
      saveEditorContent();
      setActiveIndex(next);
    }
  };

  const formatText = (command: string, value?: string) => {
    const editor = boardRef.current?.querySelector(".lecture-editor-content") as HTMLDivElement | null;
    editor?.focus();
    document.execCommand(command, false, value);
    saveEditorContent();
  };

  const insertImage = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    boardRef.current?.focus();

    document.execCommand(
      "insertHTML",
      false,
      `<img src="${dataUrl}" alt="Lecture illustration" style="max-width:85%;height:auto;display:block;margin:20px auto;border-radius:10px" />`
    );

    saveEditorContent();
  };


  const importPdf = async (file?: File) => {
  if (!file || file.type !== "application/pdf") {
    setError("Please select a valid PDF document.");
    return;
  }

  setError("");

  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
    }).promise;

    const imported: LectureSlide[] = [];

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page = await pdf.getPage(pageNumber);

      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) continue;

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise;

      const image = canvas.toDataURL("image/png");

      imported.push({
        id: crypto.randomUUID(),
        title: `PDF page ${pageNumber}`,
        html: `
          <div style="
            width:100%;
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <img
              src="${image}"
              alt="PDF page ${pageNumber}"
              style="
                max-width:100%;
                max-height:100%;
                object-fit:contain;
              "
            />
          </div>
        `,
        strokes: [],
      });
    }

    if (imported.length > 0) {
      setSlides(imported);
      setActiveIndex(0);
      setError("");
    }
  } catch (err) {
    console.error("PDF import error:", err);

    setError(
      "Could not import this PDF. Please try another document."
    );
  }
};

  const startCamera = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      cameraStreamRef.current = stream;

      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        await cameraVideoRef.current.play();
      }

      setCameraReady(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not access camera."
      );
    }
  };

  const stopCamera = () => {
    if (recording) return;

    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;

    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }

    setCameraReady(false);
  };

  const drawRecordingFrame = useCallback(() => {
    const canvas = outputCanvasRef.current;
    const camera = cameraVideoRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1280, 720);

    const board = boardSnapshotRef.current;

    if (board) {
      ctx.drawImage(board, 0, 0, 1280, 720);
    }

    // Include all annotations in the recorded frame.
    const slide = slidesRef.current[activeIndexRef.current];

    if (slide) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const stroke of slide.strokes) {
        if (!stroke.points.length) continue;

        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size * 1.5;

        stroke.points.forEach((point, index) => {
          const x = point.x * 1280;
          const y = point.y * 720;

          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        ctx.stroke();
      }
    }

    // Presenter camera in picture-in-picture.
    if (camera && camera.readyState >= 2) {
      const x = 925;
      const y = 475;
      const width = 310;
      const height = 205;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(x - 5, y - 5, width + 10, height + 10);

      const scale = Math.min(
        width / camera.videoWidth,
        height / camera.videoHeight
      );

      const drawWidth = camera.videoWidth * scale;
      const drawHeight = camera.videoHeight * scale;

      ctx.drawImage(
        camera,
        x + (width - drawWidth) / 2,
        y + (height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
    }

    animationRef.current = requestAnimationFrame(drawRecordingFrame);
  }, []);

  const startRecording = async () => {
    try {
      setError("");

      if (!cameraReady || !cameraStreamRef.current) {
        setError("Enable your camera before recording.");
        return;
      }

      if (!cameraStreamRef.current.getAudioTracks().length) {
        setError("No microphone was detected.");
        return;
      }

      if (!boardSnapshotRef.current) {
        setError("Please wait for the lecture board to prepare.");
        return;
      }

      const canvas = outputCanvasRef.current;
      if (!canvas) return;

      const canvasStream = canvas.captureStream(30);

      cameraStreamRef.current.getAudioTracks().forEach((track) => {
        canvasStream.addTrack(track);
      });

      const mimeType = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ].find((type) => MediaRecorder.isTypeSupported(type));

      const recorder = new MediaRecorder(
        canvasStream,
        mimeType ? { mimeType } : undefined
      );

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "video/webm",
        });

        if (blob.size) {
          const url = URL.createObjectURL(blob);

          setVideoUrl((previous) => {
            if (previous) URL.revokeObjectURL(previous);
            return url;
          });
        }

        canvasStream.getTracks().forEach((track) => track.stop());
        outputStreamRef.current = null;
      };

      outputStreamRef.current = canvasStream;
      recorderRef.current = recorder;

      drawRecordingFrame();
      recorder.start(1000);

      recordingRef.current = true;
      pausedRef.current = false;

      setRecording(true);
      setPaused(false);
      setElapsed(0);

      timerRef.current = setInterval(() => {
        if (!pausedRef.current) {
          setElapsed((previous) => previous + 1);
        }
      }, 1000);

      if (autoAdvance && slides.length > 1) {
        advanceRef.current = setInterval(() => {
          if (!pausedRef.current) {
            setActiveIndex((previous) => (previous + 1) % slides.length);
          }
        }, Math.max(5, slideSeconds) * 1000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Recording could not start."
      );
    }
  };

  const pauseRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.pause();
      pausedRef.current = true;
      setPaused(true);
    }
  };

  const resumeRecording = () => {
    if (recorderRef.current?.state === "paused") {
      recorderRef.current.resume();
      pausedRef.current = false;
      setPaused(false);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state !== "inactive") {
      recorderRef.current?.stop();
    }

    recordingRef.current = false;

    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    if (advanceRef.current) clearInterval(advanceRef.current);

    timerRef.current = null;
    advanceRef.current = null;

    setRecording(false);
    setPaused(false);
    pausedRef.current = false;
  };

  // Drawing tools
  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    };
  };

  const beginDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!penEnabled) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    currentStrokeRef.current = {
      color: eraserEnabled ? "#ffffff" : penColor,
      size: eraserEnabled ? penSize * 5 : penSize,
      points: [getPoint(event)],
    };

    redrawCurrentStroke();
  };

  const continueDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStrokeRef.current) return;

    currentStrokeRef.current.points.push(getPoint(event));
    redrawCurrentStroke();
  };

  const finishDrawing = () => {
    const stroke = currentStrokeRef.current;
    if (!stroke) return;

    const next = [...strokesRef.current, stroke];

    strokesRef.current = next;
    currentStrokeRef.current = null;

    updateSlide({ strokes: next });
    redrawDrawingCanvas();
  };

  const redrawCurrentStroke = () => {
    redrawDrawingCanvas();

    const canvas = drawingCanvasRef.current;
    const board = boardRef.current;
    const stroke = currentStrokeRef.current;

    if (!canvas || !board || !stroke) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = board.getBoundingClientRect();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;

    ctx.beginPath();

    stroke.points.forEach((point, index) => {
      const x = point.x * rect.width;
      const y = point.y * rect.height;

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  };

  const clearDrawing = () => {
    strokesRef.current = [];
    updateSlide({ strokes: [] });
    redrawDrawingCanvas();
  };

  const downloadRecording = () => {
    if (!videoUrl) return;

    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${lectureTitle.replace(/[^a-z0-9-_]/gi, "-")}.webm`;
    link.click();
  };

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      if (timerRef.current) clearInterval(timerRef.current);
      if (advanceRef.current) clearInterval(advanceRef.current);

      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      outputStreamRef.current?.getTracks().forEach((track) => track.stop());

      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  return (
    <section className="w-full space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5 lg:p-6">
      {/* Studio heading */}
      <header className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
            <Radio size={25} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Learnyfi creator workspace</p>
            <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">Interactive Teaching Studio</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-300">
              Prepare your lesson, present your slides, annotate and record your class.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200">
            {slides.length} {slides.length === 1 ? "slide" : "slides"}
          </span>
          {recording ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-2 text-xs font-bold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              {paused ? "PAUSED" : "RECORDING"} · {formatTime(elapsed)}
            </span>
          ) : (
            <span className="rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-bold text-emerald-300">
              STUDIO READY
            </span>
          )}
        </div>
      </header>

      {/* Lecture details */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block min-w-0">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Lecture title</span>
          <input
            value={lectureTitle}
            onChange={(event) => setLectureTitle(event.target.value)}
            disabled={recording}
            placeholder="Enter your lecture title"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
        <div className="text-xs text-slate-500 sm:pb-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Presentation format</span>
          <span className="mt-1 block">16:9 widescreen · 1280 × 720 recording</span>
        </div>
      </div>

      {/* Workspace */}
      <div className="grid min-w-0 gap-5 2xl:grid-cols-[220px_minmax(0,1fr)_285px]">
        {/* Slide manager */}
        <aside className="order-2 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 2xl:order-1">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Your slides</h3>
              <p className="mt-1 text-xs text-slate-500">Organise your lesson</p>
            </div>
            <button
              type="button"
              onClick={addSlide}
              disabled={recording}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-40"
              title="Add slide"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="grid max-h-[620px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 2xl:grid-cols-1">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                disabled={recording}
                onClick={() => {
                  saveEditorContent();
                  setActiveIndex(index);
                }}
                className={`group min-w-0 rounded-xl border p-2 text-left transition ${
                  activeIndex === index
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/15 dark:bg-blue-950/30"
                    : "border-slate-200 hover:border-slate-400 dark:border-slate-700"
                }`}
              >
                <div className="mb-2 flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white p-2 text-[7px] leading-tight text-slate-800 dark:border-slate-700">
                  <div
                    className="pointer-events-none line-clamp-5 w-full overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: slide.html }}
                  />
                </div>
                <span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                  {String(index + 1).padStart(2, "0")}. {slide.title}
                </span>
                {activeIndex === index && (
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-blue-600">Currently editing</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={duplicateSlide}
              disabled={recording}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Copy size={14} /> Duplicate
            </button>
            <button
              type="button"
              onClick={deleteSlide}
              disabled={recording}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40 dark:border-red-900/60 dark:hover:bg-red-950/30"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </aside>

        {/* Main presentation area */}
        <main className="order-1 min-w-0 space-y-4 2xl:order-2">
          {/* Editor toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-1">
              <button type="button" onClick={() => formatText("bold")} disabled={recording} className="rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800" title="Bold"><Bold size={17} /></button>
              <button type="button" onClick={() => formatText("italic")} disabled={recording} className="rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800" title="Italic"><Italic size={17} /></button>
              <button type="button" onClick={() => formatText("underline")} disabled={recording} className="rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800" title="Underline"><Underline size={17} /></button>
              <span className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <button type="button" onClick={() => formatText("insertUnorderedList")} disabled={recording} className="rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800" title="Bullet list"><List size={17} /></button>
              <select
                onChange={(event) => formatText("formatBlock", event.target.value)}
                defaultValue="p"
                disabled={recording}
                className="max-w-[135px] rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Main heading</option>
                <option value="h2">Subheading</option>
                <option value="h3">Small heading</option>
              </select>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" title="Text colour">
                <Palette size={16} />
                <input type="color" defaultValue="#172554" disabled={recording} onChange={(event) => formatText("foreColor", event.target.value)} className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                <FileImage size={15} /> Add image
                <input type="file" accept="image/*" disabled={recording} className="hidden" onChange={(event) => { void insertImage(event.target.files?.[0]); event.target.value = ""; }} />
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                <FileText size={15} /> Import PDF
                <input type="file" accept="application/pdf" disabled={recording} className="hidden" onChange={(event) => { void importPdf(event.target.files?.[0]); event.target.value = ""; }} />
              </label>
            </div>
          </div>

          {/* Presentation canvas */}
          <div className="rounded-2xl border border-slate-300 bg-slate-950 p-2 shadow-xl sm:p-3 dark:border-slate-700">
            <div
              ref={boardRef}
              className="relative aspect-video w-full overflow-hidden rounded-lg bg-white text-slate-900"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-[4%] py-[1.5%]">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-950 text-sm font-black text-white sm:h-9 sm:w-9 sm:text-lg">L</div>
                  <div>
                    <p className="text-[8px] font-black tracking-[0.18em] text-blue-950 sm:text-xs">LEARNYFI</p>
                    <p className="text-[5px] font-bold tracking-[0.12em] text-slate-500 sm:text-[7px]">DIGITAL LEARNING CLASSROOM</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-[6px] font-extrabold tracking-wider text-blue-800 sm:px-3 sm:text-[9px]">LECTURE NOTES</span>
              </div>

              <div
                className="lecture-editor-content absolute inset-x-0 bottom-[8%] top-[14%] overflow-y-auto px-[6%] py-[2.5%] text-[clamp(10px,1.35vw,19px)] leading-relaxed outline-none sm:text-[clamp(12px,1.45vw,21px)]"
                contentEditable={!recording}
                suppressContentEditableWarning
                onInput={saveEditorContent}
                onBlur={saveEditorContent}
                spellCheck
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-slate-200 bg-white px-[4%] py-[1.2%] text-[6px] font-bold tracking-wider text-slate-500 sm:text-[8px]">
                <span>LEARNYFI · LEARN. PRACTISE. EXCEL.</span>
                <span>{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
              </div>

              <canvas
                ref={drawingCanvasRef}
                className={`absolute inset-0 z-20 h-full w-full ${penEnabled ? "touch-none cursor-crosshair" : "pointer-events-none"}`}
                onPointerDown={beginDrawing}
                onPointerMove={continueDrawing}
                onPointerUp={finishDrawing}
                onPointerCancel={finishDrawing}
                onPointerLeave={finishDrawing}
              />
            </div>
          </div>

          {/* Slide navigation and actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <button type="button" disabled={recording || activeIndex === 0} onClick={() => moveSlide(-1)} className="rounded-xl border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><ChevronLeft size={18} /></button>
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">Slide {activeIndex + 1} <span className="font-medium text-slate-400">of {slides.length}</span></p>
                <p className="max-w-[180px] truncate text-xs text-slate-500">{activeSlide?.title}</p>
              </div>
              <button type="button" disabled={recording || activeIndex === slides.length - 1} onClick={() => moveSlide(1)} className="rounded-xl border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><ChevronRight size={18} /></button>
            </div>
            <p className="text-xs text-slate-500">The presentation stage is what appears in your video.</p>
          </div>
        </main>

        {/* Teaching tools */}
        <aside className="order-3 min-w-0 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Pen size={17} /></div>
              <div><h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Annotation tools</h3><p className="text-xs text-slate-500">Write on your slides</p></div>
            </div>
            <button type="button" onClick={() => { setPenEnabled((value) => !value); setEraserEnabled(false); }} disabled={recording} className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition disabled:opacity-40 ${penEnabled && !eraserEnabled ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"}`}>
              <Pen size={16} /> {penEnabled && !eraserEnabled ? "Pen is active" : "Enable pen"}
            </button>
            <p className="mb-2 mt-4 text-xs font-bold text-slate-500">Pen colour</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => <button key={color} type="button" disabled={recording} onClick={() => { setPenColor(color); setEraserEnabled(false); }} aria-label={`Select ${color}`} className={`h-7 w-7 rounded-full border-2 disabled:opacity-40 ${penColor === color && !eraserEnabled ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200"}`} style={{ backgroundColor: color }} />)}
            </div>
            <label className="mb-2 mt-4 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300"><span>Pen thickness</span><span>{penSize}px</span></label>
            <input type="range" min="1" max="12" value={penSize} disabled={recording} onChange={(event) => setPenSize(Number(event.target.value))} className="w-full accent-blue-600" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" disabled={recording} onClick={() => { setPenEnabled(true); setEraserEnabled(true); }} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-2 py-2.5 text-xs font-bold ${eraserEnabled ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950" : "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"}`}><Eraser size={14} /> Eraser</button>
              <button type="button" disabled={recording} onClick={clearDrawing} className="rounded-xl border border-slate-200 px-2 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Clear marks</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2"><div className="rounded-lg bg-violet-50 p-2 text-violet-700 dark:bg-violet-950 dark:text-violet-300"><Timer size={17} /></div><div><h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Slide timing</h3><p className="text-xs text-slate-500">Control presentation flow</p></div></div>
            <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200"><span>Auto-advance slides</span><input type="checkbox" checked={autoAdvance} disabled={recording} onChange={(event) => setAutoAdvance(event.target.checked)} className="h-4 w-4 accent-blue-600" /></label>
            <label className="mb-2 mt-4 block text-xs font-bold text-slate-500">Seconds per slide</label>
            <input type="number" min="5" max="3600" value={slideSeconds} disabled={recording} onChange={(event) => setSlideSeconds(Math.max(5, Number(event.target.value) || 5))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <p className="mt-2 text-xs leading-relaxed text-slate-500">When enabled, slides advance automatically during recording and loop back to the first slide.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Camera size={17} /></div><div><h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Presenter camera</h3><p className="text-xs text-slate-500">Camera and microphone</p></div></div>
            <video ref={cameraVideoRef} autoPlay muted playsInline className="mb-3 aspect-video w-full rounded-xl bg-slate-950 object-cover" />
            <button type="button" onClick={cameraReady ? stopCamera : startCamera} disabled={recording} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              {cameraReady ? <CameraOff size={16} /> : <Camera size={16} />}
              {cameraReady ? "Turn camera off" : "Enable camera"}
            </button>
            <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Mic size={13} /> Microphone audio comes from your camera stream.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2"><div className="rounded-lg bg-red-50 p-2 text-red-700 dark:bg-red-950 dark:text-red-300"><Radio size={17} /></div><div><h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Recording controls</h3><p className="text-xs text-slate-500">Capture your lesson</p></div></div>
            {!recording ? (
              <button type="button" onClick={startRecording} disabled={!cameraReady} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"><Radio size={17} /> Start recording</button>
            ) : (
              <div className="space-y-2">
                {paused ? (
                  <button type="button" onClick={resumeRecording} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white hover:bg-blue-700"><Play size={17} /> Resume recording</button>
                ) : (
                  <button type="button" onClick={pauseRecording} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><Pause size={17} /> Pause recording</button>
                )}
                <button type="button" onClick={stopRecording} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-3 text-sm font-bold text-white hover:bg-red-700"><CircleStop size={17} /> Stop recording</button>
              </div>
            )}
            {videoUrl && !recording && (
              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Recording ready</p>
                <video src={videoUrl} controls playsInline className="w-full rounded-xl bg-black" />
                <button type="button" onClick={downloadRecording} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"><Download size={17} /> Download lecture video</button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {error && (
        <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="shrink-0 rounded-lg p-1 hover:bg-red-100 dark:hover:bg-red-900/40" aria-label="Dismiss error"><X size={17} /></button>
        </div>
      )}

      <canvas ref={outputCanvasRef} width={1280} height={720} className="hidden" />
    </section>
  );
}
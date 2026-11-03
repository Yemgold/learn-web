


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

    updateSlide({
      html: boardRef.current.innerHTML,
    });
  };

  // Keep the editor content synchronized when navigating slides.
  useEffect(() => {
    if (boardRef.current && activeSlide) {
      boardRef.current.innerHTML = activeSlide.html;
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
    boardRef.current?.focus();
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
    <section className="space-y-5 rounded-2xl border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Radio className="h-5 w-5 text-primary" />
            Learnyfi Interactive Teaching Studio
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create slides, annotate lessons, import PDFs and record your class.
          </p>
        </div>

        {recording && (
          <span className="rounded-full bg-red-100 px-3 py-2 text-sm font-bold text-red-700">
            ● {paused ? "PAUSED" : "RECORDING"} · {formatTime(elapsed)}
          </span>
        )}
      </div>

      <input
        value={lectureTitle}
        onChange={(event) => setLectureTitle(event.target.value)}
        disabled={recording}
        placeholder="Lecture title"
        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
      />

      <div className="grid gap-4 xl:grid-cols-[190px_minmax(0,1fr)_250px]">
        {/* Slide navigator */}
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Lecture slides</h3>
            <button
              type="button"
              onClick={addSlide}
              disabled={recording}
              className="rounded-lg bg-primary p-2 text-primary-foreground"
              title="Add slide"
            >
              <Plus size={17} />
            </button>
          </div>

          <div className="max-h-[530px] space-y-2 overflow-y-auto">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  if (!recording) {
                    saveEditorContent();
                    setActiveIndex(index);
                  }
                }}
                className={`w-full rounded-lg border p-2 text-left ${
                  activeIndex === index
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="mb-2 flex aspect-video items-center justify-center overflow-hidden rounded bg-white p-2 text-center text-xs text-slate-800">
                  <span
                    dangerouslySetInnerHTML={{ __html: slide.html }}
                    className="line-clamp-4 max-h-full overflow-hidden"
                  />
                </div>
                <span className="text-xs font-semibold">
                  {index + 1}. {slide.title}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={duplicateSlide}
              disabled={recording}
              className="rounded-lg border p-2 hover:bg-muted"
              title="Duplicate slide"
            >
              <Copy size={16} />
            </button>
            <button
              type="button"
              onClick={deleteSlide}
              disabled={recording}
              className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
              title="Delete slide"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </aside>

        {/* Main lecture board */}
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border bg-background p-2">
            <button type="button" onClick={() => formatText("bold")} className="rounded p-2 hover:bg-muted" title="Bold">
              <Bold size={17} />
            </button>
            <button type="button" onClick={() => formatText("italic")} className="rounded p-2 hover:bg-muted" title="Italic">
              <Italic size={17} />
            </button>
            <button type="button" onClick={() => formatText("underline")} className="rounded p-2 hover:bg-muted" title="Underline">
              <Underline size={17} />
            </button>
            <button type="button" onClick={() => formatText("insertUnorderedList")} className="rounded p-2 hover:bg-muted" title="Bullet list">
              <List size={17} />
            </button>

            <select
              onChange={(event) => formatText("formatBlock", event.target.value)}
              defaultValue="p"
              disabled={recording}
              className="max-w-[115px] rounded border bg-background p-2 text-xs"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>

            <label className="flex cursor-pointer items-center gap-1 rounded p-2 hover:bg-muted" title="Text colour">
              <Palette size={17} />
              <input
                type="color"
                defaultValue="#172554"
                disabled={recording}
                onChange={(event) => formatText("foreColor", event.target.value)}
                className="h-5 w-5 cursor-pointer"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-1 rounded p-2 hover:bg-muted" title="Insert picture">
              <FileImage size={17} />
              <input
                type="file"
                accept="image/*"
                disabled={recording}
                className="hidden"
                onChange={(event) => {
                  void insertImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>

            <label className="flex cursor-pointer items-center gap-1 rounded p-2 hover:bg-muted" title="Import PDF">
              <FileText size={17} />
              <input
                type="file"
                accept="application/pdf"
                disabled={recording}
                className="hidden"
                onChange={(event) => {
                  void importPdf(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <Upload size={15} />
            </label>
          </div>

          <div className="relative overflow-hidden rounded-xl border-4 border-slate-800 bg-white shadow-xl">
            <div
              ref={boardRef}
              contentEditable={!recording}
              suppressContentEditableWarning
              onInput={saveEditorContent}
              onBlur={saveEditorContent}
              className="lecture-board-content aspect-video w-full overflow-auto p-[5%] text-slate-900 outline-none [&_h1]:mb-4 [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:font-bold [&_p]:mb-3 [&_p]:leading-relaxed [&_img]:mx-auto [&_img]:max-h-[450px] [&_img]:object-contain [&_ul]:list-disc [&_ul]:pl-8"
            />

            <canvas
              ref={drawingCanvasRef}
              className={`absolute inset-0 h-full w-full ${
                penEnabled ? "touch-none cursor-crosshair" : "pointer-events-none"
              }`}
              onPointerDown={beginDrawing}
              onPointerMove={continueDrawing}
              onPointerUp={finishDrawing}
              onPointerCancel={finishDrawing}
              onPointerLeave={finishDrawing}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={recording || activeIndex === 0}
                onClick={() => moveSlide(-1)}
                className="rounded-lg border p-2 hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-xs font-semibold">
                Slide {activeIndex + 1} of {slides.length}
              </span>

              <button
                type="button"
                disabled={recording || activeIndex === slides.length - 1}
                onClick={() => moveSlide(1)}
                className="rounded-lg border p-2 hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <span className="text-xs text-muted-foreground">
              Changes are included in the recording.
            </span>
          </div>
        </div>

        {/* Teaching and recording tools */}
        <aside className="space-y-4">
          <div className="rounded-xl border p-3">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <Pen size={17} />
              Digital pen
            </h3>

            <button
              type="button"
              onClick={() => {
                setPenEnabled((value) => !value);
                setEraserEnabled(false);
              }}
              disabled={recording}
              className={`flex w-full items-center justify-center gap-2 rounded-lg p-2 text-sm font-semibold ${
                penEnabled ? "bg-primary text-primary-foreground" : "border"
              }`}
            >
              <Pen size={16} />
              {penEnabled ? "Pen enabled" : "Enable pen"}
            </button>

            <div className="my-3 flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  disabled={recording}
                  onClick={() => {
                    setPenColor(color);
                    setEraserEnabled(false);
                  }}
                  className={`h-7 w-7 rounded-full border-2 ${
                    penColor === color && !eraserEnabled
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <label className="mb-1 block text-xs text-muted-foreground">
              Pen thickness: {penSize}px
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={penSize}
              disabled={recording}
              onChange={(event) => setPenSize(Number(event.target.value))}
              className="w-full"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={recording}
                onClick={() => {
                  setPenEnabled(true);
                  setEraserEnabled(true);
                }}
                className={`flex items-center justify-center gap-1 rounded-lg border p-2 text-xs ${
                  eraserEnabled ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <Eraser size={14} /> Eraser
              </button>

              <button
                type="button"
                disabled={recording}
                onClick={clearDrawing}
                className="rounded-lg border p-2 text-xs hover:bg-muted"
              >
                Clear drawings
              </button>
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <Timer size={17} />
              Automatic slides
            </h3>

            <label className="flex items-center justify-between gap-2 text-sm">
              <span>Auto advance</span>
              <input
                type="checkbox"
                checked={autoAdvance}
                disabled={recording}
                onChange={(event) => setAutoAdvance(event.target.checked)}
              />
            </label>

            <label className="mt-3 block text-xs text-muted-foreground">
              Seconds per slide
            </label>
            <input
              type="number"
              min="5"
              max="3600"
              value={slideSeconds}
              disabled={recording}
              onChange={(event) =>
                setSlideSeconds(
                  Math.max(5, Number(event.target.value) || 5)
                )
              }
              className="mt-1 w-full rounded-lg border bg-background p-2 text-sm"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Slides repeat from the beginning when the last slide is reached.
            </p>
          </div>

          <div className="rounded-xl border p-3">
            <h3 className="mb-3 text-sm font-bold">Camera and microphone</h3>

            <video
              ref={cameraVideoRef}
              autoPlay
              muted
              playsInline
              className="mb-3 aspect-video w-full rounded-lg bg-slate-950 object-cover"
            />

            <button
              type="button"
              onClick={cameraReady ? stopCamera : startCamera}
              disabled={recording}
              className="flex w-full items-center justify-center gap-2 rounded-lg border p-2 text-sm font-semibold disabled:opacity-50"
            >
              {cameraReady ? <CameraOff size={16} /> : <Camera size={16} />}
              {cameraReady ? "Turn camera off" : "Enable camera"}
            </button>

            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Mic size={14} />
              Camera microphone audio is used.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border p-3">
            <h3 className="text-sm font-bold">Lecture recording</h3>

            {!recording ? (
              <button
                type="button"
                onClick={startRecording}
                disabled={!cameraReady}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 p-3 text-sm font-bold text-white disabled:opacity-50"
              >
                <Radio size={17} />
                Start recording
              </button>
            ) : (
              <>
                {paused ? (
                  <button
                    type="button"
                    onClick={resumeRecording}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-3 text-sm font-bold text-primary-foreground"
                  >
                    <Play size={17} /> Resume
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pauseRecording}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border p-3 text-sm font-bold"
                  >
                    <Pause size={17} /> Pause
                  </button>
                )}

                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 p-3 text-sm font-bold text-white"
                >
                  <CircleStop size={17} /> Stop recording
                </button>
              </>
            )}

            {videoUrl && !recording && (
              <button
                type="button"
                onClick={downloadRecording}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 p-3 text-sm font-bold text-white"
              >
                <Download size={17} /> Download lecture
              </button>
            )}

            {videoUrl && !recording && (
              <video
                src={videoUrl}
                controls
                playsInline
                className="mt-3 w-full rounded-lg bg-black"
              />
            )}
          </div>
        </aside>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
          <button type="button" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hidden recording canvas */}
      <canvas
        ref={outputCanvasRef}
        width={1280}
        height={720}
        className="hidden"
      />
    </section>
  );
}

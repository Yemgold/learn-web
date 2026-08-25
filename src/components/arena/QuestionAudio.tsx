


// "use client";

// import {
//   Pause,
//   Play,
//   RotateCcw,
//   Volume2,
//   VolumeX,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// interface QuestionAudioProps {
//   audioUrl?: string;
//   isPlaying?: boolean;
//   onPlayingChange?: (isPlaying: boolean) => void;
// }

// export default function QuestionAudio({
//   audioUrl,
//   isPlaying = false,
//   onPlayingChange,
// }: QuestionAudioProps) {
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   const [internalPlaying, setInternalPlaying] =
//     useState(isPlaying);

//   const [progress, setProgress] = useState(0);

//   const [currentTime, setCurrentTime] = useState(0);

//   const [duration, setDuration] = useState(0);

//   const [error, setError] = useState(false);

//   /* ---------------------------------------------------------------------- */
//   /* Sync parent playing state                                              */
//   /* ---------------------------------------------------------------------- */

//   useEffect(() => {
//     setInternalPlaying(isPlaying);
//   }, [isPlaying]);

//   /* ---------------------------------------------------------------------- */
//   /* Audio events                                                           */
//   /* ---------------------------------------------------------------------- */

//   useEffect(() => {
//     const audio = audioRef.current;

//     if (!audio) {
//       return;
//     }

//     const handleLoadedMetadata = () => {
//       setDuration(audio.duration || 0);
//     };

//     const handleTimeUpdate = () => {
//       setCurrentTime(audio.currentTime);

//       if (audio.duration) {
//         setProgress(
//           (audio.currentTime / audio.duration) * 100
//         );
//       }
//     };

//     const handleEnded = () => {
//       setInternalPlaying(false);
//       setProgress(100);

//       onPlayingChange?.(false);
//     };

//     const handleError = () => {
//       setError(true);
//       setInternalPlaying(false);

//       onPlayingChange?.(false);
//     };

//     audio.addEventListener(
//       "loadedmetadata",
//       handleLoadedMetadata
//     );

//     audio.addEventListener(
//       "timeupdate",
//       handleTimeUpdate
//     );

//     audio.addEventListener("ended", handleEnded);

//     audio.addEventListener("error", handleError);

//     return () => {
//       audio.removeEventListener(
//         "loadedmetadata",
//         handleLoadedMetadata
//       );

//       audio.removeEventListener(
//         "timeupdate",
//         handleTimeUpdate
//       );

//       audio.removeEventListener("ended", handleEnded);

//       audio.removeEventListener("error", handleError);
//     };
//   }, [onPlayingChange]);

//   /* ---------------------------------------------------------------------- */
//   /* Play / Pause                                                           */
//   /* ---------------------------------------------------------------------- */

//   const togglePlay = async () => {
//     const audio = audioRef.current;

//     if (!audio || error) {
//       return;
//     }

//     try {
//       if (audio.paused) {
//         await audio.play();

//         setInternalPlaying(true);

//         onPlayingChange?.(true);
//       } else {
//         audio.pause();

//         setInternalPlaying(false);

//         onPlayingChange?.(false);
//       }
//     } catch {
//       setError(true);
//       setInternalPlaying(false);

//       onPlayingChange?.(false);
//     }
//   };

//   /* ---------------------------------------------------------------------- */
//   /* Restart                                                                */
//   /* ---------------------------------------------------------------------- */

//   const restart = async () => {
//     const audio = audioRef.current;

//     if (!audio) {
//       return;
//     }

//     audio.currentTime = 0;
//     setProgress(0);
//     setCurrentTime(0);

//     try {
//       await audio.play();

//       setInternalPlaying(true);

//       onPlayingChange?.(true);
//     } catch {
//       setError(true);

//       setInternalPlaying(false);

//       onPlayingChange?.(false);
//     }
//   };

//   /* ---------------------------------------------------------------------- */
//   /* Seek                                                                    */
//   /* ---------------------------------------------------------------------- */

//   const handleSeek = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const audio = audioRef.current;

//     if (!audio) {
//       return;
//     }

//     const value = Number(event.target.value);

//     audio.currentTime = value;

//     setCurrentTime(value);

//     if (audio.duration) {
//       setProgress((value / audio.duration) * 100);
//     }
//   };

//   /* ---------------------------------------------------------------------- */
//   /* Formatting                                                              */
//   /* ---------------------------------------------------------------------- */

//   const formatTime = (seconds: number) => {
//     if (!Number.isFinite(seconds)) {
//       return "0:00";
//     }

//     const minutes = Math.floor(seconds / 60);

//     const remainingSeconds = Math.floor(seconds % 60)
//       .toString()
//       .padStart(2, "0");

//     return `${minutes}:${remainingSeconds}`;
//   };

//   /* ---------------------------------------------------------------------- */
//   /* No audio available                                                      */
//   /* ---------------------------------------------------------------------- */

//   if (!audioUrl) {
//     return (
//       <div className="mx-auto mt-8 flex max-w-md items-center justify-center">
//         <button
//           type="button"
//           disabled
//           className="flex cursor-not-allowed items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-500"
//         >
//           <VolumeX size={18} />

//           <span>Question audio unavailable</span>
//         </button>
//       </div>
//     );
//   }

//   /* ---------------------------------------------------------------------- */
//   /* Error state                                                             */
//   /* ---------------------------------------------------------------------- */

//   if (error) {
//     return (
//       <div className="mx-auto mt-8 flex max-w-md items-center justify-center">
//         <button
//           type="button"
//           onClick={() => {
//             setError(false);
//             setProgress(0);
//             setCurrentTime(0);

//             if (audioRef.current) {
//               audioRef.current.load();
//             }
//           }}
//           className="flex items-center gap-3 rounded-full border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
//         >
//           <RotateCcw size={17} />

//           <span>Audio unavailable — retry</span>
//         </button>
//       </div>
//     );
//   }

//   /* ---------------------------------------------------------------------- */
//   /* UI                                                                      */
//   /* ---------------------------------------------------------------------- */

//   return (
//     <div className="mx-auto mt-8 w-full max-w-xl">
//       {/* Hidden audio element */}

//       <audio
//         ref={audioRef}
//         src={audioUrl}
//         preload="metadata"
//       />

//       {/* Audio Player */}

//       <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-xl backdrop-blur-xl sm:p-4">
//         <div className="flex items-center gap-3 sm:gap-4">
//           {/* Play / Pause */}

//           <button
//             type="button"
//             onClick={togglePlay}
//             aria-label={
//               internalPlaying
//                 ? "Pause question audio"
//                 : "Play question audio"
//             }
//             className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition hover:scale-105 active:scale-95"
//           >
//             {internalPlaying ? (
//               <Pause
//                 size={18}
//                 fill="currentColor"
//               />
//             ) : (
//               <Play
//                 size={18}
//                 fill="currentColor"
//                 className="ml-0.5"
//               />
//             )}
//           </button>

//           {/* Audio information */}

//           <div className="min-w-0 flex-1">
//             <div className="flex items-center justify-between gap-3">
//               <div className="flex min-w-0 items-center gap-2">
//                 <Volume2
//                   size={16}
//                   className={
//                     internalPlaying
//                       ? "text-cyan-400"
//                       : "text-slate-500"
//                   }
//                 />

//                 <span className="truncate text-xs font-semibold text-slate-300 sm:text-sm">
//                   {internalPlaying
//                     ? "Reading question..."
//                     : "Listen to question"}
//                 </span>
//               </div>

//               <span className="shrink-0 text-[11px] tabular-nums text-slate-500">
//                 {formatTime(currentTime)} /{" "}
//                 {formatTime(duration)}
//               </span>
//             </div>

//             {/* Progress */}

//             <input
//               type="range"
//               min={0}
//               max={duration || 0}
//               step={0.1}
//               value={Math.min(currentTime, duration || 0)}
//               onChange={handleSeek}
//               aria-label="Question audio progress"
//               className="mt-2 h-1 w-full cursor-pointer accent-cyan-400"
//             />
//           </div>

//           {/* Restart */}

//           <button
//             type="button"
//             onClick={restart}
//             aria-label="Restart question audio"
//             title="Restart"
//             className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white sm:flex"
//           >
//             <RotateCcw size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { useEffect, useRef, useState } from "react";

import SpeechController from "./SpeechController";

interface QuestionAudioProps {
  question: string;
  audioUrl?: string;
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
}

export default function QuestionAudio({
  question,
  audioUrl,
  isPlaying,
  onPlayingChange,
}: QuestionAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(
    null
  );

  const [audioError, setAudioError] =
    useState(false);

  /*
   * If a real audio file exists, use it.
   *
   * Otherwise SpeechController will use
   * browser Text-to-Speech.
   */
  const hasAudioFile =
    Boolean(audioUrl) && !audioError;

  useEffect(() => {
    if (!audioUrl) return;

    setAudioError(false);
  }, [audioUrl]);

  const handlePlayAudio = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      onPlayingChange(true);
    } catch {
      setAudioError(true);
      onPlayingChange(false);
    }
  };

  const handleStopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    onPlayingChange(false);
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      {hasAudioFile ? (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="auto"
            onEnded={() =>
              onPlayingChange(false)
            }
            onPause={() =>
              onPlayingChange(false)
            }
            onError={() => {
              setAudioError(true);
              onPlayingChange(false);
            }}
          />

          <button
            type="button"
            onClick={
              isPlaying
                ? handleStopAudio
                : handlePlayAudio
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <span className="text-lg">
              {isPlaying ? "⏹" : "🔊"}
            </span>

            {isPlaying
              ? "Stop Question"
              : "Play Question"}
          </button>
        </>
      ) : (
        <SpeechController
          text={question}
          rate={0.88}
          pitch={1}
          volume={1}
          onStart={() =>
            onPlayingChange(true)
          }
          onEnd={() =>
            onPlayingChange(false)
          }
        />
      )}

      {audioError && (
        <p className="text-xs text-slate-500">
          Audio file unavailable. Using Text-to-Speech instead.
        </p>
      )}
    </div>
  );
}
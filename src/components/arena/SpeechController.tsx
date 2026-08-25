

// "use client";

// import {
//   Pause,
//   Play,
//   Square,
//   Volume2,
//   VolumeX,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";

// interface SpeechControllerProps {
//   text: string;
//   autoPlay?: boolean;
//   label?: string;
//   rate?: number;
//   pitch?: number;
//   voiceLanguage?: string;
//   onStart?: () => void;
//   onEnd?: () => void;
// }

// export default function SpeechController({
//   text,
//   autoPlay = false,
//   label = "Listen",
//   rate = 0.95,
//   pitch = 1,
//   voiceLanguage = "en-NG",
//   onStart,
//   onEnd,
// }: SpeechControllerProps) {
//   const [isSupported, setIsSupported] =
//     useState(true);

//   const [isPlaying, setIsPlaying] =
//     useState(false);

//   const [isPaused, setIsPaused] =
//     useState(false);

//   const [isMuted, setIsMuted] =
//     useState(false);

//   const [voices, setVoices] = useState<
//     SpeechSynthesisVoice[]
//   >([]);

//   const utteranceRef =
//     useRef<SpeechSynthesisUtterance | null>(null);

//   /* -------------------------------------------------------------------- */
//   /* Check browser support                                                */
//   /* -------------------------------------------------------------------- */

//   useEffect(() => {
//     if (
//       typeof window === "undefined" ||
//       !("speechSynthesis" in window)
//     ) {
//       setIsSupported(false);
//     }
//   }, []);

//   /* -------------------------------------------------------------------- */
//   /* Load available voices                                                */
//   /* -------------------------------------------------------------------- */

//   useEffect(() => {
//     if (!isSupported) {
//       return;
//     }

//     const loadVoices = () => {
//       const availableVoices =
//         window.speechSynthesis.getVoices();

//       setVoices(availableVoices);
//     };

//     loadVoices();

//     window.speechSynthesis.addEventListener(
//       "voiceschanged",
//       loadVoices
//     );

//     return () => {
//       window.speechSynthesis.removeEventListener(
//         "voiceschanged",
//         loadVoices
//       );
//     };
//   }, [isSupported]);

//   /* -------------------------------------------------------------------- */
//   /* Find appropriate voice                                               */
//   /* -------------------------------------------------------------------- */

//   const findVoice = () => {
//     if (!voices.length) {
//       return undefined;
//     }

//     /*
//      * First try the requested language.
//      *
//      * Example:
//      * en-NG
//      * en-US
//      * en-GB
//      */

//     const exactVoice = voices.find(
//       (voice) =>
//         voice.lang.toLowerCase() ===
//         voiceLanguage.toLowerCase()
//     );

//     if (exactVoice) {
//       return exactVoice;
//     }

//     const languageVoice = voices.find(
//       (voice) =>
//         voice.lang
//           .toLowerCase()
//           .startsWith(
//             voiceLanguage
//               .split("-")[0]
//               .toLowerCase()
//           )
//     );

//     return languageVoice;
//   };

//   /* -------------------------------------------------------------------- */
//   /* Stop speech                                                         */
//   /* -------------------------------------------------------------------- */

//   const stop = () => {
//     if (!isSupported) {
//       return;
//     }

//     window.speechSynthesis.cancel();

//     utteranceRef.current = null;

//     setIsPlaying(false);
//     setIsPaused(false);

//     onEnd?.();
//   };

//   /* -------------------------------------------------------------------- */
//   /* Speak                                                               */
//   /* -------------------------------------------------------------------- */

//   const speak = () => {
//     if (
//       !isSupported ||
//       !text.trim() ||
//       isMuted
//     ) {
//       return;
//     }

//     /*
//      * Cancel anything currently speaking.
//      */

//     window.speechSynthesis.cancel();

//     const utterance =
//       new SpeechSynthesisUtterance(text);

//     utterance.rate = rate;
//     utterance.pitch = pitch;
//     utterance.volume = 1;

//     const voice = findVoice();

//     if (voice) {
//       utterance.voice = voice;
//     }

//     utterance.onstart = () => {
//       setIsPlaying(true);
//       setIsPaused(false);

//       onStart?.();
//     };

//     utterance.onend = () => {
//       setIsPlaying(false);
//       setIsPaused(false);

//       utteranceRef.current = null;

//       onEnd?.();
//     };

//     utterance.onerror = () => {
//       setIsPlaying(false);
//       setIsPaused(false);

//       utteranceRef.current = null;

//       onEnd?.();
//     };

//     utteranceRef.current = utterance;

//     window.speechSynthesis.speak(
//       utterance
//     );
//   };

//   /* -------------------------------------------------------------------- */
//   /* Pause                                                               */
//   /* -------------------------------------------------------------------- */

//   const pause = () => {
//     if (!isSupported) {
//       return;
//     }

//     if (
//       window.speechSynthesis.speaking
//     ) {
//       window.speechSynthesis.pause();

//       setIsPaused(true);
//     }
//   };

//   /* -------------------------------------------------------------------- */
//   /* Resume                                                              */
//   /* -------------------------------------------------------------------- */

//   const resume = () => {
//     if (!isSupported) {
//       return;
//     }

//     if (
//       window.speechSynthesis.paused
//     ) {
//       window.speechSynthesis.resume();

//       setIsPaused(false);
//     }
//   };

//   /* -------------------------------------------------------------------- */
//   /* Toggle playback                                                     */
//   /* -------------------------------------------------------------------- */

//   const togglePlayback = () => {
//     if (isMuted) {
//       return;
//     }

//     if (!isPlaying) {
//       speak();
//       return;
//     }

//     if (isPaused) {
//       resume();
//       return;
//     }

//     pause();
//   };

//   /* -------------------------------------------------------------------- */
//   /* Toggle mute                                                         */
//   /* -------------------------------------------------------------------- */

//   const toggleMute = () => {
//     if (isMuted) {
//       setIsMuted(false);
//       return;
//     }

//     stop();
//     setIsMuted(true);
//   };

//   /* -------------------------------------------------------------------- */
//   /* Auto play                                                            */
//   /* -------------------------------------------------------------------- */

//   useEffect(() => {
//     if (!autoPlay || !text.trim()) {
//       return;
//     }

//     /*
//      * Small delay helps browsers initialize speech synthesis
//      * after the component mounts.
//      */

//     const timer = window.setTimeout(() => {
//       if (!isMuted) {
//         speak();
//       }
//     }, 300);

//     return () => {
//       window.clearTimeout(timer);

//       window.speechSynthesis.cancel();
//     };

//     // We intentionally only react to text changes here.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [text]);

//   /* -------------------------------------------------------------------- */
//   /* Cleanup                                                              */
//   /* -------------------------------------------------------------------- */

//   useEffect(() => {
//     return () => {
//       if (
//         typeof window !== "undefined" &&
//         "speechSynthesis" in window
//       ) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   /* -------------------------------------------------------------------- */
//   /* Unsupported browser                                                  */
//   /* -------------------------------------------------------------------- */

//   if (!isSupported) {
//     return (
//       <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-slate-500">
//         <VolumeX size={15} />

//         <span>
//           Voice playback is not supported in this browser.
//         </span>
//       </div>
//     );
//   }

//   /* -------------------------------------------------------------------- */
//   /* Controller                                                            */
//   /* -------------------------------------------------------------------- */

//   return (
//     <div className="flex items-center gap-2">
//       {/* --------------------------------------------------------------- */}
//       {/* Main playback button                                             */}
//       {/* --------------------------------------------------------------- */}

//       <motion.button
//         type="button"
//         onClick={togglePlayback}
//         disabled={!text.trim() || isMuted}
//         whileHover={{
//           scale: 1.03,
//         }}
//         whileTap={{
//           scale: 0.96,
//         }}
//         aria-label={
//           !isPlaying
//             ? label
//             : isPaused
//               ? "Resume speech"
//               : "Pause speech"
//         }
//         className={[
//           "flex items-center gap-3 rounded-full border px-4 py-2.5",
//           "text-sm font-semibold transition-all duration-200",

//           isPlaying
//             ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
//             : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white",

//           isMuted
//             ? "cursor-not-allowed opacity-50"
//             : "",
//         ].join(" ")}
//       >
//         <span
//           className={[
//             "flex h-8 w-8 items-center justify-center rounded-full",

//             isPlaying
//               ? "bg-cyan-400 text-slate-950"
//               : "bg-white/10 text-slate-300",
//           ].join(" ")}
//         >
//           {isPlaying ? (
//             isPaused ? (
//               <Play
//                 size={15}
//                 fill="currentColor"
//               />
//             ) : (
//               <Pause
//                 size={15}
//                 fill="currentColor"
//               />
//             )
//           ) : (
//             <Play
//               size={15}
//               fill="currentColor"
//               className="ml-0.5"
//             />
//           )}
//         </span>

//         <Volume2 size={16} />

//         <span>
//           {isPlaying
//             ? isPaused
//               ? "Resume"
//               : "Pause"
//             : label}
//         </span>
//       </motion.button>

//       {/* --------------------------------------------------------------- */}
//       {/* Stop button                                                      */}
//       {/* --------------------------------------------------------------- */}

//       {isPlaying && (
//         <motion.button
//           type="button"
//           onClick={stop}
//           whileHover={{
//             scale: 1.05,
//           }}
//           whileTap={{
//             scale: 0.95,
//           }}
//           aria-label="Stop speech"
//           className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
//         >
//           <Square
//             size={14}
//             fill="currentColor"
//           />
//         </motion.button>
//       )}

//       {/* --------------------------------------------------------------- */}
//       {/* Mute button                                                      */}
//       {/* --------------------------------------------------------------- */}

//       <button
//         type="button"
//         onClick={toggleMute}
//         aria-label={
//           isMuted
//             ? "Turn voice on"
//             : "Mute voice"
//         }
//         className={[
//           "flex h-10 w-10 items-center justify-center rounded-full",
//           "border border-white/10 bg-white/5",
//           "text-slate-500 transition-colors",
//           "hover:bg-white/10 hover:text-white",
//         ].join(" ")}
//       >
//         {isMuted ? (
//           <VolumeX size={16} />
//         ) : (
//           <Volume2 size={16} />
//         )}
//       </button>
//     </div>
//   );
// }




"use client";

import { useCallback, useEffect, useState } from "react";

interface SpeechControllerProps {
  text: string;
  autoPlay?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function SpeechController({
  text,
  autoPlay = false,
  rate = 0.9,
  pitch = 1,
  volume = 1,
  onStart,
  onEnd,
}: SpeechControllerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    setIsSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    if (!text.trim()) return;

    // Stop anything currently speaking.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      text
    );

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [
    text,
    rate,
    pitch,
    volume,
    onStart,
    onEnd,
  ]);

  useEffect(() => {
    if (!autoPlay) return;

    /*
     * Browsers may block speech that starts without
     * a user interaction. We therefore expose the
     * Listen button as the reliable fallback.
     */
    const timer = window.setTimeout(() => {
      speak();
    }, 300);

    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, [autoPlay, speak, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  if (!isSupported) {
    return (
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-300">
        Your browser does not support text-to-speech.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={isSpeaking ? stop : speak}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
      >
        <span className="text-lg">
          {isSpeaking ? "⏹" : "🔊"}
        </span>

        {isSpeaking
          ? "Stop Reading"
          : "Listen"}
      </button>

      {isSpeaking && (
        <span className="flex items-center gap-2 text-xs text-blue-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
          Reading...
        </span>
      )}
    </div>
  );
}
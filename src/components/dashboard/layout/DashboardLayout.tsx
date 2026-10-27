



"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Mic,
  MicOff,
  Volume2,
  X,
} from "lucide-react";

import DashboardSidebar from "../DashboardSidebar";
import DashboardHeader from "../DashboardHeader";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";

export type DashboardRole = "student" | "admin";

interface DashboardLayoutProps {
  children: ReactNode;
  role: DashboardRole;
  className?: string;
}

interface VoiceRecognitionAlternative {
  transcript: string;
}

interface VoiceRecognitionResult {
  0: VoiceRecognitionAlternative;
  isFinal: boolean;
}

interface VoiceRecognitionResultList {
  [index: number]: VoiceRecognitionResult;
  length: number;
}

interface VoiceRecognitionEvent {
  resultIndex: number;
  results: VoiceRecognitionResultList;
}

interface VoiceRecognitionErrorEvent {
  error: string;
}

interface VoiceRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((event: VoiceRecognitionEvent) => void)
    | null;
  onerror:
    | ((event: VoiceRecognitionErrorEvent) => void)
    | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface VoiceWindow extends Window {
  SpeechRecognition?: new () => VoiceRecognition;
  webkitSpeechRecognition?: new () => VoiceRecognition;
}

export default function DashboardLayout({
  children,
  role,
  className,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [voiceError, setVoiceError] = useState("");

  const recognitionRef = useRef<VoiceRecognition | null>(null);

  const {
    user,
    isAuthenticated,
  } = useAuthStore();

  /* ============================================================
     QUIZ HOST DETECTION
  ============================================================ */

  const isQuizHost =
    pathname.startsWith("/student/quiz-board/") &&
    pathname.endsWith("/play") &&
    searchParams.get("role") === "host";

  const isAdminQuizHost =
    isQuizHost && user?.role === "ADMIN";

  /* ============================================================
     AUTHENTICATION / AUTHORIZATION
  ============================================================ */

  useEffect(() => {
    if (!isAuthenticated || !user) {
      const loginUrl =
        `/auth/login?redirect=${encodeURIComponent(pathname)}`;

      router.replace(loginUrl);
      return;
    }

    if (isAdminQuizHost) {
      setCheckingAuth(false);
      return;
    }

    if (role === "student") {
      const allowedStudentRoles = ["USER", "STUDENT"];

      if (!allowedStudentRoles.includes(user.role)) {
        console.warn(
          "Unauthorized student dashboard access:",
          user.role,
        );

        router.replace("/");
        return;
      }
    }

    if (role === "admin" && user.role !== "ADMIN") {
      console.warn(
        "Unauthorized admin dashboard access:",
        user.role,
      );

      router.replace("/");
      return;
    }

    setCheckingAuth(false);
  }, [
    isAuthenticated,
    user,
    role,
    pathname,
    router,
    isAdminQuizHost,
  ]);

  /* ============================================================
     VOICE RESPONSE
  ============================================================ */

  const speak = useCallback((message: string) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-NG";
    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  /* ============================================================
     VOICE COMMAND PROCESSING
  ============================================================ */

  const processVoiceCommand = useCallback(
    (spokenText: string) => {
      const command = spokenText
        .toLowerCase()
        .replace(/[.,!?]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!command) {
        setVoiceMessage("I didn't hear a command. Please try again.");
        return;
      }

      setVoiceError("");
      setVoiceMessage(`You said: "${spokenText}"`);

      // The wake phrase is optional while the microphone is active.
      const normalizedCommand = command
        .replace(/^hey\s+learnyfi\s+/, "")
        .replace(/^hello\s+learnyfi\s+/, "")
        .replace(/^learnyfi\s+/, "")
        .trim();

      const goTo = (
        route: string,
        destination: string,
      ) => {
        setVoiceMessage(`Opening ${destination}...`);
        speak(`Opening ${destination}.`);
        router.push(route);
      };

      /* --------------------------------------------------------
         DASHBOARD
      -------------------------------------------------------- */

      if (
        /^(go to|open|show me|take me to)\s+(my\s+)?dashboard$/.test(
          normalizedCommand,
        ) ||
        normalizedCommand === "dashboard"
      ) {
        goTo("/student", "your dashboard");
        return;
      }

      /* --------------------------------------------------------
         SOLVE AND WIN CASH
      -------------------------------------------------------- */

      if (
        normalizedCommand.includes("solve and win cash") ||
        normalizedCommand.includes("solve win cash")
      ) {
        goTo(
          "/student/solve-and-win-cash",
          "Solve and Win Cash",
        );
        return;
      }

      /* --------------------------------------------------------
         WALLET
      -------------------------------------------------------- */

      if (
        normalizedCommand === "wallet" ||
        normalizedCommand.includes("open my wallet") ||
        normalizedCommand.includes("go to wallet") ||
        normalizedCommand.includes("open wallet")
      ) {
        goTo("/student/wallet", "your wallet");
        return;
      }

      /* --------------------------------------------------------
         CBT PRACTICE
      -------------------------------------------------------- */

      if (
        normalizedCommand.includes("cbt practice") ||
        normalizedCommand.includes("practice questions") ||
        normalizedCommand.includes("go to practice") ||
        normalizedCommand === "practice"
      ) {
        goTo("/student/practice", "CBT Practice");
        return;
      }

      /* --------------------------------------------------------
         WORD CHALLENGE
      -------------------------------------------------------- */

      if (
        normalizedCommand.includes("word challenge") ||
        normalizedCommand.includes("play word challenge")
      ) {
        goTo(
          "/student/games/word-challenge",
          "Word Challenge",
        );
        return;
      }

      /* --------------------------------------------------------
         PROFILE
      -------------------------------------------------------- */

      if (
        normalizedCommand.includes("my profile") ||
        normalizedCommand === "profile" ||
        normalizedCommand.includes("open profile")
      ) {
        goTo("/student/profile", "your profile");
        return;
      }

      /* --------------------------------------------------------
         BACK NAVIGATION
      -------------------------------------------------------- */

      if (
        normalizedCommand === "go back" ||
        normalizedCommand === "back" ||
        normalizedCommand === "previous page"
      ) {
        setVoiceMessage("Going back...");
        speak("Going back.");
        router.back();
        return;
      }

      /* --------------------------------------------------------
         STOP VOICE
      -------------------------------------------------------- */

      if (
        normalizedCommand === "stop listening" ||
        normalizedCommand === "turn off microphone"
      ) {
        recognitionRef.current?.stop();
        setVoiceMessage("Voice control stopped.");
        speak("Voice control stopped.");
        return;
      }

      /* --------------------------------------------------------
         UNKNOWN COMMAND
      -------------------------------------------------------- */

      const message =
        `Sorry, I don't recognize "${spokenText}". ` +
        "Try saying, go to Solve and Win Cash.";

      setVoiceMessage(message);
      speak(message);
    },
    [router, speak],
  );

  /* ============================================================
     START VOICE RECOGNITION
  ============================================================ */

  const startVoiceControl = useCallback(() => {
    if (typeof window === "undefined") return;

    const speechWindow = window as VoiceWindow;

    const Recognition =
      speechWindow.SpeechRecognition ??
      speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(
        "Voice recognition is not supported by this browser. " +
        "Please try the latest Google Chrome or Microsoft Edge.",
      );
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    setVoiceError("");
    setVoiceMessage("Listening... Say your command.");

    const recognition = new Recognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const result = event.results[event.resultIndex];

      if (!result?.isFinal) return;

      const transcript = result[0]?.transcript?.trim();

      if (transcript) {
        processVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
  setVoiceListening(false);

  switch (event.error) {
    case "not-allowed":
    case "service-not-allowed":
      setVoiceError(
        "Microphone access is blocked. Allow microphone access " +
          "in your browser settings, then try again.",
      );
      break;

    case "no-speech":
      setVoiceError(
        "I didn't hear anything. Check your microphone and try again.",
      );
      break;

    case "network":
      setVoiceError(
        "The speech recognition service could not connect. " +
          "Check your internet connection and try again. " +
          "If the problem continues, try Chrome or Edge.",
      );
      break;

    case "audio-capture":
      setVoiceError(
        "No microphone was detected. Check that your microphone " +
          "is connected and enabled.",
      );
      break;

    case "aborted":
      setVoiceMessage("Voice recognition stopped.");
      break;

    default:
      setVoiceError(
        `Voice recognition failed (${event.error}). Please try again.`,
      );
  }
};

    recognition.onend = () => {
      setVoiceListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setVoiceListening(true);
    } catch {
      setVoiceListening(false);
      setVoiceError(
        "Unable to start the microphone. Please try again.",
      );
    }
  }, [processVoiceCommand]);

  /* ============================================================
     STOP VOICE RECOGNITION ON UNMOUNT
  ============================================================ */

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* ============================================================
     SIDEBAR
  ============================================================ */

  const closeSidebar = () => setSidebarOpen(false);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (checkingAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

          <p className="mt-4 text-sm text-white/60">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     USER DISPLAY NAME
  ============================================================ */

  const userName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  /* ============================================================
     DASHBOARD
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <DashboardSidebar
          role={role}
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            role={role}
            userName={userName || "Student"}
            onMenuClick={toggleSidebar}
          />

          <main
            className={cn(
              "min-w-0 flex-1",
              "p-4 sm:p-6 lg:p-8",
              className,
            )}
          >
            {children}
          </main>
        </div>
      </div>

      {/* ========================================================
          LEARNYFI VOICE ASSISTANT
      ======================================================== */}

      {role === "student" && (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
          {(voiceMessage || voiceError) && (
            <div
              role="status"
              aria-live="polite"
              className="w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Volume2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <p
                    className={cn(
                      "text-sm leading-6",
                      voiceError
                        ? "text-red-600"
                        : "text-slate-700",
                    )}
                  >
                    {voiceError || voiceMessage}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setVoiceMessage("");
                    setVoiceError("");
                  }}
                  aria-label="Dismiss voice message"
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {!voiceError && (
                <p className="mt-2 text-xs text-slate-500">
                  Try: "Learnyfi, go to Solve and Win Cash."
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={
              voiceListening
                ? () => recognitionRef.current?.stop()
                : startVoiceControl
            }
            aria-label={
              voiceListening
                ? "Stop voice control"
                : "Start voice control"
            }
            aria-pressed={voiceListening}
            className={cn(
              "flex items-center gap-3 rounded-full px-5 py-4",
              "font-semibold text-white shadow-xl transition",
              "focus-visible:outline-none focus-visible:ring-4",
              "focus-visible:ring-blue-300",
              voiceListening
                ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-200"
                : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-200",
            )}
          >
            {voiceListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}

            <span>
              {voiceListening
                ? "Stop listening"
                : "Ask Learnyfi"}
            </span>

            {voiceListening && (
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
















// "use client";

// import {
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";

// import {
//   usePathname,
//   useRouter,
//   useSearchParams,
// } from "next/navigation";

// import DashboardSidebar from "../DashboardSidebar";
// import DashboardHeader from "../DashboardHeader";

// import { cn } from "@/lib/utils";

// import { useAuthStore } from "@/stores";

// export type DashboardRole =
//   | "student"
//   | "admin";

// interface DashboardLayoutProps {
//   children: ReactNode;
//   role: DashboardRole;
//   className?: string;
// }

// export default function DashboardLayout({
//   children,
//   role,
//   className,
// }: DashboardLayoutProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const [sidebarOpen, setSidebarOpen] =
//     useState(false);

//   const [checkingAuth, setCheckingAuth] =
//     useState(true);

//   const {
//     user,
//     isAuthenticated,
//   } = useAuthStore();

//   /* ============================================================
//      QUIZ HOST DETECTION
//   ============================================================ */

//   const isQuizHost =
//     pathname.startsWith(
//       "/student/quiz-board/",
//     ) &&
//     pathname.endsWith("/play") &&
//     searchParams.get("role") === "host";

//   const isAdminQuizHost =
//     isQuizHost &&
//     user?.role === "ADMIN";

//   /* ============================================================
//      AUTHENTICATION / AUTHORIZATION
//   ============================================================ */

//   useEffect(() => {
//     /*
//      * Give Zustand a moment to initialize
//      * before deciding whether the user is
//      * authenticated.
//      */

//     if (!isAuthenticated || !user) {
//       const loginUrl =
//         `/auth/login?redirect=${encodeURIComponent(
//           pathname,
//         )}`;

//       router.replace(loginUrl);

//       return;
//     }

//     /*
//      * ==========================================================
//      * ADMIN QUIZ HOST
//      * ==========================================================
//      *
//      * An ADMIN can enter the student quiz-board play route
//      * ONLY when explicitly entering as the host:
//      *
//      * /student/quiz-board/[quizId]/play?role=host&roomId=...
//      *
//      * This does NOT give ADMIN access to the normal student
//      * dashboard.
//      */

//     if (isAdminQuizHost) {
//       setCheckingAuth(false);
//       return;
//     }

//     /*
//      * ==========================================================
//      * STUDENT DASHBOARD
//      * ==========================================================
//      *
//      * Backend uses USER as the normal student role.
//      *
//      * STUDENT is also accepted in case older accounts use
//      * that role.
//      */

//     if (role === "student") {
//       const allowedStudentRoles = [
//         "USER",
//         "STUDENT",
//       ];

//       if (
//         !allowedStudentRoles.includes(
//           user.role,
//         )
//       ) {
//         console.warn(
//           "Unauthorized student dashboard access:",
//           user.role,
//         );

//         router.replace("/");

//         return;
//       }
//     }

//     /*
//      * ==========================================================
//      * ADMIN DASHBOARD
//      * ==========================================================
//      */

//     if (role === "admin") {
//       if (user.role !== "ADMIN") {
//         console.warn(
//           "Unauthorized admin dashboard access:",
//           user.role,
//         );

//         router.replace("/");

//         return;
//       }
//     }

//     /*
//      * Everything passed.
//      */

//     setCheckingAuth(false);
//   }, [
//     isAuthenticated,
//     user,
//     role,
//     pathname,
//     router,
//     isAdminQuizHost,
//   ]);

//   /* ============================================================
//      SIDEBAR
//   ============================================================ */

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(
//       (previous) => !previous,
//     );
//   };

//   /* ============================================================
//      LOADING STATE
//   ============================================================ */

//   if (checkingAuth || !user) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-950">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

//           <p className="mt-4 text-sm text-white/60">
//             Checking your account...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* ============================================================
//      USER DISPLAY NAME
//   ============================================================ */

//   const userName = [
//     user.firstName,
//     user.lastName,
//   ]
//     .filter(Boolean)
//     .join(" ")
//     .trim();

//   /* ============================================================
//      DASHBOARD
//   ============================================================ */

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="flex min-h-screen">

//         {/* ======================================================
//             SIDEBAR
//         ====================================================== */}

//         <DashboardSidebar
//           role={role}
//           open={sidebarOpen}
//           onClose={closeSidebar}
//         />

//         {/* ======================================================
//             MAIN AREA
//         ====================================================== */}

//         <div className="flex min-w-0 flex-1 flex-col">

//           {/* ====================================================
//               HEADER
//           ==================================================== */}

//           <DashboardHeader
//             role={role}
//             userName={userName || "Student"}
//             onMenuClick={toggleSidebar}
//           />

//           {/* ====================================================
//               PAGE CONTENT
//           ==================================================== */}

//           <main
//             className={cn(
//               "min-w-0 flex-1",
//               "p-4 sm:p-6 lg:p-8",
//               className,
//             )}
//           >
//             {children}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }


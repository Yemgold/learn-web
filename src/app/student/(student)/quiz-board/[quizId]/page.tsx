// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   ArrowRight,
//   Award,
//   Check,
//   CheckCircle2,
//   ChevronRight,
//   Clock3,
//   Crown,
//   Flame,
//   Gamepad2,
//   Info,
//   Lock,
//   Medal,
//   Play,
//   Radio,
//   ShieldCheck,
//   Sparkles,
//   Trophy,
//   User,
//   Users,
//   X,
//   Zap,
// } from "lucide-react";

// type RoundNumber = 1 | 2 | 3 | 4 | 5;

// type Player = {
//   id: string;
//   name: string;
//   avatar: string;
//   points: number;
//   correct: number;
//   answered: boolean;
//   qualified: boolean;
//   eliminated: boolean;
// };

// type Question = {
//   id: string;
//   text: string;
//   options: {
//     label: string;
//     text: string;
//   }[];
//   correctAnswer: string;
// };

// type AnswerResponse = {
//   id: string;
//   playerName: string;
//   avatar: string;
//   answer: string;
//   responseTime: number;
//   isCorrect: boolean;
//   rank: number;
// };

// const ROUND_CONFIG: Record<
//   RoundNumber,
//   {
//     name: string;
//     players: number;
//     nextPlayers: number;
//   }
// > = {
//   1: {
//     name: "Round 1",
//     players: 20,
//     nextPlayers: 15,
//   },
//   2: {
//     name: "Round 2",
//     players: 15,
//     nextPlayers: 10,
//   },
//   3: {
//     name: "Round 3",
//     players: 10,
//     nextPlayers: 5,
//   },
//   4: {
//     name: "Round 4",
//     players: 5,
//     nextPlayers: 2,
//   },
//   5: {
//     name: "Final",
//     players: 2,
//     nextPlayers: 1,
//   },
// };

// const QUESTIONS: Question[] = [
//   {
//     id: "q1",
//     text: "Which organelle is primarily responsible for producing energy in a cell?",
//     options: [
//       { label: "A", text: "Nucleus" },
//       { label: "B", text: "Mitochondrion" },
//       { label: "C", text: "Ribosome" },
//       { label: "D", text: "Golgi apparatus" },
//     ],
//     correctAnswer: "B",
//   },
//   {
//     id: "q2",
//     text: "What is the powerhouse of the cell?",
//     options: [
//       { label: "A", text: "Chloroplast" },
//       { label: "B", text: "Nucleus" },
//       { label: "C", text: "Mitochondrion" },
//       { label: "D", text: "Vacuole" },
//     ],
//     correctAnswer: "C",
//   },
//   {
//     id: "q3",
//     text: "Which process do plants use to convert light energy into chemical energy?",
//     options: [
//       { label: "A", text: "Respiration" },
//       { label: "B", text: "Photosynthesis" },
//       { label: "C", text: "Transpiration" },
//       { label: "D", text: "Osmosis" },
//     ],
//     correctAnswer: "B",
//   },
//   {
//     id: "q4",
//     text: "Which blood cells are primarily responsible for fighting infections?",
//     options: [
//       { label: "A", text: "Red blood cells" },
//       { label: "B", text: "Platelets" },
//       { label: "C", text: "White blood cells" },
//       { label: "D", text: "Plasma cells" },
//     ],
//     correctAnswer: "C",
//   },
//   {
//     id: "q5",
//     text: "Which gas is required for aerobic respiration?",
//     options: [
//       { label: "A", text: "Nitrogen" },
//       { label: "B", text: "Oxygen" },
//       { label: "C", text: "Carbon dioxide" },
//       { label: "D", text: "Hydrogen" },
//     ],
//     correctAnswer: "B",
//   },
// ];

// const PLAYER_NAMES = [
//   "Daniel",
//   "Sarah",
//   "Michael",
//   "Blessing",
//   "David",
//   "Esther",
//   "Samuel",
//   "Grace",
//   "Joshua",
//   "Mary",
//   "Emmanuel",
//   "Deborah",
//   "Joseph",
//   "Joy",
//   "Benjamin",
//   "Peace",
//   "Caleb",
//   "Ruth",
//   "Nathan",
//   "Victoria",
// ];

// function createPlayers(): Player[] {
//   return PLAYER_NAMES.map((name, index) => ({
//     id: `player-${index + 1}`,
//     name,
//     avatar: name.charAt(0),
//     points: Math.floor(Math.random() * 40),
//     correct: Math.floor(Math.random() * 4),
//     answered: false,
//     qualified: true,
//     eliminated: false,
//   }));
// }

// function formatTime(seconds: number) {
//   const mins = Math.floor(seconds / 60)
//     .toString()
//     .padStart(2, "0");

//   const secs = Math.floor(seconds % 60)
//     .toString()
//     .padStart(2, "0");

//   return `${mins}:${secs}`;
// }

// export default function QuizBoardPage() {
//   const [players, setPlayers] = useState<Player[]>(createPlayers);

//   const [round, setRound] = useState<RoundNumber>(1);

//   const [questionIndex, setQuestionIndex] = useState(0);

//   const [timeLeft, setTimeLeft] = useState(15);

//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

//   const [answers, setAnswers] = useState<AnswerResponse[]>([]);

//   const [isJoined, setIsJoined] = useState(false);

//   const [gameStarted, setGameStarted] = useState(false);

//   const [isQuestionActive, setIsQuestionActive] = useState(true);

//   const [showRoundResult, setShowRoundResult] = useState(false);

//   const [finalWinner, setFinalWinner] = useState<string | null>(null);

//   const [finalScores, setFinalScores] = useState<
//     { name: string; score: number }[]
//   >([]);

//   const question = QUESTIONS[questionIndex % QUESTIONS.length];

//   const roundConfig = ROUND_CONFIG[round];

//   const activePlayers = useMemo(
//     () => players.filter((player) => !player.eliminated),
//     [players]
//   );

//   const qualifiedPlayers = useMemo(
//     () => players.filter((player) => player.qualified && !player.eliminated),
//     [players]
//   );

//   const currentPlayer = players.find((player) => player.id === "player-1");

//   /*
//    * MOCK TIMER
//    *
//    * Later this can be replaced by a server-provided timer.
//    */
//   useEffect(() => {
//     if (!gameStarted || !isQuestionActive || showRoundResult || finalWinner) {
//       return;
//     }

//     const timer = window.setInterval(() => {
//       setTimeLeft((current) => {
//         if (current <= 1) {
//           setIsQuestionActive(false);
//           return 0;
//         }

//         return current - 1;
//       });
//     }, 1000);

//     return () => window.clearInterval(timer);
//   }, [
//     gameStarted,
//     isQuestionActive,
//     showRoundResult,
//     finalWinner,
//   ]);

//   /*
//    * MOCK LIVE ANSWERS
//    *
//    * Simulates other students answering in real time.
//    */
//   useEffect(() => {
//     if (!gameStarted || !isQuestionActive || selectedAnswer) {
//       return;
//     }

//     setAnswers([]);

//     const active = players.filter(
//       (player) => !player.eliminated && player.id !== "player-1"
//     );

//     const shuffled = [...active].sort(() => Math.random() - 0.5);

//     const answerTimers = shuffled.slice(0, Math.min(8, shuffled.length)).map(
//       (player, index) => {
//         return window.setTimeout(() => {
//           const isCorrect = Math.random() > 0.25;

//           const responseTime = Number(
//             (1.1 + Math.random() * 8).toFixed(2)
//           );

//           const answerLetters = ["A", "B", "C", "D"];

//           const answer = isCorrect
//             ? question.correctAnswer
//             : answerLetters[
//                 Math.floor(Math.random() * answerLetters.length)
//               ];

//           setAnswers((current) => {
//             if (current.some((item) => item.id === player.id)) {
//               return current;
//             }

//             const newAnswer: AnswerResponse = {
//               id: player.id,
//               playerName: player.name,
//               avatar: player.avatar,
//               answer,
//               responseTime,
//               isCorrect,
//               rank: 0,
//             };

//             const updated = [...current, newAnswer]
//               .sort((a, b) => a.responseTime - b.responseTime)
//               .map((item, position) => ({
//                 ...item,
//                 rank: position + 1,
//               }));

//             return updated;
//           });

//           if (isCorrect) {
//             setPlayers((current) =>
//               current.map((item) =>
//                 item.id === player.id
//                   ? {
//                       ...item,
//                       answered: true,
//                       correct: item.correct + 1,
//                       points: item.points + 10,
//                     }
//                   : item
//               )
//             );
//           }
//         }, 800 + index * 700);
//       }
//     );

//     return () => {
//       answerTimers.forEach((timer) => window.clearTimeout(timer));
//     };
//   }, [
//     gameStarted,
//     isQuestionActive,
//     selectedAnswer,
//     question,
//     players,
//   ]);

//   function handleJoin() {
//     setIsJoined(true);
//   }

//   function handleStartGame() {
//     setGameStarted(true);
//     setIsQuestionActive(true);
//     setTimeLeft(15);
//     setQuestionIndex(0);
//     setAnswers([]);
//   }

//   function handleAnswer(answer: string) {
//     if (!isQuestionActive || selectedAnswer || !gameStarted) {
//       return;
//     }

//     setSelectedAnswer(answer);

//     const isCorrect = answer === question.correctAnswer;

//     const responseTime = Number(
//       (15 - timeLeft + Math.random() * 0.4).toFixed(2)
//     );

//     setAnswers((current) => {
//       const newAnswer: AnswerResponse = {
//         id: "player-1",
//         playerName: currentPlayer?.name || "You",
//         avatar: currentPlayer?.avatar || "Y",
//         answer,
//         responseTime,
//         isCorrect,
//         rank: 0,
//       };

//       const updated = [...current, newAnswer]
//         .sort((a, b) => a.responseTime - b.responseTime)
//         .map((item, index) => ({
//           ...item,
//           rank: index + 1,
//         }));

//       return updated;
//     });

//     if (isCorrect) {
//       setPlayers((current) =>
//         current.map((player) =>
//           player.id === "player-1"
//             ? {
//                 ...player,
//                 answered: true,
//                 correct: player.correct + 1,
//                 points: player.points + 10,
//               }
//             : player
//         )
//       );
//     }

//     setIsQuestionActive(false);
//   }

//   function handleNextQuestion() {
//     setQuestionIndex((current) => current + 1);
//     setSelectedAnswer(null);
//     setAnswers([]);
//     setTimeLeft(15);
//     setIsQuestionActive(true);
//   }

//   function handleAdvanceRound() {
//     if (round === 5) {
//       handleFinishFinal();
//       return;
//     }

//     const required = ROUND_CONFIG[round].nextPlayers;

//     const sortedPlayers = [...players]
//       .filter((player) => !player.eliminated)
//       .sort((a, b) => {
//         if (b.correct !== a.correct) {
//           return b.correct - a.correct;
//         }

//         return b.points - a.points;
//       });

//     const survivors = sortedPlayers.slice(0, required);

//     setPlayers((current) =>
//       current.map((player) => {
//         const survived = survivors.some(
//           (survivor) => survivor.id === player.id
//         );

//         if (player.eliminated) {
//           return player;
//         }

//         return {
//           ...player,
//           qualified: survived,
//           eliminated: !survived,
//           answered: false,
//         };
//       })
//     );

//     setShowRoundResult(true);
//   }

//   function startNextRound() {
//     const nextRound = Math.min(round + 1, 5) as RoundNumber;

//     setRound(nextRound);

//     setQuestionIndex(0);

//     setSelectedAnswer(null);

//     setAnswers([]);

//     setTimeLeft(15);

//     setShowRoundResult(false);

//     setIsQuestionActive(true);
//   }

//   function handleFinishFinal() {
//     const finalists = players.filter(
//       (player) => !player.eliminated
//     );

//     const scores = finalists.map((player) => ({
//       name: player.name,
//       score: player.points + Math.floor(Math.random() * 40),
//     }));

//     scores.sort((a, b) => b.score - a.score);

//     setFinalScores(scores);

//     setFinalWinner(scores[0]?.name || "Winner");

//     setIsQuestionActive(false);
//   }

//   function resetGame() {
//     setPlayers(createPlayers());
//     setRound(1);
//     setQuestionIndex(0);
//     setTimeLeft(15);
//     setSelectedAnswer(null);
//     setAnswers([]);
//     setIsJoined(false);
//     setGameStarted(false);
//     setIsQuestionActive(true);
//     setShowRoundResult(false);
//     setFinalWinner(null);
//     setFinalScores([]);
//   }

//   const fastestCorrectAnswers = answers
//     .filter((answer) => answer.isCorrect)
//     .sort((a, b) => a.responseTime - b.responseTime);

//   const sortedPlayers = [...activePlayers].sort(
//     (a, b) => b.points - a.points
//   );

//   /*
//    * LOBBY
//    */
//   if (!isJoined) {
//     return (
//       <main className="min-h-screen bg-slate-950 text-white">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
//           <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
//         </div>

//         <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
//           <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr]">
//             <section className="flex flex-col justify-center">
//               <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300">
//                 <Radio className="h-4 w-4 animate-pulse" />
//                 LIVE QUIZ BOARD
//               </div>

//               <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
//                 Be the fastest.
//                 <span className="block bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
//                   Be the smartest.
//                 </span>
//               </h1>

//               <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
//                 Compete against other students in a live elimination quiz.
//                 Answer quickly, qualify for the next round and fight your way
//                 to the final.
//               </p>

//               <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 {[
//                   ["20", "Players"],
//                   ["5", "Rounds"],
//                   ["20", "Final Qs"],
//                   ["1", "Winner"],
//                 ].map(([value, label]) => (
//                   <div
//                     key={label}
//                     className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
//                   >
//                     <p className="text-2xl font-black">{value}</p>
//                     <p className="mt-1 text-xs text-slate-500">{label}</p>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
//                     Next Game
//                   </p>

//                   <h2 className="mt-2 text-2xl font-black">
//                     Quiz Board #001
//                   </h2>
//                 </div>

//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
//                   <Gamepad2 className="h-6 w-6" />
//                 </div>
//               </div>

//               <div className="mt-7 space-y-3">
//                 <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-4">
//                   <div className="flex items-center gap-3">
//                     <Users className="h-5 w-5 text-cyan-400" />

//                     <span className="text-sm text-slate-300">
//                       Players
//                     </span>
//                   </div>

//                   <span className="font-black">20 / 20</span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-4">
//                   <div className="flex items-center gap-3">
//                     <Zap className="h-5 w-5 text-amber-400" />

//                     <span className="text-sm text-slate-300">
//                       Entry Fee
//                     </span>
//                   </div>

//                   <span className="font-black">5 CBT Points</span>
//                 </div>

//                 <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-4">
//                   <div className="flex items-center gap-3">
//                     <Trophy className="h-5 w-5 text-violet-400" />

//                     <span className="text-sm text-slate-300">
//                       Winner Reward
//                     </span>
//                   </div>

//                   <span className="font-black text-emerald-400">
//                     100 Points
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={handleJoin}
//                 className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 font-black shadow-lg shadow-violet-900/30 transition hover:scale-[1.01] hover:from-violet-500 hover:to-indigo-500"
//               >
//                 Join Quiz Board
//                 <ArrowRight className="h-5 w-5" />
//               </button>

//               <p className="mt-4 text-center text-xs text-slate-500">
//                 Entry fee will be deducted when connected to your wallet
//                 backend.
//               </p>
//             </section>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * FINAL WINNER SCREEN
//    */
//   if (finalWinner) {
//     return (
//       <main className="min-h-screen bg-slate-950 text-white">
//         <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10">
//           <div className="w-full text-center">
//             <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-amber-400/30">
//               <Crown className="h-12 w-12 text-amber-400" />
//             </div>

//             <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-amber-400">
//               Quiz Board Champion
//             </p>

//             <h1 className="mt-3 text-5xl font-black sm:text-7xl">
//               {finalWinner}
//             </h1>

//             <p className="mx-auto mt-5 max-w-xl text-slate-400">
//               The final battle is over. After 20 questions, one student
//               emerged as the Quiz Board champion.
//             </p>

//             <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
//               {finalScores.map((score, index) => (
//                 <div
//                   key={score.name}
//                   className={`flex items-center justify-between border-b border-white/5 p-5 last:border-0 ${
//                     index === 0 ? "bg-amber-400/10" : ""
//                   }`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 font-black">
//                       {index + 1}
//                     </div>

//                     <div className="text-left">
//                       <p className="font-bold">{score.name}</p>

//                       {index === 0 && (
//                         <p className="text-xs text-amber-400">
//                           Champion
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <p className="font-black">{score.score} pts</p>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={resetGame}
//               className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 transition hover:bg-slate-200"
//             >
//               <Play className="h-5 w-5" />
//               Start Another Demo
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * ROUND RESULT
//    */
//   if (showRoundResult) {
//     const survivors = players
//       .filter((player) => player.qualified && !player.eliminated)
//       .sort((a, b) => b.points - a.points);

//     return (
//       <main className="min-h-screen bg-slate-950 text-white">
//         <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10">
//           <div className="w-full">
//             <div className="text-center">
//               <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/30">
//                 <CheckCircle2 className="h-10 w-10 text-emerald-400" />
//               </div>

//               <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
//                 Round Complete
//               </p>

//               <h1 className="mt-2 text-4xl font-black">
//                 {roundConfig.name} Results
//               </h1>

//               <p className="mt-3 text-slate-400">
//                 {survivors.length} students qualified for the next round.
//               </p>
//             </div>

//             <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-4">
//               <div className="mb-3 flex items-center justify-between px-3">
//                 <p className="text-sm font-bold text-slate-300">
//                   Qualified Students
//                 </p>

//                 <p className="text-sm font-black text-emerald-400">
//                   {survivors.length} / {roundConfig.nextPlayers}
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 {survivors.map((player, index) => (
//                   <div
//                     key={player.id}
//                     className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-3"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-sm font-black text-violet-300">
//                         {index + 1}
//                       </div>

//                       <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 font-black">
//                         {player.avatar}
//                       </div>

//                       <span className="font-semibold">
//                         {player.name}
//                       </span>
//                     </div>

//                     <span className="font-black">
//                       {player.points} pts
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-8 text-center">
//               <button
//                 onClick={startNextRound}
//                 className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 font-black shadow-lg shadow-violet-900/30"
//               >
//                 {round === 4 ? "Start Final" : "Continue to Next Round"}
//                 <ArrowRight className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * MAIN QUIZ BOARD
//    */
//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       {/* HEADER */}
//       <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
//         <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
//               <Gamepad2 className="h-5 w-5" />
//             </div>

//             <div>
//               <p className="text-sm font-black">Quiz Board</p>

//               <div className="flex items-center gap-2 text-[11px] text-slate-500">
//                 <span className="flex items-center gap-1 text-emerald-400">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                   LIVE
//                 </span>

//                 <span>•</span>

//                 <span>Room #001</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
//               <Users className="h-4 w-4 text-cyan-400" />

//               <span className="text-xs font-bold">
//                 {activePlayers.length}/20
//               </span>
//             </div>

//             <div className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2">
//               <Zap className="h-4 w-4 text-amber-400" />

//               <span className="text-xs font-black text-amber-300">
//                 5
//               </span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-7">
//         {/* ROUND PROGRESSION */}
//         <section className="mb-6">
//           <div className="mb-3 flex items-center justify-between">
//             <div>
//               <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
//                 Elimination
//               </p>

//               <h2 className="mt-1 text-xl font-black">
//                 Race to the Final
//               </h2>
//             </div>

//             <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
//               <Radio className="h-4 w-4 text-emerald-400" />
//               Live Competition
//             </div>
//           </div>

//           <div className="grid grid-cols-5 gap-2">
//             {([1, 2, 3, 4, 5] as RoundNumber[]).map(
//               (roundNumber) => {
//                 const config = ROUND_CONFIG[roundNumber];

//                 const isActive = round === roundNumber;

//                 const isCompleted = roundNumber < round;

//                 return (
//                   <div
//                     key={roundNumber}
//                     className={`relative overflow-hidden rounded-2xl border p-3 transition ${
//                       isActive
//                         ? "border-violet-400/40 bg-violet-500/15"
//                         : isCompleted
//                           ? "border-emerald-400/20 bg-emerald-400/5"
//                           : "border-white/10 bg-white/[0.03]"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span
//                         className={`text-[10px] font-black uppercase ${
//                           isActive
//                             ? "text-violet-300"
//                             : isCompleted
//                               ? "text-emerald-400"
//                               : "text-slate-600"
//                         }`}
//                       >
//                         {config.name}
//                       </span>

//                       {isCompleted && (
//                         <Check className="h-3.5 w-3.5 text-emerald-400" />
//                       )}

//                       {isActive && (
//                         <Radio className="h-3.5 w-3.5 animate-pulse text-violet-400" />
//                       )}
//                     </div>

//                     <p className="mt-2 text-lg font-black">
//                       {config.players}
//                     </p>

//                     <p className="text-[10px] text-slate-500">
//                       → {config.nextPlayers}
//                     </p>
//                   </div>
//                 );
//               }
//             )}
//           </div>
//         </section>

//         {/* MAIN GRID */}
//         <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
//           <div className="space-y-5">
//             {/* QUESTION */}
//             <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
//               <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
//                     <Sparkles className="h-5 w-5" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-black uppercase tracking-wider text-violet-300">
//                       {round === 5
//                         ? `Final Question ${questionIndex + 1}/20`
//                         : `Question ${questionIndex + 1}`}
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       First correct response gets the highest position.
//                     </p>
//                   </div>
//                 </div>

//                 <div
//                   className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
//                     timeLeft <= 5
//                       ? "bg-red-500/15 text-red-400"
//                       : "bg-slate-900 text-slate-300"
//                   }`}
//                 >
//                   <Clock3 className="h-4 w-4" />

//                   <span className="font-mono text-sm font-black">
//                     {formatTime(timeLeft)}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-5 sm:p-8">
//                 <div className="mx-auto max-w-4xl">
//                   <div className="mb-7">
//                     <p className="text-center text-2xl font-black leading-tight sm:text-3xl">
//                       {question.text}
//                     </p>
//                   </div>

//                   <div className="grid gap-3 sm:grid-cols-2">
//                     {question.options.map((option) => {
//                       const isSelected =
//                         selectedAnswer === option.label;

//                       const isCorrect =
//                         option.label === question.correctAnswer;

//                       const showCorrect =
//                         selectedAnswer && isCorrect;

//                       const showWrong =
//                         selectedAnswer === option.label &&
//                         !isCorrect;

//                       return (
//                         <button
//                           key={option.label}
//                           disabled={!isQuestionActive}
//                           onClick={() => handleAnswer(option.label)}
//                           className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
//                             showCorrect
//                               ? "border-emerald-400/50 bg-emerald-400/10"
//                               : showWrong
//                                 ? "border-red-400/50 bg-red-400/10"
//                                 : isSelected
//                                   ? "border-violet-400/50 bg-violet-400/10"
//                                   : "border-white/10 bg-slate-900/60 hover:border-violet-400/40 hover:bg-violet-400/5"
//                           } ${
//                             !isQuestionActive
//                               ? "cursor-default"
//                               : "cursor-pointer"
//                           }`}
//                         >
//                           <span
//                             className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
//                               showCorrect
//                                 ? "bg-emerald-400 text-slate-950"
//                                 : showWrong
//                                   ? "bg-red-400 text-white"
//                                   : "bg-slate-800 text-slate-300 group-hover:bg-violet-500 group-hover:text-white"
//                             }`}
//                           >
//                             {showCorrect ? (
//                               <Check className="h-5 w-5" />
//                             ) : showWrong ? (
//                               <X className="h-5 w-5" />
//                             ) : (
//                               option.label
//                             )}
//                           </span>

//                           <span className="text-sm font-bold leading-5 text-slate-200">
//                             {option.text}
//                           </span>
//                         </button>
//                       );
//                     })}
//                   </div>

//                   {selectedAnswer && (
//                     <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-center">
//                       <p className="text-sm font-bold text-slate-300">
//                         Your answer:{" "}
//                         <span className="text-violet-300">
//                           {selectedAnswer}
//                         </span>
//                       </p>

//                       <p className="mt-1 text-xs text-slate-500">
//                         {selectedAnswer === question.correctAnswer
//                           ? "Correct answer!"
//                           : `Correct answer: ${question.correctAnswer}`}
//                       </p>
//                     </div>
//                   )}

//                   {!isQuestionActive && !selectedAnswer && (
//                     <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-center">
//                       <p className="font-bold text-red-300">
//                         Time is up!
//                       </p>

//                       <p className="mt-1 text-xs text-slate-500">
//                         Waiting for the board to process responses.
//                       </p>
//                     </div>
//                   )}

//                   {selectedAnswer && (
//                     <button
//                       onClick={handleNextQuestion}
//                       className="mx-auto mt-5 flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-200"
//                     >
//                       Next Question
//                       <ChevronRight className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </section>

//             {/* FASTEST ANSWERS */}
//             <section className="rounded-3xl border border-white/10 bg-white/[0.04]">
//               <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <Flame className="h-5 w-5 text-orange-400" />

//                     <h2 className="font-black">
//                       Fastest Correct Answers
//                     </h2>
//                   </div>

//                   <p className="mt-1 text-xs text-slate-500">
//                     Live response order
//                   </p>
//                 </div>

//                 <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase text-emerald-400">
//                   LIVE
//                 </span>
//               </div>

//               <div className="p-4">
//                 {fastestCorrectAnswers.length === 0 ? (
//                   <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
//                     <Radio className="mx-auto h-7 w-7 animate-pulse text-slate-600" />

//                     <p className="mt-3 text-sm font-bold text-slate-500">
//                       Waiting for answers...
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     {fastestCorrectAnswers.map((answer) => (
//                       <div
//                         key={answer.id}
//                         className={`flex items-center justify-between rounded-2xl p-3 ${
//                           answer.rank === 1
//                             ? "border border-amber-400/20 bg-amber-400/10"
//                             : "bg-slate-900/60"
//                         }`}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
//                               answer.rank === 1
//                                 ? "bg-amber-400 text-slate-950"
//                                 : "bg-slate-800 text-slate-300"
//                             }`}
//                           >
//                             {answer.rank === 1 ? (
//                               <Zap className="h-4 w-4" />
//                             ) : (
//                               answer.rank
//                             )}
//                           </div>

//                           <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-xs font-black text-violet-300">
//                             {answer.avatar}
//                           </div>

//                           <div>
//                             <p className="text-sm font-bold">
//                               {answer.playerName}
//                               {answer.id === "player-1" && (
//                                 <span className="ml-2 rounded-full bg-violet-400/10 px-2 py-0.5 text-[9px] text-violet-300">
//                                   YOU
//                                 </span>
//                               )}
//                             </p>

//                             <p className="text-[11px] text-slate-500">
//                               Answered{" "}
//                               <span className="font-black text-emerald-400">
//                                 {answer.answer}
//                               </span>
//                             </p>
//                           </div>
//                         </div>

//                         <div className="text-right">
//                           <p className="font-mono text-sm font-black text-emerald-400">
//                             {answer.responseTime.toFixed(2)}s
//                           </p>

//                           {answer.rank === 1 && (
//                             <p className="text-[9px] font-black uppercase text-amber-400">
//                               Fastest
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </section>
//           </div>

//           {/* RIGHT SIDEBAR */}
//           <aside className="space-y-5">
//             {/* QUALIFICATION */}
//             <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-black uppercase tracking-wider text-slate-500">
//                     Qualification
//                   </p>

//                   <p className="mt-1 text-2xl font-black">
//                     {qualifiedPlayers.length}
//                     <span className="text-slate-600">
//                       /{roundConfig.nextPlayers}
//                     </span>
//                   </p>
//                 </div>

//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
//                   <ShieldCheck className="h-5 w-5" />
//                 </div>
//               </div>

//               <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
//                 <div
//                   className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
//                   style={{
//                     width: `${Math.min(
//                       100,
//                       (qualifiedPlayers.length /
//                         roundConfig.nextPlayers) *
//                         100
//                     )}%`,
//                   }}
//                 />
//               </div>

//               <p className="mt-3 text-xs leading-5 text-slate-500">
//                 Top {roundConfig.nextPlayers} players advance to the next
//                 round.
//               </p>
//             </section>

//             {/* CURRENT PLAYER */}
//             <section className="rounded-3xl border border-violet-400/20 bg-violet-500/5 p-5">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs font-black uppercase tracking-wider text-violet-300">
//                   Your Position
//                 </p>

//                 <User className="h-4 w-4 text-violet-400" />
//               </div>

//               <div className="mt-4 flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-black">
//                   {currentPlayer?.avatar}
//                 </div>

//                 <div>
//                   <p className="font-black">
//                     {currentPlayer?.name}
//                   </p>

//                   <p className="text-xs text-slate-500">
//                     {currentPlayer?.points} points
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-4 grid grid-cols-2 gap-2">
//                 <div className="rounded-xl bg-slate-900/70 p-3">
//                   <p className="text-[10px] uppercase text-slate-600">
//                     Correct
//                   </p>

//                   <p className="mt-1 text-lg font-black">
//                     {currentPlayer?.correct}
//                   </p>
//                 </div>

//                 <div className="rounded-xl bg-slate-900/70 p-3">
//                   <p className="text-[10px] uppercase text-slate-600">
//                     Status
//                   </p>

//                   <p className="mt-1 text-sm font-black text-emerald-400">
//                     Qualified
//                   </p>
//                 </div>
//               </div>
//             </section>

//             {/* LEADERBOARD */}
//             <section className="rounded-3xl border border-white/10 bg-white/[0.04]">
//               <div className="border-b border-white/10 px-5 py-4">
//                 <div className="flex items-center gap-2">
//                   <Trophy className="h-5 w-5 text-amber-400" />

//                   <h2 className="font-black">Live Standings</h2>
//                 </div>
//               </div>

//               <div className="max-h-[420px] overflow-y-auto p-3">
//                 <div className="space-y-1">
//                   {sortedPlayers.map((player, index) => (
//                     <div
//                       key={player.id}
//                       className={`flex items-center justify-between rounded-xl p-3 ${
//                         player.id === "player-1"
//                           ? "bg-violet-500/10 ring-1 ring-violet-400/20"
//                           : "hover:bg-white/[0.03]"
//                       }`}
//                     >
//                       <div className="flex min-w-0 items-center gap-2">
//                         <span className="w-5 text-center text-[10px] font-black text-slate-600">
//                           {index + 1}
//                         </span>

//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-black">
//                           {player.avatar}
//                         </div>

//                         <div className="min-w-0">
//                           <p className="truncate text-xs font-bold">
//                             {player.name}
//                           </p>

//                           <p className="text-[9px] text-slate-600">
//                             {player.correct} correct
//                           </p>
//                         </div>
//                       </div>

//                       <span className="ml-2 text-xs font-black">
//                         {player.points}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>
//           </aside>
//         </div>

//         {/* BOTTOM CONTROLS */}
//         <section className="mt-5 rounded-3xl border border-amber-400/10 bg-amber-400/[0.03] p-4">
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-start gap-3">
//               <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

//               <div>
//                 <p className="text-sm font-bold text-slate-300">
//                   Frontend Demo Mode
//                 </p>

//                 <p className="mt-1 text-xs leading-5 text-slate-500">
//                   Answers, timers, players and round progression are
//                   simulated locally. Backend authority can replace these
//                   states later.
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={handleAdvanceRound}
//                 className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-emerald-400"
//               >
//                 <Medal className="h-4 w-4" />
//                 Finish Round
//               </button>

//               <button
//                 onClick={resetGame}
//                 className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-slate-300 transition hover:bg-white/[0.08]"
//               >
//                 Reset Demo
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* FINAL ROUND INFORMATION */}
//         {round === 5 && (
//           <section className="mt-5 overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-r from-amber-400/10 via-orange-400/5 to-transparent p-5">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex items-start gap-3">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
//                   <Crown className="h-6 w-6" />
//                 </div>

//                 <div>
//                   <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
//                     Final Battle
//                   </p>

//                   <h2 className="mt-1 text-xl font-black">
//                     Two finalists. Twenty questions. One champion.
//                   </h2>

//                   <p className="mt-1 text-xs text-slate-500">
//                     The winner is determined by total final-round points.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 px-4 py-3">
//                 <Lock className="h-4 w-4 text-amber-400" />

//                 <span className="text-xs font-bold text-slate-300">
//                   Final scoring active
//                 </span>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* FOOTER */}
//         <footer className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-5 text-[10px] text-slate-600 sm:flex-row">
//           <p>
//             Quiz Board • Real-time competitive learning
//           </p>

//           <div className="flex items-center gap-2">
//             <ShieldCheck className="h-3.5 w-3.5" />
//             <span>Competition protected</span>
//           </div>
//         </footer>
//       </div>
//     </main>
//   );
// }


















"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Check,
  ChevronRight,
  Clock3,
  Crown,
  Flame,
  Lock,
  Medal,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
  X,
} from "lucide-react";

type RoundNumber = 1 | 2 | 3 | 4 | 5;

type Player = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  responseTime?: number;
  status: "active" | "qualified" | "eliminated" | "winner";
};

type AnswerRecord = {
  playerId: string;
  playerName: string;
  answer: string;
  time: number;
  correct: boolean;
};

type Question = {
  id: number;
  question: string;
  options: {
    id: "A" | "B" | "C" | "D";
    text: string;
  }[];
  correctAnswer: "A" | "B" | "C" | "D";
};

const ROUND_CONFIG: Record<
  RoundNumber,
  {
    name: string;
    players: number;
    qualifiers: number;
  }
> = {
  1: {
    name: "Opening Round",
    players: 20,
    qualifiers: 15,
  },
  2: {
    name: "Elimination Round",
    players: 15,
    qualifiers: 10,
  },
  3: {
    name: "Pressure Round",
    players: 10,
    qualifiers: 5,
  },
  4: {
    name: "Semi-Final",
    players: 5,
    qualifiers: 2,
  },
  5: {
    name: "Grand Final",
    players: 2,
    qualifiers: 1,
  },
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question:
      "Which organelle is primarily responsible for producing ATP during aerobic respiration?",
    options: [
      { id: "A", text: "Nucleus" },
      { id: "B", text: "Ribosome" },
      { id: "C", text: "Mitochondrion" },
      { id: "D", text: "Golgi apparatus" },
    ],
    correctAnswer: "C",
  },
  {
    id: 2,
    question:
      "Which blood vessel carries oxygenated blood from the lungs to the heart?",
    options: [
      { id: "A", text: "Pulmonary artery" },
      { id: "B", text: "Pulmonary vein" },
      { id: "C", text: "Aorta" },
      { id: "D", text: "Vena cava" },
    ],
    correctAnswer: "B",
  },
  {
    id: 3,
    question: "What is the main site of gaseous exchange in the human lungs?",
    options: [
      { id: "A", text: "Bronchi" },
      { id: "B", text: "Trachea" },
      { id: "C", text: "Alveoli" },
      { id: "D", text: "Diaphragm" },
    ],
    correctAnswer: "C",
  },
  {
    id: 4,
    question:
      "Which process describes the movement of water molecules through a selectively permeable membrane?",
    options: [
      { id: "A", text: "Diffusion" },
      { id: "B", text: "Osmosis" },
      { id: "C", text: "Active transport" },
      { id: "D", text: "Transpiration" },
    ],
    correctAnswer: "B",
  },
  {
    id: 5,
    question: "Which part of the brain is mainly responsible for balance and coordination?",
    options: [
      { id: "A", text: "Cerebrum" },
      { id: "B", text: "Medulla" },
      { id: "C", text: "Cerebellum" },
      { id: "D", text: "Hypothalamus" },
    ],
    correctAnswer: "C",
  },
];

const INITIAL_PLAYERS: Player[] = [
  {
    id: "p1",
    name: "David",
    avatar: "DA",
    score: 0,
    status: "active",
  },
  {
    id: "p2",
    name: "Sarah",
    avatar: "SA",
    score: 0,
    status: "active",
  },
  {
    id: "p3",
    name: "Michael",
    avatar: "MI",
    score: 0,
    status: "active",
  },
  {
    id: "p4",
    name: "John",
    avatar: "JO",
    score: 0,
    status: "active",
  },
  {
    id: "p5",
    name: "Blessing",
    avatar: "BL",
    score: 0,
    status: "active",
  },
  {
    id: "p6",
    name: "Daniel",
    avatar: "DN",
    score: 0,
    status: "active",
  },
  {
    id: "p7",
    name: "Mary",
    avatar: "MA",
    score: 0,
    status: "active",
  },
  {
    id: "p8",
    name: "Samuel",
    avatar: "SA",
    score: 0,
    status: "active",
  },
  {
    id: "p9",
    name: "Esther",
    avatar: "ES",
    score: 0,
    status: "active",
  },
  {
    id: "p10",
    name: "Emmanuel",
    avatar: "EM",
    score: 0,
    status: "active",
  },
  {
    id: "p11",
    name: "Grace",
    avatar: "GR",
    score: 0,
    status: "active",
  },
  {
    id: "p12",
    name: "Peter",
    avatar: "PE",
    score: 0,
    status: "active",
  },
  {
    id: "p13",
    name: "Joy",
    avatar: "JO",
    score: 0,
    status: "active",
  },
  {
    id: "p14",
    name: "Ibrahim",
    avatar: "IB",
    score: 0,
    status: "active",
  },
  {
    id: "p15",
    name: "Faith",
    avatar: "FA",
    score: 0,
    status: "active",
  },
  {
    id: "p16",
    name: "Joshua",
    avatar: "JU",
    score: 0,
    status: "active",
  },
  {
    id: "p17",
    name: "Ruth",
    avatar: "RU",
    score: 0,
    status: "active",
  },
  {
    id: "p18",
    name: "Victor",
    avatar: "VI",
    score: 0,
    status: "active",
  },
  {
    id: "p19",
    name: "Helen",
    avatar: "HE",
    score: 0,
    status: "active",
  },
  {
    id: "p20",
    name: "Anthony",
    avatar: "AN",
    score: 0,
    status: "active",
  },
];

const MOCK_ANSWERS: AnswerRecord[] = [
  {
    playerId: "p4",
    playerName: "John",
    answer: "C",
    time: 1.82,
    correct: true,
  },
  {
    playerId: "p7",
    playerName: "Mary",
    answer: "C",
    time: 2.14,
    correct: true,
  },
  {
    playerId: "p1",
    playerName: "David",
    answer: "C",
    time: 2.71,
    correct: true,
  },
  {
    playerId: "p9",
    playerName: "Esther",
    answer: "A",
    time: 3.02,
    correct: false,
  },
  {
    playerId: "p3",
    playerName: "Michael",
    answer: "C",
    time: 3.44,
    correct: true,
  },
];

export default function QuizBoardPage() {
  const [round, setRound] = useState<RoundNumber>(1);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);

  const [questionIndex, setQuestionIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(10);

  const [selectedAnswer, setSelectedAnswer] = useState<
    "A" | "B" | "C" | "D" | null
  >(null);

  const [showAnswer, setShowAnswer] = useState(false);

  const [answers, setAnswers] = useState<AnswerRecord[]>(MOCK_ANSWERS);

  const [isJoined, setIsJoined] = useState(true);

  const [gameStarted, setGameStarted] = useState(true);

  const currentQuestion = QUESTIONS[questionIndex];

  const roundConfig = ROUND_CONFIG[round];

  const qualifiedCount = useMemo(() => {
    if (round === 5) {
      return 2;
    }

    return Math.max(
      0,
      players.filter((player) => player.status === "qualified").length,
    );
  }, [players, round]);

  const activePlayers = useMemo(
    () => players.filter((player) => player.status !== "eliminated"),
    [players],
  );

  const sortedAnswers = useMemo(
    () => [...answers].sort((a, b) => a.time - b.time),
    [answers],
  );

  useEffect(() => {
    if (!gameStarted || showAnswer) return;

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setShowAnswer(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, showAnswer, questionIndex]);

  const handleAnswer = (answer: "A" | "B" | "C" | "D") => {
    if (showAnswer || selectedAnswer) return;

    setSelectedAnswer(answer);

    const responseTime = Math.max(0.5, 10 - timeLeft);

    setAnswers((current) => [
      ...current,
      {
        playerId: "current-user",
        playerName: "You",
        answer,
        time: Number(responseTime.toFixed(2)),
        correct: answer === currentQuestion.correctAnswer,
      },
    ]);

    setShowAnswer(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeLeft(10);

    setQuestionIndex((current) => {
      if (current >= QUESTIONS.length - 1) {
        return 0;
      }

      return current + 1;
    });

    setAnswers([]);
  };

  const advanceRound = () => {
    if (round >= 5) return;

    const nextRound = (round + 1) as RoundNumber;

    setRound(nextRound);

    const nextQualifierCount = ROUND_CONFIG[nextRound].qualifiers;

    setPlayers((current) =>
      current.map((player, index) => ({
        ...player,
        status:
          index < nextQualifierCount ? "qualified" : "eliminated",
      })),
    );

    setQuestionIndex(0);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setAnswers(MOCK_ANSWERS);
  };

  const resetGame = () => {
    setRound(1);
    setPlayers(INITIAL_PLAYERS);
    setQuestionIndex(0);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setAnswers(MOCK_ANSWERS);
    setGameStarted(true);
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight sm:text-lg">
                  Quiz Board
                </h1>

                <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-red-600">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Live
                </span>
              </div>

              <p className="hidden text-xs text-slate-500 sm:block">
                Fastest correct answer wins the race
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
              <Zap className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Entry
                </p>
                <p className="text-sm font-black">5 CBT Points</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-white">
              <Users className="h-4 w-4" />
              <span className="text-sm font-black">
                {activePlayers.length}/20
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        {/* ========================================================= */}
        {/* ROUND PROGRESSION */}
        {/* ========================================================= */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                Competition Progress
              </p>

              <h2 className="text-xl font-black sm:text-2xl">
                20 Players. One Champion.
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5">
              <Trophy className="h-5 w-5 text-indigo-600" />

              <div>
                <p className="text-[10px] font-bold uppercase text-indigo-400">
                  Current Round
                </p>

                <p className="text-sm font-black text-indigo-700">
                  Round {round} — {roundConfig.name}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {([1, 2, 3, 4, 5] as RoundNumber[]).map((roundNumber) => {
              const config = ROUND_CONFIG[roundNumber];

              const isCurrent = round === roundNumber;
              const isComplete = roundNumber < round;

              return (
                <div key={roundNumber} className="relative">
                  <div
                    className={[
                      "flex min-h-[74px] flex-col justify-between rounded-xl border p-3 transition",
                      isCurrent
                        ? "border-indigo-300 bg-indigo-50"
                        : isComplete
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200 bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={[
                          "text-[10px] font-black uppercase",
                          isCurrent
                            ? "text-indigo-600"
                            : isComplete
                              ? "text-emerald-600"
                              : "text-slate-400",
                        ].join(" ")}
                      >
                        Round {roundNumber}
                      </span>

                      {isComplete ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-black">
                        {config.players} → {config.qualifiers}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        {config.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* MAIN GRID */}
        {/* ========================================================= */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
          {/* ======================================================= */}
          {/* LEFT */}
          {/* ======================================================= */}

          <section className="space-y-6">
            {/* LIVE QUESTION CARD */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* Question top bar */}

              <div className="border-b border-slate-100 bg-slate-950 px-5 py-4 text-white sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                        Round {round}
                      </span>

                      <span className="text-white/40">•</span>

                      <span className="text-xs font-bold text-white/70">
                        Question {questionIndex + 1}
                      </span>
                    </div>

                    <p className="text-xs text-white/50">
                      First correct response qualifies ahead of slower
                      competitors
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                    <Clock3 className="h-4 w-4 text-amber-300" />

                    <span
                      className={[
                        "font-mono text-lg font-black",
                        timeLeft <= 3 ? "text-red-300" : "text-white",
                      ].join(" ")}
                    >
                      00:{String(timeLeft).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                {/* Progress */}

                <div className="mb-7">
                  <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Question Progress</span>
                    <span>
                      {questionIndex + 1}/{QUESTIONS.length}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{
                        width: `${
                          ((questionIndex + 1) / QUESTIONS.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question */}

                <div className="mx-auto max-w-4xl text-center">
                  <p className="mb-8 text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                    {currentQuestion.question}
                  </p>

                  {/* Answers */}

                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedAnswer === option.id;
                      const isCorrect =
                        showAnswer &&
                        option.id === currentQuestion.correctAnswer;
                      const isWrong =
                        showAnswer &&
                        isSelected &&
                        option.id !== currentQuestion.correctAnswer;

                      return (
                        <button
                          key={option.id}
                          onClick={() => handleAnswer(option.id)}
                          disabled={showAnswer || !isJoined}
                          className={[
                            "group relative flex min-h-[76px] items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-all duration-200",
                            !showAnswer &&
                            !selectedAnswer
                              ? "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-md"
                              : "",
                            isSelected && !showAnswer
                              ? "border-indigo-500 bg-indigo-50"
                              : "",
                            isCorrect
                              ? "border-emerald-500 bg-emerald-50"
                              : "",
                            isWrong ? "border-red-500 bg-red-50" : "",
                            showAnswer &&
                            !isCorrect &&
                            !isWrong
                              ? "border-slate-200 opacity-60"
                              : "",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black transition",
                              isCorrect
                                ? "bg-emerald-500 text-white"
                                : isWrong
                                  ? "bg-red-500 text-white"
                                  : "bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700",
                            ].join(" ")}
                          >
                            {isCorrect ? (
                              <Check className="h-5 w-5" />
                            ) : isWrong ? (
                              <X className="h-5 w-5" />
                            ) : (
                              option.id
                            )}
                          </span>

                          <span className="text-sm font-bold leading-relaxed sm:text-base">
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Answer status */}

                {showAnswer && (
                  <div className="mx-auto mt-7 flex max-w-4xl flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-emerald-800">
                          Correct answer:{" "}
                          {currentQuestion.correctAnswer}
                        </p>

                        <p className="text-xs text-emerald-700">
                          The response board has been updated.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
                    >
                      Next Question
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ===================================================== */}
            {/* FASTEST ANSWERS */}
            {/* ===================================================== */}

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />

                    <h2 className="text-lg font-black">
                      Fastest Correct Answers
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Live response order for this question
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {sortedAnswers.length} responses
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {sortedAnswers.length === 0 ? (
                  <div className="p-10 text-center">
                    <Clock3 className="mx-auto mb-3 h-8 w-8 text-slate-300" />

                    <p className="text-sm font-bold text-slate-500">
                      Waiting for responses...
                    </p>
                  </div>
                ) : (
                  sortedAnswers.map((answer, index) => (
                    <div
                      key={`${answer.playerId}-${index}`}
                      className={[
                        "flex items-center gap-3 px-5 py-4 transition",
                        index === 0 && answer.correct
                          ? "bg-amber-50/60"
                          : "",
                      ].join(" ")}
                    >
                      <div className="flex w-8 justify-center">
                        {index === 0 && answer.correct ? (
                          <Crown className="h-5 w-5 text-amber-500" />
                        ) : (
                          <span className="text-sm font-black text-slate-400">
                            #{index + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                        {answer.playerName
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black">
                          {answer.playerName}
                        </p>

                        <p className="text-xs text-slate-500">
                          Selected answer {answer.answer}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={[
                            "font-mono text-sm font-black",
                            answer.correct
                              ? "text-emerald-600"
                              : "text-red-500",
                          ].join(" ")}
                        >
                          {answer.time.toFixed(2)}s
                        </p>

                        <p
                          className={[
                            "text-[9px] font-black uppercase",
                            answer.correct
                              ? "text-emerald-500"
                              : "text-red-400",
                          ].join(" ")}
                        >
                          {answer.correct ? "Correct" : "Wrong"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* ======================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ======================================================= */}

          <aside className="space-y-6">
            {/* QUALIFICATION */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-500">
                    Qualification
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Next Round
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                </div>
              </div>

              <div className="mb-3 flex items-end justify-between">
                <div>
                  <span className="text-3xl font-black tracking-tight">
                    {round === 5 ? 2 : roundConfig.qualifiers}
                  </span>

                  <span className="ml-1 text-sm font-bold text-slate-400">
                    players
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-400">
                  of {roundConfig.players}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{
                    width: `${
                      round === 5
                        ? 100
                        : Math.min(
                            100,
                            (qualifiedCount /
                              roundConfig.qualifiers) *
                              100,
                          )
                    }%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>
                  {round === 5
                    ? "Finalists ready"
                    : `${qualifiedCount} qualified`}
                </span>

                <span>
                  {round === 5
                    ? "2 → 1"
                    : `${roundConfig.players} → ${roundConfig.qualifiers}`}
                </span>
              </div>
            </div>

            {/* CURRENT PLAYER */}

            <div className="overflow-hidden rounded-3xl border border-indigo-200 bg-indigo-600 text-white shadow-sm">
              <div className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-200">
                      Your Position
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      You are in the race
                    </h2>
                  </div>

                  <Sparkles className="h-6 w-6 text-indigo-200" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-sm font-black">
                    YO
                  </div>

                  <div>
                    <p className="font-black">You</p>

                    <p className="text-xs text-indigo-200">
                      {selectedAnswer
                        ? "Answer submitted"
                        : "Waiting for your answer"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-[9px] font-bold uppercase text-indigo-200">
                      Round
                    </p>

                    <p className="mt-1 text-lg font-black">
                      {round}/5
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-[9px] font-bold uppercase text-indigo-200">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-black">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PLAYERS */}

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-lg font-black">
                    Players
                  </h2>

                  <p className="text-xs text-slate-500">
                    Live competition board
                  </p>
                </div>

                <Users className="h-5 w-5 text-slate-400" />
              </div>

              <div className="max-h-[430px] divide-y divide-slate-100 overflow-y-auto">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <span className="w-5 text-center text-[10px] font-black text-slate-400">
                      {index + 1}
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-600">
                      {player.avatar}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black">
                        {player.name}
                      </p>

                      <p className="text-[9px] font-bold text-slate-400">
                        {player.score} points
                      </p>
                    </div>

                    {player.status === "qualified" ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase text-emerald-600">
                        Qualified
                      </span>
                    ) : player.status === "eliminated" ? (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-[8px] font-black uppercase text-red-500">
                        Out
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ADMIN / DEMO CONTROLS */}

            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Play className="h-4 w-4 text-slate-500" />

                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Demo Controls
                </p>
              </div>

              <div className="grid gap-2">
                {round < 5 && (
                  <button
                    onClick={advanceRound}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white transition hover:bg-slate-800"
                  >
                    Simulate Next Round
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={resetGame}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-600 transition hover:bg-slate-100"
                >
                  Reset Demo
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ========================================================= */}
        {/* FINAL ROUND PANEL */}
        {/* ========================================================= */}

        {round === 5 && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-5 py-7 text-white sm:px-8">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                  <Crown className="h-7 w-7" />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                  Grand Final
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                  Two Players. Twenty Questions. One Winner.
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                  The fastest-answer elimination is over. Both finalists
                  now compete across 20 questions. The player with the
                  highest total score becomes the Quiz Board Champion.
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
              {players
                .filter((player) => player.status !== "eliminated")
                .slice(0, 2)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    {index === 0 && (
                      <div className="absolute right-4 top-4">
                        <Medal className="h-6 w-6 text-amber-500" />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                        {player.avatar}
                      </div>

                      <div>
                        <p className="text-lg font-black">
                          {player.name}
                        </p>

                        <p className="text-xs font-bold text-slate-400">
                          Finalist #{index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-[9px] font-black uppercase text-slate-400">
                          Score
                        </p>

                        <p className="mt-1 text-xl font-black">
                          {player.score}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-[9px] font-black uppercase text-slate-400">
                          Questions
                        </p>

                        <p className="mt-1 text-xl font-black">
                          20
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-center">
              <p className="text-xs font-bold text-slate-500">
                Final scoring: correct answers earn points. Highest score
                after Question 20 wins the championship.
              </p>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* FOOTER INFO */}
        {/* ========================================================= */}

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Award className="h-4 w-4 text-indigo-500" />

            <p className="text-xs font-bold text-slate-500">
              Play fairly. Your response time is recorded by the server.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <Lock className="h-3.5 w-3.5" />
            Secure Competition
          </div>
        </div>
      </div>
    </main>
  );
}


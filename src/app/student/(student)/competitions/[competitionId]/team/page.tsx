





// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   Users,
//   Trophy,
//   Crown,
//   Copy,
//   Check,
//   Settings,
//   DoorOpen,
//   Loader2,
//   UserRound,
//   ShieldCheck,
//   Info,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface TeamMember {
//   id: string;
//   name: string;
//   email?: string;
//   avatar?: string;
//   isCaptain: boolean;
// }

// interface Team {
//   id: string;
//   name: string;
//   motto?: string;
//   description?: string;
//   code: string;
//   members: TeamMember[];
// }

// export default function MyTeamPage() {
//   const params = useParams();

//   const competitionId = params?.competitionId as string;

//   const [team, setTeam] = useState<Team | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [copied, setCopied] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function loadMyTeam() {
//       if (!competitionId) return;

//       try {
//         setLoading(true);
//         setError("");

//         /*
//          * CONNECT YOUR BACKEND API HERE.
//          *
//          * Example:
//          *
//          * const response = await getMyCompetitionTeam(
//          *   competitionId
//          * );
//          *
//          * setTeam(response.data);
//          *
//          * The backend should determine the team from:
//          *
//          *   authenticated user + competitionId
//          *
//          * The student should NOT have to provide
//          * their team code to view their own team.
//          */

//         // Temporary placeholder until the API is connected.
//         await new Promise((resolve) =>
//           setTimeout(resolve, 700)
//         );

//         setTeam(null);
//       } catch (err: any) {
//         if (err?.response?.status === 404) {
//           setTeam(null);
//         } else {
//           setError(
//             err?.response?.data?.message ||
//               err?.message ||
//               "Unable to load your team."
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadMyTeam();
//   }, [competitionId]);

//   async function handleCopyCode() {
//     if (!team?.code) return;

//     try {
//       await navigator.clipboard.writeText(team.code);

//       setCopied(true);

//       setTimeout(() => {
//         setCopied(false);
//       }, 2000);
//     } catch {
//       setError("Unable to copy the team code.");
//     }
//   }

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto max-w-5xl px-4 py-10">
//           <Link
//             href={`/student/competitions/${competitionId}`}
//             className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Competition
//           </Link>

//           <Card className="mt-8">
//             <div className="flex min-h-[420px] items-center justify-center">
//               <div className="text-center">
//                 <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />

//                 <p className="mt-4 text-sm text-slate-500">
//                   Loading your team...
//                 </p>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * NO TEAM
//    *
//    * This should normally happen when the student has not
//    * registered for a team in this competition.
//    */
//   if (!team) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto max-w-4xl px-4 py-10">
//           <Link
//             href={`/student/competitions/${competitionId}`}
//             className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Competition
//           </Link>

//           <Card className="mt-8 p-8 text-center">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
//               <Users className="h-8 w-8 text-slate-500" />
//             </div>

//             <h1 className="mt-6 text-3xl font-bold text-slate-900">
//               You Are Not on a Team
//             </h1>

//             <p className="mx-auto mt-3 max-w-xl text-slate-600">
//               You haven't joined or created a team for this
//               competition yet.
//             </p>

//             {error && (
//               <div className="mx-auto mt-6 max-w-xl rounded-xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700">
//                 {error}
//               </div>
//             )}

//             <div className="mt-8">
//               <Link
//                 href={`/student/competitions/${competitionId}/team/register`}
//               >
//                 <Button size="lg">
//                   Join / Create Team
//                 </Button>
//               </Link>
//             </div>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   const isCaptain = team.members.some(
//     (member) => member.isCaptain
//   );

//   const memberCount = team.members.length;
//   const maxMembers = 3;
//   const remainingSlots = Math.max(
//     0,
//     maxMembers - memberCount
//   );

//   const isTeamFull = memberCount >= maxMembers;

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto max-w-5xl px-4 py-10">
//         {/* Back */}
//         <Link
//           href={`/student/competitions/${competitionId}`}
//           className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Competition
//         </Link>

//         {/* Header */}
//         <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
//               <Trophy className="h-8 w-8 text-blue-600" />
//             </div>

//             <div>
//               <p className="text-sm font-semibold text-blue-600">
//                 Competition Team
//               </p>

//               <h1 className="text-3xl font-bold text-slate-900">
//                 {team.name}
//               </h1>

//               {team.motto && (
//                 <p className="mt-1 text-slate-600">
//                   {team.motto}
//                 </p>
//               )}
//             </div>
//           </div>

//           {isCaptain && (
//             <Link
//               href={`/student/competitions/${competitionId}/team/remove`}
//             >
//               <Button
//                 type="button"
//                 variant="outline"
//               >
//                 <Settings className="mr-2 h-4 w-4" />
//                 Manage Team
//               </Button>
//             </Link>
//           )}
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {/* Team Code */}
//         <Card className="mt-8 overflow-hidden">
//           <div className="border-b border-blue-100 bg-blue-50 px-6 py-6">
//             <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <ShieldCheck className="h-5 w-5 text-blue-600" />

//                   <p className="text-sm font-semibold text-blue-700">
//                     Team Code
//                   </p>
//                 </div>

//                 <p className="mt-2 text-3xl font-bold tracking-[0.2em] text-blue-950">
//                   {team.code}
//                 </p>

//                 <p className="mt-2 max-w-xl text-sm text-blue-700">
//                   Share this code with your friends so they can
//                   join your team for this competition.
//                 </p>
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleCopyCode}
//               >
//                 {copied ? (
//                   <>
//                     <Check className="mr-2 h-4 w-4" />
//                     Copied
//                   </>
//                 ) : (
//                   <>
//                     <Copy className="mr-2 h-4 w-4" />
//                     Copy Code
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </Card>

//         {/* Team Status */}
//         <div className="mt-6 grid gap-6 md:grid-cols-3">
//           <Card className="p-6">
//             <Users className="h-6 w-6 text-blue-600" />

//             <p className="mt-4 text-sm text-slate-500">
//               Team Members
//             </p>

//             <p className="mt-1 text-2xl font-bold text-slate-900">
//               {memberCount} / {maxMembers}
//             </p>
//           </Card>

//           <Card className="p-6">
//             <Trophy className="h-6 w-6 text-yellow-500" />

//             <p className="mt-4 text-sm text-slate-500">
//               Team Status
//             </p>

//             <p className="mt-1 text-2xl font-bold text-slate-900">
//               {isTeamFull ? "Ready" : "Incomplete"}
//             </p>
//           </Card>

//           <Card className="p-6">
//             <Crown className="h-6 w-6 text-amber-500" />

//             <p className="mt-4 text-sm text-slate-500">
//               Your Role
//             </p>

//             <p className="mt-1 text-2xl font-bold text-slate-900">
//               {isCaptain ? "Captain" : "Member"}
//             </p>
//           </Card>
//         </div>

//         {/* Team Members */}
//         <Card className="mt-6 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900">
//                 Team Members
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Everyone currently registered on your team.
//               </p>
//             </div>

//             <Users className="h-6 w-6 text-blue-600" />
//           </div>

//           <div className="mt-6 space-y-3">
//             {team.members.map((member) => (
//               <div
//                 key={member.id}
//                 className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
//               >
//                 {/* Avatar */}
//                 {member.avatar ? (
//                   <img
//                     src={member.avatar}
//                     alt={member.name}
//                     className="h-12 w-12 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
//                     {member.name
//                       .charAt(0)
//                       .toUpperCase()}
//                   </div>
//                 )}

//                 {/* Member information */}
//                 <div className="min-w-0 flex-1">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <p className="font-semibold text-slate-900">
//                       {member.name}
//                     </p>

//                     {member.isCaptain && (
//                       <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
//                         <Crown className="h-3 w-3" />
//                         Captain
//                       </span>
//                     )}
//                   </div>

//                   {member.email && (
//                     <p className="mt-1 truncate text-sm text-slate-500">
//                       {member.email}
//                     </p>
//                   )}
//                 </div>

//                 {/* Member icon */}
//                 <div className="hidden rounded-full bg-slate-100 p-2 sm:block">
//                   {member.isCaptain ? (
//                     <Crown className="h-4 w-4 text-amber-600" />
//                   ) : (
//                     <UserRound className="h-4 w-4 text-slate-500" />
//                   )}
//                 </div>
//               </div>
//             ))}

//             {/* Empty slots */}
//             {remainingSlots > 0 && (
//               <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
//                 <div className="flex items-start gap-3">
//                   <Info className="mt-0.5 h-5 w-5 text-blue-600" />

//                   <div>
//                     <p className="font-semibold text-slate-800">
//                       {remainingSlots}{" "}
//                       {remainingSlots === 1
//                         ? "team slot"
//                         : "team slots"}{" "}
//                       remaining
//                     </p>

//                     <p className="mt-1 text-sm leading-6 text-slate-600">
//                       Share your team code with friends so they
//                       can join before the team is full.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Team Details */}
//         {(team.motto || team.description) && (
//           <Card className="mt-6 p-6">
//             <h2 className="text-2xl font-bold text-slate-900">
//               Team Details
//             </h2>

//             {team.motto && (
//               <div className="mt-5">
//                 <p className="text-sm font-medium text-slate-500">
//                   Motto
//                 </p>

//                 <p className="mt-1 text-lg font-semibold text-slate-900">
//                   {team.motto}
//                 </p>
//               </div>
//             )}

//             {team.description && (
//               <div className="mt-5">
//                 <p className="text-sm font-medium text-slate-500">
//                   Description
//                 </p>

//                 <p className="mt-2 leading-7 text-slate-600">
//                   {team.description}
//                 </p>
//               </div>
//             )}
//           </Card>
//         )}

//         {/* Actions */}
//         <div className="mt-8 flex flex-col gap-4 sm:flex-row">
//           <Link
//             href={`/student/competitions/${competitionId}/room`}
//             className="w-full"
//           >
//             <Button
//               type="button"
//               fullWidth
//               size="lg"
//               disabled={!isTeamFull}
//             >
//               <DoorOpen className="mr-2 h-5 w-5" />
//               {isTeamFull
//                 ? "Enter Competition Room"
//                 : "Complete Team to Continue"}
//             </Button>
//           </Link>

//           <Link
//             href={`/student/competitions/${competitionId}/teams`}
//             className="w-full"
//           >
//             <Button
//               type="button"
//               fullWidth
//               size="lg"
//               variant="outline"
//             >
//               <Users className="mr-2 h-5 w-5" />
//               View Other Teams
//             </Button>
//           </Link>
//         </div>

//         {/* Captain notice */}
//         {isCaptain && (
//           <Card className="mt-6 border-amber-200 bg-amber-50 p-5">
//             <div className="flex gap-3">
//               <Crown className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

//               <div>
//                 <h3 className="font-semibold text-amber-900">
//                   You are the Team Captain
//                 </h3>

//                 <p className="mt-1 text-sm leading-6 text-amber-800">
//                   You are responsible for managing your team.
//                   You can remove a team member or manage the
//                   team from the Manage Team page.
//                 </p>

//                 <Link
//                   href={`/student/competitions/${competitionId}/team/remove`}
//                   className="mt-3 inline-flex text-sm font-semibold text-amber-900 underline"
//                 >
//                   Manage Team
//                 </Link>
//               </div>
//             </div>
//           </Card>
//         )}
//       </div>
//     </main>
//   );
// }















"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Trophy,
  Crown,
  Copy,
  Check,
  Settings,
  DoorOpen,
  UserRound,
  ShieldCheck,
  Info,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  name: string;
  role: "Captain" | "Member";
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  motto: string;
  description: string;
  code: string;
  members: TeamMember[];
}

export default function MyTeamPage() {
  const params = useParams();

  const competitionId = params?.competitionId as string;

  const [copied, setCopied] = useState(false);

  // TEMPORARY UI DATA
  // Replace this with your backend response later.
  const team: Team = {
    id: "team-001",
    name: "Future Doctors",
    motto: "Learn Together. Compete Together. Win Together.",
    description:
      "We are a team of ambitious students preparing to compete, learn, and achieve the best possible result in this competition.",
    code: "FD8K2P",
    members: [
      {
        id: "student-001",
        name: "John Doe",
        role: "Captain",
      },
      {
        id: "student-002",
        name: "Mary Johnson",
        role: "Member",
      },
      {
        id: "student-003",
        name: "David James",
        role: "Member",
      },
    ],
  };

  const memberCount = team.members.length;
  const maxMembers = 3;
  const remainingSlots = Math.max(
    0,
    maxMembers - memberCount
  );

  const isTeamFull = memberCount >= maxMembers;

  // TEMPORARY:
  // This simulates the logged-in student being the captain.
  const isCaptain = true;

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(team.code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      console.error("Unable to copy team code");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Back */}
        <Link
          href={`/student/competitions/${competitionId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competition
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-blue-600">
                  My Competition Team
                </p>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Team Created
                </span>
              </div>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {team.name}
              </h1>

              <p className="mt-1 text-slate-600">
                {team.motto}
              </p>
            </div>
          </div>

          {/* Captain Management */}
          {isCaptain && (
            <Link
              href={`/student/competitions/${competitionId}/team/remove`}
            >
              <Button
                type="button"
                variant="outline"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
            </Link>
          )}
        </div>

        {/* Team Code */}
        <Card className="mt-8 overflow-hidden border-blue-200">
          <div className="bg-blue-50 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />

                  <p className="text-sm font-semibold text-blue-700">
                    Your Team Code
                  </p>
                </div>

                <p className="mt-2 text-3xl font-bold tracking-[0.2em] text-blue-950">
                  {team.code}
                </p>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-700">
                  Share this code with your friends so they can
                  join your team for this competition.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Team Statistics */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <Users className="h-6 w-6 text-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Team Members
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {memberCount} / {maxMembers}
            </p>
          </Card>

          <Card className="p-6">
            <Trophy className="h-6 w-6 text-yellow-500" />

            <p className="mt-4 text-sm text-slate-500">
              Team Status
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              {isTeamFull ? "Ready" : "Incomplete"}
            </p>
          </Card>

          <Card className="p-6">
            <Crown className="h-6 w-6 text-amber-500" />

            <p className="mt-4 text-sm text-slate-500">
              Your Role
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {isCaptain ? "Captain" : "Member"}
            </p>
          </Card>
        </div>

        {/* Team Members */}
        <Card className="mt-6 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Team Members
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Students currently registered on your team.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Users className="h-4 w-4" />
              {memberCount} / {maxMembers}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
              >
                {/* Avatar */}
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                    {member.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                {/* Member Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">
                      {member.name}
                    </p>

                    {member.role === "Captain" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        <Crown className="h-3 w-3" />
                        Captain
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {member.role}
                  </p>
                </div>

                {/* Member Icon */}
                <div className="hidden rounded-full bg-slate-100 p-2 sm:block">
                  {member.role === "Captain" ? (
                    <Crown className="h-4 w-4 text-amber-600" />
                  ) : (
                    <UserRound className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Remaining Slots */}
          {remainingSlots > 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <p className="font-semibold text-slate-800">
                    {remainingSlots}{" "}
                    {remainingSlots === 1
                      ? "slot"
                      : "slots"}{" "}
                    remaining
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Share your team code with friends to fill
                    the remaining team slot.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Team Details */}
        <Card className="mt-6 p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Team Details
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Team Name
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {team.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Team Motto
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {team.motto}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Description
              </p>

              <p className="mt-2 leading-7 text-slate-600">
                {team.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Captain Information */}
        {isCaptain && (
          <Card className="mt-6 border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <Crown className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <h3 className="font-semibold text-amber-900">
                  You are the Team Captain
                </h3>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  You created this team. Share the team code
                  with your friends and manage your team members
                  when necessary.
                </p>

                <Link
                  href={`/student/competitions/${competitionId}/team/remove`}
                  className="mt-3 inline-flex text-sm font-semibold text-amber-900 underline"
                >
                  Manage Team Members
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/student/competitions/${competitionId}/room`}
            className="w-full"
          >
            <Button
              type="button"
              fullWidth
              size="lg"
            >
              <DoorOpen className="mr-2 h-5 w-5" />
              Competition Room
            </Button>
          </Link>

          <Link
            href={`/student/competitions/${competitionId}/teams`}
            className="w-full"
          >
            <Button
              type="button"
              fullWidth
              size="lg"
              variant="outline"
            >
              <Users className="mr-2 h-5 w-5" />
              View Other Teams
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

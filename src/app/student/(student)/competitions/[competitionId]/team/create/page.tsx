






"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Users,
  ArrowLeft,
  Info,
  Coins,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateTeamPage() {
  const router = useRouter();
  const params = useParams();

  const competitionId = params?.competitionId as string;

  const [loading, setLoading] = useState(false);
  const [teamCode, setTeamCode] = useState("");
  const [created, setCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setError("");

    const formData = new FormData(e.currentTarget);

    const teamName = String(formData.get("teamName") || "").trim();
    const motto = String(formData.get("motto") || "").trim();
    const description = String(
      formData.get("description") || ""
    ).trim();

    if (!teamName) {
      setError("Please enter a team name.");
      return;
    }

    if (!competitionId) {
      setError("Competition could not be identified.");
      return;
    }

    try {
      setLoading(true);

      /*
       * IMPORTANT:
       *
       * The backend should handle the 5 CBT point deduction.
       *
       * Expected backend flow:
       *
       * 1. Authenticate current user.
       * 2. Check wallet has >= 5 CBT points.
       * 3. Deduct exactly 5 CBT points.
       * 4. Create the team for this competition.
       * 5. Make the authenticated user the captain.
       * 6. Generate the team code.
       * 7. Return the created team and teamCode.
       *
       * Replace this block with your actual createTeam API call.
       */

      /*
      const response = await createTeam({
        competitionId,
        teamName,
        motto,
        description,
      });

      const code = response.data.teamCode;

      setTeamCode(code);
      setCreated(true);
      */

      // Temporary placeholder until the API is connected.
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      const temporaryCode = "TEAM-CODE";

      setTeamCode(temporaryCode);
      setCreated(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create your team. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function copyTeamCode() {
    if (!teamCode) return;

    try {
      await navigator.clipboard.writeText(teamCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the team code.");
    }
  }

  if (created) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-2xl px-4 py-10">
          <Link
            href="/student/team"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Team
          </Link>

          <Card className="mt-8 p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <ShieldCheck className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Team Created Successfully!
            </h1>

            <p className="mt-3 text-slate-600">
              Your team has been created and you are now the
              Team Captain.
            </p>

            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <p className="text-sm font-medium text-blue-800">
                Your Team Code
              </p>

              <div className="mt-3 flex items-center justify-center gap-3">
                <div className="rounded-xl bg-white px-5 py-3 text-2xl font-bold tracking-widest text-slate-900 shadow-sm">
                  {teamCode}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={copyTeamCode}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <p className="mt-4 text-sm text-blue-700">
                Send this code to your friends so they can
                join your team.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                fullWidth
                onClick={() =>
                  router.push(
                    `/student/competitions/${competitionId}/room`
                  )
                }
              >
                Go to Competition Room
              </Button>

              <Link
                href="/student/team"
                className="w-full"
              >
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                >
                  My Teams
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/competitions"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Competitions
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Users className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Create Team
              </h1>

              <p className="mt-2 text-slate-600">
                Form your JAMB League team and invite two
                teammates to compete together.
              </p>
            </div>
          </div>
        </div>

        {/* Team Requirements */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <div className="flex gap-4">
            <Info className="mt-1 h-6 w-6 shrink-0 text-blue-600" />

            <div>
              <h2 className="font-semibold text-blue-900">
                Team Requirements
              </h2>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-800">
                <li>
                  Each team consists of exactly 3 students.
                </li>

                <li>
                  The creator automatically becomes the Team
                  Captain.
                </li>

                <li>
                  Creating a team costs 5 CBT points.
                </li>

                <li>
                  The 5 CBT points will be deducted from your
                  wallet when the team is successfully created.
                </li>

                <li>
                  Your team code will be generated by the
                  backend.
                </li>

                <li>
                  Share the team code with your friends so
                  they can join your team.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Creation Fee */}
        <Card className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <Coins className="h-6 w-6 text-amber-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Team Creation Fee
              </p>

              <p className="text-2xl font-bold text-slate-900">
                5 CBT Points
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p>
              You need at least{" "}
              <span className="font-semibold text-slate-900">
                5 CBT points
              </span>{" "}
              in your wallet to create a team.
            </p>

            <p className="mt-1">
              The points are deducted by the backend only
              when your team is successfully created.
            </p>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        

  
{/* Form */}
<Card>
  <form
    onSubmit={onSubmit}
    className="space-y-6"
  >
    {/* Team Name */}
    <div>
      <label
        htmlFor="teamName"
        className="mb-2 block text-sm font-medium text-slate-900"
      >
        Team Name
      </label>

      <select
        id="teamName"
        name="teamName"
        defaultValue=""
        required
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >
        <option value="" disabled>
          Select a team name
        </option>

        <option value="Future Doctors">
          Future Doctors
        </option>

        <option value="JAMB Champions">
          JAMB Champions
        </option>

        <option value="Brain Builders">
          Brain Builders
        </option>

        <option value="Knowledge Kings">
          Knowledge Kings
        </option>

        <option value="Academic Titans">
          Academic Titans
        </option>

        <option value="The Achievers">
          The Achievers
        </option>

        <option value="Victory Squad">
          Victory Squad
        </option>

        <option value="Study Warriors">
          Study Warriors
        </option>

        <option value="Elite Scholars">
          Elite Scholars
        </option>
      </select>
    </div>

    {/* Team Motto */}
    <div>
      <label
        htmlFor="motto"
        className="mb-2 block text-sm font-medium text-slate-900"
      >
        Team Motto
      </label>

      <select
        id="motto"
        name="motto"
        defaultValue=""
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">
          Select a motto
        </option>

        <option value="Learning Together, Winning Together">
          Learning Together, Winning Together
        </option>

        <option value="Knowledge Is Our Superpower">
          Knowledge Is Our Superpower
        </option>

        <option value="Study Hard, Win Big">
          Study Hard, Win Big
        </option>

        <option value="Together We Can">
          Together We Can
        </option>

        <option value="One Team, One Goal">
          One Team, One Goal
        </option>

        <option value="Brains, Teamwork, Victory">
          Brains, Teamwork, Victory
        </option>

        <option value="Excellence Has No Limits">
          Excellence Has No Limits
        </option>

        <option value="We Learn. We Compete. We Win.">
          We Learn. We Compete. We Win.
        </option>
      </select>
    </div>

    {/* Team Description */}
    <div>
      <label
        htmlFor="description"
        className="mb-2 block text-sm font-medium text-slate-900"
      >
        Team Description
      </label>

      <select
        id="description"
        name="description"
        defaultValue=""
        required
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >
        <option value="" disabled>
          Select a team description
        </option>

        <option value="We are a team of dedicated students working together to achieve academic excellence and win the competition.">
          Dedicated students working for excellence
        </option>

        <option value="We believe in teamwork, consistency, and helping each other become better students.">
          Teamwork and consistency
        </option>

        <option value="Three determined students united by one goal: to learn, compete, and come out on top.">
          Three students, one goal
        </option>

        <option value="We challenge ourselves to learn more, think faster, and perform better together.">
          Learn, think, and perform
        </option>

        <option value="We support one another, share knowledge, and work together to achieve victory.">
          Supporting one another
        </option>
      </select>
    </div>

   




            {/* Confirmation */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <Coins className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div className="text-sm text-amber-900">
                  <p className="font-semibold">
                    5 CBT points will be charged
                  </p>

                  <p className="mt-1">
                    By creating this team, you authorize the
                    system to deduct 5 CBT points from your
                    wallet.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                type="submit"
                loading={loading}
                fullWidth
              >
                {loading
                  ? "Creating Team..."
                  : "Create Team — 5 CBT Points"}
              </Button>

              <Link
                href="/student/team"
                className="w-full"
              >
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        {/* Footer note */}
        <div className="mt-6 flex items-start gap-3 text-sm text-slate-500">
          <Users className="mt-0.5 h-4 w-4 shrink-0" />

          <p>
            After creation, you will receive a unique team
            code. Share the code with up to two friends to
            complete your team.
          </p>
        </div>
      </div>
    </main>
  );
}


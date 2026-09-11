




"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CompetitionSchedulePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [schedule, setSchedule] = useState({
    registrationStart: "2026-12-01T09:00",
    registrationEnd: "2027-01-10T23:59",
    competitionStart: "2027-01-15T10:00",
    competitionEnd: "2027-01-15T18:00",
    duration: "60",
    gracePeriod: "10",
  });

  const handleChange = (
    field: keyof typeof schedule,
    value: string,
  ) => {
    setSchedule((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);

    /*
     * TODO:
     * Replace this with the real backend request.
     *
     * Example:
     *
     * await updateCompetitionSchedule(competitionId, {
     *   registrationStart: schedule.registrationStart,
     *   registrationEnd: schedule.registrationEnd,
     *   competitionStart: schedule.competitionStart,
     *   competitionEnd: schedule.competitionEnd,
     *   duration: Number(schedule.duration),
     *   gracePeriod: Number(schedule.gracePeriod),
     * });
     */

    await new Promise((resolve) => setTimeout(resolve, 700));

    setIsSaving(false);
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">
        {/* Back */}
        <Link
          href="/admin/solveandwin/competitions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                Solve & Win
              </span>

              <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
                Schedule
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Competition Schedule
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Configure when registration opens, when the competition
              starts and ends, and how long participants have to
              complete the competition.
            </p>
          </div>

          <Button
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Schedule"}
          </Button>
        </div>

        {/* Competition Summary */}
        <Card className="mb-8 overflow-hidden">
          <div className="border-b border-slate-200 bg-white px-6 py-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-500" />

                  <h2 className="text-xl font-bold text-slate-900">
                    JAMB League 2027 Championship
                  </h2>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Upcoming
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Competition ID:{" "}
                  <span className="font-mono text-slate-700">
                    [competitionId]
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4" />
                425 / 1,000 Teams
              </div>
            </div>
          </div>
        </Card>

        {/* Saved Message */}
        {saved && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Competition schedule saved successfully.
          </div>
        )}

        {/* Schedule Configuration */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Registration */}
          <Card className="p-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registration Period
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Define when students and teams can register.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Input
                label="Registration Opens"
                type="datetime-local"
                value={schedule.registrationStart}
                onChange={(event) =>
                  handleChange(
                    "registrationStart",
                    event.target.value,
                  )
                }
              />

              <Input
                label="Registration Closes"
                type="datetime-local"
                value={schedule.registrationEnd}
                onChange={(event) =>
                  handleChange(
                    "registrationEnd",
                    event.target.value,
                  )
                }
              />
            </div>
          </Card>

          {/* Competition */}
          <Card className="p-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <CalendarDays className="h-6 w-6 text-green-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Competition Period
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Define when the competition becomes active.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Input
                label="Competition Starts"
                type="datetime-local"
                value={schedule.competitionStart}
                onChange={(event) =>
                  handleChange(
                    "competitionStart",
                    event.target.value,
                  )
                }
              />

              <Input
                label="Competition Ends"
                type="datetime-local"
                value={schedule.competitionEnd}
                onChange={(event) =>
                  handleChange(
                    "competitionEnd",
                    event.target.value,
                  )
                }
              />
            </div>
          </Card>

          {/* Duration */}
          <Card className="p-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                <Clock3 className="h-6 w-6 text-purple-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Competition Timing
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure the time available to each participant.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Input
                label="Attempt Duration"
                type="number"
                min="1"
                value={schedule.duration}
                onChange={(event) =>
                  handleChange("duration", event.target.value)
                }
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-500">
                  Duration
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {schedule.duration} minutes
                </p>
              </div>

              <Input
                label="Grace Period"
                type="number"
                min="0"
                value={schedule.gracePeriod}
                onChange={(event) =>
                  handleChange(
                    "gracePeriod",
                    event.target.value,
                  )
                }
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-500">
                  Grace period
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {schedule.gracePeriod} minutes
                </p>
              </div>
            </div>
          </Card>

          {/* Schedule Rules */}
          <Card className="p-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Schedule Rules
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Important rules that apply to this competition.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  Registration
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Participants cannot register after the registration
                  closing time.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  Competition Start
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Participants cannot begin their attempt before the
                  competition start time.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  Competition End
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  New attempts cannot begin after the competition end
                  time.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  Attempt Timer
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Once an attempt begins, the participant receives the
                  configured attempt duration.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline Preview */}
        <Card className="mt-8 p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">
              Schedule Preview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quick overview of the competition timeline.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <p className="text-sm font-semibold text-blue-700">
                Registration Opens
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                {schedule.registrationStart
                  ? new Date(
                      schedule.registrationStart,
                    ).toLocaleString()
                  : "Not configured"}
              </p>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <p className="text-sm font-semibold text-green-700">
                Competition Starts
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                {schedule.competitionStart
                  ? new Date(
                      schedule.competitionStart,
                    ).toLocaleString()
                  : "Not configured"}
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-semibold text-red-700">
                Competition Ends
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                {schedule.competitionEnd
                  ? new Date(
                      schedule.competitionEnd,
                    ).toLocaleString()
                  : "Not configured"}
              </p>
            </div>
          </div>
        </Card>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:justify-end">
          <Link href="/admin/solveandwin/competitions">
            <Button variant="outline">
              Cancel
            </Button>
          </Link>

          <Button
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Schedule"}
          </Button>
        </div>
      </div>
    </main>
  );
}

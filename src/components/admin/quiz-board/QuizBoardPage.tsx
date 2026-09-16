



"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Competition,
  getParticipantCount,
  getTotalQuestions,
  getQuizCompetitions,
  inferStatus,
} from "@/lib/api/quizBoard";

import QuizBoardHeader from "./QuizBoardHeader";
import QuizBoardError from "./QuizBoardError";
import QuizBoardLoading from "./QuizBoardLoading";
import LiveCompetitions from "./LiveCompetitions";
import OverviewSection from "./OverviewSection";
import StatusSummarySection from "./StatusSummarySection";
import CompetitionManagement from "./CompetitionManagement";
import RecentCompetitions from "./RecentCompetitions";
import QuizBoardFormat from "./QuizBoardFormat";
import QuickActions from "./QuickActions";
import LiveControl from "./LiveControl";
import SetupChecklist from "./SetupChecklist";
import CompetitionRules from "./CompetitionRules";
import QuizBoardFooter from "./QuizBoardFooter";

export default function QuizBoardPage() {
  const [competitions, setCompetitions] =
    useState<Competition[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [totalCount, setTotalCount] =
    useState(0);

  async function loadCompetitions(
    showRefresh = false,
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result =
        await getQuizCompetitions();

      console.log(
        "Quiz Board API response:",
        result,
      );

      setCompetitions(
        result.competitions,
      );

      setTotalCount(
        result.totalCount,
      );
    } catch (err: any) {
      console.error(
        "Failed to load Quiz Board competitions:",
        err,
      );

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      setError(
        backendMessage ||
          "Unable to load Quiz Board competitions.",
      );

      setCompetitions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCompetitions();
  }, []);

  const competitionsWithStatus =
    useMemo(() => {
      return competitions.map(
        (competition) => ({
          ...competition,
          resolvedStatus:
            inferStatus(competition),
        }),
      );
    }, [competitions]);

  const liveCompetitions =
    competitionsWithStatus.filter(
      (competition) =>
        competition.resolvedStatus ===
          "LIVE" ||
        competition.resolvedStatus ===
          "IN_PROGRESS",
    );

  const upcomingCompetitions =
    competitionsWithStatus.filter(
      (competition) =>
        competition.resolvedStatus ===
          "UPCOMING" ||
        competition.resolvedStatus ===
          "WAITING",
    );

  const completedCompetitions =
    competitionsWithStatus.filter(
      (competition) =>
        competition.resolvedStatus ===
        "COMPLETED",
    );

  const draftCompetitions =
    competitionsWithStatus.filter(
      (competition) =>
        competition.resolvedStatus ===
        "DRAFT",
    );

  const totalParticipants =
    competitions.reduce(
      (total, competition) =>
        total +
        getParticipantCount(
          competition,
        ),
      0,
    );

  const totalQuestions =
    competitions.reduce(
      (total, competition) =>
        total +
        getTotalQuestions(
          competition,
        ),
      0,
    );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <QuizBoardHeader
          refreshing={refreshing}
          onRefresh={() =>
            loadCompetitions(true)
          }
        />

        {error && (
          <QuizBoardError
            error={error}
            onRetry={() =>
              loadCompetitions(true)
            }
          />
        )}

        {loading ? (
          <QuizBoardLoading />
        ) : (
          <>
            <LiveCompetitions
              competitions={liveCompetitions}
            />

            <OverviewSection
              totalCount={
                totalCount ||
                competitions.length
              }
              liveCount={
                liveCompetitions.length
              }
              upcomingCount={
                upcomingCompetitions.length
              }
              participants={
                totalParticipants
              }
              questions={
                totalQuestions
              }
            />

            <StatusSummarySection
              draft={
                draftCompetitions.length
              }
              upcoming={
                upcomingCompetitions.length
              }
              live={
                liveCompetitions.length
              }
              completed={
                completedCompetitions.length
              }
            />

            <div className="grid gap-8 lg:grid-cols-3">
              <section className="space-y-8 lg:col-span-2">
                <CompetitionManagement />

                <RecentCompetitions
                  competitions={
                    competitions
                  }
                />

                <QuizBoardFormat />
              </section>

              <aside className="space-y-6">
                <QuickActions />

                <LiveControl
                  competitions={
                    liveCompetitions
                  }
                />

                <SetupChecklist />

                <CompetitionRules />
              </aside>
            </div>
          </>
        )}

        <QuizBoardFooter />
      </div>
    </main>
  );
}
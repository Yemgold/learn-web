




// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quizCompetition\validation.ts

import type {
  EliminationRound,
  FinalRound,
  FormState,
} from "@/types/quizCompetition";

import { getDifficultyTotal } from "./utils";

export function validateQuizCompetition(
  form: FormState,
  rounds: EliminationRound[],
  finalRound: FinalRound,
  eliminationExitTotal: number,
): string | null {
  if (!form.quiz_title.trim()) {
    return "Quiz title is required.";
  }

  if (!form.description.trim()) {
    return "Description is required.";
  }

  if (!form.subject) {
    return "Please select a subject.";
  }

  if (
    !Number.isFinite(
      Number(form.time_per_question),
    ) ||
    Number(form.time_per_question) <= 0
  ) {
    return "Time per question must be greater than 0.";
  }

  if (!form.start_date) {
    return "Please select a start date and time.";
  }

  const startDate = new Date(form.start_date);

  if (Number.isNaN(startDate.getTime())) {
    return "Please provide a valid start date.";
  }

  if (Number(form.no_of_contestants) < 2) {
    return "There must be at least 2 contestants.";
  }

  if (Number(form.number_of_rounds) < 1) {
    return "There must be at least 1 round.";
  }

  /*
   * Elimination rounds
   */
  for (const round of rounds) {
    const questionCount = Number(
      round.no_of_questions || 0,
    );

    const difficultyTotal =
      getDifficultyTotal(
        round.difficultyBreakdown,
      );

    if (questionCount <= 0) {
      return `Round ${round.round_number} must have at least 1 question.`;
    }

    if (difficultyTotal !== questionCount) {
      return `Round ${round.round_number}: Easy + Medium + Hard must equal the number of questions (${questionCount}).`;
    }

    if (Number(round.exit_number || 0) < 0) {
      return `Round ${round.round_number}: exit number cannot be negative.`;
    }

    if (
      Number(round.exit_number || 0) >
      Number(form.no_of_contestants || 0)
    ) {
      return `Round ${round.round_number}: exit number cannot exceed the number of contestants.`;
    }

    if (Number(round.exit_reward || 0) < 0) {
      return `Round ${round.round_number}: exit reward cannot be negative.`;
    }
  }

  /*
   * Prevent all contestants from
   * being eliminated before final.
   */
  if (
    eliminationExitTotal >=
      Number(form.no_of_contestants || 0) &&
    rounds.length > 0
  ) {
    return "The elimination rounds cannot remove all contestants before the final round.";
  }

  /*
   * Final round
   */
  const finalQuestionCount = Number(
    finalRound.no_of_questions || 0,
  );

  const finalDifficultyTotal =
    getDifficultyTotal(
      finalRound.difficultyBreakdown,
    );

  if (finalQuestionCount <= 0) {
    return "Final round must have at least 1 question.";
  }

  if (
    finalDifficultyTotal !==
    finalQuestionCount
  ) {
    return `Final Round: Easy + Medium + Hard must equal the number of questions (${finalQuestionCount}).`;
  }

  /*
   * Rewards
   */
  if (
    Number(form.first_position_reward) < 0
  ) {
    return "First position reward cannot be negative.";
  }

  if (
    Number(form.second_position_reward) < 0
  ) {
    return "Second position reward cannot be negative.";
  }

  if (
    Number(form.first_position_reward) <
    Number(form.second_position_reward)
  ) {
    return "First position reward should be greater than or equal to second position reward.";
  }

  return null;
}






// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quizCompetition\payload.ts

import type {
  CreateQuizCompetitionPayload,
  EliminationRound,
  FinalRound,
  FormState,
} from "@/types/quizCompetition";

export function buildCreateQuizCompetitionPayload(
  form: FormState,
  rounds: EliminationRound[],
  finalRound: FinalRound,
): CreateQuizCompetitionPayload {
  const startsAt = new Date(
    form.start_date,
  );

  return {
    quiz_title: form.quiz_title.trim(),

    description: form.description.trim(),

    subject: form.subject,

    time_per_question: Number(
      form.time_per_question,
    ),

    start_date: startsAt.toISOString(),

    no_of_contestants: Number(
      form.no_of_contestants,
    ),

    number_of_rounds: Number(
      form.number_of_rounds,
    ),

    status: form.status,

    /*
     * Elimination rounds only.
     */
    round_information: rounds.map(
      (round) => ({
        round_number:
          round.round_number,

        no_of_questions: Number(
          round.no_of_questions,
        ),

        difficultyBreakdown: {
          easy: Number(
            round.difficultyBreakdown.easy,
          ),

          medium: Number(
            round.difficultyBreakdown.medium,
          ),

          hard: Number(
            round.difficultyBreakdown.hard,
          ),
        },

        exit_number: Number(
          round.exit_number,
        ),

        exit_reward: Number(
          round.exit_reward,
        ),
      }),
    ),

    /*
     * Final round.
     */
    final_round_information: {
      no_of_questions: Number(
        finalRound.no_of_questions,
      ),

      difficultyBreakdown: {
        easy: Number(
          finalRound.difficultyBreakdown.easy,
        ),

        medium: Number(
          finalRound.difficultyBreakdown.medium,
        ),

        hard: Number(
          finalRound.difficultyBreakdown.hard,
        ),
      },

      first_position_reward: Number(
        form.first_position_reward,
      ),

      second_position_reward: Number(
        form.second_position_reward,
      ),
    },
  };
}
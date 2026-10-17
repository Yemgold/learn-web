



export type WhotQuestion = {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: string;
  explanation?: string;
};

/**
 * Connect this adapter to your existing WHOT question bank.
 *
 * Return your existing question objects without changing their
 * ids, options, subjects, or correctAnswerIndex values.
 */
export function getFriendQuestions(
  existingQuestions: WhotQuestion[],
): WhotQuestion[] {
  return existingQuestions.filter(
    (question) =>
      question.id &&
      question.subject &&
      question.question &&
      question.options.length >= 2 &&
      Number.isInteger(question.correctAnswerIndex) &&
      question.correctAnswerIndex >= 0 &&
      question.correctAnswerIndex < question.options.length,
  );
}

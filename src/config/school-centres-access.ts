






/**
 * School & Study Centres access control.
 *
 * Temporarily, only email addresses listed below
 * can access the student question-upload page.
 *
 * Add approved email addresses to SCHOOL_CENTRES_ALLOWED_EMAILS.
 */

export const SCHOOL_CENTRES_ALLOWED_EMAILS: string[] = [
  "yemi71114@gmail.com",
  "school2@example.com",
  "studycentre@example.com",
];

/**
 * Checks whether a logged-in user is allowed
 * to create questions for their students.
 */
export function canManageSchoolCentreQuestions(
  email?: string | null
): boolean {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  return SCHOOL_CENTRES_ALLOWED_EMAILS.some(
    (allowedEmail) =>
      allowedEmail.trim().toLowerCase() === normalizedEmail
  );
}

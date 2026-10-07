




/**
 * Word Challenge letter shuffling utilities.
 *
 * Frontend-only for now.
 *
 * Responsibilities:
 * - Shuffle answer letters
 * - Preserve duplicate letters
 * - Add optional distractor letters
 * - Avoid accidentally changing the correct answer
 */

const DEFAULT_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Fisher-Yates shuffle.
 *
 * This produces a properly randomized copy without
 * modifying the original array.
 */
export function shuffleLetters<T>(letters: T[]): T[] {
  const result = [...letters];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1),
    );

    [result[index], result[randomIndex]] = [
      result[randomIndex],
      result[index],
    ];
  }

  return result;
}

/**
 * Normalize a word before generating its letters.
 */
export function normalizeWord(word: string): string {
  return word
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

/**
 * Convert a word into its individual letters.
 *
 * Duplicate letters are intentionally preserved.
 *
 * Example:
 *
 * BANANA
 * -> ["B", "A", "N", "A", "N", "A"]
 */
export function wordToLetters(word: string): string[] {
  return normalizeWord(word).split("");
}

/**
 * Get a random letter that is not already being used
 * as a distractor.
 *
 * The same distractor can technically appear twice,
 * but this function tries to avoid that.
 */
function getRandomDistractor(
  existingLetters: string[],
): string {
  const usedLetters = new Set(
    existingLetters.map((letter) =>
      letter.toUpperCase(),
    ),
  );

  const availableLetters = DEFAULT_ALPHABET
    .split("")
    .filter((letter) => !usedLetters.has(letter));

  if (availableLetters.length === 0) {
    return DEFAULT_ALPHABET[
      Math.floor(
        Math.random() * DEFAULT_ALPHABET.length,
      )
    ];
  }

  return availableLetters[
    Math.floor(
      Math.random() * availableLetters.length,
    )
  ];
}

/**
 * Add random distractor letters to a word.
 *
 * Example:
 *
 * addDistractors("LION", 2)
 *
 * -> ["L", "I", "O", "N", "X", "G"]
 *
 * The result is shuffled.
 */
export function addDistractors(
  word: string,
  distractorCount = 2,
): string[] {
  const answerLetters = wordToLetters(word);

  const safeCount = Math.max(
    0,
    Math.floor(distractorCount),
  );

  const letters = [...answerLetters];

  for (let index = 0; index < safeCount; index += 1) {
    letters.push(getRandomDistractor(letters));
  }

  return shuffleLetters(letters);
}

/**
 * Create the complete letter board.
 *
 * If custom letters are supplied, they are used directly.
 * Otherwise the letters are generated from the answer.
 *
 * Example:
 *
 * createLetterBoard("LION", 2)
 *
 * -> ["N", "X", "I", "L", "G", "O"]
 */
export function createLetterBoard(
  answer: string,
  distractorCount = 2,
  customLetters?: string[],
): string[] {
  if (customLetters && customLetters.length > 0) {
    return shuffleLetters(
      customLetters.map((letter) =>
        letter.toUpperCase(),
      ),
    );
  }

  return addDistractors(
    answer,
    distractorCount,
  );
}

/**
 * Check whether the selected letters form the
 * correct answer.
 *
 * Example:
 *
 * isCorrectAnswer(["L", "I", "O", "N"], "LION")
 * -> true
 */
export function isCorrectAnswer(
  selectedLetters: string[],
  answer: string,
): boolean {
  const selected = selectedLetters
    .join("")
    .trim()
    .toUpperCase();

  const correct = normalizeWord(answer);

  return selected === correct;
}

/**
 * Get the letters that are still needed to complete
 * the answer.
 *
 * This is useful if we later want to build hints such as:
 *
 * "You have 2 letters left."
 */
export function getRemainingLetterCount(
  selectedLetters: string[],
  answer: string,
): number {
  const answerLength = wordToLetters(answer).length;

  return Math.max(
    0,
    answerLength - selectedLetters.length,
  );
}

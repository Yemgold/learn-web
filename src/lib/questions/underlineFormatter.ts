





/* ============================================================
   UNDERLINE FORMATTER
   ------------------------------------------------------------
   Detects expressions that JAMB questions intend to present
   as underlined/targeted expressions.

   IMPORTANT:
   The backend question remains unchanged.
   This formatter only controls frontend presentation.
   ============================================================ */

export interface UnderlineFormattedQuestion {
  instruction: string;
  sentence?: string;
  highlightedText?: string;
}

/* ============================================================
   TARGET PATTERNS
   ============================================================ */

/**
 * Patterns commonly used by JAMB English questions.
 *
 * Examples:
 *
 * "Choose the option that best explains the underlined
 *  expression in the following sentence: The man was at
 *  his wit's end."
 *
 * "Choose the option nearest in meaning to the underlined
 *  word in the sentence: The boy was reluctant to go."
 *
 * "Choose the option that best explains the underlined
 *  expression: He kicked the bucket."
 */
const TARGET_PATTERNS = [
  /\bunderlined expression\b/i,
  /\bunderlined phrase\b/i,
  /\bunderlined word\b/i,
  /\bunderlined words\b/i,
  /\bunderlined statement\b/i,
  /\bunderlined portion\b/i,
  /\bunderlined part\b/i,
];

/* ============================================================
   HELPERS
   ============================================================ */

function containsUnderlineInstruction(
  question: string,
): boolean {
  return TARGET_PATTERNS.some((pattern) =>
    pattern.test(question),
  );
}

/**
 * Extracts the sentence after common separators.
 *
 * Example:
 *
 * "... expression: The man was at his wit's end."
 *
 * returns:
 *
 * "The man was at his wit's end."
 */
function extractSentence(
  question: string,
): {
  instruction: string;
  sentence: string;
} | null {
  const separators = [
    ":",
    "—",
    " - ",
  ];

  for (const separator of separators) {
    const index = question.indexOf(separator);

    if (index === -1) {
      continue;
    }

    const instruction =
      question.slice(0, index).trim();

    const sentence =
      question
        .slice(index + separator.length)
        .trim();

    if (
      instruction &&
      sentence &&
      containsUnderlineInstruction(
        instruction,
      )
    ) {
      return {
        instruction,
        sentence,
      };
    }
  }

  return null;
}

/* ============================================================
   FIND TARGET
   ============================================================ */

/**
 * Attempts to identify the expression being tested.
 *
 * This is intentionally conservative.
 *
 * We do NOT underline arbitrary words simply because they
 * happen to appear in a sentence.
 */
function findTarget(
  sentence: string,
  instruction: string,
): string | undefined {
  /*
   * If the backend eventually sends explicit markers such as:
   *
   * [[at his wit's end]]
   *
   * we support them automatically.
   */

  const explicitMarker =
    sentence.match(
      /\[\[(.+?)\]\]/,
    );

  if (explicitMarker) {
    return explicitMarker[1].trim();
  }

  /*
   * Support HTML-style underline markers if they happen
   * to come from the backend.
   */

  const htmlMarker =
    sentence.match(
      /<u>(.+?)<\/u>/i,
    );

  if (htmlMarker) {
    return htmlMarker[1].trim();
  }

  /*
   * Support simple markdown-style markers.
   */

  const markdownMarker =
    sentence.match(
      /__(.+?)__/,
    );

  if (markdownMarker) {
    return markdownMarker[1].trim();
  }

  /*
   * We intentionally return undefined when no explicit
   * target can be safely identified.
   *
   * This prevents the frontend from incorrectly
   * underlining the wrong word.
   */

  return undefined;
}

/* ============================================================
   FORMAT UNDERLINED QUESTION
   ============================================================ */

export function formatUnderlineQuestion(
  question: string,
): UnderlineFormattedQuestion | null {
  if (!containsUnderlineInstruction(question)) {
    return null;
  }

  const extracted =
    extractSentence(question);

  if (!extracted) {
    return {
      instruction: question,
    };
  }

  const target =
    findTarget(
      extracted.sentence,
      extracted.instruction,
    );

  return {
    instruction:
      extracted.instruction,
    sentence:
      extracted.sentence
        .replace(
          /\[\[(.+?)\]\]/g,
          "$1",
        )
        .replace(
          /<u>(.+?)<\/u>/gi,
          "$1",
        )
        .replace(
          /__(.+?)__/g,
          "$1",
        ),
    highlightedText: target,
  };
}















// /* ============================================================
//    UNDERLINE FORMATTER
//    ------------------------------------------------------------
//    Formats JAMB English questions that test underlined words,
//    phrases, expressions, or statements.

//    The backend question remains unchanged.

//    Supported explicit markers:
//    [[utilitarian]]
//    <u>utilitarian</u>
//    __utilitarian__

//    Also supports instructions such as:
//    "Choose the option nearest in meaning to the word underlined:"
//    ============================================================ */

// export interface UnderlineFormattedQuestion {
//   instruction: string;
//   sentence?: string;
//   highlightedText?: string;
// }

// const TARGET_PATTERNS = [
//   /\bunderlined\s+(?:word|words|expression|phrase|statement|portion|part)\b/i,
//   /\b(?:word|words|expression|phrase|statement|portion|part)\s+underlined\b/i,
//   /\bword\s+in\s+italics\b/i,
//   /\bitalicized\s+(?:word|expression|phrase)\b/i,
// ];

// function containsUnderlineInstruction(question: string): boolean {
//   return TARGET_PATTERNS.some((pattern) => pattern.test(question));
// }

// /* ============================================================
//    EXTRACT INSTRUCTION AND SENTENCE
//    ============================================================ */

// function extractSentence(
//   question: string,
// ): { instruction: string; sentence: string } | null {
//   const separators = [":", "—", " - "];

//   for (const separator of separators) {
//     const index = question.indexOf(separator);

//     if (index === -1) continue;

//     const instruction = question.slice(0, index).trim();
//     const sentence = question.slice(index + separator.length).trim();

//     if (
//       instruction &&
//       sentence &&
//       containsUnderlineInstruction(instruction)
//     ) {
//       return { instruction, sentence };
//     }
//   }

//   return null;
// }

// /* ============================================================
//    EXPLICIT TARGET EXTRACTION
//    ============================================================ */

// function findExplicitTarget(sentence: string): string | undefined {
//   const patterns = [
//     /\[\[(.+?)\]\]/,
//     /<u\b[^>]*>([\s\S]+?)<\/u>/i,
//     /__(.+?)__/,
//   ];

//   for (const pattern of patterns) {
//     const match = sentence.match(pattern);

//     if (match?.[1]) {
//       return match[1].trim();
//     }
//   }

//   return undefined;
// }

// /* ============================================================
//    FALLBACK TARGET DETECTION
//    ------------------------------------------------------------
//    When formatting markers have been lost, this heuristic
//    selects the first longest word of at least 8 letters.

//    IMPORTANT:
//    This is only a fallback, not a guaranteed identification
//    of the originally underlined word.
//    ============================================================ */

// function inferTarget(sentence: string): string | undefined {
//   const words = sentence.match(/\b[A-Za-z]+(?:['’][A-Za-z]+)*\b/g);

//   if (!words?.length) return undefined;

//   const candidates = words.filter(
//     (word) => word.replace(/['’]/g, "").length >= 8,
//   );

//   if (!candidates.length) return undefined;

//   return candidates.reduce((longest, current) =>
//     current.length > longest.length ? current : longest,
//   );
// }

// /* ============================================================
//    REMOVE MARKERS FOR DISPLAY
//    ============================================================ */

// function removeMarkers(sentence: string): string {
//   return sentence
//     .replace(/\[\[(.+?)\]\]/g, "$1")
//     .replace(/<u\b[^>]*>([\s\S]+?)<\/u>/gi, "$1")
//     .replace(/__(.+?)__/g, "$1");
// }

// /* ============================================================
//    FORMAT UNDERLINED QUESTION
//    ============================================================ */

// export function formatUnderlineQuestion(
//   question: string,
// ): UnderlineFormattedQuestion | null {
//   if (!containsUnderlineInstruction(question)) {
//     return null;
//   }

//   const extracted = extractSentence(question);

//   if (!extracted) {
//     return {
//       instruction: question.trim(),
//     };
//   }

//   const explicitTarget = findExplicitTarget(extracted.sentence);

//   const target =
//     explicitTarget ?? inferTarget(extracted.sentence);

//   return {
//     instruction: extracted.instruction,
//     sentence: removeMarkers(extracted.sentence),
//     highlightedText: target,
//   };
// }

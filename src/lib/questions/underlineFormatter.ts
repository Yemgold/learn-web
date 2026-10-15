



/* ============================================================
   UNDERLINE FORMATTER
   ------------------------------------------------------------
   Formats JAMB English questions that test underlined words,
   phrases, expressions, or statements.

   The backend question remains unchanged.

   Supported explicit markers:
   [[utilitarian]]
   <u>utilitarian</u>
   __utilitarian__

   Also supports instructions such as:
   "Choose the option nearest in meaning to the word underlined:"
   ============================================================ */

export interface UnderlineFormattedQuestion {
  instruction: string;
  sentence?: string;
  highlightedText?: string;
}

const TARGET_PATTERNS = [
  /\bunderlined\s+(?:word|words|expression|phrase|statement|portion|part)\b/i,
  /\b(?:word|words|expression|phrase|statement|portion|part)\s+underlined\b/i,
  /\bword\s+in\s+italics\b/i,
  /\bitalicized\s+(?:word|expression|phrase)\b/i,
];

function containsUnderlineInstruction(question: string): boolean {
  return TARGET_PATTERNS.some((pattern) => pattern.test(question));
}

/* ============================================================
   EXTRACT INSTRUCTION AND SENTENCE
   ============================================================ */

function extractSentence(
  question: string,
): { instruction: string; sentence: string } | null {
  const separators = [":", "—", " - "];

  for (const separator of separators) {
    const index = question.indexOf(separator);

    if (index === -1) continue;

    const instruction = question.slice(0, index).trim();
    const sentence = question.slice(index + separator.length).trim();

    if (
      instruction &&
      sentence &&
      containsUnderlineInstruction(instruction)
    ) {
      return { instruction, sentence };
    }
  }

  return null;
}

/* ============================================================
   EXPLICIT TARGET EXTRACTION
   ============================================================ */

function findExplicitTarget(sentence: string): string | undefined {
  const patterns = [
    /\[\[(.+?)\]\]/,
    /<u\b[^>]*>([\s\S]+?)<\/u>/i,
    /__(.+?)__/,
  ];

  for (const pattern of patterns) {
    const match = sentence.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

/* ============================================================
   FALLBACK TARGET DETECTION
   ------------------------------------------------------------
   When formatting markers have been lost, this heuristic
   selects the first longest word of at least 8 letters.

   IMPORTANT:
   This is only a fallback, not a guaranteed identification
   of the originally underlined word.
   ============================================================ */

function inferTarget(sentence: string): string | undefined {
  const words = sentence.match(/\b[A-Za-z]+(?:['’][A-Za-z]+)*\b/g);

  if (!words?.length) return undefined;

  const candidates = words.filter(
    (word) => word.replace(/['’]/g, "").length >= 8,
  );

  if (!candidates.length) return undefined;

  return candidates.reduce((longest, current) =>
    current.length > longest.length ? current : longest,
  );
}

/* ============================================================
   REMOVE MARKERS FOR DISPLAY
   ============================================================ */

function removeMarkers(sentence: string): string {
  return sentence
    .replace(/\[\[(.+?)\]\]/g, "$1")
    .replace(/<u\b[^>]*>([\s\S]+?)<\/u>/gi, "$1")
    .replace(/__(.+?)__/g, "$1");
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

  const extracted = extractSentence(question);

  if (!extracted) {
    return {
      instruction: question.trim(),
    };
  }

  const explicitTarget = findExplicitTarget(extracted.sentence);

  const target =
    explicitTarget ?? inferTarget(extracted.sentence);

  return {
    instruction: extracted.instruction,
    sentence: removeMarkers(extracted.sentence),
    highlightedText: target,
  };
}

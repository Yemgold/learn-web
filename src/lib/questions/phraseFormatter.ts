




// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\questions\phraseFormatter.ts

/* ============================================================
   PHRASE FORMATTER
   ============================================================

   Handles phrase markers passed by the backend and converts
   them into structured parts that the frontend can render.

   Supported formats:

   [phrase:in spite of]
   [p:in spite of]

   {{phrase:in spite of}}
   {{p:in spite of}}

   Examples:

   "Choose the option that best completes [phrase:the sentence]."

   "Select the correct meaning of [phrase:in spite of]."

   The formatter does NOT decide the meaning of the phrase.
   It only identifies and separates phrase markers.
   ============================================================ */

export interface PhrasePart {
  type: "text" | "phrase";
  content: string;
}

/* ============================================================
   PHRASE MARKER REGEX
   ============================================================ */

const PHRASE_REGEX =
  /(?:\[|\{\{)(?:phrase|p):\s*([^}\]]+?)\s*(?:\]|\}\})/gi;

/* ============================================================
   PARSE PHRASES
   ============================================================ */

export function parsePhrases(
  text: string,
): PhrasePart[] {
  if (!text) {
    return [];
  }

  const parts: PhrasePart[] = [];

  let lastIndex = 0;

  text.replace(
    PHRASE_REGEX,
    (
      fullMatch: string,
      phraseText: string,
      offset: number,
    ) => {
      /* --------------------------------------------------------
         Text before phrase
         -------------------------------------------------------- */

      if (offset > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(
            lastIndex,
            offset,
          ),
        });
      }

      /* --------------------------------------------------------
         Phrase
         -------------------------------------------------------- */

      parts.push({
        type: "phrase",
        content: phraseText.trim(),
      });

      lastIndex =
        offset + fullMatch.length;

      return fullMatch;
    },
  );

  /* ----------------------------------------------------------
     Remaining text
     ---------------------------------------------------------- */

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return parts;
}

/* ============================================================
   CHECK WHETHER TEXT CONTAINS A PHRASE
   ============================================================ */

export function hasPhrase(
  text: string,
): boolean {
  if (!text) {
    return false;
  }

  PHRASE_REGEX.lastIndex = 0;

  return PHRASE_REGEX.test(text);
}

/* ============================================================
   EXTRACT PHRASES
   ============================================================ */

export function extractPhrases(
  text: string,
): string[] {
  if (!text) {
    return [];
  }

  const phrases: string[] = [];

  PHRASE_REGEX.lastIndex = 0;

  text.replace(
    PHRASE_REGEX,
    (
      _fullMatch: string,
      phraseText: string,
    ) => {
      phrases.push(
        phraseText.trim(),
      );

      return _fullMatch;
    },
  );

  return phrases;
}

/* ============================================================
   REMOVE PHRASE MARKERS
   ============================================================

   Example:

   Input:
   "Choose the meaning of [phrase:in spite of]."

   Output:
   "Choose the meaning of ."
   ============================================================ */

export function removePhraseMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(PHRASE_REGEX, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ============================================================
   REPLACE PHRASES WITH PLACEHOLDER
   ============================================================

   Useful when you want to display a visual indicator.

   Example:

   Input:
   "Choose the meaning of [phrase:in spite of]."

   Output:
   "Choose the meaning of «in spite of»."
   ============================================================ */

export function replacePhrasesWithPlaceholder(
  text: string,
  prefix = "«",
  suffix = "»",
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(
      PHRASE_REGEX,
      (_match, phraseText: string) =>
        `${prefix}${phraseText.trim()}${suffix}`,
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ============================================================
   NORMALIZE PHRASE MARKERS
   ============================================================

   Converts the short backend format:

   [p:in spite of]

   into:

   [phrase:in spite of]

   This gives the frontend one consistent format.
   ============================================================ */

export function normalizePhraseMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text.replace(
    /(?:\[|\{\{)(?:p):\s*([^}\]]+?)\s*(?:\]|\}\})/gi,
    "[phrase:$1]",
  );
}

/* ============================================================
   FORMAT PHRASE TEXT
   ============================================================

   Removes backend markers while preserving the actual phrase.

   Example:

   Input:
   "The phrase [phrase:in spite of] means..."

   Output:
   "The phrase in spite of means..."
   ============================================================ */

export function formatPhraseText(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(
      PHRASE_REGEX,
      (_match, phraseText: string) =>
        phraseText.trim(),
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}
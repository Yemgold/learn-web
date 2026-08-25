



// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\questions\blankFormatter.ts

/* ============================================================
   BLANK FORMATTER
   ============================================================

   Handles blank/question-gap markers passed from the backend.

   Supported formats:

   [blank]
   [blank:____]
   [blank:word]
   {{blank}}
   {{blank:____}}

   Also supports:

   [gap]
   [gap:____]
   {{gap}}
   {{gap:____}}

   Examples:

   "Choose the word that best completes the sentence:
   She ____ to school every day."

   Backend:

   "She [blank] to school every day."

   The formatter allows the frontend to render the blank as
   a visible input/gap instead of displaying the raw marker.

   ============================================================ */

export type BlankMarker =
  | "blank"
  | "gap";

export interface BlankPart {
  type: "text" | "blank";
  content: string;
  marker?: BlankMarker;
}

/* ============================================================
   BLANK REGEX
   ============================================================ */

const BLANK_REGEX =
  /(?:\[|\{\{)(blank|gap)(?::\s*([\s\S]*?))?\s*(?:\]|\}\})/gi;

/* ============================================================
   PARSE BLANKS
   ============================================================ */

export function parseBlanks(
  text: string,
): BlankPart[] {
  if (!text) {
    return [];
  }

  const parts: BlankPart[] = [];

  let lastIndex = 0;

  text.replace(
    BLANK_REGEX,
    (
      fullMatch: string,
      marker: BlankMarker,
      blankContent: string | undefined,
      offset: number,
    ) => {
      /* --------------------------------------------------------
         Text before blank
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
         Blank
         -------------------------------------------------------- */

      parts.push({
        type: "blank",
        content:
          blankContent?.trim() || "____",
        marker: marker.toLowerCase() as BlankMarker,
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
   CHECK WHETHER TEXT CONTAINS A BLANK
   ============================================================ */

export function hasBlank(
  text: string,
): boolean {
  if (!text) {
    return false;
  }

  BLANK_REGEX.lastIndex = 0;

  return BLANK_REGEX.test(text);
}

/* ============================================================
   COUNT BLANKS
   ============================================================ */

export function countBlanks(
  text: string,
): number {
  if (!text) {
    return 0;
  }

  let count = 0;

  BLANK_REGEX.lastIndex = 0;

  text.replace(
    BLANK_REGEX,
    () => {
      count += 1;
      return "";
    },
  );

  return count;
}

/* ============================================================
   EXTRACT BLANKS
   ============================================================ */

export function extractBlanks(
  text: string,
): string[] {
  if (!text) {
    return [];
  }

  const blanks: string[] = [];

  BLANK_REGEX.lastIndex = 0;

  text.replace(
    BLANK_REGEX,
    (
      _fullMatch: string,
      _marker: string,
      blankContent: string | undefined,
    ) => {
      blanks.push(
        blankContent?.trim() || "____",
      );

      return _fullMatch;
    },
  );

  return blanks;
}

/* ============================================================
   REMOVE BLANK MARKERS
   ============================================================

   Replaces backend markers with a standard visible blank.

   Example:

   Input:
   "She [blank] to school."

   Output:
   "She ____ to school."
   ============================================================ */

export function removeBlankMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(
      BLANK_REGEX,
      "____",
    )
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/* ============================================================
   REPLACE BLANKS
   ============================================================

   Allows the frontend to provide a custom placeholder.

   Example:

   replaceBlanks(
     "She [blank] to school.",
     "________"
   )

   Result:

   "She ________ to school."
   ============================================================ */

export function replaceBlanks(
  text: string,
  placeholder = "____",
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(
      BLANK_REGEX,
      placeholder,
    )
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/* ============================================================
   NORMALIZE BLANK MARKERS
   ============================================================

   Converts:

   [gap]
   [gap:____]
   {{gap}}

   into:

   [blank]
   [blank:____]

   This gives the frontend one standard marker.
   ============================================================ */

export function normalizeBlankMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text.replace(
    /(?:\[|\{\{)gap(?::\s*([\s\S]*?))?\s*(?:\]|\}\})/gi,
    (_match, content?: string) => {
      if (content?.trim()) {
        return `[blank:${content.trim()}]`;
      }

      return "[blank]";
    },
  );
}

/* ============================================================
   FORMAT BLANK TEXT
   ============================================================ */

export function formatBlankText(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return removeBlankMarkers(text)
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ============================================================
   FORMAT BLANK PARTS
   ============================================================ */

export function formatBlankParts(
  text: string,
): BlankPart[] {
  return parseBlanks(text);
}

/* ============================================================
   BLANK DISPLAY LABEL
   ============================================================ */

export function getBlankDisplay(
  content?: string,
): string {
  if (!content?.trim()) {
    return "____";
  }

  return content.trim();
}

/* ============================================================
   EXAMPLE
   ============================================================

   Backend:

   "Choose the correct option:
   She [blank] to school every day."

   parseBlanks() returns:

   [
     {
       type: "text",
       content: "Choose the correct option: She "
     },
     {
       type: "blank",
       content: "____",
       marker: "blank"
     },
     {
       type: "text",
       content: " to school every day."
     }
   ]

   The React UI can then render:

   Choose the correct option: She ________ to school
   every day.

   ============================================================ */






// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\questions\passageFormatter.ts

/* ============================================================
   PASSAGE FORMATTER
   ============================================================

   Handles passage/text-block markers passed by the backend.

   Supported formats:

   [passage:...]
   [text:...]

   {{passage:...}}
   {{text:...}}

   Also supports explicit paragraph markers:

   [paragraph:...]
   {{paragraph:...}}

   The formatter keeps passage content separate from the
   surrounding question text so the frontend can render it
   as a proper reading passage.

   ============================================================ */

export interface PassagePart {
  type: "text" | "passage" | "paragraph";
  content: string;
}

/* ============================================================
   PASSAGE REGEX
   ============================================================ */

const PASSAGE_REGEX =
  /(?:\[|\{\{)(?:passage|text):\s*([\s\S]*?)\s*(?:\]|\}\})/gi;

/* ============================================================
   PARAGRAPH REGEX
   ============================================================ */

const PARAGRAPH_REGEX =
  /(?:\[|\{\{)paragraph:\s*([\s\S]*?)\s*(?:\]|\}\})/gi;

/* ============================================================
   PARSE PASSAGE
   ============================================================ */

export function parsePassage(
  text: string,
): PassagePart[] {
  if (!text) {
    return [];
  }

  const parts: PassagePart[] = [];

  let lastIndex = 0;

  const combinedRegex =
    /(?:\[|\{\{)(passage|text|paragraph):\s*([\s\S]*?)\s*(?:\]|\}\})/gi;

  text.replace(
    combinedRegex,
    (
      fullMatch: string,
      markerType: string,
      content: string,
      offset: number,
    ) => {
      /* --------------------------------------------------------
         Text before marker
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
         Determine part type
         -------------------------------------------------------- */

      const type =
        markerType.toLowerCase();

      if (type === "paragraph") {
        parts.push({
          type: "paragraph",
          content: content.trim(),
        });
      } else {
        parts.push({
          type: "passage",
          content: content.trim(),
        });
      }

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
   CHECK FOR PASSAGE
   ============================================================ */

export function hasPassage(
  text: string,
): boolean {
  if (!text) {
    return false;
  }

  PASSAGE_REGEX.lastIndex = 0;
  PARAGRAPH_REGEX.lastIndex = 0;

  return (
    PASSAGE_REGEX.test(text) ||
    PARAGRAPH_REGEX.test(text)
  );
}

/* ============================================================
   EXTRACT PASSAGES
   ============================================================ */

export function extractPassages(
  text: string,
): string[] {
  if (!text) {
    return [];
  }

  const passages: string[] = [];

  const combinedRegex =
    /(?:\[|\{\{)(?:passage|text|paragraph):\s*([\s\S]*?)\s*(?:\]|\}\})/gi;

  text.replace(
    combinedRegex,
    (
      _fullMatch: string,
      passageText: string,
    ) => {
      passages.push(
        passageText.trim(),
      );

      return _fullMatch;
    },
  );

  return passages;
}

/* ============================================================
   EXTRACT FIRST PASSAGE
   ============================================================ */

export function extractFirstPassage(
  text: string,
): string | null {
  const passages =
    extractPassages(text);

  return passages[0] ?? null;
}

/* ============================================================
   REMOVE PASSAGE MARKERS
   ============================================================

   Removes the backend marker while preserving the passage
   content.

   Example:

   [passage:Read the following...]

   becomes:

   Read the following...
   ============================================================ */

export function removePassageMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(
      /(?:\[|\{\{)(?:passage|text|paragraph):\s*([\s\S]*?)\s*(?:\]|\}\})/gi,
      "$1",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ============================================================
   NORMALIZE PASSAGE MARKERS
   ============================================================

   Converts:

   [text:...]
   {{text:...}}

   into:

   [passage:...]

   This gives the frontend one standard format.
   ============================================================ */

export function normalizePassageMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text.replace(
    /(?:\[|\{\{)text:\s*([\s\S]*?)\s*(?:\]|\}\})/gi,
    "[passage:$1]",
  );
}

/* ============================================================
   FORMAT PASSAGE
   ============================================================

   Cleans whitespace while preserving paragraph breaks.

   Useful before rendering a passage in a <div>.
   ============================================================ */

export function formatPassageText(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ============================================================
   SPLIT PASSAGE INTO PARAGRAPHS
   ============================================================ */

export function splitPassageIntoParagraphs(
  text: string,
): string[] {
  if (!text) {
    return [];
  }

  return formatPassageText(text)
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph.trim(),
    )
    .filter(Boolean);
}

/* ============================================================
   GET PASSAGE + QUESTION
   ============================================================

   Useful when the backend sends something like:

   [passage:John went to the market...]

   What did John buy?

   The frontend receives:

   {
     passage: "John went to the market...",
     question: "What did John buy?"
   }
   ============================================================ */

export function splitPassageAndQuestion(
  text: string,
): {
  passage: string | null;
  question: string;
} {
  if (!text) {
    return {
      passage: null,
      question: "",
    };
  }

  const match =
    text.match(
      /(?:\[|\{\{)(?:passage|text):\s*([\s\S]*?)\s*(?:\]|\}\})/i,
    );

  if (!match) {
    return {
      passage: null,
      question: text.trim(),
    };
  }

  const passage =
    formatPassageText(match[1]);

  const question =
    text
      .replace(match[0], "")
      .replace(/^\s+|\s+$/g, "")
      .trim();

  return {
    passage: passage || null,
    question,
  };
}
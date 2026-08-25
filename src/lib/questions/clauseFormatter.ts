



// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\questions\clauseFormatter.ts

/* ============================================================
   CLAUSE FORMATTER
   ============================================================

   Handles clause markers passed from the backend.

   Supported formats:

   [clause:that he is coming]
   [clause:he is coming]

   {{clause:that he is coming}}

   Also supports explicit clause types:

   [dependent-clause:that he is coming]
   [independent-clause:He came home]

   The formatter does NOT determine whether a clause is
   dependent, independent, noun, adjective, adverbial, etc.

   The backend should provide the appropriate marker/type.

   ============================================================ */

export type ClauseType =
  | "clause"
  | "dependent-clause"
  | "independent-clause"
  | "noun-clause"
  | "adjective-clause"
  | "adverbial-clause";

export interface ClausePart {
  type: "text" | ClauseType;
  content: string;
}

/* ============================================================
   CLAUSE REGEX
   ============================================================ */

const CLAUSE_REGEX =
  /(?:\[|\{\{)(clause|dependent-clause|independent-clause|noun-clause|adjective-clause|adverbial-clause):\s*([\s\S]*?)\s*(?:\]|\}\})/gi;

/* ============================================================
   PARSE CLAUSES
   ============================================================ */

export function parseClauses(
  text: string,
): ClausePart[] {
  if (!text) {
    return [];
  }

  const parts: ClausePart[] = [];

  let lastIndex = 0;

  text.replace(
    CLAUSE_REGEX,
    (
      fullMatch: string,
      clauseType: ClauseType,
      clauseText: string,
      offset: number,
    ) => {
      /* --------------------------------------------------------
         Text before clause
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
         Clause
         -------------------------------------------------------- */

      parts.push({
        type: clauseType.toLowerCase() as ClauseType,
        content: clauseText.trim(),
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
   CHECK WHETHER TEXT CONTAINS A CLAUSE
   ============================================================ */

export function hasClause(
  text: string,
): boolean {
  if (!text) {
    return false;
  }

  CLAUSE_REGEX.lastIndex = 0;

  return CLAUSE_REGEX.test(text);
}

/* ============================================================
   EXTRACT CLAUSES
   ============================================================ */

export function extractClauses(
  text: string,
): string[] {
  if (!text) {
    return [];
  }

  const clauses: string[] = [];

  CLAUSE_REGEX.lastIndex = 0;

  text.replace(
    CLAUSE_REGEX,
    (
      _fullMatch: string,
      _clauseType: string,
      clauseText: string,
    ) => {
      clauses.push(
        clauseText.trim(),
      );

      return _fullMatch;
    },
  );

  return clauses;
}

/* ============================================================
   EXTRACT CLAUSE OBJECTS
   ============================================================ */

export function extractClauseParts(
  text: string,
): Array<{
  type: ClauseType;
  content: string;
}> {
  if (!text) {
    return [];
  }

  const clauses: Array<{
    type: ClauseType;
    content: string;
  }> = [];

  CLAUSE_REGEX.lastIndex = 0;

  text.replace(
    CLAUSE_REGEX,
    (
      _fullMatch: string,
      clauseType: string,
      clauseText: string,
    ) => {
      clauses.push({
        type:
          clauseType.toLowerCase() as ClauseType,
        content: clauseText.trim(),
      });

      return _fullMatch;
    },
  );

  return clauses;
}

/* ============================================================
   REMOVE CLAUSE MARKERS
   ============================================================

   Keeps the clause text but removes the backend marker.

   Example:

   Input:
   "I know [clause:that he is coming]."

   Output:
   "I know that he is coming."
   ============================================================ */

export function removeClauseMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(
      CLAUSE_REGEX,
      "$2",
    )
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/* ============================================================
   NORMALIZE CLAUSE MARKERS
   ============================================================

   Converts all explicit clause types to:

   [clause:...]

   Use this only when the frontend does not need the
   backend-provided clause classification.

   ============================================================ */

export function normalizeClauseMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text.replace(
    /(?:\[|\{\})(clause|dependent-clause|independent-clause|noun-clause|adjective-clause|adverbial-clause):/gi,
    "[clause:",
  );
}

/* ============================================================
   FORMAT CLAUSE TEXT
   ============================================================ */

export function formatClauseText(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return removeClauseMarkers(text)
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ============================================================
   FORMAT CLAUSE WITH HIGHLIGHT MARKERS
   ============================================================

   This produces a structure the React UI can use to visually
   distinguish the clause from the rest of the sentence.

   Example:

   "I know [clause:that he is coming]."

   Returns:

   [
     {
       type: "text",
       content: "I know "
     },
     {
       type: "clause",
       content: "that he is coming"
     },
     {
       type: "text",
       content: "."
     }
   ]

   ============================================================ */

export function formatClauseParts(
  text: string,
): ClausePart[] {
  return parseClauses(text);
}

/* ============================================================
   GET CLAUSE TYPE LABEL
   ============================================================ */

export function getClauseTypeLabel(
  type: ClauseType,
): string {
  const labels: Record<
    ClauseType,
    string
  > = {
    clause: "Clause",
    "dependent-clause":
      "Dependent Clause",
    "independent-clause":
      "Independent Clause",
    "noun-clause":
      "Noun Clause",
    "adjective-clause":
      "Adjective Clause",
    "adverbial-clause":
      "Adverbial Clause",
  };

  return labels[type];
}

/* ============================================================
   GET CLAUSE CLASS
   ============================================================

   Returns Tailwind classes for visually differentiating a
   clause from normal sentence text.

   ============================================================ */

export function getClauseClassName(
  type: ClauseType,
): string {
  switch (type) {
    case "dependent-clause":
      return "rounded-md bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-800";

    case "independent-clause":
      return "rounded-md bg-green-50 px-1.5 py-0.5 font-semibold text-green-800";

    case "noun-clause":
      return "rounded-md bg-purple-50 px-1.5 py-0.5 font-semibold text-purple-800";

    case "adjective-clause":
      return "rounded-md bg-orange-50 px-1.5 py-0.5 font-semibold text-orange-800";

    case "adverbial-clause":
      return "rounded-md bg-pink-50 px-1.5 py-0.5 font-semibold text-pink-800";

    case "clause":
    default:
      return "rounded-md bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-800";
  }
}

/* ============================================================
   EXAMPLE
   ============================================================

   Backend:

   Identify the type of clause in the sentence:
   I know [clause:that he is coming].

   Frontend:

   I know that he is coming.

   The "that he is coming" portion can be rendered with a
   different visual style so students can immediately see
   which part of the sentence is the clause.

   ============================================================ */
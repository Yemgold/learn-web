



/* ============================================================
   QUESTION FORMATTER
   ============================================================

   Frontend-only formatter for JAMB questions.

   IMPORTANT:

   - Backend remains the source of truth.
   - This file DOES NOT modify backend question data.
   - It only converts raw question text into structured
     presentation data for the UI.

   Supported:

   1. Underlined words
   2. Underlined expressions
   3. Underlined phrases
   4. Clauses
   5. Passages
   6. Blanks
   7. Phrases
   8. Sounds / audio
   9. Explicit frontend/backend markers
   10. Natural JAMB wording without explicit markers

   Examples:

   "Choose the word nearest in meaning to the underlined word:
    His remarks were ambiguous."

   =>
   instruction:
   "Choose the word nearest in meaning to the underlined word:"

   sentence:
   "His remarks were ambiguous."

   highlightedText:
   "ambiguous"


   "Identify the grammatical name of the underlined expression:
    The girl who is singing is my sister."

   =>
   instruction:
   "Identify the grammatical name of the underlined expression:"

   sentence:
   "The girl who is singing is my sister."

   highlightedText:
   "who is singing"


   Explicit markers supported:

   [[ambiguous]]

   [underline:ambiguous]

   {{underline:ambiguous}}

   <u>ambiguous</u>

   __ambiguous__

   ============================================================ */

import {
  parseClauses,
  type ClausePart,
} from "./clauseFormatter";

import {
  parseBlanks,
} from "./blankFormatter";

import {
  parsePhrases,
} from "./phraseFormatter";

import {
  parsePassage,
} from "./passageFormatter";

import {
  parseSound,
} from "./soundFormatter";

/* ============================================================
   FORMATTED QUESTION
   ============================================================ */

export interface FormattedQuestion {
  original: string;

  instruction: string;

  sentence?: string;

  highlightedText?: string;

  parts: QuestionPart[];

  hasFormatting: boolean;

  type:
    | "normal"
    | "clause"
    | "passage"
    | "blank"
    | "phrase"
    | "sound"
    | "underline";
}

/* ============================================================
   QUESTION PART
   ============================================================ */

export type QuestionPart =
  | {
      type: "text";
      content: string;
    }
  | {
      type: "clause";
      content: string;
      clauseType?: string;
    }
  | {
      type: "blank";
      content: string;
    }
  | {
      type: "phrase";
      content: string;
    }
  | {
      type: "passage";
      content: string;
    }
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "sound";
      content: string;
    }
  | {
      type: "underline";
      content: string;
    };

/* ============================================================
   UNDERLINE INSTRUCTION DETECTION
   ============================================================ */

const UNDERLINE_PATTERNS = [
  /\bunderlined\s+word\b/i,
  /\bunderlined\s+words\b/i,
  /\bunderlined\s+expression\b/i,
  /\bunderlined\s+expressions\b/i,
  /\bunderlined\s+phrase\b/i,
  /\bunderlined\s+phrases\b/i,
  /\bunderlined\s+statement\b/i,
  /\bunderlined\s+portion\b/i,
  /\bunderlined\s+part\b/i,
  /\bunderlined\s+item\b/i,
];

function containsUnderlineInstruction(
  question: string,
): boolean {
  return UNDERLINE_PATTERNS.some((pattern) =>
    pattern.test(question),
  );
}

/* ============================================================
   UNDERLINE TARGET TYPE
   ============================================================ */

type UnderlineTargetType =
  | "word"
  | "expression"
  | "phrase"
  | "unknown";

function getUnderlineTargetType(
  instruction: string,
): UnderlineTargetType {
  if (
    /\bunderlined\s+word\b/i.test(instruction) ||
    /\bunderlined\s+words\b/i.test(instruction)
  ) {
    return "word";
  }

  if (
    /\bunderlined\s+phrase\b/i.test(instruction) ||
    /\bunderlined\s+phrases\b/i.test(instruction)
  ) {
    return "phrase";
  }

  if (
    /\bunderlined\s+expression\b/i.test(instruction) ||
    /\bunderlined\s+expressions\b/i.test(instruction)
  ) {
    return "expression";
  }

  return "unknown";
}

/* ============================================================
   EXPLICIT TARGET
   ============================================================ */

interface ExplicitTarget {
  text: string;
  sentence: string;
}

/* ============================================================
   FIND EXPLICIT TARGET
   ============================================================ */

function findExplicitTarget(
  sentence: string,
): ExplicitTarget | null {
  /* ----------------------------------------------------------
     [[target]]
     ---------------------------------------------------------- */

  const doubleBracket =
    sentence.match(
      /\[\[([\s\S]+?)\]\]/,
    );

  if (doubleBracket) {
    return {
      text: doubleBracket[1].trim(),
      sentence: sentence.replace(
        /\[\[([\s\S]+?)\]\]/g,
        "$1",
      ),
    };
  }

  /* ----------------------------------------------------------
     [underline:target]
     [u:target]
     ---------------------------------------------------------- */

  const underlineBracket =
    sentence.match(
      /\[(?:underline|u):\s*([\s\S]+?)\]/i,
    );

  if (underlineBracket) {
    return {
      text: underlineBracket[1].trim(),
      sentence: sentence.replace(
        /\[(?:underline|u):\s*([\s\S]+?)\]/gi,
        "$1",
      ),
    };
  }

  /* ----------------------------------------------------------
     {{underline:target}}
     {{u:target}}
     ---------------------------------------------------------- */

  const underlineBrace =
    sentence.match(
      /\{\{(?:underline|u):\s*([\s\S]+?)\}\}/i,
    );

  if (underlineBrace) {
    return {
      text: underlineBrace[1].trim(),
      sentence: sentence.replace(
        /\{\{(?:underline|u):\s*([\s\S]+?)\}\}/gi,
        "$1",
      ),
    };
  }

  /* ----------------------------------------------------------
     <u>target</u>
     ---------------------------------------------------------- */

  const htmlUnderline =
    sentence.match(
      /<u>([\s\S]+?)<\/u>/i,
    );

  if (htmlUnderline) {
    return {
      text: htmlUnderline[1].trim(),
      sentence: sentence.replace(
        /<u>([\s\S]+?)<\/u>/gi,
        "$1",
      ),
    };
  }

  /* ----------------------------------------------------------
     __target__
     ---------------------------------------------------------- */

  const markdownUnderline =
    sentence.match(
      /__([\s\S]+?)__/,
    );

  if (markdownUnderline) {
    return {
      text: markdownUnderline[1].trim(),
      sentence: sentence.replace(
        /__([\s\S]+?)__/g,
        "$1",
      ),
    };
  }

  /* ----------------------------------------------------------
     [underline]target[/underline]
     ---------------------------------------------------------- */

  const underlineTags =
    sentence.match(
      /\[underline\]([\s\S]+?)\[\/underline\]/i,
    );

  if (underlineTags) {
    return {
      text: underlineTags[1].trim(),
      sentence: sentence.replace(
        /\[underline\]([\s\S]+?)\[\/underline\]/gi,
        "$1",
      ),
    };
  }

  return null;
}

/* ============================================================
   QUESTION / SENTENCE SEPARATOR
   ============================================================ */

function extractInstructionAndSentence(
  question: string,
): {
  instruction: string;
  sentence: string;
} | null {
  const cleaned = question.trim();

  /* ----------------------------------------------------------
     COLON

     Most JAMB questions use a colon.

     Example:

     Choose the word nearest in meaning to the
     underlined word: His remarks were ambiguous.
     ---------------------------------------------------------- */

  const colonIndex = cleaned.indexOf(":");

  if (colonIndex >= 0) {
    const instruction =
      cleaned
        .slice(0, colonIndex)
        .trim();

    const sentence =
      cleaned
        .slice(colonIndex + 1)
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

  /* ----------------------------------------------------------
     DASH
     ---------------------------------------------------------- */

  const dashMatch =
    cleaned.match(
      /^([\s\S]+?)\s+[—–-]\s+([\s\S]+)$/u,
    );

  if (dashMatch) {
    const instruction =
      dashMatch[1].trim();

    const sentence =
      dashMatch[2].trim();

    if (
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
   CLEAN SENTENCE
   ============================================================ */

function cleanSentence(
  sentence: string,
): string {
  return sentence
    .replace(
      /\[\[([\s\S]+?)\]\]/g,
      "$1",
    )
    .replace(
      /\[(?:underline|u):\s*([\s\S]+?)\]/gi,
      "$1",
    )
    .replace(
      /\{\{(?:underline|u):\s*([\s\S]+?)\}\}/gi,
      "$1",
    )
    .replace(
      /<u>([\s\S]+?)<\/u>/gi,
      "$1",
    )
    .replace(
      /__([\s\S]+?)__/g,
      "$1",
    )
    .replace(
      /\[underline\]([\s\S]+?)\[\/underline\]/gi,
      "$1",
    )
    .replace(
      /\s{2,}/g,
      " ",
    )
    .trim();
}

/* ============================================================
   WORD TARGET HEURISTIC
   ============================================================

   Used when JAMB says:

   "underlined word"

   but the backend does not provide underline markup.

   Example:

   His remarks were ambiguous.

   => ambiguous

   The heuristic takes the final meaningful word before
   punctuation.

   ============================================================ */

function findWordTarget(
  sentence: string,
): string | undefined {
  const cleaned =
    sentence
      .trim()
      .replace(
        /[“”"']/g,
        "",
      );

  /*
   * Match the final word.
   *
   * Handles:
   *
   * ambiguous.
   * reluctant!
   * difficult?
   * ambiguous
   */

  const match =
    cleaned.match(
      /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]*)[.!?,;:)]*$/u,
    );

  if (!match) {
    return undefined;
  }

  return match[1];
}

/* ============================================================
   RELATIVE CLAUSE TARGET
   ============================================================

   Example:

   The girl who is singing is my sister.

   => who is singing

   ============================================================ */

function findRelativeClauseTarget(
  sentence: string,
): string | undefined {
  const match =
    sentence.match(
      /\b(who|whom|whose|which|that)\b[\s\S]*?(?=\s+(?:is|are|was|were|has|have|had|will|would|can|could|shall|should|may|might|must)\b|[.!?]$)/i,
    );

  if (!match) {
    return undefined;
  }

  const candidate =
    match[0]
      .trim()
      .replace(
        /[.!?]+$/,
        "",
      );

  if (
    candidate.split(/\s+/).length < 2
  ) {
    return undefined;
  }

  return candidate;
}

/* ============================================================
   COMMON EXPRESSION TARGETS
   ============================================================ */

const COMMON_EXPRESSION_PATTERNS = [
  /\bat\s+(?:his|her|their|my|your|our)\s+wit['’]s\s+end\b/i,
  /\bkicked\s+the\s+bucket\b/i,
  /\blet\s+the\s+cat\s+out\s+of\s+the\s+bag\b/i,
  /\bspill\s+the\s+beans\b/i,
  /\bbite\s+the\s+bullet\b/i,
  /\bunder\s+the\s+weather\b/i,
  /\bonce\s+in\s+a\s+blue\s+moon\b/i,
  /\bbreak\s+the\s+ice\b/i,
  /\bpiece\s+of\s+cake\b/i,
  /\ba\s+blessing\s+in\s+disguise\b/i,
  /\ba\s+bone\s+of\s+contention\b/i,
  /\bthe\s+apple\s+of\s+(?:his|her|their|my|your|our)\s+eye\b/i,
];

function findCommonExpressionTarget(
  sentence: string,
): string | undefined {
  for (
    const pattern of COMMON_EXPRESSION_PATTERNS
  ) {
    const match =
      sentence.match(pattern);

    if (match) {
      return match[0].trim();
    }
  }

  return undefined;
}

/* ============================================================
   EXPRESSION TARGET HEURISTIC
   ============================================================ */

function findExpressionTarget(
  sentence: string,
): string | undefined {
  /* ----------------------------------------------------------
     Known idiomatic expression
     ---------------------------------------------------------- */

  const common =
    findCommonExpressionTarget(
      sentence,
    );

  if (common) {
    return common;
  }

  /* ----------------------------------------------------------
     Relative clause
     ---------------------------------------------------------- */

  const relativeClause =
    findRelativeClauseTarget(
      sentence,
    );

  if (relativeClause) {
    return relativeClause;
  }

  return undefined;
}

/* ============================================================
   GENERAL UNDERLINE TARGET
   ============================================================ */

function findUnderlineTarget(
  sentence: string,
  instruction: string,
): string | undefined {
  const targetType =
    getUnderlineTargetType(
      instruction,
    );

  switch (targetType) {
    case "word":
      return findWordTarget(
        sentence,
      );

    case "expression":
      return findExpressionTarget(
        sentence,
      );

    case "phrase":
      return findExpressionTarget(
        sentence,
      );

    default:
      return (
        findExpressionTarget(
          sentence,
        ) ??
        findWordTarget(
          sentence,
        )
      );
  }
}

/* ============================================================
   BUILD HIGHLIGHTED PARTS
   ============================================================ */

function buildHighlightedParts(
  sentence: string,
  highlightedText?: string,
): QuestionPart[] {
  if (!highlightedText) {
    return [
      {
        type: "text",
        content: sentence,
      },
    ];
  }

  const startIndex =
    sentence.indexOf(
      highlightedText,
    );

  if (startIndex === -1) {
    return [
      {
        type: "text",
        content: sentence,
      },
    ];
  }

  const before =
    sentence.slice(
      0,
      startIndex,
    );

  const after =
    sentence.slice(
      startIndex +
        highlightedText.length,
    );

  const parts: QuestionPart[] = [];

  if (before) {
    parts.push({
      type: "text",
      content: before,
    });
  }

  parts.push({
    type: "underline",
    content: highlightedText,
  });

  if (after) {
    parts.push({
      type: "text",
      content: after,
    });
  }

  return parts;
}

/* ============================================================
   UNDERLINE QUESTION FORMATTER
   ============================================================ */

function formatUnderlineQuestion(
  question: string,
): FormattedQuestion | null {
  if (
    !containsUnderlineInstruction(
      question,
    )
  ) {
    return null;
  }

  const extracted =
    extractInstructionAndSentence(
      question,
    );

  /*
   * If we cannot separate the instruction
   * and sentence, preserve the original.
   */

  if (!extracted) {
    return {
      original: question,
      instruction: question,
      parts: [
        {
          type: "text",
          content: question,
        },
      ],
      hasFormatting: false,
      type: "underline",
    };
  }

  const {
    instruction,
    sentence: rawSentence,
  } = extracted;

  /*
   * Explicit backend markers always win.
   */

  const explicit =
    findExplicitTarget(
      rawSentence,
    );

  const sentence =
    cleanSentence(
      explicit?.sentence ??
        rawSentence,
    );

  const highlightedText =
    explicit?.text ??
    findUnderlineTarget(
      sentence,
      instruction,
    );

  const parts =
    buildHighlightedParts(
      sentence,
      highlightedText,
    );

  return {
    original: question,

    instruction,

    sentence,

    highlightedText,

    parts,

    hasFormatting:
      Boolean(highlightedText),

    type: "underline",
  };
}

/* ============================================================
   CLAUSE QUESTION
   ============================================================ */

function isClauseQuestion(
  question: string,
): boolean {
  return /^Identify\s+the\s+(?:type|grammatical\s+name)\s+of\s+clause\s+in\s+the\s+sentence\s*:/i.test(
    question.trim(),
  );
}

/* ============================================================
   SAFE CLAUSE TYPE
   ============================================================

   IMPORTANT:

   parseClauses() may expose clauseType as unknown.

   We must NOT assign unknown directly to:

   clauseType?: string

   Therefore this helper safely narrows it.
   ============================================================ */

function getSafeClauseType(
  part: ClausePart,
): string | undefined {
  if (
    "clauseType" in part
  ) {
    const value =
      part.clauseType;

    if (
      typeof value ===
      "string"
    ) {
      return value;
    }
  }

  return undefined;
}

/* ============================================================
   CLAUSE QUESTION FORMATTER
   ============================================================ */

function formatClauseQuestion(
  question: string,
): FormattedQuestion | null {
  if (
    !isClauseQuestion(
      question,
    )
  ) {
    return null;
  }

  const match =
    question.match(
      /^([\s\S]*?):\s*([\s\S]+)$/i,
    );

  if (!match) {
    return null;
  }

  const instruction =
    match[1].trim();

  const sentence =
    match[2].trim();

  /*
   * First try explicit clause markers.
   */

  const clauseParts =
    parseClauses(
      sentence,
    );

  const detectedClause =
    clauseParts.find(
      (
        part,
      ): part is ClausePart =>
        part.type !==
        "text",
    );

  if (detectedClause) {
    const parts =
      clauseParts.map(
        (
          part,
        ): QuestionPart => {
          if (
            part.type ===
            "text"
          ) {
            return {
              type: "text",
              content:
                part.content,
            };
          }

          return {
            type: "clause",
            content:
              part.content,
            clauseType:
              getSafeClauseType(
                part,
              ),
          };
        },
      );

    return {
      original: question,

      instruction,

      sentence,

      highlightedText:
        detectedClause.content,

      parts,

      hasFormatting:
        true,

      type: "clause",
    };
  }

  /*
   * Natural-language fallback.
   *
   * Example:

   * The girl who is singing is my sister.
   *
   * => who is singing
   */

  const relativeClause =
    findRelativeClauseTarget(
      sentence,
    );

  if (relativeClause) {
    const startIndex =
      sentence.indexOf(
        relativeClause,
      );

    if (startIndex >= 0) {
      const before =
        sentence.slice(
          0,
          startIndex,
        );

      const after =
        sentence.slice(
          startIndex +
            relativeClause.length,
        );

      const parts: QuestionPart[] =
        [];

      if (before) {
        parts.push({
          type: "text",
          content: before,
        });
      }

      parts.push({
        type: "clause",
        content:
          relativeClause,
      });

      if (after) {
        parts.push({
          type: "text",
          content: after,
        });
      }

      return {
        original: question,

        instruction,

        sentence,

        highlightedText:
          relativeClause,

        parts,

        hasFormatting:
          true,

        type: "clause",
      };
    }
  }

  /*
   * General clause fallback.
   */

  const clauseMatch =
    sentence.match(
      /\b(that|which|who|whom|whose|where|when|why|because|although|if|unless|while|since|as)\b[\s\S]+$/i,
    );

  if (clauseMatch) {
    const highlightedText =
      clauseMatch[0].trim();

    const startIndex =
      sentence.indexOf(
        highlightedText,
      );

    const before =
      startIndex >= 0
        ? sentence.slice(
            0,
            startIndex,
          )
        : "";

    const after =
      startIndex >= 0
        ? sentence.slice(
            startIndex +
              highlightedText.length,
          )
        : "";

    const parts: QuestionPart[] =
      [];

    if (before) {
      parts.push({
        type: "text",
        content: before,
      });
    }

    parts.push({
      type: "clause",
      content:
        highlightedText,
    });

    if (after) {
      parts.push({
        type: "text",
        content: after,
      });
    }

    return {
      original: question,

      instruction,

      sentence,

      highlightedText,

      parts,

      hasFormatting:
        true,

      type: "clause",
    };
  }

  /*
   * Nothing safe to highlight.
   */

  return {
    original: question,

    instruction,

    sentence,

    parts: [
      {
        type: "text",
        content: sentence,
      },
    ],

    hasFormatting:
      false,

    type: "clause",
  };
}

/* ============================================================
   UNDERLINE MARKER DETECTION
   ============================================================ */

function hasUnderlineMarker(
  question: string,
): boolean {
  return (
    /\[\[[\s\S]+?\]\]/.test(
      question,
    ) ||
    /\[(?:underline|u):[\s\S]*?\]/i.test(
      question,
    ) ||
    /\{\{(?:underline|u):[\s\S]*?\}\}/i.test(
      question,
    ) ||
    /<u>[\s\S]+?<\/u>/i.test(
      question,
    ) ||
    /__[\s\S]+?__/.test(
      question,
    ) ||
    /\[underline\][\s\S]+?\[\/underline\]/i.test(
      question,
    )
  );
}

/* ============================================================
   GENERAL MARKER DETECTION
   ============================================================ */

function detectQuestionType(
  question: string,
): FormattedQuestion["type"] {
  if (
    hasUnderlineMarker(
      question,
    ) ||
    containsUnderlineInstruction(
      question,
    )
  ) {
    return "underline";
  }

  if (
    parsePassage(
      question,
    ).some(
      (part) =>
        part.type ===
          "passage" ||
        part.type ===
          "paragraph",
    )
  ) {
    return "passage";
  }

  if (
    parseBlanks(
      question,
    ).some(
      (part) =>
        part.type ===
        "blank",
    )
  ) {
    return "blank";
  }

  if (
    parsePhrases(
      question,
    ).some(
      (part) =>
        part.type ===
        "phrase",
    )
  ) {
    return "phrase";
  }

  if (
    parseSound(
      question,
    ).some(
      (part) =>
        part.type ===
        "sound",
    )
  ) {
    return "sound";
  }

  return "normal";
}

/* ============================================================
   GENERAL MARKER PARSER
   ============================================================ */

function parseQuestionParts(
  question: string,
): QuestionPart[] {
  const parts: QuestionPart[] =
    [];

  /*
   * Supports:

   * [marker:content]
   * {{marker:content}}
   *
   * Also supports markers without content.
   */

  const markerRegex =
    /(?:\[(underline|u|clause|dependent-clause|independent-clause|noun-clause|adjective-clause|adverbial-clause|blank|gap|phrase|p|passage|text|paragraph|sound|audio)(?::\s*([\s\S]*?))?\]|\{\{(underline|u|clause|dependent-clause|independent-clause|noun-clause|adjective-clause|adverbial-clause|blank|gap|phrase|p|passage|text|paragraph|sound|audio)(?::\s*([\s\S]*?))?\}\})/gi;

  let lastIndex = 0;

  question.replace(
    markerRegex,
    (
      fullMatch: string,
      bracketMarker: string | undefined,
      bracketContent: string | undefined,
      braceMarker: string | undefined,
      braceContent: string | undefined,
      offset: number,
    ) => {
      if (
        offset >
        lastIndex
      ) {
        parts.push({
          type: "text",
          content:
            question.slice(
              lastIndex,
              offset,
            ),
        });
      }

      const marker =
        (
          bracketMarker ??
          braceMarker ??
          ""
        ).toLowerCase();

      const content =
        (
          bracketContent ??
          braceContent ??
          ""
        ).trim();

      /* --------------------------------------------------------
         UNDERLINE
         -------------------------------------------------------- */

      if (
        marker ===
          "underline" ||
        marker === "u"
      ) {
        parts.push({
          type: "underline",
          content,
        });
      }

      /* --------------------------------------------------------
         CLAUSE
         -------------------------------------------------------- */

      else if (
        marker ===
          "clause" ||
        marker ===
          "dependent-clause" ||
        marker ===
          "independent-clause" ||
        marker ===
          "noun-clause" ||
        marker ===
          "adjective-clause" ||
        marker ===
          "adverbial-clause"
      ) {
        parts.push({
          type: "clause",
          content,
          clauseType:
            marker ===
            "clause"
              ? undefined
              : marker,
        });
      }

      /* --------------------------------------------------------
         BLANK
         -------------------------------------------------------- */

      else if (
        marker ===
          "blank" ||
        marker === "gap"
      ) {
        parts.push({
          type: "blank",
          content:
            content ||
            "____",
        });
      }

      /* --------------------------------------------------------
         PHRASE
         -------------------------------------------------------- */

      else if (
        marker ===
          "phrase" ||
        marker === "p"
      ) {
        parts.push({
          type: "phrase",
          content,
        });
      }

      /* --------------------------------------------------------
         PASSAGE
         -------------------------------------------------------- */

      else if (
        marker ===
          "passage" ||
        marker === "text"
      ) {
        parts.push({
          type: "passage",
          content,
        });
      }

      /* --------------------------------------------------------
         PARAGRAPH
         -------------------------------------------------------- */

      else if (
        marker ===
        "paragraph"
      ) {
        parts.push({
          type: "paragraph",
          content,
        });
      }

      /* --------------------------------------------------------
         SOUND
         -------------------------------------------------------- */

      else if (
        marker === "sound" ||
        marker === "audio"
      ) {
        parts.push({
          type: "sound",
          content,
        });
      }

      lastIndex =
        offset +
        fullMatch.length;

      return fullMatch;
    },
  );

  if (
    lastIndex <
    question.length
  ) {
    parts.push({
      type: "text",
      content:
        question.slice(
          lastIndex,
        ),
    });
  }

  return parts;
}

/* ============================================================
   CLEAN INSTRUCTION
   ============================================================ */

function getInstruction(
  question: string,
): string {
  const clausePrefix =
    /^Identify\s+the\s+(?:type|grammatical\s+name)\s+of\s+clause\s+in\s+the\s+sentence\s*:/i;

  if (
    clausePrefix.test(
      question.trim(),
    )
  ) {
    return question
      .split(":")[0]
      .trim() + ":";
  }

  return question.trim();
}

/* ============================================================
   MAIN FORMATTER
   ============================================================ */

export function formatQuestion(
  question: string,
): FormattedQuestion {
  if (!question?.trim()) {
    return {
      original:
        question ?? "",

      instruction: "",

      parts: [],

      hasFormatting:
        false,

      type: "normal",
    };
  }

  /* ==========================================================
     UNDERLINED QUESTION
     ========================================================== */

  const underlineQuestion =
    formatUnderlineQuestion(
      question,
    );

  if (underlineQuestion) {
    return underlineQuestion;
  }

  /* ==========================================================
     CLAUSE QUESTION
     ========================================================== */

  const clauseQuestion =
    formatClauseQuestion(
      question,
    );

  if (clauseQuestion) {
    return clauseQuestion;
  }

  /* ==========================================================
     GENERAL FORMATTING
     ========================================================== */

  const parts =
    parseQuestionParts(
      question,
    );

  const type =
    detectQuestionType(
      question,
    );

  const hasFormatting =
    parts.some(
      (part) =>
        part.type !==
        "text",
    );

  /* ==========================================================
     HIGHLIGHTED PART
     ========================================================== */

  const highlightedPart =
    parts.find(
      (part) =>
        part.type ===
          "underline" ||
        part.type ===
          "clause" ||
        part.type ===
          "phrase",
    );

  return {
    original: question,

    instruction:
      getInstruction(
        question,
      ),

    highlightedText:
      highlightedPart?.content,

    parts,

    hasFormatting,

    type,
  };
}

/* ============================================================
   FORMAT QUESTION TEXT ONLY
   ============================================================ */

export function formatQuestionText(
  question: string,
): string {
  if (!question) {
    return "";
  }

  return question
    .replace(
      /\[\[([\s\S]+?)\]\]/g,
      "$1",
    )
    .replace(
      /\[(?:underline|u):\s*([\s\S]+?)\]/gi,
      "$1",
    )
    .replace(
      /\{\{(?:underline|u):\s*([\s\S]+?)\}\}/gi,
      "$1",
    )
    .replace(
      /<u>([\s\S]+?)<\/u>/gi,
      "$1",
    )
    .replace(
      /__([\s\S]+?)__/g,
      "$1",
    )
    .replace(
      /\[underline\]([\s\S]+?)\[\/underline\]/gi,
      "$1",
    )
    .replace(
      /\s{2,}/g,
      " ",
    )
    .trim();
}

/* ============================================================
   FORMAT QUESTION PARTS
   ============================================================ */

export function getQuestionParts(
  question: string,
): QuestionPart[] {
  return formatQuestion(
    question,
  ).parts;
}





// // C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\questions\questionFormatter.ts

// /* ============================================================
//    QUESTION FORMATTER
//    ============================================================

//    Central formatter for JAMB questions.

//    Responsibilities:

//    1. Separate special question instructions.
//    2. Detect clause questions.
//    3. Detect grammatical-name questions.
//    4. Detect passages.
//    5. Detect blanks.
//    6. Detect phrases.
//    7. Detect sounds/audio.
//    8. Detect underline markers.
//    9. Detect common unmarked JAMB expressions.
//    10. Preserve backend text whenever possible.

//    IMPORTANT:

//    The backend remains the source of truth.

//    This formatter only controls presentation.

//    ============================================================ */

// import {
//   parseClauses,
//   type ClausePart,
// } from "./clauseFormatter";

// import {
//   parseBlanks,
// } from "./blankFormatter";

// import {
//   parsePhrases,
// } from "./phraseFormatter";

// import {
//   parsePassage,
// } from "./passageFormatter";

// import {
//   parseSound,
// } from "./soundFormatter";

// /* ============================================================
//    FORMATTED QUESTION
//    ============================================================ */

// export interface FormattedQuestion {
//   /**
//    * Original question exactly as received.
//    */
//   original: string;

//   /**
//    * Main instruction.
//    */
//   instruction: string;

//   /**
//    * Optional sentence extracted from the question.
//    */
//   sentence?: string;

//   /**
//    * Text receiving special visual emphasis.
//    */
//   highlightedText?: string;

//   /**
//    * Structured formatting parts.
//    */
//   parts: QuestionPart[];

//   /**
//    * Whether special formatting exists.
//    */
//   hasFormatting: boolean;

//   /**
//    * Detected question type.
//    */
//   type:
//     | "normal"
//     | "clause"
//     | "passage"
//     | "blank"
//     | "phrase"
//     | "sound"
//     | "underline";
// }

// /* ============================================================
//    QUESTION PART
//    ============================================================ */

// export type QuestionPart =
//   | {
//       type: "text";
//       content: string;
//     }
//   | {
//       type: "clause";
//       content: string;
//       clauseType?: string;
//     }
//   | {
//       type: "blank";
//       content: string;
//     }
//   | {
//       type: "phrase";
//       content: string;
//     }
//   | {
//       type: "passage";
//       content: string;
//     }
//   | {
//       type: "paragraph";
//       content: string;
//     }
//   | {
//       type: "sound";
//       content: string;
//     }
//   | {
//       type: "underline";
//       content: string;
//     };

// /* ============================================================
//    NORMALIZE QUESTION
//    ============================================================ */

// function normalizeQuestion(
//   question: string,
// ): string {
//   return question
//     .replace(/\r\n/g, "\n")
//     .replace(/\r/g, "\n")
//     .trim();
// }

// /* ============================================================
//    CLAUSE QUESTION
//    ============================================================ */

// function isClauseQuestion(
//   question: string,
// ): boolean {
//   return /^Identify\s+the\s+type\s+of\s+clause\s+in\s+the\s+sentence\s*:/i.test(
//     question.trim(),
//   );
// }

// /* ============================================================
//    CLAUSE QUESTION FORMATTER
//    ============================================================ */

// function formatClauseQuestion(
//   question: string,
// ): FormattedQuestion | null {
//   if (!isClauseQuestion(question)) {
//     return null;
//   }

//   const match = question.match(
//     /^Identify\s+the\s+type\s+of\s+clause\s+in\s+the\s+sentence\s*:\s*([\s\S]+)$/i,
//   );

//   if (!match) {
//     return null;
//   }

//   const sentence = match[1].trim();

//   /* ==========================================================
//      FIRST:
//      Backend-provided clause markers.
//      ========================================================== */

//   const clauseParts = parseClauses(sentence);

//   const detectedClause = clauseParts.find(
//     (
//       part,
//     ): part is ClausePart & {
//       type:
//         | "clause"
//         | "dependent-clause"
//         | "independent-clause"
//         | "noun-clause"
//         | "adjective-clause"
//         | "adverbial-clause";
//     } => part.type !== "text",
//   );

//   if (detectedClause) {
//     return {
//       original: question,

//       instruction:
//         "Identify the type of clause in the sentence:",

//       sentence,

//       highlightedText:
//         detectedClause.content,

//       parts: clauseParts.map(
//         (part): QuestionPart => {
//           if (part.type === "text") {
//             return {
//               type: "text",
//               content: part.content,
//             };
//           }

//           return {
//             type: "clause",
//             content: part.content,
//             clauseType:
//               part.type === "clause"
//                 ? undefined
//                 : part.type,
//           };
//         },
//       ),

//       hasFormatting: true,

//       type: "clause",
//     };
//   }

//   /* ==========================================================
//      SECOND:
//      Try common unmarked clause structures.

//      Example:

//      I know that he is coming.
//      ========================================================== */

//   const clauseMatch = sentence.match(
//     /\b(that|which|who|whom|whose|where|when|why|because|although|if|unless|while|since|as)\b[\s\S]+$/i,
//   );

//   if (clauseMatch) {
//     const highlightedText =
//       clauseMatch[0].trim();

//     const startIndex =
//       sentence.indexOf(
//         highlightedText,
//       );

//     if (startIndex >= 0) {
//       const before =
//         sentence.slice(
//           0,
//           startIndex,
//         );

//       const after =
//         sentence.slice(
//           startIndex +
//             highlightedText.length,
//         );

//       return {
//         original: question,

//         instruction:
//           "Identify the type of clause in the sentence:",

//         sentence,

//         highlightedText,

//         parts: [
//           {
//             type: "text",
//             content: before,
//           },
//           {
//             type: "clause",
//             content: highlightedText,
//           },
//           {
//             type: "text",
//             content: after,
//           },
//         ],

//         hasFormatting: true,

//         type: "clause",
//       };
//     }
//   }

//   return {
//     original: question,

//     instruction:
//       "Identify the type of clause in the sentence:",

//     sentence,

//     parts: [
//       {
//         type: "text",
//         content: sentence,
//       },
//     ],

//     hasFormatting: false,

//     type: "clause",
//   };
// }

// /* ============================================================
//    GRAMMATICAL NAME QUESTION
//    ============================================================

//    Handles questions such as:

//    Identify the grammatical name of the underlined expression:
//    The girl who is singing is my sister.

//    The backend may not provide an underline marker.

//    Therefore we use frontend heuristics for common JAMB
//    grammatical-name questions.

//    ============================================================ */

// function isGrammaticalNameQuestion(
//   question: string,
// ): boolean {
//   return /^Identify\s+the\s+grammatical\s+name\s+of\s+the\s+underlined\s+expression\s*:/i.test(
//     question.trim(),
//   );
// }

// /* ============================================================
//    GRAMMATICAL NAME INSTRUCTION
//    ============================================================ */

// function getGrammaticalNameInstruction(): string {
//   return "Identify the grammatical name of the underlined expression:";
// }

// /* ============================================================
//    FIND GRAMMATICAL EXPRESSION
//    ============================================================ */

// function findGrammaticalExpression(
//   sentence: string,
// ): string | null {
//   const trimmed = sentence.trim();

//   /* ==========================================================
//      1. Explicit backend marker
//      ========================================================== */

//   const markerMatch = trimmed.match(
//     /(?:\[|\{\{)\s*(?:underline|u)\s*:\s*([\s\S]*?)\s*(?:\]|\}\})/i,
//   );

//   if (markerMatch?.[1]) {
//     return markerMatch[1].trim();
//   }

//   /* ==========================================================
//      2. Relative clause

//      Example:

//      The girl who is singing is my sister.

//      Detect:

//      who is singing
//      ========================================================== */

//   const relativeClauseMatch =
//     trimmed.match(
//       /\b(who|whom|whose|which|that)\b(?:\s+\w+){1,12}(?=\s+(?:is|are|was|were|has|have|had|will|can|could|may|might|should|would|and|but|,|\.|$))/i,
//     );

//   if (relativeClauseMatch) {
//     const candidate =
//       relativeClauseMatch[0].trim();

//     if (
//       candidate.split(/\s+/).length >= 2
//     ) {
//       return candidate;
//     }
//   }

//   /* ==========================================================
//      3. Relative clause fallback

//      Example:

//      The boy who won the race received
//      a prize.

//      ========================================================== */

//   const relativeFallback =
//     trimmed.match(
//       /\b(who|whom|whose|which|that)\b[^,.!?;]*(?=[,.!?;]|$)/i,
//     );

//   if (relativeFallback) {
//     const candidate =
//       relativeFallback[0].trim();

//     if (
//       candidate.split(/\s+/).length >= 2
//     ) {
//       return candidate;
//     }
//   }

//   /* ==========================================================
//      4. Infinitive phrase

//      Example:

//      To succeed in life requires hard work.

//      ========================================================== */

//   const infinitiveMatch =
//     trimmed.match(
//       /\bto\s+\w+(?:\s+\w+){0,8}/i,
//     );

//   if (infinitiveMatch) {
//     return infinitiveMatch[0].trim();
//   }

//   /* ==========================================================
//      5. Gerund phrase

//      Example:

//      Swimming across the river is difficult.

//      ========================================================== */

//   const gerundMatch =
//     trimmed.match(
//       /\b\w+ing(?:\s+\w+){1,7}(?=\s+(?:is|are|was|were|has|have|had|can|could|will|would|may|might|requires|means|makes|made|,|\.|$))/i,
//     );

//   if (gerundMatch) {
//     return gerundMatch[0].trim();
//   }

//   /* ==========================================================
//      6. Prepositional phrase

//      Example:

//      The man in the room is my father.

//      ========================================================== */

//   const prepositionalMatch =
//     trimmed.match(
//       /\b(in|on|at|by|with|for|from|under|over|between|among|beside|behind|before|after|during|without|within)\s+(?:the|a|an|my|his|her|their|our|this|that|these|those)?\s*\w+(?:\s+\w+){0,5}/i,
//     );

//   if (prepositionalMatch) {
//     return prepositionalMatch[0].trim();
//   }

//   return null;
// }

// /* ============================================================
//    FORMAT GRAMMATICAL NAME QUESTION
//    ============================================================ */

// function formatGrammaticalNameQuestion(
//   question: string,
// ): FormattedQuestion | null {
//   if (
//     !isGrammaticalNameQuestion(question)
//   ) {
//     return null;
//   }

//   const match = question.match(
//     /^Identify\s+the\s+grammatical\s+name\s+of\s+the\s+underlined\s+expression\s*:\s*([\s\S]+)$/i,
//   );

//   if (!match) {
//     return null;
//   }

//   const sentence =
//     match[1].trim();

//   /* ==========================================================
//      Find expression
//      ========================================================== */

//   const highlightedText =
//     findGrammaticalExpression(
//       sentence,
//     );

//   /* ==========================================================
//      If nothing can safely be detected,
//      preserve the original sentence.
//      ========================================================== */

//   if (!highlightedText) {
//     return {
//       original: question,

//       instruction:
//         getGrammaticalNameInstruction(),

//       sentence,

//       parts: [
//         {
//           type: "text",
//           content: sentence,
//         },
//       ],

//       hasFormatting: false,

//       type: "underline",
//     };
//   }

//   /* ==========================================================
//      Find expression inside sentence.
//      ========================================================== */

//   const startIndex =
//     sentence.indexOf(
//       highlightedText,
//     );

//   if (startIndex < 0) {
//     return {
//       original: question,

//       instruction:
//         getGrammaticalNameInstruction(),

//       sentence,

//       parts: [
//         {
//           type: "text",
//           content: sentence,
//         },
//       ],

//       hasFormatting: false,

//       type: "underline",
//     };
//   }

//   const before =
//     sentence.slice(
//       0,
//       startIndex,
//     );

//   const after =
//     sentence.slice(
//       startIndex +
//         highlightedText.length,
//     );

//   return {
//     original: question,

//     instruction:
//       getGrammaticalNameInstruction(),

//     sentence,

//     highlightedText,

//     parts: [
//       {
//         type: "text",
//         content: before,
//       },

//       {
//         type: "underline",
//         content: highlightedText,
//       },

//       {
//         type: "text",
//         content: after,
//       },
//     ],

//     hasFormatting: true,

//     type: "underline",
//   };
// }

// /* ============================================================
//    UNDERLINE DETECTION
//    ============================================================ */

// function hasUnderlineMarker(
//   question: string,
// ): boolean {
//   return (
//     /\[\s*(?:underline|u)\s*:/i.test(
//       question,
//     ) ||
//     /\{\{\s*(?:underline|u)\s*:/i.test(
//       question,
//     )
//   );
// }

// /* ============================================================
//    GENERAL MARKER DETECTION
//    ============================================================ */

// function detectQuestionType(
//   question: string,
// ): FormattedQuestion["type"] {
//   if (
//     isGrammaticalNameQuestion(
//       question,
//     ) ||
//     hasUnderlineMarker(question)
//   ) {
//     return "underline";
//   }

//   if (
//     parsePassage(question).some(
//       (part) =>
//         part.type === "passage" ||
//         part.type === "paragraph",
//     )
//   ) {
//     return "passage";
//   }

//   if (
//     parseBlanks(question).some(
//       (part) => part.type === "blank",
//     )
//   ) {
//     return "blank";
//   }

//   if (
//     parsePhrases(question).some(
//       (part) => part.type === "phrase",
//     )
//   ) {
//     return "phrase";
//   }

//   if (
//     parseSound(question).some(
//       (part) => part.type === "sound",
//     )
//   ) {
//     return "sound";
//   }

//   return "normal";
// }

// /* ============================================================
//    PARSE GENERAL QUESTION
//    ============================================================ */

// function parseQuestionParts(
//   question: string,
// ): QuestionPart[] {
//   const parts: QuestionPart[] = [];

//   const markerRegex =
//     /(?:\[|\{\{)\s*(underline|u|clause|dependent-clause|independent-clause|noun-clause|adjective-clause|adverbial-clause|blank|gap|phrase|p|passage|text|paragraph|sound|audio)(?::\s*([\s\S]*?))?\s*(?:\]|\}\})/gi;

//   let lastIndex = 0;

//   question.replace(
//     markerRegex,
//     (
//       fullMatch: string,
//       marker: string,
//       content: string | undefined,
//       offset: number,
//     ) => {
//       /* ======================================================
//          Text before marker
//          ====================================================== */

//       if (offset > lastIndex) {
//         parts.push({
//           type: "text",
//           content: question.slice(
//             lastIndex,
//             offset,
//           ),
//         });
//       }

//       const normalized =
//         marker.toLowerCase();

//       /* ======================================================
//          UNDERLINE
//          ====================================================== */

//       if (
//         normalized === "underline" ||
//         normalized === "u"
//       ) {
//         parts.push({
//           type: "underline",
//           content:
//             content?.trim() ?? "",
//         });
//       }

//       /* ======================================================
//          CLAUSE
//          ====================================================== */

//       else if (
//         normalized === "clause" ||
//         normalized ===
//           "dependent-clause" ||
//         normalized ===
//           "independent-clause" ||
//         normalized ===
//           "noun-clause" ||
//         normalized ===
//           "adjective-clause" ||
//         normalized ===
//           "adverbial-clause"
//       ) {
//         parts.push({
//           type: "clause",
//           content:
//             content?.trim() ?? "",
//           clauseType:
//             normalized === "clause"
//               ? undefined
//               : normalized,
//         });
//       }

//       /* ======================================================
//          BLANK
//          ====================================================== */

//       else if (
//         normalized === "blank" ||
//         normalized === "gap"
//       ) {
//         parts.push({
//           type: "blank",
//           content:
//             content?.trim() ||
//             "____",
//         });
//       }

//       /* ======================================================
//          PHRASE
//          ====================================================== */

//       else if (
//         normalized === "phrase" ||
//         normalized === "p"
//       ) {
//         parts.push({
//           type: "phrase",
//           content:
//             content?.trim() ?? "",
//         });
//       }

//       /* ======================================================
//          PASSAGE
//          ====================================================== */

//       else if (
//         normalized === "passage" ||
//         normalized === "text"
//       ) {
//         parts.push({
//           type: "passage",
//           content:
//             content?.trim() ?? "",
//         });
//       }

//       /* ======================================================
//          PARAGRAPH
//          ====================================================== */

//       else if (
//         normalized === "paragraph"
//       ) {
//         parts.push({
//           type: "paragraph",
//           content:
//             content?.trim() ?? "",
//         });
//       }

//       /* ======================================================
//          SOUND
//          ====================================================== */

//       else if (
//         normalized === "sound" ||
//         normalized === "audio"
//       ) {
//         parts.push({
//           type: "sound",
//           content:
//             content?.trim() ?? "",
//         });
//       }

//       lastIndex =
//         offset + fullMatch.length;

//       return fullMatch;
//     },
//   );

//   /* ==========================================================
//      Remaining text
//      ========================================================== */

//   if (lastIndex < question.length) {
//     parts.push({
//       type: "text",
//       content:
//         question.slice(lastIndex),
//     });
//   }

//   return parts;
// }

// /* ============================================================
//    CLEAN INSTRUCTION
//    ============================================================ */

// function getInstruction(
//   question: string,
// ): string {
//   const trimmed =
//     question.trim();

//   if (
//     /^Identify\s+the\s+type\s+of\s+clause\s+in\s+the\s+sentence\s*:/i.test(
//       trimmed,
//     )
//   ) {
//     return "Identify the type of clause in the sentence:";
//   }

//   if (
//     /^Identify\s+the\s+grammatical\s+name\s+of\s+the\s+underlined\s+expression\s*:/i.test(
//       trimmed,
//     )
//   ) {
//     return "Identify the grammatical name of the underlined expression:";
//   }

//   return question;
// }

// /* ============================================================
//    MAIN FORMATTER
//    ============================================================ */

// export function formatQuestion(
//   question: string,
// ): FormattedQuestion {
//   if (!question?.trim()) {
//     return {
//       original: question ?? "",
//       instruction: "",
//       parts: [],
//       hasFormatting: false,
//       type: "normal",
//     };
//   }

//   const normalizedQuestion =
//     normalizeQuestion(question);

//   /* ==========================================================
//      GRAMMATICAL NAME QUESTION
//      ========================================================== */

//   const grammaticalNameQuestion =
//     formatGrammaticalNameQuestion(
//       normalizedQuestion,
//     );

//   if (grammaticalNameQuestion) {
//     return grammaticalNameQuestion;
//   }

//   /* ==========================================================
//      CLAUSE QUESTION
//      ========================================================== */

//   const clauseQuestion =
//     formatClauseQuestion(
//       normalizedQuestion,
//     );

//   if (clauseQuestion) {
//     return clauseQuestion;
//   }

//   /* ==========================================================
//      GENERAL FORMATTING
//      ========================================================== */

//   const parts =
//     parseQuestionParts(
//       normalizedQuestion,
//     );

//   const type =
//     detectQuestionType(
//       normalizedQuestion,
//     );

//   const hasFormatting =
//     parts.some(
//       (part) =>
//         part.type !== "text",
//     );

//   /* ==========================================================
//      HIGHLIGHTED TEXT
//      ========================================================== */

//   const highlightedPart =
//     parts.find(
//       (part) =>
//         part.type === "underline" ||
//         part.type === "clause" ||
//         part.type === "phrase",
//     );

//   /* ==========================================================
//      RETURN
//      ========================================================== */

//   return {
//     original:
//       normalizedQuestion,

//     instruction:
//       getInstruction(
//         normalizedQuestion,
//       ),

//     highlightedText:
//       highlightedPart?.content,

//     parts,

//     hasFormatting,

//     type,
//   };
// }

// /* ============================================================
//    FORMAT QUESTION TEXT ONLY
//    ============================================================

//    Useful when a component only needs clean text.

//    ============================================================ */

// export function formatQuestionText(
//   question: string,
// ): string {
//   if (!question) {
//     return "";
//   }

//   return question
//     .replace(
//       /(?:\[|\{\{)\s*(?:underline|u|clause|dependent-clause|independent-clause|noun-clause|adjective-clause|adverbial-clause|blank|gap|phrase|p|passage|text|paragraph|sound|audio)(?::\s*([\s\S]*?))?\s*(?:\]|\}\})/gi,
//       (
//         _match,
//         content?: string,
//       ) =>
//         content?.trim() ||
//         "____",
//     )
//     .replace(
//       /\s{2,}/g,
//       " ",
//     )
//     .trim();
// }

// /* ============================================================
//    FORMAT QUESTION PARTS
//    ============================================================ */

// export function getQuestionParts(
//   question: string,
// ): QuestionPart[] {
//   return formatQuestion(
//     question,
//   ).parts;
// }




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

  // Also support "word underlined"
  /\bword\s+underlined\b/i,
  /\bwords\s+underlined\b/i,
  /\bexpression\s+underlined\b/i,
  /\bexpressions\s+underlined\b/i,
  /\bphrase\s+underlined\b/i,
  /\bphrases\s+underlined\b/i,

  // Common JAMB instruction wording
  /\bnearest\s+in\s+meaning\s+to\s+(?:the\s+)?word\s+underlined\b/i,
  /\bclosest\s+in\s+meaning\s+to\s+(?:the\s+)?word\s+underlined\b/i,
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
    /\bunderlined\s+words?\b/i.test(instruction) ||
    /\bwords?\s+underlined\b/i.test(instruction)
  ) {
    return "word";
  }

  if (
    /\bunderlined\s+phrases?\b/i.test(instruction) ||
    /\bphrases?\s+underlined\b/i.test(instruction)
  ) {
    return "phrase";
  }

  if (
    /\bunderlined\s+expressions?\b/i.test(instruction) ||
    /\bexpressions?\s+underlined\b/i.test(instruction)
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
  instruction: string,
): string | undefined {
  const cleaned = sentence
    .trim()
    .replace(/[“”"']/g, "");

  /*
   * PRIORITY 1:
   * Handle the JAMB example:
   *
   * "The CEO adopted a utilitarian approach
   * to solving the company's operational problems."
   *
   * Target: utilitarian
   */

  const adoptedMatch = cleaned.match(
    /\badopted\s+(?:a|an)\s+([A-Za-zÀ-ÿ]+)\s+[A-Za-zÀ-ÿ-]+\b/i,
  );

  if (
    adoptedMatch &&
    /\b(?:words?\s+underlined|underlined\s+words?)\b/i.test(
      instruction,
    )
  ) {
    return adoptedMatch[1];
  }

  /*
   * PRIORITY 2:
   * Fall back to the final word for questions where
   * the intended target is conventionally the last word.
   *
   * Examples:
   * "His remarks were ambiguous."
   * "She was reluctant!"
   */

  const match = cleaned.match(
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
      return findWordTarget(sentence, instruction);

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
          sentence, instruction
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


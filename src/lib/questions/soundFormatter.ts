


// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\questions\soundFormatter.ts

/* ============================================================
   SOUND FORMATTER
   ============================================================

   Converts sound/audio markers passed from the backend into
   frontend-friendly HTML/React-renderable structures.

   Supported formats:

   [sound:word]
   [audio:word]
   {{sound:word}}
   {{audio:word}}

   Examples:

   "Choose the word that sounds like [sound:boy]."

   "Listen to [audio:ship] and select the correct option."

   The formatter does NOT play audio by itself.
   It only identifies sound markers so the UI can render them.
   ============================================================ */

export interface SoundPart {
  type: "text" | "sound";
  content: string;
}

/* ============================================================
   SOUND MARKER REGEX
   ============================================================ */

const SOUND_REGEX =
  /(?:\[|\{\{)(?:sound|audio):\s*([^}\]]+?)\s*(?:\]|\}\})/gi;

/* ============================================================
   PARSE SOUND MARKERS
   ============================================================ */

export function parseSound(
  text: string,
): SoundPart[] {
  if (!text) {
    return [];
  }

  const parts: SoundPart[] = [];

  let lastIndex = 0;

  text.replace(
    SOUND_REGEX,
    (
      fullMatch: string,
      soundText: string,
      offset: number,
    ) => {
      /* --------------------------------------------------------
         Text before sound marker
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
         Sound
         -------------------------------------------------------- */

      parts.push({
        type: "sound",
        content: soundText.trim(),
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
   CHECK WHETHER TEXT CONTAINS SOUND
   ============================================================ */

export function hasSound(
  text: string,
): boolean {
  if (!text) {
    return false;
  }

  SOUND_REGEX.lastIndex = 0;

  return SOUND_REGEX.test(text);
}

/* ============================================================
   EXTRACT SOUNDS
   ============================================================ */

export function extractSounds(
  text: string,
): string[] {
  if (!text) {
    return [];
  }

  const sounds: string[] = [];

  SOUND_REGEX.lastIndex = 0;

  text.replace(
    SOUND_REGEX,
    (
      _fullMatch: string,
      soundText: string,
    ) => {
      sounds.push(soundText.trim());

      return _fullMatch;
    },
  );

  return sounds;
}

/* ============================================================
   REMOVE SOUND MARKERS
   ============================================================

   Useful when you want to display the question without the
   backend marker itself.

   Example:

   Input:
   "Which word contains [sound:sh]?"

   Output:
   "Which word contains ?"
   ============================================================ */

export function removeSoundMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(SOUND_REGEX, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ============================================================
   REPLACE SOUND MARKERS WITH PLACEHOLDER
   ============================================================

   Example:

   Input:
   "Which word contains [sound:sh]?"

   Output:
   "Which word contains 🔊?"
   ============================================================ */

export function replaceSoundWithPlaceholder(
  text: string,
  placeholder = "🔊",
): string {
  if (!text) {
    return "";
  }

  return text
    .replace(
      SOUND_REGEX,
      placeholder,
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ============================================================
   NORMALIZE SOUND MARKERS
   ============================================================

   Converts supported backend formats into one standard format.

   Example:

   [audio:ship]

   becomes:

   [sound:ship]
   ============================================================ */

export function normalizeSoundMarkers(
  text: string,
): string {
  if (!text) {
    return "";
  }

  return text.replace(
    /(?:\[|\{\{)(?:audio):\s*([^}\]]+?)\s*(?:\]|\}\})/gi,
    "[sound:$1]",
  );
}

import type { QuestionBankItem } from "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/jamb/questions/types";

const DB_NAME = "learnyfi-question-history";
const DB_VERSION = 1;
const STORE_NAME = "used-questions";

type UsedQuestionRecord = {
  id: string;
  subject: string;
  exam: string;
  fingerprint: string;
  usedAt: number;
};

function normalize(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(normalize).join("|");

  if (typeof value === "object") {
    const object = value as Record<string, unknown>;
    return Object.keys(object)
      .sort()
      .map((key) => `${key}:${normalize(object[key])}`)
      .join("|");
  }

  return String(value);
}

function scopeValue(value: string) {
  return value.trim().toLowerCase();
}

function recordId(subject: string, exam: string, fingerprint: string) {
  return `${scopeValue(subject)}::${scopeValue(exam)}::${fingerprint}`;
}

/** Stable key independent of a question's position in a downloaded set. */
export function getQuestionFingerprint(question: QuestionBankItem): string {
  const source = normalize({
    question: question.question ?? "",
    instruction: question.instruction ?? "",
    content: question.content ?? [],
    options: (question.options ?? []).map((option) => ({
      label: option.label,
      value: option.value,
    })),
  });

  let hash = 0x811c9dc5;

  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return `${(hash >>> 0).toString(16)}-${source.length}`;
}

function openHistoryDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("This browser does not support offline question history."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Could not open question history."));
    };

    request.onblocked = () => {
      reject(
        new Error(
          "Question history is blocked by another Learnyfi tab. Close other tabs and try again.",
        ),
      );
    };

    request.onsuccess = () => {
      const db = request.result;

      // Repair an existing database that does not have the history store.
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const nextVersion = db.version + 1;
        db.close();

        const upgrade = window.indexedDB.open(DB_NAME, nextVersion);

        upgrade.onupgradeneeded = () => {
          const upgradedDb = upgrade.result;

          if (!upgradedDb.objectStoreNames.contains(STORE_NAME)) {
            upgradedDb.createObjectStore(STORE_NAME, { keyPath: "id" });
          }
        };

        upgrade.onerror = () => {
          reject(upgrade.error ?? new Error("Could not repair question history."));
        };

        upgrade.onblocked = () => {
          reject(new Error("Question history upgrade is blocked. Close other Learnyfi tabs and reload."));
        };

        upgrade.onsuccess = () => {
          const upgradedDb = upgrade.result;

          if (!upgradedDb.objectStoreNames.contains(STORE_NAME)) {
            upgradedDb.close();
            reject(new Error('The "used-questions" store could not be initialized.'));
            return;
          }

          upgradedDb.onversionchange = () => upgradedDb.close();
          resolve(upgradedDb);
        };

        return;
      }

      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

export async function getUsedQuestionFingerprints(
  subject: string,
  exam: string,
): Promise<Set<string>> {
  const wantedSubject = scopeValue(subject);
  const wantedExam = scopeValue(exam);
  const db = await openHistoryDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).getAll();

      request.onsuccess = () => {
        const records = (request.result ?? []) as UsedQuestionRecord[];

        resolve(
          new Set(
            records
              .filter(
                (record) =>
                  record.subject === wantedSubject &&
                  record.exam === wantedExam,
              )
              .map((record) => record.fingerprint),
          ),
        );
      };

      request.onerror = () => {
        reject(request.error ?? new Error("Could not read question history."));
      };

      transaction.onabort = () => {
        reject(transaction.error ?? new Error("Reading question history was interrupted."));
      };
    });
  } finally {
    db.close();
  }
}

export async function markQuestionAsUsed(
  subject: string,
  exam: string,
  question: QuestionBankItem,
): Promise<void> {
  const fingerprint = getQuestionFingerprint(question);

  const record: UsedQuestionRecord = {
    id: recordId(subject, exam, fingerprint),
    subject: scopeValue(subject),
    exam: scopeValue(exam),
    fingerprint,
    usedAt: Date.now(),
  };

  const db = await openHistoryDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(record);

      transaction.oncomplete = () => resolve();

      transaction.onerror = () => {
        reject(transaction.error ?? new Error("Could not mark question as used."));
      };

      transaction.onabort = () => {
        reject(transaction.error ?? new Error("Saving question history was interrupted."));
      };
    });
  } finally {
    db.close();
  }
}

/** Marks all questions in a set when the student starts that set. */
export async function markQuestionsAsUsed(
  subject: string,
  exam: string,
  questions: QuestionBankItem[],
): Promise<void> {
  for (const question of questions) {
    await markQuestionAsUsed(subject, exam, question);
  }
}

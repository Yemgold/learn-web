import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import ts from "typescript";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Difficulty = "easy" | "medium" | "hard";
type Action = "preview" | "remove";

type BankQuestion = {
  question?: unknown;
  [key: string]: unknown;
};

type ParsedBank = {
  filePath: string;
  relativePath: string;
  source: string;
  sourceFile: ts.SourceFile;
  arrayNode: ts.ArrayLiteralExpression;
  variableName: string;
  questions: Array<{ node: ts.Expression; value: BankQuestion; index: number }>;
};

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const EXAM_TYPES = new Set(["jamb", "waec", "neco"]);

function normalizeSubject(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "");
}

function normalizeQuestion(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getBankRoot(): string {
  // This endpoint intentionally edits local source files only. Set this env
  // variable if your registry folder is in a different location.
  return path.resolve(
    process.cwd(),
    process.env.QUESTION_BANK_ROOT ||
      "src/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/questions",
  );
}

function getExportedArray(source: string, filePath: string): {
  sourceFile: ts.SourceFile;
  arrayNode: ts.ArrayLiteralExpression;
  variableName: string;
} {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  let defaultExportName: string | undefined;
  for (const statement of sourceFile.statements) {
    if (
      ts.isExportAssignment(statement) &&
      !statement.isExportEquals &&
      ts.isIdentifier(statement.expression)
    ) {
      defaultExportName = statement.expression.text;
      break;
    }
  }

  if (!defaultExportName) {
    throw new Error(`${path.basename(filePath)}: expected a default export of an array variable.`);
  }

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === defaultExportName &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        return {
          sourceFile,
          arrayNode: declaration.initializer,
          variableName: defaultExportName,
        };
      }
    }
  }

  throw new Error(`${path.basename(filePath)}: could not find the default-exported question array.`);
}

async function readBank(
  root: string,
  subjectSlug: string,
  difficulty: Difficulty,
  examType: string,
): Promise<ParsedBank> {
  const relativePath = path.join(subjectSlug, difficulty, `${examType}.ts`);
  const filePath = path.resolve(root, relativePath);
  if (!filePath.startsWith(root + path.sep)) {
    throw new Error("Invalid question-bank path.");
  }

  const source = await fs.readFile(filePath, "utf8");
  const parsed = getExportedArray(source, filePath);
  const questions = parsed.arrayNode.elements.map((node, index) => {
    if (!ts.isObjectLiteralExpression(node)) {
      throw new Error(`${relativePath}: question ${index + 1} is not an object literal. No files were changed.`);
    }
    const questionProperty = node.properties.find(
      (property): property is ts.PropertyAssignment =>
        ts.isPropertyAssignment(property) &&
        ((ts.isIdentifier(property.name) && property.name.text === "question") ||
          (ts.isStringLiteral(property.name) && property.name.text === "question")),
    );
    let question: unknown;
    if (questionProperty) {
      const initializer = questionProperty.initializer;
      if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
        question = initializer.text;
      }
    }
    return { node, value: { question }, index };
  });

  return {
    filePath,
    relativePath: relativePath.split(path.sep).join("/"),
    source,
    sourceFile: parsed.sourceFile,
    arrayNode: parsed.arrayNode,
    variableName: parsed.variableName,
    questions,
  };
}

async function scanBanks(subject: string, examType: string) {
  const subjectSlug = normalizeSubject(subject);
  if (!subjectSlug || !/^[a-z0-9]+$/.test(subjectSlug)) {
    throw new Error("Invalid subject name.");
  }
  const root = getBankRoot();
  const banks: ParsedBank[] = [];
  for (const difficulty of DIFFICULTIES) {
    banks.push(await readBank(root, subjectSlug, difficulty, examType));
  }

  const seen = new Map<string, { file: string; question: string }>();
  const duplicates: Array<{
    fingerprint: string;
    question: string;
    keptFile: string;
    duplicateFile: string;
    duplicateIndex: number;
    difficulty: Difficulty;
  }> = [];
  const removals = new Map<string, Set<number>>();
  let scannedCount = 0;

  for (const bank of banks) {
    const removeIndexes = new Set<number>();
    for (const item of bank.questions) {
      scannedCount += 1;
      const question = item.value.question;
      const fingerprint = normalizeQuestion(question);
      if (!fingerprint) continue;
      const previous = seen.get(fingerprint);
      if (previous) {
        removeIndexes.add(item.index);
        duplicates.push({
          fingerprint,
          question: String(question),
          keptFile: previous.file,
          duplicateFile: bank.relativePath,
          duplicateIndex: item.index,
          difficulty: bank.relativePath.split("/")[1] as Difficulty,
        });
      } else {
        seen.set(fingerprint, {
          file: bank.relativePath,
          question: String(question),
        });
      }
    }
    removals.set(bank.filePath, removeIndexes);
  }

  return { root, banks, duplicates, removals, scannedCount };
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Source-file cleanup is disabled in production. Run this from your local development server." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as {
      action?: Action;
      subject?: string;
      examType?: string;
    };
    const action = body.action;
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const examType = typeof body.examType === "string" ? body.examType.toLowerCase() : "";

    if (action !== "preview" && action !== "remove") {
      return NextResponse.json({ error: "Action must be preview or remove." }, { status: 400 });
    }
    if (!subject || !EXAM_TYPES.has(examType)) {
      return NextResponse.json({ error: "A valid subject and exam type are required." }, { status: 400 });
    }

    const scan = await scanBanks(subject, examType);
    if (action === "preview") {
      return NextResponse.json({
        scannedCount: scan.scannedCount,
        duplicateCount: scan.duplicates.length,
        duplicates: scan.duplicates.slice(0, 200),
        files: scan.banks.map((bank) => ({
          file: bank.relativePath,
          questionCount: bank.questions.length,
        })),
      });
    }

    if (scan.duplicates.length === 0) {
      return NextResponse.json({
        scannedCount: scan.scannedCount,
        duplicateCount: 0,
        removedCount: 0,
        changedFiles: 0,
        duplicates: [],
      });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const changed: Array<{ bank: ParsedBank; nextSource: string; backupPath: string }> = [];

    for (const bank of scan.banks) {
      const removedIndexes = scan.removals.get(bank.filePath) ?? new Set<number>();
      if (removedIndexes.size === 0) continue;
      const keptNodes = bank.arrayNode.elements
        .filter((_, index) => !removedIndexes.has(index))
        .map((node) => node.getText(bank.sourceFile));
      const replacement = `\n[\n${keptNodes.map((node) => `  ${node}`).join(",\n")}\n]`;
      const start = bank.arrayNode.getStart(bank.sourceFile);
      const end = bank.arrayNode.getEnd();
      const nextSource = bank.source.slice(0, start) + replacement + bank.source.slice(end);
      const backupPath = `${bank.filePath}.backup-${timestamp}`;
      changed.push({ bank, nextSource, backupPath });
    }

    // Validate every rewritten TypeScript file before creating backups/writing.
for (const item of changed) {
  const parsed = ts.createSourceFile(
    item.bank.filePath,
    item.nextSource,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const parseDiagnostics = (
    parsed as ts.SourceFile & {
      parseDiagnostics?: readonly ts.Diagnostic[];
    }
  ).parseDiagnostics ?? [];

  if (parseDiagnostics.length > 0) {
    const errors = parseDiagnostics
      .map((diagnostic) => {
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n"
        );

        return `Line ${diagnostic.file?.getLineAndCharacterOfPosition(
          diagnostic.start ?? 0
        ).line ?? 0 + 1}: ${message}`;
      })
      .join("\n");

    throw new Error(
      `Generated source for ${item.bank.relativePath} failed TypeScript parsing:\n${errors}\nNo files were changed.`
    );
  }
}

    // Back up all affected files first. If backup creation fails, no source is changed.
    for (const item of changed) {
      await fs.copyFile(item.bank.filePath, item.backupPath, constants.COPYFILE_EXCL);
    }

    const written: string[] = [];
    try {
      for (const item of changed) {
        const temporaryPath = `${item.bank.filePath}.tmp-${timestamp}`;
        await fs.writeFile(temporaryPath, item.nextSource, "utf8");
        await fs.rename(temporaryPath, item.bank.filePath);
        written.push(item.bank.relativePath);
      }
    } catch (writeError) {
      // Restore any already-written files from their timestamped backups.
      for (const item of changed) {
        if (written.includes(item.bank.relativePath)) {
          await fs.copyFile(item.backupPath, item.bank.filePath);
        }
      }
      throw writeError;
    }

    return NextResponse.json({
      scannedCount: scan.scannedCount,
      duplicateCount: scan.duplicates.length,
      removedCount: scan.duplicates.length,
      changedFiles: changed.length,
      backups: changed.map((item) => path.relative(process.cwd(), item.backupPath).split(path.sep).join("/")),
      duplicates: scan.duplicates.slice(0, 200),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected duplicate-cleanup error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

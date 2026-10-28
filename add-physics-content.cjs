





const fs = require("fs");
const path = require("path");

const root = path.join(
  __dirname,
  "src",
  "app",
  "admin",
  "(admin)",
  "secondary",
  "solveandwin",
  "competitions",
  "createquestion",
  "questions",
  "physics"
);

const files = [
  {
    path: "easy/jamb.ts",
    oldName: "physicsEasyQuestions",
    newName: "jambPhysicsEasyQuestions",
  },
  {
    path: "medium/jamb.ts",
    oldName: "physicsMediumQuestions",
    newName: "jambPhysicsMediumQuestions",
  },
  {
    path: "hard/jamb.ts",
    oldName: "physicsHardQuestions",
    newName: "jambPhysicsHardQuestions",
  },
];

for (const file of files) {
  const filePath = path.join(root, file.path);

  if (!fs.existsSync(filePath)) {
    console.log(`SKIPPED: ${file.path} (file not found)`);
    continue;
  }

  const source = fs.readFileSync(filePath, "utf8");

  const match = source.match(
    /const\s+\w+\s*=\s*(\[[\s\S]*\])\s*;\s*export\s+default\s+\w+\s*;?\s*$/
  );

  if (!match) {
    console.error(
      `Could not parse ${file.path}. No changes made.`
    );
    continue;
  }

  let questions;

  try {
    questions = JSON.parse(match[1]);
  } catch (error) {
    console.error(
      `Invalid JSON in ${file.path}. No changes made.`
    );
    continue;
  }

  if (!Array.isArray(questions)) {
    console.error(`Expected an array in ${file.path}.`);
    continue;
  }

  const updatedQuestions = questions.map((item, index) => {
    if (typeof item.question !== "string") {
      throw new Error(
        `${file.path}: question ${index + 1} has no valid question text.`
      );
    }

    const { id, content, ...rest } = item;

    return {
      content: [
        {
          type: "text",
          order: 1,
          segments: [
            {
              text: rest.question,
              styles: [],
            },
          ],
        },
      ],
      ...rest,
    };
  });

  // Create a backup before changing the original file.
  fs.copyFileSync(filePath, `${filePath}.bak`);

  const output = `import type { QuestionBankItem } from "@/app/admin/(admin)/secondary/solveandwin/competitions/createquestion/jamb/questions/types";

  

export const ${file.newName}: QuestionBankItem[] = ${JSON.stringify(
    updatedQuestions,
    null,
    2
  )};

export default ${file.newName};
`;

  fs.writeFileSync(filePath, output, "utf8");

  console.log(
    `UPDATED: ${file.path} — ${updatedQuestions.length} questions`
  );
}

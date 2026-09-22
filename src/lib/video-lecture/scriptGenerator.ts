




// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\video-lecture\scriptGenerator.ts

export type TeachingScriptInput = {
  subject: string;
  topic: string;
  lessonTitle: string;
  description?: string;
  instructor?: string;

  objectives: Array<{
    text: string;
  }>;

  steps: Array<{
    title: string;
    explanation: string;
    example: string;
  }>;

  keyPoints: Array<{
    text: string;
  }>;

  summary?: string;
  jambTips?: string;
  examTraps?: string;
  keywords?: string;
};

function cleanText(value?: string): string {
  return value?.trim() ?? "";
}

function addParagraph(
  parts: string[],
  text?: string
) {
  const cleaned = cleanText(text);

  if (cleaned) {
    parts.push(cleaned);
  }
}

function addTeacherTransition(
  parts: string[],
  text: string
) {
  parts.push(text);
}

export function generateTeachingScript(
  lesson: TeachingScriptInput
): string {
  const {
    subject,
    topic,
    lessonTitle,
    description,
    instructor,
    objectives,
    steps,
    keyPoints,
    summary,
    jambTips,
    examTraps,
    keywords,
  } = lesson;

  const cleanSubject = cleanText(subject);
  const cleanTopic = cleanText(topic);
  const cleanLessonTitle = cleanText(lessonTitle);
  const cleanDescription = cleanText(description);
  const cleanInstructor = cleanText(instructor);
  const cleanSummary = cleanText(summary);
  const cleanJambTips = cleanText(jambTips);
  const cleanExamTraps = cleanText(examTraps);
  const cleanKeywords = cleanText(keywords);

  const cleanObjectives = objectives
    .map((item) => cleanText(item.text))
    .filter(Boolean);

  const cleanSteps = steps
    .map((step) => ({
      title: cleanText(step.title),
      explanation: cleanText(step.explanation),
      example: cleanText(step.example),
    }))
    .filter(
      (step) =>
        step.title ||
        step.explanation ||
        step.example
    );

  const cleanKeyPoints = keyPoints
    .map((item) => cleanText(item.text))
    .filter(Boolean);

  const parts: string[] = [];

  // ============================================================
  // LESSON OPENING
  // ============================================================

  parts.push("INTRODUCTION");

  if (cleanInstructor) {
    parts.push(
      `Good day students, and welcome to JAMB League. My name is ${cleanInstructor}, and I will be your instructor for this lesson.`
    );
  } else {
    parts.push(
      "Good day students, and welcome to JAMB League. I will be your instructor for this lesson."
    );
  }

  if (cleanLessonTitle) {
    parts.push(
      `Today, we are going to study ${cleanLessonTitle}.`
    );
  } else if (cleanTopic) {
    parts.push(
      `Today, we are going to study ${cleanTopic}.`
    );
  }

  if (cleanSubject && cleanTopic) {
    parts.push(
      `This lesson is part of our ${cleanSubject} preparation, and our main focus is ${cleanTopic}.`
    );
  }

  if (cleanDescription) {
    parts.push(
      `Before we go into the details, let me give you an overview of what this lesson is about. ${cleanDescription}`
    );
  }

  parts.push(
    "As we go through this lesson, do not focus only on memorizing statements. Try to understand what each idea means, how the ideas are connected, and how the concept can be tested in an examination."
  );

  // ============================================================
  // LEARNING OBJECTIVES
  // ============================================================

  if (cleanObjectives.length > 0) {
    parts.push("LEARNING OBJECTIVES");

    parts.push(
      "By the end of this lesson, you should be able to do the following:"
    );

    cleanObjectives.forEach((objective, index) => {
      parts.push(
        `${index + 1}. ${objective}`
      );
    });

    parts.push(
      "Keep these objectives in mind throughout the lesson. At the end, we will return to them and check whether we have achieved them."
    );
  }

  // ============================================================
  // LESSON OVERVIEW
  // ============================================================

  if (cleanSteps.length > 0) {
    parts.push("LESSON OVERVIEW");

    parts.push(
      `We are going to break this topic into ${cleanSteps.length} major section${
        cleanSteps.length === 1 ? "" : "s"
      }. This will make the topic easier to understand because we will study one idea at a time and then connect the ideas together.`
    );

    cleanSteps.forEach((step, index) => {
      if (step.title) {
        parts.push(
          `${index + 1}. ${step.title}`
        );
      }
    });
  }

  // ============================================================
  // MAIN TEACHING
  // ============================================================

  if (cleanSteps.length > 0) {
    parts.push("DETAILED TEACHING");

    cleanSteps.forEach((step, index) => {
      const sectionNumber = index + 1;

      parts.push(
        `SECTION ${sectionNumber}: ${
          step.title || `Concept ${sectionNumber}`
        }`
      );

      if (step.title) {
        parts.push(
          `Let's begin with ${step.title}.`
        );
      } else {
        parts.push(
          "Let's begin with this important part of the topic."
        );
      }

      // ----------------------------------------------------------
      // Explanation
      // ----------------------------------------------------------

      if (step.explanation) {
        parts.push(
          `Here is the main idea you need to understand: ${step.explanation}`
        );

        parts.push(
          "Do not rush through this explanation. The important thing is to understand the meaning of the concept and the relationship between the different ideas being discussed."
        );
      }

      // ----------------------------------------------------------
      // Example
      // ----------------------------------------------------------

      if (step.example) {
        parts.push(
          "Let's make this clearer with an example."
        );

        parts.push(
          step.example
        );

        parts.push(
          "Now ask yourself: what exactly does this example demonstrate? The purpose of an example is not just to give you something to memorize, but to help you recognize how the concept works in a real question or situation."
        );
      }

      // ----------------------------------------------------------
      // Teacher Checkpoint
      // ----------------------------------------------------------

      parts.push(
        `Teaching checkpoint: Before we move on from ${
          step.title || "this section"
        }, pause and ask yourself what the main idea is, what makes it important, and how you would explain it to another student.`
      );

      // ----------------------------------------------------------
      // Transition
      // ----------------------------------------------------------

      if (index < cleanSteps.length - 1) {
        const nextStep = cleanSteps[index + 1];

        if (nextStep.title) {
          parts.push(
            `Now that we understand ${
              step.title || "this section"
            }, we can move to ${nextStep.title}.`
          );
        } else {
          parts.push(
            "Now that we understand this part of the topic, let's move to the next section."
          );
        }
      }
    });
  }

  // ============================================================
  // KEY POINTS
  // ============================================================

  if (cleanKeyPoints.length > 0) {
    parts.push("KEY POINTS TO REMEMBER");

    parts.push(
      "Before we move into the examination-focused part of the lesson, let's bring together the most important ideas we have discussed."
    );

    cleanKeyPoints.forEach((point, index) => {
      parts.push(
        `Key point ${index + 1}: ${point}`
      );

      parts.push(
        `When you see a question related to this idea, remember that this point should help you identify what the question is testing.`
      );
    });
  }

  // ============================================================
  // JAMB EXAMINATION FOCUS
  // ============================================================

  if (cleanJambTips) {
    parts.push("JAMB EXAMINATION TIPS");

    parts.push(
      "Now let's look at this topic from the point of view of the JAMB examination."
    );

    parts.push(
      cleanJambTips
    );

    parts.push(
      "When answering examination questions, read the question carefully before selecting an option. Look for the specific concept being tested rather than choosing an answer simply because it contains a familiar word."
    );
  }

  // ============================================================
  // EXAM TRAPS
  // ============================================================

  if (cleanExamTraps) {
    parts.push("COMMON EXAM TRAPS");

    parts.push(
      "There are also some mistakes students commonly make when answering questions from this topic."
    );

    parts.push(
      cleanExamTraps
    );

    parts.push(
      "The important lesson here is to understand the difference between closely related ideas. In JAMB questions, two options may look similar, but only one may correctly answer what the question is asking."
    );
  }

  // ============================================================
  // KEYWORDS
  // ============================================================

  if (cleanKeywords) {
    parts.push("IMPORTANT TERMS AND KEYWORDS");

    parts.push(
      "These are important words and expressions associated with this lesson:"
    );

    parts.push(
      cleanKeywords
    );

    parts.push(
      "Make sure you understand what each important term means and how it is used in the context of this topic."
    );
  }

  // ============================================================
  // RECAP
  // ============================================================

  parts.push("LESSON RECAP");

  if (cleanSummary) {
    parts.push(
      `Let's summarize the lesson. ${cleanSummary}`
    );
  } else {
    parts.push(
      "Let's quickly review what we have learned so far."
    );

    if (cleanSteps.length > 0) {
      cleanSteps.forEach((step, index) => {
        if (step.title) {
          parts.push(
            `${index + 1}. We discussed ${step.title}.`
          );
        }
      });
    }

    if (cleanKeyPoints.length > 0) {
      parts.push(
        "We also identified several important points that you should remember when solving examination questions."
      );
    }
  }

  // ============================================================
  // OBJECTIVE CHECK
  // ============================================================

  if (cleanObjectives.length > 0) {
    parts.push("OBJECTIVE CHECK");

    parts.push(
      "Let's return to our learning objectives and check your understanding."
    );

    cleanObjectives.forEach((objective, index) => {
      parts.push(
        `Objective ${index + 1}: Can you now ${objective.toLowerCase()}?`
      );
    });

    parts.push(
      "If you cannot confidently answer these questions, go back to the relevant section of the lesson and review it before attempting practice questions."
    );
  }

  // ============================================================
  // PRACTICE TRANSITION
  // ============================================================

  parts.push("PRACTICE");

  parts.push(
    "At this point, you should test your understanding with practice questions."
  );

  parts.push(
    "Do not immediately check the answer when you get a question wrong. First, identify which part of the concept you misunderstood, return to that section of the lesson, and then attempt the question again."
  );

  // ============================================================
  // CLOSING
  // ============================================================

  parts.push("CLOSING");

  parts.push(
    "That brings us to the end of this lesson."
  );

  parts.push(
    "Remember that successful JAMB preparation is not only about covering many topics. It is about understanding the concepts, recognizing how they are tested, and practising enough questions to apply what you have learned."
  );

  parts.push(
    "Review the important points from this lesson, attempt practice questions on the topic, and pay particular attention to the examination tips and common traps we discussed."
  );

  parts.push(
    "Thank you for learning with JAMB League. Keep studying, keep practising, and I'll see you in the next lesson."
  );

  return parts.join("\n\n");
}
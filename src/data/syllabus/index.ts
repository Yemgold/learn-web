





import type { SyllabusSubject } from "./biology";
import { biologySyllabus } from "./biology";

// Add these imports as you create the other subject files:
//
// import { chemistrySyllabus } from "./chemistry";
// import { physicsSyllabus } from "./physics";
// import { mathematicsSyllabus } from "./mathematics";
// import { englishSyllabus } from "./english";
// import { economicsSyllabus } from "./economics";
// import { governmentSyllabus } from "./government";
// import { geographySyllabus } from "./geography";
// import { commerceSyllabus } from "./commerce";
// import { literatureSyllabus } from "./literature";

/**
 * All secondary-school subjects.
 *
 * Biology is currently connected.
 * Other subjects can be added here one by one as their
 * syllabus files are created.
 */
export const secondarySyllabus: SyllabusSubject[] = [
  biologySyllabus,

  // chemistrySyllabus,
  // physicsSyllabus,
  // mathematicsSyllabus,
  // englishSyllabus,
  // economicsSyllabus,
  // governmentSyllabus,
  // geographySyllabus,
  // commerceSyllabus,
  // literatureSyllabus,
];

/**
 * Simple subject list.
 *
 * Useful for dropdowns where we only need:
 * - id
 * - name
 * - slug
 */
export const secondarySubjects = secondarySyllabus.map((subject) => ({
  id: subject.id,
  name: subject.name,
  slug: subject.slug,
}));

/**
 * Find a subject by its ID.
 */
export function getSyllabusSubject(
  subjectId: string,
): SyllabusSubject | undefined {
  return secondarySyllabus.find(
    (subject) => subject.id === subjectId,
  );
}

/**
 * Find a subject by its slug.
 */
export function getSyllabusSubjectBySlug(
  slug: string,
): SyllabusSubject | undefined {
  return secondarySyllabus.find(
    (subject) => subject.slug === slug,
  );
}

/**
 * Get all sections/topics belonging to a subject.
 */
export function getSyllabusSections(subjectId: string) {
  return getSyllabusSubject(subjectId)?.sections ?? [];
}

/**
 * Find a specific section across the entire secondary syllabus.
 *
 * Example:
 * getSyllabusSection("B02")
 */
export function getSyllabusSection(sectionId: string) {
  for (const subject of secondarySyllabus) {
    const section = subject.sections.find(
      (item) => item.id === sectionId,
    );

    if (section) {
      return {
        subject,
        section,
      };
    }
  }

  return undefined;
}

/**
 * Find a specific topic across the entire secondary syllabus.
 *
 * Example:
 * getSyllabusTopic("B02.4")
 */
export function getSyllabusTopic(topicId: string) {
  for (const subject of secondarySyllabus) {
    for (const section of subject.sections) {
      const topic = section.topics.find(
        (item) => item.id === topicId,
      );

      if (topic) {
        return {
          subject,
          section,
          topic,
        };
      }
    }
  }

  return undefined;
}

/**
 * Get every topic in the entire secondary syllabus
 * as a flat array.
 *
 * This will be useful later for:
 * - AI video search
 * - question generation
 * - notes
 * - analytics
 * - student progress
 */
export const allSecondaryTopics = secondarySyllabus.flatMap(
  (subject) =>
    subject.sections.flatMap((section) =>
      section.topics.map((topic) => ({
        id: topic.id,
        name: topic.name,

        subjectId: subject.id,
        subjectName: subject.name,
        subjectSlug: subject.slug,

        sectionId: section.id,
        sectionCode: section.code,
        sectionName: section.name,
      })),
    ),
);

/**
 * Find a topic by ID from the flat topic list.
 */
export function findTopic(topicId: string) {
  return allSecondaryTopics.find(
    (topic) => topic.id === topicId,
  );
}
// // C:\Users\Lara Spellman\Jamb\jamb-league\src\data\flashcards\biology\reproduction.ts

// import type { Flashcard } from "@/types/flashcard";

// export const ReproductionFlashcards: Flashcard[] = [
//   {
//     id: "biology-reproduction-001",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is reproduction?",
//     answer: "Reproduction is the biological process by which organisms produce new individuals of their species.",
//     difficulty: "easy",
//     order: 1,
//   },
//   {
//     id: "biology-reproduction-002",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is asexual reproduction?",
//     answer: "It produces offspring from one parent without fusion of gametes and often produces genetically similar offspring.",
//     difficulty: "easy",
//     order: 2,
//   },
//   {
//     id: "biology-reproduction-003",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is sexual reproduction?",
//     answer: "It involves formation and fusion of gametes and usually produces genetically varied offspring.",
//     difficulty: "easy",
//     order: 3,
//   },
//   {
//     id: "biology-reproduction-004",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is vegetative propagation?",
//     answer: "It is asexual reproduction in plants using vegetative parts such as stems, roots or leaves.",
//     difficulty: "easy",
//     order: 4,
//   },
//   {
//     id: "biology-reproduction-005",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is grafting?",
//     answer: "Grafting is an artificial vegetative propagation method in which tissues of two plants are joined so they grow as one plant.",
//     difficulty: "medium",
//     order: 5,
//   },
//   {
//     id: "biology-reproduction-006",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is pollination?",
//     answer: "Pollination is the transfer of pollen from anther to stigma.",
//     difficulty: "easy",
//     order: 6,
//   },
//   {
//     id: "biology-reproduction-007",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "Why is cross-pollination important?",
//     answer: "It can increase genetic variation and may reduce the effects of self-pollination in a population.",
//     difficulty: "medium",
//     order: 7,
//   },
//   {
//     id: "biology-reproduction-008",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is fertilization?",
//     answer: "Fertilization is the fusion of male and female gamete nuclei to form a diploid zygote.",
//     difficulty: "easy",
//     order: 8,
//   },
//   {
//     id: "biology-reproduction-009",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is implantation?",
//     answer: "Implantation is the attachment and embedding of the early embryo in the lining of the uterus.",
//     difficulty: "easy",
//     order: 9,
//   },
//   {
//     id: "biology-reproduction-010",
//     subject: "Biology",
//     topic: "Reproduction",
//     question: "What is the role of the placenta?",
//     answer: "It provides an exchange surface between maternal and fetal circulations for oxygen, nutrients and wastes and also has endocrine functions.",
//     difficulty: "medium",
//     order: 10,
//   },
// ];

// export default ReproductionFlashcards;











import type { Flashcard } from "@/types/flashcard";

export const ReproductionFlashcards: Flashcard[] = [
  {
    id: "biology-reproduction-001",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is reproduction?",
    answer:
      "The biological process by which organisms produce new individuals of their species.",
    difficulty: "easy",
    tags: ["reproduction", "biology", "jamb"],
    source: "JAMB-aligned original study flashcard",
    order: 1,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Reproduction",
      description:
        "Explore how organisms produce new individuals through asexual and sexual reproduction.",
      initialValues: {
        stage: 1,
      },
    },
  },

  {
    id: "biology-reproduction-002",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is asexual reproduction?",
    answer:
      "Reproduction involving one parent without fusion of gametes, usually producing genetically similar offspring.",
    difficulty: "easy",
    tags: ["reproduction", "biology", "jamb", "asexual-reproduction"],
    source: "JAMB-aligned original study flashcard",
    order: 2,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Asexual Reproduction",
      description:
        "Observe how one parent can produce offspring without the fusion of gametes.",
      initialValues: {
        stage: 2,
      },
    },
  },

  {
    id: "biology-reproduction-003",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is sexual reproduction?",
    answer:
      "Reproduction involving the formation and fusion of male and female gametes.",
    difficulty: "easy",
    tags: ["reproduction", "biology", "jamb", "sexual-reproduction"],
    source: "JAMB-aligned original study flashcard",
    order: 3,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Sexual Reproduction",
      description:
        "Observe gamete formation and the fusion of male and female gametes.",
      initialValues: {
        stage: 3,
      },
    },
  },

  {
    id: "biology-reproduction-004",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is vegetative propagation?",
    answer:
      "Asexual reproduction in plants using vegetative parts such as stems, roots or leaves.",
    difficulty: "easy",
    tags: [
      "reproduction",
      "biology",
      "jamb",
      "vegetative-propagation",
      "plants",
    ],
    source: "JAMB-aligned original study flashcard",
    order: 4,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Vegetative Propagation",
      description:
        "Observe how new plants develop from stems, roots or leaves of a parent plant.",
      initialValues: {
        stage: 4,
      },
    },
  },

  {
    id: "biology-reproduction-005",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is grafting?",
    answer:
      "An artificial vegetative propagation method in which tissues of two plants are joined to grow as one.",
    difficulty: "medium",
    tags: [
      "reproduction",
      "biology",
      "jamb",
      "grafting",
      "vegetative-propagation",
    ],
    source: "JAMB-aligned original study flashcard",
    order: 5,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Grafting",
      description:
        "Observe how tissues from two compatible plants are joined during grafting.",
      initialValues: {
        stage: 5,
      },
    },
  },

  {
    id: "biology-reproduction-006",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is pollination?",
    answer:
      "The transfer of pollen from the anther to the stigma of a flower.",
    difficulty: "easy",
    tags: ["reproduction", "biology", "jamb", "pollination", "plants"],
    source: "JAMB-aligned original study flashcard",
    order: 6,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Pollination",
      description:
        "Observe the transfer of pollen from the anther to the stigma.",
      initialValues: {
        stage: 6,
      },
    },
  },

  {
    id: "biology-reproduction-007",
    subject: "Biology",
    topic: "Reproduction",
    question: "Why is cross-pollination important?",
    answer:
      "It can increase genetic variation and reduce the effects of self-pollination in a population.",
    difficulty: "medium",
    tags: [
      "reproduction",
      "biology",
      "jamb",
      "cross-pollination",
      "variation",
    ],
    source: "JAMB-aligned original study flashcard",
    order: 7,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Cross-Pollination",
      description:
        "Compare pollen transfer between different plants and observe its role in variation.",
      initialValues: {
        stage: 7,
      },
    },
  },

  {
    id: "biology-reproduction-008",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is fertilization?",
    answer:
      "The fusion of male and female gamete nuclei to form a diploid zygote.",
    difficulty: "easy",
    tags: [
      "reproduction",
      "biology",
      "jamb",
      "fertilization",
      "gametes",
      "zygote",
    ],
    source: "JAMB-aligned original study flashcard",
    order: 8,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Fertilization",
      description:
        "Observe the fusion of male and female gametes and formation of a zygote.",
      initialValues: {
        stage: 8,
      },
    },
  },

  {
    id: "biology-reproduction-009",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is implantation?",
    answer:
      "The attachment and embedding of the early embryo in the lining of the uterus.",
    difficulty: "easy",
    tags: [
      "reproduction",
      "biology",
      "jamb",
      "implantation",
      "embryo",
      "uterus",
    ],
    source: "JAMB-aligned original study flashcard",
    order: 9,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Implantation",
      description:
        "Observe how the early embryo attaches to and becomes embedded in the uterine lining.",
      initialValues: {
        stage: 9,
      },
    },
  },

  {
    id: "biology-reproduction-010",
    subject: "Biology",
    topic: "Reproduction",
    question: "What is the role of the placenta?",
    answer:
      "It allows exchange of oxygen, nutrients and wastes between maternal and fetal circulations and has endocrine functions.",
    difficulty: "medium",
    tags: [
      "reproduction",
      "biology",
      "jamb",
      "placenta",
      "pregnancy",
      "embryo",
    ],
    source: "JAMB-aligned original study flashcard",
    order: 10,

    simulation: {
      type: "reproduction",
      enabled: true,
      title: "Explore Placental Exchange",
      description:
        "Observe how oxygen and nutrients move toward the fetus while wastes move toward maternal circulation.",
      initialValues: {
        stage: 10,
      },
    },
  },
];

export default ReproductionFlashcards;





import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — GENETICS AND HEREDITY                                            */
/* -------------------------------------------------------------------------- */

export const geneticsAndHeredityQuestions: ArenaQuestion[] = [
  {
    id: "biology-genetics-001",

    question:
      "Which of the following terms refers to the basic unit of heredity?",

    options: [
      {
        id: "A",
        text: "Chromosome",
      },
      {
        id: "B",
        text: "Gene",
      },
      {
        id: "C",
        text: "Nucleus",
      },
      {
        id: "D",
        text: "Cell",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A gene is the basic unit of heredity responsible for the transmission of specific characteristics from parents to offspring.",

      steps: [
        "Genes are sections of DNA that contain information for specific characteristics.",
        "Genes are located on chromosomes.",
        "They are passed from parents to their offspring.",
        "Therefore, the basic unit of heredity is the gene.",
      ],
    },
  },

  {
    id: "biology-genetics-002",

    question:
      "An organism that has two identical alleles for a particular character is said to be",

    options: [
      {
        id: "A",
        text: "heterozygous",
      },
      {
        id: "B",
        text: "homozygous",
      },
      {
        id: "C",
        text: "dominant",
      },
      {
        id: "D",
        text: "recessive",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An organism is homozygous when it possesses two identical alleles for a particular gene.",

      steps: [
        "An allele is an alternative form of a gene.",
        "An organism may inherit one allele from each parent.",
        "If the two alleles are identical, the organism is homozygous.",
        "If the alleles are different, the organism is heterozygous.",
        "Therefore, the correct answer is homozygous.",
      ],
    },
  },

  {
    id: "biology-genetics-003",

    question:
      "If T represents the allele for tallness and t represents the allele for dwarfness in pea plants, which genotype represents a heterozygous tall plant?",

    options: [
      {
        id: "A",
        text: "TT",
      },
      {
        id: "B",
        text: "Tt",
      },
      {
        id: "C",
        text: "tt",
      },
      {
        id: "D",
        text: "T",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A heterozygous organism possesses two different alleles for a particular character.",

      steps: [
        "T represents the allele for tallness.",
        "t represents the allele for dwarfness.",
        "A heterozygous genotype contains one T allele and one t allele.",
        "Therefore, Tt represents a heterozygous tall plant.",
      ],
    },
  },

  {
    id: "biology-genetics-004",

    question:
      "In Mendelian inheritance, a dominant allele is one that",

    options: [
      {
        id: "A",
        text: "is always inherited from the father",
      },
      {
        id: "B",
        text: "is expressed in the phenotype when present",
      },
      {
        id: "C",
        text: "can only occur in homozygous organisms",
      },
      {
        id: "D",
        text: "is always more common in a population",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A dominant allele is expressed in the phenotype when at least one copy is present under simple Mendelian inheritance.",

      steps: [
        "An organism may possess two different alleles for a character.",
        "A dominant allele can be expressed even when only one copy is present.",
        "A recessive allele is generally expressed only when two recessive copies are present.",
        "Dominance does not necessarily mean that an allele is more common.",
        "Therefore, the correct answer is that it is expressed in the phenotype when present.",
      ],
    },
  },

  {
    id: "biology-genetics-005",

    question:
      "Which of the following structures carries genes in a cell?",

    options: [
      {
        id: "A",
        text: "Chromosomes",
      },
      {
        id: "B",
        text: "Ribosomes",
      },
      {
        id: "C",
        text: "Vacuoles",
      },
      {
        id: "D",
        text: "Cell walls",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Chromosomes are structures made largely of DNA and proteins, and they carry genes.",

      steps: [
        "Genes are sections of DNA.",
        "DNA is organized into chromosomes in the cell nucleus of eukaryotic organisms.",
        "Chromosomes therefore carry genes.",
        "Ribosomes are involved mainly in protein synthesis.",
        "Therefore, the correct answer is chromosomes.",
      ],
    },
  },

  {
    id: "biology-genetics-006",

    question:
      "A cross between two heterozygous tall pea plants, Tt × Tt, produces what phenotypic ratio of tall to dwarf plants?",

    options: [
      {
        id: "A",
        text: "1:1",
      },
      {
        id: "B",
        text: "2:1",
      },
      {
        id: "C",
        text: "3:1",
      },
      {
        id: "D",
        text: "1:3",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "When two heterozygous individuals are crossed under simple Mendelian inheritance, the expected phenotypic ratio is 3 dominant to 1 recessive.",

      steps: [
        "The parental genotypes are Tt × Tt.",
        "Each parent can produce T or t gametes.",
        "The possible offspring genotypes are TT, Tt, Tt and tt.",
        "TT and Tt are tall when T is dominant.",
        "Only tt is dwarf.",
        "Therefore, the phenotypic ratio is 3 tall to 1 dwarf.",
      ],
    },
  },

  {
    id: "biology-genetics-007",

    question:
      "Which of the following is an example of a sex-linked characteristic in humans?",

    options: [
      {
        id: "A",
        text: "Blood group",
      },
      {
        id: "B",
        text: "Colour blindness",
      },
      {
        id: "C",
        text: "Tongue length",
      },
      {
        id: "D",
        text: "Body height",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Colour blindness is commonly inherited as an X-linked recessive characteristic.",

      steps: [
        "Sex-linked characteristics are associated with genes located on sex chromosomes.",
        "The gene responsible for common red-green colour blindness is located on the X chromosome.",
        "Males have only one X chromosome and are therefore more likely to express an X-linked recessive condition.",
        "Therefore, colour blindness is an example of a sex-linked characteristic.",
      ],
    },
  },

  {
    id: "biology-genetics-008",

    question:
      "Which of the following can cause variation among offspring of the same parents?",

    options: [
      {
        id: "A",
        text: "Genetic recombination",
      },
      {
        id: "B",
        text: "Identical genetic material in every gamete",
      },
      {
        id: "C",
        text: "Absence of meiosis",
      },
      {
        id: "D",
        text: "Absence of fertilization",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Genetic recombination during meiosis creates new combinations of alleles and contributes to variation among offspring.",

      steps: [
        "Meiosis produces gametes with different combinations of genetic material.",
        "Crossing over and independent assortment contribute to genetic recombination.",
        "Fertilization also combines genetic material from two parents.",
        "These processes contribute to differences among offspring.",
        "Therefore, genetic recombination can cause variation.",
      ],
    },
  },

  {
    id: "biology-genetics-009",

    question:
      "Which of the following represents the genotype of an individual rather than its phenotype?",

    options: [
      {
        id: "A",
        text: "Tall",
      },
      {
        id: "B",
        text: "Blue eyes",
      },
      {
        id: "C",
        text: "Tt",
      },
      {
        id: "D",
        text: "Black fur",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A genotype refers to the genetic constitution of an organism, while a phenotype refers to observable characteristics.",

      steps: [
        "The genotype describes the alleles possessed by an organism.",
        "Tt represents a pair of alleles.",
        "Tallness, eye colour and fur colour are observable characteristics.",
        "Observable characteristics are phenotypes.",
        "Therefore, Tt represents a genotype.",
      ],
    },
  },

  {
    id: "biology-genetics-010",

    question:
      "Which of the following statements about mutations is correct?",

    options: [
      {
        id: "A",
        text: "Mutations always produce harmful effects",
      },
      {
        id: "B",
        text: "Mutations are changes in genetic material",
      },
      {
        id: "C",
        text: "Mutations occur only in plants",
      },
      {
        id: "D",
        text: "Mutations cannot be inherited",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A mutation is a change in the genetic material of an organism.",

      steps: [
        "Genetic material contains the information needed for biological characteristics.",
        "A mutation changes the DNA sequence or genetic material.",
        "Mutations may be harmful, beneficial or have little noticeable effect.",
        "Mutations occurring in reproductive cells can potentially be inherited.",
        "Therefore, the correct answer is that mutations are changes in genetic material.",
      ],
    },
  },
];

export default geneticsAndHeredityQuestions;
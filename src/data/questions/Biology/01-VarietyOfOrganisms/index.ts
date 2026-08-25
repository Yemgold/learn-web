



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — VARIETY OF ORGANISMS                                             */
/* -------------------------------------------------------------------------- */

export const varietyOfOrganismsQuestions: ArenaQuestion[] = [
  // ============================================================
  // A01.3 CELL CLASSIFICATION — 35 QUESTIONS
  // ============================================================

  {
    id: "biology-variety-001",
    question:
      "Which of the following is a major characteristic of a prokaryotic cell?",
    options: [
      { id: "A", text: "It possesses a membrane-bound nucleus" },
      { id: "B", text: "It lacks a membrane-bound nucleus" },
      { id: "C", text: "It always contains chloroplasts" },
      { id: "D", text: "It contains mitochondria" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Prokaryotic cells do not possess a membrane-bound nucleus.",
      steps: [
        "Prokaryotic cells have their genetic material in a nucleoid region.",
        "The nucleoid is not surrounded by a nuclear membrane.",
        "Prokaryotes include bacteria and archaea.",
        "Membrane-bound organelles such as mitochondria are absent.",
        "Therefore, the correct answer is that prokaryotic cells lack a membrane-bound nucleus.",
      ],
    },
  },

  {
    id: "biology-variety-002",
    question:
      "Which of the following organisms has a prokaryotic cellular organization?",
    options: [
      { id: "A", text: "Amoeba" },
      { id: "B", text: "Yeast" },
      { id: "C", text: "Bacterium" },
      { id: "D", text: "Paramecium" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Bacteria are prokaryotic organisms.",
      steps: [
        "Prokaryotic organisms have cells without membrane-bound nuclei.",
        "Bacteria are prokaryotes.",
        "Amoeba, yeast and Paramecium are eukaryotic organisms.",
        "Therefore, the bacterium has a prokaryotic cellular organization.",
      ],
    },
  },

  {
    id: "biology-variety-003",
    question:
      "Which structure is present in eukaryotic cells but absent as a membrane-bound structure in prokaryotic cells?",
    options: [
      { id: "A", text: "Ribosome" },
      { id: "B", text: "Cell membrane" },
      { id: "C", text: "Nucleus" },
      { id: "D", text: "Cytoplasm" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "A membrane-bound nucleus is a defining feature of eukaryotic cells.",
      steps: [
        "Both prokaryotic and eukaryotic cells have cell membranes and cytoplasm.",
        "Both groups also contain ribosomes.",
        "Eukaryotic cells possess a membrane-bound nucleus.",
        "Prokaryotic cells lack a membrane-bound nucleus.",
        "Therefore, the correct answer is the nucleus.",
      ],
    },
  },

  {
    id: "biology-variety-004",
    question:
      "Which of the following is characteristic of a eukaryotic cell?",
    options: [
      { id: "A", text: "Absence of a nucleus" },
      { id: "B", text: "Presence of membrane-bound organelles" },
      { id: "C", text: "Absence of cytoplasm" },
      { id: "D", text: "Absence of genetic material" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Eukaryotic cells contain membrane-bound organelles.",
      steps: [
        "Eukaryotic cells have a membrane-bound nucleus.",
        "They also contain organelles such as mitochondria and, in plants, chloroplasts.",
        "They contain cytoplasm and genetic material.",
        "Therefore, the presence of membrane-bound organelles identifies eukaryotic organization.",
      ],
    },
  },

  {
    id: "biology-variety-005",
    question:
      "Which of the following organisms is eukaryotic?",
    options: [
      { id: "A", text: "Bacterium" },
      { id: "B", text: "Cyanobacterium" },
      { id: "C", text: "Amoeba" },
      { id: "D", text: "Mycoplasma" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Amoeba is a unicellular eukaryotic organism.",
      steps: [
        "Amoeba possesses a true nucleus enclosed by a nuclear membrane.",
        "Bacteria, cyanobacteria and Mycoplasma are prokaryotic.",
        "Therefore, Amoeba is the eukaryotic organism among the options.",
      ],
    },
  },

  {
    id: "biology-variety-006",
    question:
      "Which cellular feature is most useful for distinguishing prokaryotic cells from eukaryotic cells?",
    options: [
      { id: "A", text: "Presence of cytoplasm" },
      { id: "B", text: "Presence of ribosomes" },
      { id: "C", text: "Presence of a membrane-bound nucleus" },
      { id: "D", text: "Presence of DNA" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "The presence or absence of a membrane-bound nucleus distinguishes the two major cellular organizations.",
      steps: [
        "Both prokaryotes and eukaryotes contain DNA.",
        "Both contain cytoplasm and ribosomes.",
        "Eukaryotes have a membrane-bound nucleus.",
        "Prokaryotes do not have a membrane-bound nucleus.",
        "Therefore, the membrane-bound nucleus is the most useful distinction.",
      ],
    },
  },

  {
    id: "biology-variety-007",
    question:
      "Which of the following structures is found in both prokaryotic and eukaryotic cells?",
    options: [
      { id: "A", text: "Nuclear envelope" },
      { id: "B", text: "Mitochondrion" },
      { id: "C", text: "Ribosome" },
      { id: "D", text: "Chloroplast" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Ribosomes occur in both prokaryotic and eukaryotic cells.",
      steps: [
        "Ribosomes are responsible for protein synthesis.",
        "They occur in prokaryotic cells.",
        "They also occur in eukaryotic cells.",
        "Nuclear envelopes, mitochondria and chloroplasts are membrane-bound structures absent from prokaryotic cells.",
        "Therefore, ribosome is correct.",
      ],
    },
  },

  {
    id: "biology-variety-008",
    question:
      "Which of the following correctly describes the genetic material of a typical prokaryotic cell?",
    options: [
      { id: "A", text: "It is enclosed inside a nuclear membrane" },
      { id: "B", text: "It is located in a nucleoid region" },
      { id: "C", text: "It is contained only inside mitochondria" },
      { id: "D", text: "It is absent from the cell" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The main DNA of a prokaryotic cell is located in the nucleoid region.",
      steps: [
        "Prokaryotes lack a membrane-bound nucleus.",
        "Their main chromosome lies in a region called the nucleoid.",
        "Some prokaryotes may also contain plasmids.",
        "Therefore, the genetic material is located in the nucleoid region.",
      ],
    },
  },

  {
    id: "biology-variety-009",
    question:
      "Which of the following is a feature of most bacterial cells?",
    options: [
      { id: "A", text: "Membrane-bound nucleus" },
      { id: "B", text: "Circular DNA molecule" },
      { id: "C", text: "Chloroplast" },
      { id: "D", text: "Mitochondrion" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Most bacteria possess a circular chromosome.",
      steps: [
        "Bacteria are prokaryotic organisms.",
        "Their main chromosome is generally circular.",
        "They do not possess mitochondria or chloroplasts.",
        "They also lack a membrane-bound nucleus.",
        "Therefore, circular DNA is the correct choice.",
      ],
    },
  },

  {
    id: "biology-variety-010",
    question:
      "Which structure controls the activities of a typical eukaryotic cell by containing most of its genetic material?",
    options: [
      { id: "A", text: "Ribosome" },
      { id: "B", text: "Nucleus" },
      { id: "C", text: "Vacuole" },
      { id: "D", text: "Cell wall" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The nucleus contains most of the genetic material and regulates many cellular activities.",
      steps: [
        "The nucleus contains chromosomes.",
        "Chromosomes contain genetic information.",
        "This information helps control cellular activities.",
        "Therefore, the nucleus is correct.",
      ],
    },
  },

  {
    id: "biology-variety-011",
    question:
      "Which of the following is absent in a typical animal cell but present in a typical plant cell?",
    options: [
      { id: "A", text: "Cell membrane" },
      { id: "B", text: "Cytoplasm" },
      { id: "C", text: "Cell wall" },
      { id: "D", text: "Ribosomes" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Plant cells possess a cellulose cell wall, whereas animal cells do not.",
      steps: [
        "Both plant and animal cells have cell membranes.",
        "Both contain cytoplasm and ribosomes.",
        "Plant cells have a cellulose cell wall.",
        "Typical animal cells lack a cell wall.",
        "Therefore, the cell wall is correct.",
      ],
    },
  },

  {
    id: "biology-variety-012",
    question:
      "Which organelle is characteristic of photosynthetic plant cells?",
    options: [
      { id: "A", text: "Chloroplast" },
      { id: "B", text: "Centriole" },
      { id: "C", text: "Lysosome" },
      { id: "D", text: "Flagellum" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Chloroplasts contain chlorophyll and are the main sites of photosynthesis in plant cells.",
      steps: [
        "Photosynthesis requires light-absorbing pigments.",
        "Chlorophyll is located in chloroplasts.",
        "Chloroplasts occur in photosynthetic plant cells.",
        "Therefore, chloroplast is correct.",
      ],
    },
  },

  {
    id: "biology-variety-013",
    question:
      "Which cell type lacks a nucleus when mature in humans?",
    options: [
      { id: "A", text: "White blood cell" },
      { id: "B", text: "Red blood cell" },
      { id: "C", text: "Liver cell" },
      { id: "D", text: "Nerve cell" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Mature human red blood cells lack a nucleus.",
      steps: [
        "Mature red blood cells lose their nuclei during development.",
        "This provides more space for haemoglobin.",
        "Most other listed human cells retain nuclei.",
        "Therefore, the mature red blood cell is correct.",
      ],
    },
  },

  {
    id: "biology-variety-014",
    question:
      "Which of the following is a major difference between plant and animal cells?",
    options: [
      { id: "A", text: "Plant cells have cell walls while animal cells do not" },
      { id: "B", text: "Animal cells contain cytoplasm while plant cells do not" },
      { id: "C", text: "Animal cells have DNA while plant cells do not" },
      { id: "D", text: "Plant cells have ribosomes while animal cells do not" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "The cellulose cell wall is a major structural feature of plant cells.",
      steps: [
        "Plant cells have a cellulose cell wall outside the cell membrane.",
        "Typical animal cells lack a cell wall.",
        "Both groups contain DNA, cytoplasm and ribosomes.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-015",
    question:
      "Which organelle is mainly responsible for aerobic energy release in eukaryotic cells?",
    options: [
      { id: "A", text: "Nucleus" },
      { id: "B", text: "Mitochondrion" },
      { id: "C", text: "Ribosome" },
      { id: "D", text: "Golgi apparatus" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Mitochondria are the main sites of aerobic respiration in eukaryotic cells.",
      steps: [
        "Aerobic respiration releases usable energy from food.",
        "Most aerobic respiration occurs in mitochondria.",
        "Mitochondria generate ATP for cellular activities.",
        "Therefore, mitochondrion is correct.",
      ],
    },
  },

  {
    id: "biology-variety-016",
    question:
      "Which of the following organisms is made up of prokaryotic cells?",
    options: [
      { id: "A", text: "Mushroom" },
      { id: "B", text: "Bacterium" },
      { id: "C", text: "Paramecium" },
      { id: "D", text: "Amoeba" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Bacteria are organisms composed of prokaryotic cells.",
      steps: [
        "Prokaryotic cells lack a membrane-bound nucleus.",
        "Bacteria are prokaryotes.",
        "Mushrooms, Paramecium and Amoeba are eukaryotic.",
        "Therefore, bacterium is correct.",
      ],
    },
  },

  {
    id: "biology-variety-017",
    question:
      "Which of the following is NOT a membrane-bound organelle?",
    options: [
      { id: "A", text: "Mitochondrion" },
      { id: "B", text: "Chloroplast" },
      { id: "C", text: "Ribosome" },
      { id: "D", text: "Golgi apparatus" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Ribosomes are not surrounded by a membrane.",
      steps: [
        "Mitochondria, chloroplasts and Golgi apparatus are membrane-bound.",
        "Ribosomes consist mainly of RNA and proteins.",
        "They do not have a surrounding membrane.",
        "Therefore, ribosome is correct.",
      ],
    },
  },

  {
    id: "biology-variety-018",
    question:
      "Which type of cell contains a membrane-bound nucleus?",
    options: [
      { id: "A", text: "Prokaryotic cell" },
      { id: "B", text: "Eukaryotic cell" },
      { id: "C", text: "Bacterial cell only" },
      { id: "D", text: "Viral particle" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "A membrane-bound nucleus is characteristic of eukaryotic cells.",
      steps: [
        "Eukaryotic cells contain a nucleus enclosed by a nuclear envelope.",
        "Prokaryotes lack a membrane-bound nucleus.",
        "Viruses are acellular and therefore do not possess nuclei.",
        "Therefore, eukaryotic cell is correct.",
      ],
    },
  },

  {
    id: "biology-variety-019",
    question:
      "Which of the following structures provides selective control over substances entering and leaving a cell?",
    options: [
      { id: "A", text: "Cell membrane" },
      { id: "B", text: "Nucleus" },
      { id: "C", text: "Ribosome" },
      { id: "D", text: "Chromosome" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "The cell membrane is selectively permeable.",
      steps: [
        "The cell membrane surrounds the cytoplasm.",
        "It controls the movement of many substances into and out of the cell.",
        "This selective permeability helps maintain the cell's internal environment.",
        "Therefore, the cell membrane is correct.",
      ],
    },
  },

  {
    id: "biology-variety-020",
    question:
      "Which of the following contains genetic material but has no cellular structure?",
    options: [
      { id: "A", text: "Virus" },
      { id: "B", text: "Amoeba" },
      { id: "C", text: "Bacterium" },
      { id: "D", text: "Yeast" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Viruses are acellular particles containing genetic material.",
      steps: [
        "Viruses do not possess a complete cellular structure.",
        "They contain either DNA or RNA as genetic material.",
        "Amoeba, bacteria and yeast are cellular organisms.",
        "Therefore, virus is correct.",
      ],
    },
  },

  {
    id: "biology-variety-021",
    question:
      "Which feature is characteristic of plant cells but not typical animal cells?",
    options: [
      { id: "A", text: "Cellulose cell wall" },
      { id: "B", text: "Cell membrane" },
      { id: "C", text: "Cytoplasm" },
      { id: "D", text: "Mitochondria" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "The cellulose cell wall is characteristic of plant cells.",
      steps: [
        "Plant cells have a cellulose cell wall.",
        "Animal cells do not possess a cellulose cell wall.",
        "Both types have cell membranes, cytoplasm and mitochondria.",
        "Therefore, cellulose cell wall is correct.",
      ],
    },
  },

  {
    id: "biology-variety-022",
    question:
      "Which cellular organization is found in bacteria?",
    options: [
      { id: "A", text: "Prokaryotic" },
      { id: "B", text: "Eukaryotic" },
      { id: "C", text: "Multinucleate only" },
      { id: "D", text: "Acellular" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Bacteria possess prokaryotic cellular organization.",
      steps: [
        "Bacteria lack a membrane-bound nucleus.",
        "They also lack typical membrane-bound organelles.",
        "This organization is called prokaryotic.",
        "Therefore, prokaryotic is correct.",
      ],
    },
  },

  {
    id: "biology-variety-023",
    question:
      "Which of the following is a eukaryotic microorganism?",
    options: [
      { id: "A", text: "Bacterium" },
      { id: "B", text: "Yeast" },
      { id: "C", text: "Cyanobacterium" },
      { id: "D", text: "Mycoplasma" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Yeast is a unicellular fungus with eukaryotic organization.",
      steps: [
        "Yeast possesses a membrane-bound nucleus.",
        "Therefore, it is eukaryotic.",
        "Bacteria, cyanobacteria and Mycoplasma are prokaryotic.",
        "Therefore, yeast is correct.",
      ],
    },
  },

  {
    id: "biology-variety-024",
    question:
      "Which structure contains chromosomes in a typical eukaryotic cell?",
    options: [
      { id: "A", text: "Nucleus" },
      { id: "B", text: "Cell wall" },
      { id: "C", text: "Vacuole" },
      { id: "D", text: "Ribosome" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Most eukaryotic chromosomes are located inside the nucleus.",
      steps: [
        "Chromosomes contain DNA.",
        "In eukaryotic cells, most nuclear DNA is enclosed in the nucleus.",
        "The cell wall, vacuole and ribosome do not contain the main chromosomes.",
        "Therefore, nucleus is correct.",
      ],
    },
  },

  {
    id: "biology-variety-025",
    question:
      "Which of the following is absent from a bacterial cell?",
    options: [
      { id: "A", text: "DNA" },
      { id: "B", text: "Ribosomes" },
      { id: "C", text: "Cytoplasm" },
      { id: "D", text: "Membrane-bound nucleus" },
    ],
    correctAnswer: "D",
    explanation: {
      intro:
        "Bacteria do not possess a membrane-bound nucleus.",
      steps: [
        "Bacteria contain DNA.",
        "They contain cytoplasm and ribosomes.",
        "Their DNA is located in the nucleoid region.",
        "Therefore, a membrane-bound nucleus is absent.",
      ],
    },
  },

  {
    id: "biology-variety-026",
    question:
      "The classification of cells into prokaryotic and eukaryotic is mainly based on the presence or absence of the:",
    options: [
      { id: "A", text: "Cell membrane" },
      { id: "B", text: "Cell wall" },
      { id: "C", text: "Membrane-bound nucleus" },
      { id: "D", text: "Cytoplasm" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "The nucleus is the principal feature used to distinguish prokaryotic and eukaryotic organization.",
      steps: [
        "Eukaryotic cells possess a membrane-bound nucleus.",
        "Prokaryotic cells lack such a nucleus.",
        "Both groups possess cell membranes and cytoplasm.",
        "Therefore, the distinction is based mainly on the membrane-bound nucleus.",
      ],
    },
  },

  {
    id: "biology-variety-027",
    question:
      "Which of the following is found in the cytoplasm of both prokaryotic and eukaryotic cells?",
    options: [
      { id: "A", text: "Ribosomes" },
      { id: "B", text: "Nuclear envelope" },
      { id: "C", text: "Chloroplasts" },
      { id: "D", text: "Mitochondria" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Ribosomes are common to both major cellular organizations.",
      steps: [
        "Ribosomes are responsible for protein synthesis.",
        "They occur in bacteria and in eukaryotic cells.",
        "Mitochondria and chloroplasts are membrane-bound organelles found only in eukaryotes.",
        "Therefore, ribosomes are correct.",
      ],
    },
  },

  {
    id: "biology-variety-028",
    question:
      "Which of the following organisms is composed of a single eukaryotic cell?",
    options: [
      { id: "A", text: "Amoeba" },
      { id: "B", text: "Mango tree" },
      { id: "C", text: "Human" },
      { id: "D", text: "Earthworm" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Amoeba is a unicellular eukaryotic organism.",
      steps: [
        "Amoeba consists of one cell.",
        "Its cell contains a membrane-bound nucleus.",
        "Therefore, it is a unicellular eukaryote.",
        "The other organisms are multicellular.",
      ],
    },
  },

  {
    id: "biology-variety-029",
    question:
      "Which of the following is a characteristic of bacterial cells?",
    options: [
      { id: "A", text: "Presence of mitochondria" },
      { id: "B", text: "Presence of chloroplasts in all species" },
      { id: "C", text: "Absence of a membrane-bound nucleus" },
      { id: "D", text: "Presence of a nuclear envelope" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Bacteria are prokaryotes and therefore lack membrane-bound nuclei.",
      steps: [
        "Bacterial DNA is not enclosed within a nuclear membrane.",
        "Bacteria do not possess mitochondria or chloroplasts.",
        "Therefore, absence of a membrane-bound nucleus is characteristic.",
      ],
    },
  },

  {
    id: "biology-variety-030",
    question:
      "Which organelle is directly associated with protein synthesis?",
    options: [
      { id: "A", text: "Ribosome" },
      { id: "B", text: "Vacuole" },
      { id: "C", text: "Lysosome" },
      { id: "D", text: "Chloroplast only" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Ribosomes are the cellular structures responsible for protein synthesis.",
      steps: [
        "Ribosomes translate genetic information into polypeptide chains.",
        "They are found in both prokaryotic and eukaryotic cells.",
        "Therefore, ribosome is correct.",
      ],
    },
  },

  {
    id: "biology-variety-031",
    question:
      "Which of the following best distinguishes an animal cell from a plant cell?",
    options: [
      { id: "A", text: "Animal cells lack a cellulose cell wall" },
      { id: "B", text: "Animal cells lack cell membranes" },
      { id: "C", text: "Animal cells lack DNA" },
      { id: "D", text: "Animal cells lack cytoplasm" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Typical animal cells do not have a cellulose cell wall.",
      steps: [
        "Animal cells have cell membranes.",
        "They also contain DNA and cytoplasm.",
        "Plant cells have cellulose cell walls.",
        "Animal cells lack this wall.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-032",
    question:
      "Which structure gives most plant cells mechanical support and maintains their shape?",
    options: [
      { id: "A", text: "Cell wall" },
      { id: "B", text: "Nucleus" },
      { id: "C", text: "Ribosome" },
      { id: "D", text: "Golgi apparatus" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "The cellulose cell wall provides structural support to plant cells.",
      steps: [
        "The cell wall surrounds the plant cell membrane.",
        "It is strong and relatively rigid.",
        "It helps maintain cell shape and provides mechanical support.",
        "Therefore, cell wall is correct.",
      ],
    },
  },

  {
    id: "biology-variety-033",
    question:
      "Which cellular structure is common to bacteria, plants and animals?",
    options: [
      { id: "A", text: "Chloroplast" },
      { id: "B", text: "Cell membrane" },
      { id: "C", text: "Cellulose cell wall" },
      { id: "D", text: "Nuclear envelope" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "A cell membrane is a fundamental feature of cellular organisms.",
      steps: [
        "Bacteria possess cell membranes.",
        "Plant and animal cells also possess cell membranes.",
        "Chloroplasts occur only in photosynthetic eukaryotes.",
        "Therefore, cell membrane is correct.",
      ],
    },
  },

  {
    id: "biology-variety-034",
    question:
      "Which of the following is a major characteristic of eukaryotic cells?",
    options: [
      { id: "A", text: "They always exist as multicellular organisms" },
      { id: "B", text: "They possess membrane-bound organelles" },
      { id: "C", text: "They lack DNA" },
      { id: "D", text: "They lack ribosomes" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Eukaryotic cells contain membrane-bound organelles.",
      steps: [
        "Eukaryotes include both unicellular and multicellular organisms.",
        "Their cells contain membrane-bound structures such as nuclei and mitochondria.",
        "They also possess DNA and ribosomes.",
        "Therefore, membrane-bound organelles are characteristic.",
      ],
    },
  },

  {
    id: "biology-variety-035",
    question:
      "Which statement correctly compares prokaryotic and eukaryotic cells?",
    options: [
      { id: "A", text: "Both have membrane-bound nuclei" },
      { id: "B", text: "Only prokaryotes contain DNA" },
      { id: "C", text: "Eukaryotes have membrane-bound nuclei while prokaryotes do not" },
      { id: "D", text: "Only prokaryotes contain ribosomes" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "The presence of a membrane-bound nucleus is the key distinction.",
      steps: [
        "Both prokaryotes and eukaryotes contain DNA.",
        "Both also contain ribosomes.",
        "Eukaryotic cells have membrane-bound nuclei.",
        "Prokaryotic cells lack membrane-bound nuclei.",
        "Therefore, option C is correct.",
      ],
    },
  },

  // ============================================================
  // A01.8 BIOLOGICAL CLASSIFICATION — 45 QUESTIONS
  // ============================================================

  {
    id: "biology-variety-036",
    question:
      "Which kingdom contains organisms that are generally prokaryotic?",
    options: [
      { id: "A", text: "Monera" },
      { id: "B", text: "Animalia" },
      { id: "C", text: "Plantae" },
      { id: "D", text: "Fungi" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "In the traditional five-kingdom system, Monera contains prokaryotic organisms.",
      steps: [
        "Members of Monera are prokaryotic.",
        "They include bacteria and cyanobacteria.",
        "Animalia, Plantae and Fungi consist of eukaryotic organisms.",
        "Therefore, Monera is correct.",
      ],
    },
  },

  {
    id: "biology-variety-037",
    question:
      "Which kingdom includes unicellular organisms such as Amoeba and Paramecium?",
    options: [
      { id: "A", text: "Fungi" },
      { id: "B", text: "Protista" },
      { id: "C", text: "Plantae" },
      { id: "D", text: "Animalia" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Amoeba and Paramecium are traditionally classified in Kingdom Protista.",
      steps: [
        "Protists are eukaryotic organisms.",
        "Many are unicellular.",
        "Amoeba and Paramecium are examples.",
        "Therefore, Protista is correct.",
      ],
    },
  },

  {
    id: "biology-variety-038",
    question:
      "Which kingdom contains organisms that obtain nutrients by absorption and includes mushrooms?",
    options: [
      { id: "A", text: "Fungi" },
      { id: "B", text: "Plantae" },
      { id: "C", text: "Animalia" },
      { id: "D", text: "Monera" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Mushrooms belong to Kingdom Fungi.",
      steps: [
        "Fungi are heterotrophic organisms.",
        "They commonly obtain nutrients by secreting enzymes and absorbing dissolved substances.",
        "Mushrooms are fungi.",
        "Therefore, Fungi is correct.",
      ],
    },
  },

  {
    id: "biology-variety-039",
    question:
      "Which kingdom consists mainly of multicellular photosynthetic organisms?",
    options: [
      { id: "A", text: "Animalia" },
      { id: "B", text: "Fungi" },
      { id: "C", text: "Plantae" },
      { id: "D", text: "Monera" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Kingdom Plantae includes multicellular photosynthetic organisms.",
      steps: [
        "Plants generally contain chlorophyll.",
        "They manufacture organic food through photosynthesis.",
        "Most plants are multicellular.",
        "Therefore, Plantae is correct.",
      ],
    },
  },

  {
    id: "biology-variety-040",
    question:
      "Which kingdom contains organisms that ingest food and are generally multicellular?",
    options: [
      { id: "A", text: "Animalia" },
      { id: "B", text: "Fungi" },
      { id: "C", text: "Monera" },
      { id: "D", text: "Protista" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Animals are generally multicellular heterotrophs that obtain food by ingestion.",
      steps: [
        "Animals cannot manufacture their own food.",
        "They obtain nutrients by ingesting food.",
        "Most animals are multicellular.",
        "Therefore, Animalia is correct.",
      ],
    },
  },

  {
    id: "biology-variety-041",
    question:
      "Which of the following is a characteristic of fungi?",
    options: [
      { id: "A", text: "They possess cellulose cell walls" },
      { id: "B", text: "They obtain nutrients mainly by absorption" },
      { id: "C", text: "They are all photosynthetic" },
      { id: "D", text: "They are all prokaryotic" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Fungi obtain nutrients by extracellular digestion followed by absorption.",
      steps: [
        "Fungi secrete digestive enzymes onto their food source.",
        "The enzymes break complex substances into simpler molecules.",
        "The soluble products are then absorbed.",
        "Therefore, absorption is characteristic.",
      ],
    },
  },

  {
    id: "biology-variety-042",
    question:
      "The scientific classification of organisms is primarily based on:",
    options: [
      { id: "A", text: "Similarities and differences among organisms" },
      { id: "B", text: "Their geographical location only" },
      { id: "C", text: "Their economic value" },
      { id: "D", text: "Their size only" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Biological classification groups organisms based on similarities and differences.",
      steps: [
        "Organisms are compared using structural, functional and genetic features.",
        "Similar organisms are grouped together.",
        "Classification helps scientists study relationships among organisms.",
        "Therefore, similarities and differences are the basis.",
      ],
    },
  },

  {
    id: "biology-variety-043",
    question:
      "Which of the following is the broadest traditional taxonomic rank?",
    options: [
      { id: "A", text: "Species" },
      { id: "B", text: "Genus" },
      { id: "C", text: "Kingdom" },
      { id: "D", text: "Family" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Kingdom is broader than family, genus and species in the traditional hierarchy.",
      steps: [
        "Taxonomic ranks proceed from broad groups to more specific groups.",
        "Kingdom contains several phyla.",
        "Species is one of the most specific major ranks.",
        "Therefore, kingdom is the broadest among the listed ranks.",
      ],
    },
  },

  {
    id: "biology-variety-044",
    question:
      "Which taxonomic rank comes immediately below kingdom in the traditional hierarchy?",
    options: [
      { id: "A", text: "Class" },
      { id: "B", text: "Phylum" },
      { id: "C", text: "Genus" },
      { id: "D", text: "Species" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Phylum is the rank immediately below kingdom.",
      steps: [
        "The traditional sequence is Kingdom, Phylum, Class, Order, Family, Genus and Species.",
        "Therefore, phylum follows kingdom.",
      ],
    },
  },

  {
    id: "biology-variety-045",
    question:
      "Which of the following is the most specific major taxonomic rank?",
    options: [
      { id: "A", text: "Kingdom" },
      { id: "B", text: "Class" },
      { id: "C", text: "Genus" },
      { id: "D", text: "Species" },
    ],
    correctAnswer: "D",
    explanation: {
      intro:
        "Species is the most specific of the listed major taxonomic ranks.",
      steps: [
        "Kingdom is very broad.",
        "Class is narrower than kingdom.",
        "Genus is narrower than class.",
        "Species is narrower than genus.",
        "Therefore, species is correct.",
      ],
    },
  },

  {
    id: "biology-variety-046",
    question:
      "Which of the following groups is made up of prokaryotic organisms?",
    options: [
      { id: "A", text: "Bacteria" },
      { id: "B", text: "Fungi" },
      { id: "C", text: "Animals" },
      { id: "D", text: "Plants" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Bacteria are prokaryotic organisms.",
      steps: [
        "Bacterial cells lack membrane-bound nuclei.",
        "Fungi, plants and animals are eukaryotic.",
        "Therefore, bacteria are the correct group.",
      ],
    },
  },

  {
    id: "biology-variety-047",
    question:
      "Which group includes organisms such as bread mould and mushrooms?",
    options: [
      { id: "A", text: "Fungi" },
      { id: "B", text: "Animalia" },
      { id: "C", text: "Plantae" },
      { id: "D", text: "Monera" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Bread moulds and mushrooms are fungi.",
      steps: [
        "Mushrooms are reproductive structures of certain fungi.",
        "Bread moulds are also fungi.",
        "Therefore, the group is Fungi.",
      ],
    },
  },

  {
    id: "biology-variety-048",
    question:
      "Which of the following organisms belongs to Protista?",
    options: [
      { id: "A", text: "Amoeba" },
      { id: "B", text: "Mushroom" },
      { id: "C", text: "Maize" },
      { id: "D", text: "Earthworm" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Amoeba is traditionally classified under Protista.",
      steps: [
        "Amoeba is unicellular and eukaryotic.",
        "It is traditionally placed in Protista.",
        "Mushroom belongs to Fungi, maize to Plantae and earthworm to Animalia.",
        "Therefore, Amoeba is correct.",
      ],
    },
  },

  {
    id: "biology-variety-049",
    question:
      "Which feature is useful in distinguishing plants from animals?",
    options: [
      { id: "A", text: "Presence of DNA" },
      { id: "B", text: "Presence of chloroplasts in photosynthetic cells" },
      { id: "C", text: "Presence of cytoplasm" },
      { id: "D", text: "Presence of cell membranes" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Chloroplasts are characteristic of photosynthetic plant cells.",
      steps: [
        "Plants carry out photosynthesis using chlorophyll.",
        "In plants, chlorophyll is contained in chloroplasts.",
        "Animals do not possess chloroplasts.",
        "Therefore, chloroplasts help distinguish plants from animals.",
      ],
    },
  },

  {
    id: "biology-variety-050",
    question:
      "Which group contains organisms that generally lack chlorophyll and have chitinous cell walls?",
    options: [
      { id: "A", text: "Fungi" },
      { id: "B", text: "Plantae" },
      { id: "C", text: "Animalia" },
      { id: "D", text: "Protista" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Fungi generally lack chlorophyll and have cell walls containing chitin.",
      steps: [
        "Fungi are not normally photosynthetic.",
        "Their cell walls contain chitin.",
        "Plants generally have cellulose cell walls.",
        "Therefore, fungi are correct.",
      ],
    },
  },

  {
    id: "biology-variety-051",
    question:
      "Which taxonomic group contains closely related species?",
    options: [
      { id: "A", text: "Genus" },
      { id: "B", text: "Kingdom" },
      { id: "C", text: "Phylum" },
      { id: "D", text: "Domain only" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "A genus contains one or more closely related species.",
      steps: [
        "Species are grouped into genera.",
        "Members of the same genus share important characteristics.",
        "Therefore, genus is the correct answer.",
      ],
    },
  },

  {
    id: "biology-variety-052",
    question:
      "Which rank contains several related genera?",
    options: [
      { id: "A", text: "Species" },
      { id: "B", text: "Family" },
      { id: "C", text: "Genus" },
      { id: "D", text: "Individual" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "A family is a taxonomic group containing related genera.",
      steps: [
        "Several closely related species form a genus.",
        "Related genera are grouped into a family.",
        "Therefore, family is correct.",
      ],
    },
  },

  {
    id: "biology-variety-053",
    question:
      "Which taxonomic rank is made up of related families?",
    options: [
      { id: "A", text: "Order" },
      { id: "B", text: "Species" },
      { id: "C", text: "Genus" },
      { id: "D", text: "Individual" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "An order contains related families.",
      steps: [
        "Species are grouped into genera.",
        "Genera are grouped into families.",
        "Families are grouped into orders.",
        "Therefore, order is correct.",
      ],
    },
  },

  {
    id: "biology-variety-054",
    question:
      "Which taxonomic rank follows order in the traditional hierarchy?",
    options: [
      { id: "A", text: "Kingdom" },
      { id: "B", text: "Class" },
      { id: "C", text: "Family" },
      { id: "D", text: "Genus" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Family follows order in the traditional taxonomic hierarchy.",
      steps: [
        "The sequence is Kingdom, Phylum, Class, Order, Family, Genus and Species.",
        "Therefore, family follows order.",
      ],
    },
  },

  {
    id: "biology-variety-055",
    question:
      "Which characteristic is generally associated with members of Kingdom Animalia?",
    options: [
      { id: "A", text: "They manufacture food by photosynthesis" },
      { id: "B", text: "They ingest food" },
      { id: "C", text: "They have cellulose cell walls" },
      { id: "D", text: "They are all unicellular" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Animals generally obtain nutrients through ingestion.",
      steps: [
        "Animals are heterotrophic.",
        "They depend on other organisms for food.",
        "They commonly ingest food and digest it internally.",
        "Therefore, ingestion is correct.",
      ],
    },
  },

  {
    id: "biology-variety-056",
    question:
      "Which characteristic is typical of Kingdom Plantae?",
    options: [
      { id: "A", text: "Heterotrophic ingestion" },
      { id: "B", text: "Photosynthesis in many members" },
      { id: "C", text: "Absence of DNA" },
      { id: "D", text: "Prokaryotic organization" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Many plants manufacture organic food through photosynthesis.",
      steps: [
        "Plants generally contain chlorophyll.",
        "Chlorophyll enables photosynthesis.",
        "Photosynthesis allows plants to manufacture organic food.",
        "Therefore, photosynthesis is correct.",
      ],
    },
  },

  {
    id: "biology-variety-057",
    question:
      "Which of the following is NOT a characteristic of fungi?",
    options: [
      { id: "A", text: "They are eukaryotic" },
      { id: "B", text: "They obtain nutrients by absorption" },
      { id: "C", text: "They generally lack chlorophyll" },
      { id: "D", text: "They are all photosynthetic" },
    ],
    correctAnswer: "D",
    explanation: {
      intro:
        "Fungi are generally non-photosynthetic organisms.",
      steps: [
        "Fungi are eukaryotic.",
        "They usually lack chlorophyll.",
        "They obtain nutrients through absorption.",
        "Therefore, saying all fungi are photosynthetic is incorrect.",
      ],
    },
  },

  {
    id: "biology-variety-058",
    question:
      "Which group contains organisms with a chitin-containing cell wall?",
    options: [
      { id: "A", text: "Fungi" },
      { id: "B", text: "Animals" },
      { id: "C", text: "Plants only" },
      { id: "D", text: "Viruses" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Chitin is a major component of fungal cell walls.",
      steps: [
        "Fungi possess cell walls.",
        "Chitin is an important structural component of these walls.",
        "Animals do not have cell walls.",
        "Viruses are acellular.",
        "Therefore, fungi are correct.",
      ],
    },
  },

  {
    id: "biology-variety-059",
    question:
      "Which kingdom is characterized by organisms that are generally multicellular, eukaryotic and heterotrophic by ingestion?",
    options: [
      { id: "A", text: "Animalia" },
      { id: "B", text: "Plantae" },
      { id: "C", text: "Fungi" },
      { id: "D", text: "Monera" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "These characteristics describe animals.",
      steps: [
        "Animals are eukaryotic.",
        "They are generally multicellular.",
        "They obtain food through ingestion.",
        "Therefore, Animalia is correct.",
      ],
    },
  },

  {
    id: "biology-variety-060",
    question:
      "Which of the following groups contains organisms that are predominantly unicellular and eukaryotic?",
    options: [
      { id: "A", text: "Protista" },
      { id: "B", text: "Animalia" },
      { id: "C", text: "Plantae" },
      { id: "D", text: "Mammalia" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Many protists are unicellular eukaryotes.",
      steps: [
        "Protists possess membrane-bound nuclei.",
        "Many are single-celled.",
        "Amoeba and Paramecium are examples.",
        "Therefore, Protista is correct.",
      ],
    },
  },

  {
    id: "biology-variety-061",
    question:
      "Which of the following organisms is traditionally placed in Monera?",
    options: [
      { id: "A", text: "Bacterium" },
      { id: "B", text: "Amoeba" },
      { id: "C", text: "Mushroom" },
      { id: "D", text: "Fern" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Bacteria are traditionally placed in Monera in the five-kingdom system.",
      steps: [
        "Monera contains prokaryotic organisms.",
        "Bacteria are prokaryotes.",
        "Amoeba belongs to Protista.",
        "Mushroom belongs to Fungi.",
        "Fern belongs to Plantae.",
        "Therefore, bacterium is correct.",
      ],
    },
  },

  {
    id: "biology-variety-062",
    question:
      "Which of the following groups includes organisms that may be decomposers?",
    options: [
      { id: "A", text: "Fungi" },
      { id: "B", text: "Animals only" },
      { id: "C", text: "Plants only" },
      { id: "D", text: "Viruses only" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Many fungi function as decomposers.",
      steps: [
        "Fungi secrete enzymes onto organic matter.",
        "They digest complex organic materials externally.",
        "They then absorb the soluble products.",
        "This makes many fungi important decomposers.",
      ],
    },
  },

  {
    id: "biology-variety-063",
    question:
      "Which kingdom includes organisms that may be autotrophic or heterotrophic and are mostly unicellular?",
    options: [
      { id: "A", text: "Protista" },
      { id: "B", text: "Animalia" },
      { id: "C", text: "Fungi" },
      { id: "D", text: "Mammalia" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Protists display considerable nutritional diversity.",
      steps: [
        "Some protists are photosynthetic.",
        "Others obtain food heterotrophically.",
        "Many are unicellular eukaryotes.",
        "Therefore, Protista is correct.",
      ],
    },
  },

  {
    id: "biology-variety-064",
    question:
      "The main purpose of biological classification is to:",
    options: [
      { id: "A", text: "Make organisms easier to name and study" },
      { id: "B", text: "Make all organisms identical" },
      { id: "C", text: "Eliminate differences among organisms" },
      { id: "D", text: "Determine their economic value" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Classification organizes biological diversity into meaningful groups.",
      steps: [
        "There are millions of organisms.",
        "Grouping them according to shared characteristics makes them easier to study.",
        "Classification also helps identify relationships.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-065",
    question:
      "Which group contains organisms with cells that have no true nucleus?",
    options: [
      { id: "A", text: "Bacteria" },
      { id: "B", text: "Animals" },
      { id: "C", text: "Plants" },
      { id: "D", text: "Fungi" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Bacteria are prokaryotic and lack membrane-bound nuclei.",
      steps: [
        "A true nucleus is enclosed by a nuclear membrane.",
        "Bacteria do not possess such a structure.",
        "Animals, plants and fungi are eukaryotic.",
        "Therefore, bacteria are correct.",
      ],
    },
  },

  {
    id: "biology-variety-066",
    question:
      "Which group includes organisms that are generally absorptive heterotrophs?",
    options: [
      { id: "A", text: "Fungi" },
      { id: "B", text: "Animals" },
      { id: "C", text: "Plants" },
      { id: "D", text: "Viruses" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Fungi are heterotrophs that commonly absorb nutrients after external digestion.",
      steps: [
        "Fungi secrete enzymes into their surroundings.",
        "These enzymes digest food externally.",
        "The resulting soluble substances are absorbed.",
        "Therefore, fungi are absorptive heterotrophs.",
      ],
    },
  },

  {
    id: "biology-variety-067",
    question:
      "Which taxonomic rank contains the largest number of organisms among the following?",
    options: [
      { id: "A", text: "Species" },
      { id: "B", text: "Genus" },
      { id: "C", text: "Family" },
      { id: "D", text: "Kingdom" },
    ],
    correctAnswer: "D",
    explanation: {
      intro:
        "Kingdom is broader than the other listed taxonomic ranks.",
      steps: [
        "A species contains fewer organisms than a genus.",
        "A genus contains fewer organisms than a family.",
        "A family contains fewer organisms than a kingdom.",
        "Therefore, kingdom contains the largest number among these choices.",
      ],
    },
  },

  {
    id: "biology-variety-068",
    question:
      "Which group includes organisms that are generally autotrophic and possess cellulose cell walls?",
    options: [
      { id: "A", text: "Plantae" },
      { id: "B", text: "Animalia" },
      { id: "C", text: "Fungi" },
      { id: "D", text: "Viruses" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Plants generally manufacture food through photosynthesis and have cellulose cell walls.",
      steps: [
        "Plants contain chlorophyll in photosynthetic tissues.",
        "They manufacture organic food by photosynthesis.",
        "Their cell walls contain cellulose.",
        "Therefore, Plantae is correct.",
      ],
    },
  },

  {
    id: "biology-variety-069",
    question:
      "Which of the following is an example of a protist?",
    options: [
      { id: "A", text: "Paramecium" },
      { id: "B", text: "Mushroom" },
      { id: "C", text: "Grasshopper" },
      { id: "D", text: "Maize" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Paramecium is a unicellular eukaryotic protist.",
      steps: [
        "Paramecium has a membrane-bound nucleus.",
        "It is unicellular.",
        "It is traditionally classified under Protista.",
        "Therefore, Paramecium is correct.",
      ],
    },
  },

  {
    id: "biology-variety-070",
    question:
      "Which kingdom contains organisms such as maize, mango and fern?",
    options: [
      { id: "A", text: "Plantae" },
      { id: "B", text: "Animalia" },
      { id: "C", text: "Fungi" },
      { id: "D", text: "Monera" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Maize, mango and ferns are plants.",
      steps: [
        "These organisms are multicellular photosynthetic eukaryotes.",
        "They possess plant characteristics.",
        "Therefore, they belong to Plantae.",
      ],
    },
  },

  {
    id: "biology-variety-071",
    question:
      "Which kingdom contains organisms such as humans, fish and insects?",
    options: [
      { id: "A", text: "Animalia" },
      { id: "B", text: "Plantae" },
      { id: "C", text: "Fungi" },
      { id: "D", text: "Protista" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Humans, fish and insects are animals.",
      steps: [
        "They are multicellular eukaryotes.",
        "They obtain food heterotrophically by ingestion.",
        "They therefore belong to Animalia.",
      ],
    },
  },

  {
    id: "biology-variety-072",
    question:
      "Which characteristic is shared by plants and fungi?",
    options: [
      { id: "A", text: "Both are generally multicellular eukaryotes" },
      { id: "B", text: "Both always photosynthesize" },
      { id: "C", text: "Both ingest food" },
      { id: "D", text: "Both are prokaryotic" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Plants and fungi are both predominantly multicellular eukaryotes.",
      steps: [
        "Both groups contain membrane-bound nuclei.",
        "Many members of both groups are multicellular.",
        "However, plants are generally photosynthetic while fungi are absorptive heterotrophs.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-073",
    question:
      "Which of the following is NOT a basis for modern biological classification?",
    options: [
      { id: "A", text: "Evolutionary relationships" },
      { id: "B", text: "Genetic similarities" },
      { id: "C", text: "Structural characteristics" },
      { id: "D", text: "Market price of organisms" },
    ],
    correctAnswer: "D",
    explanation: {
      intro:
        "Economic value is not a biological basis for classification.",
      steps: [
        "Classification considers characteristics such as morphology.",
        "Genetic and evolutionary evidence is also important.",
        "Market price has no biological significance for classification.",
        "Therefore, market price is correct.",
      ],
    },
  },

  {
    id: "biology-variety-074",
    question:
      "Which taxonomic rank is directly below class?",
    options: [
      { id: "A", text: "Order" },
      { id: "B", text: "Family" },
      { id: "C", text: "Genus" },
      { id: "D", text: "Species" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Order follows class in the traditional taxonomic hierarchy.",
      steps: [
        "The sequence is Kingdom, Phylum, Class, Order, Family, Genus and Species.",
        "Therefore, order is directly below class.",
      ],
    },
  },

  // ============================================================
  // A01.9 NAMING AND IDENTIFICATION OF ORGANISMS — 25 QUESTIONS
  // ============================================================

  {
    id: "biology-variety-075",
    question:
      "What is the scientific naming system in which each organism is given two names called?",
    options: [
      { id: "A", text: "Binomial nomenclature" },
      { id: "B", text: "Polynomial nomenclature" },
      { id: "C", text: "Numerical classification" },
      { id: "D", text: "Local naming" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Binomial nomenclature gives each species a two-part scientific name.",
      steps: [
        "The first part of the name is the genus.",
        "The second part is the specific epithet.",
        "Together they identify the species.",
        "Therefore, the system is binomial nomenclature.",
      ],
    },
  },

  {
    id: "biology-variety-076",
    question:
      "Who is most closely associated with the development of binomial nomenclature?",
    options: [
      { id: "A", text: "Carl Linnaeus" },
      { id: "B", text: "Charles Darwin" },
      { id: "C", text: "Gregor Mendel" },
      { id: "D", text: "Robert Hooke" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Carl Linnaeus established the widely used system of binomial nomenclature.",
      steps: [
        "Linnaeus developed a standardized system for naming organisms.",
        "The system uses genus and specific epithet.",
        "It greatly improved consistency in biological naming.",
        "Therefore, Carl Linnaeus is correct.",
      ],
    },
  },

  {
    id: "biology-variety-077",
    question:
      "In the scientific name Homo sapiens, which word represents the genus?",
    options: [
      { id: "A", text: "Homo" },
      { id: "B", text: "sapiens" },
      { id: "C", text: "Homo sapiens" },
      { id: "D", text: "Neither" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "In binomial nomenclature, the first word represents the genus.",
      steps: [
        "Homo sapiens is the scientific name for humans.",
        "Homo is the genus.",
        "sapiens is the specific epithet.",
        "Therefore, Homo is correct.",
      ],
    },
  },

  {
    id: "biology-variety-078",
    question:
      "In binomial nomenclature, the genus name should begin with a:",
    options: [
      { id: "A", text: "Lowercase letter" },
      { id: "B", text: "Capital letter" },
      { id: "C", text: "Number" },
      { id: "D", text: "Symbol" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The genus name begins with a capital letter.",
      steps: [
        "Scientific names contain a genus and specific epithet.",
        "The genus starts with a capital letter.",
        "The specific epithet begins with a lowercase letter.",
        "Therefore, a capital letter is correct.",
      ],
    },
  },

  {
    id: "biology-variety-079",
    question:
      "How should the specific epithet normally begin in a binomial scientific name?",
    options: [
      { id: "A", text: "With a capital letter" },
      { id: "B", text: "With a lowercase letter" },
      { id: "C", text: "With a number" },
      { id: "D", text: "With a symbol" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The specific epithet begins with a lowercase letter.",
      steps: [
        "The genus begins with a capital letter.",
        "The specific epithet begins with a lowercase letter.",
        "Both parts together form the scientific name.",
        "Therefore, lowercase is correct.",
      ],
    },
  },

  {
    id: "biology-variety-080",
    question:
      "When typed, a scientific name such as Homo sapiens should normally be:",
    options: [
      { id: "A", text: "Underlined only" },
      { id: "B", text: "Italicized" },
      { id: "C", text: "Written entirely in capitals" },
      { id: "D", text: "Written in quotation marks" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Scientific names are conventionally italicized when typed.",
      steps: [
        "The genus and specific epithet are written in italics when typed.",
        "When handwritten, they are traditionally underlined separately.",
        "Therefore, italicized is correct.",
      ],
    },
  },

  {
    id: "biology-variety-081",
    question:
      "What is the main advantage of using scientific names?",
    options: [
      { id: "A", text: "They are understood internationally" },
      { id: "B", text: "They change from village to village" },
      { id: "C", text: "They are based only on local languages" },
      { id: "D", text: "They describe economic value" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Scientific names provide a standardized international system of identification.",
      steps: [
        "Common names vary between regions and languages.",
        "A scientific name provides a standardized reference.",
        "Scientists worldwide can therefore identify the same organism consistently.",
        "Therefore, international understanding is a major advantage.",
      ],
    },
  },

  {
    id: "biology-variety-082",
    question:
      "Which tool is commonly used to identify an unknown organism by following paired contrasting characteristics?",
    options: [
      { id: "A", text: "Dichotomous key" },
      { id: "B", text: "Thermometer" },
      { id: "C", text: "Barometer" },
      { id: "D", text: "Balance" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "A dichotomous key identifies organisms using pairs of contrasting characteristics.",
      steps: [
        "A dichotomous key presents two contrasting choices at each step.",
        "The user selects the characteristic that matches the organism.",
        "The process continues until the organism is identified.",
        "Therefore, dichotomous key is correct.",
      ],
    },
  },

  {
    id: "biology-variety-083",
    question:
      "A dichotomous key is mainly based on:",
    options: [
      { id: "A", text: "Paired contrasting characteristics" },
      { id: "B", text: "Random guesses" },
      { id: "C", text: "Organism size only" },
      { id: "D", text: "Economic importance" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Dichotomous keys use paired alternatives to narrow down identification.",
      steps: [
        "At each stage, two contrasting characteristics are presented.",
        "The correct choice directs the user to the next step.",
        "This continues until an identification is reached.",
        "Therefore, paired contrasting characteristics are correct.",
      ],
    },
  },

  {
    id: "biology-variety-084",
    question:
      "Which of the following is the correct scientific writing of the human species?",
    options: [
      { id: "A", text: "homo Sapiens" },
      { id: "B", text: "Homo sapiens" },
      { id: "C", text: "HOMO SAPIENS" },
      { id: "D", text: "Homo Sapiens" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The genus begins with a capital letter and the specific epithet with lowercase.",
      steps: [
        "Homo is the genus and begins with a capital letter.",
        "sapiens is the specific epithet and begins with lowercase.",
        "The complete scientific name is italicized when typed.",
        "Therefore, Homo sapiens is correct.",
      ],
    },
  },

  {
    id: "biology-variety-085",
    question:
      "Which part of a binomial name is written first?",
    options: [
      { id: "A", text: "Specific epithet" },
      { id: "B", text: "Genus" },
      { id: "C", text: "Family" },
      { id: "D", text: "Order" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The genus name comes first in binomial nomenclature.",
      steps: [
        "A binomial name has two principal parts.",
        "The genus is written first.",
        "The specific epithet follows it.",
        "Therefore, genus is correct.",
      ],
    },
  },

  {
    id: "biology-variety-086",
    question:
      "Which of the following represents the correct order of taxonomic ranks from broad to specific?",
    options: [
      { id: "A", text: "Species → Genus → Family → Kingdom" },
      { id: "B", text: "Kingdom → Phylum → Class → Order → Family → Genus → Species" },
      { id: "C", text: "Genus → Kingdom → Species → Family" },
      { id: "D", text: "Family → Species → Kingdom → Genus" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The traditional taxonomic hierarchy proceeds from kingdom to species.",
      steps: [
        "Kingdom is broad.",
        "Phylum follows kingdom.",
        "Class, order and family follow.",
        "Genus and species are increasingly specific.",
        "Therefore, option B is correct.",
      ],
    },
  },

  {
    id: "biology-variety-087",
    question:
      "Why are common names less reliable than scientific names?",
    options: [
      { id: "A", text: "They may vary between regions and languages" },
      { id: "B", text: "They always contain two words" },
      { id: "C", text: "They are always written in Latin" },
      { id: "D", text: "They never change" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Common names are often different in different regions.",
      steps: [
        "An organism may have several local names.",
        "The same common name may also refer to different organisms.",
        "Scientific names provide a standardized alternative.",
        "Therefore, regional and linguistic variation makes common names less reliable.",
      ],
    },
  },

  {
    id: "biology-variety-088",
    question:
      "The second part of a binomial scientific name is called the:",
    options: [
      { id: "A", text: "Kingdom" },
      { id: "B", text: "Genus" },
      { id: "C", text: "Specific epithet" },
      { id: "D", text: "Family" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "The second part of the binomial is the specific epithet.",
      steps: [
        "The first part identifies the genus.",
        "The second part is the specific epithet.",
        "Together they form the species name.",
        "Therefore, specific epithet is correct.",
      ],
    },
  },

  {
    id: "biology-variety-089",
    question:
      "Which characteristic would be most useful in a dichotomous key for identifying insects?",
    options: [
      { id: "A", text: "Presence or absence of wings" },
      { id: "B", text: "Economic value" },
      { id: "C", text: "Popularity" },
      { id: "D", text: "Market price" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Observable structural characteristics are useful for identification.",
      steps: [
        "A dichotomous key relies on distinguishing features.",
        "Wing presence is an observable structural feature.",
        "Economic value and popularity are not identification characteristics.",
        "Therefore, presence or absence of wings is correct.",
      ],
    },
  },

  {
    id: "biology-variety-090",
    question:
      "Which of the following characteristics is most suitable for distinguishing organisms in a biological key?",
    options: [
      { id: "A", text: "Number of legs" },
      { id: "B", text: "Price" },
      { id: "C", text: "Popularity" },
      { id: "D", text: "Usefulness to humans" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Structural characteristics are useful for identification.",
      steps: [
        "Number of legs can be directly observed.",
        "It can separate organisms into distinct groups.",
        "Price, popularity and usefulness are not reliable biological identification features.",
        "Therefore, number of legs is correct.",
      ],
    },
  },

  {
    id: "biology-variety-091",
    question:
      "Which language is traditionally used as the basis for many scientific names?",
    options: [
      { id: "A", text: "Latin" },
      { id: "B", text: "English only" },
      { id: "C", text: "Hausa only" },
      { id: "D", text: "French only" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Latin has traditionally been used for scientific naming.",
      steps: [
        "Scientific names are internationally standardized.",
        "Latin has historically been used because it was a scholarly language and does not change as a living language.",
        "Therefore, Latin is correct.",
      ],
    },
  },

  {
    id: "biology-variety-092",
    question:
      "What does a scientific name primarily identify?",
    options: [
      { id: "A", text: "A particular species" },
      { id: "B", text: "An individual's age" },
      { id: "C", text: "An organism's habitat only" },
      { id: "D", text: "Its economic value" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "A binomial scientific name identifies a species.",
      steps: [
        "The genus and specific epithet together provide a standardized species name.",
        "This avoids ambiguity associated with local names.",
        "Therefore, a particular species is correct.",
      ],
    },
  },

  {
    id: "biology-variety-093",
    question:
      "If two organisms have the same genus but different specific epithets, they are most likely:",
    options: [
      { id: "A", text: "Different species within the same genus" },
      { id: "B", text: "The same individual" },
      { id: "C", text: "Different kingdoms" },
      { id: "D", text: "Always unrelated" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Different species can belong to the same genus.",
      steps: [
        "The genus groups closely related species.",
        "Different specific epithets distinguish species within the genus.",
        "Therefore, they are different species within the same genus.",
      ],
    },
  },

  {
    id: "biology-variety-094",
    question:
      "Which feature is NOT normally used in a dichotomous key?",
    options: [
      { id: "A", text: "Leaf arrangement" },
      { id: "B", text: "Number of limbs" },
      { id: "C", text: "Presence of scales" },
      { id: "D", text: "Selling price" },
    ],
    correctAnswer: "D",
    explanation: {
      intro:
        "A biological identification key uses observable biological characteristics.",
      steps: [
        "Leaf arrangement can distinguish plants.",
        "Number of limbs can distinguish animals.",
        "Scales can also be a useful feature.",
        "Selling price is not a biological characteristic.",
        "Therefore, selling price is correct.",
      ],
    },
  },

  {
    id: "biology-variety-095",
    question:
      "Which statement about binomial nomenclature is correct?",
    options: [
      { id: "A", text: "Each organism receives a unique two-part scientific name" },
      { id: "B", text: "Every organism receives three kingdom names" },
      { id: "C", text: "Only animals can have scientific names" },
      { id: "D", text: "Scientific names are based on local languages only" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Binomial nomenclature provides a standardized two-part name for each species.",
      steps: [
        "The first part is the genus.",
        "The second part is the specific epithet.",
        "This system applies across biological groups.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-096",
    question:
      "Which taxonomic rank is represented by the first word in a binomial name?",
    options: [
      { id: "A", text: "Species" },
      { id: "B", text: "Genus" },
      { id: "C", text: "Family" },
      { id: "D", text: "Order" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The first word in a binomial name represents the genus.",
      steps: [
        "Scientific names have two principal parts.",
        "The genus is written first.",
        "The specific epithet follows.",
        "Therefore, genus is correct.",
      ],
    },
  },

  {
    id: "biology-variety-097",
    question:
      "What is the main purpose of a dichotomous key?",
    options: [
      { id: "A", text: "To identify an unknown organism" },
      { id: "B", text: "To measure temperature" },
      { id: "C", text: "To determine body mass" },
      { id: "D", text: "To measure rainfall" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Dichotomous keys are identification tools.",
      steps: [
        "The key presents alternative characteristics.",
        "The user follows the appropriate choices.",
        "Eventually, the organism is identified.",
        "Therefore, identification is the purpose.",
      ],
    },
  },

  {
    id: "biology-variety-098",
    question:
      "Which of the following would be the best first step when using a dichotomous key?",
    options: [
      { id: "A", text: "Observe the organism's characteristics carefully" },
      { id: "B", text: "Guess the organism's name" },
      { id: "C", text: "Determine its market price" },
      { id: "D", text: "Ignore visible features" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Correct identification begins with careful observation.",
      steps: [
        "A dichotomous key depends on observable characteristics.",
        "The organism should therefore be examined carefully.",
        "The observed features can then be compared with the alternatives in the key.",
        "Therefore, careful observation is correct.",
      ],
    },
  },

  {
    id: "biology-variety-099",
    question:
      "Which scientific name is correctly formatted?",
    options: [
      { id: "A", text: "panthera Leo" },
      { id: "B", text: "Panthera leo" },
      { id: "C", text: "PANTHERA LEO" },
      { id: "D", text: "Panthera Leo" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "The genus starts with a capital letter and the specific epithet starts with lowercase.",
      steps: [
        "Panthera is the genus.",
        "leo is the specific epithet.",
        "Therefore, Panthera leo has the correct capitalization.",
      ],
    },
  },

  // ============================================================
  // A01.10 VIRUSES AND ACELLULAR FORMS — 20 QUESTIONS
  // ============================================================

  {
    id: "biology-variety-100",
    question:
      "Which of the following best describes a virus?",
    options: [
      { id: "A", text: "A complete prokaryotic cell" },
      { id: "B", text: "An acellular infectious particle" },
      { id: "C", text: "A multicellular organism" },
      { id: "D", text: "A photosynthetic cell" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Viruses are acellular infectious agents.",
      steps: [
        "Viruses do not have complete cellular structures.",
        "They contain genetic material surrounded by a protein coat.",
        "They depend on host cells for replication.",
        "Therefore, an acellular infectious particle is correct.",
      ],
    },
  },

  {
    id: "biology-variety-101",
    question:
      "Which genetic material may be found in viruses?",
    options: [
      { id: "A", text: "DNA or RNA" },
      { id: "B", text: "Only proteins" },
      { id: "C", text: "Only carbohydrates" },
      { id: "D", text: "Cellulose only" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Viral genomes may consist of DNA or RNA.",
      steps: [
        "Viruses contain genetic information.",
        "Some viruses have DNA genomes.",
        "Others have RNA genomes.",
        "Therefore, DNA or RNA is correct.",
      ],
    },
  },

  {
    id: "biology-variety-102",
    question:
      "The protein coat surrounding a virus is called the:",
    options: [
      { id: "A", text: "Capsid" },
      { id: "B", text: "Cell wall" },
      { id: "C", text: "Nucleus" },
      { id: "D", text: "Cytoplasm" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "The capsid is the protein coat surrounding viral genetic material.",
      steps: [
        "Viral genetic material is protected by proteins.",
        "The protein coat is called the capsid.",
        "Therefore, capsid is correct.",
      ],
    },
  },

  {
    id: "biology-variety-103",
    question:
      "Why are viruses generally unable to reproduce independently?",
    options: [
      { id: "A", text: "They lack the complete cellular machinery needed for replication" },
      { id: "B", text: "They contain too much cytoplasm" },
      { id: "C", text: "They possess many nuclei" },
      { id: "D", text: "They are always multicellular" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Viruses depend on host cells because they lack complete cellular machinery.",
      steps: [
        "Viruses are acellular.",
        "They lack the full metabolic and protein-synthesis machinery of cells.",
        "They therefore use host-cell machinery to replicate.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-104",
    question:
      "A virus can multiply only when it is:",
    options: [
      { id: "A", text: "Inside a suitable living host cell" },
      { id: "B", text: "In distilled water" },
      { id: "C", text: "On a dry surface" },
      { id: "D", text: "Inside a mineral crystal" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Viruses require living host cells for replication.",
      steps: [
        "Viruses lack complete cellular machinery.",
        "They enter susceptible host cells.",
        "They use host resources to produce viral components.",
        "Therefore, multiplication occurs inside suitable living host cells.",
      ],
    },
  },

  {
    id: "biology-variety-105",
    question:
      "Which disease is caused by a virus?",
    options: [
      { id: "A", text: "Measles" },
      { id: "B", text: "Malaria" },
      { id: "C", text: "Ringworm" },
      { id: "D", text: "Cholera" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Measles is caused by the measles virus.",
      steps: [
        "Measles is a viral infectious disease.",
        "Malaria is caused by Plasmodium.",
        "Ringworm is caused by fungi.",
        "Cholera is caused by the bacterium Vibrio cholerae.",
        "Therefore, measles is correct.",
      ],
    },
  },

  {
    id: "biology-variety-106",
    question:
      "Which of the following is an example of a viral disease?",
    options: [
      { id: "A", text: "Influenza" },
      { id: "B", text: "Tuberculosis" },
      { id: "C", text: "Typhoid" },
      { id: "D", text: "Cholera" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Influenza is caused by influenza viruses.",
      steps: [
        "Influenza is a viral infection.",
        "Tuberculosis is bacterial.",
        "Typhoid is bacterial.",
        "Cholera is bacterial.",
        "Therefore, influenza is correct.",
      ],
    },
  },

  {
    id: "biology-variety-107",
    question:
      "Which structure is NOT found in a typical virus?",
    options: [
      { id: "A", text: "Genetic material" },
      { id: "B", text: "Capsid" },
      { id: "C", text: "Cytoplasm" },
      { id: "D", text: "Protein" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Viruses do not have cytoplasm because they are acellular.",
      steps: [
        "Viruses contain genetic material.",
        "They possess a protein capsid.",
        "Some also possess an envelope.",
        "They do not contain cytoplasm like cellular organisms.",
        "Therefore, cytoplasm is correct.",
      ],
    },
  },

  {
    id: "biology-variety-108",
    question:
      "Which of the following is a characteristic of viruses?",
    options: [
      { id: "A", text: "They possess ribosomes" },
      { id: "B", text: "They possess a complete cell membrane and cytoplasm" },
      { id: "C", text: "They depend on host cells for replication" },
      { id: "D", text: "They carry out independent cellular respiration" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Viruses depend on host cells for replication.",
      steps: [
        "Viruses lack the complete machinery required for independent replication.",
        "They enter host cells and use host resources.",
        "They do not possess their own ribosomes or complete cellular metabolism.",
        "Therefore, host dependence is correct.",
      ],
    },
  },

  {
    id: "biology-variety-109",
    question:
      "Which of the following is an acellular infectious agent?",
    options: [
      { id: "A", text: "Virus" },
      { id: "B", text: "Amoeba" },
      { id: "C", text: "Bacterium" },
      { id: "D", text: "Yeast" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Viruses are acellular infectious agents.",
      steps: [
        "Amoeba, bacteria and yeast are cellular organisms.",
        "Viruses lack complete cellular organization.",
        "Therefore, virus is correct.",
      ],
    },
  },

  {
    id: "biology-variety-110",
    question:
      "Which component of a virus carries hereditary information?",
    options: [
      { id: "A", text: "Capsid" },
      { id: "B", text: "Genetic material" },
      { id: "C", text: "Envelope only" },
      { id: "D", text: "Protein coat only" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Viral DNA or RNA contains hereditary information.",
      steps: [
        "Genetic information determines viral characteristics.",
        "In viruses, this information is carried by DNA or RNA.",
        "The capsid mainly protects the genetic material.",
        "Therefore, genetic material is correct.",
      ],
    },
  },

  {
    id: "biology-variety-111",
    question:
      "Which of the following is NOT a cellular organism?",
    options: [
      { id: "A", text: "Bacterium" },
      { id: "B", text: "Amoeba" },
      { id: "C", text: "Virus" },
      { id: "D", text: "Yeast" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Viruses are acellular.",
      steps: [
        "Bacteria are cellular prokaryotes.",
        "Amoeba and yeast are cellular eukaryotes.",
        "Viruses lack complete cellular organization.",
        "Therefore, virus is correct.",
      ],
    },
  },

  {
    id: "biology-variety-112",
    question:
      "Which of the following best explains why viruses are described as obligate intracellular parasites?",
    options: [
      { id: "A", text: "They can reproduce only inside suitable host cells" },
      { id: "B", text: "They are always larger than bacteria" },
      { id: "C", text: "They possess many cells" },
      { id: "D", text: "They manufacture food by photosynthesis" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Viruses require host cells for replication.",
      steps: [
        "Viruses lack complete replication machinery.",
        "They enter living host cells.",
        "They use host-cell machinery to produce new viral particles.",
        "Therefore, they are obligate intracellular parasites.",
      ],
    },
  },

  {
    id: "biology-variety-113",
    question:
      "Which of the following may be found as an outer covering in some viruses?",
    options: [
      { id: "A", text: "Lipid envelope" },
      { id: "B", text: "Cellulose wall" },
      { id: "C", text: "Chitin wall" },
      { id: "D", text: "Nuclear envelope" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Some viruses possess a lipid envelope surrounding the capsid.",
      steps: [
        "Some viruses acquire an envelope from the host cell membrane.",
        "The envelope contains lipids and viral proteins.",
        "Not all viruses have envelopes.",
        "Therefore, lipid envelope is correct.",
      ],
    },
  },

  {
    id: "biology-variety-114",
    question:
      "Which of the following is a characteristic of viruses rather than bacteria?",
    options: [
      { id: "A", text: "They lack cellular organization" },
      { id: "B", text: "They contain genetic material" },
      { id: "C", text: "They may infect living organisms" },
      { id: "D", text: "They can undergo genetic variation" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Viruses are acellular whereas bacteria are cellular organisms.",
      steps: [
        "Both viruses and bacteria contain genetic material.",
        "Both can infect organisms.",
        "Both can undergo genetic variation.",
        "However, viruses lack complete cellular organization.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-115",
    question:
      "Which of the following is a viral genetic material?",
    options: [
      { id: "A", text: "RNA" },
      { id: "B", text: "Cellulose" },
      { id: "C", text: "Chitin" },
      { id: "D", text: "Starch" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "RNA can serve as the genetic material of viruses.",
      steps: [
        "Some viruses contain RNA genomes.",
        "Other viruses contain DNA genomes.",
        "Cellulose, chitin and starch are not viral genetic materials.",
        "Therefore, RNA is correct.",
      ],
    },
  },

  {
    id: "biology-variety-116",
    question:
      "Which statement about viruses is correct?",
    options: [
      { id: "A", text: "All viruses contain both DNA and RNA" },
      { id: "B", text: "Viruses can replicate independently in non-living environments" },
      { id: "C", text: "Viruses contain genetic material enclosed by protein" },
      { id: "D", text: "Viruses possess mitochondria" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "A virus contains genetic material associated with a protein capsid.",
      steps: [
        "A virus contains either DNA or RNA as its genome.",
        "The genome is protected by a protein capsid.",
        "Viruses lack mitochondria and other cellular organelles.",
        "They require host cells for replication.",
        "Therefore, option C is correct.",
      ],
    },
  },

  {
    id: "biology-variety-117",
    question:
      "Which of the following is a disease caused by a virus?",
    options: [
      { id: "A", text: "HIV/AIDS" },
      { id: "B", text: "Tuberculosis" },
      { id: "C", text: "Cholera" },
      { id: "D", text: "Athlete's foot" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "HIV/AIDS is caused by the human immunodeficiency virus.",
      steps: [
        "HIV is a virus.",
        "It attacks cells involved in the immune system.",
        "Tuberculosis and cholera are bacterial diseases.",
        "Athlete's foot is caused by fungi.",
        "Therefore, HIV/AIDS is correct.",
      ],
    },
  },

  {
    id: "biology-variety-118",
    question:
      "Which statement best describes the relationship between viruses and living cells?",
    options: [
      { id: "A", text: "Viruses use host-cell machinery to reproduce" },
      { id: "B", text: "Viruses contain complete independent cells" },
      { id: "C", text: "Viruses manufacture all their own proteins" },
      { id: "D", text: "Viruses possess their own mitochondria" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Viruses rely on host cells for the machinery needed to reproduce.",
      steps: [
        "Viruses lack complete cellular machinery.",
        "They enter host cells.",
        "They redirect host resources toward producing viral components.",
        "Therefore, they use host-cell machinery.",
      ],
    },
  },

  {
    id: "biology-variety-119",
    question:
      "Which of the following is absent from viruses but present in cellular organisms?",
    options: [
      { id: "A", text: "Genetic material" },
      { id: "B", text: "Protein" },
      { id: "C", text: "Complete cellular organization" },
      { id: "D", text: "Ability to cause disease" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Viruses are not composed of complete cells.",
      steps: [
        "Viruses contain genetic material.",
        "They contain proteins such as capsid proteins.",
        "They can cause disease.",
        "However, they lack complete cellular organization.",
        "Therefore, option C is correct.",
      ],
    },
  },

  // ============================================================
  // A01.11 UNICELLULAR AND MULTICELLULAR ORGANIZATION — 25
  // ============================================================

  {
    id: "biology-variety-120",
    question:
      "An organism consisting of only one cell is described as:",
    options: [
      { id: "A", text: "Multicellular" },
      { id: "B", text: "Unicellular" },
      { id: "C", text: "Acellular" },
      { id: "D", text: "Colonial only" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Unicellular organisms consist of a single cell.",
      steps: [
        "The prefix uni- means one.",
        "A unicellular organism therefore consists of one cell.",
        "That single cell carries out the organism's life processes.",
        "Therefore, unicellular is correct.",
      ],
    },
  },

  {
    id: "biology-variety-121",
    question:
      "Which of the following is a unicellular organism?",
    options: [
      { id: "A", text: "Amoeba" },
      { id: "B", text: "Human" },
      { id: "C", text: "Mango tree" },
      { id: "D", text: "Earthworm" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Amoeba is a unicellular organism.",
      steps: [
        "Amoeba consists of one cell.",
        "The single cell performs nutrition, respiration, excretion and reproduction.",
        "Humans, mango trees and earthworms are multicellular.",
        "Therefore, Amoeba is correct.",
      ],
    },
  },

  {
    id: "biology-variety-122",
    question:
      "Which of the following is a multicellular organism?",
    options: [
      { id: "A", text: "Amoeba" },
      { id: "B", text: "Paramecium" },
      { id: "C", text: "Human" },
      { id: "D", text: "Bacterium" },
    ],
    correctAnswer: "C",
    explanation: {
      intro:
        "Humans are composed of many specialized cells.",
      steps: [
        "Humans contain trillions of cells.",
        "These cells become specialized for different functions.",
        "Amoeba, Paramecium and bacteria are unicellular.",
        "Therefore, human is correct.",
      ],
    },
  },

  {
    id: "biology-variety-123",
    question:
      "In a multicellular organism, cells may become specialized to perform different:",
    options: [
      { id: "A", text: "Functions" },
      { id: "B", text: "Species names" },
      { id: "C", text: "Kingdoms" },
      { id: "D", text: "Genus names" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Cell specialization allows different cells to perform particular functions.",
      steps: [
        "Multicellular organisms contain many cells.",
        "Cells can become specialized in structure and function.",
        "For example, nerve cells transmit impulses while muscle cells contract.",
        "Therefore, cells perform different functions.",
      ],
    },
  },

  {
    id: "biology-variety-124",
    question:
      "Which level of organization consists of a group of similar cells performing a common function?",
    options: [
      { id: "A", text: "Tissue" },
      { id: "B", text: "Organism" },
      { id: "C", text: "Organ system" },
      { id: "D", text: "Population" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "A tissue is a group of similar specialized cells performing a common function.",
      steps: [
        "Cells are the basic units of life.",
        "Similar cells may work together as tissues.",
        "Different tissues can form organs.",
        "Therefore, tissue is correct.",
      ],
    },
  },

  {
    id: "biology-variety-125",
    question:
      "A group of different tissues working together forms a:",
    options: [
      { id: "A", text: "Cell" },
      { id: "B", text: "Organ" },
      { id: "C", text: "Population" },
      { id: "D", text: "Species" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "An organ consists of different tissues working together.",
      steps: [
        "Different tissues have different roles.",
        "They can combine to form organs.",
        "For example, the heart contains several tissue types.",
        "Therefore, organ is correct.",
      ],
    },
  },

  {
    id: "biology-variety-126",
    question:
      "Several organs working together to perform related functions form an:",
    options: [
      { id: "A", text: "Organ system" },
      { id: "B", text: "Individual cell" },
      { id: "C", text: "Tissue" },
      { id: "D", text: "Organelle" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "An organ system consists of organs working together.",
      steps: [
        "Organs perform specialized functions.",
        "Several organs may coordinate to perform a major body function.",
        "Such a group is called an organ system.",
        "Therefore, organ system is correct.",
      ],
    },
  },

  {
    id: "biology-variety-127",
    question:
      "Which organism can perform all its life processes within a single cell?",
    options: [
      { id: "A", text: "Amoeba" },
      { id: "B", text: "Human" },
      { id: "C", text: "Goat" },
      { id: "D", text: "Mango tree" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Amoeba is unicellular and its single cell performs all necessary life processes.",
      steps: [
        "Amoeba consists of one cell.",
        "That cell carries out feeding, respiration and excretion.",
        "It also responds to stimuli and reproduces.",
        "Therefore, Amoeba is correct.",
      ],
    },
  },

  {
    id: "biology-variety-128",
    question:
      "Which of the following is an advantage of multicellularity?",
    options: [
      { id: "A", text: "Cell specialization" },
      { id: "B", text: "No need for energy" },
      { id: "C", text: "Absence of reproduction" },
      { id: "D", text: "No communication between cells" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Multicellular organisms can develop specialized cells and tissues.",
      steps: [
        "Multicellularity allows cells to specialize.",
        "Different cells can perform different functions efficiently.",
        "This creates division of labour.",
        "Therefore, cell specialization is an advantage.",
      ],
    },
  },

  {
    id: "biology-variety-129",
    question:
      "Which of the following is an example of a unicellular fungus?",
    options: [
      { id: "A", text: "Yeast" },
      { id: "B", text: "Mushroom" },
      { id: "C", text: "Fern" },
      { id: "D", text: "Moss" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Yeast is a unicellular fungus.",
      steps: [
        "Yeast normally exists as single cells.",
        "It is eukaryotic and belongs to Fungi.",
        "Mushrooms and the other listed organisms are multicellular.",
        "Therefore, yeast is correct.",
      ],
    },
  },

  {
    id: "biology-variety-130",
    question:
      "Which of the following is an example of a unicellular prokaryote?",
    options: [
      { id: "A", text: "Bacterium" },
      { id: "B", text: "Amoeba" },
      { id: "C", text: "Yeast" },
      { id: "D", text: "Paramecium" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Bacteria are unicellular prokaryotic organisms.",
      steps: [
        "A bacterial organism usually consists of one cell.",
        "That cell lacks a membrane-bound nucleus.",
        "Amoeba, yeast and Paramecium are unicellular eukaryotes.",
        "Therefore, bacterium is correct.",
      ],
    },
  },

  {
    id: "biology-variety-131",
    question:
      "Which process allows a multicellular organism to increase the number of its cells?",
    options: [
      { id: "A", text: "Cell division" },
      { id: "B", text: "Diffusion only" },
      { id: "C", text: "Osmosis only" },
      { id: "D", text: "Respiration only" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Cell division increases cell number during growth and development.",
      steps: [
        "Multicellular organisms begin from a single cell after fertilization in sexual reproduction.",
        "Repeated cell division increases the number of cells.",
        "Cells can then differentiate into specialized types.",
        "Therefore, cell division is correct.",
      ],
    },
  },

  {
    id: "biology-variety-132",
    question:
      "What is meant by cell differentiation?",
    options: [
      { id: "A", text: "Development of cells with specialized structures and functions" },
      { id: "B", text: "Destruction of all cells" },
      { id: "C", text: "Conversion of cells into viruses" },
      { id: "D", text: "Loss of all genetic material" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Cell differentiation produces specialized cell types.",
      steps: [
        "Cells in multicellular organisms may develop different structures.",
        "These structural differences enable different functions.",
        "This process is called differentiation.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-133",
    question:
      "Which of the following is an example of cell specialization in animals?",
    options: [
      { id: "A", text: "Red blood cells specialized for oxygen transport" },
      { id: "B", text: "All cells performing exactly the same function" },
      { id: "C", text: "Viruses producing tissues" },
      { id: "D", text: "Cells losing all functions" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Red blood cells have specialized structures for transporting oxygen.",
      steps: [
        "Mature red blood cells contain haemoglobin.",
        "Their shape and structure support oxygen transport.",
        "This is an example of cellular specialization.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-134",
    question:
      "Which of the following is an example of cell specialization in plants?",
    options: [
      { id: "A", text: "Root hair cell specialized for absorption" },
      { id: "B", text: "All cells having identical functions" },
      { id: "C", text: "Virus becoming a tissue" },
      { id: "D", text: "A cell without any function" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Root hair cells are specialized for efficient absorption of water and mineral ions.",
      steps: [
        "Root hair cells have long projections.",
        "The projections increase surface area for absorption.",
        "This is an example of cell specialization.",
        "Therefore, root hair cell is correct.",
      ],
    },
  },

  {
    id: "biology-variety-135",
    question:
      "Which statement about unicellular organisms is correct?",
    options: [
      { id: "A", text: "Their single cell carries out all essential life processes" },
      { id: "B", text: "They always have tissues" },
      { id: "C", text: "They always possess organs" },
      { id: "D", text: "They are always eukaryotic" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "A unicellular organism depends on its single cell for all life processes.",
      steps: [
        "A unicellular organism consists of one cell.",
        "It therefore cannot have tissues or organs in the multicellular sense.",
        "The cell performs nutrition, respiration, excretion and reproduction.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-136",
    question:
      "Which statement about multicellular organisms is correct?",
    options: [
      { id: "A", text: "They may have specialized cells" },
      { id: "B", text: "They consist of only one cell" },
      { id: "C", text: "They cannot reproduce" },
      { id: "D", text: "They lack organization" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Multicellular organisms can have specialized cells performing different functions.",
      steps: [
        "Multicellular organisms contain many cells.",
        "Cells may differentiate into specialized types.",
        "Specialized cells form tissues and organs.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-137",
    question:
      "Which level of organization comes immediately after tissue?",
    options: [
      { id: "A", text: "Cell" },
      { id: "B", text: "Organ" },
      { id: "C", text: "Organelle" },
      { id: "D", text: "Molecule" },
    ],
    correctAnswer: "B",
    explanation: {
      intro:
        "Tissues combine to form organs.",
      steps: [
        "Similar cells form tissues.",
        "Different tissues can combine to form organs.",
        "Therefore, organ comes immediately after tissue in this sequence.",
      ],
    },
  },

  {
    id: "biology-variety-138",
    question:
      "Which sequence represents increasing levels of organization in a multicellular organism?",
    options: [
      { id: "A", text: "Cell → Tissue → Organ → Organ system" },
      { id: "B", text: "Organ → Cell → Tissue → Organ system" },
      { id: "C", text: "Tissue → Cell → Organ system → Organ" },
      { id: "D", text: "Organ system → Organ → Tissue → Cell" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Cells form tissues, tissues form organs, and organs form organ systems.",
      steps: [
        "Cells are basic living units.",
        "Groups of similar cells form tissues.",
        "Different tissues form organs.",
        "Organs work together as organ systems.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-139",
    question:
      "Which of the following best explains division of labour in multicellular organisms?",
    options: [
      { id: "A", text: "Different cells specialize in different functions" },
      { id: "B", text: "Every cell performs every function equally" },
      { id: "C", text: "Only one cell performs all functions" },
      { id: "D", text: "Cells do not communicate" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Division of labour occurs when specialized cells perform particular functions.",
      steps: [
        "Multicellular organisms contain many cells.",
        "Cells can specialize for particular tasks.",
        "This allows different functions to be performed efficiently.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-140",
    question:
      "Which organism is most likely to depend on diffusion because it has a simple unicellular body?",
    options: [
      { id: "A", text: "Amoeba" },
      { id: "B", text: "Elephant" },
      { id: "C", text: "Mango tree" },
      { id: "D", text: "Human" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Amoeba is a unicellular organism whose small size allows substances to move across its cell membrane by diffusion.",
      steps: [
        "Amoeba consists of one cell.",
        "Its small size gives it a relatively large surface area compared with volume.",
        "Many substances can move directly across its cell membrane.",
        "Large multicellular organisms require specialized transport systems.",
        "Therefore, Amoeba is correct.",
      ],
    },
  },

  {
    id: "biology-variety-141",
    question:
      "Which of the following is a limitation of being unicellular?",
    options: [
      { id: "A", text: "Limited size and functional specialization" },
      { id: "B", text: "Ability to perform life processes" },
      { id: "C", text: "Ability to reproduce" },
      { id: "D", text: "Ability to respond to stimuli" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Unicellular organisms have limitations because one cell must perform all life functions.",
      steps: [
        "The organism consists of only one cell.",
        "That cell must perform all essential functions.",
        "It cannot develop the extensive division of labour found in complex multicellular organisms.",
        "Therefore, limited size and functional specialization is a limitation.",
      ],
    },
  },

  {
    id: "biology-variety-142",
    question:
      "Which of the following is a benefit of specialization in multicellular organisms?",
    options: [
      { id: "A", text: "Greater efficiency in performing specific functions" },
      { id: "B", text: "Elimination of all cells" },
      { id: "C", text: "Loss of organization" },
      { id: "D", text: "Inability to reproduce" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Specialization allows cells to become highly efficient at particular tasks.",
      steps: [
        "Different cells develop different structures.",
        "These structures suit their particular functions.",
        "Division of labour improves efficiency.",
        "Therefore, greater efficiency is correct.",
      ],
    },
  },

  {
    id: "biology-variety-143",
    question:
      "Which of the following organisms is multicellular and eukaryotic?",
    options: [
      { id: "A", text: "Human" },
      { id: "B", text: "Bacterium" },
      { id: "C", text: "Amoeba" },
      { id: "D", text: "Paramecium" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Humans are multicellular eukaryotic organisms.",
      steps: [
        "Humans contain many cells.",
        "Their cells possess membrane-bound nuclei.",
        "A bacterium is unicellular and prokaryotic.",
        "Amoeba and Paramecium are unicellular eukaryotes.",
        "Therefore, human is correct.",
      ],
    },
  },

  {
    id: "biology-variety-144",
    question:
      "Which of the following organisms is unicellular and eukaryotic?",
    options: [
      { id: "A", text: "Amoeba" },
      { id: "B", text: "Bacterium" },
      { id: "C", text: "Human" },
      { id: "D", text: "Mango tree" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Amoeba is a unicellular organism with a membrane-bound nucleus.",
      steps: [
        "Amoeba consists of a single cell.",
        "Its nucleus is enclosed by a nuclear membrane.",
        "Therefore, it is both unicellular and eukaryotic.",
      ],
    },
  },

  // ============================================================
  // INTEGRATED A01.3–A01.11 QUESTIONS
  // 145–150
  // ============================================================

  {
    id: "biology-variety-145",
    question:
      "Which of the following correctly compares a bacterium, Amoeba and a virus?",
    options: [
      { id: "A", text: "Bacterium is prokaryotic, Amoeba is eukaryotic, and virus is acellular" },
      { id: "B", text: "All three are multicellular" },
      { id: "C", text: "Bacterium and virus are eukaryotic" },
      { id: "D", text: "Amoeba and virus are prokaryotic" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "These three biological forms represent three different levels of organization.",
      steps: [
        "Bacteria are cellular prokaryotes.",
        "Amoeba is a unicellular eukaryote.",
        "Viruses are acellular infectious particles.",
        "Therefore, option A correctly compares them.",
      ],
    },
  },

  {
    id: "biology-variety-146",
    question:
      "Which combination correctly matches the organism with its cellular organization?",
    options: [
      { id: "A", text: "Bacterium — prokaryotic" },
      { id: "B", text: "Amoeba — prokaryotic" },
      { id: "C", text: "Virus — eukaryotic" },
      { id: "D", text: "Yeast — prokaryotic" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Bacteria are prokaryotic organisms.",
      steps: [
        "Bacteria lack membrane-bound nuclei.",
        "Amoeba is eukaryotic.",
        "Viruses are acellular rather than eukaryotic.",
        "Yeast is eukaryotic.",
        "Therefore, bacterium — prokaryotic is correct.",
      ],
    },
  },

  {
    id: "biology-variety-147",
    question:
      "Which sequence correctly represents increasing biological organization?",
    options: [
      { id: "A", text: "Cell → Tissue → Organ → Organ system" },
      { id: "B", text: "Organ system → Tissue → Cell → Organ" },
      { id: "C", text: "Tissue → Cell → Organ → Organ system" },
      { id: "D", text: "Organ → Cell → Tissue → Organ system" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Multicellular organization proceeds from cells to tissues, organs and organ systems.",
      steps: [
        "Cells are the basic units of multicellular organisms.",
        "Similar cells form tissues.",
        "Different tissues combine to form organs.",
        "Organs work together in organ systems.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-148",
    question:
      "An organism has a cell wall, chloroplasts and a large central vacuole. Which group does it most likely belong to?",
    options: [
      { id: "A", text: "Plantae" },
      { id: "B", text: "Animalia" },
      { id: "C", text: "Viruses" },
      { id: "D", text: "Bacteria" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "The combination of a cellulose cell wall, chloroplasts and a large central vacuole is characteristic of plant cells.",
      steps: [
        "Plant cells possess cellulose cell walls.",
        "Photosynthetic plant cells contain chloroplasts.",
        "Many plant cells have a large central vacuole.",
        "Animal cells do not possess this combination.",
        "Therefore, Plantae is correct.",
      ],
    },
  },

  {
    id: "biology-variety-149",
    question:
      "Which of the following combinations is correctly matched?",
    options: [
      { id: "A", text: "Fungi — chitinous cell wall and absorptive nutrition" },
      { id: "B", text: "Animalia — cellulose cell wall and photosynthesis" },
      { id: "C", text: "Virus — cellular respiration and mitochondria" },
      { id: "D", text: "Bacteria — membrane-bound nucleus and chloroplasts" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Fungi possess chitinous cell walls and obtain nutrients mainly by absorption.",
      steps: [
        "Fungi are eukaryotic organisms.",
        "Their cell walls contain chitin.",
        "They digest food externally and absorb soluble nutrients.",
        "Animals do not have cellulose cell walls or chloroplasts.",
        "Viruses lack mitochondria and complete cellular organization.",
        "Bacteria lack membrane-bound nuclei and chloroplasts.",
        "Therefore, option A is correct.",
      ],
    },
  },

  {
    id: "biology-variety-150",
    question:
      "Which statement best summarizes the importance of classifying organisms?",
    options: [
      { id: "A", text: "It organizes biodiversity and helps identify relationships among organisms" },
      { id: "B", text: "It makes all organisms genetically identical" },
      { id: "C", text: "It removes differences between species" },
      { id: "D", text: "It classifies organisms according to their market value" },
    ],
    correctAnswer: "A",
    explanation: {
      intro:
        "Biological classification provides an organized system for studying the enormous diversity of life.",
      steps: [
        "Earth contains a very large variety of organisms.",
        "Classification groups organisms according to shared characteristics.",
        "Scientific naming provides standardized identification.",
        "Modern classification also helps reveal evolutionary relationships.",
        "Therefore, organizing biodiversity and identifying relationships is the best answer.",
      ],
    },
  },
];








export default varietyOfOrganismsQuestions;
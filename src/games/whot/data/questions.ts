




import type { WhotQuestion } from "../types/whot";

/**
 * LEARNYFI WHOT — LOCAL QUESTION BANK
 *
 * Frontend-only educational card game.
 *
 * Subjects:
 * Mathematics, English, Biology, Chemistry,
 * Physics, History, General Knowledge.
 *
 * correctAnswerIndex is zero-based:
 * 0 = first option
 * 1 = second option
 * 2 = third option
 * 3 = fourth option
 */

export const WHOT_QUESTIONS: WhotQuestion[] = [
  // ==========================================================
  // MATHEMATICS
  // ==========================================================

  {
    id: "math-001",
    subject: "MATHS",
    question: "What is 12 × 8?",
    options: ["96", "86", "106", "108"],
    correctAnswerIndex: 0,
    difficulty: "EASY",
    explanation: "12 multiplied by 8 equals 96.",
  },
  {
    id: "math-002",
    subject: "MATHS",
    question: "What is the square root of 81?",
    options: ["7", "8", "9", "10"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "9 × 9 equals 81.",
  },
  {
    id: "math-003",
    subject: "MATHS",
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "15% of 200 is 0.15 × 200 = 30.",
  },
  {
    id: "math-004",
    subject: "MATHS",
    question: "Solve: 3x + 5 = 20.",
    options: ["3", "5", "7", "15"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "Subtract 5 from both sides, then divide 15 by 3. Therefore, x = 5.",
  },
  {
    id: "math-005",
    subject: "MATHS",
    question: "What is the area of a rectangle 8 cm long and 5 cm wide?",
    options: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "Area = length × width = 8 × 5 = 40 cm².",
  },
  {
    id: "math-006",
    subject: "MATHS",
    question: "Express 0.75 as a fraction in its simplest form.",
    options: ["1/2", "2/3", "3/4", "4/5"],
    correctAnswerIndex: 2,
    difficulty: "MEDIUM",
    explanation: "0.75 = 75/100 = 3/4.",
  },
  {
    id: "math-007",
    subject: "MATHS",
    question: "What is the value of 2⁵?",
    options: ["10", "16", "25", "32"],
    correctAnswerIndex: 3,
    difficulty: "EASY",
    explanation: "2⁵ = 2 × 2 × 2 × 2 × 2 = 32.",
  },
  {
    id: "math-008",
    subject: "MATHS",
    question: "What is the gradient of the line y = 4x + 3?",
    options: ["3", "4", "7", "-4"],
    correctAnswerIndex: 1,
    difficulty: "HARD",
    explanation: "In y = mx + c, the gradient is the coefficient of x, which is 4.",
  },

  // ==========================================================
  // ENGLISH
  // ==========================================================

  {
    id: "eng-001",
    subject: "ENGLISH",
    question: "Which word is a synonym for happy?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "Joyful means feeling or expressing happiness.",
  },
  {
    id: "eng-002",
    subject: "ENGLISH",
    question: "What is the past tense of go?",
    options: ["Goed", "Going", "Went", "Goes"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "Went is the simple past tense of go.",
  },
  {
    id: "eng-003",
    subject: "ENGLISH",
    question: "Choose the correctly spelt word.",
    options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "Accommodation is spelt with double c and double m.",
  },
  {
    id: "eng-004",
    subject: "ENGLISH",
    question: "Identify the adjective in: 'The clever student answered.'",
    options: ["The", "Clever", "Student", "Answered"],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "Clever describes the noun student.",
  },
  {
    id: "eng-005",
    subject: "ENGLISH",
    question: "Which sentence is grammatically correct?",
    options: [
      "She have a book.",
      "She has a book.",
      "She having a book.",
      "She are having a book.",
    ],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "The singular subject 'she' takes the verb 'has' in this sentence.",
  },
  {
    id: "eng-006",
    subject: "ENGLISH",
    question: "What is the opposite of scarce?",
    options: ["Rare", "Limited", "Abundant", "Insufficient"],
    correctAnswerIndex: 2,
    difficulty: "MEDIUM",
    explanation: "Abundant means available in large quantities.",
  },
  {
    id: "eng-007",
    subject: "ENGLISH",
    question: "A person who writes plays is called a ____.",
    options: ["Novelist", "Playwright", "Journalist", "Biographer"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "A playwright writes plays for performance.",
  },
  {
    id: "eng-008",
    subject: "ENGLISH",
    question: "Which figure of speech compares two things using 'like' or 'as'?",
    options: ["Metaphor", "Irony", "Simile", "Hyperbole"],
    correctAnswerIndex: 2,
    difficulty: "HARD",
    explanation: "A simile makes an explicit comparison using words such as 'like' or 'as'.",
  },

  // ==========================================================
  // BIOLOGY
  // ==========================================================

  {
    id: "bio-001",
    subject: "BIOLOGY",
    question: "Which organelle is primarily responsible for photosynthesis?",
    options: ["Mitochondrion", "Chloroplast", "Ribosome", "Nucleus"],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "Chloroplasts contain chlorophyll and are the main sites of photosynthesis in plant cells.",
  },
  {
    id: "bio-002",
    subject: "BIOLOGY",
    question: "What is the basic structural and functional unit of life?",
    options: ["Tissue", "Organ", "Cell", "System"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "The cell is the basic structural and functional unit of living organisms.",
  },
  {
    id: "bio-003",
    subject: "BIOLOGY",
    question: "Which molecule carries hereditary information in most living organisms?",
    options: ["Glucose", "DNA", "Starch", "Glycerol"],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "DNA stores genetic information in most organisms.",
  },
  {
    id: "bio-004",
    subject: "BIOLOGY",
    question: "Which blood cells transport oxygen using haemoglobin?",
    options: ["Platelets", "White blood cells", "Red blood cells", "Lymphocytes"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "Red blood cells contain haemoglobin, which binds and transports oxygen.",
  },
  {
    id: "bio-005",
    subject: "BIOLOGY",
    question: "What is the main function of decomposers in an ecosystem?",
    options: [
      "Produce sunlight",
      "Recycle nutrients from dead organisms",
      "Stop photosynthesis",
      "Consume only living plants",
    ],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "Decomposers break down organic matter and return nutrients to the environment.",
  },
  {
    id: "bio-006",
    subject: "BIOLOGY",
    question: "Which process produces two genetically similar daughter cells?",
    options: ["Meiosis", "Mitosis", "Fertilisation", "Pollination"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "Mitosis generally produces two genetically similar daughter cells.",
  },
  {
    id: "bio-007",
    subject: "BIOLOGY",
    question: "Which plant tissue transports water and mineral salts from the roots?",
    options: ["Phloem", "Epidermis", "Xylem", "Cortex"],
    correctAnswerIndex: 2,
    difficulty: "MEDIUM",
    explanation: "Xylem transports water and dissolved mineral salts through the plant.",
  },
  {
    id: "bio-008",
    subject: "BIOLOGY",
    question: "In a monohybrid cross Aa × Aa, what is the expected genotype ratio?",
    options: ["3:1", "1:1", "1:2:1", "9:3:3:1"],
    correctAnswerIndex: 2,
    difficulty: "HARD",
    explanation: "The expected genotypes are AA, Aa, Aa and aa, giving a 1:2:1 ratio.",
  },

  // ==========================================================
  // CHEMISTRY
  // ==========================================================

  {
    id: "chem-001",
    subject: "CHEMISTRY",
    question: "What is the chemical formula for water?",
    options: ["CO₂", "NaCl", "H₂O", "O₂"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "A water molecule contains two hydrogen atoms and one oxygen atom.",
  },
  {
    id: "chem-002",
    subject: "CHEMISTRY",
    question: "What is the atomic number of carbon?",
    options: ["4", "6", "8", "12"],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "Carbon has six protons, so its atomic number is 6.",
  },
  {
    id: "chem-003",
    subject: "CHEMISTRY",
    question: "A solution with a pH of 2 is generally classified as ____.",
    options: ["Strongly acidic", "Neutral", "Weakly alkaline", "Strongly alkaline"],
    correctAnswerIndex: 0,
    difficulty: "EASY",
    explanation: "A pH well below 7 indicates an acidic solution.",
  },
  {
    id: "chem-004",
    subject: "CHEMISTRY",
    question: "Which gas is released when dilute hydrochloric acid reacts with zinc?",
    options: ["Oxygen", "Chlorine", "Hydrogen", "Carbon dioxide"],
    correctAnswerIndex: 2,
    difficulty: "MEDIUM",
    explanation: "Zinc reacts with dilute hydrochloric acid to form zinc chloride and hydrogen gas.",
  },
  {
    id: "chem-005",
    subject: "CHEMISTRY",
    question: "What type of bond forms when atoms share electron pairs?",
    options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "Covalent bonds involve shared pairs of electrons.",
  },
  {
    id: "chem-006",
    subject: "CHEMISTRY",
    question: "What is the relative molecular mass of CO₂? (C = 12, O = 16)",
    options: ["28", "32", "40", "44"],
    correctAnswerIndex: 3,
    difficulty: "MEDIUM",
    explanation: "Mr(CO₂) = 12 + (2 × 16) = 44.",
  },
  {
    id: "chem-007",
    subject: "CHEMISTRY",
    question: "Oxidation is commonly defined in terms of electrons as ____.",
    options: [
      "Gain of electrons",
      "Loss of electrons",
      "Sharing of protons",
      "Gain of neutrons",
    ],
    correctAnswerIndex: 1,
    difficulty: "HARD",
    explanation: "Oxidation involves loss of electrons; reduction involves gain of electrons.",
  },
  {
    id: "chem-008",
    subject: "CHEMISTRY",
    question: "How many moles are present in 18 g of water? (Mr = 18)",
    options: ["0.5 mol", "1 mol", "2 mol", "18 mol"],
    correctAnswerIndex: 1,
    difficulty: "HARD",
    explanation: "Number of moles = mass ÷ molar mass = 18 ÷ 18 = 1 mol.",
  },

  // ==========================================================
  // PHYSICS
  // ==========================================================

  {
    id: "phy-001",
    subject: "PHYSICS",
    question: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "Force is measured in newtons (N).",
  },
  {
    id: "phy-002",
    subject: "PHYSICS",
    question: "What is the approximate speed of light in a vacuum?",
    options: [
      "150,000 km/s",
      "300,000 km/s",
      "450,000 km/s",
      "600,000 km/s",
    ],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "Light travels at approximately 3 × 10⁸ m/s in a vacuum.",
  },
  {
    id: "phy-003",
    subject: "PHYSICS",
    question: "A car travels 100 metres in 5 seconds. What is its average speed?",
    options: ["10 m/s", "20 m/s", "25 m/s", "50 m/s"],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "Average speed = distance ÷ time = 100 ÷ 5 = 20 m/s.",
  },
  {
    id: "phy-004",
    subject: "PHYSICS",
    question: "Which instrument measures electric current?",
    options: ["Voltmeter", "Barometer", "Ammeter", "Thermometer"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "An ammeter measures electric current.",
  },
  {
    id: "phy-005",
    subject: "PHYSICS",
    question: "What is the SI unit of electrical resistance?",
    options: ["Ampere", "Volt", "Ohm", "Coulomb"],
    correctAnswerIndex: 2,
    difficulty: "MEDIUM",
    explanation: "Electrical resistance is measured in ohms (Ω).",
  },
  {
    id: "phy-006",
    subject: "PHYSICS",
    question: "A force of 20 N acts on a mass of 4 kg. What is the acceleration?",
    options: ["4 m/s²", "5 m/s²", "16 m/s²", "80 m/s²"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "Using F = ma, acceleration = 20 ÷ 4 = 5 m/s².",
  },
  {
    id: "phy-007",
    subject: "PHYSICS",
    question: "Which type of lens converges parallel rays of light?",
    options: ["Concave lens", "Convex lens", "Plane glass", "Prism"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "A convex lens converges parallel rays toward its principal focus.",
  },
  {
    id: "phy-008",
    subject: "PHYSICS",
    question: "A 12 V supply is connected across a 4 Ω resistor. What current flows?",
    options: ["2 A", "3 A", "4 A", "48 A"],
    correctAnswerIndex: 1,
    difficulty: "HARD",
    explanation: "Ohm's law gives I = V ÷ R = 12 ÷ 4 = 3 A.",
  },

  // ==========================================================
  // HISTORY
  // ==========================================================

  {
    id: "hist-001",
    subject: "HISTORY",
    question: "In which year did Nigeria gain independence?",
    options: ["1957", "1959", "1960", "1963"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "Nigeria gained independence on 1 October 1960.",
  },
  {
    id: "hist-002",
    subject: "HISTORY",
    question: "Who was the first human to walk on the Moon?",
    options: [
      "Buzz Aldrin",
      "Neil Armstrong",
      "Yuri Gagarin",
      "Michael Collins",
    ],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "Neil Armstrong walked on the Moon during Apollo 11 in July 1969.",
  },
  {
    id: "hist-003",
    subject: "HISTORY",
    question: "Which ancient civilisation built the pyramids at Giza?",
    options: ["Romans", "Greeks", "Ancient Egyptians", "Persians"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "The pyramids at Giza were built by ancient Egyptians.",
  },
  {
    id: "hist-004",
    subject: "HISTORY",
    question: "Who was Nigeria's first prime minister?",
    options: [
      "Nnamdi Azikiwe",
      "Tafawa Balewa",
      "Obafemi Awolowo",
      "Ahmadu Bello",
    ],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "Abubakar Tafawa Balewa became Nigeria's first prime minister in 1960.",
  },
  {
    id: "hist-005",
    subject: "HISTORY",
    question: "Which event began in 1914 and ended in 1918?",
    options: [
      "World War I",
      "World War II",
      "The Cold War",
      "The French Revolution",
    ],
    correctAnswerIndex: 0,
    difficulty: "EASY",
    explanation: "World War I lasted from 1914 to 1918.",
  },
  {
    id: "hist-006",
    subject: "HISTORY",
    question: "In which year did Nigeria become a republic?",
    options: ["1960", "1963", "1966", "1979"],
    correctAnswerIndex: 1,
    difficulty: "MEDIUM",
    explanation: "Nigeria became a republic on 1 October 1963.",
  },
  {
    id: "hist-007",
    subject: "HISTORY",
    question: "Which civilisation is associated with the ancient city of Timbuktu?",
    options: ["Mali Empire", "Roman Empire", "Mughal Empire", "Inca Empire"],
    correctAnswerIndex: 0,
    difficulty: "MEDIUM",
    explanation: "Timbuktu became a major centre of trade and Islamic scholarship under the Mali Empire and later states.",
  },
  {
    id: "hist-008",
    subject: "HISTORY",
    question: "Who was the first president of the United States?",
    options: [
      "Abraham Lincoln",
      "Thomas Jefferson",
      "George Washington",
      "John Adams",
    ],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "George Washington served as the first US president from 1789 to 1797.",
  },

  // ==========================================================
  // GENERAL KNOWLEDGE
  // ==========================================================

  {
    id: "gen-001",
    subject: "GENERAL",
    question: "How many continents are commonly taught in the seven-continent model?",
    options: ["5", "6", "7", "8"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "The seven-continent model includes Africa, Antarctica, Asia, Europe, North America, South America and Australia.",
  },
  {
    id: "gen-002",
    subject: "GENERAL",
    question: "Which is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswerIndex: 3,
    difficulty: "EASY",
    explanation: "The Pacific Ocean is the largest ocean on Earth.",
  },
  {
    id: "gen-003",
    subject: "GENERAL",
    question: "What is the capital city of Nigeria?",
    options: ["Lagos", "Kano", "Abuja", "Ibadan"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "Abuja is Nigeria's federal capital territory.",
  },
  {
    id: "gen-004",
    subject: "GENERAL",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "Mars appears reddish because of iron oxide on its surface.",
  },
  {
    id: "gen-005",
    subject: "GENERAL",
    question: "What is the currency of Japan?",
    options: ["Won", "Yuan", "Yen", "Ringgit"],
    correctAnswerIndex: 2,
    difficulty: "EASY",
    explanation: "The yen is the official currency of Japan.",
  },
  {
    id: "gen-006",
    subject: "GENERAL",
    question: "Which organisation has its headquarters in New York City?",
    options: [
      "United Nations",
      "African Union",
      "ECOWAS",
      "European Commission",
    ],
    correctAnswerIndex: 0,
    difficulty: "MEDIUM",
    explanation: "The United Nations headquarters is in New York City.",
  },
  {
    id: "gen-007",
    subject: "GENERAL",
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctAnswerIndex: 1,
    difficulty: "EASY",
    explanation: "A hexagon is a polygon with six sides.",
  },
  {
    id: "gen-008",
    subject: "GENERAL",
    question: "Which language is primarily used to structure web pages?",
    options: ["HTML", "SQL", "Python", "C++"],
    correctAnswerIndex: 0,
    difficulty: "MEDIUM",
    explanation: "HTML defines the structure and content of web pages.",
  },
];

/**
 * Returns questions belonging to a specific subject.
 *
 * Example:
 * getQuestionsBySubject("CHEMISTRY")
 */
export function getQuestionsBySubject(
  subject: WhotQuestion["subject"],
): WhotQuestion[] {
  return WHOT_QUESTIONS.filter(
    (question) => question.subject === subject,
  );
}

/**
 * Returns questions at a particular difficulty.
 */
export function getQuestionsByDifficulty(
  difficulty: WhotQuestion["difficulty"],
): WhotQuestion[] {
  return WHOT_QUESTIONS.filter(
    (question) => question.difficulty === difficulty,
  );
}

/**
 * Returns the number of questions available for each subject.
 */
export function getWhotQuestionCounts(): Record<
  WhotQuestion["subject"],
  number
> {
  return {
    MATHS: getQuestionsBySubject("MATHS").length,
    ENGLISH: getQuestionsBySubject("ENGLISH").length,
    BIOLOGY: getQuestionsBySubject("BIOLOGY").length,
    CHEMISTRY: getQuestionsBySubject("CHEMISTRY").length,
    PHYSICS: getQuestionsBySubject("PHYSICS").length,
    HISTORY: getQuestionsBySubject("HISTORY").length,
    GENERAL: getQuestionsBySubject("GENERAL").length,
  };
}

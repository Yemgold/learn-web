


import type { WhotQuestion } from "../types/whot";

/**
 * LEARNYFI WHOT — EXPANDED QUESTION BANK
 *
 * Covers Sciences, Commercial, Arts, and General Knowledge.
 *
 * Each category has easy, medium, and hard questions.
 * Every question has four options and a zero-based answer index.
 *
 * Subjects:
 * MATHS, FURTHER_MATHS, ENGLISH, BIOLOGY, CHEMISTRY, PHYSICS,
 * AGRICULTURAL_SCIENCE, COMPUTER_STUDIES, COMMERCE, ACCOUNTING,
 * ECONOMICS, GOVERNMENT, OFFICE_PRACTICE, BUSINESS_STUDIES,
 * LITERATURE, HISTORY, CRS, IRS, FRENCH, YORUBA, GENERAL.
 */

type QuestionRow = [
  id: string,
  subject: WhotQuestion["subject"],
  question: string,
  options: [string, string, string, string],
  correctAnswerIndex: number,
  difficulty: WhotQuestion["difficulty"],
  explanation: string,
];

const QUESTION_ROWS: QuestionRow[] = [
  // ==========================================================
  // MATHEMATICS
  // ==========================================================
  [
    "math-001", "MATHS", "What is 12 × 8?",
    ["96", "86", "106", "108"], 0, "EASY",
    "12 multiplied by 8 equals 96.",
  ],
  [
    "math-002", "MATHS", "What is the square root of 81?",
    ["7", "8", "9", "10"], 2, "EASY",
    "9 × 9 equals 81.",
  ],
  [
    "math-003", "MATHS", "What is 15% of 200?",
    ["25", "30", "35", "40"], 1, "MEDIUM",
    "15% of 200 is 0.15 × 200 = 30.",
  ],
  [
    "math-004", "MATHS", "Solve: 3x + 5 = 20.",
    ["3", "5", "7", "15"], 1, "MEDIUM",
    "Subtract 5, then divide 15 by 3. Therefore x = 5.",
  ],
  [
    "math-005", "MATHS", "Find the area of a rectangle measuring 8 cm by 5 cm.",
    ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], 2, "EASY",
    "Area = length × width = 8 × 5 = 40 cm².",
  ],
  [
    "math-006", "MATHS", "Express 0.75 as a fraction in simplest form.",
    ["1/2", "2/3", "3/4", "4/5"], 2, "MEDIUM",
    "0.75 = 75/100 = 3/4.",
  ],
  [
    "math-007", "MATHS", "What is 2⁵?",
    ["10", "16", "25", "32"], 3, "EASY",
    "2⁵ = 2 × 2 × 2 × 2 × 2 = 32.",
  ],
  [
    "math-008", "MATHS", "What is the gradient of y = 4x + 3?",
    ["3", "4", "7", "-4"], 1, "HARD",
    "In y = mx + c, the gradient is m, the coefficient of x.",
  ],
  [
    "math-009", "MATHS", "A bag contains 3 red and 7 blue balls. What is the probability of picking red?",
    ["3/10", "7/10", "1/3", "1/2"], 0, "MEDIUM",
    "Probability = favourable outcomes / total outcomes = 3/10.",
  ],
  [
    "math-010", "MATHS", "Find the simple interest on ₦5,000 at 4% per annum for 2 years.",
    ["₦200", "₦400", "₦800", "₦1,000"], 1, "HARD",
    "SI = PRT/100 = 5000 × 4 × 2 / 100 = ₦400.",
  ],

  // ==========================================================
  // FURTHER MATHEMATICS
  // ==========================================================
  [
    "fmath-001", "FURTHER_MATHS", "Differentiate y = x² with respect to x.",
    ["x", "2x", "x²", "2"], 1, "EASY",
    "Using the power rule, d(x²)/dx = 2x.",
  ],
  [
    "fmath-002", "FURTHER_MATHS", "What is the determinant of [[2, 1], [3, 4]]?",
    ["5", "8", "11", "14"], 0, "MEDIUM",
    "The determinant is (2 × 4) − (1 × 3) = 5.",
  ],
  [
    "fmath-003", "FURTHER_MATHS", "Solve x² − 5x + 6 = 0.",
    ["1 and 6", "−2 and −3", "2 and 3", "−1 and 6"], 2, "HARD",
    "Factorise as (x − 2)(x − 3) = 0.",
  ],
  [
    "fmath-004", "FURTHER_MATHS", "What is the derivative of sin x?",
    ["−sin x", "cos x", "−cos x", "tan x"], 1, "MEDIUM",
    "The derivative of sin x with respect to x is cos x.",
  ],

  // ==========================================================
  // ENGLISH LANGUAGE
  // ==========================================================
  [
    "eng-001", "ENGLISH", "Which word is a synonym for happy?",
    ["Sad", "Joyful", "Angry", "Tired"], 1, "EASY",
    "Joyful means feeling or expressing happiness.",
  ],
  [
    "eng-002", "ENGLISH", "What is the past tense of go?",
    ["Goed", "Going", "Went", "Goes"], 2, "EASY",
    "Went is the simple past tense of go.",
  ],
  [
    "eng-003", "ENGLISH", "Choose the correctly spelt word.",
    ["Accomodation", "Accommodation", "Acommodation", "Acomodation"], 1, "MEDIUM",
    "Accommodation has double c and double m.",
  ],
  [
    "eng-004", "ENGLISH", "Identify the adjective: 'The clever student answered.'",
    ["The", "Clever", "Student", "Answered"], 1, "EASY",
    "Clever describes the noun student.",
  ],
  [
    "eng-005", "ENGLISH", "Which sentence is grammatically correct?",
    ["She have a book.", "She has a book.", "She having a book.", "She are having a book."], 1, "EASY",
    "The singular subject she takes has in this sentence.",
  ],
  [
    "eng-006", "ENGLISH", "What is the opposite of scarce?",
    ["Rare", "Limited", "Abundant", "Insufficient"], 2, "MEDIUM",
    "Abundant means available in large quantities.",
  ],
  [
    "eng-007", "ENGLISH", "A person who writes plays is called a ____.",
    ["Novelist", "Playwright", "Journalist", "Biographer"], 1, "MEDIUM",
    "A playwright writes plays for performance.",
  ],
  [
    "eng-008", "ENGLISH", "Which figure of speech compares things using 'like' or 'as'?",
    ["Metaphor", "Irony", "Simile", "Hyperbole"], 2, "HARD",
    "A simile makes a comparison using like or as.",
  ],
  [
    "eng-009", "ENGLISH", "Choose the correct completion: 'Neither of the boys ____ present.'",
    ["were", "are", "was", "have"], 2, "HARD",
    "Neither is grammatically treated as singular in this construction.",
  ],
  [
    "eng-010", "ENGLISH", "What is the main purpose of a thesis statement in an essay?",
    ["To list every source", "To state the central argument", "To end every paragraph", "To define all vocabulary"], 1, "MEDIUM",
    "A thesis statement presents the main claim or argument of an essay.",
  ],

  // ==========================================================
  // BIOLOGY
  // ==========================================================
  [
    "bio-001", "BIOLOGY", "Which organelle is primarily responsible for photosynthesis?",
    ["Mitochondrion", "Chloroplast", "Ribosome", "Nucleus"], 1, "EASY",
    "Chloroplasts contain chlorophyll and are the main sites of photosynthesis.",
  ],
  [
    "bio-002", "BIOLOGY", "What is the basic structural and functional unit of life?",
    ["Tissue", "Organ", "Cell", "System"], 2, "EASY",
    "The cell is the basic unit of living organisms.",
  ],
  [
    "bio-003", "BIOLOGY", "Which molecule carries hereditary information in most living organisms?",
    ["Glucose", "DNA", "Starch", "Glycerol"], 1, "EASY",
    "DNA stores genetic information in most organisms.",
  ],
  [
    "bio-004", "BIOLOGY", "Which blood cells transport oxygen using haemoglobin?",
    ["Platelets", "White blood cells", "Red blood cells", "Lymphocytes"], 2, "EASY",
    "Red blood cells contain haemoglobin, which binds oxygen.",
  ],
  [
    "bio-005", "BIOLOGY", "What is the main role of decomposers in an ecosystem?",
    ["Produce sunlight", "Recycle nutrients", "Stop photosynthesis", "Consume only living plants"], 1, "MEDIUM",
    "Decomposers return nutrients to the environment by breaking down organic matter.",
  ],
  [
    "bio-006", "BIOLOGY", "Which process produces two genetically similar daughter cells?",
    ["Meiosis", "Mitosis", "Fertilisation", "Pollination"], 1, "MEDIUM",
    "Mitosis generally produces two genetically similar daughter cells.",
  ],
  [
    "bio-007", "BIOLOGY", "Which plant tissue transports water from the roots?",
    ["Phloem", "Epidermis", "Xylem", "Cortex"], 2, "MEDIUM",
    "Xylem transports water and dissolved mineral salts.",
  ],
  [
    "bio-008", "BIOLOGY", "In a monohybrid cross Aa × Aa, what is the expected genotype ratio?",
    ["3:1", "1:1", "1:2:1", "9:3:3:1"], 2, "HARD",
    "The genotypes AA, Aa, Aa and aa produce a 1:2:1 ratio.",
  ],
  [
    "bio-009", "BIOLOGY", "Where does gas exchange mainly occur in the human lungs?",
    ["Trachea", "Alveoli", "Larynx", "Diaphragm"], 1, "MEDIUM",
    "Alveoli have thin walls and a large surface area for gas exchange.",
  ],
  [
    "bio-010", "BIOLOGY", "Which hormone lowers blood glucose concentration?",
    ["Adrenaline", "Insulin", "Thyroxine", "Glucagon"], 1, "HARD",
    "Insulin promotes glucose uptake and storage, lowering blood glucose.",
  ],

  // ==========================================================
  // CHEMISTRY
  // ==========================================================
  [
    "chem-001", "CHEMISTRY", "What is the chemical formula for water?",
    ["CO₂", "NaCl", "H₂O", "O₂"], 2, "EASY",
    "A water molecule contains two hydrogen atoms and one oxygen atom.",
  ],
  [
    "chem-002", "CHEMISTRY", "What is the atomic number of carbon?",
    ["4", "6", "8", "12"], 1, "EASY",
    "Carbon has six protons.",
  ],
  [
    "chem-003", "CHEMISTRY", "A solution with a pH of 2 is generally ____.",
    ["Strongly acidic", "Neutral", "Weakly alkaline", "Strongly alkaline"], 0, "EASY",
    "A pH below 7 indicates an acidic solution.",
  ],
  [
    "chem-004", "CHEMISTRY", "Which gas is released when dilute hydrochloric acid reacts with zinc?",
    ["Oxygen", "Chlorine", "Hydrogen", "Carbon dioxide"], 2, "MEDIUM",
    "Zinc reacts with dilute hydrochloric acid to release hydrogen gas.",
  ],
  [
    "chem-005", "CHEMISTRY", "What type of bond forms when atoms share electron pairs?",
    ["Ionic", "Covalent", "Metallic", "Hydrogen"], 1, "MEDIUM",
    "Covalent bonds involve shared pairs of electrons.",
  ],
  [
    "chem-006", "CHEMISTRY", "What is the relative molecular mass of CO₂? (C = 12, O = 16)",
    ["28", "32", "40", "44"], 3, "MEDIUM",
    "Mr(CO₂) = 12 + (2 × 16) = 44.",
  ],
  [
    "chem-007", "CHEMISTRY", "Oxidation is commonly defined as ____ in terms of electrons.",
    ["Gain of electrons", "Loss of electrons", "Gain of protons", "Gain of neutrons"], 1, "HARD",
    "Oxidation involves loss of electrons.",
  ],
  [
    "chem-008", "CHEMISTRY", "How many moles are in 18 g of water? (Mr = 18)",
    ["0.5 mol", "1 mol", "2 mol", "18 mol"], 1, "HARD",
    "Moles = mass / molar mass = 18 / 18 = 1 mol.",
  ],
  [
    "chem-009", "CHEMISTRY", "Which method is most suitable for separating coloured dyes in ink?",
    ["Filtration", "Chromatography", "Decantation", "Sublimation"], 1, "MEDIUM",
    "Chromatography separates components according to their different movement through a medium.",
  ],
  [
    "chem-010", "CHEMISTRY", "What is the oxidation number of oxygen in most compounds?",
    ["−2", "−1", "0", "+2"], 0, "HARD",
    "Oxygen usually has an oxidation number of −2, with some exceptions.",
  ],

  // ==========================================================
  // PHYSICS
  // ==========================================================
  [
    "phy-001", "PHYSICS", "What is the SI unit of force?",
    ["Joule", "Watt", "Newton", "Pascal"], 2, "EASY",
    "Force is measured in newtons.",
  ],
  [
    "phy-002", "PHYSICS", "What is the approximate speed of light in a vacuum?",
    ["150,000 km/s", "300,000 km/s", "450,000 km/s", "600,000 km/s"], 1, "EASY",
    "Light travels at approximately 3 × 10⁸ m/s in a vacuum.",
  ],
  [
    "phy-003", "PHYSICS", "A car travels 100 metres in 5 seconds. What is its average speed?",
    ["10 m/s", "20 m/s", "25 m/s", "50 m/s"], 1, "EASY",
    "Speed = distance / time = 100 / 5 = 20 m/s.",
  ],
  [
    "phy-004", "PHYSICS", "Which instrument measures electric current?",
    ["Voltmeter", "Barometer", "Ammeter", "Thermometer"], 2, "EASY",
    "An ammeter measures electric current.",
  ],
  [
    "phy-005", "PHYSICS", "What is the SI unit of electrical resistance?",
    ["Ampere", "Volt", "Ohm", "Coulomb"], 2, "MEDIUM",
    "Electrical resistance is measured in ohms.",
  ],
  [
    "phy-006", "PHYSICS", "A force of 20 N acts on a mass of 4 kg. Find the acceleration.",
    ["4 m/s²", "5 m/s²", "16 m/s²", "80 m/s²"], 1, "MEDIUM",
    "From F = ma, a = F/m = 20/4 = 5 m/s².",
  ],
  [
    "phy-007", "PHYSICS", "Which lens converges parallel rays of light?",
    ["Concave lens", "Convex lens", "Plane glass", "Prism"], 1, "MEDIUM",
    "A convex lens converges parallel rays toward its principal focus.",
  ],
  [
    "phy-008", "PHYSICS", "A 12 V supply is connected across a 4 Ω resistor. What current flows?",
    ["2 A", "3 A", "4 A", "48 A"], 1, "HARD",
    "Ohm's law gives I = V/R = 12/4 = 3 A.",
  ],
  [
    "phy-009", "PHYSICS", "What is the kinetic energy of a 2 kg object moving at 3 m/s?",
    ["3 J", "6 J", "9 J", "18 J"], 2, "MEDIUM",
    "KE = ½mv² = ½ × 2 × 3² = 9 J.",
  ],
  [
    "phy-010", "PHYSICS", "Which phenomenon explains the bending of waves around obstacles?",
    ["Reflection", "Refraction", "Diffraction", "Polarisation"], 2, "HARD",
    "Diffraction is the spreading or bending of waves around obstacles or through openings.",
  ],

  // ==========================================================
  // AGRICULTURAL SCIENCE
  // ==========================================================
  [
    "agri-001", "AGRICULTURAL_SCIENCE", "Which soil type generally holds the most water?",
    ["Sandy soil", "Gravel", "Clay soil", "Coarse sand"], 2, "EASY",
    "Clay has fine particles and generally retains more water than sandy soil.",
  ],
  [
    "agri-002", "AGRICULTURAL_SCIENCE", "Which nutrient is especially important for leafy vegetative growth?",
    ["Nitrogen", "Sodium", "Lead", "Mercury"], 0, "EASY",
    "Nitrogen supports chlorophyll formation and vegetative growth.",
  ],
  [
    "agri-003", "AGRICULTURAL_SCIENCE", "What is crop rotation?",
    ["Growing one crop forever", "Growing different crops in sequence on the same land", "Burning every field", "Harvesting without planting"], 1, "MEDIUM",
    "Crop rotation changes the crop grown on a field across successive seasons.",
  ],
  [
    "agri-004", "AGRICULTURAL_SCIENCE", "Which practice helps reduce soil erosion on sloping farmland?",
    ["Up-and-down ploughing", "Overgrazing", "Contour ploughing", "Removing all vegetation"], 2, "HARD",
    "Contour ploughing follows the land's contours and slows surface runoff.",
  ],

  // ==========================================================
  // COMPUTER STUDIES
  // ==========================================================
  [
    "comp-001", "COMPUTER_STUDIES", "Which component is often called the brain of a computer?",
    ["Monitor", "CPU", "Keyboard", "Speaker"], 1, "EASY",
    "The central processing unit executes instructions and processes data.",
  ],
  [
    "comp-002", "COMPUTER_STUDIES", "Which of these is an input device?",
    ["Printer", "Monitor", "Keyboard", "Projector"], 2, "EASY",
    "A keyboard sends user input to a computer.",
  ],
  [
    "comp-003", "COMPUTER_STUDIES", "What does RAM primarily provide?",
    ["Permanent paper storage", "Temporary working memory", "Printed output", "Internet access by itself"], 1, "MEDIUM",
    "RAM temporarily holds data and instructions currently in use.",
  ],
  [
    "comp-004", "COMPUTER_STUDIES", "Which number system uses only 0 and 1?",
    ["Decimal", "Octal", "Binary", "Hexadecimal"], 2, "MEDIUM",
    "Binary is a base-two number system using 0 and 1.",
  ],

  // ==========================================================
  // COMMERCE
  // ==========================================================
  [
    "comm-001", "COMMERCE", "What is commerce mainly concerned with?",
    ["Only farming", "Trade and activities that support trade", "Only mining", "Only manufacturing"], 1, "EASY",
    "Commerce includes trade and services that facilitate the distribution of goods.",
  ],
  [
    "comm-002", "COMMERCE", "Who is a wholesaler?",
    ["A consumer buying one item", "A trader who sells mainly to retailers", "A factory machine", "A tax collector"], 1, "EASY",
    "Wholesalers buy goods in bulk and sell mainly to retailers or other businesses.",
  ],
  [
    "comm-003", "COMMERCE", "Which transport method is generally suitable for bulky international cargo over long distances?",
    ["Wheelbarrow", "Sea transport", "Hand carrying", "Bicycle"], 1, "MEDIUM",
    "Ships can transport large volumes of bulky cargo economically over long distances.",
  ],
  [
    "comm-004", "COMMERCE", "What is the main purpose of advertising?",
    ["To hide products", "To inform and persuade potential customers", "To stop competition", "To record wages only"], 1, "MEDIUM",
    "Advertising informs audiences about products and may encourage purchase.",
  ],

  // ==========================================================
  // FINANCIAL ACCOUNTING
  // ==========================================================
  [
    "acct-001", "ACCOUNTING", "Which statement represents the accounting equation?",
    ["Assets = Liabilities + Capital", "Assets = Income − Expenses", "Capital = Assets + Liabilities", "Liabilities = Assets + Capital"], 0, "EASY",
    "The basic accounting equation is Assets = Liabilities + Equity.",
  ],
  [
    "acct-002", "ACCOUNTING", "Which book is used to record transactions first in chronological order?",
    ["Ledger", "Journal", "Balance sheet", "Trial balance"], 1, "EASY",
    "Transactions are first recorded in a journal or book of original entry.",
  ],
  [
    "acct-003", "ACCOUNTING", "What is the purpose of a trial balance?",
    ["To prove that all fraud is absent", "To check the arithmetical equality of ledger balances", "To calculate only sales", "To replace every financial statement"], 1, "MEDIUM",
    "A trial balance checks whether total debit balances equal total credit balances.",
  ],
  [
    "acct-004", "ACCOUNTING", "A business buys equipment for cash. What is the immediate effect?",
    ["Equipment and cash both increase", "Equipment increases and cash decreases", "Liabilities increase only", "Capital automatically doubles"], 1, "HARD",
    "The equipment asset increases while the cash asset decreases by the same amount.",
  ],

  // ==========================================================
  // ECONOMICS
  // ==========================================================
  [
    "econ-001", "ECONOMICS", "What is opportunity cost?",
    ["The price of every product combined", "The next best alternative forgone", "A government tax", "Money kept in a bank"], 1, "EASY",
    "Opportunity cost is the value of the next best alternative given up.",
  ],
  [
    "econ-002", "ECONOMICS", "Which factor of production receives wages?",
    ["Land", "Labour", "Capital", "Entrepreneurship"], 1, "EASY",
    "Labour is generally rewarded with wages or salaries.",
  ],
  [
    "econ-003", "ECONOMICS", "What normally happens to quantity demanded when price falls, other things being equal?",
    ["It decreases", "It increases", "It always becomes zero", "It cannot change"], 1, "MEDIUM",
    "The law of demand states that quantity demanded generally rises as price falls, all else equal.",
  ],
  [
    "econ-004", "ECONOMICS", "Inflation is best described as ____.",
    ["A sustained rise in the general price level", "A fall in all wages", "An increase in one product's quality", "A decrease in population"], 0, "MEDIUM",
    "Inflation is a sustained increase in the general level of prices.",
  ],

  // ==========================================================
  // GOVERNMENT
  // ==========================================================
  [
    "gov-001", "GOVERNMENT", "What is a constitution?",
    ["A country's fundamental framework of laws and principles", "A market receipt", "A school timetable", "A business advertisement"], 0, "EASY",
    "A constitution establishes the framework and fundamental rules of government.",
  ],
  [
    "gov-002", "GOVERNMENT", "Which arm of government is primarily responsible for making laws?",
    ["Judiciary", "Legislature", "Civil service", "Police alone"], 1, "EASY",
    "The legislature is the law-making arm of government.",
  ],
  [
    "gov-003", "GOVERNMENT", "What is the principle of separation of powers intended to do?",
    ["Concentrate all power in one person", "Divide governmental powers among different branches", "End the courts", "Remove the constitution"], 1, "MEDIUM",
    "Separation of powers distributes functions among branches to limit excessive concentration of power.",
  ],
  [
    "gov-004", "GOVERNMENT", "Which is a core feature of a democratic election?",
    ["Voting without any rules", "Meaningful choice and a fair opportunity to vote", "Permanent rule without elections", "Banning all candidates"], 1, "MEDIUM",
    "Democratic elections require meaningful participation and fair electoral procedures.",
  ],

  // ==========================================================
  // OFFICE PRACTICE
  // ==========================================================
  [
    "office-001", "OFFICE_PRACTICE", "Which machine produces paper copies of digital documents?",
    ["Scanner only", "Printer", "Router", "Microphone"], 1, "EASY",
    "A printer produces hard copies of digital documents.",
  ],
  [
    "office-002", "OFFICE_PRACTICE", "What is the main purpose of filing office documents?",
    ["To lose records", "To organise and retrieve records efficiently", "To increase paper waste", "To prevent communication"], 1, "EASY",
    "Filing keeps records organised so they can be found when needed.",
  ],
  [
    "office-003", "OFFICE_PRACTICE", "Which telephone practice is most professional?",
    ["Interrupting the caller", "Answering politely and identifying the organisation", "Leaving every call unanswered", "Sharing confidential details with anyone"], 1, "MEDIUM",
    "Professional telephone etiquette includes a polite greeting and clear identification.",
  ],
  [
    "office-004", "OFFICE_PRACTICE", "What should be done with confidential records?",
    ["Leave them in public areas", "Give them to every visitor", "Restrict access to authorised people", "Post them publicly"], 2, "HARD",
    "Confidential records should be protected and accessed only by authorised people.",
  ],

  // ==========================================================
  // BUSINESS STUDIES
  // ==========================================================
  [
    "biz-001", "BUSINESS_STUDIES", "Who is an entrepreneur?",
    ["A person who starts and organises a business", "Only a customer", "A type of receipt", "A machine operator in every case"], 0, "EASY",
    "An entrepreneur organises a business venture and takes associated risks.",
  ],
  [
    "biz-002", "BUSINESS_STUDIES", "What is a business plan?",
    ["A plan for avoiding customers", "A document outlining business goals and how to achieve them", "A personal diary only", "A banknote"], 1, "EASY",
    "A business plan sets out objectives, strategies, resources and financial expectations.",
  ],
  [
    "biz-003", "BUSINESS_STUDIES", "What is profit?",
    ["Revenue minus total costs", "Costs plus debts only", "Sales tax only", "Total assets in every case"], 0, "MEDIUM",
    "Profit is the amount remaining when total costs are deducted from revenue.",
  ],
  [
    "biz-004", "BUSINESS_STUDIES", "Which practice helps a business maintain customer loyalty?",
    ["Ignoring complaints", "Consistent service and fair treatment", "Changing prices without explanation every hour", "Hiding product information"], 1, "MEDIUM",
    "Reliable service and fair treatment can build trust and repeat business.",
  ],

  // ==========================================================
  // LITERATURE IN ENGLISH
  // ==========================================================
  [
    "lit-001", "LITERATURE", "Which literary form is primarily written for stage performance?",
    ["Drama", "Dictionary", "Atlas", "Invoice"], 0, "EASY",
    "Drama is written for performance by actors, often on a stage.",
  ],
  [
    "lit-002", "LITERATURE", "Who tells the story in a first-person narrative?",
    ["A narrator using 'I' or 'we'", "Only the reader", "The publisher in every case", "A stage manager"], 0, "MEDIUM",
    "A first-person narrator recounts events using first-person pronouns.",
  ],
  [
    "lit-003", "LITERATURE", "What is personification?",
    ["Giving human qualities to non-human things", "Repeating a rhyme scheme only", "A list of characters", "A type of punctuation"], 0, "MEDIUM",
    "Personification attributes human qualities or actions to non-human things.",
  ],
  [
    "lit-004", "LITERATURE", "What is dramatic irony?",
    ["When the audience knows something a character does not", "When every character tells the truth", "A poem with no imagery", "A story without conflict"], 0, "HARD",
    "Dramatic irony occurs when the audience knows something unknown to a character.",
  ],

  // ==========================================================
  // HISTORY
  // ==========================================================
  [
    "hist-001", "HISTORY", "In which year did Nigeria gain independence?",
    ["1957", "1959", "1960", "1963"], 2, "EASY",
    "Nigeria gained independence on 1 October 1960.",
  ],
  [
    "hist-002", "HISTORY", "Who was the first human to walk on the Moon?",
    ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"], 1, "EASY",
    "Neil Armstrong walked on the Moon during Apollo 11 in July 1969.",
  ],
  [
    "hist-003", "HISTORY", "Which ancient civilisation built the pyramids at Giza?",
    ["Romans", "Greeks", "Ancient Egyptians", "Persians"], 2, "EASY",
    "The pyramids at Giza were built by ancient Egyptians.",
  ],
  [
    "hist-004", "HISTORY", "Who was Nigeria's first prime minister?",
    ["Nnamdi Azikiwe", "Tafawa Balewa", "Obafemi Awolowo", "Ahmadu Bello"], 1, "MEDIUM",
    "Abubakar Tafawa Balewa became Nigeria's first prime minister in 1960.",
  ],
  [
    "hist-005", "HISTORY", "Which event lasted from 1914 to 1918?",
    ["World War I", "World War II", "The Cold War", "The French Revolution"], 0, "EASY",
    "World War I lasted from 1914 to 1918.",
  ],
  [
    "hist-006", "HISTORY", "In which year did Nigeria become a republic?",
    ["1960", "1963", "1966", "1979"], 1, "MEDIUM",
    "Nigeria became a republic on 1 October 1963.",
  ],

  // ==========================================================
  // CHRISTIAN RELIGIOUS STUDIES
  // ==========================================================
  [
    "crs-001", "CRS", "According to the Bible, who built an ark before the flood?",
    ["Moses", "Noah", "David", "Solomon"], 1, "EASY",
    "In the Genesis account, Noah built an ark before the flood.",
  ],
  [
    "crs-002", "CRS", "In which town was Jesus born, according to the Gospels?",
    ["Nazareth", "Bethlehem", "Jericho", "Capernaum"], 1, "EASY",
    "The Gospel accounts identify Bethlehem as Jesus' birthplace.",
  ],
  [
    "crs-003", "CRS", "Which disciple denied knowing Jesus three times?",
    ["Peter", "John", "Thomas", "Andrew"], 0, "MEDIUM",
    "The Gospel accounts describe Peter denying Jesus three times.",
  ],
  [
    "crs-004", "CRS", "What is the central theme of the parable of the Good Samaritan?",
    ["Love and compassion for one's neighbour", "Building a palace", "Winning a race", "Collecting taxes"], 0, "MEDIUM",
    "The parable teaches compassion beyond social and ethnic boundaries.",
  ],

  // ==========================================================
  // ISLAMIC RELIGIOUS STUDIES
  // ==========================================================
  [
    "irs-001", "IRS", "What is the holy book of Islam?",
    ["Torah", "Qur'an", "Vedas", "Tripitaka"], 1, "EASY",
    "The Qur'an is the central holy scripture of Islam.",
  ],
  [
    "irs-002", "IRS", "What is the name of the month of obligatory fasting in Islam?",
    ["Shawwal", "Ramadan", "Safar", "Rajab"], 1, "EASY",
    "Muslims observe the obligatory fast during Ramadan.",
  ],
  [
    "irs-003", "IRS", "What is Zakat?",
    ["A form of obligatory almsgiving", "A pilgrimage site", "A language", "A type of trade route"], 0, "MEDIUM",
    "Zakat is an obligatory form of almsgiving for eligible Muslims.",
  ],
  [
    "irs-004", "IRS", "In which city is the Kaaba located?",
    ["Medina", "Jerusalem", "Makkah", "Cairo"], 2, "EASY",
    "The Kaaba is located in the Masjid al-Haram in Makkah.",
  ],

  // ==========================================================
  // FRENCH
  // ==========================================================
  [
    "fr-001", "FRENCH", "What does 'bonjour' mean in English?",
    ["Goodbye", "Good morning / hello", "Please", "Sorry"], 1, "EASY",
    "Bonjour is a common French greeting meaning hello or good day.",
  ],
  [
    "fr-002", "FRENCH", "What is the French word for 'book'?",
    ["Maison", "Livre", "Eau", "Chaise"], 1, "EASY",
    "Livre means book in French.",
  ],
  [
    "fr-003", "FRENCH", "Choose the correct French translation of 'I am a student.'",
    ["Je suis étudiant(e).", "Tu es maison.", "Nous avons livre.", "Ils sont eau."], 0, "MEDIUM",
    "Je suis étudiant or étudiante means I am a student.",
  ],
  [
    "fr-004", "FRENCH", "What is the plural of 'un cheval'?",
    ["Des cheval", "Des chevals", "Des chevaux", "Les chevale"], 2, "HARD",
    "The usual plural of cheval is chevaux.",
  ],

  // ==========================================================
  // YORUBA
  // ==========================================================
  [
    "yor-001", "YORUBA", "What does 'ẹ káàárọ̀' mean?",
    ["Good morning", "Good night", "Thank you", "Welcome home"], 0, "EASY",
    "Ẹ káàárọ̀ is a respectful Yoruba greeting meaning good morning.",
  ],
  [
    "yor-002", "YORUBA", "Which greeting is commonly used in Yoruba for 'thank you'?",
    ["Ẹ jọ̀ọ́", "Ẹ ṣé", "Ó dàbọ̀", "Báwo ni"], 1, "EASY",
    "Ẹ ṣé is a polite way to say thank you in Yoruba.",
  ],
  [
    "yor-003", "YORUBA", "What does 'omi' mean in Yoruba?",
    ["Fire", "Water", "Food", "House"], 1, "EASY",
    "Omi means water in Yoruba.",
  ],
  [
    "yor-004", "YORUBA", "Which of these is a Yoruba greeting?",
    ["Ẹ káàsán", "Merci beaucoup", "Guten Morgen", "Buongiorno"], 0, "MEDIUM",
    "Ẹ káàsán is a Yoruba greeting used in the afternoon.",
  ],

  // ==========================================================
  // GENERAL KNOWLEDGE
  // ==========================================================
  [
    "gen-001", "GENERAL", "How many continents are commonly taught in the seven-continent model?",
    ["5", "6", "7", "8"], 2, "EASY",
    "The seven-continent model includes Africa, Antarctica, Asia, Europe, North America, South America and Australia.",
  ],
  [
    "gen-002", "GENERAL", "Which is the largest ocean on Earth?",
    ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], 3, "EASY",
    "The Pacific Ocean is the largest ocean on Earth.",
  ],
  [
    "gen-003", "GENERAL", "What is the capital city of Nigeria?",
    ["Lagos", "Kano", "Abuja", "Ibadan"], 2, "EASY",
    "Abuja is Nigeria's federal capital.",
  ],
  [
    "gen-004", "GENERAL", "Which planet is known as the Red Planet?",
    ["Venus", "Mars", "Jupiter", "Mercury"], 1, "EASY",
    "Mars appears reddish partly because of iron oxide on its surface.",
  ],
  [
    "gen-005", "GENERAL", "What is the currency of Japan?",
    ["Won", "Yuan", "Yen", "Ringgit"], 2, "EASY",
    "The yen is Japan's currency.",
  ],
  [
    "gen-006", "GENERAL", "Which organisation has its headquarters in New York City?",
    ["United Nations", "African Union", "ECOWAS", "European Commission"], 0, "MEDIUM",
    "The United Nations headquarters is in New York City.",
  ],
  [
    "gen-007", "GENERAL", "How many sides does a hexagon have?",
    ["5", "6", "7", "8"], 1, "EASY",
    "A hexagon has six sides.",
  ],
  [
    "gen-008", "GENERAL", "Which language is primarily used to structure web pages?",
    ["HTML", "SQL", "Python", "C++"], 0, "MEDIUM",
    "HTML defines the structure and content of web pages.",
  ],
];

export const WHOT_QUESTIONS: WhotQuestion[] = QUESTION_ROWS.map(
  ([id, subject, question, options, correctAnswerIndex, difficulty, explanation]) => ({
    id,
    subject,
    question,
    options,
    correctAnswerIndex,
    difficulty,
    explanation,
  }),
);

export function getQuestionsBySubject(
  subject: WhotQuestion["subject"],
): WhotQuestion[] {
  return WHOT_QUESTIONS.filter(
    (question) => question.subject === subject,
  );
}

export function getQuestionsByDifficulty(
  difficulty: WhotQuestion["difficulty"],
): WhotQuestion[] {
  return WHOT_QUESTIONS.filter(
    (question) => question.difficulty === difficulty,
  );
}

export function getWhotQuestionCounts(): Record<
  WhotQuestion["subject"],
  number
> {
  return Object.fromEntries(
    [...new Set(WHOT_QUESTIONS.map((question) => question.subject))].map(
      (subject) => [
        subject,
        getQuestionsBySubject(subject).length,
      ],
    ),
  ) as Record<WhotQuestion["subject"], number>;
}

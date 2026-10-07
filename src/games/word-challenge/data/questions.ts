





import type { WordChallengeQuestion } from "../components/WordChallengeGame";

export const wordChallengeQuestions: WordChallengeQuestion[] = [
  {
    id: "animal-lion",
    answer: "LION",
    description:
      "This powerful wild animal lives in groups called prides. The male is known for its thick mane and powerful roar.",
    clue:
      "This animal is often called the king of the jungle.",
    letters: ["L", "I", "O", "N", "X", "G"],
    category: "Animals",
    startingPoints: 60,
    timeLimit: 60,
    clueThreshold: 30,
    cluePenalty: 5,
  },

  {
    id: "animal-elephant",
    answer: "ELEPHANT",
    description:
      "This is the largest land animal on Earth. It has a long trunk, large ears, and strong tusks.",
    clue:
      "Its long nose is called a trunk.",
    letters: ["E", "L", "E", "P", "H", "A", "N", "T", "R", "S"],
    category: "Animals",
    startingPoints: 60,
    timeLimit: 40,
    clueThreshold: 20,
    cluePenalty: 5,
  },

  {
    id: "animal-giraffe",
    answer: "GIRAFFE",
    description:
      "This tall African animal has a very long neck and long legs. It feeds mainly on leaves from trees.",
    clue:
      "It is the tallest living land animal.",
    letters: ["G", "I", "R", "A", "F", "F", "E", "L", "T"],
    category: "Animals",
    startingPoints: 20,
    timeLimit: 22,
    clueThreshold: 10,
    cluePenalty: 5,
  },

  {
    id: "food-banana",
    answer: "BANANA",
    description:
      "This popular fruit has a soft edible inside and is usually covered by a yellow skin when ripe.",
    clue:
      "Monkeys are commonly associated with eating this fruit.",
    letters: ["B", "A", "N", "A", "N", "A", "R", "T"],
    category: "Food",
    startingPoints: 20,
    timeLimit: 20,
    clueThreshold: 9,
    cluePenalty: 5,
  },

  {
    id: "food-orange",
    answer: "ORANGE",
    description:
      "This round citrus fruit has a juicy interior divided into segments and is rich in vitamin C.",
    clue:
      "Its name is also used for a colour.",
    letters: ["O", "R", "A", "N", "G", "E", "P", "T"],
    category: "Food",
    startingPoints: 20,
    timeLimit: 20,
    clueThreshold: 9,
    cluePenalty: 5,
  },

  {
    id: "food-rice",
    answer: "RICE",
    description:
      "This small grain is eaten as a major staple food in many parts of the world. It can be boiled, fried, or cooked with different ingredients.",
    clue:
      "Jollof is one popular dish made from this grain.",
    letters: ["R", "I", "C", "E", "A", "T"],
    category: "Food",
    startingPoints: 20,
    timeLimit: 18,
    clueThreshold: 8,
    cluePenalty: 5,
  },

  {
    id: "science-oxygen",
    answer: "OXYGEN",
    description:
      "This colourless gas is essential for human and animal respiration and supports combustion.",
    clue:
      "You breathe this gas to stay alive.",
    letters: ["O", "X", "Y", "G", "E", "N", "A", "R"],
    category: "Science",
    startingPoints: 20,
    timeLimit: 20,
    clueThreshold: 9,
    cluePenalty: 5,
  },

  {
    id: "science-gravity",
    answer: "GRAVITY",
    description:
      "This force pulls objects toward the Earth and keeps planets and other bodies moving in their orbits.",
    clue:
      "It is the reason objects fall when you drop them.",
    letters: ["G", "R", "A", "V", "I", "T", "Y", "L", "P"],
    category: "Science",
    startingPoints: 20,
    timeLimit: 22,
    clueThreshold: 10,
    cluePenalty: 5,
  },

  {
    id: "science-atom",
    answer: "ATOM",
    description:
      "This is the smallest unit of an element that still retains the chemical properties of that element.",
    clue:
      "Everything around you is made from these basic units.",
    letters: ["A", "T", "O", "M", "R", "E"],
    category: "Science",
    startingPoints: 20,
    timeLimit: 18,
    clueThreshold: 8,
    cluePenalty: 5,
  },

  {
    id: "body-heart",
    answer: "HEART",
    description:
      "This muscular organ continuously pumps blood around the body through the circulatory system.",
    clue:
      "You can feel this organ beating in your chest.",
    letters: ["H", "E", "A", "R", "T", "S", "P"],
    category: "Human Body",
    startingPoints: 20,
    timeLimit: 18,
    clueThreshold: 8,
    cluePenalty: 5,
  },

  {
    id: "body-brain",
    answer: "BRAIN",
    description:
      "This organ controls many activities of the body and allows humans to think, remember, learn, and make decisions.",
    clue:
      "It is protected by the skull.",
    letters: ["B", "R", "A", "I", "N", "D", "E"],
    category: "Human Body",
    startingPoints: 20,
    timeLimit: 18,
    clueThreshold: 8,
    cluePenalty: 5,
  },

  {
    id: "body-lungs",
    answer: "LUNGS",
    description:
      "These two organs are found in the chest and are responsible for exchanging oxygen and carbon dioxide during breathing.",
    clue:
      "You use these organs every time you breathe.",
    letters: ["L", "U", "N", "G", "S", "A", "P"],
    category: "Human Body",
    startingPoints: 20,
    timeLimit: 18,
    clueThreshold: 8,
    cluePenalty: 5,
  },

  {
    id: "school-teacher",
    answer: "TEACHER",
    description:
      "This person helps students learn new knowledge and skills, explains difficult ideas, and guides them in their studies.",
    clue:
      "Students usually meet this person in the classroom.",
    letters: ["T", "E", "A", "C", "H", "E", "R", "L", "N"],
    category: "Education",
    startingPoints: 20,
    timeLimit: 22,
    clueThreshold: 10,
    cluePenalty: 5,
  },

  {
    id: "school-library",
    answer: "LIBRARY",
    description:
      "This is a place where books and other learning resources are kept so that people can read, study, and research.",
    clue:
      "Students often go here to borrow books.",
    letters: ["L", "I", "B", "R", "A", "R", "Y", "C", "E"],
    category: "Education",
    startingPoints: 20,
    timeLimit: 22,
    clueThreshold: 10,
    cluePenalty: 5,
  },

  {
    id: "nature-rainbow",
    answer: "RAINBOW",
    description:
      "This colourful arc can appear in the sky when sunlight passes through water droplets in the atmosphere.",
    clue:
      "It can show several colours after rain.",
    letters: ["R", "A", "I", "N", "B", "O", "W", "S", "T"],
    category: "Nature",
    startingPoints: 20,
    timeLimit: 22,
    clueThreshold: 10,
    cluePenalty: 5,
  },

  {
    id: "nature-volcano",
    answer: "VOLCANO",
    description:
      "This opening or mountain allows hot molten rock, ash, and gases from inside the Earth to escape.",
    clue:
      "It can erupt and release lava.",
    letters: ["V", "O", "L", "C", "A", "N", "O", "E", "R"],
    category: "Nature",
    startingPoints: 20,
    timeLimit: 22,
    clueThreshold: 10,
    cluePenalty: 5,
  },

  {
    id: "object-computer",
    answer: "COMPUTER",
    description:
      "This electronic machine can receive information, process it, store data, and perform many different tasks.",
    clue:
      "You are probably using one of these to play this game.",
    letters: ["C", "O", "M", "P", "U", "T", "E", "R", "A", "S"],
    category: "Technology",
    startingPoints: 20,
    timeLimit: 25,
    clueThreshold: 11,
    cluePenalty: 5,
  },

  {
    id: "technology-phone",
    answer: "PHONE",
    description:
      "This portable electronic device allows people to communicate, access the internet, take pictures, and run applications.",
    clue:
      "You can use this device to make calls.",
    letters: ["P", "H", "O", "N", "E", "L", "A"],
    category: "Technology",
    startingPoints: 20,
    timeLimit: 18,
    clueThreshold: 8,
    cluePenalty: 5,
  },

  {
    id: "place-hospital",
    answer: "HOSPITAL",
    description:
      "This is a healthcare facility where doctors, nurses, and other professionals diagnose and treat people who are sick or injured.",
    clue:
      "Patients go here when they need medical care.",
    letters: [
      "H",
      "O",
      "S",
      "P",
      "I",
      "T",
      "A",
      "L",
      "M",
      "E",
    ],
    category: "Places",
    startingPoints: 20,
    timeLimit: 24,
    clueThreshold: 10,
    cluePenalty: 5,
  },

  {
    id: "place-school",
    answer: "SCHOOL",
    description:
      "This is a place where students receive education, attend lessons, practise skills, and interact with teachers and other students.",
    clue:
      "Students go here to learn.",
    letters: ["S", "C", "H", "O", "O", "L", "B", "A"],
    category: "Places",
    startingPoints: 20,
    timeLimit: 20,
    clueThreshold: 9,
    cluePenalty: 5,
  },
];

export default wordChallengeQuestions;




import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — EVOLUTION AND ADAPTATION                                         */
/* -------------------------------------------------------------------------- */

export const evolutionAndAdaptationQuestions: ArenaQuestion[] = [
  // ============================================================
  // A02.4 Physiological Adaptations in Plants — 20
  // biology-evolution-001 → biology-evolution-020
  // ============================================================

  {
    id: "biology-evolution-001",

    question:
      "Which physiological adaptation enables a plant growing in a dry environment to reduce water loss?",

    options: [
      {
        id: "A",
        text: "Increased production of chlorophyll",
      },
      {
        id: "B",
        text: "Closing of stomata during periods of water stress",
      },
      {
        id: "C",
        text: "Increased size of leaves",
      },
      {
        id: "D",
        text: "Increased number of stomata",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Closing stomata reduces the loss of water vapour from the leaves.",

      steps: [
        "Stomata are pores through which gases enter and leave plant leaves.",
        "Water vapour is lost through open stomata during transpiration.",
        "In dry conditions, excessive water loss can cause dehydration.",
        "Closing the stomata reduces transpiration and conserves water.",
        "Therefore, the correct answer is closing of stomata during periods of water stress.",
      ],
    },
  },

  {
    id: "biology-evolution-002",

    question:
      "Which physiological adaptation helps a desert plant conserve water during prolonged drought?",

    options: [
      {
        id: "A",
        text: "Production of concentrated cell sap",
      },
      {
        id: "B",
        text: "Production of very large leaves",
      },
      {
        id: "C",
        text: "Continuous opening of stomata",
      },
      {
        id: "D",
        text: "Reduction in root absorption",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Producing concentrated cell sap helps desert plants maintain water uptake and reduce water stress.",

      steps: [
        "Desert plants experience very low water availability.",
        "Their cells must maintain a sufficiently low water potential to absorb available water.",
        "Accumulation of solutes makes the cell sap more concentrated.",
        "This helps cells retain and absorb water.",
        "Therefore, production of concentrated cell sap is an important physiological adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-003",

    question:
      "A plant growing in a saline environment may accumulate compatible solutes in its cells mainly to",

    options: [
      {
        id: "A",
        text: "increase its rate of reproduction",
      },
      {
        id: "B",
        text: "maintain water uptake despite the high external salt concentration",
      },
      {
        id: "C",
        text: "prevent photosynthesis",
      },
      {
        id: "D",
        text: "increase leaf temperature",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Compatible solutes help salt-tolerant plants maintain water balance when external salt concentrations are high.",

      steps: [
        "High salt concentration in the soil lowers the water potential of the soil solution.",
        "This makes water uptake by plant roots more difficult.",
        "Accumulating compatible solutes lowers the water potential inside plant cells.",
        "This helps the plant continue taking up water.",
        "Therefore, the correct answer is maintaining water uptake despite high external salt concentration.",
      ],
    },
  },

  {
    id: "biology-evolution-004",

    question:
      "Which physiological response is most likely to occur in a plant experiencing severe water shortage?",

    options: [
      {
        id: "A",
        text: "Increased transpiration",
      },
      {
        id: "B",
        text: "Stomatal closure",
      },
      {
        id: "C",
        text: "Increased leaf expansion",
      },
      {
        id: "D",
        text: "Increased water loss",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Stomatal closure is an important physiological response that limits water loss during drought.",

      steps: [
        "Water shortage creates a risk of excessive dehydration.",
        "Plants can respond by reducing the opening of stomata.",
        "Reduced stomatal opening decreases diffusion of water vapour from the leaf.",
        "This lowers transpiration and helps conserve water.",
        "Therefore, stomatal closure is the correct answer.",
      ],
    },
  },

  {
    id: "biology-evolution-005",

    question:
      "Which plant hormone is strongly associated with stomatal closure during water stress?",

    options: [
      {
        id: "A",
        text: "Auxin",
      },
      {
        id: "B",
        text: "Gibberellin",
      },
      {
        id: "C",
        text: "Abscisic acid",
      },
      {
        id: "D",
        text: "Cytokinin",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Abscisic acid plays an important role in the plant response to drought by promoting stomatal closure.",

      steps: [
        "Water stress causes changes in hormone production and transport.",
        "Abscisic acid accumulates in leaves during drought.",
        "It promotes changes in guard cells that cause stomata to close.",
        "This reduces water loss through transpiration.",
        "Therefore, the correct answer is abscisic acid.",
      ],
    },
  },

  {
    id: "biology-evolution-006",

    question:
      "Why do some plants living in saline habitats actively remove sodium ions from their cytoplasm?",

    options: [
      {
        id: "A",
        text: "To prevent toxic effects on cellular processes",
      },
      {
        id: "B",
        text: "To stop all respiration",
      },
      {
        id: "C",
        text: "To prevent water absorption",
      },
      {
        id: "D",
        text: "To increase salt toxicity",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Excessive sodium ions can interfere with enzymes and other cellular processes.",

      steps: [
        "Saline environments contain high concentrations of dissolved salts.",
        "Excess sodium can enter plant cells.",
        "High intracellular sodium concentrations can damage enzymes and membranes.",
        "Salt-tolerant plants may exclude or compartmentalize sodium ions.",
        "Therefore, removing sodium from the cytoplasm helps prevent toxic effects on cellular processes.",
      ],
    },
  },

  {
    id: "biology-evolution-007",

    question:
      "A plant closes its stomata when water availability becomes very low. What is the immediate advantage?",

    options: [
      {
        id: "A",
        text: "Reduced water loss",
      },
      {
        id: "B",
        text: "Increased carbon dioxide absorption",
      },
      {
        id: "C",
        text: "Increased transpiration",
      },
      {
        id: "D",
        text: "Increased leaf temperature regulation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Closing stomata immediately reduces the pathway through which most leaf water vapour escapes.",

      steps: [
        "Water evaporates from moist internal leaf surfaces.",
        "Water vapour normally diffuses out through stomata.",
        "When stomata close, diffusion of water vapour is reduced.",
        "This lowers transpiration and conserves water.",
        "Therefore, the immediate advantage is reduced water loss.",
      ],
    },
  },

  {
    id: "biology-evolution-008",

    question:
      "Which physiological adaptation would be most useful to a plant growing in a region with frequent freezing temperatures?",

    options: [
      {
        id: "A",
        text: "Production of substances that lower the freezing point of cell contents",
      },
      {
        id: "B",
        text: "Continuous opening of stomata",
      },
      {
        id: "C",
        text: "Reduction of all soluble substances in cells",
      },
      {
        id: "D",
        text: "Increased loss of cell water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Some plants tolerate freezing conditions by accumulating solutes and other protective substances that reduce cellular damage.",

      steps: [
        "Freezing temperatures can cause water in or around cells to freeze.",
        "Ice formation can damage cell membranes and cellular structures.",
        "Accumulation of certain solutes can lower the freezing point of cell fluids.",
        "Protective substances can also reduce damage caused by freezing and dehydration.",
        "Therefore, production of substances that lower the freezing point of cell contents is the best answer.",
      ],
    },
  },

  {
    id: "biology-evolution-009",

    question:
      "Which physiological adaptation allows some plants to survive periods when their leaves lose much of their water?",

    options: [
      {
        id: "A",
        text: "Ability to tolerate cellular dehydration",
      },
      {
        id: "B",
        text: "Permanent opening of stomata",
      },
      {
        id: "C",
        text: "Complete absence of cell membranes",
      },
      {
        id: "D",
        text: "Inability to regulate water balance",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Some drought-tolerant plants have physiological mechanisms that allow their cells to remain functional during dehydration.",

      steps: [
        "Drought reduces the amount of water available to plant tissues.",
        "Loss of cellular water can disrupt membranes, proteins and metabolic reactions.",
        "Some plants produce protective compounds that stabilize cellular structures.",
        "These mechanisms allow cells to tolerate a greater degree of dehydration.",
        "Therefore, tolerance of cellular dehydration is the correct answer.",
      ],
    },
  },

  {
    id: "biology-evolution-010",

    question:
      "A plant living in a waterlogged habitat may develop physiological mechanisms that help its cells obtain energy when oxygen is scarce. Which process is most likely involved?",

    options: [
      {
        id: "A",
        text: "Anaerobic respiration",
      },
      {
        id: "B",
        text: "Increased aerobic respiration",
      },
      {
        id: "C",
        text: "Complete cessation of respiration",
      },
      {
        id: "D",
        text: "Photosynthesis without chlorophyll",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Waterlogged soils often contain little oxygen, so plant tissues may rely temporarily on anaerobic pathways to release energy.",

      steps: [
        "Waterlogging fills air spaces in the soil with water.",
        "Oxygen diffusion through water is much slower than through air.",
        "Root tissues may therefore experience oxygen deficiency.",
        "Anaerobic respiration can produce some ATP when oxygen is unavailable.",
        "Therefore, anaerobic respiration is the most appropriate answer.",
      ],
    },
  },

  {
    id: "biology-evolution-011",

    question:
      "Which physiological adaptation enables some plants to survive prolonged periods of low light intensity?",

    options: [
      {
        id: "A",
        text: "Efficient use of available light energy",
      },
      {
        id: "B",
        text: "Complete absence of chlorophyll",
      },
      {
        id: "C",
        text: "Permanent closure of all stomata",
      },
      {
        id: "D",
        text: "Inability to absorb carbon dioxide",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Plants in low-light environments can possess physiological mechanisms that improve the efficiency of light capture and photosynthesis.",

      steps: [
        "Photosynthesis requires light energy.",
        "Low-light environments provide less energy for photosynthesis.",
        "Plants adapted to such conditions can make efficient use of the available light.",
        "This allows photosynthesis to continue at relatively low light intensities.",
        "Therefore, efficient use of available light energy is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-012",

    question:
      "Which physiological response helps a plant reduce damage caused by excessive sunlight?",

    options: [
      {
        id: "A",
        text: "Production of protective pigments and antioxidants",
      },
      {
        id: "B",
        text: "Permanent increase in water loss",
      },
      {
        id: "C",
        text: "Complete loss of chlorophyll",
      },
      {
        id: "D",
        text: "Permanent opening of stomata",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Protective pigments and antioxidant systems help plants deal with excess light and the reactive molecules it can generate.",

      steps: [
        "Excessive light can cause oxidative stress in plant cells.",
        "Reactive oxygen species may damage cellular components.",
        "Plants produce antioxidant compounds and protective pigments.",
        "These substances help limit damage caused by excess radiation.",
        "Therefore, production of protective pigments and antioxidants is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-013",

    question:
      "Why may a plant reduce its metabolic activity during severe drought?",

    options: [
      {
        id: "A",
        text: "To conserve limited water and energy resources",
      },
      {
        id: "B",
        text: "To increase transpiration",
      },
      {
        id: "C",
        text: "To increase water loss",
      },
      {
        id: "D",
        text: "To prevent all cellular reactions permanently",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Reducing metabolic activity can help a plant conserve resources during severe environmental stress.",

      steps: [
        "Drought reduces the amount of water available to plant tissues.",
        "Water is required for many physiological processes.",
        "A plant may reduce growth and some metabolic activities during severe stress.",
        "This reduces demand for scarce resources.",
        "Therefore, conserving limited water and energy resources is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-014",

    question:
      "Which physiological adaptation can help a plant maintain photosynthesis when carbon dioxide availability is limited by stomatal closure?",

    options: [
      {
        id: "A",
        text: "More efficient carbon dioxide fixation",
      },
      {
        id: "B",
        text: "Complete loss of photosynthetic pigments",
      },
      {
        id: "C",
        text: "Permanent inhibition of enzymes",
      },
      {
        id: "D",
        text: "Increased water loss",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Some plants have physiological mechanisms that improve carbon fixation efficiency under stressful conditions.",

      steps: [
        "Stomatal closure reduces water loss during drought.",
        "However, it also restricts carbon dioxide entry into the leaf.",
        "Plants adapted to dry conditions may possess mechanisms that use available carbon dioxide efficiently.",
        "Greater fixation efficiency helps maintain carbon assimilation.",
        "Therefore, more efficient carbon dioxide fixation is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-015",

    question:
      "What is the main physiological advantage of dormancy in some plants during unfavorable seasons?",

    options: [
      {
        id: "A",
        text: "It reduces metabolic activity until conditions improve",
      },
      {
        id: "B",
        text: "It increases water loss",
      },
      {
        id: "C",
        text: "It prevents the plant from responding to its environment",
      },
      {
        id: "D",
        text: "It permanently stops reproduction",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Dormancy allows plants to survive unfavorable environmental conditions by reducing metabolic activity.",

      steps: [
        "Some seasons have unsuitable temperatures or limited water availability.",
        "Active growth during these periods may require resources that are unavailable.",
        "Dormancy reduces metabolic activity and growth.",
        "The plant can resume active growth when favorable conditions return.",
        "Therefore, reduced metabolic activity until conditions improve is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-016",

    question:
      "Which physiological adaptation is particularly useful for plants exposed to high concentrations of toxic metals in the soil?",

    options: [
      {
        id: "A",
        text: "Sequestration of toxic ions in less sensitive cellular compartments",
      },
      {
        id: "B",
        text: "Increasing the concentration of toxic ions in the cytoplasm",
      },
      {
        id: "C",
        text: "Eliminating all cell membranes",
      },
      {
        id: "D",
        text: "Stopping water absorption completely",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Plants exposed to toxic metals can reduce their harmful effects by binding or storing the ions in compartments where they cause less damage.",

      steps: [
        "Heavy metals can interfere with enzymes and cellular structures.",
        "High concentrations in the cytoplasm may be toxic.",
        "Some plants bind or transport toxic ions into vacuoles or other compartments.",
        "This reduces their interaction with sensitive cellular components.",
        "Therefore, sequestration in less sensitive cellular compartments is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-017",

    question:
      "Which physiological adaptation helps some plants tolerate high temperatures?",

    options: [
      {
        id: "A",
        text: "Production of heat-shock proteins",
      },
      {
        id: "B",
        text: "Complete breakdown of all enzymes",
      },
      {
        id: "C",
        text: "Permanent inhibition of protein synthesis",
      },
      {
        id: "D",
        text: "Increased cellular damage",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Heat-shock proteins help protect and stabilize proteins when cells are exposed to high temperatures.",

      steps: [
        "High temperatures can cause proteins to lose their normal structure.",
        "Misfolded proteins can interfere with cellular processes.",
        "Plants can produce heat-shock proteins in response to heat stress.",
        "These proteins help protect and refold damaged proteins.",
        "Therefore, production of heat-shock proteins is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-018",

    question:
      "A plant exposed to prolonged drought produces osmoprotective substances. What is the primary function of these substances?",

    options: [
      {
        id: "A",
        text: "To help maintain cellular water balance",
      },
      {
        id: "B",
        text: "To stop all enzyme activity",
      },
      {
        id: "C",
        text: "To increase evaporation from leaves",
      },
      {
        id: "D",
        text: "To prevent root growth permanently",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Osmoprotective substances help cells maintain water balance and protect cellular structures during dehydration.",

      steps: [
        "Drought lowers the availability of water to plant cells.",
        "Cells can lose water and become dehydrated.",
        "Plants may accumulate compatible solutes such as certain sugars and amino-acid derivatives.",
        "These substances help maintain osmotic balance and protect cell structures.",
        "Therefore, maintaining cellular water balance is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-019",

    question:
      "Which physiological response would best help a plant survive temporary flooding?",

    options: [
      {
        id: "A",
        text: "Switching partly to anaerobic metabolism when oxygen is limited",
      },
      {
        id: "B",
        text: "Increasing dependence on unlimited oxygen",
      },
      {
        id: "C",
        text: "Stopping all ATP production",
      },
      {
        id: "D",
        text: "Increasing oxygen consumption without limit",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Temporary flooding can restrict oxygen supply to plant tissues, making anaerobic metabolism useful for short-term survival.",

      steps: [
        "Floodwater can prevent normal diffusion of oxygen to roots.",
        "Cells still require ATP for essential processes.",
        "Anaerobic pathways can generate some ATP without oxygen.",
        "Although less efficient than aerobic respiration, this can support short-term survival.",
        "Therefore, switching partly to anaerobic metabolism is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-020",

    question:
      "Which combination best represents physiological adaptations that can help a plant survive drought?",

    options: [
      {
        id: "A",
        text: "Stomatal closure and osmotic adjustment",
      },
      {
        id: "B",
        text: "Permanent stomatal opening and increased transpiration",
      },
      {
        id: "C",
        text: "Reduced water retention and increased evaporation",
      },
      {
        id: "D",
        text: "Complete inhibition of root absorption",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Drought-tolerant plants combine several physiological mechanisms to reduce water loss and maintain cellular water balance.",

      steps: [
        "Stomatal closure reduces water loss through transpiration.",
        "Osmotic adjustment helps cells retain or absorb water.",
        "Together, these mechanisms improve survival during water shortage.",
        "The other options would generally increase water stress.",
        "Therefore, stomatal closure and osmotic adjustment are correct.",
      ],
    },
  },

  // ============================================================
  // A02.5 Physiological Adaptations in Animals — 25
  // biology-evolution-021 → biology-evolution-045
  // ============================================================

  {
    id: "biology-evolution-021",

    question:
      "Which physiological adaptation enables a mammal living in a hot environment to reduce excessive body temperature?",

    options: [
      {
        id: "A",
        text: "Sweating",
      },
      {
        id: "B",
        text: "Shivering",
      },
      {
        id: "C",
        text: "Vasoconstriction of skin blood vessels",
      },
      {
        id: "D",
        text: "Reduction of heat loss",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Sweating allows evaporative cooling from the body surface.",

      steps: [
        "Sweat is released onto the surface of the skin.",
        "When sweat evaporates, it requires energy.",
        "This energy is taken from the body as heat.",
        "Evaporation therefore lowers body temperature.",
        "Therefore, sweating is the correct answer.",
      ],
    },
  },

  {
    id: "biology-evolution-022",

    question:
      "Which physiological adaptation helps a mammal conserve heat in a cold environment?",

    options: [
      {
        id: "A",
        text: "Vasoconstriction of skin blood vessels",
      },
      {
        id: "B",
        text: "Increased sweating",
      },
      {
        id: "C",
        text: "Vasodilation of skin blood vessels",
      },
      {
        id: "D",
        text: "Increased evaporation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Vasoconstriction reduces blood flow near the skin surface and therefore reduces heat loss.",

      steps: [
        "Blood carries heat from the core of the body to the skin.",
        "In cold conditions, skin blood vessels constrict.",
        "Less warm blood reaches the surface.",
        "This reduces heat loss to the environment.",
        "Therefore, vasoconstriction is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-023",

    question:
      "Why do some desert mammals produce highly concentrated urine?",

    options: [
      {
        id: "A",
        text: "To conserve water",
      },
      {
        id: "B",
        text: "To increase water loss",
      },
      {
        id: "C",
        text: "To prevent nitrogenous waste formation",
      },
      {
        id: "D",
        text: "To stop kidney filtration",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Concentrated urine allows desert mammals to eliminate nitrogenous waste while losing relatively little water.",

      steps: [
        "Water is scarce in desert environments.",
        "Nitrogenous waste must still be removed from the body.",
        "The kidneys can reabsorb a large proportion of filtered water.",
        "This results in urine with a high concentration of dissolved waste.",
        "Therefore, the adaptation conserves water.",
      ],
    },
  },

  {
    id: "biology-evolution-024",

    question:
      "Which physiological adaptation is particularly important for mammals living in very cold environments?",

    options: [
      {
        id: "A",
        text: "Increased metabolic heat production",
      },
      {
        id: "B",
        text: "Increased sweating",
      },
      {
        id: "C",
        text: "Reduced respiration to zero",
      },
      {
        id: "D",
        text: "Permanent vasodilation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Increasing metabolic activity can generate additional heat in response to cold conditions.",

      steps: [
        "Cold environments increase the rate at which body heat is lost.",
        "Mammals can respond by increasing heat production.",
        "Metabolic reactions release energy, some of which appears as heat.",
        "This helps maintain body temperature.",
        "Therefore, increased metabolic heat production is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-025",

    question:
      "Shivering helps a mammal maintain body temperature because it",

    options: [
      {
        id: "A",
        text: "increases muscular activity and heat production",
      },
      {
        id: "B",
        text: "increases sweating",
      },
      {
        id: "C",
        text: "reduces respiration",
      },
      {
        id: "D",
        text: "increases heat loss",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Shivering consists of rapid involuntary muscle contractions that generate heat.",

      steps: [
        "Muscle contraction requires energy.",
        "Some of the energy released during metabolism appears as heat.",
        "Rapid involuntary contractions during shivering increase heat production.",
        "This helps raise or maintain body temperature.",
        "Therefore, increased muscular activity and heat production is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-026",

    question:
      "Which physiological adaptation allows camels to tolerate substantial changes in body water status?",

    options: [
      {
        id: "A",
        text: "Ability to tolerate dehydration and conserve water",
      },
      {
        id: "B",
        text: "Continuous production of dilute urine",
      },
      {
        id: "C",
        text: "Continuous sweating",
      },
      {
        id: "D",
        text: "Inability to regulate body temperature",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Camels possess several physiological mechanisms that allow them to conserve water and tolerate dehydration.",

      steps: [
        "Desert environments may provide little available water.",
        "Camels can conserve water through efficient kidney function and other physiological mechanisms.",
        "They can tolerate greater changes in body water than many mammals.",
        "These adaptations improve survival during periods of water scarcity.",
        "Therefore, the ability to tolerate dehydration and conserve water is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-027",

    question:
      "Why is the ability to produce concentrated urine advantageous to desert mammals?",

    options: [
      {
        id: "A",
        text: "It reduces the volume of water lost in urine",
      },
      {
        id: "B",
        text: "It prevents excretion of waste",
      },
      {
        id: "C",
        text: "It increases sweating",
      },
      {
        id: "D",
        text: "It stops filtration in the kidneys",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Concentrated urine contains more dissolved waste per unit volume, allowing the animal to excrete waste while losing less water.",

      steps: [
        "The kidneys filter substances from the blood.",
        "Useful water can be reabsorbed from the filtrate.",
        "Greater water reabsorption produces a smaller volume of concentrated urine.",
        "This reduces urinary water loss.",
        "Therefore, it is advantageous because it reduces the volume of water lost in urine.",
      ],
    },
  },

  {
    id: "biology-evolution-028",

    question:
      "Which physiological adaptation helps marine bony fish maintain their internal water balance?",

    options: [
      {
        id: "A",
        text: "Regulation of salt and water uptake through the gills and kidneys",
      },
      {
        id: "B",
        text: "Complete inability to regulate ions",
      },
      {
        id: "C",
        text: "Permanent loss of body salts",
      },
      {
        id: "D",
        text: "Prevention of all water movement",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Marine fish must regulate water and ion movement because seawater is highly concentrated compared with their body fluids.",

      steps: [
        "Marine bony fish tend to lose water to the surrounding seawater by osmosis.",
        "They drink seawater to replace lost water.",
        "Excess salts are removed through the gills and kidneys.",
        "These processes maintain internal osmotic balance.",
        "Therefore, regulation through the gills and kidneys is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-029",

    question:
      "Freshwater fish generally produce large quantities of dilute urine because they",

    options: [
      {
        id: "A",
        text: "gain water by osmosis from their surroundings",
      },
      {
        id: "B",
        text: "constantly lose water to the surroundings",
      },
      {
        id: "C",
        text: "cannot absorb water",
      },
      {
        id: "D",
        text: "live in seawater",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Freshwater is less concentrated than the body fluids of freshwater fish, causing water to enter their bodies by osmosis.",

      steps: [
        "Freshwater has a lower solute concentration than the body fluids of the fish.",
        "Water therefore enters the fish by osmosis.",
        "The fish must remove excess water.",
        "Its kidneys produce large quantities of dilute urine.",
        "Therefore, the correct answer is that freshwater fish gain water by osmosis.",
      ],
    },
  },

  {
    id: "biology-evolution-030",

    question:
      "Which physiological mechanism helps mammals maintain a relatively constant internal temperature?",

    options: [
      {
        id: "A",
        text: "Homeostatic thermoregulation",
      },
      {
        id: "B",
        text: "Permanent dependence on environmental temperature",
      },
      {
        id: "C",
        text: "Complete absence of feedback mechanisms",
      },
      {
        id: "D",
        text: "Permanent increase in body temperature",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Mammals regulate body temperature through coordinated physiological mechanisms.",

      steps: [
        "External temperatures can vary considerably.",
        "Enzymes and metabolic reactions require suitable temperature ranges.",
        "Thermoregulatory mechanisms detect changes in body temperature.",
        "Responses such as sweating, shivering and changes in blood flow help restore temperature.",
        "Therefore, homeostatic thermoregulation is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-031",

    question:
      "What happens to skin blood vessels when a mammal becomes overheated?",

    options: [
      {
        id: "A",
        text: "They undergo vasodilation",
      },
      {
        id: "B",
        text: "They undergo vasoconstriction",
      },
      {
        id: "C",
        text: "They permanently close",
      },
      {
        id: "D",
        text: "They stop carrying blood",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Vasodilation increases blood flow near the skin surface and promotes heat loss.",

      steps: [
        "An increase in body temperature must be corrected.",
        "Skin blood vessels can widen during overheating.",
        "More warm blood reaches the body surface.",
        "Heat can then be transferred from the blood to the environment.",
        "Therefore, vasodilation is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-032",

    question:
      "Which physiological response helps an animal reduce heat loss during cold conditions?",

    options: [
      {
        id: "A",
        text: "Vasoconstriction",
      },
      {
        id: "B",
        text: "Sweating",
      },
      {
        id: "C",
        text: "Vasodilation",
      },
      {
        id: "D",
        text: "Increased evaporation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Vasoconstriction reduces blood flow close to the body surface and therefore reduces heat loss.",

      steps: [
        "Blood transports heat from internal tissues to the skin.",
        "In cold conditions, skin blood vessels constrict.",
        "Less warm blood flows through superficial vessels.",
        "Less heat is transferred from the body to the surroundings.",
        "Therefore, vasoconstriction is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-033",

    question:
      "Which physiological adaptation helps an animal survive at high altitude where oxygen availability is low?",

    options: [
      {
        id: "A",
        text: "Increased red blood cell concentration",
      },
      {
        id: "B",
        text: "Reduced oxygen-carrying capacity",
      },
      {
        id: "C",
        text: "Complete reduction of ventilation",
      },
      {
        id: "D",
        text: "Reduced haemoglobin production",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Increasing the number of red blood cells can improve the blood's capacity to transport oxygen.",

      steps: [
        "At high altitude, atmospheric oxygen pressure is lower.",
        "Less oxygen may enter the bloodstream during gas exchange.",
        "An increased red blood cell concentration provides more haemoglobin molecules.",
        "More haemoglobin can increase the oxygen-carrying capacity of the blood.",
        "Therefore, increased red blood cell concentration is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-034",

    question:
      "An animal living in an environment with low oxygen concentration may increase its breathing rate primarily to",

    options: [
      {
        id: "A",
        text: "increase oxygen uptake",
      },
      {
        id: "B",
        text: "reduce oxygen availability",
      },
      {
        id: "C",
        text: "stop gas exchange",
      },
      {
        id: "D",
        text: "increase nitrogen excretion",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Increasing ventilation can increase the amount of air reaching respiratory surfaces per unit time.",

      steps: [
        "Cells require oxygen for aerobic respiration.",
        "Low environmental oxygen reduces the amount available for uptake.",
        "Increasing breathing rate can increase ventilation.",
        "More fresh air reaches respiratory surfaces.",
        "Therefore, the main advantage is increased oxygen uptake.",
      ],
    },
  },

  {
    id: "biology-evolution-035",

    question:
      "Which physiological adaptation helps a mammal survive periods of food scarcity?",

    options: [
      {
        id: "A",
        text: "Mobilization of stored fat reserves",
      },
      {
        id: "B",
        text: "Permanent increase in energy expenditure",
      },
      {
        id: "C",
        text: "Complete cessation of metabolism",
      },
      {
        id: "D",
        text: "Inability to use stored nutrients",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Stored fat provides an energy reserve that can be mobilized when food intake is limited.",

      steps: [
        "Animals store energy in forms such as glycogen and fat.",
        "During food shortage, the body can mobilize stored reserves.",
        "Fat can be broken down and used to release energy.",
        "This supplies energy when external food is unavailable.",
        "Therefore, mobilization of stored fat reserves is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-036",

    question:
      "Why can some desert mammals become more active during cooler periods of the day?",

    options: [
      {
        id: "A",
        text: "To reduce heat stress and water loss",
      },
      {
        id: "B",
        text: "To increase exposure to extreme heat",
      },
      {
        id: "C",
        text: "To increase unnecessary water loss",
      },
      {
        id: "D",
        text: "To prevent feeding",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Although activity timing is behavioural, it is closely linked to physiological water and temperature regulation.",

      steps: [
        "Desert temperatures can become extremely high during the day.",
        "High temperatures increase the risk of overheating and dehydration.",
        "Activity during cooler periods reduces thermal stress.",
        "Lower temperatures can also reduce evaporative water loss.",
        "Therefore, reducing heat stress and water loss is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-037",

    question:
      "Which physiological adaptation helps an animal tolerate a temporary shortage of oxygen during diving?",

    options: [
      {
        id: "A",
        text: "Greater ability to use stored oxygen",
      },
      {
        id: "B",
        text: "Complete inability to store oxygen",
      },
      {
        id: "C",
        text: "Permanent reduction in haemoglobin",
      },
      {
        id: "D",
        text: "Immediate cessation of cellular metabolism",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Diving animals can increase their oxygen reserves in blood and muscles, allowing them to remain underwater longer.",

      steps: [
        "Underwater, access to atmospheric oxygen is temporarily restricted.",
        "Stored oxygen becomes important for aerobic respiration.",
        "Haemoglobin in blood and myoglobin in muscles can bind oxygen.",
        "Greater oxygen stores extend the period during which tissues can receive oxygen.",
        "Therefore, greater ability to use stored oxygen is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-038",

    question:
      "Which physiological response would help an animal reduce water loss during extreme heat?",

    options: [
      {
        id: "A",
        text: "Reduction in urine volume",
      },
      {
        id: "B",
        text: "Production of very dilute urine",
      },
      {
        id: "C",
        text: "Increased sweating without water replacement",
      },
      {
        id: "D",
        text: "Increased respiratory water loss",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Reducing urine volume is an important water-conservation mechanism in many animals living in dry environments.",

      steps: [
        "Water is essential for maintaining body fluid balance.",
        "Extreme heat can increase water loss through evaporation.",
        "The kidneys can increase water reabsorption.",
        "This reduces the amount of water lost in urine.",
        "Therefore, reduction in urine volume is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-039",

    question:
      "Which physiological adaptation allows some animals to survive without drinking water for long periods?",

    options: [
      {
        id: "A",
        text: "Efficient conservation and metabolic production of water",
      },
      {
        id: "B",
        text: "Continuous production of dilute urine",
      },
      {
        id: "C",
        text: "Permanent increase in sweating",
      },
      {
        id: "D",
        text: "Complete inability to use stored nutrients",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Some animals conserve available water very efficiently and can obtain metabolic water from the oxidation of food reserves.",

      steps: [
        "Water availability may be extremely low in arid environments.",
        "Animals can reduce unnecessary water loss through their kidneys and respiratory surfaces.",
        "Oxidation of nutrients also produces metabolic water.",
        "These mechanisms together help animals survive periods without drinking.",
        "Therefore, efficient conservation and metabolic production of water is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-040",

    question:
      "What is the physiological advantage of producing uric acid as the main nitrogenous waste in birds?",

    options: [
      {
        id: "A",
        text: "It requires relatively little water for excretion",
      },
      {
        id: "B",
        text: "It requires large quantities of water",
      },
      {
        id: "C",
        text: "It prevents nitrogen excretion",
      },
      {
        id: "D",
        text: "It increases dehydration",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Uric acid is relatively insoluble and can be excreted with little water, helping birds conserve water.",

      steps: [
        "Nitrogenous waste must be removed from the body.",
        "Ammonia is highly toxic and requires considerable water for safe excretion.",
        "Uric acid is less toxic and can be eliminated as a relatively insoluble paste.",
        "This greatly reduces water loss.",
        "Therefore, requiring relatively little water for excretion is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-041",

    question:
      "Which physiological adaptation is useful to an animal exposed to prolonged cold conditions?",

    options: [
      {
        id: "A",
        text: "Increased production of metabolic heat",
      },
      {
        id: "B",
        text: "Increased sweating",
      },
      {
        id: "C",
        text: "Increased evaporative cooling",
      },
      {
        id: "D",
        text: "Permanent reduction in metabolic activity",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Increasing metabolic heat production helps compensate for heat lost to cold surroundings.",

      steps: [
        "Cold conditions increase the rate of heat loss.",
        "Animals must produce additional heat to maintain body temperature.",
        "Metabolic reactions release energy, including heat.",
        "Increasing metabolic heat production helps maintain temperature.",
        "Therefore, increased production of metabolic heat is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-042",

    question:
      "Which physiological change can help an animal prevent overheating after intense exercise?",

    options: [
      {
        id: "A",
        text: "Increased heat loss through evaporation and skin blood flow",
      },
      {
        id: "B",
        text: "Complete reduction of skin blood flow",
      },
      {
        id: "C",
        text: "Increased heat production without cooling",
      },
      {
        id: "D",
        text: "Permanent vasoconstriction",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Exercise increases metabolic heat production, so increased heat loss is necessary to prevent excessive temperature rise.",

      steps: [
        "Muscle activity increases respiration and heat production.",
        "Body temperature may therefore rise during intense exercise.",
        "Increased blood flow to the skin transfers heat toward the surface.",
        "Sweating and evaporation can remove additional heat.",
        "Therefore, increased heat loss through evaporation and skin blood flow is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-043",

    question:
      "Why is haemoglobin concentration often important in animals adapted to high-altitude environments?",

    options: [
      {
        id: "A",
        text: "It influences the oxygen-carrying capacity of the blood",
      },
      {
        id: "B",
        text: "It prevents oxygen from entering the blood",
      },
      {
        id: "C",
        text: "It eliminates the need for respiration",
      },
      {
        id: "D",
        text: "It increases nitrogen excretion",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Haemoglobin binds oxygen and therefore plays a central role in transporting oxygen in the blood.",

      steps: [
        "High altitude has lower oxygen availability.",
        "Efficient oxygen transport becomes especially important.",
        "Haemoglobin molecules bind oxygen in red blood cells.",
        "A greater haemoglobin concentration can increase the oxygen-carrying capacity of blood.",
        "Therefore, the correct answer is that it influences oxygen-carrying capacity.",
      ],
    },
  },

  {
    id: "biology-evolution-044",

    question:
      "Which physiological adaptation allows some animals to survive temporary periods of very low metabolic demand?",

    options: [
      {
        id: "A",
        text: "Metabolic depression",
      },
      {
        id: "B",
        text: "Permanent increase in respiration",
      },
      {
        id: "C",
        text: "Continuous increase in body temperature",
      },
      {
        id: "D",
        text: "Permanent increase in energy expenditure",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Metabolic depression reduces energy requirements when environmental conditions make normal activity difficult.",

      steps: [
        "Some animals experience periods of food scarcity or unfavorable conditions.",
        "Maintaining a high metabolic rate requires considerable energy.",
        "Metabolic depression lowers energy expenditure.",
        "Stored energy can therefore be used more slowly.",
        "Therefore, metabolic depression is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-045",

    question:
      "Which combination represents physiological adaptations that can improve survival in a hot, dry environment?",

    options: [
      {
        id: "A",
        text: "Concentrated urine and efficient thermoregulation",
      },
      {
        id: "B",
        text: "Dilute urine and continuous sweating",
      },
      {
        id: "C",
        text: "Increased water loss and reduced water conservation",
      },
      {
        id: "D",
        text: "Reduced kidney reabsorption and increased dehydration",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Animals in hot, dry environments must both conserve water and control body temperature.",

      steps: [
        "Water is scarce in hot, dry habitats.",
        "Producing concentrated urine reduces urinary water loss.",
        "Thermoregulatory mechanisms help prevent overheating.",
        "Together, these adaptations improve survival under desert conditions.",
        "Therefore, concentrated urine and efficient thermoregulation are correct.",
      ],
    },
  },

  // ============================================================
  // A02.6 Behavioural Adaptations — 25
  // biology-evolution-046 → biology-evolution-070
  // ============================================================

  {
    id: "biology-evolution-046",

    question:
      "Which of the following is an example of a behavioural adaptation?",

    options: [
      {
        id: "A",
        text: "A bird migrating to warmer regions during winter",
      },
      {
        id: "B",
        text: "A thick layer of fur",
      },
      {
        id: "C",
        text: "A streamlined body",
      },
      {
        id: "D",
        text: "A long root system",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Migration is a behaviour that can help animals survive unfavorable environmental conditions.",

      steps: [
        "Behavioural adaptations involve actions or patterns of activity.",
        "Migration involves an animal moving from one region to another.",
        "Birds may migrate to areas with more favorable temperatures or food availability.",
        "The other options are structural features.",
        "Therefore, bird migration is the correct answer.",
      ],
    },
  },

  {
    id: "biology-evolution-047",

    question:
      "Why do some desert animals become active mainly at night?",

    options: [
      {
        id: "A",
        text: "To avoid extreme daytime temperatures",
      },
      {
        id: "B",
        text: "To increase exposure to heat",
      },
      {
        id: "C",
        text: "To increase daytime evaporation",
      },
      {
        id: "D",
        text: "To prevent all feeding",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Nocturnal activity allows desert animals to avoid the hottest part of the day.",

      steps: [
        "Desert temperatures may become extremely high during daylight.",
        "High temperatures increase the risk of overheating and dehydration.",
        "Animals active at night experience cooler conditions.",
        "This can reduce heat stress and water loss.",
        "Therefore, avoiding extreme daytime temperatures is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-048",

    question:
      "Which behaviour helps many birds survive seasonal shortages of food?",

    options: [
      {
        id: "A",
        text: "Migration",
      },
      {
        id: "B",
        text: "Remaining permanently in one location",
      },
      {
        id: "C",
        text: "Avoiding all feeding",
      },
      {
        id: "D",
        text: "Reducing movement regardless of conditions",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Migration allows birds to move to areas where food and environmental conditions are more favorable.",

      steps: [
        "Food availability can change with seasons.",
        "Some regions become unsuitable during particular seasons.",
        "Birds may move to locations with greater food availability.",
        "This improves their chances of survival and reproduction.",
        "Therefore, migration is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-049",

    question:
      "Which behaviour is most likely to reduce predation risk in a small prey animal?",

    options: [
      {
        id: "A",
        text: "Remaining hidden in a shelter during periods of high predator activity",
      },
      {
        id: "B",
        text: "Moving continuously in open areas",
      },
      {
        id: "C",
        text: "Making loud sounds whenever predators approach",
      },
      {
        id: "D",
        text: "Remaining exposed without protection",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Avoiding exposure when predators are active can reduce the likelihood of being detected and captured.",

      steps: [
        "Predators must detect prey before attempting to capture them.",
        "Remaining hidden reduces the chance of detection.",
        "Shelters provide protection from predators.",
        "Avoiding predators during their active periods increases survival.",
        "Therefore, remaining hidden during periods of high predator activity is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-050",

    question:
      "What is the main survival advantage of huddling together in groups during cold conditions?",

    options: [
      {
        id: "A",
        text: "Reduced heat loss",
      },
      {
        id: "B",
        text: "Increased exposure to cold air",
      },
      {
        id: "C",
        text: "Increased water loss",
      },
      {
        id: "D",
        text: "Reduced body temperature",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Huddling reduces the exposed surface area relative to the number of animals and can help conserve body heat.",

      steps: [
        "Animals lose heat to the environment through their body surfaces.",
        "Huddling brings animals close together.",
        "The amount of exposed body surface is reduced.",
        "This can reduce heat loss and help maintain body temperature.",
        "Therefore, reduced heat loss is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-051",

    question:
      "Which behaviour is an example of territoriality?",

    options: [
      {
        id: "A",
        text: "An animal defending an area from members of the same species",
      },
      {
        id: "B",
        text: "A plant producing seeds",
      },
      {
        id: "C",
        text: "An animal changing its body colour",
      },
      {
        id: "D",
        text: "A fish developing scales",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Territorial behaviour involves defending an area containing resources from competitors.",

      steps: [
        "Animals may require food, shelter or breeding sites.",
        "These resources can be limited.",
        "An animal may defend a particular area against other individuals.",
        "This behaviour is called territoriality.",
        "Therefore, defending an area from members of the same species is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-052",

    question:
      "Why do some animals form large groups when predators are common?",

    options: [
      {
        id: "A",
        text: "Grouping can improve detection of predators and reduce individual risk",
      },
      {
        id: "B",
        text: "Grouping guarantees that no animal will be attacked",
      },
      {
        id: "C",
        text: "Grouping eliminates competition completely",
      },
      {
        id: "D",
        text: "Grouping prevents all movement",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Living in groups can provide several anti-predator benefits, including increased vigilance.",

      steps: [
        "A predator approaching a group may be detected by one or more individuals.",
        "More individuals can spend time watching for danger.",
        "Early detection gives members more opportunity to escape.",
        "Predation risk may also be distributed among group members.",
        "Therefore, improved predator detection and reduced individual risk are correct.",
      ],
    },
  },

  {
    id: "biology-evolution-053",

    question:
      "Which behavioural adaptation helps some animals survive periods of extreme winter cold?",

    options: [
      {
        id: "A",
        text: "Hibernation",
      },
      {
        id: "B",
        text: "Increased exposure to cold",
      },
      {
        id: "C",
        text: "Continuous high activity",
      },
      {
        id: "D",
        text: "Permanent migration to unsuitable habitats",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Hibernation involves a prolonged period of reduced activity and metabolism that helps some animals survive harsh winter conditions.",

      steps: [
        "Winter may bring low temperatures and limited food.",
        "High metabolic activity would require substantial energy.",
        "During hibernation, metabolism and body activity are reduced.",
        "This allows stored energy reserves to last longer.",
        "Therefore, hibernation is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-054",

    question:
      "Which behaviour allows some animals to escape unfavorable seasonal conditions by moving to another habitat?",

    options: [
      {
        id: "A",
        text: "Migration",
      },
      {
        id: "B",
        text: "Camouflage",
      },
      {
        id: "C",
        text: "Territorial marking",
      },
      {
        id: "D",
        text: "Mimicry",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Migration is the seasonal movement of animals between habitats.",

      steps: [
        "Environmental conditions can vary greatly between seasons.",
        "Food, water and temperature may become unsuitable in one region.",
        "Animals may move to another region with better conditions.",
        "This seasonal movement is known as migration.",
        "Therefore, migration is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-055",

    question:
      "Which behaviour can help a predator conserve energy when prey is scarce?",

    options: [
      {
        id: "A",
        text: "Reducing unnecessary movement",
      },
      {
        id: "B",
        text: "Chasing every moving object",
      },
      {
        id: "C",
        text: "Increasing movement continuously",
      },
      {
        id: "D",
        text: "Ignoring all available shelter",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Reducing unnecessary activity can conserve energy when food is limited.",

      steps: [
        "Movement requires energy.",
        "When prey is scarce, excessive movement may waste energy.",
        "A predator may reduce unnecessary activity while waiting for suitable prey.",
        "This conserves energy reserves.",
        "Therefore, reducing unnecessary movement is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-056",

    question:
      "Why do some animals bask in sunlight during cool periods?",

    options: [
      {
        id: "A",
        text: "To increase body temperature",
      },
      {
        id: "B",
        text: "To increase water loss deliberately",
      },
      {
        id: "C",
        text: "To reduce access to heat",
      },
      {
        id: "D",
        text: "To prevent all metabolic activity",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Basking allows ectothermic animals to absorb environmental heat and raise their body temperature.",

      steps: [
        "Ectotherms rely heavily on environmental heat to regulate body temperature.",
        "Cool conditions can reduce their metabolic activity and movement.",
        "Basking exposes the body to sunlight.",
        "Absorbed heat raises body temperature.",
        "Therefore, increasing body temperature is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-057",

    question:
      "Which behaviour can help an animal avoid competition for food?",

    options: [
      {
        id: "A",
        text: "Feeding at a different time from competing species",
      },
      {
        id: "B",
        text: "Using exactly the same food source at the same time",
      },
      {
        id: "C",
        text: "Increasing competition deliberately",
      },
      {
        id: "D",
        text: "Avoiding all feeding",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Different feeding times can reduce direct competition for limited resources.",

      steps: [
        "Different species may require similar food resources.",
        "Resources may become limited when many individuals feed simultaneously.",
        "Feeding at different times can reduce direct overlap.",
        "This allows species to exploit resources with less competition.",
        "Therefore, feeding at a different time is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-058",

    question:
      "Which behaviour is likely to increase the survival of young animals?",

    options: [
      {
        id: "A",
        text: "Parental care",
      },
      {
        id: "B",
        text: "Abandonment immediately after birth in all species",
      },
      {
        id: "C",
        text: "Preventing young from feeding",
      },
      {
        id: "D",
        text: "Exposing young continuously to predators",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Parental care can provide young animals with food, protection and other resources needed for survival.",

      steps: [
        "Young animals are often less capable of finding food and avoiding predators.",
        "Parents may provide food and protection.",
        "Some parents also teach offspring important survival behaviours.",
        "These actions can increase offspring survival.",
        "Therefore, parental care is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-059",

    question:
      "Why do some animals store food before an unfavorable season?",

    options: [
      {
        id: "A",
        text: "To provide an energy source when food becomes scarce",
      },
      {
        id: "B",
        text: "To prevent themselves from feeding",
      },
      {
        id: "C",
        text: "To increase predator numbers",
      },
      {
        id: "D",
        text: "To reduce the amount of available food permanently",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Food storage provides a reserve that can be used when environmental conditions make food difficult to obtain.",

      steps: [
        "Some seasons have reduced food availability.",
        "Animals can collect and store food when it is abundant.",
        "The stored food can later be consumed during periods of scarcity.",
        "This improves survival when external food supplies are limited.",
        "Therefore, providing an energy source during scarcity is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-060",

    question:
      "Which behaviour helps a prey animal avoid being detected by a predator?",

    options: [
      {
        id: "A",
        text: "Remaining motionless when the predator is nearby",
      },
      {
        id: "B",
        text: "Making continuous loud noises",
      },
      {
        id: "C",
        text: "Moving into open areas deliberately",
      },
      {
        id: "D",
        text: "Calling predators toward its location",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Remaining motionless can make detection more difficult, particularly when combined with camouflage.",

      steps: [
        "Predators often use movement as one signal for detecting prey.",
        "A prey animal that remains still may be less noticeable.",
        "Reduced movement can therefore lower the probability of detection.",
        "This may increase the chance of escaping predation.",
        "Therefore, remaining motionless is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-061",

    question:
      "Which behaviour is associated with communication between members of the same species?",

    options: [
      {
        id: "A",
        text: "Courtship displays",
      },
      {
        id: "B",
        text: "Random movement without signals",
      },
      {
        id: "C",
        text: "Permanent isolation from all individuals",
      },
      {
        id: "D",
        text: "Avoidance of reproduction",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Courtship displays communicate information that can influence mate selection and reproduction.",

      steps: [
        "Successful reproduction often requires communication between potential mates.",
        "Animals may use visual, auditory, chemical or other signals.",
        "Courtship displays can communicate readiness or suitability for mating.",
        "This makes courtship an important behavioural adaptation.",
        "Therefore, courtship displays are correct.",
      ],
    },
  },

  {
    id: "biology-evolution-062",

    question:
      "Why might an animal change its feeding time during a season of high daytime temperature?",

    options: [
      {
        id: "A",
        text: "To feed during cooler periods and reduce heat stress",
      },
      {
        id: "B",
        text: "To increase exposure to heat",
      },
      {
        id: "C",
        text: "To prevent access to food",
      },
      {
        id: "D",
        text: "To increase dehydration",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Changing activity time can help an animal avoid unfavorable environmental conditions.",

      steps: [
        "High temperatures can increase the risk of overheating.",
        "Activity also increases metabolic heat production.",
        "Feeding during cooler periods reduces thermal stress.",
        "It can also reduce evaporative water loss.",
        "Therefore, feeding during cooler periods is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-063",

    question:
      "Which behaviour is likely to reduce the energy cost of surviving a harsh winter?",

    options: [
      {
        id: "A",
        text: "Entering a period of reduced activity",
      },
      {
        id: "B",
        text: "Increasing activity continuously",
      },
      {
        id: "C",
        text: "Searching constantly for scarce food",
      },
      {
        id: "D",
        text: "Increasing unnecessary movement",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Reducing activity lowers energy requirements during periods when food may be scarce.",

      steps: [
        "Winter may reduce food availability.",
        "High activity requires substantial energy.",
        "Some animals reduce their activity during harsh conditions.",
        "This allows stored energy reserves to last longer.",
        "Therefore, entering a period of reduced activity is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-064",

    question:
      "What is the main advantage of social behaviour in animals that hunt cooperatively?",

    options: [
      {
        id: "A",
        text: "It can improve the ability to locate and capture prey",
      },
      {
        id: "B",
        text: "It eliminates the need for energy",
      },
      {
        id: "C",
        text: "It prevents all competition between individuals",
      },
      {
        id: "D",
        text: "It guarantees unlimited food",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Cooperative hunting allows individuals to coordinate their actions when pursuing prey.",

      steps: [
        "Some prey animals are difficult for a single predator to capture.",
        "Several predators can coordinate their movements.",
        "Different individuals may block escape routes or attack from different directions.",
        "This can increase hunting success.",
        "Therefore, improving the ability to locate and capture prey is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-065",

    question:
      "Which behaviour helps animals find suitable mates?",

    options: [
      {
        id: "A",
        text: "Courtship behaviour",
      },
      {
        id: "B",
        text: "Permanent avoidance of other members of the species",
      },
      {
        id: "C",
        text: "Avoidance of reproductive signals",
      },
      {
        id: "D",
        text: "Continuous hiding during the breeding season",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Courtship behaviours help animals identify, attract and select potential mates.",

      steps: [
        "Sexual reproduction requires interaction between reproductive partners.",
        "Animals often use specific signals to attract potential mates.",
        "Courtship displays can communicate species identity and reproductive readiness.",
        "This increases the likelihood of successful mating.",
        "Therefore, courtship behaviour is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-066",

    question:
      "Why might an animal migrate to a breeding ground during a particular season?",

    options: [
      {
        id: "A",
        text: "The breeding ground may provide favorable conditions for reproduction",
      },
      {
        id: "B",
        text: "To prevent reproduction",
      },
      {
        id: "C",
        text: "To avoid all available resources",
      },
      {
        id: "D",
        text: "To increase exposure to unfavorable conditions",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Seasonal migration can take animals to locations that provide suitable food, shelter and conditions for successful reproduction.",

      steps: [
        "Reproduction requires suitable environmental conditions.",
        "Some habitats provide better nesting sites or food for offspring.",
        "Animals may migrate to these habitats during breeding seasons.",
        "This can increase reproductive success.",
        "Therefore, favorable conditions for reproduction are the correct answer.",
      ],
    },
  },

  {
    id: "biology-evolution-067",

    question:
      "Which behaviour is most likely to reduce competition between closely related species occupying the same habitat?",

    options: [
      {
        id: "A",
        text: "Using different feeding times or food resources",
      },
      {
        id: "B",
        text: "Using exactly the same resources at the same time",
      },
      {
        id: "C",
        text: "Increasing direct competition",
      },
      {
        id: "D",
        text: "Preventing resource partitioning",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Differences in resource use can reduce direct competition between species.",

      steps: [
        "Closely related species may have similar nutritional requirements.",
        "If they use exactly the same resources, competition may be intense.",
        "Using different food resources or feeding at different times reduces overlap.",
        "This is a form of resource partitioning.",
        "Therefore, using different feeding times or food resources is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-068",

    question:
      "Which behaviour is most directly associated with avoiding predators through timing?",

    options: [
      {
        id: "A",
        text: "Being active when predators are least active",
      },
      {
        id: "B",
        text: "Being active whenever predator activity is highest",
      },
      {
        id: "C",
        text: "Remaining exposed at all times",
      },
      {
        id: "D",
        text: "Moving toward predator territories",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Changing activity periods can reduce encounters between predators and prey.",

      steps: [
        "Predators and prey often have characteristic activity periods.",
        "If prey activity occurs when predators are less active, encounters may decrease.",
        "Fewer encounters can reduce predation risk.",
        "Therefore, being active when predators are least active is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-069",

    question:
      "Why may animals communicate warning calls when a predator approaches?",

    options: [
      {
        id: "A",
        text: "To alert other members of the group to danger",
      },
      {
        id: "B",
        text: "To attract predators deliberately",
      },
      {
        id: "C",
        text: "To prevent escape",
      },
      {
        id: "D",
        text: "To reduce awareness of danger",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Warning calls can alert nearby individuals to the presence of a predator.",

      steps: [
        "Predators may approach without being detected by every individual.",
        "One animal that detects the predator can produce a warning signal.",
        "Other individuals can respond by hiding or escaping.",
        "This can increase survival of members of the group.",
        "Therefore, alerting other members to danger is correct.",
      ],
    },
  },

  {
    id: "biology-evolution-070",

    question:
      "Which combination contains only behavioural adaptations?",

    options: [
      {
        id: "A",
        text: "Migration, hibernation and territorial defence",
      },
      {
        id: "B",
        text: "Thick fur, migration and webbed feet",
      },
      {
        id: "C",
        text: "Streamlined body, camouflage and thick fur",
      },
      {
        id: "D",
        text: "Long roots, broad leaves and hibernation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Behavioural adaptations are actions or patterns of activity that improve survival or reproductive success.",

      steps: [
        "Migration is a movement behaviour.",
        "Hibernation involves a seasonal reduction in activity and metabolism.",
        "Territorial defence is a behavioural interaction used to protect resources.",
        "The other options contain structural adaptations mixed with behaviours.",
        "Therefore, migration, hibernation and territorial defence are all behavioural adaptations.",
      ],
    },
  },

  // ============================================================
  // NEXT: A02.9 Extreme Environmental Conditions — 15
  // biology-evolution-071 → biology-evolution-085
  // ============================================================
];

export default evolutionAndAdaptationQuestions;





// export const evolutionAndAdaptationQuestions: ArenaQuestion[] = [
//   {
//     id: "biology-evolution-071",

//     question:
//       "Which adaptation would be most useful to a plant living in a very dry desert environment?",

//     options: [
//       {
//         id: "A",
//         text: "Large, thin leaves",
//       },
//       {
//         id: "B",
//         text: "A thick waxy cuticle",
//       },
//       {
//         id: "C",
//         text: "Numerous open stomata during the day",
//       },
//       {
//         id: "D",
//         text: "A shallow root system",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Desert plants have adaptations that reduce water loss and help them survive prolonged periods of water shortage.",

//       steps: [
//         "Desert environments have very limited water availability.",
//         "A thick waxy cuticle reduces evaporation from the plant surface.",
//         "Large thin leaves would increase water loss.",
//         "Numerous open stomata during the day would increase transpiration.",
//         "A shallow root system would be less effective at accessing deeper water sources.",
//         "Therefore, a thick waxy cuticle is the most suitable adaptation.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-072",

//     question:
//       "Which feature enables camels to survive for long periods in hot desert environments?",

//     options: [
//       {
//         id: "A",
//         text: "Very large ears that continuously release heat",
//       },
//       {
//         id: "B",
//         text: "Ability to conserve water by producing concentrated urine",
//       },
//       {
//         id: "C",
//         text: "Continuous sweating throughout the day",
//       },
//       {
//         id: "D",
//         text: "Thin skin with many exposed blood vessels",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Camels possess several physiological adaptations that enable them to conserve water in hot, dry environments.",

//       steps: [
//         "Water is scarce in desert environments.",
//         "Camels reduce water loss by producing highly concentrated urine.",
//         "Their kidneys are adapted to reabsorb large amounts of water.",
//         "Continuous sweating would cause excessive water loss.",
//         "Therefore, producing concentrated urine is an important adaptation.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-073",

//     question:
//       "Which adaptation helps Arctic mammals reduce heat loss in extremely cold environments?",

//     options: [
//       {
//         id: "A",
//         text: "A thick layer of insulating fat",
//       },
//       {
//         id: "B",
//         text: "Large exposed ears",
//       },
//       {
//         id: "C",
//         text: "A thin coat of fur",
//       },
//       {
//         id: "D",
//         text: "Reduced body insulation",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Animals living in extremely cold environments need adaptations that reduce heat loss.",

//       steps: [
//         "Cold environments cause animals to lose body heat rapidly.",
//         "A thick layer of fat acts as thermal insulation.",
//         "The insulating layer reduces the movement of heat from the body to the environment.",
//         "Large exposed ears can increase heat loss.",
//         "Therefore, a thick layer of insulating fat is advantageous.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-074",

//     question:
//       "Why do many desert plants have reduced leaves or spines?",

//     options: [
//       {
//         id: "A",
//         text: "To increase the surface area for transpiration",
//       },
//       {
//         id: "B",
//         text: "To reduce water loss",
//       },
//       {
//         id: "C",
//         text: "To increase water absorption through the leaves",
//       },
//       {
//         id: "D",
//         text: "To prevent photosynthesis",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Reducing leaf surface area is an important structural adaptation of many desert plants.",

//       steps: [
//         "Transpiration causes water to be lost from plant surfaces.",
//         "Desert plants must conserve their limited water supply.",
//         "Reduced leaves or spines provide a smaller surface area through which water can be lost.",
//         "Spines can also provide protection from herbivores.",
//         "Therefore, reduced leaves or spines help conserve water.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-075",

//     question:
//       "Which adaptation is particularly important for fish living in very cold water?",

//     options: [
//       {
//         id: "A",
//         text: "Production of antifreeze substances in body fluids",
//       },
//       {
//         id: "B",
//         text: "Complete absence of body fluids",
//       },
//       {
//         id: "C",
//         text: "Permanent exposure of the gills to dry air",
//       },
//       {
//         id: "D",
//         text: "Reduction of all metabolic activity to zero",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Some fish living in extremely cold waters produce substances that prevent ice crystals from forming in their body fluids.",

//       steps: [
//         "Extremely cold water can cause body fluids to freeze.",
//         "Freezing can damage cells and tissues.",
//         "Some cold-water fish produce antifreeze proteins or related substances.",
//         "These substances lower the freezing point of body fluids and inhibit ice formation.",
//         "Therefore, production of antifreeze substances is an important adaptation.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-076",

//     question:
//       "Which characteristic would provide the greatest advantage to a plant growing in a saline environment?",

//     options: [
//       {
//         id: "A",
//         text: "Ability to tolerate high concentrations of salt",
//       },
//       {
//         id: "B",
//         text: "Very high water loss through transpiration",
//       },
//       {
//         id: "C",
//         text: "Absence of mechanisms for regulating ions",
//       },
//       {
//         id: "D",
//         text: "Extremely thin roots with no salt tolerance",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Plants growing in salty environments require adaptations that allow them to maintain water and ion balance.",

//       steps: [
//         "High salt concentrations can interfere with water uptake by plant roots.",
//         "Excessive salt can also damage plant cells.",
//         "Salt-tolerant plants possess mechanisms for controlling or excluding harmful ions.",
//         "These mechanisms allow them to maintain suitable internal conditions.",
//         "Therefore, tolerance of high salt concentrations is advantageous.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-077",

//     question:
//       "Which adaptation would help an animal survive in an environment where temperatures are extremely high during the day?",

//     options: [
//       {
//         id: "A",
//         text: "Being active mainly during the hottest part of the day",
//       },
//       {
//         id: "B",
//         text: "Being nocturnal",
//       },
//       {
//         id: "C",
//         text: "Increasing unnecessary water loss",
//       },
//       {
//         id: "D",
//         text: "Having no mechanism for cooling the body",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Changing the time of activity can help animals avoid extreme environmental temperatures.",

//       steps: [
//         "Daytime temperatures in some hot environments can become extremely high.",
//         "High temperatures increase the risk of overheating and dehydration.",
//         "Nocturnal animals are active mainly at night when temperatures are lower.",
//         "This reduces exposure to extreme daytime heat.",
//         "Therefore, being nocturnal can improve survival in very hot environments.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-078",

//     question:
//       "How does a thick layer of fur help mammals living in very cold environments?",

//     options: [
//       {
//         id: "A",
//         text: "It increases heat loss from the body",
//       },
//       {
//         id: "B",
//         text: "It traps air and reduces heat loss",
//       },
//       {
//         id: "C",
//         text: "It prevents all body heat production",
//       },
//       {
//         id: "D",
//         text: "It increases water loss from the skin",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Fur provides insulation by trapping air close to the animal's body.",

//       steps: [
//         "Air is a relatively poor conductor of heat.",
//         "Dense fur traps a layer of air close to the body.",
//         "The trapped air reduces the rate at which heat escapes.",
//         "This helps maintain a suitable internal body temperature.",
//         "Therefore, thick fur is an effective adaptation to cold conditions.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-079",

//     question:
//       "Which feature of a mangrove plant helps it survive in waterlogged, oxygen-poor soil?",

//     options: [
//       {
//         id: "A",
//         text: "Pneumatophores that allow gaseous exchange",
//       },
//       {
//         id: "B",
//         text: "Complete absence of roots",
//       },
//       {
//         id: "C",
//         text: "Very small leaves with no stomata",
//       },
//       {
//         id: "D",
//         text: "Roots that cannot reach the soil surface",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Mangrove plants live in waterlogged soils where oxygen availability around the roots is often very low.",

//       steps: [
//         "Waterlogged soil contains less oxygen than well-aerated soil.",
//         "Roots require oxygen for aerobic respiration.",
//         "Mangroves develop specialized aerial roots called pneumatophores.",
//         "These roots project above the soil or water surface and facilitate gaseous exchange.",
//         "Therefore, pneumatophores help mangroves survive in oxygen-poor soils.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-080",

//     question:
//       "Which adaptation is most likely to be found in an animal living at high altitude where oxygen concentration is low?",

//     options: [
//       {
//         id: "A",
//         text: "Reduced ability to transport oxygen",
//       },
//       {
//         id: "B",
//         text: "Increased efficiency of oxygen uptake and transport",
//       },
//       {
//         id: "C",
//         text: "Complete loss of respiratory organs",
//       },
//       {
//         id: "D",
//         text: "Reduced blood supply to respiratory surfaces",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Animals living at high altitudes need adaptations that improve oxygen uptake and transport because atmospheric oxygen availability is reduced.",

//       steps: [
//         "Atmospheric pressure decreases as altitude increases.",
//         "This makes oxygen uptake more difficult.",
//         "Animals living at high altitudes may have adaptations that improve oxygen absorption and transport.",
//         "Greater efficiency of the respiratory and circulatory systems helps supply tissues with oxygen.",
//         "Therefore, increased efficiency of oxygen uptake and transport is advantageous.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-081",

//     question:
//       "Which adaptation would be most useful to a plant growing in an environment with frequent flooding?",

//     options: [
//       {
//         id: "A",
//         text: "Roots adapted to obtain oxygen from above the waterlogged soil",
//       },
//       {
//         id: "B",
//         text: "Roots that require large amounts of oxygen from dry soil",
//       },
//       {
//         id: "C",
//         text: "Leaves that cannot tolerate water",
//       },
//       {
//         id: "D",
//         text: "Complete absence of air spaces in plant tissues",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Frequent flooding can reduce the amount of oxygen available to plant roots.",

//       steps: [
//         "Floodwater fills the spaces between soil particles.",
//         "This restricts the movement of oxygen into the soil.",
//         "Roots may therefore experience oxygen deficiency.",
//         "Aerial or specialized roots can obtain oxygen from the atmosphere.",
//         "Such adaptations allow plants to continue respiration during flooding.",
//         "Therefore, roots adapted to obtain oxygen above waterlogged soil are advantageous.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-082",

//     question:
//       "Which physiological response helps a mammal maintain a stable body temperature in very cold conditions?",

//     options: [
//       {
//         id: "A",
//         text: "Shivering to generate heat",
//       },
//       {
//         id: "B",
//         text: "Permanent cessation of respiration",
//       },
//       {
//         id: "C",
//         text: "Continuous dilation of surface blood vessels",
//       },
//       {
//         id: "D",
//         text: "Complete loss of body insulation",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Shivering is a physiological response that generates heat when body temperature falls.",

//       steps: [
//         "Cold conditions increase the rate of heat loss from the body.",
//         "Skeletal muscles undergo rapid involuntary contractions during shivering.",
//         "Muscle activity releases heat.",
//         "The additional heat helps maintain body temperature.",
//         "Therefore, shivering is an important response to cold conditions.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-083",

//     question:
//       "Why do some desert animals have very efficient kidneys?",

//     options: [
//       {
//         id: "A",
//         text: "To increase water loss in the urine",
//       },
//       {
//         id: "B",
//         text: "To conserve water by producing concentrated urine",
//       },
//       {
//         id: "C",
//         text: "To prevent the digestion of food",
//       },
//       {
//         id: "D",
//         text: "To eliminate all salts from the body",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Efficient kidneys help desert animals conserve the limited water available in their environment.",

//       steps: [
//         "Water is scarce in desert environments.",
//         "Animals must minimize unnecessary water loss.",
//         "Efficient kidneys reabsorb more water from the filtrate.",
//         "This results in a smaller volume of more concentrated urine.",
//         "Therefore, efficient kidneys help desert animals conserve water.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-084",

//     question:
//       "Which combination of adaptations would best help an animal survive in a cold environment?",

//     options: [
//       {
//         id: "A",
//         text: "Thin fur and large exposed ears",
//       },
//       {
//         id: "B",
//         text: "Thick fur and a layer of insulating fat",
//       },
//       {
//         id: "C",
//         text: "Large surface area and continuous sweating",
//       },
//       {
//         id: "D",
//         text: "Reduced insulation and increased heat loss",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Cold-adapted animals commonly possess several features that reduce heat loss.",

//       steps: [
//         "Cold environments increase the risk of excessive heat loss.",
//         "Thick fur traps insulating air close to the body.",
//         "A layer of body fat provides additional thermal insulation.",
//         "Together, these adaptations reduce heat loss.",
//         "Thin fur and large exposed body surfaces would generally increase heat loss.",
//         "Therefore, thick fur and insulating fat provide the best combination.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-085",

//     question:
//       "An organism living in an extremely hot and dry environment has a low metabolic rate during the hottest part of the day and becomes active at night. What is the main advantage of this pattern?",

//     options: [
//       {
//         id: "A",
//         text: "It increases exposure to extreme heat",
//       },
//       {
//         id: "B",
//         text: "It reduces energy and water loss associated with heat stress",
//       },
//       {
//         id: "C",
//         text: "It prevents the organism from obtaining food",
//       },
//       {
//         id: "D",
//         text: "It increases evaporation from the body",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Reducing activity during extreme heat and becoming active at night is an effective adaptation to hot, dry environments.",

//       steps: [
//         "Extremely hot conditions increase the risk of overheating and dehydration.",
//         "Lower metabolic activity during the hottest period can reduce heat production and energy expenditure.",
//         "Remaining inactive during the day also reduces exposure to intense environmental heat.",
//         "Night-time activity occurs when temperatures are generally lower.",
//         "This helps reduce heat and water stress while allowing the organism to feed and perform other activities.",
//         "Therefore, the adaptation reduces energy and water loss associated with heat stress.",
//       ],
//     },
//   },
// ];




// export const evolutionAndAdaptationQuestions: ArenaQuestion[] = [
//   {
//     id: "biology-evolution-086",

//     question:
//       "What is the main advantage of camouflage to an organism?",

//     options: [
//       {
//         id: "A",
//         text: "It makes the organism more visible to predators",
//       },
//       {
//         id: "B",
//         text: "It helps the organism blend with its surroundings",
//       },
//       {
//         id: "C",
//         text: "It prevents the organism from reproducing",
//       },
//       {
//         id: "D",
//         text: "It increases the organism's body temperature",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Camouflage is an adaptation that makes an organism less noticeable in its environment.",

//       steps: [
//         "Camouflage involves coloration, patterns, shapes or structures that resemble the surroundings.",
//         "An organism that is difficult to detect is less likely to be noticed by predators.",
//         "Camouflage can also help predators approach prey without being detected.",
//         "Therefore, camouflage mainly helps an organism blend with its surroundings.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-087",

//     question:
//       "Which of the following is an example of camouflage?",

//     options: [
//       {
//         id: "A",
//         text: "A green grasshopper blending with green vegetation",
//       },
//       {
//         id: "B",
//         text: "A peacock displaying its brightly coloured feathers",
//       },
//       {
//         id: "C",
//         text: "A bee producing honey",
//       },
//       {
//         id: "D",
//         text: "A bird building a nest",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Camouflage occurs when an organism's appearance makes it difficult to distinguish from its surroundings.",

//       steps: [
//         "A green grasshopper may have body coloration similar to green leaves and grasses.",
//         "This similarity makes the grasshopper difficult for predators to detect.",
//         "The other examples describe courtship, feeding or nesting behaviours rather than camouflage.",
//         "Therefore, the green grasshopper blending with vegetation is an example of camouflage.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-088",

//     question:
//       "What is mimicry in biological adaptation?",

//     options: [
//       {
//         id: "A",
//         text: "The production of identical offspring by all organisms",
//       },
//       {
//         id: "B",
//         text: "The resemblance of one organism to another organism or feature that provides an advantage",
//       },
//       {
//         id: "C",
//         text: "The movement of organisms from one habitat to another",
//       },
//       {
//         id: "D",
//         text: "The complete disappearance of an organism from its habitat",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Mimicry occurs when one organism resembles another organism or object in a way that provides a survival or reproductive advantage.",

//       steps: [
//         "Mimicry involves resemblance between organisms or between an organism and part of its environment.",
//         "The resemblance may protect the organism from predators or help it obtain food.",
//         "For example, a harmless species may resemble a harmful or unpalatable species.",
//         "Therefore, mimicry is the resemblance of one organism to another organism or feature that provides an advantage.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-089",

//     question:
//       "A harmless insect resembles a brightly coloured poisonous insect. What advantage may this provide?",

//     options: [
//       {
//         id: "A",
//         text: "Predators may avoid it because they mistake it for the poisonous species",
//       },
//       {
//         id: "B",
//         text: "It becomes unable to reproduce",
//       },
//       {
//         id: "C",
//         text: "It becomes more attractive to all predators",
//       },
//       {
//         id: "D",
//         text: "It loses the ability to obtain food",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "A harmless organism can gain protection by resembling a dangerous or unpalatable organism.",

//       steps: [
//         "Predators may have learned to avoid the brightly coloured poisonous insect.",
//         "A harmless insect with a similar appearance may be mistaken for the poisonous species.",
//         "The predator may therefore avoid attacking the harmless insect.",
//         "This increases the harmless insect's chance of survival.",
//         "Therefore, the main advantage is predator avoidance.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-090",

//     question:
//       "Which structure provides physical protection against predators in many animals?",

//     options: [
//       {
//         id: "A",
//         text: "A protective shell",
//       },
//       {
//         id: "B",
//         text: "A transparent blood vessel",
//       },
//       {
//         id: "C",
//         text: "A digestive enzyme",
//       },
//       {
//         id: "D",
//         text: "A respiratory pigment",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Physical structures such as shells provide mechanical protection against predators.",

//       steps: [
//         "A shell forms a hard external covering around certain animals.",
//         "The hard covering can make it difficult for predators to reach soft body tissues.",
//         "Snails and some other organisms use shells as protective structures.",
//         "The other options perform physiological functions rather than providing direct mechanical protection.",
//         "Therefore, a protective shell is the correct answer.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-091",

//     question:
//       "Why do some animals have warning coloration?",

//     options: [
//       {
//         id: "A",
//         text: "To make them easier for predators to attack",
//       },
//       {
//         id: "B",
//         text: "To warn predators that they may be dangerous, poisonous or unpalatable",
//       },
//       {
//         id: "C",
//         text: "To prevent them from obtaining food",
//       },
//       {
//         id: "D",
//         text: "To increase their rate of water loss",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Warning coloration is a protective adaptation that signals potential danger or unpalatability to predators.",

//       steps: [
//         "Some organisms contain toxins, venom or substances that make them unpalatable.",
//         "Bright colours can act as visual warning signals to predators.",
//         "Predators that recognize the signal may avoid attacking the organism.",
//         "This reduces the likelihood of predation.",
//         "Therefore, warning coloration helps signal that an organism may be dangerous or unpalatable.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-092",

//     question:
//       "Which of the following is most likely to be an example of protective coloration?",

//     options: [
//       {
//         id: "A",
//         text: "A white Arctic hare blending into snow",
//       },
//       {
//         id: "B",
//         text: "A brightly coloured flower attracting insects",
//       },
//       {
//         id: "C",
//         text: "A bird singing to attract a mate",
//       },
//       {
//         id: "D",
//         text: "A fish swimming rapidly through water",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Protective coloration reduces the likelihood that an organism will be detected by predators.",

//       steps: [
//         "Snow provides a predominantly white background in Arctic environments.",
//         "A white coat allows an Arctic hare to blend into this background.",
//         "Predators may find the hare more difficult to detect.",
//         "The other examples mainly involve attraction, reproduction or movement.",
//         "Therefore, the white Arctic hare is an example of protective coloration.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-093",

//     question:
//       "How does mimicry differ from simple camouflage?",

//     options: [
//       {
//         id: "A",
//         text: "Mimicry involves resemblance to another organism or recognizable feature, while camouflage involves blending with the surroundings",
//       },
//       {
//         id: "B",
//         text: "Camouflage always involves poisonous organisms",
//       },
//       {
//         id: "C",
//         text: "Mimicry prevents all forms of reproduction",
//       },
//       {
//         id: "D",
//         text: "There is no difference between them",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Both camouflage and mimicry can provide protection, but they involve different forms of resemblance.",

//       steps: [
//         "Camouflage generally makes an organism difficult to distinguish from its surroundings.",
//         "Mimicry involves an organism resembling another organism or recognizable feature.",
//         "For example, a harmless insect may resemble a dangerous insect.",
//         "Therefore, mimicry and camouflage are related but distinct adaptations.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-094",

//     question:
//       "Which adaptation is most likely to protect a porcupine from predators?",

//     options: [
//       {
//         id: "A",
//         text: "Sharp quills",
//       },
//       {
//         id: "B",
//         text: "Thin transparent skin",
//       },
//       {
//         id: "C",
//         text: "Reduced skeletal support",
//       },
//       {
//         id: "D",
//         text: "Soft exposed tissues",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Sharp external structures can discourage predators from attacking an organism.",

//       steps: [
//         "Porcupines possess modified hairs called quills.",
//         "The quills are sharp and can cause injury to predators.",
//         "A predator may therefore avoid attacking or approaching the porcupine.",
//         "This increases the animal's chances of survival.",
//         "Therefore, sharp quills provide an important protective adaptation.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-095",

//     question:
//       "A moth has wing markings that closely resemble the eyes of a much larger animal. What is the likely function of this adaptation?",

//     options: [
//       {
//         id: "A",
//         text: "To make the moth appear larger or threatening to predators",
//       },
//       {
//         id: "B",
//         text: "To increase water loss",
//       },
//       {
//         id: "C",
//         text: "To prevent the moth from feeding",
//       },
//       {
//         id: "D",
//         text: "To reduce the size of the moth",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Eye-like markings can startle or confuse predators and reduce the likelihood of attack.",

//       steps: [
//         "Some moths have prominent eye-like patterns on their wings.",
//         "When exposed, these markings may make the moth appear larger or resemble the eyes of a larger animal.",
//         "A predator may become startled or hesitate to attack.",
//         "This can increase the moth's chance of escaping.",
//         "Therefore, the markings function as a protective adaptation.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-096",

//     question:
//       "Which of the following best illustrates Batesian mimicry?",

//     options: [
//       {
//         id: "A",
//         text: "A harmless insect resembling a harmful insect",
//       },
//       {
//         id: "B",
//         text: "Two harmful species resembling each other",
//       },
//       {
//         id: "C",
//         text: "An animal changing location during migration",
//       },
//       {
//         id: "D",
//         text: "A plant producing seeds after fertilization",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Batesian mimicry occurs when a harmless species resembles a harmful, poisonous or unpalatable species.",

//       steps: [
//         "The model species is harmful, poisonous or otherwise avoided by predators.",
//         "The mimic is harmless but resembles the model.",
//         "Predators that avoid the model may also avoid the mimic.",
//         "The mimic therefore gains protection without possessing the harmful characteristics itself.",
//         "Therefore, a harmless insect resembling a harmful insect illustrates Batesian mimicry.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-097",

//     question:
//       "Which example best demonstrates Müllerian mimicry?",

//     options: [
//       {
//         id: "A",
//         text: "Several harmful species sharing similar warning coloration",
//       },
//       {
//         id: "B",
//         text: "A harmless species resembling a harmful species",
//       },
//       {
//         id: "C",
//         text: "A plant resembling a rock",
//       },
//       {
//         id: "D",
//         text: "A bird hiding inside a tree hollow",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Müllerian mimicry occurs when two or more genuinely harmful or unpalatable species share similar warning signals.",

//       steps: [
//         "Several harmful species may have similar warning colours or patterns.",
//         "Predators learn to avoid the shared warning pattern.",
//         "This benefits each harmful species because predators more quickly learn the warning signal.",
//         "Unlike Batesian mimicry, the species involved are themselves harmful or unpalatable.",
//         "Therefore, several harmful species sharing similar warning coloration illustrate Müllerian mimicry.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-098",

//     question:
//       "Why can camouflage increase the survival rate of prey organisms?",

//     options: [
//       {
//         id: "A",
//         text: "It makes prey easier to locate",
//       },
//       {
//         id: "B",
//         text: "It reduces the probability that predators will detect them",
//       },
//       {
//         id: "C",
//         text: "It prevents predators from reproducing",
//       },
//       {
//         id: "D",
//         text: "It eliminates the need for food",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "Camouflage provides an advantage by reducing the visibility of prey to predators.",

//       steps: [
//         "Predators must usually detect prey before they can attack.",
//         "Camouflaged prey are more difficult to distinguish from their surroundings.",
//         "Reduced detection lowers the probability of successful predation.",
//         "Individuals that avoid predation are more likely to survive and reproduce.",
//         "Therefore, camouflage can increase the survival rate of prey organisms.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-099",

//     question:
//       "Which feature of a skunk is primarily a chemical defence against predators?",

//     options: [
//       {
//         id: "A",
//         text: "Its ability to produce a foul-smelling spray",
//       },
//       {
//         id: "B",
//         text: "Its skeletal system",
//       },
//       {
//         id: "C",
//         text: "Its digestive tract",
//       },
//       {
//         id: "D",
//         text: "Its teeth used for chewing food",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Chemical defence involves producing substances that discourage predators from attacking.",

//       steps: [
//         "Skunks possess specialized glands that produce a strong-smelling defensive spray.",
//         "The spray can irritate or disorient potential predators.",
//         "Predators learn to avoid animals associated with this unpleasant defence.",
//         "This reduces the risk of predation.",
//         "Therefore, the foul-smelling spray is a chemical defence mechanism.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-100",

//     question:
//       "An insect closely resembles a twig in colour and shape. What is the most likely benefit of this adaptation?",

//     options: [
//       {
//         id: "A",
//         text: "It allows the insect to remain hidden from predators",
//       },
//       {
//         id: "B",
//         text: "It makes the insect more attractive to predators",
//       },
//       {
//         id: "C",
//         text: "It prevents the insect from obtaining oxygen",
//       },
//       {
//         id: "D",
//         text: "It increases the insect's body temperature permanently",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Resembling an environmental object can make an organism difficult for predators to detect.",

//       steps: [
//         "The insect has a body shape and colour similar to a twig.",
//         "This makes it difficult to distinguish from branches or plant stems.",
//         "Predators may overlook the insect because it blends into the environment.",
//         "Reduced detection increases its chance of surviving.",
//         "Therefore, the adaptation allows the insect to remain hidden from predators.",
//       ],
//     },
//   },
// ];





// export const evolutionAndAdaptationQuestions: ArenaQuestion[] = [
//   {
//     id: "biology-evolution-101",

//     question:
//       "What is the main reason organisms are distributed differently across different habitats?",

//     options: [
//       {
//         id: "A",
//         text: "All organisms require exactly the same environmental conditions",
//       },
//       {
//         id: "B",
//         text: "Different organisms possess adaptations suited to particular environmental conditions",
//       },
//       {
//         id: "C",
//         text: "Organisms can survive equally well in every habitat",
//       },
//       {
//         id: "D",
//         text: "Habitats have no effect on the survival of organisms",
//       },
//     ],

//     correctAnswer: "B",

//     explanation: {
//       intro:
//         "The distribution of organisms is strongly influenced by their adaptations to environmental conditions.",

//       steps: [
//         "Habitats differ in factors such as temperature, water availability, light, soil and food.",
//         "Organisms possess adaptations that allow them to survive under particular conditions.",
//         "An organism is more likely to establish a population where environmental conditions match its requirements.",
//         "Therefore, different organisms are distributed differently because their adaptations suit different habitats.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-102",

//     question:
//       "Which factor is most likely to determine whether a particular plant species can survive in a habitat?",

//     options: [
//       {
//         id: "A",
//         text: "Availability of suitable environmental conditions",
//       },
//       {
//         id: "B",
//         text: "The colour of the plant's flowers alone",
//       },
//       {
//         id: "C",
//         text: "The number of unrelated species in the habitat alone",
//       },
//       {
//         id: "D",
//         text: "The age of the habitat alone",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Plants can survive only where environmental conditions fall within the range they can tolerate.",

//       steps: [
//         "Plants require suitable levels of light, water, temperature, minerals and other resources.",
//         "Each species has a range of environmental conditions within which it can survive and reproduce.",
//         "If conditions fall outside this range, growth and reproduction may be reduced.",
//         "Therefore, suitable environmental conditions are an important determinant of plant distribution.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-103",

//     question:
//       "Why are cactus plants commonly found in deserts rather than in waterlogged habitats?",

//     options: [
//       {
//         id: "A",
//         text: "Their adaptations are suited to conserving water in dry conditions",
//       },
//       {
//         id: "B",
//         text: "They require permanently flooded soil",
//       },
//       {
//         id: "C",
//         text: "They cannot carry out photosynthesis",
//       },
//       {
//         id: "D",
//         text: "They require extremely low temperatures to survive",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Cacti possess adaptations that allow them to survive where water is scarce.",

//       steps: [
//         "Deserts have low and irregular water availability.",
//         "Cacti have features such as succulent stems that store water.",
//         "Reduced leaves or spines and a waxy surface help reduce water loss.",
//         "These adaptations make cacti well suited to dry habitats.",
//         "Therefore, their distribution is associated with habitats where their water-conserving adaptations are advantageous.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-104",

//     question:
//       "A plant species has broad leaves and a high rate of transpiration. In which habitat would this plant most likely be successful?",

//     options: [
//       {
//         id: "A",
//         text: "A humid environment with abundant water",
//       },
//       {
//         id: "B",
//         text: "An extremely dry desert",
//       },
//       {
//         id: "C",
//         text: "A habitat with severe water shortage",
//       },
//       {
//         id: "D",
//         text: "A completely waterless environment",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Plants with high rates of transpiration are more likely to succeed where water is readily available.",

//       steps: [
//         "Broad leaves generally provide a large surface area for transpiration.",
//         "High transpiration can result in considerable water loss.",
//         "A humid habitat with abundant water can compensate for this water loss.",
//         "In contrast, severe drought would place the plant under water stress.",
//         "Therefore, the plant is most likely to be successful in a humid environment with abundant water.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-105",

//     question:
//       "Which environmental factor is particularly important in determining the distribution of aquatic plants?",

//     options: [
//       {
//         id: "A",
//         text: "Availability and quality of water",
//       },
//       {
//         id: "B",
//         text: "Colour of surrounding rocks only",
//       },
//       {
//         id: "C",
//         text: "Number of terrestrial mammals only",
//       },
//       {
//         id: "D",
//         text: "Distance from all land animals",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Aquatic plants depend directly on water conditions for their survival and growth.",

//       steps: [
//         "Aquatic plants live partly or completely in water.",
//         "Water availability is therefore essential to their survival.",
//         "Factors such as salinity, oxygen availability, temperature and water movement can also influence their distribution.",
//         "Different aquatic plants are adapted to different water conditions.",
//         "Therefore, water availability and quality are important determinants of their distribution.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-106",

//     question:
//       "Why are mangrove plants commonly found along tropical coastlines and estuaries?",

//     options: [
//       {
//         id: "A",
//         text: "They possess adaptations that allow them to tolerate saline and waterlogged conditions",
//       },
//       {
//         id: "B",
//         text: "They require completely dry soil",
//       },
//       {
//         id: "C",
//         text: "They cannot tolerate salt",
//       },
//       {
//         id: "D",
//         text: "They require permanent exposure to freezing temperatures",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Mangroves are specialized plants adapted to coastal environments where salinity and waterlogging can be high.",

//       steps: [
//         "Coastal and estuarine habitats may contain significant concentrations of dissolved salts.",
//         "The soil is frequently waterlogged and may have low oxygen availability.",
//         "Mangroves possess adaptations that help them tolerate salt and obtain oxygen.",
//         "These adaptations allow them to survive where many other plants cannot.",
//         "Therefore, mangroves are commonly distributed in tropical coastal and estuarine habitats.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-107",

//     question:
//       "A population of frogs is found only in ponds with clean, well-oxygenated water. What does this distribution suggest?",

//     options: [
//       {
//         id: "A",
//         text: "The frogs have environmental requirements that limit their habitat distribution",
//       },
//       {
//         id: "B",
//         text: "The frogs can survive equally well in polluted water",
//       },
//       {
//         id: "C",
//         text: "Water quality has no effect on the frogs",
//       },
//       {
//         id: "D",
//         text: "The frogs do not depend on their habitat",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "The distribution of a species can reflect its tolerance limits and environmental requirements.",

//       steps: [
//         "The frogs are found only where water is clean and well oxygenated.",
//         "This suggests that polluted or oxygen-poor water may be unsuitable for them.",
//         "Environmental conditions therefore restrict where the frogs can establish populations.",
//         "This is an example of habitat distribution being influenced by environmental requirements.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-108",

//     question:
//       "Which adaptation would allow a plant to occupy a habitat with very low light intensity?",

//     options: [
//       {
//         id: "A",
//         text: "Large leaves capable of capturing available light efficiently",
//       },
//       {
//         id: "B",
//         text: "Complete absence of chlorophyll",
//       },
//       {
//         id: "C",
//         text: "Permanent closure of all stomata",
//       },
//       {
//         id: "D",
//         text: "Reduction of all photosynthetic pigments",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Plants growing in low-light habitats require adaptations that improve their ability to capture limited light.",

//       steps: [
//         "Light is required for photosynthesis.",
//         "In low-light habitats, competition for available light can be intense.",
//         "Large leaves can provide a greater surface area for capturing available light.",
//         "Plants may also possess other adaptations that improve light absorption.",
//         "Therefore, large leaves capable of efficiently capturing available light can help a plant occupy low-light habitats.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-109",

//     question:
//       "Why are some plants restricted to acidic soils?",

//     options: [
//       {
//         id: "A",
//         text: "They are adapted to obtain nutrients efficiently under acidic soil conditions",
//       },
//       {
//         id: "B",
//         text: "All plants require acidic soils",
//       },
//       {
//         id: "C",
//         text: "Acidic soils always contain no water",
//       },
//       {
//         id: "D",
//         text: "Plants cannot be affected by soil pH",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Soil pH influences nutrient availability and the ability of plants to absorb minerals.",

//       steps: [
//         "Different plants have different tolerance ranges for soil pH.",
//         "Soil acidity affects the chemical availability of mineral nutrients.",
//         "Some plant species are adapted to absorb nutrients effectively in acidic soils.",
//         "Other species may grow poorly under the same conditions.",
//         "Therefore, adaptation to soil conditions can influence plant distribution.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-110",

//     question:
//       "Which statement best explains why polar bears are naturally associated with Arctic habitats?",

//     options: [
//       {
//         id: "A",
//         text: "Their adaptations enable them to survive cold conditions and exploit Arctic resources",
//       },
//       {
//         id: "B",
//         text: "They can survive only in warm tropical forests",
//       },
//       {
//         id: "C",
//         text: "Their distribution is completely independent of temperature",
//       },
//       {
//         id: "D",
//         text: "They lack adaptations for cold conditions",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "The distribution of polar bears is associated with Arctic environments because they possess adaptations suited to cold conditions.",

//       steps: [
//         "Arctic environments have extremely low temperatures for much of the year.",
//         "Polar bears possess thick fur and substantial body fat that provide insulation.",
//         "Their body structure and behaviour also help them obtain food in Arctic conditions.",
//         "These adaptations increase their survival in cold environments.",
//         "Therefore, their distribution is closely associated with Arctic habitats.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-111",

//     question:
//       "How can competition affect the distribution of a species within a habitat?",

//     options: [
//       {
//         id: "A",
//         text: "Competition can restrict a species to areas where it can obtain sufficient resources",
//       },
//       {
//         id: "B",
//         text: "Competition always increases the available resources",
//       },
//       {
//         id: "C",
//         text: "Competition has no effect on population distribution",
//       },
//       {
//         id: "D",
//         text: "Competition allows every species to occupy every habitat",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Competition for limited resources can determine where a species is able to survive and reproduce.",

//       steps: [
//         "Organisms may compete for food, water, light, space or other resources.",
//         "Resources may be more available in some parts of a habitat than others.",
//         "A species may survive better in areas where competition is weaker or resources are more abundant.",
//         "Therefore, competition can restrict the distribution of a species within a habitat.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-112",

//     question:
//       "Two plant species live in the same region, but one is found mainly in open grassland while the other occurs mainly under forest trees. What is the most likely explanation?",

//     options: [
//       {
//         id: "A",
//         text: "The species have different adaptations and environmental requirements",
//       },
//       {
//         id: "B",
//         text: "Both species require exactly the same conditions",
//       },
//       {
//         id: "C",
//         text: "The forest has no effect on light availability",
//       },
//       {
//         id: "D",
//         text: "Plants cannot respond to environmental conditions",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Species can occupy different parts of the same geographical region because their adaptations and environmental requirements differ.",

//       steps: [
//         "Open grassland generally receives more direct sunlight.",
//         "The area beneath forest trees receives less light because of shading.",
//         "The two plant species may therefore have different light requirements or adaptations.",
//         "Other factors such as soil moisture and nutrient availability may also differ.",
//         "Therefore, different adaptations and environmental requirements can explain their distribution.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-113",

//     question:
//       "A lizard population is found mostly on dark volcanic rocks. The lizards have dark body coloration. How could this adaptation influence their distribution?",

//     options: [
//       {
//         id: "A",
//         text: "It may allow them to avoid detection by predators on dark rocks",
//       },
//       {
//         id: "B",
//         text: "It prevents them from feeding",
//       },
//       {
//         id: "C",
//         text: "It makes them equally visible in every habitat",
//       },
//       {
//         id: "D",
//         text: "It prevents them from reproducing",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Body coloration can influence where organisms are most successful by reducing predation in suitable environments.",

//       steps: [
//         "Dark lizards are less conspicuous against dark volcanic rocks.",
//         "Reduced visibility can make it harder for predators to detect them.",
//         "This provides a survival advantage in habitats containing dark surfaces.",
//         "The lizards may therefore occur at higher densities in such areas.",
//         "Thus, an adaptation can influence the distribution of a species within its environment.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-114",

//     question:
//       "Which statement best describes the relationship between adaptation and habitat distribution?",

//     options: [
//       {
//         id: "A",
//         text: "Adaptations can determine the range of environmental conditions in which a species can survive",
//       },
//       {
//         id: "B",
//         text: "Adaptations have no relationship with habitat distribution",
//       },
//       {
//         id: "C",
//         text: "All species have identical adaptations",
//       },
//       {
//         id: "D",
//         text: "A species can survive and reproduce equally well in every environment",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "Adaptations help organisms survive under particular environmental conditions and therefore influence their geographical and ecological distribution.",

//       steps: [
//         "Every species has physiological, structural or behavioural characteristics that affect its ability to survive.",
//         "These characteristics determine how well the organism tolerates factors such as temperature, moisture, salinity and food availability.",
//         "A species is more likely to establish and reproduce where conditions fall within its tolerance range.",
//         "Therefore, adaptations help determine the habitats in which a species can survive.",
//       ],
//     },
//   },

//   {
//     id: "biology-evolution-115",

//     question:
//       "A plant is introduced into two habitats. It grows well in one habitat but poorly in the other. Which conclusion is most appropriate?",

//     options: [
//       {
//         id: "A",
//         text: "The plant's adaptations and tolerance limits interact with environmental conditions to determine its success",
//       },
//       {
//         id: "B",
//         text: "The plant must be equally well adapted to both habitats",
//       },
//       {
//         id: "C",
//         text: "Environmental conditions cannot affect plant growth",
//       },
//       {
//         id: "D",
//         text: "The plant will always reproduce more in the poorer habitat",
//       },
//     ],

//     correctAnswer: "A",

//     explanation: {
//       intro:
//         "The success of an organism in a habitat depends on how its adaptations and tolerance limits match the environmental conditions.",

//       steps: [
//         "The two habitats may differ in factors such as light, temperature, water, soil nutrients or competition.",
//         "The plant grows better where these conditions are more suitable for its requirements.",
//         "Poor growth in the second habitat suggests that one or more environmental factors may be outside the plant's optimum range.",
//         "Therefore, the plant's adaptations and tolerance limits interact with environmental conditions to determine its success.",
//       ],
//     },
//   },
// ];
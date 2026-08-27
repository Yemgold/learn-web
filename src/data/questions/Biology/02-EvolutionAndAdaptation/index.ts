












import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — EVOLUTION AND ADAPTATION                                         */
/* -------------------------------------------------------------------------- */


export const evolutionAndAdaptationQuestions: ArenaQuestion[] = [



  // ============================================================
  // A02.1 Meaning and Principles — 15 Questions
  // IDs: biology-evolution-001 → 015
  // ============================================================

  {
    id: "biology-evolution-001",

    question:
      "What is meant by adaptation in biology?",

    options: [
      {
        id: "A",
        text: "A temporary change in an organism caused by exercise",
      },
      {
        id: "B",
        text: "A characteristic that helps an organism survive and reproduce in its environment",
      },
      {
        id: "C",
        text: "The process by which an organism becomes larger",
      },
      {
        id: "D",
        text: "The movement of an organism from one habitat to another",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Adaptation refers to an inherited feature or characteristic that improves an organism's ability to survive and reproduce in a particular environment.",

      steps: [
        "Organisms live under different environmental conditions.",
        "Some inherited characteristics give organisms an advantage in their particular environments.",
        "Such characteristics can improve survival and reproductive success.",
        "These useful inherited characteristics are described as adaptations.",
        "Therefore, the correct answer is a characteristic that helps an organism survive and reproduce in its environment.",
      ],
    },
  },

  {
    id: "biology-evolution-002",

    question:
      "Which of the following best explains why adaptations are important to organisms?",

    options: [
      {
        id: "A",
        text: "They enable organisms to avoid all environmental changes",
      },
      {
        id: "B",
        text: "They increase the ability of organisms to survive and reproduce",
      },
      {
        id: "C",
        text: "They prevent organisms from competing for resources",
      },
      {
        id: "D",
        text: "They make all organisms identical",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Adaptations increase an organism's ability to cope with environmental conditions and reproduce successfully.",

      steps: [
        "Environmental conditions place different pressures on organisms.",
        "Useful adaptations help organisms obtain food, avoid predators, withstand environmental conditions or reproduce.",
        "Organisms with advantageous characteristics are more likely to survive and reproduce.",
        "Adaptations therefore contribute to survival and reproductive success.",
        "Hence, the correct answer is that adaptations increase the ability of organisms to survive and reproduce.",
      ],
    },
  },

  {
    id: "biology-evolution-003",

    question:
      "Which statement about adaptations is correct?",

    options: [
      {
        id: "A",
        text: "All adaptations are acquired during an organism's lifetime",
      },
      {
        id: "B",
        text: "Adaptations always make organisms physically larger",
      },
      {
        id: "C",
        text: "Adaptations can improve an organism's fitness in its environment",
      },
      {
        id: "D",
        text: "Adaptations occur only in animals",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "An adaptation is useful when it improves an organism's ability to survive and reproduce in its environment.",

      steps: [
        "Fitness in evolutionary biology refers to reproductive success.",
        "A useful adaptation can help an organism obtain resources, avoid danger or reproduce.",
        "Adaptations occur in plants, animals and other organisms.",
        "They do not necessarily involve an increase in body size.",
        "Therefore, adaptations can improve an organism's fitness in its environment.",
      ],
    },
  },

  {
    id: "biology-evolution-004",

    question:
      "Which of the following is an example of a structural adaptation?",

    options: [
      {
        id: "A",
        text: "A bird migrating during winter",
      },
      {
        id: "B",
        text: "A plant having a thick waxy cuticle",
      },
      {
        id: "C",
        text: "A lizard basking in sunlight",
      },
      {
        id: "D",
        text: "A mammal reducing its activity during cold weather",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Structural adaptations are physical features of an organism that help it survive in its environment.",

      steps: [
        "A structural adaptation involves the physical structure of an organism.",
        "A thick waxy cuticle is a physical feature found on the surface of some plants.",
        "The cuticle reduces water loss and is especially useful in dry conditions.",
        "Migration, basking and changes in activity are behavioural or physiological responses.",
        "Therefore, the correct answer is a plant having a thick waxy cuticle.",
      ],
    },
  },

  {
    id: "biology-evolution-005",

    question:
      "Which type of adaptation involves a change in the way an organism functions internally?",

    options: [
      {
        id: "A",
        text: "Structural adaptation",
      },
      {
        id: "B",
        text: "Physiological adaptation",
      },
      {
        id: "C",
        text: "Geographical adaptation",
      },
      {
        id: "D",
        text: "Mechanical adaptation",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Physiological adaptations involve internal processes or functions that improve an organism's survival.",

      steps: [
        "Structural adaptations concern physical features.",
        "Physiological adaptations concern how body processes function.",
        "Examples include production of concentrated urine in desert mammals and production of toxins by some organisms.",
        "These adaptations improve survival under particular environmental conditions.",
        "Therefore, the correct answer is physiological adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-006",

    question:
      "Which of the following is an example of a behavioural adaptation?",

    options: [
      {
        id: "A",
        text: "The thick fur of a polar bear",
      },
      {
        id: "B",
        text: "The webbed feet of a duck",
      },
      {
        id: "C",
        text: "Seasonal migration of birds",
      },
      {
        id: "D",
        text: "The streamlined body of a fish",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Behavioural adaptations involve patterns of activity or behaviour that increase survival.",

      steps: [
        "Migration is a movement pattern performed by many animals.",
        "Birds may migrate to areas with greater food availability or more favourable conditions.",
        "This behaviour can increase survival and reproductive success.",
        "Fur, webbed feet and body shape are physical structures.",
        "Therefore, seasonal migration is the behavioural adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-007",

    question:
      "Which environmental factor can act as a selection pressure on a population?",

    options: [
      {
        id: "A",
        text: "Predation",
      },
      {
        id: "B",
        text: "Competition",
      },
      {
        id: "C",
        text: "Disease",
      },
      {
        id: "D",
        text: "All of the above",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "Selection pressures are environmental factors that influence which individuals are more likely to survive and reproduce.",

      steps: [
        "Predators can remove susceptible individuals from a population.",
        "Competition can make access to food, space or mates difficult.",
        "Disease can reduce the survival or reproductive success of susceptible individuals.",
        "All these factors can therefore influence natural selection.",
        "Hence, all of the options are possible selection pressures.",
      ],
    },
  },

  {
    id: "biology-evolution-008",

    question:
      "Why can individuals of the same species show different adaptations?",

    options: [
      {
        id: "A",
        text: "They always belong to different species",
      },
      {
        id: "B",
        text: "They may possess different inherited variations",
      },
      {
        id: "C",
        text: "Adaptations are never inherited",
      },
      {
        id: "D",
        text: "All individuals have identical genes",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Variation within a species provides the differences upon which natural selection can act.",

      steps: [
        "Individuals within a species are not genetically identical.",
        "Genetic variation can produce differences in characteristics.",
        "Some variations may provide advantages under particular environmental conditions.",
        "Individuals with advantageous inherited characteristics may have greater reproductive success.",
        "Therefore, differences in inherited variation can result in different adaptive characteristics.",
      ],
    },
  },

  {
    id: "biology-evolution-009",

    question:
      "What is natural selection?",

    options: [
      {
        id: "A",
        text: "The deliberate breeding of organisms by humans",
      },
      {
        id: "B",
        text: "The process by which organisms choose their own genes",
      },
      {
        id: "C",
        text: "The differential survival and reproduction of individuals with advantageous inherited variations",
      },
      {
        id: "D",
        text: "The movement of organisms to a new habitat",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Natural selection occurs when individuals with advantageous heritable characteristics are more likely to survive and reproduce.",

      steps: [
        "Individuals in a population show variation.",
        "Some variations give individuals an advantage under particular environmental conditions.",
        "Individuals with advantageous variations may survive and reproduce more successfully.",
        "Their advantageous alleles can become more common in subsequent generations.",
        "This process is called natural selection.",
      ],
    },
  },

  {
    id: "biology-evolution-010",

    question:
      "Which condition is necessary for natural selection to produce evolutionary change?",

    options: [
      {
        id: "A",
        text: "All individuals must be genetically identical",
      },
      {
        id: "B",
        text: "There must be heritable variation in the population",
      },
      {
        id: "C",
        text: "Every individual must have the same reproductive success",
      },
      {
        id: "D",
        text: "The environment must remain completely unchanged",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Natural selection requires variation that can be inherited by offspring.",

      steps: [
        "Individuals within a population show variation.",
        "For natural selection to change the population genetically, some variation must be heritable.",
        "Environmental conditions can favour some inherited characteristics over others.",
        "Individuals with advantageous characteristics may reproduce more successfully.",
        "Therefore, heritable variation is essential for evolutionary change through natural selection.",
      ],
    },
  },

  {
    id: "biology-evolution-011",

    question:
      "Which of the following best describes fitness in evolutionary biology?",

    options: [
      {
        id: "A",
        text: "The physical strength of an organism",
      },
      {
        id: "B",
        text: "The ability of an organism to run quickly",
      },
      {
        id: "C",
        text: "The reproductive success of an organism relative to others",
      },
      {
        id: "D",
        text: "The body size of an organism",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Biological fitness is mainly concerned with reproductive success rather than physical strength alone.",

      steps: [
        "An organism's evolutionary fitness is related to how successfully it contributes offspring to future generations.",
        "A physically strong organism is not necessarily more evolutionarily fit.",
        "An organism with greater reproductive success can pass its genes to more offspring.",
        "Therefore, reproductive success is the key component of evolutionary fitness.",
      ],
    },
  },

  {
    id: "biology-evolution-012",

    question:
      "Which statement correctly distinguishes adaptation from acclimatization?",

    options: [
      {
        id: "A",
        text: "Adaptation is always temporary, while acclimatization is inherited",
      },
      {
        id: "B",
        text: "Adaptation involves inherited characteristics, while acclimatization is usually an individual's response to environmental change",
      },
      {
        id: "C",
        text: "Both terms always refer to identical processes",
      },
      {
        id: "D",
        text: "Acclimatization occurs only through natural selection",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Adaptation and acclimatization describe different biological responses to environmental conditions.",

      steps: [
        "Adaptations are inherited characteristics that become established in populations over generations.",
        "Acclimatization is a change occurring within an individual in response to environmental conditions.",
        "Acclimatization does not normally involve a change in the genetic composition of a population.",
        "Therefore, inherited adaptation differs from individual acclimatization.",
      ],
    },
  },

  {
    id: "biology-evolution-013",

    question:
      "A population of insects develops resistance to an insecticide over several generations. Which process best explains this change?",

    options: [
      {
        id: "A",
        text: "Natural selection",
      },
      {
        id: "B",
        text: "Photosynthesis",
      },
      {
        id: "C",
        text: "Transpiration",
      },
      {
        id: "D",
        text: "Binary fission",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Insecticide resistance can increase in a population through natural selection when resistant insects survive and reproduce.",

      steps: [
        "Some insects may possess inherited resistance to the insecticide.",
        "The insecticide kills susceptible insects more readily.",
        "Resistant insects survive and reproduce.",
        "Their resistance alleles can become more common in later generations.",
        "This change is an example of natural selection.",
      ],
    },
  },

  {
    id: "biology-evolution-014",

    question:
      "Which statement about adaptation and the environment is correct?",

    options: [
      {
        id: "A",
        text: "An adaptation is always advantageous in every environment",
      },
      {
        id: "B",
        text: "The usefulness of an adaptation depends partly on environmental conditions",
      },
      {
        id: "C",
        text: "Adaptations have no relationship with environmental conditions",
      },
      {
        id: "D",
        text: "An organism can consciously create any adaptation it needs",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The advantage provided by an adaptation depends on the environment in which the organism lives.",

      steps: [
        "Environmental conditions differ between habitats.",
        "A characteristic that is advantageous in one environment may provide little or no advantage in another.",
        "For example, thick fur is useful in cold environments but may be disadvantageous in very hot conditions.",
        "Therefore, the usefulness of an adaptation depends partly on environmental conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-015",

    question:
      "Which of the following is most directly responsible for the appearance of new heritable variations in a population?",

    options: [
      {
        id: "A",
        text: "Mutation",
      },
      {
        id: "B",
        text: "Exercise",
      },
      {
        id: "C",
        text: "Learning",
      },
      {
        id: "D",
        text: "Temporary environmental exposure",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Mutations are changes in genetic material and can introduce new alleles into a population.",

      steps: [
        "Genes contain the information that determines inherited characteristics.",
        "A mutation is a change in genetic material.",
        "Some mutations can produce new alleles.",
        "If such mutations occur in cells that contribute to reproduction, they can be inherited.",
        "Therefore, mutation is a major source of new heritable variation.",
      ],
    },
  },

  // ============================================================
  // A02.2 Structural Adaptations in Plants — 30 Questions
  // IDs: biology-evolution-016 → 045
  // ============================================================

  {
    id: "biology-evolution-016",

    question:
      "Which structural feature of xerophytic plants helps to reduce water loss?",

    options: [
      {
        id: "A",
        text: "A thin cuticle",
      },
      {
        id: "B",
        text: "A thick waxy cuticle",
      },
      {
        id: "C",
        text: "Large exposed leaves",
      },
      {
        id: "D",
        text: "Numerous stomata on the upper surface",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Xerophytes are plants adapted to dry conditions, and a thick waxy cuticle helps reduce water loss.",

      steps: [
        "Water is lost from leaves mainly through transpiration.",
        "The waxy cuticle forms a relatively waterproof layer over the epidermis.",
        "A thick cuticle reduces the amount of water that can escape from the leaf surface.",
        "This is particularly useful in dry environments.",
        "Therefore, the correct answer is a thick waxy cuticle.",
      ],
    },
  },

  {
    id: "biology-evolution-017",

    question:
      "Why do many xerophytic plants have reduced leaf surfaces?",

    options: [
      {
        id: "A",
        text: "To increase water loss",
      },
      {
        id: "B",
        text: "To reduce the surface area available for transpiration",
      },
      {
        id: "C",
        text: "To prevent photosynthesis",
      },
      {
        id: "D",
        text: "To increase the absorption of sunlight by roots",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Reducing leaf surface area is an important structural adaptation for conserving water.",

      steps: [
        "Transpiration occurs mainly through leaf surfaces.",
        "A smaller leaf surface provides less area through which water can be lost.",
        "Some xerophytes have leaves modified into spines for this reason.",
        "The reduced leaf area also helps the plant conserve water during dry periods.",
        "Therefore, the correct answer is to reduce the surface area available for transpiration.",
      ],
    },
  },

  {
    id: "biology-evolution-018",

    question:
      "The leaves of many cactus plants are modified into spines. What is the main adaptive advantage of this modification?",

    options: [
      {
        id: "A",
        text: "It increases transpiration",
      },
      {
        id: "B",
        text: "It reduces water loss and can provide protection",
      },
      {
        id: "C",
        text: "It prevents the plant from absorbing minerals",
      },
      {
        id: "D",
        text: "It increases the size of the leaf surface",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Cactus spines are modified leaves that help the plant survive in dry environments.",

      steps: [
        "Ordinary broad leaves provide a large surface for transpiration.",
        "Cactus leaves are modified into spines, greatly reducing the leaf surface area.",
        "This helps conserve water.",
        "The spines can also discourage herbivores from feeding on the plant.",
        "Therefore, the modification reduces water loss and provides protection.",
      ],
    },
  },

  {
    id: "biology-evolution-019",

    question:
      "Which feature of a cactus stem allows it to function efficiently in a dry environment?",

    options: [
      {
        id: "A",
        text: "A large water-storage tissue",
      },
      {
        id: "B",
        text: "A very thin epidermis",
      },
      {
        id: "C",
        text: "A large number of broad leaves",
      },
      {
        id: "D",
        text: "A permanently open stomatal surface",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Succulent stems can store substantial amounts of water, allowing plants to survive periods of drought.",

      steps: [
        "Water may be scarce in desert environments.",
        "Cactus stems contain tissues capable of storing water.",
        "The stored water can be used during periods when external water is unavailable.",
        "The stem can also carry out photosynthesis because the leaves are highly reduced.",
        "Therefore, a large water-storage tissue is an important adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-020",

    question:
      "How does a deep root system help some desert plants survive?",

    options: [
      {
        id: "A",
        text: "It prevents the plant from absorbing water",
      },
      {
        id: "B",
        text: "It allows the roots to reach water deeper in the soil",
      },
      {
        id: "C",
        text: "It increases water loss from the leaves",
      },
      {
        id: "D",
        text: "It prevents mineral absorption",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Deep roots enable some plants to access water stored below the surface of dry soils.",

      steps: [
        "Surface soil may become very dry during drought.",
        "Water can remain available deeper underground.",
        "A deep root system can reach these lower water sources.",
        "This allows the plant to continue absorbing water when the upper soil layers are dry.",
        "Therefore, deep roots can be an important adaptation to dry conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-021",

    question:
      "Which root adaptation enables some desert plants to rapidly absorb water after rainfall?",

    options: [
      {
        id: "A",
        text: "A shallow, widely spreading root system",
      },
      {
        id: "B",
        text: "Complete absence of root hairs",
      },
      {
        id: "C",
        text: "A root system restricted to deep soil only",
      },
      {
        id: "D",
        text: "Roots that cannot branch",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A shallow, widely spreading root system can quickly absorb water from a large area after rainfall.",

      steps: [
        "Rainfall in some deserts may be brief and infrequent.",
        "Water may remain near the soil surface for only a short period.",
        "A widely spreading shallow root system covers a large surface area.",
        "This allows rapid uptake of available water.",
        "Therefore, a shallow, widely spreading root system is advantageous in such conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-022",

    question:
      "Which structural feature of mangrove plants helps them survive in waterlogged soils?",

    options: [
      {
        id: "A",
        text: "Pneumatophores",
      },
      {
        id: "B",
        text: "Leaf spines",
      },
      {
        id: "C",
        text: "Extremely thin roots without pores",
      },
      {
        id: "D",
        text: "Underground flowers",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Pneumatophores are specialized roots that project above the soil or water surface and help mangroves obtain oxygen.",

      steps: [
        "Waterlogged soils contain little available oxygen.",
        "Mangrove roots require oxygen for respiration.",
        "Pneumatophores grow upward and expose openings to the air.",
        "Oxygen can enter through these structures and reach underground tissues.",
        "Therefore, pneumatophores are an important adaptation to waterlogged conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-023",

    question:
      "Which structural adaptation helps floating aquatic plants remain on the water surface?",

    options: [
      {
        id: "A",
        text: "Large air spaces in tissues",
      },
      {
        id: "B",
        text: "Extremely dense tissues without air spaces",
      },
      {
        id: "C",
        text: "Very long underground stems only",
      },
      {
        id: "D",
        text: "A thick layer of desert spines",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Large air spaces reduce tissue density and provide buoyancy to many aquatic plants.",

      steps: [
        "Floating plants need to remain at or near the water surface.",
        "Large air spaces within their tissues contain air.",
        "These spaces reduce the overall density of the plant.",
        "The plant can therefore remain buoyant and access sunlight and carbon dioxide.",
        "Hence, large air spaces are an important adaptation for floating plants.",
      ],
    },
  },

  {
    id: "biology-evolution-024",

    question:
      "Why are many leaves of floating aquatic plants broad and flat?",

    options: [
      {
        id: "A",
        text: "To reduce exposure to sunlight",
      },
      {
        id: "B",
        text: "To maximize light absorption for photosynthesis",
      },
      {
        id: "C",
        text: "To prevent the leaves from floating",
      },
      {
        id: "D",
        text: "To stop gas exchange",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Broad floating leaves provide a large surface area for capturing sunlight.",

      steps: [
        "Photosynthesis requires light energy.",
        "A broad leaf provides a large surface exposed to sunlight.",
        "Floating leaves are positioned at the water surface where light availability is high.",
        "This arrangement can maximize light absorption.",
        "Therefore, broad flat leaves are useful for efficient photosynthesis.",
      ],
    },
  },

  {
    id: "biology-evolution-025",

    question:
      "Which feature of submerged aquatic plants helps them withstand water movement?",

    options: [
      {
        id: "A",
        text: "Flexible stems and narrow leaves",
      },
      {
        id: "B",
        text: "Rigid broad leaves only",
      },
      {
        id: "C",
        text: "Thick waxy spines",
      },
      {
        id: "D",
        text: "Large dry seeds exposed above water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Flexibility and narrow leaves reduce resistance to flowing water.",

      steps: [
        "Water movement can exert considerable force on aquatic plants.",
        "Flexible stems can bend with water currents instead of breaking.",
        "Narrow leaves present less resistance to moving water.",
        "These structural features therefore reduce mechanical damage.",
        "Hence, flexible stems and narrow leaves are useful adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-026",

    question:
      "Which adaptation helps reduce excessive water loss from the leaves of a xerophyte?",

    options: [
      {
        id: "A",
        text: "Sunken stomata",
      },
      {
        id: "B",
        text: "Exposed stomata on the upper surface",
      },
      {
        id: "C",
        text: "A thin cuticle",
      },
      {
        id: "D",
        text: "Very large leaf surfaces",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Sunken stomata reduce water loss by creating a more humid microenvironment around the stomatal openings.",

      steps: [
        "Stomata are openings through which gases enter and leave leaves.",
        "Water vapour can also escape through stomata.",
        "Sunken stomata are positioned below the leaf surface.",
        "This can reduce air movement around the stomata and lower the rate of water loss.",
        "Therefore, sunken stomata are useful xerophytic adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-027",

    question:
      "A plant has small leaves, a thick cuticle and deeply positioned stomata. What environment is it most likely adapted to?",

    options: [
      {
        id: "A",
        text: "A dry environment",
      },
      {
        id: "B",
        text: "A permanently flooded environment",
      },
      {
        id: "C",
        text: "A deep freshwater lake",
      },
      {
        id: "D",
        text: "A constantly shaded forest floor only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Small leaves, thick cuticles and sunken stomata are typical adaptations for reducing water loss.",

      steps: [
        "Small leaves reduce the surface area for transpiration.",
        "A thick cuticle reduces evaporation from the leaf surface.",
        "Sunken stomata can reduce water loss through the stomata.",
        "Together, these features indicate adaptation to water shortage.",
        "Therefore, the plant is most likely adapted to a dry environment.",
      ],
    },
  },

  {
    id: "biology-evolution-028",

    question:
      "Which structural adaptation of a plant is most directly associated with preventing herbivory?",

    options: [
      {
        id: "A",
        text: "Thorns",
      },
      {
        id: "B",
        text: "Air spaces",
      },
      {
        id: "C",
        text: "Pneumatophores",
      },
      {
        id: "D",
        text: "Broad floating leaves",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Thorns and similar structures can physically discourage animals from feeding on plants.",

      steps: [
        "Herbivores feed on plant tissues.",
        "Sharp structures such as thorns can make plants difficult or dangerous to eat.",
        "This reduces the likelihood of herbivory.",
        "Air spaces and pneumatophores have different primary functions.",
        "Therefore, thorns are the best answer.",
      ],
    },
  },

  {
    id: "biology-evolution-029",

    question:
      "Why may some plants in windy environments have flexible stems?",

    options: [
      {
        id: "A",
        text: "Flexibility allows the stem to bend without breaking easily",
      },
      {
        id: "B",
        text: "Flexibility prevents all photosynthesis",
      },
      {
        id: "C",
        text: "Flexible stems always increase water loss",
      },
      {
        id: "D",
        text: "Flexibility prevents reproduction",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Flexibility can reduce mechanical damage caused by strong winds.",

      steps: [
        "Strong winds exert forces on plant stems.",
        "Rigid stems may break when subjected to repeated bending forces.",
        "Flexible stems can bend with the wind and return toward their original position.",
        "This reduces the likelihood of breakage.",
        "Therefore, flexibility is an important structural adaptation in windy habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-030",

    question:
      "Which plant feature is most useful for maximizing absorption of light in a shaded environment?",

    options: [
      {
        id: "A",
        text: "Broad leaves with a large surface area",
      },
      {
        id: "B",
        text: "Leaves modified entirely into spines",
      },
      {
        id: "C",
        text: "A complete absence of chlorophyll",
      },
      {
        id: "D",
        text: "Very small photosynthetic surfaces",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Plants in shaded habitats may benefit from leaves that provide a large surface for capturing limited available light.",

      steps: [
        "Light intensity is often lower under dense vegetation.",
        "Photosynthesis requires light energy.",
        "A broad leaf can expose a large area to available light.",
        "This can improve the capture of limited light.",
        "Therefore, broad leaves are useful in many shaded environments.",
      ],
    },
  },

  {
    id: "biology-evolution-031",

    question:
      "What is the main advantage of extensive root hairs in plants?",

    options: [
      {
        id: "A",
        text: "They increase the surface area for absorption of water and mineral salts",
      },
      {
        id: "B",
        text: "They prevent all gas exchange",
      },
      {
        id: "C",
        text: "They reduce contact between roots and soil",
      },
      {
        id: "D",
        text: "They prevent mineral absorption",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Root hairs are specialized structures that greatly increase the surface area available for absorption.",

      steps: [
        "Water and mineral salts are absorbed from the soil through roots.",
        "Root hairs extend between soil particles.",
        "Their large combined surface area increases contact with soil water.",
        "This facilitates efficient absorption.",
        "Therefore, extensive root hairs increase the surface area for water and mineral uptake.",
      ],
    },
  },

  {
    id: "biology-evolution-032",

    question:
      "Which adaptation is particularly useful to plants growing in soils with high salt concentration?",

    options: [
      {
        id: "A",
        text: "Mechanisms that limit salt entry or remove excess salt",
      },
      {
        id: "B",
        text: "Permanent loss of all roots",
      },
      {
        id: "C",
        text: "Complete absence of water regulation",
      },
      {
        id: "D",
        text: "Unlimited absorption of salt ions",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Halophytes possess adaptations that allow them to survive in saline environments.",

      steps: [
        "High concentrations of salt can interfere with water uptake and cellular processes.",
        "Some salt-tolerant plants limit salt entry into sensitive tissues.",
        "Others can store, excrete or otherwise regulate excess salts.",
        "These mechanisms reduce the harmful effects of salinity.",
        "Therefore, limiting salt entry or removing excess salt is adaptive.",
      ],
    },
  },

  {
    id: "biology-evolution-033",

    question:
      "Which structural feature can help a climbing plant reach better-lit areas of a forest?",

    options: [
      {
        id: "A",
        text: "Clinging structures such as tendrils",
      },
      {
        id: "B",
        text: "Complete absence of stems",
      },
      {
        id: "C",
        text: "Leaf modification into underground roots",
      },
      {
        id: "D",
        text: "A thick desert cuticle only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Climbing structures allow plants to use other vegetation or supports to reach higher and better-lit positions.",

      steps: [
        "Light may be limited near the forest floor.",
        "Climbing plants can grow upward using other plants as support.",
        "Tendrils and similar structures help the plant attach to supports.",
        "The plant can then reach areas with greater light availability.",
        "Therefore, clinging structures such as tendrils are useful adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-034",

    question:
      "Why are some desert plant leaves covered with hairs?",

    options: [
      {
        id: "A",
        text: "The hairs can reduce air movement near the leaf surface and decrease water loss",
      },
      {
        id: "B",
        text: "The hairs always increase transpiration",
      },
      {
        id: "C",
        text: "The hairs prevent the plant from absorbing sunlight",
      },
      {
        id: "D",
        text: "The hairs eliminate the need for roots",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Leaf hairs can help reduce water loss by trapping a layer of still, humid air close to the leaf surface.",

      steps: [
        "Moving air can increase evaporation from leaf surfaces.",
        "Hairs can trap relatively still air near the surface.",
        "This can reduce the diffusion gradient for water vapour.",
        "Consequently, transpiration may be reduced.",
        "Therefore, leaf hairs can help conserve water in dry environments.",
      ],
    },
  },

  {
    id: "biology-evolution-035",

    question:
      "Which combination consists entirely of structural adaptations of xerophytes?",

    options: [
      {
        id: "A",
        text: "Thick cuticle, reduced leaves and sunken stomata",
      },
      {
        id: "B",
        text: "Migration, hibernation and courtship",
      },
      {
        id: "C",
        text: "Sweating, shivering and panting",
      },
      {
        id: "D",
        text: "Learning, memory and communication",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Xerophytes possess structural features that reduce water loss and improve water acquisition.",

      steps: [
        "A thick cuticle reduces evaporation.",
        "Reduced leaves decrease the surface area available for transpiration.",
        "Sunken stomata can reduce water loss through the stomatal openings.",
        "All three are physical structural features of plants.",
        "Therefore, the correct combination is thick cuticle, reduced leaves and sunken stomata.",
      ],
    },
  },

  // ============================================================
  // A02.3 Structural Adaptations in Animals — 30 Questions
  // IDs: biology-evolution-046 → 075
  // ============================================================

  {
    id: "biology-evolution-046",

    question:
      "Which structural feature of a fish is particularly useful for efficient movement through water?",

    options: [
      {
        id: "A",
        text: "A streamlined body",
      },
      {
        id: "B",
        text: "Broad flat feet",
      },
      {
        id: "C",
        text: "Large external ears",
      },
      {
        id: "D",
        text: "Heavy body covering",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A streamlined body reduces resistance as a fish moves through water.",

      steps: [
        "Water produces resistance against moving bodies.",
        "A streamlined shape reduces drag.",
        "This allows the fish to move more efficiently through water.",
        "The shape is therefore an important structural adaptation for aquatic locomotion.",
        "Hence, a streamlined body is the correct answer.",
      ],
    },
  },

  {
    id: "biology-evolution-047",

    question:
      "What is the main function of webbed feet in many aquatic birds?",

    options: [
      {
        id: "A",
        text: "To increase the surface area used to push against water",
      },
      {
        id: "B",
        text: "To reduce their ability to swim",
      },
      {
        id: "C",
        text: "To prevent movement in water",
      },
      {
        id: "D",
        text: "To increase body temperature directly",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Webbed feet provide a larger surface area for pushing against water during swimming.",

      steps: [
        "Swimming requires the bird to push water backward.",
        "Webbing between the toes increases the area of the foot.",
        "The larger surface pushes more water during the power stroke.",
        "This improves propulsion in water.",
        "Therefore, webbed feet are an important swimming adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-048",

    question:
      "Which structural adaptation helps a bird of prey tear flesh from its prey?",

    options: [
      {
        id: "A",
        text: "A hooked beak",
      },
      {
        id: "B",
        text: "A flat broad beak",
      },
      {
        id: "C",
        text: "Webbed toes",
      },
      {
        id: "D",
        text: "A long flexible tail only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Birds of prey possess strongly curved, hooked beaks suited to tearing flesh.",

      steps: [
        "Birds of prey commonly feed on animal tissues.",
        "Their hooked beaks can grip and tear flesh.",
        "This shape is suited to their feeding method.",
        "A flat broad beak is more characteristic of some other feeding strategies.",
        "Therefore, a hooked beak is the correct adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-049",

    question:
      "Which feature of a camel helps it survive in a desert environment?",

    options: [
      {
        id: "A",
        text: "Long eyelashes that help protect the eyes from sand",
      },
      {
        id: "B",
        text: "Large exposed sweat glands that constantly lose water",
      },
      {
        id: "C",
        text: "Very thin foot pads",
      },
      {
        id: "D",
        text: "A body designed to lose water rapidly",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Camels possess several structural adaptations to desert life, including long eyelashes that protect their eyes.",

      steps: [
        "Desert environments can contain blowing sand and dust.",
        "Long eyelashes help prevent sand particles from entering the eyes.",
        "This protects the eyes and helps the camel function in dusty conditions.",
        "Camels also possess other adaptations for conserving water and coping with heat.",
        "Therefore, long eyelashes are a useful structural adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-050",

    question:
      "Why do camels have broad, padded feet?",

    options: [
      {
        id: "A",
        text: "To prevent their feet from sinking deeply into soft sand",
      },
      {
        id: "B",
        text: "To make them sink faster",
      },
      {
        id: "C",
        text: "To increase heat loss through the feet",
      },
      {
        id: "D",
        text: "To allow them to swim more efficiently",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Broad padded feet distribute body weight over a larger area, making movement across soft sand easier.",

      steps: [
        "Soft desert sand can make walking difficult.",
        "Narrow feet would exert greater pressure on a small area.",
        "Broad feet distribute the camel's weight over a larger surface.",
        "This reduces sinking into soft sand.",
        "Therefore, broad padded feet facilitate movement across sandy terrain.",
      ],
    },
  },

  {
    id: "biology-evolution-051",

    question:
      "Which feature helps polar bears survive in very cold environments?",

    options: [
      {
        id: "A",
        text: "A thick layer of body fat",
      },
      {
        id: "B",
        text: "A thin layer of body fat",
      },
      {
        id: "C",
        text: "Large exposed skin surfaces",
      },
      {
        id: "D",
        text: "A complete absence of insulating tissue",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A thick layer of body fat provides insulation and reduces heat loss in cold environments.",

      steps: [
        "Cold environments increase the rate at which body heat can be lost.",
        "Fat is a relatively poor conductor of heat.",
        "A thick fat layer therefore acts as insulation.",
        "This helps maintain body temperature.",
        "Therefore, thick body fat is an important adaptation to cold conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-052",

    question:
      "Which structural feature helps aquatic mammals such as seals swim efficiently?",

    options: [
      {
        id: "A",
        text: "Streamlined bodies and flippers",
      },
      {
        id: "B",
        text: "Long narrow legs designed for running",
      },
      {
        id: "C",
        text: "Large wings",
      },
      {
        id: "D",
        text: "Hooves",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Streamlined bodies reduce drag while flippers provide surfaces for propulsion and steering.",

      steps: [
        "Water creates resistance to movement.",
        "A streamlined body reduces this resistance.",
        "Flippers help generate thrust and control movement.",
        "Together, these structures make swimming more efficient.",
        "Therefore, streamlined bodies and flippers are aquatic adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-053",

    question:
      "Which structural feature is characteristic of animals adapted for rapid running?",

    options: [
      {
        id: "A",
        text: "Strong elongated limbs",
      },
      {
        id: "B",
        text: "Short weak limbs",
      },
      {
        id: "C",
        text: "Webbed toes only",
      },
      {
        id: "D",
        text: "Large aquatic fins",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Strong elongated limbs can provide efficient stride length and propulsion in fast-running animals.",

      steps: [
        "Running requires the limbs to generate forward thrust.",
        "Strong limb muscles and appropriate limb proportions support rapid movement.",
        "Longer limbs can increase stride length in many running animals.",
        "These features improve locomotion on land.",
        "Therefore, strong elongated limbs are useful adaptations for rapid running.",
      ],
    },
  },

  {
    id: "biology-evolution-054",

    question:
      "What is the adaptive advantage of camouflage in animals?",

    options: [
      {
        id: "A",
        text: "It makes the animal easier for predators to locate",
      },
      {
        id: "B",
        text: "It can reduce detection by predators or prey",
      },
      {
        id: "C",
        text: "It prevents all movement",
      },
      {
        id: "D",
        text: "It eliminates competition",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Camouflage reduces the visual contrast between an organism and its surroundings.",

      steps: [
        "Predators often use visual cues to locate prey.",
        "Prey may also need to avoid detection while approaching food.",
        "Camouflage makes an organism less conspicuous against its background.",
        "This can increase survival or improve hunting success.",
        "Therefore, camouflage can reduce detection by predators or prey.",
      ],
    },
  },

  {
    id: "biology-evolution-055",

    question:
      "Which structural feature is most directly associated with burrowing animals?",

    options: [
      {
        id: "A",
        text: "Strong claws and powerful forelimbs",
      },
      {
        id: "B",
        text: "Large wings",
      },
      {
        id: "C",
        text: "Webbed feet only",
      },
      {
        id: "D",
        text: "Gills",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Burrowing animals need structures capable of moving and loosening soil.",

      steps: [
        "Burrowing involves digging through soil or other substrates.",
        "Powerful limbs can generate the force needed for digging.",
        "Strong claws can loosen and remove soil.",
        "These features therefore improve burrowing ability.",
        "Hence, strong claws and powerful forelimbs are appropriate adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-056",

    question:
      "Which structural feature of an owl can assist its nocturnal lifestyle?",

    options: [
      {
        id: "A",
        text: "Large eyes",
      },
      {
        id: "B",
        text: "Webbed feet",
      },
      {
        id: "C",
        text: "A broad flat beak for filtering water",
      },
      {
        id: "D",
        text: "Hooves",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Large eyes allow nocturnal birds to collect more available light under low-light conditions.",

      steps: [
        "Owls commonly hunt during periods of low light.",
        "Vision remains important for locating prey.",
        "Large eyes can collect and process more available light.",
        "This improves visual performance under dim conditions.",
        "Therefore, large eyes are an important structural adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-057",

    question:
      "Which feature of a woodpecker's beak is adapted for obtaining food from tree trunks?",

    options: [
      {
        id: "A",
        text: "A strong pointed beak",
      },
      {
        id: "B",
        text: "A soft flat beak",
      },
      {
        id: "C",
        text: "A wide filtering beak",
      },
      {
        id: "D",
        text: "A toothless grazing surface",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Woodpeckers use their strong pointed beaks to excavate wood and access insects and other food.",

      steps: [
        "Many woodpeckers obtain food from tree trunks.",
        "Their beaks must penetrate or chip hard wood.",
        "A strong pointed beak is well suited to this task.",
        "This structural feature improves access to food.",
        "Therefore, a strong pointed beak is the correct adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-058",

    question:
      "Why do ducks have an oily coating on their feathers?",

    options: [
      {
        id: "A",
        text: "It helps prevent the feathers from becoming waterlogged",
      },
      {
        id: "B",
        text: "It prevents all movement in water",
      },
      {
        id: "C",
        text: "It makes the feathers absorb water rapidly",
      },
      {
        id: "D",
        text: "It prevents the duck from floating",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Water-resistant feathers help aquatic birds remain insulated and functional while swimming.",

      steps: [
        "Water can penetrate feathers if they are not water-resistant.",
        "An oily coating makes the feather surface hydrophobic.",
        "This reduces water penetration and helps maintain insulation.",
        "It also helps the bird remain buoyant and comfortable in water.",
        "Therefore, the oily coating helps prevent the feathers from becoming waterlogged.",
      ],
    },
  },

  {
    id: "biology-evolution-059",

    question:
      "Which structural adaptation helps an animal living in a snowy environment remain less visible?",

    options: [
      {
        id: "A",
        text: "White body coloration",
      },
      {
        id: "B",
        text: "Bright red body coloration",
      },
      {
        id: "C",
        text: "Highly contrasting black and yellow stripes in all cases",
      },
      {
        id: "D",
        text: "Transparent wings only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "White coloration can provide camouflage against snow-covered surroundings.",

      steps: [
        "Predators and prey may detect animals partly through visual contrast.",
        "Snow is predominantly white.",
        "An animal with white coloration may blend into the snowy background.",
        "Reduced visibility can improve survival or hunting success.",
        "Therefore, white body coloration can be a useful structural adaptation in snowy habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-060",

    question:
      "Which structural feature helps some desert animals reduce contact with hot sand?",

    options: [
      {
        id: "A",
        text: "Long legs",
      },
      {
        id: "B",
        text: "Short legs",
      },
      {
        id: "C",
        text: "Large ears touching the ground",
      },
      {
        id: "D",
        text: "Webbed toes designed only for swimming",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Long legs can raise the body away from extremely hot ground surfaces.",

      steps: [
        "Desert sand can become extremely hot during the day.",
        "Reducing direct contact with the ground can reduce heat transfer to the body.",
        "Long legs raise the body farther from the hot surface.",
        "This can help reduce heat gain from the ground.",
        "Therefore, long legs can be advantageous in hot desert environments.",
      ],
    },
  },

  {
    id: "biology-evolution-061",

    question:
      "Which feature of a bat is adapted for flight?",

    options: [
      {
        id: "A",
        text: "A membrane stretched between elongated fingers",
      },
      {
        id: "B",
        text: "Hooves",
      },
      {
        id: "C",
        text: "Webbed hind feet only",
      },
      {
        id: "D",
        text: "A thick shell",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The wing of a bat is formed by a skin membrane supported by elongated finger bones.",

      steps: [
        "Flight requires a broad surface capable of interacting with air.",
        "Bats have elongated fingers that support a thin membrane.",
        "The membrane forms the wing surface.",
        "Movement of the wings generates lift and thrust.",
        "Therefore, the membrane stretched between elongated fingers is a flight adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-062",

    question:
      "Which structural feature helps a frog move efficiently through water?",

    options: [
      {
        id: "A",
        text: "Long hind limbs with webbed toes",
      },
      {
        id: "B",
        text: "Short rigid forelimbs only",
      },
      {
        id: "C",
        text: "Hooves",
      },
      {
        id: "D",
        text: "Feathered wings",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Frogs use their powerful hind limbs and webbed feet to generate thrust while swimming.",

      steps: [
        "Swimming requires the animal to push against water.",
        "The long hind limbs provide powerful strokes.",
        "Webbed toes increase the surface area of the feet.",
        "Together these structures improve propulsion through water.",
        "Therefore, long hind limbs with webbed toes are aquatic adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-063",

    question:
      "What is the main advantage of thick fur in mammals living in cold regions?",

    options: [
      {
        id: "A",
        text: "It provides insulation and reduces heat loss",
      },
      {
        id: "B",
        text: "It increases water loss",
      },
      {
        id: "C",
        text: "It prevents all movement",
      },
      {
        id: "D",
        text: "It increases heat loss from the body",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Thick fur traps air and provides insulation against cold environmental conditions.",

      steps: [
        "Heat naturally moves from warmer bodies toward cooler surroundings.",
        "Trapped air is a poor conductor of heat.",
        "Dense fur traps layers of air close to the body.",
        "This reduces the rate at which body heat is lost.",
        "Therefore, thick fur is an important adaptation to cold conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-064",

    question:
      "Which structural adaptation is particularly useful for animals that feed on nectar from flowers?",

    options: [
      {
        id: "A",
        text: "A long narrow feeding structure",
      },
      {
        id: "B",
        text: "A broad crushing jaw only",
      },
      {
        id: "C",
        text: "Large digging claws",
      },
      {
        id: "D",
        text: "Heavy hooves",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A long narrow feeding structure can reach nectar located deep inside tubular flowers.",

      steps: [
        "Some flowers store nectar at the bottom of long floral tubes.",
        "Animals must reach the nectar without damaging the flower excessively.",
        "A long narrow beak or proboscis can penetrate these floral tubes.",
        "This gives the animal access to nectar that other animals may not reach.",
        "Therefore, a long narrow feeding structure is an adaptive feature.",
      ],
    },
  },

  {
    id: "biology-evolution-065",

    question:
      "Which structural feature is commonly associated with grazing mammals?",

    options: [
      {
        id: "A",
        text: "Teeth adapted for cutting and grinding plant material",
      },
      {
        id: "B",
        text: "Long pointed fangs only",
      },
      {
        id: "C",
        text: "A hooked beak",
      },
      {
        id: "D",
        text: "A venomous sting",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Herbivorous mammals commonly have teeth specialized for processing plant material.",

      steps: [
        "Plant material often requires considerable mechanical breakdown.",
        "Incisors can cut vegetation while molars can grind it.",
        "This dental arrangement helps herbivores process plant food efficiently.",
        "Fangs are more associated with capturing or tearing prey.",
        "Therefore, teeth adapted for cutting and grinding are appropriate for grazing mammals.",
      ],
    },
  },

  {
    id: "biology-evolution-066",

    question:
      "Which structural adaptation enables a turtle to protect its body from predators?",

    options: [
      {
        id: "A",
        text: "A hard shell",
      },
      {
        id: "B",
        text: "Webbed wings",
      },
      {
        id: "C",
        text: "A soft exposed abdomen",
      },
      {
        id: "D",
        text: "Long external gills",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The turtle's shell provides strong physical protection for much of its body.",

      steps: [
        "Predators can injure exposed body tissues.",
        "The hard shell forms a protective covering around the turtle's body.",
        "The turtle can withdraw vulnerable parts into the shell in many species.",
        "This reduces the likelihood of serious injury.",
        "Therefore, the hard shell is an important protective adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-067",

    question:
      "Why do many snakes have elongated bodies without limbs?",

    options: [
      {
        id: "A",
        text: "The body shape facilitates movement through narrow spaces and certain habitats",
      },
      {
        id: "B",
        text: "It prevents all movement",
      },
      {
        id: "C",
        text: "It makes feeding impossible",
      },
      {
        id: "D",
        text: "It prevents snakes from living on land",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The elongated body and absence of limbs allow snakes to use specialized forms of locomotion suited to many environments.",

      steps: [
        "Snakes move by coordinated movements of their muscles and scales.",
        "Their elongated bodies allow them to pass through narrow spaces.",
        "This body design is useful for burrowing, moving through vegetation or travelling over various surfaces.",
        "Therefore, the elongated limbless form can provide ecological advantages.",
      ],
    },
  },

  {
    id: "biology-evolution-068",

    question:
      "Which structural feature helps a mole move through soil?",

    options: [
      {
        id: "A",
        text: "Broad powerful forefeet with claws",
      },
      {
        id: "B",
        text: "Large wings",
      },
      {
        id: "C",
        text: "Webbed fins",
      },
      {
        id: "D",
        text: "Long feathers",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Moles possess specialized forelimbs for digging through soil.",

      steps: [
        "Moles spend much of their lives underground.",
        "Their forelimbs must move and loosen soil.",
        "Broad powerful feet provide a large surface for pushing soil.",
        "Strong claws assist in digging.",
        "Therefore, broad powerful forefeet with claws are important adaptations for burrowing.",
      ],
    },
  },

  {
    id: "biology-evolution-069",

    question:
      "Which structural feature helps an eagle grasp and carry prey?",

    options: [
      {
        id: "A",
        text: "Strong curved talons",
      },
      {
        id: "B",
        text: "Flat webbed feet",
      },
      {
        id: "C",
        text: "Soft pads without claws",
      },
      {
        id: "D",
        text: "Hooves",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Birds of prey possess powerful talons that help them seize and hold prey.",

      steps: [
        "Eagles capture animals using their feet.",
        "Strong curved talons can grip prey securely.",
        "The claws can also penetrate the body of prey.",
        "This improves the eagle's ability to capture and carry food.",
        "Therefore, strong curved talons are the correct adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-070",

    question:
      "Which structural feature helps a whale maintain body temperature in cold water?",

    options: [
      {
        id: "A",
        text: "A thick layer of blubber",
      },
      {
        id: "B",
        text: "A thin layer of skin only",
      },
      {
        id: "C",
        text: "Large exposed ears",
      },
      {
        id: "D",
        text: "Feathers",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Blubber is a thick layer of fat that provides insulation in aquatic mammals.",

      steps: [
        "Water can remove heat from the body rapidly.",
        "Whales live in environments where water may be much colder than their body temperature.",
        "Fat is a relatively poor conductor of heat.",
        "A thick layer of blubber therefore reduces heat loss.",
        "Hence, blubber is an important cold-water adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-071",

    question:
      "Which structural adaptation is most useful for an animal that feeds by filtering small organisms from water?",

    options: [
      {
        id: "A",
        text: "Specialized filtering structures",
      },
      {
        id: "B",
        text: "Large stabbing claws only",
      },
      {
        id: "C",
        text: "A hooked carnivorous beak",
      },
      {
        id: "D",
        text: "Strong hooves",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Filter-feeding animals possess structures that allow food particles to be separated from large volumes of water.",

      steps: [
        "Filter feeders obtain food particles suspended in water.",
        "The animal needs a structure that permits water to pass while retaining food particles.",
        "Specialized filtering structures perform this function.",
        "This feeding mechanism allows efficient collection of small organisms.",
        "Therefore, specialized filtering structures are the appropriate adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-072",

    question:
      "Which feature of a desert fox can help reduce heat gain?",

    options: [
      {
        id: "A",
        text: "Large ears that increase heat dissipation",
      },
      {
        id: "B",
        text: "A thick layer of blubber",
      },
      {
        id: "C",
        text: "A complete absence of blood vessels near the skin",
      },
      {
        id: "D",
        text: "A thick insulating coat designed for polar regions",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Large ears provide a relatively large surface area through which heat can be transferred to the environment.",

      steps: [
        "Desert environments can become extremely hot.",
        "Animals must prevent excessive increases in body temperature.",
        "Large ears contain blood vessels close to the surface.",
        "Heat can be transferred from the blood to the surrounding air.",
        "Therefore, large ears can help dissipate heat.",
      ],
    },
  },

  {
    id: "biology-evolution-073",

    question:
      "Which structural adaptation is most directly associated with an animal that climbs trees?",

    options: [
      {
        id: "A",
        text: "Grasping feet or claws",
      },
      {
        id: "B",
        text: "Broad swimming fins",
      },
      {
        id: "C",
        text: "Heavy hooves only",
      },
      {
        id: "D",
        text: "Gills",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Grasping structures help arboreal animals maintain contact with branches.",

      steps: [
        "Tree-dwelling animals need to maintain their position on branches.",
        "Grasping feet, claws or similar structures can provide a secure grip.",
        "This reduces the risk of falling.",
        "Such structures also assist movement between branches.",
        "Therefore, grasping feet or claws are useful climbing adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-074",

    question:
      "Which structural feature can help an animal conserve water in a terrestrial environment?",

    options: [
      {
        id: "A",
        text: "A waterproof body covering",
      },
      {
        id: "B",
        text: "A permanently wet exposed surface",
      },
      {
        id: "C",
        text: "An extremely thin permeable covering",
      },
      {
        id: "D",
        text: "Permanent exposure of all body tissues",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A waterproof body covering limits evaporation and helps terrestrial animals retain body water.",

      steps: [
        "Terrestrial animals can lose water to the atmosphere.",
        "A waterproof outer covering reduces evaporation from body surfaces.",
        "This is particularly important in dry environments.",
        "Many terrestrial animals possess skin, scales or other structures that reduce water loss.",
        "Therefore, a waterproof body covering can be an important water-conserving adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-075",

    question:
      "Which combination contains structural adaptations for aquatic life?",

    options: [
      {
        id: "A",
        text: "Streamlined body, fins and waterproof body covering",
      },
      {
        id: "B",
        text: "Long legs, thick fur and hooves",
      },
      {
        id: "C",
        text: "Strong claws, digging feet and burrowing snout",
      },
      {
        id: "D",
        text: "Large ears, thick fur and padded feet",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Aquatic animals commonly possess structures that reduce drag, provide propulsion and allow them to function effectively in water.",

      steps: [
        "A streamlined body reduces resistance during swimming.",
        "Fins can provide propulsion, steering or stability.",
        "A waterproof covering can help protect the body and reduce unwanted water exchange.",
        "Together these features are associated with aquatic adaptation.",
        "Therefore, the correct combination is a streamlined body, fins and waterproof body covering.",
      ],
    },
  },

  // ============================================================
  // A02.4 Physiological Adaptations in Plants — 20 Questions
  // IDs: biology-evolution-076 → 095
  // ============================================================

  {
    id: "biology-evolution-076",

    question:
      "Which physiological adaptation helps some desert plants conserve water during periods of drought?",

    options: [
      {
        id: "A",
        text: "Reducing stomatal opening during periods of water shortage",
      },
      {
        id: "B",
        text: "Keeping all stomata permanently open",
      },
      {
        id: "C",
        text: "Increasing water loss deliberately",
      },
      {
        id: "D",
        text: "Stopping all cellular respiration",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Regulation of stomatal opening helps plants balance carbon dioxide uptake with water conservation.",

      steps: [
        "Carbon dioxide enters leaves mainly through stomata.",
        "Water vapour can also leave through the same openings.",
        "During drought, excessive stomatal opening can cause substantial water loss.",
        "Reducing stomatal opening can conserve water.",
        "Therefore, regulated reduction of stomatal opening is an important physiological adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-077",

    question:
      "What is the main physiological advantage of CAM photosynthesis in many desert plants?",

    options: [
      {
        id: "A",
        text: "It allows carbon dioxide uptake mainly at night, reducing daytime water loss",
      },
      {
        id: "B",
        text: "It completely prevents photosynthesis",
      },
      {
        id: "C",
        text: "It requires plants to lose more water during the day",
      },
      {
        id: "D",
        text: "It eliminates the need for carbon dioxide",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "CAM photosynthesis is an adaptation that helps plants conserve water in dry environments.",

      steps: [
        "Opening stomata during hot daytime conditions can result in substantial water loss.",
        "CAM plants commonly open their stomata at night when temperatures are lower.",
        "Carbon dioxide is taken up and stored in organic acids.",
        "During the day, the stored carbon dioxide can be used for photosynthesis while stomata remain more closed.",
        "Therefore, CAM photosynthesis helps reduce daytime water loss.",
      ],
    },
  },

  {
    id: "biology-evolution-078",

    question:
      "Which physiological response helps a plant tolerate temporary water shortage?",

    options: [
      {
        id: "A",
        text: "Reduction in metabolic activity",
      },
      {
        id: "B",
        text: "Permanent increase in transpiration",
      },
      {
        id: "C",
        text: "Continuous opening of stomata",
      },
      {
        id: "D",
        text: "Complete breakdown of all cells",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Reducing metabolic activity can help a plant conserve resources during periods of environmental stress.",

      steps: [
        "Water shortage limits the plant's ability to maintain normal physiological processes.",
        "Reducing certain metabolic activities lowers resource requirements.",
        "This can help the plant survive until favourable conditions return.",
        "The response does not mean that all metabolism stops.",
        "Therefore, reduction in metabolic activity can contribute to drought tolerance.",
      ],
    },
  },

  {
    id: "biology-evolution-079",

    question:
      "How can salt-tolerant plants deal physiologically with high concentrations of salt?",

    options: [
      {
        id: "A",
        text: "By regulating ion concentrations within their cells",
      },
      {
        id: "B",
        text: "By allowing unlimited salt accumulation in sensitive tissues",
      },
      {
        id: "C",
        text: "By stopping water uptake completely",
      },
      {
        id: "D",
        text: "By eliminating all cellular transport",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Salt-tolerant plants use physiological mechanisms to maintain suitable internal ion concentrations.",

      steps: [
        "Excess salt can disrupt enzyme activity and cellular water balance.",
        "Plants can regulate the movement and distribution of ions.",
        "Some species compartmentalize excess salts into particular tissues or cellular compartments.",
        "This protects sensitive metabolic processes.",
        "Therefore, regulation of ion concentrations is an important physiological adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-080",

    question:
      "Which physiological process helps some plants tolerate very low temperatures?",

    options: [
      {
        id: "A",
        text: "Production of substances that lower the freezing point of cell contents",
      },
      {
        id: "B",
        text: "Permanent opening of all stomata",
      },
      {
        id: "C",
        text: "Increased water loss through leaves",
      },
      {
        id: "D",
        text: "Complete removal of cellular water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Some plants produce solutes that help protect cells against damage caused by freezing temperatures.",

      steps: [
        "Freezing can cause ice formation and cellular damage.",
        "Certain solutes can lower the freezing point of cellular fluids.",
        "These substances help reduce the risk of damaging ice formation.",
        "This improves the plant's ability to survive cold conditions.",
        "Therefore, production of protective solutes is a physiological adaptation to low temperature.",
      ],
    },
  },








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

  {
    id: "biology-evolution-071",

    question:
      "Which adaptation would be most useful to a plant living in a very dry desert environment?",

    options: [
      {
        id: "A",
        text: "Large, thin leaves",
      },
      {
        id: "B",
        text: "A thick waxy cuticle",
      },
      {
        id: "C",
        text: "Numerous open stomata during the day",
      },
      {
        id: "D",
        text: "A shallow root system",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Desert plants have adaptations that reduce water loss and help them survive prolonged periods of water shortage.",

      steps: [
        "Desert environments have very limited water availability.",
        "A thick waxy cuticle reduces evaporation from the plant surface.",
        "Large thin leaves would increase water loss.",
        "Numerous open stomata during the day would increase transpiration.",
        "A shallow root system would be less effective at accessing deeper water sources.",
        "Therefore, a thick waxy cuticle is the most suitable adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-072",

    question:
      "Which feature enables camels to survive for long periods in hot desert environments?",

    options: [
      {
        id: "A",
        text: "Very large ears that continuously release heat",
      },
      {
        id: "B",
        text: "Ability to conserve water by producing concentrated urine",
      },
      {
        id: "C",
        text: "Continuous sweating throughout the day",
      },
      {
        id: "D",
        text: "Thin skin with many exposed blood vessels",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Camels possess several physiological adaptations that enable them to conserve water in hot, dry environments.",

      steps: [
        "Water is scarce in desert environments.",
        "Camels reduce water loss by producing highly concentrated urine.",
        "Their kidneys are adapted to reabsorb large amounts of water.",
        "Continuous sweating would cause excessive water loss.",
        "Therefore, producing concentrated urine is an important adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-073",

    question:
      "Which adaptation helps Arctic mammals reduce heat loss in extremely cold environments?",

    options: [
      {
        id: "A",
        text: "A thick layer of insulating fat",
      },
      {
        id: "B",
        text: "Large exposed ears",
      },
      {
        id: "C",
        text: "A thin coat of fur",
      },
      {
        id: "D",
        text: "Reduced body insulation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Animals living in extremely cold environments need adaptations that reduce heat loss.",

      steps: [
        "Cold environments cause animals to lose body heat rapidly.",
        "A thick layer of fat acts as thermal insulation.",
        "The insulating layer reduces the movement of heat from the body to the environment.",
        "Large exposed ears can increase heat loss.",
        "Therefore, a thick layer of insulating fat is advantageous.",
      ],
    },
  },

  {
    id: "biology-evolution-074",

    question:
      "Why do many desert plants have reduced leaves or spines?",

    options: [
      {
        id: "A",
        text: "To increase the surface area for transpiration",
      },
      {
        id: "B",
        text: "To reduce water loss",
      },
      {
        id: "C",
        text: "To increase water absorption through the leaves",
      },
      {
        id: "D",
        text: "To prevent photosynthesis",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Reducing leaf surface area is an important structural adaptation of many desert plants.",

      steps: [
        "Transpiration causes water to be lost from plant surfaces.",
        "Desert plants must conserve their limited water supply.",
        "Reduced leaves or spines provide a smaller surface area through which water can be lost.",
        "Spines can also provide protection from herbivores.",
        "Therefore, reduced leaves or spines help conserve water.",
      ],
    },
  },

  {
    id: "biology-evolution-075",

    question:
      "Which adaptation is particularly important for fish living in very cold water?",

    options: [
      {
        id: "A",
        text: "Production of antifreeze substances in body fluids",
      },
      {
        id: "B",
        text: "Complete absence of body fluids",
      },
      {
        id: "C",
        text: "Permanent exposure of the gills to dry air",
      },
      {
        id: "D",
        text: "Reduction of all metabolic activity to zero",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Some fish living in extremely cold waters produce substances that prevent ice crystals from forming in their body fluids.",

      steps: [
        "Extremely cold water can cause body fluids to freeze.",
        "Freezing can damage cells and tissues.",
        "Some cold-water fish produce antifreeze proteins or related substances.",
        "These substances lower the freezing point of body fluids and inhibit ice formation.",
        "Therefore, production of antifreeze substances is an important adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-076",

    question:
      "Which characteristic would provide the greatest advantage to a plant growing in a saline environment?",

    options: [
      {
        id: "A",
        text: "Ability to tolerate high concentrations of salt",
      },
      {
        id: "B",
        text: "Very high water loss through transpiration",
      },
      {
        id: "C",
        text: "Absence of mechanisms for regulating ions",
      },
      {
        id: "D",
        text: "Extremely thin roots with no salt tolerance",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Plants growing in salty environments require adaptations that allow them to maintain water and ion balance.",

      steps: [
        "High salt concentrations can interfere with water uptake by plant roots.",
        "Excessive salt can also damage plant cells.",
        "Salt-tolerant plants possess mechanisms for controlling or excluding harmful ions.",
        "These mechanisms allow them to maintain suitable internal conditions.",
        "Therefore, tolerance of high salt concentrations is advantageous.",
      ],
    },
  },

  {
    id: "biology-evolution-077",

    question:
      "Which adaptation would help an animal survive in an environment where temperatures are extremely high during the day?",

    options: [
      {
        id: "A",
        text: "Being active mainly during the hottest part of the day",
      },
      {
        id: "B",
        text: "Being nocturnal",
      },
      {
        id: "C",
        text: "Increasing unnecessary water loss",
      },
      {
        id: "D",
        text: "Having no mechanism for cooling the body",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Changing the time of activity can help animals avoid extreme environmental temperatures.",

      steps: [
        "Daytime temperatures in some hot environments can become extremely high.",
        "High temperatures increase the risk of overheating and dehydration.",
        "Nocturnal animals are active mainly at night when temperatures are lower.",
        "This reduces exposure to extreme daytime heat.",
        "Therefore, being nocturnal can improve survival in very hot environments.",
      ],
    },
  },

  {
    id: "biology-evolution-078",

    question:
      "How does a thick layer of fur help mammals living in very cold environments?",

    options: [
      {
        id: "A",
        text: "It increases heat loss from the body",
      },
      {
        id: "B",
        text: "It traps air and reduces heat loss",
      },
      {
        id: "C",
        text: "It prevents all body heat production",
      },
      {
        id: "D",
        text: "It increases water loss from the skin",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Fur provides insulation by trapping air close to the animal's body.",

      steps: [
        "Air is a relatively poor conductor of heat.",
        "Dense fur traps a layer of air close to the body.",
        "The trapped air reduces the rate at which heat escapes.",
        "This helps maintain a suitable internal body temperature.",
        "Therefore, thick fur is an effective adaptation to cold conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-079",

    question:
      "Which feature of a mangrove plant helps it survive in waterlogged, oxygen-poor soil?",

    options: [
      {
        id: "A",
        text: "Pneumatophores that allow gaseous exchange",
      },
      {
        id: "B",
        text: "Complete absence of roots",
      },
      {
        id: "C",
        text: "Very small leaves with no stomata",
      },
      {
        id: "D",
        text: "Roots that cannot reach the soil surface",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Mangrove plants live in waterlogged soils where oxygen availability around the roots is often very low.",

      steps: [
        "Waterlogged soil contains less oxygen than well-aerated soil.",
        "Roots require oxygen for aerobic respiration.",
        "Mangroves develop specialized aerial roots called pneumatophores.",
        "These roots project above the soil or water surface and facilitate gaseous exchange.",
        "Therefore, pneumatophores help mangroves survive in oxygen-poor soils.",
      ],
    },
  },

  {
    id: "biology-evolution-080",

    question:
      "Which adaptation is most likely to be found in an animal living at high altitude where oxygen concentration is low?",

    options: [
      {
        id: "A",
        text: "Reduced ability to transport oxygen",
      },
      {
        id: "B",
        text: "Increased efficiency of oxygen uptake and transport",
      },
      {
        id: "C",
        text: "Complete loss of respiratory organs",
      },
      {
        id: "D",
        text: "Reduced blood supply to respiratory surfaces",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Animals living at high altitudes need adaptations that improve oxygen uptake and transport because atmospheric oxygen availability is reduced.",

      steps: [
        "Atmospheric pressure decreases as altitude increases.",
        "This makes oxygen uptake more difficult.",
        "Animals living at high altitudes may have adaptations that improve oxygen absorption and transport.",
        "Greater efficiency of the respiratory and circulatory systems helps supply tissues with oxygen.",
        "Therefore, increased efficiency of oxygen uptake and transport is advantageous.",
      ],
    },
  },

  {
    id: "biology-evolution-081",

    question:
      "Which adaptation would be most useful to a plant growing in an environment with frequent flooding?",

    options: [
      {
        id: "A",
        text: "Roots adapted to obtain oxygen from above the waterlogged soil",
      },
      {
        id: "B",
        text: "Roots that require large amounts of oxygen from dry soil",
      },
      {
        id: "C",
        text: "Leaves that cannot tolerate water",
      },
      {
        id: "D",
        text: "Complete absence of air spaces in plant tissues",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Frequent flooding can reduce the amount of oxygen available to plant roots.",

      steps: [
        "Floodwater fills the spaces between soil particles.",
        "This restricts the movement of oxygen into the soil.",
        "Roots may therefore experience oxygen deficiency.",
        "Aerial or specialized roots can obtain oxygen from the atmosphere.",
        "Such adaptations allow plants to continue respiration during flooding.",
        "Therefore, roots adapted to obtain oxygen above waterlogged soil are advantageous.",
      ],
    },
  },

  {
    id: "biology-evolution-082",

    question:
      "Which physiological response helps a mammal maintain a stable body temperature in very cold conditions?",

    options: [
      {
        id: "A",
        text: "Shivering to generate heat",
      },
      {
        id: "B",
        text: "Permanent cessation of respiration",
      },
      {
        id: "C",
        text: "Continuous dilation of surface blood vessels",
      },
      {
        id: "D",
        text: "Complete loss of body insulation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Shivering is a physiological response that generates heat when body temperature falls.",

      steps: [
        "Cold conditions increase the rate of heat loss from the body.",
        "Skeletal muscles undergo rapid involuntary contractions during shivering.",
        "Muscle activity releases heat.",
        "The additional heat helps maintain body temperature.",
        "Therefore, shivering is an important response to cold conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-083",

    question:
      "Why do some desert animals have very efficient kidneys?",

    options: [
      {
        id: "A",
        text: "To increase water loss in the urine",
      },
      {
        id: "B",
        text: "To conserve water by producing concentrated urine",
      },
      {
        id: "C",
        text: "To prevent the digestion of food",
      },
      {
        id: "D",
        text: "To eliminate all salts from the body",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Efficient kidneys help desert animals conserve the limited water available in their environment.",

      steps: [
        "Water is scarce in desert environments.",
        "Animals must minimize unnecessary water loss.",
        "Efficient kidneys reabsorb more water from the filtrate.",
        "This results in a smaller volume of more concentrated urine.",
        "Therefore, efficient kidneys help desert animals conserve water.",
      ],
    },
  },

  {
    id: "biology-evolution-084",

    question:
      "Which combination of adaptations would best help an animal survive in a cold environment?",

    options: [
      {
        id: "A",
        text: "Thin fur and large exposed ears",
      },
      {
        id: "B",
        text: "Thick fur and a layer of insulating fat",
      },
      {
        id: "C",
        text: "Large surface area and continuous sweating",
      },
      {
        id: "D",
        text: "Reduced insulation and increased heat loss",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Cold-adapted animals commonly possess several features that reduce heat loss.",

      steps: [
        "Cold environments increase the risk of excessive heat loss.",
        "Thick fur traps insulating air close to the body.",
        "A layer of body fat provides additional thermal insulation.",
        "Together, these adaptations reduce heat loss.",
        "Thin fur and large exposed body surfaces would generally increase heat loss.",
        "Therefore, thick fur and insulating fat provide the best combination.",
      ],
    },
  },

  {
    id: "biology-evolution-085",

    question:
      "An organism living in an extremely hot and dry environment has a low metabolic rate during the hottest part of the day and becomes active at night. What is the main advantage of this pattern?",

    options: [
      {
        id: "A",
        text: "It increases exposure to extreme heat",
      },
      {
        id: "B",
        text: "It reduces energy and water loss associated with heat stress",
      },
      {
        id: "C",
        text: "It prevents the organism from obtaining food",
      },
      {
        id: "D",
        text: "It increases evaporation from the body",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Reducing activity during extreme heat and becoming active at night is an effective adaptation to hot, dry environments.",

      steps: [
        "Extremely hot conditions increase the risk of overheating and dehydration.",
        "Lower metabolic activity during the hottest period can reduce heat production and energy expenditure.",
        "Remaining inactive during the day also reduces exposure to intense environmental heat.",
        "Night-time activity occurs when temperatures are generally lower.",
        "This helps reduce heat and water stress while allowing the organism to feed and perform other activities.",
        "Therefore, the adaptation reduces energy and water loss associated with heat stress.",
      ],
    },
  },

  {
    id: "biology-evolution-086",

    question:
      "What is the main advantage of camouflage to an organism?",

    options: [
      {
        id: "A",
        text: "It makes the organism more visible to predators",
      },
      {
        id: "B",
        text: "It helps the organism blend with its surroundings",
      },
      {
        id: "C",
        text: "It prevents the organism from reproducing",
      },
      {
        id: "D",
        text: "It increases the organism's body temperature",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Camouflage is an adaptation that makes an organism less noticeable in its environment.",

      steps: [
        "Camouflage involves coloration, patterns, shapes or structures that resemble the surroundings.",
        "An organism that is difficult to detect is less likely to be noticed by predators.",
        "Camouflage can also help predators approach prey without being detected.",
        "Therefore, camouflage mainly helps an organism blend with its surroundings.",
      ],
    },
  },

  {
    id: "biology-evolution-087",

    question:
      "Which of the following is an example of camouflage?",

    options: [
      {
        id: "A",
        text: "A green grasshopper blending with green vegetation",
      },
      {
        id: "B",
        text: "A peacock displaying its brightly coloured feathers",
      },
      {
        id: "C",
        text: "A bee producing honey",
      },
      {
        id: "D",
        text: "A bird building a nest",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Camouflage occurs when an organism's appearance makes it difficult to distinguish from its surroundings.",

      steps: [
        "A green grasshopper may have body coloration similar to green leaves and grasses.",
        "This similarity makes the grasshopper difficult for predators to detect.",
        "The other examples describe courtship, feeding or nesting behaviours rather than camouflage.",
        "Therefore, the green grasshopper blending with vegetation is an example of camouflage.",
      ],
    },
  },

  {
    id: "biology-evolution-088",

    question:
      "What is mimicry in biological adaptation?",

    options: [
      {
        id: "A",
        text: "The production of identical offspring by all organisms",
      },
      {
        id: "B",
        text: "The resemblance of one organism to another organism or feature that provides an advantage",
      },
      {
        id: "C",
        text: "The movement of organisms from one habitat to another",
      },
      {
        id: "D",
        text: "The complete disappearance of an organism from its habitat",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Mimicry occurs when one organism resembles another organism or object in a way that provides a survival or reproductive advantage.",

      steps: [
        "Mimicry involves resemblance between organisms or between an organism and part of its environment.",
        "The resemblance may protect the organism from predators or help it obtain food.",
        "For example, a harmless species may resemble a harmful or unpalatable species.",
        "Therefore, mimicry is the resemblance of one organism to another organism or feature that provides an advantage.",
      ],
    },
  },

  {
    id: "biology-evolution-089",

    question:
      "A harmless insect resembles a brightly coloured poisonous insect. What advantage may this provide?",

    options: [
      {
        id: "A",
        text: "Predators may avoid it because they mistake it for the poisonous species",
      },
      {
        id: "B",
        text: "It becomes unable to reproduce",
      },
      {
        id: "C",
        text: "It becomes more attractive to all predators",
      },
      {
        id: "D",
        text: "It loses the ability to obtain food",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A harmless organism can gain protection by resembling a dangerous or unpalatable organism.",

      steps: [
        "Predators may have learned to avoid the brightly coloured poisonous insect.",
        "A harmless insect with a similar appearance may be mistaken for the poisonous species.",
        "The predator may therefore avoid attacking the harmless insect.",
        "This increases the harmless insect's chance of survival.",
        "Therefore, the main advantage is predator avoidance.",
      ],
    },
  },

  {
    id: "biology-evolution-090",

    question:
      "Which structure provides physical protection against predators in many animals?",

    options: [
      {
        id: "A",
        text: "A protective shell",
      },
      {
        id: "B",
        text: "A transparent blood vessel",
      },
      {
        id: "C",
        text: "A digestive enzyme",
      },
      {
        id: "D",
        text: "A respiratory pigment",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Physical structures such as shells provide mechanical protection against predators.",

      steps: [
        "A shell forms a hard external covering around certain animals.",
        "The hard covering can make it difficult for predators to reach soft body tissues.",
        "Snails and some other organisms use shells as protective structures.",
        "The other options perform physiological functions rather than providing direct mechanical protection.",
        "Therefore, a protective shell is the correct answer.",
      ],
    },
  },

  {
    id: "biology-evolution-091",

    question:
      "Why do some animals have warning coloration?",

    options: [
      {
        id: "A",
        text: "To make them easier for predators to attack",
      },
      {
        id: "B",
        text: "To warn predators that they may be dangerous, poisonous or unpalatable",
      },
      {
        id: "C",
        text: "To prevent them from obtaining food",
      },
      {
        id: "D",
        text: "To increase their rate of water loss",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Warning coloration is a protective adaptation that signals potential danger or unpalatability to predators.",

      steps: [
        "Some organisms contain toxins, venom or substances that make them unpalatable.",
        "Bright colours can act as visual warning signals to predators.",
        "Predators that recognize the signal may avoid attacking the organism.",
        "This reduces the likelihood of predation.",
        "Therefore, warning coloration helps signal that an organism may be dangerous or unpalatable.",
      ],
    },
  },

  {
    id: "biology-evolution-092",

    question:
      "Which of the following is most likely to be an example of protective coloration?",

    options: [
      {
        id: "A",
        text: "A white Arctic hare blending into snow",
      },
      {
        id: "B",
        text: "A brightly coloured flower attracting insects",
      },
      {
        id: "C",
        text: "A bird singing to attract a mate",
      },
      {
        id: "D",
        text: "A fish swimming rapidly through water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Protective coloration reduces the likelihood that an organism will be detected by predators.",

      steps: [
        "Snow provides a predominantly white background in Arctic environments.",
        "A white coat allows an Arctic hare to blend into this background.",
        "Predators may find the hare more difficult to detect.",
        "The other examples mainly involve attraction, reproduction or movement.",
        "Therefore, the white Arctic hare is an example of protective coloration.",
      ],
    },
  },

  {
    id: "biology-evolution-093",

    question:
      "How does mimicry differ from simple camouflage?",

    options: [
      {
        id: "A",
        text: "Mimicry involves resemblance to another organism or recognizable feature, while camouflage involves blending with the surroundings",
      },
      {
        id: "B",
        text: "Camouflage always involves poisonous organisms",
      },
      {
        id: "C",
        text: "Mimicry prevents all forms of reproduction",
      },
      {
        id: "D",
        text: "There is no difference between them",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Both camouflage and mimicry can provide protection, but they involve different forms of resemblance.",

      steps: [
        "Camouflage generally makes an organism difficult to distinguish from its surroundings.",
        "Mimicry involves an organism resembling another organism or recognizable feature.",
        "For example, a harmless insect may resemble a dangerous insect.",
        "Therefore, mimicry and camouflage are related but distinct adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-094",

    question:
      "Which adaptation is most likely to protect a porcupine from predators?",

    options: [
      {
        id: "A",
        text: "Sharp quills",
      },
      {
        id: "B",
        text: "Thin transparent skin",
      },
      {
        id: "C",
        text: "Reduced skeletal support",
      },
      {
        id: "D",
        text: "Soft exposed tissues",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Sharp external structures can discourage predators from attacking an organism.",

      steps: [
        "Porcupines possess modified hairs called quills.",
        "The quills are sharp and can cause injury to predators.",
        "A predator may therefore avoid attacking or approaching the porcupine.",
        "This increases the animal's chances of survival.",
        "Therefore, sharp quills provide an important protective adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-095",

    question:
      "A moth has wing markings that closely resemble the eyes of a much larger animal. What is the likely function of this adaptation?",

    options: [
      {
        id: "A",
        text: "To make the moth appear larger or threatening to predators",
      },
      {
        id: "B",
        text: "To increase water loss",
      },
      {
        id: "C",
        text: "To prevent the moth from feeding",
      },
      {
        id: "D",
        text: "To reduce the size of the moth",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Eye-like markings can startle or confuse predators and reduce the likelihood of attack.",

      steps: [
        "Some moths have prominent eye-like patterns on their wings.",
        "When exposed, these markings may make the moth appear larger or resemble the eyes of a larger animal.",
        "A predator may become startled or hesitate to attack.",
        "This can increase the moth's chance of escaping.",
        "Therefore, the markings function as a protective adaptation.",
      ],
    },
  },

  {
    id: "biology-evolution-096",

    question:
      "Which of the following best illustrates Batesian mimicry?",

    options: [
      {
        id: "A",
        text: "A harmless insect resembling a harmful insect",
      },
      {
        id: "B",
        text: "Two harmful species resembling each other",
      },
      {
        id: "C",
        text: "An animal changing location during migration",
      },
      {
        id: "D",
        text: "A plant producing seeds after fertilization",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Batesian mimicry occurs when a harmless species resembles a harmful, poisonous or unpalatable species.",

      steps: [
        "The model species is harmful, poisonous or otherwise avoided by predators.",
        "The mimic is harmless but resembles the model.",
        "Predators that avoid the model may also avoid the mimic.",
        "The mimic therefore gains protection without possessing the harmful characteristics itself.",
        "Therefore, a harmless insect resembling a harmful insect illustrates Batesian mimicry.",
      ],
    },
  },

  {
    id: "biology-evolution-097",

    question:
      "Which example best demonstrates Müllerian mimicry?",

    options: [
      {
        id: "A",
        text: "Several harmful species sharing similar warning coloration",
      },
      {
        id: "B",
        text: "A harmless species resembling a harmful species",
      },
      {
        id: "C",
        text: "A plant resembling a rock",
      },
      {
        id: "D",
        text: "A bird hiding inside a tree hollow",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Müllerian mimicry occurs when two or more genuinely harmful or unpalatable species share similar warning signals.",

      steps: [
        "Several harmful species may have similar warning colours or patterns.",
        "Predators learn to avoid the shared warning pattern.",
        "This benefits each harmful species because predators more quickly learn the warning signal.",
        "Unlike Batesian mimicry, the species involved are themselves harmful or unpalatable.",
        "Therefore, several harmful species sharing similar warning coloration illustrate Müllerian mimicry.",
      ],
    },
  },

  {
    id: "biology-evolution-098",

    question:
      "Why can camouflage increase the survival rate of prey organisms?",

    options: [
      {
        id: "A",
        text: "It makes prey easier to locate",
      },
      {
        id: "B",
        text: "It reduces the probability that predators will detect them",
      },
      {
        id: "C",
        text: "It prevents predators from reproducing",
      },
      {
        id: "D",
        text: "It eliminates the need for food",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Camouflage provides an advantage by reducing the visibility of prey to predators.",

      steps: [
        "Predators must usually detect prey before they can attack.",
        "Camouflaged prey are more difficult to distinguish from their surroundings.",
        "Reduced detection lowers the probability of successful predation.",
        "Individuals that avoid predation are more likely to survive and reproduce.",
        "Therefore, camouflage can increase the survival rate of prey organisms.",
      ],
    },
  },

  {
    id: "biology-evolution-099",

    question:
      "Which feature of a skunk is primarily a chemical defence against predators?",

    options: [
      {
        id: "A",
        text: "Its ability to produce a foul-smelling spray",
      },
      {
        id: "B",
        text: "Its skeletal system",
      },
      {
        id: "C",
        text: "Its digestive tract",
      },
      {
        id: "D",
        text: "Its teeth used for chewing food",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Chemical defence involves producing substances that discourage predators from attacking.",

      steps: [
        "Skunks possess specialized glands that produce a strong-smelling defensive spray.",
        "The spray can irritate or disorient potential predators.",
        "Predators learn to avoid animals associated with this unpleasant defence.",
        "This reduces the risk of predation.",
        "Therefore, the foul-smelling spray is a chemical defence mechanism.",
      ],
    },
  },

  {
    id: "biology-evolution-100",

    question:
      "An insect closely resembles a twig in colour and shape. What is the most likely benefit of this adaptation?",

    options: [
      {
        id: "A",
        text: "It allows the insect to remain hidden from predators",
      },
      {
        id: "B",
        text: "It makes the insect more attractive to predators",
      },
      {
        id: "C",
        text: "It prevents the insect from obtaining oxygen",
      },
      {
        id: "D",
        text: "It increases the insect's body temperature permanently",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Resembling an environmental object can make an organism difficult for predators to detect.",

      steps: [
        "The insect has a body shape and colour similar to a twig.",
        "This makes it difficult to distinguish from branches or plant stems.",
        "Predators may overlook the insect because it blends into the environment.",
        "Reduced detection increases its chance of surviving.",
        "Therefore, the adaptation allows the insect to remain hidden from predators.",
      ],
    },
  },


  {
    id: "biology-evolution-101",

    question:
      "What is the main reason organisms are distributed differently across different habitats?",

    options: [
      {
        id: "A",
        text: "All organisms require exactly the same environmental conditions",
      },
      {
        id: "B",
        text: "Different organisms possess adaptations suited to particular environmental conditions",
      },
      {
        id: "C",
        text: "Organisms can survive equally well in every habitat",
      },
      {
        id: "D",
        text: "Habitats have no effect on the survival of organisms",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The distribution of organisms is strongly influenced by their adaptations to environmental conditions.",

      steps: [
        "Habitats differ in factors such as temperature, water availability, light, soil and food.",
        "Organisms possess adaptations that allow them to survive under particular conditions.",
        "An organism is more likely to establish a population where environmental conditions match its requirements.",
        "Therefore, different organisms are distributed differently because their adaptations suit different habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-102",

    question:
      "Which factor is most likely to determine whether a particular plant species can survive in a habitat?",

    options: [
      {
        id: "A",
        text: "Availability of suitable environmental conditions",
      },
      {
        id: "B",
        text: "The colour of the plant's flowers alone",
      },
      {
        id: "C",
        text: "The number of unrelated species in the habitat alone",
      },
      {
        id: "D",
        text: "The age of the habitat alone",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Plants can survive only where environmental conditions fall within the range they can tolerate.",

      steps: [
        "Plants require suitable levels of light, water, temperature, minerals and other resources.",
        "Each species has a range of environmental conditions within which it can survive and reproduce.",
        "If conditions fall outside this range, growth and reproduction may be reduced.",
        "Therefore, suitable environmental conditions are an important determinant of plant distribution.",
      ],
    },
  },

  {
    id: "biology-evolution-103",

    question:
      "Why are cactus plants commonly found in deserts rather than in waterlogged habitats?",

    options: [
      {
        id: "A",
        text: "Their adaptations are suited to conserving water in dry conditions",
      },
      {
        id: "B",
        text: "They require permanently flooded soil",
      },
      {
        id: "C",
        text: "They cannot carry out photosynthesis",
      },
      {
        id: "D",
        text: "They require extremely low temperatures to survive",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Cacti possess adaptations that allow them to survive where water is scarce.",

      steps: [
        "Deserts have low and irregular water availability.",
        "Cacti have features such as succulent stems that store water.",
        "Reduced leaves or spines and a waxy surface help reduce water loss.",
        "These adaptations make cacti well suited to dry habitats.",
        "Therefore, their distribution is associated with habitats where their water-conserving adaptations are advantageous.",
      ],
    },
  },

  {
    id: "biology-evolution-104",

    question:
      "A plant species has broad leaves and a high rate of transpiration. In which habitat would this plant most likely be successful?",

    options: [
      {
        id: "A",
        text: "A humid environment with abundant water",
      },
      {
        id: "B",
        text: "An extremely dry desert",
      },
      {
        id: "C",
        text: "A habitat with severe water shortage",
      },
      {
        id: "D",
        text: "A completely waterless environment",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Plants with high rates of transpiration are more likely to succeed where water is readily available.",

      steps: [
        "Broad leaves generally provide a large surface area for transpiration.",
        "High transpiration can result in considerable water loss.",
        "A humid habitat with abundant water can compensate for this water loss.",
        "In contrast, severe drought would place the plant under water stress.",
        "Therefore, the plant is most likely to be successful in a humid environment with abundant water.",
      ],
    },
  },

  {
    id: "biology-evolution-105",

    question:
      "Which environmental factor is particularly important in determining the distribution of aquatic plants?",

    options: [
      {
        id: "A",
        text: "Availability and quality of water",
      },
      {
        id: "B",
        text: "Colour of surrounding rocks only",
      },
      {
        id: "C",
        text: "Number of terrestrial mammals only",
      },
      {
        id: "D",
        text: "Distance from all land animals",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Aquatic plants depend directly on water conditions for their survival and growth.",

      steps: [
        "Aquatic plants live partly or completely in water.",
        "Water availability is therefore essential to their survival.",
        "Factors such as salinity, oxygen availability, temperature and water movement can also influence their distribution.",
        "Different aquatic plants are adapted to different water conditions.",
        "Therefore, water availability and quality are important determinants of their distribution.",
      ],
    },
  },

  {
    id: "biology-evolution-106",

    question:
      "Why are mangrove plants commonly found along tropical coastlines and estuaries?",

    options: [
      {
        id: "A",
        text: "They possess adaptations that allow them to tolerate saline and waterlogged conditions",
      },
      {
        id: "B",
        text: "They require completely dry soil",
      },
      {
        id: "C",
        text: "They cannot tolerate salt",
      },
      {
        id: "D",
        text: "They require permanent exposure to freezing temperatures",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Mangroves are specialized plants adapted to coastal environments where salinity and waterlogging can be high.",

      steps: [
        "Coastal and estuarine habitats may contain significant concentrations of dissolved salts.",
        "The soil is frequently waterlogged and may have low oxygen availability.",
        "Mangroves possess adaptations that help them tolerate salt and obtain oxygen.",
        "These adaptations allow them to survive where many other plants cannot.",
        "Therefore, mangroves are commonly distributed in tropical coastal and estuarine habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-107",

    question:
      "A population of frogs is found only in ponds with clean, well-oxygenated water. What does this distribution suggest?",

    options: [
      {
        id: "A",
        text: "The frogs have environmental requirements that limit their habitat distribution",
      },
      {
        id: "B",
        text: "The frogs can survive equally well in polluted water",
      },
      {
        id: "C",
        text: "Water quality has no effect on the frogs",
      },
      {
        id: "D",
        text: "The frogs do not depend on their habitat",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The distribution of a species can reflect its tolerance limits and environmental requirements.",

      steps: [
        "The frogs are found only where water is clean and well oxygenated.",
        "This suggests that polluted or oxygen-poor water may be unsuitable for them.",
        "Environmental conditions therefore restrict where the frogs can establish populations.",
        "This is an example of habitat distribution being influenced by environmental requirements.",
      ],
    },
  },

  {
    id: "biology-evolution-108",

    question:
      "Which adaptation would allow a plant to occupy a habitat with very low light intensity?",

    options: [
      {
        id: "A",
        text: "Large leaves capable of capturing available light efficiently",
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
        text: "Reduction of all photosynthetic pigments",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Plants growing in low-light habitats require adaptations that improve their ability to capture limited light.",

      steps: [
        "Light is required for photosynthesis.",
        "In low-light habitats, competition for available light can be intense.",
        "Large leaves can provide a greater surface area for capturing available light.",
        "Plants may also possess other adaptations that improve light absorption.",
        "Therefore, large leaves capable of efficiently capturing available light can help a plant occupy low-light habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-109",

    question:
      "Why are some plants restricted to acidic soils?",

    options: [
      {
        id: "A",
        text: "They are adapted to obtain nutrients efficiently under acidic soil conditions",
      },
      {
        id: "B",
        text: "All plants require acidic soils",
      },
      {
        id: "C",
        text: "Acidic soils always contain no water",
      },
      {
        id: "D",
        text: "Plants cannot be affected by soil pH",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Soil pH influences nutrient availability and the ability of plants to absorb minerals.",

      steps: [
        "Different plants have different tolerance ranges for soil pH.",
        "Soil acidity affects the chemical availability of mineral nutrients.",
        "Some plant species are adapted to absorb nutrients effectively in acidic soils.",
        "Other species may grow poorly under the same conditions.",
        "Therefore, adaptation to soil conditions can influence plant distribution.",
      ],
    },
  },

  {
    id: "biology-evolution-110",

    question:
      "Which statement best explains why polar bears are naturally associated with Arctic habitats?",

    options: [
      {
        id: "A",
        text: "Their adaptations enable them to survive cold conditions and exploit Arctic resources",
      },
      {
        id: "B",
        text: "They can survive only in warm tropical forests",
      },
      {
        id: "C",
        text: "Their distribution is completely independent of temperature",
      },
      {
        id: "D",
        text: "They lack adaptations for cold conditions",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The distribution of polar bears is associated with Arctic environments because they possess adaptations suited to cold conditions.",

      steps: [
        "Arctic environments have extremely low temperatures for much of the year.",
        "Polar bears possess thick fur and substantial body fat that provide insulation.",
        "Their body structure and behaviour also help them obtain food in Arctic conditions.",
        "These adaptations increase their survival in cold environments.",
        "Therefore, their distribution is closely associated with Arctic habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-111",

    question:
      "How can competition affect the distribution of a species within a habitat?",

    options: [
      {
        id: "A",
        text: "Competition can restrict a species to areas where it can obtain sufficient resources",
      },
      {
        id: "B",
        text: "Competition always increases the available resources",
      },
      {
        id: "C",
        text: "Competition has no effect on population distribution",
      },
      {
        id: "D",
        text: "Competition allows every species to occupy every habitat",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Competition for limited resources can determine where a species is able to survive and reproduce.",

      steps: [
        "Organisms may compete for food, water, light, space or other resources.",
        "Resources may be more available in some parts of a habitat than others.",
        "A species may survive better in areas where competition is weaker or resources are more abundant.",
        "Therefore, competition can restrict the distribution of a species within a habitat.",
      ],
    },
  },

  {
    id: "biology-evolution-112",

    question:
      "Two plant species live in the same region, but one is found mainly in open grassland while the other occurs mainly under forest trees. What is the most likely explanation?",

    options: [
      {
        id: "A",
        text: "The species have different adaptations and environmental requirements",
      },
      {
        id: "B",
        text: "Both species require exactly the same conditions",
      },
      {
        id: "C",
        text: "The forest has no effect on light availability",
      },
      {
        id: "D",
        text: "Plants cannot respond to environmental conditions",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Species can occupy different parts of the same geographical region because their adaptations and environmental requirements differ.",

      steps: [
        "Open grassland generally receives more direct sunlight.",
        "The area beneath forest trees receives less light because of shading.",
        "The two plant species may therefore have different light requirements or adaptations.",
        "Other factors such as soil moisture and nutrient availability may also differ.",
        "Therefore, different adaptations and environmental requirements can explain their distribution.",
      ],
    },
  },

  {
    id: "biology-evolution-113",

    question:
      "A lizard population is found mostly on dark volcanic rocks. The lizards have dark body coloration. How could this adaptation influence their distribution?",

    options: [
      {
        id: "A",
        text: "It may allow them to avoid detection by predators on dark rocks",
      },
      {
        id: "B",
        text: "It prevents them from feeding",
      },
      {
        id: "C",
        text: "It makes them equally visible in every habitat",
      },
      {
        id: "D",
        text: "It prevents them from reproducing",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Body coloration can influence where organisms are most successful by reducing predation in suitable environments.",

      steps: [
        "Dark lizards are less conspicuous against dark volcanic rocks.",
        "Reduced visibility can make it harder for predators to detect them.",
        "This provides a survival advantage in habitats containing dark surfaces.",
        "The lizards may therefore occur at higher densities in such areas.",
        "Thus, an adaptation can influence the distribution of a species within its environment.",
      ],
    },
  },

  {
    id: "biology-evolution-114",

    question:
      "Which statement best describes the relationship between adaptation and habitat distribution?",

    options: [
      {
        id: "A",
        text: "Adaptations can determine the range of environmental conditions in which a species can survive",
      },
      {
        id: "B",
        text: "Adaptations have no relationship with habitat distribution",
      },
      {
        id: "C",
        text: "All species have identical adaptations",
      },
      {
        id: "D",
        text: "A species can survive and reproduce equally well in every environment",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Adaptations help organisms survive under particular environmental conditions and therefore influence their geographical and ecological distribution.",

      steps: [
        "Every species has physiological, structural or behavioural characteristics that affect its ability to survive.",
        "These characteristics determine how well the organism tolerates factors such as temperature, moisture, salinity and food availability.",
        "A species is more likely to establish and reproduce where conditions fall within its tolerance range.",
        "Therefore, adaptations help determine the habitats in which a species can survive.",
      ],
    },
  },

  {
    id: "biology-evolution-115",

    question:
      "A plant is introduced into two habitats. It grows well in one habitat but poorly in the other. Which conclusion is most appropriate?",

    options: [
      {
        id: "A",
        text: "The plant's adaptations and tolerance limits interact with environmental conditions to determine its success",
      },
      {
        id: "B",
        text: "The plant must be equally well adapted to both habitats",
      },
      {
        id: "C",
        text: "Environmental conditions cannot affect plant growth",
      },
      {
        id: "D",
        text: "The plant will always reproduce more in the poorer habitat",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The success of an organism in a habitat depends on how its adaptations and tolerance limits match the environmental conditions.",

      steps: [
        "The two habitats may differ in factors such as light, temperature, water, soil nutrients or competition.",
        "The plant grows better where these conditions are more suitable for its requirements.",
        "Poor growth in the second habitat suggests that one or more environmental factors may be outside the plant's optimum range.",
        "Therefore, the plant's adaptations and tolerance limits interact with environmental conditions to determine its success.",
      ],
    },
  },




  {
    id: "biology-evolution-116",

    question:
      "Which combination of adaptations would best enable a plant to survive in a hot, dry environment?",

    options: [
      {
        id: "A",
        text: "Broad thin leaves, shallow roots and a thin cuticle",
      },
      {
        id: "B",
        text: "Reduced leaves, deep roots and a thick waxy cuticle",
      },
      {
        id: "C",
        text: "Large leaves, numerous stomata and a thin stem",
      },
      {
        id: "D",
        text: "Weak roots, thin epidermis and high daytime transpiration",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Plants in hot, dry environments need several adaptations that work together to conserve water and obtain it efficiently.",

      steps: [
        "Water is often scarce in hot, dry environments.",
        "Reduced leaves decrease the surface area available for water loss.",
        "Deep roots can reach water stored deeper in the soil.",
        "A thick waxy cuticle reduces evaporation from the plant surface.",
        "Therefore, reduced leaves, deep roots and a thick waxy cuticle provide an effective combination of adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-117",

    question:
      "A desert plant has a thick succulent stem, reduced leaves and a deep root system. How do these adaptations work together?",

    options: [
      {
        id: "A",
        text: "They increase water loss while reducing water storage",
      },
      {
        id: "B",
        text: "They allow the plant to store water, reduce water loss and obtain water from deeper soil",
      },
      {
        id: "C",
        text: "They prevent the plant from carrying out photosynthesis",
      },
      {
        id: "D",
        text: "They make the plant dependent on permanently flooded soil",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The combination of structural adaptations allows desert plants to obtain and conserve water efficiently.",

      steps: [
        "The thick succulent stem stores water obtained during periods of rainfall.",
        "Reduced leaves decrease the surface area through which water can be lost.",
        "The deep root system allows the plant to access water deeper in the soil.",
        "These adaptations complement one another.",
        "Therefore, the combination helps the plant store water, reduce water loss and obtain available water.",
      ],
    },
  },

  {
    id: "biology-evolution-118",

    question:
      "A mammal living in a very cold region has thick fur, a large body size and a thick layer of body fat. What is the combined advantage of these adaptations?",

    options: [
      {
        id: "A",
        text: "They increase heat loss from the body",
      },
      {
        id: "B",
        text: "They reduce heat loss and help maintain body temperature",
      },
      {
        id: "C",
        text: "They prevent the animal from producing metabolic heat",
      },
      {
        id: "D",
        text: "They increase dehydration",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Cold-adapted mammals often possess several characteristics that work together to conserve body heat.",

      steps: [
        "Thick fur traps insulating air close to the body.",
        "Body fat provides another layer of thermal insulation.",
        "A relatively large body can reduce the surface-area-to-volume ratio.",
        "A lower surface-area-to-volume ratio can reduce heat loss relative to body volume.",
        "Together, these adaptations help maintain body temperature in cold conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-119",

    question:
      "Why is having a low surface-area-to-volume ratio advantageous to many animals living in cold environments?",

    options: [
      {
        id: "A",
        text: "It increases the relative surface through which heat is lost",
      },
      {
        id: "B",
        text: "It reduces the relative surface area available for heat loss",
      },
      {
        id: "C",
        text: "It prevents respiration",
      },
      {
        id: "D",
        text: "It increases evaporation from the skin",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Body shape can influence the rate at which an animal loses heat to its surroundings.",

      steps: [
        "Heat is lost from the body's surface.",
        "A smaller surface area relative to body volume reduces the relative area through which heat can escape.",
        "Large, compact bodies generally have lower surface-area-to-volume ratios than small, slender bodies.",
        "This can be advantageous in cold environments.",
        "Therefore, a low surface-area-to-volume ratio helps reduce relative heat loss.",
      ],
    },
  },

  {
    id: "biology-evolution-120",

    question:
      "A fish lives in deep, cold water where light is limited and dissolved oxygen is relatively low. Which combination would most likely improve its survival?",

    options: [
      {
        id: "A",
        text: "Efficient oxygen uptake and adaptations for detecting limited light",
      },
      {
        id: "B",
        text: "Reduced gill efficiency and dependence on bright sunlight",
      },
      {
        id: "C",
        text: "Complete loss of respiratory surfaces",
      },
      {
        id: "D",
        text: "Inability to detect movement in darkness",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Organisms living in deep aquatic environments must cope with multiple environmental challenges at the same time.",

      steps: [
        "Deep water may contain limited light, making visual detection more difficult.",
        "Low dissolved oxygen can make respiration more challenging.",
        "Efficient respiratory surfaces improve oxygen uptake.",
        "Adaptations for detecting movement or light can help the fish locate food and avoid predators.",
        "Therefore, both efficient oxygen uptake and adaptations for limited light would improve survival.",
      ],
    },
  },

  {
    id: "biology-evolution-121",

    question:
      "A mangrove plant grows in salty, waterlogged soil. Which combination of adaptations would be most beneficial?",

    options: [
      {
        id: "A",
        text: "Salt tolerance and specialized roots for gaseous exchange",
      },
      {
        id: "B",
        text: "Complete inability to tolerate salt and shallow leaves",
      },
      {
        id: "C",
        text: "Roots that require highly oxygenated dry soil",
      },
      {
        id: "D",
        text: "Very high water loss and no salt-regulation mechanism",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Mangrove plants face both high salinity and low oxygen availability in waterlogged soils.",

      steps: [
        "Salty soil can interfere with water uptake and cause ion imbalance.",
        "Salt tolerance or salt-regulation mechanisms help mangroves cope with these conditions.",
        "Waterlogged soil contains relatively little oxygen.",
        "Specialized aerial roots can facilitate gaseous exchange.",
        "Therefore, salt tolerance combined with specialized roots provides an important survival advantage.",
      ],
    },
  },

  {
    id: "biology-evolution-122",

    question:
      "A bird species feeds mainly on insects found beneath tree bark. Which combination of adaptations would most directly improve its ability to obtain food?",

    options: [
      {
        id: "A",
        text: "A strong pointed beak and claws suitable for gripping bark",
      },
      {
        id: "B",
        text: "A weak beak and smooth feet unable to grip surfaces",
      },
      {
        id: "C",
        text: "Very short legs and a soft blunt beak",
      },
      {
        id: "D",
        text: "Reduced vision and weak muscles",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Feeding adaptations often involve several structures that work together to obtain food efficiently.",

      steps: [
        "Insects beneath tree bark can be difficult to reach.",
        "A strong pointed beak can probe or remove pieces of bark.",
        "Strong claws can help the bird grip vertical tree surfaces.",
        "Together, these features improve access to the bird's food source.",
        "Therefore, a strong pointed beak and suitable claws provide the greatest advantage.",
      ],
    },
  },

  {
    id: "biology-evolution-123",

    question:
      "Why can behavioural adaptations be especially important when environmental conditions change rapidly?",

    options: [
      {
        id: "A",
        text: "They can allow organisms to change their activities or locations without requiring immediate structural changes",
      },
      {
        id: "B",
        text: "They permanently change an organism's DNA whenever conditions change",
      },
      {
        id: "C",
        text: "They eliminate all environmental pressures",
      },
      {
        id: "D",
        text: "They prevent organisms from responding to environmental conditions",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Behavioural responses can allow organisms to respond quickly to environmental conditions.",

      steps: [
        "Environmental conditions can change over hours, days or seasons.",
        "An organism may respond by changing its activity time, location or behaviour.",
        "For example, an animal may become nocturnal during periods of extreme daytime heat.",
        "Such a response does not require the organism to develop a new physical structure immediately.",
        "Therefore, behavioural adaptations can provide rapid responses to changing conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-124",

    question:
      "A desert animal has large ears, produces concentrated urine and is active mainly at night. What do these adaptations collectively help the animal achieve?",

    options: [
      {
        id: "A",
        text: "Efficient heat management and water conservation",
      },
      {
        id: "B",
        text: "Increased water loss during the hottest part of the day",
      },
      {
        id: "C",
        text: "Permanent exposure to extreme daytime temperatures",
      },
      {
        id: "D",
        text: "Reduced ability to remove metabolic wastes",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Desert animals often combine structural, physiological and behavioural adaptations to cope with heat and water scarcity.",

      steps: [
        "Large ears can provide a relatively large surface for heat exchange in some desert mammals.",
        "Concentrated urine reduces water loss through excretion.",
        "Nocturnal activity reduces exposure to the hottest daytime temperatures.",
        "These adaptations address different environmental challenges.",
        "Together, they improve heat management and water conservation.",
      ],
    },
  },

  {
    id: "biology-evolution-125",

    question:
      "Which situation best demonstrates how several adaptations can work together to increase survival?",

    options: [
      {
        id: "A",
        text: "A desert plant stores water, has reduced leaves and develops deep roots",
      },
      {
        id: "B",
        text: "A plant loses water rapidly and has no roots",
      },
      {
        id: "C",
        text: "An animal lacks insulation in a freezing habitat",
      },
      {
        id: "D",
        text: "A fish has no respiratory surface in water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Integrated adaptations are most effective when different characteristics address different challenges in the same environment.",

      steps: [
        "Water storage provides a reserve during dry periods.",
        "Reduced leaves decrease water loss.",
        "Deep roots increase access to water stored deeper in the soil.",
        "Each adaptation addresses a different aspect of water scarcity.",
        "Together, they improve the plant's ability to survive in a dry environment.",
      ],
    },
  },

  {
    id: "biology-evolution-126",

    question:
      "A population of mammals experiences a prolonged drought. Which individuals are most likely to survive if the population contains heritable variation in water-conserving traits?",

    options: [
      {
        id: "A",
        text: "Individuals with traits that allow them to conserve water more effectively",
      },
      {
        id: "B",
        text: "Individuals that lose water most rapidly",
      },
      {
        id: "C",
        text: "Individuals with no access to food or water",
      },
      {
        id: "D",
        text: "Individuals with traits that make dehydration faster",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Natural selection can favour heritable traits that improve survival under particular environmental conditions.",

      steps: [
        "A drought reduces the availability of water.",
        "Individuals vary in their ability to conserve and obtain water.",
        "Individuals with heritable water-conserving traits are more likely to survive.",
        "Surviving individuals may reproduce and pass these traits to their offspring.",
        "Over generations, such traits may become more common in the population.",
      ],
    },
  },

  {
    id: "biology-evolution-127",

    question:
      "Why is an adaptation that is advantageous in one habitat not necessarily advantageous in another?",

    options: [
      {
        id: "A",
        text: "The effectiveness of an adaptation depends on environmental conditions",
      },
      {
        id: "B",
        text: "All environments provide identical selection pressures",
      },
      {
        id: "C",
        text: "Adaptations always have the same effect regardless of habitat",
      },
      {
        id: "D",
        text: "Environmental conditions never affect survival",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The advantage provided by a trait depends on how well it matches the conditions and challenges of the environment.",

      steps: [
        "Different habitats impose different selection pressures.",
        "A trait that improves survival under one set of conditions may provide little advantage under another.",
        "For example, thick fur is useful in cold environments but can create problems in very hot environments.",
        "Therefore, the effectiveness of an adaptation depends on environmental conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-128",

    question:
      "A bird population lives on an island where strong winds are common. Which combination of traits could improve flight survival?",

    options: [
      {
        id: "A",
        text: "Strong flight muscles and wings suited to controlled flight",
      },
      {
        id: "B",
        text: "Weak flight muscles and poorly developed wings",
      },
      {
        id: "C",
        text: "Reduced coordination and fragile flight structures",
      },
      {
        id: "D",
        text: "Complete loss of feathers in a flying species",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Flying animals living in windy environments may benefit from structural and muscular adaptations that improve flight control.",

      steps: [
        "Strong winds can make controlled flight more difficult.",
        "Strong flight muscles can provide greater power and control.",
        "Wing shape and structure can influence lift, stability and manoeuvrability.",
        "A combination of suitable wings and strong muscles can improve the bird's ability to cope with wind.",
        "Therefore, strong flight muscles and wings suited to controlled flight provide an advantage.",
      ],
    },
  },

  {
    id: "biology-evolution-129",

    question:
      "An aquatic mammal has a streamlined body, thick insulating fat and powerful limbs adapted for swimming. What environmental challenges are these adaptations addressing?",

    options: [
      {
        id: "A",
        text: "Efficient movement through water and reduction of heat loss",
      },
      {
        id: "B",
        text: "Prevention of all movement through water",
      },
      {
        id: "C",
        text: "Increased heat loss and reduced swimming efficiency",
      },
      {
        id: "D",
        text: "Adaptation to dry desert conditions only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Aquatic mammals can possess integrated adaptations that improve movement through water while maintaining body temperature.",

      steps: [
        "A streamlined body reduces resistance as the animal moves through water.",
        "Powerful limbs or flippers provide propulsion and control.",
        "Cold water can cause substantial heat loss.",
        "A thick layer of insulating fat reduces heat transfer from the body to the water.",
        "Therefore, these adaptations address both efficient swimming and heat conservation.",
      ],
    },
  },

  {
    id: "biology-evolution-130",

    question:
      "Which example represents an interaction between structural, physiological and behavioural adaptations?",

    options: [
      {
        id: "A",
        text: "A desert mammal has large ears, produces concentrated urine and rests during the hottest part of the day",
      },
      {
        id: "B",
        text: "A mammal has only one adaptation and never responds to its environment",
      },
      {
        id: "C",
        text: "A plant has no structural or physiological adaptations",
      },
      {
        id: "D",
        text: "An animal changes neither its body functions nor its behaviour",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Organisms can survive environmental challenges through combinations of structural, physiological and behavioural adaptations.",

      steps: [
        "Large ears represent a structural adaptation.",
        "Producing concentrated urine is a physiological adaptation that conserves water.",
        "Resting during the hottest period is a behavioural adaptation.",
        "These different adaptations address heat and water stress in complementary ways.",
        "Therefore, the desert mammal demonstrates an integrated adaptation strategy.",
      ],
    },
  },

  {
    id: "biology-evolution-131",

    question:
      "A plant living in a cold region has a low growth rate during winter and produces protective substances that reduce cellular damage from freezing. What is the advantage of these adaptations?",

    options: [
      {
        id: "A",
        text: "They help the plant tolerate cold conditions and reduce cellular damage",
      },
      {
        id: "B",
        text: "They increase damage caused by freezing",
      },
      {
        id: "C",
        text: "They prevent the plant from surviving winter",
      },
      {
        id: "D",
        text: "They make the plant dependent on extremely high temperatures",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Plants exposed to cold conditions may reduce growth and produce physiological substances that protect their cells.",

      steps: [
        "Low temperatures can slow metabolic and growth processes.",
        "Freezing can cause cellular damage through the formation of ice crystals.",
        "Some plants produce protective substances that help stabilize cells during cold conditions.",
        "Reducing growth during unfavourable periods can also conserve resources.",
        "Therefore, these responses improve cold tolerance and reduce cellular damage.",
      ],
    },
  },

  {
    id: "biology-evolution-132",

    question:
      "Why is behavioural thermoregulation useful to animals living in environments with large temperature changes?",

    options: [
      {
        id: "A",
        text: "Animals can change their location or activity to maintain suitable body temperatures",
      },
      {
        id: "B",
        text: "Animals become completely independent of environmental temperature",
      },
      {
        id: "C",
        text: "Behaviour prevents all metabolic activity",
      },
      {
        id: "D",
        text: "Behaviour eliminates the need for food and water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Behavioural thermoregulation allows animals to modify their exposure to environmental temperatures.",

      steps: [
        "Environmental temperature can change substantially during the day or across seasons.",
        "Animals may seek shade when temperatures are high.",
        "They may bask in sunlight when temperatures are low.",
        "They may also move between microhabitats with different temperatures.",
        "Therefore, behavioural thermoregulation helps animals maintain suitable body temperatures.",
      ],
    },
  },

  {
    id: "biology-evolution-133",

    question:
      "A population of insects contains individuals with different levels of resistance to a pesticide. After repeated pesticide application, resistant individuals become more common. Which explanation best accounts for this change?",

    options: [
      {
        id: "A",
        text: "Pesticide exposure selected individuals with heritable resistance",
      },
      {
        id: "B",
        text: "Every insect deliberately developed resistance because it needed it",
      },
      {
        id: "C",
        text: "The pesticide caused every insect to become identical immediately",
      },
      {
        id: "D",
        text: "Resistance cannot be inherited",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Natural selection can increase the frequency of advantageous heritable traits when environmental conditions favour them.",

      steps: [
        "The insect population contains variation in pesticide resistance.",
        "Pesticide application kills or affects susceptible individuals more strongly.",
        "Resistant individuals are more likely to survive.",
        "If resistance is heritable, surviving resistant insects can pass the trait to their offspring.",
        "Over generations, resistant individuals can become a larger proportion of the population.",
      ],
    },
  },

  {
    id: "biology-evolution-134",

    question:
      "Which statement best explains why integrated adaptations can be more effective than considering a single adaptation alone?",

    options: [
      {
        id: "A",
        text: "Different adaptations can address different environmental challenges simultaneously",
      },
      {
        id: "B",
        text: "All adaptations perform exactly the same function",
      },
      {
        id: "C",
        text: "Only one environmental factor affects survival",
      },
      {
        id: "D",
        text: "Integrated adaptations eliminate natural selection",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Organisms often face several environmental challenges simultaneously, so multiple complementary adaptations can improve overall survival.",

      steps: [
        "A habitat can impose several pressures at the same time.",
        "For example, a desert may present high temperatures, intense sunlight and limited water.",
        "Different adaptations can address different pressures.",
        "A single adaptation may solve only one part of the problem.",
        "Therefore, complementary adaptations can work together to improve overall survival.",
      ],
    },
  },

  {
    id: "biology-evolution-135",

    question:
      "A researcher observes that a species survives in a habitat because it can tolerate the local temperature, obtain available food, avoid predators and reproduce successfully. What does this demonstrate?",

    options: [
      {
        id: "A",
        text: "Survival depends on the interaction of multiple adaptations and environmental factors",
      },
      {
        id: "B",
        text: "One environmental factor always determines survival",
      },
      {
        id: "C",
        text: "Adaptations are unrelated to reproduction",
      },
      {
        id: "D",
        text: "Predation and food availability cannot influence population survival",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Successful survival in a habitat generally depends on how several adaptations interact with multiple environmental pressures.",

      steps: [
        "Temperature tolerance allows the species to remain physiologically functional.",
        "The ability to obtain available food provides energy for maintenance and reproduction.",
        "Predator avoidance reduces mortality.",
        "Successful reproduction allows the population to persist across generations.",
        "Therefore, survival depends on the interaction of multiple adaptations and environmental factors.",
      ],
    },
  },


  {
    id: "biology-evolution-136",

    question:
      "What is the importance of variation within a population to natural selection?",

    options: [
      {
        id: "A",
        text: "It provides differences on which natural selection can act",
      },
      {
        id: "B",
        text: "It makes all individuals identical",
      },
      {
        id: "C",
        text: "It prevents organisms from reproducing",
      },
      {
        id: "D",
        text: "It eliminates environmental pressures",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Variation within a population provides the differences that allow some individuals to survive and reproduce more successfully under particular environmental conditions.",

      steps: [
        "Individuals within a population are not genetically identical.",
        "Some differences can affect characteristics such as feeding, disease resistance or tolerance to environmental conditions.",
        "Environmental conditions favour individuals with characteristics that improve survival and reproduction.",
        "If advantageous differences are heritable, they can become more common over generations.",
        "Therefore, variation provides the basis on which natural selection can act.",
      ],
    },
  },

  {
    id: "biology-evolution-137",

    question:
      "Which type of variation is most directly caused by differences in genes?",

    options: [
      {
        id: "A",
        text: "Genetic variation",
      },
      {
        id: "B",
        text: "Environmental variation",
      },
      {
        id: "C",
        text: "Seasonal variation only",
      },
      {
        id: "D",
        text: "Temporary behavioural variation only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Genetic variation results from differences in the genetic material of individuals.",

      steps: [
        "Genes contain information that contributes to inherited characteristics.",
        "Individuals may possess different alleles of the same gene.",
        "These genetic differences can produce differences in observable or physiological characteristics.",
        "Such differences can be inherited by offspring.",
        "Therefore, differences in genes directly produce genetic variation.",
      ],
    },
  },

  {
    id: "biology-evolution-138",

    question:
      "Which of the following is an example of environmental variation?",

    options: [
      {
        id: "A",
        text: "A child developing stronger muscles as a result of regular exercise",
      },
      {
        id: "B",
        text: "Different blood groups inherited by siblings",
      },
      {
        id: "C",
        text: "Different inherited alleles for a particular gene",
      },
      {
        id: "D",
        text: "Inherited resistance to a disease",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Environmental variation results from differences in environmental conditions or experiences rather than inherited genetic differences.",

      steps: [
        "Regular exercise can cause muscles to become stronger.",
        "The increase in muscle development results partly from environmental experience.",
        "The acquired change is not simply an inherited genetic difference between individuals.",
        "Blood groups and inherited disease resistance are examples of genetically influenced characteristics.",
        "Therefore, increased muscle development from exercise illustrates environmental variation.",
      ],
    },
  },

  {
    id: "biology-evolution-139",

    question:
      "Why must a favourable characteristic generally be heritable for natural selection to cause it to become more common in future generations?",

    options: [
      {
        id: "A",
        text: "Heritable characteristics can be passed from parents to offspring",
      },
      {
        id: "B",
        text: "Non-heritable characteristics are always harmful",
      },
      {
        id: "C",
        text: "Environmental characteristics are always inherited",
      },
      {
        id: "D",
        text: "Natural selection acts only on acquired skills",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Natural selection can change the characteristics of populations across generations when advantageous differences have a heritable basis.",

      steps: [
        "Individuals with a favourable characteristic may survive and reproduce more successfully.",
        "For the characteristic to become more common among descendants, it must be capable of being inherited.",
        "Offspring can then receive the relevant genetic variants from their parents.",
        "Over successive generations, the frequency of the favourable characteristic can increase.",
        "Therefore, heritability is essential for evolutionary change through natural selection.",
      ],
    },
  },

  {
    id: "biology-evolution-140",

    question:
      "A population of beetles contains green and brown individuals. Birds more easily detect the green beetles on brown soil. What is most likely to happen over many generations if colour is heritable?",

    options: [
      {
        id: "A",
        text: "Brown beetles may become more common because they are less likely to be eaten",
      },
      {
        id: "B",
        text: "Green beetles will automatically change into brown beetles during their lifetime",
      },
      {
        id: "C",
        text: "All beetles will immediately become identical",
      },
      {
        id: "D",
        text: "The birds will necessarily disappear",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Predation can act as a selection pressure when individuals differ in traits that affect their chance of survival.",

      steps: [
        "Green beetles are easier for birds to detect against brown soil.",
        "They are therefore more likely to be eaten.",
        "Brown beetles have a greater chance of surviving and reproducing.",
        "If their brown coloration is heritable, more offspring may inherit the trait.",
        "Over many generations, brown beetles may become more common in the population.",
      ],
    },
  },

  {
    id: "biology-evolution-141",

    question:
      "What is meant by natural selection?",

    options: [
      {
        id: "A",
        text: "The process in which individuals with advantageous heritable characteristics tend to survive and reproduce more successfully",
      },
      {
        id: "B",
        text: "The deliberate selection of organisms by humans for breeding",
      },
      {
        id: "C",
        text: "The process by which every individual becomes genetically identical",
      },
      {
        id: "D",
        text: "The production of organisms without genetic variation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Natural selection is a mechanism of evolution in which environmental pressures affect the survival and reproductive success of individuals with different heritable characteristics.",

      steps: [
        "Populations contain variation among individuals.",
        "Some variations can provide an advantage under particular environmental conditions.",
        "Individuals with advantageous characteristics may survive and reproduce more successfully.",
        "Their offspring may inherit those characteristics.",
        "Over generations, advantageous characteristics can become more common in the population.",
      ],
    },
  },

  {
    id: "biology-evolution-142",

    question:
      "Which of the following can act as a selection pressure on a population?",

    options: [
      {
        id: "A",
        text: "Predation",
      },
      {
        id: "B",
        text: "Only inherited variation",
      },
      {
        id: "C",
        text: "The genetic code itself",
      },
      {
        id: "D",
        text: "The existence of chromosomes alone",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A selection pressure is an environmental factor that affects the survival or reproductive success of individuals.",

      steps: [
        "Predators can remove individuals from a population.",
        "Individuals with traits that help them avoid predation may have a survival advantage.",
        "Other selection pressures include competition, disease, climate and availability of food.",
        "Therefore, predation is an example of a selection pressure.",
      ],
    },
  },

  {
    id: "biology-evolution-143",

    question:
      "A disease spreads through a population of insects. Some insects have inherited resistance to the disease. Which individuals are most likely to contribute more offspring to the next generation?",

    options: [
      {
        id: "A",
        text: "Individuals with inherited resistance that survive the disease",
      },
      {
        id: "B",
        text: "Individuals that are most severely affected",
      },
      {
        id: "C",
        text: "Individuals that cannot reproduce",
      },
      {
        id: "D",
        text: "Individuals lacking the resistance trait that die before reproduction",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Disease can act as a selection pressure by favouring individuals with inherited resistance.",

      steps: [
        "The population contains variation in disease resistance.",
        "The disease is more likely to kill or weaken susceptible individuals.",
        "Resistant individuals have a greater chance of surviving.",
        "Surviving resistant individuals can reproduce and pass resistance alleles to offspring.",
        "Therefore, resistant individuals are more likely to contribute offspring to the next generation.",
      ],
    },
  },

  {
    id: "biology-evolution-144",

    question:
      "Which statement correctly describes the relationship between adaptation and natural selection?",

    options: [
      {
        id: "A",
        text: "Natural selection can increase the frequency of heritable characteristics that improve survival and reproduction",
      },
      {
        id: "B",
        text: "Organisms deliberately create adaptations whenever they need them",
      },
      {
        id: "C",
        text: "Adaptations are always acquired during an individual's lifetime",
      },
      {
        id: "D",
        text: "Natural selection eliminates all variation from populations",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Adaptations can become common in populations when natural selection favours heritable characteristics that improve fitness.",

      steps: [
        "Individuals in a population show variation.",
        "Some variations provide advantages under particular environmental conditions.",
        "Individuals possessing advantageous heritable characteristics may survive and reproduce more successfully.",
        "The relevant characteristics can therefore increase in frequency over generations.",
        "This process contributes to the development and maintenance of adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-145",

    question:
      "Why does natural selection act on individuals but cause evolutionary change in populations?",

    options: [
      {
        id: "A",
        text: "Individuals experience differences in survival and reproduction, while changes in trait frequencies occur across generations in populations",
      },
      {
        id: "B",
        text: "Individual organisms change their genes whenever they need to",
      },
      {
        id: "C",
        text: "Populations cannot contain variation",
      },
      {
        id: "D",
        text: "Natural selection changes every individual's characteristics in the same way",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Natural selection affects individual survival and reproduction, but evolutionary change is measured as changes in populations across generations.",

      steps: [
        "Individuals differ in their characteristics.",
        "Some individuals survive and reproduce more successfully than others.",
        "Their offspring inherit some of the relevant genetic characteristics.",
        "The frequencies of those characteristics can change within the population.",
        "Therefore, selection acts through individuals but evolutionary change occurs at the population level over generations.",
      ],
    },
  },

  {
    id: "biology-evolution-146",

    question:
      "A population of bacteria contains a small number of individuals with antibiotic resistance. After antibiotic treatment, most susceptible bacteria die while resistant bacteria survive. What is likely to happen next?",

    options: [
      {
        id: "A",
        text: "The resistant bacteria may reproduce and increase the proportion of resistant bacteria in the population",
      },
      {
        id: "B",
        text: "All bacteria will immediately lose their resistance",
      },
      {
        id: "C",
        text: "The antibiotic will necessarily create resistance in every surviving bacterium",
      },
      {
        id: "D",
        text: "The population cannot change genetically",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Antibiotic treatment can create strong selection pressure that favours bacteria already carrying resistance mechanisms.",

      steps: [
        "The bacterial population contains variation in antibiotic resistance.",
        "The antibiotic kills susceptible bacteria more effectively.",
        "Resistant bacteria have a greater probability of surviving treatment.",
        "The surviving resistant bacteria reproduce.",
        "As generations continue, the proportion of resistant bacteria may increase.",
      ],
    },
  },

  {
    id: "biology-evolution-147",

    question:
      "Which statement about mutations and natural selection is correct?",

    options: [
      {
        id: "A",
        text: "Mutations can introduce genetic variation, while natural selection can favour some variants under particular conditions",
      },
      {
        id: "B",
        text: "Natural selection creates all mutations because organisms need them",
      },
      {
        id: "C",
        text: "Mutations always reduce survival",
      },
      {
        id: "D",
        text: "Natural selection prevents genetic variation from occurring",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Mutation and natural selection have different roles in evolutionary change.",

      steps: [
        "Mutations are changes in genetic material.",
        "Some mutations can introduce new genetic variants into a population.",
        "Environmental conditions determine whether particular variants provide advantages, disadvantages or little effect.",
        "Natural selection can increase the frequency of advantageous heritable variants.",
        "Therefore, mutations can provide variation while natural selection influences the frequency of variants.",
      ],
    },
  },

  {
    id: "biology-evolution-148",

    question:
      "A farmer observes that insects resistant to a pesticide become increasingly common after repeated pesticide use. Which factor is acting as the selection pressure?",

    options: [
      {
        id: "A",
        text: "The pesticide",
      },
      {
        id: "B",
        text: "The insects' chromosomes alone",
      },
      {
        id: "C",
        text: "The resistant allele itself",
      },
      {
        id: "D",
        text: "The process of reproduction alone",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A pesticide can act as an environmental selection pressure by reducing the survival of susceptible insects.",

      steps: [
        "The population contains insects with different levels of pesticide resistance.",
        "The pesticide kills or weakens susceptible insects.",
        "Resistant insects are more likely to survive exposure.",
        "If resistance is heritable, surviving insects can pass the trait to offspring.",
        "Therefore, the pesticide is the selection pressure driving the change in the population.",
      ],
    },
  },

  {
    id: "biology-evolution-149",

    question:
      "Which sequence best represents natural selection acting on a population?",

    options: [
      {
        id: "A",
        text: "Variation → selection pressure → differential survival and reproduction → inheritance → change in population",
      },
      {
        id: "B",
        text: "Need → deliberate genetic change → identical offspring → no variation",
      },
      {
        id: "C",
        text: "Environment → immediate transformation of every individual → no reproduction",
      },
      {
        id: "D",
        text: "Mutation → all individuals become identical → extinction",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Natural selection involves variation, environmental selection pressures and differences in reproductive success across generations.",

      steps: [
        "Populations contain variation among individuals.",
        "Environmental conditions create selection pressures.",
        "Individuals with advantageous characteristics may survive and reproduce more successfully.",
        "If the characteristics are heritable, offspring can inherit them.",
        "Over generations, the frequency of advantageous characteristics can increase in the population.",
        "Therefore, the sequence in option A correctly represents natural selection.",
      ],
    },
  },

  {
    id: "biology-evolution-150",

    question:
      "A population of birds contains individuals with different beak sizes. During a period when only hard seeds are abundant, birds with larger, stronger beaks survive and reproduce more successfully. What does this example demonstrate?",

    options: [
      {
        id: "A",
        text: "Natural selection favouring a heritable variation",
      },
      {
        id: "B",
        text: "All birds deliberately changing their beaks because they need to",
      },
      {
        id: "C",
        text: "Environmental variation having no effect on survival",
      },
      {
        id: "D",
        text: "Natural selection eliminating reproduction",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The example demonstrates how environmental conditions can favour individuals with particular heritable characteristics.",

      steps: [
        "The bird population contains variation in beak size.",
        "Hard seeds create a selection pressure because they are easier for some beaks to handle than others.",
        "Birds with larger, stronger beaks obtain food more successfully.",
        "These birds are more likely to survive and reproduce.",
        "If beak size is heritable, their offspring are more likely to inherit the advantageous characteristic.",
        "Over generations, larger beaks may become more common in the population.",
        "Therefore, the example demonstrates natural selection acting on heritable variation.",
      ],
    },
  },

  {
    id: "biology-evolution-151",

    question:
      "Which comparison best explains why cactus plants and mangrove plants have different adaptations?",

    options: [
      {
        id: "A",
        text: "They live in different environments with different environmental pressures",
      },
      {
        id: "B",
        text: "Both plants experience exactly the same environmental conditions",
      },
      {
        id: "C",
        text: "Adaptations are unrelated to habitat",
      },
      {
        id: "D",
        text: "All plants require the same adaptations for survival",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Different habitats impose different environmental pressures, so organisms living in them may develop different adaptations.",

      steps: [
        "Cacti are commonly adapted to hot, dry environments where water is scarce.",
        "Mangroves live in coastal or estuarine environments where soils may be salty and waterlogged.",
        "These habitats impose different challenges on plants.",
        "Therefore, the adaptations of the two plants differ because they are suited to different environmental pressures.",
      ],
    },
  },

  {
    id: "biology-evolution-152",

    question:
      "Which adaptation would be more advantageous to a cactus than to a water lily?",

    options: [
      {
        id: "A",
        text: "A thick waxy cuticle that reduces water loss",
      },
      {
        id: "B",
        text: "Large floating leaves",
      },
      {
        id: "C",
        text: "Large air spaces in leaves for floating",
      },
      {
        id: "D",
        text: "Stomata mainly on the upper surface of floating leaves",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The value of an adaptation depends on the habitat in which an organism lives.",

      steps: [
        "Cacti live in environments where water is often scarce.",
        "A thick waxy cuticle reduces evaporation and helps conserve water.",
        "Water lilies live in aquatic environments where water is abundant.",
        "Floating leaves and upper-surface stomata are more directly suited to the water lily's habitat.",
        "Therefore, a thick waxy cuticle would be more advantageous to a cactus.",
      ],
    },
  },

  {
    id: "biology-evolution-153",

    question:
      "Which feature would provide a greater advantage to a camel than to a fish living in water?",

    options: [
      {
        id: "A",
        text: "Physiological mechanisms for conserving water",
      },
      {
        id: "B",
        text: "Gills for extracting dissolved oxygen",
      },
      {
        id: "C",
        text: "Fins for movement through water",
      },
      {
        id: "D",
        text: "A streamlined aquatic body",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Camels and fish face very different environmental challenges and therefore have different adaptive features.",

      steps: [
        "Camels live in dry environments where water availability can be limited.",
        "Water-conserving physiological mechanisms help camels survive periods of water shortage.",
        "Fish obtain oxygen from water using gills.",
        "Fins and streamlined bodies help fish move efficiently through water.",
        "Therefore, water conservation is a more relevant adaptation for camels.",
      ],
    },
  },

  {
    id: "biology-evolution-154",

    question:
      "Polar bears and desert foxes live in very different climates. Which comparison is most accurate?",

    options: [
      {
        id: "A",
        text: "Polar bears have adaptations that conserve heat, while desert foxes have adaptations that promote heat loss",
      },
      {
        id: "B",
        text: "Both animals require identical adaptations for temperature regulation",
      },
      {
        id: "C",
        text: "Both animals are adapted only to cold conditions",
      },
      {
        id: "D",
        text: "Neither animal is affected by environmental temperature",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Animals living in extremely different climates often have contrasting adaptations for managing body temperature.",

      steps: [
        "Polar bears live in very cold environments.",
        "They possess features such as thick fur and body fat that reduce heat loss.",
        "Desert foxes live in hot environments.",
        "Features such as relatively large ears can increase heat exchange with the surroundings.",
        "Therefore, their adaptations reflect the contrasting thermal conditions of their habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-155",

    question:
      "Which pair correctly compares the root systems of a desert plant and a plant living in a swamp?",

    options: [
      {
        id: "A",
        text: "A desert plant may develop deep roots for accessing water, while a swamp plant may have specialized roots for obtaining oxygen",
      },
      {
        id: "B",
        text: "Both plants require identical root adaptations",
      },
      {
        id: "C",
        text: "Neither plant requires roots for survival",
      },
      {
        id: "D",
        text: "The desert plant requires roots that prevent water uptake",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Root adaptations reflect the availability of water and oxygen in the soil.",

      steps: [
        "Water may be scarce near the surface in desert environments.",
        "Deep roots can help desert plants reach water stored farther below the surface.",
        "Swamp soils are often saturated with water and may contain little oxygen.",
        "Specialized roots can help some swamp plants obtain oxygen from the atmosphere.",
        "Therefore, the root adaptations of the two plants address different environmental challenges.",
      ],
    },
  },

  {
    id: "biology-evolution-156",

    question:
      "Which adaptation is more characteristic of animals living in aquatic environments than of terrestrial animals?",

    options: [
      {
        id: "A",
        text: "Structures specialized for efficient movement through water",
      },
      {
        id: "B",
        text: "Structures designed exclusively to prevent water from entering the body",
      },
      {
        id: "C",
        text: "Roots adapted for absorbing minerals from soil",
      },
      {
        id: "D",
        text: "Leaves adapted for capturing sunlight",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Aquatic animals require adaptations that allow them to move efficiently and survive in water.",

      steps: [
        "Water provides resistance to movement.",
        "Aquatic animals may have streamlined bodies, fins, flippers or other structures that improve movement through water.",
        "Terrestrial animals are adapted to movement through air and across land.",
        "Roots and leaves are plant structures rather than aquatic animal adaptations.",
        "Therefore, structures specialized for movement through water are more characteristic of aquatic animals.",
      ],
    },
  },

  {
    id: "biology-evolution-157",

    question:
      "Two bird species have different beak shapes because they feed on different types of food. What does this comparison demonstrate?",

    options: [
      {
        id: "A",
        text: "Different feeding adaptations can be associated with different food resources",
      },
      {
        id: "B",
        text: "All birds must have identical feeding structures",
      },
      {
        id: "C",
        text: "Beak shape has no relationship with feeding",
      },
      {
        id: "D",
        text: "Food availability cannot influence survival",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Differences in feeding structures can reflect adaptations to different food sources.",

      steps: [
        "Bird species may feed on seeds, insects, nectar, fish or other food types.",
        "Different foods require different methods of obtaining and processing them.",
        "Beak shape and strength can therefore differ among species.",
        "A suitable beak can improve feeding efficiency and survival.",
        "Therefore, different beak shapes can be associated with different food resources.",
      ],
    },
  },

  {
    id: "biology-evolution-158",

    question:
      "Which comparison between a fish and a terrestrial mammal is correct?",

    options: [
      {
        id: "A",
        text: "A fish uses gills to obtain oxygen from water, while a terrestrial mammal uses lungs to obtain oxygen from air",
      },
      {
        id: "B",
        text: "Both normally use gills to obtain oxygen",
      },
      {
        id: "C",
        text: "Both normally use lungs to extract oxygen from water",
      },
      {
        id: "D",
        text: "Neither requires oxygen for respiration",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Respiratory structures are adapted to the environment from which organisms obtain oxygen.",

      steps: [
        "Fish live in water and generally use gills to extract dissolved oxygen.",
        "Terrestrial mammals obtain oxygen from air.",
        "Their lungs provide a large internal surface for gas exchange with inhaled air.",
        "These differences reflect adaptations to aquatic and terrestrial environments.",
        "Therefore, option A provides the correct comparison.",
      ],
    },
  },

  {
    id: "biology-evolution-159",

    question:
      "A cactus and a mangrove both possess thick tissues capable of storing water, but the ecological roles of these adaptations differ. Why?",

    options: [
      {
        id: "A",
        text: "The same general feature can serve different survival purposes under different environmental conditions",
      },
      {
        id: "B",
        text: "Adaptations always have exactly the same function in every organism",
      },
      {
        id: "C",
        text: "Both plants live in identical habitats",
      },
      {
        id: "D",
        text: "Water storage is never useful to plants",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "An adaptation must be considered in relation to the environmental conditions experienced by an organism.",

      steps: [
        "Cacti commonly experience periods of water scarcity.",
        "Water-storage tissues can provide a reserve during dry periods.",
        "Mangroves have abundant surrounding water, but their saline environment can make water uptake physiologically challenging.",
        "Water storage and regulation can therefore contribute to maintaining water balance under different conditions.",
        "Thus, similar features may have different ecological significance in different habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-160",

    question:
      "Which pair of adaptations would be most useful when comparing animals from a cold mountain habitat and a hot desert habitat?",

    options: [
      {
        id: "A",
        text: "Insulation for the mountain animal and mechanisms for heat dissipation and water conservation for the desert animal",
      },
      {
        id: "B",
        text: "Identical thick insulation for both animals",
      },
      {
        id: "C",
        text: "Water conservation only for the mountain animal",
      },
      {
        id: "D",
        text: "Heat conservation only for the desert animal",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The contrasting climates of cold mountains and hot deserts require different adaptive strategies.",

      steps: [
        "Cold mountain environments create a risk of excessive heat loss.",
        "Insulation helps reduce this heat loss.",
        "Hot deserts create problems of overheating and water shortage.",
        "Heat-dissipation mechanisms and water conservation help desert animals cope with these pressures.",
        "Therefore, the two environments favour different combinations of adaptations.",
      ],
    },
  },

  {
    id: "biology-evolution-161",

    question:
      "Why might a nocturnal activity pattern be more advantageous to a desert animal than to an animal living in a cold environment?",

    options: [
      {
        id: "A",
        text: "Nocturnal activity can help a desert animal avoid extreme daytime heat",
      },
      {
        id: "B",
        text: "Nocturnal activity always increases heat loss in every environment",
      },
      {
        id: "C",
        text: "Cold environments always require animals to be nocturnal",
      },
      {
        id: "D",
        text: "Activity patterns have no relationship with environmental conditions",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Behavioural adaptations can be advantageous when they reduce exposure to unfavourable environmental conditions.",

      steps: [
        "Deserts can become extremely hot during the day.",
        "Remaining inactive during the hottest period can reduce heat stress and water loss.",
        "Animals can become active when temperatures are lower at night.",
        "The same behaviour may not provide the same advantage in a cold habitat.",
        "Therefore, nocturnal activity can be particularly useful to desert animals.",
      ],
    },
  },

  {
    id: "biology-evolution-162",

    question:
      "Which statement best compares the adaptations of a whale and a camel?",

    options: [
      {
        id: "A",
        text: "The whale has adaptations for aquatic movement and insulation, while the camel has adaptations for terrestrial life and water conservation",
      },
      {
        id: "B",
        text: "Both have adaptations primarily for aquatic movement",
      },
      {
        id: "C",
        text: "Both have identical adaptations for obtaining oxygen",
      },
      {
        id: "D",
        text: "Neither has adaptations related to its environment",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Whales and camels occupy very different habitats, so their adaptations reflect different environmental demands.",

      steps: [
        "Whales live in aquatic environments and require efficient swimming structures.",
        "Cold water can also create a risk of heat loss, so insulation is important.",
        "Camels live in dry terrestrial environments.",
        "They possess adaptations that help them cope with heat and limited water availability.",
        "Therefore, their adaptations differ according to their contrasting habitats.",
      ],
    },
  },

  {
    id: "biology-evolution-163",

    question:
      "A researcher compares two plant species. Species X has a thick cuticle and sunken stomata, while Species Y has broad thin leaves with many exposed stomata. Which conclusion is most reasonable?",

    options: [
      {
        id: "A",
        text: "Species X is likely better adapted to dry conditions, while Species Y is likely better suited to conditions with greater water availability",
      },
      {
        id: "B",
        text: "Both species must be equally adapted to deserts",
      },
      {
        id: "C",
        text: "Species X must be an aquatic plant",
      },
      {
        id: "D",
        text: "Species Y must live in an extremely dry desert",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The structures described affect water loss and therefore provide clues about the environments to which the plants are adapted.",

      steps: [
        "A thick cuticle reduces water loss from the plant surface.",
        "Sunken stomata can also reduce the rate of water loss under dry conditions.",
        "Broad thin leaves with many exposed stomata generally allow greater gas exchange but can increase water loss.",
        "Such characteristics are more consistent with environments where water is relatively available.",
        "Therefore, Species X is likely better adapted to dry conditions than Species Y.",
      ],
    },
  },

  {
    id: "biology-evolution-164",

    question:
      "Which comparison correctly describes the likely adaptations of a plant in a rainforest and a plant in a desert?",

    options: [
      {
        id: "A",
        text: "The rainforest plant may have broad leaves for light capture, while the desert plant may have reduced leaves to conserve water",
      },
      {
        id: "B",
        text: "Both plants must have identical leaf structures",
      },
      {
        id: "C",
        text: "The desert plant requires broad leaves mainly to increase water loss",
      },
      {
        id: "D",
        text: "The rainforest plant must lack leaves because water is abundant",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Rainforest and desert plants face contrasting challenges involving light, water and competition.",

      steps: [
        "Rainforest vegetation can experience intense competition for available light.",
        "Broad leaves can provide a large surface for capturing light.",
        "Desert plants must often minimize water loss.",
        "Reduced leaves can decrease the surface area through which water is lost.",
        "Therefore, these contrasting leaf adaptations can reflect the different environments.",
      ],
    },
  },

  {
    id: "biology-evolution-165",

    question:
      "Which conclusion can be drawn when comparing adaptations of organisms from several different habitats?",

    options: [
      {
        id: "A",
        text: "Adaptations reflect the environmental pressures and resources available in the habitats where organisms live",
      },
      {
        id: "B",
        text: "All organisms should have the same adaptations regardless of habitat",
      },
      {
        id: "C",
        text: "Adaptations develop independently of environmental conditions",
      },
      {
        id: "D",
        text: "An adaptation useful in one habitat must always be useful in every other habitat",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Comparing organisms from different habitats shows that adaptations are closely related to the environmental challenges and resources encountered.",

      steps: [
        "Habitats differ in factors such as temperature, water availability, salinity, light and food.",
        "Organisms possess characteristics that influence their ability to survive under these conditions.",
        "An adaptation that is advantageous in one habitat may be less useful or even disadvantageous elsewhere.",
        "Comparative study therefore reveals how environmental pressures shape survival strategies.",
        "Thus, adaptations reflect the environmental pressures and resources available in particular habitats.",
      ],
    },
  },


  {
    id: "biology-evolution-166",

    question:
      "A student measures the water loss from two plant species kept under identical conditions. Species X loses 2.1 g of water per hour, while Species Y loses 6.8 g per hour. Which conclusion is best supported by the data?",

    options: [
      {
        id: "A",
        text: "Species X has a lower rate of water loss than Species Y",
      },
      {
        id: "B",
        text: "Species Y cannot survive in any habitat",
      },
      {
        id: "C",
        text: "Species X does not carry out transpiration",
      },
      {
        id: "D",
        text: "Species Y must be better adapted to deserts",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Experimental data should be interpreted by comparing the measured values under the same conditions.",

      steps: [
        "Species X loses 2.1 g of water per hour.",
        "Species Y loses 6.8 g of water per hour.",
        "Therefore, Species X has the lower measured rate of water loss.",
        "The result may suggest greater water conservation by Species X, but it does not by itself prove that Species X is better adapted to every dry habitat.",
        "Therefore, the conclusion directly supported by the data is that Species X has a lower rate of water loss.",
      ],
    },
  },

  {
    id: "biology-evolution-167",

    question:
      "An experiment investigates the effect of temperature on the activity of two lizard species. Species A is most active at 25°C, while Species B is most active at 35°C. What does this result suggest?",

    options: [
      {
        id: "A",
        text: "The two species have different temperature preferences or tolerances",
      },
      {
        id: "B",
        text: "Species A cannot survive above 25°C",
      },
      {
        id: "C",
        text: "Species B cannot survive below 35°C",
      },
      {
        id: "D",
        text: "Temperature has no effect on either species",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Differences in activity at different temperatures can provide evidence that organisms have different thermal requirements or tolerances.",

      steps: [
        "Species A reaches its highest measured activity at 25°C.",
        "Species B reaches its highest measured activity at 35°C.",
        "This indicates that their activity responds differently to temperature.",
        "The result suggests that the species have different temperature preferences or tolerance ranges.",
        "However, the data do not prove that either species cannot survive outside its optimum temperature.",
      ],
    },
  },

  {
    id: "biology-evolution-168",

    question:
      "Researchers place identical plants in four light intensities and measure their growth after four weeks. Which feature of the experiment is most important for making a fair comparison?",

    options: [
      {
        id: "A",
        text: "Keeping other relevant conditions such as water, temperature and soil the same",
      },
      {
        id: "B",
        text: "Using different amounts of water for each group",
      },
      {
        id: "C",
        text: "Changing temperature as well as light intensity",
      },
      {
        id: "D",
        text: "Using different plant species in every treatment group",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A controlled experiment should change the independent variable while keeping other important variables constant.",

      steps: [
        "The investigation is testing the effect of light intensity on plant growth.",
        "Light intensity should therefore be the main variable that differs between groups.",
        "Water, temperature, soil type and other relevant factors should be kept constant.",
        "This reduces the possibility that another factor caused differences in growth.",
        "Therefore, keeping other relevant conditions the same makes the comparison fairer.",
      ],
    },
  },

  {
    id: "biology-evolution-169",

    question:
      "A researcher records the percentage of seeds germinating at different temperatures. Germination is 20% at 10°C, 55% at 20°C, 92% at 30°C and 35% at 40°C. What is the best conclusion?",

    options: [
      {
        id: "A",
        text: "The highest germination occurred at 30°C under the conditions tested",
      },
      {
        id: "B",
        text: "Seeds cannot germinate below 30°C",
      },
      {
        id: "C",
        text: "40°C is the optimum temperature for germination",
      },
      {
        id: "D",
        text: "Temperature has no effect on germination",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The optimum among the temperatures tested is identified by the condition producing the highest measured response.",

      steps: [
        "Germination is 20% at 10°C.",
        "It increases to 55% at 20°C.",
        "The highest value, 92%, occurs at 30°C.",
        "Germination decreases to 35% at 40°C.",
        "Therefore, 30°C produced the highest germination under the conditions tested.",
      ],
    },
  },

  {
    id: "biology-evolution-170",

    question:
      "A student investigates whether leaf size affects water loss. Which measurement would provide the most direct evidence for comparing water loss between plants?",

    options: [
      {
        id: "A",
        text: "Change in mass of each plant over a fixed period",
      },
      {
        id: "B",
        text: "The colour of each plant's leaves",
      },
      {
        id: "C",
        text: "The number of flowers produced by each plant",
      },
      {
        id: "D",
        text: "The height of the plant before the experiment only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Water loss can be estimated by measuring changes in plant mass when other sources of mass change are controlled.",

      steps: [
        "Water makes up a significant proportion of plant mass.",
        "A decrease in mass over a fixed period can indicate water loss.",
        "Using the same time period allows the rates of water loss to be compared.",
        "Other variables should be controlled to make the measurement reliable.",
        "Therefore, change in plant mass provides direct evidence relevant to water loss.",
      ],
    },
  },

  {
    id: "biology-evolution-171",

    question:
      "An experiment compares the survival of two insect populations after exposure to a pesticide. Population X has 85% survival, while Population Y has 20% survival. What does the result suggest?",

    options: [
      {
        id: "A",
        text: "Population X has greater survival under the pesticide conditions tested",
      },
      {
        id: "B",
        text: "Every insect in Population X is genetically resistant",
      },
      {
        id: "C",
        text: "Population Y has no genetic variation",
      },
      {
        id: "D",
        text: "The pesticide cannot affect either population",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The survival percentages provide evidence about how the two populations responded to the pesticide under the experimental conditions.",

      steps: [
        "Population X has an observed survival rate of 85%.",
        "Population Y has an observed survival rate of 20%.",
        "Therefore, a greater proportion of Population X survived the pesticide exposure.",
        "The result could be associated with differences in resistance, but additional experiments would be needed to establish the cause.",
        "Thus, the directly supported conclusion is that Population X had greater survival under the tested conditions.",
      ],
    },
  },

  {
    id: "biology-evolution-172",

    question:
      "A researcher repeats an experiment measuring the salt tolerance of two plant species three times. Why is repeating the experiment useful?",

    options: [
      {
        id: "A",
        text: "It helps identify random variation and increases confidence in the results",
      },
      {
        id: "B",
        text: "It guarantees that the hypothesis is correct",
      },
      {
        id: "C",
        text: "It removes the need to control variables",
      },
      {
        id: "D",
        text: "It ensures that every result will be identical",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Replication improves the reliability of experimental findings by allowing researchers to identify variation between repeated measurements.",

      steps: [
        "Biological measurements can vary because of random differences between organisms or experimental conditions.",
        "Repeating the experiment provides multiple observations.",
        "Researchers can compare the results and identify whether a pattern is consistent.",
        "Repeated measurements can also be used to calculate means and assess variation.",
        "Therefore, repetition increases confidence in the reliability of the findings.",
      ],
    },
  },

  {
    id: "biology-evolution-173",

    question:
      "A graph shows that a plant's growth increases as soil moisture rises from 10% to 40%, but growth decreases when soil moisture reaches 70%. Which conclusion is best supported?",

    options: [
      {
        id: "A",
        text: "The plant has a range of soil moisture conditions that favour growth, with growth declining at excessive moisture",
      },
      {
        id: "B",
        text: "The plant requires completely dry soil",
      },
      {
        id: "C",
        text: "More water always produces greater growth",
      },
      {
        id: "D",
        text: "Soil moisture has no relationship with plant growth",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The data show that plant growth responds to soil moisture and that excessive moisture can reduce growth.",

      steps: [
        "Growth increases as soil moisture rises from 10% to 40%.",
        "This indicates that additional water improves growth within that range.",
        "Growth decreases at 70% moisture.",
        "Therefore, excessive moisture is not necessarily beneficial.",
        "The results suggest that the plant has a favourable range of soil moisture conditions rather than simply benefiting from unlimited water.",
      ],
    },
  },

  {
    id: "biology-evolution-174",

    question:
      "A student concludes that a particular plant is better adapted to drought because it survived longer without water than another plant. Which additional evidence would strengthen this conclusion?",

    options: [
      {
        id: "A",
        text: "Repeated experiments showing consistently lower water loss and higher survival under controlled drought conditions",
      },
      {
        id: "B",
        text: "A photograph of the plant growing in a garden",
      },
      {
        id: "C",
        text: "The colour of the plant's flowers",
      },
      {
        id: "D",
        text: "The height of the plant before drought exposure only",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Strong conclusions about adaptation require consistent evidence from controlled and repeatable investigations.",

      steps: [
        "Survival time alone provides some evidence but may be influenced by other differences between the plants.",
        "Repeated experiments reduce the effect of random variation.",
        "Measuring water loss provides additional evidence about the plant's ability to conserve water.",
        "Keeping environmental conditions controlled makes the comparison more reliable.",
        "Therefore, repeated evidence of lower water loss and higher survival under controlled drought conditions would strengthen the conclusion.",
      ],
    },
  },

  {
    id: "biology-evolution-175",

    question:
      "An experiment finds that a species has a higher survival rate at 30°C than at 10°C or 45°C. What is the most appropriate interpretation of this result?",

    options: [
      {
        id: "A",
        text: "The species appears to have an optimum survival temperature near 30°C under the conditions tested",
      },
      {
        id: "B",
        text: "The species can survive only at exactly 30°C",
      },
      {
        id: "C",
        text: "Temperature cannot affect survival",
      },
      {
        id: "D",
        text: "The species must have evolved specifically during the experiment",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Experimental data can identify the conditions under which an organism performs best within the range tested.",

      steps: [
        "Survival is lower at 10°C and 45°C.",
        "The highest measured survival occurs at 30°C.",
        "This indicates that 30°C is the most favourable temperature among those tested.",
        "It does not prove that the species can survive only at 30°C.",
        "Therefore, the most appropriate interpretation is that the species appears to have an optimum survival temperature near 30°C under the experimental conditions.",
      ],
    },
  },









];

export default evolutionAndAdaptationQuestions;




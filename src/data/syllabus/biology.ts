









export type SyllabusTopic = {
  id: string;
  name: string;
};

export type SyllabusSection = {
  id: string;
  code: string;
  name: string;
  topics: SyllabusTopic[];
};

export type SyllabusSubject = {
  id: string;
  name: string;
  slug: string;
  sections: SyllabusSection[];
};

/**
 * JAMB Biology Syllabus
 *
 * Structure:
 *
 * Biology
 * ├── A Living Organisms
 * ├── B Life Processes
 * ├── C Ecology
 * ├── D Genetics
 * └── E Evolution
 *
 * The IDs are intentionally kept stable because they can later be used
 * by questions, AI lessons, analytics, videos and other curriculum data.
 */

export const biologySyllabus: SyllabusSubject = {
  id: "biology",
  name: "Biology",
  slug: "biology",

  sections: [
    // ============================================================
    // A — LIVING ORGANISMS
    // ============================================================

    {
      id: "A01",
      code: "A01",
      name: "Living Organisms",
      topics: [
        {
          id: "A01.1",
          name: "Characteristics of Living Organisms",
        },
        {
          id: "A01.2",
          name: "Cell as the Basic Unit of Life",
        },
        {
          id: "A01.3",
          name: "Cell Structure and Functions",
        },
        {
          id: "A01.4",
          name: "Differences Between Plant and Animal Cells",
        },
        {
          id: "A01.5",
          name: "Levels of Organisation",
        },
        {
          id: "A01.6",
          name: "Unicellular and Multicellular Organisms",
        },
        {
          id: "A01.7",
          name: "Microscopy and Magnification",
        },
        {
          id: "A01.8",
          name: "Movement of Substances in Cells",
        },
      ],
    },

    {
      id: "A02",
      code: "A02",
      name: "Evolution",
      topics: [
        {
          id: "A02.1",
          name: "Meaning of Evolution",
        },
        {
          id: "A02.2",
          name: "Variation and Evolution",
        },
        {
          id: "A02.3",
          name: "Natural Selection",
        },
        {
          id: "A02.4",
          name: "Artificial Selection",
        },
        {
          id: "A02.5",
          name: "Survival of the Fittest",
        },
        {
          id: "A02.6",
          name: "Adaptation and Evolution",
        },
        {
          id: "A02.7",
          name: "Environmental Selection Pressure",
        },
        {
          id: "A02.8",
          name: "Geographical Isolation",
        },
        {
          id: "A02.9",
          name: "Adaptation to Extreme Environmental Conditions",
        },
        {
          id: "A02.10",
          name: "Camouflage, Mimicry and Protection",
        },
        {
          id: "A02.11",
          name: "Evidence Supporting Evolution",
        },
        {
          id: "A02.12",
          name: "Fossils and Evolution",
        },
        {
          id: "A02.13",
          name: "Comparative Anatomy",
        },
        {
          id: "A02.14",
          name: "Embryological Evidence",
        },
        {
          id: "A02.15",
          name: "Adaptation Data and Experiments",
        },
      ],
    },

    {
      id: "A03",
      code: "A03",
      name: "Adaptation",
      topics: [
        {
          id: "A03.1",
          name: "Structural Similarities and Differences",
        },
        {
          id: "A03.2",
          name: "Homologous Structures",
        },
        {
          id: "A03.3",
          name: "Analogous Structures",
        },
        {
          id: "A03.4",
          name: "Vestigial Structures",
        },
        {
          id: "A03.5",
          name: "Structural Adaptations",
        },
        {
          id: "A03.6",
          name: "Physiological Adaptations",
        },
        {
          id: "A03.7",
          name: "Behavioural Adaptations",
        },
        {
          id: "A03.8",
          name: "Adaptations of Plants",
        },
        {
          id: "A03.9",
          name: "Adaptations of Animals",
        },
      ],
    },

    // ============================================================
    // B — LIFE PROCESSES
    // ============================================================

    {
      id: "B01",
      code: "B01",
      name: "Internal Structure of Flowering Plants",
      topics: [
        {
          id: "B01.1",
          name: "Internal Structure of Roots",
        },
        {
          id: "B01.2",
          name: "Internal Structure of Stems",
        },
        {
          id: "B01.3",
          name: "Internal Structure of Leaves",
        },
        {
          id: "B01.4",
          name: "Root Tissues",
        },
        {
          id: "B01.5",
          name: "Stem Tissues",
        },
        {
          id: "B01.6",
          name: "Leaf Tissues",
        },
        {
          id: "B01.7",
          name: "Xylem and Phloem",
        },
        {
          id: "B01.8",
          name: "Vascular Bundles",
        },
        {
          id: "B01.9",
          name: "Monocot and Dicot Structures",
        },
        {
          id: "B01.10",
          name: "Functions of Plant Tissues",
        },
      ],
    },

    {
      id: "B02",
      code: "B02",
      name: "Nutrition",
      topics: [
        {
          id: "B02.1",
          name: "Modes of Nutrition",
        },
        {
          id: "B02.2",
          name: "Autotrophic Nutrition",
        },
        {
          id: "B02.3",
          name: "Heterotrophic Nutrition",
        },
        {
          id: "B02.4",
          name: "Photosynthesis",
        },
        {
          id: "B02.5",
          name: "Requirements for Photosynthesis",
        },
        {
          id: "B02.6",
          name: "Light Intensity and Photosynthesis",
        },
        {
          id: "B02.7",
          name: "Carbon Dioxide Concentration and Photosynthesis",
        },
        {
          id: "B02.8",
          name: "Temperature and Photosynthesis",
        },
        {
          id: "B02.9",
          name: "Experiments on Photosynthesis",
        },
        {
          id: "B02.10",
          name: "Mineral Nutrition in Plants",
        },
        {
          id: "B02.11",
          name: "Deficiency Symptoms in Plants",
        },
        {
          id: "B02.12",
          name: "Modes of Feeding in Animals",
        },
        {
          id: "B02.13",
          name: "Types of Teeth",
        },
        {
          id: "B02.14",
          name: "Structure of the Tooth",
        },
        {
          id: "B02.15",
          name: "Dental Formula",
        },
        {
          id: "B02.16",
          name: "Human Digestive System",
        },
        {
          id: "B02.17",
          name: "Digestion of Food",
        },
        {
          id: "B02.18",
          name: "Digestive Enzymes",
        },
        {
          id: "B02.19",
          name: "Absorption of Digested Food",
        },
        {
          id: "B02.20",
          name: "Assimilation",
        },
        {
          id: "B02.21",
          name: "Balanced Diet",
        },
        {
          id: "B02.22",
          name: "Food Tests",
        },
        {
          id: "B02.23",
          name: "Nutritional Deficiency Diseases",
        },
        {
          id: "B02.24",
          name: "Malnutrition",
        },
      ],
    },

    {
      id: "B03",
      code: "B03",
      name: "Transport",
      topics: [
        {
          id: "B03.1",
          name: "Need for Transport in Organisms",
        },
        {
          id: "B03.2",
          name: "Diffusion",
        },
        {
          id: "B03.3",
          name: "Osmosis",
        },
        {
          id: "B03.4",
          name: "Active Transport",
        },
        {
          id: "B03.5",
          name: "Transport in Plants",
        },
        {
          id: "B03.6",
          name: "Xylem Transport",
        },
        {
          id: "B03.7",
          name: "Phloem Transport",
        },
        {
          id: "B03.8",
          name: "Transpiration",
        },
        {
          id: "B03.9",
          name: "Factors Affecting Transpiration",
        },
        {
          id: "B03.10",
          name: "Transpiration Experiments",
        },
        {
          id: "B03.11",
          name: "Transport in Animals",
        },
        {
          id: "B03.12",
          name: "Blood",
        },
        {
          id: "B03.13",
          name: "Components of Blood",
        },
        {
          id: "B03.14",
          name: "Functions of Blood",
        },
        {
          id: "B03.15",
          name: "Blood Vessels",
        },
        {
          id: "B03.16",
          name: "The Heart",
        },
        {
          id: "B03.17",
          name: "Cardiac Cycle",
        },
        {
          id: "B03.18",
          name: "Double Circulation",
        },
        {
          id: "B03.19",
          name: "Lymphatic System",
        },
        {
          id: "B03.20",
          name: "Blood Pressure",
        },
      ],
    },

    {
      id: "B04",
      code: "B04",
      name: "Respiration",
      topics: [
        {
          id: "B04.1",
          name: "Meaning of Respiration",
        },
        {
          id: "B04.2",
          name: "Aerobic Respiration",
        },
        {
          id: "B04.3",
          name: "Anaerobic Respiration",
        },
        {
          id: "B04.4",
          name: "Respiration Equation",
        },
        {
          id: "B04.5",
          name: "Energy Release in Respiration",
        },
        {
          id: "B04.6",
          name: "Respiratory Substrates",
        },
        {
          id: "B04.7",
          name: "Respiratory Quotient",
        },
        {
          id: "B04.8",
          name: "Human Respiratory System",
        },
        {
          id: "B04.9",
          name: "Mechanism of Breathing",
        },
        {
          id: "B04.10",
          name: "Gas Exchange in the Lungs",
        },
        {
          id: "B04.11",
          name: "Alveoli",
        },
        {
          id: "B04.12",
          name: "Factors Affecting Breathing",
        },
        {
          id: "B04.13",
          name: "Respiratory Diseases",
        },
        {
          id: "B04.14",
          name: "Respiration Experiments",
        },
      ],
    },

    {
      id: "B05",
      code: "B05",
      name: "Excretion",
      topics: [
        {
          id: "B05.1",
          name: "Meaning of Excretion",
        },
        {
          id: "B05.2",
          name: "Excretory Products",
        },
        {
          id: "B05.3",
          name: "Excretion in Plants",
        },
        {
          id: "B05.4",
          name: "Excretion in Animals",
        },
        {
          id: "B05.5",
          name: "Human Excretory System",
        },
        {
          id: "B05.6",
          name: "Structure of the Kidney",
        },
        {
          id: "B05.7",
          name: "Nephron",
        },
        {
          id: "B05.8",
          name: "Formation of Urine",
        },
        {
          id: "B05.9",
          name: "Osmoregulation",
        },
        {
          id: "B05.10",
          name: "Role of the Liver in Excretion",
        },
        {
          id: "B05.11",
          name: "Role of the Skin in Excretion",
        },
        {
          id: "B05.12",
          name: "Excretory Disorders",
        },
      ],
    },

    {
      id: "B06",
      code: "B06",
      name: "Support and Movement",
      topics: [
        {
          id: "B06.1",
          name: "Support in Plants",
        },
        {
          id: "B06.2",
          name: "Mechanical Tissues in Plants",
        },
        {
          id: "B06.3",
          name: "Support in Animals",
        },
        {
          id: "B06.4",
          name: "Skeleton",
        },
        {
          id: "B06.5",
          name: "Axial Skeleton",
        },
        {
          id: "B06.6",
          name: "Appendicular Skeleton",
        },
        {
          id: "B06.7",
          name: "Joints",
        },
        {
          id: "B06.8",
          name: "Types of Joints",
        },
        {
          id: "B06.9",
          name: "Muscles",
        },
        {
          id: "B06.10",
          name: "Antagonistic Muscles",
        },
        {
          id: "B06.11",
          name: "Movement in Plants",
        },
        {
          id: "B06.12",
          name: "Tropic Movements",
        },
      ],
    },

    {
      id: "B07",
      code: "B07",
      name: "Reproduction",
      topics: [
        {
          id: "B07.1",
          name: "Types of Reproduction",
        },
        {
          id: "B07.2",
          name: "Asexual Reproduction",
        },
        {
          id: "B07.3",
          name: "Sexual Reproduction",
        },
        {
          id: "B07.4",
          name: "Reproduction in Flowering Plants",
        },
        {
          id: "B07.5",
          name: "Structure of a Flower",
        },
        {
          id: "B07.6",
          name: "Pollination",
        },
        {
          id: "B07.7",
          name: "Agents of Pollination",
        },
        {
          id: "B07.8",
          name: "Fertilization in Plants",
        },
        {
          id: "B07.9",
          name: "Fruit and Seed Formation",
        },
        {
          id: "B07.10",
          name: "Seed Dispersal",
        },
        {
          id: "B07.11",
          name: "Germination",
        },
        {
          id: "B07.12",
          name: "Reproduction in Humans",
        },
        {
          id: "B07.13",
          name: "Male Reproductive System",
        },
        {
          id: "B07.14",
          name: "Female Reproductive System",
        },
        {
          id: "B07.15",
          name: "Menstrual Cycle",
        },
        {
          id: "B07.16",
          name: "Fertilization in Humans",
        },
        {
          id: "B07.17",
          name: "Pregnancy and Birth",
        },
        {
          id: "B07.18",
          name: "Family Planning",
        },
        {
          id: "B07.19",
          name: "Sexually Transmitted Infections",
        },
      ],
    },

    {
      id: "B08",
      code: "B08",
      name: "Growth",
      topics: [
        {
          id: "B08.1",
          name: "Meaning of Growth",
        },
        {
          id: "B08.2",
          name: "Growth in Plants",
        },
        {
          id: "B08.3",
          name: "Growth in Animals",
        },
        {
          id: "B08.4",
          name: "Regions of Growth in Plants",
        },
        {
          id: "B08.5",
          name: "Meristematic Tissues",
        },
        {
          id: "B08.6",
          name: "Factors Affecting Growth",
        },
        {
          id: "B08.7",
          name: "Plant Growth Hormones",
        },
        {
          id: "B08.8",
          name: "Growth Curves",
        },
        {
          id: "B08.9",
          name: "Measurement of Growth",
        },
        {
          id: "B08.10",
          name: "Seed Germination and Growth",
        },
      ],
    },

    {
      id: "B09",
      code: "B09",
      name: "Coordination and Control",
      topics: [
        {
          id: "B09.1",
          name: "Meaning of Coordination",
        },
        {
          id: "B09.2",
          name: "Nervous System",
        },
        {
          id: "B09.3",
          name: "Central Nervous System",
        },
        {
          id: "B09.4",
          name: "Peripheral Nervous System",
        },
        {
          id: "B09.5",
          name: "Structure of a Neuron",
        },
        {
          id: "B09.6",
          name: "Transmission of Nerve Impulses",
        },
        {
          id: "B09.7",
          name: "Reflex Action",
        },
        {
          id: "B09.8",
          name: "Reflex Arc",
        },
        {
          id: "B09.9",
          name: "Sense Organs",
        },
        {
          id: "B09.10",
          name: "Eye",
        },
        {
          id: "B09.11",
          name: "Ear",
        },
        {
          id: "B09.12",
          name: "Endocrine System",
        },
        {
          id: "B09.13",
          name: "Hormones",
        },
        {
          id: "B09.14",
          name: "Major Endocrine Glands",
        },
        {
          id: "B09.15",
          name: "Plant Hormones",
        },
        {
          id: "B09.16",
          name: "Tropic Responses",
        },
        {
          id: "B09.17",
          name: "Homeostasis",
        },
      ],
    },

    // ============================================================
    // C — ECOLOGY
    // ============================================================

    {
      id: "C01",
      code: "C01",
      name: "Ecological Concepts",
      topics: [
        {
          id: "C01.1",
          name: "Meaning of Ecology",
        },
        {
          id: "C01.2",
          name: "Habitat",
        },
        {
          id: "C01.3",
          name: "Ecological Niche",
        },
        {
          id: "C01.4",
          name: "Population",
        },
        {
          id: "C01.5",
          name: "Community",
        },
        {
          id: "C01.6",
          name: "Ecosystem",
        },
        {
          id: "C01.7",
          name: "Biosphere",
        },
        {
          id: "C01.8",
          name: "Biotic Factors",
        },
        {
          id: "C01.9",
          name: "Abiotic Factors",
        },
      ],
    },

    {
      id: "C02",
      code: "C02",
      name: "Food Chains and Food Webs",
      topics: [
        {
          id: "C02.1",
          name: "Producers",
        },
        {
          id: "C02.2",
          name: "Consumers",
        },
        {
          id: "C02.3",
          name: "Decomposers",
        },
        {
          id: "C02.4",
          name: "Food Chains",
        },
        {
          id: "C02.5",
          name: "Food Webs",
        },
        {
          id: "C02.6",
          name: "Trophic Levels",
        },
        {
          id: "C02.7",
          name: "Energy Flow in Ecosystems",
        },
        {
          id: "C02.8",
          name: "Ecological Pyramids",
        },
        {
          id: "C02.9",
          name: "Pyramids of Numbers",
        },
        {
          id: "C02.10",
          name: "Pyramids of Biomass",
        },
        {
          id: "C02.11",
          name: "Pyramids of Energy",
        },
      ],
    },

    {
      id: "C03",
      code: "C03",
      name: "Natural Habitats",
      topics: [
        {
          id: "C03.1",
          name: "Aquatic Habitats",
        },
        {
          id: "C03.2",
          name: "Freshwater Habitats",
        },
        {
          id: "C03.3",
          name: "Marine Habitats",
        },
        {
          id: "C03.4",
          name: "Terrestrial Habitats",
        },
        {
          id: "C03.5",
          name: "Forest Habitats",
        },
        {
          id: "C03.6",
          name: "Grassland Habitats",
        },
        {
          id: "C03.7",
          name: "Desert Habitats",
        },
        {
          id: "C03.8",
          name: "Characteristics of Different Habitats",
        },
      ],
    },

    {
      id: "C04",
      code: "C04",
      name: "Local Nigerian Biomes",
      topics: [
        {
          id: "C04.1",
          name: "Mangrove Forest",
        },
        {
          id: "C04.2",
          name: "Freshwater Swamp Forest",
        },
        {
          id: "C04.3",
          name: "Tropical Rainforest",
        },
        {
          id: "C04.4",
          name: "Guinea Savanna",
        },
        {
          id: "C04.5",
          name: "Sudan Savanna",
        },
        {
          id: "C04.6",
          name: "Sahel Savanna",
        },
        {
          id: "C04.7",
          name: "Montane Vegetation",
        },
        {
          id: "C04.8",
          name: "Distribution of Vegetation Zones in Nigeria",
        },
        {
          id: "C04.9",
          name: "Human Activities and Nigerian Biomes",
        },
      ],
    },

    {
      id: "C05",
      code: "C05",
      name: "Ecology of Populations",
      topics: [
        {
          id: "C05.1",
          name: "Population Size",
        },
        {
          id: "C05.2",
          name: "Population Density",
        },
        {
          id: "C05.3",
          name: "Population Distribution",
        },
        {
          id: "C05.4",
          name: "Population Growth",
        },
        {
          id: "C05.5",
          name: "Birth Rate",
        },
        {
          id: "C05.6",
          name: "Death Rate",
        },
        {
          id: "C05.7",
          name: "Immigration",
        },
        {
          id: "C05.8",
          name: "Emigration",
        },
        {
          id: "C05.9",
          name: "Competition",
        },
        {
          id: "C05.10",
          name: "Predation",
        },
        {
          id: "C05.11",
          name: "Population Sampling",
        },
        {
          id: "C05.12",
          name: "Quadrats",
        },
        {
          id: "C05.13",
          name: "Transects",
        },
      ],
    },

    {
      id: "C06",
      code: "C06",
      name: "Soil",
      topics: [
        {
          id: "C06.1",
          name: "Components of Soil",
        },
        {
          id: "C06.2",
          name: "Types of Soil",
        },
        {
          id: "C06.3",
          name: "Sandy Soil",
        },
        {
          id: "C06.4",
          name: "Clay Soil",
        },
        {
          id: "C06.5",
          name: "Loamy Soil",
        },
        {
          id: "C06.6",
          name: "Soil Profile",
        },
        {
          id: "C06.7",
          name: "Soil Organisms",
        },
        {
          id: "C06.8",
          name: "Soil Fertility",
        },
        {
          id: "C06.9",
          name: "Soil pH",
        },
        {
          id: "C06.10",
          name: "Water Holding Capacity",
        },
        {
          id: "C06.11",
          name: "Soil Drainage",
        },
        {
          id: "C06.12",
          name: "Soil Erosion",
        },
        {
          id: "C06.13",
          name: "Soil Conservation",
        },
      ],
    },

    {
      id: "C07",
      code: "C07",
      name: "Humans and Environment",
      topics: [
        {
          id: "C07.1",
          name: "Human Population and the Environment",
        },
        {
          id: "C07.2",
          name: "Deforestation",
        },
        {
          id: "C07.3",
          name: "Desertification",
        },
        {
          id: "C07.4",
          name: "Erosion",
        },
        {
          id: "C07.5",
          name: "Flooding",
        },
        {
          id: "C07.6",
          name: "Pollution",
        },
        {
          id: "C07.7",
          name: "Air Pollution",
        },
        {
          id: "C07.8",
          name: "Water Pollution",
        },
        {
          id: "C07.9",
          name: "Soil Pollution",
        },
        {
          id: "C07.10",
          name: "Noise Pollution",
        },
        {
          id: "C07.11",
          name: "Climate Change",
        },
        {
          id: "C07.12",
          name: "Conservation",
        },
        {
          id: "C07.13",
          name: "National Parks and Wildlife Conservation",
        },
        {
          id: "C07.14",
          name: "Sustainable Use of Natural Resources",
        },
      ],
    },

    // ============================================================
    // D — GENETICS
    // ============================================================

    {
      id: "D01",
      code: "D01",
      name: "Variation in Population",
      topics: [
        {
          id: "D01.1",
          name: "Meaning of Variation",
        },
        {
          id: "D01.2",
          name: "Continuous Variation",
        },
        {
          id: "D01.3",
          name: "Discontinuous Variation",
        },
        {
          id: "D01.4",
          name: "Environmental Variation",
        },
        {
          id: "D01.5",
          name: "Genetic Variation",
        },
        {
          id: "D01.6",
          name: "Causes of Variation",
        },
        {
          id: "D01.7",
          name: "Importance of Variation",
        },
        {
          id: "D01.8",
          name: "Variation and Natural Selection",
        },
      ],
    },

    {
      id: "D02",
      code: "D02",
      name: "Heredity",
      topics: [
        {
          id: "D02.1",
          name: "Meaning of Heredity",
        },
        {
          id: "D02.2",
          name: "Chromosomes",
        },
        {
          id: "D02.3",
          name: "Genes",
        },
        {
          id: "D02.4",
          name: "Alleles",
        },
        {
          id: "D02.5",
          name: "Genotype",
        },
        {
          id: "D02.6",
          name: "Phenotype",
        },
        {
          id: "D02.7",
          name: "Dominant and Recessive Alleles",
        },
        {
          id: "D02.8",
          name: "Homozygous and Heterozygous Conditions",
        },
        {
          id: "D02.9",
          name: "Mendel's Laws of Inheritance",
        },
        {
          id: "D02.10",
          name: "Monohybrid Inheritance",
        },
        {
          id: "D02.11",
          name: "Dihybrid Inheritance",
        },
        {
          id: "D02.12",
          name: "Punnett Squares",
        },
        {
          id: "D02.13",
          name: "Sex Determination",
        },
        {
          id: "D02.14",
          name: "Sex-Linked Characteristics",
        },
        {
          id: "D02.15",
          name: "Genetic Disorders",
        },
        {
          id: "D02.16",
          name: "Blood Groups",
        },
        {
          id: "D02.17",
          name: "Rhesus Factor",
        },
        {
          id: "D02.18",
          name: "Pedigree Analysis",
        },
      ],
    },

    // ============================================================
    // E — EVOLUTION
    // ============================================================

    {
      id: "E01",
      code: "E01",
      name: "Theories of Evolution",
      topics: [
        {
          id: "E01.1",
          name: "Meaning of Evolution",
        },
        {
          id: "E01.2",
          name: "Lamarck's Theory",
        },
        {
          id: "E01.3",
          name: "Darwin's Theory of Natural Selection",
        },
        {
          id: "E01.4",
          name: "Survival of the Fittest",
        },
        {
          id: "E01.5",
          name: "Mutation Theory",
        },
        {
          id: "E01.6",
          name: "Modern Synthetic Theory",
        },
        {
          id: "E01.7",
          name: "Natural Selection and Adaptation",
        },
        {
          id: "E01.8",
          name: "Speciation",
        },
      ],
    },

    {
      id: "E02",
      code: "E02",
      name: "Evidence of Evolution",
      topics: [
        {
          id: "E02.1",
          name: "Fossil Evidence",
        },
        {
          id: "E02.2",
          name: "Comparative Anatomy",
        },
        {
          id: "E02.3",
          name: "Homologous Structures",
        },
        {
          id: "E02.4",
          name: "Analogous Structures",
        },
        {
          id: "E02.5",
          name: "Vestigial Organs",
        },
        {
          id: "E02.6",
          name: "Embryological Evidence",
        },
        {
          id: "E02.7",
          name: "Molecular Evidence",
        },
        {
          id: "E02.8",
          name: "DNA and Protein Similarities",
        },
        {
          id: "E02.9",
          name: "Geographical Distribution",
        },
        {
          id: "E02.10",
          name: "Artificial Selection as Evidence",
        },
      ],
    },
  ],
};

/**
 * Convenient exports for components that only need
 * the Biology sections.
 */
export const biologySections = biologySyllabus.sections;

/**
 * Flat list of every Biology topic.
 *
 * Useful for:
 * - search
 * - question generation
 * - AI lesson lookup
 * - analytics
 * - topic filtering
 */
export const biologyTopics = biologySyllabus.sections.flatMap((section) =>
  section.topics.map((topic) => ({
    ...topic,
    sectionId: section.id,
    sectionCode: section.code,
    sectionName: section.name,
  })),
);

/**
 * Find a Biology section by its ID.
 */
export function getBiologySection(
  sectionId: string,
): SyllabusSection | undefined {
  return biologySyllabus.sections.find(
    (section) => section.id === sectionId,
  );
}

/**
 * Find a Biology topic by its ID.
 */
export function getBiologyTopic(
  topicId: string,
): (SyllabusTopic & {
  sectionId: string;
  sectionCode: string;
  sectionName: string;
}) | undefined {
  return biologyTopics.find((topic) => topic.id === topicId);
}
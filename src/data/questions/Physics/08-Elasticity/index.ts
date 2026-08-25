



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* PHYSICS — ELASTICITY                                                       */
/* -------------------------------------------------------------------------- */

export const elasticityQuestions: ArenaQuestion[] = [
  {
    id: "physics-elasticity-001",

    question:
      "What is meant by the elasticity of a material?",

    options: [
      {
        id: "A",
        text: "The ability of a material to return to its original shape after deformation",
      },
      {
        id: "B",
        text: "The ability of a material to conduct electricity",
      },
      {
        id: "C",
        text: "The ability of a material to absorb heat",
      },
      {
        id: "D",
        text: "The ability of a material to dissolve in water",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Elasticity is the property of a material that enables it to regain its original shape and size when the deforming force is removed, provided the elastic limit has not been exceeded.",

      steps: [
        "A force can cause a material to change its shape or size.",
        "This change is called deformation.",
        "An elastic material can return to its original shape when the force is removed.",
        "This property is called elasticity.",
        "Therefore, the correct answer is the ability to return to the original shape after deformation.",
      ],
    },
  },

  {
    id: "physics-elasticity-002",

    question:
      "Which of the following is an example of an elastic material?",

    options: [
      {
        id: "A",
        text: "Rubber",
      },
      {
        id: "B",
        text: "Clay after permanent deformation",
      },
      {
        id: "C",
        text: "Broken glass",
      },
      {
        id: "D",
        text: "Dry sand",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Rubber can undergo deformation and return approximately to its original shape when the deforming force is removed, within its elastic range.",

      steps: [
        "An elastic material tends to regain its original shape after deformation.",
        "Rubber can stretch when a force is applied.",
        "When the force is removed within its elastic range, rubber tends to return to its original shape.",
        "Clay that has undergone permanent deformation does not behave in the same way.",
        "Therefore, rubber is the correct answer.",
      ],
    },
  },

  {
    id: "physics-elasticity-003",

    question:
      "What is the name given to the force per unit cross-sectional area of a material?",

    options: [
      {
        id: "A",
        text: "Strain",
      },
      {
        id: "B",
        text: "Stress",
      },
      {
        id: "C",
        text: "Elasticity",
      },
      {
        id: "D",
        text: "Young's modulus",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Stress describes the internal force acting per unit cross-sectional area of a material.",

      steps: [
        "When an external force is applied to a material, internal forces develop within it.",
        "Stress is defined as force divided by the original cross-sectional area.",
        "Strain measures the relative deformation of the material.",
        "Therefore, force per unit cross-sectional area is called stress.",
      ],
    },
  },

  {
    id: "physics-elasticity-004",

    question:
      "Which of the following is the SI unit of stress?",

    options: [
      {
        id: "A",
        text: "Newton",
      },
      {
        id: "B",
        text: "Metre",
      },
      {
        id: "C",
        text: "Pascal",
      },
      {
        id: "D",
        text: "Joule",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Stress is measured in pascals because it is force per unit area.",

      steps: [
        "Stress is calculated as force divided by cross-sectional area.",
        "Force is measured in newtons.",
        "Area is measured in square metres.",
        "Therefore, the unit is N/m².",
        "The SI unit N/m² is called the pascal (Pa).",
      ],
    },
  },

  {
    id: "physics-elasticity-005",

    question:
      "A force of 100 N acts normally on a wire having a cross-sectional area of 0.01 m². What is the stress in the wire?",

    options: [
      {
        id: "A",
        text: "100 Pa",
      },
      {
        id: "B",
        text: "1,000 Pa",
      },
      {
        id: "C",
        text: "10,000 Pa",
      },
      {
        id: "D",
        text: "100,000 Pa",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Stress is the force acting per unit cross-sectional area.",

      steps: [
        "The applied force is 100 N.",
        "The cross-sectional area is 0.01 m².",
        "Stress = force ÷ area.",
        "Stress = 100 ÷ 0.01.",
        "Therefore, the stress is 10,000 Pa.",
      ],
    },
  },

  {
    id: "physics-elasticity-006",

    question:
      "What is strain?",

    options: [
      {
        id: "A",
        text: "Force per unit area",
      },
      {
        id: "B",
        text: "Extension per original length",
      },
      {
        id: "C",
        text: "Force multiplied by distance",
      },
      {
        id: "D",
        text: "Mass per unit volume",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Strain is a measure of the relative deformation of a material.",

      steps: [
        "When a material is stretched, its length changes.",
        "The extension is the change in length.",
        "Strain compares this extension with the original length.",
        "Therefore, strain is extension divided by original length.",
        "Strain has no unit because it is a ratio of two lengths.",
      ],
    },
  },

  {
    id: "physics-elasticity-007",

    question:
      "A wire of original length 2 m extends by 0.004 m when a force is applied. What is the strain produced?",

    options: [
      {
        id: "A",
        text: "0.0002",
      },
      {
        id: "B",
        text: "0.002",
      },
      {
        id: "C",
        text: "0.02",
      },
      {
        id: "D",
        text: "0.2",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Strain is the ratio of extension to the original length.",

      steps: [
        "The original length is 2 m.",
        "The extension is 0.004 m.",
        "Strain = extension ÷ original length.",
        "Strain = 0.004 ÷ 2.",
        "Therefore, the strain is 0.002.",
      ],
    },
  },

  {
    id: "physics-elasticity-008",

    question:
      "Which of the following quantities has no unit?",

    options: [
      {
        id: "A",
        text: "Stress",
      },
      {
        id: "B",
        text: "Force",
      },
      {
        id: "C",
        text: "Strain",
      },
      {
        id: "D",
        text: "Young's modulus",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Strain is dimensionless because it is the ratio of two quantities measured in the same unit.",

      steps: [
        "Strain is calculated as extension divided by original length.",
        "Both extension and original length are measured in metres.",
        "The metre units cancel.",
        "Therefore, strain has no unit.",
      ],
    },
  },

  {
    id: "physics-elasticity-009",

    question:
      "What is Young's modulus a measure of?",

    options: [
      {
        id: "A",
        text: "The density of a material",
      },
      {
        id: "B",
        text: "The stiffness of a material",
      },
      {
        id: "C",
        text: "The mass of a material",
      },
      {
        id: "D",
        text: "The temperature of a material",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Young's modulus describes the stiffness of a material under tensile or compressive deformation.",

      steps: [
        "Young's modulus is the ratio of stress to strain within the elastic limit.",
        "A material with a large Young's modulus requires greater stress to produce a given strain.",
        "Such a material is relatively stiff.",
        "Therefore, Young's modulus is a measure of stiffness.",
      ],
    },
  },

  {
    id: "physics-elasticity-010",

    question:
      "Which of the following materials generally has a higher Young's modulus?",

    options: [
      {
        id: "A",
        text: "Steel",
      },
      {
        id: "B",
        text: "Rubber",
      },
      {
        id: "C",
        text: "Soft sponge",
      },
      {
        id: "D",
        text: "Foam",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Steel is much stiffer than materials such as rubber, sponge and foam.",

      steps: [
        "Young's modulus indicates the stiffness of a material.",
        "Steel resists deformation strongly compared with rubber and foam.",
        "Therefore, steel has a much higher Young's modulus than these softer materials.",
        "The correct answer is Steel.",
      ],
    },
  },

  {
    id: "physics-elasticity-011",

    question:
      "What happens to a material when the elastic limit is exceeded?",

    options: [
      {
        id: "A",
        text: "It always returns completely to its original shape",
      },
      {
        id: "B",
        text: "It undergoes permanent deformation",
      },
      {
        id: "C",
        text: "Its mass becomes zero",
      },
      {
        id: "D",
        text: "Its temperature must become zero",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The elastic limit is the greatest deformation up to which a material can return to its original shape when the force is removed.",

      steps: [
        "A material behaves elastically within its elastic limit.",
        "If the applied force produces deformation beyond this limit, the material may not return completely to its original shape.",
        "The remaining deformation is called permanent or plastic deformation.",
        "Therefore, exceeding the elastic limit can cause permanent deformation.",
      ],
    },
  },

  {
    id: "physics-elasticity-012",

    question:
      "Which law states that the extension of an elastic material is directly proportional to the applied force, provided the elastic limit is not exceeded?",

    options: [
      {
        id: "A",
        text: "Newton's first law",
      },
      {
        id: "B",
        text: "Boyle's law",
      },
      {
        id: "C",
        text: "Hooke's law",
      },
      {
        id: "D",
        text: "Charles' law",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "Hooke's law describes the relationship between applied force and extension for an elastic material within its elastic limit.",

      steps: [
        "When a force is applied to an elastic material, it may produce an extension.",
        "Within the elastic limit, the extension is proportional to the applied force.",
        "This relationship is known as Hooke's law.",
        "Therefore, the correct answer is Hooke's law.",
      ],
    },
  },

  {
    id: "physics-elasticity-013",

    question:
      "A spring extends by 0.02 m when a force of 4 N is applied. What is the spring constant?",

    options: [
      {
        id: "A",
        text: "20 N/m",
      },
      {
        id: "B",
        text: "80 N/m",
      },
      {
        id: "C",
        text: "200 N/m",
      },
      {
        id: "D",
        text: "400 N/m",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "For a spring obeying Hooke's law, the spring constant is the applied force divided by the extension.",

      steps: [
        "The applied force is 4 N.",
        "The extension is 0.02 m.",
        "Spring constant = force ÷ extension.",
        "Spring constant = 4 ÷ 0.02.",
        "Therefore, the spring constant is 200 N/m.",
      ],
    },
  },

  {
    id: "physics-elasticity-014",

    question:
      "What is the SI unit of the spring constant?",

    options: [
      {
        id: "A",
        text: "N",
      },
      {
        id: "B",
        text: "N/m",
      },
      {
        id: "C",
        text: "J",
      },
      {
        id: "D",
        text: "Pa",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The spring constant represents the force required to produce a unit extension.",

      steps: [
        "The spring constant is obtained by dividing force by extension.",
        "Force is measured in newtons.",
        "Extension is measured in metres.",
        "Therefore, the unit is newtons per metre, N/m.",
      ],
    },
  },

  {
    id: "physics-elasticity-015",

    question:
      "A force-extension graph for an elastic material is initially a straight line through the origin. What does this indicate?",

    options: [
      {
        id: "A",
        text: "Force is directly proportional to extension",
      },
      {
        id: "B",
        text: "Force is inversely proportional to extension",
      },
      {
        id: "C",
        text: "Extension is always zero",
      },
      {
        id: "D",
        text: "The material has no mass",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A straight-line force-extension graph passing through the origin indicates direct proportionality.",

      steps: [
        "A straight line through the origin means that equal changes in force produce proportional changes in extension.",
        "Therefore, force is directly proportional to extension.",
        "This behavior is consistent with Hooke's law.",
        "The relationship applies while the material remains within the appropriate elastic range.",
      ],
    },
  },

  {
    id: "physics-elasticity-016",

    question:
      "Which of the following is most likely to happen when a metal wire is stretched beyond its elastic limit?",

    options: [
      {
        id: "A",
        text: "It returns completely to its original length",
      },
      {
        id: "B",
        text: "It retains some permanent extension",
      },
      {
        id: "C",
        text: "Its mass disappears",
      },
      {
        id: "D",
        text: "Its length becomes exactly zero",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Once a material is stretched beyond its elastic limit, it may undergo permanent deformation.",

      steps: [
        "Within the elastic limit, the wire can return to its original length.",
        "Beyond the elastic limit, the deformation is no longer completely reversible.",
        "When the force is removed, some extension may remain.",
        "Therefore, the wire retains some permanent extension.",
      ],
    },
  },

  {
    id: "physics-elasticity-017",

    question:
      "Which of the following factors can affect the extension of a wire under tension?",

    options: [
      {
        id: "A",
        text: "Applied force",
      },
      {
        id: "B",
        text: "Original length",
      },
      {
        id: "C",
        text: "Cross-sectional area",
      },
      {
        id: "D",
        text: "All of the above",
      },
    ],

    correctAnswer: "D",

    explanation: {
      intro:
        "The extension of a wire depends on several factors, including the applied force, original length and cross-sectional area.",

      steps: [
        "Increasing the applied force generally increases extension.",
        "For the same material and force, a longer wire generally produces greater extension.",
        "A thicker wire generally produces less extension because it has a larger cross-sectional area.",
        "The material itself also affects the extension through its elastic properties.",
        "Therefore, all the listed factors can affect extension.",
      ],
    },
  },

  {
    id: "physics-elasticity-018",

    question:
      "Two wires are made of the same material and have the same cross-sectional area. Which wire will generally experience the greater extension under the same force?",

    options: [
      {
        id: "A",
        text: "The shorter wire",
      },
      {
        id: "B",
        text: "The longer wire",
      },
      {
        id: "C",
        text: "Both will always have zero extension",
      },
      {
        id: "D",
        text: "The wire with greater mass only",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "For wires of the same material and cross-sectional area under the same force, extension increases with original length.",

      steps: [
        "The two wires have the same material.",
        "They also have the same cross-sectional area.",
        "The same force is applied to both wires.",
        "A longer wire undergoes greater extension under these conditions.",
        "Therefore, the longer wire experiences the greater extension.",
      ],
    },
  },

  {
    id: "physics-elasticity-019",

    question:
      "Which type of deformation occurs when a material returns to its original shape after the deforming force is removed?",

    options: [
      {
        id: "A",
        text: "Elastic deformation",
      },
      {
        id: "B",
        text: "Permanent deformation",
      },
      {
        id: "C",
        text: "Plastic deformation",
      },
      {
        id: "D",
        text: "Irreversible deformation",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Elastic deformation is reversible deformation that disappears when the deforming force is removed, provided the elastic limit is not exceeded.",

      steps: [
        "A force can temporarily change the shape or length of a material.",
        "If the material returns to its original state after the force is removed, the deformation is reversible.",
        "This type of deformation is called elastic deformation.",
        "Therefore, elastic deformation is the correct answer.",
      ],
    },
  },

  {
    id: "physics-elasticity-020",

    question:
      "Which statement about Young's modulus is correct?",

    options: [
      {
        id: "A",
        text: "It is the ratio of strain to stress",
      },
      {
        id: "B",
        text: "It is the ratio of stress to strain",
      },
      {
        id: "C",
        text: "It is the product of stress and strain",
      },
      {
        id: "D",
        text: "It is the ratio of mass to volume",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Young's modulus is defined as the ratio of tensile stress to tensile strain within the elastic limit.",

      steps: [
        "Stress measures force per unit area.",
        "Strain measures extension relative to the original length.",
        "Young's modulus compares stress with strain.",
        "Therefore, Young's modulus is stress divided by strain.",
      ],
    },
  },
];

export default elasticityQuestions;
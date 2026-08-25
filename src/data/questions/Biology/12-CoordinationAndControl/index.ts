



import type { ArenaQuestion } from "@/components/arena/Arena";

/* -------------------------------------------------------------------------- */
/* BIOLOGY — COORDINATION AND CONTROL                                        */
/* -------------------------------------------------------------------------- */

export const coordinationAndControlQuestions: ArenaQuestion[] = [
  {
    id: "biology-coordination-001",

    question:
      "Which part of the nervous system receives information from receptors and coordinates the response of the body?",

    options: [
      {
        id: "A",
        text: "Central nervous system",
      },
      {
        id: "B",
        text: "Sensory receptor",
      },
      {
        id: "C",
        text: "Effector",
      },
      {
        id: "D",
        text: "Motor nerve",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The central nervous system consists of the brain and spinal cord and coordinates responses to information received from the body and environment.",

      steps: [
        "Receptors detect changes in the internal or external environment.",
        "Sensory neurons transmit impulses from receptors to the central nervous system.",
        "The brain and spinal cord process the information.",
        "The central nervous system coordinates an appropriate response.",
        "Therefore, the correct answer is the central nervous system.",
      ],
    },
  },

  {
    id: "biology-coordination-002",

    question:
      "Which part of the brain is mainly responsible for maintaining balance and coordinating muscular movement?",

    options: [
      {
        id: "A",
        text: "Cerebrum",
      },
      {
        id: "B",
        text: "Cerebellum",
      },
      {
        id: "C",
        text: "Medulla oblongata",
      },
      {
        id: "D",
        text: "Hypothalamus",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The cerebellum coordinates muscular activity and helps maintain balance and posture.",

      steps: [
        "The brain has different regions with specialized functions.",
        "The cerebellum coordinates voluntary muscular movements.",
        "It also helps maintain balance and posture.",
        "The cerebrum is mainly associated with conscious activities and higher mental functions.",
        "Therefore, the correct answer is the cerebellum.",
      ],
    },
  },

  {
    id: "biology-coordination-003",

    question:
      "Which part of the brain controls breathing and heartbeat?",

    options: [
      {
        id: "A",
        text: "Cerebrum",
      },
      {
        id: "B",
        text: "Cerebellum",
      },
      {
        id: "C",
        text: "Medulla oblongata",
      },
      {
        id: "D",
        text: "Pituitary gland",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "The medulla oblongata controls several involuntary activities, including breathing and heartbeat.",

      steps: [
        "Some body activities occur without conscious control.",
        "These include breathing, heartbeat and swallowing.",
        "The medulla oblongata contains centres that regulate many of these involuntary activities.",
        "The cerebrum is mainly responsible for conscious activities.",
        "Therefore, the correct answer is the medulla oblongata.",
      ],
    },
  },

  {
    id: "biology-coordination-004",

    question:
      "Which type of neuron carries impulses from a receptor to the central nervous system?",

    options: [
      {
        id: "A",
        text: "Motor neuron",
      },
      {
        id: "B",
        text: "Sensory neuron",
      },
      {
        id: "C",
        text: "Relay neuron",
      },
      {
        id: "D",
        text: "Effector neuron",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Sensory neurons transmit nerve impulses from sensory receptors to the central nervous system.",

      steps: [
        "Sensory receptors detect changes in the environment.",
        "The information must be transmitted to the central nervous system.",
        "Sensory neurons carry these impulses toward the brain or spinal cord.",
        "Motor neurons carry impulses from the central nervous system to effectors.",
        "Therefore, the correct answer is the sensory neuron.",
      ],
    },
  },

  {
    id: "biology-coordination-005",

    question:
      "Which type of neuron carries impulses from the central nervous system to an effector?",

    options: [
      {
        id: "A",
        text: "Sensory neuron",
      },
      {
        id: "B",
        text: "Motor neuron",
      },
      {
        id: "C",
        text: "Relay neuron",
      },
      {
        id: "D",
        text: "Receptor neuron",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Motor neurons transmit impulses from the central nervous system to effectors such as muscles and glands.",

      steps: [
        "The central nervous system processes information received from receptors.",
        "A response must then be transmitted to an appropriate effector.",
        "Motor neurons carry impulses away from the central nervous system.",
        "Effectors produce the required response.",
        "Therefore, the correct answer is the motor neuron.",
      ],
    },
  },

  {
    id: "biology-coordination-006",

    question:
      "Which structure connects two neurons and allows nerve impulses to pass from one neuron to another?",

    options: [
      {
        id: "A",
        text: "Synapse",
      },
      {
        id: "B",
        text: "Cell wall",
      },
      {
        id: "C",
        text: "Axon",
      },
      {
        id: "D",
        text: "Myelin sheath",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "A synapse is the junction between two neurons where chemical substances help transmit nerve impulses.",

      steps: [
        "Neurons communicate with one another at junctions called synapses.",
        "There is a tiny gap between the neurons.",
        "Chemical neurotransmitters are released across this gap.",
        "The neurotransmitters stimulate the next neuron.",
        "Therefore, the correct answer is the synapse.",
      ],
    },
  },

  {
    id: "biology-coordination-007",

    question:
      "Which of the following is an example of a reflex action?",

    options: [
      {
        id: "A",
        text: "Writing an examination",
      },
      {
        id: "B",
        text: "Walking to school",
      },
      {
        id: "C",
        text: "Withdrawing the hand from a hot object",
      },
      {
        id: "D",
        text: "Reading a book",
      },
    ],

    correctAnswer: "C",

    explanation: {
      intro:
        "A reflex action is a rapid, automatic response to a stimulus that helps protect the body from harm.",

      steps: [
        "A hot object provides a painful or damaging stimulus.",
        "Pain receptors detect the stimulus.",
        "Nerve impulses are rapidly transmitted through the nervous system.",
        "The muscles of the arm contract and withdraw the hand.",
        "The response occurs automatically without conscious planning.",
        "Therefore, withdrawing the hand from a hot object is a reflex action.",
      ],
    },
  },

  {
    id: "biology-coordination-008",

    question:
      "Which part of the spinal cord is mainly involved in coordinating a simple reflex action?",

    options: [
      {
        id: "A",
        text: "Grey matter",
      },
      {
        id: "B",
        text: "White matter",
      },
      {
        id: "C",
        text: "Cerebellum",
      },
      {
        id: "D",
        text: "Cerebrum",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The grey matter of the spinal cord contains many neuron cell bodies and is involved in processing reflex responses.",

      steps: [
        "A reflex action must occur quickly.",
        "The spinal cord can coordinate many simple reflex actions without requiring the brain to initiate the response.",
        "Grey matter contains many neuron cell bodies and synaptic connections.",
        "These connections allow the reflex pathway to be coordinated.",
        "Therefore, the correct answer is grey matter.",
      ],
    },
  },

  {
    id: "biology-coordination-009",

    question:
      "Which of the following organs detects light entering the eye?",

    options: [
      {
        id: "A",
        text: "Retina",
      },
      {
        id: "B",
        text: "Iris",
      },
      {
        id: "C",
        text: "Cornea",
      },
      {
        id: "D",
        text: "Lens",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The retina contains light-sensitive cells called photoreceptors that detect light and convert it into nerve impulses.",

      steps: [
        "Light enters the eye through the cornea and pupil.",
        "The lens focuses the light onto the retina.",
        "The retina contains rods and cones that are sensitive to light.",
        "These photoreceptors generate nerve impulses.",
        "The impulses are transmitted to the brain through the optic nerve.",
        "Therefore, the correct answer is the retina.",
      ],
    },
  },

  {
    id: "biology-coordination-010",

    question:
      "Which part of the eye controls the amount of light entering the eye?",

    options: [
      {
        id: "A",
        text: "Retina",
      },
      {
        id: "B",
        text: "Iris",
      },
      {
        id: "C",
        text: "Lens",
      },
      {
        id: "D",
        text: "Optic nerve",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "The iris controls the amount of light entering the eye by adjusting the size of the pupil.",

      steps: [
        "The pupil is the opening through which light enters the eye.",
        "The iris contains muscles that control the size of the pupil.",
        "In bright light, the pupil becomes smaller.",
        "In dim light, the pupil becomes larger.",
        "Therefore, the iris controls the amount of light entering the eye.",
      ],
    },
  },

  {
    id: "biology-coordination-011",

    question:
      "Which hormone is produced by the pancreas to lower the concentration of glucose in the blood?",

    options: [
      {
        id: "A",
        text: "Adrenaline",
      },
      {
        id: "B",
        text: "Insulin",
      },
      {
        id: "C",
        text: "Glucagon",
      },
      {
        id: "D",
        text: "Thyroxine",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Insulin helps reduce blood glucose concentration by promoting the uptake and storage of glucose.",

      steps: [
        "Blood glucose concentration must be kept within a suitable range.",
        "After a meal, blood glucose concentration may increase.",
        "The pancreas releases insulin.",
        "Insulin promotes the uptake of glucose by cells and its conversion to glycogen.",
        "This reduces the glucose concentration in the blood.",
        "Therefore, the correct answer is insulin.",
      ],
    },
  },

  {
    id: "biology-coordination-012",

    question:
      "Which hormone increases blood glucose concentration when it becomes too low?",

    options: [
      {
        id: "A",
        text: "Insulin",
      },
      {
        id: "B",
        text: "Glucagon",
      },
      {
        id: "C",
        text: "Thyroxine",
      },
      {
        id: "D",
        text: "Oestrogen",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Glucagon helps increase blood glucose concentration when it falls below the normal range.",

      steps: [
        "The body needs a relatively stable supply of glucose for respiration.",
        "When blood glucose becomes too low, the pancreas releases glucagon.",
        "Glucagon stimulates the liver to convert stored glycogen into glucose.",
        "The glucose is released into the blood.",
        "Therefore, the correct answer is glucagon.",
      ],
    },
  },

  {
    id: "biology-coordination-013",

    question:
      "Which endocrine gland produces thyroxine?",

    options: [
      {
        id: "A",
        text: "Thyroid gland",
      },
      {
        id: "B",
        text: "Pancreas",
      },
      {
        id: "C",
        text: "Adrenal gland",
      },
      {
        id: "D",
        text: "Pituitary gland",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The thyroid gland produces thyroxine, a hormone involved in regulating metabolic activity.",

      steps: [
        "Endocrine glands release hormones into the bloodstream.",
        "The thyroid gland is located in the neck.",
        "It produces the hormone thyroxine.",
        "Thyroxine affects the metabolic rate of the body.",
        "Therefore, the correct answer is the thyroid gland.",
      ],
    },
  },

  {
    id: "biology-coordination-014",

    question:
      "Which hormone is commonly associated with the body's rapid response to stressful situations?",

    options: [
      {
        id: "A",
        text: "Insulin",
      },
      {
        id: "B",
        text: "Adrenaline",
      },
      {
        id: "C",
        text: "Oestrogen",
      },
      {
        id: "D",
        text: "Thyroxine",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Adrenaline prepares the body for rapid action during stressful or threatening situations.",

      steps: [
        "Adrenaline is produced by the adrenal glands.",
        "It prepares the body for rapid physical activity.",
        "It can increase heart rate and breathing rate.",
        "It also increases the availability of glucose for respiration.",
        "Therefore, the correct answer is adrenaline.",
      ],
    },
  },

  {
    id: "biology-coordination-015",

    question:
      "Which of the following is an example of coordination by hormones rather than by nerve impulses?",

    options: [
      {
        id: "A",
        text: "Withdrawal of the hand from a hot object",
      },
      {
        id: "B",
        text: "Changes in growth caused by hormones",
      },
      {
        id: "C",
        text: "Blinking when dust enters the eye",
      },
      {
        id: "D",
        text: "Moving the hand toward an object",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Hormones are chemical messengers that travel through the bloodstream and regulate processes such as growth and development.",

      steps: [
        "Nervous coordination involves electrical impulses travelling along neurons.",
        "Hormonal coordination involves chemical messengers called hormones.",
        "Hormones are transported through the bloodstream.",
        "Growth and development are influenced by several hormones.",
        "Therefore, changes in growth caused by hormones are an example of hormonal coordination.",
      ],
    },
  },

  {
    id: "biology-coordination-016",

    question:
      "Which structure in the nervous system acts as the main communication pathway between the brain and the rest of the body?",

    options: [
      {
        id: "A",
        text: "Spinal cord",
      },
      {
        id: "B",
        text: "Cerebellum",
      },
      {
        id: "C",
        text: "Retina",
      },
      {
        id: "D",
        text: "Pituitary gland",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "The spinal cord carries nerve impulses between the brain and many parts of the body and also coordinates certain reflex actions.",

      steps: [
        "The brain and the rest of the body must communicate continuously.",
        "The spinal cord extends from the brain through the vertebral column.",
        "Sensory impulses can travel toward the brain through the spinal cord.",
        "Motor impulses can travel from the brain to effectors through the spinal cord.",
        "Therefore, the correct answer is the spinal cord.",
      ],
    },
  },

  {
    id: "biology-coordination-017",

    question:
      "Which of the following structures detects changes in the external environment?",

    options: [
      {
        id: "A",
        text: "Receptor",
      },
      {
        id: "B",
        text: "Effector",
      },
      {
        id: "C",
        text: "Motor neuron",
      },
      {
        id: "D",
        text: "Endocrine gland",
      },
    ],

    correctAnswer: "A",

    explanation: {
      intro:
        "Receptors are specialized cells or structures that detect changes, known as stimuli, in the environment.",

      steps: [
        "A stimulus is a detectable change in the environment.",
        "Receptors detect these changes.",
        "Examples include receptors in the eye that detect light and receptors in the ear that detect sound.",
        "The information is then transmitted through sensory neurons.",
        "Therefore, the correct answer is the receptor.",
      ],
    },
  },

  {
    id: "biology-coordination-018",

    question:
      "Which of the following is an effector in a reflex action?",

    options: [
      {
        id: "A",
        text: "Receptor",
      },
      {
        id: "B",
        text: "Muscle",
      },
      {
        id: "C",
        text: "Sensory neuron",
      },
      {
        id: "D",
        text: "Spinal cord",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "An effector is a muscle or gland that carries out a response to a nerve impulse or hormone.",

      steps: [
        "A receptor detects a stimulus.",
        "The nervous system processes the information.",
        "A motor neuron carries the impulse to an effector.",
        "Muscles can contract to produce movement.",
        "Therefore, a muscle is an example of an effector.",
      ],
    },
  },

  {
    id: "biology-coordination-019",

    question:
      "Which of the following best describes a stimulus?",

    options: [
      {
        id: "A",
        text: "A response produced by a muscle",
      },
      {
        id: "B",
        text: "A change that can be detected by an organism",
      },
      {
        id: "C",
        text: "A hormone released into the blood",
      },
      {
        id: "D",
        text: "An electrical impulse in a motor neuron",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "A stimulus is a change in the internal or external environment that can be detected and may produce a response.",

      steps: [
        "Organisms constantly experience changes in their surroundings.",
        "These changes are called stimuli.",
        "Receptors detect stimuli.",
        "The nervous or endocrine system coordinates an appropriate response.",
        "Therefore, a stimulus is a detectable change in the environment.",
      ],
    },
  },

  {
    id: "biology-coordination-020",

    question:
      "What is the main advantage of a reflex action?",

    options: [
      {
        id: "A",
        text: "It allows the organism to think more deeply.",
      },
      {
        id: "B",
        text: "It produces a rapid response that can protect the body.",
      },
      {
        id: "C",
        text: "It prevents all diseases.",
      },
      {
        id: "D",
        text: "It permanently changes the nervous system.",
      },
    ],

    correctAnswer: "B",

    explanation: {
      intro:
        "Reflex actions are rapid and automatic responses that help organisms react quickly to potentially harmful stimuli.",

      steps: [
        "Some environmental changes require an immediate response.",
        "A reflex pathway allows the response to occur rapidly.",
        "The response does not require conscious decision-making before it begins.",
        "This can reduce the risk of injury.",
        "Therefore, the main advantage is that it produces a rapid protective response.",
      ],
    },
  },
];

export default coordinationAndControlQuestions;
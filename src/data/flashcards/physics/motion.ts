



import type { Flashcard } from "@/types/flashcard";

export const MotionFlashcards: Flashcard[] = [
  {
    id: "physics-motion-001",
    subject: "Physics",
    topic: "Motion",
    question: "What is distance?",
    answer: "The total length of the path travelled by an object.",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "distance"],
    source: "JAMB-aligned original study flashcard",
    order: 1,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Distance and Motion",
      description:
        "Change velocity and time to observe how the distance travelled changes.",
      initialValues: {
        velocity: 5,
        acceleration: 0,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-002",
    subject: "Physics",
    topic: "Motion",
    question: "What is displacement?",
    answer:
      "The straight-line change in position from the initial point to the final point, with direction.",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "displacement"],
    source: "JAMB-aligned original study flashcard",
    order: 2,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Displacement",
      description:
        "Change velocity, acceleration, and time to observe the object's displacement.",
      initialValues: {
        velocity: 4,
        acceleration: 0,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-003",
    subject: "Physics",
    topic: "Motion",
    question: "What is speed?",
    answer: "Distance travelled per unit time.",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "speed"],
    source: "JAMB-aligned original study flashcard",
    order: 3,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Speed",
      description:
        "Observe how changing velocity affects the distance travelled over time.",
      initialValues: {
        velocity: 5,
        acceleration: 0,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-004",
    subject: "Physics",
    topic: "Motion",
    question: "What is velocity?",
    answer: "Displacement per unit time in a specified direction.",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "velocity"],
    source: "JAMB-aligned original study flashcard",
    order: 4,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Velocity",
      description:
        "Change the initial velocity and acceleration to see how velocity changes with time.",
      initialValues: {
        velocity: 5,
        acceleration: 2,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-005",
    subject: "Physics",
    topic: "Motion",
    question: "What is acceleration?",
    answer: "The rate of change of velocity with time.",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "acceleration"],
    source: "JAMB-aligned original study flashcard",
    order: 5,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Acceleration",
      description:
        "Increase or decrease acceleration and observe its effect on velocity.",
      initialValues: {
        velocity: 0,
        acceleration: 2,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-006",
    subject: "Physics",
    topic: "Motion",
    question: "What is the SI unit of acceleration?",
    answer: "Metre per second squared (m/s²).",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "acceleration", "units"],
    source: "JAMB-aligned original study flashcard",
    order: 6,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Acceleration in Action",
      description:
        "Observe how acceleration changes velocity every second.",
      initialValues: {
        velocity: 0,
        acceleration: 2,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-007",
    subject: "Physics",
    topic: "Motion",
    question:
      "What does the gradient of a distance-time graph represent?",
    answer: "Speed.",
    difficulty: "medium",
    tags: ["motion", "physics", "jamb", "distance-time-graph", "speed"],
    source: "JAMB-aligned original study flashcard",
    order: 7,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Motion Graphs",
      description:
        "Change the motion and observe how the motion graph changes.",
      initialValues: {
        velocity: 5,
        acceleration: 0,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-008",
    subject: "Physics",
    topic: "Motion",
    question:
      "What does the gradient of a velocity-time graph represent?",
    answer: "Acceleration.",
    difficulty: "medium",
    tags: ["motion", "physics", "jamb", "velocity-time-graph", "acceleration"],
    source: "JAMB-aligned original study flashcard",
    order: 8,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore the Velocity-Time Graph",
      description:
        "Change acceleration and watch the velocity-time graph respond.",
      initialValues: {
        velocity: 0,
        acceleration: 2,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-009",
    subject: "Physics",
    topic: "Motion",
    question:
      "What does the area under a velocity-time graph represent?",
    answer: "Displacement.",
    difficulty: "medium",
    tags: ["motion", "physics", "jamb", "velocity-time-graph", "displacement"],
    source: "JAMB-aligned original study flashcard",
    order: 9,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Displacement from a Graph",
      description:
        "Observe how velocity and time determine displacement.",
      initialValues: {
        velocity: 4,
        acceleration: 1,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-010",
    subject: "Physics",
    topic: "Motion",
    question: "What is uniform motion?",
    answer:
      "Motion in which an object covers equal distances in equal time intervals.",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "uniform-motion"],
    source: "JAMB-aligned original study flashcard",
    order: 10,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Uniform Motion",
      description:
        "Set acceleration to zero and observe constant velocity.",
      initialValues: {
        velocity: 5,
        acceleration: 0,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-011",
    subject: "Physics",
    topic: "Motion",
    question:
      "What is the acceleration of an object moving with constant velocity?",
    answer: "Zero, because its velocity is not changing.",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "constant-velocity"],
    source: "JAMB-aligned original study flashcard",
    order: 11,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Constant Velocity",
      description:
        "Set acceleration to zero and observe that velocity remains constant.",
      initialValues: {
        velocity: 6,
        acceleration: 0,
        time: 5,
      },
    },
  },

  {
    id: "physics-motion-012",
    subject: "Physics",
    topic: "Motion",
    question: "What is free fall?",
    answer:
      "Motion of an object under gravity when air resistance is neglected.",
    difficulty: "easy",
    tags: ["motion", "physics", "jamb", "free-fall", "gravity"],
    source: "JAMB-aligned original study flashcard",
    order: 12,

    simulation: {
      type: "motion",
      enabled: true,
      title: "Explore Accelerated Motion",
      description:
        "Use acceleration to observe how velocity changes during motion.",
      initialValues: {
        velocity: 0,
        acceleration: 9.8,
        time: 5,
      },
    },
  },
];

export default MotionFlashcards;
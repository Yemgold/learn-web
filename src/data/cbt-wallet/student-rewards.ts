




// C:\Users\Lara Spellman\Jamb\jamb-league\src\data\cbt-wallet\student-rewards.ts

import type {
  RewardCategory,
  RewardCategoryOption,
  StudentReward,
} from "@/types/cbt-wallet/reward";

/**
 * Student Rewards Categories
 */
export const rewardCategories: RewardCategoryOption[] = [
  {
    id: "ALL",
    label: "All Rewards",
    description: "Browse all available student rewards.",
    icon: "Gift",
  },
  {
    id: "GADGETS",
    label: "Gadgets",
    description: "Phones, laptops, headphones and other useful gadgets.",
    icon: "Smartphone",
  },
  {
    id: "STUDY",
    label: "Study",
    description: "Items designed to make studying easier and more comfortable.",
    icon: "BookOpen",
  },
  {
    id: "EDUCATION",
    label: "Education",
    description: "Educational resources and examination support.",
    icon: "GraduationCap",
  },
  {
    id: "INTERNET",
    label: "Internet",
    description: "Data and connectivity rewards for learning.",
    icon: "Wifi",
  },
  {
    id: "SCHOOL",
    label: "School",
    description: "Useful school supplies and student essentials.",
    icon: "School",
  },
  {
    id: "VOUCHERS",
    label: "Vouchers",
    description: "Education and student shopping vouchers.",
    icon: "Ticket",
  },
  {
    id: "COMPETITION",
    label: "Competition",
    description: "Rewards and benefits connected to competitions.",
    icon: "Trophy",
  },
];

/**
 * Student Rewards
 *
 * CBT Points required here are example values.
 * They can later be controlled from the backend/admin dashboard.
 */
export const studentRewards: StudentReward[] = [
  // ============================================================
  // GADGETS
  // ============================================================

  {
    id: "student-smartphone",
    title: "Student Smartphone",
    description:
      "A smartphone to support learning, communication, educational apps and online study.",
    category: "GADGETS",
    points: 120000,
    icon: "Smartphone",
    badge: "POPULAR",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
    stock: 5,
    stockLabel: "Limited stock",
    deliveryAvailable: true,
    deliveryTime: "7–14 business days",
  },

  {
    id: "student-laptop",
    title: "Student Laptop",
    description:
      "A laptop to help you learn, research, code, attend online classes and build your future.",
    category: "GADGETS",
    points: 350000,
    icon: "Laptop",
    badge: "BIG_GOAL",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
    stock: 2,
    stockLabel: "Big goal",
    deliveryAvailable: true,
    deliveryTime: "7–14 business days",
  },

  {
    id: "wireless-headphones",
    title: "Wireless Headphones",
    description:
      "Wireless headphones for focused learning, lectures, educational videos and revision.",
    category: "GADGETS",
    points: 20000,
    icon: "Headphones",
    badge: "STUDENT_FAVOURITE",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
    stock: 15,
    deliveryAvailable: true,
    deliveryTime: "3–7 business days",
  },

  {
    id: "smart-watch",
    title: "Student Smart Watch",
    description:
      "A smart watch to help you stay organized and keep track of your daily activities.",
    category: "GADGETS",
    points: 25000,
    icon: "Watch",
    badge: "NEW",
    status: "AVAILABLE",
    featured: false,
    allowSaving: true,
    stock: 10,
    deliveryAvailable: true,
    deliveryTime: "3–7 business days",
  },

  {
    id: "bluetooth-speaker",
    title: "Bluetooth Speaker",
    description:
      "A portable speaker for educational audio, revision sessions and entertainment.",
    category: "GADGETS",
    points: 18000,
    icon: "Speaker",
    badge: "POPULAR",
    status: "AVAILABLE",
    featured: false,
    allowSaving: true,
    stock: 12,
    deliveryAvailable: true,
    deliveryTime: "3–7 business days",
  },

  // ============================================================
  // STUDY
  // ============================================================

  {
    id: "study-desk",
    title: "Student Study Desk",
    description:
      "A dedicated study desk designed to give you a better environment for focused learning.",
    category: "STUDY",
    points: 40000,
    icon: "Table",
    badge: "BIG_GOAL",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
    stock: 4,
    deliveryAvailable: true,
    deliveryTime: "7–14 business days",
  },

  {
    id: "study-lamp",
    title: "Study Lamp",
    description:
      "A practical study lamp for comfortable reading and revision, especially during evening study.",
    category: "STUDY",
    points: 8000,
    icon: "LampDesk",
    badge: "BEST_VALUE",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
    stock: 25,
    deliveryAvailable: true,
    deliveryTime: "3–5 business days",
  },

  {
    id: "student-backpack",
    title: "Learnyfi Student Backpack",
    description:
      "A durable backpack for carrying books, notebooks, gadgets and everyday school essentials.",
    category: "STUDY",
    points: 12000,
    icon: "Backpack",
    badge: "STUDENT_FAVOURITE",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
    stock: 20,
    deliveryAvailable: true,
    deliveryTime: "3–7 business days",
  },

  {
    id: "premium-stationery-set",
    title: "Premium Stationery Set",
    description:
      "A complete stationery package containing useful writing and study materials.",
    category: "STUDY",
    points: 5000,
    icon: "PenLine",
    badge: "BEST_VALUE",
    status: "AVAILABLE",
    featured: false,
    allowSaving: false,
    stock: 50,
    deliveryAvailable: true,
    deliveryTime: "3–5 business days",
  },

  // ============================================================
  // EDUCATION
  // ============================================================

  {
    id: "textbook-bundle",
    title: "JAMB Textbook Bundle",
    description:
      "A curated collection of recommended study materials to support your examination preparation.",
    category: "EDUCATION",
    points: 15000,
    icon: "BookOpen",
    badge: "STUDENT_FAVOURITE",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
    stock: 20,
    deliveryAvailable: true,
    deliveryTime: "3–7 business days",
  },

  {
    id: "jamb-exam-support",
    title: "JAMB Exam Registration Support",
    description:
      "Education support toward your JAMB examination registration.",
    category: "EDUCATION",
    points: 50000,
    icon: "GraduationCap",
    badge: "BIG_GOAL",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
    stock: 10,
    deliveryAvailable: false,
  },

  {
    id: "premium-learning-access",
    title: "30-Day Premium Learning Access",
    description:
      "Unlock premium learning materials, practice resources and advanced learning features for 30 days.",
    category: "EDUCATION",
    points: 10000,
    icon: "Sparkles",
    badge: "POPULAR",
    status: "AVAILABLE",
    featured: false,
    allowSaving: false,
  },

  {
    id: "mock-exam-pack",
    title: "Complete Mock Exam Pack",
    description:
      "Unlock a collection of timed examination simulations for serious preparation.",
    category: "EDUCATION",
    points: 7500,
    icon: "FileQuestion",
    badge: "BEST_VALUE",
    status: "AVAILABLE",
    featured: false,
    allowSaving: false,
  },

  // ============================================================
  // INTERNET
  // ============================================================

  {
    id: "student-data-bundle",
    title: "Student Data Bundle",
    description:
      "A data reward to help you access online lessons, practice questions and educational resources.",
    category: "INTERNET",
    points: 10000,
    icon: "Wifi",
    badge: "POPULAR",
    status: "AVAILABLE",
    featured: true,
    allowSaving: false,
  },

  {
    id: "premium-data-bundle",
    title: "Premium Learning Data Bundle",
    description:
      "Extra connectivity support for students who spend more time learning online.",
    category: "INTERNET",
    points: 20000,
    icon: "Signal",
    badge: "NEW",
    status: "AVAILABLE",
    featured: false,
    allowSaving: true,
  },

  // ============================================================
  // SCHOOL
  // ============================================================

  {
    id: "school-writing-kit",
    title: "Complete Writing Kit",
    description:
      "Pens, pencils, erasers, ruler and other essential materials for school and examinations.",
    category: "SCHOOL",
    points: 5000,
    icon: "Pencil",
    badge: "BEST_VALUE",
    status: "AVAILABLE",
    featured: false,
    allowSaving: false,
    stock: 50,
    deliveryAvailable: true,
    deliveryTime: "3–5 business days",
  },

  {
    id: "school-backpack",
    title: "Premium School Backpack",
    description:
      "A strong and comfortable backpack suitable for everyday school use.",
    category: "SCHOOL",
    points: 15000,
    icon: "Backpack",
    badge: "POPULAR",
    status: "AVAILABLE",
    featured: false,
    allowSaving: true,
    stock: 15,
    deliveryAvailable: true,
    deliveryTime: "3–7 business days",
  },

  // ============================================================
  // VOUCHERS
  // ============================================================

  {
    id: "education-voucher-5000",
    title: "₦5,000 Education Voucher",
    description:
      "Use this voucher toward eligible educational products or services.",
    category: "VOUCHERS",
    points: 35000,
    icon: "Ticket",
    badge: "POPULAR",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
  },

  {
    id: "education-voucher-10000",
    title: "₦10,000 Education Voucher",
    description:
      "A larger education voucher for eligible learning materials and educational services.",
    category: "VOUCHERS",
    points: 70000,
    icon: "Ticket",
    badge: "BIG_GOAL",
    status: "AVAILABLE",
    featured: true,
    allowSaving: true,
  },

  // ============================================================
  // COMPETITION
  // ============================================================

  {
    id: "quiz-board-entry",
    title: "Quiz Board Competition Entry",
    description:
      "Use your CBT Points to enter an eligible Quiz Board competition.",
    category: "COMPETITION",
    points: 5000,
    icon: "Trophy",
    badge: "POPULAR",
    status: "AVAILABLE",
    featured: false,
    allowSaving: false,
  },

  {
    id: "solve-and-win-entry",
    title: "Solve & Win Competition Entry",
    description:
      "Use your CBT Points to enter an eligible Solve & Win competition.",
    category: "COMPETITION",
    points: 5000,
    icon: "Trophy",
    badge: "POPULAR",
    status: "AVAILABLE",
    featured: false,
    allowSaving: false,
  },
];

/**
 * Get rewards by category.
 */
export function getRewardsByCategory(
  category: RewardCategory
): StudentReward[] {
  return studentRewards.filter(
    (reward) => reward.category === category
  );
}

/**
 * Get featured rewards.
 */
export function getFeaturedRewards(): StudentReward[] {
  return studentRewards.filter(
    (reward) => reward.featured && reward.status === "AVAILABLE"
  );
}

/**
 * Get available rewards.
 */
export function getAvailableRewards(): StudentReward[] {
  return studentRewards.filter(
    (reward) => reward.status === "AVAILABLE"
  );
}

/**
 * Find a reward by ID.
 */
export function getRewardById(
  rewardId: string
): StudentReward | undefined {
  return studentRewards.find(
    (reward) => reward.id === rewardId
  );
}

/**
 * Calculate the student's progress toward a reward.
 */
export function calculateRewardProgress(
  reward: StudentReward,
  currentPoints: number
): number {
  if (reward.points <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((currentPoints / reward.points) * 100)
  );
}

/**
 * Calculate points remaining before a reward can be redeemed.
 */
export function getPointsRemaining(
  reward: StudentReward,
  currentPoints: number
): number {
  return Math.max(0, reward.points - currentPoints);
}

/**
 * Determine whether the student can redeem a reward.
 */
export function canRedeemReward(
  reward: StudentReward,
  currentPoints: number
): boolean {
  return (
    reward.status === "AVAILABLE" &&
    currentPoints >= reward.points &&
    (reward.stock === undefined || reward.stock > 0)
  );
}

/**
 * Determine whether a reward can be saved toward.
 */
export function canSaveForReward(
  reward: StudentReward
): boolean {
  return (
    reward.status === "AVAILABLE" &&
    reward.allowSaving === true
  );
}

/**
 * Format CBT Points for display.
 */
export function formatRewardPoints(points: number): string {
  return `${points.toLocaleString("en-NG")} pts`;
}
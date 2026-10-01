



"use client";

import {
  BookOpen,
  GraduationCap,
  Grid3X3,
  Headphones,
  Laptop,
  School,
  Smartphone,
  Trophy,
  Wifi,
} from "lucide-react";

import type { RewardCategory } from "@/types/cbt-wallet/reward";

interface RewardCategoryTabsProps {
  value: "ALL" | RewardCategory;
  onChange: (category: "ALL" | RewardCategory) => void;
  className?: string;
}

interface CategoryItem {
  id: "ALL" | RewardCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categories: CategoryItem[] = [
  {
    id: "ALL",
    label: "All",
    icon: Grid3X3,
  },
  {
    id: "GADGETS",
    label: "Gadgets",
    icon: Smartphone,
  },
  {
    id: "STUDY",
    label: "Study",
    icon: BookOpen,
  },
  {
    id: "EDUCATION",
    label: "Education",
    icon: GraduationCap,
  },
  {
    id: "INTERNET",
    label: "Internet",
    icon: Wifi,
  },
  {
    id: "SCHOOL",
    label: "School",
    icon: School,
  },
  {
    id: "VOUCHERS",
    label: "Vouchers",
    icon: Laptop,
  },
  {
    id: "COMPETITION",
    label: "Competition",
    icon: Trophy,
  },
];

export default function RewardCategoryTabs({
  value,
  onChange,
  className = "",
}: RewardCategoryTabsProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <div className="flex min-w-max gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = value === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onChange(category.id)}
                aria-pressed={active}
                className={[
                  "group flex items-center gap-2 rounded-xl border px-4 py-2.5",
                  "text-sm font-medium transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/40",
                  active
                    ? "border-violet-500/40 bg-violet-500/15 text-violet-300 shadow-lg shadow-violet-500/5"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-200",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-4 w-4 transition-colors",
                    active
                      ? "text-violet-400"
                      : "text-slate-500 group-hover:text-slate-300",
                  ].join(" ")}
                />

                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}




"use client";

import { Search, Filter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LeaderboardFiltersProps {
  search?: string;
  state?: string;
  sortBy?: string;

  onSearchChange?: (value: string) => void;
  onStateChange?: (value: string) => void;
  onSortChange?: (value: string) => void;

  className?: string;
}

const STATES = [
  "All States",
  "Abia",
  "Abuja",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const SORT_OPTIONS = [
  {
    value: "rank",
    label: "Rank",
  },
  {
    value: "score",
    label: "Highest Score",
  },
  {
    value: "competitions",
    label: "Most Competitions",
  },
];

export default function LeaderboardFilters({
  search = "",
  state = "All States",
  sortBy = "rank",

  onSearchChange,
  onStateChange,
  onSortChange,

  className,
}: LeaderboardFiltersProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* Search */}
        <div className="flex-1">
          <Input
            label="Search Team"
            placeholder="Search by team or school..."
            value={search}
            onChange={(e) =>
              onSearchChange?.(e.target.value)
            }
            leftIcon={
              <Search className="h-4 w-4" />
            }
          />
        </div>

        {/* State */}
        <div className="w-full lg:w-60">
          <label className="mb-1.5 block text-sm font-medium">
            State
          </label>

          <select
            value={state}
            onChange={(e) =>
              onStateChange?.(e.target.value)
            }
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none transition focus:border-blue-500"
          >
            {STATES.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="w-full lg:w-60">
          <label className="mb-1.5 block text-sm font-medium">
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange?.(e.target.value)
            }
            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none transition focus:border-blue-500"
          >
            {SORT_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <Button
          size="lg"
          leftIcon={
            <Filter className="h-4 w-4" />
          }
        >
          Apply Filters
        </Button>
      </div>
    </section>
  );
}
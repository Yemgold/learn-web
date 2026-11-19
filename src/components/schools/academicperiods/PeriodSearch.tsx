





"use client";

import { Search } from "lucide-react";

import type { AcademicPeriodSearchProps } from "@/types/schools/academic-period.types"; 

export default function AcademicPeriodSearch({
  searchTerm,
  onSearchChange,
}: AcademicPeriodSearchProps) {
  return (
    <div className="border-b border-gray-100 p-5">
      <div className="relative max-w-md">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search academic periods..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}

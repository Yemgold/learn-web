




import { GraduationCap } from "lucide-react";
import type { EnrollmentCountProps } from "@/types/schools/enrollment.types"; 
import { getBackendEnrollmentCount } from "@/lib/schools/utils/enrollment.utils"; 

export default function EnrollmentCount({
  counts,
  loading,
}: EnrollmentCountProps) {
  const count = getBackendEnrollmentCount(counts);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
         
        </div>

        <div className="text-sm font-semibold text-gray-900">
          {loading ? "Loading..." : count ?? "—"}
        </div>
      </div>
    </div>
  );
}

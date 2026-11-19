



import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Users,
} from "lucide-react";

import SummaryCard from "../shared/SummaryCard";
import type { EnrollmentSummaryProps } from "@/types/schools/enrollment.types"; 

export default function EnrollmentSummary({
  summary,
  loading,
}: EnrollmentSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Total Enrollments"
        value={summary.total}
        icon={<Users size={20} />}
        color="blue"
        loading={loading}
      />

      <SummaryCard
        title="Active Enrollments"
        value={summary.active}
        icon={<Activity size={20} />}
        color="green"
        loading={loading}
      />

      <SummaryCard
        title="Completed"
        value={summary.completed}
        icon={<CheckCircle2 size={20} />}
        color="purple"
        loading={loading}
      />

      <SummaryCard
        title="Withdrawn"
        value={summary.withdrawn}
        icon={<ClipboardList size={20} />}
        color="red"
        loading={loading}
      />
    </div>
  );
}

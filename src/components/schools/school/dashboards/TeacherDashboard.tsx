





import type { TeacherDashboard as TeacherDashboardData } from "@/lib/schools/portal/services/dashboard.service";

interface TeacherDashboardProps {
  dashboard: TeacherDashboardData;
}

type DataRecord = Record<string, unknown>;

function asRecord(value: unknown): DataRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as DataRecord)
    : {};
}

function formatLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return Array.isArray(value) ? `${value.length} items` : "Available";
  return String(value);
}

function DataSection({
  title,
  items,
}: {
  title: string;
  items: unknown;
}) {
  const records = Array.isArray(items) ? items : [];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>

      {records.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing to display yet.</p>
      ) : (
        <div className="space-y-3">
          {records.slice(0, 5).map((item, index) => {
            const record = asRecord(item);

            return (
              <div
                key={String(record._id ?? record.id ?? index)}
                className="rounded-lg bg-gray-50 p-3"
              >
                {Object.entries(record)
                  .filter(([key, value]) =>
                    !["_id", "id", "__v", "password"].includes(key) &&
                    (typeof value === "string" || typeof value === "number")
                  )
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-700">
                      <span className="font-medium">{formatLabel(key)}:</span>{" "}
                      {formatValue(value)}
                    </p>
                  ))}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function TeacherDashboard({
  dashboard,
}: TeacherDashboardProps) {
  const data = asRecord(dashboard);
  const stats = asRecord(data.stats);
  const teacher = asRecord(data.teacher);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-600">Teacher Portal</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Welcome{teacher.firstName ? `, ${String(teacher.firstName)}` : ""}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your classes, subjects, and assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{formatLabel(key)}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataSection title="Assigned Classes" items={data.assignedClasses} />
        <DataSection title="Assigned Subjects" items={data.assignedSubjects} />
        <DataSection title="Recent Assignments" items={data.recentAssignments} />
        <DataSection title="Recent Activities" items={data.recentActivities} />
      </div>
    </div>
  );
}

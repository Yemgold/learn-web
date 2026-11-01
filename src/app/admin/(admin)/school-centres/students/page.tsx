



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserRound,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  ChevronDown,
  UserPlus,
  AlertCircle,
} from "lucide-react";

import Link from "next/link";

const STUDENTS_STORAGE_KEY = "learnyfi-school-centres-students";
const INSTITUTIONS_STORAGE_KEY = "learnyfi-school-centres-institutions";
const CLASSES_STORAGE_KEY = "learnyfi-school-centres-classes";

type StudentStatus = "Active" | "Inactive" | "Pending";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institutionId: string;
  institutionName: string;
  classId: string;
  className: string;
  admissionNumber: string;
  gender: string;
  state: string;
  address: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt?: string;
};

type Institution = {
  id: string;
  name: string;
  status?: string;
};

type SchoolClass = {
  id: string;
  name: string;
  level?: string;
  institutionId: string;
  institutionName?: string;
  status?: string;
};

type StudentForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institutionId: string;
  classId: string;
  admissionNumber: string;
  gender: string;
  state: string;
  address: string;
  status: StudentStatus;
};

const EMPTY_FORM: StudentForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  institutionId: "",
  classId: "",
  admissionNumber: "",
  gender: "",
  state: "",
  address: "",
  status: "Active",
};

const NIGERIAN_STATES = [
  "Abia",
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
  "FCT",
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

function readStorage<T,>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function saveStorage<T,>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
}

export default function SchoolCentreStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const [form, setForm] = useState<StudentForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(() => {
    setStudents(readStorage<Student>(STUDENTS_STORAGE_KEY));
    setInstitutions(
      readStorage<Institution>(INSTITUTIONS_STORAGE_KEY)
    );
    setClasses(readStorage<SchoolClass>(CLASSES_STORAGE_KEY));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === STUDENTS_STORAGE_KEY ||
        event.key === INSTITUTIONS_STORAGE_KEY ||
        event.key === CLASSES_STORAGE_KEY
      ) {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadData]);

  const filteredClasses = useMemo(() => {
    if (!form.institutionId) return [];

    return classes.filter(
      (item) =>
        item.institutionId === form.institutionId &&
        item.status !== "Inactive"
    );
  }, [classes, form.institutionId]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const fullName =
        `${student.firstName} ${student.lastName}`.toLowerCase();

      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.phone?.toLowerCase().includes(query) ||
        student.admissionNumber?.toLowerCase().includes(query) ||
        student.institutionName?.toLowerCase().includes(query) ||
        student.className?.toLowerCase().includes(query);

      const matchesInstitution =
        institutionFilter === "all" ||
        student.institutionId === institutionFilter;

      const matchesClass =
        classFilter === "all" ||
        student.classId === classFilter;

      const matchesStatus =
        statusFilter === "all" ||
        student.status === statusFilter;

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesClass &&
        matchesStatus
      );
    });
  }, [
    students,
    search,
    institutionFilter,
    classFilter,
    statusFilter,
  ]);

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const pendingCount = students.filter(
    (student) => student.status === "Pending"
  ).length;

  const inactiveCount = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  const openCreateModal = () => {
    setSelectedStudent(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);

    setForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      institutionId: student.institutionId || "",
      classId: student.classId || "",
      admissionNumber: student.admissionNumber || "",
      gender: student.gender || "",
      state: student.state || "",
      address: student.address || "",
      status: student.status || "Active",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setSelectedStudent(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const updateForm = <K extends keyof StudentForm>(
    field: K,
    value: StudentForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleInstitutionChange = (institutionId: string) => {
    setForm((previous) => ({
      ...previous,
      institutionId,
      classId: "",
    }));
  };

  const handleSaveStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!firstName || !lastName) {
      setError("Enter the student's first name and last name.");
      return;
    }

    if (!email) {
      setError("Enter the student's email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!phone) {
      setError("Enter the student's phone number.");
      return;
    }

    if (!form.institutionId) {
      setError("Select an institution.");
      return;
    }

    if (!form.classId) {
      setError("Select a class.");
      return;
    }

    const institution = institutions.find(
      (item) => item.id === form.institutionId
    );

    const selectedClass = classes.find(
      (item) => item.id === form.classId
    );

    if (!institution || !selectedClass) {
      setError("The selected institution or class could not be found.");
      return;
    }

    const duplicateEmail = students.some(
      (student) =>
        student.email?.toLowerCase() === email &&
        student.id !== selectedStudent?.id
    );

    if (duplicateEmail) {
      setError("A student with this email address already exists.");
      return;
    }

    const duplicateAdmissionNumber =
      form.admissionNumber.trim() &&
      students.some(
        (student) =>
          student.admissionNumber?.toLowerCase() ===
            form.admissionNumber.trim().toLowerCase() &&
          student.id !== selectedStudent?.id
      );

    if (duplicateAdmissionNumber) {
      setError("This admission number is already registered.");
      return;
    }

    setSaving(true);

    try {
      const now = new Date().toISOString();

      const studentRecord: Student = {
        id: selectedStudent?.id || crypto.randomUUID(),
        firstName,
        lastName,
        email,
        phone,
        institutionId: institution.id,
        institutionName: institution.name,
        classId: selectedClass.id,
        className: selectedClass.name,
        admissionNumber: form.admissionNumber.trim(),
        gender: form.gender,
        state: form.state,
        address: form.address.trim(),
        status: form.status,
        createdAt: selectedStudent?.createdAt || now,
        updatedAt: now,
      };

      const updatedStudents = selectedStudent
        ? students.map((student) =>
            student.id === selectedStudent.id
              ? studentRecord
              : student
          )
        : [...students, studentRecord];

      saveStorage(STUDENTS_STORAGE_KEY, updatedStudents);
      setStudents(updatedStudents);

      setShowModal(false);
      setSelectedStudent(null);
      setForm(EMPTY_FORM);

      setSuccess(
        selectedStudent
          ? "Student details updated successfully."
          : "Student registered successfully."
      );
    } catch {
      setError("Unable to save student details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = (student: Student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const updatedStudents = students.filter(
        (item) => item.id !== student.id
      );

      saveStorage(STUDENTS_STORAGE_KEY, updatedStudents);
      setStudents(updatedStudents);
      setViewStudent(null);
      setSuccess("Student deleted successfully.");
      setError("");
    } catch {
      setError("Unable to delete this student.");
    }
  };

  const toggleStudentStatus = (student: Student) => {
    const nextStatus: StudentStatus =
      student.status === "Active" ? "Inactive" : "Active";

    const updatedStudents: Student[] = students.map((item) =>
      item.id === student.id
        ? {
            ...item,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    try {
      saveStorage(STUDENTS_STORAGE_KEY, updatedStudents);
      setStudents(updatedStudents);
      setViewStudent(null);

      setSuccess(
        nextStatus === "Active"
          ? "Student activated successfully."
          : "Student deactivated successfully."
      );
      setError("");
    } catch {
      setError("Unable to update student status.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setInstitutionFilter("all");
    setClassFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
              <Link
                href="/admin/school-centres"
                className="transition hover:text-white"
              >
                School & Study Centres
              </Link>
              <span>/</span>
              <span className="text-white">Students</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Students Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Register, organize, and manage students across your
              registered schools and study centres.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
          >
            <UserPlus size={18} />
            Register Student
          </button>
        </div>

        {/* Notifications */}
        {success && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} />
              {success}
            </div>

            <button onClick={() => setSuccess("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {error && !showModal && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle size={17} />
              {error}
            </div>

            <button onClick={() => setError("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Students"
            value={students.length}
            icon={Users}
            color="violet"
            description="All registered students"
          />

          <StatCard
            title="Active Students"
            value={activeCount}
            icon={CheckCircle2}
            color="emerald"
            description="Currently active"
          />

          <StatCard
            title="Pending Students"
            value={pendingCount}
            icon={Clock}
            color="amber"
            description="Awaiting activation"
          />

          <StatCard
            title="Inactive Students"
            value={inactiveCount}
            icon={XCircle}
            color="rose"
            description="Currently inactive"
          />
        </div>

        {/* Institution notice */}
        {institutions.length === 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 text-amber-400" size={21} />

              <div>
                <h3 className="font-semibold text-amber-200">
                  No institution registered yet
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Register an institution and create its classes before
                  adding students.
                </p>

                <Link
                  href="/admin/school-centres/institutions/register"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200"
                >
                  Register institution
                  <Plus size={15} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter size={17} className="text-violet-400" />
              <h2 className="font-semibold">Find Students</h2>
            </div>

            <button
              onClick={clearFilters}
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              Clear filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, admission no..."
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <SelectField
              value={institutionFilter}
              onChange={setInstitutionFilter}
              options={[
                { value: "all", label: "All Institutions" },
                ...institutions.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />

            <SelectField
              value={classFilter}
              onChange={setClassFilter}
              options={[
                { value: "all", label: "All Classes" },
                ...classes.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />

            <SelectField
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "Active", label: "Active" },
                { value: "Pending", label: "Pending" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </div>
        </div>

        {/* Student list */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Registered Students</h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredStudents.length} of {students.length} students
              </p>
            </div>

            <button
              onClick={loadData}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white sm:self-auto"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <RefreshCw className="animate-spin" size={18} />
                Loading students...
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-5 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800">
                <GraduationCap size={30} className="text-slate-500" />
              </div>

              <h3 className="text-lg font-semibold">
                {students.length === 0
                  ? "No students registered yet"
                  : "No matching students"}
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-400">
                {students.length === 0
                  ? "Students registered through this page will appear here. Start by adding your first student."
                  : "Try changing your search or filters to find the student you're looking for."}
              </p>

              {students.length === 0 && institutions.length > 0 && (
                <button
                  onClick={openCreateModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <Plus size={17} />
                  Register First Student
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">Student</th>
                      <th className="px-5 py-4 font-medium">Institution</th>
                      <th className="px-5 py-4 font-medium">Class</th>
                      <th className="px-5 py-4 font-medium">Admission No.</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Date Added</th>
                      <th className="px-5 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/80">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="transition hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar student={student} />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {student.firstName} {student.lastName}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[190px] truncate text-sm text-slate-300">
                            {student.institutionName || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-300">
                            {student.className || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {student.admissionNumber || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={student.status} />
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {formatDate(student.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <ActionButton
                              title="View student"
                              onClick={() => setViewStudent(student)}
                            >
                              <Eye size={16} />
                            </ActionButton>

                            <ActionButton
                              title="Edit student"
                              onClick={() => openEditModal(student)}
                            >
                              <Pencil size={16} />
                            </ActionButton>

                            <ActionButton
                              title={
                                student.status === "Active"
                                  ? "Deactivate student"
                                  : "Activate student"
                              }
                              onClick={() => toggleStudentStatus(student)}
                            >
                              {student.status === "Active" ? (
                                <XCircle size={16} />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                            </ActionButton>

                            <ActionButton
                              title="Delete student"
                              danger
                              onClick={() => deleteStudent(student)}
                            >
                              <Trash2 size={16} />
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile and tablet cards */}
              <div className="grid grid-cols-1 gap-3 p-4 lg:hidden">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar student={student} />

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {student.firstName} {student.lastName}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={student.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4">
                      <InfoItem
                        label="Institution"
                        value={student.institutionName || "—"}
                      />

                      <InfoItem
                        label="Class"
                        value={student.className || "—"}
                      />

                      <InfoItem
                        label="Admission No."
                        value={student.admissionNumber || "—"}
                      />

                      <InfoItem
                        label="Date Added"
                        value={formatDate(student.createdAt)}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
                      <button
                        onClick={() => setViewStudent(student)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        onClick={() => openEditModal(student)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => toggleStudentStatus(student)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
                      >
                        {student.status === "Active" ? (
                          <XCircle size={14} />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        {student.status === "Active" ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => deleteStudent(student)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>School & Study Centres · Students Management</p>
          <p>Student records are currently stored in this browser.</p>
        </div>
      </div>

      {/* Create / Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold">
                  {selectedStudent ? "Edit Student" : "Register New Student"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Enter the student's details below.
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStudent}>
              <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5 sm:p-6">
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <FormSection title="Personal Information">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput
                      label="First Name"
                      value={form.firstName}
                      onChange={(value) => updateForm("firstName", value)}
                      placeholder="Enter first name"
                      required
                    />

                    <FormInput
                      label="Last Name"
                      value={form.lastName}
                      onChange={(value) => updateForm("lastName", value)}
                      placeholder="Enter last name"
                      required
                    />

                    <FormInput
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={(value) => updateForm("email", value)}
                      placeholder="student@example.com"
                      required
                    />

                    <FormInput
                      label="Phone Number"
                      type="tel"
                      value={form.phone}
                      onChange={(value) => updateForm("phone", value)}
                      placeholder="08012345678"
                      required
                    />

                    <FormSelect
                      label="Gender"
                      value={form.gender}
                      onChange={(value) => updateForm("gender", value)}
                      options={[
                        { value: "", label: "Select gender" },
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ]}
                    />

                    <FormSelect
                      label="State"
                      value={form.state}
                      onChange={(value) => updateForm("state", value)}
                      options={[
                        { value: "", label: "Select state" },
                        ...NIGERIAN_STATES.map((state) => ({
                          value: state,
                          label: state,
                        })),
                      ]}
                    />

                    <div className="sm:col-span-2">
                      <FormInput
                        label="Residential Address"
                        value={form.address}
                        onChange={(value) => updateForm("address", value)}
                        placeholder="Enter residential address"
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Institution & Academic Details">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormSelect
                      label="Institution"
                      value={form.institutionId}
                      onChange={handleInstitutionChange}
                      options={[
                        { value: "", label: "Select institution" },
                        ...institutions.map((item) => ({
                          value: item.id,
                          label: item.name,
                        })),
                      ]}
                      required
                    />

                    <FormSelect
                      label="Class"
                      value={form.classId}
                      onChange={(value) => updateForm("classId", value)}
                      disabled={!form.institutionId}
                      options={[
                        {
                          value: "",
                          label: form.institutionId
                            ? "Select class"
                            : "Select institution first",
                        },
                        ...filteredClasses.map((item) => ({
                          value: item.id,
                          label: item.level
                            ? `${item.name} (${item.level})`
                            : item.name,
                        })),
                      ]}
                      required
                    />

                    <FormInput
                      label="Admission Number"
                      value={form.admissionNumber}
                      onChange={(value) =>
                        updateForm("admissionNumber", value)
                      }
                      placeholder="e.g. SCH/2026/001"
                    />

                    <FormSelect
                      label="Student Status"
                      value={form.status}
                      onChange={(value) =>
                        updateForm("status", value as StudentStatus)
                      }
                      options={[
                        { value: "Active", label: "Active" },
                        { value: "Pending", label: "Pending" },
                        { value: "Inactive", label: "Inactive" },
                      ]}
                    />
                  </div>

                  {form.institutionId && filteredClasses.length === 0 && (
                    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300">
                      No active classes are available for this institution.
                      Create a class before registering this student.
                      <Link
                        href="/admin/school-centres/classes"
                        className="ml-1 font-semibold underline"
                      >
                        Manage classes
                      </Link>
                    </div>
                  )}
                </FormSection>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    institutions.length === 0 ||
                    !form.institutionId ||
                    filteredClasses.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {selectedStudent ? "Save Changes" : "Register Student"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <h2 className="font-bold">Student Profile</h2>

              <button
                onClick={() => setViewStudent(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-2xl font-bold text-violet-300">
                  {getInitials(
                    viewStudent.firstName,
                    viewStudent.lastName
                  )}
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  {viewStudent.firstName} {viewStudent.lastName}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {viewStudent.admissionNumber || "No admission number"}
                </p>

                <div className="mt-3">
                  <StatusBadge status={viewStudent.status} />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ProfileDetail
                  icon={Mail}
                  label="Email Address"
                  value={viewStudent.email}
                />

                <ProfileDetail
                  icon={Phone}
                  label="Phone Number"
                  value={viewStudent.phone}
                />

                <ProfileDetail
                  icon={Building2}
                  label="Institution"
                  value={viewStudent.institutionName}
                />

                <ProfileDetail
                  icon={GraduationCap}
                  label="Class"
                  value={viewStudent.className}
                />

                <ProfileDetail
                  icon={UserRound}
                  label="Gender"
                  value={viewStudent.gender || "Not provided"}
                />

                <ProfileDetail
                  icon={MapPin}
                  label="State"
                  value={viewStudent.state || "Not provided"}
                />

                <ProfileDetail
                  icon={MapPin}
                  label="Address"
                  value={viewStudent.address || "Not provided"}
                />

                <ProfileDetail
                  icon={Clock}
                  label="Date Registered"
                  value={formatDate(viewStudent.createdAt)}
                />
              </div>

              <div className="mt-7 flex flex-col gap-2 border-t border-slate-800 pt-5 sm:flex-row">
                <button
                  onClick={() => {
                    const student = viewStudent;
                    setViewStudent(null);
                    openEditModal(student);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <Pencil size={16} />
                  Edit Student
                </button>

                <button
                  onClick={() => deleteStudent(viewStudent)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   Reusable Components
------------------------------------------------------- */

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "violet" | "emerald" | "amber" | "rose";
  description: string;
}) {
  const colors = {
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${colors[color]}`}
        >
          <Icon size={23} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function Avatar({ student }: { student: Student }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-xs font-bold text-violet-300">
      {getInitials(student.firstName, student.lastName)}
    </div>
  );
}

function StatusBadge({ status }: { status: StudentStatus }) {
  const styles: Record<StudentStatus, string> = {
    Active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Inactive: "border-slate-600 bg-slate-800 text-slate-400",
    Pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[status] || styles.Pending}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Active"
            ? "bg-emerald-400"
            : status === "Inactive"
              ? "bg-slate-400"
              : "bg-amber-400"
        }`}
      />
      {status}
    </span>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-slate-500 hover:bg-red-500/10 hover:text-red-400"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-3 pr-9 text-sm text-slate-300 outline-none transition focus:border-violet-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 border-b border-slate-800 pb-3 text-sm font-semibold text-violet-300">
        {title}
      </h3>

      {children}
    </section>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-400">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-400">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          disabled={disabled}
          className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-3 pr-9 text-sm text-white outline-none transition focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </label>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-xs font-medium text-slate-300">
        {value}
      </p>
    </div>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <div className="mt-0.5 text-violet-400">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm text-slate-200">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

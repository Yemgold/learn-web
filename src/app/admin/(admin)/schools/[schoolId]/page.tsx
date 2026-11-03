




"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Settings,
  ShieldCheck,
  Users,
  UserRound,
  UserRoundCheck,
  Globe,
  School,
  TrendingUp,
  XCircle,
} from "lucide-react";

type SchoolStatus = "ACTIVE" | "INACTIVE";

interface SchoolDetails {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  status: SchoolStatus;
  principal: string;
  motto: string;
  primaryColor: string;
  secondaryColor: string;
  createdAt: string;
  subscription: string;
  subscriptionStatus: string;
  studentCount: number;
  teacherCount: number;
  classCount: number;
}

const MOCK_SCHOOLS: SchoolDetails[] = [
  {
    id: "school-001",
    name: "De Rock International School",
    slug: "derock",
    email: "info@derockschool.com",
    phone: "+234 801 234 5678",
    address: "Ikeja, Lagos State, Nigeria",
    status: "ACTIVE",
    principal: "Mrs. Elizabeth Johnson",
    motto: "Building Excellence Through Education",
    primaryColor: "#2563eb",
    secondaryColor: "#0f172a",
    createdAt: "2026-01-15",
    subscription: "School Premium",
    subscriptionStatus: "Active",
    studentCount: 1250,
    teacherCount: 68,
    classCount: 32,
  },
  {
    id: "school-002",
    name: "Born To Win Academy",
    slug: "borntowin",
    email: "admin@borntowin.edu.ng",
    phone: "+234 802 345 6789",
    address: "Lekki, Lagos State, Nigeria",
    status: "ACTIVE",
    principal: "Mr. Daniel Williams",
    motto: "Raising Future Leaders",
    primaryColor: "#16a34a",
    secondaryColor: "#14532d",
    createdAt: "2026-02-10",
    subscription: "School Standard",
    subscriptionStatus: "Active",
    studentCount: 860,
    teacherCount: 42,
    classCount: 24,
  },
];

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function SchoolDetailsPage() {
  const params = useParams();
  const schoolId = String(params.schoolId ?? "");

  const school = useMemo(
    () =>
      MOCK_SCHOOLS.find(
        (item) => item.id === schoolId || item.slug === schoolId
      ) ?? MOCK_SCHOOLS[0],
    [schoolId]
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const portalUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${school.slug}.learnyfi.com.ng`
      : `https://${school.slug}.learnyfi.com.ng`;

  const copyPortal = async () => {
    try {
      await navigator.clipboard.writeText(portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy portal address. Please copy it manually.");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "students", label: "Students" },
    { id: "teachers", label: "Teachers" },
    { id: "classes", label: "Classes" },
  ];

  const managementLinks = [
    {
      title: "Manage Students",
      description: "View, register and manage school students.",
      icon: GraduationCap,
      href: `/admin/schools/${school.id}/students`,
      color: "blue",
    },
    {
      title: "Manage Teachers",
      description: "Manage teachers and their accounts.",
      icon: UserRoundCheck,
      href: `/admin/schools/${school.id}/teachers`,
      color: "purple",
    },
    {
      title: "Classes & Arms",
      description: "Organise classes, arms and class teachers.",
      icon: BookOpen,
      href: `/admin/schools/${school.id}/classes`,
      color: "orange",
    },
    {
      title: "Academic Sessions",
      description: "Configure academic sessions and terms.",
      icon: CalendarDays,
      href: `/admin/schools/${school.id}/sessions`,
      color: "green",
    },
    {
      title: "School Settings",
      description: "Update branding and school information.",
      icon: Settings,
      href: `/admin/schools/${school.id}/settings`,
      color: "slate",
    },
  ];

  const stats = [
    {
      label: "Total Students",
      value: school.studentCount.toLocaleString(),
      icon: GraduationCap,
      detail: "Registered students",
      color: "blue",
    },
    {
      label: "Total Teachers",
      value: school.teacherCount.toLocaleString(),
      icon: Users,
      detail: "Teaching staff",
      color: "purple",
    },
    {
      label: "Classes",
      value: school.classCount.toLocaleString(),
      icon: BookOpen,
      detail: "Classes and arms",
      color: "orange",
    },
    {
      label: "School Status",
      value: school.status === "ACTIVE" ? "Active" : "Inactive",
      icon: ShieldCheck,
      detail: "Portal availability",
      color: "green",
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/admin/schools"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Schools
            </Link>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span>Admin</span>
              <ChevronRight size={13} />
              <span>Schools</span>
              <ChevronRight size={13} />
              <span className="font-medium text-slate-700">
                {school.name}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <MoreHorizontal size={18} />
              Actions
            </button>

            {showActions && (
              <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <Link
                  href={`/admin/schools/${school.id}/settings`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Settings size={16} />
                  Edit School
                </Link>
                <button
                  onClick={copyPortal}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Copy size={16} />
                  Copy Portal Link
                </button>
                <button
                  onClick={() => setShowActions(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <XCircle size={16} />
                  Close Menu
                </button>
              </div>
            )}
          </div>
        </div>

        {/* School Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            className="h-2"
            style={{ backgroundColor: school.primaryColor }}
          />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm sm:h-20 sm:w-20"
                style={{ backgroundColor: school.primaryColor }}
              >
                <School size={34} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {school.name}
                  </h1>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      school.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {school.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {school.motto}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} />
                    {school.address}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    Joined {formatDate(school.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/schools/${school.id}/settings`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <Settings size={16} />
                Edit School
              </Link>
            </div>
          </div>
        </section>

        {/* Portal Card */}
        <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm">
                <Globe size={23} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  School Portal
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your school's dedicated Learnyfi portal address.
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-blue-700">
                  {portalUrl}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyPortal}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Copy size={15} />
                {copied ? "Copied!" : "Copy Link"}
              </button>

              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Visit Portal
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`rounded-xl p-3 ${colorClasses[stat.color]}`}
                  >
                    <Icon size={22} />
                  </div>
                  {stat.label === "School Status" && (
                    <span className="text-xs text-slate-400">
                      Current
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {stat.detail}
                </p>
              </div>
            );
          })}
        </section>

        {/* Tabs */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-4 sm:px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6">
            {activeTab === "overview" && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      School Management
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Manage the people, classes and academic activities
                      belonging to this school.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {managementLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="group flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
                        >
                          <div
                            className={`rounded-xl p-3 ${colorClasses[item.color]}`}
                          >
                            <Icon size={21} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-800 group-hover:text-blue-700">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight
                            size={17}
                            className="mt-1 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-900">
                      School Information
                    </h3>

                    <div className="mt-4 space-y-4">
                      <div className="flex gap-3">
                        <UserRound
                          size={17}
                          className="mt-0.5 text-slate-400"
                        />
                        <div>
                          <p className="text-xs text-slate-400">
                            Principal / Administrator
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {school.principal}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Mail
                          size={17}
                          className="mt-0.5 text-slate-400"
                        />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">
                            Email Address
                          </p>
                          <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                            {school.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone
                          size={17}
                          className="mt-0.5 text-slate-400"
                        />
                        <div>
                          <p className="text-xs text-slate-400">
                            Phone Number
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {school.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <MapPin
                          size={17}
                          className="mt-0.5 text-slate-400"
                        />
                        <div>
                          <p className="text-xs text-slate-400">
                            Address
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {school.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-900">
                      Subscription
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">
                          Current Plan
                        </p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {school.subscription}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {school.subscriptionStatus}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      Subscription dates and billing details will be
                      connected to the backend.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <EmptyManagementTab
                icon={GraduationCap}
                title="Student Management"
                description="View registered students, add new students, assign admission numbers and manage student accounts."
                buttonLabel="Open Student Management"
                href={`/admin/schools/${school.id}/students`}
              />
            )}

            {activeTab === "teachers" && (
              <EmptyManagementTab
                icon={Users}
                title="Teacher Management"
                description="View teachers, add teaching staff, assign subjects and manage teacher accounts."
                buttonLabel="Open Teacher Management"
                href={`/admin/schools/${school.id}/teachers`}
              />
            )}

            {activeTab === "classes" && (
              <EmptyManagementTab
                icon={BookOpen}
                title="Classes & Arms"
                description="Create classes, organise arms, assign class teachers and manage student placements."
                buttonLabel="Open Classes & Arms"
                href={`/admin/schools/${school.id}/classes`}
              />
            )}
          </div>
        </section>

        {/* Footer note */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <Clock size={15} />
          <span>
            Preview mode: school information and statistics currently use
            sample data. Live records will be loaded when the backend APIs
            are connected.
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyManagementTab({
  icon: Icon,
  title,
  description,
  buttonLabel,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center py-8 text-center">
      <div className="rounded-2xl bg-blue-50 p-5 text-blue-600">
        <Icon size={35} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {buttonLabel}
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}

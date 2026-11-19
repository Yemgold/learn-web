




"use client";

import Image from "next/image";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import StatusBadge from "@/components/schools/shared/StatusBadge";

export type SchoolAccessMode = "STUDENT_PIN" | "SCHOOL_SUBSCRIPTION";

export interface SchoolProfile {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  logoUrl?: string | null;
  website?: string;
  description?: string;
  registrationNumber?: string;
  establishedYear?: number | string;
  ownerName?: string;
  accessMode?: SchoolAccessMode | string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SchoolProfileCardProps {
  school: SchoolProfile;
  onEdit?: () => void;
  isLoading?: boolean;
  showEditButton?: boolean;
  showRegistrationDetails?: boolean;
  className?: string;
  variant?: "default" | "compact";
}

function formatDate(value?: string) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAccessMode(mode?: string) {
  if (mode === "STUDENT_PIN") return "Student PIN";
  if (mode === "SCHOOL_SUBSCRIPTION") return "School subscription";

  return mode
    ? mode.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    : "Not configured";
}

function getWebsiteUrl(website: string) {
  if (/^https?:\/\//i.test(website)) return website;
  return `https://${website}`;
}

function InfoItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value?: string;
  href?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-words text-sm font-medium text-blue-600 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function SchoolProfileSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 rounded-xl bg-slate-200" />

        <div className="flex-1 space-y-3">
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
          <div className="h-6 w-24 rounded-full bg-slate-100" />
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 rounded bg-slate-100" />
              <div className="h-4 w-36 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SchoolProfileCard({
  school,
  onEdit,
  isLoading = false,
  showEditButton = true,
  showRegistrationDetails = true,
  className = "",
  variant = "default",
}: SchoolProfileCardProps) {
  if (isLoading) return <SchoolProfileSkeleton />;

  const isCompact = variant === "compact";

  const fullAddress = [
    school.address,
    school.city,
    school.state,
    school.country,
  ]
    .filter(Boolean)
    .join(", ");

  const websiteUrl = school.website
    ? getWebsiteUrl(school.website)
    : undefined;

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {/* School identity */}
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {school.logoUrl ? (
              <Image
                src={school.logoUrl}
                alt={`${school.name} logo`}
                width={80}
                height={80}
                unoptimized
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 size={34} className="text-slate-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="break-words text-lg font-bold text-slate-900 sm:text-xl">
              {school.name}
            </h2>

            {school.registrationNumber && (
              <p className="mt-1 text-xs text-slate-500">
                Registration No: {school.registrationNumber}
              </p>
            )}

            {school.description && !isCompact && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {school.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {school.status && (
                <StatusBadge status={school.status} showIcon />
              )}

              {school.accessMode && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  <ShieldCheck size={13} />
                  {formatAccessMode(school.accessMode)}
                </span>
              )}
            </div>
          </div>
        </div>

        {showEditButton && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit3 size={16} />
            Edit profile
          </button>
        )}
      </div>

      <div className="border-t border-slate-100" />

      {/* Contact information */}
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Building2 size={17} className="text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            School information
          </h3>
        </div>

        <div
          className={`grid gap-5 ${
            isCompact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          <InfoItem icon={Mail} label="Email address" value={school.email} />

          <InfoItem icon={Phone} label="Phone number" value={school.phone} />

          <InfoItem
            icon={MapPin}
            label="School address"
            value={fullAddress}
          />

          <InfoItem
            icon={Globe}
            label="Website"
            value={school.website}
            href={websiteUrl}
          />

          <InfoItem
            icon={UserRound}
            label="School owner"
            value={school.ownerName}
          />

          {school.establishedYear && (
            <InfoItem
              icon={CalendarDays}
              label="Established"
              value={String(school.establishedYear)}
            />
          )}
        </div>

        {/* Registration details */}
        {showRegistrationDetails && (
          <>
            <div className="my-6 border-t border-slate-100" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Date registered
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(school.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Last updated
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(school.updatedAt)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

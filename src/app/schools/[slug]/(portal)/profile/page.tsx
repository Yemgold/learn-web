




"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  CalendarDays,
  ShieldCheck,
  Pencil,
  RefreshCw,
  Save,
  X,
  School,
  Hash,
  FileText,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Input from "@/components/schools/ui/Input";
import Card, {
  CardHeader,
  CardContent,
} from "@/components/schools/ui/Card";
import StatusBadge from "@/components/schools/shared/StatusBadge";
import LoadingState from "@/components/schools/shared/LoadingState";

import {
  getSchoolProfile,
  updateSchoolProfile,
} from "@/lib/schools/portal/services/profile.service";

import type {
  SchoolProfile,
  UpdateSchoolProfilePayload,
} from "@/lib/schools/portal/services/profile.service";

export default function SchoolProfilePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<UpdateSchoolProfilePayload>({
    schoolName: "",
    schoolEmail: "",
    schoolPhone: "",
    state: "",
    town: "",
    address: "",
    website: "",
    description: "",
  });

  const fetchProfile = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError("");

      const response = await getSchoolProfile(slug);

      setProfile(response);

      setForm({
        schoolName: response.schoolName ?? "",
        schoolEmail: response.schoolEmail ?? "",
        schoolPhone: response.schoolPhone ?? "",
        state: response.state ?? "",
        town: response.town ?? "",
        address: response.address ?? "",
        website: response.website ?? "",
        description: response.description ?? "",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load school profile.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleChange = (
    field: keyof UpdateSchoolProfilePayload,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!slug) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateSchoolProfile(slug, form);

      setProfile(response);
      setEditing(false);
      setSuccess("School profile updated successfully.");

      setForm({
        schoolName: response.schoolName ?? "",
        schoolEmail: response.schoolEmail ?? "",
        schoolPhone: response.schoolPhone ?? "",
        state: response.state ?? "",
        town: response.town ?? "",
        address: response.address ?? "",
        website: response.website ?? "",
        description: response.description ?? "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update school profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;

    setForm({
      schoolName: profile.schoolName ?? "",
      schoolEmail: profile.schoolEmail ?? "",
      schoolPhone: profile.schoolPhone ?? "",
      state: profile.state ?? "",
      town: profile.town ?? "",
      address: profile.address ?? "",
      website: profile.website ?? "",
      description: profile.description ?? "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState message="Loading school profile..." />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="space-y-4 p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>

        <Button
          onClick={() => void fetchProfile()}
          leftIcon={<RefreshCw size={16} />}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent>
            <div className="py-10 text-center">
              <Building2
                size={40}
                className="mx-auto mb-3 text-gray-400"
              />
              <h2 className="text-lg font-semibold text-gray-900">
                School profile not found
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                We could not find the requested school profile.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building2 size={16} />
            School Management
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            School Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your school's information.
          </p>
        </div>

        {!editing ? (
          <Button
            onClick={() => {
              setEditing(true);
              setError("");
              setSuccess("");
            }}
            leftIcon={<Pencil size={16} />}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              leftIcon={<X size={16} />}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              isLoading={saving}
              loadingText="Saving..."
              leftIcon={<Save size={16} />}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Profile hero */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-blue-700">
              {profile.logo ? (
                <img
                  src={profile.logo}
                  alt={`${profile.schoolName} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <School size={36} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {profile.schoolName}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {profile.subDomain}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={profile.isActive ? "ACTIVE" : "INACTIVE"}
                />

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {profile.accessMode === "STUDENT_PIN"
                    ? "Student PIN Access"
                    : "School Subscription"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School information */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-semibold text-gray-900">
              General Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Basic information about your institution.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {editing ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="School Name"
                value={form.schoolName ?? ""}
                onChange={(value) =>
                  handleChange("schoolName", value)
                }
                placeholder="Enter school name"
              />

              <Input
  label="School Email"
  type="email"
  value={form.schoolEmail ?? ""}
  onChange={(value) =>
    handleChange("schoolEmail", value)
  }
  placeholder="Enter school email"
/>

              <Input
                label="School Phone"
                value={form.schoolPhone ?? ""}
                onChange={(value) =>
                  handleChange("schoolPhone", value)
                }
                placeholder="Enter school phone"
              />

              <Input
                label="Website"
                value={form.website ?? ""}
                onChange={(value) =>
                  handleChange("website", value)
                }
                placeholder="https://example.com"
              />

              <Input
                label="State"
                value={form.state ?? ""}
                onChange={(value) =>
                  handleChange("state", value)
                }
                placeholder="Enter state"
              />

              <Input
                label="Town / City"
                value={form.town ?? ""}
                onChange={(value) =>
                  handleChange("town", value)
                }
                placeholder="Enter town or city"
              />

              <div className="md:col-span-2">
                <Input
                  label="School Address"
                  value={form.address ?? ""}
                  onChange={(value) =>
                    handleChange("address", value)
                  }
                  placeholder="Enter full school address"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  School Description
                </label>

                <textarea
                  value={form.description ?? ""}
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.currentTarget.value
                    )
                  }
                  rows={4}
                  placeholder="Tell us about your school..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ProfileItem
                icon={<Building2 size={18} />}
                label="School Name"
                value={profile.schoolName}
              />

              <ProfileItem
                icon={<Mail size={18} />}
                label="School Email"
                value={profile.schoolEmail}
              />

              <ProfileItem
                icon={<Phone size={18} />}
                label="Phone Number"
                value={profile.schoolPhone}
              />

              <ProfileItem
                icon={<Globe size={18} />}
                label="Website"
                value={profile.website}
              />

              <ProfileItem
                icon={<MapPin size={18} />}
                label="State"
                value={profile.state}
              />

              <ProfileItem
                icon={<MapPin size={18} />}
                label="Town / City"
                value={profile.town}
              />

              <ProfileItem
                icon={<MapPin size={18} />}
                label="Address"
                value={profile.address}
                fullWidth
              />

              <ProfileItem
                icon={<FileText size={18} />}
                label="Description"
                value={profile.description}
                fullWidth
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* School settings */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-semibold text-gray-900">
              School Account Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Account identifiers and access configuration.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProfileItem
              icon={<Hash size={18} />}
              label="School Subdomain"
              value={profile.subDomain}
            />

            <ProfileItem
              icon={<ShieldCheck size={18} />}
              label="Access Mode"
              value={
                profile.accessMode === "STUDENT_PIN"
                  ? "Student PIN"
                  : "School Subscription"
              }
            />

            <ProfileItem
              icon={<CalendarDays size={18} />}
              label="Date Created"
              value={
                profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : undefined
              }
            />

            <ProfileItem
              icon={<ShieldCheck size={18} />}
              label="Account Status"
              value={profile.isActive ? "Active" : "Inactive"}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => void fetchProfile()}
          leftIcon={<RefreshCw size={16} />}
        >
          Refresh Profile
        </Button>
      </div>
    </div>
  );
}

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  fullWidth?: boolean;
}

function ProfileItem({
  icon,
  label,
  value,
  fullWidth = false,
}: ProfileItemProps) {
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-gray-100 p-2 text-gray-600">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-medium text-gray-900">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}





"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  User,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import axios from "axios";

import { axiosInstance as api } from "@/lib/api/axios";
import { getCurrentUser, type LoginUser } from "@/lib/api/auth";

interface EditableProfile extends LoginUser {
  phone?: string;
  address?: string;
  residentialAddress?: string;
  state?: string;
  school?: string;
  class?: string;
  grade?: string;
  examYear?: string | number;
  jambExamYear?: string | number;
  preferredCourse?: string;
  subjects?: string[];
  jambSubjects?: string[];
}

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  school: string;
  state: string;
  examYear: string;
  preferredCourse: string;
  subjects: string[];
}

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi",
  "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara",
];

const DEFAULT_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Biology",
  "Chemistry",
];

const EMPTY_FORM: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  school: "",
  state: "",
  examYear: "",
  preferredCourse: "",
  subjects: [...DEFAULT_SUBJECTS],
};

function toText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function toSubjects(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_SUBJECTS];

  const subjects = value.filter(
    (item): item is string =>
      typeof item === "string",
  );

  return subjects.length
    ? subjects.slice(0, 4)
    : [...DEFAULT_SUBJECTS];
}

function mapUserToForm(user: EditableProfile): ProfileForm {
  return {
    firstName: toText(user.firstName),
    lastName: toText(user.lastName),
    email: toText(user.email),
    phone: toText(user.phoneNumber || user.phone),
    address: toText(
      user.residentialAddress || user.address,
    ),
    school: toText(user.school),
    state: toText(user.state),
    examYear: toText(
      user.jambExamYear || user.examYear,
    ),
    preferredCourse: toText(user.preferredCourse),
    subjects: toSubjects(
      user.jambSubjects || user.subjects,
    ),
  };
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

export default function EditProfilePage() {
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const response = await getCurrentUser();

        if (!active) return;

        if (!response?.success || !response.data) {
          throw new Error(
            response?.message || "Could not load your profile.",
          );
        }

        setForm(
          mapUserToForm(
            response.data as EditableProfile,
          ),
        );
      } catch (err: unknown) {
        if (!active) return;

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError(
              "Your session may have expired. Please sign in again.",
            );
          } else {
            setError(
              "Unable to load your profile. Please try again.",
            );
          }
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your profile.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  function updateField<K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  function updateSubject(index: number, value: string) {
    setForm((current) => {
      const subjects = [...current.subjects];
      subjects[index] = value;

      return {
        ...current,
        subjects,
      };
    });

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email address is required.");
      return;
    }

    const normalizedSubjects = form.subjects
      .map((subject) => subject.trim())
      .filter(Boolean);

    setSaving(true);

    try {
      /*
       * Assumed endpoint and payload.
       * Confirm these with your backend API before using in production.
       *
       * Remove fields the backend does not support.
       */
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phone.trim(),
        address: form.address.trim(),
        school: form.school.trim(),
        state: form.state,
        jambExamYear: form.examYear
          ? Number(form.examYear)
          : undefined,
        preferredCourse: form.preferredCourse.trim(),
        jambSubjects: normalizedSubjects,
      };

      const response = await api.patch(
        "/users/me",
        payload,
      );

      if (
        response.data &&
        typeof response.data === "object" &&
        "success" in response.data &&
        response.data.success === false
      ) {
        throw new Error(
          "The server did not save your profile changes.",
        );
      }

      /*
       * Re-fetch the profile so the form reflects the
       * authoritative values returned by the backend.
       */
      const updatedResponse = await getCurrentUser();

      if (updatedResponse?.success && updatedResponse.data) {
        setForm(
          mapUserToForm(
            updatedResponse.data as EditableProfile,
          ),
        );
      }

      setSuccess("Your profile has been updated successfully.");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) {
          setError(
            "Your session has expired. Please sign in again.",
          );
        } else if (status === 404 || status === 405) {
          setError(
            "The profile update endpoint is unavailable. Confirm the correct update route with your backend.",
          );
        } else if (status === 400 || status === 422) {
          const responseData = err.response?.data as
            | { message?: string }
            | undefined;

          setError(
            responseData?.message ||
              "Some profile fields were rejected. Check your entries.",
          );
        } else {
          const responseData = err.response?.data as
            | { message?: string }
            | undefined;

          setError(
            responseData?.message ||
              "Unable to save your changes. Please try again.",
          );
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to save your changes.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Edit Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Update your personal information, school details
            and JAMB preferences.
          </p>
        </div>

        {loading ? (
          <section className="flex items-center gap-3 rounded-2xl border bg-white p-8 shadow-sm">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <div>
              <p className="font-semibold text-slate-900">
                Loading your profile
              </p>
              <p className="text-sm text-slate-500">
                Retrieving your account information...
              </p>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            {/* Personal Information */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Personal Information
                  </h2>
                  <p className="text-sm text-slate-500">
                    Your basic account details
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <InputField
                  label="First Name"
                  value={form.firstName}
                  onChange={(value) =>
                    updateField("firstName", value)
                  }
                  required
                />

                <InputField
                  label="Last Name"
                  value={form.lastName}
                  onChange={(value) =>
                    updateField("lastName", value)
                  }
                  required
                />

                <InputField
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                  required
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                  placeholder="+234..."
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Residential Address
                  </label>

                  <textarea
                    rows={4}
                    value={form.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    placeholder="Enter your residential address"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            {/* Academic Information */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Academic Information
                  </h2>
                  <p className="text-sm text-slate-500">
                    Your school and examination preferences
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <InputField
                  label="School"
                  value={form.school}
                  onChange={(value) =>
                    updateField("school", value)
                  }
                  placeholder="Enter your school name"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    State
                  </label>

                  <select
                    value={form.state}
                    onChange={(event) =>
                      updateField("state", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select state</option>

                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    JAMB Exam Year
                  </label>

                  <select
                    value={form.examYear}
                    onChange={(event) =>
                      updateField("examYear", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select exam year</option>

                    {[2027, 2028, 2029, 2030].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Preferred Course"
                  value={form.preferredCourse}
                  onChange={(value) =>
                    updateField("preferredCourse", value)
                  }
                  placeholder="e.g. Medicine and Surgery"
                />
              </div>
            </section>

            {/* JAMB Subjects */}
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    JAMB Subjects
                  </h2>
                  <p className="text-sm text-slate-500">
                    English Language is compulsory for JAMB.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {form.subjects.map((subject, index) => (
                  <InputField
                    key={index}
                    label={`Subject ${index + 1}`}
                    value={subject}
                    onChange={(value) =>
                      updateSubject(index, value)
                    }
                    required={index === 0}
                  />
                ))}
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? "Saving..." : "Save Changes"}
              </button>

              <Link
                href="/student/profile"
                className="rounded-xl border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

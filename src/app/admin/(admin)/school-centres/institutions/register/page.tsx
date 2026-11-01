



"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  School,
  User,
  X,
} from "lucide-react";

type InstitutionFormData = {
  name: string;
  type: "School" | "Study Centre";
  email: string;
  phone: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  state: string;
  city: string;
  address: string;
  description: string;
};

type SavedInstitution = InstitutionFormData & {
  id: string;
  status: "Pending";
  students: number;
  createdAt: string;
};

const STORAGE_KEY = "learnyfi-school-centres-institutions";

const initialForm: InstitutionFormData = {
  name: "",
  type: "School",
  email: "",
  phone: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  state: "",
  city: "",
  address: "",
  description: "",
};

const nigerianStates = [
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

export default function RegisterInstitutionPage() {
  const router = useRouter();

  const [form, setForm] = useState<InstitutionFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof InstitutionFormData>(
    field: K,
    value: InstitutionFormData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!form.name.trim()) return "Please enter the institution name.";
    if (!form.email.trim()) return "Please enter the institution email.";
    if (!form.phone.trim()) return "Please enter the institution phone number.";
    if (!form.contactPerson.trim()) return "Please enter the contact person's name.";
    if (!form.state) return "Please select the institution's state.";
    if (!form.city.trim()) return "Please enter the institution's city.";
    if (!form.address.trim()) return "Please enter the institution's address.";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      return "Please enter a valid institution email address.";
    }

    if (
      form.contactEmail.trim() &&
      !emailPattern.test(form.contactEmail.trim())
    ) {
      return "Please enter a valid contact person's email address.";
    }

    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const existingData = localStorage.getItem(STORAGE_KEY);

      let existingInstitutions: SavedInstitution[] = [];

      if (existingData) {
        const parsed: unknown = JSON.parse(existingData);

        if (!Array.isArray(parsed)) {
          throw new Error("Stored institution data is invalid.");
        }

        existingInstitutions = parsed as SavedInstitution[];
      }

      const duplicate = existingInstitutions.some(
        (institution) =>
          institution.email.toLowerCase() === form.email.trim().toLowerCase(),
      );

      if (duplicate) {
        setError(
          "An institution with this email address has already been registered on this browser.",
        );
        return;
      }

      const newInstitution: SavedInstitution = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        contactPerson: form.contactPerson.trim(),
        contactEmail: form.contactEmail.trim().toLowerCase(),
        contactPhone: form.contactPhone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        description: form.description.trim(),
        id: crypto.randomUUID(),
        status: "Pending",
        students: 0,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newInstitution, ...existingInstitutions]),
      );

      setSuccess(true);
      setForm(initialForm);
    } catch (submissionError) {
      console.error("Institution registration failed:", submissionError);
      setError(
        "Unable to save the institution. Please check your browser storage and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link
            href="/admin/school-centres"
            className="transition hover:text-white"
          >
            School & Study Centres
          </Link>
          <span>/</span>
          <Link
            href="/admin/school-centres/institutions"
            className="transition hover:text-white"
          >
            Institutions
          </Link>
          <span>/</span>
          <span className="text-slate-200">Register</span>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-400">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">
                Institution registration
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Register an Institution
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Add a school or study centre to your institution management
              system.
            </p>
          </div>

          <Link
            href="/admin/school-centres/institutions"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to institutions
          </Link>
        </div>

        {/* Success message */}
        {success && (
          <div className="flex flex-col gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />

              <div>
                <h3 className="font-semibold text-emerald-300">
                  Institution registered successfully
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  The institution has been saved locally with Pending status.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/admin/school-centres/institutions")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              View institutions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Institution information */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-3 border-b border-slate-800 p-5 sm:p-6">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <School className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Institution Information</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Basic information about the school or study centre.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Institution Name <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Bright Future International School"
                  className="form-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Institution Type <span className="text-red-400">*</span>
                </label>

                <div className="relative">
                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateField(
                        "type",
                        event.target.value as InstitutionFormData["type"],
                      )
                    }
                    className="form-input appearance-none pr-10"
                  >
                    <option value="School">School</option>
                    <option value="Study Centre">Study Centre</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Institution Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="school@example.com"
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Institution Phone Number{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="e.g. 08012345678"
                    className="form-input pl-10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Contact person */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-3 border-b border-slate-800 p-5 sm:p-6">
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Primary Contact Person</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Details of the person responsible for the institution.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Contact Person&apos;s Full Name{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  value={form.contactPerson}
                  onChange={(event) =>
                    updateField("contactPerson", event.target.value)
                  }
                  placeholder="e.g. John Doe"
                  className="form-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(event) =>
                    updateField("contactEmail", event.target.value)
                  }
                  placeholder="contact@example.com"
                  className="form-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(event) =>
                    updateField("contactPhone", event.target.value)
                  }
                  placeholder="e.g. 08012345678"
                  className="form-input"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-3 border-b border-slate-800 p-5 sm:p-6">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Institution Location</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Where the school or study centre is located.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  State <span className="text-red-400">*</span>
                </label>

                <div className="relative">
                  <select
                    required
                    value={form.state}
                    onChange={(event) =>
                      updateField("state", event.target.value)
                    }
                    className="form-input appearance-none pr-10"
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  City / Town <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  value={form.city}
                  onChange={(event) =>
                    updateField("city", event.target.value)
                  }
                  placeholder="e.g. Ikeja"
                  className="form-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Street Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  placeholder="Enter the complete institution address..."
                  className="form-input min-h-24 resize-y py-3"
                />
              </div>
            </div>
          </section>

          {/* Additional information */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-3 border-b border-slate-800 p-5 sm:p-6">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Additional Information</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Optional information about the institution.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                rows={4}
                maxLength={1000}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Briefly describe the institution, its programmes or the students it serves..."
                className="form-input min-h-28 resize-y py-3"
              />

              <p className="mt-2 text-right text-xs text-slate-500">
                {form.description.length}/1000 characters
              </p>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <p className="text-sm leading-6 text-red-300">{error}</p>
            </div>
          )}

          {/* Submission */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/school-centres/institutions"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4" />
                  Register Institution
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs leading-5 text-slate-500">
          New institutions are assigned Pending status in this prototype.
          Approval and account activation will be implemented when the
          backend is connected.
        </p>
      </div>

      <style jsx global>{`
        .form-input {
          display: block;
          width: 100%;
          min-height: 44px;
          border: 1px solid rgb(51 65 85);
          border-radius: 0.75rem;
          background: rgb(2 6 23);
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 150ms ease;
        }

        .form-input::placeholder {
          color: rgb(100 116 139);
        }

        .form-input:focus {
          border-color: rgb(59 130 246);
        }

        .form-input option {
          background: rgb(15 23 42);
          color: white;
        }
      `}</style>
    </div>
  );
}

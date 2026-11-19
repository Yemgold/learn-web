






"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe,
  GraduationCap,
  Info,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  AlertCircle,
  LockKeyhole,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Input from "@/components/schools/ui/Input";
import Select from "@/components/schools/ui/Select";
import Card from "@/components/schools/ui/Card";

import { createSchool } from "@/lib/schools/management/services/school.service";

type SchoolAccessMode = "STUDENT_PIN" | "SCHOOL_SUBSCRIPTION";

interface CreateSchoolPayload {
  schoolName: string;
  subDomain: string;
  schoolEmail: string;
  schoolPhone: string;
  state: string;
  town: string;
  address: string;
  accessMode: SchoolAccessMode;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPhoneNumber: string;
  ownerTemporaryPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialValues: CreateSchoolPayload = {
  schoolName: "",
  subDomain: "",
  schoolEmail: "",
  schoolPhone: "",
  state: "",
  town: "",
  address: "",
  accessMode: "STUDENT_PIN",
  ownerFirstName: "",
  ownerLastName: "",
  ownerEmail: "",
  ownerPhoneNumber: "",
  ownerTemporaryPassword: "",
};

const accessModeOptions = [
  {
    label: "Student PIN",
    value: "STUDENT_PIN",
    description: "Students gain access using generated PINs.",
  },
  {
    label: "School Subscription",
    value: "SCHOOL_SUBSCRIPTION",
    description:
      "Students access examinations through the school's subscription.",
  },
];

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
].map((state) => ({
  label: state,
  value: state,
}));

function validateForm(values: CreateSchoolPayload): FormErrors {
  const errors: FormErrors = {};

  if (!values.schoolName.trim()) {
    errors.schoolName = "School name is required.";
  }

  if (!values.subDomain.trim()) {
    errors.subDomain = "School subdomain is required.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.subDomain)) {
    errors.subDomain =
      "Use lowercase letters, numbers and hyphens only.";
  }

  if (!values.schoolEmail.trim()) {
    errors.schoolEmail = "School email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.schoolEmail)) {
    errors.schoolEmail = "Enter a valid email address.";
  }

  if (!values.schoolPhone.trim()) {
    errors.schoolPhone = "School phone number is required.";
  }

  if (!values.state) {
    errors.state = "Please select a state.";
  }

  if (!values.town.trim()) {
    errors.town = "Town or city is required.";
  }

  if (!values.address.trim()) {
    errors.address = "School address is required.";
  }

  if (!values.ownerFirstName.trim()) {
    errors.ownerFirstName = "Owner's first name is required.";
  }

  if (!values.ownerLastName.trim()) {
    errors.ownerLastName = "Owner's last name is required.";
  }

  if (!values.ownerEmail.trim()) {
    errors.ownerEmail = "Owner's email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.ownerEmail)) {
    errors.ownerEmail = "Enter a valid owner email address.";
  }

  if (!values.ownerPhoneNumber.trim()) {
    errors.ownerPhoneNumber = "Owner's phone number is required.";
  }

  if (!values.ownerTemporaryPassword) {
    errors.ownerTemporaryPassword =
      "Temporary password is required.";
  } else if (values.ownerTemporaryPassword.length < 8) {
    errors.ownerTemporaryPassword =
      "Password must contain at least 8 characters.";
  }

  return errors;
}

export default function CreateSchoolPage() {
  const router = useRouter();

  const [values, setValues] =
    useState<CreateSchoolPayload>(initialValues);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = <K extends keyof CreateSchoolPayload>(
    field: K,
    value: CreateSchoolPayload[K]
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setSubmitError("");
  };

  const handleSubdomainChange = (value: string) => {
    const normalized = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    updateField("subDomain", normalized);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(values);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitError("Please correct the highlighted fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload: CreateSchoolPayload = {
        schoolName: values.schoolName.trim(),
        subDomain: values.subDomain.trim(),
        schoolEmail: values.schoolEmail.trim().toLowerCase(),
        schoolPhone: values.schoolPhone.trim(),
        state: values.state,
        town: values.town.trim(),
        address: values.address.trim(),
        accessMode: values.accessMode,
        ownerFirstName: values.ownerFirstName.trim(),
        ownerLastName: values.ownerLastName.trim(),
        ownerEmail: values.ownerEmail.trim().toLowerCase(),
        ownerPhoneNumber: values.ownerPhoneNumber.trim(),
        ownerTemporaryPassword: values.ownerTemporaryPassword,
      };

      const response = await createSchool(payload);

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to create school."
        );
      }

      setShowSuccess(true);

      setTimeout(() => {
        router.push("/admin/schools");
        router.refresh();
      }, 1200);
    } catch (error: unknown) {
      const responseData =
        error &&
        typeof error === "object" &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                    error?: string;
                  };
                };
              }
            ).response?.data
          : undefined;

      const message =
        responseData?.message ||
        responseData?.error ||
        (error instanceof Error
          ? error.message
          : "Unable to create school. Please try again.");

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      {/* Breadcrumb and page heading */}
      <div>
        <Link
          href="/admin/schools"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Schools
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Create New School
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Register a school and create its owner account on Learnyfi.
            </p>
          </div>
        </div>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 size={21} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              School created successfully!
            </p>
            <p className="mt-1 text-sm">
              Redirecting to the school management page...
            </p>
          </div>
        </div>
      )}

      {/* Submission error */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School information */}
        <Card padding="lg">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <GraduationCap size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                School Information
              </h2>
              <p className="text-sm text-gray-500">
                Enter the school's official registration details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="School Name"
                placeholder="e.g. Christs' School Ado-Ekiti"
                value={values.schoolName}
                onChange={(value) => updateField("schoolName", value)}
                error={errors.schoolName}
                leftIcon={<GraduationCap size={17} />}
                required
                fullWidth
              />
            </div>

            <div>
              <Input
                label="School Email"
                type="email"
                placeholder="school@example.com"
                value={values.schoolEmail}
                onChange={(value) => updateField("schoolEmail", value)}
                error={errors.schoolEmail}
                leftIcon={<Mail size={17} />}
                required
                fullWidth
              />
            </div>

            <div>
              <Input
                label="School Phone Number"
                type="tel"
                placeholder="09000000000"
                value={values.schoolPhone}
                onChange={(value) => updateField("schoolPhone", value)}
                error={errors.schoolPhone}
                leftIcon={<Phone size={17} />}
                required
                fullWidth
              />
            </div>

            {/* Subdomain */}
            <div className="md:col-span-2">
              <label
                htmlFor="school-subdomain"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                School Subdomain <span className="text-red-500">*</span>
              </label>

              <div className="flex overflow-hidden rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <div className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                  <Globe size={16} />
                </div>

                <input
                  id="school-subdomain"
                  value={values.subDomain}
                  onChange={(event) =>
                    handleSubdomainChange(event.currentTarget.value)
                  }
                  placeholder="school-name"
                  className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
                  required
                />

                <div className="flex items-center whitespace-nowrap bg-gray-50 px-3 text-xs text-gray-500 sm:text-sm">
                  .learnyfi.com.ng
                </div>
              </div>

              {errors.subDomain ? (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.subDomain}
                </p>
              ) : (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                  <Info size={13} />
                  This will be the school's unique portal address.
                </p>
              )}

              {values.subDomain && (
                <div className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                  <span className="font-medium">School portal:</span>{" "}
                  {values.subDomain}.learnyfi.com.ng
                </div>
              )}
            </div>

            <div>
              <Select
                label="State"
                options={nigerianStates}
                value={values.state}
                onChange={(value) => updateField("state", value)}
                placeholder="Select state"
                error={errors.state}
                searchable
                fullWidth
              />
            </div>

            <div>
              <Input
                label="Town / City"
                placeholder="e.g. Ado-Ekiti"
                value={values.town}
                onChange={(value) => updateField("town", value)}
                error={errors.town}
                leftIcon={<MapPin size={17} />}
                required
                fullWidth
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="School Address"
                placeholder="Enter the school's full physical address"
                value={values.address}
                onChange={(value) => updateField("address", value)}
                error={errors.address}
                leftIcon={<MapPin size={17} />}
                required
                fullWidth
              />
            </div>
          </div>
        </Card>

        {/* School access configuration */}
        <Card padding="lg">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <KeyRound size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                School Access Configuration
              </h2>
              <p className="text-sm text-gray-500">
                Select how students will access examinations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {accessModeOptions.map((option) => {
              const selected = values.accessMode === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateField(
                      "accessMode",
                      option.value as SchoolAccessMode
                    )
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {option.label}
                    </span>

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {selected && <CheckCircle2 size={14} />}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>
              The selected access mode determines the school's student
              examination access method. You can only change it later
              through the appropriate school administration controls.
            </p>
          </div>
        </Card>

        {/* School owner information */}
        <Card padding="lg">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <UserRound size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                School Owner Information
              </h2>
              <p className="text-sm text-gray-500">
                Create the primary owner account for this school.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Owner First Name"
              placeholder="First name"
              value={values.ownerFirstName}
              onChange={(value) => updateField("ownerFirstName", value)}
              error={errors.ownerFirstName}
              leftIcon={<UserRound size={17} />}
              required
              fullWidth
            />

            <Input
              label="Owner Last Name"
              placeholder="Last name"
              value={values.ownerLastName}
              onChange={(value) => updateField("ownerLastName", value)}
              error={errors.ownerLastName}
              leftIcon={<UserRound size={17} />}
              required
              fullWidth
            />

            <Input
              label="Owner Email"
              type="email"
              placeholder="owner@example.com"
              value={values.ownerEmail}
              onChange={(value) => updateField("ownerEmail", value)}
              error={errors.ownerEmail}
              leftIcon={<Mail size={17} />}
              required
              fullWidth
            />

            <Input
              label="Owner Phone Number"
              type="tel"
              placeholder="09000000000"
              value={values.ownerPhoneNumber}
              onChange={(value) => updateField("ownerPhoneNumber", value)}
              error={errors.ownerPhoneNumber}
              leftIcon={<Phone size={17} />}
              required
              fullWidth
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Owner Temporary Password{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a temporary password"
                  value={values.ownerTemporaryPassword}
                  onChange={(value) =>
                    updateField("ownerTemporaryPassword", value)
                  }
                  error={errors.ownerTemporaryPassword}
                  leftIcon={<LockKeyhole size={17} />}
                  showPasswordToggle={false}
                  required
                  fullWidth
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Give this temporary password securely to the school
                owner. The backend should require a password change
                at first login if that feature is supported.
              </p>
            </div>
          </div>
        </Card>

        {/* Security information */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Account and security information
            </h3>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              The owner account will be created with the supplied
              information. Ensure the temporary password is strong
              and is communicated securely. The backend must hash
              and protect the password.
            </p>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/schools">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              fullWidth
            >
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting || showSuccess}
            isLoading={isSubmitting}
            loadingText="Creating school..."
            rightIcon={
              !isSubmitting ? <ArrowRight size={17} /> : undefined
            }
          >
            Create School
          </Button>
        </div>
      </form>
    </div>
  );
}

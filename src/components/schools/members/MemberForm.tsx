




"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Hash,
  Save,
  X,
  Loader2,
  UserPlus,
} from "lucide-react";

export type MemberRole = "ADMIN" | "TEACHER" | "STUDENT";

export type MemberStatus = "ACTIVE" | "INACTIVE";

export interface MemberFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: MemberRole;
  admissionNumber?: string;
  staffId?: string;
  classId?: string;
  status?: MemberStatus;
}

export interface MemberFormOption {
  label: string;
  value: string;
}

interface MemberFormProps {
  mode?: "create" | "edit";
  initialValues?: Partial<MemberFormValues>;
  availableRoles?: MemberRole[];
  classes?: MemberFormOption[];

  isLoading?: boolean;
  showRoleSelection?: boolean;
  showStatus?: boolean;

  onSubmit: (values: MemberFormValues) => void | Promise<void>;
  onCancel?: () => void;

  submitLabel?: string;
  cancelLabel?: string;
  title?: string;
  description?: string;

  className?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  admissionNumber?: string;
  staffId?: string;
  classId?: string;
}

const DEFAULT_ROLES: MemberRole[] = ["ADMIN", "TEACHER", "STUDENT"];

const ROLE_CONFIG: Record<
  MemberRole,
  {
    label: string;
    description: string;
    icon: typeof User;
  }
> = {
  ADMIN: {
    label: "Administrator",
    description: "Manage school operations and members.",
    icon: ShieldCheck,
  },
  TEACHER: {
    label: "Teacher",
    description: "Manage assigned classes and assessments.",
    icon: BookOpen,
  },
  STUDENT: {
    label: "Student",
    description: "Access classes, subjects and assessments.",
    icon: GraduationCap,
  },
};

const inputClassName =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60";

const labelClassName =
  "mb-1.5 block text-sm font-medium text-gray-700";

export default function MemberForm({
  mode = "create",
  initialValues,
  availableRoles = DEFAULT_ROLES,
  classes = [],
  isLoading = false,
  showRoleSelection = true,
  showStatus,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = "Cancel",
  title,
  description,
  className = "",
}: MemberFormProps) {
  const defaultRole = availableRoles[0] ?? "STUDENT";

  const [values, setValues] = useState<MemberFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: defaultRole,
    admissionNumber: "",
    staffId: "",
    classId: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setValues({
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
      role: initialValues?.role ?? defaultRole,
      admissionNumber: initialValues?.admissionNumber ?? "",
      staffId: initialValues?.staffId ?? "",
      classId: initialValues?.classId ?? "",
      status: initialValues?.status ?? "ACTIVE",
    });
  }, [initialValues, defaultRole]);

  const isStudent = values.role === "STUDENT";
  const isTeacher = values.role === "TEACHER";

  const updateField = <K extends keyof MemberFormValues>(
    field: K,
    value: MemberFormValues[K]
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setSubmitError("");
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!values.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!values.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    if (!availableRoles.includes(values.role)) {
      nextErrors.role = "Select a valid member role.";
    }

    if (isStudent && !values.admissionNumber?.trim()) {
      nextErrors.admissionNumber = "Admission number is required.";
    }

    if (isStudent && !values.classId?.trim()) {
      nextErrors.classId = "Please select a class.";
    }

    if (isTeacher && !values.staffId?.trim()) {
      nextErrors.staffId = "Staff ID is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading || !validate()) return;

    setSubmitError("");

    try {
      const payload: MemberFormValues = {
        ...values,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        ...(isStudent
          ? {
              admissionNumber: values.admissionNumber?.trim(),
              classId: values.classId,
            }
          : {
              admissionNumber: undefined,
              classId: undefined,
            }),
        ...(isTeacher
          ? { staffId: values.staffId?.trim() }
          : { staffId: undefined }),
      };

      await onSubmit(payload);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const heading =
    title ??
    (mode === "create" ? "Add New Member" : "Edit Member");

  const subheading =
    description ??
    (mode === "create"
      ? "Enter the details of the member you want to add to your school."
      : "Update this member's information.");

  const buttonLabel =
    submitLabel ??
    (mode === "create" ? "Create Member" : "Save Changes");

  const showStatusField = showStatus ?? mode === "edit";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`w-full space-y-6 ${className}`}
    >
      {/* Form heading */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {mode === "create" ? (
            <UserPlus size={21} />
          ) : (
            <User size={21} />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {heading}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {subheading}
          </p>
        </div>
      </div>

      {/* Role selection */}
      {showRoleSelection && (
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Member Role
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Choose the role this member will have in the school.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {availableRoles.map((role) => {
              const config = ROLE_CONFIG[role];
              const Icon = config.icon;
              const selected = values.role === role;

              return (
                <button
                  key={role}
                  type="button"
                  disabled={isLoading}
                  onClick={() => updateField("role", role)}
                  className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                    selected
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      selected
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {config.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {config.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {errors.role && (
            <p className="text-xs text-red-600">{errors.role}</p>
          )}
        </section>
      )}

      {/* Personal information */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <User size={17} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Personal Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={values.firstName}
              onChange={(event) =>
                updateField("firstName", event.target.value)
              }
              placeholder="Enter first name"
              disabled={isLoading}
              className={`${inputClassName} ${
                errors.firstName ? "border-red-400" : ""
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={values.lastName}
              onChange={(event) =>
                updateField("lastName", event.target.value)
              }
              placeholder="Enter last name"
              disabled={isLoading}
              className={`${inputClassName} ${
                errors.lastName ? "border-red-400" : ""
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={values.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                placeholder="name@example.com"
                disabled={isLoading}
                className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60 ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className={labelClassName}>
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                value={values.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                placeholder="Enter phone number"
                disabled={isLoading}
                className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60 ${
                  errors.phone ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Student information */}
      {isStudent && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <GraduationCap size={17} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Student Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>
                Admission Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={values.admissionNumber ?? ""}
                  onChange={(event) =>
                    updateField("admissionNumber", event.target.value)
                  }
                  placeholder="e.g. SCH/2026/001"
                  disabled={isLoading}
                  className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60 ${
                    errors.admissionNumber
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.admissionNumber && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.admissionNumber}
                </p>
              )}
            </div>

            <div>
              <label className={labelClassName}>
                Assign Class <span className="text-red-500">*</span>
              </label>
              <select
                value={values.classId ?? ""}
                onChange={(event) =>
                  updateField("classId", event.target.value)
                }
                disabled={isLoading || classes.length === 0}
                className={`${inputClassName} ${
                  errors.classId ? "border-red-400" : ""
                }`}
              >
                <option value="">
                  {classes.length === 0
                    ? "No classes available"
                    : "Select a class"}
                </option>
                {classes.map((schoolClass) => (
                  <option
                    key={schoolClass.value}
                    value={schoolClass.value}
                  >
                    {schoolClass.label}
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.classId}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Teacher information */}
      {isTeacher && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <BookOpen size={17} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Teacher Information
            </h3>
          </div>

          <div>
            <label className={labelClassName}>
              Staff ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={values.staffId ?? ""}
                onChange={(event) =>
                  updateField("staffId", event.target.value)
                }
                placeholder="Enter teacher staff ID"
                disabled={isLoading}
                className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-60 ${
                  errors.staffId ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.staffId && (
              <p className="mt-1 text-xs text-red-600">
                {errors.staffId}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Account status */}
      {showStatusField && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShieldCheck size={17} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Account Status
            </h3>
          </div>

          <div>
            <label className={labelClassName}>Member Status</label>
            <select
              value={values.status ?? "ACTIVE"}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as MemberStatus
                )
              }
              disabled={isLoading}
              className={inputClassName}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </section>
      )}

      {/* Submission error */}
      {submitError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}

      {/* Form actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={16} />
            {cancelLabel}
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading || availableRoles.length === 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={17} />
              {buttonLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

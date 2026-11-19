




"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import Button from "@/components/schools/ui/Button";
import Input from "@/components/schools/ui/Input";
import Select from "@/components/schools/ui/Select";
import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import {
  getSchoolById,
  updateSchool,
  updateSchoolAccessMode,
  type School,
  type SchoolAccessMode,
  type UpdateSchoolPayload,
} from "@/lib/schools/management/services/school.service";

/* =========================================================
   TYPES
========================================================= */

interface SchoolFormData {
  schoolName: string;
  subDomain: string;
  schoolEmail: string;
  schoolPhone: string;
  state: string;
  town: string;
  address: string;
}

interface SchoolOwner {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
}

interface SchoolDetails extends School {
  owner?: SchoolOwner;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface SchoolDetailsData {
  school?: SchoolDetails;
  owner?: SchoolOwner;
}

type FormErrors = Partial<Record<keyof SchoolFormData, string>>;

/* =========================================================
   CONSTANTS
========================================================= */

const INITIAL_FORM: SchoolFormData = {
  schoolName: "",
  subDomain: "",
  schoolEmail: "",
  schoolPhone: "",
  state: "",
  town: "",
  address: "",
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
  "Federal Capital Territory",
];

const STATE_OPTIONS = NIGERIAN_STATES.map((state) => ({
  label: state,
  value: state,
}));

const ACCESS_MODE_OPTIONS = [
  {
    label: "Student PIN Access",
    value: "STUDENT_PIN",
    description: "Students use assigned access PINs.",
  },
  {
    label: "School Subscription",
    value: "SCHOOL_SUBSCRIPTION",
    description: "Access is managed through school subscription.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getSchoolFormData = (school: School): SchoolFormData => ({
  schoolName: school.schoolName || school.name || "",
  subDomain: school.subDomain || "",
  schoolEmail: school.schoolEmail || school.email || "",
  schoolPhone: school.schoolPhone || school.phone || "",
  state: school.state || "",
  town: school.town || "",
  address: school.address || "",
});

const normalizeSubDomain = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const validateForm = (form: SchoolFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!form.schoolName.trim()) {
    errors.schoolName = "School name is required.";
  }

  if (!form.subDomain.trim()) {
    errors.subDomain = "School subdomain is required.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.subDomain)) {
    errors.subDomain =
      "Use lowercase letters, numbers and single hyphens only.";
  }

  if (!form.schoolEmail.trim()) {
    errors.schoolEmail = "School email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.schoolEmail)) {
    errors.schoolEmail = "Enter a valid email address.";
  }

  if (!form.schoolPhone.trim()) {
    errors.schoolPhone = "School phone number is required.";
  }

  if (!form.state) {
    errors.state = "Please select a state.";
  }

  if (!form.town.trim()) {
    errors.town = "Town is required.";
  }

  if (!form.address.trim()) {
    errors.address = "School address is required.";
  }

  return errors;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

/* =========================================================
   PAGE
========================================================= */

export default function EditSchoolPage() {
  const params = useParams<{ schoolId: string }>();
  const router = useRouter();

  const schoolId = params.schoolId;

  const [form, setForm] = useState<SchoolFormData>(INITIAL_FORM);

  const [accessMode, setAccessMode] =
    useState<SchoolAccessMode>("STUDENT_PIN");

  const [originalAccessMode, setOriginalAccessMode] =
    useState<SchoolAccessMode>("STUDENT_PIN");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================================================
     FETCH SCHOOL
  ======================================================= */

  const fetchSchool = useCallback(async () => {
    if (!schoolId) {
      setError("School ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getSchoolById(schoolId);

      // Axios response body is inside response.data.
      const result = response.data as ApiResponse<
        SchoolDetails | SchoolDetailsData
      >;

      if (result?.success === false) {
        throw new Error(
          result.message || "Unable to load school information."
        );
      }

      const data = result?.data;

      if (!data) {
        throw new Error("School information was not found.");
      }

      let school: SchoolDetails;

      if ("school" in data && data.school) {
        school = {
          ...data.school,
          owner: data.owner || data.school.owner,
        };
      } else {
        school = data as SchoolDetails;
      }

      setForm(getSchoolFormData(school));

      const mode = school.accessMode;

      if (
        mode === "STUDENT_PIN" ||
        mode === "SCHOOL_SUBSCRIPTION"
      ) {
        setAccessMode(mode);
        setOriginalAccessMode(mode);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    void fetchSchool();
  }, [fetchSchool]);

  /* =======================================================
     FORM HANDLERS
  ======================================================= */

  const handleChange = (
    field: keyof SchoolFormData,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]:
        field === "subDomain"
          ? normalizeSubDomain(value)
          : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setError("");
    setSuccess("");
  };

  /* =======================================================
     SUBMIT FORM
  ======================================================= */

  const handleSubmit = async (
    event: Parameters<
      NonNullable<
        React.FormHTMLAttributes<HTMLFormElement>["onSubmit"]
      >
    >[0]
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationErrors = validateForm(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setError("Please correct the highlighted fields.");
      return;
    }

    if (!schoolId) {
      setError("School ID is missing.");
      return;
    }

    const payload: UpdateSchoolPayload = {
      schoolName: form.schoolName.trim(),
      subDomain: form.subDomain.trim(),
      schoolEmail: form.schoolEmail.trim().toLowerCase(),
      schoolPhone: form.schoolPhone.trim(),
      state: form.state,
      town: form.town.trim(),
      address: form.address.trim(),
    };

    try {
      setSaving(true);

      // 1. Update basic school information.
      const schoolResponse = await updateSchool(
        schoolId,
        payload
      );

      const schoolResult = schoolResponse.data as ApiResponse<School>;

      if (schoolResult?.success === false) {
        throw new Error(
          schoolResult.message || "Unable to update school information."
        );
      }

      // 2. Update access mode only when it has changed.
      if (accessMode !== originalAccessMode) {
        const accessResponse = await updateSchoolAccessMode(
          schoolId,
          { accessMode }
        );

        const accessResult = accessResponse.data as ApiResponse<School>;

        if (accessResult?.success === false) {
          throw new Error(
            accessResult.message ||
              "School information was updated, but access mode could not be changed."
          );
        }
      }

      setOriginalAccessMode(accessMode);
      setSuccess("School information updated successfully.");

      // 3. Return to school details.
      setTimeout(() => {
        router.push(`/admin/schools/${encodeURIComponent(schoolId)}`);
      }, 1000);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (error && !form.schoolName) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Unable to load school
          </h2>

          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/schools")}
              leftIcon={<ArrowLeft size={16} />}
            >
              Back to Schools
            </Button>

            <Button
              onClick={() => void fetchSchool()}
              leftIcon={<RefreshCw size={16} />}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <Link
          href={`/admin/schools/${encodeURIComponent(schoolId)}`}
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to School Details
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Edit School
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the school's information and access configuration.
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <XCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader
            title="Basic School Information"
            description="Update the school's name and contact details."
            icon={<Building2 size={19} />}
          />

          <CardContent className="space-y-5">
            <Input
              label="School Name"
              placeholder="Enter school name"
              value={form.schoolName}
              onChange={(value) => handleChange("schoolName", value)}
              error={errors.schoolName}
              leftIcon={<Building2 size={17} />}
              fullWidth
              required
            />

            <div>
              <Input
                label="School Subdomain"
                placeholder="e.g. christsschool"
                value={form.subDomain}
                onChange={(value) => handleChange("subDomain", value)}
                error={errors.subDomain}
                leftIcon={<Globe size={17} />}
                fullWidth
                required
              />

              <p className="mt-2 text-xs text-gray-500">
                Your school address:{" "}
                <span className="font-semibold text-blue-600">
                  {form.subDomain || "your-school"}.learnyfi.com.ng
                </span>
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="School Email"
                type="email"
                placeholder="school@example.com"
                value={form.schoolEmail}
                onChange={(value) => handleChange("schoolEmail", value)}
                error={errors.schoolEmail}
                leftIcon={<Mail size={17} />}
                fullWidth
                required
              />

              <Input
                label="School Phone Number"
                placeholder="08012345678"
                value={form.schoolPhone}
                onChange={(value) => handleChange("schoolPhone", value)}
                error={errors.schoolPhone}
                leftIcon={<Phone size={17} />}
                fullWidth
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader
            title="School Location"
            description="Update the school's physical address."
            icon={<MapPin size={19} />}
          />

          <CardContent className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Select
                  label="State"
                  placeholder="Select state"
                  options={STATE_OPTIONS}
                  value={form.state}
                  onChange={(value) => handleChange("state", value)}
                  fullWidth
                />

                {errors.state && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.state}
                  </p>
                )}
              </div>

              <Input
                label="Town / City"
                placeholder="Enter town or city"
                value={form.town}
                onChange={(value) => handleChange("town", value)}
                error={errors.town}
                fullWidth
                required
              />
            </div>

            <Input
              label="Full Address"
              placeholder="Enter the school's complete address"
              value={form.address}
              onChange={(value) => handleChange("address", value)}
              error={errors.address}
              leftIcon={<MapPin size={17} />}
              fullWidth
              required
            />
          </CardContent>
        </Card>

        {/* Access Configuration */}
        <Card>
          <CardHeader
            title="School Access Configuration"
            description="Choose how students access the school's learning environment."
            icon={<ShieldCheck size={19} />}
          />

          <CardContent className="space-y-4">
            <Select
              label="Access Mode"
              placeholder="Select access mode"
              options={ACCESS_MODE_OPTIONS}
              value={accessMode}
              onChange={(value) => {
                setAccessMode(value as SchoolAccessMode);
                setError("");
                setSuccess("");
              }}
              fullWidth
            />

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Access mode changes
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    Changing the access mode may affect how students
                    enter the school portal. Make sure the school is
                    prepared before changing this setting.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-6 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(`/admin/schools/${encodeURIComponent(schoolId)}`)
            }
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
            isLoading={saving}
            leftIcon={!saving ? <Save size={17} /> : undefined}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

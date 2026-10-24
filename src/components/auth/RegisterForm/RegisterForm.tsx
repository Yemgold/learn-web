



"use client";


import { useRouter } from "next/navigation";
import { useEffect, useState, type FocusEvent } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRegister } from "@/hooks";

import {
  AuthCard,
  AuthHeader,
  AuthFooter,
  Divider,
  PasswordInput,
  SocialLogin,
} from "@/components/auth";

import PasswordStrength from "./PasswordStrength";
import TermsCheckbox from "./TermsCheckbox";

import Image from "next/image";

/* =========================================================
   VALIDATION
========================================================= */

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long")
      .regex(
        /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
        "Please enter a valid first name",
      ),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long")
      .regex(
        /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
        "Please enter a valid last name",
      ),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^(?:0|\+234)(?:70|71|80|81|90|91)\d{8}$/,
        "Enter a valid Nigerian phone number",
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter",
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter",
      )
      .regex(
        /\d/,
        "Password must contain at least one number",
      ),

    // Passwords are intentionally not trimmed.
    confirmPassword: z.string(),

    acceptTerms: z
      .boolean()
      .refine((value) => value === true, {
        message: "You must accept the Terms & Conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type RegistrationField = keyof RegisterFormData;

/* =========================================================
   REGISTRATION STEPS
========================================================= */

type RegistrationStep = 1 | 2 | 3 | 4 | 5;

const stepTitles = [
  "Personal Information",
  "Email Address",
  "Phone Number",
  "Create Password",
  "Terms & Conditions",
];

const registrationStepByField: Record<
  RegistrationField,
  RegistrationStep
> = {
  firstName: 1,
  lastName: 1,
  email: 2,
  phoneNumber: 3,
  password: 4,
  confirmPassword: 4,
  acceptTerms: 5,
};

/* =========================================================
   PHONE NUMBER SANITIZER
========================================================= */

function sanitizePhoneNumber(value: string): string {
  let sanitized = value.replace(/[^\d+]/g, "");

  if (sanitized.startsWith("+")) {
    sanitized =
      "+" + sanitized.slice(1).replace(/\+/g, "");
  } else {
    sanitized = sanitized.replace(/\+/g, "");
  }

  return sanitized;
}

/* =========================================================
   ERROR HELPERS
========================================================= */

type UnknownRecord = Record<string, unknown>;

interface RegistrationErrorDetails {
  status?: number;
  code?: string;
  message: string;
  fieldErrors: Array<{
    field: RegistrationField;
    message: string;
  }>;
}

function asRecord(value: unknown): UnknownRecord | null {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as UnknownRecord;
  }

  return null;
}

function readErrorMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = readErrorMessage(item);

      if (message) return message;
    }

    return null;
  }

  const record = asRecord(value);

  if (!record) return null;

  for (const key of ["message", "msg", "detail", "description"]) {
    const message = readErrorMessage(record[key]);

    if (message) return message;
  }

  return null;
}

function resolveRegistrationField(
  fieldName: string,
): RegistrationField | null {
  const normalized = fieldName
    .split(".")
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z]/g, "");

  const aliases: Record<string, RegistrationField> = {
    firstname: "firstName",
    givenname: "firstName",
    lastname: "lastName",
    surname: "lastName",
    familyname: "lastName",

    email: "email",
    emailaddress: "email",

    phone: "phoneNumber",
    phoneNumber: "phoneNumber",
    phonenumber: "phoneNumber",
    mobilenumber: "phoneNumber",
    phonenumbervalue: "phoneNumber",
    mobile: "phoneNumber",

    password: "password",
    confirmpassword: "confirmPassword",
    passwordconfirmation: "confirmPassword",

    acceptterms: "acceptTerms",
    termsofservice: "acceptTerms",
  };

  return normalized ? aliases[normalized] ?? null : null;
}

function extractFieldErrors(
  rawErrors: unknown,
): RegistrationErrorDetails["fieldErrors"] {
  const result: RegistrationErrorDetails["fieldErrors"] = [];

  const addFieldError = (fieldName: unknown, rawMessage: unknown) => {
    if (typeof fieldName !== "string") return;

    const field = resolveRegistrationField(fieldName);
    const message = readErrorMessage(rawMessage);

    if (!field || !message) return;

    if (!result.some((item) => item.field === field)) {
      result.push({ field, message });
    }
  };

  if (Array.isArray(rawErrors)) {
    for (const item of rawErrors) {
      const record = asRecord(item);

      if (!record) continue;

      const fieldName =
        record.field ??
        record.path ??
        record.param ??
        record.property;

      const normalizedFieldName = Array.isArray(fieldName)
        ? fieldName.join(".")
        : fieldName;

      addFieldError(
        normalizedFieldName,
        record.message ?? record.msg ?? record.error,
      );
    }

    return result;
  }

  const record = asRecord(rawErrors);

  if (!record) return result;

  for (const [fieldName, message] of Object.entries(record)) {
    addFieldError(fieldName, message);
  }

  return result;
}

/**
 * Common custom backend codes.
 *
 * Add your backend's exact codes here as needed.
 * The actual backend message is preferred whenever available.
 */
const backendCodeMessages: Record<string, string> = {
  EMAIL_ALREADY_EXISTS:
    "An account with this email address already exists. Please sign in or use another email.",

  EMAIL_EXISTS:
    "An account with this email address already exists. Please use another email.",

  USER_ALREADY_EXISTS:
    "This account already exists. Please sign in instead.",

  PHONE_ALREADY_EXISTS:
    "This phone number is already registered. Please use another number.",

  PHONE_NUMBER_ALREADY_EXISTS:
    "This phone number is already registered. Please use another number.",

  INVALID_EMAIL:
    "Please enter a valid email address.",

  INVALID_PHONE_NUMBER:
    "Please enter a valid Nigerian phone number.",

  WEAK_PASSWORD:
    "Your password does not meet the required security rules.",

  TERMS_NOT_ACCEPTED:
    "You must accept the Terms & Conditions before registering.",

  TOO_MANY_REQUESTS:
    "Too many registration attempts. Please try again later.",
};

function getStatusFallback(status?: number): string {
  switch (status) {
    case 400:
      return "Some registration details are invalid. Please review your information.";

    case 401:
      return "Your request could not be authenticated. Please try again.";

    case 403:
      return "Registration is currently not permitted for this request.";

    case 404:
      return "The registration service could not be found. Please try again later.";

    case 409:
      return "An account with some of these details may already exist. Please check your email and phone number.";

    case 413:
      return "The submitted request is too large. Please review your information.";

    case 415:
      return "The registration request could not be processed in this format.";

    case 422:
      return "Some registration details failed validation. Please review the highlighted fields.";

    case 429:
      return "Too many registration attempts. Please wait before trying again.";

    case 500:
      return "A server error occurred while creating your account. Please try again later.";

    case 502:
    case 503:
    case 504:
      return "The registration service is temporarily unavailable. Please try again later.";

    default:
      return "Registration failed. Please check your details and try again.";
  }
}

function getRegistrationError(
  error: unknown,
): RegistrationErrorDetails {
  const root = asRecord(error);
  const response = asRecord(root?.response);
  const body = asRecord(response?.data);

  const nestedData = asRecord(body?.data);
  const nestedError = asRecord(body?.error);

  const rawStatus = response?.status ?? body?.statusCode;
  const status =
    typeof rawStatus === "number" ? rawStatus : undefined;

  const rawCode =
    body?.code ??
    body?.errorCode ??
    nestedData?.code ??
    nestedData?.errorCode ??
    nestedError?.code;

  const code =
    typeof rawCode === "string"
      ? rawCode.toUpperCase()
      : undefined;

  const backendMessage =
    readErrorMessage(body?.message) ??
    readErrorMessage(body?.error) ??
    readErrorMessage(body?.detail) ??
    readErrorMessage(nestedData?.message) ??
    readErrorMessage(nestedData?.error);

  const rootMessage =
    typeof root?.message === "string"
      ? root.message.trim()
      : "";

  const isGenericNetworkMessage =
    /^network error$/i.test(rootMessage) ||
    /request failed with status code/i.test(rootMessage) ||
    /timeout of .* exceeded/i.test(rootMessage);

  const message =
    backendMessage ??
    (code ? backendCodeMessages[code] : undefined) ??
    (!response && rootMessage && !isGenericNetworkMessage
      ? rootMessage
      : undefined) ??
    (!response && rootMessage
      ? "Unable to connect to the registration service. Check your internet connection and try again."
      : undefined) ??
    getStatusFallback(status);

  const rawFieldErrors =
    body?.errors ??
    body?.validationErrors ??
    body?.fieldErrors ??
    nestedData?.errors ??
    nestedData?.validationErrors ??
    nestedError?.errors;

  return {
    status,
    code,
    message,
    fieldErrors: extractFieldErrors(rawFieldErrors),
  };
}

/* =========================================================
   HORIZONTAL SLIDE ANIMATION
========================================================= */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),

  center: {
    x: "0%",
    opacity: 1,
  },

  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

/* =========================================================
   COMPONENT
========================================================= */

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("ref")?.trim();

    if (code) {
      setReferralCode(code);
    }
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<RegistrationStep>(1);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* =======================================================
     FORM
  ======================================================= */

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = watch("password");
  const acceptTerms = watch("acceptTerms");

  const isRegistering = registerMutation.isPending;

  /* =======================================================
     STEP VALIDATION
  ======================================================= */

  const stepFields: Record<
    RegistrationStep,
    RegistrationField[]
  > = {
    1: ["firstName", "lastName"],
    2: ["email"],
    3: ["phoneNumber"],
    4: ["password", "confirmPassword"],
    5: ["acceptTerms"],
  };

  /* =======================================================
     TRIM TEXT INPUTS ON BLUR
  ======================================================= */

  const trimOnBlur =
    (field: "firstName" | "lastName" | "email") =>
    (event: FocusEvent<HTMLInputElement>) => {
      const trimmedValue = event.currentTarget.value.trim();

      clearErrors(field);

      setValue(field, trimmedValue, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    };

  /* =======================================================
     CHANGE STEP
  ======================================================= */

  const changeStep = (
    nextStep: RegistrationStep,
    slideDirection: number,
  ) => {
    if (isAnimating || isRegistering) return;

    setDirection(slideDirection);
    setIsAnimating(true);
    setStep(nextStep);

    window.setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = async () => {
    if (isAnimating || isRegistering) return;

    setSubmitError(null);

    const fields = stepFields[step];
    const valid = await trigger(fields);

    if (!valid) return;

    if (step < 5) {
      changeStep((step + 1) as RegistrationStep, 1);
    }
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    if (isAnimating || isRegistering) return;

    setSubmitError(null);

    if (step === 1) {
      setShowForm(false);
      return;
    }

    changeStep((step - 1) as RegistrationStep, -1);
  };

  /* =======================================================
     SWIPE
  ======================================================= */

  const handleSwipe = (offsetX: number) => {
    if (Math.abs(offsetX) < 70) return;

    if (offsetX < 0) {
      void handleNext();
      return;
    }

    if (offsetX > 0) {
      handleBack();
    }
  };

  /* =======================================================
     SUBMIT REGISTRATION
  ======================================================= */

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null);

    try {
     const normalizedData = {
  ...data,

  firstName: data.firstName.trim(),
  lastName: data.lastName.trim(),
  email: data.email.trim().toLowerCase(),
  phoneNumber: sanitizePhoneNumber(
    data.phoneNumber.trim(),
  ),

  password: data.password,
  confirmPassword: data.confirmPassword,

  ...(referralCode ? { referredBy: referralCode } : {}),
};

      await registerMutation.mutateAsync(normalizedData);

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(
          normalizedData.email,
        )}`,
      );
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      const details = getRegistrationError(error);

      setSubmitError(details.message);

      /* =====================================================
         FIELD-SPECIFIC BACKEND ERRORS
      ===================================================== */

      for (const fieldError of details.fieldErrors) {
        setError(fieldError.field, {
          type: "server",
          message: fieldError.message,
        });
      }

      /* =====================================================
         TAKE THE USER TO THE FIRST AFFECTED STEP
      ===================================================== */

      if (details.fieldErrors.length > 0) {
        const targetSteps = details.fieldErrors.map(
          ({ field }) => registrationStepByField[field],
        );

        const earliestStep = Math.min(
          ...targetSteps,
        ) as RegistrationStep;

        setDirection(earliestStep < step ? -1 : 1);
        setIsAnimating(false);
        setStep(earliestStep);
      }
    }
  };

  /* =======================================================
     OPEN REGISTRATION FORM
  ======================================================= */

  if (!showForm) {
    return (
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Join Learnyfi today — just 5 simple steps!"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="space-y-5"
        >
          <div className="mt-4 overflow-hidden rounded-2xl">
            <Image
              src="/images/auth/login-students.png"
              alt="Two students studying together"
              width={900}
              height={520}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          <Button
            type="button"
            onClick={() => {
              setStep(1);
              setDirection(1);
              setSubmitError(null);
              setShowForm(true);
            }}
            className="h-12 w-full rounded-xl"
          >
            Start Registration
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Divider />

          <SocialLogin />

          <AuthFooter
            text="Already have an account?"
            linkText="Sign In"
            href="/auth/login"
          />
        </motion.div>
      </AuthCard>
    );
  }

  /* =========================================================
     REGISTRATION FORM
  ========================================================= */

  return (
    <AuthCard>
      <AuthHeader
        title="Create Account"
        subtitle="Join Learnyfi today — just 5 simple steps!"
      />

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Step {step} of 5
                </p>

                <p className="text-xs text-muted-foreground">
                  {stepTitles[step - 1]}
                </p>
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>

            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    item <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ==================================================
              BACKEND / NETWORK ERROR
          ================================================== */}

          {submitError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  Registration unsuccessful
                </p>

                <p className="mt-1 break-words text-sm leading-5">
                  {submitError}
                </p>
              </div>
            </div>
          )}

          {/* ==================================================
              STEP CONTAINER
          ================================================== */}

          <div className="relative w-full overflow-hidden touch-pan-y">
            <AnimatePresence
              mode="wait"
              initial={false}
              custom={direction}
            >
              {/* =================================================
                  STEP 1 — PERSONAL INFORMATION
              ================================================= */}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) =>
                    handleSwipe(info.offset.x)
                  }
                  className="w-full space-y-5"
                >
                  {/* First Name */}

                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium"
                    >
                      First Name
                    </label>

                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      autoComplete="given-name"
                      aria-invalid={!!errors.firstName}
                      {...register("firstName", {
                        onBlur: trimOnBlur("firstName"),
                      })}
                    />

                    {errors.firstName?.message && (
                      <p className="text-sm text-destructive">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}

                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium"
                    >
                      Last Name
                    </label>

                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      autoComplete="family-name"
                      aria-invalid={!!errors.lastName}
                      {...register("lastName", {
                        onBlur: trimOnBlur("lastName"),
                      })}
                    />

                    {errors.lastName?.message && (
                      <p className="text-sm text-destructive">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isAnimating || isRegistering}
                    className="h-12 w-full rounded-xl"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* =================================================
                  STEP 2 — EMAIL
              ================================================= */}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) =>
                    handleSwipe(info.offset.x)
                  }
                  className="w-full space-y-5"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium"
                    >
                      Email Address
                    </label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      {...register("email", {
                        onBlur: trimOnBlur("email"),
                      })}
                    />

                    {errors.email?.message && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      We'll use this email to verify your account.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isAnimating || isRegistering}
                    className="h-12 w-full rounded-xl"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* =================================================
                  STEP 3 — PHONE
              ================================================= */}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) =>
                    handleSwipe(info.offset.x)
                  }
                  className="w-full space-y-5"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium"
                    >
                      Phone Number
                    </label>

                    <Input
                      id="phoneNumber"
                      type="tel"
                      inputMode="tel"
                      placeholder="08012345678"
                      autoComplete="tel"
                      maxLength={14}
                      aria-invalid={!!errors.phoneNumber}
                      {...register("phoneNumber", {
                        onChange: (event) => {
                          const sanitized = sanitizePhoneNumber(
                            event.currentTarget.value,
                          );

                          setValue("phoneNumber", sanitized, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        },

                        onBlur: (event) => {
                          const sanitized = sanitizePhoneNumber(
                            event.currentTarget.value.trim(),
                          );

                          clearErrors("phoneNumber");

                          setValue("phoneNumber", sanitized, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        },
                      })}
                    />

                    {errors.phoneNumber?.message && (
                      <p className="text-sm text-destructive">
                        {errors.phoneNumber.message}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Use a Nigerian mobile number, e.g. 08012345678.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isAnimating || isRegistering}
                    className="h-12 w-full rounded-xl"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* =================================================
                  STEP 4 — PASSWOR
              ================================================= */}

              {step === 4 && (
                <motion.div
                  key="step-4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) =>
                    handleSwipe(info.offset.x)
                  }
                  className="w-full space-y-5"
                >
                  {/* Password */}

                  <div className="space-y-2">
                    <PasswordInput
                      label="Password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      error={errors.password?.message}
                      {...register("password")}
                    />

                    <PasswordStrength password={password} />
                  </div>

                  {/* Confirm Password */}

                  <div className="space-y-2">
                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Enter your password again"
                      autoComplete="new-password"
                      error={errors.confirmPassword?.message}
                      {...register("confirmPassword")}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isAnimating || isRegistering}
                    className="h-12 w-full rounded-xl"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* =================================================
                  STEP 5 — TERMS & SUBMISSION
              ================================================= */}

              {step === 5 && (
                <motion.div
                  key="step-5"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) =>
                    handleSwipe(info.offset.x)
                  }
                  className="w-full space-y-5"
                >
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold">
                        Almost there!
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Please review and accept the Terms & Conditions
                        before creating your Learnyfi account.
                      </p>
                    </div>

                    <TermsCheckbox
                      checked={acceptTerms}
                      onChange={(checked) => {
                        clearErrors("acceptTerms");

                        setValue("acceptTerms", checked, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }}
                    />

                    {errors.acceptTerms?.message && (
                      <p className="mt-3 text-sm text-destructive">
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!acceptTerms || isRegistering}
                    className="h-12 w-full rounded-xl"
                  >
                    {isRegistering
                      ? "Creating Account..."
                      : "Create Account"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ==================================================
              BACK BUTTON
          ================================================== */}

          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={isAnimating || isRegistering}
            className="h-10 w-full rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />

            {step === 1
              ? "Back to Registration"
              : "Back"}
          </Button>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <AuthFooter
            text="Already have an account?"
            linkText="Sign In"
            href="/auth/login"
          />
        </form>
      </motion.div>
    </AuthCard>
  );
}

















// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import { motion, AnimatePresence } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { ArrowLeft, ArrowRight } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import { useRegister } from "@/hooks";

// import {
//   AuthCard,
//   AuthHeader,
//   AuthFooter,
//   Divider,
//   PasswordInput,
//   SocialLogin,
// } from "@/components/auth";

// import PasswordStrength from "./PasswordStrength";
// import TermsCheckbox from "./TermsCheckbox";

// import Image from "next/image";

// /* =========================================================
//    VALIDATION
//    ========================================================= */

// const registerSchema = z
//   .object({
//     firstName: z
//       .string()
//       .min(2, "First name must be at least 2 characters")
//       .max(50, "First name is too long")
//       .regex(
//         /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
//         "Please enter a valid first name",
//       ),

//     lastName: z
//       .string()
//       .min(2, "Last name must be at least 2 characters")
//       .max(50, "Last name is too long")
//       .regex(
//         /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
//         "Please enter a valid last name",
//       ),

//     email: z
//       .string()
//       .trim()
//       .email("Please enter a valid email address"),

//     phoneNumber: z
//       .string()
//       .trim()
//       .regex(
//         /^(?:0|\+234)(?:70|71|80|81|90|91)\d{8}$/,
//         "Enter a valid Nigerian phone number",
//       ),

//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//       .regex(/\d/, "Password must contain at least one number"),

//     confirmPassword: z.string(),

//     acceptTerms: z
//       .boolean()
//       .refine((value) => value === true, {
//         message: "You must accept the Terms & Conditions",
//       }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// type RegisterFormData = z.infer<typeof registerSchema>;

// /* =========================================================
//    PHONE SANITIZER
//    ========================================================= */

// function sanitizePhoneNumber(value: string): string {
//   let sanitized = value.replace(/[^\d+]/g, "");

//   if (sanitized.startsWith("+")) {
//     sanitized = "+" + sanitized.slice(1).replace(/\+/g, "");
//   } else {
//     sanitized = sanitized.replace(/\+/g, "");
//   }

//   return sanitized;
// }

// /* =========================================================
//    STEPS
//    ========================================================= */

// type RegistrationStep = 1 | 2 | 3 | 4 | 5;

// const stepTitles = [
//   "Personal Information",
//   "Email Address",
//   "Phone Number",
//   "Create Password",
//   "Terms & Conditions",
// ];

// /* =========================================================
//    HORIZONTAL SLIDE ANIMATION
//    ========================================================= */

// const slideVariants = {
//   enter: (direction: number) => ({
//     x: direction > 0 ? "100%" : "-100%",
//     opacity: 0,
//   }),

//   center: {
//     x: "0%",
//     opacity: 1,
//   },

//   exit: (direction: number) => ({
//     x: direction > 0 ? "-100%" : "100%",
//     opacity: 0,
//   }),
// };

// /* =========================================================
//    COMPONENT
//    ========================================================= */

// export default function RegisterForm() {
//   const router = useRouter();

//   const registerMutation = useRegister();

//   const [showForm, setShowForm] = useState(false);
//   const [step, setStep] = useState<RegistrationStep>(1);

//   /**
//    * 1 = moving forward
//    * -1 = moving backward
//    */
//   const [direction, setDirection] = useState(1);

//   const [isAnimating, setIsAnimating] = useState(false);

//   /* =======================================================
//      FORM
//      ======================================================= */

//   const {
//     register,
//     handleSubmit,
//     trigger,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),

//     mode: "onBlur",

//     reValidateMode: "onChange",

//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       phoneNumber: "",
//       password: "",
//       confirmPassword: "",
//       acceptTerms: false,
//     },
//   });

//   const password = watch("password");
//   const acceptTerms = watch("acceptTerms");

//   /* =======================================================
//      STEP VALIDATION
//      ======================================================= */

//   const stepFields: Record<RegistrationStep, (keyof RegisterFormData)[]> = {
//     1: ["firstName", "lastName"],
//     2: ["email"],
//     3: ["phoneNumber"],
//     4: ["password", "confirmPassword"],
//     5: ["acceptTerms"],
//   };

//   /* =======================================================
//      CHANGE STEP
//      ======================================================= */

//   const changeStep = (
//     nextStep: RegistrationStep,
//     slideDirection: number,
//   ) => {
//     if (isAnimating) return;

//     setDirection(slideDirection);
//     setIsAnimating(true);
//     setStep(nextStep);

//     window.setTimeout(() => {
//       setIsAnimating(false);
//     }, 400);
//   };

//   /* =======================================================
//      NEXT
//      ======================================================= */

//   const handleNext = async () => {
//     if (isAnimating) return;

//     const fields = stepFields[step];

//     const valid = await trigger(fields);

//     if (!valid) return;

//     if (step < 5) {
//       changeStep((step + 1) as RegistrationStep, 1);
//     }
//   };

//   /* =======================================================
//      BACK
//      ======================================================= */

//   const handleBack = () => {
//     if (isAnimating) return;

//     if (step === 1) {
//       setShowForm(false);
//       return;
//     }

//     changeStep((step - 1) as RegistrationStep, -1);
//   };

//   /* =======================================================
//      SWIPE
//      ======================================================= */

//   const handleSwipe = (offsetX: number) => {
//     /**
//      * Ignore small accidental movements.
//      */
//     if (Math.abs(offsetX) < 70) return;

//     /**
//      * Swipe left = next
//      */
//     if (offsetX < 0) {
//       void handleNext();
//       return;
//     }

//     /**
//      * Swipe right = back
//      */
//     if (offsetX > 0) {
//       handleBack();
//     }
//   };

//   /* =======================================================
//      SUBMIT
//      ======================================================= */

//   const onSubmit = async (data: RegisterFormData) => {
//     try {
//       const normalizedData = {
//         ...data,

//         firstName: data.firstName.trim(),

//         lastName: data.lastName.trim(),

//         email: data.email.trim().toLowerCase(),

//         phoneNumber: sanitizePhoneNumber(data.phoneNumber),
//       };

//       await registerMutation.mutateAsync(normalizedData);

//       router.push(
//         `/auth/verify-email?email=${encodeURIComponent(
//           normalizedData.email,
//         )}`,
//       );
//     } catch (error: unknown) {
//       let message = "Registration failed. Please try again.";

//       if (error instanceof Error && error.message) {
//         message = error.message;
//       } else if (
//         typeof error === "object" &&
//         error !== null &&
//         "message" in error &&
//         typeof (error as { message?: unknown }).message === "string"
//       ) {
//         message = (error as { message: string }).message;
//       }

//       alert(message);
//     }
//   };

//   /* =======================================================
//      OPEN REGISTRATION FORM
//      ======================================================= */

//   if (!showForm) {
//     return (
//       <AuthCard>
//         <AuthHeader
//           title="Create Account"
//           subtitle="Join Learnyfi today — just 5 simple steps!"
//         />

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{
//             duration: 0.4,
//             ease: [0.22, 1, 0.36, 1],
//           }}
//           className="space-y-5"
//         >
//           {/* ==================================================
//               IMAGE
//               ================================================== */}

//           <div className="mt-4 overflow-hidden rounded-2xl">
//             <Image
//               src="/images/auth/login-students.png"
//               alt="Two students studying together"
//               width={900}
//               height={520}
//               priority
//               className="h-auto w-full object-cover"
//             />
//           </div>

//           {/* ==================================================
//               OPEN FORM BUTTON
//               ================================================== */}

//           <Button
//             type="button"
//             onClick={() => {
//               setStep(1);
//               setDirection(1);
//               setShowForm(true);
//             }}
//             className="h-12 w-full rounded-xl"
//           >
//             Start Registration
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>

//           <Divider />

//           <SocialLogin />

//           <AuthFooter
//             text="Already have an account?"
//             linkText="Sign In"
//             href="/auth/login"
//           />
//         </motion.div>
//       </AuthCard>
//     );
//   }

//   /* =========================================================
//      REGISTRATION FORM
//      ========================================================= */

//   return (
//     <AuthCard>
//       <AuthHeader
//         title="Create Account"
//         subtitle="Join Learnyfi today — just 5 simple steps!"
//       />

//       {/* ======================================================
//           FORM
//           ====================================================== */}

//       <motion.div
//         initial={{
//           opacity: 0,
//           x: 60,
//         }}
//         animate={{
//           opacity: 1,
//           x: 0,
//         }}
//         transition={{
//           duration: 0.35,
//           ease: [0.22, 1, 0.36, 1],
//         }}
//         className="w-full"
//       >
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           {/* ==================================================
//               PROGRESS
//               ================================================== */}

//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-foreground">
//                   Step {step} of 5
//                 </p>

//                 <p className="text-xs text-muted-foreground">
//                   {stepTitles[step - 1]}
//                 </p>
//               </div>

//               <span className="text-xs font-medium text-muted-foreground">
//                 {Math.round((step / 5) * 100)}%
//               </span>
//             </div>

//             <div className="flex gap-1.5">
//               {[1, 2, 3, 4, 5].map((item) => (
//                 <div
//                   key={item}
//                   className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
//                     item <= step
//                       ? "bg-primary"
//                       : "bg-muted"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* ==================================================
//               STEP CONTAINER
//               ================================================== */}

//           <div className="relative w-full overflow-hidden touch-pan-y">
//             <AnimatePresence
//               mode="wait"
//               initial={false}
//               custom={direction}
//             >
//               {/* =================================================
//                   STEP 1 — PERSONAL INFORMATION
//                   ================================================= */}

//               {step === 1 && (
//                 <motion.div
//                   key="step-1"
//                   custom={direction}
//                   variants={slideVariants}
//                   initial="enter"
//                   animate="center"
//                   exit="exit"
//                   transition={{
//                     duration: 0.4,
//                     ease: [0.22, 1, 0.36, 1],
//                   }}
//                   drag="x"
//                   dragDirectionLock
//                   dragConstraints={{
//                     left: 0,
//                     right: 0,
//                   }}
//                   dragElastic={0.2}
//                   onDragEnd={(_event, info) => {
//                     handleSwipe(info.offset.x);
//                   }}
//                   className="w-full space-y-5"
//                 >
//                   {/* First Name */}

//                   <div className="space-y-2">
//                     <label
//                       htmlFor="firstName"
//                       className="text-sm font-medium"
//                     >
//                       First Name
//                     </label>

//                     <Input
//                       id="firstName"
//                       placeholder="Enter your first name"
//                       autoComplete="given-name"
//                       {...register("firstName")}
//                     />

//                     {errors.firstName?.message && (
//                       <p className="text-sm text-destructive">
//                         {errors.firstName.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Last Name */}

//                   <div className="space-y-2">
//                     <label
//                       htmlFor="lastName"
//                       className="text-sm font-medium"
//                     >
//                       Last Name
//                     </label>

//                     <Input
//                       id="lastName"
//                       placeholder="Enter your last name"
//                       autoComplete="family-name"
//                       {...register("lastName")}
//                     />

//                     {errors.lastName?.message && (
//                       <p className="text-sm text-destructive">
//                         {errors.lastName.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Next */}

//                   <Button
//                     type="button"
//                     onClick={handleNext}
//                     disabled={isAnimating}
//                     className="h-12 w-full rounded-xl"
//                   >
//                     Continue
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </motion.div>
//               )}

//               {/* =================================================
//                   STEP 2 — EMAIL
//                   ================================================= */}

//               {step === 2 && (
//                 <motion.div
//                   key="step-2"
//                   custom={direction}
//                   variants={slideVariants}
//                   initial="enter"
//                   animate="center"
//                   exit="exit"
//                   transition={{
//                     duration: 0.4,
//                     ease: [0.22, 1, 0.36, 1],
//                   }}
//                   drag="x"
//                   dragDirectionLock
//                   dragConstraints={{
//                     left: 0,
//                     right: 0,
//                   }}
//                   dragElastic={0.2}
//                   onDragEnd={(_event, info) => {
//                     handleSwipe(info.offset.x);
//                   }}
//                   className="w-full space-y-5"
//                 >
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="email"
//                       className="text-sm font-medium"
//                     >
//                       Email Address
//                     </label>

//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter your email address"
//                       autoComplete="email"
//                       {...register("email")}
//                     />

//                     {errors.email?.message && (
//                       <p className="text-sm text-destructive">
//                         {errors.email.message}
//                       </p>
//                     )}

//                     <p className="text-xs text-muted-foreground">
//                       We'll use this email to verify your account.
//                     </p>
//                   </div>

//                   <Button
//                     type="button"
//                     onClick={handleNext}
//                     disabled={isAnimating}
//                     className="h-12 w-full rounded-xl"
//                   >
//                     Continue
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </motion.div>
//               )}

//               {/* =================================================
//                   STEP 3 — PHONE
//                   ================================================= */}

//               {step === 3 && (
//                 <motion.div
//                   key="step-3"
//                   custom={direction}
//                   variants={slideVariants}
//                   initial="enter"
//                   animate="center"
//                   exit="exit"
//                   transition={{
//                     duration: 0.4,
//                     ease: [0.22, 1, 0.36, 1],
//                   }}
//                   drag="x"
//                   dragDirectionLock
//                   dragConstraints={{
//                     left: 0,
//                     right: 0,
//                   }}
//                   dragElastic={0.2}
//                   onDragEnd={(_event, info) => {
//                     handleSwipe(info.offset.x);
//                   }}
//                   className="w-full space-y-5"
//                 >
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="phoneNumber"
//                       className="text-sm font-medium"
//                     >
//                       Phone Number
//                     </label>

//                     <Input
//                       id="phoneNumber"
//                       type="tel"
//                       inputMode="tel"
//                       placeholder="08012345678"
//                       autoComplete="tel"
//                       maxLength={14}
//                       {...register("phoneNumber", {
//                         onChange: (event) => {
//                           const sanitized = sanitizePhoneNumber(
//                             event.target.value,
//                           );

//                           setValue("phoneNumber", sanitized, {
//                             shouldValidate: true,
//                             shouldDirty: true,
//                           });
//                         },
//                       })}
//                     />

//                     {errors.phoneNumber?.message && (
//                       <p className="text-sm text-destructive">
//                         {errors.phoneNumber.message}
//                       </p>
//                     )}

//                     <p className="text-xs text-muted-foreground">
//                       Use a Nigerian mobile number, e.g. 08012345678.
//                     </p>
//                   </div>

//                   <Button
//                     type="button"
//                     onClick={handleNext}
//                     disabled={isAnimating}
//                     className="h-12 w-full rounded-xl"
//                   >
//                     Continue
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </motion.div>
//               )}

//               {/* =================================================
//                   STEP 4 — PASSWORD
//                   ================================================= */}

//               {step === 4 && (
//                 <motion.div
//                   key="step-4"
//                   custom={direction}
//                   variants={slideVariants}
//                   initial="enter"
//                   animate="center"
//                   exit="exit"
//                   transition={{
//                     duration: 0.4,
//                     ease: [0.22, 1, 0.36, 1],
//                   }}
//                   drag="x"
//                   dragDirectionLock
//                   dragConstraints={{
//                     left: 0,
//                     right: 0,
//                   }}
//                   dragElastic={0.2}
//                   onDragEnd={(_event, info) => {
//                     handleSwipe(info.offset.x);
//                   }}
//                   className="w-full space-y-5"
//                 >
//                   {/* Password */}

//                   <div className="space-y-2">
//                     <PasswordInput
//                       label="Password"
//                       placeholder="Create a password"
//                       autoComplete="new-password"
//                       error={errors.password?.message}
//                       {...register("password")}
//                     />

//                     <PasswordStrength password={password} />
//                   </div>

//                   {/* Confirm Password */}

//                   <div className="space-y-2">
//                     <PasswordInput
//                       label="Confirm Password"
//                       placeholder="Enter your password again"
//                       autoComplete="new-password"
//                       error={errors.confirmPassword?.message}
//                       {...register("confirmPassword")}
//                     />
//                   </div>

//                   <Button
//                     type="button"
//                     onClick={handleNext}
//                     disabled={isAnimating}
//                     className="h-12 w-full rounded-xl"
//                   >
//                     Continue
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </motion.div>
//               )}

//               {/* =================================================
//                   STEP 5 — TERMS
//                   ================================================= */}

//               {step === 5 && (
//                 <motion.div
//                   key="step-5"
//                   custom={direction}
//                   variants={slideVariants}
//                   initial="enter"
//                   animate="center"
//                   exit="exit"
//                   transition={{
//                     duration: 0.4,
//                     ease: [0.22, 1, 0.36, 1],
//                   }}
//                   drag="x"
//                   dragDirectionLock
//                   dragConstraints={{
//                     left: 0,
//                     right: 0,
//                   }}
//                   dragElastic={0.2}
//                   onDragEnd={(_event, info) => {
//                     handleSwipe(info.offset.x);
//                   }}
//                   className="w-full space-y-5"
//                 >
//                   <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
//                     <div className="mb-4">
//                       <h3 className="text-base font-semibold">
//                         Almost there!
//                       </h3>

//                       <p className="mt-1 text-sm text-muted-foreground">
//                         Please review and accept the Terms & Conditions
//                         before creating your Learnyfi account.
//                       </p>
//                     </div>

//                     <TermsCheckbox
//                       checked={acceptTerms}
//                       onChange={(checked) =>
//                         setValue("acceptTerms", checked, {
//                           shouldValidate: true,
//                           shouldDirty: true,
//                           shouldTouch: true,
//                         })
//                       }
//                     />

//                     {errors.acceptTerms?.message && (
//                       <p className="mt-3 text-sm text-destructive">
//                         {errors.acceptTerms.message}
//                       </p>
//                     )}
//                   </div>

//                   <Button
//                     type="submit"
//                     disabled={
//                       !acceptTerms ||
//                       registerMutation.isPending
//                     }
//                     className="h-12 w-full rounded-xl"
//                   >
//                     {registerMutation.isPending
//                       ? "Creating Account..."
//                       : "Create Account"}
//                   </Button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* ==================================================
//               BACK BUTTON
//               ================================================== */}

//           <Button
//             type="button"
//             variant="ghost"
//             onClick={handleBack}
//             disabled={isAnimating || registerMutation.isPending}
//             className="h-10 w-full rounded-xl"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />

//             {step === 1 ? "Back to Registration" : "Back"}
//           </Button>

//           {/* ==================================================
//               FOOTER
//               ================================================== */}

//           <AuthFooter
//             text="Already have an account?"
//             linkText="Sign In"
//             href="/auth/login"
//           />
//         </form>
//       </motion.div>
//     </AuthCard>
//   );
// }
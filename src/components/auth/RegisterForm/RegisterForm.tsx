

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import type { FormEvent } from "react";

// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import { useRegister } from "@/hooks";

// import Image from "next/image";

// import {
//   AuthCard,
//   AuthHeader,
//   AuthFooter,
//   PasswordInput,
// } from "@/components/auth";

// import PasswordStrength from "./PasswordStrength";
// import TermsCheckbox from "./TermsCheckbox";

// import { ArrowRight } from "lucide-react";

// /* ============================================================
//    VALIDATION SCHEMA
//    ============================================================ */

// const registerSchema = z
//   .object({
//     firstName: z
//       .string()
//       .trim()
//       .min(2, "First name must be at least 2 characters")
//       .max(50, "First name must not exceed 50 characters")
//       .regex(
//         /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
//         "Enter a valid first name"
//       ),

//     lastName: z
//       .string()
//       .trim()
//       .min(2, "Last name must be at least 2 characters")
//       .max(50, "Last name must not exceed 50 characters")
//       .regex(
//         /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
//         "Enter a valid last name"
//       ),

//     email: z
//       .string()
//       .trim()
//       .min(1, "Email is required")
//       .email("Enter a valid email address")
//       .max(254, "Email address is too long"),

//     phoneNumber: z
//       .string()
//       .trim()
//       .min(1, "Phone number is required")
//       .regex(
//         /^(?:0|\+234)(?:70|71|80|81|90|91)\d{8}$/,
//         "Enter a valid Nigerian phone number"
//       ),

//     password: z
//       .string()
//       .min(8, "Password must contain at least 8 characters")
//       .max(100, "Password must not exceed 100 characters")
//       .regex(
//         /[A-Z]/,
//         "Password must contain at least one uppercase letter"
//       )
//       .regex(
//         /[a-z]/,
//         "Password must contain at least one lowercase letter"
//       )
//       .regex(
//         /\d/,
//         "Password must contain at least one number"
//       )
//       .regex(
//         /[^A-Za-z0-9]/,
//         "Password must contain at least one special character"
//       ),

//     confirmPassword: z
//       .string()
//       .min(1, "Please confirm your password"),

//     acceptTerms: z
//       .boolean()
//       .refine((value) => value === true, {
//         message: "You must accept the terms and conditions.",
//       }),
//   })
//   .refine(
//     (data) => data.password === data.confirmPassword,
//     {
//       path: ["confirmPassword"],
//       message: "Passwords do not match",
//     }
//   );

// type RegisterFormData = z.infer<typeof registerSchema>;

// /* ============================================================
//    PHONE SANITIZER
//    ============================================================ */

// function sanitizePhoneNumber(value: string): string {
//   let sanitized = value.replace(/[^\d+]/g, "");

//   if (sanitized.startsWith("+")) {
//     sanitized =
//       "+" +
//       sanitized.slice(1).replace(/\+/g, "");
//   } else {
//     sanitized = sanitized.replace(/\+/g, "");
//   }

//   return sanitized;
// }

// /* ============================================================
//    STEP TYPES
//    ============================================================ */

// type RegistrationStep = 1 | 2 | 3 | 4;

// const stepTitles = [
//   "Personal Information",
//   "Contact Information",
//   "Create Password",
//   "Terms & Conditions",
// ];

// /* ============================================================
//    COMPONENT
//    ============================================================ */

// export default function RegisterForm() {
//   const router = useRouter();

//   const [showForm, setShowForm] = useState(false);
//   const [step, setStep] = useState<RegistrationStep>(1);

//   const registerMutation = useRegister();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     trigger,
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

//   /* ============================================================
//      PHONE INPUT
//      ============================================================ */

//   const handlePhoneInput = (
//     event: FormEvent<HTMLInputElement>
//   ) => {
//     const input = event.currentTarget;

//     const sanitizedValue = sanitizePhoneNumber(input.value);

//     if (input.value !== sanitizedValue) {
//       input.value = sanitizedValue;
//     }

//     setValue("phoneNumber", sanitizedValue, {
//       shouldDirty: true,
//       shouldTouch: true,
//       shouldValidate: true,
//     });
//   };

//   /* ============================================================
//      NEXT STEP
//      ============================================================ */

//   const handleNext = async () => {
//     if (step === 1) {
//       const isValid = await trigger([
//         "firstName",
//         "lastName",
//       ]);

//       if (!isValid) {
//         return;
//       }

//       setStep(2);
//       return;
//     }

//     if (step === 2) {
//       const isValid = await trigger([
//         "email",
//         "phoneNumber",
//       ]);

//       if (!isValid) {
//         return;
//       }

//       setStep(3);
//       return;
//     }

//     if (step === 3) {
//       const isValid = await trigger([
//         "password",
//         "confirmPassword",
//       ]);

//       if (!isValid) {
//         return;
//       }

//       setStep(4);
//     }
//   };

//   /* ============================================================
//      BACK
//      ============================================================ */

//   const handleBack = () => {
//     if (step === 1) {
//       setShowForm(false);
//       return;
//     }

//     setStep((currentStep) =>
//       (currentStep - 1) as RegistrationStep
//     );
//   };

//   /* ============================================================
//      SUBMIT
//      ============================================================ */

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
//           normalizedData.email
//         )}`
//       );
//     } catch (error: any) {
//       console.error("Registration error:", error);

//       alert(
//         error?.response?.data?.message ??
//           "Registration failed. Please try again."
//       );
//     }
//   };

// /* ============================================================
//    INITIAL SCREEN
//    ============================================================ */

// if (!showForm) {
//   return (
//     <AuthCard>
//       <AuthHeader
//         title="Create Account"
//         subtitle="Join Learnyfi today — just 4 simple steps!"
//       />

//       {/* Registration illustration */}
//       <div className="mt-4 overflow-hidden rounded-2xl">
//         <Image
//           src="/images/auth/login-students.png"
//           alt="Two students studying together"
//           width={900}
//           height={520}
//           priority
//           className="h-auto w-full object-cover"
//         />
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="space-y-5 pt-4"
//       >
//         <Button
//           type="button"
//           className="
//             activate-learning-button
//             mt-6
//             flex
//             w-full
//             items-center
//             justify-center
//             gap-2
//             rounded-xl
//             bg-blue-500
//             px-5
//             py-3.5
//             text-sm
//             font-bold
//             text-white
//             shadow-lg
//             shadow-blue-950/30
//             transition
//             hover:bg-blue-400
//             active:scale-[0.98]
//           "
//           onClick={() => {
//             setStep(1);
//             setShowForm(true);
//           }}
//         >
//           Click Registration Form
//           <ArrowRight className="h-4 w-4" />
//         </Button>
//       </motion.div>

//       <AuthFooter
//         text="Already have an account?"
//         linkText="Login"
//         href="/auth/login"
//       />
//     </AuthCard>
//   );
// }
//   /* ============================================================
//      REGISTRATION FORM
//      ============================================================ */

//   return (
//     <AuthCard>
//       <AuthHeader
//         title="Create Account"
//         subtitle="Join Learnyfi today"
//       />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//       >
//         {/* ==================================================
//             STEP INDICATOR
//             ================================================== */}

//         <div className="mb-6">
//           <div className="mb-3 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-semibold text-slate-900">
//                 Step {step} of 4
//               </p>

//               <p className="text-xs text-slate-500">
//                 {stepTitles[step - 1]}
//               </p>
//             </div>

//             <p className="text-xs font-medium text-slate-500">
//               {Math.round((step / 4) * 100)}%
//             </p>
//           </div>

//           <div className="h-2 overflow-hidden rounded-full bg-slate-200">
//             <motion.div
//               className="h-full rounded-full bg-primary"
//               initial={false}
//               animate={{
//                 width: `${(step / 4) * 100}%`,
//               }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="space-y-5"
//           noValidate
//         >
//           {/* ==================================================
//               STEP 1
//               FIRST NAME + LAST NAME
//               ================================================== */}

//           {step === 1 && (
//             <motion.div
//               key="step-1"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.25 }}
//               className="space-y-5"
//             >
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <Input
//                   label="First Name"
//                   placeholder="John"
//                   autoComplete="given-name"
//                   error={errors.firstName?.message}
//                   {...register("firstName")}
//                 />

//                 <Input
//                   label="Last Name"
//                   placeholder="Doe"
//                   autoComplete="family-name"
//                   error={errors.lastName?.message}
//                   {...register("lastName")}
//                 />
//               </div>

//               <Button
//                 type="button"
//                 className="w-full"
//                 onClick={handleNext}
//               >
//                 Next
//               </Button>

//               <Button
//                 type="button"
//                 variant="ghost"
//                 className="w-full"
//                 onClick={handleBack}
//               >
//                 Back
//               </Button>
//             </motion.div>
//           )}

//           {/* ==================================================
//               STEP 2
//               EMAIL + PHONE NUMBER
//               ================================================== */}

//           {step === 2 && (
//             <motion.div
//               key="step-2"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.25 }}
//               className="space-y-5"
//             >
//               <Input
//                 label="Email"
//                 type="email"
//                 placeholder="example@email.com"
//                 autoComplete="email"
//                 error={errors.email?.message}
//                 {...register("email")}
//               />

//               <Input
//                 label="Phone Number"
//                 type="tel"
//                 placeholder="08012345678"
//                 autoComplete="tel"
//                 inputMode="numeric"
//                 maxLength={13}
//                 error={errors.phoneNumber?.message}
//                 onInput={handlePhoneInput}
//                 {...register("phoneNumber")}
//               />

//               <Button
//                 type="button"
//                 className="w-full"
//                 onClick={handleNext}
//               >
//                 Next
//               </Button>

//               <Button
//                 type="button"
//                 variant="ghost"
//                 className="w-full"
//                 onClick={handleBack}
//               >
//                 Back
//               </Button>
//             </motion.div>
//           )}

//           {/* ==================================================
//               STEP 3
//               PASSWORD + CONFIRM PASSWORD
//               ================================================== */}

//           {step === 3 && (
//             <motion.div
//               key="step-3"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.25 }}
//               className="space-y-5"
//             >
//               <PasswordInput
//                 label="Password"
//                 placeholder="********"
//                 autoComplete="new-password"
//                 error={errors.password?.message}
//                 {...register("password")}
//               />

//               {/* 
//                 This appears directly under Password while
//                 the password is incomplete.

//                 Once all requirements are satisfied,
//                 PasswordStrength returns null and completely
//                 disappears BEFORE Confirm Password.
//               */}
//               <PasswordStrength password={password} />

//               <PasswordInput
//                 label="Confirm Password"
//                 placeholder="********"
//                 autoComplete="new-password"
//                 error={errors.confirmPassword?.message}
//                 {...register("confirmPassword")}
//               />

//               <Button
//                 type="button"
//                 className="w-full"
//                 onClick={handleNext}
//               >
//                 Next
//               </Button>

//               <Button
//                 type="button"
//                 variant="ghost"
//                 className="w-full"
//                 onClick={handleBack}
//               >
//                 Back
//               </Button>
//             </motion.div>
//           )}

//           {/* ==================================================
//               STEP 4
//               TERMS & CONDITIONS
//               ================================================== */}

//           {step === 4 && (
//             <motion.div
//               key="step-4"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.25 }}
//               className="space-y-5"
//             >
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                 <h3 className="mb-2 text-sm font-semibold text-slate-900">
//                   Almost there!
//                 </h3>

//                 <p className="text-sm leading-6 text-slate-600">
//                   Please review and accept the Terms & Conditions
//                   before creating your account.
//                 </p>
//               </div>

//               <TermsCheckbox
//                 checked={acceptTerms}
//                 onChange={(checked) =>
//                   setValue("acceptTerms", checked, {
//                     shouldValidate: true,
//                     shouldDirty: true,
//                     shouldTouch: true,
//                   })
//                 }
//               />

//               {errors.acceptTerms && (
//                 <p className="text-sm text-red-500">
//                   {errors.acceptTerms.message}
//                 </p>
//               )}

//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={
//                   registerMutation.isPending ||
//                   !acceptTerms
//                 }
//               >
//                 {registerMutation.isPending
//                   ? "Creating Account..."
//                   : "Create Account"}
//               </Button>

//               <Button
//                 type="button"
//                 variant="ghost"
//                 className="w-full"
//                 disabled={registerMutation.isPending}
//                 onClick={handleBack}
//               >
//                 Back
//               </Button>
//             </motion.div>
//           )}
//         </form>
//       </motion.div>

//       <AuthFooter
//         text="Already have an account?"
//         linkText="Login"
//         href="/auth/login"
//       />
//     </AuthCard>
//   );
// }










"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeft, ArrowRight } from "lucide-react";

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
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long")
      .regex(
        /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
        "Please enter a valid first name",
      ),

    lastName: z
      .string()
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
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),

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

/* =========================================================
   PHONE SANITIZER
   ========================================================= */

function sanitizePhoneNumber(value: string): string {
  let sanitized = value.replace(/[^\d+]/g, "");

  if (sanitized.startsWith("+")) {
    sanitized = "+" + sanitized.slice(1).replace(/\+/g, "");
  } else {
    sanitized = sanitized.replace(/\+/g, "");
  }

  return sanitized;
}

/* =========================================================
   STEPS
   ========================================================= */

type RegistrationStep = 1 | 2 | 3 | 4 | 5;

const stepTitles = [
  "Personal Information",
  "Email Address",
  "Phone Number",
  "Create Password",
  "Terms & Conditions",
];

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

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<RegistrationStep>(1);

  /**
   * 1 = moving forward
   * -1 = moving backward
   */
  const [direction, setDirection] = useState(1);

  const [isAnimating, setIsAnimating] = useState(false);

  /* =======================================================
     FORM
     ======================================================= */

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
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

  /* =======================================================
     STEP VALIDATION
     ======================================================= */

  const stepFields: Record<RegistrationStep, (keyof RegisterFormData)[]> = {
    1: ["firstName", "lastName"],
    2: ["email"],
    3: ["phoneNumber"],
    4: ["password", "confirmPassword"],
    5: ["acceptTerms"],
  };

  /* =======================================================
     CHANGE STEP
     ======================================================= */

  const changeStep = (
    nextStep: RegistrationStep,
    slideDirection: number,
  ) => {
    if (isAnimating) return;

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
    if (isAnimating) return;

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
    if (isAnimating) return;

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
    /**
     * Ignore small accidental movements.
     */
    if (Math.abs(offsetX) < 70) return;

    /**
     * Swipe left = next
     */
    if (offsetX < 0) {
      void handleNext();
      return;
    }

    /**
     * Swipe right = back
     */
    if (offsetX > 0) {
      handleBack();
    }
  };

  /* =======================================================
     SUBMIT
     ======================================================= */

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const normalizedData = {
        ...data,

        firstName: data.firstName.trim(),

        lastName: data.lastName.trim(),

        email: data.email.trim().toLowerCase(),

        phoneNumber: sanitizePhoneNumber(data.phoneNumber),
      };

      await registerMutation.mutateAsync(normalizedData);

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(
          normalizedData.email,
        )}`,
      );
    } catch (error: unknown) {
      let message = "Registration failed. Please try again.";

      if (error instanceof Error && error.message) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        message = (error as { message: string }).message;
      }

      alert(message);
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
          {/* ==================================================
              IMAGE
              ================================================== */}

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

          {/* ==================================================
              OPEN FORM BUTTON
              ================================================== */}

          <Button
            type="button"
            onClick={() => {
              setStep(1);
              setDirection(1);
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

      {/* ======================================================
          FORM
          ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          x: 60,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    item <= step
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

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
                  dragConstraints={{
                    left: 0,
                    right: 0,
                  }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) => {
                    handleSwipe(info.offset.x);
                  }}
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
                      {...register("firstName")}
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
                      {...register("lastName")}
                    />

                    {errors.lastName?.message && (
                      <p className="text-sm text-destructive">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  {/* Next */}

                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isAnimating}
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
                  dragConstraints={{
                    left: 0,
                    right: 0,
                  }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) => {
                    handleSwipe(info.offset.x);
                  }}
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
                      {...register("email")}
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
                    disabled={isAnimating}
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
                  dragConstraints={{
                    left: 0,
                    right: 0,
                  }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) => {
                    handleSwipe(info.offset.x);
                  }}
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
                      {...register("phoneNumber", {
                        onChange: (event) => {
                          const sanitized = sanitizePhoneNumber(
                            event.target.value,
                          );

                          setValue("phoneNumber", sanitized, {
                            shouldValidate: true,
                            shouldDirty: true,
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
                    disabled={isAnimating}
                    className="h-12 w-full rounded-xl"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* =================================================
                  STEP 4 — PASSWORD
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
                  dragConstraints={{
                    left: 0,
                    right: 0,
                  }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) => {
                    handleSwipe(info.offset.x);
                  }}
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
                    disabled={isAnimating}
                    className="h-12 w-full rounded-xl"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* =================================================
                  STEP 5 — TERMS
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
                  dragConstraints={{
                    left: 0,
                    right: 0,
                  }}
                  dragElastic={0.2}
                  onDragEnd={(_event, info) => {
                    handleSwipe(info.offset.x);
                  }}
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
                      onChange={(checked) =>
                        setValue("acceptTerms", checked, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        })
                      }
                    />

                    {errors.acceptTerms?.message && (
                      <p className="mt-3 text-sm text-destructive">
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      !acceptTerms ||
                      registerMutation.isPending
                    }
                    className="h-12 w-full rounded-xl"
                  >
                    {registerMutation.isPending
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
            disabled={isAnimating || registerMutation.isPending}
            className="h-10 w-full rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />

            {step === 1 ? "Back to Registration" : "Back"}
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
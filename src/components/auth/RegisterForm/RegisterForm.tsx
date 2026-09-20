



// "use client";

// import { useRouter } from "next/navigation";
// import type { FormEvent } from "react";

// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

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

// /* =====================================================
//    REGISTRATION VALIDATION
//    ===================================================== */

// const registerSchema = z
//   .object({
//     /* -------------------------------------------------
//        FIRST NAME
//        ------------------------------------------------- */

//     firstName: z
//       .string()
//       .trim()
//       .min(
//         2,
//         "First name must be at least 2 characters"
//       )
//       .max(
//         50,
//         "First name must not exceed 50 characters"
//       )
//       .regex(
//         /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
//         "Enter a valid first name"
//       ),

//     /* -------------------------------------------------
//        LAST NAME
//        ------------------------------------------------- */

//     lastName: z
//       .string()
//       .trim()
//       .min(
//         2,
//         "Last name must be at least 2 characters"
//       )
//       .max(
//         50,
//         "Last name must not exceed 50 characters"
//       )
//       .regex(
//         /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
//         "Enter a valid last name"
//       ),

//     /* -------------------------------------------------
//        EMAIL
//        ------------------------------------------------- */

//     email: z
//       .string()
//       .trim()
//       .min(
//         1,
//         "Email is required"
//       )
//       .email(
//         "Enter a valid email address"
//       )
//       .max(
//         254,
//         "Email address is too long"
//       ),

//     /* -------------------------------------------------
//        PHONE NUMBER
       
//        Accepted:
//        08012345678
//        08123456789
//        09012345678
//        09123456789
//        +2348012345678
//        +2349012345678
//        ------------------------------------------------- */

//     phoneNumber: z
//       .string()
//       .trim()
//       .min(
//         1,
//         "Phone number is required"
//       )
//       .regex(
//         /^(?:0|\+234)(?:70|71|80|81|90|91)\d{8}$/,
//         "Enter a valid Nigerian phone number"
//       ),

//     /* -------------------------------------------------
//        PASSWORD
//        ------------------------------------------------- */

//     password: z
//       .string()
//       .min(
//         8,
//         "Password must contain at least 8 characters"
//       )
//       .max(
//         100,
//         "Password must not exceed 100 characters"
//       )
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
//       ),

//     /* -------------------------------------------------
//        CONFIRM PASSWORD
//        ------------------------------------------------- */

//     confirmPassword: z
//       .string()
//       .min(
//         1,
//         "Please confirm your password"
//       ),

//     /* -------------------------------------------------
//        TERMS
//        ------------------------------------------------- */

//     acceptTerms: z
//       .boolean()
//       .refine(
//         (value) => value === true,
//         {
//           message:
//             "You must accept the terms and conditions.",
//         }
//       ),
//   })

//   /* ---------------------------------------------------
//      PASSWORD MATCH
//      --------------------------------------------------- */

//   .refine(
//     (data) =>
//       data.password ===
//       data.confirmPassword,
//     {
//       path: ["confirmPassword"],
//       message:
//         "Passwords do not match",
//     }
//   );

// type RegisterFormData =
//   z.infer<typeof registerSchema>;

// /* =====================================================
//    PHONE INPUT SANITIZER
//    ===================================================== */

// /**
//  * Allows only:
//  *
//  * 0-9
//  * +
//  *
//  * The + character is only allowed as the
//  * first character.
//  *
//  * Examples:
//  *
//  * abc08012345678   -> 08012345678
//  * 080abc12345678   -> 08012345678
//  * +234abc8012345678 -> +2348012345678
//  * 080-123-45678    -> 08012345678
//  */
// function sanitizePhoneNumber(
//   value: string
// ): string {
//   let sanitized = value.replace(
//     /[^\d+]/g,
//     ""
//   );

//   if (sanitized.startsWith("+")) {
//     sanitized =
//       "+" +
//       sanitized
//         .slice(1)
//         .replace(/\+/g, "");
//   } else {
//     sanitized = sanitized.replace(
//       /\+/g,
//       ""
//     );
//   }

//   return sanitized;
// }

// /* =====================================================
//    COMPONENT
//    ===================================================== */

// export default function RegisterForm() {
//   const router = useRouter();

//   const registerMutation = useRegister();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<RegisterFormData>({
//     resolver:
//       zodResolver(registerSchema),

//     /* -------------------------------------------------
//        Validate fields when the user leaves them.
//        ------------------------------------------------- */

//     mode: "onBlur",

//     /* -------------------------------------------------
//        Once an error exists, validate again while
//        the user corrects the field.
//        ------------------------------------------------- */

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

//   const acceptTerms =
//     watch("acceptTerms");

//   /* ===================================================
//      PHONE INPUT HANDLER
//      =================================================== */

//   const handlePhoneInput = (
//     event: FormEvent<HTMLInputElement>
//   ) => {
//     const input = event.currentTarget;

//     const sanitizedValue =
//       sanitizePhoneNumber(
//         input.value
//       );


//     if (
//       input.value !==
//       sanitizedValue
//     ) {
//       input.value = sanitizedValue;
//     }

//     setValue(
//       "phoneNumber",
//       sanitizedValue,
//       {
//         shouldDirty: true,
//         shouldTouch: true,
//       }
//     );
//   };

//   /* ===================================================
//      SUBMIT
//      =================================================== */

//   const onSubmit = async (
//     data: RegisterFormData
//   ) => {
//     try {
//            const normalizedData = {
//         ...data,

//         firstName:
//           data.firstName.trim(),

//         lastName:
//           data.lastName.trim(),

//         email:
//           data.email
//             .trim()
//             .toLowerCase(),

//         phoneNumber:
//           sanitizePhoneNumber(
//             data.phoneNumber
//           ),
//       };

//       await registerMutation.mutateAsync(
//         normalizedData
//       );

//       router.push(
//         `/auth/verify-email?email=${encodeURIComponent(
//           normalizedData.email
//         )}`
//       );
//     } catch (error: any) {
//       console.error(
//         "Registration error:",
//         error
//       );

//       alert(
//         error?.response?.data?.message ??
//           "Registration failed. Please try again."
//       );
//     }
//   };

//   /* ===================================================
//      RENDER
//      =================================================== */

//   return (
//     <AuthCard>
//       <AuthHeader
//         title="Create Account"
//         subtitle="Join Learnyfi today"
//       />

//       <motion.form
//         initial={{
//           opacity: 0,
//           y: 20,
//         }}
//         animate={{
//           opacity: 1,
//           y: 0,
//         }}
//         transition={{
//           duration: 0.4,
//         }}
//         onSubmit={handleSubmit(
//           onSubmit
//         )}
//         className="space-y-5"
//         noValidate
//       >
//         {/* =================================================
//             FIRST NAME / LAST NAME
//             ================================================= */}

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <Input
//             label="First Name"
//             placeholder="John"
//             autoComplete="given-name"
//             error={
//               errors.firstName?.message
//             }
//             {...register("firstName")}
//           />

//           <Input
//             label="Last Name"
//             placeholder="Doe"
//             autoComplete="family-name"
//             error={
//               errors.lastName?.message
//             }
//             {...register("lastName")}
//           />
//         </div>

//         {/* =================================================
//             EMAIL
//             ================================================= */}

//         <Input
//           label="Email"
//           type="email"
//           placeholder="example@email.com"
//           autoComplete="email"
//           error={errors.email?.message}
//           {...register("email")}
//         />

//         {/* =================================================
//             PHONE NUMBER
//             ================================================= */}

//         <Input
//           label="Phone Number"
//           type="tel"
//           placeholder="08012345678"
//           autoComplete="tel"
//           inputMode="numeric"
//           maxLength={13}
//           error={
//             errors.phoneNumber?.message
//           }
//           onInput={handlePhoneInput}
//           {...register("phoneNumber")}
//         />

//         {/* =================================================
//             PASSWORD
//             ================================================= */}

//         <PasswordInput
//           label="Password"
//           placeholder="********"
//           autoComplete="new-password"
//           error={
//             errors.password?.message
//           }
//           {...register("password")}
//         />

//         <PasswordStrength
//           password={password}
//         />

//         {/* =================================================
//             CONFIRM PASSWORD
//             ================================================= */}

//         <PasswordInput
//           label="Confirm Password"
//           placeholder="********"
//           autoComplete="new-password"
//           error={
//             errors.confirmPassword
//               ?.message
//           }
//           {...register(
//             "confirmPassword"
//           )}
//         />

// {/* =================================================
//     TERMS
//     ================================================= */}

// <TermsCheckbox
//   checked={acceptTerms}
//   onChange={(checked) =>
//     setValue(
//       "acceptTerms",
//       checked,
//       {
//         shouldValidate: true,
//         shouldDirty: true,
//         shouldTouch: true,
//       }
//     )
//   }
// />

// {errors.acceptTerms && (
//   <p className="text-sm text-red-500">
//     {errors.acceptTerms.message}
//   </p>
// )}

// {/* =================================================
//     SUBMIT
//     -------------------------------------------------
//     Create Account is only shown after the user
//     accepts the terms and conditions.
//     ================================================= */}

// {acceptTerms && (
//   <Button
//     type="submit"
//     className="w-full"
//     disabled={registerMutation.isPending}
//   >
//     {registerMutation.isPending
//       ? "Creating Account..."
//       : "Create Account"}
//   </Button>
// )}
//       </motion.form>




//       {/* =================================================
//           SOCIAL LOGIN
//           ================================================= */}

//       {/* <Divider />

//       <SocialLogin /> */}

//       {/* =================================================
//           LOGIN LINK
//           ================================================= */}

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
import type { FormEvent } from "react";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRegister } from "@/hooks";

import {
  AuthCard,
  AuthHeader,
  AuthFooter,
  PasswordInput,
} from "@/components/auth";

import PasswordStrength from "./PasswordStrength";
import TermsCheckbox from "./TermsCheckbox";

import { ArrowRight } from "lucide-react";

/* ============================================================
   VALIDATION SCHEMA
   ============================================================ */

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .regex(
        /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
        "Enter a valid first name"
      ),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .regex(
        /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
        "Enter a valid last name"
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address")
      .max(254, "Email address is too long"),

    phoneNumber: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(
        /^(?:0|\+234)(?:70|71|80|81|90|91)\d{8}$/,
        "Enter a valid Nigerian phone number"
      ),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /\d/,
        "Password must contain at least one number"
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

    acceptTerms: z
      .boolean()
      .refine((value) => value === true, {
        message: "You must accept the terms and conditions.",
      }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

/* ============================================================
   PHONE SANITIZER
   ============================================================ */

function sanitizePhoneNumber(value: string): string {
  let sanitized = value.replace(/[^\d+]/g, "");

  if (sanitized.startsWith("+")) {
    sanitized =
      "+" +
      sanitized.slice(1).replace(/\+/g, "");
  } else {
    sanitized = sanitized.replace(/\+/g, "");
  }

  return sanitized;
}

/* ============================================================
   STEP TYPES
   ============================================================ */

type RegistrationStep = 1 | 2 | 3 | 4;

const stepTitles = [
  "Personal Information",
  "Contact Information",
  "Create Password",
  "Terms & Conditions",
];

/* ============================================================
   COMPONENT
   ============================================================ */

export default function RegisterForm() {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<RegistrationStep>(1);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
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

  /* ============================================================
     PHONE INPUT
     ============================================================ */

  const handlePhoneInput = (
    event: FormEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;

    const sanitizedValue = sanitizePhoneNumber(input.value);

    if (input.value !== sanitizedValue) {
      input.value = sanitizedValue;
    }

    setValue("phoneNumber", sanitizedValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  /* ============================================================
     NEXT STEP
     ============================================================ */

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger([
        "firstName",
        "lastName",
      ]);

      if (!isValid) {
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      const isValid = await trigger([
        "email",
        "phoneNumber",
      ]);

      if (!isValid) {
        return;
      }

      setStep(3);
      return;
    }

    if (step === 3) {
      const isValid = await trigger([
        "password",
        "confirmPassword",
      ]);

      if (!isValid) {
        return;
      }

      setStep(4);
    }
  };

  /* ============================================================
     BACK
     ============================================================ */

  const handleBack = () => {
    if (step === 1) {
      setShowForm(false);
      return;
    }

    setStep((currentStep) =>
      (currentStep - 1) as RegistrationStep
    );
  };

  /* ============================================================
     SUBMIT
     ============================================================ */

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
          normalizedData.email
        )}`
      );
    } catch (error: any) {
      console.error("Registration error:", error);

      alert(
        error?.response?.data?.message ??
          "Registration failed. Please try again."
      );
    }
  };

  /* ============================================================
     INITIAL SCREEN
     ============================================================ */

  if (!showForm) {
    return (
      <AuthCard>
        <AuthHeader
          title="Create Account"
          subtitle="Join Learnyfi today — just 4 simple steps!"
          
        />

       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="space-y-5 pt-4"
>
  <Button
    type="button"
    className="
      activate-learning-button
      mt-6
      flex
      w-full
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-blue-500
      px-5
      py-3.5
      text-sm
      font-bold
      text-white
      shadow-lg
      shadow-blue-950/30
      transition
      hover:bg-blue-400
      active:scale-[0.98]
    "
    onClick={() => {
      setStep(1);
      setShowForm(true);
    }}
  >
    Click Registration Form
    <ArrowRight className="h-4 w-4" />
  </Button>
</motion.div>

        <AuthFooter
          text="Already have an account?"
          linkText="Login"
          href="/auth/login"
        />
      </AuthCard>
    );
  }

  /* ============================================================
     REGISTRATION FORM
     ============================================================ */

  return (
    <AuthCard>
      <AuthHeader
        title="Create Account"
        subtitle="Join Learnyfi today"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* ==================================================
            STEP INDICATOR
            ================================================== */}

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Step {step} of 4
              </p>

              <p className="text-xs text-slate-500">
                {stepTitles[step - 1]}
              </p>
            </div>

            <p className="text-xs font-medium text-slate-500">
              {Math.round((step / 4) * 100)}%
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{
                width: `${(step / 4) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* ==================================================
              STEP 1
              FIRST NAME + LAST NAME
              ================================================== */}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="First Name"
                  placeholder="John"
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />

                <Input
                  label="Last Name"
                  placeholder="Doe"
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={handleNext}
              >
                Next
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBack}
              >
                Back
              </Button>
            </motion.div>
          )}

          {/* ==================================================
              STEP 2
              EMAIL + PHONE NUMBER
              ================================================== */}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <Input
                label="Email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="08012345678"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={13}
                error={errors.phoneNumber?.message}
                onInput={handlePhoneInput}
                {...register("phoneNumber")}
              />

              <Button
                type="button"
                className="w-full"
                onClick={handleNext}
              >
                Next
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBack}
              >
                Back
              </Button>
            </motion.div>
          )}

          {/* ==================================================
              STEP 3
              PASSWORD + CONFIRM PASSWORD
              ================================================== */}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <PasswordInput
                label="Password"
                placeholder="********"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />

              {/* 
                This appears directly under Password while
                the password is incomplete.

                Once all requirements are satisfied,
                PasswordStrength returns null and completely
                disappears BEFORE Confirm Password.
              */}
              <PasswordStrength password={password} />

              <PasswordInput
                label="Confirm Password"
                placeholder="********"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button
                type="button"
                className="w-full"
                onClick={handleNext}
              >
                Next
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleBack}
              >
                Back
              </Button>
            </motion.div>
          )}

          {/* ==================================================
              STEP 4
              TERMS & CONDITIONS
              ================================================== */}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Almost there!
                </h3>

                <p className="text-sm leading-6 text-slate-600">
                  Please review and accept the Terms & Conditions
                  before creating your account.
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

              {errors.acceptTerms && (
                <p className="text-sm text-red-500">
                  {errors.acceptTerms.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  registerMutation.isPending ||
                  !acceptTerms
                }
              >
                {registerMutation.isPending
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={registerMutation.isPending}
                onClick={handleBack}
              >
                Back
              </Button>
            </motion.div>
          )}
        </form>
      </motion.div>

      <AuthFooter
        text="Already have an account?"
        linkText="Login"
        href="/auth/login"
      />
    </AuthCard>
  );
}
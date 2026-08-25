"use client";

import { useRouter } from "next/navigation";

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
  Divider,
  PasswordInput,
  SocialLogin,
} from "@/components/auth";

import PasswordStrength from "./PasswordStrength";
import TermsCheckbox from "./TermsCheckbox";

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name is required"),

    lastName: z
      .string()
      .min(2, "Last name is required"),

    email: z
      .string()
      .email("Enter a valid email"),

    phoneNumber: z
      .string()
      .min(10, "Phone number is required"),

    password: z
      .string()
      .min(
        8,
        "Password must contain at least 8 characters"
      ),

    confirmPassword: z.string(),

    acceptTerms: z.literal(true, {
      message:
        "You must accept the terms and conditions.",
    }),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message:
        "Passwords do not match",
    }
  );

type RegisterFormData = z.infer<
  typeof registerSchema
>;

export default function RegisterForm() {
  const router = useRouter();

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } =
    useForm<RegisterFormData>({
      resolver:
        zodResolver(registerSchema),

      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false as true,
      },
    });

  const password = watch("password");

  const acceptTerms =
    watch("acceptTerms");

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      await registerMutation.mutateAsync( data);

  router.push(
  `/auth/verify-email?email=${encodeURIComponent(data.email)}`
);

    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ??
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Create Account"
        subtitle="Join KLAZIK Learning today"
      />

      <motion.form
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="First Name"
            placeholder="John"
            error={
              errors.firstName
                ?.message
            }
            {...register(
              "firstName"
            )}
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            error={
              errors.lastName
                ?.message
            }
            {...register(
              "lastName"
            )}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          error={
            errors.email?.message
          }
          {...register("email")}
        />

        <Input
          label="Phone Number"
          placeholder="+234..."
          error={
            errors.phoneNumber
              ?.message
          }
          {...register(
            "phoneNumber"
          )}
        />

        <PasswordInput
          label="Password"
          placeholder="********"
          error={
            errors.password
              ?.message
          }
          {...register(
            "password"
          )}
        />

        <PasswordStrength
          password={password}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="********"
          error={
            errors
              .confirmPassword
              ?.message
          }
          {...register(
            "confirmPassword"
          )}
        />

        <TermsCheckbox
          checked={acceptTerms}
          onChange={(
            checked
          ) =>
            setValue(
              "acceptTerms",
              checked as true,
              {
                shouldValidate: true,
              }
            )
          }
        />

        {errors.acceptTerms && (
          <p className="text-sm text-red-500">
            {
              errors.acceptTerms
                .message
            }
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={
            registerMutation.isPending
          }
        >
          {registerMutation.isPending
            ? "Creating Account..."
            : "Create Account"}
        </Button>
      </motion.form>

      <Divider />

      <SocialLogin />

      <AuthFooter
        text="Already have an account?"
        linkText="Login"
        href="/auth/login"
      />
    </AuthCard>
  );
}








"use client";

import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AuthCard,
  AuthHeader,
} from "@/components/auth";

import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { useResendVerificationEmail } from "@/hooks/auth/useResendVerificationEmail";

const verifyEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .length(
      6,
      "Verification code must be 6 digits"
    )
    .regex(
      /^\d{6}$/,
      "Verification code must contain only numbers"
    ),
});

type VerifyEmailFormData =
  z.infer<typeof verifyEmailSchema>;

export default function VerifyEmail() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const userEmail =
    searchParams.get("email") ?? "";

  const verifyEmailMutation =
    useVerifyEmail();

  const resendVerificationMutation =
    useResendVerificationEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } =
    useForm<VerifyEmailFormData>({
      resolver:
        zodResolver(
          verifyEmailSchema
        ),

      defaultValues: {
        code: "",
      },
    });

  const onSubmit = async (
    data: VerifyEmailFormData
  ) => {
    try {
      await verifyEmailMutation.mutateAsync(
        data.code
      );

      /**
       * Redirect after successful verification
       */

      router.push("/auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleResend = async () => {
    if (!userEmail) {
      alert(
        "Email address not found. Please register again."
      );

      router.push("/auth/register");

      return;
    }

    try {
      await resendVerificationMutation.mutateAsync(
        {
          email: userEmail,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Verify Your Email"
        subtitle={
          userEmail
            ? `We've sent a 6-digit verification code to ${userEmail}. Enter it below to activate your account.`
            : "Enter the 6-digit verification code sent to your email."
        }
      />

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-6"
      >
        <Input
          label="Verification Code"
          placeholder="Enter 6-digit code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          {...register("code")}
          error={
            errors.code?.message
          }
        />

        {verifyEmailMutation.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-600">
              {verifyEmailMutation
                .error?.message ??
                "Verification failed. Please try again."}
            </p>
          </div>
        )}

        {verifyEmailMutation.isSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">
              {verifyEmailMutation
                .data?.message ??
                "Email verified successfully."}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={
            verifyEmailMutation.isPending
          }
        >
          {verifyEmailMutation.isPending
            ? "Verifying..."
            : "Verify Email"}
        </Button>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 text-center">
        <p className="text-sm text-slate-600">
          Didn't receive the verification code?
        </p>

        <Button
          type="button"
          variant="ghost"
          onClick={handleResend}
          disabled={
            resendVerificationMutation.isPending
          }
          className="mt-2"
        >
          {resendVerificationMutation.isPending
            ? "Sending..."
            : "Resend Code"}
        </Button>

        {resendVerificationMutation.isSuccess && (
          <p className="mt-3 text-sm font-medium text-green-600">
            {
              resendVerificationMutation
                .data?.message
            }
          </p>
        )}

        {resendVerificationMutation.isError && (
          <p className="mt-3 text-sm font-medium text-red-600">
            {resendVerificationMutation
              .error?.message ??
              "Unable to resend verification email."}
          </p>
        )}
      </div>
    </AuthCard>
  );
}



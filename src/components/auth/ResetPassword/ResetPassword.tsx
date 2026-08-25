




"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  AuthCard,
  AuthHeader,
  AuthFooter,
  PasswordInput,
} from "@/components/auth";



const resetPasswordSchema = z
  .object({

    password: z
      .string()
      .min(
        8,
        "Password must contain at least 8 characters"
      ),


    confirmPassword: z.string(),

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




type ResetPasswordFormData =
  z.infer<typeof resetPasswordSchema>;





export default function ResetPassword() {


  const [loading, setLoading] =
    useState(false);





  const {

    handleSubmit,

    register,

    formState: { errors },

  } =

    useForm<ResetPasswordFormData>({

      resolver:
        zodResolver(
          resetPasswordSchema
        ),


      defaultValues: {

        password: "",

        confirmPassword: "",

      },

    });







  const onSubmit = async (

    data: ResetPasswordFormData

  ) => {


    try {


      setLoading(true);



      console.log(data);



      /**
       * Example:
       *
       * await resetPasswordMutation.mutateAsync(data);
       */



      await new Promise((resolve) =>

        setTimeout(resolve, 1500)

      );



    } finally {


      setLoading(false);


    }


  };







  return (

    <AuthCard>



      <AuthHeader

        title="Reset Password"

        subtitle="Create a new password for your account"

      />







      <form

        onSubmit={
          handleSubmit(onSubmit)
        }

        className="space-y-5"

      >






        <PasswordInput

          label="New Password"

          placeholder="********"

          {...register("password")}

          error={
            errors.password?.message
          }

        />







        <PasswordInput

          label="Confirm Password"

          placeholder="********"

          {...register("confirmPassword")}

          error={
            errors.confirmPassword?.message
          }

        />







        <Button

          type="submit"

          disabled={loading}

          className="w-full"

        >


          {
            loading
              ? "Updating..."
              : "Reset Password"
          }


        </Button>






      </form>







      <AuthFooter


        text="Remember your password?"

        linkText="Login"

        href="/login"


      />





    </AuthCard>

  );

}
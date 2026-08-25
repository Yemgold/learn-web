




// "use client";

// import { useRouter } from "next/navigation";

// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   AuthCard,
//   AuthFooter,
//   AuthHeader,
// } from "@/components/auth";

// import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

// const forgotPasswordSchema = z.object({
//   email: z
//     .string()
//     .min(1, "Email is required")
//     .email("Enter a valid email address"),
// });

// type ForgotPasswordFormData =
//   z.infer<typeof forgotPasswordSchema>;

// export default function ForgotPassword() {
//   const router = useRouter();

//   const forgotPasswordMutation =
//     useForgotPassword();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } =
//     useForm<ForgotPasswordFormData>({
//       resolver: zodResolver(
//         forgotPasswordSchema
//       ),

//       defaultValues: {
//         email: "",
//       },
//     });

//   const onSubmit = async (
//     data: ForgotPasswordFormData
//   ) => {
//     try {
//       await forgotPasswordMutation.mutateAsync({
//         email: data.email,
//       });

//       /**
//        * Redirect to Reset Password page
//        * carrying the email.
//        */

//       router.push(
//         `/auth/reset-password?email=${encodeURIComponent(
//           data.email
//         )}`
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <AuthCard>
//       <AuthHeader
//         title="Forgot Password?"
//         subtitle="Enter your email address and we'll send you a password reset code."
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
//           delay: 0.2,
//         }}
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-6"
//       >
//         <Input
//           label="Email Address"
//           type="email"
//           placeholder="Enter your email"
//           autoComplete="email"
//           error={errors.email?.message}
//           {...register("email")}
//         />

//         {forgotPasswordMutation.isSuccess && (
//           <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
//             <p className="text-sm font-medium text-green-700">
//               {
//                 forgotPasswordMutation.data
//                   ?.message
//               }
//             </p>
//           </div>
//         )}

//         {forgotPasswordMutation.isError && (
//           <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
//             <p className="text-sm font-medium text-red-600">
//               {forgotPasswordMutation
//                 .error?.message ??
//                 "Unable to process your request."}
//             </p>
//           </div>
//         )}

//         <Button
//           type="submit"
//           size="lg"
//           className="w-full"
//           disabled={
//             forgotPasswordMutation.isPending
//           }
//         >
//           {forgotPasswordMutation.isPending
//             ? "Sending Reset Link..."
//             : "Send Reset Link"}
//         </Button>
//       </motion.form>

//       {/* Helper Text */}

//       <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
//         <h3 className="font-semibold text-slate-900">
//           Didn't receive the email?
//         </h3>

//         <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
//           <li>
//             • Check your spam or junk folder.
//           </li>

//           <li>
//             • Make sure you entered the
//             correct email address.
//           </li>

//           <li>
//             • Wait a few minutes before
//             requesting another reset code.
//           </li>
//         </ul>
//       </div>

//       <AuthFooter
//         text="Remember your password?"
//         linkText="Back to Login"
//         href="/auth/login"
//       />
//     </AuthCard>
//   );
// }




"use client";

export default function ForgotPassword() {
  return (
    <div>
      Forgot Password
    </div>
  );
}
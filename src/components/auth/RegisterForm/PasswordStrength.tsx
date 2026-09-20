








// "use client";

// import {
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// interface PasswordStrengthProps {
//   password: string;
// }

// export default function PasswordStrength({
//   password,
// }: PasswordStrengthProps) {
//   const rules = [
//     {
//       label: "At least 8 characters",
//       valid: password.length >= 8,
//     },
//     {
//       label: "One uppercase letter",
//       valid: /[A-Z]/.test(password),
//     },
//     {
//       label: "One lowercase letter",
//       valid: /[a-z]/.test(password),
//     },
//     {
//       label: "One number",
//       valid: /\d/.test(password),
//     },
//     {
//       label: "One special character",
//       valid:
//         /[!@#$%^&*(),.?":{}|<>]/.test(password),
//     },
//   ];

//   const score = rules.filter(
//     (rule) => rule.valid
//   ).length;

//   const percentage = (score / rules.length) * 100;

//   const getStrength = () => {
//     if (score <= 1)
//       return {
//         label: "Very Weak",
//         color: "bg-red-500",
//         text: "text-red-600",
//       };

//     if (score === 2)
//       return {
//         label: "Weak",
//         color: "bg-orange-500",
//         text: "text-orange-600",
//       };

//     if (score === 3)
//       return {
//         label: "Good",
//         color: "bg-yellow-500",
//         text: "text-yellow-600",
//       };

//     if (score === 4)
//       return {
//         label: "Strong",
//         color: "bg-blue-600",
//         text: "text-blue-600",
//       };

//     return {
//       label: "Excellent",
//       color: "bg-green-600",
//       text: "text-green-600",
//     };
//   };

//   const strength = getStrength();

//   if (!password) return null;

//   return (
//     <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
//       {/* Header */}

//       <div className="mb-3 flex items-center justify-between">
//         <span className="text-sm font-semibold text-slate-700">
//           Password Strength
//         </span>

//         <span
//           className={`text-sm font-bold ${strength.text}`}
//         >
//           {strength.label}
//         </span>
//       </div>

//       {/* Progress */}

//       <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200">
//         <div
//           className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
//           style={{
//             width: `${percentage}%`,
//           }}
//         />
//       </div>

//       {/* Requirements */}

//       <div className="space-y-3">
//         {rules.map((rule) => (
//           <div
//             key={rule.label}
//             className="flex items-center gap-3"
//           >
//             {rule.valid ? (
//               <CheckCircle2
//                 size={18}
//                 className="text-green-600"
//               />
//             ) : (
//               <XCircle
//                 size={18}
//                 className="text-slate-400"
//               />
//             )}

//             <span
//               className={`text-sm ${
//                 rule.valid
//                   ? "text-slate-900"
//                   : "text-slate-500"
//               }`}
//             >
//               {rule.label}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




















"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({
  password,
}: PasswordStrengthProps) {
  const requirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "One number",
      met: /\d/.test(password),
    },
    {
      label: "One special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const allRequirementsMet = requirements.every(
    (requirement) => requirement.met
  );

  /*
   * Don't show anything before the user starts typing.
   */
  if (!password) {
    return null;
  }

  /*
   * Once all password requirements are satisfied,
   * hide this entire component so it disappears
   * before Confirm Password.
   */
  if (allRequirementsMet) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">
          Password Strength Requirements
        </p>

        <div className="space-y-2">
          {requirements.map((requirement) => (
            <div
              key={requirement.label}
              className="flex items-center gap-2"
            >
              {requirement.met ? (
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <Circle
                  className="h-4 w-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
              )}

              <span
                className={`text-sm ${
                  requirement.met
                    ? "text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                {requirement.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
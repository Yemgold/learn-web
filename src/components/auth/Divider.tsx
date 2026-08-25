



// "use client";

// import { motion } from "framer-motion";

// interface DividerProps {
//   text?: string;
//   className?: string;
// }

// export default function Divider({
//   text = "or",
//   className = "",
// }: DividerProps) {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         scaleX: 0.95,
//       }}
//       animate={{
//         opacity: 1,
//         scaleX: 1,
//       }}
//       transition={{
//         duration: 0.35,
//       }}
//       className={`relative my-8 ${className}`}
//     >
//       {/* Line */}

//       <div className="absolute inset-0 flex items-center">
//         <div className="w-full border-t border-slate-200" />
//       </div>

//       {/* Text */}

//       <div className="relative flex justify-center">
//         <span className="rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-slate-500 shadow-sm">
//           {text}
//         </span>
//       </div>
//     </motion.div>
//   );
// }







"use client";

import { motion } from "framer-motion";

interface DividerProps {
  text?: string;
  className?: string;
}

export default function Divider({
  text = "or",
  className = "",
}: DividerProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scaleX: 0.96,
      }}
      animate={{
        opacity: 1,
        scaleX: 1,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`relative my-4 ${className}`}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>

      <div className="relative flex justify-center">
        <span
          className="
            rounded-full
            border
            border-slate-200
            bg-white
            px-3
            py-0.5
            text-xs
            font-medium
            text-slate-500
          "
        >
          {text}
        </span>
      </div>
    </motion.div>
  );
}
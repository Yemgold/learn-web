


import type { EmptyStateProps } from "@/types/schools/enrollment.types"; 

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
      <div className="mb-4 rounded-2xl bg-gray-100 p-4 text-gray-400">
        {icon}
      </div>

      <h3 className="font-semibold text-gray-900">{title}</h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}










// import { ReactNode } from "react";
// import { Inbox, Plus } from "lucide-react";

// type EmptyStateProps = {
//   title?: string;
//   description?: string;
//   icon?: ReactNode;
//   actionLabel?: string;
//   onAction?: () => void;
//   secondaryActionLabel?: string;
//   onSecondaryAction?: () => void;
//   className?: string;
//   size?: "sm" | "md" | "lg";
// };

// const sizeStyles = {
//   sm: {
//     container: "py-8",
//     icon: "h-12 w-12",
//     iconSize: 22,
//     title: "text-sm",
//     description: "text-xs",
//   },
//   md: {
//     container: "py-12",
//     icon: "h-16 w-16",
//     iconSize: 28,
//     title: "text-base",
//     description: "text-sm",
//   },
//   lg: {
//     container: "py-16",
//     icon: "h-20 w-20",
//     iconSize: 34,
//     title: "text-lg",
//     description: "text-sm",
//   },
// };

// export default function EmptyState({
//   title = "No records found",
//   description = "There is nothing to display here yet.",
//   icon,
//   actionLabel,
//   onAction,
//   secondaryActionLabel,
//   onSecondaryAction,
//   className = "",
//   size = "md",
// }: EmptyStateProps) {
//   const styles = sizeStyles[size];

//   return (
//     <div
//       className={`flex w-full flex-col items-center justify-center px-4 text-center ${styles.container} ${className}`}
//     >
//       <div
//         className={`mb-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 ${styles.icon}`}
//       >
//         {icon ?? <Inbox size={styles.iconSize} strokeWidth={1.6} />}
//       </div>

//       <h3 className={`font-semibold text-gray-900 ${styles.title}`}>
//         {title}
//       </h3>

//       <p className={`mt-2 max-w-md leading-6 text-gray-500 ${styles.description}`}>
//         {description}
//       </p>

//       {(actionLabel || secondaryActionLabel) && (
//         <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
//           {actionLabel && onAction && (
//             <button
//               type="button"
//               onClick={onAction}
//               className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               <Plus size={16} />
//               {actionLabel}
//             </button>
//           )}

//           {secondaryActionLabel && onSecondaryAction && (
//             <button
//               type="button"
//               onClick={onSecondaryAction}
//               className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               {secondaryActionLabel}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

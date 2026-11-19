








import type { EnrollmentFormFieldProps } from "@/types/schools/enrollment.types"; 

export default function FormField({
  label,
  required,
  children,
}: EnrollmentFormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {children}
    </label>
  );
}

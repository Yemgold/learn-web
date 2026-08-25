




"use client";

interface TermsCheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export default function TermsCheckbox({
  checked,
  onChange,
}: TermsCheckboxProps) {
  return (
    <label className="flex items-center gap-3 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange?.(e.target.checked)
        }
        className="h-4 w-4"
      />

      <span>
        I agree to the terms and conditions
      </span>
    </label>
  );
}
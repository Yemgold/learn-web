




"use client";

interface RememberMeProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export default function RememberMe({
  checked,
  onCheckedChange,
  label = "Remember me",
}: RememberMeProps) {
  return (
    <label className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/40">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) =>
              onCheckedChange(e.target.checked)
            }
            className="
              peer
              h-5
              w-5
              cursor-pointer
              appearance-none
              rounded-md
              border-2
              border-slate-300
              bg-white
              transition-all
              duration-200
              checked:border-blue-600
              checked:bg-blue-600
              focus:ring-4
              focus:ring-blue-100
            "
          />

          {/* Checkmark */}

          <svg
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-3
              w-3
              -translate-x-1/2
              -translate-y-1/2
              text-white
              opacity-0
              transition-opacity
              duration-200
              peer-checked:opacity-100
            "
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.5 8.5L6.5 11.5L12.5 5.5" />
          </svg>
        </div>

        <span className="select-none text-sm font-medium text-slate-700">
          {label}
        </span>
      </div>

      <span className="text-xs text-slate-400">
        30 days
      </span>
    </label>
  );
}
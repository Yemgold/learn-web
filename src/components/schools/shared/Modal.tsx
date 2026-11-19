






import { X } from "lucide-react";
import type { ModalProps } from "@/types/schools/enrollment.types";

export default function Modal({
  title,
  description,
  onClose,
  children,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

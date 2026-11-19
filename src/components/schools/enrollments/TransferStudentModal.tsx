




import type { TransferStudentModalProps } from "@/types/schools/enrollment.types"; 
import { getStudentName } from "@/lib/schools/utils/enrollment.utils"; 

import { getObjectId } from "@/lib/schools/utils/enrollment.utils"; 

import Modal from "../shared/Modal";
import FormField from "../shared/FormField";
import ModalActions from "../shared/ModalActions";

export default function TransferStudentModal({
  open,
  submitting,
  optionsLoading,
  enrollment,
  classes,
  targetClassId,
  onTargetClassChange,
  onSubmit,
  onClose,
}: TransferStudentModalProps) {
  if (!open || !enrollment) return null;

  const studentName = getStudentName(enrollment);

  const currentClassId = getObjectId(enrollment.classId);

  const availableClasses = classes.filter((schoolClass) => {
    const optionId =
      schoolClass._id ||
      schoolClass.id ||
      schoolClass.classId ||
      "";

    return optionId !== currentClassId;
  });

  return (
    <Modal
      title="Transfer Student"
      description={`Transfer ${studentName} to another class.`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Selected student</p>
          <p className="mt-1 font-semibold text-gray-900">
            {studentName}
          </p>
        </div>

        <FormField label="Destination Class" required>
          <select
            value={targetClassId}
            onChange={(event) =>
              onTargetClassChange(event.target.value)
            }
            required
            disabled={optionsLoading || availableClasses.length === 0}
            className="form-input"
          >
            <option value="">
              {optionsLoading
                ? "Loading classes..."
                : availableClasses.length === 0
                  ? "No other active classes available"
                  : "Select destination class"}
            </option>

            {availableClasses.map((schoolClass) => {
              const actualClassId =
                schoolClass._id ||
                schoolClass.id ||
                schoolClass.classId ||
                "";

              return (
                <option key={actualClassId} value={actualClassId}>
                  {schoolClass.name}
                  {schoolClass.arm ? ` - ${schoolClass.arm}` : ""}
                </option>
              );
            })}
          </select>
        </FormField>

        <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          Confirm that the destination class belongs to this school before transferring the student.
        </div>

        <ModalActions
          submitting={submitting}
          submitLabel="Transfer Student"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}

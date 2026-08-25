




import * as React from "react";

export interface UseControllableStateOptions<T> {
  /**
   * Controlled value.
   */
  value?: T;

  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: T;

  /**
   * Called whenever the value changes.
   */
  onChange?: (value: T) => void;
}

/**
 * A hook that supports both controlled and uncontrolled state.
 *
 * Similar to Radix UI's useControllableState.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<T | undefined>(defaultValue);

  const isControlled = value !== undefined;

  const currentValue = isControlled
    ? value
    : uncontrolledValue;

  const setValue = React.useCallback(
    (next: React.SetStateAction<T | undefined>) => {
      const resolvedValue =
        typeof next === "function"
          ? (next as (prev: T | undefined) => T | undefined)(
              currentValue
            )
          : next;

      if (!isControlled) {
        setUncontrolledValue(resolvedValue);
      }

      if (
        resolvedValue !== undefined &&
        resolvedValue !== currentValue
      ) {
        onChange?.(resolvedValue);
      }
    },
    [currentValue, isControlled, onChange]
  );

  return [
    currentValue,
    setValue,
  ] as const;
}
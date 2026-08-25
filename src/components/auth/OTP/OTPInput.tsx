




"use client";

import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OTPInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  autoFocus = true,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(
    Array(length).fill("")
  );

  const inputsRef = useRef<
    Array<HTMLInputElement | null>
  >([]);

  useEffect(() => {
    const values = value
      .split("")
      .slice(0, length);

    setOtp([
      ...values,
      ...Array(length - values.length).fill(""),
    ]);
  }, [value, length]);

  useEffect(() => {
    if (
      autoFocus &&
      inputsRef.current[0]
    ) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  const updateOTP = (
    values: string[]
  ) => {
    setOtp(values);

    onChange?.(values.join(""));
  };

  const handleChange = (
    index: number,
    input: string
  ) => {
    if (!/^\d*$/.test(input)) return;

    const digit = input.slice(-1);

    const values = [...otp];

    values[index] = digit;

    updateOTP(values);

    if (
      digit &&
      index < length - 1
    ) {
      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace"
    ) {
      e.preventDefault();

      const values = [...otp];

      if (values[index]) {
        values[index] = "";
      } else if (index > 0) {
        values[index - 1] = "";

        inputsRef.current[
          index - 1
        ]?.focus();
      }

      updateOTP(values);
    }

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      inputsRef.current[
        index - 1
      ]?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      index < length - 1
    ) {
      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  const handlePaste = (
    e: ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted =
      e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);

    if (!pasted) return;

    const values = Array(length)
      .fill("")
      .map(
        (_, i) =>
          pasted[i] || ""
      );

    updateOTP(values);

    const next =
      Math.min(
        pasted.length,
        length - 1
      );

    inputsRef.current[next]?.focus();
  };

  return (
    <div className="flex justify-center gap-3">
      {otp.map(
        (digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[
                index
              ] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={digit}
            onChange={(e) =>
              handleChange(
                index,
                e.target.value
              )
            }
            onKeyDown={(e) =>
              handleKeyDown(
                index,
                e
              )
            }
            onPaste={handlePaste}
            className="
              h-16
              w-14
              rounded-2xl
              border
              border-slate-300
              bg-white
              text-center
              text-2xl
              font-bold
              text-slate-900
              outline-none
              transition-all
              duration-300
              focus:border-blue-600
              focus:ring-4
              focus:ring-blue-100
              disabled:cursor-not-allowed
              disabled:bg-slate-100
            "
          />
        )
      )}
    </div>
  );
}
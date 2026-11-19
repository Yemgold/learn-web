





"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ReactNode,
  KeyboardEvent,
} from "react";

import {
  Check,
  ChevronDown,
  Search,
  X,
  AlertCircle,
} from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  label?: string;
  placeholder?: string;
  description?: string;
  helperText?: string;
  error?: string;

  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;

  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;

  size?: SelectSize;
  leftIcon?: ReactNode;

  name?: string;
  id?: string;

  className?: string;
  containerClassName?: string;
  labelClassName?: string;

  onSearch?: (query: string) => void;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-3.5 text-sm",
  lg: "min-h-12 px-4 text-base",
};

export default function Select({
  options,
  value,
  defaultValue = "",
  onChange,
  label,
  placeholder = "Select an option",
  description,
  helperText,
  error,
  searchable = false,
  clearable = false,
  disabled = false,
  required = false,
  fullWidth = true,
  isLoading = false,
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  loadingMessage = "Loading options...",
  size = "md",
  leftIcon,
  name,
  id,
  className = "",
  containerClassName = "",
  labelClassName = "",
  onSearch,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedValue = isControlled ? value : internalValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options;
    }

    const query = searchQuery.toLowerCase().trim();

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query)
    );
  }, [options, searchable, searchQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled || disabled || isLoading) return;

    if (!isControlled) {
      setInternalValue(option.value);
    }

    onChange?.(option.value);

    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (disabled || isLoading) return;

    if (!isControlled) {
      setInternalValue("");
    }

    onChange?.("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const hasDescription = Boolean(description);
  const hasError = Boolean(error);

  return (
    <div
      ref={containerRef}
      className={[
        "relative space-y-1.5",
        fullWidth ? "w-full" : "",
        containerClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <label
          htmlFor={selectId}
          className={[
            "block text-sm font-medium text-slate-700",
            labelClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}

          {required && (
            <span
              className="ml-1 text-red-500"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      {hasDescription && (
        <p className="text-xs text-slate-500">
          {description}
        </p>
      )}

      <button
        id={selectId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${selectId}-listbox`}
        aria-invalid={hasError}
        aria-required={required}
        aria-describedby={
          error
            ? `${selectId}-error`
            : helperText
              ? `${selectId}-helper`
              : undefined
        }
        disabled={disabled || isLoading}
        onClick={() => {
          setIsOpen((previous) => !previous);
          setSearchQuery("");
        }}
        onKeyDown={handleKeyDown}
        className={[
          "flex w-full items-center justify-between gap-2 rounded-lg border",
          "bg-white text-left transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
          sizeStyles[size],
          hasError
            ? "border-red-400 focus:border-red-500"
            : "border-slate-300 focus:border-blue-500",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {leftIcon && (
            <span className="shrink-0 text-slate-400">
              {leftIcon}
            </span>
          )}

          {selectedOption?.icon && (
            <span className="shrink-0">
              {selectedOption.icon}
            </span>
          )}

          <span
            className={[
              "truncate",
              selectedOption
                ? "text-slate-900"
                : "text-slate-400",
            ].join(" ")}
          >
            {selectedOption?.label || placeholder}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2 text-slate-400">
          {clearable && selectedValue && !disabled && !isLoading && (
            <span
              role="button"
              aria-label="Clear selection"
              tabIndex={-1}
              onClick={handleClear}
              className="rounded p-0.5 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={15} />
            </span>
          )}

          {isLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          ) : (
            <ChevronDown
              size={17}
              className={[
                "transition-transform duration-200",
                isOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          )}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          {searchable && (
            <div className="border-b border-slate-100 p-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    handleSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setIsOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div
            id={`${selectId}-listbox`}
            role="listbox"
            aria-label={label || placeholder}
            className="max-h-60 overflow-y-auto p-1.5"
          >
            {isLoading ? (
              <p className="px-3 py-5 text-center text-sm text-slate-500">
                {loadingMessage}
              </p>
            ) : filteredOptions.length === 0 ? (
              <p className="px-3 py-5 text-center text-sm text-slate-500">
                {emptyMessage}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected =
                  option.value === selectedValue;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      option.disabled
                        ? "cursor-not-allowed opacity-40"
                        : "hover:bg-slate-50",
                      isSelected
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700",
                    ].join(" ")}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      {option.icon && (
                        <span className="shrink-0">
                          {option.icon}
                        </span>
                      )}

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {option.label}
                        </span>

                        {option.description && (
                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </span>

                    {isSelected && (
                      <Check
                        size={16}
                        className="shrink-0 text-blue-600"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error ? (
        <p
          id={`${selectId}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-600"
        >
          <AlertCircle size={13} />
          {error}
        </p>
      ) : helperText ? (
        <p
          id={`${selectId}-helper`}
          className="text-xs text-slate-500"
        >
          {helperText}
        </p>
      ) : null}

      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedValue}
          disabled={disabled}
          required={required}
        />
      )}
    </div>
  );
}

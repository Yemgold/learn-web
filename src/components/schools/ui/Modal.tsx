




"use client";

import {
  useEffect,
  useId,
  useRef,
} from "react";

import type {
  ReactNode,
  HTMLAttributes,
} from "react";

import { X } from "lucide-react";

export type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  children: ReactNode;

  title?: ReactNode;
  description?: ReactNode;

  header?: ReactNode;
  footer?: ReactNode;

  size?: ModalSize;

  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;

  showCloseButton?: boolean;
  showHeader?: boolean;

  isLoading?: boolean;

  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;

  preventBodyScroll?: boolean;
}

export interface ModalHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export interface ModalBodyProps
  extends HTMLAttributes<HTMLDivElement> {}

export interface ModalFooterProps
  extends HTMLAttributes<HTMLDivElement> {}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-[calc(100%-2rem)]",
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  header,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  showHeader = true,
  isLoading = false,
  className = "",
  contentClassName = "",
  headerClassName = "",
  footerClassName = "",
  preventBodyScroll = true,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    if (preventBodyScroll) {
      document.body.style.overflow = "hidden";
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (preventBodyScroll) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [
    isOpen,
    onClose,
    closeOnEscape,
    isLoading,
    preventBodyScroll,
  ]);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasHeader = Boolean(
    showHeader && (header || title || description || showCloseButton)
  );

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (
      event.target === event.currentTarget &&
      closeOnBackdrop &&
      !isLoading
    ) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={[
          "relative my-auto flex w-full flex-col overflow-hidden",
          "max-h-[calc(100dvh-2rem)] rounded-2xl bg-white shadow-2xl",
          "outline-none animate-in fade-in zoom-in-95 duration-200",
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {hasHeader && (
          <div
            className={[
              "flex shrink-0 items-start justify-between gap-4",
              "border-b border-slate-100 px-5 py-4 sm:px-6",
              headerClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="min-w-0 flex-1">
              {header ? (
                header
              ) : (
                <>
                  {title && (
                    <h2
                      id={titleId}
                      className="text-lg font-semibold text-slate-900"
                    >
                      {title}
                    </h2>
                  )}

                  {description && (
                    <p
                      id={descriptionId}
                      className="mt-1 text-sm leading-5 text-slate-500"
                    >
                      {description}
                    </p>
                  )}
                </>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                aria-label="Close modal"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={19} />
              </button>
            )}
          </div>
        )}

        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto p-5 sm:p-6",
            contentClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>

        {footer && (
          <div
            className={[
              "shrink-0 border-t border-slate-100 px-5 py-4 sm:px-6",
              footerClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ModalHeader({
  title,
  description,
  action,
  children,
  className = "",
  ...props
}: ModalHeaderProps) {
  return (
    <div
      className={[
        "flex items-start justify-between gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <div className="min-w-0">
        {title && (
          <h3 className="text-base font-semibold text-slate-900">
            {title}
          </h3>
        )}

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}

        {children}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ModalBody({
  children,
  className = "",
  ...props
}: ModalBodyProps) {
  return (
    <div
      className={["min-w-0", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className = "",
  ...props
}: ModalFooterProps) {
  return (
    <div
      className={[
        "flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

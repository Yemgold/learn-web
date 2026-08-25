



"use client";

import * as React from "react";

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(",");

export interface FocusTrapProps {
  /**
   * Content inside the focus trap.
   */
  children: React.ReactNode;

  /**
   * Whether the trap is active.
   */
  enabled?: boolean;

  /**
   * Optional element to focus first.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;

  /**
   * Called when Escape is pressed.
   */
  onEscape?: () => void;

  /**
   * Additional class name.
   */
  className?: string;
}

export const FocusTrap = React.forwardRef<
  HTMLDivElement,
  FocusTrapProps
>(
  (
    {
      children,
      enabled = true,
      initialFocusRef,
      onEscape,
      className,
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(
      forwardedRef,
      () => internalRef.current as HTMLDivElement,
      []
    );

    const previousFocusedElement =
      React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
      if (!enabled) return;

      const container = internalRef.current;

      if (!container) return;

      previousFocusedElement.current =
        document.activeElement as HTMLElement;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR
        )
      );

      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.focus();
      }

      const handleKeyDown = (
        event: KeyboardEvent
      ) => {
        if (event.key === "Escape") {
          onEscape?.();
          return;
        }

        if (event.key !== "Tab") return;

        const focusableElements = Array.from(
          container.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTOR
          )
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusableElements[0];
        const last =
          focusableElements[
            focusableElements.length - 1
          ];

        if (event.shiftKey) {
          if (
            document.activeElement === first
          ) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (
            document.activeElement === last
          ) {
            event.preventDefault();
            first.focus();
          }
        }
      };

      container.addEventListener(
        "keydown",
        handleKeyDown
      );

      return () => {
        container.removeEventListener(
          "keydown",
          handleKeyDown
        );

        previousFocusedElement.current?.focus();
      };
    }, [enabled, initialFocusRef, onEscape]);

    return (
      <div
        ref={internalRef}
        className={className}
        tabIndex={-1}
      >
        {children}
      </div>
    );
  }
);

FocusTrap.displayName = "FocusTrap";
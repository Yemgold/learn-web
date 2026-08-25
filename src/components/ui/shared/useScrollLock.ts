




import * as React from "react";

export interface UseScrollLockOptions {
  /**
   * Whether scrolling should be locked.
   */
  locked?: boolean;

  /**
   * Lock a custom element instead of the document body.
   * Defaults to document.body.
   */
  target?: HTMLElement | null;
}

/**
 * Locks scrolling on the document body (or a custom element)
 * while preserving the scrollbar width to prevent layout shift.
 */
export function useScrollLock({
  locked = true,
  target,
}: UseScrollLockOptions = {}) {
  React.useEffect(() => {
    if (!locked) return;

    const element = target ?? document.body;

    const previousOverflow = element.style.overflow;
    const previousPaddingRight = element.style.paddingRight;

    // Width of the scrollbar
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    element.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      element.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      element.style.overflow = previousOverflow;
      element.style.paddingRight = previousPaddingRight;
    };
  }, [locked, target]);
}
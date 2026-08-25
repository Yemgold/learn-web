



"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  /**
   * Content to render inside the portal.
   */
  children: React.ReactNode;

  /**
   * Custom container element.
   * Defaults to document.body.
   */
  container?: HTMLElement | null;

  /**
   * Disable the portal and render children in place.
   */
  disabled?: boolean;
}

export function Portal({
  children,
  container,
  disabled = false,
}: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  // Prevent SSR hydration issues
  if (!mounted) {
    return null;
  }

  if (disabled) {
    return <>{children}</>;
  }

  return createPortal(
    children,
    container ?? document.body
  );
}
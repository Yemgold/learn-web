





import * as React from "react";

export interface UseEscapeKeyOptions {
  onEscape: (event: KeyboardEvent) => void;
  enabled?: boolean;
  target?: Document | HTMLElement | null;
}

export function useEscapeKey({
  onEscape,
  enabled = true,
  target,
}: UseEscapeKeyOptions) {
  const callbackRef = React.useRef(onEscape);

  React.useEffect(() => {
    callbackRef.current = onEscape;
  }, [onEscape]);

  React.useEffect(() => {
    if (!enabled) return;

    const element = target ?? document;

    const handleKeyDown: EventListener = (event) => {
      if (!(event instanceof KeyboardEvent)) return;

      if (event.key === "Escape") {
        callbackRef.current(event);
      }
    };

    element.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, target]);
}
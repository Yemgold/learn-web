



import * as React from "react";

type PossibleRef<T extends HTMLElement> =
  | React.RefObject<T | null>
  | T
  | null;

export interface UseClickOutsideOptions<T extends HTMLElement = HTMLElement> {
  /**
   * One or more elements that should be treated as "inside".
   */
  refs: PossibleRef<T> | PossibleRef<T>[];

  /**
   * Called when the user clicks outside.
   */
  onClickOutside: (
    event: MouseEvent | TouchEvent
  ) => void;

  /**
   * Whether the hook is active.
   */
  enabled?: boolean;

  /**
   * Event type(s) to listen for.
   */
  eventTypes?: ("mousedown" | "mouseup" | "click" | "touchstart")[];
}

export function useClickOutside<
  T extends HTMLElement = HTMLElement,
>({
  refs,
  onClickOutside,
  enabled = true,
  eventTypes = ["mousedown", "touchstart"],
}: UseClickOutsideOptions<T>) {
  const callbackRef = React.useRef(onClickOutside);

  React.useEffect(() => {
    callbackRef.current = onClickOutside;
  }, [onClickOutside]);

  React.useEffect(() => {
    if (!enabled) return;

    const refArray = Array.isArray(refs)
      ? refs
      : [refs];

    const handler = (
      event: MouseEvent | TouchEvent
    ) => {
      const target = event.target as Node | null;

      if (!target) return;

      const clickedInside = refArray.some((ref) => {
        const element =
          ref && "current" in ref ? ref.current : ref;

        return element?.contains(target);
      });

      if (!clickedInside) {
        callbackRef.current(event);
      }
    };

    eventTypes.forEach((type) =>
      document.addEventListener(type, handler)
    );

    return () => {
      eventTypes.forEach((type) =>
        document.removeEventListener(type, handler)
      );
    };
  }, [refs, enabled, eventTypes]);
}
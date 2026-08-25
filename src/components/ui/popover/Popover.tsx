


"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  FocusTrap,
  Portal,
  useClickOutside,
  useControllableState,
  useEscapeKey,
} from "@/components/ui/shared";

import {
  popoverContentVariants,
  popoverTriggerVariants,
  popoverWrapperVariants,
} from "./popover.variants";

import type {
  PopoverProps,
} from "./types";


const Popover = React.forwardRef<
  HTMLDivElement,
  PopoverProps
>((props, ref) => {

  const {
    className,

    open,
    defaultOpen,
    onOpenChange,

    trigger,
    children,

    placement = "bottom",
    align = "center",
    size = "md",

    closeOnOutsideClick = true,
    closeOnEscape = true,

    trapFocus = true,

    portal = true,

    triggerRef,
    contentRef,

    contentClassName,
    triggerClassName,

    ...rest
  } = props;



  const [isOpen, setIsOpen] =
    useControllableState({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });



  const internalTriggerRef =
    React.useRef<HTMLDivElement | null>(null);


  const internalContentRef =
    React.useRef<HTMLDivElement | null>(null);



  const triggerElementRef =
    triggerRef ??
    internalTriggerRef;


  const popoverElementRef =
    contentRef ??
    internalContentRef;



  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);



  useEscapeKey({
    enabled:
      closeOnEscape &&
      isOpen,

    onEscape: handleClose,
  });



  useClickOutside({
    refs: [
      popoverElementRef,
      triggerElementRef,
    ],

    enabled:
      closeOnOutsideClick &&
      isOpen,

    onClickOutside: handleClose,
  });



  const handleToggle = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [
    isOpen,
    setIsOpen,
  ]);



  const popoverContent = (
    <FocusTrap
      enabled={
        trapFocus &&
        isOpen
      }
    >
      <div
        ref={(node) => {

          if (
            popoverElementRef &&
            "current" in popoverElementRef
          ) {
            popoverElementRef.current = node;
          }


          if (
            typeof ref === "function"
          ) {
            ref(node);
          }

          else if (ref) {
            ref.current = node;
          }

        }}
        role="dialog"
        className={cn(
          popoverContentVariants({
            placement,
            align,
            size,
          }),

          contentClassName,

          className
        )}
        {...rest}
      >
        {children}
      </div>
    </FocusTrap>
  );



  return (
    <div
      className={popoverWrapperVariants()}
    >

      <div
        ref={triggerElementRef}
        className={cn(
          popoverTriggerVariants(),

          triggerClassName
        )}

        onClick={handleToggle}
      >

        {trigger}

      </div>



      {
        isOpen &&
        (
          portal ? (

            <Portal>
              {popoverContent}
            </Portal>

          ) : (

            popoverContent

          )
        )
      }


    </div>
  );
});



Popover.displayName = "Popover";



export default Popover;
    
        








"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  FocusTrap,
  Overlay,
  Portal,
  useControllableState,
  useEscapeKey,
  useScrollLock,
} from "@/components/ui/shared";

import {
  drawerBodyVariants,
  drawerCloseButtonVariants,
  drawerContentVariants,
  drawerDescriptionVariants,
  drawerFooterVariants,
  drawerHeaderVariants,
  drawerIconVariants,
  drawerTitleVariants,
  drawerWrapperVariants,
} from "./drawer.variants";

import type { DrawerProps } from "./types";


const Drawer = React.forwardRef<
  HTMLDivElement,
  DrawerProps
>((props, ref) => {


      const {
    className,

    open,
    defaultOpen,
    onOpenChange,

    title,
    description,
    icon,
    children,

    placement = "right",
    size = "md",

    primaryAction,
    secondaryAction,
    footer,

    hideFooter = false,
    showCloseButton = true,

    closeOnEscape = true,
    closeOnOverlayClick = true,
    preventClose = false,

    trapFocus = true,
    lockScroll = true,
    portal = true,

    initialFocusRef,

    overlayClassName,
    contentClassName,
    headerClassName,
    bodyClassName,
    footerClassName,

    ...rest
  } = props;



    const [isOpen, setIsOpen] =
    useControllableState({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

  const contentRef =
    React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(
    ref,
    () => contentRef.current as HTMLDivElement,
    []
  );


    useScrollLock({
    locked: lockScroll && !!isOpen,
  });

  const handleClose = React.useCallback(() => {
    if (preventClose) return;

    setIsOpen(false);
  }, [preventClose, setIsOpen]);

  useEscapeKey({
    enabled: closeOnEscape && !!isOpen,
    onEscape: handleClose,
  });

    if (!isOpen) {
    return null;
  }

    const titleId = React.useId();

  const descriptionId = React.useId();


  const drawerContent = (
  <>
    <Overlay
      open={isOpen}
      className={cn(
        overlayClassName
      )}
      onOverlayClick={() => {
        if (closeOnOverlayClick) {
          handleClose();
        }
      }}
    />

    <div className={drawerWrapperVariants()}>
      <FocusTrap
        enabled={trapFocus}
        initialFocusRef={initialFocusRef}
        onEscape={handleClose}
      >
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            drawerContentVariants({
              placement,
              size,
            }),
            contentClassName,
            className
          )}
          {...rest}
        >
          {(title ||
            description ||
            icon ||
            showCloseButton) && (
            <div
              className={cn(
                drawerHeaderVariants(),
                headerClassName
              )}
            >
              <div className="flex flex-1 gap-4">
                {icon && (
                  <div
                    className={drawerIconVariants()}
                  >
                    {icon}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {title && (
                    <h2
                      id={titleId}
                      className={drawerTitleVariants()}
                    >
                      {title}
                    </h2>
                  )}

                  {description && (
                    <p
                      id={descriptionId}
                      className={drawerDescriptionVariants()}
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  aria-label="Close drawer"
                  className={drawerCloseButtonVariants()}
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          <div
            className={cn(
              drawerBodyVariants(),
              bodyClassName
            )}
          >
            {children}
          </div>

          {!hideFooter &&
            (footer ||
              primaryAction ||
              secondaryAction) && (
              <div
                className={cn(
                  drawerFooterVariants(),
                  footerClassName
                )}
              >
                {footer ?? (
                  <>
                    {secondaryAction && (
                      <Button
                        {...secondaryAction}
                        variant={
                          secondaryAction.variant ??
                          "outline"
                        }
                      >
                        {secondaryAction.label}
                      </Button>
                    )}

                    {primaryAction && (
                      <Button
                        {...primaryAction}
                        variant={
                          primaryAction.variant ??
                          "default"
                        }
                      >
                        {primaryAction.label}
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
        </div>
      </FocusTrap>
    </div>
  </>
);

return portal ? (
  <Portal>{drawerContent}</Portal>
) : (
  drawerContent
);
});

Drawer.displayName = "Drawer";

export default Drawer;
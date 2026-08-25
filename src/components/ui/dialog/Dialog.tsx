



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
  dialogBodyVariants,
  dialogCloseButtonVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogIconVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
  dialogWrapperVariants,
} from "./dialog.variants";

import type { DialogProps } from "./types";

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (props, ref) => {
    const {
      className,

      open,
      defaultOpen,
      onOpenChange,

      title,
      description,
      icon,
      children,

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

      size = "md",

      initialFocusRef,

      overlayClassName,
      contentClassName,
      headerClassName,
      bodyClassName,
      footerClassName,

      ...rest
    } = props;

    const [isOpen, setIsOpen] = useControllableState({
  value: open,
  defaultValue: defaultOpen,
  onChange: onOpenChange,
});

    const contentRef = React.useRef<HTMLDivElement>(null);

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

const dialogContent = (
  <>
    <Overlay
      open={isOpen}
      className={cn(
        dialogOverlayVariants(),
        overlayClassName
      )}
      onOverlayClick={() => {
        if (closeOnOverlayClick) {
          handleClose();
        }
      }}
    />

    <div className={dialogWrapperVariants()}>
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
            dialogContentVariants({
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
                dialogHeaderVariants(),
                headerClassName
              )}
            >
              <div className="flex flex-1 gap-4">
                {icon && (
                  <div className={dialogIconVariants()}>
                    {icon}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {title && (
                    <h2
                      id={titleId}
                      className={dialogTitleVariants()}
                    >
                      {title}
                    </h2>
                  )}

                  {description && (
                    <p
                      id={descriptionId}
                      className={dialogDescriptionVariants()}
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  aria-label="Close dialog"
                  className={dialogCloseButtonVariants()}
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          <div
            className={cn(
              dialogBodyVariants(),
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
                  dialogFooterVariants(),
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
  <Portal>{dialogContent}</Portal>
) : (
  dialogContent
);

});

Dialog.displayName = "Dialog";

export default Dialog;
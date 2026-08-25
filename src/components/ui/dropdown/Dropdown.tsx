


"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  dropdownArrowVariants,
  dropdownDividerVariants,
  dropdownItemVariants,
  dropdownMenuVariants,
  dropdownVariants,
} from "./dropdown.variants";

import type {
  DropdownItem,
  DropdownProps,
} from "./types";

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      className,

      trigger,
      items,

      open,
      defaultOpen = false,
      onOpenChange,

      placement = "bottom-start",
      fullWidth = false,

      closeOnSelect = true,
      showArrow = false,

      menuClassName,
      itemClassName,

      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] =
      React.useState(defaultOpen);

    const containerRef = React.useRef<HTMLDivElement>(null);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setInternalOpen(next);
        }

        onOpenChange?.(next);
      },
      [isControlled, onOpenChange]
    );

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [setOpen]);

    const handleSelect = (item: DropdownItem) => {
      if (item.disabled) return;

      item.onClick?.();

      if (closeOnSelect) {
        setOpen(false);
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn(dropdownVariants(), className)}
        {...props}
      >
        <div
          role="button"
          tabIndex={0}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => setOpen(!isOpen)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              setOpen(!isOpen);
            }
          }}
        >
          {trigger}
        </div>

        {isOpen && (
          <div
            role="menu"
            className={cn(
              dropdownMenuVariants({
                placement,
                fullWidth,
              }),
              menuClassName
            )}
          >
            {showArrow && (
              <div
                className={cn(
                  dropdownArrowVariants(),
                  placement.startsWith("bottom")
                    ? "-top-1.5 left-4"
                    : "-bottom-1.5 left-4"
                )}
              />
            )}

            {items.map((item) => (
              <React.Fragment key={item.id}>
                {item.divider && (
                  <div
                    className={dropdownDividerVariants()}
                  />
                )}

                {item.href && !item.disabled ? (
                  <Link
                    href={item.href}
                    className={cn(
                      dropdownItemVariants({
                        destructive: item.destructive,
                        disabled: item.disabled,
                      }),
                      itemClassName
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>

                    {item.shortcut && (
                      <span className="text-xs text-slate-400">
                        {item.shortcut}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      dropdownItemVariants({
                        destructive: item.destructive,
                        disabled: item.disabled,
                      }),
                      itemClassName
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>

                    {item.shortcut && (
                      <span className="text-xs text-slate-400">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
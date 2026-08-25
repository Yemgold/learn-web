


"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  tabsVariants,
  tabsListVariants,
  tabTriggerVariants,
  tabsContentVariants,
} from "./tabs.variants";

import type { TabsProps } from "./types";

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,

      tabs,

      value,
      defaultValue,
      onValueChange,

      orientation = "horizontal",
      variant = "default",

      size = "md",

      fullWidth = false,

      lazy = false,
      keepMounted = true,

      listClassName,
      triggerClassName,
      contentClassName,

      ...props
    },
    ref
  ) => {
    const firstEnabledTab =
      tabs.find((tab) => !tab.disabled)?.value ?? "";

    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? firstEnabledTab
    );

    const isControlled = value !== undefined;

    const activeValue = isControlled
      ? value
      : internalValue;

    const setActiveValue = React.useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange]
    );

    const enabledTabs = tabs.filter((tab) => !tab.disabled);

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      index: number
    ) => {
      let nextIndex = index;

      switch (event.key) {
        case "ArrowRight":
          if (orientation === "horizontal") {
            nextIndex = (index + 1) % enabledTabs.length;
          }
          break;

        case "ArrowLeft":
          if (orientation === "horizontal") {
            nextIndex =
              (index - 1 + enabledTabs.length) %
              enabledTabs.length;
          }
          break;

        case "ArrowDown":
          if (orientation === "vertical") {
            nextIndex = (index + 1) % enabledTabs.length;
          }
          break;

        case "ArrowUp":
          if (orientation === "vertical") {
            nextIndex =
              (index - 1 + enabledTabs.length) %
              enabledTabs.length;
          }
          break;

        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = enabledTabs.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();

      setActiveValue(enabledTabs[nextIndex].value);
    };

    return (
      <div
        ref={ref}
        className={cn(
          tabsVariants({
            orientation,
          }),
          className
        )}
        {...props}
      >
        <div
          role="tablist"
          aria-orientation={orientation}
          className={cn(
            tabsListVariants({
              orientation,
              variant,
              fullWidth,
            }),
            listClassName
          )}
        >
          {tabs.map((tab) => {
            const enabledIndex = enabledTabs.findIndex(
              (item) => item.value === tab.value
            );

            const active =
              tab.value === activeValue;

            return (
              <button
                key={tab.value}
                id={`tab-${tab.value}`}
                role="tab"
                type="button"
                disabled={tab.disabled}
                tabIndex={active ? 0 : -1}
                aria-selected={active}
                aria-controls={`tabpanel-${tab.value}`}
                onClick={() =>
                  setActiveValue(tab.value)
                }
                onKeyDown={(event) =>
                  handleKeyDown(event, enabledIndex)
                }
                className={cn(
                  tabTriggerVariants({
                    size,
                    variant,
                    active,
                    fullWidth,
                  }),
                  triggerClassName
                )}
              >
                {tab.icon}

                <span>{tab.label}</span>

                {tab.badge}
              </button>
            );
          })}
        </div>

        {tabs.map((tab) => {
          const active =
            tab.value === activeValue;

          if (lazy && !active) {
            return null;
          }

          if (!keepMounted && !active) {
            return null;
          }

          return (
            <div
              key={tab.value}
              id={`tabpanel-${tab.value}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.value}`}
              hidden={!active}
              className={cn(
                tabsContentVariants({
                  orientation,
                }),
                contentClassName
              )}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

export { Tabs };




"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  breadcrumbVariants,
  breadcrumbItemVariants,
  breadcrumbSeparatorVariants,
} from "./breadcrumb.variants";

import type {
  BreadcrumbItem,
  BreadcrumbProps,
} from "./types";

function collapseItems(
  items: BreadcrumbItem[],
  maxItems: number
): BreadcrumbItem[] {
  if (items.length <= maxItems) {
    return items;
  }

  return [
    items[0],
    {
      id: "__ellipsis__",
      label: <MoreHorizontal className="h-4 w-4" />,
      disabled: true,
    },
    ...items.slice(-(maxItems - 2)),
  ];
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,

      items,

      separator = <ChevronRight className="h-4 w-4" />,

      maxItems,

      showHome = false,
      homeHref = "/",
      homeLabel = "Home",
      homeIcon = <Home className="h-4 w-4" />,

      itemClassName,
      separatorClassName,

      ...props
    },
    ref
  ) => {
    const breadcrumbItems = React.useMemo(() => {
      let result = [...items];

      if (showHome) {
        result.unshift({
          id: "__home__",
          label: homeLabel,
          href: homeHref,
          icon: homeIcon,
        });
      }

      if (
        maxItems &&
        maxItems > 2 &&
        result.length > maxItems
      ) {
        result = collapseItems(result, maxItems);
      }

      return result;
    }, [
      items,
      maxItems,
      showHome,
      homeHref,
      homeLabel,
      homeIcon,
    ]);

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(
          breadcrumbVariants(),
          className
        )}
        {...props}
      >
        <ol className="flex flex-wrap items-center gap-1">
          {breadcrumbItems.map((item, index) => {
            const isLast =
              index === breadcrumbItems.length - 1;

            const content = (
              <>
                {item.icon}

                <span>{item.label}</span>
              </>
            );

            return (
              <React.Fragment
                key={item.id ?? `${item.label}-${index}`}
              >
                <li>
                  {item.href &&
                  !item.current &&
                  !item.disabled ? (
                    <Link
                      href={item.href}
                      onClick={item.onClick}
                      className={cn(
                        breadcrumbItemVariants({
                          current: false,
                          disabled: false,
                        }),
                        itemClassName
                      )}
                    >
                      {content}
                    </Link>
                  ) : (
                    <span
                      aria-current={
                        item.current
                          ? "page"
                          : undefined
                      }
                      className={cn(
                        breadcrumbItemVariants({
                          current: !!item.current,
                          disabled: !!item.disabled,
                        }),
                        itemClassName
                      )}
                    >
                      {content}
                    </span>
                  )}
                </li>

                {!isLast && (
                  <li
                    aria-hidden="true"
                    className={cn(
                      breadcrumbSeparatorVariants(),
                      separatorClassName
                    )}
                  >
                    {separator}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
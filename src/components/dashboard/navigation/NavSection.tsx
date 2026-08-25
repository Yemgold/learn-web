



"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import NavItem from "./NavItem";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  exact?: boolean;
}

interface NavSectionProps {
  title?: string;
  items: NavigationItem[];
  className?: string;
}

export default function NavSection({
  title,
  items,
  className,
}: NavSectionProps) {
  return (
    <section className={cn("space-y-2", className)}>
      {title && (
        <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h2>
      )}

      <div className="space-y-1">
        {items.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            badge={item.badge}
            disabled={item.disabled}
            exact={item.exact}
          />
        ))}
      </div>
    </section>
  );
}
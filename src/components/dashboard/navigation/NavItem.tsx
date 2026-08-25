





"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface NavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  exact?: boolean;
  className?: string;
}

export default function NavItem({
  label,
  href,
  icon: Icon,
  badge,
  disabled = false,
  exact = false,
  className,
}: NavItemProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={disabled ? "#" : href}
      aria-disabled={disabled}
      className={cn(
        "group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200",
        disabled && "pointer-events-none opacity-50",
        isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-5 w-5",
            isActive
              ? "text-white"
              : "text-slate-500 group-hover:text-slate-700"
          )}
        />

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>

      {badge !== undefined && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            isActive
              ? "bg-white/20 text-white"
              : "bg-blue-100 text-blue-700"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
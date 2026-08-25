



"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface UserMenuProps {
  name: string;
  email?: string;
  avatar?: string;
  role?: "student" | "admin";
  className?: string;
  onLogout?: () => void;
}

export default function UserMenu({
  name,
  email,
  avatar,
  role = "student",
  className,
  onLogout,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  const initials = name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={menuRef}
      className={cn("relative", className)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {initials}
          </div>
        )}

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-slate-900">
            {name}
          </p>

          <p className="text-xs capitalize text-slate-500">
            {role}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="font-semibold text-slate-900">
              {name}
            </p>

            {email && (
              <p className="mt-1 text-sm text-slate-500">
                {email}
              </p>
            )}
          </div>

          <div className="py-2">
            <Link
              href={`/${role}/profile`}
              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              <User className="h-5 w-5" />
              Profile
            </Link>

            <Link
              href={`/${role}/settings`}
              className="flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </div>

          <div className="border-t border-slate-100 p-2">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
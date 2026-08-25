




"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trophy,
  Users,
  FileQuestion,
  CreditCard,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  href?: string;
  read?: boolean;
  type?: "competition" | "team" | "practice" | "payment" | "general";
  createdAt: string;
}

interface NotificationsProps {
  notifications: NotificationItem[];
  className?: string;
  onMarkAllRead?: () => void;
}

export default function Notifications({
  notifications,
  className,
  onMarkAllRead,
}: NotificationsProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  function getIcon(type?: NotificationItem["type"]) {
    switch (type) {
      case "competition":
        return Trophy;

      case "team":
        return Users;

      case "practice":
        return FileQuestion;

      case "payment":
        return CreditCard;

      default:
        return Bell;
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative rounded-xl border border-slate-200 bg-white p-2 transition hover:bg-slate-50"
      >
        <Bell className="h-5 w-5 text-slate-700" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-lg font-semibold">
              Notifications
            </h3>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <Bell className="mb-3 h-12 w-12 text-slate-300" />

                <h4 className="font-semibold text-slate-800">
                  No notifications
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getIcon(notification.type);

                const content = (
                  <div
                    className={cn(
                      "flex gap-4 px-5 py-4 transition hover:bg-slate-50",
                      !notification.read && "bg-blue-50/50"
                    )}
                  >
                    <div className="mt-1 rounded-lg bg-blue-100 p-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-semibold text-slate-900">
                          {notification.title}
                        </h4>

                        {!notification.read && (
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-600">
                        {notification.description}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {notification.createdAt}
                      </p>
                    </div>
                  </div>
                );

                return notification.href ? (
                  <Link
                    key={notification.id}
                    href={notification.href}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>
                    {content}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}


import { create } from "zustand";
import type { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];

  setNotifications: (items: Notification[]) => void;

  markAsRead: (id: string) => void;

  clearNotifications: () => void;
}

export const useNotificationStore =
  create<NotificationState>((set) => ({
    notifications: [],

    setNotifications: (items) =>
      set({
        notifications: items,
      }),

    markAsRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        ),
      })),

    clearNotifications: () =>
      set({
        notifications: [],
      }),
  }));
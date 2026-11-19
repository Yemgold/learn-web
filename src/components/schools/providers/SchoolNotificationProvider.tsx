




"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

export type SchoolNotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "ANNOUNCEMENT"
  | "ASSESSMENT"
  | "PAYMENT"
  | "MEMBER";

export interface SchoolNotification {
  id: string;
  title: string;
  message: string;
  type: SchoolNotificationType;
  isRead: boolean;
  createdAt: string;
  href?: string;
}

export type NewSchoolNotification = Omit<
  SchoolNotification,
  "id" | "isRead" | "createdAt"
> & {
  id?: string;
  isRead?: boolean;
  createdAt?: string;
};

interface SchoolNotificationContextValue {
  notifications: SchoolNotification[];
  unreadCount: number;
  hasUnread: boolean;
  addNotification: (notification: NewSchoolNotification) => void;
  setNotifications: (notifications: SchoolNotification[]) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
}

interface SchoolNotificationProviderProps {
  children: ReactNode;
  initialNotifications?: SchoolNotification[];
}

const SchoolNotificationContext = createContext<
  SchoolNotificationContextValue | undefined
>(undefined);

export function SchoolNotificationProvider({
  children,
  initialNotifications = [],
}: SchoolNotificationProviderProps) {
  const [notifications, setNotifications] = useState<
    SchoolNotification[]
  >(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const addNotification = useCallback(
    (notification: NewSchoolNotification) => {
      const newNotification: SchoolNotification = {
        ...notification,
        id:
          notification.id ??
          `school-notification-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`,
        isRead: notification.isRead ?? false,
        createdAt: notification.createdAt ?? new Date().toISOString(),
      };

      setNotifications((current) => [
        newNotification,
        ...current,
      ]);
    },
    []
  );

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  }, []);

  const removeNotification = useCallback(
    (notificationId: string) => {
      setNotifications((current) =>
        current.filter(
          (notification) => notification.id !== notificationId
        )
      );
    },
    []
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      hasUnread: unreadCount > 0,
      addNotification,
      setNotifications,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
    ]
  );

  return (
    <SchoolNotificationContext.Provider value={value}>
      {children}
    </SchoolNotificationContext.Provider>
  );
}

export function useSchoolNotifications() {
  const context = useContext(SchoolNotificationContext);

  if (!context) {
    throw new Error(
      "useSchoolNotifications must be used within a SchoolNotificationProvider."
    );
  }

  return context;
}
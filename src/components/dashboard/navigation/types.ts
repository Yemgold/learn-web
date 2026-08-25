




import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  exact?: boolean;
  description?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}
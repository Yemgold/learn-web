



import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;

  toggleSidebar: () => void;

  closeSidebar: () => void;

  openSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  openSidebar: () =>
    set({
      sidebarOpen: true,
    }),

  closeSidebar: () =>
    set({
      sidebarOpen: false,
    }),
}));
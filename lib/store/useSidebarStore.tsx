import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  setIsCollapsed(value: boolean): void;
  expand(): void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  expand: () => set(() => ({ isCollapsed: false })),
  setIsCollapsed: (value) => set(() => ({ isCollapsed: value })),
}));

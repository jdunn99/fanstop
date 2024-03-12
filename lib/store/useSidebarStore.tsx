import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  values: string[];
  addValue(value: string): void;
  removeValue(value: string): void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      values: [] as string[],
      addValue: (value) =>
        set((state) => ({
          values: [...state.values, value],
        })),
      removeValue: (value) =>
        set((state) => ({
          values: state.values.filter((val) => val !== value),
        })),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

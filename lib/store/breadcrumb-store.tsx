import { create } from "zustand";
import type { Path } from "../../components/ui/breadcrumbs";

interface BreadCrumbState {
  paths: Path[];
  appendToPath: (newPath: Path) => void;
  overwritePath: (newPaths: Path[]) => void;
  clearPath: () => void;
}

export const useBreadCrumbStore = create<BreadCrumbState>((set) => ({
  paths: [],
  appendToPath: (newPath: Path) =>
    set((state) => ({ paths: void state.paths.push(newPath) })),
  overwritePath: (newPaths: Path[]) => set(() => ({ paths: newPaths })),
  clearPath: () => set(() => ({ paths: [] })),
}));

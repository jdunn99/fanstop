import { ResizablePanelGroup } from "../ui/resizable";

interface ContainerProps {
  children?: React.ReactNode;
}
export function Container({ children }: ContainerProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="antialised dark:bg-slate-900 dark:text-slate-200 max-h-screen overflow-hidden"
      id="root"
    >
      {children}
    </ResizablePanelGroup>
  );
}

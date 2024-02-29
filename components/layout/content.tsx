import { ProfileFooter } from "../footer";
import { Header } from "../layout";
import { ResizablePanel } from "../ui/resizable";

interface ContentProps {
  heading?: string;
  children?: React.ReactNode;
}

export function LayoutPane({ children }: Pick<ContentProps, "children">) {
  return (
    <ResizablePanel>
      <div className="flex-1 z-10 bg-slate-50 h-screen overflow-auto dark:bg-slate-900">
        {children}
        <ProfileFooter />
      </div>
    </ResizablePanel>
  );
}

export function Content({ children, heading }: ContentProps) {
  return (
    <main className="lg:px-10 px-2  max-w-screen-lg mx-auto w-full bg-slate-50 dark:bg-slate-900  min-h-[calc(100vh-178px)] flex-1">
      <div className="space-y-8 py-8 h-full">
        {typeof heading === "undefined" ? null : <Header heading={heading} />}
        {children}
      </div>
    </main>
  );
}

import { ProfileFooter } from "../footer";
import { Header } from "../layout";
import { ResizablePanel } from "../ui/resizable";

interface ContentProps {
  heading?: string;
  children?: React.ReactNode;
}

export function LayoutPane({ children }: Pick<ContentProps, "children">) {
  return (
    <div className="relative mx-auto overflow-auto flex w-full">
      <div className="relative min-h-screen pt-12 w-full max-w-screen-lg mx-auto px-4 break-words">
        <div>{children}</div>
      </div>
    </div>
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

interface ContainerProps {
  children?: React.ReactNode;
  noHeight?: boolean;
}
export function Container({ children, noHeight }: ContainerProps) {
  return (
    <div
      id="root"
      className={`flex ${
        noHeight ?? "h-screen"
      } h-screen flex-col bg-white dark:bg-slate-900 dark:text-slate-200`}
    >
      <div className="flex-grow overflow-auto w-full">
        <div className="flex h-full">{children}</div>
      </div>
    </div>
  );
}

interface ContainerProps {
  children?: React.ReactNode;
}
export function Container({ children }: ContainerProps) {
  return (
    <div
      id="root"
      className="flex h-screen flex-col bg-white dark:bg-slate-900 dark:text-slate-200"
    >
      <div className="flex-grow overflow-auto w-full">
        <div className="flex h-full">{children}</div>
      </div>
    </div>
  );
}

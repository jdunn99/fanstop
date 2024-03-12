interface AsideContainerProps {
  children: React.ReactNode;
}
export function AsideContainer({ children }: AsideContainerProps) {
  return (
    <aside className="w-96 flex-shrink-0 xl:block hidden px-6 pt-12 ">
      <nav className="fixed h-full space-y-6 w-80 ">{children}</nav>
    </aside>
  );
}

export function AsideSection({ children }: AsideContainerProps) {
  return <ul className="space-y-4 w-full  pb-8">{children}</ul>;
}

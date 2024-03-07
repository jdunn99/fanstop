interface AsideHeaderProps {
  children: React.ReactNode;
}
export function AsideHeader({ children }: AsideHeaderProps) {
  return (
    <li className="font-semibold  text-slate-800 text-xs uppercase">
      {children}
    </li>
  );
}

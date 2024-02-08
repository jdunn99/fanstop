import Link from "next/link";
import { BsChevronBarRight, BsChevronRight } from "react-icons/bs";

interface Path {
  href: string;
  value: string;
  disabled?: boolean;
}
interface BreadcrumbProps {
  paths: Path[];
}

// ghost: "bg-transparent hover:bg-slate-50 opacity-80 hover:opacity-100",
export function Breadcrumbs({ paths }: BreadcrumbProps) {
  return (
    <nav className="flex">
      <ol className="inline-flex items-center space-x-1">
        {paths.map(({ href, value, disabled }, index) => (
          <li
            className="inline-flex items-center text-slate-800 font-semibold space-x-1 text-sm"
            key={href}
          >
            <Link
              href={href}
              className={`${
                disabled ? "pointer-events-none opacity-60" : ""
              } hover:text-rose-500`}
              tabIndex={disabled ? -1 : undefined}
            >
              {value}
            </Link>
            {index !== paths.length - 1 ? (
              <BsChevronRight className="text-xs font-bold" />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

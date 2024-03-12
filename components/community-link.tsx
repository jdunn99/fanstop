import { NavLink } from "@/types";
import Link from "next/link";

interface CommunityLinkProps extends NavLink {
  path?: string;
}
export function CommunityLink({
  href,
  image,
  value,
  path = "",
}: CommunityLinkProps) {
  return (
    <li key={href}>
      <Link
        href={href}
        className={`${
          path === href ? "text-rose-500" : "text-slate-500"
        } truncate font-medium hover:text-slate-700 inline-flex items-center gap-2`}
      >
        {image}
        {value}
      </Link>
    </li>
  );
}

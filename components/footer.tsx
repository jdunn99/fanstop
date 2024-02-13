import { useSession } from "next-auth/react";
import { BsDot } from "react-icons/bs";
import Button from "./ui/button";
import Link from "next/link";
import { useSidebarRoutes } from "@/config/dashboard";
import { usePathname } from "next/navigation";

export function Footer() {}

export function ProfileFooter() {
  const items = useSidebarRoutes();
  const path = usePathname();
  const { data: session } = useSession();
  return (
    <footer className="py-4 w-full border-t border-slate-200 bg-slate-50">
      <div className="space-y-4 flex flex-col items-center justify-center">
        <div className="flex gap-2 items-center text-slate-500 text-sm">
          <p>© 2024 FanStop</p>
        </div>

        <ul className="inline-flex gap-2 items-center justify-center font-semibold">
          {items.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="text-sm text-slate-600">
                {item.value}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

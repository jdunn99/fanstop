import Link from "next/link";
import { useSidebarRoutes } from "@/config/dashboard";

export function Footer() {}

export function ProfileFooter() {
  const items = useSidebarRoutes();
  return (
    <footer className="py-8 w-full border-t border-slate-200 bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
      <div className="space-y-4 flex flex-col items-center justify-center">
        <div className="flex gap-2 items-center dark:text-slate-400 text-slate-500 text-sm">
          <p>© 2024 FanStop</p>
        </div>

        <ul className="inline-flex gap-2 items-center justify-center font-semibold">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="text-sm text-slate-600 dark:text-slate-300"
              >
                {item.value}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

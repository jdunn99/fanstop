import React from "react";
import {
  dashboardConfig,
  unAuthedConfig,
  useSidebarRoutes,
} from "@/config/dashboard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "react-query";
import { truncateString } from "@/lib/truncate";

export function Sidebar() {
  const pathname = usePathname();
  const items = useSidebarRoutes();

  const path = React.useMemo(() => {
    return "/" + pathname.split("/")[1];
  }, [pathname]);

  const { data } = useQuery<any>(["subscriptions"], () =>
    fetch("/api/user/subscriptions").then((res) => res.json())
  );

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="lg:text-sm lg:leading-6 relative ">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link
              key={index}
              href={item.href}
              className={`group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium hover:text-rose-500 ${
                path === item.href ? "text-rose-500" : "text-slate-600"
              }`}
            >
              <div className="mr-4 rounded-md ">{item.image}</div>
              {item.value}
            </Link>
          </li>
        ))}
        {typeof data !== "undefined" && !data.message ? (
          <li className="mt-12 lg:mt-8">
            <h5 className="mb-8 lg:mb-3 font-semibold text-slate-800">
              Subscriptions
            </h5>
            <ul className="space-y-6 lg:space-y-2 border-l border-slate-100">
              {data.map(({ community }: any) => (
                <li key={community.id}>
                  <Link
                    href={community.slug}
                    className={`group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium hover:text-rose-500 ${
                      path === "/" + community.slug
                        ? "text-rose-500"
                        : "text-slate-600"
                    }`}
                  >
                    {truncateString(community.name, 25)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

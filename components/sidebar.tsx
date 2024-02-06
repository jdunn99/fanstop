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

export function Sidebar() {
  const path = usePathname();
  const items = useSidebarRoutes();

  const { data } = useQuery<any>(["subscriptions"], () =>
    fetch("/api/user/subscriptions").then((res) => res.json())
  );

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="space-y-4">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-bold">FanStop</h2>
          <div className="space-y-1">
            {items.map((item, index) => (
              <Link key={index} href={item.href}>
                <span
                  className={`group transition-all gap-4 flex items-center rounded-md px-4 py-2 my-1 text-sm font-medium hover:bg-rose-100 hover:text-rose-600 ${
                    path === item.href
                      ? "bg-rose-100 text-rose-600"
                      : "transparent"
                  }`}
                >
                  {item.image}
                  <span>{item.value}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        {typeof data !== "undefined" ? (
          <div className="py-2">
            <h2 className="mb-2 px-7  font-bold">Subscriptions</h2>
            <div className="relative overflow-auto h-[400px] ">
              {data.map(({ community }: any) => (
                <Link key={community.id} href={community.slug}>
                  <span
                    className={`group transition-all flex items-center rounded-md ml-4 mr-3 px-4 py-2 my-1 text-sm font-medium hover:bg-rose-100 hover:text-rose-600 ${
                      path === "/" + community.slug
                        ? "bg-rose-100 text-rose-600"
                        : "transparent"
                    }`}
                  >
                    <span>{community.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

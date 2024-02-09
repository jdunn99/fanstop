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
  const path = usePathname();
  const items = useSidebarRoutes();

  const { data, isError } = useQuery<any>(["subscriptions"], () =>
    fetch("/api/user/subscriptions").then((res) => res.json())
  );

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="lg:text-sm lg:leading-6 relative ">
      <ul>
        {items.map((item, index) => (
          <li>
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
      {/* {typeof data !== "undefined" && !data.message ? (
          <div className="py-2">
            <h2 className="mb-2 px-7  font-bold">Subscriptions</h2>
            <div className="relative overflow-auto h-[400px] ">
              {data.map(({ community }: any) => (
                <Link key={community.id} href={`/${community.slug}`}>
                  <span
                    className={`group transition-all flex items-center rounded-md ml-4 mr-3 px-4 py-2 my-1 text-sm   hover:text-rose-600 ${
                      path === "/" + community.slug
                        ? " text-rose-600"
                        : "transparent text-slate-600"
                    }`}
                  >
                    <span>{community.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div> */}
    </nav>
  );
}

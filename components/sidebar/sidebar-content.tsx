import { useRoutes } from "@/config/dashboard";
import { SidebarDropdown } from "./sidebar-dropdown";
import Link from "next/link";
import React from "react";
import { useSubscriptionsForUserQuery } from "@/lib/queries/subscription-queries";
import { BsPersonHeart } from "react-icons/bs";
import { usePathname } from "next/navigation";

export function SidebarSubscriberContent() {
  const { data } = useSubscriptionsForUserQuery();

  return (
    <ul className="px-3 space-y-1">
      {data?.pages.map((page, index) => (
        <SidebarDropdown
          key={index}
          value="Subscriptions"
          image={<BsPersonHeart />}
          children={page.response.map(({ community }: any) => ({
            href: `/${community.slug}`,
            value: community.name,
            image: <img src={community.image!} className="w-8 h-8 rounded" />,
          }))}
        />
      ))}
    </ul>
  );
}

export function SidebarRouteContent() {
  const routes = useRoutes();
  const path = usePathname();

  return (
    <ul className="px-3 space-y-1">
      {routes.map((item, index) =>
        item.children ? (
          <li key={item.value}>
            <SidebarDropdown {...item} />
          </li>
        ) : (
          <li key={item.href}>
            <Link
              key={index}
              href={item.href}
              className={`${
                path === item.href ? "text-rose-500" : "text-slate-800"
              } 
              group m-0 flex min-h-[1.25rem] w-full cursor-pointer items-center rounded p-1.5 focus:outline-none  hover:bg-slate-100 font-medium text-sm
              `}
            >
              <div className="mr-3 rounded-md">{item.image}</div>
              {item.value}
            </Link>
          </li>
        )
      )}
    </ul>
  );
}

export function SidebarContent() {
  return (
    <React.Fragment>
      <SidebarRouteContent />
      <SidebarSubscriberContent />
    </React.Fragment>
  );
}

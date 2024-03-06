import { useRoutes } from "@/config/dashboard";
import { SidebarDropdown } from "./sidebar-dropdown";
import Link from "next/link";
import React from "react";
import { useSubscriptionsForUserQuery } from "@/lib/queries/subscription-queries";
import { BsPersonHeart } from "react-icons/bs";

export function SidebarSubscriberContent() {
  const { data } = useSubscriptionsForUserQuery();

  return (
    <ul className="px-3 space-y-1">
      {data?.pages.map((page) => (
        <SidebarDropdown
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

  return (
    <ul className="px-3 space-y-1">
      {routes.map((item, index) =>
        item.children ? (
          <li>
            <SidebarDropdown {...item} />
          </li>
        ) : (
          <li>
            <Link
              key={index}
              href={item.href}
              className="group m-0 flex min-h-[1.25rem] w-full cursor-pointer items-center rounded p-1.5 focus:outline-none text-slate-800 hover:bg-slate-100 font-medium text-sm"
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

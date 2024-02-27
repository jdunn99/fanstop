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
import { CreatePostButton } from "./create-post-button";
import { AvatarImage } from "./ui/avatar";
import { AvatarMenu } from "./avatar-menu";

function SidebarTop() {
  const { data: session } = useSession();

  return (
    <li className="flex flex-col gap-4 text-sm mb-2">
      {session !== null ? (
        <React.Fragment>
          <div className="flex items-center gap-2">
            <AvatarMenu direction="left" />
            <div>
              <p>{session.user.name}</p>
              <p className="text-rose-500 font-semibold">
                @{session.user.slug}
              </p>
            </div>
          </div>
          <CreatePostButton />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>Test</p>
          <p>Test</p>
        </React.Fragment>
      )}
    </li>
  );
}

interface SidebarLinkProps {
  children?: React.ReactNode;
  href: string;
  isSelected: boolean;
}
function SidebarLink({ href, isSelected, children }: SidebarLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className={`group flex items-center text-[13px] py-1 px-2 rounded mb-2 font-medium hover:text-rose-500 ${
          isSelected
            ? "text-rose-500 bg-rose-50 dark:bg-slate-800"
            : "text-slate-600 dark:text-slate-300"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const items = useSidebarRoutes();

  const path = React.useMemo(() => {
    return "/" + pathname.split("/")[1];
  }, [pathname]);

  const { data } = useQuery<any>(["subscriptions"], () =>
    fetch("/api/user/subscriptions").then((res) => res.json()),
  );

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="lg:text-sm lg:leading-6 relative p-4">
      <ul>
        <SidebarTop />
        {items.map((item, index) => (
          <SidebarLink
            key={index}
            href={item.href}
            isSelected={path === item.href}
          >
            <div className="mr-2 rounded-md">{item.image}</div>
            {item.value}
          </SidebarLink>
        ))}

        {typeof data !== "undefined" && !data.message ? (
          <React.Fragment>
            <li className="mt-12 lg:mt-8">
              <h5 className="mb-8 lg:mb-3 font-semibold text-slate-800">
                Subscriptions
              </h5>
              <ul className="space-y-6 lg:space-y-2 ">
                {data.map(({ community }: any) => (
                  <li key={community.id}>
                    <Link
                      href={community.slug}
                      className={`group flex items-center lg:text-sm lg:leading-6 mb-4 font-medium hover:text-rose-500 ${
                        path === "/" + community.slug
                          ? "text-rose-500"
                          : "text-slate-600 dark:text-slate-200"
                      }`}
                    >
                      {truncateString(community.name, 25)}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </React.Fragment>
        ) : null}
      </ul>
    </nav>
  );
}

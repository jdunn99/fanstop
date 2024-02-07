import type { DashboardConfig, NavConfig } from "@/types";
import { useSession } from "next-auth/react";
import { MdHome, MdPerson, MdSearch, MdSettings } from "react-icons/md";

export const unAuthedConfig: DashboardConfig = {
  header: [],
  sidebar: [
    {
      href: "/",
      value: "Home",
    },
    {
      href: "/explore",
      value: "Explore",
    },
  ],
};

export const dashboardConfig: DashboardConfig = {
  header: [],
  sidebar: [
    {
      href: "/",
      value: "Home",
    },
    {
      href: "/explore",
      value: "Explore",
    },
    {
      href: "/profile",
      value: "Profile",
    },
    {
      href: "/settings",
      value: "Settings",
    },
  ],
};

export function useSidebarRoutes(): NavConfig {
  const { data: session } = useSession();

  return session && session.user.slug
    ? [
        {
          href: "/",
          value: "Home",
          image: <MdHome />,
        },
        {
          href: "/explore",
          value: "Explore",
          image: <MdSearch />,
        },

        {
          href: `/${session.user.slug}`,
          value: "Profile",
          image: <MdPerson />,
        },
        {
          href: "/settings",
          value: "Settings",
          image: <MdSettings />,
        },
      ]
    : unAuthedConfig.sidebar;
}

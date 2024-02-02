import type { DashboardConfig, NavConfig } from "@/types";
import { useSession } from "next-auth/react";

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
      href: "/profile/subscriptions",
      value: "Subscriptions",
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
        },
        {
          href: "/explore",
          value: "Explore",
        },
        {
          href: "/profile/subscriptions",
          value: "Subscriptions",
        },
        {
          href: `/${session.user.slug}`,
          value: "Profile",
        },
        {
          href: "/settings",
          value: "Settings",
        },
      ]
    : unAuthedConfig.sidebar;
}

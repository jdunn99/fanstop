import type { DashboardConfig } from "@/types";

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

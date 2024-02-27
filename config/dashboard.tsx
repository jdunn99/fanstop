import type { DashboardConfig, NavConfig } from "@/types";
import { useSession } from "next-auth/react";
import { FaHome, FaInbox, FaSearch } from "react-icons/fa";
import {
  MdHome,
  MdMessage,
  MdPerson,
  MdSearch,
  MdSettings,
} from "react-icons/md";
import { IoMdPerson, IoMdSettings } from "react-icons/io";

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
          image: <FaHome />,
        },
        {
          href: "/explore",
          value: "Explore",
          image: <FaSearch />,
        },

        {
          href: `/${session.user.slug}`,
          value: "Profile",
          image: <IoMdPerson />,
        },
        {
          href: "/messages",
          value: "Messages",
          image: <FaInbox />,
        },
        {
          href: "/settings",
          value: "Settings",
          image: <IoMdSettings />,
        },
      ]
    : [
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
      ];
}

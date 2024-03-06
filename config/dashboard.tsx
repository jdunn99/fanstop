import type { DashboardConfig, NavConfig } from "@/types";
import { useSession } from "next-auth/react";
import {
  FaHome,
  FaInbox,
  FaLayerGroup,
  FaPencilAlt,
  FaSearch,
} from "react-icons/fa";
import { MdHome, MdSearch } from "react-icons/md";
import { IoMdPerson, IoMdSettings } from "react-icons/io";
import { BsPeopleFill } from "react-icons/bs";

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

export const sidebarConfig = [
  {
    href: "/",
    value: "Home",
  },
  {
    children: [
      {
        href: "/",
      },
    ],
  },
  {
    href: "Profile",
    value: "Profile",
  },
  {
    href: "/explore",
    value: "Explore",
  },
];

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

export function useRoutes() {
  const { data: session } = useSession();

  return session && session.user.slug
    ? [
        {
          href: "/",
          value: "Home",
          image: <FaHome />,
        },

        {
          href: "Profile",
          value: "Profile",
          image: <IoMdPerson />,
        },
        {
          href: "/explore",
          value: "Explore",
          image: <FaSearch />,
        },
        {
          href: "/messages",
          value: "Messages",
          image: <FaInbox />,
        },

        {
          value: "Community",
          image: <BsPeopleFill />,
          children: [
            {
              href: "/community/dashboard",
              value: "Dashboard",
            },
            {
              href: "/community/posts",
              value: "Posts",
            },

            {
              href: "/community/categories",
              value: "Categories",
            },
            {
              href: "/community/subscriptions",
              value: "Subscriptions",
            },
          ],
        },
        {
          children: [
            {
              href: "/settings/general",
              value: "General",
            },
          ],
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

import React from "react";

export type NavLink = {
  value: string;
  href: string;
  image?: React.ReactNode;
};

export type SidebarNavItem = {
  value: string;
  items: NavLink[];
};

export type NavConfig = NavLink[];
export type DashboardConfig = {
  header: NavConfig;
  sidebar: NavConfig;
};

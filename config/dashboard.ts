import type { DashboardConfig } from "@/types";

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
        // {
        //     href: "/me/inbox",
        //     value: "Inbox",
        // },
        // {
        //     href: "/profile/bookmarks",
        //     value: "Bookmarks",
        // },
        {
            href: "/profile/dashboard",
            value: "Dashboard",
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

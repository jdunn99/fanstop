import type { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
    header: [],
    sidebar: [
        {
            href: "/profile",
            value: "Home",
        },
        {
            href: "/profile/dashboard",
            value: "Dashboard",
        },
        {
            href: "/profile/communities",
            value: "Communities",
        },
        {
            href: "/profile/posts",
            value: "Posts",
        },
        {
            href: "/profile/subscribers",
            value: "Subscribers",
        },
        {
            href: "/profile/stats",
            value: "Stats",
        },
        {
            href: "/profile/settings",
            value: "Settings",
        },
    ],
};

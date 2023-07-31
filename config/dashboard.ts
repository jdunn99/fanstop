import type { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
    header: [],
    sidebar: [
        {
            href: '/dashboard',
            value: 'Home',
        },
        {
            href: '/dashboard/posts',
            value: 'Posts',
        },
        {
            href: '/dashboard/subscribers',
            value: 'Subscribers',
        },
        {
            href: '/dashboard/stats',
            value: 'Stats',
        },
        {
            href: '/dashboard/settings',
            value: 'Settings',
        },
    ],
};

import { dashboardConfig } from '@/config/dashboard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = dashboardConfig.sidebar;

export function Sidebar() {
    const path = usePathname();

    if (!items?.length) {
        return null;
    }

    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => (
                <Link key={index} href={item.href}>
                    <span
                        className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-rose-100 hover:text-rose-600 ${
                            path === item.href
                                ? 'bg-rose-100 text-rose-600'
                                : 'transparent'
                        }`}
                    >
                        <span>{item.value}</span>
                    </span>
                </Link>
            ))}
        </nav>
    );
}

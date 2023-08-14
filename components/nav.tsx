import * as React from "react";
import Link from "next/link";
import { NavLink } from "@/types";
import { Search } from "./search";
import Button from "./ui/button";
import { Avatar } from "./ui/avatar";
import {
    Menu,
    MenuButton,
    MenuGroup,
    MenuItem,
    MenuList,
    MenuText,
} from "./ui/menu";
import { AvatarMenu } from "./avatar-menu";

interface MainNavProps {
    children?: React.ReactNode;
    links: NavLink[];
}

interface AuthNavProps {}

const MenuComponent: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                onClick={handleToggle}
            >
                Open Menu
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <button
                            type="button"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                        >
                            Item 1
                        </button>
                        <button
                            type="button"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                        >
                            Item 2
                        </button>
                        <button
                            type="button"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                        >
                            Item 3
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export function AuthedNav() {
    return (
        <React.Fragment>
            <Search />
            <Button className="whitespace-nowrap">Create post</Button>
            <AvatarMenu />
        </React.Fragment>
    );
}

export function Navbar({ links, children }: MainNavProps) {
    return (
        <div className="flex gap-6 md:gap-10">
            <Link href="/" className="hidden items-center space-x-1 md:flex">
                <span className="hidden text-lg font-bold sm:inline-block ">
                    FanStop
                </span>
            </Link>

            <nav className="hidden gap-6 md:flex">
                {links.map(({ value, href }) => (
                    <Link
                        className="flex items-center text-lg font-medium transition-colors opacity-80 hover:opacity-100 hover:text-rose-500 sm:text-sm"
                        key={href}
                        href={href}
                    >
                        {value}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

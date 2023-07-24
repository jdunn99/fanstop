'use client';

import * as React from 'react';
import Link from 'next/link';
import { MdOutlinePostAdd } from 'react-icons/md';
import { useSelectedLayoutSegment } from 'next/navigation';

interface MainNavProps {
    children?: React.ReactNode;
}

export function Navbar({ children }: MainNavProps) {
    return (
        <div className="flex gap-6 md:gap-10">
            <Link href="/" className="hidden items-center space-x-1 md:flex">
                <MdOutlinePostAdd className="text-2xl  font-bold" />
                <span className="hidden font-bold sm:inline-block ">
                    FanStop
                </span>
            </Link>

            <nav className="hidden gap-6 md:flex">
                <Link
                    href="#"
                    className="flex items-center text-lg font-medium transition-colors opacity-80 hover:opacity-100 hover:text-rose-500 sm:text-sm"
                >
                    Features
                </Link>

                <Link
                    href="#"
                    className="flex items-center text-lg font-medium transition-colors opacity-80 hover:opacity-100 hover:text-rose-500 sm:text-sm"
                >
                    Creators
                </Link>
                <Link
                    href="#"
                    className="flex items-center text-lg font-medium transition-colors opacity-80 hover:opacity-100 hover:text-rose-500 sm:text-sm"
                >
                    Pricing
                </Link>
            </nav>
        </div>
    );
}

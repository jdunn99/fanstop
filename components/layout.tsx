import React, { ChangeEvent } from "react";
import { Sidebar } from "./sidebar";
import Input from "./ui/input";
import { MdAdd } from "react-icons/md";
import Button from "./ui/button";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { AuthedNav, Navbar } from "./nav";
import { useSession } from "next-auth/react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Container({ children, className, ...rest }: ContainerProps) {
    return (
        <div
            className={`${className} grid items-start gap-8 px-8 h-[calc(100vh-98px)] `}
            {...rest}
        >
            {children}
        </div>
    );
}

interface HeaderProps {
    heading: string;
    text?: string;
    children?: React.ReactNode;
}
export function Header({ heading, text, children }: HeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="grid gap-1">
                <h1 className="font-bold text-3xl md:text-4xl">{heading}</h1>
                {text && <p className="text-lg opacity-80">{text}</p>}
            </div>
            {children}
        </div>
    );
}

interface DashboardItemHeadingProps {
    heading: string;
    children?: React.ReactNode;
}
export function DashboardItemHeading({
    heading,
    children,
}: DashboardItemHeadingProps) {
    return (
        <div className="flex items-center justify-between">
            <h3 className="font-semibold opacity-80 flex-1">{heading}</h3>
            {children}
        </div>
    );
}

interface DashboardItemProps {
    children?: React.ReactNode;
}
export function DashboardItem({ children }: DashboardItemProps) {
    return (
        <div className="grid gap-8 w-full">
            <div className="grid gap-4">{children}</div>
        </div>
    );
}

interface LayoutProps {
    children?: React.ReactNode;
    heading: string;
}
export function Layout({ children, heading }: LayoutProps) {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col ">
            <header className="sticky top-0 z-40 bg-white border-b">
                <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
                    <Navbar links={[]} />
                    <div className="flex items-center gap-2">
                        {session?.user ? (
                            <AuthedNav />
                        ) : (
                            <React.Fragment>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </header>
            <div className="max-w-screen-xl flex relative w-full mx-auto">
                <aside className="hidden md:block sticky pt-8 top-16 col-span-3 pr-2 h-[calc(100vh-65px)] border-r justify-center w-[350px]">
                    <Sidebar />
                </aside>
                <main className="h-full grid items-start gap-8 px-8 w-full pt-8">
                    <Header heading={heading} />
                    {children}
                </main>
            </div>
        </div>
    );
}

interface EmptyCardProps {
    children?: React.ReactNode;
    fromSearch?: boolean;
    heading: string;
}
export function EmptyCard({ fromSearch, heading, children }: EmptyCardProps) {
    return (
        <div className="w-full min-h-[400px] flex items-center flex-col justify-center bg-slate-50 border rounded-lg">
            {fromSearch ? null : React.Children.count(children) === 0 ? (
                <React.Fragment>
                    <h3 className="font-semibold text-sm">
                        No {heading} Found
                    </h3>
                    <p className="text-sm text-slate-500 pt-2 pb-8">
                        It looks like you haven't created any{" "}
                        {heading.toLocaleLowerCase()} yet.
                    </p>
                </React.Fragment>
            ) : (
                children
            )}
        </div>
    );
}

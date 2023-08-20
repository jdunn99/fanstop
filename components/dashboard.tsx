import React, { ChangeEvent } from "react";
import { Sidebar } from "./sidebar";
import Input from "./ui/input";
import { MdAdd } from "react-icons/md";
import Button from "./ui/button";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Container({ children, className, ...rest }: ContainerProps) {
    return (
        <div className={`${className} grid items-start gap-8 px-8`} {...rest}>
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
    return (
        <div className="flex min-h-screen flex-col ">
            <header className="sticky top-0 z-40 bg-background border-b">
                <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4"></div>
            </header>
            <div className="max-w-screen-xl grid flex-1 gap-12 mx-auto w-full md:grid-cols-[200px_1fr] ">
                <aside className="hidden w-[250px] flex-col md:flex border-r pr-2 pt-8">
                    <Sidebar />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden pt-8">
                    <Container>
                        <Header heading={heading} />
                        {children}
                    </Container>
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
            {fromSearch ? null : (
                <React.Fragment>
                    <h3 className="font-semibold text-sm">
                        No {heading} Found
                    </h3>
                    <p className="text-sm text-slate-500 pt-2 pb-8">
                        It looks like you haven't created any{" "}
                        {heading.toLocaleLowerCase()} yet.
                    </p>
                    {children}
                </React.Fragment>
            )}
        </div>
    );
}

interface DashboardSearchProps {
    onChange(event: React.ChangeEvent<HTMLInputElement>): void;
    onClick(): void;
    value: string;
}
export function DashboardSearch({
    value,
    onChange,
    onClick,
}: DashboardSearchProps) {
    return (
        <div className="flex items-center gap-2 w-full">
            <Input
                onChange={onChange}
                type="search"
                placeholder="Search..."
                className="w-full"
            />
            <Button className="whitespace-nowrap" onClick={onClick}>
                <span className="sm:pr-2 text-lg">
                    <MdAdd />
                </span>
                <span className="hidden sm:block">New {value}</span>
            </Button>
        </div>
    );
}

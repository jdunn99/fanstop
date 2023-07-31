import React from 'react';

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

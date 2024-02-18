import React from "react";
import { Sidebar } from "./sidebar";
import { ProfileNav } from "./nav";
import { Footer, ProfileFooter } from "./footer";

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

export function LayoutContent({ children, heading }: LayoutProps) {
  return (
    <div className="flex-1 space-y-6 pt-8 flex flex-col z-10 min-h-[calc(100vh-73px)] overflow-auto bg-slate-50">
      <main className="lg:px-10 px-1  max-w-screen-lg mx-auto h-full w-full">
        <div className="space-y-8 py-8 h-full">
          {typeof heading === "undefined" ? null : <Header heading={heading} />}
          {children}
        </div>
      </main>
      <ProfileFooter />
    </div>
  );
}

interface LayoutProps {
  children?: React.ReactNode;
  heading?: string;
}
export function Layout({ children, heading }: LayoutProps) {
  return (
    <div className="antialised" id="root">
      <ProfileNav />
      <div className="flex overflow-hidden">
        <aside className=" inset-y-0 z-10 flex-shrink-0 w-64 bg-white border-r lg:static fixed">
          <Sidebar />
        </aside>

        <LayoutContent heading={heading}>{children}</LayoutContent>
      </div>
    </div>
  );
}

interface EmptyCardProps {
  children?: React.ReactNode;
  fromSearch?: boolean;
  heading: string;
}
export function EmptyCard({ heading, children }: EmptyCardProps) {
  return (
    <div className="w-full min-h-[400px] flex items-center flex-col justify-center bg-slate-50 border rounded-lg">
      {React.Children.count(children) === 0 ? (
        <React.Fragment>
          <h3 className="font-semibold text-sm">{heading}</h3>
          <p className="text-sm text-slate-500 pt-2 pb-8">
            It looks like you haven't created any {heading.toLocaleLowerCase()}{" "}
            yet.
          </p>
        </React.Fragment>
      ) : (
        children
      )}
    </div>
  );
}

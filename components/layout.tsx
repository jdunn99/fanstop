import React from "react";
import { Sidebar } from "./sidebar";
import { ProfileNav } from "./nav";
import { ProfileFooter } from "./footer";

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
  heading?: string;
}
export function Layout({ children, heading }: LayoutProps) {
  return (
    <div className="antialiased" id="root">
      <ProfileNav />
      <div>
        <div className="max-w-[84rem] mx-auto px-4  md:px-8">
          <div className="hidden lg:block fixed z-20 inset-0 top-[7rem] left-[max(0px,calc(50%-42rem))] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">
            <Sidebar />
          </div>
          <div className="lg:pl-[10.5rem] min-h-[calc(100vh-73px)]">
            <main className="lg:px-10 px-1 lg:border-l min-h-[calc(100vh-73px)]">
              <div className="space-y-8 py-8 ">
                {typeof heading === "undefined" ? null : (
                  <Header heading={heading} />
                )}
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
      <ProfileFooter />
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

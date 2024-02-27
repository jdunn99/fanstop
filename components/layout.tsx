import React from "react";
import { Sidebar } from "./sidebar";
import { ProfileNav } from "./nav";
import { ProfileFooter } from "./footer";
import { usePathname } from "next/navigation";
import { useBreadCrumbStore } from "@/lib/store/useBreadCrumbStore";
import { Breadcrumbs } from "./ui/breadcrumbs";

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

function LayoutHeader() {
  const paths = useBreadCrumbStore((state) => state.paths);

  return (
    <header className="w-full border-b min-h-[42px] dark:border-slate-700 px-8">
      <Breadcrumbs paths={paths} />
    </header>
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
    <div className="flex-1 space-y-6 flex flex-col z-10 h-screen overflow-auto bg-slate-50 dark:bg-slate-900">
      <LayoutHeader />
      <main className="lg:px-10 px-2  max-w-screen-lg mx-auto  w-full">
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
    <div className="antialised dark:bg-slate-900 dark:text-slate-200" id="root">
      <div className="flex overflow-hidden">
        <aside className=" inset-y-0 z-10 flex-shrink-0 w-80 bg-white h-screen dark:bg-slate-900 border-r dark:border-slate-800 lg:static fixed">
          <Sidebar />
        </aside>

        <LayoutContent heading={heading}>{children}</LayoutContent>
      </div>
    </div>
  );
}

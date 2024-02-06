import React, { ChangeEvent } from "react";
import { Sidebar } from "./sidebar";
import Input from "./ui/input";
import { MdAdd } from "react-icons/md";
import Button from "./ui/button";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { AuthedNav, Navbar } from "./nav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  const { data: session } = useSession();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="flex h-16 items-center max-w-screen-xl mx-auto w-full justify-between py-4">
          {/* <Navbar links={[]} /> */}
          <div />
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
      <div className="grid lg:grid-cols-6 bg-white overflow-hidden h-screen">
        <Sidebar />
        <main className="h-full bg-slate-50 overflow-auto col-span-3 lg:col-span-5 lg:border-l">
          <div className="max-w-screen-lg mx-auto px-8 space-y-8 py-8 ">
            {typeof heading === "undefined" ? null : (
              <Header heading={heading} />
            )}
            {children}
          </div>
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
export function EmptyCard({ heading, children }: EmptyCardProps) {
  return (
    <div className="w-full min-h-[400px] flex items-center flex-col justify-center bg-white border rounded-lg">
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

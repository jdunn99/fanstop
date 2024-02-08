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
import Image from "next/image";

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
    <div className="antialiased">
      <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 bg-white ">
        <div className="max-w-[84rem] mx-auto">
          <div className="py-4 border-b border-slate-100 lg:px-8 lg:border-0 mx-4 lg:mx-0">
            <div className="relative flex items-center">
              <Link href="/" className="hidden items-center space-x-1 md:flex">
                <Image
                  src={"/images/logo.svg"}
                  alt="FanStop"
                  width={32}
                  height={32}
                />
              </Link>

              <div className="relative hidden lg:flex items-center ml-auto gap-2">
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
          </div>
        </div>
      </header>

      <div>
        <div className="max-w-[84rem] mx-auto px-4 sm:px-6 md:px-8">
          <div className="hidden lg:block fixed z-20 inset-0 top-[7rem] left-[max(0px,calc(50%-42rem))] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">
            <Sidebar />
          </div>
          <div className="lg:pl-[10.5rem] ml-[12rem] border-l min-h-[calc(100vh-73px)]">
            <main className="">
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
      {/* <div className="grid lg:grid-cols-8 bg-white overflow-hidden h-screen">
        <div className="lg:col-span-1 hidden lg:block" />
        <Sidebar />
        <main className="h-full bg-slate-50 overflow-auto col-span-3 lg:col-span-6 lg:border-l">
          <div className="max-w-screen-lg mx-auto px-8 space-y-8 py-8 ">
            {typeof heading === "undefined" ? null : (
              <Header heading={heading} />
            )}
            {children}
          </div>
        </main>
      </div> */}
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

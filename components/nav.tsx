import * as React from "react";
import Link from "next/link";
import { NavLink } from "@/types";
import { Search } from "./search";
import Button from "./ui/button";
import { AvatarMenu } from "./avatar-menu";
import { CreatePostButton } from "./create-post-button";
import Image from "next/image";
import { NavDrawerOpenButton } from "./nav-drawer";
import { useSession } from "next-auth/react";
import { NotificationMenu } from "./notification-menu";

interface ProfileNavProps {
  children?: React.ReactNode;
}
export function ProfileNav({ children }: ProfileNavProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky h-[73px] top-0 z-50 w-full backdrop-blur  flex-none transition-colors duration-500 border-b border-slate-200 bg-white ">
      <div className="max-w-[84rem] mx-auto h-full my-auto">
        <div className=" lg:px-4 px-1 mx-4 h-full">
          <div className="relative flex items-center h-full  ">
            <Link href="/" className="flex">
              <Image
                src={"/images/logo.svg"}
                alt="FanStop"
                width={32}
                height={32}
              />
            </Link>
            {children}

            <div className="flex items-center ml-auto gap-2">
              {session?.user ? (
                <React.Fragment>
                  <CreatePostButton />
                  <NotificationMenu userId={session.user.id} />
                  <AvatarMenu />
                </React.Fragment>
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
              <NavDrawerOpenButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

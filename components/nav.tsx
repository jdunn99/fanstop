import * as React from "react";
import Link from "next/link";
import { AvatarMenu } from "./avatar-menu";
import { CreatePostButton } from "./create-post-button";
import Image from "next/image";
import { NavDrawerOpenButton } from "./nav-drawer";
import { useSession } from "next-auth/react";
import { NotificationMenu } from "./notification-menu";
import { LoginSignupButtons } from "./login-signup-buttons";

interface ProfileNavProps {
  children?: React.ReactNode;
}

export function ProfileNav({ children }: ProfileNavProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky py-3 top-0 z-50 w-full backdrop-blur  flex-none transition-colors duration-500 border-b border-slate-200 bg-transparent ">
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
                  <NotificationMenu />
                  <AvatarMenu />
                  <NavDrawerOpenButton />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <LoginSignupButtons />
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import * as React from "react";
import Link from "next/link";
import { NavLink } from "@/types";
import { Search } from "./search";
import Button from "./ui/button";
import { AvatarMenu } from "./avatar-menu";
import { CreatePostButton } from "./create-post-button";
import Image from "next/image";

interface MainNavProps {
  children?: React.ReactNode;
  links: NavLink[];
}

export function AuthedNav() {
  return (
    <React.Fragment>
      {/* <Search /> */}
      <CreatePostButton />
      <AvatarMenu />
    </React.Fragment>
  );
}

export function Navbar({ links, children }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-1 md:flex">
        <Image src={"/images/logo.svg"} alt="FanStop" width={32} height={32} />
      </Link>

      <nav className="hidden gap-6 md:flex">
        {links.map(({ value, href }) => (
          <Link
            className="flex items-center text-lg font-medium transition-colors opacity-80 hover:opacity-100 hover:text-rose-500 sm:text-sm"
            key={href}
            href={href}
          >
            {value}
          </Link>
        ))}
      </nav>
    </div>
  );
}

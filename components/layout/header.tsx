import { useSidebarStore } from "@/lib/store/useSidebarStore";
import { Breadcrumbs, Path } from "../ui/breadcrumbs";
import Button from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { FaBars } from "react-icons/fa";
import { useWindowWidth } from "@/lib/useWindowWidth";
import { CreatePostButton } from "../create-post-button";
import { NotificationMenu } from "../notification-menu";
import { SidebarContent } from "../sidebar/sidebar-content";
import { useSession } from "next-auth/react";
import { LoginSignupButtons } from "../login-signup-buttons";
import { SidebarDrawer } from "../sidebar/sidebar-drawer";

interface HeaderProps {
  paths: Path[];
  children?: React.ReactNode;
}
export function LayoutHeader({ paths, children }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="mb-4 flex h-5 items-center justify-between">
      <div className="flex items-center gap-2 bg-transparent">
        <SidebarDrawer />

        <div className="hidden md:block">
          <Breadcrumbs paths={paths} />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {session !== null ? children : <LoginSignupButtons />}
      </div>
    </header>
  );
}

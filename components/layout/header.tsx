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

interface HeaderProps {
  paths: Path[];
  children?: React.ReactNode;
}
export function LayoutHeader({ paths, children }: HeaderProps) {
  const isMobile = useWindowWidth();
  const { data: session } = useSession();

  return (
    <header className="mb-4 flex h-5 items-center justify-between">
      <div className="flex items-center gap-2 bg-transparent">
        {isMobile ? (
          <Drawer direction="left">
            <DrawerTrigger>
              <Button variant="ghost" size="sm" className="mr-4">
                <FaBars />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="w-80 fixed top-0 left-0 dark:border-slate-800 h-full !m-0 !rounded-t-none">
              <SidebarContent />
            </DrawerContent>
          </Drawer>
        ) : null}

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

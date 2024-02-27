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
import { SidebarContent } from "./sidebar";
import { useWindowWidth } from "@/lib/useWindowWidth";

interface HeaderProps {
  paths: Path[];
  children?: React.ReactNode;
}
export function LayoutHeader({ paths, children }: HeaderProps) {
  const { isCollapsed, expand } = useSidebarStore();
  const isMobile = useWindowWidth();

  return (
    <header className="sticky py-4 px-8 top-0 z-50 w-full flex-none transition-colors duration-500 border-b border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 ">
      <div className="flex items-center my-auto justify-between w-full">
        <div className="flex items-center gap-2 bg-transparent">
          {isMobile ? (
            <Drawer direction="left">
              <DrawerTrigger>
                <Button variant="secondary" size="sm">
                  <FaBars />
                </Button>
              </DrawerTrigger>
              <DrawerContent className=" w-80 fixed bottom-0 left-0 dark:border-slate-800">
                <SidebarContent />
              </DrawerContent>
            </Drawer>
          ) : null}

          {isCollapsed && !isMobile ? (
            <Button variant="secondary" size="sm" onClick={expand}>
              <FaBars />
            </Button>
          ) : null}
          <Breadcrumbs paths={paths} />
        </div>
        <div className="flex items-center gap-2 bg-transparent">{children}</div>
      </div>
    </header>
  );
}

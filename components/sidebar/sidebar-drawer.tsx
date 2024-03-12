import { FaBars } from "react-icons/fa";
import Button from "../ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "../ui/drawer";
import { SidebarContent } from "./sidebar-content";

export function SidebarDrawer() {
  return (
    <div className="hidden max-lg:block">
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
    </div>
  );
}

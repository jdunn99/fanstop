import { SidebarHeader } from "./sidebar-header";
import { SidebarContent, SidebarSubscriberContent } from "./sidebar-content";

export function Sidebar() {
  return (
    <div className="hidden w-80 lg:flex py-6 flex-shrink-0 h-full bg-slate-50">
      <div className="flex h-full w-full flex-col px-3">
        <SidebarHeader />
        <SidebarContent />
      </div>
    </div>
  );
}

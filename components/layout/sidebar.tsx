import { useSession } from "next-auth/react";
import React from "react";
import { AvatarMenu } from "../avatar-menu";
import { CreatePostButton } from "../create-post-button";
import Link from "next/link";
import { useSidebarRoutes } from "@/config/dashboard";
import { usePathname } from "next/navigation";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useSidebarStore } from "@/lib/store/useSidebarStore";
import { useWindowWidth } from "@/lib/useWindowWidth";

function SidebarTop() {
  const { data: session } = useSession();

  return (
    <li className="flex flex-col gap-4 text-sm mb-2">
      {!!session ? (
        <React.Fragment>
          <div className="flex items-center gap-2">
            <AvatarMenu direction="left" />
            <div>
              <p className="dark:text-white text-slate-900">
                {session.user.name}
              </p>
              <p className="text-rose-500 font-semibold">
                @{session.user.slug}
              </p>
            </div>
          </div>
          <CreatePostButton />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>Test</p>
          <p>Test</p>
        </React.Fragment>
      )}
    </li>
  );
}

interface SidebarLinkProps {
  children?: React.ReactNode;
  href: string;
  isSelected: boolean;
}
function SidebarLink({ href, isSelected, children }: SidebarLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className={`group flex items-center text-[13px] py-1 px-2 rounded mb-2 font-medium hover:text-rose-500 ${
          isSelected
            ? "text-rose-500 bg-rose-50 dark:bg-slate-800"
            : "text-slate-600 dark:text-slate-300"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

export function SidebarContent() {
  const pathname = usePathname();
  const items = useSidebarRoutes();

  const path = React.useMemo(() => {
    return "/" + pathname.split("/")[1];
  }, [pathname]);

  if (!items?.length) {
    return null;
  }
  return (
    <aside className=" inset-y-0 z-10 flex-shrink-0 bg-white max-h-screen dark:bg-slate-900 h-screen ">
      <nav className="lg:text-sm lg:leading-6 relative p-4">
        <ul>
          <SidebarTop />
          {items.map((item, index) => (
            <SidebarLink
              key={index}
              href={item.href}
              isSelected={path === item.href}
            >
              <div className="mr-2 rounded-md">{item.image}</div>
              {item.value}
            </SidebarLink>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export function Sidebar() {
  const { setIsCollapsed, isCollapsed } = useSidebarStore();
  const ref = React.useRef<ImperativePanelHandle>(null);
  const isMobile = useWindowWidth();

  React.useEffect(() => {
    if (!isCollapsed && ref.current) {
      ref.current.expand();
    }
  }, [ref.current, isCollapsed]);

  React.useEffect(() => {
    if (isMobile && ref.current) {
      ref.current.collapse();
      setIsCollapsed(true);
    }
  }, [ref.current, isMobile]);

  return (
    <React.Fragment>
      <ResizablePanel
        maxSize={18}
        collapsible
        ref={ref}
        minSize={14}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
        id="sidebar-panel"
      >
        <SidebarContent />
      </ResizablePanel>
      <ResizableHandle className="dark:bg-slate-800 bg-slate-200" />
    </React.Fragment>
  );
}

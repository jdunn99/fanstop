import { CreatePostButton } from "@/components/create-post-button";
import { Container } from "@/components/layout/container";
import { LayoutHeader } from "@/components/layout/header";
import { NotificationMenu } from "@/components/notification-menu";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Path } from "@/components/ui/breadcrumbs";
import { useRouter } from "next/router";
import React from "react";

interface CommunityPageLayoutProps {
  paths: Path[];
  children?: React.ReactNode;
}
export function CommunityPageLayout({
  paths,
  children,
}: CommunityPageLayoutProps) {
  return (
    <Container>
      <Sidebar />
      <div className="relative mx-auto overflow-auto flex w-full">
        <div className="relative min-h-screen pt-12 w-full max-w-screen-xl mx-auto px-4 break-words">
          <div>
            <LayoutHeader paths={paths}>
              <NotificationMenu />
            </LayoutHeader>

            {children}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default function useReroute() {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/community/dashboard");
  }, [router]);

  return null;
}

import { LayoutHeader } from "@/components/layout/header";
import { Container } from "@/components/layout/container";
import React from "react";
import { usePathname } from "next/navigation";
import { useSidebarRoutes } from "@/config/dashboard";
import {
  useFeedQuery,
  usePostsForAuthedUserQuery,
  usePostsForCommunity,
} from "@/lib/queries/post-queries";
import { Sidebar } from "@/components/sidebar/sidebar";
import { FeedPost } from "@/components/posts/feed-post";
import { FeedAside } from "@/components/sidebar/feed-aside";
import { NotificationMenu } from "@/components/notification-menu";
import { CreatePostButton } from "@/components/create-post-button";
import { PostItem, PostResponse } from "@/lib/api/validators";
import { PostTable } from "@/components/tables/post-table";
import {
  Drawer,
  DrawerContent,
  DrawerContentNoOverlay,
  DrawerOverlay,
  DrawerPortal,
} from "@/components/ui/drawer";
import { Drawer as DrawerPrimitive } from "vaul";
import { useFlattenedPaginatedData } from "@/lib/useFlattenedPaginatedData";
import { CommunityPageLayout } from "..";

interface PostCommunityPage {
  children?: React.ReactNode;
}
export function CommunityPostsPage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <CommunityPageLayout
      paths={[
        { href: "/community", disabled: true, value: "Community" },
        {
          href: "/community/posts",
          value: "Posts",
        },
      ]}
    >
      <PostTable />
      {children}
    </CommunityPageLayout>
  );
}

export default CommunityPostsPage;

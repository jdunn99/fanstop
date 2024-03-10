import { LayoutHeader } from "@/components/layout/header";
import { Container } from "@/components/layout/container";
import React from "react";
import { usePathname } from "next/navigation";
import { useSidebarRoutes } from "@/config/dashboard";
import { useFeedQuery, usePostsForCommunity } from "@/lib/queries/post-queries";
import { Sidebar } from "@/components/sidebar/sidebar";
import { FeedPost } from "@/components/posts/feed-post";
import { FeedAside } from "@/components/sidebar/feed-aside";
import { NotificationMenu } from "@/components/notification-menu";
import { CreatePostButton } from "@/components/create-post-button";

export default function Profile() {
  const { data } = useFeedQuery();

  return (
    <Container>
      <Sidebar />
      <div className="relative mx-auto overflow-auto flex w-full">
        <div className="relative min-h-screen pt-12 w-full max-w-screen-lg mx-auto px-4 break-words">
          <div>
            <LayoutHeader
              paths={[{ href: "/", disabled: true, value: "Home" }]}
            >
              <NotificationMenu />
              <CreatePostButton />
            </LayoutHeader>
            {data?.pages.map((page) =>
              page.response.map(({ post }) => (
                <FeedPost post={post} includeAuthor />
              ))
            )}
          </div>
        </div>
        <FeedAside />
      </div>
    </Container>
  );
}

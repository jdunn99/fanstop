import React from "react";
import { PostTable } from "@/components/tables/post-table";
import { CommunityPageLayout } from "..";

interface PostCommunityPageProps {
  children?: React.ReactNode;
}
export function CommunityPostsPage({ children }: PostCommunityPageProps) {
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

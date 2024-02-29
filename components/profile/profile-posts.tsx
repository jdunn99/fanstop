import posts from "@/pages/api/communities/[slug]/posts";
import React from "react";
import { DashboardItem } from "../layout";
import { PostComponent } from "../posts/post-item";
import { usePostsForCommunity } from "@/lib/queries/post-queries";

export function ProfilePosts({ slug }: { slug: string }) {
  const { data: posts } = usePostsForCommunity(slug);

  return typeof posts === "undefined" ? null : (
    <React.Fragment>
      <DashboardItem>
        {typeof posts !== "undefined"
          ? posts.pages.map(({ response }) =>
              response.map(({ post, isAuthor }) => (
                <PostComponent key={post.id} {...post} isOwn={isAuthor} />
              ))
            )
          : null}
      </DashboardItem>
    </React.Fragment>
  );
}

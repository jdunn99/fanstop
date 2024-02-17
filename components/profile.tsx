import React from "react";
import { BsGearFill } from "react-icons/bs";
import { Layout, DashboardItem, DashboardItemHeading } from "./layout";
import { PostComponent } from "./posts/post-item";
import Button from "./ui/button";
import { CommunityResponse } from "@/lib/api/validators";
import { usePostsForCommunity } from "@/lib/queries/usePostQuery";
import { SubscribeButton } from "./subscribe-button";
import { ProfileImage } from "./ui/profile-image";
import Link from "next/link";
import { Socials } from "./socials";
import { useCommunitySocialsQuery } from "@/lib/queries/useCommunitySocialsQuery";
import { ProfileControls } from "./profile-controls";

interface ProfileComponentProps {
  slug: string;
  data?: CommunityResponse;
}

export function ProfileComponent({ data, slug }: ProfileComponentProps) {
  const { data: posts } = usePostsForCommunity(slug);
  const { data: socials } = useCommunitySocialsQuery(slug);

  if (!data) return null;

  const { community, isOwn, isSubscriber } = data;

  return (
    <React.Fragment>
      <Layout>
        <div className="w-full space-y-8 mx-auto max-w-screen-md text-center">
          <div className="flex justify-end">
            {isOwn ? (
              <div className="flex items-center gap-2 font-semibold">
                <Link href="/settings">
                  <Button size="sm" variant="ghost">
                    <BsGearFill />
                  </Button>
                </Link>
              </div>
            ) : (
              <SubscribeButton isSubscriber={isSubscriber} slug={slug} />
            )}
          </div>
          {community.image ? <ProfileImage src={community.image} /> : null}
          <h1 className="text-center text-4xl font-bold  text-slate-800">
            {community.name}
          </h1>
          <p className="w-full text-center  font-regular text-slate-500 leading-loose">
            {community.description}
          </p>
          <div className="flex justify-center">
            <div className="flex items-center gap-2 font-semibold text-slate-600 text-sm sm:flex-row flex-col ">
              <p>{community._count.subscribers} subscribers</p>
              <p>{community._count.posts} posts</p>
            </div>
          </div>
          {typeof socials !== "undefined" ? <Socials {...socials} /> : null}
        </div>

        <ProfileControls isOwn={isOwn} slug={slug} />
        {typeof posts === "undefined" ? null : (
          <React.Fragment>
            <DashboardItem>
              {posts.featuredPost ? (
                <React.Fragment>
                  <DashboardItemHeading heading="Featured Post" />
                  <div className="space-y-8 mb-8">
                    {posts.featuredPost ? (
                      <PostComponent
                        {...posts.featuredPost}
                        isFeatured
                        isOwn={data.isOwn}
                      />
                    ) : null}
                  </div>
                </React.Fragment>
              ) : (
                <div className="flex items-center justify-center flex-col space-y-2 pt-8">
                  <h3 className="text-slate-800 font-semibold text-sm">
                    No posts yet.
                  </h3>
                  <p className="text-xs">
                    {community.name} has not made any posts.
                  </p>
                </div>
              )}
            </DashboardItem>

            {posts.recentPosts.length > 0 ? (
              <DashboardItem>
                <DashboardItemHeading heading="Recent Posts" />
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                  {posts.recentPosts.map((post) => (
                    <PostComponent {...post} isCol isOwn={isOwn} />
                  ))}
                </div>
              </DashboardItem>
            ) : null}
            {posts.posts.length > 0 ? (
              <DashboardItem>
                <DashboardItemHeading heading="All Posts" />
                <div className="space-y-8">
                  {posts.posts.map((post) => (
                    <PostComponent {...post} key={post.id} isOwn={data.isOwn} />
                  ))}
                </div>
              </DashboardItem>
            ) : null}
            {posts.unpublishedPosts.length > 0 ? (
              <DashboardItem>
                <DashboardItemHeading heading="Unpublished Posts" />
                <div className="space-y-8">
                  {posts.unpublishedPosts.map((post) => (
                    <PostComponent {...post} key={post.id} isOwn={data.isOwn} />
                  ))}
                </div>
              </DashboardItem>
            ) : null}
          </React.Fragment>
        )}
      </Layout>
    </React.Fragment>
  );
}

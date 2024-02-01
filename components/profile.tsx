import { useSubscribeMutation } from "@/lib/mutations/useSubscribeMutation";
import { useCommunitiesByIDQuery } from "@/lib/queries/useCommunities";
import { getServerSideProps } from "@/pages";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import {
  Layout,
  Header,
  DashboardItem,
  DashboardItemHeading,
  EmptyCard,
} from "./layout";
import { PostComponent } from "./posts/post-item";
import Button from "./ui/button";
import { CommunityResponse } from "@/lib/api/validators";
import { usePostsForCommunity } from "@/lib/queries/usePostQuery";

interface ProfileComponentProps {
  slug: string;
  data?: CommunityResponse;
}

export function ProfileComponent({ data, slug }: ProfileComponentProps) {
  const { data: session } = useSession();
  const { mutate } = useSubscribeMutation(slug);
  const { data: posts } = usePostsForCommunity(slug);

  // function handleSubscription() {
  //   mutate({
  //     isDeletion: subscriptionIndex !== -1,
  //     subscriptionId:
  //       subscriptionIndex !== -1
  //         ? data?.subscribers[subscriptionIndex].id
  //         : undefined,
  //   });
  // }

  if (!data) return null;

  const { community, isOwn, isSubscriber } = data;

  return (
    <React.Fragment>
      <Layout>
        <Header heading={community.name}>
          {isOwn ? (
            <Button>Edit Profile</Button>
          ) : (
            <Button
              variant={isSubscriber ? "primary" : "ghost"}
              // onClick={handleSubscription}
            >
              {isSubscriber ? <BsHeartFill /> : <BsHeart />}
            </Button>
          )}
        </Header>
        <p>{community.description}</p>
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
                <EmptyCard heading="Post">
                  <h3 className="text-slate-800 font-semibold text-sm">
                    No posts yet.
                  </h3>
                  <p className="text-xs">
                    {community.name} has not made any posts.
                  </p>
                </EmptyCard>
              )}
            </DashboardItem>

            {posts.recentPosts.length > 0 ? (
              <DashboardItem>
                <DashboardItemHeading heading="Recent Posts" />
                <div className="grid gap-4 grid-cols-3 mb-8">
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
        {/* <DashboardItem>
          {data.featuredPost ? (
            <React.Fragment>
              <DashboardItemHeading heading="Featured Post" />
              <div className="space-y-8 mb-8">
                {data.featuredPost ? (
                  <PostComponent
                    {...data.featuredPost}
                    isFeatured
                    isOwn={data.isOwn}
                  />
                ) : null}
              </div>
            </React.Fragment>
          ) : (
            <EmptyCard heading="Post">
              <h3 className="text-slate-800 font-semibold text-sm">
                No posts yet.
              </h3>
              <p className="text-xs">{data.name} has not made any posts.</p>
            </EmptyCard>
          )}
        </DashboardItem>

        {data.recentPosts.length > 0 ? (
          <DashboardItem>
            <DashboardItemHeading heading="Recent Posts" />
            <div className="grid gap-4 grid-cols-3 mb-8">
              {data.recentPosts.map((post) => (
                <PostComponent {...post} isCol isOwn={data.isOwn} />
              ))}
            </div>
          </DashboardItem>
        ) : null}
        {data.posts.length > 0 ? (
          <DashboardItem>
            <DashboardItemHeading heading="All Posts" />
            <div className="space-y-8">
              {data.posts.map((post) => (
                <PostComponent {...post} key={post.id} isOwn={data.isOwn} />
              ))}
            </div>
          </DashboardItem>
        ) : null}
        {data.unpublishedPosts.length > 0 ? (
          <DashboardItem>
            <DashboardItemHeading heading="Unpublished Posts" />
            <div className="space-y-8">
              {data.unpublishedPosts.map((post) => (
                <PostComponent {...post} key={post.id} isOwn={data.isOwn} />
              ))}
            </div>
          </DashboardItem>
        ) : null} */}
      </Layout>
    </React.Fragment>
  );
}

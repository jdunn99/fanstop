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
import { CommunityProfile } from "@/pages/api/communities/[communityId]";

interface ProfileComponentProps {
  slug: string;
  data?: CommunityProfile;
}

export function ProfileComponent({ data, slug }: ProfileComponentProps) {
  const { data: session } = useSession();

  const { mutate } = useSubscribeMutation(slug);

  const subscriptionIndex = React.useMemo(() => {
    if (data && session) {
      return data.subscribers.findIndex(
        ({ userId }) => userId === session?.user.id
      );
    }

    return -1;
  }, [data?.subscribers, session]);

  function handleSubscription() {
    mutate({
      isDeletion: subscriptionIndex !== -1,
      subscriptionId:
        subscriptionIndex !== -1
          ? data?.subscribers[subscriptionIndex].id
          : undefined,
    });
  }

  if (!data) return null;

  return (
    <React.Fragment>
      <Layout>
        <Header heading={data.name}>
          {data.isOwn ? (
            <Button>Edit Profile</Button>
          ) : (
            <Button
              variant={subscriptionIndex !== -1 ? "primary" : "ghost"}
              onClick={handleSubscription}
            >
              {subscriptionIndex !== -1 ? <BsHeartFill /> : <BsHeart />}
            </Button>
          )}
        </Header>
        <DashboardItem>
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
        ) : null}
      </Layout>
    </React.Fragment>
  );
}

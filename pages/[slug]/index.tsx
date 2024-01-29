import {
  DashboardItem,
  DashboardItemHeading,
  Header,
  Layout,
} from "@/components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { useCommunitiesByIDQuery } from "@/lib/queries/useCommunities";
import { PostComponent } from "@/components/posts/post-item";
import Button from "@/components/ui/button";
import { BsHeart } from "react-icons/bs";

export default function ProfilePage({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data } = useCommunitiesByIDQuery(slug);

  React.useEffect(() => {
    if (session && data) {
      if (session.user.id === data.creatorId) {
        router.push("/profile", undefined, { shallow: true });
      }
    }
  }, [session, data]);

  if (!data) return null;

  return (
    <React.Fragment>
      {session?.user.id === data.creatorId ? null : (
        <Layout>
          <Header heading={data.name}>
            <Button variant="ghost">
              <BsHeart />
            </Button>
          </Header>
          <DashboardItem>
            <DashboardItemHeading heading="Featured Post" />
            <div className="space-y-8 mb-8">
              {data.featuredPost ? (
                <PostComponent {...data.featuredPost} isFeatured />
              ) : null}
            </div>
          </DashboardItem>

          <DashboardItem>
            <DashboardItemHeading heading="Recent Posts" />
            <div className="grid gap-4 grid-cols-3 mb-8">
              {data.recentPosts.map((post) => (
                <PostComponent {...post} isCol />
              ))}
            </div>
          </DashboardItem>
          {data.posts.length > 0 ? (
            <DashboardItem>
              <DashboardItemHeading heading="All Posts" />
              <div className="space-y-8">
                {data.posts.map((post) => (
                  <PostComponent {...post} isOwn key={post.id} />
                ))}
              </div>
            </DashboardItem>
          ) : null}
        </Layout>
      )}
    </React.Fragment>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      slug: z.string().parse(query.slug),
    },
  };
}

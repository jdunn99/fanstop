import { Layout } from "@/components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { useCommunitiesByIDQuery } from "@/lib/queries/useCommunities";

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
        <Layout heading={data.name}>
          <div className="grid grid-cols-4 gap-4 w-full overflow-hidden"></div>
          <div className="space-y-4">
            {data.posts.map((post) => (
              <div key={post.id} className="flex">
                <div />
                <div className="space-y-2">
                  <h1 className="text-base font-semibold max-w-xs wrap text-slate-800">
                    {post.title}
                  </h1>
                  <p className="text-sm text-slate-600">{post.description}</p>
                </div>
              </div>
            ))}
          </div>
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

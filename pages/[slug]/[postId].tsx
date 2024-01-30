import { DashboardItem, Layout } from "@/components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { z } from "zod";
import { usePostQuery } from "@/lib/queries/usePostQuery";
import { EditorBlock } from "@/components/editor/editor-block";
import { Block } from "@/lib/useEditor";
import { addViewToPost } from "../api/posts/[postId]";
import { useSession } from "next-auth/react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { OwnPostMenu } from "@/components/posts/post-item";
import { PostCommentSection } from "@/components/posts/comments/post-comment-section";

export default function PostPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = usePostQuery(postId);
  const { data: session } = useSession();

  if (!data) return null;

  return (
    <Layout>
      <DashboardItem>
        <div className="grid w-full gap-2 py-4 px-8 border-b">
          <header className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4 bg-slate-50">
            <Breadcrumbs
              paths={[
                { href: "/", value: "Home" },
                {
                  href: `/${data.community.slug}`,
                  value: data.community.slug,
                },
                {
                  href: `/${data.community.slug}/${postId}`,
                  value: data.title,
                  disabled: true,
                },
              ]}
            />
            {session?.user.id === data.authorId ? (
              <OwnPostMenu id={postId} />
            ) : null}
          </header>
          <article className="prose px-0 mx-auto w-full max-w-screen-lg">
            <h1
              autoFocus
              className="w-full text-slate-900 text-5xl font-bold focus:outline-none mb-4"
            >
              {data.title} {!data.isPublished ? "(Unpublished)" : null}
            </h1>
            <p className="w-full resize-none font-semibold m-0">
              {data.description}
            </p>

            <div className="w-full ">
              {data.content
                ? (data.content as unknown as Block[]).map((block, index) => (
                    <EditorBlock
                      block={block}
                      key={index}
                      index={index}
                      isEditor={false}
                    />
                  ))
                : null}
            </div>
          </article>
        </div>
      </DashboardItem>
      {data.isPublished ? (
        <PostCommentSection
          session={session}
          postId={postId}
          views={data.views}
          likes={data.likes}
        />
      ) : (
        <p className="text-center text-xs text-slate-600 font-medium">
          Comments are only available on published posts
        </p>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const postId = z.string().parse(query.postId);

  await addViewToPost(postId);

  return {
    props: {
      postId,
    },
  };
}

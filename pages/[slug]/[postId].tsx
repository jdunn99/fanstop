import { DashboardItem, Layout } from "@/components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { z } from "zod";
import { usePostContentQuery, usePostQuery } from "@/lib/queries/usePostQuery";
import { EditorBlock } from "@/components/editor/editor-block";
// import { addViewToPost } from "../api/posts/[postId]";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { OwnPostMenu } from "@/components/posts/post-item";
import { PostCommentSection } from "@/components/posts/comments/post-comment-section";

export default function PostPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = usePostQuery(postId);
  const { data: content } = usePostContentQuery(postId);

  if (!data) return null;

  const { post, isAuthor, isSubscriber, isLiked } = data;

  return (
    <Layout>
      <DashboardItem>
        <div className="grid w-full gap-2 py-4 px-8 border-b">
          <header className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4 bg-slate-50">
            <Breadcrumbs
              paths={[
                { href: "/", value: "Home" },
                {
                  href: `/${post.author.community.slug}`,
                  value: post.author.community.slug,
                },
                {
                  href: `/${post.author.community.slug}/${postId}`,
                  value: post.title,
                  disabled: true,
                },
              ]}
            />
            {isAuthor ? <OwnPostMenu id={postId} /> : null}
          </header>
          <article className="prose px-0 mx-auto w-full max-w-screen-lg">
            <h1
              autoFocus
              className="w-full text-slate-900 text-5xl font-bold focus:outline-none mb-4"
            >
              {post.title} {!post.isPublished ? "(Unpublished)" : null}
            </h1>
            <p className="w-full resize-none font-semibold m-0">
              {post.description}
            </p>

            <div className="w-full ">
              {post.subscribersOnly && !isAuthor && !isSubscriber ? (
                <p className="text-center text-xs text-slate-600 font-medium">
                  This post is for subscribers only.
                </p>
              ) : typeof content !== "undefined" && content !== null ? (
                content.map((block, index) => (
                  <EditorBlock
                    block={block}
                    key={index}
                    index={index}
                    isEditor={false}
                  />
                ))
              ) : null}
            </div>
          </article>
        </div>
      </DashboardItem>
      {post.isPublished ? (
        post.commentsVisible ? (
          post.subscribersOnly && !isAuthor && !isSubscriber ? (
            <p className="text-xs text-slate-600 font-medium">
              Comments are avaiable for subscribers only.
            </p>
          ) : (
            <PostCommentSection
              postId={postId}
              views={post.views}
              likes={post._count.likes}
              isLiked={isLiked}
            />
          )
        ) : (
          <p className="text-center text-xs text-slate-600 font-medium">
            Comments are disabled for this post.
          </p>
        )
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

  // await addViewToPost(postId);

  return {
    props: {
      postId,
    },
  };
}

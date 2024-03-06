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
import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/container";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Content, LayoutPane } from "@/components/layout/content";
import { LayoutHeader } from "@/components/layout/header";

export default function PostPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = usePostQuery(postId);
  const { data: session } = useSession();
  const { data: content } = usePostContentQuery(postId);

  if (!data) return null;

  const { post, isAuthor, isSubscriber, isLiked } = data;
  const paths = [
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
  ];

  return (
    <Container>
      <Sidebar />
      <LayoutPane>
        <LayoutHeader paths={paths}></LayoutHeader>

        <div className="grid w-full gap-2 py-4  border-b">
          <header className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4 ">
            {isAuthor ? (
              <OwnPostMenu id={postId} isPublished={post.isPublished} />
            ) : null}
          </header>
          <article className="prose px-0 mx-auto w-full max-w-screen-lg dark:prose-invert">
            <h1
              autoFocus
              className="w-full  text-5xl font-bold focus:outline-none mb-4"
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
        {post.isPublished ? (
          post.commentsVisible ? (
            post.subscribersOnly && !isAuthor && !isSubscriber ? (
              <p className="text-xs text-slate-600 font-medium">
                Comments are avaiable for subscribers only.
              </p>
            ) : session !== null ? (
              <div id="comments">
                <PostCommentSection
                  postId={postId}
                  views={post.views}
                  likes={post._count.likes}
                  isLiked={isLiked}
                />
              </div>
            ) : (
              <p className="text-xs text-slate-600 font-medium text-center">
                You must be signed in to interact with this post.
              </p>
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
      </LayoutPane>
    </Container>
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

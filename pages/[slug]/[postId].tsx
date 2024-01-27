import {
  DashboardItem,
  DashboardItemHeading,
  Layout,
} from "@/components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { z } from "zod";
import { useCommunitiesByIDQuery } from "@/lib/queries/useCommunities";
import { usePostQuery } from "@/lib/queries/usePostQuery";
import { EditorBlock } from "@/components/editor/editor-block";
import Button from "@/components/ui/button";
import Link from "next/link";
import { title } from "process";
import { Block } from "@/lib/useEditor";
import { Avatar } from "@/components/ui/avatar";
import Textarea from "@/components/ui/textarea";
import { PostBar } from "@/components/posts/post-bar";
import { PostComment } from "@/components/posts/comments/post-comment";
import { useCreateCommentMutation } from "@/lib/mutations/useCreateCommentMutation";
import { CreateCommentArgs } from "../api/comment";
import { Comment } from "../api/posts/[postId]/comment";

export default function PostPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = usePostQuery(postId);

  const { data: comments } = useQuery<Comment[]>(["comments"], () =>
    fetch(`/api/posts/${postId}/comment`).then((res) => res.json())
  );
  const [comment, setComment] = React.useState<string>("");
  const { mutate } = useCreateCommentMutation();

  function onClick({ content, postId }: Partial<CreateCommentArgs>) {
    mutate({ authorId: "", content: content || "", postId: postId || "" });
  }

  if (!data) return null;

  return (
    <Layout heading={""}>
      <DashboardItem>
        <div className="grid w-full gap-2 py-4 px-8 border-b">
          <header className="sticky top-0 bg-white ">
            <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
              <Link href="/">Back</Link>
            </div>
          </header>
          <article className="prose px-0 mx-auto w-full max-w-screen-lg">
            <h1
              autoFocus
              className="w-full text-slate-900 text-5xl font-bold focus:outline-none mb-4"
            >
              {data.title}
            </h1>
            <p className="w-full resize-none font-semibold m-0">
              {data.description}
            </p>
            <div className="w-full ">
              {(data.content as unknown as Block[]).map((block, index) => (
                <EditorBlock
                  block={block}
                  key={index}
                  index={index}
                  isEditor={false}
                />
              ))}
            </div>
          </article>
        </div>
      </DashboardItem>
      <DashboardItem>
        <PostBar postId={postId} views={data.views} />
        <div className="w-full px-8">
          <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
          <div className="flex gap-2 mt-4 w-full">
            <Avatar />
            <Textarea
              placeholder="Comment"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setComment(e.target.value)
              }
              className="w-full"
            />
            <Button onClick={() => onClick({ postId, content: comment })}>
              Post
            </Button>
          </div>
        </div>
        {typeof comments !== "undefined"
          ? comments.map((comment) => (
              <PostComment {...comment} key={comment.id} />
            ))
          : null}
      </DashboardItem>
    </Layout>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { postId } = query;

  return {
    props: {
      postId: z.string().parse(postId),
    },
  };
}

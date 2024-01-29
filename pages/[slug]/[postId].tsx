import { DashboardItem, Layout } from "@/components/layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { z } from "zod";
import { usePostQuery } from "@/lib/queries/usePostQuery";
import { EditorBlock } from "@/components/editor/editor-block";
import Button from "@/components/ui/button";
import { Block } from "@/lib/useEditor";
import { Avatar } from "@/components/ui/avatar";
import Textarea from "@/components/ui/textarea";
import { PostBar } from "@/components/posts/post-bar";
import { PostComment } from "@/components/posts/comments/post-comment";
import { useCreateCommentMutation } from "@/lib/mutations/useCreateCommentMutation";
import { CreateCommentArgs } from "../api/comment";
import { Comment } from "../api/posts/[postId]/comment";
import { addViewToPost } from "../api/posts/[postId]";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast";

export default function PostPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = usePostQuery(postId);
  const { back } = useRouter();
  const { toast } = useToast();

  const { data: comments } = useQuery<Comment[]>(["comments", postId], () =>
    fetch(`/api/posts/${postId}/comment`).then((res) => res.json())
  );
  const [comment, setComment] = React.useState<string>("");
  const { data: session } = useSession();
  const { mutate } = useCreateCommentMutation();

  function onClick({ content, postId }: Partial<CreateCommentArgs>) {
    if (session === null) {
      toast({
        title: "Not signed in.",
        description: "You must be signed in to perform this action",
        variant: "error",
        timeout: 1000,
      });
    } else {
      mutate({ authorId: "", content: content || "", postId: postId || "" });
    }
  }

  if (!data) return null;

  return (
    <Layout>
      <DashboardItem>
        <div className="grid w-full gap-2 py-4 px-8 border-b">
          <header className="sticky top-0 bg-white ">
            <div className="max-w-screen-xl flex h-16 items-center mx-auto w-full justify-between py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={back}
                className="!p-0 !h-0"
              >
                Back
              </Button>
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
        <PostBar postId={postId} views={data.views} likes={data.likes} />
        <div className="w-full px-8">
          <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
          <div className="flex gap-2 mt-4 w-full">
            <Avatar />
            <Textarea
              placeholder="Comment"
              value={comment}
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
        <div className="pb-4">
          {typeof comments !== "undefined"
            ? comments.map((comment) => (
                <PostComment {...comment} key={comment.id} />
              ))
            : null}
        </div>
      </DashboardItem>
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

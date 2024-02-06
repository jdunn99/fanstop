import { Editor } from "@/components/editor/editor";
import {
  useEditingMutation,
  usePostContentQuery,
  usePostQuery,
} from "@/lib/queries/usePostQuery";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { z } from "zod";

export default function PostEditorPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: post, mutate } = useEditingMutation(postId);
  const { data } = usePostQuery(postId);
  const { data: content } = usePostContentQuery(postId);

  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isMounted) {
      mutate();
    }
    setIsMounted(true);
  }, [isMounted]);

  if (!data) return null;

  return <Editor {...data.post} content={content} />;
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      postId: z.string().parse(query.postId),
    },
  };
}

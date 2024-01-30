import { Editor } from "@/components/editor/editor";
import { useEditingMutation, usePostQuery } from "@/lib/queries/usePostQuery";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { z } from "zod";

export default function PostEditorPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: post, mutate } = useEditingMutation(postId);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isMounted) {
      mutate();
    }
    setIsMounted(true);
  }, [isMounted]);

  if (!post) return null;

  return <Editor {...post} />;
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  return {
    props: {
      postId: z.string().parse(query.postId),
    },
  };
}

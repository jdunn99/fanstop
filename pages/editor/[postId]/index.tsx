import { Editor } from "@/components/editor/editor";
import { usePostQuery } from "@/lib/queries/usePostQuery";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { z } from "zod";

export default function PostEditorPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: post } = usePostQuery(postId);

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

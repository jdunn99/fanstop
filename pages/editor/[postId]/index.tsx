import { Editor } from "@/components/editor/editor";
import { Post } from "@/pages/api/posts";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useQuery } from "react-query";
import { z } from "zod";

export function usePostQuery(id: string) {
    return useQuery<Post>(["post", id], () =>
        fetch(`/api/posts/${id}`).then((result) => result.json())
    );
}

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

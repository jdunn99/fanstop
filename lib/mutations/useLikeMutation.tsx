import { PostWithLikes } from "@/pages/api/posts";
import { useMutation, useQueryClient } from "react-query";

export function useLikeMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation(["likes", postId], {
    async mutationFn({
      isDeletion,
      likeId,
    }: {
      isDeletion: boolean;
      likeId?: string;
    }) {
      if (isDeletion) {
        return await fetch(`/api/likes/${likeId}`, { method: "DELETE" });
      } else {
        const like = await fetch("/api/like", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
          method: "POST",
        });
        return await like.json();
      }
    },
    onSuccess(data, { isDeletion, likeId }) {
      queryClient.setQueryData(["post", postId], (oldData) => {
        const temp = oldData as unknown as PostWithLikes;
        if (isDeletion) {
          temp.likes = temp.likes.filter((like) => like.id !== likeId);
        } else {
          temp.likes = [...temp.likes, data];
        }

        return temp;
      });
    },
  });
}

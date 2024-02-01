import { useMutation, useQueryClient } from "react-query";
import { PostResponse } from "../api/validators";

export function useLikeMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation(["likes", postId], {
    async mutationFn({ isDeletion }: { isDeletion: boolean }) {
      if (isDeletion) {
        return await fetch(`/api/posts/${postId}/likes`, { method: "DELETE" });
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
    onSuccess(data, { isDeletion }) {
      queryClient.setQueryData(["post", postId], (oldData) => {
        const temp = oldData as unknown as PostResponse;
        if (isDeletion) {
          temp.isLiked = false;
          temp.post._count.likes--;
        } else {
          temp.isLiked = true;
          temp.post._count.likes++;
        }

        return temp;
      });
    },
  });
}

import { useMutation, useQueryClient } from "react-query";
import { Comment } from "../api/validators";

export function useDeleteCommentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation(["comment", id], {
    async mutationFn({ postId }: { postId: string }) {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess(data, { postId }) {
      queryClient.setQueryData(["comments", postId], (oldData) => {
        const temp = oldData as unknown as Comment[];
        return temp.filter(({ id: commentId }) => commentId !== id);
      });
    },
  });
}

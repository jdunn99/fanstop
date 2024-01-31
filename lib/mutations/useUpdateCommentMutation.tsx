import { Comment } from "@/lib/api/validators";
import { useMutation, useQueryClient } from "react-query";

export function useUpdateCommentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation(["comment", id], {
    async mutationFn({ content }: { content: string; postId: string }) {
      const comment = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });
      return await comment.json();
    },
    onSuccess(data, { postId, content }) {
      queryClient.setQueryData(["comments", postId], (oldData) => {
        const temp = oldData as unknown as Comment[];
        const index = temp.findIndex((item) => item.id === id);

        const { content, updatedAt } = data as unknown as Comment;

        if (index !== -1) {
          temp[index] = {
            ...temp[index],
            content,
            updatedAt,
          };
        }
        return temp;
      });
    },
  });
}

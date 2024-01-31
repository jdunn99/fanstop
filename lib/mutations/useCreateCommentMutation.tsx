import { useMutation, useQueryClient } from "react-query";
import { CreateCommentArgs } from "../api/validators";

export function useCreateCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation("comment", {
    mutationFn: async ({ userId, content, postId }: CreateCommentArgs) => {
      const result = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content, postId }),
      });

      return result.json();
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData(["comments", variables.postId], (oldData) => {
        return [data, ...(oldData as unknown as Comment[])];
      });
    },
  });
}

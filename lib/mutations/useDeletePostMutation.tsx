import { useMutation, useQueryClient } from "react-query";

export function useDeletePostMutation(postId: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation(
    ["post", postId],
    () => fetch(`/api/posts/${postId}`, { method: "DELETE" }),
    {
      onSuccess() {
        queryClient.setQueryData;
      },
    }
  );
}

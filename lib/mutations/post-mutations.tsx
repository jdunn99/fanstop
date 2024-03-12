import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { PaginationResponse } from "../pagination";
import { PostResponse } from "../api/validators";

function useUpdatePostMutation() {}

function useDeletePostMutation(postId: string, slug: string) {
  const queryClient = useQueryClient();

  return useMutation(
    ["post", postId],
    () =>
      fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(["community-posts", slug]);
      },
    }
  );
}

export { useDeletePostMutation };

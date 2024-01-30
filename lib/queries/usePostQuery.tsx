import { PostWithLikes } from "@/pages/api/posts";
import { useMutation, useQuery, useQueryClient } from "react-query";

export function getPostFromCache(id: string) {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<PostWithLikes>(["post", id]);
}

export function usePostQuery(id: string) {
  return useQuery<PostWithLikes>(["post", id], () =>
    fetch(`/api/posts/${id}`).then((result) => result.json())
  );
}

export function useEditingMutation(id: string) {
  return useMutation<PostWithLikes>(["post", id], () =>
    fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isPublished: false,
      }),
    }).then((res) => res.json())
  );
}

// import { PostWithLikes } from "@/pages/api/posts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  CommunityPosts,
  PostContent,
  PostItem,
  PostResponse,
} from "../api/validators";

export function getPostFromCache(id: string) {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<any>(["post", id]);
}

export function usePostQuery(id: string) {
  return useQuery<PostResponse>(["post", id], () =>
    fetch(`/api/posts/${id}`).then((result) => result.json())
  );
}

export function usePostContentQuery(id: string) {
  return useQuery<PostContent[] | null>(["post-content", id], () =>
    fetch(`/api/posts/${id}/content`).then((res) => res.json())
  );
}

export function usePostsForCommunity(id: string) {
  return useQuery<CommunityPosts>(["community-posts", id], () =>
    fetch(`/api/communities/${id}/posts`).then((result) => result.json())
  );
}

export function useEditingMutation(id: string) {
  return useMutation<any>(["post", id], () =>
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

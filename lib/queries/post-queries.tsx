import { useQuery } from "react-query";
import { PostItem, PostResponse } from "../api/validators";
import { usePaginatedQuery } from "./paginated-query";
import { useSession } from "next-auth/react";

function usePostQuery(id: string) {}

function usePostsForCommunity(slug: string) {
  return usePaginatedQuery<PostResponse[]>(
    ["community-posts", slug],
    `/communities/${slug}/posts`
  );
}

function usePopularPostsQuery() {
  return useQuery<PostResponse[]>(["popular-posts"], () =>
    fetch("/api/posts/popular").then((res) => res.json())
  );
}

function useFeedQuery() {
  const { data: session } = useSession();

  return usePaginatedQuery<PostResponse[]>(["feed"], "/user/feed", {
    enabled: session !== null,
  });
}

export {
  usePostQuery,
  usePostsForCommunity,
  usePopularPostsQuery,
  useFeedQuery,
};

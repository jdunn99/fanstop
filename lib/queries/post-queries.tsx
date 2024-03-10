import { useQuery } from "react-query";
import { PostItem, PostResponse } from "../api/validators";
import { usePaginatedQuery } from "./paginated-query";
import { useSession } from "next-auth/react";

function usePostQuery(id: string) {
  return useQuery<PostResponse>(["post", id], () =>
    fetch(`/api/posts/${id}`).then((res) => res.json())
  );
}

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

function usePostsForAuthedUserQuery() {
  const { data: session } = useSession();
  return usePaginatedQuery<PostResponse[]>(
    ["community-posts", session?.user.slug],
    `/communities/${session?.user.slug}/posts`,
    {
      enabled: session !== null && typeof session !== "undefined",
    }
  );
}

export {
  usePostQuery,
  usePostsForCommunity,
  usePopularPostsQuery,
  useFeedQuery,
  usePostsForAuthedUserQuery,
};

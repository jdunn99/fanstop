import { PostItem, PostResponse } from "../api/validators";
import { usePaginatedQuery } from "./paginated-query";

function usePostQuery(id: string) {}

function usePostsForCommunity(slug: string) {
  return usePaginatedQuery<PostResponse[]>(
    ["community-posts", slug],
    `/communities/${slug}/posts`
  );
}

export { usePostQuery, usePostsForCommunity };

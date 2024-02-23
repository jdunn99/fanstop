import { useInfiniteQuery, useQuery } from "react-query";
import { Comment } from "@/lib/api/validators";
import { PaginationResponse } from "../pagination";

export function useCommentForPostQuery(postId: string, cursor?: number) {
  return useInfiniteQuery<PaginationResponse<Comment[]>>({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam }) => {
      const query =
        typeof pageParam !== "undefined" ? `?cursor=${pageParam}` : "";
      const res = await fetch(`/api/posts/${postId}/comments${query}`);
      return await res.json();
    },
    getNextPageParam: ({ cursor }) => {
      return cursor;
    },
  });
}

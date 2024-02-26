import { Comment } from "@/lib/api/validators";
import { usePaginatedQuery } from "./paginated-query";

/**
 * Gets the comments for a Post
 * @param postId - The ID of the post we are fetching the comments for
 * @returns - Paginated list of comments
 */
function useCommentsForPostQuery(postId: string) {
  return usePaginatedQuery<Comment[]>(
    ["comments", postId],
    `posts/${postId}/comments`
  );
}

export { useCommentsForPostQuery };

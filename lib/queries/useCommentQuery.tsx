import { Comment } from "@/pages/api/posts/[postId]/comment";
import { useQuery } from "react-query";

export function useCommentForPostQuery(postId: string) {
  return useQuery<Comment[]>(["comments", postId], () =>
    fetch(`/api/posts/${postId}/comment`).then((res) => res.json())
  );
}

import { useQuery } from "react-query";
import { Comment } from "@/lib/api/validators";

export function useCommentForPostQuery(postId: string) {
  return useQuery<Comment[]>(["comments", postId], () =>
    fetch(`/api/posts/${postId}/comments`).then((res) => res.json())
  );
}

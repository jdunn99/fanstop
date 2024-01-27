import { CreateCommentArgs } from "@/pages/api/comment";
import { useMutation } from "react-query";

export function useCreateCommentMutation() {
  return useMutation("comment", {
    mutationFn: async ({ authorId, content, postId }: CreateCommentArgs) => {
      await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId, content, postId }),
      });
    },
  });
}

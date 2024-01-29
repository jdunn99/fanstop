import { useToast } from "@/components/ui/toast";
import { CreateCommentArgs } from "@/pages/api/comment";
import { Post } from "@/pages/api/posts";
import { useMutation, useQueryClient } from "react-query";

export function useCreateCommentMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation("comment", {
    mutationFn: async ({ authorId, content, postId }: CreateCommentArgs) => {
      const result = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId, content, postId }),
      });

      return result.json();
    },
    onSuccess(data, variables, context) {
      queryClient.setQueryData(["comments", variables.postId], (oldData) => {
        return [data, ...(oldData as unknown as Comment[])];
      });
      toast({
        title: "Comment Created",
        description: "Comment successfully created!",
        variant: "success",
      });
    },
  });
}

import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { CreateCommentArgs, Comment } from "../api/validators";
import { PaginationResponse } from "../pagination";

function useCreateCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation("comment", {
    mutationFn: async ({ userId, content, postId }: CreateCommentArgs) => {
      const result = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content, postId }),
      });

      return result.json();
    },
    onSuccess(data, variables) {
      console.log(variables);
      queryClient.setQueryData(
        ["comments", variables.postId],
        (oldData: unknown) => {
          const temp = oldData as InfiniteData<PaginationResponse<Comment[]>>;
          temp.pages[0].response.unshift(data);

          return temp;
        }
      );
    },
  });
}

function useDeleteCommentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation(["comment", id], {
    async mutationFn(_: { postId: string }) {
      const result = await fetch(`/api/comment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ content: "" }),
      });

      return await result.json();
    },
    onSuccess(_, { postId }) {
      queryClient.invalidateQueries(["comments", postId]);
    },
  });
}

function useUpdateCommentMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation(["comment", id], {
    async mutationFn({ content }: { content: string; postId: string }) {
      const comment = await fetch(`/api/comment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });
      return await comment.json();
    },
    onSuccess(data, { postId }) {
      queryClient.setQueryData(["comments", postId], (oldData: unknown) => {
        const temp = oldData as InfiniteData<PaginationResponse<Comment[]>>;
        for (const page of temp.pages) {
          for (const response of page.response) {
            if (response.id === id) {
              const { content, updatedAt } = data satisfies Comment;
              response.content = content;
              response.updatedAt = updatedAt;
              return temp;
            }
          }
        }

        return temp;
      });
    },
  });
}

export {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
};

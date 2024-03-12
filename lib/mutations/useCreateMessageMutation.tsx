import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { Conversation, Message } from "../api/validators";
import { PaginationResponse } from "../pagination";

export function useCreateMessageMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    ["messages", id],
    async (content: string) => {
      const result = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ content, conversationId: id }),
      });

      return (await result.json()) as unknown as Message;
    },
    {
      onSuccess(data, variables, context) {
        queryClient.setQueryData(["messages", id], (oldData) => {
          const temp = oldData as unknown as InfiniteData<
            PaginationResponse<Message[]>
          >;
          const page = temp.pages[temp.pages.length - 1];
          page.response.unshift(data);

          return temp;
        });

        queryClient.setQueryData(["conversations"], (oldData) => {
          const temp = oldData as unknown as InfiniteData<
            PaginationResponse<Conversation[]>
          >;

          for (const page of temp.pages) {
            for (const conversation of page.response) {
              if (conversation.id === id) {
                conversation.messages[0] = {
                  content: data.content,
                  createdAt: data.createdAt,
                };
                return temp;
              }
            }
          }

          return temp;
        });
      },
    }
  );
}

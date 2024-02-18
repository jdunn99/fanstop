import { useMutation, useQueryClient } from "react-query";
import { Conversation, Message } from "../api/validators";

export function useCreateMessageMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation(
    ["messages", id],
    async (content: string) => {
      const result = await fetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      return (await result.json()) as unknown as Message;
    },
    {
      onSuccess(data, variables, context) {
        queryClient.setQueryData(["messages", id], (oldData) => {
          const temp = oldData as unknown as Message[];
          temp.unshift(data);

          return temp;
        });

        queryClient.setQueryData(["conversations"], (oldData) => {
          const temp = oldData as unknown as Conversation[];
          const index = temp.findIndex((id) => id);

          if (index === -1) {
            return temp;
          }

          temp[index].messages[0] = {
            content: data.content,
            createdAt: data.createdAt,
          };

          return temp;
        });
      },
    }
  );
}

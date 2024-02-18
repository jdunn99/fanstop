import { useMutation, useQueryClient } from "react-query";
import { Message } from "../api/validators";

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
          temp.push(data);

          return temp;
        });
      },
    }
  );
}

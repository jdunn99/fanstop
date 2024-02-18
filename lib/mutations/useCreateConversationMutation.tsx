import { useMutation, useQueryClient } from "react-query";
import { Conversation } from "../api/validators";

export function useCreateConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    ["conversations"],
    (userIds: string[]) =>
      fetch("/api/user/conversations", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      }).then((res) => res.json()),
    {
      onSuccess(data, variables, context) {
        queryClient.setQueryData(["conversations"], (oldData) => {
          const temp = oldData as unknown as Conversation[];
          temp.push(data);
          return temp;
        });
      },
    }
  );
}

import { useMutation } from "react-query";

export function useCreateConversationMutation() {
  return useMutation(["conversations"], (userIds: string[]) =>
    fetch("/api/user/conversations", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userIds }),
    }).then((res) => res.json())
  );
}

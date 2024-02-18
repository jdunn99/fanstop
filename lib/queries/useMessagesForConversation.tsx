import { useQuery } from "react-query";
import { Message } from "../api/validators";

export function useMessagesForConversation(conversationId: string) {
  return useQuery<Message[]>(["messages", conversationId], () =>
    fetch(`/api/conversations/${conversationId}/messages`).then((res) =>
      res.json()
    )
  );
}

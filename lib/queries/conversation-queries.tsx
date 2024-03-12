import { useSession } from "next-auth/react";
import { usePaginatedQuery } from "./paginated-query";
import { Conversation, Message } from "../api/validators";

function useConversationsForUserQuery() {
  return usePaginatedQuery<Conversation[]>(
    ["conversations"],
    "/user/conversations"
  );
}

function useMessagesForConversation(conversationId: string) {
  return usePaginatedQuery<Message[]>(
    ["messages", conversationId],
    `/conversations/${conversationId}/messages`
  );
}

export { useConversationsForUserQuery, useMessagesForConversation };

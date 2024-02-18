import { useQuery } from "react-query";
import { Conversation } from "../api/validators";

export function useConversationQuery() {
  return useQuery<Conversation[]>("conversations", () =>
    fetch("/api/user/conversations").then((res) => res.json())
  );
}

import { useQuery } from "react-query";
import { Conversation } from "../api/validators";

export function useConversationByIDQuery(id: string) {
  return useQuery<Conversation>(["conversation", id], () =>
    fetch(`/api/conversations/${id}`).then((res) => res.json())
  );
}

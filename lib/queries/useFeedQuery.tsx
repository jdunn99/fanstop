import { useQuery } from "react-query";
import { FeedItem } from "../api/validators";

export function useFeedQuery() {
  return useQuery<FeedItem>("feed", () =>
    fetch("/api/user/feed").then((res) => res.json())
  );
}

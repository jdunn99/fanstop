import { FeedItem, PostItem } from "@/pages/api/user/feed";
import { useQuery } from "react-query";

export function useFeedQuery() {
  return useQuery<FeedItem>("feed", () =>
    fetch("/api/user/feed").then((res) => res.json())
  );
}

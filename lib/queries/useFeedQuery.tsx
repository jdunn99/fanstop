import { PostItem } from "@/pages/api/user/feed";
import { useQuery } from "react-query";

export function useFeedQuery() {
  return useQuery<PostItem[]>("feed", () =>
    fetch("/api/user/feed").then((res) => res.json())
  );
}

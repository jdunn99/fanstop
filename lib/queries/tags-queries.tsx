import { useQuery } from "react-query";
import { Tag } from "../api/validators";

function useTagsQuery() {
  return useQuery<Tag[]>([
    "tags",
    () => fetch("/api/tags").then((res) => res.json()),
  ]);
}

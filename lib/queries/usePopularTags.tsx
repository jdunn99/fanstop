import { useQuery } from "react-query";
import { Tag } from "../api/validators";

export function usePopularTags(limit = 4) {
  return useQuery<Tag[]>("tags", () =>
    fetch(`/api/tags`).then((result) => result.json())
  );
}

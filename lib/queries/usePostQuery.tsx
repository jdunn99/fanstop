import { Post } from "@prisma/client";
import { useQuery } from "react-query";

export function usePostQuery(id: string) {
  return useQuery<Post>(["post", id], () =>
    fetch(`/api/posts/${id}`).then((result) => result.json())
  );
}

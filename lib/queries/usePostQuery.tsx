import { PostWithLikes } from "@/pages/api/posts";
import { useQuery } from "react-query";

export function usePostQuery(id: string) {
  return useQuery<PostWithLikes>(["post", id], () =>
    fetch(`/api/posts/${id}`).then((result) => result.json())
  );
}

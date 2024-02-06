import { useMutation } from "react-query";
import { CreateCommunityArgs } from "../api/validators";

export function useCreateCommunityMutation() {
  return useMutation("community", {
    mutationFn: async ({
      name,
      slug,
      tags,
      description,
    }: Partial<CreateCommunityArgs>) => {
      fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, tags, description }),
      }).then((res) => res.json());
    },
  });
}

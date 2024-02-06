import { useMutation } from "react-query";
import { CreateCommunityArgs } from "../api/validators";

export function useUpdateCommunityMutation() {
  return useMutation("community", {
    mutationFn: async ({
      id,
      name,
      slug,
      description,
    }: Partial<CreateCommunityArgs> & { id: string }) => {
      fetch(`/api/communities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      }).then((res) => res.json());
    },
  });
}

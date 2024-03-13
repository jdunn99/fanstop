import { useMutation } from "react-query";
import { CreateCommunityArgs } from "../api/validators";
import { ImageState } from "@/components/image-input";

export function useUpdateCommunityMutation() {
  return useMutation("community", {
    mutationFn: async ({
      id,
      ...rest
    }: Partial<CreateCommunityArgs> & { id: string; image?: string }) => {
      const result = await fetch(`/api/communities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });

      return await result.json();
    },
  });
}

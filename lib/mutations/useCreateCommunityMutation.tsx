import { useMutation } from "react-query";
import { CreateCommunityArgs } from "../api/validators";
import { FileImage, uploadImage } from "../file";
import { ImageState } from "@/components/image-input";

export function useCreateCommunityMutation() {
  return useMutation("community", {
    mutationFn: async (
      args: Partial<CreateCommunityArgs> & {
        img?: string;
      }
    ) => {
      const result = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });

      return await result.json();
    },
  });
}

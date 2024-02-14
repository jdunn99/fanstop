import { useMutation } from "react-query";
import { CreateCommunityArgs } from "../api/validators";
import { getImage } from "./useCreateCommunityMutation";
import { FileImage } from "../file";

export function useUpdateCommunityMutation() {
  return useMutation("community", {
    mutationFn: async ({
      id,
      img,
      ...rest
    }: Partial<CreateCommunityArgs> & { id: string; img?: FileImage }) => {
      const image = await getImage(img);

      console.log(rest);
      const result = await fetch(`/api/communities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, ...rest }),
      });

      return await result.json();
    },
  });
}

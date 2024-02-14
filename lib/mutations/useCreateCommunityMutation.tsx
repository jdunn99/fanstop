import { useMutation } from "react-query";
import { CreateCommunityArgs } from "../api/validators";
import { FileImage, uploadImage } from "../file";

export async function getImage(image: FileImage | undefined) {
  if (image) {
    if (image.formData) {
      return await uploadImage(image.formData);
    } else {
      return image.src;
    }
  }

  return undefined;
}

export function useCreateCommunityMutation() {
  return useMutation("community", {
    mutationFn: async ({
      img,
      ...rest
    }: Partial<CreateCommunityArgs> & {
      img?: {
        formData?: FormData;
        src: string;
      };
    }) => {
      const image = await getImage(img);

      const result = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, ...rest }),
      });

      return await result.json();
    },
  });
}

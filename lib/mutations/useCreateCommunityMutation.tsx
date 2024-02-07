import { useMutation } from "react-query";
import { CreateCommunityArgs } from "../api/validators";
import { uploadImage } from "../file";

export function useCreateCommunityMutation() {
  return useMutation("community", {
    mutationFn: async ({
      name,
      slug,
      tags,
      description,
      img,
    }: Partial<CreateCommunityArgs> & {
      img?: {
        formData?: FormData;
        src: string;
      };
    }) => {
      let image: string | undefined = undefined;
      console.log(img);

      if (img) {
        if (img.formData) {
          image = await uploadImage(img.formData);
        } else {
          image = img.src;
        }
      }

      console.log(image);

      const result = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, tags, description, image }),
      });

      return await result.json();
    },
  });
}

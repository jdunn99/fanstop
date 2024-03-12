import { ImageState } from "@/components/image-input";
import { uploadImage } from "./file";

export async function parseImageState(img?: ImageState) {
  let image: string | undefined = undefined;

  if (img) {
    if (img.formData) {
      image = await uploadImage(img.formData);
    } else {
      image = img.src as string;
    }
  }

  return image;
}

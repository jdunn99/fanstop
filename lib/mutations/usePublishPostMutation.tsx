import { PostWithLikes } from "@/pages/api/posts";
import { useMutation } from "react-query";
import { EditorState } from "../useEditor";

interface PostPublishProps {
  title: string;
  description: string;
  editorState: EditorState;
}

export async function uploadImage(formData: FormData) {
  const result = await fetch(
    "https://api.cloudinary.com/v1_1/dw7064r1g/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const json = await result.json();

  return json["secure_url"];
}

export function usePublishPostMutation(id: string) {
  return useMutation(["post", id], {
    async mutationFn({ title, description, editorState }: PostPublishProps) {
      const content = await Promise.all(
        editorState.blocks.map(async (block) => {
          const temp = { ...block };
          if (temp.tag === "img" && temp.data.formData) {
            temp.data.src = await uploadImage(temp.data.formData!);
            temp.data.formData = undefined;
          }

          return temp;
        })
      );

      const result = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
          image: content[0].tag === "img" ? content[0].data.src : undefined,
          isPublished: false,
        }),
      });

      return await result.json();
    },
  });
}

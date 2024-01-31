import { useMutation, useQueryClient } from "react-query";
import { uploadImage } from "../file";
import { EditorState } from "../useEditor";

interface PostSaveProps {
  title: string;
  description: string;
  editorState: EditorState;
}

export function useSavePostMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation(["post", id], {
    async mutationFn({ title, description, editorState }: PostSaveProps) {
      console.log("Processing content");
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

      const body = {
        title,
        description,
        content,
        image: content[0].tag === "img" ? content[0].data.src : undefined,
        isPublished: false,
      };

      console.log("Fetching");
      const result = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      return await result.json();
    },
  });
}

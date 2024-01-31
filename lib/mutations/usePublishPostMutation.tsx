import { useMutation, useQueryClient } from "react-query";
import { uploadImage } from "../file";
import { Block } from "../useEditor";

interface PostPublishProps {
  title: string;
  description: string;
  img?: {
    formData?: FormData;
    src: string;
  };
  postContent: Block[];
  subscribersOnly: boolean;
  commentsVisible: boolean;
}

export function usePublishPostMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    ["post", id],
    async ({
      title,
      description,
      img,
      postContent,
      commentsVisible,
      subscribersOnly,
    }: PostPublishProps) => {
      let image: string | undefined = undefined;

      if (img) {
        if (img.formData) {
          image = await uploadImage(img.formData);
        } else {
          image = img.src;
        }
      }

      // now set the cover image as the first element
      let content = postContent;

      if (content[0] && content[0].tag === "img") {
        content[0] = {
          ...content[0],
          data: {
            src: image,
          },
        };
      } else {
        content = [
          {
            id: new Date().toString(),
            data: {
              src: image,
            },
            tag: "img",
          },
          ...content,
        ];
      }

      const result = await fetch(`/api/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image,
          content,
          commentsVisible,
          subscribersOnly,
          isPublished: true,
        }),
        method: "PUT",
      });

      return await result.json();
    },
    {
      onSuccess(data) {
        queryClient.setQueryData(["post-content", id], (oldData) => {
          return data.content;
        });
      },
    }
  );
}

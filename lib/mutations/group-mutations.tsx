import { ImageState } from "@/components/image-input";
import { useMutation } from "react-query";
import { parseImageState } from "../parseImageState";

interface CreateGroupProps {
  image?: ImageState;
  name: string;
  description: string;
}
function useCreateGroupMutation() {
  return useMutation(
    ["create-group"],
    async ({ image, name, description }: CreateGroupProps) => {
      const img = await parseImageState(image);
      const result = await fetch("/api/groups", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          image: img,
          name,
          description,
        }),
      });

      return await result.json();
    }
  );
}

function useDeleteGroupMutation() {
  return useMutation(["delete-group"], (id: string) =>
    fetch(`/api/groups/${id}`, {
      method: "DELETE",
    }).then((res) => res.json())
  );
}

export { useCreateGroupMutation, useDeleteGroupMutation };
